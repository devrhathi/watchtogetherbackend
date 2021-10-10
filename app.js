const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const { v4: uuidv4 } = require("uuid");

let currentUUID = 0;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server Is Running...");
});

app.get("/create-room", (req, res) => {
  currentUUID = uuidv4();
  res.send(currentUUID);
});

io.on("connection", (socket) => {
  console.log("connected user");
});

httpServer.listen(8000, () => {
  console.log("started");
});
