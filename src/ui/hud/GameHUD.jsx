import React, { useMemo } from 'react';
import '../../styles/ui.css';
import { useGameStore } from '../../store/gameStore';
import { formatTime, getDistance2D } from '../../utils/helpers';
import { GameConfig } from '../../game/GameConfig';
import { SURVIVOR_STATUS } from '../../utils/constants';
import ProgressBar from '../components/ProgressBar';
import Toast from '../components/Toast';
import {
  Shield,
  Clock,
  Users,
  Package,
  Heart,
  Zap,
  Radio,
  Pause,
  Compass,
  AlertTriangle,
  Navigation
} from 'lucide-react';

/**
 * AFTERLIGHT — Full Cinematic GameHUD
 * Displays all responder vitals, objective tracker, compass, radar,
 * medical supplies, interactive pause trigger, and danger toasts.
 */
export default function GameHUD({
  gameData = null,
  onPause = null,
  onInteract = null
}) {
  // Read from shared store as fallback or complement
  const storeMission = useGameStore((state) => state.mission);
  const storePlayer = useGameStore((state) => state.player);
  const storeSupplies = useGameStore((state) => state.supplies);
  const storeSurvivors = useGameStore((state) => state.survivors);
  const storeInteraction = useGameStore((state) => state.interaction);
  const cameraYaw = useGameStore((state) => state.cameraRotation?.yaw || 0);
  const storeTogglePause = useGameStore((state) => state.togglePause);
  const storeNotification = useGameStore((state) => state.notification);

  // Safe data resolution (props take precedence when provided)
  const health = gameData?.health !== undefined ? gameData.health : (storePlayer.health || 100);
  const stamina = gameData?.stamina !== undefined ? gameData.stamina : (storePlayer.stamina || 100);
  const survivorsRescued = gameData?.survivors !== undefined ? gameData.survivors : storeMission.survivorsRescued;
  const totalSurvivors = gameData?.totalSurvivors !== undefined ? gameData.totalSurvivors : storeMission.totalSurvivors;
  const timer = gameData?.timer !== undefined ? gameData.timer : storeMission.timer;
  const objective = gameData?.objective || storeMission.currentObjective;
  const supplies = gameData?.supplies || storeSupplies;
  const interaction = gameData?.interaction || storeInteraction;
  const notification = gameData?.notification || storeNotification;

  const isLowTime = timer <= 60;
  const isCriticalTime = timer <= 30;

  // Compass degrees (0-360) based on camera yaw
  const compassDeg = useMemo(() => {
    let deg = (cameraYaw * 180) / Math.PI;
    deg = ((deg % 360) + 360) % 360;
    return Math.round(deg);
  }, [cameraYaw]);

  const handlePause = () => {
    if (typeof onPause === 'function') {
      onPause();
    } else {
      storeTogglePause();
    }
  };

  const radarScale = 0.85;

  return (
    <div className="al-hud-container">
      {/* Danger Notifications Stack (Top Center) */}
      {notification && (
        <div style={{
          position: 'absolute',
          top: '64px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          pointerEvents: 'none'
        }}>
          <Toast
            title={notification.type === 'error' ? 'CRITICAL DANGER' : 'TACTICAL ADVISORY'}
            message={notification.text || notification.message || ''}
            type={notification.type === 'error' ? 'danger' : 'warning'}
          />
        </div>
      )}

      {/* ================= 1. TOP BAR ================= */}
      <div className="al-hud-top">
        {/* Top-Left: Objective Tracker */}
        <div className="al-hud-panel al-hud-objective">
          <div className="al-hud-objective-tag">
            <Radio size={12} className="al-text-orange" />
            <span>DIRECTIVE // SECTOR 4-B</span>
          </div>
          <div className="al-hud-objective-text">
            {objective}
          </div>
        </div>

        {/* Top-Center: 360° Compass Ribbon & Digital Timer */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          {/* Compass Bar */}
          <div className="al-hud-compass-bar">
            <div className="al-hud-compass-marker" />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              fontFamily: 'var(--al-font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--al-color-text-muted)'
            }}>
              <span>{compassDeg}°</span>
              <span className="al-text-orange">
                {compassDeg >= 337 || compassDeg < 23 ? 'N' :
                 compassDeg < 68 ? 'NE' :
                 compassDeg < 113 ? 'E' :
                 compassDeg < 158 ? 'SE' :
                 compassDeg < 203 ? 'S' :
                 compassDeg < 248 ? 'SW' :
                 compassDeg < 293 ? 'W' : 'NW'}
              </span>
            </div>
          </div>

          {/* Mission Timer */}
          <div className={`al-hud-panel al-hud-timer ${isLowTime ? 'al-hud-timer-critical' : ''}`}>
            <Clock
              size={18}
              color={isLowTime ? 'var(--al-color-red)' : 'var(--al-color-orange)'}
            />
            <div>
              <div className="al-hud-timer-label">
                {isCriticalTime ? 'CRITICAL TIMEOUT' : 'REMAINING TIME'}
              </div>
              <div
                className="al-hud-timer-value"
                style={{ color: isLowTime ? 'var(--al-color-red)' : 'var(--al-color-text)' }}
              >
                {formatTime(timer)}
              </div>
            </div>
          </div>
        </div>

        {/* Top-Right: Radar, Survivor Count & Pause Button */}
        <div className="al-hud-top-right">
          {/* Pause Trigger Button */}
          <button
            type="button"
            className="al-hud-pause-btn"
            onClick={handlePause}
            aria-label="Pause game"
            style={{ pointerEvents: 'auto' }}
          >
            <Pause size={14} className="al-text-orange" />
            <span>PAUSE [ESC]</span>
          </button>

          {/* Tactical Radar Frame */}
          <div className="al-hud-radar-frame">
            <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(255, 107, 36, 0.18)' }} />
            <div style={{ position: 'absolute', top: 0, left: '50%', width: '1px', height: '100%', background: 'rgba(255, 107, 36, 0.18)' }} />
            <div style={{ position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%', borderRadius: '50%', border: '1px dashed rgba(255, 107, 36, 0.2)' }} />

            <div className="al-hud-radar-sweep" />

            {/* Player Center Blip */}
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

            {/* Survivor Radar Blips */}
            {storeSurvivors.map((s) => {
              const dx = s.position[0] - storePlayer.position[0];
              const dz = s.position[2] - storePlayer.position[2];

              const cosY = Math.cos(-cameraYaw);
              const sinY = Math.sin(-cameraYaw);
              const rx = dx * cosY - dz * sinY;
              const rz = dx * sinY + dz * cosY;

              const px = 63 + rx * radarScale;
              const py = 63 + rz * radarScale;

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
          </div>

          {/* Survivor Status Counter */}
          <div className="al-hud-panel al-hud-survivors-pill">
            <Users size={14} className="al-text-orange" />
            <span>
              SURVIVORS:{' '}
              <strong style={{ color: 'var(--al-color-blue)' }}>
                {survivorsRescued}
              </strong>{' '}
              / {totalSurvivors}
            </span>
          </div>
        </div>
      </div>

      {/* ================= 2. CENTER: RETICLE & INTERACTION ================= */}
      <div className="al-hud-center">
        <div className="al-hud-reticle" />

        {/* Interaction Banner */}
        {interaction && interaction.active && (
          <div
            className="al-hud-panel al-hud-prompt"
            onClick={onInteract}
            style={{ cursor: onInteract ? 'pointer' : 'default' }}
          >
            <div className="al-hud-prompt-keycap">E</div>
            <div className="al-hud-prompt-label">
              {interaction.promptText || 'INTERACT WITH SURVIVOR'}
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

      {/* ================= 3. BOTTOM BAR: VITALS & SUPPLIES ================= */}
      <div className="al-hud-bottom">
        {/* Bottom-Left: Responder Health & Vitals Bar */}
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
            <ProgressBar
              label="SUIT INTEGRITY"
              value={health}
              max={100}
              color="cyan"
              height={5}
            />

            <ProgressBar
              label="EXO STAMINA"
              value={stamina}
              max={100}
              color="orange"
              height={5}
            />
          </div>
        </div>

        {/* Bottom-Right: Medical Supplies Inventory */}
        <div className="al-hud-panel al-hud-inventory">
          {/* Medkits */}
          <div className="al-hud-inv-slot">
            <div
              className="al-hud-inv-dot"
              style={{
                background: (supplies?.medkits || 0) > 0 ? 'var(--al-color-blue)' : 'var(--al-color-red)',
                boxShadow: (supplies?.medkits || 0) > 0 ? '0 0 6px var(--al-color-blue)' : 'none'
              }}
            />
            <div>
              <div className="al-hud-inv-label">MEDKITS</div>
              <div
                className="al-hud-inv-count"
                style={{ color: (supplies?.medkits || 0) > 0 ? 'var(--al-color-text)' : 'var(--al-color-red)' }}
              >
                {supplies?.medkits || 0}
              </div>
            </div>
          </div>

          <div className="al-hud-inv-divider" />

          {/* O2 Cells */}
          <div className="al-hud-inv-slot">
            <div
              className="al-hud-inv-dot"
              style={{
                background: (supplies?.oxygen || 0) > 0 ? 'var(--al-color-blue)' : 'var(--al-color-red)',
                boxShadow: (supplies?.oxygen || 0) > 0 ? '0 0 6px var(--al-color-blue)' : 'none'
              }}
            />
            <div>
              <div className="al-hud-inv-label">CELLS</div>
              <div
                className="al-hud-inv-count"
                style={{ color: (supplies?.oxygen || 0) > 0 ? 'var(--al-color-text)' : 'var(--al-color-red)' }}
              >
                {supplies?.oxygen || 0}
              </div>
            </div>
          </div>

          <div className="al-hud-inv-divider" />

          {/* Toolkits */}
          <div className="al-hud-inv-slot">
            <div
              className="al-hud-inv-dot"
              style={{
                background: (supplies?.toolkits || 0) > 0 ? 'var(--al-color-orange)' : 'var(--al-color-red)',
                boxShadow: (supplies?.toolkits || 0) > 0 ? '0 0 6px var(--al-color-orange)' : 'none'
              }}
            />
            <div>
              <div className="al-hud-inv-label">TOOLKITS</div>
              <div
                className="al-hud-inv-count"
                style={{ color: (supplies?.toolkits || 0) > 0 ? 'var(--al-color-text)' : 'var(--al-color-red)' }}
              >
                {supplies?.toolkits || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
