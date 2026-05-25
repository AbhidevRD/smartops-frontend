import React from 'react';

export function Label({ children, htmlFor, className = '' }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-semibold text-brand-yellow/80 uppercase tracking-wider mb-1.5 ${className}`}
    >
      {children}
    </label>
  );
}
