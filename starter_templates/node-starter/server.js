const express = require("express");
const app = express();
const PORT = process.env.PORT || 5100;

app.get("/", (req, res) => {
  res.send(`
    <h1>Hello from Node.js Starter!</h1>
    <p>Your server is working 🎉</p>
  `);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
