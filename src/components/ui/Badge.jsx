import React from 'react';

const variantClasses = {
  default:   'bg-[#003049] text-[#94a3b8] border-[#003049]',
  primary:   'bg-[#F77F00]/10 text-[#F77F00] border-[#F77F00]/30 shadow-[0_0_10px_rgba(247,127,0,0.1)]',
  secondary: 'bg-[#003049] text-[#94a3b8] border-[#003049]',
  success:   'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30 shadow-[0_0_10_rgba(34,197,94,0.1)]',
  warning:   'bg-[#FCBF49]/10 text-[#FCBF49] border-[#FCBF49]/30 shadow-[0_0_10_rgba(252,191,73,0.1)]',
  danger:    'bg-[#D62828]/10 text-[#D62828] border-[#D62828]/30 shadow-[0_0_10_rgba(214,40,40,0.1)]',
  gold:      'bg-gradient-to-r from-[#FCBF49] to-[#F77F00] text-white border-transparent shadow-[0_0_15px_rgba(252,191,73,0.3)]',
};

export function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const base = 'inline-flex items-center font-black rounded-xl px-3 py-1 text-[10px] transition-all border uppercase tracking-widest';
  const variantClass = variantClasses[variant] || variantClasses.default;
  return (
    <span className={`${base} ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
