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
  const cameraYaw = useGameStore((state) => state.cameraRotation.yaw);
  const updatePlayerPosition = useGameStore((state) => state.updatePlayerPosition);

  // Local state for smooth physics & animations
  const position = useRef(new THREE.Vector3(...GameConfig.player.spawnPosition));
  const rotation = useRef(0);
  const currentSpeed = useRef(0);
  const animTime = useRef(0);
  const [stamina, setStamina] = useState(GameConfig.player.maxStamina);

  // Sync initial position
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.copy(position.current);
    }
  }, []);

  useFrame((state, delta) => {
    // Only update movement during active phases
    if (phase !== GAME_PHASES.PLAYING && phase !== GAME_PHASES.EXTRACTION) {
      return;
    }

    // Clamp delta to avoid huge physics skips on frame drops
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
      
      // Rotate move vector by camera yaw
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

    // Periodic store sync (throttled inside store or per frame)
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
        <ringGeometry args={[0, 0.55, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.5} />
      </mesh>

      {/* Main Body Hierarchy */}
      <group ref={bodyRef} position={[0, 1.05, 0]}>
        {/* Torso: Tactical High-Vis Rescue Jacket */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.55, 0.65, 0.32]} />
          <meshStandardMaterial color="#d45b12" roughness={0.5} metalness={0.2} />
        </mesh>

        {/* Reflective Neon Strips on Torso */}
        <mesh position={[0, 0.05, 0.165]}>
          <planeGeometry args={[0.5, 0.08]} />
          <meshBasicMaterial color="#f0ff00" />
        </mesh>
        <mesh position={[0, -0.15, 0.165]}>
          <planeGeometry args={[0.5, 0.08]} />
          <meshBasicMaterial color="#f0ff00" />
        </mesh>

        {/* Tactical Oxygen / Tool Rig on Back */}
        <mesh position={[0, 0.05, -0.22]}>
          <boxGeometry args={[0.38, 0.45, 0.18]} />
          <meshStandardMaterial color="#1e242d" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Glowing Energy / Oxygen Level indicator */}
        <mesh position={[0, 0.05, -0.315]}>
          <planeGeometry args={[0.12, 0.25]} />
          <meshBasicMaterial color="#00d2ff" />
        </mesh>

        {/* Shoulder Emergency Beacon LED */}
        <mesh position={[-0.24, 0.32, -0.05]}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshBasicMaterial color="#ff3300" />
        </mesh>
        <pointLight position={[-0.24, 0.35, -0.05]} color="#ff3300" intensity={1.5} distance={3} />

        {/* Head & Helmet */}
        <group ref={headRef} position={[0, 0.45, 0]}>
          {/* Rescue Helmet */}
          <mesh castShadow position={[0, 0, 0]}>
            <sphereGeometry args={[0.22, 20, 20]} />
            <meshStandardMaterial color="#2a303c" roughness={0.3} metalness={0.6} />
          </mesh>
          {/* Reflective Visor */}
          <mesh position={[0, 0.02, 0.15]}>
            <boxGeometry args={[0.26, 0.14, 0.14]} />
            <meshStandardMaterial color="#ffaa00" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Helmet Searchlight */}
          <mesh position={[0, 0.16, 0.18]}>
            <cylinderGeometry args={[0.04, 0.05, 0.08, 12]} rotation={[Math.PI / 2, 0, 0]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Forward Flashlight Beam */}
          <spotLight
            position={[0, 0.16, 0.25]}
            target-position={[0, -0.5, 8]}
            angle={0.45}
            penumbra={0.6}
            intensity={4}
            distance={18}
            color="#fff4e0"
            castShadow
          />
        </group>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.34, 0.22, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[0.14, 0.45, 0.14]} />
            <meshStandardMaterial color="#2a303c" roughness={0.6} />
          </mesh>
          {/* Tactical Gauntlet */}
          <mesh position={[0, -0.38, 0]}>
            <boxGeometry args={[0.16, 0.18, 0.16]} />
            <meshStandardMaterial color="#d45b12" roughness={0.5} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.34, 0.22, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[0.14, 0.45, 0.14]} />
            <meshStandardMaterial color="#2a303c" roughness={0.6} />
          </mesh>
          {/* Tactical Gauntlet */}
          <mesh position={[0, -0.38, 0]}>
            <boxGeometry args={[0.16, 0.18, 0.16]} />
            <meshStandardMaterial color="#d45b12" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.15, 0.65, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.16, 0.65, 0.18]} />
          <meshStandardMaterial color="#1a202c" roughness={0.7} />
        </mesh>
        {/* Heavy Rescue Boot */}
        <mesh position={[0, -0.62, 0.05]}>
          <boxGeometry args={[0.18, 0.14, 0.28]} />
          <meshStandardMaterial color="#11151c" roughness={0.8} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.15, 0.65, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.16, 0.65, 0.18]} />
          <meshStandardMaterial color="#1a202c" roughness={0.7} />
        </mesh>
        {/* Heavy Rescue Boot */}
        <mesh position={[0, -0.62, 0.05]}>
          <boxGeometry args={[0.18, 0.14, 0.28]} />
          <meshStandardMaterial color="#11151c" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

