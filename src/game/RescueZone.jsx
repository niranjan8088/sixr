/**
 * AFTERLIGHT — RescueZone.jsx
 *
 * Renders the extraction zone in the 3D scene.
 * Detects player proximity and triggers store.triggerExtraction().
 *
 * Position: [0, 0, 20] — clearly separated from survivor locations.
 * Radius: 3.5 units.
 *
 * Visual: animated beacon column + ground ring.
 * Active only when phase === 'playing' || phase === 'extraction'.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../systems/gameStore.js';

const EXTRACTION_POSITION = [0, 0, 20];
const EXTRACTION_RADIUS   = 3.5;

export default function RescueZone() {
  const phase           = useGameStore(s => s.phase);
  const playerPosition  = useGameStore(s => s.playerPosition);
  const triggerExtraction = useGameStore(s => s.triggerExtraction);
  const extractionReached = useGameStore(s => s.extractionReached);

  const beamRef  = useRef();
  const ringRef  = useRef();
  const triggered = useRef(false);

  useFrame(({ clock }) => {
    if (extractionReached) return;
    if (phase !== 'playing' && phase !== 'extraction') return;

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

    // Check player proximity
    const pPos = new THREE.Vector3(...playerPosition);
    const ePos = new THREE.Vector3(...EXTRACTION_POSITION);
    const dist  = pPos.distanceTo(ePos);

    if (dist <= EXTRACTION_RADIUS && !triggered.current) {
      triggered.current = true;
      triggerExtraction();
    }
  });

  if (phase === 'menu' || phase === 'complete' || phase === 'failed') return null;

  const isActive    = phase === 'extraction' || phase === 'playing';
  const beamColor   = extractionReached ? '#22c55e' : (phase === 'extraction' ? '#38bdf8' : '#fbbf24');
  const labelText   = extractionReached ? '✅ EXTRACTED' : (phase === 'extraction' ? '🚁 EXTRACTION — ENTER NOW' : '🚁 EXTRACTION');

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
        intensity={isActive ? 3 : 0.5}
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
        {!extractionReached && phase === 'extraction' && (
          <Text
            position={[0, -0.35, 0]}
            fontSize={0.16}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.015}
            outlineColor="#000000"
          >
            Walk into the circle
          </Text>
        )}
      </Billboard>
    </group>
  );
}
