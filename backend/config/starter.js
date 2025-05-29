// At the top:
exports.TEMPLATE_IMAGES = {
  "react-starter": {
    image: "react-starter", // your vite react image
    port: 5173,
    key: "vitePort",
    command:"npm install && npm run dev"
  },
  "node-starter": {
    image: "express-starter", // your node starter image
    port: 3001,
    key: "nodePort",
    command:"npm install && npm install -D nodemon && npm run dev"
  },
  "html-starter": {
    image: "html-starter", // your html server image (e.g. nginx or serve)
    port: 8000,
    key: "htmlPort",
    command:"npm install serve && npx serve -l 8000"
  }
};

exports.COMMAND = {
    'react-starter': ['npm', ['run', 'dev']],
    'node-starter': ['npm', ['start']],
    'html-starter': ['npx', ['serve','-l', '8000']],
  };
