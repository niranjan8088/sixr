import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { formatTime, getDistance2D } from '../../utils/helpers';
import { GameConfig } from '../../game/GameConfig';
import { SURVIVOR_STATUS, TRIAGE_TAGS } from '../../utils/constants';
import {
  Volume2,
  VolumeX,
  CheckCircle2,
  Circle,
  Navigation,
  Compass,
  Radio,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { audioSystem } from '../../utils/audioSystem';

export default function HUD() {
  const mission = useGameStore((state) => state.mission);
  const player = useGameStore((state) => state.player);
  const supplies = useGameStore((state) => state.supplies);
  const survivors = useGameStore((state) => state.survivors);
  const objectives = useGameStore((state) => state.objectives);
  const interaction = useGameStore((state) => state.interaction);
  const cameraYaw = useGameStore((state) => state.cameraRotation.yaw);
  const activeHazard = useGameStore((state) => state.activeHazard);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);

  const [showObjectivesList, setShowObjectivesList] = useState(true);

  const isLowTime = mission.timer <= 60;
  const radarScale = 0.95;

  // Extraction distance
  const evacPos = GameConfig.mission.extractionZone.position;
  const distToEvac = Math.round(getDistance2D(player.position, evacPos));

  return (
    <div className="gta-hud-root">
      {/* ========================================================
          TOP-CENTER: ENVIRONMENTAL HAZARD WARNING BANNER
         ======================================================== */}
      {activeHazard && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(239, 68, 68, 0.25)',
            border: '1px solid rgba(239, 68, 68, 0.85)',
            backdropFilter: 'blur(8px)',
            padding: '8px 24px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#fecaca',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '1px',
            boxShadow: '0 0 24px rgba(239, 68, 68, 0.45)',
            animation: 'pulse 1.2s infinite ease-in-out',
            zIndex: 90
          }}
        >
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <span>HAZARD ALERT: {activeHazard}</span>
        </div>
      )}

      {/* ========================================================
          TOP-LEFT: AUDIO CONTROLS & ERU DISPATCH TELEMETRY
         ======================================================== */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 80
        }}
      >
        {/* Sound Toggle Button */}
        <button
          onClick={toggleSound}
          className="sci-panel interactive"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '6px 12px',
            borderRadius: '4px',
            color: soundEnabled ? '#38bdf8' : '#94a3b8',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            cursor: 'pointer'
          }}
          title={soundEnabled ? 'Mute Procedural Audio' : 'Unmute Procedural Audio'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span>{soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#10b981',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '6px 10px',
            borderRadius: '4px'
          }}
        >
          <Radio size={14} />
          <span>DISPATCH LINK: ONLINE</span>
        </div>
      </div>

      {/* ========================================================
          TOP-RIGHT: OBJECTIVES & MISSION CLOCK CLUSTER
         ======================================================== */}
      <div className="gta-top-right">
        {/* Mission Objective Card */}
        <div className="gta-objective-card">
          <div className="gta-objective-header">
            <span className="gta-badge-amber">SECTOR 4-B</span>
            <span className="gta-objective-title">{mission.codename}</span>
            <button
              onClick={() => setShowObjectivesList(!showObjectivesList)}
              className="interactive"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {showObjectivesList ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          <div className="gta-objective-text">{mission.currentObjective}</div>

          {/* Dynamic Objectives Checklist */}
          {showObjectivesList && (
            <div
              style={{
                marginTop: '10px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              {objectives.map((obj) => (
                <div
                  key={obj.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: obj.completed ? '#10b981' : '#cbd5e1'
                  }}
                >
                  {obj.completed ? (
                    <CheckCircle2 size={13} color="#10b981" />
                  ) : (
                    <Circle size={13} color="#64748b" />
                  )}
                  <span style={{ textDecoration: obj.completed ? 'line-through' : 'none' }}>
                    {obj.title}
                  </span>
                  {obj.target && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        color: obj.completed ? '#10b981' : '#f59e0b',
                        fontWeight: 700
                      }}
                    >
                      [{obj.current}/{obj.target}]
                    </span>
                  )}
                  {obj.isBonus && (
                    <span style={{ marginLeft: 'auto', color: '#38bdf8', fontSize: '9px' }}>
                      BONUS
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tactical Clock & Survivor Status Bar */}
        <div className="gta-meta-row">
          {/* Mission Timer */}
          <div className={`gta-timer-box ${isLowTime ? 'gta-timer-alert' : ''}`}>
            <span className="gta-timer-label">LIMIT</span>
            <span className="gta-timer-val">{formatTime(mission.timer)}</span>
          </div>

          {/* Survivors Progress Counter */}
          <div className="gta-survivor-counter">
            <span className="gta-survivor-label">SAVED</span>
            <span className="gta-survivor-val">
              <strong style={{ color: '#00ffaa' }}>{mission.survivorsRescued}</strong> / {mission.totalSurvivors}
            </span>
          </div>
        </div>

        {/* Waypoint Distances Tactical Pill */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            padding: '8px 12px',
            marginTop: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <div style={{ color: 'var(--text-muted)', fontSize: '9px', letterSpacing: '1px' }}>
            TACTICAL WAYPOINTS
          </div>
          {survivors.map((s) => {
            const dist = Math.round(getDistance2D(player.position, s.position));
            const isSaved =
              s.status === SURVIVOR_STATUS.STABILIZED ||
              s.status === SURVIVOR_STATUS.EVACUATED;
            const isLocated = s.status === SURVIVOR_STATUS.LOCATED || s.status === SURVIVOR_STATUS.ASSESSMENT;
            const tagColor = isSaved ? '#10b981' : isLocated ? (s.triageColor || '#f59e0b') : '#94a3b8';

            let statusLabel = `${dist}m`;
            if (s.status === SURVIVOR_STATUS.EVACUATED) statusLabel = 'EVACUATED';
            else if (s.status === SURVIVOR_STATUS.STABILIZED) statusLabel = 'STABILIZED';
            else if (isLocated) statusLabel = `LOCATED ${dist}m`;
            else statusLabel = `SIGNAL ${dist}m`;

            return (
              <div
                key={`wp-${s.id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: isSaved ? '#94a3b8' : '#fff'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: tagColor,
                      boxShadow: isSaved ? 'none' : `0 0 6px ${tagColor}`
                    }}
                  />
                  {s.name}
                </span>
                <span style={{ color: tagColor, fontWeight: 700, fontSize: '10px' }}>
                  {statusLabel}
                </span>
              </div>
            );
          })}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: '4px',
              marginTop: '2px',
              color: mission.isExtractionReady ? '#38bdf8' : '#64748b'
            }}
          >
            <span>EVAC HELIPAD</span>
            <span style={{ fontWeight: 700 }}>
              {mission.isExtractionReady ? `${distToEvac}m (ACTIVE)` : `${distToEvac}m (LOCKED)`}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          CENTER: GTA-STYLE CONTEXTUAL INTERACTION PROMPT
         ======================================================== */}
      {interaction.active && (
        <div className="gta-center-prompt">
          <div className="gta-prompt-box">
            <div className="gta-key-badge">E</div>
            <div className="gta-prompt-label">{interaction.promptText}</div>
          </div>
        </div>
      )}

      {/* ========================================================
          BOTTOM-LEFT: GTA-STYLE CIRCULAR MINIMAP & VITALS
         ======================================================== */}
      <div className="gta-bottom-left">
        <div className="gta-radar-outer">
          <div className="gta-radar-glass">
            <div className="gta-radar-cross-h" />
            <div className="gta-radar-cross-v" />
            <div className="gta-radar-ring-inner" />
            <div className="gta-radar-ring-outer" />
            <div className="gta-radar-sweep" />

            {/* Player Center Arrow */}
            <div
              className="gta-player-blip"
              style={{
                transform: `translate(-50%, -50%) rotate(${-(player.rotation + cameraYaw)}rad)`
              }}
            >
              <div className="gta-player-arrow" />
            </div>

            {/* Survivor Radar Blips */}
            {survivors.map((s) => {
              const dx = s.position[0] - player.position[0];
              const dz = s.position[2] - player.position[2];

              const cosY = Math.cos(-cameraYaw);
              const sinY = Math.sin(-cameraYaw);
              const rx = dx * cosY - dz * sinY;
              const rz = dx * sinY + dz * cosY;

              const px = 65 + rx * radarScale;
              const py = 65 + rz * radarScale;

              const distFromCenter = Math.sqrt((px - 65) ** 2 + (py - 65) ** 2);
              if (distFromCenter > 60) return null;

              const isRescued =
                s.status === SURVIVOR_STATUS.STABILIZED ||
                s.status === SURVIVOR_STATUS.EVACUATED;

              return (
                <div
                  key={s.id}
                  className={`gta-radar-blip ${isRescued ? 'blip-green' : 'blip-amber'}`}
                  style={{ left: `${px}px`, top: `${py}px` }}
                  title={`${s.name} (${s.status})`}
                />
              );
            })}

            {/* Evac Helipad Radar Blip */}
            {(() => {
              const dx = evacPos[0] - player.position[0];
              const dz = evacPos[2] - player.position[2];

              const cosY = Math.cos(-cameraYaw);
              const sinY = Math.sin(-cameraYaw);
              const rx = dx * cosY - dz * sinY;
              const rz = dx * sinY + dz * cosY;

              const px = 65 + rx * radarScale;
              const py = 65 + rz * radarScale;
              const distFromCenter = Math.sqrt((px - 65) ** 2 + (py - 65) ** 2);
              if (distFromCenter > 60) return null;

              return (
                <div
                  className="gta-radar-blip blip-evac"
                  style={{ left: `${px}px`, top: `${py}px` }}
                  title="Helipad LZ"
                />
              );
            })()}
          </div>
        </div>

        {/* Dual Vitals Horizontal Bars Below Radar - Fully visible, never clipped */}
        <div className="gta-vitals-container">
          <div className="gta-vitals-item">
            <div className="gta-vitals-label-row">
              <span>SUIT INTEGRITY</span>
              <span style={{ color: player.health < 30 ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                {Math.round(player.health)}%
              </span>
            </div>
            <div className="gta-bar-wrapper">
              <div className="gta-bar-fill gta-bar-health" style={{ width: `${player.health}%` }} />
            </div>
          </div>

          <div className="gta-vitals-item">
            <div className="gta-vitals-label-row">
              <span>EXO-STAMINA</span>
              <span style={{ color: '#0ea5e9', fontWeight: 700 }}>
                {Math.round(player.stamina)}%
              </span>
            </div>
            <div className="gta-bar-wrapper">
              <div className="gta-bar-fill gta-bar-stamina" style={{ width: `${player.stamina}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          BOTTOM-RIGHT: GTA-STYLE INVENTORY SLOTS
         ======================================================== */}
      <div className="gta-bottom-right">
        <div className="gta-gear-cluster">
          <div className="gta-gear-slot">
            <span className="gta-gear-tag">MED</span>
            <span className="gta-gear-qty">{supplies.medkits}</span>
          </div>
          <div className="gta-gear-divider" />
          <div className="gta-gear-slot">
            <span className="gta-gear-tag">O2</span>
            <span className="gta-gear-qty">{supplies.oxygen}</span>
          </div>
          <div className="gta-gear-divider" />
          <div className="gta-gear-slot">
            <span className="gta-gear-tag">TOOL</span>
            <span className="gta-gear-qty">{supplies.toolkits}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
