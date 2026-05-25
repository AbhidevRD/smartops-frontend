'use client';

import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DeleteProjectModal
 *
 * Props:
 *  project  {object}  — the project to delete (must have .id and .name)
 *  onClose  {fn}      — called when the modal should close
 *  onSuccess {fn}     — called after successful deletion
 */
export function DeleteProjectModal({ project, onClose, onSuccess }) {
  const { deleteProject } = useProjectStore();
  const [confirmName, setConfirmName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const isConfirmed = confirmName.trim() === project?.name?.trim();

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setIsDeleting(true);
    setError('');
    const result = await deleteProject(project.id);
    setIsDeleting(false);
    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error || 'Failed to delete project');
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.9),0_0_60px_rgba(214,40,40,0.2)]"
          style={{
            background: 'linear-gradient(135deg, #001222 0%, #001829 100%)',
            border: '1px solid rgba(214,40,40,0.4)',
          }}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-[#D62828]/20">
            {/* Danger glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-16 bg-[#D62828]/30 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#D62828]/15 border border-[#D62828]/30">
                  <AlertTriangle size={22} className="text-[#D62828] animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white tracking-tight">Delete Project</h2>
                  <p className="text-[10px] font-black text-[#D62828]/70 uppercase tracking-widest mt-0.5">Irreversible Action</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#94a3b8] hover:text-white hover:bg-[#D62828]/20 rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="mb-6 p-4 rounded-2xl bg-[#D62828]/10 border border-[#D62828]/20">
              <p className="text-sm text-[#fca5a5] font-bold leading-relaxed">
                This will permanently delete{' '}
                <span className="text-white font-black">"{project?.name}"</span>{' '}
                and all of its tasks, files, messages, and member records.
                <span className="block mt-2 text-[#D62828] font-black">This cannot be undone.</span>
              </p>
            </div>

            {/* What will be deleted */}
            <div className="mb-6 space-y-2">
              {['All tasks and subtasks', 'All file attachments', 'All chat messages', 'All member memberships', 'All project invites'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-[#94a3b8] font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D62828]" />
                  {item}
                </div>
              ))}
            </div>

            {/* Confirmation input */}
            <div className="mb-5">
              <label className="block text-xs font-black text-[#94a3b8] uppercase tracking-widest mb-2">
                Type <span className="text-white font-black">{project?.name}</span> to confirm
              </label>
              <input
                type="text"
                value={confirmName}
                onChange={(e) => { setConfirmName(e.target.value); setError(''); }}
                placeholder={project?.name}
                className="w-full px-4 py-3 rounded-xl text-sm font-bold text-white placeholder-[#64748b] outline-none transition-all"
                style={{
                  background: 'rgba(0,18,34,0.8)',
                  border: isConfirmed
                    ? '1px solid rgba(214,40,40,0.6)'
                    : '1px solid rgba(100,116,139,0.3)',
                  boxShadow: isConfirmed ? '0 0 0 3px rgba(214,40,40,0.1)' : 'none',
                }}
                autoFocus
              />
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-[#D62828]/15 border border-[#D62828]/30 text-xs font-bold text-[#fca5a5]">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-black text-[#94a3b8] hover:text-white border border-[#003049] hover:border-[#94a3b8]/30 hover:bg-[#002038] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!isConfirmed || isDeleting}
                className="flex-1 py-3 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: isConfirmed
                    ? 'linear-gradient(135deg, #D62828, #7f1d1d)'
                    : 'rgba(100,116,139,0.2)',
                  boxShadow: isConfirmed ? '0 4px 20px rgba(214,40,40,0.4)' : 'none',
                }}
              >
                {isDeleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
