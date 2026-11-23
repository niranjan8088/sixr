/**
 * AFTERLIGHT — Survivors.jsx
 *
 * Renders the 3 survivors in the 3D scene.
 * Each survivor is a mesh at its defined position.
 * Proximity is detected and maintained in store.nearbySurvivorId.
 * Sets store.activeSurvivor when player is in range and presses E.
 *
 * Props: none (reads from useGameStore)
 * Does NOT own HUD — only 3D scene objects + range indicator.
 *
 * Interface for Rajesh's UI:
 *   store.activeSurvivor   → id of survivor whose decision panel is open
 *   store.decisionPanel    → true when panel is visible
 *   store.nearbySurvivorId → id of nearest survivor currently within interaction range
 *   store.survivors        → array of SurvivorDef (with state, interacted, etc.)
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
function SurvivorMesh({ survivor, isNearby }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const phase = useGameStore(s => s.phase);

  // Urgency → color
  const urgencyColor = getUrgencyColor(survivor.urgency);

  // Pulse animation & visual feedback
  useFrame(() => {
    if (!meshRef.current) return;
    if (phase !== 'playing' && phase !== 'extraction') return;

    // Pulse survivor model when pending
    if (!survivor.interacted) {
      const t = Date.now() * 0.003;
      meshRef.current.scale.setScalar(1 + Math.sin(t) * 0.05);
    }

    // Proximity range ring visibility
    if (ringRef.current) {
      ringRef.current.visible = isNearby && !survivor.interacted;
    }
  });

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
      {/* Survivor body — capsule */}
      <mesh ref={meshRef} castShadow>
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
        <Ring args={[survivor.interactionRadius - 0.15, survivor.interactionRadius, 64]}>
          <meshBasicMaterial
            color={isNearby ? '#38bdf8' : '#ffffff'}
            transparent
            opacity={isNearby ? 0.7 : 0.3}
            side={THREE.DoubleSide}
          />
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

        {/* Urgency / Interaction badge */}
        <Text
          position={[0, -0.25, 0]}
          fontSize={0.13}
          color={survivor.interacted ? '#6b7280' : (isNearby ? '#38bdf8' : urgencyColor)}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
        >
          {survivor.interacted
            ? `[${survivor.state.replace('_', ' ').toUpperCase()}]`
            : (isNearby
                ? `▶ PRESS E TO RESCUE ◀`
                : `[${survivor.urgency.toUpperCase()}]`)}
        </Text>
      </Billboard>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Survivors container: Centralized proximity detection & interaction management
// ─────────────────────────────────────────────────────────────────────────────
export default function Survivors() {
  const survivors        = useGameStore(s => s.survivors);
  const phase            = useGameStore(s => s.phase);
  const nearbySurvivorId = useGameStore(s => s.nearbySurvivorId);
  const setNearbySurvivor = useGameStore(s => s.setNearbySurvivor);
  const openSurvivorPanel = useGameStore(s => s.openSurvivorPanel);

  // Continuous frame-based distance evaluation (XZ planar distance, immune to eye-height offset)
  useFrame(() => {
    if (phase !== 'playing' && phase !== 'extraction') {
      if (nearbySurvivorId !== null) setNearbySurvivor(null);
      return;
    }

    const state = useGameStore.getState();
    const [px, , pz] = state.playerPosition || [0, 0, 0];

    let closestSurvivor = null;
    let closestDist = Infinity;

    for (const survivor of state.survivors) {
      if (survivor.interacted) continue;

      const [sx, , sz] = survivor.position;
      const dist = Math.hypot(px - sx, pz - sz);

      if (dist <= survivor.interactionRadius && dist < closestDist) {
        closestDist = dist;
        closestSurvivor = survivor;
      }
    }

    const newNearbyId = closestSurvivor ? closestSurvivor.id : null;
    if (state.nearbySurvivorId !== newNearbyId) {
      setNearbySurvivor(newNearbyId);
    }
  });

  // Single centralized Keydown handler for E interaction
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code !== 'KeyE' && e.key !== 'e' && e.key !== 'E') return;

      const state = useGameStore.getState();
      if (state.phase !== 'playing' && state.phase !== 'extraction') return;
      if (state.decisionPanel || state.activeSurvivor) return; // Prevent duplicate triggers

      const [px, , pz] = state.playerPosition || [0, 0, 0];

      // Find closest un-interacted survivor in range
      let targetSurvivor = null;
      let minDistance = Infinity;

      for (const s of state.survivors) {
        if (s.interacted) continue;
        const [sx, , sz] = s.position;
        const dist = Math.hypot(px - sx, pz - sz);
        if (dist <= s.interactionRadius && dist < minDistance) {
          minDistance = dist;
          targetSurvivor = s;
        }
      }

      if (targetSurvivor) {
        openSurvivorPanel(targetSurvivor.id);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSurvivorPanel]);

  if (phase === 'menu') return null;

  return (
    <group name="survivors">
      {survivors.map(survivor => (
        <SurvivorMesh
          key={survivor.id}
          survivor={survivor}
          isNearby={nearbySurvivorId === survivor.id}
        />
      ))}
    </group>
  );
}
