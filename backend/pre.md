// function getWorkspacePath(userId) {
//   const workspaceRoot = path.join(__dirname, '..', 'user_workspaces');
//   const userDir = path.join(workspaceRoot, `user-${userId}`);
//   if (!fs.existsSync(userDir)) {
//     fs.mkdirSync(userDir, { recursive: true });
//   }
//   // Copy starter template if empty
//   if (fs.readdirSync(userDir).length === 0) {
//     const starterTemplate = path.join(__dirname, '.', 'my-vite-template');
//     fse.copySync(starterTemplate, userDir, { overwrite: false, errorOnExist: false });
//   }
//   return userDir;
// }