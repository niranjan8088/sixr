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
  const backpackRef = useRef();

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
      const swing = Math.sin(animTime.current) * (isSprinting ? 0.72 : 0.42);
      const bob = Math.abs(Math.sin(animTime.current * 2)) * (isSprinting ? 0.07 : 0.035);

      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.85;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.85;
      if (bodyRef.current) {
        bodyRef.current.position.y = 1.05 + bob;
        bodyRef.current.rotation.x = isSprinting ? 0.14 : 0.04;
      }
      if (backpackRef.current) {
        backpackRef.current.rotation.z = Math.sin(animTime.current) * 0.03;
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
        <ringGeometry args={[0, 0.62, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} />
      </mesh>

      {/* Main Body Hierarchy */}
      <group ref={bodyRef} position={[0, 1.05, 0]}>
        {/* 1. Torso: Olive Survival Field Shirt (Matched directly to User Reference Image 4) */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.52, 0.68, 0.3]} />
          <meshStandardMaterial color="#464e3c" roughness={0.78} metalness={0.08} />
        </mesh>

        {/* Tactical Chest Harness / Utility Straps across chest */}
        <mesh position={[0, 0.05, 0.155]}>
          <boxGeometry args={[0.44, 0.44, 0.025]} />
          <meshStandardMaterial color="#2d3027" roughness={0.85} />
        </mesh>

        {/* Subdued Rescue Orange Shoulder Patch */}
        <mesh position={[0.265, 0.2, 0]}>
          <boxGeometry args={[0.015, 0.12, 0.12]} />
          <meshStandardMaterial color="#c24817" roughness={0.6} />
        </mesh>

        {/* =================================================================
            2. REALISTIC EXPEDITION BACKPACK (Direct match to User Image 4)
            Large olive survival rucksack, webbing, rolled bedroll at bottom
           ================================================================= */}
        <group ref={backpackRef} position={[0, 0.04, -0.25]}>
          {/* Main Heavy Pack Body */}
          <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
            <boxGeometry args={[0.46, 0.58, 0.25]} />
            <meshStandardMaterial color="#555e4b" roughness={0.82} metalness={0.06} />
          </mesh>

          {/* Top Flap Pouch */}
          <mesh position={[0, 0.26, -0.05]}>
            <boxGeometry args={[0.42, 0.18, 0.18]} />
            <meshStandardMaterial color="#444b3c" roughness={0.85} />
          </mesh>

          {/* Compression Straps (Vertical Webbing) */}
          {[-0.13, 0.13].map((x) => (
            <mesh key={`b-strap-${x}`} position={[x, 0.06, -0.13]}>
              <boxGeometry args={[0.032, 0.54, 0.015]} />
              <meshStandardMaterial color="#282a24" roughness={0.9} />
            </mesh>
          ))}

          {/* Metal D-Rings & Carabiner Clip (Just like in Image 4!) */}
          <mesh position={[0.13, 0.18, -0.14]}>
            <torusGeometry args={[0.035, 0.008, 8, 14]} />
            <meshStandardMaterial color="#d8e0e8" roughness={0.2} metalness={0.95} />
          </mesh>

          {/* Dangling Brass / Leather Canteen Flask hanging from Carabiner (Image 4) */}
          <mesh position={[0.14, 0.08, -0.16]} rotation={[0.1, 0, 0.2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.14, 10]} />
            <meshStandardMaterial color="#78553a" roughness={0.7} metalness={0.2} />
          </mesh>

          {/* Emergency Hatchet / Radio Antenna Poking Up Behind Shoulder (Image 4) */}
          <group position={[-0.14, 0.38, -0.06]} rotation={[0.12, 0, -0.15]}>
            {/* Wooden Handle */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.016, 0.018, 0.38, 8]} />
              <meshStandardMaterial color="#854d0e" roughness={0.8} />
            </mesh>
            {/* Dark Steel Axe Head */}
            <mesh position={[0.04, 0.16, 0]}>
              <boxGeometry args={[0.08, 0.07, 0.02]} />
              <meshStandardMaterial color="#334155" metalness={0.9} />
            </mesh>
          </group>

          {/* Side Utility Pouch / Water Flask */}
          <mesh position={[0.25, 0.02, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.28, 10]} />
            <meshStandardMaterial color="#2c3029" roughness={0.7} metalness={0.3} />
          </mesh>

          {/* ROLLED SLEEPING MAT / BEDROLL (Horizontally strapped to bottom of pack, exactly as in Image 4!) */}
          <group position={[0, -0.28, -0.03]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.11, 0.11, 0.5, 16]} />
              <meshStandardMaterial color="#3d4436" roughness={0.85} />
            </mesh>
            {/* Black Tie-Down Straps on Bedroll */}
            {[-0.15, 0.15].map((x) => (
              <mesh key={`roll-strap-${x}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.114, 0.012, 6, 16]} />
                <meshStandardMaterial color="#181a17" roughness={0.9} />
              </mesh>
            ))}
          </group>
        </group>

        {/* 3. Head & Natural Survivor Ponytail / Hair (Modeled from User Image 4) */}
        <group ref={headRef} position={[0, 0.48, 0]}>
          {/* Natural Skin Tone Head */}
          <mesh castShadow position={[0, 0, 0]}>
            <sphereGeometry args={[0.19, 18, 18]} />
            <meshStandardMaterial color="#c5a282" roughness={0.65} />
          </mesh>
          {/* Dark Brown Textured Hair */}
          <mesh position={[0, 0.06, -0.04]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#261e18" roughness={0.85} />
          </mesh>
          {/* Survivor Ponytail / Bun tied at back (Just like in Image 4!) */}
          <mesh position={[0, 0.08, -0.19]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.07, 0.18, 10]} />
            <meshStandardMaterial color="#261e18" roughness={0.85} />
          </mesh>
        </group>

        {/* 4. Arms with Rolled Sleeves & Bare Forearms */}
        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.34, 0.22, 0]}>
          {/* Olive Shirt Sleeve */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.14, 0.22, 0.14]} />
            <meshStandardMaterial color="#464e3c" roughness={0.78} />
          </mesh>
          {/* Bare Forearm */}
          <mesh position={[0, -0.28, 0]}>
            <boxGeometry args={[0.12, 0.24, 0.12]} />
            <meshStandardMaterial color="#c5a282" roughness={0.65} />
          </mesh>
          {/* Tactical Wristwatch on Left Wrist */}
          <mesh position={[0, -0.36, 0]}>
            <boxGeometry args={[0.13, 0.04, 0.13]} />
            <meshStandardMaterial color="#1a1c18" roughness={0.5} metalness={0.7} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.34, 0.22, 0]}>
          {/* Olive Shirt Sleeve */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.14, 0.22, 0.14]} />
            <meshStandardMaterial color="#464e3c" roughness={0.78} />
          </mesh>
          {/* Bare Forearm */}
          <mesh position={[0, -0.28, 0]}>
            <boxGeometry args={[0.12, 0.24, 0.12]} />
            <meshStandardMaterial color="#c5a282" roughness={0.65} />
          </mesh>
        </group>
      </group>

      {/* 5. Realistic Survival Cargo Pants & Rugged Hiking Boots */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.15, 0.65, 0]}>
        <mesh position={[0, -0.34, 0]}>
          <boxGeometry args={[0.17, 0.66, 0.19]} />
          <meshStandardMaterial color="#3a352c" roughness={0.82} />
        </mesh>
        {/* Thigh Cargo Pocket */}
        <mesh position={[-0.08, -0.2, 0]}>
          <boxGeometry args={[0.04, 0.18, 0.14]} />
          <meshStandardMaterial color="#322d25" roughness={0.85} />
        </mesh>
        {/* Rugged Leather Hiking Boot */}
        <mesh position={[0, -0.62, 0.05]} castShadow>
          <boxGeometry args={[0.18, 0.16, 0.3]} />
          <meshStandardMaterial color="#221c17" roughness={0.9} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.15, 0.65, 0]}>
        <mesh position={[0, -0.34, 0]}>
          <boxGeometry args={[0.17, 0.66, 0.19]} />
          <meshStandardMaterial color="#3a352c" roughness={0.82} />
        </mesh>
        {/* Thigh Cargo Pocket */}
        <mesh position={[0.08, -0.2, 0]}>
          <boxGeometry args={[0.04, 0.18, 0.14]} />
          <meshStandardMaterial color="#322d25" roughness={0.85} />
        </mesh>
        {/* Rugged Leather Hiking Boot */}
        <mesh position={[0, -0.62, 0.05]} castShadow>
          <boxGeometry args={[0.18, 0.16, 0.3]} />
          <meshStandardMaterial color="#221c17" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
