import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Atmosphere() {
  const moteCount = 50;
  const emberCount = 16;
  const motesRef = useRef();
  const embersRef = useRef();

  // Floating dust motes catching the sunlight
  const motes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < moteCount; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 80,
        y: Math.random() * 10 + 0.3,
        z: (Math.random() - 0.5) * 100 - 20,
        speedY: 0.15 + Math.random() * 0.25,
        swaySpeed: 0.8 + Math.random() * 1.2,
        size: 0.035 + Math.random() * 0.04
      });
    }
    return arr;
  }, []);

  // Floating glowing fiery embers drifting from fires
  const embers = useMemo(() => {
    const arr = [];
    for (let i = 0; i < emberCount; i++) {
      arr.push({
        x: -14 + (Math.random() - 0.5) * 14,
        y: Math.random() * 7 + 0.5,
        z: -11 + (Math.random() - 0.5) * 16,
        speedY: 0.35 + Math.random() * 0.5,
        size: 0.04 + Math.random() * 0.04
      });
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = state.clock.getElapsedTime();

    if (motesRef.current) {
      motes.forEach((m, i) => {
        m.y += m.speedY * dt;
        m.x += Math.sin(time * m.swaySpeed + i) * dt * 0.2;

        if (m.y > 10) {
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

    if (embersRef.current) {
      embers.forEach((e, i) => {
        e.y += e.speedY * dt;
        e.x += Math.sin(time * 2 + i) * dt * 0.3;

        if (e.y > 8) {
          e.y = 0.5;
          e.x = -14 + (Math.random() - 0.5) * 14;
        }

        dummy.position.set(e.x, e.y, e.z);
        dummy.scale.set(e.size, e.size, e.size);
        dummy.updateMatrix();
        embersRef.current.setMatrixAt(i, dummy.matrix);
      });
      embersRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Soft Aerial Perspective Fog (Color perfectly matches sky horizon) */}
      <fogExp2 attach="fog" args={['#8faec9', 0.0085]} />

      {/* Full Seamless Celestial Sky Dome */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[160, 32, 16]} />
        <meshBasicMaterial color="#8faec9" side={THREE.BackSide} />
      </mesh>

      {/* Floating Sunlight Dust Motes */}
      <instancedMesh ref={motesRef} args={[null, null, moteCount]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </instancedMesh>

      {/* Floating Glowing Fiery Embers */}
      <instancedMesh ref={embersRef} args={[null, null, emberCount]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#f97316" />
      </instancedMesh>
    </group>
  );
}
