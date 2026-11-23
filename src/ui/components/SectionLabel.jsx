import React from 'react';
import '../../styles/ui.css';

/**
 * AFTERLIGHT Tactical Section Label
 */
export default function SectionLabel({
  children,
  icon: Icon = null,
  color = 'orange', // 'orange' | 'blue' | 'muted'
  style = {},
  className = ''
}) {
  const colorVar = color === 'blue'
    ? 'var(--al-color-blue)'
    : color === 'muted'
      ? 'var(--al-color-text-muted)'
      : 'var(--al-color-orange)';

  return (
    <div
      className={`al-section-label ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'var(--al-font-mono)',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '2px',
        color: colorVar,
        textTransform: 'uppercase',
        marginBottom: '8px',
        ...style
      }}
    >
      {Icon && <Icon size={13} color={colorVar} />}
      <span>{children}</span>
    </div>
  );
}
