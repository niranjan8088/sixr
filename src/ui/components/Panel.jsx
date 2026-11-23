import React from 'react';
import '../../styles/ui.css';

/**
 * AFTERLIGHT Tactical Panel
 * Glass-like subtle dark charcoal surface with optional tactical corner brackets.
 */
export default function Panel({
  children,
  variant = 'tactical', // 'tactical' | 'standard' | 'danger' | 'elevated'
  className = '',
  style = {},
  ...props
}) {
  let panelClass = 'al-panel';
  if (variant === 'tactical') panelClass += ' al-panel-tactical';
  if (variant === 'danger') panelClass += ' al-panel-danger';

  return (
    <div
      className={`${panelClass} ${className}`}
      style={{
        padding: '20px',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
