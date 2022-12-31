function mouseMoveHandler(event) {
  if (playerManager.mainPlayer.isRespawning) return;

  const mouseX = event.offsetX - canvas.width / 2;
  const mouseY = event.offsetY - canvas.height / 2;

  const spriteRotation = Math.atan2(mouseY, mouseX) + (90 * Constants.TO_RADIANS);
  playerManager.mainPlayer.body.setRotation(spriteRotation);
}

function onMouseDown(event) {
  if (event.button !== Constants.LEFT_MOUSE_BUTTON) return;
  if (!playerManager.mainPlayer.canShoot || playerManager.mainPlayer.isRespawning) return;

  playerManager.mainPlayer.shoot();
}
