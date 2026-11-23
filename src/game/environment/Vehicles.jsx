import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { globalCollisions } from '../core/CollisionManager';

/**
 * Realistic Car Wheel with dark rubber tire tread, polished alloy rim and center hub.
 * High contrast between tire rubber and metallic rim ensures wheels never look like solid black blocks.
 */
function RealisticWheel({ radius = 0.35, width = 0.28, rimRadius = 0.22, color = '#27272a' }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      {/* Outer Rubber Tire */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, width, 16]} />
        <meshStandardMaterial color={color} roughness={0.88} metalness={0.08} />
      </mesh>
      {/* Bright Metallic Alloy Rim (Outer side) */}
      <mesh position={[0, width * 0.48, 0]}>
        <cylinderGeometry args={[rimRadius, rimRadius, 0.04, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.25} metalness={0.9} />
      </mesh>
      {/* Center Lug Nut Hub */}
      <mesh position={[0, width * 0.52, 0]}>
        <cylinderGeometry args={[rimRadius * 0.4, rimRadius * 0.4, 0.02, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Inner Rim Facing Chassis */}
      <mesh position={[0, -width * 0.48, 0]}>
        <cylinderGeometry args={[rimRadius * 0.9, rimRadius * 0.9, 0.02, 12]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} metalness={0.7} />
      </mesh>
    </group>
  );
}

