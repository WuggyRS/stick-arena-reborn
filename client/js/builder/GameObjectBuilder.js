class GameObjectBuilder {
  constructor() {
    this.spritesheetName = null;
    this.x = 0;
    this.y = 0;
    this.isVisible = true;
    this.repeatTimes = -1;
  }

  withSpritesheetName(spritesheetName) {
    this.spritesheetName = spritesheetName;
    return this;
  }

  withX(x) {
    this.x = x;
    return this;
  }

  withY(y) {
    this.y = y;
    return this;
  }

  withIsVisible(isVisible) {
    this.isVisible = isVisible;
    return this;
  }

  withRepeatTimes(repeatTimes) {
    this.repeatTimes = repeatTimes;
    return this;
  }

  build() {
    return new GameObject(
      this.spritesheetName,
      this.x,
      this.y,
      this.isVisible,
      this.repeatTimes
    );
  }
}
