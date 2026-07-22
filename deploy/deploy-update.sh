#!/usr/bin/env bash
set -euo pipefail

cd /var/www/reusehub
git pull --ff-only
npm --prefix server ci
npm --prefix client ci
npm --prefix client run build
pm2 startOrReload deploy/ecosystem.config.cjs --env production
pm2 save
sudo nginx -t
sudo systemctl reload nginx

echo "ReuseHub deployment updated."
