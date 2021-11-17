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

app.get("/", (req, res) => {
  res.send("Server Is Running...");
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomID, callback) => {
    socket.join(roomID);
    //return socket id to client
    callback(socket.id);
    //show all connected clients
    console.log(io.in(roomID).allSockets());
  });

  //Chat Functionality
  socket.on("sendMessage", (msgObj) => {
    socket.in(msgObj.roomID).emit("messageReceived", msgObj);
    socket
      .in(msgObj.roomID)
      .allSockets()
      .then((setTemp) => {
        console.log(setTemp.size);
      });
  });

  //Video Player Functionality
  socket.on("playClicked", (currRoomID) => {
    io.in(currRoomID).emit("playVideo");
  });

  socket.on("pauseClicked", ({ timeElapsed, currRoomID, duration }) => {
    io.in(currRoomID).emit("pauseVideo", timeElapsed, duration);
  });

  socket.on("videoSeeked", ({ videoDurationSeekTo, currRoomID }) => {
    io.in(currRoomID).emit("seekVideo", videoDurationSeekTo);
  });

  //Voice Call Functionality
  socket.on("offerSend", ({ roomID, offer }) => {
    //send that room's offer and id to client
    socket.broadcast.emit("offerReceive", offer);
  });

  socket.on("answerSend", ({ roomID, answer }) => {
    //send that room's answer and id to client
    socket.broadcast.emit("answerReceive", answer);
  });

  socket.on("voiceConnected", (roomID) => {
    io.in(roomID).emit("voiceConnectedReceived");
  });
});

httpServer.listen(8000, () => {
  console.log("started");
});
