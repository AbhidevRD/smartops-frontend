'use client';

import { useState, useRef, useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { ChevronDown, FolderOpen, Check, Globe } from 'lucide-react';

/**
 * ProjectSelector — a premium dropdown for selecting the active project.
 *
 * Props:
 *  showAll      {boolean}  — whether to include an "All Projects" option (default: true)
 *  className    {string}   — extra class for the trigger button
 *  onSelect     {fn}       — optional callback when selection changes: (id | null) => void
 */
export function ProjectSelector({ showAll = true, className = '', onSelect }) {
  const { projects, activeProjectId, setActiveProject } = useProjectStore();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const activeProject = projects.find(p => p.id === activeProjectId);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (id) => {
    setActiveProject(id);
    onSelect?.(id);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      {/* Trigger */}
      <button
        id="project-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 group
          ${isOpen
            ? 'bg-[#F77F00]/20 border border-[#F77F00]/60 shadow-[0_0_20px_rgba(247,127,0,0.2)] text-white'
            : 'bg-[#001829]/60 border border-[#F77F00]/20 hover:border-[#F77F00]/50 hover:bg-[#002038] text-[#cbd5e1] hover:text-white'
          }`}
      >
        <FolderOpen size={15} className={activeProjectId ? 'text-[#F77F00]' : 'text-[#94a3b8]'} />
        <span className="max-w-[160px] truncate">
          {activeProject ? activeProject.name : 'All Projects'}
        </span>
        <ChevronDown
          size={14}
          className={`text-[#F77F00]/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 min-w-[240px] max-h-[320px] overflow-y-auto
          bg-[#001222]/98 backdrop-blur-xl border border-[#F77F00]/30 rounded-2xl
          shadow-[0_15px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(247,127,0,0.05)]
          z-50 animate-scale-in origin-top-left custom-scrollbar">

          {showAll && (
            <button
              onClick={() => handleSelect(null)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold
                hover:bg-[#002038] transition-colors
                ${!activeProjectId ? 'text-[#F77F00]' : 'text-[#cbd5e1]'}`}
            >
              <span className="flex items-center gap-2.5">
                <Globe size={14} className={!activeProjectId ? 'text-[#F77F00]' : 'text-[#94a3b8]'} />
                All Projects
              </span>
              {!activeProjectId && <Check size={14} className="text-[#F77F00]" />}
            </button>
          )}

          {projects.length > 0 && showAll && (
            <div className="h-px bg-[#F77F00]/10 mx-3" />
          )}

          {projects.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-[#94a3b8] font-bold uppercase tracking-widest">
              No projects found
            </div>
          ) : (
            projects.map((project) => {
              const isActive = activeProjectId === project.id;
              const total = (project.taskStats?.todo || 0) + (project.taskStats?.inProgress || 0) + (project.taskStats?.done || 0);

              return (
                <button
                  key={project.id}
                  onClick={() => handleSelect(project.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold
                    hover:bg-[#002038] transition-colors
                    ${isActive ? 'text-[#F77F00] bg-[#F77F00]/10' : 'text-[#cbd5e1]'}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Active indicator */}
                    <div className={`w-2 h-2 rounded-full shrink-0 ${isActive
                      ? 'bg-[#F77F00] shadow-[0_0_8px_rgba(247,127,0,0.8)]'
                      : 'bg-[#003049]'}`}
                    />
                    <span className="truncate max-w-[160px]">{project.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {total > 0 && (
                      <span className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest">
                        {total} tasks
                      </span>
                    )}
                    {isActive && <Check size={14} className="text-[#F77F00]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
