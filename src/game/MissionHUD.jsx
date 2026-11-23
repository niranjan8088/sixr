/**
 * AFTERLIGHT — MissionHUD.jsx
 *
 * Heads-up display overlay (outside Canvas, pure HTML/CSS).
 * Shows: phase label, timer, survivor counter, objectives, resources.
 *
 * Interface for Rajesh:
 *   - This is the master HUD. Do NOT create a duplicate.
 *   - Override with CSS variables in :root (see PANEL_CSS in Interactions.jsx).
 *   - props: none — reads from useGameStore.
 */

import { useEffect, useRef } from 'react';
import { useGameStore } from '../systems/gameStore.js';
import {
  getSurvivorCountLabel,
  getPhaseLabel,
  getUrgencyColor,
} from '../systems/missionSystem.js';
import { formatTime } from '../systems/scoringSystem.js';

export default function MissionHUD() {
  const phase      = useGameStore(s => s.phase);
  const survivors  = useGameStore(s => s.survivors);
  const resources  = useGameStore(s => s.resources);
  const objectives = useGameStore(s => s.objectives);
  const timer      = useGameStore(s => s.missionTimer);
  const tickTimer  = useGameStore(s => s.tickTimer);

  const intervalRef = useRef(null);

  // ── Timer tick (1 s intervals) ─────────────────────────────────────────
  useEffect(() => {
    if (phase === 'playing' || phase === 'extraction') {
      intervalRef.current = setInterval(tickTimer, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [phase, tickTimer]);

  if (phase === 'menu' || phase === 'complete' || phase === 'failed') return null;

  const { assessed, rescued, total } = getSurvivorCountLabel(survivors);
  const phaseLabel = getPhaseLabel(phase);

  return (
    <>
      <style>{HUD_CSS}</style>

      {/* Top bar */}
      <div className="al-hud-topbar">
        <div className="al-hud-mission">MISSION 01 — AFTER THE COLLAPSE</div>
        <div className={`al-hud-phase al-hud-phase--${phase}`}>{phaseLabel}</div>
        <div className="al-hud-timer">⏱ {formatTime(timer)}</div>
      </div>

      {/* Left panel — objectives */}
      <div className="al-hud-left">
        <div className="al-hud-section-title">OBJECTIVES</div>
        {objectives.map(obj => (
          <div
            key={obj.id}
            className={`al-hud-objective ${obj.completed ? 'al-hud-objective--done' : ''}`}
          >
            <span className="al-hud-obj-icon">
              {obj.completed ? '✅' : obj.icon}
            </span>
            <span className="al-hud-obj-label">{obj.label}</span>
            {obj.target > 1 && (
              <span className="al-hud-obj-progress">
                {obj.progress}/{obj.target}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Right panel — resources + survivor count */}
      <div className="al-hud-right">
        <div className="al-hud-section-title">SURVIVORS</div>
        <div className="al-hud-survivor-count">
          <span>🔍 Assessed</span>
          <strong>{assessed}/{total}</strong>
        </div>
        <div className="al-hud-survivor-count">
          <span>🏥 Rescued</span>
          <strong style={{ color: '#22c55e' }}>{rescued}</strong>
        </div>

        <div className="al-hud-divider" />

        <div className="al-hud-section-title">SUPPLIES</div>
        <div className="al-hud-resource">
          <span>💊 Medical</span>
          <div className="al-hud-res-bar-wrap">
            <div
              className="al-hud-res-bar"
              style={{
                width: `${(resources.medical / 3) * 100}%`,
                background: resources.medical === 0 ? '#ef4444' : '#22c55e',
              }}
            />
          </div>
          <strong>{resources.medical}</strong>
        </div>
        <div className="al-hud-resource">
          <span>🔧 Tools</span>
          <div className="al-hud-res-bar-wrap">
            <div
              className="al-hud-res-bar"
              style={{
                width: `${(resources.tools / 2) * 100}%`,
                background: resources.tools === 0 ? '#ef4444' : '#38bdf8',
              }}
            />
          </div>
          <strong>{resources.tools}</strong>
        </div>
      </div>

      {/* Bottom hint */}
      {phase === 'extraction' && (
        <div className="al-hud-hint al-hud-hint--extraction">
          🚁 ALL SURVIVORS ASSESSED — HEAD TO EXTRACTION ZONE
        </div>
      )}

      {/* Survivor status strip */}
      <div className="al-hud-survivor-strip">
        {survivors.map(s => (
          <div
            key={s.id}
            className={`al-hud-surv-chip al-hud-surv-chip--${s.state}`}
            style={{ borderColor: getUrgencyColor(s.urgency) }}
          >
            <span>{s.name.split(' ')[0]}</span>
            <span className="al-hud-surv-state">
              {s.interacted ? s.state.replace('_', ' ') : '?'}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

const HUD_CSS = `
  .al-hud-topbar {
    position: fixed; top: 0; left: 0; right: 0;
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 20px;
    background: rgba(0,0,0,0.65);
    backdrop-filter: blur(4px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    z-index: 100;
    font-family: 'Segoe UI', system-ui, sans-serif;
    color: #e2e8f0;
  }

  .al-hud-mission {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: #94a3b8;
  }

  .al-hud-phase {
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    padding: 3px 12px;
    border-radius: 4px;
  }
  .al-hud-phase--playing    { background: rgba(34,197,94,0.15);  color: #22c55e; }
  .al-hud-phase--extraction { background: rgba(56,189,248,0.15); color: #38bdf8; animation: al-pulse 1s infinite; }

  @keyframes al-pulse {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.6; }
  }

  .al-hud-timer {
    font-size: 1rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: #e2e8f0;
  }

  /* ── Left panel ── */
  .al-hud-left {
    position: fixed; top: 60px; left: 16px;
    width: 220px;
    background: rgba(0,0,0,0.6);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 12px 14px;
    z-index: 100;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }

  /* ── Right panel ── */
  .al-hud-right {
    position: fixed; top: 60px; right: 16px;
    width: 200px;
    background: rgba(0,0,0,0.6);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 12px 14px;
    z-index: 100;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }

  .al-hud-section-title {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: #64748b;
    margin-bottom: 8px;
  }

  .al-hud-objective {
    display: flex; align-items: center; gap: 8px;
    padding: 5px 0;
    font-size: 0.8rem;
    color: #94a3b8;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .al-hud-objective:last-child { border-bottom: none; }
  .al-hud-objective--done { color: #22c55e; }

  .al-hud-obj-icon  { font-size: 0.9rem; flex-shrink: 0; }
  .al-hud-obj-label { flex: 1; font-size: 0.78rem; line-height: 1.3; }
  .al-hud-obj-progress {
    font-size: 0.75rem; color: #38bdf8;
    background: rgba(56,189,248,0.1);
    padding: 1px 5px; border-radius: 3px;
  }

  .al-hud-survivor-count {
    display: flex; justify-content: space-between; align-items: center;
    padding: 4px 0;
    font-size: 0.82rem;
    color: #94a3b8;
  }
  .al-hud-survivor-count strong { color: #e2e8f0; }

  .al-hud-divider {
    border: none; border-top: 1px solid rgba(255,255,255,0.08);
    margin: 10px 0;
  }

  .al-hud-resource {
    display: flex; align-items: center; gap: 8px;
    padding: 4px 0;
    font-size: 0.8rem;
    color: #94a3b8;
  }
  .al-hud-resource span { width: 70px; }
  .al-hud-res-bar-wrap {
    flex: 1; height: 6px;
    background: rgba(255,255,255,0.1);
    border-radius: 3px; overflow: hidden;
  }
  .al-hud-res-bar { height: 100%; border-radius: 3px; transition: width 0.3s; }
  .al-hud-resource strong { width: 16px; text-align: right; color: #e2e8f0; }

  /* ── Bottom hint ── */
  .al-hud-hint {
    position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%);
    padding: 10px 24px;
    border-radius: 6px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 1px;
    z-index: 100;
    animation: al-pulse 1.2s infinite;
  }
  .al-hud-hint--extraction {
    background: rgba(56,189,248,0.15);
    border: 1px solid rgba(56,189,248,0.4);
    color: #38bdf8;
  }

  /* ── Survivor strip ── */
  .al-hud-survivor-strip {
    position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 10px;
    z-index: 100;
  }

  .al-hud-surv-chip {
    padding: 6px 12px;
    border: 2px solid;
    border-radius: 6px;
    background: rgba(0,0,0,0.65);
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 0.78rem;
    color: #e2e8f0;
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    min-width: 72px; text-align: center;
  }
  .al-hud-surv-state {
    font-size: 0.65rem; letter-spacing: 0.5px; text-transform: uppercase;
    color: #94a3b8;
  }
  .al-hud-surv-chip--rescued        .al-hud-surv-state { color: #22c55e; }
  .al-hud-surv-chip--treated_stable .al-hud-surv-state { color: #86efac; }
  .al-hud-surv-chip--lost           .al-hud-surv-state { color: #6b7280; }
`;
