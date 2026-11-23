import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GameConfig } from './GameConfig';
import { globalInput } from './core/InputManager';
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
    camera.position.set(playerPosition[0] + 0.32, playerPosition[1] + 1.6, playerPosition[2] + 2.8);
    camera.lookAt(playerPosition[0] + 0.15, playerPosition[1] + 1.3, playerPosition[2]);

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

    // Close Third-Person Over-The-Shoulder Camera Framing (Exact Match to User Reference Image 4)
    const targetPlayerPos = new THREE.Vector3(
      playerPosition[0],
      playerPosition[1],
      playerPosition[2]
    );

    const camDistance = 2.8; // Close, cinematic survival distance showing backpack & road
    const camHeight = 1.62;
    const shoulderOffset = 0.32; // Over the right shoulder

    const cosPitch = Math.cos(pitch.current);
    const sinPitch = Math.sin(pitch.current);
    const sinYaw = Math.sin(yaw.current);
    const cosYaw = Math.cos(yaw.current);

    // Perpendicular vector for shoulder offset
    const rightX = cosYaw;
    const rightZ = -sinYaw;

    // Target Camera 3D coordinates
    const targetCamX = targetPlayerPos.x + sinYaw * cosPitch * camDistance + rightX * shoulderOffset;
    const isMoving = useGameStore.getState().player.isMoving;
    const isSprinting = useGameStore.getState().player.isSprinting;
    const bob = isMoving ? Math.sin(state.clock.getElapsedTime() * (isSprinting ? 12 : 8)) * (isSprinting ? 0.04 : 0.02) : 0;
    const targetCamY = Math.max(0.65, targetPlayerPos.y + camHeight + sinPitch * camDistance + bob);
    const targetCamZ = targetPlayerPos.z + cosYaw * cosPitch * camDistance + rightZ * shoulderOffset;

    // Look-At Target (Upper back / neck center with subtle right offset)
    const targetLookX = targetPlayerPos.x + rightX * (shoulderOffset * 0.25);
    const targetLookY = targetPlayerPos.y + 1.32;
    const targetLookZ = targetPlayerPos.z + rightZ * (shoulderOffset * 0.25);

    // Smooth cinematic tracking
    currentPos.current.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 14 * dt);
    currentLookAt.current.lerp(new THREE.Vector3(targetLookX, targetLookY, targetLookZ), 18 * dt);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
