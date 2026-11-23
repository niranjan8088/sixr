/**
 * AFTERLIGHT — Survivors.jsx
 *
 * Renders the 3 survivors in the 3D scene.
 * Each survivor is a mesh at its defined position.
 * Proximity is detected here (distance to playerPosition from store).
 * Sets store.activeSurvivor when player is in range and presses E.
 *
 * Props: none (reads from useGameStore)
 * Does NOT own HUD — only 3D scene objects + range indicator.
 *
 * Interface for Rajesh's UI:
 *   store.activeSurvivor → id of nearest survivor in range
 *   store.decisionPanel  → true when panel should be shown
 *   store.survivors      → array of SurvivorDef (with state, interacted, etc.)
 */

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../systems/gameStore.js';
import { getUrgencyColor, getConditionIcon } from '../systems/missionSystem.js';

// ─────────────────────────────────────────────────────────────────────────────
// Individual survivor mesh
// ─────────────────────────────────────────────────────────────────────────────
function SurvivorMesh({ survivor }) {
  const meshRef = useRef();
  const ringRef = useRef();

  const playerPosition = useGameStore(s => s.playerPosition);
  const phase          = useGameStore(s => s.phase);
  const activeSurvivor = useGameStore(s => s.activeSurvivor);
  const openPanel      = useGameStore(s => s.openSurvivorPanel);

  const inRange = useRef(false);
  const pos     = new THREE.Vector3(...survivor.position);

  // Urgency → color
  const urgencyColor = getUrgencyColor(survivor.urgency);

  // Pulse animation
  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Skip interaction if already decided or mission not active
    if (phase !== 'playing') return;

    const pPos = new THREE.Vector3(...playerPosition);
    const dist  = pPos.distanceTo(pos);
    inRange.current = dist <= survivor.interactionRadius;

    // Pulse the survivor model
    if (!survivor.interacted) {
      const t = Date.now() * 0.003;
      meshRef.current.scale.setScalar(1 + Math.sin(t) * 0.05);
    }

    // Pulse range ring
    if (ringRef.current) {
      ringRef.current.visible = inRange.current && !survivor.interacted;
    }
  });

  // Keyboard listener for E key
  useEffect(() => {
    function onKeyDown(e) {
      if (e.code !== 'KeyE') return;
      if (survivor.interacted) return;
      if (phase !== 'playing') return;
      if (!inRange.current) return;
      if (activeSurvivor && activeSurvivor !== survivor.id) return;
      openPanel(survivor.id);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [survivor.id, survivor.interacted, phase, activeSurvivor, openPanel]);

  // ── Determine appearance based on state ──────────────────────────────────
  const stateColors = {
    waiting:         urgencyColor,
    rescued:         '#22c55e',
    treated_stable:  '#86efac',
    lost:            '#6b7280',
  };
  const color = stateColors[survivor.state] || urgencyColor;

  return (
    <group position={survivor.position}>
      {/* Survivor body — simple capsule */}
      <mesh ref={meshRef} castShadow>
        {/* Torso */}
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Head sphere */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Interaction range ring (ground level) */}
      <group ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
        <Ring args={[survivor.interactionRadius - 0.1, survivor.interactionRadius, 64]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.4} side={THREE.DoubleSide} />
        </Ring>
      </group>

      {/* Billboard name + status label */}
      <Billboard position={[0, 1.6, 0]} follow lockX={false} lockY={false} lockZ={false}>
        <Text
          fontSize={0.18}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {`${getConditionIcon(survivor.condition)} ${survivor.name}`}
        </Text>

        {/* Urgency badge */}
        <Text
          position={[0, -0.25, 0]}
          fontSize={0.13}
          color={survivor.interacted ? '#6b7280' : urgencyColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {survivor.interacted
            ? `[${survivor.state.replace('_', ' ').toUpperCase()}]`
            : `[${survivor.urgency.toUpperCase()}] Press E`}
        </Text>
      </Billboard>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Survivors container
// ─────────────────────────────────────────────────────────────────────────────
export default function Survivors() {
  const survivors = useGameStore(s => s.survivors);
  const phase     = useGameStore(s => s.phase);

  if (phase === 'menu') return null;

  return (
    <group name="survivors">
      {survivors.map(survivor => (
        <SurvivorMesh key={survivor.id} survivor={survivor} />
      ))}
    </group>
  );
}
