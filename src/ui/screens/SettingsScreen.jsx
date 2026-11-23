import React, { useState, useEffect } from 'react';
import '../../styles/ui.css';
import Button from '../components/Button';
import SectionLabel from '../components/SectionLabel';
import {
  Sliders,
  Volume2,
  VolumeX,
  Compass,
  Monitor,
  Eye,
  ArrowLeft,
  RotateCcw,
  Check
} from 'lucide-react';

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  masterVolume: 80,
  sfxVolume: 85,
  musicVolume: 70,
  sensitivity: 1.0,
  graphicsQuality: 'ultra', // 'cinematic' | 'ultra' | 'high' | 'medium'
  uiScale: 100 // %
};

/**
 * AFTERLIGHT — Tactical Settings Screen
 * Operates purely locally with localStorage persistence; no backend needed.
 */
export default function SettingsScreen({ onBack = null }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('afterlight_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_SETTINGS;
  });

  const [savedNotification, setSavedNotification] = useState(false);

  const updateSetting = (key, val) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: val };
      try {
        localStorage.setItem('afterlight_settings', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleReset = () => {
    try {
      localStorage.removeItem('afterlight_settings');
    } catch (e) {}
    setSettings(DEFAULT_SETTINGS);
  };

  const handleSaveAndBack = () => {
    setSavedNotification(true);
    setTimeout(() => {
      if (typeof onBack === 'function') onBack();
    }, 200);
  };

  return (
    <div className="al-settings-overlay" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="al-panel al-settings-card al-animate-fade-in">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(241, 241, 237, 0.08)',
          paddingBottom: '14px',
          marginBottom: '20px'
        }}>
          <div>
            <SectionLabel icon={Sliders} color="orange">
              CONFIGURATION MATRIX // LOCAL PREFERENCES
            </SectionLabel>
            <h2 id="settings-title" className="al-settings-title">
              FIELD SETTINGS
            </h2>
          </div>

          {onBack && (
            <Button variant="secondary" onClick={onBack} style={{ padding: '8px 16px', fontSize: '11px' }}>
              <ArrowLeft size={14} /> BACK
            </Button>
          )}
        </div>

        {/* Settings Body */}
        <div className="al-settings-body">
          {/* Audio Section */}
          <div className="al-settings-group">
            <div className="al-settings-group-header">
              <span className="al-hud-label">AUDIO CHANNELS</span>
              <button
                type="button"
                onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                className="al-settings-toggle-btn"
              >
                {settings.soundEnabled ? <Volume2 size={14} className="al-text-blue" /> : <VolumeX size={14} className="al-text-danger" />}
                <span>{settings.soundEnabled ? 'SOUND: ON' : 'MUTED'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div className="al-settings-slider-row">
                  <span>Master Volume</span>
                  <span className="al-text-orange">{settings.masterVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.masterVolume}
                  disabled={!settings.soundEnabled}
                  onChange={(e) => updateSetting('masterVolume', Number(e.target.value))}
                  className="al-settings-slider"
                />
              </div>

              <div>
                <div className="al-settings-slider-row">
                  <span>SFX & Interaction Audio</span>
                  <span className="al-text-orange">{settings.sfxVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sfxVolume}
                  disabled={!settings.soundEnabled}
                  onChange={(e) => updateSetting('sfxVolume', Number(e.target.value))}
                  className="al-settings-slider"
                />
              </div>
            </div>
          </div>

          {/* Controls Sensitivity */}
          <div className="al-settings-group">
            <div className="al-settings-group-header">
              <span className="al-hud-label">INPUT & CAMERA CONTROL</span>
              <span className="al-text-blue" style={{ fontFamily: 'var(--al-font-mono)', fontSize: '11px' }}>
                {settings.sensitivity.toFixed(1)}x
              </span>
            </div>

            <div>
              <div className="al-settings-slider-row">
                <span>Look / Orbit Sensitivity</span>
                <span>{settings.sensitivity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={settings.sensitivity}
                onChange={(e) => updateSetting('sensitivity', parseFloat(e.target.value))}
                className="al-settings-slider"
              />
            </div>
          </div>

          {/* Graphics Quality */}
          <div className="al-settings-group">
            <div className="al-hud-label" style={{ marginBottom: '8px' }}>
              GRAPHICS FIDELITY PRESET
            </div>

            <div className="al-settings-preset-grid">
              {['medium', 'high', 'ultra', 'cinematic'].map((preset) => {
                const isSelected = settings.graphicsQuality === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => updateSetting('graphicsQuality', preset)}
                    className={`al-settings-preset-btn ${isSelected ? 'al-settings-preset-active' : ''}`}
                  >
                    {preset.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* UI Scale */}
          <div className="al-settings-group">
            <div className="al-settings-group-header">
              <span className="al-hud-label">INTERFACE & SCALING</span>
              <span className="al-text-orange" style={{ fontFamily: 'var(--al-font-mono)', fontSize: '11px' }}>
                {settings.uiScale}%
              </span>
            </div>

            <div>
              <div className="al-settings-slider-row">
                <span>HUD Display Scale</span>
                <span>{settings.uiScale}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="120"
                step="5"
                value={settings.uiScale}
                onChange={(e) => updateSetting('uiScale', Number(e.target.value))}
                className="al-settings-slider"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(241, 241, 237, 0.08)',
          paddingTop: '16px'
        }}>
          <Button variant="secondary" onClick={handleReset} style={{ fontSize: '11px' }}>
            <RotateCcw size={14} /> RESET DEFAULTS
          </Button>

          <Button variant="primary" onClick={handleSaveAndBack}>
            <Check size={16} /> SAVE & RETURN
          </Button>
        </div>
      </div>
    </div>
  );
}
