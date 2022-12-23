class Player {
  constructor(game, initialPos = null) {
    this.game = game;
    this.initialPos = initialPos;

    this.player = null;
    this.playerLegs = null;
    this.spinner = null;
    this.canMove = true;
    this.previousPosition = { x: -1, y: -1, angle: -1, rotation: -1 };

    this.initialize();
  }

  initialize() {
    // TODO: If initialPos is not null, set the player's position to the coordinates

    this.spinner = this.game.physics.add.sprite(400, 300, "spinner1");
    this.spinner.setCollideWorldBounds(true);
    this.spinner.setScale(1.25);
    this.spinner.visible = false;

    this.player = this.game.physics.add.sprite(400, 300, "player");
    this.player.setCollideWorldBounds(true);
    this.player.setOrigin(0.5, 0.5);

    this.playerLegs = this.game.physics.add.sprite(400, 300, "legsWalking");
    this.playerLegs.setCollideWorldBounds(true);
    this.playerLegs.visible = false;
    this.playerLegs.on("animationcomplete", () => {
      this.canMove = true;

      this.playerLegs.visible = false;
      this.playerLegs.rotation = 0;
    });

    this.game.anims.create({
      key: "idle",
      frames: this.game.anims.generateFrameNumbers("player", { start: 0, end: 19 }),
      frameRate: 20,
      repeat: -1
    });

    this.game.anims.create({
      key: "punch1",
      frames: this.game.anims.generateFrameNumbers("playerPunch1", { start: 0, end: 13 }),
      frameRate: 28,
      repeat: 0
    });

    this.game.anims.create({
      key: "punch2",
      frames: this.game.anims.generateFrameNumbers("playerPunch2", { start: 0, end: 11 }),
      frameRate: 24,
      repeat: 0
    });

    this.game.anims.create({
      key: "punch3",
      frames: this.game.anims.generateFrameNumbers("playerPunch3", { start: 0, end: 10 }),
      frameRate: 20,
      repeat: 0
    });

    this.game.anims.create({
      key: "death1",
      frames: this.game.anims.generateFrameNumbers("death1", { start: 0, end: 77 }),
      frameRate: 45,
      repeat: 0
    });

    this.game.anims.create({
      key: "legsWalking",
      frames: this.game.anims.generateFrameNumbers("legsWalking", { start: 0, end: 34 }),
      frameRate: 45,
      repeat: 0
    });

    this.game.anims.create({
      key: "katana1",
      frames: this.game.anims.generateFrameNumbers("katana1", { start: 0, end: 46 }),
      frameRate: 120,
      repeat: 0
    });

    this.game.anims.create({
      key: "spinner1",
      frames: this.game.anims.generateFrameNumbers("spinner1", { start: 0, end: 14 }),
      frameRate: 45,
      repeat: -1
    });

    this.player.anims.play("idle");
  }

  anchorFollowedItems() {
    this.playerLegs.setPosition(this.player.x, this.player.y);
    this.spinner.setPosition(this.player.x, this.player.y + 5);
  }

  onUpdate() {
    this.player.setVelocity(0);
    this.anchorFollowedItems();

    let targetAngle = (360 / (2 * Math.PI)) * Phaser.Math.Angle.Between(
      this.player.x, this.player.y,
      this.game.input.activePointer.x, this.game.input.activePointer.y
    ) + 90;

    if (targetAngle < 0)
      targetAngle += 360;

    this.player.angle = targetAngle;
  }

  getPosition() {
    return {
      x: this.player.x,
      y: this.player.y,
      angle: this.player.angle,
      rotation: this.player.rotation
    };
  }

  setPosition(pos) {
    if (pos == null) return;
    this.player.setPosition(pos.x, pos.y);
    this.player.angle = pos.angle;
    this.player.rotation = pos.rotation;
  }

  isPositionChanged(currentPosition) {
    return currentPosition.x !== this.previousPosition.x
      || currentPosition.y !== this.previousPosition.y
      || currentPosition.angle !== this.previousPosition.angle
      || currentPosition.rotation !== this.previousPosition.rotation;
  }

  playLegsWalking(walkSideways = false) {
    if (!this.canMove) return;

    this.canMove = false;

    this.playerLegs.visible = true;
    this.playerLegs.anims.play("legsWalking");

    if (walkSideways)
      this.playerLegs.angle += 90;
  }

  playPunch(num = null) {
    const randomNumber = num !== null ? num : Math.floor(Math.random() * 3) + 1;
    this.player.anims.play("punch" + randomNumber, false).once("animationcomplete", () => {
      this.player.anims.play("idle", true);
    });
    return randomNumber;
  }

  destroy() {
    // TODO: Group these sprites together
    this.spinner.destroy();
    this.playerLegs.destroy();
    this.player.destroy();
  }
}
