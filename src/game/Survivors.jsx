import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import { SURVIVOR_STATUS } from '../utils/constants';

export default function Survivors() {
  const survivors = useGameStore((state) => state.survivors);
  const ringRefs = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ringRefs.current.forEach((ring, idx) => {
      if (ring) {
        ring.rotation.z = t * 0.8 + idx;
        const scale = 1 + Math.sin(t * 3 + idx) * 0.12;
        ring.scale.set(scale, scale, 1);
      }
    });
  });

  return (
    <group>
      {survivors.map((s, idx) => {
        const isRescued = s.status === SURVIVOR_STATUS.RESCUED;
        const beaconColor = isRescued ? '#00ffaa' : '#ff4400';

        return (
          <group key={s.id} position={s.position}>
            {/* Ground Rescue Perimeter Ring */}
            <mesh
              ref={(el) => (ringRefs.current[idx] = el)}
              position={[0, 0.04, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[1.5, 1.8, 32]} />
              <meshBasicMaterial color={beaconColor} transparent opacity={0.7} />
            </mesh>

            {/* Survivor Body (Seated / Injured Pose) */}
            <group position={[0, 0.45, 0]} rotation={[0, idx * 1.5, 0]}>
              {/* Torso */}
              <mesh castShadow position={[0, 0, 0]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.42, 0.5, 0.28]} />
                <meshStandardMaterial color={isRescued ? '#3b6e8c' : '#7a3e35'} roughness={0.7} />
              </mesh>

              {/* Head / Bandaged */}
              <mesh position={[0, 0.38, 0.05]}>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshStandardMaterial color="#cbb89d" roughness={0.6} />
              </mesh>

              {/* Legs (curled/seated on ground) */}
              <mesh position={[0, -0.28, 0.2]} rotation={[0.5, 0, 0]}>
                <boxGeometry args={[0.38, 0.2, 0.5]} />
                <meshStandardMaterial color="#222831" roughness={0.8} />
              </mesh>
            </group>

            {/* Glowing Emergency Flare / Beacon Stick */}
            <mesh position={[0.7, 0.3, 0.3]}>
              <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
              <meshBasicMaterial color={beaconColor} />
            </mesh>
            <pointLight position={[0.7, 0.6, 0.3]} color={beaconColor} intensity={2.5} distance={6} />

            {/* Floating Locator Diamond */}
            <mesh position={[0, 2.2, 0]} rotation={[0.3, 0.4, 0.5]}>
              <octahedronGeometry args={[0.22, 0]} />
              <meshBasicMaterial color={beaconColor} wireframe={!isRescued} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

