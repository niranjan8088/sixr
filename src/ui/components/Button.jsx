import React from 'react';
import '../../styles/ui.css';

/**
 * AFTERLIGHT Tactical Button
 * Features chamfered corners, keyboard focus outline, subtle hover glow,
 * and support for primary, secondary, danger, blue, and ghost variants.
 */
export default function Button({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'blue' | 'ghost'
  subtext = '',
  className = '',
  disabled = false,
  type = 'button',
  icon: Icon = null,
  style = {},
  ...props
}) {
  let variantClass = 'al-button';
  if (variant === 'secondary') variantClass = 'al-button al-button-secondary';
  if (variant === 'danger') variantClass = 'al-button al-button-danger';
  if (variant === 'blue') variantClass = 'al-button al-button-blue';
  if (variant === 'ghost') variantClass = 'al-button al-button-secondary'; // subtle glass

  return (
    <button
      type={type}
      className={`${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        flexDirection: subtext ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...style
      }}
      {...props}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        {Icon && <Icon size={16} />}
        <span>{children}</span>
      </div>
      {subtext && (
        <span style={{
          fontSize: '10px',
          letterSpacing: '1px',
          opacity: 0.75,
          fontFamily: 'var(--al-font-mono)',
          textTransform: 'none',
          fontWeight: 400
        }}>
          {subtext}
        </span>
      )}
    </button>
  );
}
