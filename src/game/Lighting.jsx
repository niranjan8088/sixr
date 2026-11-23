import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Lighting() {
  const beaconLightRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Emergency amber beacon pulsing
    if (beaconLightRef.current) {
      beaconLightRef.current.intensity = 2.5 + Math.sin(t * 4) * 1.5;
    }
  });

  return (
    <group>
      {/* Deep cool ambient illumination */}
      <ambientLight color="#182230" intensity={0.8} />

      {/* Main moody directional light (late afternoon / disaster fire glow) */}
      <directionalLight
        position={[30, 45, 20]}
        intensity={1.8}
        color="#ff9944"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />

      {/* Cold rim / sky fill light */}
      <directionalLight position={[-25, 30, -35]} intensity={0.6} color="#4077aa" />

      {/* Flashing emergency strobe near central crossroads */}
      <pointLight
        ref={beaconLightRef}
        position={[0, 4, 0]}
        color="#ff4400"
        distance={25}
        decay={2}
      />

      {/* Extraction zone beacon light */}
      <pointLight
        position={[0, 6, -42]}
        color="#00ffaa"
        intensity={3}
        distance={30}
        decay={2}
      />
    </group>
  );
}

