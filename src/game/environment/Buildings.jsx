import React, { useEffect } from 'react';
import { globalCollisions } from '../core/CollisionManager';

const DETAILED_BUILDINGS = [
  // West Avenue Classic Brick & Brownstone Apartments
  {
    id: 'b-w1',
    pos: [-23, 16, 12],
    size: [18, 32, 22],
    wallColor: '#7a4e3d', // Classic Red Brick
    corniceColor: '#b8ab99', // Limestone trim
    fireEscape: true,
    hasIvy: true,
    floors: 8
  },
  {
    id: 'b-w2',
    pos: [-25, 20, -18],
    size: [20, 40, 20],
    wallColor: '#634b3e', // Weathered Brownstone
    corniceColor: '#9e9282',
    fireEscape: true,
    hasIvy: true,
    floors: 10
  },
  {
    id: 'b-w3',
    pos: [-24, 14, -46],
    size: [18, 28, 24],
    wallColor: '#8a7d6e', // Aged Concrete & Sandstone
    corniceColor: '#5c5348',
    fireEscape: false,
    hasIvy: true,
    floors: 7
  },

  // East Avenue Ornate Masonry Buildings
  {
    id: 'b-e1',
    pos: [23, 17, 14],
    size: [18, 34, 22],
    wallColor: '#6e4537', // Deep Terracotta Brick
    corniceColor: '#a89c8a',
    fireEscape: true,
    hasIvy: true,
    floors: 8
  },
  {
    id: 'b-e2',
    pos: [26, 22, -12],
    size: [22, 44, 22],
    wallColor: '#5a463a', // Dark Brownstone
    corniceColor: '#8f8373',
    fireEscape: true,
    hasIvy: true,
    floors: 10
  },
  {
    id: 'b-e3',
    pos: [25, 15, -42],
    size: [20, 30, 24],
    wallColor: '#786e62',
    corniceColor: '#4f4840',
    fireEscape: false,
    hasIvy: true,
    floors: 7
  },

  // Flanking South Buildings
  {
    id: 'b-s1',
    pos: [-22, 12, 36],
    size: [18, 24, 16],
    wallColor: '#6b4c3b',
    corniceColor: '#968877',
    fireEscape: true,
    hasIvy: false,
    floors: 6
  },
  {
    id: 'b-s2',
    pos: [22, 12, 36],
    size: [18, 24, 16],
    wallColor: '#6b4c3b',
    corniceColor: '#968877',
    fireEscape: true,
    hasIvy: false,
    floors: 6
  }
];

// Distant city skyline silhouettes
const SKYLINE_BUILDINGS = [
  { pos: [-55, 35, -75], size: [28, 70, 28], color: '#667b94' },
  { pos: [-25, 42, -90], size: [32, 84, 30], color: '#5a6e87' },
  { pos: [8, 48, -98], size: [36, 96, 32], color: '#53667d' },
  { pos: [45, 38, -85], size: [30, 76, 30], color: '#5f738c' },
  { pos: [75, 30, -70], size: [28, 60, 28], color: '#6a7f98' },
  { pos: [-65, 28, -25], size: [30, 56, 32], color: '#62768f' },
  { pos: [65, 30, -20], size: [30, 60, 30], color: '#62768f' }
];

