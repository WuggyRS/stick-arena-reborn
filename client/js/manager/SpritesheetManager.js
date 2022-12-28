class SpritesheetManager {
  static getInstance() {
    if (!SpritesheetManager.instance) {
      SpritesheetManager.instance = new SpritesheetManager();
    }
    return SpritesheetManager.instance;
  }

  constructor() {
    this.spritesheets = {};
    this.loadSpritesheets();
  }

  loadSpritesheets() {
    for (const spriteName in Constants.SPRITE_DEFINITIONS) {
      const sprite = Constants.SPRITE_DEFINITIONS[spriteName];
      const spritesheetData = new SpritesheetBuilder()
        .withSpritesheetName(spriteName)
        .withSpritesheetUrl(sprite.spritesheetUrl)
        .withWidth(sprite.width)
        .withHeight(sprite.height)
        .withFps(sprite.fps)
        .withNumberOfFrames(sprite.numberOfFrames)
        .withSpriteCenter(sprite.spriteCenter);

      if (sprite.isShootingAnimation) {
        spritesheetData.withIsShootingAnimation(sprite.isShootingAnimation);
      }

      if (sprite.hitboxOffsets) {
        spritesheetData.withHitboxOffsets(sprite.hitboxOffsets);
      }

      this.addSpritesheet(spriteName, spritesheetData.build());
    }
  }

  addSpritesheet(name, spritesheet) {
    this.spritesheets[name] = spritesheet;
  }

  getSpritesheet(name) {
    return this.spritesheets[name];
  }

  updateSpritesheet(name, spritesheet) {
    this.spritesheets[name] = spritesheet;
  }
}

const spritesheetManager = SpritesheetManager.getInstance();
