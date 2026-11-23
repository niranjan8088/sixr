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
  const pitch = useRef(0.18);
  const currentPos = useRef(new THREE.Vector3(0, 3.5, 23));
  const currentLookAt = useRef(new THREE.Vector3(0.3, 1.4, 18));
  const isPointerLocked = useRef(false);

  const playerPosition = useGameStore((state) => state.player.position);
  const phase = useGameStore((state) => state.phase);
  const activeRescueSurvivor = useGameStore((state) => state.activeRescueSurvivor);
  const setCameraRotation = useGameStore((state) => state.setCameraRotation);

  // Reset camera view angle on menu / restart
  useEffect(() => {
    if (phase === 'MENU' || phase === 'BRIEFING') {
      yaw.current = 0;
      pitch.current = 0.18;
      setCameraRotation(0, 0.18);
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
    camera.position.set(playerPosition[0] + 0.4, playerPosition[1] + 2.4, playerPosition[2] + 4.2);
    camera.lookAt(playerPosition[0] + 0.3, playerPosition[1] + 1.4, playerPosition[2]);

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

      // Clamp pitch to avoid ground clipping or zenith flip
      pitch.current = THREE.MathUtils.clamp(
        pitch.current,
        GameConfig.camera.minPitch,
        GameConfig.camera.maxPitch
      );

      // Normalize yaw
      if (yaw.current > Math.PI) yaw.current -= Math.PI * 2;
      if (yaw.current < -Math.PI) yaw.current += Math.PI * 2;

      setCameraRotation(yaw.current, pitch.current);
    }

    // GTA-style Over-The-Shoulder Camera Framing
    const targetPlayerPos = new THREE.Vector3(
      playerPosition[0],
      playerPosition[1],
      playerPosition[2]
    );

    const camDistance = 3.8; // Snug, action-oriented distance
    const camHeight = 1.85;  // Slightly above eye level
    const shoulderOffset = 0.45; // Right-shoulder GTA offset

    const cosPitch = Math.cos(pitch.current);
    const sinPitch = Math.sin(pitch.current);
    const sinYaw = Math.sin(yaw.current);
    const cosYaw = Math.cos(yaw.current);

    // Right-hand perpendicular vector for shoulder offset
    const rightX = cosYaw;
    const rightZ = -sinYaw;

    // Camera 3D coordinates
    const targetCamX = targetPlayerPos.x + sinYaw * cosPitch * camDistance + rightX * shoulderOffset;
    const targetCamY = Math.max(0.65, targetPlayerPos.y + camHeight + sinPitch * camDistance);
    const targetCamZ = targetPlayerPos.z + cosYaw * cosPitch * camDistance + rightZ * shoulderOffset;

    // Look-At Target (Slightly to the right of upper spine for over-the-shoulder framing)
    const targetLookX = targetPlayerPos.x + rightX * (shoulderOffset * 0.4);
    const targetLookY = targetPlayerPos.y + 1.35;
    const targetLookZ = targetPlayerPos.z + rightZ * (shoulderOffset * 0.4);

    // Smooth cinematic damping
    currentPos.current.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 14 * dt);
    currentLookAt.current.lerp(new THREE.Vector3(targetLookX, targetLookY, targetLookZ), 18 * dt);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
