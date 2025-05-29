const Docker = require("dockerode");

let dockerInstance = null;

function getDockerInstance() {
  if (!dockerInstance) {
    dockerInstance = new Docker(); // You can pass options here if needed
  }
  return dockerInstance;
}

const docker =  getDockerInstance();
module.exports = docker;
