import React from 'react';

export default function CityGround() {
  return (
    <group>
      {/* Primary Devastated Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -15]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color="#1a1c22" roughness={0.92} metalness={0.1} />
      </mesh>

      {/* Main Devastated Boulevard (North-South, cracked asphalt) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -15]} receiveShadow>
        <planeGeometry args={[12, 110]} />
        <meshStandardMaterial color="#111317" roughness={0.88} />
      </mesh>

      {/* Broken Yellow Center Street Markings */}
      {[-35, -25, -5, 5, 15, 25].map((zPos, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, zPos]}>
          <planeGeometry args={[0.35, 4]} />
          <meshStandardMaterial color="#c49a2a" roughness={0.7} />
        </mesh>
      ))}

      {/* Crossroad (East-West) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, -15]} receiveShadow>
        <planeGeometry args={[75, 10]} />
        <meshStandardMaterial color="#14171d" roughness={0.85} />
      </mesh>

      {/* Broken Concrete Sidewalk Curbs */}
      <mesh position={[-6.2, 0.08, -15]}>
        <boxGeometry args={[0.4, 0.16, 110]} />
        <meshStandardMaterial color="#323842" roughness={0.9} />
      </mesh>
      <mesh position={[6.2, 0.08, -15]}>
        <boxGeometry args={[0.4, 0.16, 110]} />
        <meshStandardMaterial color="#323842" roughness={0.9} />
      </mesh>
    </group>
  );
}
