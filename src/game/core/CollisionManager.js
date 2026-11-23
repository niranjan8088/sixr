/**
 * Lightweight, high-performance collision manager for browser 3D games.
 * Handles AABB (Axis-Aligned Bounding Box) for buildings, circles for debris, and world perimeter bounds.
 * Provides smooth sliding collision resolution to prevent sticking to walls.
 */
export class CollisionManager {
  constructor() {
    this.boxes = [];
    this.cylinders = [];
    this.worldBounds = {
      minX: -65,
      maxX: 65,
      minZ: -75,
      maxZ: 35
    };
  }

  /**
   * Register a building or wall AABB [minX, minZ, maxX, maxZ]
   */
  addBox(minX, minZ, maxX, maxZ, label = 'obstacle') {
    this.boxes.push({ minX, minZ, maxX, maxZ, label });
  }

  /**
   * Register a cylinder/round obstacle [x, z, radius]
   */
  addCylinder(x, z, radius, label = 'prop') {
    this.cylinders.push({ x, z, radius, label });
  }

  /**
   * Clears registered colliders
   */
  clear() {
    this.boxes = [];
    this.cylinders = [];
  }

  /**
   * Check candidate position against colliders and resolve penetration with wall sliding.
   * Returns adjusted [x, y, z] position.
   */
  resolveCollision(currentPos, targetPos, playerRadius = 0.5) {
    let resolvedX = targetPos[0];
    let resolvedZ = targetPos[2];

    // 1. World boundary clamping
    resolvedX = Math.max(this.worldBounds.minX + playerRadius, Math.min(this.worldBounds.maxX - playerRadius, resolvedX));
    resolvedZ = Math.max(this.worldBounds.minZ + playerRadius, Math.min(this.worldBounds.maxZ - playerRadius, resolvedZ));

    // 2. AABB Boxes (Buildings and walls)
    // First test X movement independently for smooth wall sliding
    for (let i = 0; i < this.boxes.length; i++) {
      const box = this.boxes[i];
      if (
        resolvedX + playerRadius > box.minX &&
        resolvedX - playerRadius < box.maxX &&
        currentPos[2] + playerRadius > box.minZ &&
        currentPos[2] - playerRadius < box.maxZ
      ) {
        resolvedX = currentPos[0];
        break;
      }
    }

    // Next test Z movement independently
    for (let i = 0; i < this.boxes.length; i++) {
      const box = this.boxes[i];
      if (
        resolvedX + playerRadius > box.minX &&
        resolvedX - playerRadius < box.maxX &&
        resolvedZ + playerRadius > box.minZ &&
        resolvedZ - playerRadius < box.maxZ
      ) {
        resolvedZ = currentPos[2];
        break;
      }
    }

    // 3. Cylindrical obstacles (Rubble, pillars, streetlights)
    for (let i = 0; i < this.cylinders.length; i++) {
      const c = this.cylinders[i];
      const dx = resolvedX - c.x;
      const dz = resolvedZ - c.z;
      const minDist = playerRadius + c.radius;
      const distSq = dx * dx + dz * dz;

      if (distSq < minDist * minDist && distSq > 0.0001) {
        const dist = Math.sqrt(distSq);
        const overlap = minDist - dist;
        const nx = dx / dist;
        const nz = dz / dist;
        resolvedX += nx * overlap;
        resolvedZ += nz * overlap;
      }
    }

    return [resolvedX, targetPos[1], resolvedZ];
  }
}

// Global collision instance for the game
export const globalCollisions = new CollisionManager();

