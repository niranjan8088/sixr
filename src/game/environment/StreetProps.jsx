import React, { useEffect } from 'react';
import { globalCollisions } from '../core/CollisionManager';

export default function StreetProps() {
  // Register barrier colliders
  useEffect(() => {
    // Concrete Jersey Barriers
    globalCollisions.addBox(-2.0, 20.0, 2.0, 21.0, 'bar-spawn');
    globalCollisions.addBox(-7.0, -16.0, -3.0, -14.0, 'bar-cross-w');
    globalCollisions.addBox(3.0, -16.0, 7.0, -14.0, 'bar-cross-e');
  }, []);

  return (
    <group>
      {/* 1. Highway Concrete Jersey Barriers (with orange/white reflective stripes) */}
      {/* Spawn Perimeter Barrier */}
      <group position={[0, 0.5, 20.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[8.0, 1.0, 0.6]} />
          <meshStandardMaterial color="#404650" roughness={0.8} />
        </mesh>
        {/* Warning Stripes */}
        {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
          <mesh key={`bar-s1-${i}`} position={[x, 0.05, 0.32]}>
            <planeGeometry args={[0.9, 0.7]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#ff7700' : '#ffffff'} />
          </mesh>
        ))}
      </group>

      {/* Crossroad Barriers */}
      <group position={[-5.0, 0.5, -15.0]} rotation={[0, 0.2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, 1.0, 0.6]} />
          <meshStandardMaterial color="#404650" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.05, 0.32]}>
          <planeGeometry args={[3.8, 0.6]} />
          <meshStandardMaterial color="#ff7700" />
        </mesh>
      </group>
      <group position={[5.0, 0.5, -15.0]} rotation={[0, -0.2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, 1.0, 0.6]} />
          <meshStandardMaterial color="#404650" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.05, 0.32]}>
          <planeGeometry args={[3.8, 0.6]} />
          <meshStandardMaterial color="#ff7700" />
        </mesh>
      </group>

      {/* 2. Streetlights with warm amber illumination */}
      {[
        { pos: [-8.8, 0, 8], rotY: 0 },
        { pos: [8.8, 0, 8], rotY: Math.PI },
        { pos: [-8.8, 0, -2], rotY: 0 },
        { pos: [8.8, 0, -2], rotY: Math.PI },
        { pos: [-8.8, 0, -26], rotY: 0.1 },
        { pos: [8.8, 0, -26], rotY: Math.PI - 0.1 }
      ].map((sl, idx) => (
        <group key={`sl-${idx}`} position={sl.pos} rotation={[0, sl.rotY, 0]}>
          {/* Vertical Pole */}
          <mesh position={[0, 3.8, 0]}>
            <cylinderGeometry args={[0.08, 0.14, 7.6, 8]} />
            <meshStandardMaterial color="#222830" roughness={0.6} metalness={0.7} />
          </mesh>
          {/* Curved Horizontal Arm */}
          <mesh position={[1.0, 7.4, 0]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.06, 0.07, 2.2, 8]} />
            <meshStandardMaterial color="#222830" roughness={0.6} metalness={0.7} />
          </mesh>
          {/* Streetlight Luminaire Fixture */}
          <mesh position={[2.0, 7.1, 0]}>
            <boxGeometry args={[0.6, 0.15, 0.3]} />
            <meshStandardMaterial color="#1a1e24" />
          </mesh>
          {/* Glowing Lens */}
          <mesh position={[2.0, 7.02, 0]}>
            <planeGeometry args={[0.5, 0.22]} rotation={[Math.PI / 2, 0, 0]} />
            <meshBasicMaterial color="#ffe090" />
          </mesh>
        </group>
      ))}

      {/* 3. Tilted Fallen Utility Pole with Exposed Cables */}
      <group position={[-8.4, 0, 18]} rotation={[0, 0, 1.1]}>
        <mesh position={[0, 4.0, 0]}>
          <cylinderGeometry args={[0.12, 0.18, 8.0, 8]} />
          <meshStandardMaterial color="#302820" roughness={0.9} />
        </mesh>
        {/* Transformer Box */}
        <mesh position={[0, 6.0, 0.3]}>
          <boxGeometry args={[0.6, 0.8, 0.5]} />
          <meshStandardMaterial color="#404a54" roughness={0.6} />
        </mesh>
      </group>

      {/* 4. Broken Overhead Traffic Signal at Intersection Z = -15 */}
      <group position={[8.4, 0, -14.5]}>
        <mesh position={[0, 3.6, 0]}>
          <cylinderGeometry args={[0.12, 0.16, 7.2, 8]} />
          <meshStandardMaterial color="#1a1f26" metalness={0.8} />
        </mesh>
        {/* Horizontal Cantilever Arm Over Road */}
        <mesh position={[-4.0, 6.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.1, 8.0, 8]} />
          <meshStandardMaterial color="#1a1f26" metalness={0.8} />
        </mesh>
        {/* Hanging Signal Box (Tilted) */}
        <group position={[-4.5, 6.2, 0]} rotation={[0.15, 0, -0.2]}>
          <mesh>
            <boxGeometry args={[0.4, 1.1, 0.35]} />
            <meshStandardMaterial color="#2d2208" roughness={0.6} />
          </mesh>
          {/* Flashing Amber Hazard Light */}
          <mesh position={[0, 0, 0.19]}>
            <circleGeometry args={[0.12, 12]} />
            <meshBasicMaterial color="#ffaa00" />
          </mesh>
        </group>
      </group>

      {/* 5. Fire Barrels / Burning Drums */}
      <group position={[-14.5, 0.6, -11.5]}>
        {/* Metal Oil Drum */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 1.2, 14]} />
          <meshStandardMaterial color="#553018" roughness={0.8} metalness={0.5} />
        </mesh>
        {/* Burning Fire core */}
        <mesh position={[0, 0.7, 0]}>
          <dodecahedronGeometry args={[0.3, 0]} />
          <meshBasicMaterial color="#ff5500" />
        </mesh>
      </group>
      <group position={[6.2, 0.6, -26.0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 1.2, 14]} />
          <meshStandardMaterial color="#4a2215" roughness={0.8} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <dodecahedronGeometry args={[0.3, 0]} />
          <meshBasicMaterial color="#ff5500" />
        </mesh>
      </group>
    </group>
  );
}
