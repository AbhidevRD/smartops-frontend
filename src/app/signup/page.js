'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff, Mail, Lock, Loader2, User, Zap } from 'lucide-react';
import { Logo } from '@/components/logo';
import GoogleLoginButton from '@/components/google-login';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');
  const [focused, setFocused] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    const result = await signup(formData.email, formData.password, formData.name);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #001222 0%, #001829 50%, #00223a 100%)' }}>

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #F77F00, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #D62828, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(247,127,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(247,127,0,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

      <div className="w-full max-w-md px-6 py-8 animate-fade-in-up relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 animate-pulse-orange rounded-2xl p-1">
            <Logo size="lg" variant="iconOnly" animate={true} />
          </div>
          <h1 className="text-2xl font-bold text-theme-text mt-2">Create account</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(252,191,73,0.6)' }}>
            Join SmartOps AI workspace
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

          {(error || localError) && (
            <div className="mb-5 p-3.5 rounded-xl text-sm font-medium animate-fade-in"
              style={{ background: 'rgba(214,40,40,0.12)', border: '1px solid rgba(214,40,40,0.3)', color: '#fca5a5' }}>
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'rgba(252,191,73,0.7)' }}>Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: focused === 'name' ? '#F77F00' : 'var(--so-text-secondary)' }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused('')}
                  placeholder="Priya Sharma"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl text-theme-text placeholder-brand-muted outline-none transition-all"
                  style={{
                    background: 'rgba(0,32,48,0.7)',
                    border: focused === 'name' ? '1px solid rgba(247,127,0,0.6)' : '1px solid rgba(247,127,0,0.15)',
                    boxShadow: focused === 'name' ? '0 0 0 3px rgba(247,127,0,0.1), 0 0 12px rgba(247,127,0,0.1)' : 'none',
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'rgba(252,191,73,0.7)' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: focused === 'email' ? '#F77F00' : 'var(--so-text-secondary)' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl text-theme-text placeholder-brand-muted outline-none transition-all"
                  style={{
                    background: 'rgba(0,32,48,0.7)',
                    border: focused === 'email' ? '1px solid rgba(247,127,0,0.6)' : '1px solid rgba(247,127,0,0.15)',
                    boxShadow: focused === 'email' ? '0 0 0 3px rgba(247,127,0,0.1), 0 0 12px rgba(247,127,0,0.1)' : 'none',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'rgba(252,191,73,0.7)' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: focused === 'password' ? '#F77F00' : 'var(--so-text-secondary)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  placeholder="••••••••"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'rgba(252,191,73,0.7)' }}>Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: focused === 'confirmPassword' ? '#F77F00' : 'var(--so-text-secondary)' }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocused('confirmPassword')}
                  onBlur={() => setFocused('')}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 text-sm rounded-xl text-theme-text placeholder-brand-muted outline-none transition-all"
                  style={{
                    background: 'rgba(0,32,48,0.7)',
                    border: focused === 'confirmPassword' ? '1px solid rgba(247,127,0,0.6)' : '1px solid rgba(247,127,0,0.15)',
                    boxShadow: focused === 'confirmPassword' ? '0 0 0 3px rgba(247,127,0,0.1), 0 0 12px rgba(247,127,0,0.1)' : 'none',
                  }}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-muted hover:text-brand-accent transition-colors">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-2 rounded-xl font-bold text-sm text-theme-text transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #F77F00, #D62828)',
                boxShadow: '0 4px 20px rgba(247,127,0,0.3)',
              }}
              onMouseEnter={e => !isLoading && (e.currentTarget.style.boxShadow = '0 6px 30px rgba(247,127,0,0.5), 0 0 20px rgba(247,127,0,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(247,127,0,0.3)')}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={16} />}
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#F77F00]/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-[#001829] text-[#FCBF49]/40 font-black tracking-widest">Or join with</span>
              </div>
            </div>

            <GoogleLoginButton text="signup_with" />
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-brand-muted">Already have an account? </span>
            <Link href="/login"
              className="text-sm font-semibold transition-colors hover:underline"
              style={{ color: '#FCBF49' }}>
              Sign in
            </Link>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(71,85,105,0.8)' }}>
          SmartOps AI · Intelligent Project Management
        </p>
      </div>
    </div>
  );
}
