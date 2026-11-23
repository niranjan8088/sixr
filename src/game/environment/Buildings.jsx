import React, { useEffect } from 'react';
import { globalCollisions } from '../core/CollisionManager';

// Fore- and mid-ground high-detail buildings
const PRIMARY_BUILDINGS = [
  // West Avenue Row
  {
    id: 'b-w1',
    pos: [-23, 16, 12],
    size: [18, 32, 22],
    color: '#28313e',
    accentColor: '#1d232c',
    floors: 8,
    damagedTop: true,
    hvac: true,
    antenna: true
  },
  {
    id: 'b-w2',
    pos: [-25, 22, -18],
    size: [20, 44, 20],
    color: '#202630',
    accentColor: '#161b22',
    floors: 11,
    damagedTop: true,
    hvac: true,
    antenna: true
  },
  {
    id: 'b-w3',
    pos: [-24, 14, -46],
    size: [18, 28, 24],
    color: '#303947',
    accentColor: '#222832',
    floors: 7,
    damagedTop: false,
    hvac: true,
    antenna: false
  },

  // East Avenue Row
  {
    id: 'b-e1',
    pos: [23, 18, 14],
    size: [18, 36, 22],
    color: '#242b36',
    accentColor: '#1a1f27',
    floors: 9,
    damagedTop: true,
    hvac: true,
    antenna: true
  },
  {
    id: 'b-e2',
    pos: [26, 24, -12],
    size: [22, 48, 22],
    color: '#1e242e',
    accentColor: '#14181f',
    floors: 12,
    damagedTop: true,
    hvac: true,
    antenna: true
  },
  {
    id: 'b-e3',
    pos: [25, 15, -42],
    size: [20, 30, 24],
    color: '#2d3542',
    accentColor: '#20252e',
    floors: 7,
    damagedTop: false,
    hvac: true,
    antenna: false
  },

  // South Entrance Flanking Buildings
  {
    id: 'b-s1',
    pos: [-22, 12, 36],
    size: [18, 24, 16],
    color: '#272f3b',
    accentColor: '#1b2028',
    floors: 6,
    damagedTop: false,
    hvac: true,
    antenna: false
  },
  {
    id: 'b-s2',
    pos: [22, 12, 36],
    size: [18, 24, 16],
    color: '#272f3b',
    accentColor: '#1b2028',
    floors: 6,
    damagedTop: false,
    hvac: true,
    antenna: false
  }
];

// Distant background city skyline silhouettes (Low poly, no colliders needed)
const SKYLINE_BUILDINGS = [
  { pos: [-55, 35, -75], size: [28, 70, 28], color: '#161c26' },
  { pos: [-25, 42, -90], size: [32, 84, 30], color: '#141a24' },
  { pos: [8, 48, -98], size: [36, 96, 32], color: '#121822' },
  { pos: [45, 38, -85], size: [30, 76, 30], color: '#151b25' },
  { pos: [75, 30, -70], size: [28, 60, 28], color: '#171e28' },

  // Far East and West Silhouettes
  { pos: [-65, 28, -25], size: [30, 56, 32], color: '#151b24' },
  { pos: [-60, 32, 15], size: [28, 64, 28], color: '#141a23' },
  { pos: [65, 30, -20], size: [30, 60, 30], color: '#151b24' },
  { pos: [62, 26, 20], size: [28, 52, 28], color: '#161c25' }
];

