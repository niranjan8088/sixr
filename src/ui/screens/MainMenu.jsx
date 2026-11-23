import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import '../../styles/ui.css';
import {
  Play,
  FileText,
  Keyboard,
  Sliders,
  Award,
  X,
  ChevronRight,
  Radio,
  Terminal,
  ShieldAlert,
  Users
} from 'lucide-react';

/**
 * AFTERLIGHT — Cinematic Main Menu (Step 2)
 * Premium survival / disaster rescue game aesthetic.
 * Left-aligned menu with atmospheric disaster backdrop and live overlays.
 */
export default function MainMenu({ onStart, onBriefing, onSettings, onCredits }) {
  const storeStartMission = useGameStore((state) => state.startMission);
  const storeStartBriefing = useGameStore((state) => state.startBriefing);

  // Active overlay state: null | 'controls' | 'settings' | 'credits'
  const [activeOverlay, setActiveOverlay] = useState(null);

  // Close overlays on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeOverlay) {
        e.preventDefault();
        setActiveOverlay(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeOverlay]);

  const handleStart = () => {
    if (typeof onStart === 'function') {
      onStart();
    } else {
      storeStartMission();
    }
  };

  const handleBriefing = () => {
    if (typeof onBriefing === 'function') {
      onBriefing();
    } else {
      storeStartBriefing();
    }
  };

  const handleSettings = () => {
    if (typeof onSettings === 'function') {
      onSettings();
    } else {
      setActiveOverlay('settings');
    }
  };

  const handleCredits = () => {
    if (typeof onCredits === 'function') {
      onCredits();
    }
    setActiveOverlay('credits');
  };

  return (
    <div className="al-menu-container">
      {/* 1. Cinematic Background Layer with slow drift */}
      <div className="al-menu-bg" />

      {/* 2. Gradient Vignette & Atmospheric Lighting */}
      <div className="al-menu-overlay" />
      <div className="al-menu-ambience" />

      {/* 3. Top Status Header */}
      <header className="al-menu-topbar">
        <div className="al-menu-top-left">
          <Radio size={14} className="al-text-orange" />
          <span>SECTOR 4-B // CASUALTY CORRIDOR</span>
        </div>

        <div className="al-menu-top-right">
          <div className="al-menu-indicator-dot" />
          <span>LIVE RESPONSE NETWORK</span>
        </div>
      </header>

      {/* 4. Left-Aligned Brand & Navigation Menu */}
      <main className="al-menu-content">
        {/* Brand Area */}
        <div className="al-menu-brand">
          <span className="al-menu-label">
            DISASTER RESPONSE // FIELD OPERATIONS
          </span>

          <h1 className="al-menu-title">
            AFTER<span className="al-menu-title-accent">LIGHT</span>
          </h1>

          <div className="al-menu-subtitle">
            WHEN EVERYTHING FALLS,
            <br />
            YOU RISE.
          </div>
        </div>

        {/* Action Button Navigation Stack */}
        <nav className="al-menu-nav" aria-label="Main Menu">
          {/* 1. START MISSION */}
          <button
            type="button"
            className="al-menu-item-btn al-menu-item-primary"
            onClick={handleStart}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <Play size={15} /> START MISSION
            </span>
            <ChevronRight size={14} className="al-menu-btn-icon" />
          </button>

          {/* 2. MISSION BRIEFING */}
          <button
            type="button"
            className="al-menu-item-btn"
            onClick={handleBriefing}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={15} /> MISSION BRIEFING
            </span>
            <ChevronRight size={14} className="al-menu-btn-icon" />
          </button>

          {/* 3. CONTROLS */}
          <button
            type="button"
            className="al-menu-item-btn"
            onClick={() => setActiveOverlay('controls')}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <Keyboard size={15} /> CONTROLS
            </span>
            <ChevronRight size={14} className="al-menu-btn-icon" />
          </button>

          {/* 4. SETTINGS */}
          <button
            type="button"
            className="al-menu-item-btn"
            onClick={handleSettings}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <Sliders size={15} /> SETTINGS
            </span>
            <ChevronRight size={14} className="al-menu-btn-icon" />
          </button>

          {/* 5. CREDITS */}
          <button
            type="button"
            className="al-menu-item-btn"
            onClick={handleCredits}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <Award size={15} /> CREDITS
            </span>
            <ChevronRight size={14} className="al-menu-btn-icon" />
          </button>
        </nav>
      </main>

      {/* 5. Small Footer Details */}
      <footer className="al-menu-footer">
        <div className="al-menu-footer-item">
          OPERATION <strong>001</strong>
        </div>
        <div className="al-menu-footer-item">
          URBAN DISASTER ZONE
        </div>
        <div className="al-menu-footer-item al-menu-status-ready">
          SYSTEM STATUS: READY
        </div>
      </footer>

      {/* 6. OVERLAYS (Controls, Settings, Credits) */}

      {/* CONTROLS OVERLAY */}
      {activeOverlay === 'controls' && (
        <div
          className="al-menu-modal-backdrop"
          onClick={() => setActiveOverlay(null)}
        >
          <div
            className="al-menu-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="controls-title"
          >
            <div className="al-menu-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={18} className="al-text-orange" />
                <h2 id="controls-title" className="al-menu-modal-title">
                  FIELD CONTROLS & DIRECTIVES
                </h2>
              </div>
              <button
                type="button"
                className="al-menu-modal-close"
                onClick={() => setActiveOverlay(null)}
                aria-label="Close Controls Overlay"
              >
                <X size={20} />
              </button>
            </div>

            <div className="al-menu-modal-body">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                fontFamily: 'var(--al-font-mono)',
                marginBottom: '16px'
              }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '3px', border: '1px solid var(--al-border-subtle)' }}>
                  <div className="al-text-orange" style={{ fontWeight: 700, fontSize: '13px' }}>[W / A / S / D]</div>
                  <div style={{ fontSize: '11px', marginTop: '4px', color: 'var(--al-color-text)' }}>Move Responder Traversal</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '3px', border: '1px solid var(--al-border-subtle)' }}>
                  <div className="al-text-orange" style={{ fontWeight: 700, fontSize: '13px' }}>[LEFT SHIFT]</div>
                  <div style={{ fontSize: '11px', marginTop: '4px', color: 'var(--al-color-text)' }}>Exo-Sprint (Consumes Stamina)</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '3px', border: '1px solid var(--al-border-subtle)' }}>
                  <div className="al-text-orange" style={{ fontWeight: 700, fontSize: '13px' }}>[MOUSE LOOK]</div>
                  <div style={{ fontSize: '11px', marginTop: '4px', color: 'var(--al-color-text)' }}>Orbit Camera Orientation</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '3px', border: '1px solid var(--al-border-subtle)' }}>
                  <div className="al-text-orange" style={{ fontWeight: 700, fontSize: '13px' }}>[E] KEY</div>
                  <div style={{ fontSize: '11px', marginTop: '4px', color: 'var(--al-color-text)' }}>Triage, Stabilize & Evacuate</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '3px', border: '1px solid var(--al-border-subtle)' }}>
                  <div className="al-text-orange" style={{ fontWeight: 700, fontSize: '13px' }}>[ESC] KEY</div>
                  <div style={{ fontSize: '11px', marginTop: '4px', color: 'var(--al-color-text)' }}>Suspend Operation / Pause</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '3px', border: '1px solid var(--al-border-subtle)' }}>
                  <div className="al-text-orange" style={{ fontWeight: 700, fontSize: '13px' }}>[RADAR / COMPASS]</div>
                  <div style={{ fontSize: '11px', marginTop: '4px', color: 'var(--al-color-text)' }}>Survivor Beacons & Helipad LZ</div>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--al-color-text-dim)', textAlign: 'right' }}>
                Press [ESC] or click outside to dismiss
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS OVERLAY */}
      {activeOverlay === 'settings' && (
        <div
          className="al-menu-modal-backdrop"
          onClick={() => setActiveOverlay(null)}
        >
          <div
            className="al-menu-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
          >
            <div className="al-menu-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} className="al-text-orange" />
                <h2 id="settings-title" className="al-menu-modal-title">
                  TACTICAL CONFIGURATION
                </h2>
              </div>
              <button
                type="button"
                className="al-menu-modal-close"
                onClick={() => setActiveOverlay(null)}
                aria-label="Close Settings Overlay"
              >
                <X size={20} />
              </button>
            </div>

            <div className="al-menu-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                    <span style={{ color: 'var(--al-color-text)', fontWeight: 600 }}>Master Audio Volume</span>
                    <span style={{ fontFamily: 'var(--al-font-mono)', color: 'var(--al-color-orange)' }}>85%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="85"
                    style={{ width: '100%', accentColor: 'var(--al-color-orange)', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                    <span style={{ color: 'var(--al-color-text)', fontWeight: 600 }}>SFX & Tactical Audio</span>
                    <span style={{ fontFamily: 'var(--al-font-mono)', color: 'var(--al-color-orange)' }}>90%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="90"
                    style={{ width: '100%', accentColor: 'var(--al-color-orange)', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                    <span style={{ color: 'var(--al-color-text)', fontWeight: 600 }}>Atmosphere & Music</span>
                    <span style={{ fontFamily: 'var(--al-font-mono)', color: 'var(--al-color-orange)' }}>70%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="70"
                    style={{ width: '100%', accentColor: 'var(--al-color-orange)', cursor: 'pointer' }}
                  />
                </div>

                <div style={{
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--al-border-subtle)',
                  borderRadius: '3px',
                  fontSize: '11px',
                  lineHeight: '1.5'
                }}>
                  <div style={{ color: 'var(--al-color-blue)', fontWeight: 600, marginBottom: '2px' }}>
                    GRAPHICS PRESET: ULTRA
                  </div>
                  <div>Resolution: Native | Post-Processing: Cinematic | Anti-Aliasing: FXAA</div>
                </div>
              </div>

              <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--al-color-text-dim)', textAlign: 'right' }}>
                Press [ESC] or click outside to dismiss
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREDITS OVERLAY */}
      {activeOverlay === 'credits' && (
        <div
          className="al-menu-modal-backdrop"
          onClick={() => setActiveOverlay(null)}
        >
          <div
            className="al-menu-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="credits-title"
          >
            <div className="al-menu-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} className="al-text-orange" />
                <h2 id="credits-title" className="al-menu-modal-title">
                  AFTERLIGHT DEVELOPMENT SQUAD
                </h2>
              </div>
              <button
                type="button"
                className="al-menu-modal-close"
                onClick={() => setActiveOverlay(null)}
                aria-label="Close Credits Overlay"
              >
                <X size={20} />
              </button>
            </div>

            <div className="al-menu-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '3px', border: '1px solid var(--al-border-subtle)' }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontFamily: 'var(--al-font-brand)' }}>RAJESH</div>
                  <div className="al-text-orange" style={{ fontSize: '11px', fontFamily: 'var(--al-font-mono)' }}>Lead UI/UX Designer & Frontend Developer</div>
                  <div style={{ fontSize: '11px', color: 'var(--al-color-text-dim)', marginTop: '2px' }}>Cinematic HUD, Menu Systems, Rescue Decision UI & Motion Design</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '3px', border: '1px solid var(--al-border-subtle)' }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontFamily: 'var(--al-font-brand)' }}>NIRANJAN</div>
                  <div className="al-text-blue" style={{ fontSize: '11px', fontFamily: 'var(--al-font-mono)' }}>Core Game Engine & Architecture</div>
                  <div style={{ fontSize: '11px', color: 'var(--al-color-text-dim)', marginTop: '2px' }}>3D Scene Pipeline, Player Physics & Input Coordination</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '3px', border: '1px solid var(--al-border-subtle)' }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontFamily: 'var(--al-font-brand)' }}>LUKKY</div>
                  <div style={{ color: '#00ffaa', fontSize: '11px', fontFamily: 'var(--al-font-mono)' }}>Gameplay & Rescue Systems</div>
                  <div style={{ fontSize: '11px', color: 'var(--al-color-text-dim)', marginTop: '2px' }}>Survivor Stabilization Logic, Scoring & Inventory System</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '3px', border: '1px solid var(--al-border-subtle)' }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontFamily: 'var(--al-font-brand)' }}>SIDDAPPA</div>
                  <div style={{ color: '#ffbb00', fontSize: '11px', fontFamily: 'var(--al-font-mono)' }}>3D Environment & Atmospheric Lighting</div>
                  <div style={{ fontSize: '11px', color: 'var(--al-color-text-dim)', marginTop: '2px' }}>Sector 4-B Ruins, Dust Particulates & Helipad Zone</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '3px', border: '1px solid var(--al-border-subtle)' }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontFamily: 'var(--al-font-brand)' }}>VENKI</div>
                  <div style={{ color: '#c084fc', fontSize: '11px', fontFamily: 'var(--al-font-mono)' }}>Backend Systems & Integration</div>
                  <div style={{ fontSize: '11px', color: 'var(--al-color-text-dim)', marginTop: '2px' }}>Telemetry Persistence & Mission Data Services</div>
                </div>
              </div>

              <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--al-color-text-dim)', textAlign: 'right' }}>
                Press [ESC] or click outside to dismiss
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
