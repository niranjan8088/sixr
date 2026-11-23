import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import Button from '../common/Button';
import {
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  X,
  ShieldAlert,
  Wrench,
  Wind,
  PlusCircle,
  Activity,
  UserCheck,
  RotateCcw,
  Clock
} from 'lucide-react';
import { SURVIVOR_STATUS, TRIAGE_TAGS } from '../../utils/constants';
import { audioSystem } from '../../utils/audioSystem';

export default function RescueModal() {
  const activeSurvivor = useGameStore((state) => state.activeRescueSurvivor);
  const closeRescueModal = useGameStore((state) => state.closeRescueModal);
  const performRescueDecision = useGameStore((state) => state.performRescueDecision);
  const supplies = useGameStore((state) => state.supplies);

  // Timed rescue operation state
  const [isOperating, setIsOperating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [operationType, setOperationType] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!activeSurvivor) return null;

  const isStabilized =
    activeSurvivor.status === SURVIVOR_STATUS.STABILIZED ||
    activeSurvivor.status === SURVIVOR_STATUS.EVACUATED;

  const reqSupply = activeSurvivor.requiredSupply;
  const hasPrimarySupply = supplies[reqSupply] > 0;
  const hasMedkit = supplies.medkits > 0;

  const triageMeta =
    TRIAGE_TAGS[activeSurvivor.triageTag] || TRIAGE_TAGS.URGENT;

  const startOperation = (type) => {
    if (isOperating || isStabilized) return;
    setIsOperating(true);
    setProgress(0);
    setOperationType(type);
    audioSystem.playPneumaticHiss();

    let current = 0;
    const interval = 40; // 40ms * 50 = 2000ms operation
    timerRef.current = setInterval(() => {
      current += 2;
      setProgress(current);
      if (current % 20 === 0) {
        audioSystem.playProgressBeep(current / 100);
      }

      if (current >= 100) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setIsOperating(false);
        const success = performRescueDecision(activeSurvivor.id, type);
        if (success) {
          setSuccessNotice(
            type === 'PRIMARY_PROTOCOL'
              ? `Primary emergency protocol executed. ${activeSurvivor.name} fully stabilized!`
              : `Field emergency dressing applied. Vitals partially stabilized.`
          );
        }
      }
    }, interval);
  };

  const cancelOperation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsOperating(false);
    setProgress(0);
    setOperationType(null);
    audioSystem.playClick();
  };

  const handleSkip = () => {
    audioSystem.playClick();
    performRescueDecision(activeSurvivor.id, 'SKIP');
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(5, 8, 14, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 150,
        padding: '16px'
      }}
    >
      <div
        className="sci-panel interactive"
        style={{
          maxWidth: '620px',
          width: '100%',
          padding: '28px',
          border: `1px solid ${triageMeta.color}88`,
          boxShadow: `0 16px 48px rgba(0, 0, 0, 0.9), 0 0 24px ${triageMeta.color}33`,
          position: 'relative'
        }}
      >
        {/* Top Triage Tag Ribbon */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                background: triageMeta.color,
                color: '#fff',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '2px',
                letterSpacing: '1px'
              }}
            >
              {triageMeta.label}
            </span>
            <span
              style={{
                color: 'var(--accent-blue)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px'
              }}
            >
              CASUALTY ID: {activeSurvivor.id.toUpperCase()}
            </span>
          </div>

          <button
            onClick={closeRescueModal}
            disabled={isOperating}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: isOperating ? 'not-allowed' : 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Survivor Identification Card & Vitals */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            gap: '16px',
            marginBottom: '18px'
          }}
        >
          {/* Tactical Silhouette Portrait */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: `1px solid ${triageMeta.color}55`,
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${triageMeta.color}33 0%, rgba(0,0,0,0.4) 70%)`,
                border: `2px solid ${triageMeta.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px'
              }}
            >
              {isStabilized ? (
                <UserCheck size={32} color="#10b981" />
              ) : (
                <HeartPulse size={32} color={triageMeta.color} />
              )}
            </div>
            <div
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                color: isStabilized ? '#10b981' : triageMeta.color,
                fontWeight: 700
              }}
            >
              {isStabilized ? 'STABILIZED' : activeSurvivor.status}
            </div>
          </div>

          {/* Identity & Trauma Context */}
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px',
                color: '#fff',
                marginBottom: '2px'
              }}
            >
              {activeSurvivor.name}
            </h2>
            <div
              style={{
                color: 'var(--accent-amber)',
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                marginBottom: '8px'
              }}
            >
              {activeSurvivor.role} // {activeSurvivor.situation}
            </div>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderLeft: `3px solid ${triageMeta.color}`,
                padding: '8px 12px',
                fontStyle: 'italic',
                fontSize: '12px',
                color: '#cbd5e1'
              }}
            >
              "{isStabilized ? activeSurvivor.rescuedDialogue : activeSurvivor.dialogue}"
            </div>
          </div>
        </div>

        {/* Live Vitals Telemetry Panel */}
        <div
          style={{
            background: 'rgba(6, 18, 30, 0.75)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '16px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#38bdf8',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700
              }}
            >
              <Activity size={14} /> LIVE BIOTELEMETRY FEED
            </div>
            <div
              style={{
                color: isStabilized ? '#10b981' : '#f59e0b',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              PHYSIOLOGY: {isStabilized ? 'STABLE' : 'CRITICAL'}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              textAlign: 'center'
            }}
          >
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px', borderRadius: '3px' }}>
              <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                HEART RATE
              </div>
              <div style={{ fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ef4444' }}>
                {activeSurvivor.vitals?.hr || 98} BPM
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px', borderRadius: '3px' }}>
              <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                BLOOD OXYGEN
              </div>
              <div
                style={{
                  fontSize: '15px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: (activeSurvivor.vitals?.spo2 || 90) < 85 ? '#f59e0b' : '#10b981'
                }}
              >
                {activeSurvivor.vitals?.spo2 || 94}%
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px', borderRadius: '3px' }}>
              <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                BLOOD PRESS.
              </div>
              <div style={{ fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>
                {activeSurvivor.vitals?.bp || '120/80'}
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '6px', borderRadius: '3px' }}>
              <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                STABILITY
              </div>
              <div
                style={{
                  fontSize: '15px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: isStabilized ? '#10b981' : '#f59e0b'
                }}
              >
                {isStabilized ? 100 : activeSurvivor.vitals?.stability || 45}%
              </div>
            </div>
          </div>
        </div>

        {/* AI Advisory Clinical Recommendation */}
        <div
          style={{
            background: 'rgba(56, 189, 248, 0.08)',
            borderLeft: '3px solid #38bdf8',
            padding: '10px 12px',
            marginBottom: '16px',
            fontSize: '12px',
            color: '#cbd5e1'
          }}
        >
          <strong style={{ color: '#38bdf8' }}>AI Clinical Recommendation: </strong>
          {activeSurvivor.aiRecommendation}
        </div>

        {/* Live Inventory Status Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            background: 'rgba(0,0,0,0.3)',
            padding: '8px 12px',
            borderRadius: '4px',
            marginBottom: '18px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>RESPONDER STOCK:</span>
          <span style={{ color: supplies.medkits > 0 ? '#10b981' : '#ef4444' }}>
            Medkits: <strong>{supplies.medkits}</strong>
          </span>
          <span style={{ color: supplies.oxygen > 0 ? '#10b981' : '#ef4444' }}>
            Oxygen: <strong>{supplies.oxygen}</strong>
          </span>
          <span style={{ color: supplies.toolkits > 0 ? '#10b981' : '#ef4444' }}>
            Hydraulic Tools: <strong>{supplies.toolkits}</strong>
          </span>
        </div>

        {/* Operation In-Progress Animated Progress Bar */}
        {isOperating && (
          <div
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid var(--accent-amber)',
              borderRadius: '4px',
              padding: '12px',
              marginBottom: '16px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-amber)',
                marginBottom: '6px'
              }}
            >
              <span>OPERATION IN PROGRESS: EXECUTING PROTOCOL...</span>
              <span>{progress}%</span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)',
                  transition: 'width 0.05s linear'
                }}
              />
            </div>
            <div style={{ marginTop: '8px', textAlign: 'right' }}>
              <button
                onClick={cancelOperation}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #ef4444',
                  color: '#ef4444',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: '4px 10px',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Cancel Procedure
              </button>
            </div>
          </div>
        )}

        {/* Success Notice Banner */}
        {successNotice && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: '#6ee7b7',
              padding: '10px 14px',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Action Decision Buttons */}
        {!isOperating && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Primary Action Button */}
            {!isStabilized ? (
              <Button
                onClick={() => startOperation('PRIMARY_PROTOCOL')}
                disabled={!hasPrimarySupply}
                style={{
                  width: '100%',
                  padding: '14px',
                  opacity: hasPrimarySupply ? 1 : 0.5,
                  cursor: hasPrimarySupply ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: hasPrimarySupply
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, rgba(217, 119, 6, 0.6) 100%)'
                    : 'rgba(255, 255, 255, 0.05)'
                }}
              >
                {reqSupply === 'toolkits' ? <Wrench size={16} /> : reqSupply === 'oxygen' ? <Wind size={16} /> : <PlusCircle size={16} />}
                <span>
                  {activeSurvivor.actionLabel} (Use 1 {activeSurvivor.supplyLabel})
                </span>
              </Button>
            ) : (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  padding: '12px',
                  borderRadius: '4px',
                  textAlign: 'center',
                  color: '#10b981',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 700
                }}
              >
                ✓ CASUALTY STABILIZED — EVACUATION CLEARANCE GRANTED
              </div>
            )}

            {/* Secondary Action: Field First Aid */}
            {!isStabilized && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Button
                  onClick={() => startOperation('FIELD_STABILIZE')}
                  disabled={!hasMedkit}
                  style={{
                    padding: '10px',
                    fontSize: '12px',
                    opacity: hasMedkit ? 1 : 0.5,
                    cursor: hasMedkit ? 'pointer' : 'not-allowed',
                    background: 'rgba(56, 189, 248, 0.2)',
                    border: '1px solid rgba(56, 189, 248, 0.4)'
                  }}
                >
                  <PlusCircle size={14} /> Field First Aid (1 Medkit)
                </Button>

                <Button
                  onClick={handleSkip}
                  style={{
                    padding: '10px',
                    fontSize: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <RotateCcw size={14} /> Prioritize Other Casualty
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
