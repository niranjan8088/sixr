/**
 * AFTERLIGHT — Interactions.jsx
 *
 * Renders the Decision Panel UI overlay (outside Canvas).
 * Reads from store: activeSurvivor, decisionPanel, survivors, resources.
 * Calls store: applyDecision, closeSurvivorPanel.
 *
 * Interface contract with Rajesh (UI dev):
 *   - This component exports <DecisionPanel />, a full-screen overlay.
 *   - Props: none — all state from useGameStore.
 *   - Styling is scoped to this component (className prefix: "al-dp-").
 *   - Rajesh should NOT re-implement this panel; override CSS variables only.
 *
 * Keyboard shortcuts:
 *   E or Escape — close panel (cancel / return to world)
 *   1–4         — quick-select choice by index
 */

import { useEffect, useCallback } from 'react';
import { useGameStore } from '../systems/gameStore.js';
import {
  getUrgencyColor,
  getConditionIcon,
} from '../systems/missionSystem.js';

// ─────────────────────────────────────────────────────────────────────────────
// Resource display
// ─────────────────────────────────────────────────────────────────────────────
function ResourceBar({ resources }) {
  return (
    <div className="al-dp-resources">
      <span className="al-dp-res-item">
        💊 Medical Kits: <strong>{resources.medical}</strong>
      </span>
      <span className="al-dp-res-item">
        🔧 Tool Kits: <strong>{resources.tools}</strong>
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Single choice button
// ─────────────────────────────────────────────────────────────────────────────
function ChoiceButton({ choice, index, resources, onSelect }) {
  const canAfford =
    (choice.costMedical || 0) <= resources.medical &&
    (choice.costTools   || 0) <= resources.tools;

  const costs = [];
  if (choice.costMedical) costs.push(`💊 ×${Math.min(choice.costMedical, resources.medical)}`);
  if (choice.costTools)   costs.push(`🔧 ×${Math.min(choice.costTools,   resources.tools)}`);

  return (
    <button
      className={`al-dp-choice ${canAfford ? 'al-dp-choice--available' : 'al-dp-choice--costly'}`}
      onClick={() => onSelect(choice.key)}
      title={!canAfford ? 'Insufficient resources — will use all available' : ''}
    >
      <div className="al-dp-choice-header">
        <span className="al-dp-choice-index">[{index + 1}]</span>
        <span className="al-dp-choice-label">{choice.label}</span>
        {costs.length > 0 && (
          <span className={`al-dp-choice-cost ${canAfford ? '' : 'al-dp-choice-cost--warn'}`}>
            {costs.join(' ')}
          </span>
        )}
        {costs.length === 0 && (
          <span className="al-dp-choice-cost al-dp-choice-cost--free">FREE</span>
        )}
      </div>
      <p className="al-dp-choice-desc">{choice.description}</p>
      {!canAfford && (
        <p className="al-dp-choice-warn">⚠ Low on resources — this will deplete reserves</p>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Decision Panel
// ─────────────────────────────────────────────────────────────────────────────
export default function Interactions() {
  const decisionPanel  = useGameStore(s => s.decisionPanel);
  const activeSurvivorId = useGameStore(s => s.activeSurvivor);
  const survivors      = useGameStore(s => s.survivors);
  const resources      = useGameStore(s => s.resources);
  const applyDecision  = useGameStore(s => s.applyDecision);
  const closePanel     = useGameStore(s => s.closeSurvivorPanel);

  const survivor = survivors.find(s => s.id === activeSurvivorId);

  // Keyboard shortcuts
  const handleKey = useCallback((e) => {
    if (!decisionPanel || !survivor) return;
    if (e.code === 'Escape' || e.code === 'KeyE') {
      closePanel();
      return;
    }
    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= survivor.choices.length) {
      applyDecision(survivor.id, survivor.choices[num - 1].key);
    }
  }, [decisionPanel, survivor, closePanel, applyDecision]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  if (!decisionPanel || !survivor) return null;

  const urgencyColor = getUrgencyColor(survivor.urgency);
  const icon         = getConditionIcon(survivor.condition);

  return (
    <>
      {/* Inline styles — Rajesh can override via CSS variables */}
      <style>{PANEL_CSS}</style>

      {/* Backdrop */}
      <div className="al-dp-backdrop" onClick={closePanel} />

      {/* Panel */}
      <div className="al-dp-panel">
        {/* Header */}
        <div className="al-dp-header" style={{ borderColor: urgencyColor }}>
          <div className="al-dp-title">
            <span className="al-dp-icon">{icon}</span>
            <div>
              <h2 className="al-dp-name">{survivor.name}</h2>
              <span
                className="al-dp-badge"
                style={{ background: urgencyColor }}
              >
                {survivor.label} · {survivor.urgency.toUpperCase()}
              </span>
            </div>
          </div>
          <button className="al-dp-close" onClick={closePanel}>✕ ESC</button>
        </div>

        {/* Situation */}
        <div className="al-dp-situation">
          <p>{survivor.description}</p>
        </div>

        {/* Resources */}
        <ResourceBar resources={resources} />

        {/* Choices */}
        <div className="al-dp-choices-label">MAKE YOUR DECISION:</div>
        <div className="al-dp-choices">
          {survivor.choices.map((choice, i) => (
            <ChoiceButton
              key={choice.key}
              choice={choice}
              index={i}
              resources={resources}
              onSelect={(key) => applyDecision(survivor.id, key)}
            />
          ))}
        </div>

        {/* Footer hint */}
        <div className="al-dp-footer">
          Press <kbd>1</kbd>–<kbd>{survivor.choices.length}</kbd> to choose · <kbd>ESC</kbd> to cancel
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scoped CSS (injected once)
// ─────────────────────────────────────────────────────────────────────────────
const PANEL_CSS = `
  :root {
    --al-panel-bg:        rgba(10, 15, 25, 0.97);
    --al-panel-border:    rgba(255,255,255,0.12);
    --al-panel-text:      #e2e8f0;
    --al-panel-subtext:   #94a3b8;
    --al-accent:          #38bdf8;
    --al-warn:            #f59e0b;
    --al-danger:          #ef4444;
    --al-success:         #22c55e;
    --al-radius:          12px;
  }

  .al-dp-backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 999;
    backdrop-filter: blur(2px);
  }

  .al-dp-panel {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: min(600px, 92vw);
    max-height: 90vh;
    overflow-y: auto;
    background: var(--al-panel-bg);
    border: 1px solid var(--al-panel-border);
    border-radius: var(--al-radius);
    color: var(--al-panel-text);
    font-family: 'Segoe UI', system-ui, sans-serif;
    box-shadow: 0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05);
  }

  .al-dp-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 20px 24px 16px;
    border-bottom: 2px solid;
    gap: 12px;
  }

  .al-dp-title { display: flex; align-items: center; gap: 14px; }
  .al-dp-icon  { font-size: 2rem; }

  .al-dp-name {
    margin: 0 0 4px;
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .al-dp-badge {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 1px;
    padding: 2px 8px;
    border-radius: 4px;
    color: #fff;
  }

  .al-dp-close {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.15);
    color: var(--al-panel-subtext);
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    white-space: nowrap;
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .al-dp-close:hover { background: rgba(255,255,255,0.08); color: #fff; }

  .al-dp-situation {
    padding: 16px 24px;
    font-size: 0.95rem;
    color: var(--al-panel-subtext);
    line-height: 1.6;
    border-bottom: 1px solid var(--al-panel-border);
  }
  .al-dp-situation p { margin: 0; }

  .al-dp-resources {
    display: flex; gap: 20px;
    padding: 12px 24px;
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid var(--al-panel-border);
    font-size: 0.88rem;
  }
  .al-dp-res-item { color: var(--al-panel-subtext); }
  .al-dp-res-item strong { color: var(--al-accent); }

  .al-dp-choices-label {
    padding: 14px 24px 8px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--al-panel-subtext);
  }

  .al-dp-choices {
    display: flex; flex-direction: column; gap: 8px;
    padding: 0 16px;
  }

  .al-dp-choice {
    text-align: left;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--al-panel-border);
    border-radius: 8px;
    padding: 12px 16px;
    color: var(--al-panel-text);
    cursor: pointer;
    transition: all 0.15s;
    width: 100%;
  }
  .al-dp-choice:hover            { background: rgba(255,255,255,0.09); border-color: var(--al-accent); }
  .al-dp-choice--costly          { border-color: rgba(245,158,11,0.3); }
  .al-dp-choice--costly:hover    { border-color: var(--al-warn); }

  .al-dp-choice-header {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 6px;
  }

  .al-dp-choice-index {
    font-family: monospace;
    font-size: 0.8rem;
    color: var(--al-accent);
    background: rgba(56,189,248,0.1);
    padding: 1px 6px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .al-dp-choice-label { font-weight: 600; font-size: 0.95rem; flex: 1; }

  .al-dp-choice-cost {
    font-size: 0.8rem;
    background: rgba(255,255,255,0.07);
    padding: 2px 8px;
    border-radius: 4px;
  }
  .al-dp-choice-cost--warn  { background: rgba(245,158,11,0.15); color: var(--al-warn); }
  .al-dp-choice-cost--free  { background: rgba(34,197,94,0.1);   color: var(--al-success); }

  .al-dp-choice-desc {
    margin: 0;
    font-size: 0.85rem;
    color: var(--al-panel-subtext);
    line-height: 1.5;
  }

  .al-dp-choice-warn {
    margin: 6px 0 0;
    font-size: 0.8rem;
    color: var(--al-warn);
  }

  .al-dp-footer {
    padding: 14px 24px;
    font-size: 0.8rem;
    color: var(--al-panel-subtext);
    text-align: center;
    border-top: 1px solid var(--al-panel-border);
    margin-top: 8px;
  }
  .al-dp-footer kbd {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 3px;
    padding: 1px 5px;
    font-size: 0.75rem;
  }
`;