export default function Buildings() {
  useEffect(() => {
    DETAILED_BUILDINGS.forEach((b) => {
      const halfW = b.size[0] / 2;
      const halfD = b.size[2] / 2;
      globalCollisions.addBox(
        b.pos[0] - halfW,
        b.pos[2] - halfD,
        b.pos[0] + halfW,
        b.pos[2] + halfD,
        b.id
      );
    });
  }, []);

  return (
    <group>
      {/* 1. Primary Detailed Brick / Brownstone Buildings */}
      {DETAILED_BUILDINGS.map((b) => {
        const height = b.size[1];
        const halfH = height / 2;
        const width = b.size[0];
        const depth = b.size[2];
        const isWest = b.pos[0] < 0;

        return (
          <group key={b.id} position={b.pos}>
            {/* Main Brick Facade Core */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={b.size} />
              <meshStandardMaterial color={b.wallColor} roughness={0.9} metalness={0.08} />
            </mesh>

            {/* Horizontal Limestone Cornice Trims separating floors */}
            {Array.from({ length: 5 }).map((_, cIdx) => (
              <mesh key={`cornice-${cIdx}`} position={[0, -halfH + (cIdx + 1) * 5.5, depth / 2 + 0.12]}>
                <boxGeometry args={[width + 0.3, 0.45, 0.35]} />
                <meshStandardMaterial color={b.corniceColor} roughness={0.7} metalness={0.15} />
              </mesh>
            ))}

            {/* Architectural Window Columns (Dark recessed glass with limestone sills) */}
            {[-width * 0.32, -width * 0.11, width * 0.11, width * 0.32].map((xCol, colIdx) =>
              Array.from({ length: Math.min(b.floors, 6) }).map((_, fIdx) => (
                <group key={`win-${colIdx}-${fIdx}`} position={[xCol, -halfH + 3.2 + fIdx * 4.6, depth / 2 + 0.08]}>
                  {/* Recessed Window Glass */}
                  <mesh>
                    <boxGeometry args={[1.6, 2.4, 0.1]} />
                    <meshStandardMaterial color="#1a2530" roughness={0.25} metalness={0.7} />
                  </mesh>
                  {/* Neoclassical Arched Pediment Header (Image 2) */}
                  {fIdx <= 2 && (
                    <mesh position={[0, 1.35, 0.1]}>
                      <boxGeometry args={[1.8, 0.25, 0.22]} />
                      <meshStandardMaterial color={b.corniceColor} roughness={0.7} />
                    </mesh>
                  )}
                  {/* Limestone Window Sill */}
                  <mesh position={[0, -1.25, 0.1]}>
                    <boxGeometry args={[1.9, 0.2, 0.25]} />
                    <meshStandardMaterial color={b.corniceColor} roughness={0.8} />
                  </mesh>
                </group>
              ))
            )}

            {/* Storefront Green Fabric Awning Canopy (Image 2 Melvin Rice Corner Building) */}
            {b.id === 'b-w1' && (
              <group position={[0, -halfH + 3.4, depth / 2 + 1.1]} rotation={[0.24, 0, 0]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[width * 0.75, 0.1, 2.2]} />
                  <meshStandardMaterial color="#14532d" roughness={0.85} />
                </mesh>
                {/* Awning Front Drop Valance */}
                <mesh position={[0, -0.18, 1.1]}>
                  <boxGeometry args={[width * 0.75, 0.36, 0.06]} />
                  <meshStandardMaterial color="#166534" roughness={0.8} />
                </mesh>
              </group>
            )}

            {/* Overgrown Green Ivy / Climbing Vines on Facade (Like in Image 1 & 2!) */}
            {b.hasIvy && (
              <group position={[isWest ? width * 0.25 : -width * 0.25, -halfH + 5.5, depth / 2 + 0.14]}>
                {/* Thick Ivy Patch */}
                <mesh>
                  <boxGeometry args={[width * 0.45, 9.5, 0.18]} />
                  <meshStandardMaterial color="#2d4a20" roughness={0.95} />
                </mesh>
                {/* Secondary Creeping Vine Layer */}
                <mesh position={[0.4, 3.2, 0.05]}>
                  <boxGeometry args={[width * 0.32, 5.0, 0.15]} />
                  <meshStandardMaterial color="#3a5c28" roughness={0.92} />
                </mesh>
              </group>
            )}

            {/* Metal Fire Escape Ladders & Platforms (Like in Image 1 & 2!) */}
            {b.fireEscape && (
              <group position={[isWest ? -width * 0.28 : width * 0.28, -halfH + 4.5, depth / 2 + 0.45]}>
                {/* Tier 1 Platform */}
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[2.8, 0.12, 1.2]} />
                  <meshStandardMaterial color="#1f2328" roughness={0.5} metalness={0.8} />
                </mesh>
                <mesh position={[0, 0.45, 0.55]}>
                  <boxGeometry args={[2.8, 0.9, 0.06]} />
                  <meshStandardMaterial color="#222830" roughness={0.5} metalness={0.8} />
                </mesh>

                {/* Tier 2 Platform */}
                <mesh position={[0, 4.5, 0]}>
                  <boxGeometry args={[2.8, 0.12, 1.2]} />
                  <meshStandardMaterial color="#1f2328" roughness={0.5} metalness={0.8} />
                </mesh>
                <mesh position={[0, 4.95, 0.55]}>
                  <boxGeometry args={[2.8, 0.9, 0.06]} />
                  <meshStandardMaterial color="#222830" roughness={0.5} metalness={0.8} />
                </mesh>

                {/* Tier 3 Platform */}
                <mesh position={[0, 9.0, 0]}>
                  <boxGeometry args={[2.8, 0.12, 1.2]} />
                  <meshStandardMaterial color="#1f2328" roughness={0.5} metalness={0.8} />
                </mesh>
                <mesh position={[0, 9.45, 0.55]}>
                  <boxGeometry args={[2.8, 0.9, 0.06]} />
                  <meshStandardMaterial color="#222830" roughness={0.5} metalness={0.8} />
                </mesh>

                {/* Angled Connecting Ladders */}
                <mesh position={[0.6, 2.25, 0]} rotation={[0, 0, 0.55]}>
                  <boxGeometry args={[0.1, 4.6, 0.35]} />
                  <meshStandardMaterial color="#1b1e24" metalness={0.8} />
                </mesh>
                <mesh position={[-0.6, 6.75, 0]} rotation={[0, 0, -0.55]}>
                  <boxGeometry args={[0.1, 4.6, 0.35]} />
                  <meshStandardMaterial color="#1b1e24" metalness={0.8} />
                </mesh>
              </group>
            )}

            {/* Rooftop Parapet & Cornice Crown */}
            <mesh position={[0, halfH + 0.5, depth / 2 + 0.1]}>
              <boxGeometry args={[width + 0.4, 1.0, 0.4]} />
              <meshStandardMaterial color={b.corniceColor} roughness={0.7} />
            </mesh>
          </group>
        );
      })}

      {/* 2. Distant Metropolitan Skyline in Daylight Aerial Perspective */}
      {SKYLINE_BUILDINGS.map((sky, i) => (
        <group key={`skyline-${i}`} position={sky.pos}>
          <mesh>
            <boxGeometry args={sky.size} />
            <meshStandardMaterial color={sky.color} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
