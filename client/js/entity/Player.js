class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.health = 100;
    this.canMove = true;
    this.canShoot = true;
    this.isRespawning = false;
    this.isMainPlayer = false;
    this.previousPosition = { x: -1, y: -1, rotation: -1 };

    this.body = new GameObjectBuilder()
      .withSpritesheetName("glock-stance")
      .withX(x)
      .withY(y)
      .build();

    this.legs = new GameObjectBuilder()
      .withSpritesheetName("legs-walking")
      .withX(x)
      .withY(y)
      .withIsVisible(false)
      .withRepeatTimes(1)
      .build();

    this.hitsplat = new GameObjectBuilder()
      .withSpritesheetName("glock-hitsplat")
      .withX(x)
      .withY(y)
      .withIsVisible(false)
      .withRepeatTimes(1)
      .build();

    this.deathSoul = new GameObjectBuilder()
      .withSpritesheetName("death-soul")
      .withX(x)
      .withY(y)
      .withIsVisible(false)
      .withRepeatTimes(1)
      .build();

    this.body.addEventListener("animationcomplete", (data) => {
      const animationName = data.name;

      if (animationName === "death") {
        this.health = 100;
        this.isRespawning = false;
        this.canShoot = true;
        this.canMove = true;
        this.deathSoul.isVisible = false;

        if (this.isMainPlayer) {
          this.healthbarHeart.swapSpritesheet("heartbeat-healthy");
          this.respawn();
        }
      } else if (animationName === "glock-shoot") {
        this.canShoot = true;
      }

      this.body.resetAnimation();
    })

    this.legs.addEventListener("animationcomplete", () => {
      this.canMove = true;
      this.legs.isVisible = false;
      this.legs.resetAnimationRepeat(1);
    });

    this.hitsplat.addEventListener("animationcomplete", () => {
      this.hitsplat.isVisible = false;
    });

    this.body.addEventListener("shotsfired", this.checkCollision.bind(this));
  }

  checkCollision(data) {
    if (!this.isMainPlayer) return;

    const playerPos = data.playerPos;
    const rotation = this.body.rotation;
    const transformedPoint = Physics.calculateTransformedPoint(
      playerPos.x, playerPos.y, this.body.spritesheetData.spriteCenter, rotation
    );
    const playerX = transformedPoint.x;
    const playerY = transformedPoint.y;
    const hitboxOffsets = this.body.spritesheetData.hitboxOffsets;

    const hitboxRegion = {
      topLeft: {
        x: playerX + hitboxOffsets.topLeft.x, y: playerY + hitboxOffsets.topLeft.y
      },
      topRight: {
        x: playerX + hitboxOffsets.topRight.x, y: playerY + hitboxOffsets.topRight.y
      },
      bottomLeft: {
        x: playerX + hitboxOffsets.bottomLeft.x, y: playerY + hitboxOffsets.bottomLeft.y
      },
      bottomRight: {
        x: playerX + hitboxOffsets.bottomRight.x, y: playerY + hitboxOffsets.bottomRight.y
      }
    };

    // Transform the coordinates to account for rotation
    for (const coordinate in hitboxRegion) {
      const expectedPoint = hitboxRegion[coordinate];
      const xyTest = Physics.rotatePoint(playerX, playerY, expectedPoint.x, expectedPoint.y, rotation);

      hitboxRegion[coordinate].x = xyTest.x;
      hitboxRegion[coordinate].y = xyTest.y;
    }

    const otherPlayers = playerManager.getPlayers();
    for (const playerId in otherPlayers) {
      const otherPlayer = otherPlayers[playerId];
      if (otherPlayer.isMainPlayer) continue;
      if (otherPlayer.isRespawning) continue;
      if (Physics.checkForObstacles(playerPos, otherPlayer.getPosition())) continue;
      if (Physics.isCircleCollidingRect(otherPlayer.getPosition(), hitboxRegion)) {
        socketManager.emit("playerHit", { playerId: playerId });
      }
    }
  }

  setPosition(x, y, rotation) {
    this.body.setPosition(x, y);
    if (rotation) {
      this.body.setRotation(rotation);
    }
  }

  getPosition() {
    return {
      x: this.body.x,
      y: this.body.y,
      rotation: this.body.rotation
    }
  }

  isPositionChanged(currentPosition) {
    return currentPosition.x !== this.previousPosition.x
      || currentPosition.y !== this.previousPosition.y
      || currentPosition.rotation !== this.previousPosition.rotation;
  }

  playWalkingAnim(legRotation = 0) {
    this.legs.isVisible = true;
    this.canMove = false;
    this.legs.setPosition(this.body.x, this.body.y);
    this.legs.setRotation(legRotation * Constants.TO_RADIANS);

    if (!this.canMove && this.body.spritesheetData.spritesheetName === "glock-stance") {
      this.body.swapSpritesheet("glock-walk", 1);
    }
  }

  move(speedX, speedY = null, legRotation = 0) {
    let newTileX;
    let newTileY;

    this.x = this.body.x;
    this.y = this.body.y;

    if (speedX != null) {
      newTileX = Math.floor((this.x + speedX) / 50);
    } else {
      newTileX = Math.floor(this.x / 50);
    }

    if (speedY != null) {
      newTileY = Math.floor((this.y + speedY) / 50);
    } else {
      newTileY = Math.floor(this.y / 50);
    }

    if (Constants.TILE_OBSTACLES[newTileY * 35 + newTileX] === 1) {
      return;
    }

    if (speedX != null) {
      this.body.setVelocityX(speedX);
    }

    if (speedY != null) {
      this.body.setVelocityY(speedY);
    }

    this.playWalkingAnim(legRotation);

    if (this.isMainPlayer) {
      socketManager.emit("playedWalkingAnimation", { rotation: legRotation });
    }
  }

  shoot() {
    if (this.isMainPlayer) {
      socketManager.emit("playedShoot");
    }

    this.body.swapSpritesheet("glock-shoot", 1);
    this.canShoot = false;
  }

  death() {
    this.health = 0;
    this.body.swapSpritesheet("death", 1);
    this.isRespawning = true;
    this.canShoot = false;
    this.canMove = false;

    this.deathSoul.setPosition(this.body.x, this.body.y);
    this.deathSoul.resetAnimationRepeat(1);
    this.deathSoul.isVisible = true;
  }

  respawn() {
    const randomIndex = Math.floor(Math.random() * Constants.PLAYER_SPAWN_POINTS.length);
    const { x, y } = Constants.PLAYER_SPAWN_POINTS[randomIndex];

    this.body.setPosition(x, y);

    socketManager.emit("playerMoved", { x: x, y: y, isRespawning: true });
  }

  showHitsplat() {
    this.hitsplat.isVisible = true;
    this.hitsplat.setPosition(this.body.x, this.body.y);
    this.hitsplat.resetAnimationRepeat(1);
    this.health -= 20;

    if (this.isMainPlayer) {
      if (this.health >= 75 && this.healthbarHeart.spritesheetData.spritesheetName !== "heartbeat-healthy") {
        this.healthbarHeart.swapSpritesheet("heartbeat-healthy");
      } else if (this.health > 20 && this.healthbarHeart.spritesheetData.spritesheetName !== "heartbeat-impacted") {
        this.healthbarHeart.swapSpritesheet("heartbeat-impacted");
      } else if (this.health <= 20 && this.healthbarHeart.spritesheetData.spritesheetName !== "heartbeat-critical") {
        this.healthbarHeart.swapSpritesheet("heartbeat-critical");
      }
    }
  }

  update() {
    this.legs.update();
    this.body.update();
    this.hitsplat.update();
    this.deathSoul.update();

    if (this.isMainPlayer) {
      this.healthbarHeart.update();
    }

    const currentPosition = this.getPosition();
    if (this.isPositionChanged(currentPosition) && this.isMainPlayer) {
      socketManager.emit("playerMovement", currentPosition);
      this.previousPosition = currentPosition;
    }
  }

  draw(ctx) {
    // If the player can't move then that means they're in motion
    if (!this.canMove) {
      this.legs.draw(ctx);
    }
    this.body.draw(ctx);
    this.hitsplat.draw(ctx);
    if (this.isRespawning) {
      this.deathSoul.draw(ctx);
    }
  }
}
