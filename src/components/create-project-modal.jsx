import React, { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { Loader2, Plus, ArrowRight, FolderOpen, AlignLeft } from 'lucide-react';

export function CreateProjectModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState('');
  const { createProject } = useProjectStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    setSubmitting(true);
    const result = await createProject(formData);
    setSubmitting(false);

    if (result.success) {
      onSuccess(result.data);
    } else {
      setError(result.error || 'Failed to create project');
    }
  };

  const getFocusStyle = (field) => ({
    background: 'rgba(0,32,48,0.7)',
    border: focused === field ? '1px solid rgba(247,127,0,0.6)' : '1px solid rgba(247,127,0,0.15)',
    boxShadow: focused === field ? '0 0 0 3px rgba(247,127,0,0.1), 0 0 12px rgba(247,127,0,0.1)' : 'none',
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-b from-[#002038] to-[#001222] border border-brand-accent/30 rounded-2xl w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(247,127,0,0.1)] overflow-hidden">
        <div className="p-5 border-b border-brand-accent/20 flex items-center justify-between bg-brand-surface">
          <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
            <Plus size={18} className="text-brand-accent" /> Create Project
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
              <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-yellow/80 mb-2 flex items-center gap-1.5">
                <FolderOpen size={12} /> Project Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused('')}
                placeholder="e.g. Website Redesign"
                disabled={submitting}
                required
                className="w-full px-4 py-3 text-sm rounded-xl text-theme-text placeholder-brand-muted outline-none transition-all"
                style={getFocusStyle('name')}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-yellow/80 mb-2 flex items-center gap-1.5">
                <AlignLeft size={12} /> Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                onFocus={() => setFocused('desc')}
                onBlur={() => setFocused('')}
                placeholder="Briefly describe this project..."
                disabled={submitting}
                rows="3"
                className="w-full px-4 py-3 text-sm rounded-xl text-theme-text placeholder-brand-muted outline-none transition-all resize-none custom-scrollbar"
                style={getFocusStyle('desc')}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-brand-secondary hover:text-theme-text bg-brand-elevated border border-brand-accent/20 hover:border-brand-accent/50 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.name.trim()}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-theme-text flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #F77F00, #D62828)', boxShadow: '0 4px 15px rgba(247,127,0,0.3)' }}
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Create'}
                {!submitting && <ArrowRight size={16} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
