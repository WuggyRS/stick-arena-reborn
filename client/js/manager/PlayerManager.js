class PlayerManager {
  static getInstance() {
    if (!PlayerManager.instance) {
      PlayerManager.instance = new PlayerManager();
    }
    return PlayerManager.instance;
  }

  constructor() {
    this.players = {};
    this.mainPlayer = null;
  }

  createMainPlayer() {
    const randomIndex = Math.floor(Math.random() * Constants.PLAYER_SPAWN_POINTS.length);
    const { x, y } = Constants.PLAYER_SPAWN_POINTS[randomIndex];

    this.mainPlayer = new PlayerBuilder()
      .withX(x)
      .withY(y)
      .build();
    this.mainPlayer.isMainPlayer = true;

    socketManager.emit("playerMoved", { x: x, y: y });
  }

  getPlayer(id) {
    return this.players[id];
  }

  getPlayers() {
    return this.players;
  }

  addPlayer(id, player) {
    this.players[id] = player;
  }

  removePlayer(id) {
    delete this.players[id];
  }

  updatePlayers() {
    this.mainPlayer.update();

    for (const id in this.players) {
      this.players[id].update();
    }
  }

  drawPlayers(ctx) {
    this.mainPlayer.draw(ctx);

    for (const id in this.players) {
      this.players[id].draw(ctx);
    }
  }
}

const playerManager = PlayerManager.getInstance();
