/**
 * AFTERLIGHT — Player.jsx
 * OWNER: Niranjan
 *
 * First-person player controller with WASD movement and mouse look.
 * Syncs player position to gameStore every frame.
 *
 * Interface contract with gameplay systems:
 *   - Call useGameStore(s => s.setPlayerPosition)([x, y, z]) every frame.
 *   - Spawn position: [0, 0, 0] (Y=0 is ground level)
 *   - Movement speed: ~5 units/sec
 *
 * This is a fully working placeholder. Niranjan can replace with
 * a richer controller (pointer lock, collision, etc.).
 */

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../systems/gameStore.js';

const SPEED      = 5;
const MOVE_KEYS  = { KeyW: 'fwd', KeyS: 'bwd', KeyA: 'left', KeyD: 'right' };

export default function Player() {
  const { camera } = useThree();
  const setPos     = useGameStore(s => s.setPlayerPosition);
  const phase      = useGameStore(s => s.phase);
  const controlsRef = useRef();

  const keys = useRef({});

  // Set initial camera position
  useEffect(() => {
    camera.position.set(0, 1.6, 0);
  }, [camera]);

  // Key listeners
  useEffect(() => {
    const down = e => { if (MOVE_KEYS[e.code]) keys.current[e.code] = true; };
    const up   = e => { if (MOVE_KEYS[e.code]) keys.current[e.code] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup',   up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup',   up);
    };
  }, []);

  useFrame((_, delta) => {
    if (phase === 'menu' || phase === 'complete') return;
    if (!controlsRef.current?.isLocked) return;

    const velocity = new THREE.Vector3();
    const fwd  = new THREE.Vector3();
    const right = new THREE.Vector3();

    camera.getWorldDirection(fwd);
    fwd.y = 0;
    fwd.normalize();
    right.crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();

    if (keys.current.KeyW) velocity.add(fwd);
    if (keys.current.KeyS) velocity.sub(fwd);
    if (keys.current.KeyD) velocity.add(right);
    if (keys.current.KeyA) velocity.sub(right);

    if (velocity.length() > 0) {
      velocity.normalize().multiplyScalar(SPEED * delta);
      camera.position.add(velocity);
      camera.position.y = 1.6; // keep at eye height
    }

    // Sync to store
    setPos([camera.position.x, camera.position.y, camera.position.z]);
  });

  if (phase === 'menu' || phase === 'complete') return null;

  return (
    <PointerLockControls
      ref={controlsRef}
      selector="#game-canvas-click"
    />
  );
}
