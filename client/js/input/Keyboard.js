let keys = {
  w: false,
  a: false,
  s: false,
  d: false
};

function keyDownHandler(event) {
  const pressedKey = event.key.toLowerCase();

  if (currentState === GAME_STATES.MENU) {
    if (pressedKey === "enter") {
      initializeGame();
      currentState = GAME_STATES.IN_GAME; // Transition to gameplay
    } else if (pressedKey === "h") {
      alert("Help:\n- Use WASD to move\n- Mouse to aim\n- Space or Click to shoot");
    }
  } else if (currentState === GAME_STATES.IN_GAME) {
    // Handle game-related input here (e.g., movement/shooting)
    if (pressedKey === "w") keys.w = true;
    else if (pressedKey === "s") keys.s = true;
    else if (pressedKey === "a") keys.a = true;
    else if (pressedKey === "d") keys.d = true;
    else if (pressedKey === " ") {
      if (!playerManager.mainPlayer.canShoot || playerManager.mainPlayer.isRespawning) return;
      playerManager.mainPlayer.shoot();
    }
  }
}

function keyUpHandler(event) {
  const pressedKey = event.key.toLowerCase();

  if (currentState === GAME_STATES.IN_GAME) {
    if (pressedKey === "w") keys.w = false;
    else if (pressedKey === "s") keys.s = false;
    else if (pressedKey === "a") keys.a = false;
    else if (pressedKey === "d") keys.d = false;
  }
}

function onBlurHandler() {
  keys = {
    w: false,
    a: false,
    s: false,
    d: false
  };
}

function keyEvents() {
  if (playerManager.mainPlayer.isRespawning) return;

  if (keys.w && keys.d) {
    playerManager.mainPlayer.move(Constants.SPEED / 1.25, -Constants.SPEED / 1.25, 45);
  } else if (keys.w && keys.a) {
    playerManager.mainPlayer.move(-Constants.SPEED / 1.25, -Constants.SPEED / 1.25, 135);
  } else if (keys.s && keys.d) {
    playerManager.mainPlayer.move(Constants.SPEED / 1.25, Constants.SPEED / 1.25, -45);
  } else if (keys.s && keys.a) {
    playerManager.mainPlayer.move(-Constants.SPEED / 1.25, Constants.SPEED / 1.25, -315);
  } else if (keys.w) {
    playerManager.mainPlayer.move(null, -Constants.SPEED, 0);
  } else if (keys.a) {
    playerManager.mainPlayer.move(-Constants.SPEED, null, 90);
  } else if (keys.s) {
    playerManager.mainPlayer.move(null, Constants.SPEED, 0);
  } else if (keys.d) {
    playerManager.mainPlayer.move(Constants.SPEED, null, 90);
  }
}
