'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useProjectStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';
import { DeleteProjectModal } from '@/components/DeleteProjectModal';
import { CreateProjectModal } from '@/components/create-project-modal';
import {
  FolderOpen, Search, Users, Copy, CheckCircle2, ChevronRight,
  Hash, Clock, Plus, Trash2, CheckCircle, Circle, Loader2
} from 'lucide-react';
import Link from 'next/link';

function TaskStatusBar({ taskStats }) {
  if (!taskStats) return null;
  const { todo = 0, inProgress = 0, done = 0 } = taskStats;
  const total = todo + inProgress + done;
  if (total === 0) return (
    <div className="mb-5">
      <p className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8] mb-2">Task Progress</p>
      <div className="h-1.5 rounded-full bg-[#001222] overflow-hidden">
        <div className="h-full w-0 rounded-full" />
      </div>
      <p className="text-[9px] text-[#94a3b8] mt-1 font-bold">No tasks yet</p>
    </div>
  );

  const donePct = Math.round((done / total) * 100);
  const inProgressPct = Math.round((inProgress / total) * 100);
  const todoPct = 100 - donePct - inProgressPct;

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] font-black uppercase tracking-widest text-[#94a3b8]">Task Progress</p>
        <span className="text-[9px] font-black text-[#22c55e]">{donePct}% Done</span>
      </div>
      {/* Segmented progress bar */}
      <div className="h-1.5 rounded-full bg-[#001222] overflow-hidden flex gap-0.5">
        {done > 0 && (
          <div className="h-full rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.6)] transition-all duration-700" style={{ width: `${donePct}%` }} />
        )}
        {inProgress > 0 && (
          <div className="h-full rounded-full bg-[#F77F00] shadow-[0_0_6px_rgba(247,127,0,0.6)] transition-all duration-700" style={{ width: `${inProgressPct}%` }} />
        )}
        {todo > 0 && (
          <div className="h-full rounded-full bg-[#003049] transition-all duration-700" style={{ width: `${todoPct}%` }} />
        )}
      </div>
      {/* Counters */}
      <div className="flex items-center gap-4 mt-2">
        <span className="flex items-center gap-1 text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">
          <Circle size={8} className="text-[#94a3b8]" /> {todo} Todo
        </span>
        <span className="flex items-center gap-1 text-[9px] font-black text-[#F77F00] uppercase tracking-widest">
          <Clock size={8} /> {inProgress} WIP
        </span>
        <span className="flex items-center gap-1 text-[9px] font-black text-[#22c55e] uppercase tracking-widest">
          <CheckCircle size={8} /> {done} Done
        </span>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { projects, fetchProjects, isLoading, error } = useProjectStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm]       = useState('');
  const [copiedCode, setCopiedCode]       = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget]   = useState(null); // project to delete

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <AppLayout>
      <div className="p-6 h-full flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-theme-text flex items-center gap-2">
              Projects <FolderOpen size={20} className="text-brand-accent" />
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(252,191,73,0.6)' }}>
              Manage your team workspaces
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-accent" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-brand-elevated border border-brand-accent/20 focus:border-brand-accent rounded-xl text-sm text-theme-text placeholder-brand-muted outline-none transition-all shadow-inner"
              />
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-theme-text transition-all shadow-[0_4px_15px_rgba(247,127,0,0.3)] hover:shadow-[0_6px_25px_rgba(247,127,0,0.5)] shrink-0"
              style={{ background: 'linear-gradient(135deg, #F77F00, #D62828)' }}
            >
              <Plus size={16} />
              Create Project
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl shimmer border border-brand-accent/10" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl flex items-center gap-3 bg-brand-danger/10 border border-brand-danger/30 text-red-300 text-sm">
            <p>{error}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border border-brand-accent/10 rounded-2xl bg-brand-surface/60 backdrop-blur-md">
            <FolderOpen size={48} className="mb-4 text-brand-accent/30" />
            <h3 className="text-lg font-medium text-theme-text mb-1">No projects found</h3>
            <p className="text-sm text-brand-muted">Try a different search term or join a project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10 overflow-y-auto custom-scrollbar pr-2">
            {filteredProjects.map((project, i) => {
              const isOwner = project.ownerId === user?.id || project.members?.some(m => m.userId === user?.id && m.role === 'ADMIN');

              return (
                <div
                  key={project.id}
                  className="group flex flex-col bg-[#001829]/60 backdrop-blur-xl border border-[#F77F00]/10 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#F77F00]/40 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_20px_rgba(247,127,0,0.1)] animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Top accent bar */}
                  <div className="h-2 w-full bg-gradient-to-r from-[#F77F00] to-[#D62828]" />

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Project title + member count + delete */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-black text-white group-hover:text-[#FCBF49] transition-colors line-clamp-1 tracking-tight flex-1 pr-2">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#001222] border border-[#F77F00]/20 text-[10px] font-black text-[#FCBF49] uppercase tracking-widest">
                          <Users size={12} />
                          {project.memberCount || project.members?.length || 0}
                        </div>
                        {isOwner && (
                          <button
                            onClick={() => setDeleteTarget(project)}
                            className="p-2 rounded-xl text-[#94a3b8] hover:text-[#D62828] hover:bg-[#D62828]/15 border border-transparent hover:border-[#D62828]/30 transition-all"
                            title="Delete Project"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-sm font-bold text-[#94a3b8] mb-4 line-clamp-2 leading-relaxed">
                      {project.description || 'Neural workspace for collaborative operations.'}
                    </p>

                    {/* Task status progress bar */}
                    <TaskStatusBar taskStats={project.taskStats} />

                    {/* Join code */}
                    {project.joinCode && (
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#001222] border border-[#F77F00]/10 mb-6 hover:border-[#F77F00]/30 transition-all shadow-inner">
                        <div className="flex items-center gap-3">
                          <Hash size={14} className="text-[#F77F00]" />
                          <code className="text-xs font-black font-mono text-white tracking-[0.3em]">{project.joinCode}</code>
                        </div>
                        <button
                          onClick={() => copyToClipboard(project.joinCode)}
                          className="p-2 rounded-xl hover:bg-[#F77F00]/20 transition-all text-[#94a3b8] hover:text-white"
                          title="Copy Join Code"
                        >
                          {copiedCode === project.joinCode ? (
                            <CheckCircle2 size={16} className="text-[#22c55e]" />
                          ) : (
                            <Copy size={16} className="transition-transform active:scale-75" />
                          )}
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#F77F00]/10">
                      <div className="flex items-center gap-2 text-[10px] font-black text-brand-yellow/60 uppercase tracking-widest">
                        <Clock size={12} />
                        <span>Updated {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}</span>
                      </div>
                      <Link
                        href="/tasks"
                        className="flex items-center gap-2 text-[10px] font-black text-[#F77F00] uppercase tracking-widest hover:text-white transition-all hover:gap-3"
                      >
                        Enter Node <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {createModalOpen && (
        <CreateProjectModal
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => {
            setCreateModalOpen(false);
            fetchProjects();
          }}
        />
      )}

      {/* Delete Project Modal */}
      {deleteTarget && (
        <DeleteProjectModal
          project={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={() => {
            setDeleteTarget(null);
            fetchProjects();
          }}
        />
      )}
    </AppLayout>
  );
}
