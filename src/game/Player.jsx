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
        {/* 1. Torso: Emergency Response Unit High-Vis Uniform (Image 2 Match) */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.54, 0.7, 0.32]} />
          <meshStandardMaterial color="#ea580c" roughness={0.7} metalness={0.1} />
        </mesh>

        {/* High-Vis Retro-Reflective Silver & Neon-Yellow Hazard Bands across Chest & Back */}
        <mesh position={[0, 0.08, 0.165]}>
          <boxGeometry args={[0.55, 0.1, 0.015]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.06, 0.165]}>
          <boxGeometry args={[0.55, 0.08, 0.015]} />
          <meshStandardMaterial color="#facc15" roughness={0.3} />
        </mesh>
        {/* Back Reflective Bands */}
        <mesh position={[0, 0.08, -0.165]}>
          <boxGeometry args={[0.55, 0.1, 0.015]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Tactical Radio Shoulder Transponder with Emergency Blinking Beacon */}
        <group position={[-0.22, 0.28, -0.04]}>
          <mesh>
            <boxGeometry args={[0.08, 0.14, 0.08]} />
            <meshStandardMaterial color="#18181b" roughness={0.6} />
          </mesh>
          {/* Radio Antenna */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.22, 6]} />
            <meshStandardMaterial color="#09090b" metalness={0.9} />
          </mesh>
          {/* Blinking Cyan Beacon LED */}
          <mesh position={[0, 0.06, 0.045]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color="#00ffcc" />
          </mesh>
          <pointLight position={[0, 0.1, 0.1]} color="#00ffcc" intensity={1.2} distance={3} />
        </group>

        {/* Subdued Emergency Rescue Crest Patch */}
        <mesh position={[0.275, 0.2, 0]}>
          <boxGeometry args={[0.015, 0.12, 0.12]} />
          <meshStandardMaterial color="#0284c7" roughness={0.6} />
        </mesh>

        {/* =================================================================
            2. REALISTIC EMERGENCY BACKPACK & MEDICAL GEAR
           ================================================================= */}
        <group ref={backpackRef} position={[0, 0.04, -0.25]}>
          {/* Main Heavy Pack Body */}
          <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
            <boxGeometry args={[0.48, 0.6, 0.26]} />
            <meshStandardMaterial color="#334155" roughness={0.8} metalness={0.1} />
          </mesh>

          {/* Medical Cross Red Badge on Backpack */}
          <group position={[0, 0.08, -0.135]}>
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[0.18, 0.18]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0.002]}>
              <planeGeometry args={[0.05, 0.14]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
            <mesh position={[0, 0, 0.002]}>
              <planeGeometry args={[0.14, 0.05]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
          </group>

          {/* Top Flap Pouch */}
          <mesh position={[0, 0.28, -0.05]}>
            <boxGeometry args={[0.44, 0.18, 0.18]} />
            <meshStandardMaterial color="#1e293b" roughness={0.85} />
          </mesh>

          {/* Compression Straps (Vertical Webbing) */}
          {[-0.14, 0.14].map((x) => (
            <mesh key={`b-strap-${x}`} position={[x, 0.06, -0.135]}>
              <boxGeometry args={[0.035, 0.56, 0.015]} />
              <meshStandardMaterial color="#facc15" roughness={0.8} />
            </mesh>
          ))}

          {/* Metal D-Rings & Carabiner Clip */}
          <mesh position={[0.13, 0.18, -0.14]}>
            <torusGeometry args={[0.035, 0.008, 8, 14]} />
            <meshStandardMaterial color="#d8e0e8" roughness={0.2} metalness={0.95} />
          </mesh>

          {/* Dangling Canteen Flask */}
          <mesh position={[0.14, 0.08, -0.16]} rotation={[0.1, 0, 0.2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.14, 10]} />
            <meshStandardMaterial color="#78553a" roughness={0.7} metalness={0.2} />
          </mesh>

          {/* Emergency Hatchet Tool */}
          <group position={[-0.14, 0.38, -0.06]} rotation={[0.12, 0, -0.15]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.016, 0.018, 0.38, 8]} />
              <meshStandardMaterial color="#854d0e" roughness={0.8} />
            </mesh>
            <mesh position={[0.04, 0.16, 0]}>
              <boxGeometry args={[0.08, 0.07, 0.02]} />
              <meshStandardMaterial color="#334155" metalness={0.9} />
            </mesh>
          </group>

          {/* ROLLED SLEEPING MAT / BEDROLL (Strapped horizontally to bottom) */}
          <group position={[0, -0.28, -0.03]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.11, 0.11, 0.52, 16]} />
              <meshStandardMaterial color="#475569" roughness={0.85} />
            </mesh>
            {[-0.16, 0.16].map((x) => (
              <mesh key={`roll-strap-${x}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.115, 0.014, 6, 16]} />
                <meshStandardMaterial color="#18181b" roughness={0.9} />
              </mesh>
            ))}
          </group>
        </group>

        {/* 3. Head & Emergency Rescue Helmet with LED Headlamp (Image 2 Match!) */}
        <group ref={headRef} position={[0, 0.48, 0]}>
          {/* Natural Skin Head */}
          <mesh castShadow position={[0, 0, 0]}>
            <sphereGeometry args={[0.19, 18, 18]} />
            <meshStandardMaterial color="#c5a282" roughness={0.65} />
          </mesh>

          {/* Emergency Rescue Safety Helmet */}
          <group position={[0, 0.08, 0]}>
            <mesh position={[0, 0, 0]} castShadow>
              <sphereGeometry args={[0.22, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.2} />
            </mesh>
            {/* Helmet Front Peak / Brim */}
            <mesh position={[0, -0.05, 0.18]} rotation={[0.3, 0, 0]}>
              <boxGeometry args={[0.32, 0.04, 0.14]} />
              <meshStandardMaterial color="#d97706" roughness={0.5} />
            </mesh>
            {/* High-Vis Helmet Reflective Strips */}
            <mesh position={[0, 0.04, 0.205]}>
              <boxGeometry args={[0.24, 0.03, 0.02]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Front LED Headlamp (Casting forward beam) */}
            <mesh position={[0, 0.02, 0.22]}>
              <boxGeometry args={[0.09, 0.06, 0.05]} />
              <meshStandardMaterial color="#1f2937" metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.02, 0.246]}>
              <circleGeometry args={[0.03, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Forward Headlamp Flashlight Spot */}
            <spotLight
              position={[0, 0.02, 0.3]}
              target-position={[0, -0.5, 8.0]}
              angle={0.65}
              penumbra={0.4}
              intensity={2.8}
              color="#fef08a"
              distance={24}
            />
          </group>
        </group>

        {/* 4. Arms with Emergency Sleeves, Reflective Bands & Rescue Gloves */}
        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.34, 0.22, 0]}>
          {/* Orange Jacket Sleeve */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.15, 0.22, 0.15]} />
            <meshStandardMaterial color="#ea580c" roughness={0.7} />
          </mesh>
          {/* Sleeve Reflective Band */}
          <mesh position={[0, -0.16, 0]}>
            <boxGeometry args={[0.16, 0.04, 0.16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Forearm */}
          <mesh position={[0, -0.28, 0]}>
            <boxGeometry args={[0.13, 0.24, 0.13]} />
            <meshStandardMaterial color="#ea580c" roughness={0.7} />
          </mesh>
          {/* Tactical Rescue Glove on Hand */}
          <mesh position={[0, -0.42, 0]}>
            <boxGeometry args={[0.13, 0.12, 0.13]} />
            <meshStandardMaterial color="#1f2937" roughness={0.6} metalness={0.4} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.34, 0.22, 0]}>
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[0.15, 0.22, 0.15]} />
            <meshStandardMaterial color="#ea580c" roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.16, 0]}>
            <boxGeometry args={[0.16, 0.04, 0.16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.28, 0]}>
            <boxGeometry args={[0.13, 0.24, 0.13]} />
            <meshStandardMaterial color="#ea580c" roughness={0.7} />
          </mesh>
          {/* Tactical Rescue Glove on Hand */}
          <mesh position={[0, -0.42, 0]}>
            <boxGeometry args={[0.13, 0.12, 0.13]} />
            <meshStandardMaterial color="#1f2937" roughness={0.6} metalness={0.4} />
          </mesh>
        </group>
      </group>

      {/* 5. Heavy-Duty Rescue Cargo Pants & Steel-Toed Boots */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.15, 0.65, 0]}>
        <mesh position={[0, -0.34, 0]}>
          <boxGeometry args={[0.18, 0.66, 0.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.85} />
        </mesh>
        {/* Reinforced Knee Pad */}
        <mesh position={[0, -0.26, 0.11]}>
          <boxGeometry args={[0.16, 0.18, 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {/* Steel-Toed Heavy Leather Rescue Boot */}
        <mesh position={[0, -0.62, 0.06]} castShadow>
          <boxGeometry args={[0.19, 0.16, 0.32]} />
          <meshStandardMaterial color="#09090b" roughness={0.9} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.15, 0.65, 0]}>
        <mesh position={[0, -0.34, 0]}>
          <boxGeometry args={[0.18, 0.66, 0.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.85} />
        </mesh>
        {/* Reinforced Knee Pad */}
        <mesh position={[0, -0.26, 0.11]}>
          <boxGeometry args={[0.16, 0.18, 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {/* Steel-Toed Heavy Leather Rescue Boot */}
        <mesh position={[0, -0.62, 0.06]} castShadow>
          <boxGeometry args={[0.19, 0.16, 0.32]} />
          <meshStandardMaterial color="#09090b" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
