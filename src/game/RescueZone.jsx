import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
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

      {/* Vertical Cinematic Evac Beacon Pillar (Soft glowing column, no wireframe cage) */}
      <mesh ref={beaconPillarRef} position={[0, 8, 0]}>
        <cylinderGeometry args={[radius * 0.7, radius * 0.85, 16, 24, 1, true]} />
        <meshBasicMaterial
          color={zoneColor}
          transparent
          opacity={isExtractionReady ? 0.35 : 0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Perimeter LED Runway Guidance Strobe Beacons */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const px = Math.cos(angle) * (radius - 0.2);
        const pz = Math.sin(angle) * (radius - 0.2);
        return (
          <group key={`lz-beacon-${i}`} position={[px, 0.1, pz]}>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.1, 0.14, 0.16, 10]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshBasicMaterial color={zoneColor} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

