import React from 'react';

export default function CityGround() {
  return (
    <group>
      {/* 1. Base Ground Bedrock / Concrete Foundation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -15]} receiveShadow>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial color="#1a2028" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* 2. Main Devastated 4-Lane Asphalt Boulevard (North-South) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -15]} receiveShadow>
        <planeGeometry args={[16, 120]} />
        <meshStandardMaterial color="#22262e" roughness={0.85} metalness={0.12} />
      </mesh>

      {/* 3. East-West Cross Avenue at Z = -15 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -15]} receiveShadow>
        <planeGeometry args={[100, 14]} />
        <meshStandardMaterial color="#1f232b" roughness={0.88} />
      </mesh>

      {/* 4. Raised Concrete Sidewalks (West & East) */}
      {/* West Sidewalk */}
      <mesh position={[-11, 0.15, -15]} receiveShadow>
        <boxGeometry args={[6, 0.3, 120]} />
        <meshStandardMaterial color="#424954" roughness={0.78} metalness={0.1} />
      </mesh>
      {/* East Sidewalk */}
      <mesh position={[11, 0.15, -15]} receiveShadow>
        <boxGeometry args={[6, 0.3, 120]} />
        <meshStandardMaterial color="#424954" roughness={0.78} metalness={0.1} />
      </mesh>

      {/* Sidewalk Curbs with yellow paint segments */}
      <mesh position={[-7.9, 0.18, -15]}>
        <boxGeometry args={[0.22, 0.36, 120]} />
        <meshStandardMaterial color="#555c68" roughness={0.7} />
      </mesh>
      <mesh position={[7.9, 0.18, -15]}>
        <boxGeometry args={[0.22, 0.36, 120]} />
        <meshStandardMaterial color="#555c68" roughness={0.7} />
      </mesh>

      {/* 5. Road Markings: Double Yellow Center Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.15, 0.025, 10]}>
        <planeGeometry args={[0.15, 45]} />
        <meshStandardMaterial color="#e0a825" roughness={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.15, 0.025, 10]}>
        <planeGeometry args={[0.15, 45]} />
        <meshStandardMaterial color="#e0a825" roughness={0.6} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.15, 0.025, -40]}>
        <planeGeometry args={[0.15, 36]} />
        <meshStandardMaterial color="#e0a825" roughness={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.15, 0.025, -40]}>
        <planeGeometry args={[0.15, 36]} />
        <meshStandardMaterial color="#e0a825" roughness={0.6} />
      </mesh>

      {/* 6. Dashed White Lane Dividers */}
      {[-45, -35, -25, 2, 12, 22].map((zPos, i) => (
        <group key={`lanes-${i}`}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.8, 0.024, zPos]}>
            <planeGeometry args={[0.2, 3.2]} />
            <meshStandardMaterial color="#d4dce8" roughness={0.6} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.8, 0.024, zPos]}>
            <planeGeometry args={[0.2, 3.2]} />
            <meshStandardMaterial color="#d4dce8" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* 7. Pedestrian Crosswalks (Zebra Stripes at Intersection Z = -15) */}
      {/* South Crosswalk (Z = -7.5) */}
      {[-6, -4.5, -3, -1.5, 0, 1.5, 3, 4.5, 6].map((x, i) => (
        <mesh key={`cross-s-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.025, -7.5]}>
          <planeGeometry args={[0.8, 2.8]} />
          <meshStandardMaterial color="#c5d2e0" roughness={0.65} />
        </mesh>
      ))}
      {/* North Crosswalk (Z = -22.5) */}
      {[-6, -4.5, -3, -1.5, 0, 1.5, 3, 4.5, 6].map((x, i) => (
        <mesh key={`cross-n-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.025, -22.5]}>
          <planeGeometry args={[0.8, 2.8]} />
          <meshStandardMaterial color="#c5d2e0" roughness={0.65} />
        </mesh>
      ))}

      {/* 8. Cracked Asphalt Decals & Dark Oil Slicks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.5, 0.026, -5]}>
        <circleGeometry args={[2.2, 16]} />
        <meshStandardMaterial color="#111317" roughness={0.4} metalness={0.2} transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.2, 0.026, -26]}>
        <circleGeometry args={[3.0, 16]} />
        <meshStandardMaterial color="#0e1014" roughness={0.3} metalness={0.4} transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.2, 0.026, 15]}>
        <circleGeometry args={[1.6, 16]} />
        <meshStandardMaterial color="#12151b" roughness={0.5} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
