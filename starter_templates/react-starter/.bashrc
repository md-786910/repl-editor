if [ ! -f .dev-app-started ]; then
  touch .dev-app-started
  npm install
  npm run dev -- --host 0.0.0.0
fi