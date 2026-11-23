import React from 'react';
import { useGameStore } from '../../store/gameStore';
import Button from '../common/Button';
import { ShieldAlert, Users, Clock, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function MissionBriefing() {
  const mission = useGameStore((state) => state.mission);
  const survivors = useGameStore((state) => state.survivors);
  const supplies = useGameStore((state) => state.supplies);
  const startMission = useGameStore((state) => state.startMission);
  const setPhase = useGameStore((state) => state.setPhase);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(5, 7, 10, 0.92)',
      padding: '24px'
    }}>
      <div className="sci-panel interactive" style={{
        maxWidth: '780px',
        width: '100%',
        padding: '36px',
        border: '1px solid rgba(255, 120, 30, 0.4)'
      }}>
        {/* Mission Header */}
        <div style={{ borderBottom: '1px solid rgba(255, 120, 30, 0.25)', paddingBottom: '16px', marginBottom: '24px' }}>
          <div style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '2px', fontWeight: 600 }}>
            TACTICAL BRIEFING // {mission.codename}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#fff', marginTop: '4px' }}>
            {mission.title}
          </h2>
        </div>

        {/* Narrative & Context */}
        <p style={{ color: '#b2c0d0', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
          {mission.briefing}
        </p>

        {/* 3 Survivors Target Cards */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '1px', color: 'var(--accent-amber)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} /> TARGET SURVIVOR SIGNALS (3 DETECTED)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {survivors.map((s) => (
              <div key={s.id} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 100, 0, 0.2)',
                borderRadius: '4px',
                padding: '14px'
              }}>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '14px' }}>{s.name}</div>
                <div style={{ color: 'var(--accent-blue)', fontSize: '12px', marginBottom: '6px' }}>{s.role}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{s.injury}</div>
                <div style={{ marginTop: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>
                  REQ: {s.supplyLabel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Allotment */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '4px',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)' }}>
            <AlertTriangle size={18} />
            <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>DISPATCH SUPPLIES:</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#fff' }}>
            <div>Medkits: <span style={{ color: 'var(--accent-green)' }}>{supplies.medkits}</span></div>
            <div>O2 Canisters: <span style={{ color: 'var(--accent-blue)' }}>{supplies.oxygen}</span></div>
            <div>Hydraulic Tools: <span style={{ color: 'var(--accent-amber)' }}>{supplies.toolkits}</span></div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="secondary" onClick={() => setPhase('MENU')}>
            <ArrowLeft size={16} /> RETURN
          </Button>

          <Button onClick={startMission} style={{ padding: '14px 32px' }}>
            ENTER RUINS & ENGAGE <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
