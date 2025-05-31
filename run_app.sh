#!/bin/bash

# Define directories
ROOT_DIR="$(pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

# Define binaries
NODE_BIN="$(which node)"
NPM_BIN="$(which npm)"

echo "🚀 Starting development script..."

# Step 1: Install concurrently if not already
if ! "$NPM_BIN" list -g concurrently > /dev/null 2>&1; then
  echo "📦 Installing concurrently globally..."
  "$NPM_BIN" install -g concurrently
fi

# Step 2: Install backend dependencies
echo "📦 Installing backend dependencies..."
cd "$BACKEND_DIR" || exit 1
"$NPM_BIN" install

# Step 3: Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd "$FRONTEND_DIR" || exit 1
"$NPM_BIN" install

# Step 4: Start both frontend and backend in dev mode concurrently
echo "🚀 Starting both frontend and backend in dev mode..."

concurrently \
  "cd $BACKEND_DIR && $NPM_BIN run dev" \
  "cd $FRONTEND_DIR && $NPM_BIN run dev"

