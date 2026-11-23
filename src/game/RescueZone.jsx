/**
 * AFTERLIGHT — RescueZone.jsx
 *
 * Renders the extraction zone in the 3D scene.
 * Detects player horizontal (X/Z) proximity and triggers store.triggerExtraction()
 * once all required survivor objectives are resolved.
 *
 * Position: [0, 0, 20] — clearly separated from survivor locations.
 * Radius: 3.5 units.
 *
 * Visual: animated beacon column + ground ring.
 * Active in phases 'playing' and 'extraction'.
 */

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../systems/gameStore.js';

export const EXTRACTION_POSITION = [0, 0, 20];
export const EXTRACTION_RADIUS   = 3.5;

export default function RescueZone() {
  const phase              = useGameStore(s => s.phase);
  const playerPosition     = useGameStore(s => s.playerPosition);
  const survivors          = useGameStore(s => s.survivors);
  const triggerExtraction  = useGameStore(s => s.triggerExtraction);
  const extractionReached  = useGameStore(s => s.extractionReached);

  const beamRef   = useRef();
  const ringRef   = useRef();
  const triggered = useRef(false);

  // Reset local triggered flag when extractionReached or phase resets
  useEffect(() => {
    if (!extractionReached) {
      triggered.current = false;
    }
  }, [extractionReached, phase]);

  // Check if all survivors have been resolved (interacted)
  const allSurvivorsAssessed = survivors.length > 0 && survivors.every(s => s.interacted);
  const canExtract = (phase === 'extraction' || allSurvivorsAssessed) && !extractionReached;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Animate beacon beam
    if (beamRef.current) {
      beamRef.current.material.opacity = 0.3 + Math.sin(t * 2) * 0.2;
      beamRef.current.rotation.y = t * 0.5;
    }

    // Animate ground ring
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.8;
    }

    if (extractionReached) return;
    if (phase !== 'playing' && phase !== 'extraction') return;

    // Check player horizontal (X/Z) proximity
    const [px, , pz] = playerPosition || [0, 0, 0];
    const [ex, , ez] = EXTRACTION_POSITION;
    const horizontalDist = Math.hypot(px - ex, pz - ez);

    if (horizontalDist <= EXTRACTION_RADIUS && !triggered.current && canExtract) {
      triggered.current = true;
      triggerExtraction();
    }
  });

  if (phase === 'menu') return null;

  const isActive  = phase === 'extraction' || canExtract;
  const beamColor = extractionReached
    ? '#22c55e'
    : (isActive ? '#38bdf8' : '#fbbf24');

  const labelText = extractionReached
    ? '✅ EXTRACTED'
    : (isActive ? '🚁 EXTRACTION — ENTER NOW' : '🚁 EXTRACTION (OBJECTIVES PENDING)');

  return (
    <group position={EXTRACTION_POSITION} name="extraction-zone">
      {/* Ground pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[EXTRACTION_RADIUS, 64]} />
        <meshStandardMaterial
          color={beamColor}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Animated ground ring */}
      <group ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <mesh>
          <ringGeometry args={[EXTRACTION_RADIUS - 0.15, EXTRACTION_RADIUS, 64]} />
          <meshBasicMaterial color={beamColor} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Inner ring markers */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x   = Math.cos(rad) * (EXTRACTION_RADIUS - 0.5);
        const z   = Math.sin(rad) * (EXTRACTION_RADIUS - 0.5);
        return (
          <mesh key={i} position={[x, 0.05, z]}>
            <boxGeometry args={[0.15, 0.1, 0.5]} />
            <meshStandardMaterial color={beamColor} emissive={beamColor} emissiveIntensity={0.8} />
          </mesh>
        );
      })}

      {/* Beacon vertical beam */}
      <mesh ref={beamRef} position={[0, 4, 0]}>
        <cylinderGeometry args={[0.08, 0.5, 8, 16, 1, true]} />
        <meshBasicMaterial color={beamColor} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Central pole */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Beacon light at top */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={beamColor}
          emissive={beamColor}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Point light for glow */}
      <pointLight
        position={[0, 2, 0]}
        color={beamColor}
        intensity={isActive ? 3 : 0.8}
        distance={8}
        decay={2}
      />

      {/* Billboard label */}
      <Billboard position={[0, 3.5, 0]} follow lockX={false} lockY={false} lockZ={false}>
        <Text
          fontSize={0.25}
          color={beamColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.025}
          outlineColor="#000000"
        >
          {labelText}
        </Text>
        {!extractionReached && isActive && (
          <Text
            position={[0, -0.35, 0]}
            fontSize={0.16}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.015}
            outlineColor="#000000"
          >
            Walk into the circle to extract
          </Text>
        )}
      </Billboard>
    </group>
  );
}
