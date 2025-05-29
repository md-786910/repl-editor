sudo chown -R $USER:$USER ./user_workspaces

&& npm install && npm run dev -- --host 0.0.0.0

& npm start

& serve -l 8000