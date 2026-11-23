import React from 'react';

export default function Button({ children, onClick, variant = 'primary', className = '', ...props }) {
  const btnClass = variant === 'secondary' ? 'sci-btn sci-btn-secondary' : 'sci-btn';
  return (
    <button className={`${btnClass} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

