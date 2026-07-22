# Windows 11 to DigitalOcean: ReuseHub Implementation and Deployment Guide

**Last updated:** July 15, 2026
**Current validated deployment:** Ubuntu 24.04, Apache, PM2, MongoDB Atlas, and a React production build

## Read this first

This guide separates two deployment paths:

1. **The current validated deployment**, which reuses an existing Apache/LAMP droplet and exposes
   ReuseHub on port 8080.
2. **The recommended production upgrade**, which adds a domain, HTTPS, secure cookies, production
   integrations, and a non-root deployment workflow.

The repository also contains Nginx-oriented scripts. Do **not** run
`deploy/bootstrap-ubuntu.sh` or `deploy/deploy-update.sh` unchanged on the current Apache/LAMP
droplet. Those scripts install or reload Nginx and are intended for a fresh Nginx-based server.

Never paste passwords, Atlas connection strings, JWT secrets, API credentials, or private SSH keys
into documentation, screenshots, chat messages, Git commits, or terminal logs.

## Current validated architecture

```text
Existing LAMP application
  -> Apache :80

ReuseHub
  -> Apache :8080
     -> /var/www/reusehub/client/dist
     -> /api/ proxied to http://127.0.0.1:5000/api/
        -> PM2 process: reusehub-api
           -> Express
              -> MongoDB Atlas
```

Verified state:

- Ubuntu 24.04 droplet
- Node.js 22.23.1
- npm 10.9.8
- PM2 process `reusehub-api`
- Express bound to `127.0.0.1:5000`
- Apache virtual host listening on port 8080
- Existing LAMP site preserved on port 80
- MongoDB Atlas persistence
- PM2 startup restoration after reboot
- Core desktop and mobile workflows tested
- 7 automated suites and 18 tests passing
- TypeScript/Vite production build passing

The current deployment is suitable for prototype demonstration, but it is still using HTTP and
development-mode application settings.

# Part I — Prepare and test on Windows 11

## 1. Install local tools

Install:

- Git for Windows
- Node.js 22 LTS
- VS Code
- OpenSSH Client
- WinSCP, optional but useful for server file management

Verify in PowerShell:

```powershell
node --version
npm --version
git --version
ssh -V
```

## 2. Clone the existing repository

Use the existing GitHub repository rather than running `git init` in a copied project folder:

```powershell
git clone https://github.com/CameronKinnear/MERN-Stack-Project.git
Set-Location .\MERN-Stack-Project
```

For feature work:

```powershell
git switch main
git pull --ff-only
git switch -c feature/descriptive-branch-name
```

## 3. Create environment files

