import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Lighting() {
  const strobeLightRef = useRef();
  const beaconLightRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Unified emergency strobe alternating between red and blue (Smooth & Zero GPU Lag)
    if (strobeLightRef.current) {
      const isRed = Math.sin(t * 10) > 0;
      strobeLightRef.current.color.set(isRed ? '#ff1e00' : '#0066ff');
      strobeLightRef.current.intensity = Math.abs(Math.sin(t * 10)) > 0.4 ? 2.8 : 0.2;
    }

    // Evac helipad beacon
    if (beaconLightRef.current) {
      beaconLightRef.current.intensity = 2.0 + Math.sin(t * 3) * 0.8;
    }
  });

  return (
    <group>
      {/* 1. Natural Daylight Hemispheric Ambient (Bright blue sky, warm earth ground bounce) */}
      <hemisphereLight
        skyColor="#b8d5f0"
        groundColor="#4a4d44"
        intensity={1.2}
      />

      {/* 2. Direct Golden Sunlight (Realistic late afternoon sun casting crisp, optimized shadows) */}
      <directionalLight
        position={[45, 50, 30]}
        intensity={2.8}
        color="#fff4dd"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={160}
        shadow-camera-left={-55}
        shadow-camera-right={55}
        shadow-camera-top={55}
        shadow-camera-bottom={-55}
        shadow-bias={-0.0005}
      />

      {/* 3. Soft Sky Diffuse Fill (Opposite horizon bounce) */}
      <directionalLight
        position={[-35, 30, -35]}
        intensity={0.9}
        color="#8faec9"
      />

      {/* 4. Single Unified Emergency Strobe PointLight in Intersection (Zero Lag) */}
      <pointLight
        ref={strobeLightRef}
        position={[-6.0, 2.8, -12.0]}
        color="#ff1e00"
        distance={22}
        decay={2}
      />

      {/* 5. Static Warm Amber Streetlights (GTA V Style) */}
      <pointLight position={[-8.8, 6.8, 8]} color="#f59e0b" distance={14} decay={2} intensity={1.2} />
      <pointLight position={[8.8, 6.8, 8]} color="#f59e0b" distance={14} decay={2} intensity={1.2} />
      <pointLight position={[-8.8, 6.8, -26]} color="#f59e0b" distance={14} decay={2} intensity={1.2} />
      <pointLight position={[8.8, 6.8, -26]} color="#f59e0b" distance={14} decay={2} intensity={1.2} />

      {/* 6. Helipad Evac Extraction Beacon */}
      <pointLight
        ref={beaconLightRef}
        position={[0, 6, -42]}
        color="#00ffcc"
        distance={28}
        decay={2}
      />
    </group>
  );
}
