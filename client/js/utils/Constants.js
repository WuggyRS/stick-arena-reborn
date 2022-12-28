class Constants {
  static get SPEED() {
    return 1;
  }

  static get STICK_FIGURE_HEAD_RADIUS() {
    return 17;
  }

  static get TO_RADIANS() {
    return Math.PI / 180;
  }

  static get PLAYER_SPAWN_POINTS() {
    return [{ x: 55, y: 677 }, { x: 52, y: 77 }, { x: 892, y: 82 }, { x: 894, y: 675 }];
  }

  static get LEFT_MOUSE_BUTTON() {
    return 0;
  }

  static get DEBUG() {
    return false;
  }

  static get SPRITE_DEFINITIONS() {
    return {
      "glock-shoot": {
        spritesheetUrl: "sprites/glock/glock-shoot.png",
        width: 61,
        height: 502,
        fps: 34,
        numberOfFrames: 20,
        spriteCenter: { x: 34, y: 486 },
        isShootingAnimation: true,
        hitboxOffsets: {
          topLeft: { x: 25, y: 0 },
          topRight: { x: 50, y: 0 },
          bottomLeft: { x: 25, y: 449 },
          bottomRight: { x: 50, y: 449 }
        }
      },
      "glock-stance": {
        spritesheetUrl: "sprites/glock/glock-stance.png",
        width: 41,
        height: 27,
        fps: 40,
        numberOfFrames: 40,
        spriteCenter: { x: 19, y: 13 }
      },
      "glock-hitsplat": {
        spritesheetUrl: "sprites/glock/glock-hitsplat.png",
        width: 57,
        height: 64,
        fps: 12,
        numberOfFrames: 12,
        spriteCenter: { x: 28, y: 36 }
      },
      "death": {
        spritesheetUrl: "sprites/player/death.png",
        width: 110,
        height: 80,
        fps: 36,
        numberOfFrames: 64,
        spriteCenter: { x: 21, y: 21 }
      },
      "death-soul": {
        spritesheetUrl: "sprites/player/death-soul.png",
        width: 122,
        height: 160,
        fps: 25,
        numberOfFrames: 58,
        spriteCenter: { x: 28, y: 36 }
      },
      "legs-walking": {
        spritesheetUrl: "sprites/player/legs-walking.png",
        width: 14,
        height: 54,
        fps: 45,
        numberOfFrames: 35,
        spriteCenter: { x: 7, y: 27 }
      }
    };
  }
}
