const docker = require("./init/docker");

const WebSocket = require("ws");
function attachToContainerShell(server, userContainers) {
  const wss = new WebSocket.Server({ server, path: "/ws/terminal" });

  wss.on("connection", async function connection(ws, req) {
    const params = new URLSearchParams(req.url.split("?")[1]);
    const userId = params.get("userId");
    if (!userId || !userContainers[userId]) {
      ws.close();
      return;
    }
    try {
      const container = docker.getContainer(userContainers[userId].containerId);
      const exec = await container.exec({
        Cmd: ["/bin/bash"],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      });
      const stream = await exec.start({ hijack: true, stdin: true });

      stream.on("data", (chunk) => {
        ws.send(chunk);
      });

      ws.on("message", (msg) => {
        stream.write(msg);
      });

      ws.on("close", () => {
        stream.end();
      });
    } catch (e) {
      ws.close();
    }
  });
}
let status = false;
function attachLogsWS(server, userContainers) {
  const wss = new WebSocket.Server({ server, path: "/ws/logs" });
  status = true; // Set status to true when the logs WebSocket is initialized
  wss.on("connection", async (ws, req) => {
    const params = new URLSearchParams(req.url.split("?")[1]);
    const userId = params.get("userId");
    if (!userId || !userContainers[userId]) return ws.close();
    try {
      const container = docker.getContainer(userContainers[userId].containerId);
      // Get running process logs, or tail container logs
      const logStream = await container.logs({
        follow: true,
        stdout: true,
        stderr: true,
        since: 0,
      });
      logStream.on("data", (chunk) => {
        const logLine = chunk.toString();
        ws.send(
          JSON.stringify({
            log: logLine,
            status,
            message: "installing dependencies...",
          })
        );
        // Detect install completion
        if (logLine.includes("__DONE__")) {
          status = false;
          ws.send(
            JSON.stringify({
              log: "setup completed",
              status: false,
              message: "installation done",
            })
          );
        }
      });
      ws.on("close", () => {
        ws.send(
          JSON.stringify({
            log: "connection destroy",
            status: false,
            message: "connection destroy",
          })
        );
        logStream.destroy();
        status = false;
      });
    } catch {
      ws.send(
        JSON.stringify({
          log: "close",
          status: false,
          message: "close",
        })
      );
      ws.close();
      status = false;
    }
  });
}

module.exports = { attachToContainerShell, attachLogsWS };
