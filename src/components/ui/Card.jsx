import React from 'react';

export function Card({ children, className = '', onClick, ...props }) {
  return (
    <div
      className={`so-card ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-5 pt-5 pb-3 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`px-5 pb-5 ${className}`}>
      {children}
    </div>
  );
}
