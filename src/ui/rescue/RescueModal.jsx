import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import Button from '../common/Button';
import { HeartPulse, CheckCircle, AlertOctagon, X, ShieldAlert } from 'lucide-react';
import { SURVIVOR_STATUS } from '../../utils/constants';

export default function RescueModal() {
  const activeSurvivor = useGameStore((state) => state.activeRescueSurvivor);
  const closeRescueModal = useGameStore((state) => state.closeRescueModal);
  const performRescue = useGameStore((state) => state.performRescue);
  const supplies = useGameStore((state) => state.supplies);

  if (!activeSurvivor) return null;

  const isAlreadyRescued = activeSurvivor.status === SURVIVOR_STATUS.RESCUED;
  const reqSupply = activeSurvivor.requiredSupply;
  const hasRequiredSupply = supplies[reqSupply] > 0;

  const handleApplyTreatment = () => {
    if (isAlreadyRescued) return;
    performRescue(activeSurvivor.id, reqSupply);
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(5, 8, 12, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 150
    }}>
      <div className="sci-panel interactive" style={{
        maxWidth: '560px',
        width: '100%',
        padding: '32px',
        border: '1px solid rgba(255, 120, 30, 0.5)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.85), 0 0 24px rgba(255, 102, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              <HeartPulse size={16} /> EMERGENCY MEDICAL TRIAGE
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#fff', marginTop: '4px' }}>
              {activeSurvivor.name}
            </h2>
            <div style={{ color: 'var(--accent-blue)', fontSize: '13px' }}>{activeSurvivor.role}</div>
          </div>

          <button
            onClick={closeRescueModal}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Survivor Voice / Quote */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.45)',
          borderLeft: '3px solid var(--accent-amber)',
          padding: '12px 16px',
          fontStyle: 'italic',
          color: '#d0d8e2',
          fontSize: '13px',
          marginBottom: '20px'
        }}>
          "{isAlreadyRescued ? activeSurvivor.rescuedDialogue : activeSurvivor.dialogue}"
        </div>

        {/* Triage Assessment */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
            DIAGNOSTIC ASSESSMENT
          </div>
          <div style={{ color: '#fff', fontSize: '14px', lineHeight: '1.5', marginBottom: '6px' }}>
            {activeSurvivor.injury}
          </div>
          <div style={{ color: 'var(--accent-red)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
            STATUS: {activeSurvivor.condition}
          </div>
        </div>

        {/* AI Field Medic Diagnostic Telemetry (Priority 9 Match!) */}
        <div style={{
          background: 'rgba(6, 18, 30, 0.75)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '4px',
          padding: '14px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              <ShieldAlert size={14} /> AI CLINICAL DIAGNOSTIC TELEMETRY // MODEL v4.2
            </div>
            <div style={{
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 6px',
              borderRadius: '2px'
            }}>
              LIVE SENSOR LINK
            </div>
          </div>

          {/* Vitals Telemetry Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '3px' }}>
              <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>PULSE</div>
              <div style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ef4444' }}>
                {activeSurvivor.id === 'survivor-3' ? '138 BPM' : activeSurvivor.id === 'survivor-2' ? '112 BPM' : '94 BPM'}
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '3px' }}>
              <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>SpO2</div>
              <div style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: activeSurvivor.id === 'survivor-2' ? '#f59e0b' : '#10b981' }}>
                {activeSurvivor.id === 'survivor-2' ? '79%' : '94%'}
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '3px' }}>
              <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>BP mmHg</div>
              <div style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>
                {activeSurvivor.id === 'survivor-3' ? '82/50' : '124/82'}
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '3px' }}>
              <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>SURVIVAL</div>
              <div style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: isAlreadyRescued ? '#10b981' : '#f59e0b' }}>
                {isAlreadyRescued ? '98%' : '42%'}
              </div>
            </div>
          </div>

          {/* AI Clinical Synopsis */}
          <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', fontFamily: 'sans-serif' }}>
            <strong style={{ color: '#38bdf8' }}>AI Triage Recommendation: </strong>
            {activeSurvivor.id === 'survivor-1'
              ? 'Crush syndrome imminent from 450kg reinforced slab. Hydraulic spreader deployment required to release extremity without neurovascular tearing.'
              : activeSurvivor.id === 'survivor-2'
              ? 'Severe combustion particulate asphyxiation. Immediate high-flow O2 administration required to reverse hypoxic cellular decay.'
              : 'Class III hypovolemic shock from arterial laceration. Rapid pressure dressing & trauma tourniquet protocol mandatory.'}
          </div>
        </div>

        {/* Action Panel */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                REQUIRED RESCUE RESOURCE
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>
                {activeSurvivor.supplyLabel}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                INVENTORY REMAINING
              </div>
              <div style={{
                fontSize: '16px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: hasRequiredSupply ? 'var(--accent-green)' : 'var(--accent-red)'
              }}>
                {supplies[reqSupply]} AVAILABLE
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={closeRescueModal}>
            CLOSE
          </Button>

          {!isAlreadyRescued ? (
            <Button
              onClick={handleApplyTreatment}
              disabled={!hasRequiredSupply}
              style={{
                opacity: hasRequiredSupply ? 1 : 0.5,
                cursor: hasRequiredSupply ? 'pointer' : 'not-allowed'
              }}
            >
              <CheckCircle size={16} />
              {hasRequiredSupply ? 'ADMINISTER & STABILIZE' : 'MISSING REQUIRED SUPPLY'}
            </Button>
          ) : (
            <div style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <CheckCircle size={18} /> SURVIVOR STABILIZED
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

