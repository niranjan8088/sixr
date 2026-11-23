/**
 * AFTERLIGHT — ScoreScreen.jsx
 *
 * Full-screen mission complete/debrief screen.
 * Shown when phase === 'complete'.
 * Calls store.restartMission() on restart.
 *
 * Interface for Rajesh: override CSS variables only.
 */

import { useGameStore } from '../systems/gameStore.js';
import { getMissionEvaluation } from '../systems/missionSystem.js';
import { formatTime } from '../systems/scoringSystem.js';

export default function ScoreScreen() {
  const phase   = useGameStore(s => s.phase);
  const score   = useGameStore(s => s.score);
  const survivors = useGameStore(s => s.survivors);
  const timer   = useGameStore(s => s.missionTimer);
  const restart = useGameStore(s => s.restartMission);

  if (phase !== 'complete') return null;

  const evaluation = getMissionEvaluation(score);
  const rescued    = survivors.filter(s => s.state === 'rescued').length;
  const stable     = survivors.filter(s => s.state === 'treated_stable').length;
  const lost       = survivors.filter(s => s.state === 'lost' || (!s.interacted && s.state === 'waiting')).length;

  const gradeColors = { S: '#fbbf24', A: '#22c55e', B: '#38bdf8', C: '#f59e0b', D: '#ef4444' };
  const gradeColor  = gradeColors[evaluation.grade] || '#94a3b8';

  return (
    <>
      <style>{SCORE_CSS}</style>
      <div className="al-score-backdrop" />
      <div className="al-score-panel">
        {/* Header */}
        <div className="al-score-header">
          <div className="al-score-mission">MISSION 01 — AFTER THE COLLAPSE</div>
          <div className="al-score-status">MISSION COMPLETE</div>
        </div>

        {/* Grade */}
        <div className="al-score-grade" style={{ color: gradeColor }}>
          <span className="al-score-grade-letter">{evaluation.grade}</span>
          <div>
            <div className="al-score-grade-label">{evaluation.label}</div>
            <div className="al-score-grade-summary">{evaluation.summary}</div>
          </div>
        </div>

        {/* Survivor outcomes */}
        <div className="al-score-survivors">
          <div className="al-score-surv-col al-score-surv-col--rescued">
            <span className="al-score-surv-num">{rescued}</span>
            <span>Rescued</span>
          </div>
          <div className="al-score-surv-col al-score-surv-col--stable">
            <span className="al-score-surv-num">{stable}</span>
            <span>Stabilized</span>
          </div>
          <div className="al-score-surv-col al-score-surv-col--lost">
            <span className="al-score-surv-num">{lost}</span>
            <span>Lost</span>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="al-score-breakdown">
          <div className="al-score-break-title">SCORE BREAKDOWN</div>
          {score?.breakdown?.map((line, i) => (
            <div key={i} className="al-score-break-line">{line}</div>
          ))}
          <div className="al-score-break-time">
            Completion Time: {formatTime(timer)}
          </div>
        </div>

        {/* Total */}
        <div className="al-score-total">
          <span>TOTAL SCORE</span>
          <span className="al-score-total-num" style={{ color: gradeColor }}>
            {score?.total ?? 0}
          </span>
        </div>

        {/* Survivor narratives */}
        <div className="al-score-narratives">
          <div className="al-score-break-title">AFTER-ACTION REPORT</div>
          {survivors.map(s => {
            const c = s.choices?.find(ch => ch.key === s.decisionKey);
            return (
              <div key={s.id} className="al-score-narrative">
                <strong>{s.name}</strong>
                <span className={`al-score-state al-score-state--${s.state}`}>
                  {s.state.replace('_', ' ')}
                </span>
                <p>{c?.narrativeResult ?? 'No interaction.'}</p>
              </div>
            );
          })}
        </div>

        {/* Restart */}
        <button className="al-score-restart" onClick={restart}>
          ↺ RESTART MISSION
        </button>
      </div>
    </>
  );
}

