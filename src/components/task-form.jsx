import React, { useState, useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useTaskStore } from '@/store/taskStore';
import { Loader2, Hash, AlignLeft, Calendar, Flag, Users, CheckCircle } from 'lucide-react';

export function TaskForm({ task, projects, onSuccess, onCancel, isEditing }) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    projectId: task?.projectId || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'TODO',
    assigneeId: task?.assigneeId || '',
    dueDate: task?.deadline ? task?.deadline.split('T')[0] : '',
  });

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { getProjectMembers } = useProjectStore();
  const { createTask, updateTask } = useTaskStore();

  const [focused, setFocused] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      if (!formData.projectId) {
        setMembers([]);
        return;
      }
      setLoadingMembers(true);
      const result = await getProjectMembers(formData.projectId);
      if (result.success) {
        setMembers(result.data);
      }
      setLoadingMembers(false);
    };
    fetchMembers();
  }, [formData.projectId, getProjectMembers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.projectId) return;

    setSubmitting(true);
    let result;
    if (task) {
      result = await updateTask(task.id, formData);
    } else {
      result = await createTask(formData);
    }
    setSubmitting(false);

    if (result.success) {
      onSuccess(result.data);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const getFocusStyle = (field) => ({
    background: 'rgba(0,32,48,0.7)',
    border: focused === field ? '1px solid rgba(247,127,0,0.6)' : '1px solid rgba(247,127,0,0.15)',
    boxShadow: focused === field ? '0 0 0 3px rgba(247,127,0,0.1), 0 0 12px rgba(247,127,0,0.1)' : 'none',
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-yellow/80 mb-1.5">Task Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          onFocus={() => setFocused('title')}
          onBlur={() => setFocused('')}
          placeholder="What needs to be done?"
          disabled={submitting}
          required
          className="w-full px-4 py-3 text-sm rounded-xl text-theme-text placeholder-brand-muted outline-none transition-all"
          style={getFocusStyle('title')}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-yellow/80 mb-1.5 flex items-center gap-1.5">
          <AlignLeft size={12} /> Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          onFocus={() => setFocused('desc')}
          onBlur={() => setFocused('')}
          placeholder="Add details about this task..."
          disabled={submitting}
          rows="3"
          className="w-full px-4 py-3 text-sm rounded-xl text-theme-text placeholder-brand-muted outline-none transition-all custom-scrollbar resize-none"
          style={getFocusStyle('desc')}
        />
      </div>

      {/* Project & Assignee */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-yellow/80 mb-1.5 flex items-center gap-1.5">
            <Hash size={12} /> Project *
          </label>
          <select
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value, assigneeId: '' })}
            onFocus={() => setFocused('project')}
            onBlur={() => setFocused('')}
            disabled={submitting || task}
            required
            className="w-full px-4 py-3 text-sm rounded-xl text-theme-text outline-none transition-all appearance-none cursor-pointer"
            style={getFocusStyle('project')}
          >
            <option value="" className="bg-brand-surface text-brand-secondary">Select project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-brand-surface text-theme-text">{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-yellow/80 mb-1.5 flex items-center gap-1.5">
            <Users size={12} /> Assign To
          </label>
          <select
            value={formData.assigneeId}
            onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
            onFocus={() => setFocused('assignee')}
            onBlur={() => setFocused('')}
            disabled={submitting || !formData.projectId || loadingMembers}
            className="w-full px-4 py-3 text-sm rounded-xl text-theme-text outline-none transition-all appearance-none cursor-pointer"
            style={getFocusStyle('assignee')}
          >
            <option value="" className="bg-brand-surface text-brand-secondary">Unassigned</option>
            {members.map((member) => (
              <option key={member.user.id} value={member.user.id} className="bg-brand-surface text-theme-text">
                {member.user.name}
              </option>
            ))}
          </select>
          {loadingMembers && <p className="text-[10px] text-brand-accent mt-1 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Loading team...</p>}
        </div>
      </div>

      {/* Priority & Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-yellow/80 mb-1.5 flex items-center gap-1.5">
            <Flag size={12} /> Priority
          </label>
          <select
            value={formData.priority.toLowerCase()}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            onFocus={() => setFocused('priority')}
            onBlur={() => setFocused('')}
            disabled={submitting}
            className="w-full px-4 py-3 text-sm rounded-xl text-theme-text outline-none transition-all appearance-none cursor-pointer"
            style={getFocusStyle('priority')}
          >
            <option value="low" className="bg-brand-surface text-brand-success">Low</option>
            <option value="medium" className="bg-brand-surface text-brand-accent">Medium</option>
            <option value="high" className="bg-brand-surface text-brand-danger">High</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-yellow/80 mb-1.5 flex items-center gap-1.5">
            <Calendar size={12} /> Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            onFocus={() => setFocused('date')}
            onBlur={() => setFocused('')}
            disabled={submitting}
            className="w-full px-4 py-3 text-sm rounded-xl text-theme-text outline-none transition-all appearance-none cursor-text"
            style={{ ...getFocusStyle('date'), colorScheme: 'dark' }}
          />
        </div>
      </div>

      {/* Status (Only when editing) */}
      {isEditing && (
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-yellow/80 mb-1.5 flex items-center gap-1.5">
            <CheckCircle size={12} /> Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            onFocus={() => setFocused('status')}
            onBlur={() => setFocused('')}
            disabled={submitting}
            className="w-full px-4 py-3 text-sm rounded-xl text-theme-text outline-none transition-all appearance-none cursor-pointer"
            style={getFocusStyle('status')}
          >
            <option value="TODO" className="bg-brand-surface text-theme-text">TODO</option>
            <option value="IN_PROGRESS" className="bg-brand-surface text-theme-text">IN PROGRESS</option>
            <option value="DONE" className="bg-brand-surface text-theme-text">DONE</option>
          </select>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-brand-accent/10 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-brand-secondary hover:text-theme-text bg-brand-elevated border border-brand-accent/20 hover:border-brand-accent/50 transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || !formData.title || !formData.projectId}
          className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-theme-text flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #F77F00, #D62828)', boxShadow: '0 4px 15px rgba(247,127,0,0.3)' }}
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {isEditing ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
