import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import { GameConfig } from './GameConfig';

export default function RescueZone() {
  const isExtractionReady = useGameStore((state) => state.mission.isExtractionReady);
  const position = GameConfig.mission.extractionZone.position;
  const radius = GameConfig.mission.extractionZone.radius;

  const beaconPillarRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (beaconPillarRef.current) {
      beaconPillarRef.current.rotation.y = t * 0.5;
    }
  });

  const zoneColor = isExtractionReady ? '#00ffcc' : '#ffaa00';

  return (
    <group position={position}>
      {/* Concrete Landing Pad Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[radius, 36]} />
        <meshStandardMaterial color="#1f232b" roughness={0.8} />
      </mesh>

      {/* Helipad Outer Warning Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[radius - 0.5, radius, 36]} />
        <meshBasicMaterial color={zoneColor} />
      </mesh>

      {/* Helipad Inner Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <ringGeometry args={[2.2, 2.5, 32]} />
        <meshBasicMaterial color={zoneColor} />
      </mesh>

      {/* Helipad 'H' Marking */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.8, 0.04, 0]}>
        <planeGeometry args={[0.4, 2.8]} />
        <meshBasicMaterial color={zoneColor} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.8, 0.04, 0]}>
        <planeGeometry args={[0.4, 2.8]} />
        <meshBasicMaterial color={zoneColor} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <planeGeometry args={[1.4, 0.4]} />
        <meshBasicMaterial color={zoneColor} />
      </mesh>

      {/* Vertical Holographic Evac Beacon Beam */}
      <mesh ref={beaconPillarRef} position={[0, 6, 0]}>
        <cylinderGeometry args={[radius * 0.85, radius * 0.85, 12, 24, 1, true]} />
        <meshBasicMaterial
          color={zoneColor}
          transparent
          opacity={isExtractionReady ? 0.35 : 0.1}
          side={2}
          wireframe
        />
      </mesh>

      {/* Heli Beacon Searchlight */}
      <pointLight
        position={[0, 3, 0]}
        color={zoneColor}
        intensity={isExtractionReady ? 5 : 2}
        distance={25}
      />
    </group>
  );
}
