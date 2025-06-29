const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fse = require("fs-extra"); // install with npm install fs-extra
const fs = require("fs");
const { TEMPLATE_IMAGES } = require("./config/starter");
const docker = require("./init/docker");
const dockerEvents = require("./event/eventEmitter");
const { eventObj } = require("./constant/event");
const userContainers = {};
const uid = process.getuid ? process.getuid() : 1000;
const gid = process.getgid ? process.getgid() : 1000;

function getWorkspacePath(userId, template) {
  try {
    const workspaceRoot = path.join(__dirname, "..", "user_workspaces");
    const userDir = path.join(workspaceRoot, `user-${userId}`);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    if (fs.readdirSync(userDir).length === 0) {
      const starterTemplate = path.join(
        __dirname,
        "..",
        "starter_templates",
        template
      );
      fse.copySync(starterTemplate, userDir, {
        overwrite: true,
        errorOnExist: false,
      });
    }
    return userDir;
  } catch (error) {
    throw new Error(error);
  }
}

// In createUserContainer(userId, template):
async function createUserContainer(userId, template) {
  try {
    const templateConf =
      TEMPLATE_IMAGES[template] || TEMPLATE_IMAGES["react-starter"];
    const terminalCommand = TEMPLATE_IMAGES[template]?.command;
    const containerName = `user-${userId}-${template}-${uuidv4().slice(0, 8)}`;

    // Pick random host port for app
    const appPort = templateConf.port + Math.floor(Math.random() * 1000);
    const codeServerPort = 8000 + Math.floor(Math.random() * 1000);

    const workspacePath = getWorkspacePath(userId, template);

    const container = await docker.createContainer({
      Image: `${templateConf.image}:latest`,
      name: containerName,
      Tty: true,
      User: `${uid}:${gid}`, // 👈 important part
      HostConfig: {
        RestartPolicy: {
          Name: "always", // 👈 important part
        },
        Binds: [`${workspacePath}:/workspace`],
        PortBindings: {
          [`${templateConf.port}/tcp`]: [{ HostPort: appPort.toString() }],
          "8080/tcp": [{ HostPort: codeServerPort.toString() }],
        },
      },
      ExposedPorts: { [`${templateConf.port}/tcp`]: {}, "8080/tcp": {} },
      Cmd: [
        "/bin/bash",
        "-c",
        // 1. Fix permissions
        "chown -R node:node /workspace && " +
          // 2. Start code-server in background
          "code-server --auth none --bind-addr 0.0.0.0:8080 /workspace & " +
          // 3. Then your terminal command in background
          `${terminalCommand} & ` +
          // 4. Wait on both
          "wait",
      ],
    });
    await container.start();
    dockerEvents.emit(eventObj.CLEANUP_CONTAINER_MAX_6, {});
    return {
      containerId: container.id,
      [templateConf.key]: appPort,
      template,
      userId,
      codeServerPort,
      containerName,
      workspacePath,
    };
  } catch (error) {
    throw new Error(error?.message);
  }
}

async function cleanupInactiveContainers(containers, thresholdMs) {
  const now = Date.now();
  for (const [userId, info] of Object.entries(containers)) {
    if (now - info.lastActive > thresholdMs) {
      try {
        const container = docker.getContainer(info.containerId);
        await container.stop();
        await container.remove({ v: true });
        // Optionally: delete workspace folder on disk
        // fs.rmdirSync(info.workspacePath, { recursive: true });

        // Optionally: Remove user workspace folder
        // Find user folder by container name
        const userName = container.Names[0]
          .split("/")[1]
          .split("-")
          .slice(0, 3)
          .join("-");
        const workspacePath = path.join(
          __dirname,
          "..",
          "user_workspaces",
          userName
        );
        if (fs.existsSync(workspacePath)) {
          fs.rmSync(workspacePath, { recursive: true, force: true });
        }
        delete containers[userId];
        console.log(`Cleaned up container for user ${userId}`);
      } catch (error) {
        throw new Error(error?.message);
      }
    }
  }
}

async function removeAllContainer(removed) {
  // List all containers (including stopped)
  const containers = await docker.listContainers({ all: true });
  for (const containerInfo of containers) {
    // Filter by your naming convention, e.g., name starts with 'user-'
    if (containerInfo.Names.some((n) => n.includes("user-"))) {
      const container = docker.getContainer(containerInfo.Id);
      try {
        await container.stop().catch(() => {});
        await container.remove({ v: true });
        removed.push(containerInfo.Id);

        // Optionally: Remove user workspace folder
        // Find user folder by container name
        const userName = containerInfo.Names[0]
          .split("/")[1]
          .split("-")
          .slice(0, 3)
          .join("-");
        const workspacePath = path.join(
          __dirname,
          "..",
          "user_workspaces",
          userName
        );
        if (fs.existsSync(workspacePath)) {
          fs.rmSync(workspacePath, { recursive: true, force: true });
        }
      } catch (e) {
        throw new Error(error?.message);
      }
    }
  }
}

async function removeContainerById(containers, containerId, userId) {
  try {
    const container = docker.getContainer(containerId);
    if (!container) {
      throw new Error("Container did not exist!");
    }
    await container.stop().catch(() => {});
    await container.remove({ v: true });

    // @delete container mapping userId
    delete containers[userId];
    // unlink files

    userId = `user-${userId}`;
    const workspacePath = path.join(__dirname, "..", "user_workspaces", userId);
    if (fs.existsSync(workspacePath)) {
      fs.rmSync(workspacePath, { recursive: true, force: true });
    }
  } catch (error) {
    throw new Error(error?.message);
  }
}

async function runDockerApplicationWithLogs({ containerId, args, cmd }) {
  try {
    const container = docker.getContainer(containerId);
    const exec = await container.exec({
      Cmd: [cmd, ...args],
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
      WorkingDir: "/workspace",
    });
    await exec.start({ hijack: true, stdin: false });
  } catch (error) {
    throw new Error(error?.message);
  }
}

function getUserContainers() {
  return userContainers;
}

module.exports = {
  createUserContainer,
  cleanupInactiveContainers,
  getUserContainers,
  removeAllContainer,
  removeContainerById,
  runDockerApplicationWithLogs,
};
