#!/usr/bin/env bash
set -euo pipefail

sudo apt update
sudo apt install -y nginx git curl ufw build-essential

curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2

sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
sudo ufw --force enable

sudo mkdir -p /var/www/reusehub
sudo chown -R "$USER":"$USER" /var/www/reusehub

echo "Base packages installed. Clone ReuseHub into /var/www/reusehub next."
