const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gameMap = new Image();
gameMap.src = "sprites/maps/open-space.png";

function drawMap() {
  ctx.drawImage(gameMap, -25, -10, gameMap.width, gameMap.height);
}

function update() {
  playerManager.updatePlayers();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  playerManager.drawPlayers(ctx);
}

function loop() {
  update();
  draw();
  keyEvents();
  requestAnimationFrame(loop);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("mousedown", onMouseDown);

playerManager.createMainPlayer();

loop();
