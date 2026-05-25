import React from 'react';

export const Logo = ({ size = 'md', variant = 'full', animate = true, className = '' }) => {
  const sizeMap = { sm: 'h-8', md: 'h-11', lg: 'h-20', xl: 'h-28' };
  const svgSize = sizeMap[size] || sizeMap.md;

  const textSize = {
    sm: 'text-base', md: 'text-xl', lg: 'text-4xl', xl: 'text-5xl'
  }[size] || 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 ${animate ? 'group hover:scale-[1.02] transition-transform duration-300' : ''} ${className}`}>
      {/* Icon */}
      <div className={`relative flex items-center justify-center shrink-0 ${svgSize} aspect-square`}>
        {/* Orange glow halo */}
        {animate && (
          <div className="absolute inset-0 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-pulse-slow"
            style={{ background: 'radial-gradient(circle, #F77F00, #D62828, transparent)', filter: 'blur(8px)' }} />
        )}

        <svg viewBox="0 0 120 120" className="w-full h-full relative z-10" fill="none">
          {/* Outer orbit ring - slow spin */}
          <g style={animate ? { transformOrigin: '60px 60px', animation: 'orbit 18s linear infinite' } : {}}>
            {/* Base ring */}
            <circle cx="60" cy="60" r="54" stroke="rgba(247,127,0,0.15)" strokeWidth="1" />
            {/* Orange arc segment */}
            <circle cx="60" cy="60" r="54" stroke="#F77F00" strokeWidth="2"
              strokeDasharray="85 254" strokeDashoffset="0" strokeLinecap="round" />
            {/* Gold arc segment */}
            <circle cx="60" cy="60" r="54" stroke="#FCBF49" strokeWidth="1.5"
              strokeDasharray="35 254" strokeDashoffset="-130" strokeLinecap="round" />
            {/* Red arc segment */}
            <circle cx="60" cy="60" r="54" stroke="#D62828" strokeWidth="1.5"
              strokeDasharray="20 254" strokeDashoffset="-200" strokeLinecap="round" />

            {/* Orbit node dots */}
            <circle cx="114" cy="60" r="5" fill="#F77F00" style={{ filter: 'drop-shadow(0 0 4px #F77F00)' }} />
            <circle cx="6"   cy="60" r="3.5" fill="#D62828" style={{ filter: 'drop-shadow(0 0 3px #D62828)' }} />
            <circle cx="60"  cy="6"  r="3" fill="#FCBF49" style={{ filter: 'drop-shadow(0 0 3px #FCBF49)' }} />
            <circle cx="60"  cy="114" r="2.5" fill="rgba(247,127,0,0.5)" />
            <circle cx="103" cy="25" r="2" fill="#FCBF49" opacity="0.7" />
            <circle cx="17"  cy="95" r="1.8" fill="#F77F00" opacity="0.5" />
          </g>

          {/* Middle ring - reverse spin */}
          <circle cx="60" cy="60" r="36" stroke="rgba(247,127,0,0.1)" strokeWidth="1"
            strokeDasharray="56 226" strokeDashoffset="-30"
            style={animate ? { transformOrigin: '60px 60px', animation: 'spin-reverse 12s linear infinite' } : {}} />

          {/* Center hexagon */}
          <g className={animate ? 'group-hover:drop-shadow-[0_0_12px_rgba(247,127,0,0.9)]' : ''}>
            {/* Outer hex */}
            <polygon points="60,32 79,43 79,65 60,76 41,65 41,43"
              fill="url(#hexGrad)" stroke="rgba(247,127,0,0.4)" strokeWidth="0.5" />
            {/* Inner hex */}
            <polygon points="60,40 73,47 73,63 60,70 47,63 47,47"
              fill="url(#hexGradInner)" />
            {/* S letter */}
            <text x="60" y="64" fontFamily="Inter, sans-serif" fontSize="22"
              fontWeight="900" fill="white" textAnchor="middle"
              style={{ filter: 'drop-shadow(0 0 4px rgba(252,191,73,0.6))' }}>S</text>
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F77F00" />
              <stop offset="100%" stopColor="#D62828" />
            </linearGradient>
            <linearGradient id="hexGradInner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D62828" />
              <stop offset="100%" stopColor="#8B0000" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Wordmark */}
      {variant === 'full' && (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline gap-0 leading-none">
            <span className={`font-bold ${textSize} text-theme-text leading-none`}>SmartOps</span>
            <span className={`font-bold ${textSize} leading-none`}
              style={{ color: '#F77F00', textShadow: '0 0 8px rgba(247,127,0,0.5)' }}>.AI</span>
          </div>
          {size !== 'sm' && (
            <span className={`text-[9px] uppercase tracking-[0.18em] font-semibold mt-0.5 ${animate ? 'group-hover:tracking-[0.25em] transition-all duration-500' : ''}`}
              style={{ color: 'rgba(252,191,73,0.55)' }}>
              Project Management
            </span>
          )}
        </div>
      )}
    </div>
  );
};
