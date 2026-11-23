import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

export const HAZARDS_DATA = [
  {
    id: 'hazard-smoke',
    name: 'TOXIC SMOKE INVERSION (O2 DRAIN)',
    type: 'smoke',
    pos: [20, 0, -22],
    radius: 7.5,
    color: '#eab308'
  },
  {
    id: 'hazard-fire',
    name: 'STRUCTURAL INFERNO (HIGH HEAT)',
    type: 'fire',
    pos: [-14, 0, -11],
    radius: 6.0,
    color: '#ef4444'
  },
  {
    id: 'hazard-electrical',
    name: 'EXPOSED HIGH-VOLTAGE LINE (SHOCK HAZARD)',
    type: 'electric',
    pos: [-8.4, 0, 18],
    radius: 4.5,
    color: '#38bdf8'
  }
];

export default function Hazards() {
  const setActiveHazard = useGameStore((state) => state.setActiveHazard);
  const playerPos = useGameStore((state) => state.player.position);

  const fireLightRef = useRef();
  const smokeParticlesRef = useRef([]);

  // Generate smoke particle clusters
  const smokePuffs = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 6.5,
      z: (Math.random() - 0.5) * 6.5,
      y: 0.4 + Math.random() * 2.2,
      scale: 1.0 + Math.random() * 1.5,
      speed: 0.3 + Math.random() * 0.4,
      rotSpeed: (Math.random() - 0.5) * 1.2
    }));
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. Proximity hazard check
    let currentHazard = null;
    const px = playerPos[0];
    const pz = playerPos[2];

    for (const h of HAZARDS_DATA) {
      const dist = Math.hypot(px - h.pos[0], pz - h.pos[2]);
      if (dist < h.radius) {
        currentHazard = h.name;
        break;
      }
    }
    setActiveHazard(currentHazard);

    // 2. Animate flickering fire light
    if (fireLightRef.current) {
      fireLightRef.current.intensity = 2.4 + Math.sin(t * 18) * 0.8 + Math.cos(t * 26) * 0.5;
    }

    // 3. Animate rising smoke puffs
    smokeParticlesRef.current.forEach((puff, idx) => {
      if (puff) {
        const item = smokePuffs[idx];
        puff.position.y = 0.4 + ((t * item.speed + idx) % 3.5);
        puff.rotation.y += item.rotSpeed * 0.02;
        const currentScale = item.scale * (1 + (puff.position.y / 3.5) * 0.8);
        puff.scale.set(currentScale, currentScale, currentScale);
      }
    });
  });

  return (
    <group>
      {/* =================================================================
          1. TOXIC SMOKE INVERSION ZONE (Near Marcus Chen at [20, 0, -22])
         ================================================================= */}
      <group position={[20, 0, -22]}>
        {/* Pulsing Hazard Perimeter Warning Circle */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[7.2, 7.6, 32]} />
          <meshBasicMaterial color="#eab308" transparent opacity={0.4} />
        </mesh>

        {/* Billowing Toxic Smoke Cloud Puffs */}
        {smokePuffs.map((p, idx) => (
          <mesh
            key={`smoke-puff-${idx}`}
            ref={(el) => (smokeParticlesRef.current[idx] = el)}
            position={[p.x, p.y, p.z]}
          >
            <dodecahedronGeometry args={[0.9, 1]} />
            <meshStandardMaterial
              color="#a39055"
              transparent
              opacity={0.35}
              roughness={1}
              depthWrite={false}
            />
          </mesh>
        ))}

        {/* Dense Yellow-Green Ground Haze */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[5.5, 6.5, 1.2, 16]} />
          <meshBasicMaterial color="#857030" transparent opacity={0.22} depthWrite={false} />
        </mesh>
      </group>

      {/* =================================================================
          2. STRUCTURAL INFERNO ZONE (Near [-14, 0, -11])
         ================================================================= */}
      <group position={[-14, 0, -11]}>
        {/* Ground Hazard Warning Ring */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[5.8, 6.2, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.45} />
        </mesh>

        {/* Flickering Fire Light */}
        <pointLight
          ref={fireLightRef}
          position={[0, 1.8, 0]}
          color="#ff5500"
          distance={16}
          decay={2}
        />

        {/* Fiery Core & Rising Flames */}
        <mesh position={[0, 0.9, 0]}>
          <coneGeometry args={[1.4, 2.2, 8]} />
          <meshBasicMaterial color="#ff6600" />
        </mesh>
        <mesh position={[0.3, 1.4, -0.2]}>
          <coneGeometry args={[0.9, 1.8, 7]} />
          <meshBasicMaterial color="#ffaa00" />
        </mesh>
        <mesh position={[-0.3, 0.7, 0.4]}>
          <coneGeometry args={[1.0, 1.5, 6]} />
          <meshBasicMaterial color="#ff3300" />
        </mesh>

        {/* Charred Wood & Structural Timber Rubble */}
        <mesh position={[0, 0.25, 0]} rotation={[0.2, 0.5, 0.1]}>
          <boxGeometry args={[3.2, 0.45, 0.5]} />
          <meshStandardMaterial color="#1c1917" roughness={0.95} />
        </mesh>
        <mesh position={[0.2, 0.35, 0.4]} rotation={[-0.1, 0.9, -0.2]}>
          <boxGeometry args={[2.8, 0.4, 0.4]} />
          <meshStandardMaterial color="#1c1917" roughness={0.95} />
        </mesh>
      </group>

      {/* =================================================================
          3. ELECTRICAL ARC HAZARD ZONE (Near Fallen Pole at [-8.4, 0, 18])
         ================================================================= */}
      <group position={[-8.4, 0, 18]}>
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.2, 4.6, 28]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
        </mesh>
      </group>
    </group>
  );
}
