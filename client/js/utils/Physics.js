class Physics {
  static isCircleCollidingRect(circle, rect, radius = Constants.STICK_FIGURE_HEAD_RADIUS) {
    const corner1 = rect.topLeft;
    const corner2 = rect.topRight;
    const corner3 = rect.bottomLeft;
    const corner4 = rect.bottomRight;
    const vertices = [corner1, corner2, corner3, corner4];

    const rectangle = { vertices: vertices };
    circle.radius = radius;

    const { overlap, mtv } = this.circleToPolygon(circle, rectangle);
    return overlap;
  }

  static dotProduct = (v1, v2) => v1.x * v2.x + v1.y * v2.y;

  static magnitude = v => Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));

  static normalizeVector = v => {
    const m = this.magnitude(v);
    return m == 0 ? v : { x: v.x / m, y: v.y / m };
  }

  static getEdges = vertices =>
    vertices.reduce((a, v, i, l) => {
      const n = (i + 1) % l.length
      return [...a, { x: l[n].x - l[i].x, y: l[n].y - l[i].y }];
    }, []);

  static getNormals = edges =>
    edges.reduce((a, v) => {
      return [...a, this.normalizeVector({ x: -v.y, y: v.x })];
    }, []);

  static getProjections = (normal, vertices) =>
    Object.values(vertices).reduce(
      (projection, vertex) => {
        const dot = this.dotProduct(normal, vertex)
        return {
          ...projection,
          min: Math.min(projection.min, dot),
          max: Math.max(projection.max, dot)
        }
      },
      { min: Infinity, max: -Infinity }
    );

  static getCircleAxes = (circle, polygon) => {
    const axes = [];
    polygon.vertices.forEach((v, i, l) => {
      axes.push(this.normalizeVector({ x: v.x - circle.x, y: v.y - circle.y }));
    })
    return axes;
  };

  // https://github.com/leondejong/js-sat
  static circleToPolygon = (a, b) => {
    const v = b.vertices
    const normals = [...this.getNormals(this.getEdges(v)), ...this.getCircleAxes(a, b)]
    let mtv = { x: Infinity, y: Infinity }

    const overlap = normals.every(n => {
      const dot = this.dotProduct(n, { x: a.x, y: a.y });
      const p1 = { min: dot - a.radius, max: dot + a.radius };
      const p2 = this.getProjections(n, v);
      const c1 = p1.min < p2.max && p1.min > p2.min;
      const c2 = p2.min < p1.max && p2.min > p1.min;

      if (c1 || c2) {
        let m = Infinity;
        if (c1) {
          m = p2.max - p1.min;
        } else if (c2) {
          m = p2.min - p1.max;
        }
        const vector = { x: n.x * m, y: n.y * m };
        if (this.magnitude(vector) < this.magnitude(mtv)) {
          mtv = vector // minimum translation vector
        }
      }

      return c1 || c2;
    })

    return { overlap, mtv: overlap ? mtv : { x: 0, y: 0 } };
  };

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