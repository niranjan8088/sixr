import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Atmosphere() {
  const emberCount = 400;
  const smokeCount = 40;
  const embersRef = useRef();
  const smokeRef = useRef();

  // Floating orange embers
  const embers = useMemo(() => {
    const arr = [];
    for (let i = 0; i < emberCount; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 90,
        y: Math.random() * 16 + 0.3,
        z: (Math.random() - 0.5) * 120 - 20,
        speedY: 0.3 + Math.random() * 0.7,
        swaySpeed: 1 + Math.random() * 2,
        size: 0.04 + Math.random() * 0.08,
        colorIndex: Math.random() > 0.3 ? 0 : 1 // bright orange or yellow
      });
    }
    return arr;
  }, []);

  // Rising smoke puffs from burning wreckages
  const smokePuffs = useMemo(() => {
    const arr = [];
    // Two main smoke source locations (vehicle fires)
    const sources = [
      { x: 6.5, z: -28 },
      { x: -14, z: -11 },
      { x: -5, z: -6.5 }
    ];

    for (let i = 0; i < smokeCount; i++) {
      const src = sources[i % sources.length];
      arr.push({
        originX: src.x,
        originZ: src.z,
        x: src.x + (Math.random() - 0.5) * 1.5,
        y: Math.random() * 12 + 0.5,
        z: src.z + (Math.random() - 0.5) * 1.5,
        speedY: 0.8 + Math.random() * 0.9,
        scale: 0.6 + Math.random() * 1.8,
        rotSpeed: (Math.random() - 0.5) * 0.8
      });
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const time = state.clock.getElapsedTime();

    // Update Embers
    if (embersRef.current) {
      embers.forEach((e, i) => {
        e.y += e.speedY * dt;
        e.x += Math.sin(time * e.swaySpeed + i) * dt * 0.4;

        if (e.y > 16) {
          e.y = 0.3;
          e.x = (Math.random() - 0.5) * 90;
        }

        dummy.position.set(e.x, e.y, e.z);
        dummy.scale.set(e.size, e.size, e.size);
        dummy.updateMatrix();
        embersRef.current.setMatrixAt(i, dummy.matrix);
      });
      embersRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update Smoke Puffs
    if (smokeRef.current) {
      smokePuffs.forEach((s, i) => {
        s.y += s.speedY * dt;
        s.x += Math.sin(time + i) * dt * 0.3;
        const growth = 1 + (s.y / 12) * 1.5;

        if (s.y > 14) {
          s.y = 0.5;
          s.x = s.originX + (Math.random() - 0.5) * 1.2;
          s.z = s.originZ + (Math.random() - 0.5) * 1.2;
        }

        dummy.position.set(s.x, s.y, s.z);
        const curScale = s.scale * growth;
        dummy.scale.set(curScale, curScale * 0.8, curScale);
        dummy.rotation.set(0, time * s.rotSpeed + i, 0);
        dummy.updateMatrix();
        smokeRef.current.setMatrixAt(i, dummy.matrix);
      });
      smokeRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Cinematic Slate-Blue Dusk Atmospheric Fog (Readable at distance) */}
      <fogExp2 attach="fog" args={['#182334', 0.013]} />

      {/* Distant Atmospheric Sky Dome */}
      <mesh position={[0, 40, -30]}>
        <sphereGeometry args={[130, 24, 16]} />
        <meshBasicMaterial color="#141d2a" side={THREE.BackSide} />
      </mesh>

      {/* Floating Fiery Ash Embers */}
      <instancedMesh ref={embersRef} args={[null, null, emberCount]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#ff9533" />
      </instancedMesh>

      {/* Volumetric Dark Smoke Columns from Fires */}
      <instancedMesh ref={smokeRef} args={[null, null, smokeCount]}>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#222832"
          roughness={0.95}
          metalness={0.0}
          transparent
          opacity={0.35}
        />
      </instancedMesh>
    </group>
  );
}