export default function Vehicles() {
  const redLensRef = useRef();
  const blueLensRef = useRef();

  // Subtle material emissive strobe without invalidating GPU point lights
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const flash = Math.sin(t * 12) > 0.1;
    if (redLensRef.current) redLensRef.current.opacity = flash ? 1.0 : 0.25;
    if (blueLensRef.current) blueLensRef.current.opacity = !flash ? 1.0 : 0.25;
  });

  // Register vehicle colliders
  useEffect(() => {
    // Paramedic Ambulance (Roadside overgrown path)
    globalCollisions.addBox(-11.5, -16.5, -7.5, -10.5, 'veh-ambulance');
    // Heavy Fire Engine Rescue Truck (East Intersection)
    globalCollisions.addBox(5.0, 2.0, 10.0, 9.5, 'veh-fire-engine');
    // Overgrown Civilian SUV
    globalCollisions.addBox(3.4, 14.0, 6.2, 18.0, 'veh-suv');
    // Rusted Station Wagon (North path)
    globalCollisions.addBox(-5.8, -32.0, -2.4, -28.0, 'veh-wagon');
    // Police Patrol Cruiser (Intersection center)
    globalCollisions.addBox(-5.5, -10.0, -1.5, -6.0, 'veh-police');
    // Abandoned Yellow Taxi Cab
    globalCollisions.addBox(-7.2, 5.0, -3.2, 9.0, 'veh-taxi');
  }, []);

  return (
    <group>
      {/* =================================================================
          1. REALISTIC PARAMEDIC AMBULANCE (Exact match to User Reference 4)
          Bright emergency white, red chevrons, green cross, reflective glass
         ================================================================= */}
      <group position={[-9.5, 0.72, -13.5]} rotation={[0.03, 0.45, -0.05]}>
        {/* Front Cab */}
        <mesh castShadow receiveShadow position={[0, 0, 1.75]}>
          <boxGeometry args={[2.3, 1.45, 1.9]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Slanted Windshield with Realistic Specular Glass */}
        <mesh position={[0, 0.35, 2.72]} rotation={[0.32, 0, 0]}>
          <planeGeometry args={[1.9, 0.72]} />
          <meshStandardMaterial color="#334155" roughness={0.12} metalness={0.88} />
        </mesh>

        {/* Front Radiator Grille & Chrome Surround */}
        <mesh position={[0, -0.15, 2.71]}>
          <boxGeometry args={[1.5, 0.42, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.5} />
        </mesh>
        {/* Dual High-Beam Halogen Headlights */}
        <mesh position={[-0.9, -0.15, 2.72]}>
          <boxGeometry args={[0.3, 0.22, 0.06]} />
          <meshBasicMaterial color="#fffbe8" />
        </mesh>
        <mesh position={[0.9, -0.15, 2.72]}>
          <boxGeometry args={[0.3, 0.22, 0.06]} />
          <meshBasicMaterial color="#fffbe8" />
        </mesh>

        {/* Heavy Front Bumper */}
        <mesh position={[0, -0.45, 2.78]}>
          <boxGeometry args={[2.4, 0.35, 0.22]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>

        {/* Rear Medical Ambulance Box Body */}
        <mesh castShadow receiveShadow position={[0, 0.26, -0.6]}>
          <boxGeometry args={[2.5, 1.95, 3.8]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.35} metalness={0.2} />
        </mesh>

        {/* Red Emergency Chevron Stripes */}
        <mesh position={[1.26, 0.35, -0.6]}>
          <planeGeometry args={[3.6, 0.6]} rotation={[0, Math.PI / 2, 0]} />
          <meshStandardMaterial color="#dc2626" roughness={0.35} />
        </mesh>
        <mesh position={[-1.26, 0.35, -0.6]}>
          <planeGeometry args={[3.6, 0.6]} rotation={[0, -Math.PI / 2, 0]} />
          <meshStandardMaterial color="#dc2626" roughness={0.35} />
        </mesh>

        {/* Green Medical Cross Emblem */}
        <group position={[1.27, 0.35, -0.6]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <planeGeometry args={[0.24, 0.72]} />
            <meshBasicMaterial color="#16a34a" />
          </mesh>
          <mesh>
            <planeGeometry args={[0.72, 0.24]} />
            <meshBasicMaterial color="#16a34a" />
          </mesh>
        </group>
        <group position={[-1.27, 0.35, -0.6]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <planeGeometry args={[0.24, 0.72]} />
            <meshBasicMaterial color="#16a34a" />
          </mesh>
          <mesh>
            <planeGeometry args={[0.72, 0.24]} />
            <meshBasicMaterial color="#16a34a" />
          </mesh>
        </group>

        {/* Rear Ambulance Doors & Tinted Windows */}
        <mesh position={[-0.58, 0.45, -2.51]}>
          <planeGeometry args={[0.65, 0.55]} rotation={[0, Math.PI, 0]} />
          <meshStandardMaterial color="#334155" roughness={0.15} metalness={0.8} />
        </mesh>
        <mesh position={[0.58, 0.45, -2.51]}>
          <planeGeometry args={[0.65, 0.55]} rotation={[0, Math.PI, 0]} />
          <meshStandardMaterial color="#334155" roughness={0.15} metalness={0.8} />
        </mesh>
        {/* Rear Door Step Bumper */}
        <mesh position={[0, -0.45, -2.58]}>
          <boxGeometry args={[2.2, 0.25, 0.3]} />
          <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.7} />
        </mesh>

        {/* Roof Emergency Light Bar */}
        <mesh position={[0, 1.32, -0.4]}>
          <boxGeometry args={[1.8, 0.18, 0.35]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh position={[-0.6, 1.34, -0.4]}>
          <boxGeometry args={[0.5, 0.16, 0.3]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.6, 1.34, -0.4]}>
          <boxGeometry args={[0.5, 0.16, 0.3]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>

        {/* Wheels with Alloy Rims and Rubber Tires */}
        {[-1.15, 1.15].map((x) =>
          [-1.5, 1.6].map((z) => (
            <group key={`amb-w-${x}-${z}`} position={[x, -0.44, z]}>
              <RealisticWheel radius={0.42} width={0.34} rimRadius={0.27} color="#262420" />
            </group>
          ))
        )}

        {/* Overgrown Ferns hugging wheels */}
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
          2. HEAVY FIRE ENGINE RESCUE TRUCK (Exact match to User Reference 3)
          Vibrant red cab, chrome bumper, roller doors, aluminum ladders
         ================================================================= */}
      <group position={[7.5, 0.95, 5.5]} rotation={[0, -0.25, 0]}>
        {/* Heavy Red Cab */}
        <mesh castShadow receiveShadow position={[0, 0.3, 2.6]}>
          <boxGeometry args={[2.7, 2.1, 2.8]} />
          <meshStandardMaterial color="#dc2626" roughness={0.35} metalness={0.25} />
        </mesh>
        {/* Cab Windshield */}
        <mesh position={[0, 0.7, 4.02]} rotation={[0.2, 0, 0]}>
          <planeGeometry args={[2.2, 0.9]} />
          <meshStandardMaterial color="#334155" roughness={0.12} metalness={0.85} />
        </mesh>
        {/* Polished Chrome Front Heavy Bumper */}
        <mesh position={[0, -0.4, 4.05]}>
          <boxGeometry args={[2.8, 0.5, 0.3]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.95} />
        </mesh>

        {/* Main Equipment Body (Roller Shutter Compartments) */}
        <mesh castShadow receiveShadow position={[0, 0.35, -1.2]}>
          <boxGeometry args={[2.7, 2.2, 5.4]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.4} metalness={0.25} />
        </mesh>

        {/* Equipment Compartment Roller Shutters */}
        {[-1.36, 1.36].map((x) =>
          [-2.6, -1.2, 0.2].map((z) => (
            <mesh key={`shutter-${x}-${z}`} position={[x, 0.25, z]}>
              <boxGeometry args={[0.08, 1.4, 1.1]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.35} metalness={0.85} />
            </mesh>
          ))
        )}

        {/* Roof Emergency Lightbar & Chrome Siren Horns */}
        <mesh position={[0, 1.48, 2.4]}>
          <boxGeometry args={[2.2, 0.22, 0.4]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <mesh position={[-0.6, 1.55, 3.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.16, 0.5, 10]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.95} />
        </mesh>
        <mesh position={[0.6, 1.55, 3.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.16, 0.5, 10]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.95} />
        </mesh>

        {/* Roof Aluminum Rescue Ladders */}
        <group position={[0.6, 1.6, -1.0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.5, 0.15, 4.8]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.9} />
          </mesh>
        </group>

        {/* Heavy Fire Truck Wheels (6 Wheels with heavy alloy hubs) */}
        {[-1.38, 1.38].map((x) =>
          [-2.5, -1.0, 2.6].map((z) => (
            <group key={`fire-w-${x}-${z}`} position={[x, -0.45, z]}>
              <RealisticWheel radius={0.48} width={0.38} rimRadius={0.3} color="#181a1d" />
            </group>
          ))
        )}
      </group>

      {/* =================================================================
          3. OVERGROWN ABANDONED CIVILIAN SUV (Metallic Slate Grey)
         ================================================================= */}
      <group position={[4.8, 0.45, 16]} rotation={[0.05, -0.3, 0.04]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.85, 4.2]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.45} />
        </mesh>
        <mesh position={[0, 0.55, -0.3]}>
          <boxGeometry args={[1.65, 0.6, 2.2]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.45} />
        </mesh>
        {/* Slanted windshield */}
        <mesh position={[0, 0.55, 0.9]} rotation={[0.4, 0, 0]}>
          <planeGeometry args={[1.5, 0.65]} />
          <meshStandardMaterial color="#334155" roughness={0.15} metalness={0.85} />
        </mesh>
        {/* Roof luggage rails */}
        {[-0.7, 0.7].map((rx) => (
          <mesh key={`suv-rail-${rx}`} position={[rx, 0.9, -0.3]}>
            <boxGeometry args={[0.06, 0.06, 1.8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
        ))}
        {/* Wheels */}
        {[-1.02, 1.02].map((x) =>
          [-1.3, 1.3].map((z) => (
            <group key={`sed-w-${x}-${z}`} position={[x, -0.22, z]}>
              <RealisticWheel radius={0.34} width={0.26} rimRadius={0.22} color="#1e2022" />
            </group>
          ))
        )}
      </group>

      {/* =================================================================
          4. ABANDONED POLICE PATROL CRUISER (Midnight Blue & White Doors)
          Fixed: No more pitch-black void! High-contrast authentic police cruiser
         ================================================================= */}
      <group position={[-3.6, 0.45, -8.0]} rotation={[-0.02, 0.42, 0.03]}>
        {/* Main Lower Chassis - Midnight Blue (Reflective & Readable) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.7, 4.4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.35} metalness={0.35} />
        </mesh>

        {/* White Center Door Panels */}
        <mesh position={[1.01, 0.05, 0]}>
          <planeGeometry args={[1.8, 0.55]} rotation={[0, Math.PI / 2, 0]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <mesh position={[-1.01, 0.05, 0]}>
          <planeGeometry args={[1.8, 0.55]} rotation={[0, -Math.PI / 2, 0]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>

        {/* Cabin Glass & White Roof */}
        <mesh position={[0, 0.52, -0.2]}>
          <boxGeometry args={[1.65, 0.55, 2.3]} />
          <meshStandardMaterial color="#334155" roughness={0.15} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.81, -0.2]}>
          <boxGeometry args={[1.68, 0.08, 2.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>

        {/* Slanted Front Windshield */}
        <mesh position={[0, 0.54, 1.0]} rotation={[0.4, 0, 0]}>
          <planeGeometry args={[1.5, 0.6]} />
          <meshStandardMaterial color="#334155" roughness={0.12} metalness={0.9} />
        </mesh>

        {/* Chrome Front Push-Bumper (Bullbar) */}
        <mesh position={[0, -0.05, 2.3]}>
          <boxGeometry args={[1.6, 0.55, 0.22]} />
          <meshStandardMaterial color="#64748b" roughness={0.2} metalness={0.85} />
        </mesh>

        {/* Dual Halogen Headlights */}
        <mesh position={[-0.7, 0.05, 2.22]}>
          <boxGeometry args={[0.28, 0.2, 0.04]} />
          <meshBasicMaterial color="#fef9c3" />
        </mesh>
        <mesh position={[0.7, 0.05, 2.22]}>
          <boxGeometry args={[0.28, 0.2, 0.04]} />
          <meshBasicMaterial color="#fef9c3" />
        </mesh>

        {/* Roof Emergency Lightbar (Red Left, Blue Right) */}
        <group position={[0, 0.92, -0.2]}>
          <mesh>
            <boxGeometry args={[1.4, 0.12, 0.28]} />
            <meshStandardMaterial color="#334155" metalness={0.85} />
          </mesh>
          {/* Red Left Beacon Lens */}
          <mesh position={[-0.45, 0.02, 0]}>
            <boxGeometry args={[0.42, 0.14, 0.24]} />
            <meshBasicMaterial ref={redLensRef} color="#ef4444" transparent opacity={0.9} />
          </mesh>
          {/* Blue Right Beacon Lens */}
          <mesh position={[0.45, 0.02, 0]}>
            <boxGeometry args={[0.42, 0.14, 0.24]} />
            <meshBasicMaterial ref={blueLensRef} color="#3b82f6" transparent opacity={0.9} />
          </mesh>
        </group>

        {/* Wheels with Bright Silver Alloy Rims */}
        {[-1.04, 1.04].map((x) =>
          [-1.35, 1.4].map((z) => (
            <group key={`pol-w-${x}-${z}`} position={[x, -0.18, z]}>
              <RealisticWheel radius={0.34} width={0.28} rimRadius={0.22} color="#1e293b" />
            </group>
          ))
        )}
      </group>

      {/* =================================================================
          5. ABANDONED NYC YELLOW TAXI CAB (Vibrant Taxi Yellow)
          Iconic yellow paint, checkerboard stripe, illuminated TAXI beacon
         ================================================================= */}
      <group position={[-5.2, 0.42, 7.0]} rotation={[-0.02, -0.32, 0.04]}>
        {/* Main Yellow Chassis */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.65, 4.3]} />
          <meshStandardMaterial color="#eab308" roughness={0.35} metalness={0.25} />
        </mesh>

        {/* Front Hood Slope & Radiator Grille */}
        <mesh position={[0, -0.05, 2.16]}>
          <boxGeometry args={[1.6, 0.4, 0.08]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Dual Yellow Headlamps */}
        <mesh position={[-0.7, -0.05, 2.18]}>
          <boxGeometry args={[0.26, 0.2, 0.04]} />
          <meshBasicMaterial color="#fffbe8" />
        </mesh>
        <mesh position={[0.7, -0.05, 2.18]}>
          <boxGeometry args={[0.26, 0.2, 0.04]} />
          <meshBasicMaterial color="#fffbe8" />
        </mesh>

        {/* Checkerboard Taxi Side Stripe */}
        {[-0.96, 0.96].map((sx, si) => (
          <group key={`check-${si}`} position={[sx, 0.12, 0]} rotation={[0, si === 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
            <mesh>
              <planeGeometry args={[2.8, 0.14]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {[-1.0, -0.5, 0, 0.5, 1.0].map((cx, ci) => (
              <mesh key={`sq-${ci}`} position={[cx, 0, 0.005]}>
                <planeGeometry args={[0.18, 0.12]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            ))}
          </group>
        ))}

        {/* Cabin Glass & Roof */}
        <mesh position={[0, 0.5, -0.2]}>
          <boxGeometry args={[1.55, 0.52, 2.2]} />
          <meshStandardMaterial color="#334155" roughness={0.15} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.78, -0.2]}>
          <boxGeometry args={[1.58, 0.08, 2.1]} />
          <meshStandardMaterial color="#eab308" roughness={0.35} />
        </mesh>

        {/* Slanted Windshield */}
        <mesh position={[0, 0.5, 0.92]} rotation={[0.42, 0, 0]}>
          <planeGeometry args={[1.45, 0.6]} />
          <meshStandardMaterial color="#334155" roughness={0.15} metalness={0.85} />
        </mesh>
        {/* Slanted Rear Window */}
        <mesh position={[0, 0.5, -1.32]} rotation={[-0.38, 0, 0]}>
          <planeGeometry args={[1.45, 0.6]} />
          <meshStandardMaterial color="#334155" roughness={0.15} metalness={0.85} />
        </mesh>

        {/* Roof Illuminated TAXI Sign */}
        <group position={[0, 0.9, -0.2]}>
          <mesh>
            <boxGeometry args={[0.7, 0.16, 0.22]} />
            <meshStandardMaterial color="#fef08a" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.115]}>
            <planeGeometry args={[0.5, 0.1]} />
            <meshBasicMaterial color="#ca8a04" />
          </mesh>
        </group>

        {/* Wheels with Alloy Rims */}
        {[-0.98, 0.98].map((x) =>
          [-1.3, 1.35].map((z) => (
            <group key={`tax-w-${x}-${z}`} position={[x, -0.16, z]}>
              <RealisticWheel radius={0.32} width={0.26} rimRadius={0.2} color="#27272a" />
            </group>
          ))
        )}

        {/* Roadside Weeds wrapping taxi bumper */}
        <mesh position={[-0.4, 0.1, 2.2]} rotation={[0.2, 0.4, 0]}>
          <coneGeometry args={[0.35, 0.45, 6]} />
          <meshStandardMaterial color="#4d7c0f" roughness={0.95} />
        </mesh>
      </group>

      {/* =================================================================
          6. RUSTED VINTAGE STATION WAGON (Crashed into north sidewalk curb)
          Matches collider 'veh-wagon' registered at [-5.8, -32.0, -2.4, -28.0]
         ================================================================= */}
      <group position={[-4.2, 0.45, -30.0]} rotation={[-0.03, 0.35, 0.05]}>
        {/* Weathered Teal Body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.7, 4.6]} />
          <meshStandardMaterial color="#3b5a6f" roughness={0.65} metalness={0.25} />
        </mesh>
        {/* Woodgrain Side Accent Panels */}
        {[-0.96, 0.96].map((wx, wi) => (
          <mesh key={`wagon-wood-${wi}`} position={[wx, 0.05, 0]} rotation={[0, wi === 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
            <planeGeometry args={[3.2, 0.4]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
        ))}
        {/* Cabin Glass & Roof */}
        <mesh position={[0, 0.52, -0.3]}>
          <boxGeometry args={[1.55, 0.52, 2.8]} />
          <meshStandardMaterial color="#334155" roughness={0.18} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.8, -0.3]}>
          <boxGeometry args={[1.58, 0.08, 2.7]} />
          <meshStandardMaterial color="#3b5a6f" roughness={0.65} />
        </mesh>
        {/* Chrome Front Bumper (Dented) */}
        <mesh position={[0, -0.15, 2.32]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[1.9, 0.28, 0.15]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.85} />
        </mesh>
        {/* Rusty Roof Luggage Rack */}
        <mesh position={[0, 0.88, -0.3]}>
          <boxGeometry args={[1.3, 0.1, 2.2]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} metalness={0.6} />
        </mesh>
        {/* Wheels */}
        {[-1.0, 1.0].map((x) =>
          [-1.4, 1.4].map((z) => (
            <group key={`wag-w-${x}-${z}`} position={[x, -0.18, z]}>
              <RealisticWheel radius={0.33} width={0.25} rimRadius={0.21} color="#292524" />
            </group>
          ))
        )}
      </group>
    </group>
  );
}
