'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Target, Play, Pause, RotateCcw, Award, CheckCircle2, Coffee, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui';

export default function FocusPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
  const [stats, setStats] = useState({ sessionsCompleted: 0, totalFocusTime: 0 });

  const modes = {
    focus: { label: 'Focus', time: 25 * 60, color: '#F77F00', bg: 'rgba(247,127,0,0.1)' },
    shortBreak: { label: 'Short Break', time: 5 * 60, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    longBreak: { label: 'Long Break', time: 15 * 60, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      handleComplete();
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    if (mode === 'focus') {
      setStats(prev => ({
        sessionsCompleted: prev.sessionsCompleted + 1,
        totalFocusTime: prev.totalFocusTime + 25
      }));
      // Play sound could go here
      alert('Focus session completed! Take a break.');
      switchMode('shortBreak');
    } else {
      alert('Break is over! Time to focus.');
      switchMode('focus');
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(modes[newMode].time);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].time);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100;
  const currentModeStyle = modes[mode];

  return (
    <AppLayout>
      <div className="p-6 h-full flex flex-col animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-theme-text flex items-center gap-2">
              Focus Mode <Target size={20} className="text-brand-accent" />
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(252,191,73,0.6)' }}>
              Pomodoro timer for deep work
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full gap-8">
          
          {/* Mode Selector */}
          <div className="flex items-center gap-2 bg-[#001829]/80 backdrop-blur-md p-2 rounded-[1.5rem] border border-[#F77F00]/20 shadow-2xl animate-fade-in-up">
            {Object.entries(modes).map(([key, value]) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                  mode === key 
                    ? 'bg-gradient-to-r from-[#F77F00] to-[#D62828] text-white shadow-[0_10px_30px_rgba(247,127,0,0.4)] scale-105' 
                    : 'text-[var(--so-text-secondary)] hover:text-white hover:bg-[#003049]'
                }`}
              >
                {value.label}
              </button>
            ))}
          </div>

          {/* Timer Circle */}
          <div className="relative animate-fade-in-up delay-75">
            {/* Ambient Glow */}
            <div 
              className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ${isActive ? 'opacity-40 scale-110' : 'opacity-10 scale-100'}`}
              style={{ background: currentModeStyle.color }}
            />
            
            <div className="relative w-80 h-80 rounded-full flex flex-col items-center justify-center bg-[#001222] border-[10px] shadow-[inset_0_0_80px_rgba(0,0,0,0.9),0_30px_60px_rgba(0,0,0,0.8)] transition-all duration-700"
              style={{ borderColor: 'rgba(247,127,0,0.03)' }}
            >
              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle
                  cx="160" cy="160" r="150"
                  fill="none"
                  stroke={currentModeStyle.color}
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 150}`}
                  strokeDashoffset={`${2 * Math.PI * 150 * (1 - progress / 100)}`}
                  className="transition-all duration-1000 ease-linear"
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 20px ${currentModeStyle.color}80)` }}
                />
              </svg>

              <span className="text-8xl font-black tracking-tighter text-white tabular-nums drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-10 font-mono">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] mt-4 z-10 drop-shadow-md" style={{ color: currentModeStyle.color }}>
                {currentModeStyle.label} Protocol
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 animate-fade-in-up delay-150">
            <button
              onClick={toggleTimer}
              className="w-16 h-16 rounded-full flex items-center justify-center text-theme-text transition-all transform hover:scale-105 active:scale-95 shadow-[0_8px_25px_rgba(247,127,0,0.4)]"
              style={{ background: 'linear-gradient(135deg, #F77F00, #D62828)' }}
            >
              {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
            <button
              onClick={resetTimer}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-elevated text-brand-secondary border border-brand-accent/20 hover:text-theme-text hover:border-brand-accent/60 transition-all"
              title="Reset Timer"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-lg mt-8 animate-fade-in-up delay-200">
            <div className="bg-[#001829]/80 backdrop-blur-md p-6 rounded-3xl border border-[#F77F00]/10 flex items-center gap-5 shadow-2xl group hover:border-[#F77F00]/40 transition-all">
              <div className="p-4 rounded-2xl bg-[#22c55e]/10 text-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.1)] group-hover:scale-110 transition-transform">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <p className="text-[10px] text-[var(--so-text-secondary)] font-black uppercase tracking-[0.2em] mb-1">Sessions</p>
                <p className="text-3xl font-black text-white leading-none tracking-tighter">{stats.sessionsCompleted}</p>
              </div>
            </div>
            <div className="bg-[#001829]/80 backdrop-blur-md p-6 rounded-3xl border border-[#F77F00]/10 flex items-center gap-5 shadow-2xl group hover:border-[#F77F00]/40 transition-all">
              <div className="p-4 rounded-2xl bg-[#FCBF49]/10 text-[#FCBF49] shadow-[0_0_20px_rgba(252,191,73,0.1)] group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <div>
                <p className="text-[10px] text-[var(--so-text-secondary)] font-black uppercase tracking-[0.2em] mb-1">Focus Time</p>
                <p className="text-3xl font-black text-white leading-none tracking-tighter">{stats.totalFocusTime} <span className="text-xs text-[var(--so-text-secondary)] font-black tracking-normal">MIN</span></p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </AppLayout>
  );
}
