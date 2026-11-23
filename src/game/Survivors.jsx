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
        const isRescued =
          s.status === SURVIVOR_STATUS.STABILIZED ||
          s.status === SURVIVOR_STATUS.EVACUATED ||
          s.status === 'RESCUED';
        const beaconColor = isRescued ? '#00ffaa' : (s.triageColor || '#ff4400');

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
                <meshStandardMaterial
                  color={
                    isRescued
                      ? '#3b82f6'
                      : s.id === 'survivor-1'
                      ? '#0284c7' // Elena (Engineer blue coveralls)
                      : s.id === 'survivor-2'
                      ? '#eab308' // Marcus (Transit yellow/navy vest)
                      : '#f8fafc' // Sarah (Physician white lab jacket)
                  }
                  roughness={0.7}
                />
              </mesh>

              {/* Head / Bandaged */}
              <mesh position={[0, 0.38, 0.05]}>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshStandardMaterial color="#cbb89d" roughness={0.6} />
              </mesh>

              {/* Legs (curled/seated on ground) */}
              <mesh position={[0, -0.28, 0.2]} rotation={[0.5, 0, 0]}>
                <boxGeometry args={[0.38, 0.2, 0.5]} />
                <meshStandardMaterial color="#1e293b" roughness={0.8} />
              </mesh>
            </group>

            {/* Environmental Narrative Props for each survivor */}
            {/* Survivor 1 (Elena Vance): Collapsed reinforced concrete beam pinning legs */}
            {s.id === 'survivor-1' && (
              <group position={[0, 0.3, 0.2]} rotation={[0.15, 0.4, -0.2]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[2.8, 0.45, 0.55]} />
                  <meshStandardMaterial color="#57534e" roughness={0.9} />
                </mesh>
                {/* Exposed steel rebar rods */}
                {[-1.1, 0, 1.1].map((rx, ri) => (
                  <mesh key={`rebar-${ri}`} position={[rx, 0, 0.35]} rotation={[0.2, 0, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
                    <meshStandardMaterial color="#78350f" metalness={0.8} />
                  </mesh>
                ))}
              </group>
            )}

            {/* Survivor 2 (Marcus Chen): Subway ventilation shaft & smoke */}
            {s.id === 'survivor-2' && (
              <group position={[0, 0.02, 0]}>
                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[2.4, 2.4]} />
                  <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.4} />
                </mesh>
                {/* Vent Grate Slats */}
                {[-0.8, -0.4, 0, 0.4, 0.8].map((gx, gi) => (
                  <mesh key={`vent-${gi}`} position={[gx, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.12, 2.2]} />
                    <meshStandardMaterial color="#3f3f46" metalness={0.9} />
                  </mesh>
                ))}
              </group>
            )}

            {/* Survivor 3 (Dr. Sarah Al-Jamil): First aid medical bag & shattered glass */}
            {s.id === 'survivor-3' && (
              <group position={[0.6, 0.18, 0.2]}>
                {/* Red Emergency Medical Bag */}
                <mesh castShadow position={[0, 0, 0]}>
                  <boxGeometry args={[0.35, 0.25, 0.25]} />
                  <meshStandardMaterial color="#dc2626" roughness={0.6} />
                </mesh>
                {/* White Medical Cross on Bag */}
                <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[0.15, 0.15]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              </group>
            )}

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

