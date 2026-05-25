'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { ProjectSelector } from '@/components/ProjectSelector';
import { Badge } from '@/components/ui';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import { AlertCircle, Clock, MessageSquare, Paperclip, MoreHorizontal, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLUMNS = [
  { id: 'todo',        status: 'TODO',        title: 'To Do',     dotClass: 'bg-[#94a3b8]',                                          color: 'bg-[#001222] border border-[#003049]/50' },
  { id: 'in-progress', status: 'IN_PROGRESS', title: 'In Progress',dotClass: 'bg-[#F77F00] shadow-[0_0_8px_#F77F00]',                 color: 'bg-[#001829] border border-[#F77F00]/10' },
  { id: 'review',      status: 'REVIEW',       title: 'Review',    dotClass: 'bg-[#FCBF49] shadow-[0_0_8px_#FCBF49]',                color: 'bg-[#002038] border border-[#FCBF49]/10' },
  { id: 'completed',   status: 'DONE',         title: 'Completed', dotClass: 'bg-[#22c55e] shadow-[0_0_8px_#22c55e]',                color: 'bg-[#001829] border border-[#22c55e]/10' },
];

const getPriorityStyle = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':   return 'bg-[#D62828]/20 text-[#ef4444] border-[#D62828]/30 shadow-[0_0_8px_rgba(214,40,40,0.1)]';
    case 'medium': return 'bg-[#F77F00]/20 text-[#FCBF49] border-[#F77F00]/30 shadow-[0_0_8px_rgba(247,127,0,0.1)]';
    default:       return 'bg-[#003049] text-[#94a3b8] border-[#003049]';
  }
};

const TaskCard = ({ task }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -4 }}
    className="so-card p-4 mb-4 cursor-pointer hover:border-[#F77F00]/30 transition-colors group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#F77F00]/5 to-transparent rounded-bl-full pointer-events-none" />

    <div className="flex justify-between items-start mb-3">
      <Badge className={`!px-2 !py-0.5 text-[9px] font-black uppercase tracking-widest border ${getPriorityStyle(task.priority)}`}>
        {task.priority || 'Medium'}
      </Badge>
      <button className="text-[var(--so-text-secondary)] hover:text-white transition-colors">
        <MoreHorizontal size={14} />
      </button>
    </div>

    <h4 className="font-bold text-white text-sm mb-2 group-hover:text-[#FCBF49] transition-colors line-clamp-2 leading-relaxed">
      {task.title}
    </h4>

    <p className="text-[11px] text-[#94a3b8] mb-4 line-clamp-2 leading-relaxed">
      {task.description || 'No detailed objectives provided.'}
    </p>

    {/* Project chip */}
    {task.project && (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#001222] border border-[#FCBF49]/15 text-[9px] font-black text-[#FCBF49] uppercase tracking-widest mb-3">
        {task.project.name}
      </span>
    )}

    <div className="flex items-center justify-between pt-4 border-t border-[#F77F00]/10">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-[10px] text-[var(--so-text-secondary)] font-bold">
          <Paperclip size={12} className="text-[#F77F00]" /> {task._count?.files || 0}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[var(--so-text-secondary)] font-bold">
          <MessageSquare size={12} className="text-[#FCBF49]" /> {task._count?.comments || 0}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-[#94a3b8] font-black uppercase tracking-wider">
          {task.deadline ? new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'ASAP'}
        </span>
        <div className="w-5 h-5 rounded-full bg-[#003049] border border-[#F77F00]/20 flex items-center justify-center text-[8px] font-black text-white">
          {task.assignee?.name?.charAt(0) || '?'}
        </div>
      </div>
    </div>
  </motion.div>
);

export default function BoardPage() {
  const { tasks, fetchTasks, isLoading, error } = useTaskStore();
  const { activeProjectId, projects } = useProjectStore();
  const [tasksByStatus, setTasksByStatus] = useState({});

  // Re-fetch tasks whenever active project changes
  useEffect(() => {
    if (activeProjectId) {
      fetchTasks({ projectId: activeProjectId });
    } else {
      fetchTasks();
    }
  }, [activeProjectId, fetchTasks]);

  useEffect(() => {
    const grouped = {
      'todo':        tasks.filter(t => t.status === 'TODO'),
      'in-progress': tasks.filter(t => t.status === 'IN_PROGRESS'),
      'review':      tasks.filter(t => t.status === 'REVIEW' || t.status === 'review'),
      'completed':   tasks.filter(t => t.status === 'DONE'),
    };
    setTasksByStatus(grouped);
  }, [tasks]);

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <AppLayout>
      <div className="p-6 h-full flex flex-col relative z-10 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Kanban Board
              <span className="h-2 w-2 rounded-full bg-[#F77F00] animate-pulse" />
            </h1>
            <p className="text-xs font-bold text-[var(--so-text-secondary)] uppercase tracking-[0.2em] mt-1">
              {activeProject ? `Workspace: ${activeProject.name}` : 'All Workspaces · Real-time sync'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Project Selector */}
            <ProjectSelector />

            {/* Status summary chips */}
            <div className="hidden md:flex items-center gap-2">
              {COLUMNS.map(col => (
                <div key={col.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#001222] border border-[#003049] text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">
                  <div className={`w-1.5 h-1.5 rounded-full ${col.dotClass}`} />
                  {tasksByStatus[col.id]?.length || 0}
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#D62828]/10 border border-[#D62828]/30 rounded-2xl flex items-center gap-3 animate-fade-in">
            <AlertCircle size={20} className="text-[#D62828]" />
            <span className="text-[#ef4444] text-sm font-bold uppercase tracking-wide">{error}</span>
          </div>
        )}

        {/* Board Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 pb-4 overflow-hidden h-[calc(100vh-200px)]">
          {COLUMNS.map((column) => (
            <div
              key={column.id}
              className={`flex flex-col rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] h-full ${column.color}`}
            >
              {/* Column Header */}
              <div className="sticky top-0 bg-[#001222]/60 backdrop-blur-xl border-b border-[#F77F00]/10 p-5 z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${column.dotClass}`} />
                  <h3 className="font-black text-white uppercase tracking-widest text-xs">{column.title}</h3>
                </div>
                <Badge className="bg-[#001222] text-[#94a3b8] border border-[#003049] !px-2.5 !py-1 text-[10px] font-black shadow-inner">
                  {tasksByStatus[column.id]?.length || 0}
                </Badge>
              </div>

              {/* Column Content */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#001222]/20">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-40 opacity-20">
                    <Loader2 size={32} className="animate-spin text-white mb-2" />
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Syncing...</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {tasksByStatus[column.id]?.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </AnimatePresence>
                )}

                {tasksByStatus[column.id]?.length === 0 && !isLoading && (
                  <div className="h-24 border-2 border-dashed border-[#003049] rounded-2xl flex items-center justify-center opacity-20">
                    <p className="text-[9px] font-black text-white uppercase tracking-widest">No Active Tasks</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
