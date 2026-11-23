import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import Button from '../common/Button';
import { Play, HelpCircle, Shield, Radio, Terminal } from 'lucide-react';

export default function MainMenu() {
  const startBriefing = useGameStore((state) => state.startBriefing);
  const [showControls, setShowControls] = useState(false);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 60% 40%, rgba(20, 26, 36, 0.7) 0%, rgba(8, 10, 15, 0.94) 80%)',
      padding: '24px'
    }}>
      <div className="sci-panel interactive" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '36px 40px',
        border: '1px solid rgba(255, 120, 30, 0.45)',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 102, 0, 0.2)'
      }}>
        {/* Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', marginBottom: '12px' }}>
          <Radio size={18} className="animate-pulse" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '2px', fontWeight: 600 }}>
            DISASTER RESPONSE COMMAND // SECTOR 4-B
          </span>
        </div>

        {/* Game Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '48px',
          fontWeight: 700,
          letterSpacing: '4px',
          color: '#fff',
          textShadow: '0 0 24px rgba(255, 110, 0, 0.5)',
          marginBottom: '6px'
        }}>
          AFTERLIGHT
        </h1>

        <div style={{
          color: 'var(--text-muted)',
          fontSize: '15px',
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          A catastrophic seismic event has leveled Sector 4-B. As Lead Rescue Responder, navigate the toxic ruins, stabilize critical survivors, and escort them to safety.
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Button onClick={startBriefing} style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
            <Play size={18} />
            COMMENCE OPERATION
          </Button>

          <Button
            variant="secondary"
            onClick={() => setShowControls(!showControls)}
            style={{ width: '100%' }}
          >
            <HelpCircle size={16} />
            {showControls ? 'HIDE MISSION PROTOCOLS' : 'TACTICAL CONTROLS & PROTOCOLS'}
          </Button>
        </div>

        {/* Controls Modal / Drawer */}
        {showControls && (
          <div style={{
            marginTop: '24px',
            padding: '18px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            fontSize: '13px',
            fontFamily: 'var(--font-mono)'
          }}>
            <div style={{ color: 'var(--accent-amber)', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={14} /> FIELD OPERATIVE CONTROLS:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', color: '#c5d0dc' }}>
              <div><strong style={{ color: '#fff' }}>[W / A / S / D]</strong> Move</div>
              <div><strong style={{ color: '#fff' }}>[SHIFT]</strong> Sprint (Stamina)</div>
              <div><strong style={{ color: '#fff' }}>[MOUSE]</strong> Orbit Camera Look</div>
              <div><strong style={{ color: '#fff' }}>[E]</strong> Stabilize / Triage</div>
              <div><strong style={{ color: '#fff' }}>[ESC]</strong> Pause Operation</div>
              <div><strong style={{ color: '#fff' }}>[RADAR]</strong> Shows Survivors & Evac</div>
            </div>
          </div>
        )}

        {/* Footer Meta */}
        <div style={{
          marginTop: '28px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)'
        }}>
          <span>SYS.VER: 1.0.0-PROD</span>
          <span>DEV: TEAM AFTERLIGHT</span>
        </div>
      </div>
    </div>
  );
}

