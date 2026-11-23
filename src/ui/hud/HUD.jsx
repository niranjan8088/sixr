import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { formatTime, getDistance2D } from '../../utils/helpers';
import { GameConfig } from '../../game/GameConfig';
import { SURVIVOR_STATUS } from '../../utils/constants';
import '../../styles/ui.css';
import {
  Shield,
  Clock,
  Users,
  Package,
  Heart,
  Zap,
  Radio,
  Crosshair,
  AlertTriangle
} from 'lucide-react';

/**
 * AFTERLIGHT — AAA Cinematic Gameplay HUD (Step 2 UI Upgrade)
 * Premium tactical survival rescue HUD:
 * - Dark charcoal translucent panels
 * - Emergency orange accents
 * - Cold cyan vitals & technology indicators
 * - Critical red warnings
 * - Clean typography & spacious layout preserving the 3D world view
 */
export default function HUD() {
  const mission = useGameStore((state) => state.mission);
  const player = useGameStore((state) => state.player);
  const supplies = useGameStore((state) => state.supplies);
  const survivors = useGameStore((state) => state.survivors);
  const interaction = useGameStore((state) => state.interaction);
  const cameraYaw = useGameStore((state) => state.cameraRotation.yaw);

  const isLowTime = mission.timer <= 60;
  const isCriticalTime = mission.timer <= 30;

  // Radar scale factor (meters to radar pixels)
  const radarScale = 0.85;

  return (
    <div className="al-hud-container">
      {/* ================= 1. TOP BAR ================= */}
      <div className="al-hud-top">
        {/* Top-Left: Mission Objective Panel */}
        <div className="al-hud-panel al-hud-objective">
          <div className="al-hud-objective-tag">
            <Radio size={12} className="al-text-orange" />
            <span>MISSION DIRECTIVE // SECTOR 4-B</span>
          </div>
          <div className="al-hud-objective-text">
            {mission.currentObjective}
          </div>
        </div>

        {/* Top-Center: Tactical Mission Countdown Timer */}
        <div className={`al-hud-panel al-hud-timer ${isLowTime ? 'al-hud-timer-critical' : ''}`}>
          <Clock
            size={18}
            color={isLowTime ? 'var(--al-color-red)' : 'var(--al-color-orange)'}
          />
          <div>
            <div className="al-hud-timer-label">
              {isCriticalTime ? 'CRITICAL EVAC TIMEOUT' : 'TIME REMAINING'}
            </div>
            <div
              className="al-hud-timer-value"
              style={{ color: isLowTime ? 'var(--al-color-red)' : 'var(--al-color-text)' }}
            >
              {formatTime(mission.timer)}
            </div>
          </div>
        </div>

        {/* Top-Right: Tactical Radar & Survivor Counter */}
        <div className="al-hud-top-right">
          {/* Tactical Circular Radar */}
          <div className="al-hud-radar-frame">
            {/* Range Crosshairs */}
            <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(255, 107, 36, 0.18)' }} />
            <div style={{ position: 'absolute', top: 0, left: '50%', width: '1px', height: '100%', background: 'rgba(255, 107, 36, 0.18)' }} />
            <div style={{ position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%', borderRadius: '50%', border: '1px dashed rgba(255, 107, 36, 0.2)' }} />

            {/* Rotating Tactical Radar Sweep */}
            <div className="al-hud-radar-sweep" />

            {/* Center Player Blip (Cold Cyan) */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '7px',
              height: '7px',
              background: 'var(--al-color-blue)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 8px var(--al-color-blue)',
              zIndex: 3
            }} />

            {/* Survivor Blips */}
            {survivors.map((s) => {
              const dx = s.position[0] - player.position[0];
              const dz = s.position[2] - player.position[2];

              // Rotate relative to camera yaw
              const cosY = Math.cos(-cameraYaw);
              const sinY = Math.sin(-cameraYaw);
              const rx = dx * cosY - dz * sinY;
              const rz = dx * sinY + dz * cosY;

              const px = 63 + rx * radarScale;
              const py = 63 + rz * radarScale;

              // Only render within circular radar perimeter
              const distFromCenter = Math.sqrt((px - 63) ** 2 + (py - 63) ** 2);
              if (distFromCenter > 56) return null;

              const isRescued = s.status === SURVIVOR_STATUS.RESCUED;

              return (
                <div
                  key={s.id}
                  style={{
                    position: 'absolute',
                    left: `${px}px`,
                    top: `${py}px`,
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: isRescued ? 'var(--al-color-blue)' : 'var(--al-color-orange)',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: `0 0 7px ${isRescued ? 'var(--al-color-blue)' : 'var(--al-color-orange)'}`,
                    zIndex: 2
                  }}
                />
              );
            })}

            {/* Evac Helipad Beacon Blip */}
            {(() => {
              const evacPos = GameConfig.mission.extractionZone.position;
              const dx = evacPos[0] - player.position[0];
              const dz = evacPos[2] - player.position[2];

              const cosY = Math.cos(-cameraYaw);
              const sinY = Math.sin(-cameraYaw);
              const rx = dx * cosY - dz * sinY;
              const rz = dx * sinY + dz * cosY;

              const px = 63 + rx * radarScale;
              const py = 63 + rz * radarScale;
              const distFromCenter = Math.sqrt((px - 63) ** 2 + (py - 63) ** 2);
              if (distFromCenter > 56) return null;

              return (
                <div
                  style={{
                    position: 'absolute',
                    left: `${px}px`,
                    top: `${py}px`,
                    width: '8px',
                    height: '8px',
                    background: mission.isExtractionReady ? 'var(--al-color-orange)' : 'rgba(255, 107, 36, 0.4)',
                    borderRadius: '2px',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: mission.isExtractionReady ? '0 0 10px var(--al-color-orange)' : 'none',
                    zIndex: 2
                  }}
                />
              );
            })()}
          </div>

          {/* Survivors Saved Counter Badge */}
          <div className="al-hud-panel al-hud-survivors-pill">
            <Users size={14} className="al-text-orange" />
            <span>
              SURVIVORS:{' '}
              <strong style={{ color: 'var(--al-color-blue)' }}>
                {mission.survivorsRescued}
              </strong>{' '}
              / {mission.totalSurvivors}
            </span>
          </div>
        </div>
      </div>

      {/* ================= 2. CENTER SECTION ================= */}
      <div className="al-hud-center">
        {/* Minimal Tactical Center Reticle */}
        <div className="al-hud-reticle" />

        {/* Contextual Interaction Prompt [E] */}
        {interaction.active && (
          <div className="al-hud-panel al-hud-prompt">
            <div className="al-hud-prompt-keycap">E</div>
            <div className="al-hud-prompt-label">
              {interaction.promptText}
            </div>
            {interaction.distance !== undefined && interaction.distance < 900 && (
              <div style={{
                fontFamily: 'var(--al-font-mono)',
                fontSize: '11px',
                color: 'var(--al-color-blue)',
                paddingLeft: '8px',
                borderLeft: '1px solid rgba(241, 241, 237, 0.15)'
              }}>
                {Math.round(interaction.distance * 10) / 10}M
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= 3. BOTTOM BAR ================= */}
      <div className="al-hud-bottom">
        {/* Bottom-Left: Player Responder Vitals */}
        <div className="al-hud-panel al-hud-vitals">
          <div className="al-hud-vitals-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={13} className="al-text-blue" />
              <span>RESPONDER VITALS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--al-color-blue)' }}>
              <Heart size={11} />
              <span>STABLE</span>
            </div>
          </div>

          <div className="al-hud-gauge-group">
            {/* Suit Integrity (Cold Cyan) */}
            <div>
              <div className="al-hud-gauge-row">
                <span style={{ color: 'var(--al-color-text-muted)' }}>SUIT INTEGRITY</span>
                <span style={{ color: 'var(--al-color-blue)', fontWeight: 700 }}>{player.health || 100}%</span>
              </div>
              <div className="al-hud-gauge-bar">
                <div
                  className="al-hud-gauge-fill-cyan"
                  style={{ width: `${player.health || 100}%` }}
                />
              </div>
            </div>

            {/* Exo-Stamina (Emergency Orange / Danger) */}
            <div>
              <div className="al-hud-gauge-row">
                <span style={{ color: 'var(--al-color-text-muted)' }}>EXO STAMINA</span>
                <span style={{ color: 'var(--al-color-orange)', fontWeight: 700 }}>
                  {Math.round(player.stamina)}%
                </span>
              </div>
              <div className="al-hud-gauge-bar">
                <div
                  className="al-hud-gauge-fill-stamina"
                  style={{ width: `${player.stamina}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom-Right: Field Supplies Inventory */}
        <div className="al-hud-panel al-hud-inventory">
          {/* Medkits (Cold Cyan) */}
          <div className="al-hud-inv-slot">
            <div
              className="al-hud-inv-dot"
              style={{
                background: supplies.medkits > 0 ? 'var(--al-color-blue)' : 'var(--al-color-red)',
                boxShadow: supplies.medkits > 0 ? '0 0 6px var(--al-color-blue)' : 'none'
              }}
            />
            <div>
              <div className="al-hud-inv-label">MEDKITS</div>
              <div
                className="al-hud-inv-count"
                style={{ color: supplies.medkits > 0 ? 'var(--al-color-text)' : 'var(--al-color-red)' }}
              >
                {supplies.medkits}
              </div>
            </div>
          </div>

          <div className="al-hud-inv-divider" />

          {/* O2 Cells (Cold Cyan) */}
          <div className="al-hud-inv-slot">
            <div
              className="al-hud-inv-dot"
              style={{
                background: supplies.oxygen > 0 ? 'var(--al-color-blue)' : 'var(--al-color-red)',
                boxShadow: supplies.oxygen > 0 ? '0 0 6px var(--al-color-blue)' : 'none'
              }}
            />
            <div>
              <div className="al-hud-inv-label">O2 CELLS</div>
              <div
                className="al-hud-inv-count"
                style={{ color: supplies.oxygen > 0 ? 'var(--al-color-text)' : 'var(--al-color-red)' }}
              >
                {supplies.oxygen}
              </div>
            </div>
          </div>

          <div className="al-hud-inv-divider" />

          {/* Toolkits (Emergency Orange) */}
          <div className="al-hud-inv-slot">
            <div
              className="al-hud-inv-dot"
              style={{
                background: supplies.toolkits > 0 ? 'var(--al-color-orange)' : 'var(--al-color-red)',
                boxShadow: supplies.toolkits > 0 ? '0 0 6px var(--al-color-orange)' : 'none'
              }}
            />
            <div>
              <div className="al-hud-inv-label">TOOLKITS</div>
              <div
                className="al-hud-inv-count"
                style={{ color: supplies.toolkits > 0 ? 'var(--al-color-text)' : 'var(--al-color-red)' }}
              >
                {supplies.toolkits}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
