'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, ArrowLeft, Loader2, Zap } from 'lucide-react';
import { Logo } from '@/components/logo';

function VerifyOTPForm() {
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const email = searchParams.get('email');
  const type = searchParams.get('type') || 'reset';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, purpose: type }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      // Save email + OTP so reset-password page can re-submit them
      sessionStorage.setItem('resetEmail', email);
      sessionStorage.setItem('resetOtp', otp);
      
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-theme-text mt-2">Enter OTP</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(252,191,73,0.6)' }}>
          We sent a code to <span className="text-theme-text font-semibold">{email}</span>
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
              style={{ color: 'rgba(252,191,73,0.7)' }}>6-Digit OTP</label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: focused === 'otp' ? '#F77F00' : 'var(--so-text-secondary)' }} />
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onFocus={() => setFocused('otp')}
                onBlur={() => setFocused('')}
                placeholder="123456"
                required
                className="w-full pl-10 pr-4 py-3 text-lg font-mono tracking-[0.5em] text-center rounded-xl text-theme-text placeholder-brand-muted outline-none transition-all"
                style={{
                  background: 'rgba(0,32,48,0.7)',
                  border: focused === 'otp' ? '1px solid rgba(247,127,0,0.6)' : '1px solid rgba(247,127,0,0.15)',
                  boxShadow: focused === 'otp' ? '0 0 0 3px rgba(247,127,0,0.1), 0 0 12px rgba(247,127,0,0.1)' : 'none',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className="w-full py-3 rounded-xl font-bold text-sm text-theme-text transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #F77F00, #D62828)', boxShadow: '0 4px 20px rgba(247,127,0,0.3)' }}
            onMouseEnter={e => !isLoading && otp.length === 6 && (e.currentTarget.style.boxShadow = '0 6px 30px rgba(247,127,0,0.5), 0 0 20px rgba(247,127,0,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(247,127,0,0.3)')}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={16} />}
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
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
        <VerifyOTPForm />
      </Suspense>
    </div>
  );
}
