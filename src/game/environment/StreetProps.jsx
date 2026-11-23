import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { globalCollisions } from '../core/CollisionManager';

/**
 * Animated Fire Barrel with multi-layered flickering flames and glowing coal bed.
 */
function AnimatedFireBarrel({ position, color = '#553018' }) {
  const flame1Ref = useRef();
  const flame2Ref = useRef();
  const flame3Ref = useRef();
  const lightRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 7;
    if (flame1Ref.current) {
      const s = 1.0 + Math.sin(t) * 0.18 + Math.cos(t * 1.5) * 0.12;
      flame1Ref.current.scale.set(s, 1.0 + Math.sin(t * 1.2) * 0.25, s);
      flame1Ref.current.rotation.y = t * 0.2;
    }
    if (flame2Ref.current) {
      const s = 1.0 + Math.cos(t * 1.3) * 0.2;
      flame2Ref.current.scale.set(s, 1.0 + Math.cos(t) * 0.3, s);
      flame2Ref.current.rotation.y = -t * 0.3;
    }
    if (flame3Ref.current) {
      const s = 0.8 + Math.sin(t * 2) * 0.15;
      flame3Ref.current.scale.set(s, s * 1.2, s);
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.6 + Math.sin(t * 1.5) * 0.5 + Math.cos(t * 2.3) * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Weathered Corrugated Oil Drum */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 1.25, 16]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.45} />
      </mesh>
      {/* Rib Rims */}
      {[-0.3, 0.3].map((ry, ri) => (
        <mesh key={`rib-${ri}`} position={[0, ry, 0]}>
          <cylinderGeometry args={[0.435, 0.435, 0.05, 16]} />
          <meshStandardMaterial color="#1f1812" metalness={0.6} />
        </mesh>
      ))}
      {/* Charred Coals Bed */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.39, 0.39, 0.1, 12]} />
        <meshStandardMaterial color="#221208" roughness={0.9} />
      </mesh>
      {/* Glowing Ember Bed */}
      <mesh position={[0, 0.62, 0]}>
        <circleGeometry args={[0.34, 12]} rotation={[-Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color="#ff4400" />
      </mesh>
      {/* Layer 1: Outer Orange Flame Cones */}
      <mesh ref={flame1Ref} position={[0, 0.95, 0]}>
        <coneGeometry args={[0.32, 0.75, 8]} />
        <meshBasicMaterial color="#ff6600" transparent opacity={0.85} />
      </mesh>
      {/* Layer 2: Core Yellow Hot Flame */}
      <mesh ref={flame2Ref} position={[0, 0.9, 0]}>
        <coneGeometry args={[0.22, 0.6, 7]} />
        <meshBasicMaterial color="#ffcc00" transparent opacity={0.9} />
      </mesh>
      {/* Layer 3: White Hot Center Tip */}
      <mesh ref={flame3Ref} position={[0, 0.82, 0]}>
        <coneGeometry args={[0.12, 0.42, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Flickering Fire Light */}
      <pointLight ref={lightRef} position={[0, 1.2, 0]} color="#ff7700" distance={8} decay={2} intensity={1.8} />
    </group>
  );
}

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
        {/* Warning Stripes (Double-sided to prevent clipping) */}
        {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
          <mesh key={`bar-s1-${i}`} position={[x, 0.05, 0.32]}>
            <planeGeometry args={[0.9, 0.7]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#ff7700' : '#ffffff'}
              side={THREE.DoubleSide}
            />
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
          <meshStandardMaterial color="#ff7700" side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group position={[5.0, 0.5, -15.0]} rotation={[0, -0.2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.2, 1.0, 0.6]} />
          <meshStandardMaterial color="#404650" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.05, 0.32]}>
          <planeGeometry args={[3.8, 0.6]} />
          <meshStandardMaterial color="#ff7700" side={THREE.DoubleSide} />
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

      {/* 5. Animated Flickering Fire Barrels / Burning Drums */}
      <AnimatedFireBarrel position={[-14.5, 0.6, -11.5]} color="#553018" />
      <AnimatedFireBarrel position={[6.2, 0.6, -26.0]} color="#4a2215" />

      {/* =================================================================
          6. REALISTIC FIRE STATION ENVIRONMENT & RESCUE PROPS (Image 3 Match!)
          Dispatch terminal, workbench, fire axes, chainsaws, gas cans, triage cot
         ================================================================= */}
      <group position={[11.5, 0, 4.5]}>
        {/* Dispatch Command Desk with Dual Monitors */}
        <group position={[0, 0, 2.8]}>
          {/* Wooden Office Desk */}
          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.2, 0.8, 1.0]} />
            <meshStandardMaterial color="#322c24" roughness={0.8} />
          </mesh>
          {/* Dual Monitor Mount & Screens */}
          <mesh position={[-0.45, 0.95, 0.1]} rotation={[0, 0.12, 0]}>
            <boxGeometry args={[0.7, 0.42, 0.05]} />
            <meshStandardMaterial color="#111822" roughness={0.4} />
          </mesh>
          <mesh position={[-0.45, 0.95, 0.13]} rotation={[0, 0.12, 0]}>
            <planeGeometry args={[0.62, 0.36]} />
            <meshBasicMaterial color="#00e5ff" />
          </mesh>
          <mesh position={[0.45, 0.95, 0.1]} rotation={[0, -0.12, 0]}>
            <boxGeometry args={[0.7, 0.42, 0.05]} />
            <meshStandardMaterial color="#111822" roughness={0.4} />
          </mesh>
          <mesh position={[0.45, 0.95, 0.13]} rotation={[0, -0.12, 0]}>
            <planeGeometry args={[0.62, 0.36]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          {/* Keyboard & Mousepad */}
          <mesh position={[0, 0.81, -0.15]}>
            <boxGeometry args={[0.6, 0.02, 0.22]} />
            <meshStandardMaterial color="#18181b" roughness={0.6} />
          </mesh>
          {/* Office Swivel Chair */}
          <mesh position={[0, 0.45, -0.8]} castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#1c2024" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.9, -1.0]}>
            <boxGeometry args={[0.46, 0.5, 0.1]} />
            <meshStandardMaterial color="#272e38" roughness={0.8} />
          </mesh>
        </group>

        {/* Heavy-Duty Metal Equipment Workbench */}
        <group position={[0, 0, -1.2]}>
          <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.8, 0.95, 1.1]} />
            <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.7} />
          </mesh>
          {/* Heavy Bench Vice */}
          <mesh position={[-1.0, 1.05, 0.3]}>
            <boxGeometry args={[0.25, 0.22, 0.25]} />
            <meshStandardMaterial color="#334155" metalness={0.85} />
          </mesh>
          {/* Red Firefighter Axe */}
          <group position={[-0.3, 0.98, 0.1]} rotation={[0, 0.6, Math.PI / 2]}>
            <mesh>
              <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
              <meshStandardMaterial color="#b45309" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.42, 0.05]}>
              <boxGeometry args={[0.03, 0.18, 0.14]} />
              <meshStandardMaterial color="#dc2626" metalness={0.8} />
            </mesh>
          </group>
          {/* Orange Rescue Chainsaw */}
          <group position={[0.5, 1.05, 0]}>
            <mesh>
              <boxGeometry args={[0.35, 0.22, 0.22]} />
              <meshStandardMaterial color="#ea580c" roughness={0.5} />
            </mesh>
            {/* Guide Bar */}
            <mesh position={[0.35, -0.02, 0]}>
              <boxGeometry args={[0.45, 0.08, 0.02]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.9} />
            </mesh>
          </group>
          {/* Red Emergency Jerry Can */}
          <mesh position={[1.1, 1.1, 0.1]} castShadow>
            <boxGeometry args={[0.22, 0.35, 0.28]} />
            <meshStandardMaterial color="#b91c1c" roughness={0.5} />
          </mesh>
        </group>

        {/* Wall Pegboard Tool Rack */}
        <group position={[1.4, 1.4, 0.8]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[3.6, 1.6, 0.08]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} metalness={0.3} />
          </mesh>
          {/* Coiled Fire Hose */}
          <mesh position={[-1.0, 0.1, 0.12]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.32, 0.1, 10, 24]} />
            <meshStandardMaterial color="#e11d48" roughness={0.8} />
          </mesh>
          {/* Rescue Helmets / Hard Hats */}
          {[-0.2, 0.4, 1.0].map((hx, hi) => (
            <mesh key={`helmet-${hi}`} position={[hx, 0.3, 0.12]}>
              <sphereGeometry args={[0.15, 12, 12]} />
              <meshStandardMaterial color={hi === 0 ? '#facc15' : '#ffffff'} roughness={0.3} />
            </mesh>
          ))}
        </group>

        {/* Metal Emergency Triage Cot / Bed */}
        <group position={[-1.2, 0, 0.6]}>
          {/* Metal Bed Frame */}
          <mesh position={[0, 0.28, 0]} castShadow>
            <boxGeometry args={[0.9, 0.4, 2.0]} />
            <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.8} />
          </mesh>
          {/* Mattress / Folded Khaki Rescue Blanket */}
          <mesh position={[0, 0.52, 0]}>
            <boxGeometry args={[0.82, 0.12, 1.9]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.6, -0.6]}>
            <boxGeometry args={[0.6, 0.1, 0.45]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* =================================================================
          7. DROOPING OVERHEAD UTILITY & POWER CABLES (Image 2 Match!)
          Sagging electrical lines suspended across the boulevard and buildings
         ================================================================= */}
      {/* Cable 1: Crossing from West street pole [-8.8, 7.1, 8] to East pole [8.8, 7.1, 8] */}
      <group position={[0, 6.2, 8]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 17.6, 6]} />
          <meshBasicMaterial color="#18181b" />
        </mesh>
        {/* Drooping Center Sag */}
        <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 12.0, 6]} />
          <meshBasicMaterial color="#18181b" />
        </mesh>
      </group>

      {/* Cable 2: Crossing from West street pole [-8.8, 7.1, -2] to East pole [8.8, 7.1, -2] */}
      <group position={[0, 6.1, -2]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 17.6, 6]} />
          <meshBasicMaterial color="#18181b" />
        </mesh>
        <mesh position={[0, -0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 12.0, 6]} />
          <meshBasicMaterial color="#18181b" />
        </mesh>
      </group>

      {/* Cable 3: Crossing from West street pole [-8.8, 7.1, -26] to East pole [8.8, 7.1, -26] */}
      <group position={[0, 6.1, -26]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 17.6, 6]} />
          <meshBasicMaterial color="#18181b" />
        </mesh>
        <mesh position={[0, -0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 12.0, 6]} />
          <meshBasicMaterial color="#18181b" />
        </mesh>
      </group>
    </group>
  );
}
