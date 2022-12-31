class GameObject {
  constructor(spritesheetName, x, y, isVisible, repeatTimes) {
    this.spritesheetData = spritesheetManager.getSpritesheet(spritesheetName);
    this.x = x;
    this.y = y;
    this.rotation = 0;
    this.isVisible = (isVisible != null) ? isVisible : true;
    this.listeners = {};

    this.frameIndex = 0;
    this.repeatTimes = repeatTimes || -1;
    this.lastUpdated = Date.now();

    // This is used to restore the original sprite after a temporary animation happens
    this.spritesheetSnapshot = spritesheetName;
  }

  setPosition(newX, newY) {
    this.x = newX;
    this.y = newY;
  }

  setVelocityX(speed) {
    this.x += speed;
  }

  setVelocityY(speed) {
    this.y += speed;
  }

  setRotation(radians) {
    this.rotation = radians;
  }

  resetAnimationRepeat(numTimes) {
    this.frameIndex = -1;
    this.repeatTimes = numTimes;
  }

  swapSpritesheet(spritesheetName, repeatNumTimes = -1) {
    this.spritesheetData = spritesheetManager.getSpritesheet(spritesheetName);

    if (repeatNumTimes > 0)
      this.resetAnimationRepeat(repeatNumTimes);
  }

  resetAnimation() {
    this.swapSpritesheet(this.spritesheetSnapshot);
  }

  update() {
    if (!this.isVisible) return;
    if (this.repeatTimes != -1 && this.repeatTimes <= 0) return;

    if (Date.now() - this.lastUpdated >= this.spritesheetData.timePerFrame) {
      // Collision detection
      if (this.frameIndex == this.spritesheetData.hitboxIndex && this.spritesheetData.isShootingAnimation) {
        this.dispatchEvent("shotsfired", { playerPos: { x: this.x, y: this.y } });
      }

      this.frameIndex++;
      if (this.frameIndex >= this.spritesheetData.numberOfFrames) {
        this.frameIndex = 0;

        if (this.repeatTimes > 0)
          this.repeatTimes--;
      }
      this.lastUpdated = Date.now();

      if (this.repeatTimes == 0) {
        this.dispatchEvent("animationcomplete", { name: this.spritesheetData.spritesheetName });
      }
    }
  }

  draw(ctx) {
    if (!this.isVisible) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(this.spritesheetData.spritesheet,
      this.frameIndex * this.spritesheetData.width / this.spritesheetData.numberOfFrames,
      0,
      this.spritesheetData.width / this.spritesheetData.numberOfFrames,
      this.spritesheetData.height,
      -this.spritesheetData.spriteCenter.x,
      -this.spritesheetData.spriteCenter.y,
      this.spritesheetData.width / this.spritesheetData.numberOfFrames,
      this.spritesheetData.height);
    ctx.restore();
  }

  addEventListener(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  removeEventListener(eventName, callback) {
    if (!this.listeners[eventName]) {
      return;
    }
    const index = this.listeners[eventName].indexOf(callback);
    if (index !== -1) {
      this.listeners[eventName].splice(index, 1);
    }
  }

  dispatchEvent(eventName, data = null) {
    if (!this.listeners[eventName]) {
      return;
    }
    for (const listener of this.listeners[eventName]) {
      listener(data);
    }
  }
}
