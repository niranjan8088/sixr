import React, { useState, useEffect } from 'react';
import '../../styles/ui.css';

/**
 * AFTERLIGHT Animated Counter
 * Smoothly interpolates numeric values for scores, timers, and resource tallies.
 */
export default function AnimatedCounter({
  value = 0,
  duration = 600, // ms
  prefix = '',
  suffix = '',
  className = '',
  style = {}
}) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startVal = displayValue;
    const endVal = Number(value) || 0;
    if (startVal === endVal) return;

    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startVal + (endVal - startVal) * ease);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    const handle = requestAnimationFrame(update);
    return () => cancelAnimationFrame(handle);
  }, [value, duration]);

  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--al-font-mono)',
        fontVariantNumeric: 'tabular-nums',
        ...style
      }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}
