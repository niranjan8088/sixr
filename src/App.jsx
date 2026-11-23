/**
 * AFTERLIGHT — App.jsx
 *
 * Root component. Assembles the Canvas (3D scene) and all HTML overlays.
 *
 * OWNERSHIP MAP:
 *   App.jsx      → Niranjan  (this file — scene orchestration)
 *   World.jsx    → Niranjan  (environment, lighting, terrain)
 *   Player.jsx   → Niranjan  (movement, camera, position sync)
 *   Survivors.jsx   → Gameplay systems (this dev)
 *   Interactions.jsx → Gameplay systems (this dev)
 *   RescueZone.jsx   → Gameplay systems (this dev)
 *   MissionHUD.jsx   → Gameplay systems (this dev)
 *   ScoreScreen.jsx  → Gameplay systems (this dev)
 *   MainMenu.jsx     → Gameplay systems (this dev)
 *
 * DO NOT put game logic here. App.jsx is wiring only.
 */

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Sky, Environment } from '@react-three/drei';

import World      from './game/World.jsx';
import Player     from './game/Player.jsx';
import Survivors  from './game/Survivors.jsx';
import RescueZone from './game/RescueZone.jsx';

// HTML overlays (outside Canvas)
import Interactions from './game/Interactions.jsx';
import MissionHUD   from './game/MissionHUD.jsx';
import ScoreScreen  from './game/ScoreScreen.jsx';
import MainMenu     from './game/MainMenu.jsx';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0a0f19' }}>
      {/* ── 3D Canvas ─────────────────────────────────────────────────────── */}
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 300 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          {/* Environment */}
          <Sky sunPosition={[100, 10, 100]} turbidity={10} rayleigh={2} />
          <ambientLight intensity={0.4} />
          <directionalLight
            castShadow
            position={[20, 30, 10]}
            intensity={1.2}
            shadow-mapSize={[2048, 2048]}
          />
          <fog attach="fog" args={['#1a2035', 30, 120]} />

          {/* Scene */}
          <World />
          <Player />

          {/* Gameplay systems — owned by gameplay developer */}
          <Survivors />
          <RescueZone />
        </Suspense>
      </Canvas>

      {/* ── HTML overlays (z-index layering) ─────────────────────────────── */}
      <MainMenu />        {/* z: 3000 — top layer, shown only on menu */}
      <ScoreScreen />     {/* z: 2000 — mission complete overlay */}
      <MissionHUD />      {/* z: 100  — always-on HUD during play */}
      <Interactions />    {/* z: 1000 — decision panel (modal) */}
    </div>
  );
}
