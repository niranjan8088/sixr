import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import Button from '../common/Button';
import {
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  PackageCheck,
  ShieldAlert,
  UserCheck,
  Activity,
  Sparkles,
  Layers
} from 'lucide-react';
import { formatTime } from '../../utils/helpers';
import { audioSystem } from '../../utils/audioSystem';

export default function ResultsScreen() {
  const score = useGameStore((state) => state.score);
  const mission = useGameStore((state) => state.mission);
  const survivors = useGameStore((state) => state.survivors);
  const objectives = useGameStore((state) => state.objectives);
  const supplies = useGameStore((state) => state.supplies);
  const rescueLog = useGameStore((state) => state.rescueLog);
  const restartMission = useGameStore((state) => state.restartMission);

  const isSuccess = score.success;

  // Animated tally counts
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showRank, setShowRank] = useState(false);

  useEffect(() => {
    let current = 0;
    const target = score.totalPoints;
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setAnimatedScore(target);
        setShowRank(true);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, 25);

    return () => clearInterval(timer);
  }, [score.totalPoints]);

  // Dynamic Rule-Based AI Tactical Debrief Generator
  const generateAIDebrief = () => {
    if (!isSuccess) {
      return 'Operational timeline expired before casualty extraction could be fully coordinated. Atmospheric particulate saturation and ongoing structural instability exceeded permissible ERU exposure parameters. Mission classification: ABORTED.';
    }

    const savedAll = mission.survivorsRescued === mission.totalSurvivors;
    const conservedWell = supplies.medkits >= 1 && supplies.toolkits >= 1;
    const isRapid = mission.timer > 120;

    let debrief = 'CITADEL COMMAND POST TACTICAL ASSESSMENT:\n';
    if (savedAll && isRapid && conservedWell) {
      debrief += 'Operative demonstrated exemplary triage execution and tactical discipline. All 3 civilian casualty vectors were stabilized rapidly and evacuated without loss of life. Resource conservation protocol adhered to highest operational benchmark (CITADEL COMMENDATION).';
    } else if (savedAll && conservedWell) {
      debrief += 'All civilian personnel successfully stabilized and extracted to helipad landing zone. Effective resource discipline maintained under heavy structural hazard conditions.';
    } else if (savedAll) {
      debrief += 'Emergency evacuation achieved under extreme operational stress. Multiple trauma protocols deployed rapidly to reverse critical physiological decay before helipad lift.';
    } else {
      debrief += 'Partial casualty evacuation completed. Extraction secured for accessible personnel under deteriorating atmospheric parameters.';
    }

    return debrief;
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 7, 12, 0.95)',
        padding: '20px',
        overflowY: 'auto'
      }}
    >
      <div
        className="sci-panel interactive"
        style={{
          maxWidth: '680px',
          width: '100%',
          padding: '32px',
          border: `1px solid ${isSuccess ? 'rgba(0, 255, 170, 0.5)' : 'rgba(255, 60, 60, 0.5)'}`,
          boxShadow: `0 16px 54px rgba(0, 0, 0, 0.9), 0 0 32px ${isSuccess ? 'rgba(0, 255, 170, 0.25)' : 'rgba(255, 60, 60, 0.25)'}`
        }}
      >
        {/* Status Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: isSuccess ? 'var(--accent-green)' : 'var(--accent-red)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '2px',
              fontWeight: 700,
              marginBottom: '6px'
            }}
          >
            {isSuccess ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {isSuccess ? 'EVACUATION PROTOCOL SUCCESSFUL' : 'MISSION FAILED: TIMEOUT EXCEEDED'}
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              color: '#fff',
              letterSpacing: '1px'
            }}
          >
            AFTER THE COLLAPSE — OP: CITADEL EMBERS
          </h1>
          <div
            style={{
              color: 'var(--accent-blue)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px'
            }}
          >
            EMERGENCY RESPONSE UNIT // DEBRIEF DOSSIER
          </div>
        </div>

        {/* Big Rank & Animated Score Badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '28px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '4px',
            padding: '16px 24px',
            marginBottom: '20px'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              PERFORMANCE RATING
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '52px',
                fontWeight: 700,
                color:
                  score.rank === 'S'
                    ? '#f59e0b'
                    : score.rank === 'A'
                    ? '#10b981'
                    : isSuccess
                    ? '#38bdf8'
                    : '#ef4444',
                lineHeight: '1',
                opacity: showRank ? 1 : 0.2,
                transform: showRank ? 'scale(1)' : 'scale(0.8)',
                transition: 'all 0.4s ease-out'
              }}
            >
              {score.rank}
            </div>
          </div>

          <div style={{ width: '1px', height: '56px', background: 'rgba(255, 255, 255, 0.1)' }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              FINAL TACTICAL SCORE
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '32px',
                fontWeight: 700,
                color: '#fff',
                lineHeight: '1.2'
              }}
            >
              {animatedScore} PTS
            </div>
          </div>
        </div>

        {/* Tactical Breakdown Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginBottom: '20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            textAlign: 'center'
          }}
        >
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 6px', borderRadius: '4px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>CASUALTIES SAVED</div>
            <div style={{ color: '#10b981', fontSize: '14px', fontWeight: 700 }}>
              {mission.survivorsRescued} / {mission.totalSurvivors}
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 6px', borderRadius: '4px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>TIME REMAINING</div>
            <div style={{ color: '#38bdf8', fontSize: '14px', fontWeight: 700 }}>
              {formatTime(mission.timer)}
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 6px', borderRadius: '4px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>TIME BONUS</div>
            <div style={{ color: '#f59e0b', fontSize: '14px', fontWeight: 700 }}>
              +{score.timeRemainingBonus} PTS
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '10px 6px', borderRadius: '4px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>RESERVES BONUS</div>
            <div style={{ color: '#10b981', fontSize: '14px', fontWeight: 700 }}>
              +{score.suppliesBonus} PTS
            </div>
          </div>
        </div>

        {/* Civilian Evacuation Manifest Table */}
        <div style={{ marginBottom: '18px' }}>
          <div
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              letterSpacing: '1px',
              marginBottom: '6px'
            }}
          >
            CIVILIAN CASUALTY EVACUATION MANIFEST:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {survivors.map((s) => {
              const isSaved =
                s.status === 'STABILIZED' || s.status === 'EVACUATED' || s.status === 'RESCUED';
              return (
                <div
                  key={s.id}
                  style={{
                    background: isSaved ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    border: `1px solid ${isSaved ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
                    borderRadius: '4px',
                    padding: '8px 10px'
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{s.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{s.role}</div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: isSaved ? '#10b981' : '#ef4444',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      marginTop: '4px'
                    }}
                  >
                    {isSaved ? '✓ EVACUATED / STABLE' : '✗ UNLOCATED'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic AI Tactical Command Post Assessment */}
        <div
          style={{
            background: 'rgba(56, 189, 248, 0.06)',
            borderLeft: '3px solid #38bdf8',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '12px',
            lineHeight: '1.5',
            color: '#cbd5e1'
          }}
        >
          <div
            style={{
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldAlert size={14} /> AI COMMAND POST TACTICAL ASSESSMENT
          </div>
          <div>{generateAIDebrief()}</div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button onClick={restartMission} style={{ flex: 1, padding: '14px' }}>
            <RotateCcw size={16} /> RETURN TO CITADEL BASE
          </Button>
        </div>
      </div>
    </div>
  );
}
