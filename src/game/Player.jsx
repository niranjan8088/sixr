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
      {/* Soft Ground Contact Shadow */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.65, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.45} />
      </mesh>

      {/* Main Body Hierarchy */}
      <group ref={bodyRef} position={[0, 1.05, 0]}>
        {/* 1. Torso: Tactical Field Shirt & Harness (Modeled from User Image 4) */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.54, 0.68, 0.32]} />
          <meshStandardMaterial color="#424c3a" roughness={0.7} metalness={0.1} />
        </mesh>

        {/* Tactical Chest Harness / Utility Straps */}
        <mesh position={[0, 0.04, 0.165]}>
          <boxGeometry args={[0.46, 0.48, 0.04]} />
          <meshStandardMaterial color="#2d3027" roughness={0.8} />
        </mesh>

        {/* High-Vis Orange Collar & Rescue Trim */}
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.32, 0.12, 0.3]} />
          <meshStandardMaterial color="#d45019" roughness={0.6} />
        </mesh>

        {/* ================================================================
            2. EXPEDITION SURVIVAL BACKPACK (Modeled directly from Image 4!)
            Large olive military backpack with rolled bottom sleeping tarp
           ================================================================ */}
        <group position={[0, 0.02, -0.25]}>
          {/* Main Olive Expedition Pack */}
          <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
            <boxGeometry args={[0.44, 0.58, 0.24]} />
            <meshStandardMaterial color="#505a45" roughness={0.8} metalness={0.1} />
          </mesh>

          {/* Backpack Flap / Pouch */}
          <mesh position={[0, 0.25, -0.06]}>
            <boxGeometry args={[0.38, 0.18, 0.16]} />
            <meshStandardMaterial color="#414937" roughness={0.85} />
          </mesh>

          {/* Vertical Compression Webbing Straps */}
          {[-0.12, 0.12].map((x) => (
            <mesh key={`strap-${x}`} position={[x, 0.08, -0.125]}>
              <boxGeometry args={[0.035, 0.54, 0.015]} />
              <meshStandardMaterial color="#282a24" />
            </mesh>
          ))}

          {/* Rolled Survival Bedroll / Tarp Strapped at Bottom (Just like in Image 4!) */}
          <mesh position={[0, -0.28, -0.04]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.48, 14]} />
            <meshStandardMaterial color="#363d30" roughness={0.85} />
          </mesh>

          {/* Side Canteen / Radio Attachment */}
          <mesh position={[0.24, 0.05, 0]}>
            <boxGeometry args={[0.08, 0.24, 0.14]} />
            <meshStandardMaterial color="#222620" />
          </mesh>
        </group>

        {/* 3. Head & Hair / Tactical Headband */}
        <group ref={headRef} position={[0, 0.48, 0]}>
          {/* Head */}
          <mesh castShadow position={[0, 0, 0]}>
            <sphereGeometry args={[0.2, 18, 18]} />
            <meshStandardMaterial color="#c7ab8f" roughness={0.6} />
          </mesh>
          {/* Dark Hair (Pulled back survivor cut like Image 4) */}
          <mesh position={[0, 0.06, -0.04]}>
            <sphereGeometry args={[0.21, 16, 16]} />
            <meshStandardMaterial color="#241e1a" roughness={0.8} />
          </mesh>
          {/* Hair Bun / Tail */}
          <mesh position={[0, 0.08, -0.2]}>
            <sphereGeometry args={[0.08, 10, 10]} />
            <meshStandardMaterial color="#241e1a" roughness={0.8} />
          </mesh>
        </group>

        {/* 4. Left Arm & Glove */}
        <group ref={leftArmRef} position={[-0.34, 0.22, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[0.14, 0.46, 0.14]} />
            <meshStandardMaterial color="#424c3a" roughness={0.7} />
          </mesh>
          {/* Tactical Rescue Glove */}
          <mesh position={[0, -0.38, 0]}>
            <boxGeometry args={[0.16, 0.16, 0.16]} />
            <meshStandardMaterial color="#262b22" roughness={0.6} />
          </mesh>
        </group>

        {/* 5. Right Arm & Glove */}
        <group ref={rightArmRef} position={[0.34, 0.22, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[0.14, 0.46, 0.14]} />
            <meshStandardMaterial color="#424c3a" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.38, 0]}>
            <boxGeometry args={[0.16, 0.16, 0.16]} />
            <meshStandardMaterial color="#262b22" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* 6. Tactical Cargo Trousers & Heavy Boots */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.15, 0.65, 0]}>
        <mesh position={[0, -0.34, 0]}>
          <boxGeometry args={[0.17, 0.66, 0.19]} />
          <meshStandardMaterial color="#38332c" roughness={0.8} />
        </mesh>
        {/* Heavy Leather Hiking Boot */}
        <mesh position={[0, -0.62, 0.05]}>
          <boxGeometry args={[0.18, 0.16, 0.3]} />
          <meshStandardMaterial color="#1f1b16" roughness={0.9} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.15, 0.65, 0]}>
        <mesh position={[0, -0.34, 0]}>
          <boxGeometry args={[0.17, 0.66, 0.19]} />
          <meshStandardMaterial color="#38332c" roughness={0.8} />
        </mesh>
        {/* Heavy Leather Hiking Boot */}
        <mesh position={[0, -0.62, 0.05]}>
          <boxGeometry args={[0.18, 0.16, 0.3]} />
          <meshStandardMaterial color="#1f1b16" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
