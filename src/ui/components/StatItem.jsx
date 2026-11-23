import React from 'react';
import '../../styles/ui.css';

/**
 * AFTERLIGHT Tactical Stat Item Box
 */
export default function StatItem({
  label = '',
  value = '',
  icon: Icon = null,
  accentColor = 'text', // 'orange' | 'blue' | 'red' | 'text'
  style = {},
  className = ''
}) {
  let valColor = 'var(--al-color-text)';
  if (accentColor === 'orange') valColor = 'var(--al-color-orange)';
  if (accentColor === 'blue') valColor = 'var(--al-color-blue)';
  if (accentColor === 'red') valColor = 'var(--al-color-red)';

  return (
    <div
      className={`al-stat-box ${className}`}
      style={{
        background: 'rgba(241, 241, 237, 0.03)',
        border: '1px solid rgba(241, 241, 237, 0.08)',
        borderRadius: '2px',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        ...style
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'var(--al-font-mono)',
        fontSize: '10px',
        letterSpacing: '1.5px',
        color: 'var(--al-color-text-muted)',
        textTransform: 'uppercase'
      }}>
        {Icon && <Icon size={12} />}
        <span>{label}</span>
      </div>
      <div style={{
        fontFamily: 'var(--al-font-mono)',
        fontSize: '18px',
        fontWeight: 800,
        color: valColor,
        lineHeight: 1
      }}>
        {value}
      </div>
    </div>
  );
}
