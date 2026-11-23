import React, { useEffect } from 'react';
import { globalCollisions } from '../core/CollisionManager';

export default function Vehicles() {
  // Register vehicle colliders
  useEffect(() => {
    // Paramedic Ambulance (Positioned along the roadside overgrown path, matching Image 4)
    globalCollisions.addBox(-11.5, -16.5, -7.5, -10.5, 'veh-ambulance');
    // Heavy Fire Engine Rescue Truck (East Intersection, matching Image 3)
    globalCollisions.addBox(5.0, 2.0, 9.5, 9.5, 'veh-fire-engine');
    // Overgrown Civilian SUV
    globalCollisions.addBox(3.4, 14.0, 6.2, 18.0, 'veh-suv');
    // Rusted Station Wagon (North path)
    globalCollisions.addBox(-5.8, -32.0, -2.4, -28.0, 'veh-wagon');
  }, []);

  return (
    <group>
      {/* =================================================================
          1. REALISTIC PARAMEDIC AMBULANCE (Exact match to User Reference Image 4)
          Weathered emergency ambulance van, red chevron stripes, green cross emblem
         ================================================================= */}
      <group position={[-9.5, 0.72, -13.5]} rotation={[0.03, 0.45, -0.05]}>
        {/* Front Cab (Van hood and driver compartment) */}
        <mesh castShadow receiveShadow position={[0, 0, 1.75]}>
          <boxGeometry args={[2.3, 1.45, 1.9]} />
          <meshStandardMaterial color="#d4d8dc" roughness={0.6} metalness={0.15} />
        </mesh>

        {/* Slanted Windshield */}
        <mesh position={[0, 0.32, 2.72]} rotation={[0.32, 0, 0]}>
          <planeGeometry args={[1.85, 0.68]} />
          <meshStandardMaterial color="#1a222c" roughness={0.12} metalness={0.85} />
        </mesh>

        {/* Front Radiator Grille & Dual Headlights */}
        <mesh position={[0, -0.15, 2.71]}>
          <boxGeometry args={[1.5, 0.42, 0.08]} />
          <meshStandardMaterial color="#1e1e1e" roughness={0.7} metalness={0.4} />
        </mesh>
        <mesh position={[-0.9, -0.15, 2.72]}>
          <boxGeometry args={[0.3, 0.22, 0.06]} />
          <meshBasicMaterial color="#fffbe8" />
        </mesh>
        <mesh position={[0.9, -0.15, 2.72]}>
          <boxGeometry args={[0.3, 0.22, 0.06]} />
          <meshBasicMaterial color="#fffbe8" />
        </mesh>

        {/* Black Heavy Front Bumper */}
        <mesh position={[0, -0.45, 2.78]}>
          <boxGeometry args={[2.4, 0.35, 0.22]} />
          <meshStandardMaterial color="#22252a" roughness={0.8} />
        </mesh>

        {/* Rear Medical Ambulance Box Body */}
        <mesh castShadow receiveShadow position={[0, 0.26, -0.6]}>
          <boxGeometry args={[2.5, 1.95, 3.8]} />
          <meshStandardMaterial color="#e0e4e8" roughness={0.55} metalness={0.15} />
        </mesh>

        {/* Red Emergency Chevron Stripe on Side Panels (Exact shape from Image 4!) */}
        <mesh position={[1.26, 0.35, -0.6]}>
          <planeGeometry args={[3.6, 0.6]} rotation={[0, Math.PI / 2, 0]} />
          <meshStandardMaterial color="#b82519" roughness={0.45} />
        </mesh>
        <mesh position={[-1.26, 0.35, -0.6]}>
          <planeGeometry args={[3.6, 0.6]} rotation={[0, -Math.PI / 2, 0]} />
          <meshStandardMaterial color="#b82519" roughness={0.45} />
        </mesh>

        {/* Green Medical Cross Emblem on Ambulance Sides (Exactly like in Image 4!) */}
        <group position={[1.27, 0.35, -0.6]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.24, 0.72]} />
            <meshBasicMaterial color="#00994d" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.72, 0.24]} />
            <meshBasicMaterial color="#00994d" />
          </mesh>
        </group>
        <group position={[-1.27, 0.35, -0.6]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.24, 0.72]} />
            <meshBasicMaterial color="#00994d" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[0.72, 0.24]} />
            <meshBasicMaterial color="#00994d" />
          </mesh>
        </group>

        {/* Rear Ambulance Doors & Windows (Just like in Image 4!) */}
        <mesh position={[-0.58, 0.45, -2.51]}>
          <planeGeometry args={[0.65, 0.55]} rotation={[0, Math.PI, 0]} />
          <meshStandardMaterial color="#1a222c" roughness={0.15} metalness={0.8} />
        </mesh>
        <mesh position={[0.58, 0.45, -2.51]}>
          <planeGeometry args={[0.65, 0.55]} rotation={[0, Math.PI, 0]} />
          <meshStandardMaterial color="#1a222c" roughness={0.15} metalness={0.8} />
        </mesh>
        {/* Rear Door Step Bumper */}
        <mesh position={[0, -0.45, -2.58]}>
          <boxGeometry args={[2.2, 0.25, 0.3]} />
          <meshStandardMaterial color="#25282d" roughness={0.7} metalness={0.6} />
        </mesh>

        {/* Roof Emergency Light Bar */}
        <mesh position={[0, 1.32, -0.4]}>
          <boxGeometry args={[1.8, 0.18, 0.35]} />
          <meshStandardMaterial color="#181a1c" metalness={0.8} />
        </mesh>
        <mesh position={[-0.6, 1.34, -0.4]}>
          <boxGeometry args={[0.5, 0.16, 0.3]} />
          <meshBasicMaterial color="#e62010" />
        </mesh>
        <mesh position={[0.6, 1.34, -0.4]}>
          <boxGeometry args={[0.5, 0.16, 0.3]} />
          <meshBasicMaterial color="#e62010" />
        </mesh>

        {/* Wheels (Partially sunken into roadside mud/grass) */}
        {[-1.15, 1.15].map((x) =>
          [-1.5, 1.6].map((z) => (
            <mesh key={`amb-w-${x}-${z}`} position={[x, -0.44, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.42, 0.42, 0.34, 14]} />
              <meshStandardMaterial color="#262420" roughness={0.92} />
            </mesh>
          ))
        )}

        {/* Overgrown Ferns & Weeds hugging the ambulance wheels (Matching Image 4) */}
        <mesh position={[1.4, -0.3, 0.5]} rotation={[0.2, 0.8, -0.1]}>
          <coneGeometry args={[0.65, 0.6, 6]} />
          <meshStandardMaterial color="#364f26" roughness={0.95} />
        </mesh>
        <mesh position={[-1.4, -0.3, -1.2]} rotation={[-0.1, 0.4, 0.2]}>
          <coneGeometry args={[0.55, 0.55, 6]} />
          <meshStandardMaterial color="#364f26" roughness={0.95} />
        </mesh>
      </group>

      {/* =================================================================
          2. HEAVY FIRE ENGINE RESCUE TRUCK (Exact match to User Reference Image 3)
          Classic fire truck, chrome grille, roller doors, aluminum ladders
         ================================================================= */}
      <group position={[7.5, 0.95, 5.5]} rotation={[0, -0.25, 0]}>
        {/* Heavy Red Cab */}
        <mesh castShadow receiveShadow position={[0, 0.3, 2.6]}>
          <boxGeometry args={[2.7, 2.1, 2.8]} />
          <meshStandardMaterial color="#b3180d" roughness={0.42} metalness={0.25} />
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
          <meshStandardMaterial color="#a6150b" roughness={0.45} metalness={0.25} />
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
          3. OVERGROWN ABANDONED CIVILIAN SUV (Covered in weeds)
         ================================================================= */}
      <group position={[4.8, 0.45, 16]} rotation={[0.05, -0.3, 0.04]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.85, 4.2]} />
          <meshStandardMaterial color="#3d4942" roughness={0.85} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.55, -0.3]}>
          <boxGeometry args={[1.65, 0.6, 2.2]} />
          <meshStandardMaterial color="#28322c" roughness={0.8} />
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
      </group>
    </group>
  );
}
