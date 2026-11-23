import React from 'react';
import { useGameStore } from '../../store/gameStore';
import Button from '../common/Button';
import { Play, RotateCcw, Home, HelpCircle } from 'lucide-react';

export default function PauseMenu() {
  const resumeGame = useGameStore((state) => state.resumeGame);
  const restartMission = useGameStore((state) => state.restartMission);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(5, 8, 12, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div className="sci-panel interactive" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '36px',
        textAlign: 'center',
        border: '1px solid rgba(255, 120, 30, 0.45)'
      }}>
        <div style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '2px', fontWeight: 600, marginBottom: '6px' }}>
          OPERATION SUSPENDED
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#fff', marginBottom: '24px' }}>
          SIMULATION PAUSED
        </h2>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button onClick={resumeGame} style={{ padding: '14px' }}>
            <Play size={18} /> RESUME OPERATION
          </Button>

          <Button variant="secondary" onClick={restartMission} style={{ padding: '14px' }}>
            <RotateCcw size={16} /> RESTART MISSION
          </Button>
        </div>

        {/* Controls Reminder */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          lineHeight: '1.6',
          fontFamily: 'var(--font-mono)'
        }}>
          <div><strong>WASD:</strong> Move &nbsp;|&nbsp; <strong>SHIFT:</strong> Sprint</div>
          <div><strong>MOUSE:</strong> Rotate Camera &nbsp;|&nbsp; <strong>E:</strong> Interact</div>
        </div>
      </div>
    </div>
  );
}

