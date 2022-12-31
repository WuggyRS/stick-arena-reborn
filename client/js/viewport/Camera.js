class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
  
  setPos(player) {
    this.x = player.x - canvas.width / 2;
    this.y = player.y - canvas.height / 2;
  }
}

const camera = new Camera();
