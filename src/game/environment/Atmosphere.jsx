import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Atmosphere() {
  const moteCount = 300;
  const motesRef = useRef();

  // Floating dust motes and pollen catching the afternoon sunlight
  const motes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < moteCount; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 80,
        y: Math.random() * 12 + 0.3,
        z: (Math.random() - 0.5) * 110 - 20,
        speedY: 0.15 + Math.random() * 0.3,
        swaySpeed: 0.8 + Math.random() * 1.5,
        size: 0.03 + Math.random() * 0.05
      });
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const time = state.clock.getElapsedTime();

    if (motesRef.current) {
      motes.forEach((m, i) => {
        m.y += m.speedY * dt;
        m.x += Math.sin(time * m.swaySpeed + i) * dt * 0.25;

        if (m.y > 12) {
          m.y = 0.3;
          m.x = (Math.random() - 0.5) * 80;
        }

        dummy.position.set(m.x, m.y, m.z);
        dummy.scale.set(m.size, m.size, m.size);
        dummy.updateMatrix();
        motesRef.current.setMatrixAt(i, dummy.matrix);
      });
      motesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Natural Daytime Aerial Perspective Fog (Soft atmospheric horizon haze) */}
      <fogExp2 attach="fog" args={['#96b2ce', 0.009]} />

      {/* Daytime Celestial Sky Dome */}
      <mesh position={[0, 30, -30]}>
        <sphereGeometry args={[140, 24, 16]} />
        <meshBasicMaterial color="#7ba0c4" side={THREE.BackSide} />
      </mesh>

      {/* Subtle Sun Flare Glow on Horizon */}
      <mesh position={[60, 45, -20]} rotation={[0, -0.6, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#fffaed" transparent opacity={0.15} />
      </mesh>

      {/* Floating Sunlight Dust Motes */}
      <instancedMesh ref={motesRef} args={[null, null, moteCount]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </instancedMesh>
    </group>
  );
}
