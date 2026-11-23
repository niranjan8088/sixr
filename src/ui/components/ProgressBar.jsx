import React from 'react';
import '../../styles/ui.css';

/**
 * AFTERLIGHT Progress & Gauge Bar
 * Supports cold cyan (health/integrity), emergency orange (stamina/heat), and red (danger).
 */
export default function ProgressBar({
  value = 100, // 0 to 100
  max = 100,
  label = '',
  color = 'cyan', // 'cyan' | 'orange' | 'danger'
  showValue = true,
  height = 6,
  style = {},
  className = ''
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  let fillStyle = {
    height: '100%',
    width: `${percentage}%`,
    transition: 'width 0.15s ease-out',
    borderRadius: '1px'
  };

  if (color === 'orange') {
    fillStyle.background = 'linear-gradient(90deg, #D94C45, #FF6B24)';
    fillStyle.boxShadow = '0 0 8px rgba(255, 107, 36, 0.4)';
  } else if (color === 'danger') {
    fillStyle.background = 'linear-gradient(90deg, #8B1E1E, #D94C45)';
    fillStyle.boxShadow = '0 0 8px rgba(217, 76, 69, 0.5)';
  } else {
    // cold cyan
    fillStyle.background = 'linear-gradient(90deg, #50A0C0, #82C8E9)';
    fillStyle.boxShadow = '0 0 8px rgba(130, 200, 233, 0.4)';
  }

  return (
    <div className={`al-progress-wrapper ${className}`} style={{ width: '100%', ...style }}>
      {(label || showValue) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--al-font-mono)',
          fontSize: '11px',
          marginBottom: '4px'
        }}>
          {label && <span style={{ color: 'var(--al-color-text-muted)' }}>{label}</span>}
          {showValue && (
            <span style={{
              fontWeight: 700,
              color: color === 'orange' ? 'var(--al-color-orange)' : color === 'danger' ? 'var(--al-color-red)' : 'var(--al-color-blue)'
            }}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div style={{
        width: '100%',
        height: `${height}px`,
        background: 'rgba(241, 241, 237, 0.08)',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={fillStyle} />
      </div>
    </div>
  );
}
