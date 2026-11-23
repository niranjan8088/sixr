/**
 * AFTERLIGHT — World.jsx
 * OWNER: Niranjan
 *
 * Environment: ground, collapsed structures, atmospheric props.
 * This is a placeholder — Niranjan should flesh this out.
 *
 * Requirements from gameplay systems:
 *   - Keep the following areas clear (survivor positions):
 *       Survivor 1 (Maya):  [-8, 0, -6]  radius ~2.5
 *       Survivor 2 (Ravi):  [10, 0, -4]  radius ~2.5
 *       Survivor 3 (Anika): [2,  0, -18] radius ~2.5
 *   - Keep extraction zone clear: [0, 0, 20] radius ~3.5
 *   - Player spawn: [0, 0, 0]
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function World() {
  return (
    <group name="world">
      {/* Ground plane */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#2d3748" roughness={0.9} metalness={0.0} />
      </mesh>

      {/* Rubble blocks — collapsed structure aesthetic */}
      <RubbleField />

      {/* Perimeter walls */}
      <mesh position={[-30, 2, 0]} castShadow>
        <boxGeometry args={[1, 5, 60]} />
        <meshStandardMaterial color="#374151" roughness={0.9} />
      </mesh>
      <mesh position={[30, 2, 0]} castShadow>
        <boxGeometry args={[1, 5, 60]} />
        <meshStandardMaterial color="#374151" roughness={0.9} />
      </mesh>
    </group>
  );
}

function RubbleField() {
  // Deterministic rubble — seeded positions so they don't shift on re-render
  const pieces = [
    { pos: [-5, 0, -3],   rot: [0.2, 0.5, 0.1],  scale: [2, 0.6, 1.5], color: '#4b5563' },
    { pos: [4,  0, -2],   rot: [0.1, 1.2, 0.3],  scale: [1.5, 0.8, 2], color: '#374151' },
    { pos: [-12, 0, -10], rot: [0.3, 0.8, 0.0],  scale: [3, 1, 2],     color: '#4b5563' },
    { pos: [14, 0, -8],   rot: [0.0, 0.3, 0.2],  scale: [2, 1.2, 1.5], color: '#374151' },
    { pos: [6,  0, -15],  rot: [0.4, 0.6, 0.1],  scale: [2.5, 0.9, 2], color: '#4b5563' },
    { pos: [-3, 0, -20],  rot: [0.1, 1.0, 0.0],  scale: [1.8, 0.7, 1.4], color: '#374151' },
    { pos: [15, 0, 5],    rot: [0.2, 0.4, 0.3],  scale: [2, 1.5, 1],   color: '#4b5563' },
    { pos: [-8, 0, 10],   rot: [0.0, 0.9, 0.1],  scale: [1.5, 0.8, 2.5], color: '#374151' },
  ];

  return (
    <group name="rubble">
      {pieces.map((p, i) => (
        <mesh
          key={i}
          castShadow
          receiveShadow
          position={p.pos}
          rotation={p.rot}
          scale={p.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={p.color} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}
