import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Lighting() {
  const ambulanceLightRef = useRef();
  const fireEngineLightRef = useRef();
  const beaconLightRef = useRef();
  const policeStrobeBlueRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Subtle pulsing emergency beacon on abandoned rescue vehicles
    const flash = Math.sin(t * 8) > 0 ? 2.5 : 0.1;
    if (ambulanceLightRef.current) ambulanceLightRef.current.intensity = flash;
    if (fireEngineLightRef.current) fireEngineLightRef.current.intensity = Math.sin(t * 8 + Math.PI) > 0 ? 2.5 : 0.1;
    if (policeStrobeBlueRef.current) policeStrobeBlueRef.current.intensity = Math.sin(t * 12) > 0 ? 3.0 : 0.05;

    // Evac helipad beacon
    if (beaconLightRef.current) {
      beaconLightRef.current.intensity = 2.5 + Math.sin(t * 3) * 1.0;
    }
  });

  return (
    <group>
      {/* 1. Natural Daylight Hemispheric Ambient (Bright blue sky, warm earth ground bounce) */}
      <hemisphereLight
        skyColor="#aed4f5"
        groundColor="#5c6352"
        intensity={1.4}
      />

      {/* 2. Direct Golden Sunlight (Realistic late afternoon sun casting long, crisp shadows) */}
      <directionalLight
        position={[45, 55, 30]}
        intensity={3.2}
        color="#fff4dd"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={180}
        shadow-camera-left={-65}
        shadow-camera-right={65}
        shadow-camera-top={65}
        shadow-camera-bottom={-65}
        shadow-bias={-0.0004}
      />

      {/* 3. Soft Sky Diffuse Fill (Opposite horizon bounce) */}
      <directionalLight
        position={[-40, 35, -45]}
        intensity={1.1}
        color="#8faec9"
      />

      {/* 4. Front Soft Sunlight Bounce */}
      <directionalLight
        position={[0, 15, 45]}
        intensity={0.8}
        color="#e8d8be"
      />

      {/* 5. Paramedic Ambulance Lightbar Flash */}
      <pointLight
        ref={ambulanceLightRef}
        position={[-11, 2.8, -15]}
        color="#ff2200"
        distance={18}
        decay={2}
      />

      {/* 6. Fire Engine Red Beacon Flash */}
      <pointLight
        ref={fireEngineLightRef}
        position={[6, 3.2, 5]}
        color="#ff3311"
        distance={20}
        decay={2}
      />

      {/* 7. Police Cruiser Blue Strobe Flash */}
      <pointLight
        ref={policeStrobeBlueRef}
        position={[-3.6, 2.2, -8.0]}
        color="#2563eb"
        distance={18}
        decay={2}
      />

      {/* 8. Warm Amber Streetlights Glow on Sidewalks (GTA V Style) */}
      <pointLight position={[-8.8, 6.8, 8]} color="#f59e0b" distance={16} decay={2} intensity={1.4} />
      <pointLight position={[8.8, 6.8, 8]} color="#f59e0b" distance={16} decay={2} intensity={1.4} />
      <pointLight position={[-8.8, 6.8, -26]} color="#f59e0b" distance={16} decay={2} intensity={1.4} />
      <pointLight position={[8.8, 6.8, -26]} color="#f59e0b" distance={16} decay={2} intensity={1.4} />

      {/* 9. Helipad Evac Extraction Beacon (Northern Clearing) */}
      <pointLight
        ref={beaconLightRef}
        position={[0, 6, -42]}
        color="#00ffcc"
        distance={30}
        decay={2}
      />
    </group>
  );
}
