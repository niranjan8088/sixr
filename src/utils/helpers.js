// General utility helpers

/**
 * Calculates Euclidean 2D distance on the X-Z ground plane
 */
export function getDistance2D(posA, posB) {
  const dx = posA[0] - posB[0];
  const dz = posA[2] - posB[2];
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Clamps a number between min and max
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Linear interpolation
 */
export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/**
 * Formats seconds into MM:SS format
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Calculates letter grade based on final score
 */
export function calculateRank(score) {
  if (score >= 900) return 'S';
  if (score >= 750) return 'A';
  if (score >= 600) return 'B';
  if (score >= 450) return 'C';
  return 'D';
}

