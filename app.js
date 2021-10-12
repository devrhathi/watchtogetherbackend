const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const videoToUserListMapper = {};

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server Is Running...");
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomID, callback) => {
    if (Object.keys(videoToUserListMapper).indexOf(roomID) === -1) {
      //key is not there, initialize it
      videoToUserListMapper[roomID] = [socket.id];
    } else {
      videoToUserListMapper[roomID].push(socket.id);
    }
    socket.join(roomID);
    callback(socket.id);
  });
});

httpServer.listen(8000, () => {
  console.log("started");
});
