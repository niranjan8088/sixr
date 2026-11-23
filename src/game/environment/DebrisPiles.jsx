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

/**
 * Realistic Organic Pine Tree (Replaces the 3-stacked toy cones).
 * Tapered rugged bark trunk with staggered, multi-angle organic foliage crowns.
 */
function RealisticPineTree({ position, scale = 1.0 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Rugged Central Trunk */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.38, 4.4, 8]} />
        <meshStandardMaterial color="#2c221a" roughness={0.92} />
      </mesh>

      {/* Primary Lower Branched Foliage Canopy (Organic Dodecahedrons at staggered angles) */}
      <group position={[0, 3.2, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <dodecahedronGeometry args={[1.75, 1]} />
          <meshStandardMaterial color="#23381a" roughness={0.95} />
        </mesh>
        <mesh position={[0.45, -0.2, 0.4]} rotation={[0.2, 0.5, 0.1]} castShadow>
          <dodecahedronGeometry args={[1.3, 1]} />
          <meshStandardMaterial color="#2d4520" roughness={0.95} />
        </mesh>
        <mesh position={[-0.4, -0.15, -0.35]} rotation={[-0.1, 0.8, -0.2]} castShadow>
          <dodecahedronGeometry args={[1.25, 1]} />
          <meshStandardMaterial color="#1e3016" roughness={0.95} />
        </mesh>
      </group>

      {/* Mid Canopy Clump */}
      <group position={[0, 4.8, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <dodecahedronGeometry args={[1.4, 1]} />
          <meshStandardMaterial color="#28401e" roughness={0.95} />
        </mesh>
        <mesh position={[-0.3, 0.1, 0.3]} rotation={[0.3, 0.4, -0.1]} castShadow>
          <dodecahedronGeometry args={[1.1, 1]} />
          <meshStandardMaterial color="#325026" roughness={0.95} />
        </mesh>
      </group>

      {/* Crown Apex */}
      <mesh position={[0, 6.2, 0]} castShadow>
        <dodecahedronGeometry args={[1.05, 1]} />
        <meshStandardMaterial color="#3a5a2c" roughness={0.95} />
      </mesh>
      <mesh position={[0, 7.1, 0]} castShadow>
        <coneGeometry args={[0.65, 1.4, 7]} />
        <meshStandardMaterial color="#2e4822" roughness={0.95} />
      </mesh>
    </group>
  );
}

export default function DebrisPiles() {
  useEffect(() => {
    DEBRIS_CYLINDERS.forEach((d, i) => {
      globalCollisions.addCylinder(d.x, d.z, d.radius, `debris-${i}`);
    });
  }, []);

  return (
    <group>
      {/* 1. Realistic Disaster Rubble: Shattered Concrete Slabs, Rebar, Fallen Beams & Crushed Brick */}
      {DEBRIS_CYLINDERS.map((d, idx) => (
        <group key={idx} position={[d.x, 0, d.z]}>
          {/* Main Tilted Fractured Concrete Road Slab */}
          <mesh castShadow receiveShadow position={[0, 0.22, 0]} rotation={[0.18, idx * 0.9, -0.12]}>
            <boxGeometry args={[d.radius * 1.6, 0.35, d.radius * 1.4]} />
            <meshStandardMaterial color="#52565c" roughness={0.92} metalness={0.08} />
          </mesh>

          {/* Secondary Overlapping Shattered Slab */}
          <mesh castShadow receiveShadow position={[0.2, 0.45, 0.1]} rotation={[-0.2, idx * 1.3, 0.22]}>
            <boxGeometry args={[d.radius * 1.1, 0.28, d.radius * 0.9]} />
            <meshStandardMaterial color="#636870" roughness={0.9} metalness={0.05} />
          </mesh>

          {/* Overgrown Green Moss & Soil Clump on Slab Edge */}
          <mesh position={[-0.2, 0.38, 0.3]} rotation={[0.1, idx * 0.8, -0.1]}>
            <boxGeometry args={[d.radius * 0.8, 0.2, d.radius * 0.6]} />
            <meshStandardMaterial color="#354d24" roughness={0.96} />
          </mesh>

          {/* Fallen Weathered Wooden Beam / Log (Matching Image 1 & 4) */}
          <mesh position={[0.2, 0.3, 0.1]} rotation={[0.12, idx * 0.8, 1.42]}>
            <cylinderGeometry args={[0.18, 0.22, 3.2, 8]} />
            <meshStandardMaterial color="#382e22" roughness={0.88} />
          </mesh>

          {/* Twisted Exposed Rusty Structural Rebar Rods */}
          <group position={[-0.3, 0.5, 0.2]} rotation={[0.3, idx * 0.9, -0.5]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.02, 0.02, 2.8, 6]} />
              <meshStandardMaterial color="#78350f" roughness={0.7} metalness={0.85} />
            </mesh>
            <mesh position={[0.12, 0.2, 0.05]} rotation={[0.2, 0, 0.3]}>
              <cylinderGeometry args={[0.018, 0.018, 1.6, 6]} />
              <meshStandardMaterial color="#92400e" roughness={0.7} metalness={0.8} />
            </mesh>
          </group>

          {/* Shattered Concrete Cinderblock Chunks */}
          {[-0.6, 0.55].map((cx, ci) => (
            <mesh key={`block-${ci}`} position={[cx, 0.16, -0.35]} rotation={[0.25 * ci, 0.6 * ci, 0.15]}>
              <boxGeometry args={[0.42, 0.24, 0.36]} />
              <meshStandardMaterial color="#71717a" roughness={0.92} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 2. Realistic Overgrown Pine Trees flanking the avenues (Replaces 3-cone trees) */}
      {[
        { pos: [-13, 0, 10], s: 1.15 },
        { pos: [13, 0, 10], s: 1.05 },
        { pos: [-13, 0, -22], s: 1.25 },
        { pos: [13, 0, -20], s: 1.15 },
        { pos: [-14, 0, -40], s: 1.35 },
        { pos: [14, 0, -38], s: 1.25 }
      ].map((tree, i) => (
        <RealisticPineTree key={`tree-${i}`} position={tree.pos} scale={tree.s} />
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
