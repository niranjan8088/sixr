import React from 'react';
import '../../styles/ui.css';
import Button from '../components/Button';
import SectionLabel from '../components/SectionLabel';
import {
  Play,
  RotateCcw,
  Sliders,
  Keyboard,
  Home,
  Shield,
  Clock,
  Users
} from 'lucide-react';

/**
 * AFTERLIGHT — Tactical Pause Overlay Screen
 */
export default function PauseScreen({
  onResume,
  onRestart,
  onSettings,
  onControls,
  onMainMenu,
  missionStats = { survivors: 0, totalSurvivors: 3, elapsedTime: 0 }
}) {
  return (
    <div className="al-pause-overlay" role="dialog" aria-modal="true" aria-labelledby="pause-title">
      <div className="al-panel al-pause-card al-animate-fade-in">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <SectionLabel color="orange">
            OPERATION SUSPENDED // RESPONDER EN ROUTE
          </SectionLabel>

          <h2 id="pause-title" className="al-pause-title">
            SIMULATION PAUSED
          </h2>
        </div>

        {/* Tactical Mission Snapshot */}
        <div className="al-pause-snapshot">
          <div className="al-pause-stat">
            <div className="al-hud-label">SURVIVORS SECURED</div>
            <div style={{
              fontFamily: 'var(--al-font-mono)',
              fontSize: '18px',
              fontWeight: 800,
              color: 'var(--al-color-blue)',
              marginTop: '4px'
            }}>
              {missionStats.survivors || 0} / {missionStats.totalSurvivors || 3}
            </div>
          </div>

          <div style={{ width: '1px', background: 'rgba(241, 241, 237, 0.1)' }} />

          <div className="al-pause-stat">
            <div className="al-hud-label">STATUS</div>
            <div style={{
              fontFamily: 'var(--al-font-mono)',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--al-color-orange)',
              marginTop: '6px'
            }}>
              STANDBY
            </div>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <Button
            variant="primary"
            onClick={onResume}
            icon={Play}
            style={{ width: '100%', padding: '14px 20px' }}
          >
            RESUME OPERATION
          </Button>

          <Button
            variant="secondary"
            onClick={onRestart}
            icon={RotateCcw}
            style={{ width: '100%', padding: '12px 20px' }}
          >
            RESTART MISSION
          </Button>

          {onSettings && (
            <Button
              variant="secondary"
              onClick={onSettings}
              icon={Sliders}
              style={{ width: '100%', padding: '12px 20px' }}
            >
              SETTINGS
            </Button>
          )}

          {onControls && (
            <Button
              variant="secondary"
              onClick={onControls}
              icon={Keyboard}
              style={{ width: '100%', padding: '12px 20px' }}
            >
              CONTROLS DIRECTIVE
            </Button>
          )}

          <Button
            variant="danger"
            onClick={onMainMenu}
            icon={Home}
            style={{ width: '100%', padding: '12px 20px' }}
          >
            RETURN TO MAIN MENU
          </Button>
        </div>

        {/* Footer Quick Controls Hint */}
        <div className="al-pause-footer-hint">
          <span>[ESC] TO TOGGLE PAUSE &nbsp;|&nbsp; [WASD] MOVE &nbsp;|&nbsp; [E] TRIAGE</span>
        </div>
      </div>
    </div>
  );
}
