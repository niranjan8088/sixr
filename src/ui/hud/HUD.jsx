import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { formatTime, getDistance2D } from '../../utils/helpers';
import { GameConfig } from '../../game/GameConfig';
import { SURVIVOR_STATUS } from '../../utils/constants';
import { Shield, Clock, Users, Package, Heart, Zap, Crosshair } from 'lucide-react';

export default function HUD() {
  const mission = useGameStore((state) => state.mission);
  const player = useGameStore((state) => state.player);
  const supplies = useGameStore((state) => state.supplies);
  const survivors = useGameStore((state) => state.survivors);
  const interaction = useGameStore((state) => state.interaction);
  const cameraYaw = useGameStore((state) => state.cameraRotation.yaw);

  const isLowTime = mission.timer <= 60;

  // Radar calculations
  const radarRadius = 60; // 60px display radius
  const radarScale = 0.85; // meters to pixels scale

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 20
    }}>
      {/* TOP BAR: Objective & Mission Clock */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Left: Objective Display */}
        <div className="sci-panel" style={{ padding: '12px 18px', maxWidth: '420px', borderLeft: '4px solid var(--accent-amber)' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', letterSpacing: '1.5px', marginBottom: '4px' }}>
            CURRENT OBJECTIVE
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', lineHeight: '1.4' }}>
            {mission.currentObjective}
          </div>
        </div>

        {/* Center: Mission Timer */}
        <div className="sci-panel" style={{
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: isLowTime ? '1px solid var(--accent-red)' : '1px solid rgba(255, 120, 30, 0.35)',
          background: isLowTime ? 'rgba(40, 10, 10, 0.85)' : 'rgba(10, 14, 20, 0.85)'
        }}>
          <Clock size={20} color={isLowTime ? 'var(--accent-red)' : 'var(--accent-amber)'} />
          <div>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>TIME REMAINING</div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '24px',
              fontWeight: 700,
              color: isLowTime ? 'var(--accent-red)' : '#fff',
              lineHeight: 1
            }}>
              {formatTime(mission.timer)}
            </div>
          </div>
        </div>

        {/* Right: Tactical Radar & Survivor Counter */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          {/* Radar circle */}
          <div className="sci-panel" style={{
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid rgba(255, 120, 30, 0.4)',
            background: 'radial-gradient(circle, rgba(12, 18, 25, 0.9) 30%, rgba(5, 8, 12, 0.95) 100%)'
          }}>
            {/* Radar Crosshairs */}
            <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(255, 120, 30, 0.2)' }} />
            <div style={{ position: 'absolute', top: 0, left: '50%', width: '1px', height: '100%', background: 'rgba(255, 120, 30, 0.2)' }} />
            <div style={{ position: 'absolute', top: '15%', left: '15%', width: '70%', height: '70%', borderRadius: '50%', border: '1px dashed rgba(255, 120, 30, 0.2)' }} />

            {/* Player Center Blip & Orientation */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '8px',
              height: '8px',
              background: '#00d2ff',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 6px #00d2ff'
            }} />

            {/* Survivor Radar Blips */}
            {survivors.map((s) => {
              const dx = s.position[0] - player.position[0];
              const dz = s.position[2] - player.position[2];

              // Rotate relative to camera yaw
              const cosY = Math.cos(-cameraYaw);
              const sinY = Math.sin(-cameraYaw);
              const rx = dx * cosY - dz * sinY;
              const rz = dx * sinY + dz * cosY;

              const px = 65 + rx * radarScale;
              const py = 65 + rz * radarScale;

              // Only render if within radar perimeter
              const distFromCenter = Math.sqrt((px - 65) ** 2 + (py - 65) ** 2);
              if (distFromCenter > 58) return null;

              const isRescued = s.status === SURVIVOR_STATUS.RESCUED;

              return (
                <div key={s.id} style={{
                  position: 'absolute',
                  left: `${px}px`,
                  top: `${py}px`,
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: isRescued ? '#00ffaa' : '#ff4400',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 6px ${isRescued ? '#00ffaa' : '#ff4400'}`
                }} />
              );
            })}

            {/* Evac Helipad Radar Blip */}
            {(() => {
              const evacPos = GameConfig.mission.extractionZone.position;
              const dx = evacPos[0] - player.position[0];
              const dz = evacPos[2] - player.position[2];

              const cosY = Math.cos(-cameraYaw);
              const sinY = Math.sin(-cameraYaw);
              const rx = dx * cosY - dz * sinY;
              const rz = dx * sinY + dz * cosY;

              const px = 65 + rx * radarScale;
              const py = 65 + rz * radarScale;
              const distFromCenter = Math.sqrt((px - 65) ** 2 + (py - 65) ** 2);
              if (distFromCenter > 58) return null;

              return (
                <div style={{
                  position: 'absolute',
                  left: `${px}px`,
                  top: `${py}px`,
                  width: '9px',
                  height: '9px',
                  background: '#ffaa00',
                  borderRadius: '2px',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 8px #ffaa00'
                }} />
              );
            })()}
          </div>

          {/* Survivors Saved Counter Badge */}
          <div className="sci-panel" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={15} color="var(--accent-amber)" />
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              SURVIVORS: <strong style={{ color: 'var(--accent-green)' }}>{mission.survivorsRescued}</strong> / {mission.totalSurvivors}
            </span>
          </div>
        </div>
      </div>

      {/* CENTER: Contextual Interaction Notification */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Subtle Crosshair Reticle */}
        <div style={{ width: '12px', height: '12px', border: '1px solid rgba(255, 255, 255, 0.4)', borderRadius: '50%', marginBottom: '14px' }} />

        {/* Interaction Banner */}
        {interaction.active && (
          <div className="sci-panel interactive" style={{
            padding: '12px 28px',
            border: '1px solid var(--accent-amber)',
            boxShadow: '0 0 24px rgba(255, 102, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'pulseGlow 2s infinite ease-in-out'
          }}>
            <div style={{
              background: 'var(--accent-amber)',
              color: '#000',
              fontWeight: 800,
              fontSize: '13px',
              padding: '2px 8px',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)'
            }}>
              E
            </div>
            <span style={{ fontSize: '14px', fontFamily: 'var(--font-display)', letterSpacing: '1px', fontWeight: 600 }}>
              {interaction.promptText}
            </span>
          </div>
        )}
      </div>

      {/* BOTTOM BAR: Supplies & Operative Vitals */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        {/* Left: Player Vitals (Health & Stamina) */}
        <div className="sci-panel" style={{ padding: '14px 20px', minWidth: '220px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={14} color="var(--accent-blue)" /> RESPONDER VITALS
          </div>

          {/* Health Bar */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
              <span>SUIT INTEGRITY</span>
              <span>100%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'var(--accent-green)' }} />
            </div>
          </div>

          {/* Stamina Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', marginBottom: '3px' }}>
              <span>EXO STAMINA</span>
              <span>{Math.round(player.stamina)}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${player.stamina}%`, height: '100%', background: 'var(--accent-blue)', transition: 'width 0.1s linear' }} />
            </div>
          </div>
        </div>

        {/* Right: Supplies Inventory */}
        <div className="sci-panel" style={{ padding: '14px 22px', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-green)' }} />
            <div style={{ fontFamily: 'var(--font-mono)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>MEDKITS</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{supplies.medkits}</div>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-blue)' }} />
            <div style={{ fontFamily: 'var(--font-mono)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>O2 CELLS</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{supplies.oxygen}</div>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-amber)' }} />
            <div style={{ fontFamily: 'var(--font-mono)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>TOOLKITS</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{supplies.toolkits}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

