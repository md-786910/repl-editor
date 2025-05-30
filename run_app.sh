#!/bin/bash
set -e

# Define directories
ROOT_DIR="$(pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

"$NPM_BIN" install -g pm2 

# Define binaries
NODE_BIN="$(which node)"
NPM_BIN="$(which npm)"
PM2_BIN="$(which pm2)"

echo "🚀 Starting deployment script..."

# Step 1: Install backend dependencies
echo "📦 Installing backend dependencies..."
cd "$BACKEND_DIR" || exit 1
"$NPM_BIN" install

# Step 2: Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd "$FRONTEND_DIR" || exit 1
"$NPM_BIN" install

# Step 3: Build the frontend using Vite
echo "🛠️  Building frontend..."
"$NPM_BIN" run build

# Step 4: Start backend with PM2
echo "🔁 Starting backend with PM2..."
cd "$BACKEND_DIR" || exit 1
"$PM2_BIN" start index.js --name "backend" -f

# Step 5: Serve frontend using PM2 + serve
echo "🌐 Starting frontend server..."
"$NPM_BIN" install -g serve  # Ensure 'serve' is available
"$PM2_BIN" serve "$FRONTEND_DIR/dist" 3016 --name "frontend" --spa

# Step 6: Save and configure PM2 to restart on reboot
"$PM2_BIN" save
"$PM2_BIN" startup | bash

echo "✅ Deployment complete and running!"
