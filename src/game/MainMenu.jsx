/**
 * AFTERLIGHT — MainMenu.jsx
 * Start screen shown when phase === 'menu'.
 */

import { useGameStore } from '../systems/gameStore.js';

export default function MainMenu() {
  const phase        = useGameStore(s => s.phase);
  const startMission = useGameStore(s => s.startMission);

  if (phase !== 'menu') return null;

  return (
    <>
      <style>{MENU_CSS}</style>
      <div className="al-menu-backdrop">
        <div className="al-menu-panel">
          <div className="al-menu-pretitle">AFTERLIGHT</div>
          <h1 className="al-menu-title">MISSION 01</h1>
          <div className="al-menu-subtitle">AFTER THE COLLAPSE</div>

          <div className="al-menu-brief">
            <p>
              A structural collapse has trapped survivors in the disaster zone.
              You are deployed as the sole rescue operator.
            </p>
            <p>
              Locate 3 survivors. Assess their conditions. Make critical rescue
              decisions under time pressure with limited supplies.
            </p>
          </div>

          <div className="al-menu-objectives">
            <div className="al-menu-obj">🔍 Find and assess 3 survivors</div>
            <div className="al-menu-obj">🏥 Rescue as many as possible</div>
            <div className="al-menu-obj">🚁 Reach the extraction zone</div>
          </div>

          <div className="al-menu-controls">
            <div className="al-menu-ctrl-title">CONTROLS</div>
            <div className="al-menu-ctrl-row"><kbd>WASD</kbd> Move</div>
            <div className="al-menu-ctrl-row"><kbd>Mouse</kbd> Look</div>
            <div className="al-menu-ctrl-row"><kbd>E</kbd> Interact with survivor</div>
            <div className="al-menu-ctrl-row"><kbd>1–4</kbd> Select decision</div>
            <div className="al-menu-ctrl-row"><kbd>ESC</kbd> Cancel panel</div>
          </div>

          <button className="al-menu-start" onClick={startMission}>
            ▶ BEGIN MISSION
          </button>
        </div>
      </div>
    </>
  );
}

const MENU_CSS = `
  .al-menu-backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.9);
    display: flex; align-items: center; justify-content: center;
    z-index: 3000;
    backdrop-filter: blur(4px);
    font-family: 'Segoe UI', system-ui, sans-serif;
  }

  .al-menu-panel {
    width: min(560px, 94vw);
    background: rgba(10,15,25,0.98);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 36px 40px;
    color: #e2e8f0;
    box-shadow: 0 40px 80px rgba(0,0,0,0.8);
  }

  .al-menu-pretitle {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 4px;
    color: #38bdf8; margin-bottom: 6px;
  }
  .al-menu-title {
    font-size: 2.5rem; font-weight: 900; margin: 0;
    letter-spacing: 3px;
  }
  .al-menu-subtitle {
    font-size: 0.95rem; letter-spacing: 2px; color: #94a3b8;
    margin-top: 4px; margin-bottom: 24px;
  }

  .al-menu-brief {
    color: #94a3b8; font-size: 0.88rem; line-height: 1.6;
    margin-bottom: 20px;
  }
  .al-menu-brief p { margin: 0 0 10px; }

  .al-menu-objectives {
    display: flex; flex-direction: column; gap: 8px;
    margin-bottom: 24px;
    padding: 14px 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 8px;
    font-size: 0.85rem; color: #e2e8f0;
  }
  .al-menu-obj { display: flex; gap: 10px; align-items: center; }

  .al-menu-controls {
    margin-bottom: 28px;
    padding: 14px 16px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
  }
  .al-menu-ctrl-title {
    font-size: 0.65rem; font-weight: 700; letter-spacing: 2px;
    color: #64748b; margin-bottom: 10px;
  }
  .al-menu-ctrl-row {
    display: flex; align-items: center; gap: 10px;
    font-size: 0.82rem; color: #94a3b8; padding: 3px 0;
  }
  .al-menu-ctrl-row kbd {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 4px; padding: 2px 7px;
    font-size: 0.75rem; color: #e2e8f0;
  }

  .al-menu-start {
    width: 100%; padding: 15px;
    border-radius: 8px;
    border: 1px solid rgba(34,197,94,0.5);
    background: rgba(34,197,94,0.12);
    color: #22c55e;
    font-size: 1rem; font-weight: 800; letter-spacing: 3px;
    cursor: pointer; transition: all 0.2s;
  }
  .al-menu-start:hover {
    background: rgba(34,197,94,0.22);
    border-color: #22c55e;
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(34,197,94,0.15);
  }
`;
