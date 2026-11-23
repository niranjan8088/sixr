import React from 'react';
import { AlertTriangle, CheckCircle, Info, ShieldAlert, X } from 'lucide-react';
import '../../styles/ui.css';

/**
 * AFTERLIGHT Tactical Toast & Danger Notification
 */
export default function Toast({
  title = 'ALERT',
  message = '',
  type = 'warning', // 'warning' | 'danger' | 'success' | 'info'
  onClose = null,
  style = {},
  className = ''
}) {
  let borderColor = 'var(--al-color-orange)';
  let textColor = 'var(--al-color-orange)';
  let Icon = AlertTriangle;

  if (type === 'danger') {
    borderColor = 'var(--al-color-red)';
    textColor = 'var(--al-color-red)';
    Icon = ShieldAlert;
  } else if (type === 'success') {
    borderColor = 'var(--al-color-blue)';
    textColor = 'var(--al-color-blue)';
    Icon = CheckCircle;
  } else if (type === 'info') {
    borderColor = 'var(--al-color-blue)';
    textColor = 'var(--al-color-blue)';
    Icon = Info;
  }

  return (
    <div
      className={`al-panel al-animate-fade-in ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 18px',
        borderLeft: `4px solid ${borderColor}`,
        background: 'rgba(17, 22, 27, 0.94)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)',
        maxWidth: '460px',
        ...style
      }}
      role="alert"
    >
      <Icon size={18} color={textColor} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{
            fontFamily: 'var(--al-font-mono)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            color: textColor,
            textTransform: 'uppercase',
            marginBottom: '2px'
          }}>
            {title}
          </div>
        )}
        <div style={{
          fontSize: '12px',
          color: 'var(--al-color-text)',
          lineHeight: '1.4',
          fontWeight: 500
        }}>
          {message}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--al-color-text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
