let keys = {
  w: false,
  a: false,
  s: false,
  d: false
};

function keyDownHandler(event) {
  if (event.key == "w") {
    keys.w = true;
  } else if (event.key == "a") {
    keys.a = true;
  } else if (event.key == "s") {
    keys.s = true;
  } else if (event.key == "d") {
    keys.d = true;
  } else if (event.key == "Tab") {
    event.preventDefault();
  }
}

function keyUpHandler(event) {
  if (event.key == "w") {
    keys.w = false;
  } else if (event.key == "a") {
    keys.a = false;
  } else if (event.key == "s") {
    keys.s = false;
  } else if (event.key == "d") {
    keys.d = false;
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
    playerManager.mainPlayer.move(Constants.SPEED, -Constants.SPEED, 45);
  } else if (keys.w && keys.a) {
    playerManager.mainPlayer.move(-Constants.SPEED, -Constants.SPEED, 135);
  } else if (keys.s && keys.d) {
    playerManager.mainPlayer.move(Constants.SPEED, Constants.SPEED, -45);
  } else if (keys.s && keys.a) {
    playerManager.mainPlayer.move(-Constants.SPEED, Constants.SPEED, -315);
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
