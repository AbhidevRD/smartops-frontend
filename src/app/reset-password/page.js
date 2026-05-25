'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, ArrowLeft, Loader2, Zap } from 'lucide-react';
import { Logo } from '@/components/logo';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  
  const storedEmail = typeof window !== 'undefined' ? sessionStorage.getItem('resetEmail') : null;
  const storedOtp   = typeof window !== 'undefined' ? sessionStorage.getItem('resetOtp')   : null;

  useEffect(() => {
    // Guard: must have both storedEmail and storedOtp set by verify-otp page
    if (!storedEmail || !storedOtp) {
      router.push('/forgot-password');
    }
  }, [storedEmail, storedOtp, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: storedEmail, otp: storedOtp, newPassword: password }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      
      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('resetOtp');
      setStatus({ type: 'success', message: 'Password reset successfully. Redirecting...' });
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
      setIsLoading(false);
    }
  };

  if (!storedOtp) return null;

  return (
    <div className="w-full max-w-md px-6 py-8 animate-fade-in-up relative z-10">
      <Link href="/login" className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors" style={{ color: '#94a3b8' }}>
        <ArrowLeft size={16} /> Back to login
      </Link>
      
      {/* Logo */}
      <div className="flex flex-col mb-8">
        <div className="mb-4 inline-block">
          <Logo size="md" variant="iconOnly" animate={true} />
        </div>
        <h1 className="text-2xl font-bold text-theme-text mt-2">New Password</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(252,191,73,0.6)' }}>
          Create a new password for <span className="text-theme-text font-semibold">{email}</span>
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl p-8"
        style={{
          background: 'rgba(0,48,73,0.4)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(247,127,0,0.18)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 40px rgba(247,127,0,0.05)',
        }}>

        {status.message && (
          <div className="mb-5 p-3.5 rounded-xl text-sm font-medium animate-fade-in"
            style={status.type === 'error' 
              ? { background: 'rgba(214,40,40,0.12)', border: '1px solid rgba(214,40,40,0.3)', color: '#fca5a5' }
              : { background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac' }
            }>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: 'rgba(252,191,73,0.7)' }}>New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: focused === 'password' ? '#F77F00' : 'var(--so-text-secondary)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-11 py-3 text-sm rounded-xl text-theme-text placeholder-brand-muted outline-none transition-all"
                style={{
                  background: 'rgba(0,32,48,0.7)',
                  border: focused === 'password' ? '1px solid rgba(247,127,0,0.6)' : '1px solid rgba(247,127,0,0.15)',
                  boxShadow: focused === 'password' ? '0 0 0 3px rgba(247,127,0,0.1), 0 0 12px rgba(247,127,0,0.1)' : 'none',
                }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-muted hover:text-brand-accent transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: 'rgba(252,191,73,0.7)' }}>Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: focused === 'confirm' ? '#F77F00' : 'var(--so-text-secondary)' }} />
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onFocus={() => setFocused('confirm')}
                onBlur={() => setFocused('')}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-11 py-3 text-sm rounded-xl text-theme-text placeholder-brand-muted outline-none transition-all"
                style={{
                  background: 'rgba(0,32,48,0.7)',
                  border: focused === 'confirm' ? '1px solid rgba(247,127,0,0.6)' : '1px solid rgba(247,127,0,0.15)',
                  boxShadow: focused === 'confirm' ? '0 0 0 3px rgba(247,127,0,0.1), 0 0 12px rgba(247,127,0,0.1)' : 'none',
                }}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-muted hover:text-brand-accent transition-colors">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword || status.type === 'success'}
            className="w-full py-3 mt-2 rounded-xl font-bold text-sm text-theme-text transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #F77F00, #D62828)', boxShadow: '0 4px 20px rgba(247,127,0,0.3)' }}
            onMouseEnter={e => !isLoading && (e.currentTarget.style.boxShadow = '0 6px 30px rgba(247,127,0,0.5), 0 0 20px rgba(247,127,0,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(247,127,0,0.3)')}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={16} />}
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #001222 0%, #001829 50%, #00223a 100%)' }}>
      
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #FCBF49, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #F77F00, transparent)', filter: 'blur(80px)' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(247,127,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(247,127,0,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

      <Suspense fallback={<div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 text-brand-accent animate-spin" /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
