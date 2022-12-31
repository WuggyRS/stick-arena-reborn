const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gameMap = new Image();
gameMap.src = "sprites/maps/open-space.png";

function drawMap() {
  ctx.drawImage(gameMap, 0, 0, gameMap.width, gameMap.height);
}

function drawHealthBar() {
  let x = 50;
  let y = 15;
  const width = 100;
  const height = 20;
  const health = playerManager.mainPlayer.health;

  ctx.save();
  ctx.translate(camera.x, camera.y);
  playerManager.mainPlayer.healthbarHeart.draw(ctx);
  ctx.fillStyle = 'red';
  ctx.fillRect(x, y, health, height);
  ctx.fillStyle = 'black';
  ctx.fillRect(health + x, y, width - health, height);
  ctx.restore();
}

function drawHUD() {
  drawHealthBar();
}

function update() {
  playerManager.updatePlayers();
}

function draw() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(-camera.x, -camera.y);
  ctx.save();
  drawMap();

  drawHUD();

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
document.addEventListener("blur", onBlurHandler)
canvas.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("mousedown", onMouseDown);

playerManager.createMainPlayer();

loop();
