import React, { useEffect } from 'react';
import { globalCollisions } from '../core/CollisionManager';

export default function Vehicles() {
  // Register vehicle colliders
  useEffect(() => {
    globalCollisions.addBox(-6.8, -8.5, -3.6, -4.5, 'veh-police');
    globalCollisions.addBox(4.0, -30.0, 7.0, -26.0, 'veh-burnt-suv');
    globalCollisions.addBox(-14.0, -17.0, -10.0, -13.0, 'veh-ambulance');
    globalCollisions.addBox(3.4, 6.0, 6.2, 10.0, 'veh-sedan');
  }, []);

  return (
    <group>
      {/* 1. Abandoned Police Cruiser (Tilted on boulevard with hazard flashers) */}
      <group position={[-5.2, 0.45, -6.5]} rotation={[0, 0.35, 0.05]}>
        {/* Main Chassis */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.9, 4.4]} />
          <meshStandardMaterial color="#1a202c" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Cabin / Roof */}
        <mesh castShadow position={[0, 0.65, -0.3]}>
          <boxGeometry args={[1.7, 0.65, 2.2]} />
          <meshStandardMaterial color="#f0f4f8" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Tinted Windshield / Windows */}
        <mesh position={[0, 0.65, 0.85]} rotation={[0.4, 0, 0]}>
          <planeGeometry args={[1.6, 0.8]} />
          <meshStandardMaterial color="#0c1219" roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Wheels (Heavy rubber tires) */}
        {[-1.05, 1.05].map((x) =>
          [-1.4, 1.4].map((z) => (
            <mesh key={`pol-w-${x}-${z}`} position={[x, -0.22, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.38, 0.38, 0.32, 14]} />
              <meshStandardMaterial color="#111317" roughness={0.9} />
            </mesh>
          ))
        )}
        {/* Police Lightbar on Roof */}
        <mesh position={[0, 1.05, -0.3]}>
          <boxGeometry args={[1.4, 0.16, 0.3]} />
          <meshStandardMaterial color="#333" metalness={0.8} />
        </mesh>
        {/* Red Flasher Dome */}
        <mesh position={[-0.45, 1.06, -0.3]}>
          <boxGeometry args={[0.45, 0.18, 0.28]} />
          <meshBasicMaterial color="#ff2222" />
        </mesh>
        {/* Blue Flasher Dome */}
        <mesh position={[0.45, 1.06, -0.3]}>
          <boxGeometry args={[0.45, 0.18, 0.28]} />
          <meshBasicMaterial color="#0088ff" />
        </mesh>
        {/* Front Push-Bumper */}
        <mesh position={[0, -0.1, 2.25]}>
          <boxGeometry args={[1.8, 0.5, 0.2]} />
          <meshStandardMaterial color="#000" metalness={0.9} />
        </mesh>
      </group>

      {/* 2. Burnt-out Civilian SUV (Rusted skeleton with fire and charred metal) */}
      <group position={[5.5, 0.5, -28]} rotation={[0.08, -0.4, -0.06]}>
        {/* Charred Body Shell */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.3, 1.1, 4.6]} />
          <meshStandardMaterial color="#2d221c" roughness={0.95} metalness={0.2} />
        </mesh>
        {/* Scorched Roof */}
        <mesh position={[0, 0.75, -0.2]}>
          <boxGeometry args={[1.9, 0.7, 2.6]} />
          <meshStandardMaterial color="#1e1814" roughness={0.9} />
        </mesh>
        {/* Burnt Wheel Hubs (Tires melted off) */}
        {[-1.1, 1.1].map((x) =>
          [-1.4, 1.4].map((z) => (
            <mesh key={`burnt-w-${x}-${z}`} position={[x, -0.25, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 0.24, 10]} />
              <meshStandardMaterial color="#3a251b" roughness={0.8} metalness={0.5} />
            </mesh>
          ))
        )}
        {/* Fire flames inside engine bay */}
        <mesh position={[0, 0.7, 1.6]}>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshBasicMaterial color="#ff5500" />
        </mesh>
      </group>

      {/* 3. Crashed Ambulance / Paramedic Van (Blocking west avenue intersection) */}
      <group position={[-12, 0.65, -15]} rotation={[0, 1.1, 0.04]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.4, 1.5, 5.2]} />
          <meshStandardMaterial color="#d8dede" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* High-Vis Orange/Red Side Chevrons */}
        <mesh position={[1.22, 0.1, 0]}>
          <planeGeometry args={[4.2, 0.6]} rotation={[0, Math.PI / 2, 0]} />
          <meshStandardMaterial color="#e84010" />
        </mesh>
        {/* Heavy Wheels */}
        {[-1.2, 1.2].map((x) =>
          [-1.6, 1.6].map((z) => (
            <mesh key={`amb-w-${x}-${z}`} position={[x, -0.42, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.42, 0.42, 0.35, 14]} />
              <meshStandardMaterial color="#16181c" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>

      {/* 4. Civilian Sedan (Near South Spawn road) */}
      <group position={[4.8, 0.4, 8]} rotation={[0, -0.2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.8, 4.2]} />
          <meshStandardMaterial color="#35495e" roughness={0.35} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0.55, -0.3]}>
          <boxGeometry args={[1.6, 0.55, 2.0]} />
          <meshStandardMaterial color="#1a232d" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Wheels */}
        {[-1.0, 1.0].map((x) =>
          [-1.3, 1.3].map((z) => (
            <mesh key={`sed-w-${x}-${z}`} position={[x, -0.18, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.34, 0.34, 0.28, 12]} />
              <meshStandardMaterial color="#15171b" roughness={0.9} />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
}
