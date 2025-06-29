// At the top:
exports.TEMPLATE_IMAGES = {
  "react-starter": {
    image: "react-starter", // your vite react image
    port: 5173,
    key: "vitePort",
    command: "npm install && echo '__DONE__' && npm run dev",
  },
  "node-starter": {
    image: "node-starter", // your node starter image
    port: 5100,
    key: "nodePort",
    command:
      "npm install && npm install -D nodemon && echo '__DONE__' && npm run dev",
  },
  "html-starter": {
    image: "html-starter", // your html server image (e.g. nginx or serve)
    port: 5500,
    key: "htmlPort",
    command:
      "npm install && npm install -D serve && echo '__DONE__'&& npx serve -l 5500",
  },
};

exports.COMMAND = {
  "react-starter": ["npm", ["run", "dev"]],
  "node-starter": ["npm", ["start"]],
  "html-starter": ["npx", ["serve", "-l", "5500"]],
};
