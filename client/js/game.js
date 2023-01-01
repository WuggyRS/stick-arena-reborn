const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const scaleFactor = 1;

const tilemap = Constants.TILEMAP;

const gameMap = new Image();
gameMap.src = "sprites/maps/open-space.png";

let tiles = {};

function drawMap() {
  const tileSize = 50;
  const mapWidth = 35;
  const mapHeight = 24;

  const startX = Math.max(0, Math.floor(camera.x / (tileSize * scaleFactor)));
  const startY = Math.max(0, Math.floor(camera.y / (tileSize * scaleFactor)));

  const endX = Math.min(mapWidth, startX + Math.ceil(canvas.width / (tileSize * scaleFactor)) + 1);
  const endY = Math.min(mapHeight, startY + Math.ceil(canvas.height / (tileSize * scaleFactor)) + 1);

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const tile = tilemap[y * mapWidth + x];
      ctx.drawImage(tiles[tile], x * tileSize, y * tileSize, tileSize * scaleFactor, tileSize * scaleFactor);
    }
  }
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
  ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
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

// TODO: Fix some tiles having incorrect transformations
function loadTiles() {
  for (const tileIndex in tilemap) {
    const rawTile = tilemap[tileIndex];
    const tileImg = new Image();
    tileImg.src = `sprites/maps/xgenhq/${rawTile}.png`;
    tiles[rawTile] = tileImg;
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("blur", onBlurHandler)
canvas.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("mousedown", onMouseDown);

playerManager.createMainPlayer();

loadTiles();
loop();
