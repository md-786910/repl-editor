const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const cron = require("node-cron");
const cors = require("cors");

const {
  createUserContainer,
  cleanupInactiveContainers,
  getUserContainers,
  removeAllContainer,
  removeContainerById,
  runDockerApplicationWithLogs,
} = require("./docker");
const { attachToContainerShell, attachLogsWS } = require("./terminal");
const { COMMAND } = require("./config/starter");

const app = express();
const router = express.Router();
app.use(
  cors({
    origin: true,
  })
);

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const userContainers = getUserContainers();

app.get("/", (req, res) => {
  res.send("API initialized");
});

app.use("/api", router);

router.post("/init", async (req, res) => {
  const { userId, template } = req.body;
  if (!userId || !template)
    return res.status(400).json({ error: "Missing userId or template" });
  if (userContainers[userId]) {
    userContainers[userId].lastActive = Date.now();
    return res.json(userContainers[userId]);
  }
  try {
    const info = await createUserContainer(userId, template);
    userContainers[userId] = { ...info, lastActive: Date.now() };
    res.status(201).json(userContainers[userId]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/cleanup-container", async (req, res) => {
  try {
    let removed = [];
    await removeAllContainer(removed);
    res.json({ removed, message: `${removed?.length} containers removed` });
  } catch (e) {
    console.log({ e });
    res.status(500).json({ error: e.message });
  }
});

router.post("/remove-container-by-id", async (req, res) => {
  try {
    const { containerId, userId } = req.body;
    if (!containerId) {
      return res.status(404).json({ message: "container id not found" });
    }
    await removeContainerById(userContainers, containerId, userId);
    res.status(200).json({
      message: "container removed successfully",
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Start app process in user container via Docker exec
router.post("/app-start", async (req, res) => {
  const { template, containerId } = req.body;
  const [cmd, args] = COMMAND[template] || COMMAND["react-starter"];
  try {
    await runDockerApplicationWithLogs({ containerId, args, cmd });
    res.status(200).json({ message: "started" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

cron.schedule("0 * * * *", async () => {
  await cleanupInactiveContainers(userContainers, 10 * 24 * 60 * 60 * 1000);
});

const server = http.createServer(app);
// attachToContainerShellz(server, userContainers);
attachLogsWS(server, userContainers);
server.listen(4000, () =>
  console.log("API + WS running on http://localhost:4000")
);