export default function Buildings() {
  // Register AABB collision boundaries for primary structures
  useEffect(() => {
    PRIMARY_BUILDINGS.forEach((b) => {
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
      {/* 1. Primary Detailed Buildings */}
      {PRIMARY_BUILDINGS.map((b) => {
        const height = b.size[1];
        const halfH = height / 2;
        const width = b.size[0];
        const depth = b.size[2];

        return (
          <group key={b.id} position={b.pos}>
            {/* Concrete Structural Core */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={b.size} />
              <meshStandardMaterial color={b.color} roughness={0.85} metalness={0.2} />
            </mesh>

            {/* Front Architectural Window Bands / Facade Glass */}
            {Array.from({ length: Math.min(b.floors, 8) }).map((_, fIdx) => {
              const yOffset = -halfH + 2.5 + fIdx * 3.8;
              if (yOffset > halfH - 2) return null;
              return (
                <mesh key={`win-f-${fIdx}`} position={[0, yOffset, depth / 2 + 0.08]}>
                  <boxGeometry args={[width * 0.88, 1.8, 0.1]} />
                  <meshStandardMaterial
                    color={fIdx === 2 || fIdx === 5 ? '#243242' : '#0e141c'}
                    roughness={0.2}
                    metalness={0.8}
                  />
                </mesh>
              );
            })}

            {/* Inner Street Window Bands */}
            {Array.from({ length: Math.min(b.floors, 8) }).map((_, fIdx) => {
              const yOffset = -halfH + 2.5 + fIdx * 3.8;
              if (yOffset > halfH - 2) return null;
              // Side facing the street
              const xSide = b.pos[0] < 0 ? width / 2 + 0.08 : -width / 2 - 0.08;
              return (
                <mesh key={`win-s-${fIdx}`} position={[xSide, yOffset, 0]}>
                  <boxGeometry args={[0.1, 1.8, depth * 0.88]} />
                  <meshStandardMaterial
                    color={fIdx === 3 ? '#2a3b4f' : '#0e141c'}
                    roughness={0.2}
                    metalness={0.8}
                  />
                </mesh>
              );
            })}

            {/* Damaged Rooftop / Collapsed Concrete Slabs */}
            {b.damagedTop && (
              <group position={[0, halfH + 1, 0]}>
                <mesh position={[2, 0.4, -1]} rotation={[0.1, 0.2, -0.15]}>
                  <boxGeometry args={[width * 0.6, 2.2, depth * 0.5]} />
                  <meshStandardMaterial color="#3d3730" roughness={0.9} />
                </mesh>
                {/* Exposed Rusty Steel Girders / Rebar */}
                <mesh position={[-width * 0.25, 1.8, 0]} rotation={[0.3, 0, 0.2]}>
                  <boxGeometry args={[0.25, 4.5, 0.25]} />
                  <meshStandardMaterial color="#8a4422" roughness={0.6} metalness={0.7} />
                </mesh>
                <mesh position={[width * 0.2, 1.6, 2]} rotation={[-0.2, 0.4, 0.3]}>
                  <boxGeometry args={[0.25, 3.8, 0.25]} />
                  <meshStandardMaterial color="#8a4422" roughness={0.6} metalness={0.7} />
                </mesh>
              </group>
            )}

            {/* Rooftop Industrial HVAC Plant */}
            {b.hvac && (
              <group position={[0, halfH + 1.2, 0]}>
                <mesh position={[-3, 0, -2]}>
                  <boxGeometry args={[4.2, 2.4, 3.5]} />
                  <meshStandardMaterial color="#2d3540" roughness={0.5} metalness={0.6} />
                </mesh>
                <mesh position={[2.5, 0, 3]}>
                  <cylinderGeometry args={[1.2, 1.2, 2.8, 12]} />
                  <meshStandardMaterial color="#353e4b" roughness={0.6} metalness={0.5} />
                </mesh>
              </group>
            )}

            {/* Radio / Cellular Communications Tower with Red Aviation Beacon */}
            {b.antenna && (
              <group position={[b.pos[0] < 0 ? -2 : 2, halfH + 5, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.15, 0.35, 10, 8]} />
                  <meshStandardMaterial color="#cf4020" roughness={0.4} metalness={0.8} />
                </mesh>
                {/* Flashing Red Aviation Light */}
                <mesh position={[0, 5.2, 0]}>
                  <sphereGeometry args={[0.35, 8, 8]} />
                  <meshBasicMaterial color="#ff2222" />
                </mesh>
              </group>
            )}
          </group>
        );
      })}

      {/* 2. Distant Metropolitan Skyline Silhouettes */}
      {SKYLINE_BUILDINGS.map((sky, i) => (
        <group key={`sky-${i}`} position={sky.pos}>
          <mesh>
            <boxGeometry args={sky.size} />
            <meshBasicMaterial color={sky.color} />
          </mesh>
          {/* Subtle Rooftop Pinnacle Beacon on Tallest Towers */}
          {sky.size[1] > 70 && (
            <mesh position={[0, sky.size[1] / 2 + 4, 0]}>
              <cylinderGeometry args={[0.2, 0.6, 8, 6]} />
              <meshBasicMaterial color="#ff3333" />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
