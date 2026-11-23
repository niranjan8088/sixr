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
      {/* Scattered Concrete Slabs and Rubble */}
      {DEBRIS_CYLINDERS.map((d, idx) => (
        <group key={idx} position={[d.x, 0, d.z]}>
          {/* Main Rubble Mound */}
          <mesh castShadow receiveShadow position={[0, 0.45, 0]} rotation={[0.2, idx * 1.1, -0.15]}>
            <dodecahedronGeometry args={[d.radius * 0.9, 0]} />
            <meshStandardMaterial color="#353b45" roughness={0.9} />
          </mesh>

          {/* Fallen Steel Girder */}
          <mesh position={[0.2, 0.6, 0.1]} rotation={[0.4, idx * 0.8, 0.9]}>
            <boxGeometry args={[0.3, 3.2, 0.3]} />
            <meshStandardMaterial color="#6a3520" roughness={0.7} metalness={0.6} />
          </mesh>

          {/* Broken Rebar Spikes */}
          <mesh position={[-0.4, 0.8, -0.3]} rotation={[-0.3, 0, 0.4]}>
            <cylinderGeometry args={[0.04, 0.04, 1.8, 6]} />
            <meshStandardMaterial color="#8a5030" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Emergency Road Barricade at South Spawn Perimeter */}
      <group position={[0, 0.6, 26]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[14, 1.2, 0.4]} />
          <meshStandardMaterial color="#2d333b" roughness={0.7} />
        </mesh>
        {/* Warning Stripes */}
        {[-5, -2.5, 0, 2.5, 5].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.21]}>
            <planeGeometry args={[1.2, 0.9]} />
            <meshStandardMaterial color="#ff7700" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
