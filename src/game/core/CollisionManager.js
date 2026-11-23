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
   * Prevents duplicates if registered with the same label.
   */
  addBox(x1, z1, x2, z2, label = 'obstacle') {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minZ = Math.min(z1, z2);
    const maxZ = Math.max(z1, z2);
    const existingIdx = this.boxes.findIndex((b) => b.label === label);
    if (existingIdx !== -1) {
      this.boxes[existingIdx] = { minX, minZ, maxX, maxZ, label };
    } else {
      this.boxes.push({ minX, minZ, maxX, maxZ, label });
    }
    return () => this.removeBox(label);
  }

  /**
   * Register a cylinder/round obstacle [x, z, radius]
   * Prevents duplicates if registered with the same label.
   */
  addCylinder(x, z, radius, label = 'prop') {
    const existingIdx = this.cylinders.findIndex((c) => c.label === label);
    if (existingIdx !== -1) {
      this.cylinders[existingIdx] = { x, z, radius, label };
    } else {
      this.cylinders.push({ x, z, radius, label });
    }
    return () => this.removeCylinder(label);
  }

  removeBox(label) {
    this.boxes = this.boxes.filter((b) => b.label !== label);
  }

  removeCylinder(label) {
    this.cylinders = this.cylinders.filter((c) => c.label !== label);
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

