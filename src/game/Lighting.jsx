import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Lighting() {
  const strobeRedRef = useRef();
  const strobeBlueRef = useRef();
  const fireGlow1Ref = useRef();
  const fireGlow2Ref = useRef();
  const beaconLightRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Emergency vehicle alternating dual-flash (Red / Blue)
    const redFlash = Math.sin(t * 12) > 0 ? 3.5 : 0.2;
    const blueFlash = Math.sin(t * 12 + Math.PI) > 0 ? 3.5 : 0.2;
    if (strobeRedRef.current) strobeRedRef.current.intensity = redFlash;
    if (strobeBlueRef.current) strobeBlueRef.current.intensity = blueFlash;

    // Organic fire flicker
    if (fireGlow1Ref.current) {
      fireGlow1Ref.current.intensity = 2.4 + Math.sin(t * 8) * 0.5 + Math.cos(t * 15) * 0.3;
    }
    if (fireGlow2Ref.current) {
      fireGlow2Ref.current.intensity = 2.0 + Math.sin(t * 9 + 1) * 0.6 + Math.cos(t * 13) * 0.2;
    }

    // Extraction Helipad beacon
    if (beaconLightRef.current) {
      beaconLightRef.current.intensity = 2.8 + Math.sin(t * 3) * 1.0;
    }
  });

  return (
    <group>
      {/* Rich Hemispheric Lighting (Sky cool blue-slate, Ground warm urban asphalt bounce) */}
      <hemisphereLight
        skyColor="#567292"
        groundColor="#252a32"
        intensity={1.4}
      />

      {/* Cinematic Main Moonlight / Atmospheric Key Light */}
      <directionalLight
        position={[45, 65, 35]}
        intensity={2.4}
        color="#c8dcfa"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={160}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0005}
      />

      {/* Secondary Rim Fill Light (Distant burning district glow) */}
      <directionalLight
        position={[-50, 30, -50]}
        intensity={1.5}
        color="#ff7b2b"
      />

      {/* Tertiary Soft Front-Light for player readability */}
      <directionalLight
        position={[0, 20, 50]}
        intensity={0.8}
        color="#708aa8"
      />

      {/* Abandoned Police Car Emergency Flasher (Red & Blue alternating) */}
      <pointLight
        ref={strobeRedRef}
        position={[-5.8, 1.8, -6.5]}
        color="#ff1a1a"
        distance={22}
        decay={2}
      />
      <pointLight
        ref={strobeBlueRef}
        position={[-4.8, 1.8, -6.5]}
        color="#1a8cff"
        distance={22}
        decay={2}
      />

      {/* Burning Vehicle / Rubble Fire Glow 1 */}
      <pointLight
        ref={fireGlow1Ref}
        position={[6.5, 1.5, -28]}
        color="#ff6600"
        distance={20}
        decay={2}
      />

      {/* Burning Rubble Fire Glow 2 (West Avenue) */}
      <pointLight
        ref={fireGlow2Ref}
        position={[-14, 2.0, -11]}
        color="#ff7711"
        distance={18}
        decay={2}
      />

      {/* Extraction Zone Beacon (Helipad Northern Clearing) */}
      <pointLight
        ref={beaconLightRef}
        position={[0, 7, -42]}
        color="#00ffd0"
        distance={35}
        decay={2}
      />
    </group>
  );
}
