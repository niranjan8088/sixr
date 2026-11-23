import React, { useEffect } from 'react';
import { globalCollisions } from '../core/CollisionManager';

const BUILDINGS_DATA = [
  // West Block Buildings
  { id: 'b-w1', pos: [-20, 12, 10], size: [14, 24, 16], color: '#252932', angle: 0 },
  { id: 'b-w2', pos: [-22, 16, -18], size: [16, 32, 14], color: '#1d222b', angle: 0.04 },
  { id: 'b-w3', pos: [-24, 10, -42], size: [16, 20, 18], color: '#282d38', angle: -0.03 },

  // East Block Buildings
  { id: 'b-e1', pos: [20, 14, 12], size: [14, 28, 16], color: '#20242c', angle: -0.02 },
  { id: 'b-e2', pos: [22, 18, -10], size: [15, 36, 16], color: '#1a1e26', angle: 0 },
  { id: 'b-e3', pos: [24, 11, -38], size: [16, 22, 18], color: '#232833', angle: 0.05 },

  // Distant Perimeter Ruins (North & Sides)
  { id: 'b-n1', pos: [-25, 15, -68], size: [28, 30, 16], color: '#181b22', angle: 0 },
  { id: 'b-n2', pos: [25, 17, -68], size: [30, 34, 16], color: '#181b22', angle: 0 },
  { id: 'b-s1', pos: [-18, 10, 32], size: [16, 20, 12], color: '#1e2129', angle: 0 },
  { id: 'b-s2', pos: [18, 10, 32], size: [16, 20, 12], color: '#1e2129', angle: 0 }
];

export default function Buildings() {
  // Register AABB collision boundaries for all major structures
  useEffect(() => {
    BUILDINGS_DATA.forEach((b) => {
      const halfW = b.size[0] / 2;
      const halfD = b.size[2] / 2;
      globalCollisions.addBox(
        b.pos[0] - halfW,
        b.pos[2] - halfD,
        b.pos[0] + halfW,
        b.pos[2] + halfD,
        b.id
      );
    });
  }, []);

  return (
    <group>
      {BUILDINGS_DATA.map((b) => (
        <group key={b.id} position={b.pos} rotation={[0, b.angle, 0]}>
          {/* Main Building Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={b.size} />
            <meshStandardMaterial color={b.color} roughness={0.85} metalness={0.15} />
          </mesh>

          {/* Shattered windows grid */}
          <mesh position={[0, 0, b.size[2] / 2 + 0.05]}>
            <planeGeometry args={[b.size[0] * 0.85, b.size[1] * 0.8]} />
            <meshStandardMaterial color="#0d1117" roughness={0.3} metalness={0.8} />
          </mesh>

          {/* Collapsed top / exposed rebar structure */}
          <mesh position={[0, b.size[1] / 2 + 1.2, 0]}>
            <boxGeometry args={[b.size[0] * 0.6, 2.4, b.size[2] * 0.6]} />
            <meshStandardMaterial color="#3a2f26" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
