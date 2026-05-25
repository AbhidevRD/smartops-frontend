import React from 'react';

const variantMap = {
  primary:   'so-btn-primary',
  secondary: 'so-btn-secondary',
  ghost:     'so-btn-ghost',
  danger:    'so-btn-danger',
  outline:   'so-btn-ghost',
  link:      'bg-transparent text-brand-yellow underline-offset-4 hover:underline p-0 h-auto',
  icon:      'so-btn-ghost !p-2',
};

const sizeMap = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-6 py-3',
  icon: '!p-2',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 select-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  const variantClass = variantMap[variant] || variantMap.primary;
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
