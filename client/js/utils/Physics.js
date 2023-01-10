class Physics {
  static isCircleCollidingRect(circle, rect, radius = Constants.STICK_FIGURE_HEAD_RADIUS) {
    const corner1 = rect.topLeft;
    const corner2 = rect.topRight;
    const corner3 = rect.bottomLeft;
    const corner4 = rect.bottomRight;

    const distance1 = this.distanceToLine(circle, corner1, corner2);
    const distance2 = this.distanceToLine(circle, corner2, corner3);
    const distance3 = this.distanceToLine(circle, corner3, corner4);
    const distance4 = this.distanceToLine(circle, corner4, corner1);

    if (distance1 <= radius || distance2 <= radius || distance3 <= radius || distance4 <= radius) {
      return true;
    }

    return false;
  }

  static distanceToLine(point, linePoint1, linePoint2) {
    const lineLength = this.distance(linePoint1, linePoint2);
    const numerator = Math.abs((linePoint2.y - linePoint1.y) * point.x - (linePoint2.x - linePoint1.x) * point.y + linePoint2.x * linePoint1.y - linePoint2.y * linePoint1.x);
    return numerator / lineLength;
  }

  static distance(point1, point2) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
  }

  // https://stackoverflow.com/a/22428650
  static rotatePoint(playerX, playerY, otherX, otherY, rotation) {
    const dx = otherX - playerX;
    const dy = otherY - playerY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const otherPointAngle = Math.atan2(dy, dx);
    const screenX = playerX + length * Math.cos(otherPointAngle + rotation);
    const screenY = playerY + length * Math.sin(otherPointAngle + rotation);

    return ({
      x: screenX,
      y: screenY
    });
  }

  static calculateTransformedPoint(x, y, spriteCenter, rotation) {
    return {
      x: x - spriteCenter.x * Math.cos(rotation) + spriteCenter.y * Math.sin(rotation),
      y: y - spriteCenter.x * Math.sin(rotation) - spriteCenter.y * Math.cos(rotation)
    }
  }

  static checkForObstacles(playerPos, targetPlayerPos) {
    // Calculate distance between players
    const xDistance = targetPlayerPos.x - playerPos.x;
    const yDistance = targetPlayerPos.y - playerPos.y;
    const totalDistance = Math.sqrt(xDistance ** 2 + yDistance ** 2);

    // Calculate number of tiles between players
    const numTiles = totalDistance / 50;

    // Calculate x and y increments for each tile
    const xIncrement = xDistance / numTiles;
    const yIncrement = yDistance / numTiles;

    // Initialize variables for loop
    let currentX = playerPos.x;
    let currentY = playerPos.y;

    // Iterate through tiles between players
    for (let i = 0; i < numTiles; i++) {
      // Convert current position to tile index
      const tileX = Math.floor(currentX / 50);
      const tileY = Math.floor(currentY / 50);
      const tileIndex = tileX + tileY * 35;

      // Check if tile is an obstacle
      if (Constants.TILE_OBSTACLES[tileIndex] == 1) {
        return true;
      }

      // Update current position
      currentX += xIncrement;
      currentY += yIncrement;
    }

    return false;
  }
}