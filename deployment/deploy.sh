#!/bin/bash
# Run from project root - builds and prepares for EC2 deploy
set -e

echo "=== Building Bond Calculator for deployment ==="

# Build frontend (empty API URL = same-origin via nginx proxy)
cd frontend
VITE_API_URL= npm run build
cd ..

# Build backend
cd backend
npm run build
cd ..

echo "=== Build complete ==="
echo "Next: Copy backend/, frontend/, deployment/ to EC2 and run deployment/setup-ec2.sh"
echo ""
echo "  scp -i YOUR_KEY.pem -r backend frontend deployment ubuntu@EC2_IP:~/"
echo "  ssh -i YOUR_KEY.pem ubuntu@EC2_IP"
echo "  mkdir -p bond-calculator && cp -r backend frontend deployment bond-calculator/ && cd bond-calculator"
echo "  bash deployment/setup-ec2.sh"
