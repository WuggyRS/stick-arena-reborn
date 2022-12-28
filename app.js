const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const Player = require("./server/models/Player");

app.use(express.static(path.join(__dirname, "client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/index.html"));
});

let players = {};

io.on("connection", (socket) => {
  console.log("a user connected: ", socket.id);

  players[socket.id] = new Player();
  players[socket.id].position = { x: 0, y: 0 };

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

  socket.on("playedShoot", () => {
    socket.broadcast.emit("playShoot", {
      playerId: socket.id
    });
  });

  socket.on("playedWalkingAnimation", (walkingInfo) => {
    socket.broadcast.emit("playWalkingAnimation", {
      playerId: socket.id,
      rotation: walkingInfo.rotation
    });
  });

  socket.on("playerHit", (data) => {
    const player = data.playerId;
    if (!(player in players)) return;

    players[player].health -= 20;
    
    if (players[player].health <= 0) {
      socket.emit("playerDied", {
        playerId: data.playerId
      });
      socket.broadcast.emit("playerDied", {
        playerId: data.playerId
      });

      players[player].health = 100;
    } else {
      socket.emit("playerGotHit", {
        playerId: data.playerId
      });
      socket.broadcast.emit("playerGotHit", {
        playerId: data.playerId
      });
    }
  });

  socket.on("playerRespawn", (data) => {
    socket.broadcast.emit("playerMoved", {
      playerId: socket.id,
      playerPos: data.position
    });
  });
});

server.listen(1138, () => {
  console.log(`Listening on ${server.address().port}`);
});
