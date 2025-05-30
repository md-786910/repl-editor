const EventEmitter = require("events");
const { eventObj } = require("../constant/event");
const docker = require("../init/docker");
const { TEMPLATE_IMAGES } = require("../config/starter");
class DockerEventEmitter extends EventEmitter {
  constructor() {
    super();
  }
 
}
const dockerEvents = new DockerEventEmitter();

dockerEvents.on(eventObj.CLEANUP_CONTAINER_MAX_6, async () => {
  const targetImages = Object.values(TEMPLATE_IMAGES).map((t) => t.image);
  const containers = await docker.listContainers({
    all: true,
    filters: {
      ancestor: targetImages,
    },
  });

  if (containers?.length > 10) {
    for (const containerInfo of containers) {
      const container = docker.getContainer(containerInfo.Id);
      const name = containerInfo.Names[0] || containerInfo.Id;

      try {
        if (containerInfo.State === "running") {
          console.log(`🛑 Stopping container: ${name}`);
          await container.stop();
        }

        console.log(`🗑️ Removing container: ${name}`);
        await container.remove();
      } catch (err) {
        console.error(`⚠️ Error on ${name}:`, err.message);
      }
    }
  }
});

module.exports = dockerEvents;
