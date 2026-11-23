import React, { useEffect } from 'react';
import { globalCollisions } from '../core/CollisionManager';

export default function Vehicles() {
  // Register vehicle colliders
  useEffect(() => {
    // Paramedic Ambulance (West Boulevard, tilted in overgrown grass)
    globalCollisions.addBox(-12.8, -17.5, -8.2, -12.5, 'veh-ambulance');
    // Heavy Fire Engine Rescue Truck (East Intersection)
    globalCollisions.addBox(5.0, 2.0, 9.5, 9.5, 'veh-fire-engine');
    // Overgrown Abandoned Civilian Sedan (South Road)
    globalCollisions.addBox(3.4, 14.0, 6.2, 18.0, 'veh-sedan');
    // Burnt-out Station Wagon (North Crossroads)
    globalCollisions.addBox(-5.8, -32.0, -2.4, -28.0, 'veh-wagon');
  }, []);

  return (
    <group>
      {/* =================================================================
          1. PARAMEDIC AMBULANCE (Modeled directly from User Reference Image 4)
          Boxy emergency ambulance with red livery and green medical cross
         ================================================================= */}
      <group position={[-10.5, 0.75, -15]} rotation={[0.04, 0.35, -0.06]}>
        {/* Front Cab */}
        <mesh castShadow receiveShadow position={[0, 0, 1.8]}>
          <boxGeometry args={[2.3, 1.5, 2.0]} />
          <meshStandardMaterial color="#d6dadf" roughness={0.6} metalness={0.2} />
        </mesh>
        {/* Windshield */}
        <mesh position={[0, 0.35, 2.82]} rotation={[0.3, 0, 0]}>
          <planeGeometry args={[1.8, 0.7]} />
          <meshStandardMaterial color="#1c2530" roughness={0.15} metalness={0.8} />
        </mesh>
        {/* Front Hood Red Strip */}
        <mesh position={[0, -0.1, 2.8]}>
          <boxGeometry args={[2.1, 0.25, 0.1]} />
          <meshStandardMaterial color="#c4281b" roughness={0.5} />
        </mesh>

        {/* Rear Medical Box Body */}
        <mesh castShadow receiveShadow position={[0, 0.28, -0.6]}>
          <boxGeometry args={[2.5, 1.9, 3.8]} />
          <meshStandardMaterial color="#e2e6ea" roughness={0.5} metalness={0.15} />
        </mesh>

        {/* Red Emergency Chevron Stripe on Side Panels (Like in Image 4!) */}
        <mesh position={[1.26, 0.35, -0.6]}>
          <planeGeometry args={[3.6, 0.55]} rotation={[0, Math.PI / 2, 0]} />
          <meshStandardMaterial color="#c4281b" roughness={0.4} />
        </mesh>
        <mesh position={[-1.26, 0.35, -0.6]}>
          <planeGeometry args={[3.6, 0.55]} rotation={[0, -Math.PI / 2, 0]} />
          <meshStandardMaterial color="#c4281b" roughness={0.4} />
        </mesh>

        {/* Green Medical Cross Emblem on Ambulance Sides (Exactly like in Image 4!) */}
        <group position={[1.27, 0.35, -0.6]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.22, 0.65]} />
            <meshBasicMaterial color="#00a859" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.65, 0.22]} />
            <meshBasicMaterial color="#00a859" />
          </mesh>
        </group>
        <group position={[-1.27, 0.35, -0.6]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.22, 0.65]} />
            <meshBasicMaterial color="#00a859" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.65, 0.22]} />
            <meshBasicMaterial color="#00a859" />
          </mesh>
        </group>

        {/* Roof Emergency Lightbar */}
        <mesh position={[0, 1.3, -0.4]}>
          <boxGeometry args={[1.8, 0.18, 0.35]} />
          <meshStandardMaterial color="#222" metalness={0.8} />
        </mesh>
        <mesh position={[-0.6, 1.32, -0.4]}>
          <boxGeometry args={[0.5, 0.16, 0.3]} />
          <meshBasicMaterial color="#ff2200" />
        </mesh>
        <mesh position={[0.6, 1.32, -0.4]}>
          <boxGeometry args={[0.5, 0.16, 0.3]} />
          <meshBasicMaterial color="#ff2200" />
        </mesh>

        {/* Heavy Mud-Splattered Wheels */}
        {[-1.15, 1.15].map((x) =>
          [-1.5, 1.6].map((z) => (
            <mesh key={`amb-w-${x}-${z}`} position={[x, -0.45, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.42, 0.42, 0.34, 14]} />
              <meshStandardMaterial color="#252422" roughness={0.9} />
            </mesh>
          ))
        )}

        {/* Overgrown Moss / Ivy creeping over the ambulance bumper */}
        <mesh position={[0.6, -0.4, 2.6]} rotation={[0.2, 0.4, 0]}>
          <dodecahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#3b5428" roughness={0.95} />
        </mesh>
      </group>

      {/* =================================================================
          2. HEAVY FIRE ENGINE RESCUE TRUCK (Modeled from User Reference Image 3)
          Red fire rescue truck with chrome bumper, equipment doors, roof ladders
         ================================================================= */}
      <group position={[7.2, 0.95, 5.5]} rotation={[0, -0.25, 0]}>
        {/* Heavy Red Cab */}
        <mesh castShadow receiveShadow position={[0, 0.3, 2.6]}>
          <boxGeometry args={[2.7, 2.1, 2.8]} />
          <meshStandardMaterial color="#b81d13" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Cab Windshield */}
        <mesh position={[0, 0.7, 4.02]} rotation={[0.2, 0, 0]}>
          <planeGeometry args={[2.2, 0.9]} />
          <meshStandardMaterial color="#1a2533" roughness={0.15} metalness={0.8} />
        </mesh>
        {/* Chrome Front Heavy Bumper */}
        <mesh position={[0, -0.4, 4.05]}>
          <boxGeometry args={[2.8, 0.5, 0.3]} />
          <meshStandardMaterial color="#d0d8e0" roughness={0.15} metalness={0.95} />
        </mesh>

        {/* Main Equipment Body (Roller Shutter Compartments) */}
        <mesh castShadow receiveShadow position={[0, 0.35, -1.2]}>
          <boxGeometry args={[2.7, 2.2, 5.4]} />
          <meshStandardMaterial color="#ab180f" roughness={0.45} metalness={0.25} />
        </mesh>

        {/* Equipment Compartment Roller Shutters (Silver metallic) */}
        {[-1.36, 1.36].map((x) =>
          [-2.6, -1.2, 0.2].map((z) => (
            <mesh key={`shutter-${x}-${z}`} position={[x, 0.25, z]}>
              <boxGeometry args={[0.08, 1.4, 1.1]} />
              <meshStandardMaterial color="#8a99a8" roughness={0.4} metalness={0.85} />
            </mesh>
          ))
        )}

        {/* Roof Emergency Lightbar & Chrome Siren Horns */}
        <mesh position={[0, 1.48, 2.4]}>
          <boxGeometry args={[2.2, 0.22, 0.4]} />
          <meshStandardMaterial color="#ff2200" />
        </mesh>
        <mesh position={[-0.6, 1.55, 3.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.16, 0.5, 10]} />
          <meshStandardMaterial color="#e0e8f0" metalness={0.95} />
        </mesh>
        <mesh position={[0.6, 1.55, 3.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.16, 0.5, 10]} />
          <meshStandardMaterial color="#e0e8f0" metalness={0.95} />
        </mesh>

        {/* Roof Aluminum Rescue Ladders */}
        <group position={[0.6, 1.6, -1.0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.5, 0.15, 4.8]} />
            <meshStandardMaterial color="#c0cdd8" roughness={0.3} metalness={0.9} />
          </mesh>
        </group>

        {/* Heavy Fire Truck Wheels (6 Wheels) */}
        {[-1.38, 1.38].map((x) =>
          [-2.5, -1.0, 2.6].map((z) => (
            <mesh key={`fire-w-${x}-${z}`} position={[x, -0.45, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.48, 0.48, 0.38, 16]} />
              <meshStandardMaterial color="#1a1c20" roughness={0.85} />
            </mesh>
          ))
        )}
      </group>

      {/* =================================================================
          3. OVERGROWN ABANDONED CIVILIAN SEDAN (With grass & moss)
         ================================================================= */}
      <group position={[4.8, 0.45, 16]} rotation={[0.05, -0.3, 0.04]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.85, 4.2]} />
          <meshStandardMaterial color="#425048" roughness={0.85} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.55, -0.3]}>
          <boxGeometry args={[1.65, 0.6, 2.2]} />
          <meshStandardMaterial color="#2c3631" roughness={0.8} />
        </mesh>
        {/* Wheels */}
        {[-1.02, 1.02].map((x) =>
          [-1.3, 1.3].map((z) => (
            <mesh key={`sed-w-${x}-${z}`} position={[x, -0.22, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.34, 0.34, 0.26, 12]} />
              <meshStandardMaterial color="#181a18" roughness={0.9} />
            </mesh>
          ))
        )}
        {/* Green Vines crawling over hood */}
        <mesh position={[0.2, 0.45, 1.4]} rotation={[0.1, 0.3, 0]}>
          <dodecahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial color="#3d572b" roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}
