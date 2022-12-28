class PlayerBuilder {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  withX(x) {
    this.x = x;
    return this;
  }

  withY(y) {
    this.y = y;
    return this;
  }

  build() {
    return new Player(this.x, this.y);
  }
}
