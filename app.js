const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();

app.use(cors());

const httpServer = createServer(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:19000",
    methods: ["GET", "POST"],
  },
});

// const io = new Server(httpServer);

let activePlayers = 0;

app.get("/", (req, res) => {
  res.send("Server Is Running...");
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomID, callback) => {
    socket.join(roomID);
    callback(socket.id);
  });

  socket.on("ready", (currRoomID) => {
    activePlayers++;
    socket
      .in(currRoomID)
      .allSockets()
      .then((obj) => {
        if (activePlayers === obj.size) {
          socket.in(currRoomID).emit("allPlayersReady");
        }
      });
  });

  socket.on("sendMessage", (msgObj) => {
    socket.in(msgObj.roomID).emit("messageReceived", msgObj);
    socket
      .in(msgObj.roomID)
      .allSockets()
      .then((setTemp) => {
        console.log(setTemp.size);
      });
  });

  socket.on("playClicked", (currRoomID) => {
    socket.in(currRoomID).emit("playVideo");
  });

  socket.on("pauseClicked", ({ timeElapsed, currRoomID }) => {
    socket.in(currRoomID).emit("pauseVideo", timeElapsed);
  });
});

httpServer.listen(8000, () => {
  console.log("started");
});