```powershell
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

Edit `server\.env` locally. Use a real value only in the untracked `.env` file:

```dotenv
NODE_ENV=development
PORT=5000
APP_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
MONGODB_URI=<paste-your-MongoDB-Atlas-connection-string-here>
JWT_SECRET=<paste-a-long-random-development-secret-here>
JWT_EXPIRES_IN=7d
COOKIE_NAME=reusehub_token
COOKIE_SECURE=false
```

Client:

```dotenv
VITE_API_BASE=/api
VITE_GOOGLE_CLIENT_ID=
```

Generate a random JWT secret in PowerShell:

```powershell
$bytes = New-Object byte[] 48
[Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToHexString($bytes)
```

## 4. Configure MongoDB Atlas

1. Create an Atlas project and cluster.
2. Create a dedicated database user with a unique password.
3. Add only the Windows computer's current public IP for local testing.
4. Obtain the Node.js connection string.
5. Select or append the database name `reusehub`.
6. Paste the complete connection string only into `server\.env`.

Do not commit the connection string. Rotate the database password immediately if it is exposed.

## 5. Install dependencies reproducibly

From the repository root:

```powershell
npm ci
npm --prefix server ci
npm --prefix client ci
```

## 6. Validate locally

```powershell
npm run check
```

This performs:

- Server lint
- Client lint
- Jest/Supertest tests
- MongoDB Memory Server tests
- TypeScript compilation
- Vite production build

The first integration-test run may download a MongoDB test binary. The tests use a temporary
database and must never be pointed at an Atlas database containing data that must be retained.

Start local development:

```powershell
npm run dev
```

Open:

- `http://localhost:5173`
- `http://localhost:5000/api/health`

When SMTP is blank, verification and reset links use the development preview behavior.

## 7. Optional local service credentials

The following integrations are implemented but optional for basic prototype testing:

```dotenv
GOOGLE_CLIENT_ID=
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
EBAY_CLIENT_ID=
EBAY_CLIENT_SECRET=
EBAY_MARKETPLACE_ID=EBAY_US
YOUTUBE_API_KEY=
```

Set the Google client ID in both server and client environment files. Restart Vite after changing a
client environment value.

# Part II — Safe Git workflow

## 8. Review changes before committing

```powershell
git status --short --branch
git diff --check
git check-ignore -v server\.env
git check-ignore -v client\.env
```

Confirm these never appear as tracked changes:

- `.env`
- `node_modules`
- `dist`
- `coverage`
- log files
- private keys or certificates

Use a branch and pull request rather than committing directly to `main` when possible:

```powershell
git add <reviewed-files>
git commit -m "Describe the completed change"
git push -u origin feature/descriptive-branch-name
```

After the push, confirm the GitHub Actions CI workflow passes before merging.

# Part III — Reproduce the current Apache deployment

## 9. Protect the existing server

Before changing an existing LAMP droplet:

- Confirm SSH access.
- Confirm which service owns ports 80 and 443.
- Back up the existing Apache configuration.
- Do not remove the default LAMP site unless that change is intentional.
- Do not enable UFW blindly; verify SSH and all required web ports first.
- Do not install Nginx on top of the existing Apache deployment.

Useful inspection commands:

```bash
sudo ss -lntp
sudo apache2ctl -S
sudo apache2ctl configtest
sudo systemctl status apache2
```

## 10. Install the required runtime without replacing Apache

On Ubuntu 24.04:

```bash
sudo apt update
sudo apt install -y git curl build-essential
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

Verify:

```bash
node --version
npm --version
git --version
pm2 --version
apache2 -v
```

## 11. Create a deployment user for the production upgrade

The validated prototype was assembled under `root`, but routine production deployment should use a
least-privilege account:

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo mkdir -p /var/www/reusehub
sudo chown -R deploy:deploy /var/www/reusehub
```

Configure SSH keys for `deploy` before disabling or restricting root login.

## 12. Clone the repository

For a fresh deployment directory:

```bash
sudo -u deploy git clone   https://github.com/CameronKinnear/MERN-Stack-Project.git   /var/www/reusehub

cd /var/www/reusehub
sudo -u deploy cp server/.env.example server/.env
sudo -u deploy cp client/.env.example client/.env
```

If `/var/www/reusehub` already contains the working prototype, do not clone over it. Back up
`server/.env`, clone into a new release directory, validate it, and switch paths only after the new
release passes its health checks.

## 13. Configure the current HTTP prototype

Server environment:

```dotenv
NODE_ENV=development
PORT=5000
APP_URL=http://YOUR_DROPLET_IP:8080
ALLOWED_ORIGINS=http://YOUR_DROPLET_IP:8080,http://localhost:5173
MONGODB_URI=<paste-your-MongoDB-Atlas-connection-string-here>
JWT_SECRET=<paste-a-long-random-server-secret-here>
JWT_EXPIRES_IN=7d
COOKIE_NAME=reusehub_token
COOKIE_SECURE=false
```

Client:

```dotenv
VITE_API_BASE=/api
VITE_GOOGLE_CLIENT_ID=
```

Atlas:

- Add the droplet's public IP as a `/32` network entry.
- Use a dedicated database user.
- Remove obsolete or overly broad IP entries.
- Rotate credentials if they are displayed publicly.

Protect the environment file:

```bash
sudo chown root:root /var/www/reusehub/server/.env
sudo chmod 600 /var/www/reusehub/server/.env
```

If the deployment user must manage the file, use an appropriate deployment group rather than making
the file world-readable.

## 14. Install, test, and build

```bash
cd /var/www/reusehub

npm ci --ignore-scripts --no-audit --no-fund
npm --prefix server ci --ignore-scripts --no-audit --no-fund
npm --prefix client ci --ignore-scripts --no-audit --no-fund

MONGOMS_DOWNLOAD_DIR=/var/cache/reusehub-mongodb-binaries npm run check
```

If the cache directory does not exist:

```bash
sudo mkdir -p /var/cache/reusehub-mongodb-binaries
sudo chown deploy:deploy /var/cache/reusehub-mongodb-binaries
```

The `--ignore-scripts` option avoids package lifecycle scripts during installation. MongoDB Memory
Server can download its test binary when the test suite runs.

## 15. Start the Express API with PM2

The server should listen only on the loopback interface in the deployed environment.

From the server directory:

```bash
cd /var/www/reusehub/server
pm2 start src/server.js   --name reusehub-api   --cwd /var/www/reusehub/server
pm2 save
pm2 startup
```

Run the exact startup command printed by PM2, then save again:

```bash
pm2 save
pm2 status
curl -s http://127.0.0.1:5000/api/health
```

Do not expose port 5000 through a cloud firewall or public listener. Apache is the public entry
point.

## 16. Configure Apache on port 8080

Enable the required modules:

```bash
sudo a2enmod proxy proxy_http rewrite headers
```

Ensure Apache listens on 8080 by adding this line to `/etc/apache2/ports.conf` if it is not already
present:

```apache
Listen 8080
```

Create `/etc/apache2/sites-available/reusehub.conf`:

```apache
<VirtualHost *:8080>
    ServerName YOUR_DROPLET_IP

    DocumentRoot /var/www/reusehub/client/dist

    <Directory /var/www/reusehub/client/dist>
        Options -Indexes
        AllowOverride None
        Require all granted

        RewriteEngine On
        RewriteCond %{REQUEST_URI} !^/api/
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^ /index.html [L]
    </Directory>

    ProxyPreserveHost On
    ProxyPass        /api/ http://127.0.0.1:5000/api/
    ProxyPassReverse /api/ http://127.0.0.1:5000/api/

    RequestHeader set X-Forwarded-Proto "http"

    ErrorLog ${APACHE_LOG_DIR}/reusehub-error.log
    CustomLog ${APACHE_LOG_DIR}/reusehub-access.log combined
</VirtualHost>
```

Enable and validate:

```bash
sudo a2ensite reusehub.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Do not disable the existing port-80 site.

If UFW is already active:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 8080/tcp
sudo ufw status
```

If a DigitalOcean Cloud Firewall is attached, permit TCP 8080 for the prototype. A production
domain should later use ports 80 and 443 instead.

## 17. Smoke-test the deployment

Direct API:

```bash
curl -s http://127.0.0.1:5000/api/health
```

Proxied API:

```bash
curl -s http://127.0.0.1:8080/api/health
```

Public frontend:

```text
http://YOUR_DROPLET_IP:8080
```

Verify:

- Existing LAMP site still responds on port 80
- ReuseHub loads on port 8080
- Registration and verification
- Login and logout
- Inventory CRUD
- Private, school, and public visibility
- Contact privacy
- Interest check and saved history
- Password reset
- Mobile layout at 390 px and 320 px

## 18. Verify reboot persistence

```bash
pm2 save
sudo reboot
```

After reconnecting:

```bash
pm2 status
sudo systemctl status apache2
curl -s http://127.0.0.1:5000/api/health
curl -s http://127.0.0.1:8080/api/health
```

Confirm Atlas data still exists and the existing LAMP site still responds.

# Part IV — Upgrade to a production deployment

## 19. Add a domain and HTTPS

A domain allows Apache name-based virtual hosting so the existing LAMP site and ReuseHub can coexist
on ports 80 and 443.

Create DNS records:

- `A` record for the chosen ReuseHub hostname to the droplet IPv4 address
- Optional `AAAA` record only if IPv6 is correctly configured

Install Certbot for Apache:

```bash
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d reusehub.YOUR_DOMAIN
sudo certbot renew --dry-run
```

Move ReuseHub from the temporary IP-and-port URL to the HTTPS hostname, and restrict the virtual host
to that hostname.

## 20. Change to production environment values

```dotenv
NODE_ENV=production
PORT=5000
APP_URL=https://reusehub.YOUR_DOMAIN
ALLOWED_ORIGINS=https://reusehub.YOUR_DOMAIN
MONGODB_URI=<paste-your-MongoDB-Atlas-connection-string-here>
JWT_SECRET=<paste-a-new-production-only-secret-here>
COOKIE_SECURE=true
```

Rebuild and restart:

```bash
cd /var/www/reusehub
npm --prefix client run build
pm2 restart reusehub-api --update-env
pm2 save
```

Confirm the cookie is secure and authentication works only through HTTPS.

## 21. Configure production services

Configure and validate:

- SMTP sender and delivery
- Google web client origins
- eBay Browse API credentials
- YouTube Data API key and quota restrictions

Do not place service credentials in client code. eBay, YouTube, SMTP, Atlas, and JWT credentials
belong only in the server environment.

## 22. Production hardening

Before treating the deployment as production-ready:

- Use a non-root PM2 service
- Restrict SSH
- Enable a reviewed firewall policy
- Add log rotation
- Add uptime monitoring and alerting
- Back up MongoDB Atlas
- Document rollback and restore procedures
- Run Lighthouse and accessibility checks
- Add browser end-to-end tests
- Test multiple browsers and physical devices
- Review rate limits and abuse controls

# Part V — Updates and GitHub Actions

## 23. Manual Apache update procedure

Because the included `deploy/deploy-update.sh` currently validates and reloads Nginx, do not use it
unchanged on the Apache droplet.

For a reviewed manual update:

```bash
cd /var/www/reusehub
git fetch origin
git pull --ff-only
npm ci --ignore-scripts --no-audit --no-fund
npm --prefix server ci --ignore-scripts --no-audit --no-fund
npm --prefix client ci --ignore-scripts --no-audit --no-fund
MONGOMS_DOWNLOAD_DIR=/var/cache/reusehub-mongodb-binaries npm run check
pm2 restart reusehub-api --update-env
pm2 save
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Use a release directory or backup before major updates so the previous build can be restored.

## 24. GitHub Actions CI

The CI workflow is ready to run after the branch is pushed. Confirm that it completes:

- Root `npm ci`
- Server `npm ci`
- Client `npm ci`
- Lint
- Tests
- Production build

Do not merge a failing workflow.

## 25. GitHub Actions deployment

The current deployment workflow calls `deploy/deploy-update.sh`, which is Nginx-oriented. Keep the
workflow disabled or manual until one of these actions is taken:

- Update the script to validate and reload Apache, or
- Move ReuseHub to a fresh Nginx-based server

Required SSH secrets must be stored in GitHub repository secrets, never committed.

# Troubleshooting

## Apache configuration fails

```bash
sudo apache2ctl configtest
sudo apache2ctl -S
sudo journalctl -u apache2 --since "15 minutes ago"
```

## API process is unavailable

```bash
pm2 status
pm2 logs reusehub-api --lines 100
curl -v http://127.0.0.1:5000/api/health
```

## React routes return 404

Confirm the Apache rewrite rules send non-file, non-API requests to `/index.html`.

## Browser API calls fail

Check:

- `VITE_API_BASE=/api`
- Apache `ProxyPass` and `ProxyPassReverse`
- `APP_URL`
- `ALLOWED_ORIGINS`
- Browser developer tools
- Apache and PM2 logs

## Atlas connection fails

Check:

- Droplet IP access entry
- Database user permissions
- Connection string in the untracked `server/.env`
- Special-character encoding in the database password
- Atlas cluster status

Do not print the connection string while troubleshooting.

## PM2 does not return after reboot

```bash
pm2 startup
pm2 save
systemctl status pm2-$USER
```

Run the exact startup command generated by PM2 for the account that owns the process.

# Final deployment checklist

## Prototype deployment

- [x] Existing Apache/LAMP site preserved
- [x] ReuseHub available through Apache on port 8080
- [x] Express restricted to loopback
- [x] PM2 process online
- [x] PM2 reboot restoration verified
- [x] MongoDB Atlas persistence verified
- [x] Automated tests and production build pass
- [x] Core workflows and mobile widths manually tested

## Remaining production work

- [ ] Push and merge the tested Git branch
- [ ] Confirm remote GitHub Actions CI
- [ ] Add a domain and HTTPS
- [ ] Enable secure cookies and production mode
- [ ] Configure SMTP
- [ ] Configure Google Sign-In
- [ ] Configure live eBay and YouTube credentials
- [ ] Convert routine deployment to a non-root account
- [ ] Adapt deployment scripts and workflow for Apache
- [ ] Add monitoring, backups, and rollback procedures
