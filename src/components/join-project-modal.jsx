import React, { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { Loader2, Hash, ArrowRight } from 'lucide-react';

export function JoinProjectModal({ onClose, onSuccess }) {
  const [joinCode, setJoinCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const { joinProject } = useProjectStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!joinCode.trim()) {
      setError('Join code is required');
      return;
    }

    setSubmitting(true);
    const result = await joinProject(joinCode.trim().toUpperCase());
    setSubmitting(false);

    if (result.success) {
      // Refresh dashboard and projects to ensure UI is updated
      const { fetchDashboard } = require('@/store/analyticsStore').useAnalyticsStore.getState();
      fetchDashboard();
      
      onSuccess(result.data.project);
    } else {
      setError(result.error || 'Invalid or expired code');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-b from-[#002038] to-[#001222] border border-brand-accent/30 rounded-2xl w-full max-w-sm shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(247,127,0,0.1)] overflow-hidden">
        <div className="p-5 border-b border-brand-accent/20 flex items-center justify-between bg-brand-surface">
          <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
            <Hash size={18} className="text-brand-accent" /> Join Workspace
          </h2>
          <button onClick={onClose} className="text-brand-secondary hover:text-theme-text p-1 rounded-lg hover:bg-brand-danger/20 transition-colors">
            &times;
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-brand-danger/10 border border-brand-danger/30 text-red-300 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-yellow/80 mb-2 text-center">
                Enter 8-Character Project Code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="A1B2C3D4"
                disabled={submitting}
                className="w-full py-4 text-2xl font-mono tracking-[0.5em] text-center rounded-xl text-theme-text placeholder-brand-muted outline-none transition-all"
                style={{
                  background: 'rgba(0,32,48,0.7)',
                  border: focused ? '1px solid rgba(247,127,0,0.6)' : '1px solid rgba(247,127,0,0.15)',
                  boxShadow: focused ? '0 0 0 3px rgba(247,127,0,0.1), 0 0 12px rgba(247,127,0,0.1)' : 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || joinCode.length < 8}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-theme-text flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #F77F00, #D62828)', boxShadow: '0 4px 15px rgba(247,127,0,0.3)' }}
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Join Project'}
              {!submitting && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
