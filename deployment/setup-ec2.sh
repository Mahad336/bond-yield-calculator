#!/bin/bash
# Run this script on EC2 after copying deploy package
set -e

# Resolve script dir early (before any cd)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== Bond Calculator EC2 Setup ==="

# Install Node.js 20 if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Create app directory
sudo mkdir -p /var/www/bond-calculator
sudo chown -R $USER:$USER /var/www/bond-calculator

# Copy files (run from directory containing backend/, frontend/, etc.)
BACKEND_DIR="$(pwd)/backend"
FRONTEND_DIST="$(pwd)/frontend/dist"

if [ ! -d "$BACKEND_DIR" ]; then
    echo "Error: Run from project root. Expected backend/"
    exit 1
fi
if [ ! -d "$FRONTEND_DIST" ]; then
    echo "Error: Build frontend first: cd frontend && VITE_API_URL= npm run build"
    exit 1
fi

# Copy frontend build
cp -r "$FRONTEND_DIST" /var/www/bond-calculator/frontend

# Copy backend and install deps (dist/ from local build)
cp -r "$BACKEND_DIR" /var/www/bond-calculator/backend
cd /var/www/bond-calculator/backend
npm install --omit=dev

# Install nginx config
sudo cp "$SCRIPT_DIR/nginx.conf" /etc/nginx/sites-available/bond-calculator
sudo ln -sf /etc/nginx/sites-available/bond-calculator /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Start backend with pm2
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi
if command -v pm2 &> /dev/null; then
    pm2 delete bond-backend 2>/dev/null || true
    NODE_ENV=production pm2 start dist/src/main.js --name bond-backend
    pm2 save
    pm2 startup | tail -1 | sudo bash
fi

echo "=== Done! App should be at http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4) ==="
