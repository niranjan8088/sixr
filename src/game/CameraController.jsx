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
  const pitch = useRef(0.2);
  const currentPos = useRef(new THREE.Vector3(0, 5, 25));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.5, 18));
  const isPointerLocked = useRef(false);

  const playerPosition = useGameStore((state) => state.player.position);
  const setCameraRotation = useGameStore((state) => state.setCameraRotation);

  useEffect(() => {
    const domElement = gl.domElement;

    // Optional pointer lock on canvas click
    const handleCanvasClick = () => {
      if (document.pointerLockElement !== domElement) {
        domElement.requestPointerLock?.();
      }
    };

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === domElement;
    };

    domElement.addEventListener('click', handleCanvasClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    // Initial camera placement
    camera.position.set(playerPosition[0], playerPosition[1] + 3, playerPosition[2] + 6);
    camera.lookAt(playerPosition[0], playerPosition[1] + 1.5, playerPosition[2]);

    return () => {
      domElement.removeEventListener('click', handleCanvasClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [gl, camera]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);

    // Consume mouse movement
    const { dx, dy } = globalInput.consumeMouseDelta();

    if (dx !== 0 || dy !== 0) {
      yaw.current -= dx * GameConfig.camera.mouseSensitivity;
      pitch.current += dy * GameConfig.camera.mouseSensitivity;

      // Clamp pitch to avoid ground flipping or going straight down
      pitch.current = THREE.MathUtils.clamp(
        pitch.current,
        GameConfig.camera.minPitch,
        GameConfig.camera.maxPitch
      );

      // Keep yaw normalized between -PI and PI
      if (yaw.current > Math.PI) yaw.current -= Math.PI * 2;
      if (yaw.current < -Math.PI) yaw.current += Math.PI * 2;

      // Sync yaw with store for UI radar/compass
      setCameraRotation(yaw.current, pitch.current);
    }

    // Target positions
    const targetPlayerPos = new THREE.Vector3(
      playerPosition[0],
      playerPosition[1],
      playerPosition[2]
    );

    const camDistance = GameConfig.camera.distance;
    const camHeight = GameConfig.camera.height;

    // Calculate spherical camera offset
    const cosPitch = Math.cos(pitch.current);
    const sinPitch = Math.sin(pitch.current);
    const sinYaw = Math.sin(yaw.current);
    const cosYaw = Math.cos(yaw.current);

    // Offset position from player
    const targetCamX = targetPlayerPos.x + sinYaw * cosPitch * camDistance;
    const targetCamY = Math.max(0.6, targetPlayerPos.y + camHeight + sinPitch * camDistance);
    const targetCamZ = targetPlayerPos.z + cosYaw * cosPitch * camDistance;

    // Target Look-At center (chest/head level of player)
    const targetLookX = targetPlayerPos.x;
    const targetLookY = targetPlayerPos.y + GameConfig.camera.lookAtHeightOffset;
    const targetLookZ = targetPlayerPos.z;

    // Smooth camera motion
    currentPos.current.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 12 * dt);
    currentLookAt.current.lerp(new THREE.Vector3(targetLookX, targetLookY, targetLookZ), 15 * dt);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
