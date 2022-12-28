class SpritesheetBuilder {
  constructor() {
    this.spritesheetName = null;
    this.spritesheetUrl = null;
    this.width = null;
    this.height = null;
    this.fps = null;
    this.numberOfFrames = 1;
    this.spriteCenter = null;
    this.isShootingAnimation = false;
    this.hitboxOffsets = {};
  }

  withSpritesheetName(spritesheetName) {
    this.spritesheetName = spritesheetName;
    return this;
  }

  withSpritesheetUrl(spritesheetUrl) {
    this.spritesheetUrl = spritesheetUrl;
    return this;
  }

  withWidth(width) {
    this.width = width;
    return this;
  }

  withHeight(height) {
    this.height = height;
    return this;
  }

  withFps(fps) {
    this.fps = fps;
    return this;
  }

  withNumberOfFrames(numberOfFrames) {
    this.numberOfFrames = numberOfFrames;
    return this;
  }

  withSpriteCenter(spriteCenter) {
    this.spriteCenter = spriteCenter;
    return this;
  }

  withIsShootingAnimation(isShootingAnimation) {
    this.isShootingAnimation = isShootingAnimation;
    return this;
  }

  withHitboxOffsets(hitboxOffsets) {
    this.hitboxOffsets = hitboxOffsets;
    return this;
  }

  build() {
    return new Spritesheet(
      this.spritesheetName,
      this.spritesheetUrl,
      this.width,
      this.height,
      this.fps,
      this.numberOfFrames,
      this.spriteCenter,
      this.isShootingAnimation,
      this.hitboxOffsets
    );
  }
}
