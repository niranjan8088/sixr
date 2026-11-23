import React from 'react';
import '../../styles/ui.css';
import { useGameStore } from '../../store/gameStore';
import Button from '../components/Button';
import StatItem from '../components/StatItem';
import AnimatedCounter from '../components/AnimatedCounter';
import {
  Award,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Package,
  Shield
} from 'lucide-react';

/**
 * AFTERLIGHT — Cinematic Mission Debrief & Results Screen
 * Operates with props or falls back automatically to useGameStore.
 */
export default function ResultsScreen({
  scoreData = null,
  onReplay = null,
  onMainMenu = null
}) {
  const storeScore = useGameStore((state) => state.score);
  const storeMission = useGameStore((state) => state.mission);
  const storeRestart = useGameStore((state) => state.restartMission);
  const storeSetPhase = useGameStore((state) => state.setPhase);

  // Resolution: props take precedence, fallback to store, fallback to defaults
  const data = scoreData || {
    success: storeScore?.success !== undefined ? storeScore.success : true,
    totalPoints: storeScore?.totalPoints || 1200,
    rank: storeScore?.rank || 'S',
    survivorsSaved: storeMission?.survivorsRescued !== undefined ? storeMission.survivorsRescued : 3,
    totalSurvivors: storeMission?.totalSurvivors || 3,
    elapsedSeconds: Math.floor(storeMission?.elapsed || 180),
    timeRemainingBonus: storeScore?.timeRemainingBonus || 150,
    suppliesBonus: storeScore?.suppliesBonus || 100
  };

  const isSuccess = data.success !== false;
  const rank = data.rank || 'S';

  const handleReplay = () => {
    if (typeof onReplay === 'function') {
      onReplay();
    } else {
      storeRestart();
    }
  };

  const handleMainMenu = () => {
    if (typeof onMainMenu === 'function') {
      onMainMenu();
    } else {
      storeRestart();
      storeSetPhase('MENU');
    }
  };

  const formatElapsed = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="al-results-overlay" role="region" aria-labelledby="results-title">
      <div className={`al-panel al-results-card ${isSuccess ? 'al-results-card-success' : 'al-panel-danger'} al-animate-fade-in`}>
        {/* Mission Status Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--al-font-mono)',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '2.5px',
            color: isSuccess ? 'var(--al-color-blue)' : 'var(--al-color-red)',
            marginBottom: '6px',
            textTransform: 'uppercase'
          }}>
            {isSuccess ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {isSuccess ? 'EVACUATION SUCCESSFUL // EXTRACTION COMPLETE' : 'MISSION FAILED // CASUALTY TIMEOUT'}
          </div>

          <h1 id="results-title" className="al-results-title">
            AFTER THE COLLAPSE
          </h1>
          <div style={{ fontFamily: 'var(--al-font-mono)', fontSize: '11px', color: 'var(--al-color-text-dim)', letterSpacing: '2px' }}>
            SECTOR 4-B TACTICAL DEBRIEF // OP: CITADEL EMBERS
          </div>
        </div>

        {/* Tactical Performance Rating & Rank Badge */}
        <div className="al-results-rank-banner">
          <div style={{ textAlign: 'center' }}>
            <div className="al-hud-label" style={{ marginBottom: '2px' }}>TACTICAL RATING</div>
            <div className={`al-results-rank-grade ${isSuccess ? 'al-text-orange' : 'al-text-danger'}`}>
              {rank}
            </div>
          </div>

          <div style={{ width: '1px', height: '64px', background: 'rgba(241, 241, 237, 0.1)' }} />

          <div style={{ textAlign: 'center' }}>
            <div className="al-hud-label" style={{ marginBottom: '4px' }}>FINAL OPERATIONAL SCORE</div>
            <div className="al-results-score-val">
              <AnimatedCounter value={data.totalPoints || 0} suffix=" PTS" />
            </div>
          </div>
        </div>

        {/* Stats Grid Breakdown */}
        <div className="al-results-stats-grid">
          <StatItem
            label="Survivors Stabilized"
            value={`${data.survivorsSaved || 0} / ${data.totalSurvivors || 3}`}
            icon={Users}
            accentColor="blue"
          />

          <StatItem
            label="Mission Duration"
            value={formatElapsed(data.elapsedSeconds || 180)}
            icon={Clock}
            accentColor="text"
          />

          <StatItem
            label="Time Bonus"
            value={`+${data.timeRemainingBonus || 0} PTS`}
            icon={Shield}
            accentColor="blue"
          />

          <StatItem
            label="Supplies Conserved"
            value={`+${data.suppliesBonus || 0} PTS`}
            icon={Package}
            accentColor="orange"
          />
        </div>

        {/* Action Button Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '14px',
          borderTop: '1px solid rgba(241, 241, 237, 0.08)',
          paddingTop: '20px'
        }}>
          <Button
            variant="secondary"
            onClick={handleMainMenu}
            icon={Home}
            style={{ flex: 1 }}
          >
            RETURN TO HQ
          </Button>

          <Button
            variant="primary"
            onClick={handleReplay}
            icon={RotateCcw}
            style={{ flex: 1 }}
          >
            REDEPLOY OPERATION
          </Button>
        </div>
      </div>
    </div>
  );
}
