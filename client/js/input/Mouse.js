function mouseMoveHandler(event) {
  if (playerManager.mainPlayer.isRespawning) return;

  const mouseX = event.offsetX;
  const mouseY = event.offsetY;

  const spriteRotation = Math.atan2(mouseY - playerManager.mainPlayer.body.y, mouseX - playerManager.mainPlayer.body.x) + (90 * Constants.TO_RADIANS);
  playerManager.mainPlayer.body.setRotation(spriteRotation);
}

function onMouseDown(event) {
  if (event.button !== Constants.LEFT_MOUSE_BUTTON) return;
  if (!playerManager.mainPlayer.canShoot || playerManager.mainPlayer.isRespawning) return;

  playerManager.mainPlayer.shoot();
}
