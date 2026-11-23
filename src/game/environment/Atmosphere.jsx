import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Atmosphere() {
  const count = 350;
  const meshRef = useRef();

  // Generate random particles in a 90x20x110 bounding volume
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 80;
      const y = Math.random() * 12 + 0.2;
      const z = (Math.random() - 0.5) * 110 - 20;
      const speed = 0.2 + Math.random() * 0.5;
      const size = 0.05 + Math.random() * 0.09;
      temp.push({ x, y, z, speed, size });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    particles.forEach((p, i) => {
      p.y += delta * p.speed;
      p.x += Math.sin(state.clock.elapsedTime + i) * delta * 0.2;

      // Wrap around
      if (p.y > 12) {
        p.y = 0.2;
        p.x = (Math.random() - 0.5) * 80;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(p.size, p.size, p.size);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Deep Atmospheric Disaster Fog */}
      <fogExp2 attach="fog" args={['#10141a', 0.022]} />

      {/* Floating Ash & Dust Embers */}
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#ff8833" transparent opacity={0.65} />
      </instancedMesh>
    </group>
  );
}