const SCORE_CSS = `
  .al-score-backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.85);
    z-index: 2000;
    backdrop-filter: blur(6px);
  }

  .al-score-panel {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2001;
    width: min(680px, 95vw);
    max-height: 92vh;
    overflow-y: auto;
    background: rgba(10,15,25,0.98);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 32px;
    color: #e2e8f0;
    font-family: 'Segoe UI', system-ui, sans-serif;
    box-shadow: 0 40px 80px rgba(0,0,0,0.8);
  }

  .al-score-header { text-align: center; margin-bottom: 24px; }
  .al-score-mission {
    font-size: 0.75rem; letter-spacing: 2px; color: #64748b; font-weight: 700;
  }
  .al-score-status {
    font-size: 1.5rem; font-weight: 800; letter-spacing: 3px;
    color: #22c55e; margin-top: 4px;
  }

  .al-score-grade {
    display: flex; align-items: center; gap: 20px;
    padding: 20px 24px;
    border-radius: 10px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 20px;
  }
  .al-score-grade-letter {
    font-size: 3.5rem; font-weight: 900; line-height: 1;
  }
  .al-score-grade-label   { font-size: 1.1rem; font-weight: 700; }
  .al-score-grade-summary { font-size: 0.85rem; color: #94a3b8; margin-top: 4px; }

  .al-score-survivors {
    display: flex; gap: 12px; margin-bottom: 20px;
  }
  .al-score-surv-col {
    flex: 1; text-align: center; padding: 14px;
    border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);
    font-size: 0.8rem; color: #94a3b8;
    display: flex; flex-direction: column; gap: 4px;
  }
  .al-score-surv-num { font-size: 2rem; font-weight: 800; }
  .al-score-surv-col--rescued  { background: rgba(34,197,94,0.07);  }
  .al-score-surv-col--rescued  .al-score-surv-num { color: #22c55e; }
  .al-score-surv-col--stable   { background: rgba(134,239,172,0.07); }
  .al-score-surv-col--stable   .al-score-surv-num { color: #86efac; }
  .al-score-surv-col--lost     { background: rgba(107,114,128,0.07); }
  .al-score-surv-col--lost     .al-score-surv-num { color: #6b7280; }

  .al-score-breakdown {
    padding: 16px;
    border-radius: 8px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 16px;
  }
  .al-score-break-title {
    font-size: 0.65rem; font-weight: 700; letter-spacing: 2px;
    color: #64748b; margin-bottom: 10px;
  }
  .al-score-break-line {
    font-size: 0.85rem; color: #94a3b8; padding: 3px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .al-score-break-line:last-of-type { border-bottom: none; }
  .al-score-break-time {
    font-size: 0.82rem; color: #64748b; margin-top: 8px; padding-top: 8px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .al-score-total {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 20px;
    border-radius: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 0.9rem; font-weight: 700; letter-spacing: 1px;
    margin-bottom: 20px;
  }
  .al-score-total-num { font-size: 1.8rem; font-weight: 900; }

  .al-score-narratives {
    padding: 16px;
    border-radius: 8px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 24px;
  }
  .al-score-narrative {
    display: grid; grid-template-columns: auto auto 1fr;
    align-items: start; gap: 8px; padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 0.85rem;
  }
  .al-score-narrative:last-child { border-bottom: none; }
  .al-score-narrative strong { color: #e2e8f0; }
  .al-score-narrative p {
    grid-column: 1 / -1; margin: 2px 0 0;
    color: #94a3b8; font-size: 0.82rem; line-height: 1.5;
  }

  .al-score-state {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
    padding: 2px 7px; border-radius: 4px; align-self: center;
  }
  .al-score-state--rescued        { background: rgba(34,197,94,0.15);   color: #22c55e; }
  .al-score-state--treated_stable { background: rgba(134,239,172,0.15); color: #86efac; }
  .al-score-state--lost           { background: rgba(107,114,128,0.15); color: #9ca3af; }
  .al-score-state--waiting        { background: rgba(107,114,128,0.15); color: #6b7280; }

  .al-score-restart {
    width: 100%;
    padding: 14px;
    border-radius: 8px;
    border: 1px solid rgba(56,189,248,0.4);
    background: rgba(56,189,248,0.1);
    color: #38bdf8;
    font-size: 0.9rem; font-weight: 700; letter-spacing: 2px;
    cursor: pointer; transition: all 0.2s;
  }
  .al-score-restart:hover {
    background: rgba(56,189,248,0.2);
    border-color: #38bdf8;
  }
`;
