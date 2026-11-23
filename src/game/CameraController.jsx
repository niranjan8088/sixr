import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GameConfig } from './GameConfig';
import { globalInput } from './core/InputManager';
import { globalCollisions } from './core/CollisionManager';
import { useGameStore } from '../store/gameStore';

export default function CameraController() {
  const { camera, gl } = useThree();

  // Camera state refs
  const yaw = useRef(0);
  const pitch = useRef(0.08); // Slight downward angle showing player and road ahead
  const currentPos = useRef(new THREE.Vector3(0, 3.0, 20));
  const currentLookAt = useRef(new THREE.Vector3(0.15, 1.3, 16));
  const isPointerLocked = useRef(false);

  const playerPosition = useGameStore((state) => state.player.position);
  const phase = useGameStore((state) => state.phase);
  const activeRescueSurvivor = useGameStore((state) => state.activeRescueSurvivor);
  const setCameraRotation = useGameStore((state) => state.setCameraRotation);

  // Reset camera view angle on menu / restart
  useEffect(() => {
    if (phase === 'MENU' || phase === 'BRIEFING') {
      yaw.current = 0;
      pitch.current = 0.08;
      setCameraRotation(0, 0.08);
    }
  }, [phase, setCameraRotation]);

  useEffect(() => {
    const domElement = gl.domElement;

    // Pointer lock on canvas click only during active gameplay without modal dialogs
    const handleCanvasClick = () => {
      const currentPhase = useGameStore.getState().phase;
      const isModalOpen = Boolean(useGameStore.getState().activeRescueSurvivor);
      if (
        (currentPhase === 'PLAYING' || currentPhase === 'EXTRACTION') &&
        !isModalOpen
      ) {
        if (document.pointerLockElement !== domElement) {
          domElement.requestPointerLock?.();
        }
      }
    };

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === domElement;
    };

    domElement.addEventListener('click', handleCanvasClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    // Initial camera placement
    camera.position.set(playerPosition[0] + 0.45, playerPosition[1] + 1.85, playerPosition[2] + 4.5);
    camera.lookAt(playerPosition[0] + 0.2, playerPosition[1] + 1.25, playerPosition[2]);

    return () => {
      domElement.removeEventListener('click', handleCanvasClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [gl, camera]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);

    // If modal is active, do not rotate camera
    if (activeRescueSurvivor) {
      globalInput.consumeMouseDelta();
      return;
    }

    // Consume mouse movement
    const { dx, dy } = globalInput.consumeMouseDelta();

    if (dx !== 0 || dy !== 0) {
      yaw.current -= dx * GameConfig.camera.mouseSensitivity;
      pitch.current += dy * GameConfig.camera.mouseSensitivity;

      // Clamp pitch for natural third-person gameplay
      pitch.current = THREE.MathUtils.clamp(
        pitch.current,
        -0.35,
        0.75
      );

      // Normalize yaw
      if (yaw.current > Math.PI) yaw.current -= Math.PI * 2;
      if (yaw.current < -Math.PI) yaw.current += Math.PI * 2;

      setCameraRotation(yaw.current, pitch.current);
    }

    // Spacious GTA V Style Third-Person Camera Framing (Eliminates character obstruction)
    const targetPlayerPos = new THREE.Vector3(
      playerPosition[0],
      playerPosition[1],
      playerPosition[2]
    );

    let camDistance = 4.4; // Pulled back for wide situational awareness and unobstructed road view
    const camHeight = 1.85;
    const shoulderOffset = 0.45; // Shifts character smoothly to left-center

    const cosPitch = Math.cos(pitch.current);
    const sinPitch = Math.sin(pitch.current);
    const sinYaw = Math.sin(yaw.current);
    const cosYaw = Math.cos(yaw.current);

    // Perpendicular vector for shoulder offset
    const rightX = cosYaw;
    const rightZ = -sinYaw;

    // Check building bounding box collision to prevent camera clipping through walls
    let targetCamX = targetPlayerPos.x + sinYaw * cosPitch * camDistance + rightX * shoulderOffset;
    let targetCamZ = targetPlayerPos.z + cosYaw * cosPitch * camDistance + rightZ * shoulderOffset;

    for (let i = 0; i < globalCollisions.boxes.length; i++) {
      const b = globalCollisions.boxes[i];
      if (
        targetCamX > b.minX - 0.5 &&
        targetCamX < b.maxX + 0.5 &&
        targetCamZ > b.minZ - 0.5 &&
        targetCamZ < b.maxZ + 0.5
      ) {
        camDistance = 2.4; // Pull camera closer when near buildings
        targetCamX = targetPlayerPos.x + sinYaw * cosPitch * camDistance + rightX * (shoulderOffset * 0.6);
        targetCamZ = targetPlayerPos.z + cosYaw * cosPitch * camDistance + rightZ * (shoulderOffset * 0.6);
        break;
      }
    }

    const isMoving = useGameStore.getState().player.isMoving;
    const isSprinting = useGameStore.getState().player.isSprinting;
    const bob = isMoving ? Math.sin(state.clock.getElapsedTime() * (isSprinting ? 12 : 8)) * (isSprinting ? 0.035 : 0.018) : 0;
    const targetCamY = Math.max(0.7, targetPlayerPos.y + camHeight + sinPitch * camDistance + bob);

    // Look-At Target (Upper back / eye level)
    const targetLookX = targetPlayerPos.x + rightX * (shoulderOffset * 0.2);
    const targetLookY = targetPlayerPos.y + 1.25;
    const targetLookZ = targetPlayerPos.z + rightZ * (shoulderOffset * 0.2);

    // Smooth cinematic tracking
    currentPos.current.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 12 * dt);
    currentLookAt.current.lerp(new THREE.Vector3(targetLookX, targetLookY, targetLookZ), 16 * dt);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

