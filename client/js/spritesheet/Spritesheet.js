class Spritesheet {
  constructor(spritesheetName, spritesheetUrl, width, height, fps, numberOfFrames, spriteCenter, isShootingAnimation, hitboxOffsets) {
    this.spritesheetName = spritesheetName;
    this.spritesheet = new Image();
    this.spritesheet.src = spritesheetUrl;
    this.width = width * numberOfFrames;
    this.height = height;
    this.fps = fps;
    this.timePerFrame = 1000 / fps;
    this.numberOfFrames = numberOfFrames || 1;
    this.spriteCenter = spriteCenter;

    // This is to determine collision check on the hitbox frame
    this.isShootingAnimation = isShootingAnimation || false;
    this.hitboxIndex = 0;
    this.hitboxOffsets = hitboxOffsets;
  }
}
