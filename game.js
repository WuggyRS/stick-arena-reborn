var speed = 250;

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#fafafa',
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  }
};

var game = new Phaser.Game(config);
var player, playerLegs;
var keys;
var text;
var dragging = false;
const debug = false;
var canMove = true;
var spinner;

function preload() {
  this.load.spritesheet('player', 'sprites/idleSpritesheet.png', { frameWidth: 32, frameHeight: 42 })
  this.load.spritesheet('playerPunch1', 'sprites/playerPunch1Spritesheet.png', { frameWidth: 61, frameHeight: 58 })
  this.load.spritesheet('playerPunch2', 'sprites/playerPunch2Spritesheet.png', { frameWidth: 61, frameHeight: 58 })
  this.load.spritesheet('playerPunch3', 'sprites/playerPunch3Spritesheet.png', { frameWidth: 61, frameHeight: 57 })
  this.load.spritesheet('death1', 'sprites/death1.png', { frameWidth: 77, frameHeight: 80 });
  this.load.spritesheet('legsWalking', 'sprites/legsWalking.png', { frameWidth: 14, frameHeight: 54 });
  this.load.spritesheet('katana1', 'sprites/katana1.png', { frameWidth: 180, frameHeight: 157 });
  this.load.spritesheet('spinner1', 'sprites/spinner1.png', { frameWidth: 83, frameHeight: 83 });
}

function create() {
  text = this.add.text(10, 10, '', { fill: '#00ff00' }).setDepth(1);

  keys = this.input.keyboard.addKeys("W,A,S,D,R,Q");

  spinner = this.physics.add.sprite(400, 300, 'spinner1');
  spinner.setCollideWorldBounds(true);

  player = this.physics.add.sprite(400, 300, 'player');
  player.setCollideWorldBounds(true);
  player.setOrigin(0.5, 0.5);

  playerLegs = this.physics.add.sprite(400, 300, 'legsWalking');
  playerLegs.setCollideWorldBounds(true);
  playerLegs.visible = false;
  playerLegs.on('animationcomplete', () => {
    canMove = true;

    playerLegs.visible = false;
    playerLegs.rotation = 0;
  });

  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 19 }),
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: 'punch1',
    frames: this.anims.generateFrameNumbers('playerPunch1', { start: 0, end: 13 }),
    frameRate: 28,
    repeat: 0
  });

  this.anims.create({
    key: 'punch2',
    frames: this.anims.generateFrameNumbers('playerPunch2', { start: 0, end: 11 }),
    frameRate: 24,
    repeat: 0
  });

  this.anims.create({
    key: 'punch3',
    frames: this.anims.generateFrameNumbers('playerPunch3', { start: 0, end: 10 }),
    frameRate: 20,
    repeat: 0
  });

  this.anims.create({
    key: 'death1',
    frames: this.anims.generateFrameNumbers('death1', { start: 0, end: 77 }),
    frameRate: 45,
    repeat: 0
  });

  this.anims.create({
    key: 'legsWalking',
    frames: this.anims.generateFrameNumbers('legsWalking', { start: 0, end: 34 }),
    frameRate: 45,
    repeat: 0
  });

  this.anims.create({
    key: 'katana1',
    frames: this.anims.generateFrameNumbers('katana1', { start: 0, end: 46 }),
    frameRate: 120,
    repeat: 0
  });

  this.anims.create({
    key: 'spinner1',
    frames: this.anims.generateFrameNumbers('spinner1', { start: 0, end: 14 }),
    frameRate: 45,
    repeat: -1
  });

  player.anims.play('idle');
  spinner.anims.play('spinner1');

  this.input.on('pointerdown', (pointer) => {
    if (pointer.leftButtonDown()) {
      const randomNumber = Math.floor(Math.random() * 3) + 1;
      player.anims.play('punch' + randomNumber, false).once('animationcomplete', () => {
        player.anims.play('idle', true);
      });
    }
  });
}

function update() {
  player.setVelocity(0);
  playerLegs.setPosition(player.x, player.y);
  spinner.setPosition(player.x, player.y + 5);

  var targetAngle = (360 / (2 * Math.PI)) * Phaser.Math.Angle.Between(
    player.x, player.y,
    this.input.activePointer.x, this.input.activePointer.y) + 90;

  if (targetAngle < 0)
    targetAngle += 360;

  player.angle = targetAngle;

  var pointer = this.input.activePointer;

  if (debug) {
    text.setText([
      'x: ' + pointer.worldX,
      'y: ' + pointer.worldY,
      'player.x: ' + player.x,
      'player.y: ' + player.y,
      'angle: ' + targetAngle
    ]);
  }

  if (keys.A.isDown) {
    player.setVelocityX(-speed);
    if (canMove) {
      canMove = false;

      playerLegs.visible = true;
      playerLegs.anims.play('legsWalking');
      playerLegs.angle += 90;
    }
  } else if (keys.D.isDown) {
    player.setVelocityX(speed);
    if (canMove) {
      canMove = false;

      playerLegs.visible = true;
      playerLegs.anims.play('legsWalking');
      playerLegs.angle += 90;
    }
  }

  if (keys.W.isDown) {
    player.setVelocityY(-speed);
    if (canMove) {
      canMove = false;
      playerLegs.visible = true;
      playerLegs.anims.play('legsWalking');
    }
  } else if (keys.S.isDown) {
    player.setVelocityY(speed);
    if (canMove) {
      canMove = false;
      playerLegs.visible = true;
      playerLegs.anims.play('legsWalking');
    }
  }

  if (keys.R.isDown) {
    player.anims.play('katana1', false).once('animationcomplete', () => {
      player.anims.play('idle', true);
    });
  }

  if (keys.Q.isDown) {
    player.anims.play('death1', false).once('animationcomplete', () => {
      player.anims.play('idle', true);
    });
  }
}