import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GameConfig } from './GameConfig';
import { globalInput } from './core/InputManager';
import { globalCollisions } from './core/CollisionManager';
import { useGameStore } from '../store/gameStore';
import { GAME_PHASES } from '../utils/constants';

export default function Player() {
  const groupRef = useRef();
  const bodyRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const headRef = useRef();

  const phase = useGameStore((state) => state.phase);
  const activeRescueSurvivor = useGameStore((state) => state.activeRescueSurvivor);
  const cameraYaw = useGameStore((state) => state.cameraRotation.yaw);
  const updatePlayerPosition = useGameStore((state) => state.updatePlayerPosition);

  // Local state for smooth physics & animations
  const position = useRef(new THREE.Vector3(...GameConfig.player.spawnPosition));
  const rotation = useRef(0);
  const currentSpeed = useRef(0);
  const animTime = useRef(0);
  const [stamina, setStamina] = useState(GameConfig.player.maxStamina);

  // Sync initial position and handle mission restart
  useEffect(() => {
    if (phase === GAME_PHASES.MENU || phase === GAME_PHASES.BRIEFING) {
      position.current.set(...GameConfig.player.spawnPosition);
      rotation.current = 0;
      currentSpeed.current = 0;
      setStamina(GameConfig.player.maxStamina);
      if (groupRef.current) {
        groupRef.current.position.copy(position.current);
        groupRef.current.rotation.y = 0;
      }
    }
  }, [phase]);

  useFrame((state, delta) => {
    // Only update movement during active phases without modal dialogs
    if (
      (phase !== GAME_PHASES.PLAYING && phase !== GAME_PHASES.EXTRACTION) ||
      activeRescueSurvivor
    ) {
      return;
    }

    const dt = Math.min(delta, 0.1);

    const keys = globalInput.keys;
    let moveX = 0;
    let moveZ = 0;

    if (keys.forward) moveZ -= 1;
    if (keys.backward) moveZ += 1;
    if (keys.left) moveX -= 1;
    if (keys.right) moveX += 1;

    const isMoving = moveX !== 0 || moveZ !== 0;

    // Stamina & Sprint management
    let isSprinting = false;
    let currentStamina = stamina;

    if (keys.sprint && isMoving && currentStamina > 5) {
      isSprinting = true;
      currentStamina = Math.max(0, currentStamina - GameConfig.player.staminaDrainRate * dt);
    } else {
      currentStamina = Math.min(GameConfig.player.maxStamina, currentStamina + GameConfig.player.staminaRecoveryRate * dt);
    }
    setStamina(currentStamina);

    const targetSpeed = isMoving ? (isSprinting ? GameConfig.player.sprintSpeed : GameConfig.player.walkSpeed) : 0;
    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed, 12 * dt);

    if (isMoving) {
      // Calculate movement vector relative to camera yaw
      const moveVec = new THREE.Vector2(moveX, moveZ).normalize();

      const cosYaw = Math.cos(cameraYaw);
      const sinYaw = Math.sin(cameraYaw);

      const worldMoveX = moveVec.x * cosYaw + moveVec.y * sinYaw;
      const worldMoveZ = -moveVec.x * sinYaw + moveVec.y * cosYaw;

      // Target character rotation angle
      const targetAngle = Math.atan2(worldMoveX, worldMoveZ);

      // Smoothly interpolate angle
      const diff = Math.atan2(Math.sin(targetAngle - rotation.current), Math.cos(targetAngle - rotation.current));
      rotation.current += diff * Math.min(1, GameConfig.player.rotationSpeed * dt);

      // Candidate new position
      const stepDist = currentSpeed.current * dt;
      const candidatePos = [
        position.current.x + worldMoveX * stepDist,
        0,
        position.current.z + worldMoveZ * stepDist
      ];

      // Resolve collisions
      const resolved = globalCollisions.resolveCollision(
        [position.current.x, position.current.y, position.current.z],
        candidatePos,
        GameConfig.player.radius
      );

      position.current.set(resolved[0], 0, resolved[2]);
    }

    // Apply to Three.js Object3D
    if (groupRef.current) {
      groupRef.current.position.copy(position.current);
      groupRef.current.rotation.y = rotation.current;
    }

    // Procedural Walking/Running Animation
    if (isMoving) {
      animTime.current += dt * (isSprinting ? 14 : 9);
      const swing = Math.sin(animTime.current) * (isSprinting ? 0.75 : 0.45);
      const bob = Math.abs(Math.sin(animTime.current * 2)) * (isSprinting ? 0.08 : 0.04);

      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.9;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.9;
      if (bodyRef.current) {
        bodyRef.current.position.y = 1.05 + bob;
        bodyRef.current.rotation.x = isSprinting ? 0.15 : 0.04;
      }
    } else {
      // Idle return to rest
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 10 * dt);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 10 * dt);
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 10 * dt);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 10 * dt);
      if (bodyRef.current) {
        bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, 1.05, 10 * dt);
        bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, 0, 10 * dt);
      }
    }

    updatePlayerPosition(
      [position.current.x, position.current.y, position.current.z],
      rotation.current,
      isMoving,
      isSprinting,
      currentStamina
    );
  });

  return (
    <group ref={groupRef}>
      {/* Dynamic Player Shadow Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.65, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.55} />
      </mesh>

      {/* Main Body Hierarchy */}
      <group ref={bodyRef} position={[0, 1.05, 0]}>
        {/* 1. Torso: Heavy Weatherproof Tactical Rescue Jacket */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.56, 0.68, 0.34]} />
          <meshStandardMaterial color="#e05814" roughness={0.45} metalness={0.15} />
        </mesh>

        {/* Ballistic Kevlar Chest Rig / Utility Vest */}
        <mesh position={[0, 0.03, 0.1]}>
          <boxGeometry args={[0.5, 0.52, 0.2]} />
          <meshStandardMaterial color="#1a2028" roughness={0.7} metalness={0.3} />
        </mesh>

        {/* High-Vis Reflective Safety Bands (Front) */}
        <mesh position={[0, 0.16, 0.205]}>
          <planeGeometry args={[0.48, 0.07]} />
          <meshBasicMaterial color="#e6ff00" />
        </mesh>
        <mesh position={[0, -0.12, 0.205]}>
          <planeGeometry args={[0.48, 0.07]} />
          <meshBasicMaterial color="#e6ff00" />
        </mesh>

        {/* High-Vis Reflective Safety Bands (Back) */}
        <mesh position={[0, 0.16, -0.175]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.48, 0.07]} />
          <meshBasicMaterial color="#e6ff00" />
        </mesh>

        {/* 2. Tactical Rescue Rig / Backpack */}
        <group position={[0, 0.05, -0.24]}>
          {/* Main Rig Frame */}
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.42, 0.48, 0.18]} />
            <meshStandardMaterial color="#181e26" roughness={0.4} metalness={0.7} />
          </mesh>

          {/* Twin High-Pressure Oxygen / Power Cylinders */}
          <mesh position={[-0.13, 0, 0.02]}>
            <cylinderGeometry args={[0.075, 0.075, 0.44, 12]} />
            <meshStandardMaterial color="#00bcd4" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0.13, 0, 0.02]}>
            <cylinderGeometry args={[0.075, 0.075, 0.44, 12]} />
            <meshStandardMaterial color="#00bcd4" roughness={0.2} metalness={0.8} />
          </mesh>

          {/* Glowing Telemetry Battery Bar */}
          <mesh position={[0, 0.06, -0.095]}>
            <planeGeometry args={[0.14, 0.22]} rotation={[0, Math.PI, 0]} />
            <meshBasicMaterial color="#00ffcc" />
          </mesh>
        </group>

        {/* 3. Shoulder Mounts & Lights */}
        {/* Left Shoulder: Radio Comms & Strobe LED */}
        <group position={[-0.26, 0.34, -0.02]}>
          <mesh>
            <boxGeometry args={[0.09, 0.12, 0.1]} />
            <meshStandardMaterial color="#12161c" />
          </mesh>
          {/* Flexible Antenna */}
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.015, 0.02, 0.28, 6]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          {/* Strobe LED */}
          <mesh position={[0, 0.04, 0.05]}>
            <boxGeometry args={[0.06, 0.06, 0.03]} />
            <meshBasicMaterial color="#ff3300" />
          </mesh>
          <pointLight color="#ff3300" intensity={1.5} distance={3.5} />
        </group>

        {/* Right Shoulder: Tactical LED Worklight */}
        <group position={[0.26, 0.34, 0.02]}>
          <mesh>
            <boxGeometry args={[0.08, 0.08, 0.12]} />
            <meshStandardMaterial color="#12161c" />
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <circleGeometry args={[0.04, 10]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* 4. Head & Search-And-Rescue Helmet */}
        <group ref={headRef} position={[0, 0.48, 0]}>
          {/* Ballistic SAR Helmet */}
          <mesh castShadow position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.23, 20, 20]} />
            <meshStandardMaterial color="#222933" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Chin Guard / Rebreather Mask */}
          <mesh position={[0, -0.1, 0.14]}>
            <boxGeometry args={[0.22, 0.15, 0.16]} />
            <meshStandardMaterial color="#14181f" roughness={0.6} metalness={0.4} />
          </mesh>

          {/* Reflective Gold/Amber Visor */}
          <mesh position={[0, 0.04, 0.16]}>
            <boxGeometry args={[0.28, 0.14, 0.12]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.08} metalness={0.95} />
          </mesh>

          {/* Helmet Searchlight Beam */}
          <mesh position={[0, 0.18, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.06, 0.09, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <spotLight
            position={[0, 0.18, 0.28]}
            target-position={[0, -0.5, 9]}
            angle={0.42}
            penumbra={0.5}
            intensity={4.5}
            distance={20}
            color="#fff8eb"
            castShadow
          />
        </group>

        {/* 5. Left Arm & Tactical Gauntlet */}
        <group ref={leftArmRef} position={[-0.35, 0.24, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[0.15, 0.46, 0.15]} />
            <meshStandardMaterial color="#222933" roughness={0.6} />
          </mesh>
          {/* Rescue Gauntlet & Wrist Data-Pad */}
          <mesh position={[0, -0.38, 0]}>
            <boxGeometry args={[0.17, 0.18, 0.17]} />
            <meshStandardMaterial color="#e05814" roughness={0.5} />
          </mesh>
          {/* Glowing Wrist Interface */}
          <mesh position={[0, -0.38, 0.09]}>
            <planeGeometry args={[0.1, 0.08]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
        </group>

        {/* 6. Right Arm & Tactical Gauntlet */}
        <group ref={rightArmRef} position={[0.35, 0.24, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[0.15, 0.46, 0.15]} />
            <meshStandardMaterial color="#222933" roughness={0.6} />
          </mesh>
          {/* Rescue Gauntlet */}
          <mesh position={[0, -0.38, 0]}>
            <boxGeometry args={[0.17, 0.18, 0.17]} />
            <meshStandardMaterial color="#e05814" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* 7. Heavy Tactical Trousers & Combat Boots */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.15, 0.65, 0]}>
        <mesh position={[0, -0.34, 0]}>
          <boxGeometry args={[0.17, 0.66, 0.19]} />
          <meshStandardMaterial color="#1a2028" roughness={0.7} />
        </mesh>
        {/* Reinforced Knee Pad */}
        <mesh position={[0, -0.26, 0.1]}>
          <boxGeometry args={[0.18, 0.16, 0.06]} />
          <meshStandardMaterial color="#11151a" roughness={0.8} />
        </mesh>
        {/* Heavy Rescue Combat Boot */}
        <mesh position={[0, -0.62, 0.06]}>
          <boxGeometry args={[0.19, 0.16, 0.32]} />
          <meshStandardMaterial color="#0d1014" roughness={0.9} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.15, 0.65, 0]}>
        <mesh position={[0, -0.34, 0]}>
          <boxGeometry args={[0.17, 0.66, 0.19]} />
          <meshStandardMaterial color="#1a2028" roughness={0.7} />
        </mesh>
        {/* Reinforced Knee Pad */}
        <mesh position={[0, -0.26, 0.1]}>
          <boxGeometry args={[0.18, 0.16, 0.06]} />
          <meshStandardMaterial color="#11151a" roughness={0.8} />
        </mesh>
        {/* Heavy Rescue Combat Boot */}
        <mesh position={[0, -0.62, 0.06]}>
          <boxGeometry args={[0.19, 0.16, 0.32]} />
          <meshStandardMaterial color="#0d1014" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
