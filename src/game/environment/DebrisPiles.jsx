import React, { useEffect } from 'react';
import { globalCollisions } from '../core/CollisionManager';

const DEBRIS_CYLINDERS = [
  { x: -3.5, z: 5, radius: 1.2 },
  { x: 4.2, z: -8, radius: 1.4 },
  { x: -5.0, z: -25, radius: 1.5 },
  { x: 3.8, z: -32, radius: 1.3 },
  { x: -14, z: -8, radius: 1.8 },
  { x: 18, z: -18, radius: 1.8 }
];

export default function DebrisPiles() {
  useEffect(() => {
    DEBRIS_CYLINDERS.forEach((d, i) => {
      globalCollisions.addCylinder(d.x, d.z, d.radius, `debris-${i}`);
    });
  }, []);

  return (
    <group>
      {/* 1. Overgrown Rubble Mounds with Moss & Concrete Slabs */}
      {DEBRIS_CYLINDERS.map((d, idx) => (
        <group key={idx} position={[d.x, 0, d.z]}>
          {/* Main Weathered Concrete Slab */}
          <mesh castShadow receiveShadow position={[0, 0.45, 0]} rotation={[0.2, idx * 1.1, -0.15]}>
            <dodecahedronGeometry args={[d.radius * 0.9, 0]} />
            <meshStandardMaterial color="#4a4d46" roughness={0.9} />
          </mesh>

          {/* Green Moss Patch on Slab Top */}
          <mesh position={[0.1, 0.75, 0]} rotation={[0.1, idx * 1.1, -0.1]}>
            <dodecahedronGeometry args={[d.radius * 0.55, 0]} />
            <meshStandardMaterial color="#354d24" roughness={0.95} />
          </mesh>

          {/* Fallen Weathered Wooden Tree Trunk / Log (Like in Image 1 & 4) */}
          <mesh position={[0.2, 0.35, 0.1]} rotation={[0.1, idx * 0.8, 1.4]}>
            <cylinderGeometry args={[0.22, 0.28, 3.4, 8]} />
            <meshStandardMaterial color="#382e22" roughness={0.88} />
          </mesh>

          {/* Twisted Rusty Structural Steel I-Beam / H-Girder (Panel 2 Match) */}
          {idx % 2 === 0 && (
            <group position={[-0.4, 0.6, 0.3]} rotation={[0.4, idx * 0.9, -0.6]}>
              {/* Web */}
              <mesh castShadow>
                <boxGeometry args={[0.06, 3.2, 0.35]} />
                <meshStandardMaterial color="#78350f" roughness={0.7} metalness={0.8} />
              </mesh>
              {/* Flanges */}
              <mesh position={[-0.04, 0, 0]}>
                <boxGeometry args={[0.04, 3.2, 0.12]} />
                <meshStandardMaterial color="#78350f" metalness={0.8} />
              </mesh>
              <mesh position={[0.04, 0, 0]}>
                <boxGeometry args={[0.04, 3.2, 0.12]} />
                <meshStandardMaterial color="#78350f" metalness={0.8} />
              </mesh>
            </group>
          )}

          {/* Shattered Concrete Cinderblock Chunks */}
          {[-0.6, 0.5].map((cx, ci) => (
            <mesh key={`block-${ci}`} position={[cx, 0.2, -0.4]} rotation={[0.3 * ci, 0.5 * ci, 0.2]}>
              <boxGeometry args={[0.45, 0.3, 0.4]} />
              <meshStandardMaterial color="#64748b" roughness={0.92} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 2. Overgrown Pine / Greenery Trees flanking the avenues (Like Image 1, 2, and 4) */}
      {[
        { pos: [-13, 0, 10], s: 1.2 },
        { pos: [13, 0, 10], s: 1.1 },
        { pos: [-13, 0, -22], s: 1.3 },
        { pos: [13, 0, -20], s: 1.2 },
        { pos: [-14, 0, -40], s: 1.4 },
        { pos: [14, 0, -38], s: 1.3 }
      ].map((tree, i) => (
        <group key={`tree-${i}`} position={tree.pos} scale={[tree.s, tree.s, tree.s]}>
          {/* Tree Trunk */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.35, 3.6, 8]} />
            <meshStandardMaterial color="#3a2f24" roughness={0.9} />
          </mesh>
          {/* Tier 1 Pine Foliage */}
          <mesh position={[0, 3.8, 0]} castShadow>
            <coneGeometry args={[1.8, 2.5, 7]} />
            <meshStandardMaterial color="#2d4520" roughness={0.95} />
          </mesh>
          {/* Tier 2 Pine Foliage */}
          <mesh position={[0, 5.2, 0]} castShadow>
            <coneGeometry args={[1.4, 2.2, 7]} />
            <meshStandardMaterial color="#385428" roughness={0.95} />
          </mesh>
          {/* Tier 3 Pine Foliage */}
          <mesh position={[0, 6.4, 0]} castShadow>
            <coneGeometry args={[0.9, 1.8, 6]} />
            <meshStandardMaterial color="#426330" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* 3. Wild Fern Patches & Dense Groundcover (Exact match to Rooted in Image 4!) */}
      {[
        [-10.5, -12.5],
        [-8.2, -14.8],
        [-11.2, -16.0],
        [-7.8, -5.0],
        [7.5, -10.0],
        [8.2, 2.0],
        [-8.0, 14.0],
        [8.5, 12.0]
      ].map(([fx, fz], fIdx) => (
        <group key={`fern-clump-${fIdx}`} position={[fx, 0.12, fz]}>
          {/* Radiating fern leaf fronds */}
          {[0, 1.05, 2.1, 3.14, 4.19, 5.24].map((rad, leafIdx) => (
            <mesh
              key={`frond-${leafIdx}`}
              rotation={[0.3, rad, 0.45]}
              position={[Math.cos(rad) * 0.25, 0.15, Math.sin(rad) * 0.25]}
            >
              <planeGeometry args={[0.42, 0.9]} />
              <meshStandardMaterial color={leafIdx % 2 === 0 ? '#3f6212' : '#4d7c0f'} roughness={0.9} side={2} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
