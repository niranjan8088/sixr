import React from 'react';
import { useGameStore } from '../../store/gameStore';
import Button from '../common/Button';
import { Award, RotateCcw, Home, CheckCircle2, XCircle, Clock, PackageCheck } from 'lucide-react';
import { formatTime } from '../../utils/helpers';

export default function ResultsScreen() {
  const score = useGameStore((state) => state.score);
  const mission = useGameStore((state) => state.mission);
  const restartMission = useGameStore((state) => state.restartMission);

  const isSuccess = score.success;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(5, 7, 10, 0.94)',
      padding: '24px'
    }}>
      <div className="sci-panel interactive" style={{
        maxWidth: '640px',
        width: '100%',
        padding: '36px',
        border: `1px solid ${isSuccess ? 'rgba(0, 255, 170, 0.45)' : 'rgba(255, 60, 60, 0.45)'}`,
        boxShadow: `0 12px 48px rgba(0, 0, 0, 0.8), 0 0 24px ${isSuccess ? 'rgba(0, 255, 170, 0.2)' : 'rgba(255, 60, 60, 0.2)'}`
      }}>
        {/* Status Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: isSuccess ? 'var(--accent-green)' : 'var(--accent-red)',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            letterSpacing: '2px',
            fontWeight: 700,
            marginBottom: '8px'
          }}>
            {isSuccess ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {isSuccess ? 'EVACUATION SUCCESSFUL' : 'MISSION FAILED: TIMEOUT'}
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', color: '#fff' }}>
            AFTER THE COLLAPSE
          </h1>
        </div>

        {/* Big Rank Badge */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>PERFORMANCE RATING</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '56px',
              fontWeight: 700,
              color: score.rank === 'S' ? 'var(--accent-amber)' : isSuccess ? 'var(--accent-green)' : 'var(--accent-red)',
              lineHeight: '1'
            }}>
              {score.rank}
            </div>
          </div>

          <div style={{ width: '1px', height: '60px', background: 'rgba(255, 255, 255, 0.1)' }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>FINAL TACTICAL SCORE</div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '36px',
              fontWeight: 700,
              color: '#fff',
              lineHeight: '1.2'
            }}>
              {score.totalPoints} PTS
            </div>
          </div>
        </div>

        {/* Stats Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '4px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>SURVIVORS STABILIZED:</div>
            <div style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>{mission.survivorsRescued} / {mission.totalSurvivors}</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '4px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>TIME REMAINING:</div>
            <div style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>{formatTime(mission.timer)}</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '4px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>TIME BONUS:</div>
            <div style={{ color: 'var(--accent-blue)', fontSize: '16px', fontWeight: 600 }}>+{score.timeRemainingBonus} PTS</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '4px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>CONSERVED SUPPLIES:</div>
            <div style={{ color: 'var(--accent-green)', fontSize: '16px', fontWeight: 600 }}>+{score.suppliesBonus} PTS</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '14px' }}>
          <Button onClick={restartMission} style={{ flex: 1, padding: '14px' }}>
            <RotateCcw size={16} /> RETURN TO BASE
          </Button>
        </div>
      </div>
    </div>
  );
}
