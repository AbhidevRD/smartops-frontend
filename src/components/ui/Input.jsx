import React from 'react';

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`so-input ${className}`}
      {...props}
    />
  );
}
