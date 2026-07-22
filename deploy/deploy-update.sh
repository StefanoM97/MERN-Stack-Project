#!/usr/bin/env bash
set -Eeuo pipefail

LIVE_DIR="${LIVE_DIR:-/var/www/reusehub}"
STAGING_DIR="${STAGING_DIR:-/var/www/reusehub-next}"
BACKUP_DIR="${BACKUP_DIR:-/var/www/reusehub-previous}"
FAILED_DIR="${FAILED_DIR:-/var/www/reusehub-failed}"
DIRECT_HEALTH_URL="${DIRECT_HEALTH_URL:-http://127.0.0.1:5000/api/health}"
PROXY_HEALTH_URL="${PROXY_HEALTH_URL:-http://127.0.0.1:8080/api/health}"
PM2_APP_NAME="${PM2_APP_NAME:-reusehub-api}"

promoted=0

log() {
  printf '[deploy] %s\n' "$*"
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    printf '[deploy] Missing required command: %s\n' "$1" >&2
    exit 1
  }
}

health_is_production() {
  local url="$1"

  curl --fail --silent --show-error --max-time 5 "$url" |
    node -e '
      let input = "";
      process.stdin.on("data", (chunk) => { input += chunk; });
      process.stdin.on("end", () => {
        try {
          const data = JSON.parse(input);
          if (data.status !== "ok" || data.environment !== "production") {
            process.exit(1);
          }
        } catch {
          process.exit(1);
        }
      });
    '
}

wait_for_health() {
  local url="$1"
  local label="$2"

  for attempt in $(seq 1 30); do
    if health_is_production "$url"; then
      log "$label health check passed."
      return 0
    fi

    log "$label health check attempt $attempt/30 failed; retrying."
    sleep 2
  done

  return 1
}

rollback() {
  local exit_code=$?
  trap - ERR

  if [[ "$promoted" -eq 1 ]]; then
    log "Deployment failed after promotion; restoring previous release."

    rm -rf "$FAILED_DIR"
    if [[ -d "$LIVE_DIR" ]]; then
      mv "$LIVE_DIR" "$FAILED_DIR"
    fi

    if [[ -d "$BACKUP_DIR" ]]; then
      mv "$BACKUP_DIR" "$LIVE_DIR"
    fi

    if [[ -d "$LIVE_DIR" ]]; then
      pm2 startOrReload "$LIVE_DIR/deploy/ecosystem.config.cjs" \
        --env production \
        --update-env || true
      pm2 save || true
    fi

    apache2ctl configtest && systemctl reload apache2 || true
  fi

  exit "$exit_code"
}

trap rollback ERR

if [[ "$EUID" -ne 0 ]]; then
  printf '[deploy] This deployment must run as root because the active Apache and PM2 setup is root-owned.\n' >&2
  exit 1
fi

for command in node npm curl pm2 apache2ctl systemctl; do
  require_command "$command"
done

if [[ ! -d "$STAGING_DIR" ]]; then
  printf '[deploy] Staging directory does not exist: %s\n' "$STAGING_DIR" >&2
  exit 1
fi

if [[ ! -f "$STAGING_DIR/server/package-lock.json" ]] ||
   [[ ! -f "$STAGING_DIR/client/package-lock.json" ]] ||
   [[ ! -f "$STAGING_DIR/deploy/ecosystem.config.cjs" ]]; then
  printf '[deploy] Staging directory is missing required repository files.\n' >&2
  exit 1
fi

if [[ ! -f "$LIVE_DIR/server/.env" ]]; then
  printf '[deploy] Protected production environment file is missing: %s/server/.env\n' "$LIVE_DIR" >&2
  exit 1
fi

log "Copying the protected production environment into the staged release."
install -m 600 -o root -g root \
  "$LIVE_DIR/server/.env" \
  "$STAGING_DIR/server/.env"

log "Installing production server dependencies."
npm --prefix "$STAGING_DIR/server" ci --omit=dev

log "Installing client build dependencies."
npm --prefix "$STAGING_DIR/client" ci

log "Building the React production bundle."
npm --prefix "$STAGING_DIR/client" run build

if [[ ! -f "$STAGING_DIR/client/dist/index.html" ]]; then
  printf '[deploy] Client build did not create client/dist/index.html.\n' >&2
  exit 1
fi

log "Removing client build dependencies from the staged release."
rm -rf "$STAGING_DIR/client/node_modules"

log "Validating Apache before promotion."
apache2ctl configtest

log "Promoting the staged release."
rm -rf "$BACKUP_DIR" "$FAILED_DIR"
mv "$LIVE_DIR" "$BACKUP_DIR"
mv "$STAGING_DIR" "$LIVE_DIR"
promoted=1

log "Starting or reloading the PM2 application in production mode."
pm2 startOrReload "$LIVE_DIR/deploy/ecosystem.config.cjs" \
  --env production \
  --update-env
pm2 save

log "Reloading Apache."
apache2ctl configtest
systemctl reload apache2

wait_for_health "$DIRECT_HEALTH_URL" "Direct API"
wait_for_health "$PROXY_HEALTH_URL" "Apache-proxied API"

log "Deployment passed all health checks."
rm -rf "$BACKUP_DIR" "$FAILED_DIR"
promoted=0
trap - ERR

log "ReuseHub deployment updated successfully."
