import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { formatTime } from '../../utils/helpers';
import { GameConfig } from '../../game/GameConfig';
import { SURVIVOR_STATUS } from '../../utils/constants';

export default function HUD() {
  const mission = useGameStore((state) => state.mission);
  const player = useGameStore((state) => state.player);
  const supplies = useGameStore((state) => state.supplies);
  const survivors = useGameStore((state) => state.survivors);
  const interaction = useGameStore((state) => state.interaction);
  const cameraYaw = useGameStore((state) => state.cameraRotation.yaw);

  const isLowTime = mission.timer <= 60;
  const radarScale = 0.95; // meters to radar pixels

  return (
    <div className="gta-hud-root">
      {/* ========================================================
          1. TOP-RIGHT: GTA-STYLE SLEEK OBJECTIVE & CLOCK CLUSTER
         ======================================================== */}
      <div className="gta-top-right">
        {/* Mission Objective Card */}
        <div className="gta-objective-card">
          <div className="gta-objective-header">
            <span className="gta-badge-amber">SECTOR 4-B</span>
            <span className="gta-objective-title">{mission.codename}</span>
          </div>
          <div className="gta-objective-text">{mission.currentObjective}</div>
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
      </div>

      {/* ========================================================
          2. CENTER: GTA-STYLE CONTEXTUAL INTERACTION PROMPT
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
          3. BOTTOM-LEFT: GTA-STYLE CIRCULAR MINIMAP & VITALS
         ======================================================== */}
      <div className="gta-bottom-left">
        {/* Circular Radar Disk */}
        <div className="gta-radar-outer">
          <div className="gta-radar-glass">
            {/* Radar Grid Cross & Range Rings */}
            <div className="gta-radar-cross-h" />
            <div className="gta-radar-cross-v" />
            <div className="gta-radar-ring-inner" />
            <div className="gta-radar-ring-outer" />

            {/* Radar Sweep Effect */}
            <div className="gta-radar-sweep" />

            {/* Player Center Arrow (Rotating with player facing direction relative to camera) */}
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

              // Rotate relative to camera yaw
              const cosY = Math.cos(-cameraYaw);
              const sinY = Math.sin(-cameraYaw);
              const rx = dx * cosY - dz * sinY;
              const rz = dx * sinY + dz * cosY;

              const px = 65 + rx * radarScale;
              const py = 65 + rz * radarScale;

              // Clamp to radar radius
              const distFromCenter = Math.sqrt((px - 65) ** 2 + (py - 65) ** 2);
              if (distFromCenter > 60) return null;

              const isRescued = s.status === SURVIVOR_STATUS.RESCUED;

              return (
                <div
                  key={s.id}
                  className={`gta-radar-blip ${isRescued ? 'blip-green' : 'blip-amber'}`}
                  style={{ left: `${px}px`, top: `${py}px` }}
                />
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
              if (distFromCenter > 60) return null;

              return (
                <div
                  className="gta-radar-blip blip-evac"
                  style={{ left: `${px}px`, top: `${py}px` }}
                />
              );
            })()}
          </div>
        </div>

        {/* GTA-Style Dual Vitals Horizontal Bars Below Radar */}
        <div className="gta-vitals-container">
          {/* Health / Suit Integrity Bar */}
          <div className="gta-bar-wrapper">
            <div className="gta-bar-track">
              <div
                className="gta-bar-fill gta-bar-health"
                style={{ width: `${player.health}%` }}
              />
            </div>
          </div>

          {/* Exo-Stamina Bar */}
          <div className="gta-bar-wrapper">
            <div className="gta-bar-track">
              <div
                className="gta-bar-fill gta-bar-stamina"
                style={{ width: `${player.stamina}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. BOTTOM-RIGHT: GTA-STYLE INVENTORY SLOTS
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
