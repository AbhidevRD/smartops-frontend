'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { ProjectSelector } from '@/components/ProjectSelector';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';
import { Users, Search, Hash, Loader2, Award, Zap, Shield } from 'lucide-react';
import { Badge } from '@/components/ui';

export default function TeamPage() {
  const { user } = useAuthStore();
  const { projects, fetchProjects, isLoading, error, activeProjectId } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Compute member list based on active project or all projects
  const allMembers = (() => {
    const sourceProjects = activeProjectId
      ? projects.filter(p => p.id === activeProjectId)
      : projects;

    return sourceProjects.reduce((acc, project) => {
      project.members?.forEach(member => {
        if (!member.user) return;
        const existing = acc.find(m => m.id === member.user.id);
        if (existing) {
          if (!existing.projects.some(p => p.id === project.id)) {
            existing.projects.push({ id: project.id, name: project.name });
          }
          // Keep the highest role
          if (member.role === 'ADMIN' && existing.role !== 'ADMIN') existing.role = 'ADMIN';
        } else {
          acc.push({
            ...member.user,
            role: member.role,
            projects: [{ id: project.id, name: project.name }],
          });
        }
      });
      return acc;
    }, []);
  })();

  const filteredMembers = allMembers.filter(m =>
    (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <AppLayout>
      <div className="p-6 h-full flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
              Team Protocol <Users size={24} className="text-[#F77F00]" />
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-1.5" style={{ color: 'rgba(252,191,73,0.6)' }}>
              {activeProject
                ? `${activeProject.name} · ${filteredMembers.length} member${filteredMembers.length !== 1 ? 's' : ''}`
                : `All Projects · ${filteredMembers.length} unique member${filteredMembers.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Project Filter */}
            <ProjectSelector />

            {/* Search */}
            <div className="relative group w-full sm:w-72">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F77F00] group-focus-within:scale-110 transition-transform" />
              <input
                type="text"
                placeholder="Search personnel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="so-input w-full pl-11 py-3"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <Loader2 size={32} className="animate-spin text-[#F77F00]" />
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl flex items-center gap-3 bg-[#D62828]/10 border border-[#D62828]/30 text-red-300 text-sm">
            <p>{error}</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border border-[#F77F00]/10 rounded-2xl bg-[#001829]/60 backdrop-blur-md">
            <Users size={48} className="mb-4 text-[#F77F00]/30" />
            <h3 className="text-lg font-medium text-white mb-1">
              {activeProjectId ? 'No members in this project' : 'No members found'}
            </h3>
            <p className="text-sm text-[#94a3b8]">
              {searchTerm ? 'Try a different search term.' : activeProjectId ? 'Invite team members to get started.' : 'Join or create a project to see team members.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6 overflow-y-auto custom-scrollbar pr-2">
            {filteredMembers.map((member, i) => {
              const initials = member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
              const isCurrentUser = member.id === user?.id;
              const isAdmin = member.role === 'ADMIN';

              return (
                <div
                  key={member.id}
                  className="bg-[#001829]/60 border border-[#F77F00]/10 rounded-3xl group flex flex-col p-0 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_20px_rgba(247,127,0,0.1)] animate-fade-in-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="p-6 flex items-start gap-5">
                    {/* Avatar */}
                    <div className="shrink-0 relative">
                      {member.avatarUrl ? (
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#F77F00] rounded-2xl blur-[6px] opacity-20 group-hover:opacity-40 transition-opacity" />
                          <img src={member.avatarUrl} alt={member.name} className="relative w-16 h-16 rounded-2xl object-cover border-2 border-[#003049] shadow-xl z-10" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-xl border-2 border-[#F77F00]/20 bg-gradient-to-br from-[#003049] to-[#001222]">
                          {initials}
                        </div>
                      )}
                      {isCurrentUser && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#22c55e] border-[3px] border-[#001829] rounded-full z-20 shadow-lg animate-pulse" title="You" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-lg font-black text-white truncate group-hover:text-[#FCBF49] transition-colors tracking-tight">
                          {member.name}
                        </h3>
                        {isCurrentUser && <Badge variant="gold" className="!px-1.5 !text-[9px] font-black uppercase tracking-widest">You</Badge>}
                      </div>
                      <p className="text-xs font-bold text-[#94a3b8] truncate mb-4 uppercase tracking-tighter">{member.email}</p>

                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[var(--so-text-secondary)]">
                        {isAdmin ? (
                          <span className="flex items-center gap-1.5 text-[#F77F00]">
                            <Shield size={14} /> Admin
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[#FCBF49]">
                            <Award size={14} /> Member
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-[#22c55e]">
                          <Zap size={14} /> Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Projects Footer — only shown when in "All Projects" view */}
                  {!activeProjectId && (
                    <div className="px-6 py-4 bg-[#001222]/60 border-t border-[#F77F00]/10 mt-auto rounded-b-[2rem]">
                      <p className="text-[9px] uppercase font-black text-[var(--so-text-secondary)] mb-3 tracking-[0.2em]">Assigned Nodes</p>
                      <div className="flex flex-wrap gap-2">
                        {member.projects.map(p => (
                          <span key={p.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#003049] border border-[#F77F00]/10 text-[9px] font-black text-white uppercase tracking-tighter hover:border-[#F77F00]/40 transition-colors">
                            <Hash size={10} className="text-[#F77F00]" />
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
