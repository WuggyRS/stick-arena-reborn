var speed = 250;

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#fafafa",
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  }
};

const socket = io();
var game = new Phaser.Game(config);
var keys;
var text;
const debug = false;

var mainPlayer;
const otherPlayers = {};

function showDebug() {
  if (debug) {
    const pointer = this.input.activePointer;

    text.setText([
      "x: " + pointer.worldX,
      "y: " + pointer.worldY,
      "player.x: " + mainPlayer.player.x,
      "player.y: " + mainPlayer.player.y,
      "angle: " + targetAngle
    ]);
  }
}

function preload() {
  this.load.spritesheet("player", "sprites/idleSpritesheet.png", { frameWidth: 32, frameHeight: 42 })
  this.load.spritesheet("playerPunch1", "sprites/playerPunch1Spritesheet.png", { frameWidth: 61, frameHeight: 58 })
  this.load.spritesheet("playerPunch2", "sprites/playerPunch2Spritesheet.png", { frameWidth: 61, frameHeight: 58 })
  this.load.spritesheet("playerPunch3", "sprites/playerPunch3Spritesheet.png", { frameWidth: 61, frameHeight: 57 })
  this.load.spritesheet("death1", "sprites/death1.png", { frameWidth: 77, frameHeight: 80 });
  this.load.spritesheet("legsWalking", "sprites/legsWalking.png", { frameWidth: 14, frameHeight: 54 });
  this.load.spritesheet("katana1", "sprites/katana1.png", { frameWidth: 180, frameHeight: 157 });
  this.load.spritesheet("spinner1", "sprites/spinner1.png", { frameWidth: 83, frameHeight: 83 });
}

function create() {
  text = this.add.text(10, 10, "", { fill: "#00ff00" }).setDepth(1);
  keys = this.input.keyboard.addKeys("W,A,S,D");

  mainPlayer = new Player(this);

  this.input.on("pointerdown", (pointer) => {
    if (pointer.leftButtonDown()) {
      const punchNum = mainPlayer.playPunch();
      socket.emit("playedPunch", punchNum);
    }
  });

  socket.on('currentPlayers', (players) => {
    console.log("currentPlayers triggered");
    console.log(players);

    for (const playerId in players) {
      if (playerId === socket.id) continue;
      const playerInfo = players[playerId];
      otherPlayers[playerId] = new Player(this, playerInfo.position);
    }
  });

  socket.on('newPlayer', (playerInfo) => {
    console.log("newPlayer triggered");

    if (playerInfo !== socket.id) {
      otherPlayers[playerInfo] = new Player(this); 
    }
  });

  socket.on('playerDisconnected', (playerId) => {
    console.log("playerDisconnected triggered");
    
    if (playerId in otherPlayers) {
      otherPlayers[playerId].destroy();
      delete otherPlayers[playerId];
    }
  });

  socket.on('playerMoved', (playerInfo) => {
    const { playerId, playerPos } = playerInfo;
    const changedPlayer = otherPlayers[playerId];

    changedPlayer.setPosition(playerPos);
  });

  socket.on("playPunch", (playerInfo) => {
    const { playerId, punchNum } = playerInfo;

    const otherPlayer = otherPlayers[playerId];
    otherPlayer.playPunch(punchNum);
  });

  socket.on("playWalkingAnimation", (playerInfo) => {
    const { playerId, isSideways } = playerInfo;

    const otherPlayer = otherPlayers[playerId];
    otherPlayer.anchorFollowedItems();
    otherPlayer.playLegsWalking(isSideways);
  })
}

function update() {
  mainPlayer.onUpdate();

  showDebug();

  if (keys.A.isDown) {
    mainPlayer.player.setVelocityX(-speed);
    mainPlayer.playLegsWalking(true);
    socket.emit("playedWalkingAnimation", { isSideways: true });
  } else if (keys.D.isDown) {
    mainPlayer.player.setVelocityX(speed);
    mainPlayer.playLegsWalking(true);
    socket.emit("playedWalkingAnimation", { isSideways: true });
  }

  if (keys.W.isDown) {
    mainPlayer.player.setVelocityY(-speed);
    mainPlayer.playLegsWalking();
    socket.emit("playedWalkingAnimation", { isSideways: false });
  } else if (keys.S.isDown) {
    mainPlayer.player.setVelocityY(speed);
    mainPlayer.playLegsWalking();
    socket.emit("playedWalkingAnimation", { isSideways: false });
  }

  const currentPosition = mainPlayer.getPosition();
  if (mainPlayer.isPositionChanged(currentPosition)) {
    socket.emit("playerMovement", currentPosition);
  }
  mainPlayer.previousPosition = currentPosition;
}
