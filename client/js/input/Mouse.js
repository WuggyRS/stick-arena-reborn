function mouseMoveHandler(event) {
  if (playerManager.mainPlayer.isRespawning) return;

  const mouseX = event.offsetX - canvas.width / 2;
  const mouseY = event.offsetY - canvas.height / 2;

  const spriteRotation = Math.atan2(mouseY, mouseX) + (90 * Constants.TO_RADIANS);
  playerManager.mainPlayer.body.setRotation(spriteRotation);
}

function onMouseDown(event) {
  if (event.button !== Constants.LEFT_MOUSE_BUTTON) return;

  if (currentState == GAME_STATES.MENU) {
    // const mouseX = event.offsetX, mouseY = event.offsetY;
    //
    // // Check if the click is inside a button using bounds (x, y, width, height)
    // if (mouseX > lightMenuButtonX && mouseX < lightMenuButtonX + buttonWidth &&
    //   mouseY > lightMenuButtonY && mouseY < lightMenuButtonY + buttonHeight) {
    //   handleMenuButtonClick(buttonName);
    // }
  }

  if (currentState == GAME_STATES.IN_GAME) {
    if (!playerManager.mainPlayer.canShoot || playerManager.mainPlayer.isRespawning) return;
    playerManager.mainPlayer.shoot();
  }
}

