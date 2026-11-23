import React from 'react';
import '../../styles/ui.css';
import {
  Users,
  HeartPulse,
  Package,
  Navigation,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Radio
} from 'lucide-react';

/**
 * AFTERLIGHT — Cinematic Mission Briefing Screen (Step 3)
 * Dark charcoal tactical dossier aesthetic with emergency orange accents
 * and cold cyan technology indicators.
 */
export default function BriefingScreen({ onDeploy, onBack }) {
  const handleDeploy = () => {
    if (typeof onDeploy === 'function') {
      onDeploy();
    }
  };

  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
    }
  };

  return (
    <div className="al-briefing-container">
      {/* 1. Atmospheric Disaster Backdrop */}
      <div className="al-briefing-bg" />

      {/* 2. Tactical Briefing Card Dossier */}
      <div className="al-briefing-card" role="region" aria-labelledby="briefing-title">
        {/* Top Metadata Row */}
        <div className="al-briefing-meta-row">
          <div className="al-briefing-badge-group">
            <span className="al-briefing-mission-num">MISSION 01</span>
            <span className="al-briefing-sector">SECTOR 4-B</span>
          </div>

          <div className="al-briefing-status">
            <div className="al-briefing-status-dot" />
            <span>OPERATION ACTIVE</span>
          </div>
        </div>

        {/* Grand Cinematic Mission Title */}
        <h1 id="briefing-title" className="al-briefing-title">
          AFTER THE COLLAPSE
        </h1>

        {/* Story Narrative Block */}
        <div className="al-briefing-story">
          A structural collapse has trapped civilians inside the disaster zone.
          Emergency communication is unstable. Locate survivors, stabilize
          casualties, and reach extraction before time expires.
        </div>

        {/* Tactical Objectives Section */}
        <div style={{ marginBottom: '20px' }}>
          <div className="al-briefing-label">
            <Radio size={12} className="al-text-orange" />
            <span>PRIMARY MISSION DIRECTIVES</span>
          </div>

          <div className="al-briefing-objectives-grid">
            <div className="al-briefing-obj-item">
              <Users size={16} className="al-briefing-obj-icon" />
              <span>Locate 3 survivors</span>
            </div>

            <div className="al-briefing-obj-item">
              <HeartPulse size={16} className="al-briefing-obj-icon" />
              <span>Stabilize trapped civilians</span>
            </div>

            <div className="al-briefing-obj-item">
              <Package size={16} className="al-briefing-obj-icon" />
              <span>Manage medical supplies</span>
            </div>

            <div className="al-briefing-obj-item">
              <Navigation size={16} className="al-briefing-obj-icon" />
              <span>Reach extraction</span>
            </div>
          </div>
        </div>

        {/* Dispatch Resource Display */}
        <div>
          <div className="al-briefing-label">
            <Package size={12} className="al-text-orange" />
            <span>FIELD RESOURCE ALLOTMENT</span>
          </div>

          <div className="al-briefing-resources">
            <div className="al-briefing-res-card">
              <div className="al-briefing-res-label">Medkits</div>
              <div className="al-briefing-res-val al-text-blue">3</div>
            </div>

            <div className="al-briefing-res-card">
              <div className="al-briefing-res-label">Cells</div>
              <div className="al-briefing-res-val al-text-blue">2</div>
            </div>

            <div className="al-briefing-res-card">
              <div className="al-briefing-res-label">Toolkits</div>
              <div className="al-briefing-res-val al-text-orange">2</div>
            </div>
          </div>
        </div>

        {/* Action Button Navigation */}
        <div className="al-briefing-actions">
          <button
            type="button"
            className="al-briefing-btn-back"
            onClick={handleBack}
          >
            <ArrowLeft size={16} /> BACK
          </button>

          <button
            type="button"
            className="al-briefing-btn-deploy"
            onClick={handleDeploy}
          >
            DEPLOY <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
