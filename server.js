const express = require("express");
const path = require("path");
const Player = require("./models/Player");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

let players = {};

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected: ", socket.id);

  players[socket.id] = new Player();

  socket.emit("currentPlayers", players);
  socket.broadcast.emit("newPlayer", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected: ", socket.id);
    delete players[socket.id];

    io.emit("playerDisconnected", socket.id);
  });

  socket.on("playerMovement", (movementData) => {
    players[socket.id].position = movementData;

    socket.broadcast.emit("playerMoved", {
      playerId: socket.id,
      playerPos: players[socket.id].position
    });
  });

  socket.on("playedPunch", (punchNum) => {
    socket.broadcast.emit("playPunch", {
      playerId: socket.id,
      punchNum: punchNum
    });
  });

  socket.on("playedWalkingAnimation", (walkingInfo) => {
    socket.broadcast.emit("playWalkingAnimation", {
      playerId: socket.id,
      isSideways: walkingInfo.isSideways
    });
  });
});

server.listen(8081, () => {
  console.log(`Listening on ${server.address().port}`);
});
