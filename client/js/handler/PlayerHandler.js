socketManager.on("currentPlayers", (players) => {
  for (const playerId in players) {
    if (playerId === socketManager.socket.id) continue;
    const playerInfo = players[playerId].position;

    const player = new PlayerBuilder()
      .withX(playerInfo.x)
      .withY(playerInfo.y)
      .build();

    playerManager.addPlayer(playerId, player);
  }
});

socketManager.on("newPlayer", (playerId) => {
  const player = new PlayerBuilder()
    .withX(-10)
    .withY(-10)
    .build();
 
  playerManager.addPlayer(playerId, player);
});

socketManager.on("playerDisconnected", (playerId) => {
  playerManager.removePlayer(playerId);
});

socketManager.on("playWalkingAnimation", (data) => {
  const { playerId, rotation } = data;

  const player = playerManager.getPlayer(playerId);
  if (!player) return;

  player.playWalkingAnim(rotation);
});

socketManager.on("playerMoved", (data) => {
  const { playerId, playerPos } = data;
  
  const player = playerManager.getPlayer(playerId);
  if (!player) return;

  player.setPosition(playerPos.x, playerPos.y, playerPos.rotation);
});

socketManager.on("playShoot", (data) => {
  const { playerId } = data;

  const player = playerManager.getPlayer(playerId);
  if (!player) return;

  player.shoot();
});

socketManager.on("playerGotHit", (data) => {
  const { playerId } = data;

  let player = playerManager.getPlayer(playerId);
  if (!player) {
    player = playerManager.mainPlayer;
  }

  player.showHitsplat();
});

socketManager.on("playerDied", (data) => {
  const { playerId } = data;

  let player = playerManager.getPlayer(playerId);
  if (!player) {
    player = playerManager.mainPlayer;
  }

  player.death();
});
