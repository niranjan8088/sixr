import React, { useState } from 'react';
import '../../styles/ui.css';
import Button from '../components/Button';
import SectionLabel from '../components/SectionLabel';
import {
  HeartPulse,
  AlertTriangle,
  X,
  CheckCircle2,
  Package,
  Activity,
  ShieldAlert,
  Zap,
  Wrench
} from 'lucide-react';

/**
 * AFTERLIGHT — Rescue & Medical Triage Decision Panel
 * Displays survivor diagnostics, required supplies, and treatment decision cards.
 * Visual-only decision callbacks; no gameplay logic hardcoded.
 */
export default function RescuePanel({
  survivor = null,
  supplies = { medkits: 3, oxygen: 2, toolkits: 2 },
  onConfirmRescue = null,
  onClose = null
}) {
  // Safe default survivor data if none provided
  const target = survivor || {
    id: 'survivor-1',
    name: 'Elena Vance',
    role: 'Structural Engineer',
    injury: 'Pinned beneath reinforced concrete girder. Crush trauma.',
    condition: 'Acute shock, compound fracture, stable pulse.',
    injuryLevel: 'Severe',
    requiredSupply: 'toolkits',
    supplyLabel: 'Hydraulic Spreader Toolkit'
  };

  const [selectedOption, setSelectedOption] = useState('standard');

  const reqSupply = target.requiredSupply || 'medkits';
  const supplyCount = supplies[reqSupply] !== undefined ? supplies[reqSupply] : 1;
  const hasSupply = supplyCount > 0;

  const decisionOptions = [
    {
      id: 'standard',
      title: 'Standard Tactical Stabilization',
      desc: `Deploy 1x ${target.supplyLabel || 'Medical Gear'}. Immediate trauma control.`,
      costLabel: `1x ${target.supplyLabel || 'Required Supply'}`,
      successRate: '98%',
      risk: 'Minimal',
      hasResource: hasSupply
    },
    {
      id: 'emergency',
      title: 'Emergency Rapid Extraction',
      desc: 'Manual bypass without specialized tooling. Faster procedure under threat.',
      costLabel: 'No resources consumed',
      successRate: '75%',
      risk: 'Moderate Risk',
      hasResource: true
    }
  ];

  const handleConfirm = () => {
    if (typeof onConfirmRescue === 'function') {
      onConfirmRescue({
        survivorId: target.id,
        decisionId: selectedOption,
        supplyUsed: selectedOption === 'standard' ? reqSupply : null
      });
    }
  };

  return (
    <div className="al-rescue-overlay" role="dialog" aria-modal="true" aria-labelledby="rescue-title">
      <div className="al-panel al-rescue-card al-animate-fade-in">
        {/* Header */}
        <div className="al-rescue-header">
          <div>
            <SectionLabel icon={HeartPulse} color="orange">
              EMERGENCY MEDICAL TRIAGE // FIELD DISPATCH
            </SectionLabel>
            <h2 id="rescue-title" className="al-rescue-name">
              {target.name}
            </h2>
            <div className="al-rescue-role">
              {target.role}
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              className="al-rescue-close-btn"
              onClick={onClose}
              aria-label="Close rescue panel"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Diagnostic Assessment Block */}
        <div className="al-rescue-intel-block">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span className="al-hud-label">TRAUMA CLASSIFICATION</span>
            <span style={{
              fontFamily: 'var(--al-font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--al-color-red)'
            }}>
              INJURY LEVEL: {target.injuryLevel || 'CRITICAL'}
            </span>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--al-color-text)', lineHeight: '1.5', marginBottom: '8px' }}>
            {target.injury}
          </div>

          <div style={{
            fontSize: '11px',
            fontFamily: 'var(--al-font-mono)',
            color: 'var(--al-color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Activity size={13} className="al-text-blue" />
            <span>VITALS: {target.condition}</span>
          </div>
        </div>

        {/* Required Supplies Readout */}
        <div className="al-rescue-supplies-bar">
          <div>
            <div className="al-hud-label">REQUIRED RESCUE RESOURCE</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
              {target.supplyLabel || 'Field First-Aid Supplies'}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="al-hud-label">FIELD INVENTORY</div>
            <div style={{
              fontFamily: 'var(--al-font-mono)',
              fontSize: '15px',
              fontWeight: 800,
              color: hasSupply ? 'var(--al-color-blue)' : 'var(--al-color-red)',
              marginTop: '2px'
            }}>
              {supplyCount} AVAILABLE
            </div>
          </div>
        </div>

        {/* Treatment Decision Cards */}
        <div style={{ marginBottom: '24px' }}>
          <div className="al-hud-label" style={{ marginBottom: '10px' }}>
            SELECT RESCUE PROCEDURE:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {decisionOptions.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const disabled = !opt.hasResource;

              return (
                <div
                  key={opt.id}
                  onClick={() => !disabled && setSelectedOption(opt.id)}
                  className={`al-rescue-decision-card ${isSelected ? 'al-rescue-card-selected' : ''} ${disabled ? 'al-rescue-card-disabled' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: isSelected ? '#fff' : 'var(--al-color-text)' }}>
                      {opt.title}
                    </div>
                    <span style={{
                      fontFamily: 'var(--al-font-mono)',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: opt.risk === 'Minimal' ? 'var(--al-color-blue)' : 'var(--al-color-orange)',
                      textTransform: 'uppercase'
                    }}>
                      RISK: {opt.risk}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--al-color-text-muted)', lineHeight: '1.4', marginBottom: '6px' }}>
                    {opt.desc}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--al-font-mono)',
                    fontSize: '11px',
                    paddingTop: '6px',
                    borderTop: '1px solid rgba(241, 241, 237, 0.06)'
                  }}>
                    <span style={{ color: opt.hasResource ? 'var(--al-color-text-muted)' : 'var(--al-color-red)' }}>
                      COST: {opt.costLabel}
                    </span>
                    <span style={{ color: 'var(--al-color-blue)', fontWeight: 600 }}>
                      EST. SUCCESS: {opt.successRate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {onClose ? (
            <Button variant="secondary" onClick={onClose}>
              ABORT
            </Button>
          ) : <div />}

          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={selectedOption === 'standard' && !hasSupply}
            icon={CheckCircle2}
            subtext="Apply Selected Trauma Procedure"
          >
            CONFIRM STABILIZATION
          </Button>
        </div>
      </div>
    </div>
  );
}
