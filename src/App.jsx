import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import World from './game/World';
import { GameController } from './game/core/GameController';
import { useGameStore } from './store/gameStore';
import { GAME_PHASES } from './utils/constants';

import MainMenu from './ui/screens/MainMenu';
import MissionBriefing from './ui/screens/MissionBriefing';
import PauseMenu from './ui/screens/PauseMenu';
import ResultsScreen from './ui/screens/ResultsScreen';
import HUD from './ui/hud/HUD';
import RescueModal from './ui/rescue/RescueModal';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function App() {
  const phase = useGameStore((state) => state.phase);
  const activeRescueSurvivor = useGameStore((state) => state.activeRescueSurvivor);
  const notification = useGameStore((state) => state.notification);

  // Initialize input and game controllers on mount
  useEffect(() => {
    GameController.init();
    return () => {
      GameController.destroy();
    };
  }, []);

  return (
    <div className="game-container">
      {/* 3D Canvas Layer */}
      <div className="canvas-container">
        <Canvas
          shadows
          camera={{ fov: 55, near: 0.1, far: 200, position: [0, 4, 25] }}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => {
            gl.setClearColor('#0b0e14');
          }}
        >
          <World />
        </Canvas>
      </div>

      {/* Cinematic Screen Post-Process Emulation (Vignette & Ash Dust) */}
      <div className="vignette-overlay" />
      <div className="dust-overlay" />

      {/* Global Notifications Toast */}
      {notification && (
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 300,
          pointerEvents: 'none'
        }}>
          <div className="sci-panel" style={{
            padding: '10px 24px',
            border: notification.type === 'error' ? '1px solid var(--accent-red)' : '1px solid var(--accent-amber)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: '#fff',
            animation: 'pulseGlow 2s infinite ease-in-out'
          }}>
            {notification.type === 'error' ? (
              <AlertCircle size={16} color="var(--accent-red)" />
            ) : notification.type === 'success' ? (
              <CheckCircle size={16} color="var(--accent-green)" />
            ) : (
              <Info size={16} color="var(--accent-amber)" />
            )}
            <span>{notification.text}</span>
          </div>
        </div>
      )}

      {/* UI Screens Layer */}
      <div className="ui-layer">
        {phase === GAME_PHASES.MENU && <MainMenu />}
        {phase === GAME_PHASES.BRIEFING && <MissionBriefing />}
        
        {(phase === GAME_PHASES.PLAYING || phase === GAME_PHASES.EXTRACTION) && (
          <HUD />
        )}

        {phase === GAME_PHASES.PAUSED && (
          <>
            <HUD />
            <PauseMenu />
          </>
        )}

        {phase === GAME_PHASES.RESULTS && <ResultsScreen />}

        {/* Triage Modal Triggered by Player Interaction */}
        {activeRescueSurvivor && <RescueModal />}
      </div>
    </div>
  );
}

