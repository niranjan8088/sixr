import React from 'react';

export default function CityGround() {
  return (
    <group>
      {/* 1. Underlying Mud / Soil Bedrock Plane (Natural earth beneath broken asphalt) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, -15]} receiveShadow>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial color="#4a4437" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* 2. Main Overgrown Asphalt Boulevard (North-South) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -15]} receiveShadow>
        <planeGeometry args={[16, 120]} />
        <meshStandardMaterial color="#353a42" roughness={0.75} metalness={0.15} />
      </mesh>

      {/* 3. East-West Cross Avenue at Z = -15 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -15]} receiveShadow>
        <planeGeometry args={[110, 14]} />
        <meshStandardMaterial color="#333840" roughness={0.8} />
      </mesh>

      {/* 4. Glossy Wet Reflective Rain Puddles (Mirroring the daylight sky like in Image 1 & 2) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.8, 0.024, -4.5]}>
        <circleGeometry args={[2.8, 24]} />
        <meshStandardMaterial color="#1c2532" roughness={0.08} metalness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.6, 0.024, -24]}>
        <circleGeometry args={[3.4, 24]} />
        <meshStandardMaterial color="#1a222e" roughness={0.06} metalness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.2, 0.024, 12]}>
        <circleGeometry args={[2.2, 20]} />
        <meshStandardMaterial color="#1c2532" roughness={0.1} metalness={0.88} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, 0.024, -42]}>
        <circleGeometry args={[2.5, 20]} />
        <meshStandardMaterial color="#1d2836" roughness={0.08} metalness={0.9} />
      </mesh>

      {/* 5. Weathered Sidewalks with Moss / Dirt Bleed */}
      {/* West Sidewalk */}
      <mesh position={[-11, 0.15, -15]} receiveShadow>
        <boxGeometry args={[6, 0.3, 120]} />
        <meshStandardMaterial color="#6a6e73" roughness={0.88} metalness={0.05} />
      </mesh>
      {/* East Sidewalk */}
      <mesh position={[11, 0.15, -15]} receiveShadow>
        <boxGeometry args={[6, 0.3, 120]} />
        <meshStandardMaterial color="#6a6e73" roughness={0.88} metalness={0.05} />
      </mesh>

      {/* Sidewalk Concrete Curbs */}
      <mesh position={[-7.9, 0.18, -15]}>
        <boxGeometry args={[0.22, 0.36, 120]} />
        <meshStandardMaterial color="#555a60" roughness={0.8} />
      </mesh>
      <mesh position={[7.9, 0.18, -15]}>
        <boxGeometry args={[0.22, 0.36, 120]} />
        <meshStandardMaterial color="#555a60" roughness={0.8} />
      </mesh>

      {/* Cast-Iron Road Storm Drain Grates along Curbs */}
      {[-35, -12, 10, 24].map((zD, dI) => (
        <group key={`drain-${dI}`} position={[-7.4, 0.025, zD]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.7, 1.4]} />
            <meshStandardMaterial color="#1c1917" metalness={0.9} roughness={0.4} />
          </mesh>
          {/* Slotted Grate Bars */}
          {[-0.2, 0, 0.2].map((bx, bi) => (
            <mesh key={`bar-${bi}`} position={[bx, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.06, 1.3]} />
              <meshStandardMaterial color="#292524" metalness={0.95} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Cast-Iron Circular Manhole Covers in Roadway */}
      {[-28, -2, 16].map((zM, mI) => (
        <group key={`manhole-${mI}`} position={[mI % 2 === 0 ? -2.2 : 2.5, 0.024, zM]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.6, 24]} />
            <meshStandardMaterial color="#292524" metalness={0.85} roughness={0.5} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
            <ringGeometry args={[0.3, 0.52, 24]} />
            <meshStandardMaterial color="#1c1917" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Cast-Iron Red Emergency Fire Hydrants on Sidewalks */}
      {[-8.5, 8.5].map((hx, hi) =>
        [-20, 15].map((hz, zi) => (
          <group key={`hydrant-${hi}-${zi}`} position={[hx, 0.3, hz]}>
            {/* Main Barrel Body */}
            <mesh position={[0, 0.32, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.18, 0.65, 12]} />
              <meshStandardMaterial color="#dc2626" roughness={0.45} metalness={0.3} />
            </mesh>
            {/* Top Cap Bonnet */}
            <mesh position={[0, 0.68, 0]}>
              <cylinderGeometry args={[0.12, 0.18, 0.15, 12]} />
              <meshStandardMaterial color="#b91c1c" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.78, 0]}>
              <sphereGeometry args={[0.07, 10, 8]} />
              <meshStandardMaterial color="#991b1b" />
            </mesh>
            {/* Side Hose Outlets */}
            <mesh position={[0.18, 0.38, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.15, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.8} />
            </mesh>
            <mesh position={[-0.18, 0.38, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.15, 8]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.8} />
            </mesh>
          </group>
        ))
      )}

      {/* Road Asphalt Fissure Cracks (Panel 1 Match) */}
      {[-32, -8, 8].map((zC, cI) => (
        <group key={`crack-${cI}`} position={[0, 0.021, zC]} rotation={[0, cI * 0.4, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[11.5, 0.12]} />
            <meshStandardMaterial color="#18181b" roughness={0.99} />
          </mesh>
          <mesh position={[0.5, 0.001, 0.2]} rotation={[-Math.PI / 2, 0, 0.25]}>
            <planeGeometry args={[6.0, 0.08]} />
            <meshStandardMaterial color="#18181b" roughness={0.99} />
          </mesh>
        </group>
      ))}

      {/* 6. Overgrown Vegetation & Grass Tufts (Along Curbs and Cracks) */}
      {[-45, -35, -25, -12, 0, 8, 18, 28].map((z, idx) => (
        <group key={`foliage-w-${idx}`} position={[-7.7, 0.22, z]}>
          <mesh rotation={[0, idx * 0.7, 0]}>
            <coneGeometry args={[0.45, 0.5, 6]} />
            <meshStandardMaterial color="#3e5932" roughness={0.9} />
          </mesh>
          <mesh position={[0.2, 0, 0.3]} rotation={[0, idx * 1.2, 0]}>
            <coneGeometry args={[0.35, 0.42, 5]} />
            <meshStandardMaterial color="#50703f" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {[-40, -30, -18, -5, 5, 15, 25].map((z, idx) => (
        <group key={`foliage-e-${idx}`} position={[7.7, 0.22, z]}>
          <mesh rotation={[0, idx * 0.9, 0]}>
            <coneGeometry args={[0.48, 0.52, 6]} />
            <meshStandardMaterial color="#446136" roughness={0.9} />
          </mesh>
          <mesh position={[-0.2, 0, -0.3]} rotation={[0, idx * 1.5, 0]}>
            <coneGeometry args={[0.32, 0.38, 5]} />
            <meshStandardMaterial color="#547842" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 7. Faded Center Double Yellow Road Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.15, 0.022, 10]}>
        <planeGeometry args={[0.15, 45]} />
        <meshStandardMaterial color="#bfa03b" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.15, 0.022, 10]}>
        <planeGeometry args={[0.15, 45]} />
        <meshStandardMaterial color="#bfa03b" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.15, 0.022, -40]}>
        <planeGeometry args={[0.15, 36]} />
        <meshStandardMaterial color="#bfa03b" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.15, 0.022, -40]}>
        <planeGeometry args={[0.15, 36]} />
        <meshStandardMaterial color="#bfa03b" roughness={0.8} />
      </mesh>

      {/* 8. Faded White Dashed Lane Dividers */}
      {[-45, -35, -25, 2, 12, 22].map((zPos, i) => (
        <group key={`lanes-${i}`}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.8, 0.022, zPos]}>
            <planeGeometry args={[0.2, 3.2]} />
            <meshStandardMaterial color="#abb5c2" roughness={0.8} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.8, 0.022, zPos]}>
            <planeGeometry args={[0.2, 3.2]} />
            <meshStandardMaterial color="#abb5c2" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 9. Pedestrian Crosswalks (Zebra Crossing at Z = -15) */}
      {[-6, -4.5, -3, -1.5, 0, 1.5, 3, 4.5, 6].map((x, i) => (
        <mesh key={`cross-s-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.023, -7.5]}>
          <planeGeometry args={[0.8, 2.8]} />
          <meshStandardMaterial color="#a0acba" roughness={0.85} />
        </mesh>
      ))}
      {[-6, -4.5, -3, -1.5, 0, 1.5, 3, 4.5, 6].map((x, i) => (
        <mesh key={`cross-n-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.023, -22.5]}>
          <planeGeometry args={[0.8, 2.8]} />
          <meshStandardMaterial color="#a0acba" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}
