'use client';

import { useEffect, useState, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import { useFileStore } from '@/store/fileStore';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { 
  Plus, Trash2, Edit2, CheckCircle, Circle, AlertCircle, Paperclip, 
  Upload, FileText, Download, Loader2, ChevronDown, Clock, User, Calendar, X, FolderOpen 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskForm } from '@/components/task-form';

export default function TasksPage() {
  const { tasks, fetchTasks, createTask, updateTask, updateTaskStatus, deleteTask, isLoading, error } = useTaskStore();
  const { projects, fetchProjects, activeProjectId, setActiveProject } = useProjectStore();
  const { files, fetchTaskFiles, uploadFile, uploadProgress, isLoading: isFileLoading } = useFileStore();
  
  const [filter, setFilter] = useState('all');
  // Initialize from global active project
  const [selectedProjectId, setSelectedProjectId] = useState(activeProjectId || 'all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const fileInputRef = useRef(null);
  const [fileForm, setFileForm] = useState({
    description: '',
    title: '',
    remarks: ''
  });

  useEffect(() => {
    fetchTasks(selectedProjectId !== 'all' ? { projectId: selectedProjectId } : {});
    fetchProjects();
  }, [fetchTasks, fetchProjects, selectedProjectId]);

  // When the global activeProjectId changes, sync the local filter
  useEffect(() => {
    setSelectedProjectId(activeProjectId || 'all');
  }, [activeProjectId]);

  useEffect(() => {
    if (editingTask) {
      fetchTaskFiles(editingTask.id);
    }
  }, [editingTask, fetchTaskFiles]);

  const filteredTasks = tasks.filter((task) => {
    // Status Filter
    const matchesStatus = 
      filter === 'all' || 
      (filter === 'completed' && task.status === 'DONE') || 
      (filter === 'pending' && task.status !== 'DONE');
    
    // Project Filter
    const matchesProject = 
      selectedProjectId === 'all' || 
      task.projectId === selectedProjectId;

    return matchesStatus && matchesProject;
  });

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'TODO': return 'bg-[#003049] text-[#94a3b8] border-[#003049]';
      case 'IN_PROGRESS': return 'bg-[#F77F00]/20 text-[#F77F00] border-[#F77F00]/50 shadow-[0_0_10px_rgba(247,127,0,0.2)]';
      case 'DONE': return 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]';
      case 'BLOCKED': return 'bg-[#D62828]/20 text-[#D62828] border-[#D62828]/50 shadow-[0_0_10px_rgba(214,40,40,0.2)]';
      default: return 'bg-[#003049] text-[#94a3b8] border-[#003049]';
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-[#D62828]/20 text-[#ef4444] border-[#D62828]/50';
      case 'medium': return 'bg-[#FCBF49]/20 text-[#FCBF49] border-[#FCBF49]/50';
      case 'low': return 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/50';
      default: return 'bg-[var(--so-text-secondary)]/20 text-[#94a3b8] border-[var(--so-text-secondary)]/50';
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    await updateTaskStatus(taskId, newStatus);
  };

  const handleDeleteTask = async (id) => {
    const result = await deleteTask(id);
    if (result.success) setDeleteConfirm(null);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setShowCreateModal(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editingTask) return;
    await uploadFile(file, editingTask.projectId, editingTask.id, fileForm);
    setFileForm({ description: '', title: '', remarks: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-[#F77F00]/20">
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">Tasks Pipeline</h1>
            <p className="text-sm font-bold text-brand-yellow/60 uppercase tracking-wider mt-1">Enterprise Workflow Management</p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setShowCreateModal(true);
            }}
            className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#F77F00] to-[#D62828] text-white font-black rounded-xl shadow-[0_0_20px_rgba(247,127,0,0.3)] hover:shadow-[0_0_30px_rgba(247,127,0,0.5)] hover:-translate-y-0.5 transition-all uppercase tracking-widest text-xs"
          >
            <Plus size={18} /> New Task
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Status Filters */}
          <div className="flex gap-2 p-1.5 bg-[#001222]/60 backdrop-blur-md border border-[#F77F00]/10 rounded-2xl">
            {['all', 'pending', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${filter === tab ? 'bg-gradient-to-r from-[#F77F00] to-[#D62828] text-white shadow-[0_0_15px_rgba(247,127,0,0.3)]' : 'text-brand-yellow/40 hover:text-white hover:bg-white/5'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Project Filter */}
          <div className="flex-1 max-w-xs relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F77F00] z-10">
              <FolderOpen size={16} />
            </div>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedProjectId(val);
                setActiveProject(val === 'all' ? null : val);
              }}
              className="w-full pl-11 pr-10 py-3.5 bg-[#001222]/60 backdrop-blur-md border border-[#F77F00]/10 rounded-2xl text-xs font-black uppercase tracking-[0.1em] text-white outline-none appearance-none hover:border-[#F77F00]/30 transition-all cursor-pointer"
            >
              <option value="all" className="bg-[#001829]">All Workspaces</option>
              {projects.map(project => (
                <option key={project.id} value={project.id} className="bg-[#001829]">
                  {project.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F77F00]/60 pointer-events-none">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <motion.div
                layout
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-[#001829]/60 backdrop-blur-md border border-[#F77F00]/10 hover:border-[#F77F00]/30 rounded-2xl transition-all duration-300 shadow-lg relative overflow-hidden"
              >
                <div className="flex-1 flex items-start md:items-center gap-5">
                  <button 
                    onClick={() => handleStatusChange(task.id, task.status === 'DONE' ? 'TODO' : 'DONE')}
                    className="mt-1 md:mt-0 shrink-0 transition-transform active:scale-90"
                  >
                    {task.status === 'DONE' ? (
                      <CheckCircle size={28} className="text-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 border-[var(--so-text-secondary)] group-hover:border-[#F77F00] transition-colors flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#F77F00] opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      </div>
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className={`font-black text-lg tracking-tight ${task.status === 'DONE' ? 'line-through text-[var(--so-text-secondary)]' : 'text-white'}`}>
                        {task.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getPriorityStyle(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(task.status)}`}>
                          {task.status || 'TODO'}
                        </span>
                        {task.project && (
                          <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-[#001222] text-[#FCBF49] border border-[#FCBF49]/20 flex items-center gap-1.5">
                            <FolderOpen size={10} />
                            {task.project.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#94a3b8] font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#F77F00]" /> {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No Deadline'}</span>
                      <span className="flex items-center gap-1.5"><User size={14} className="text-[#FCBF49]" /> {task.assignee?.name || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-5 md:mt-0 ml-[45px] md:ml-4">
                  <button onClick={() => handleEditClick(task)} className="p-2.5 text-[#94a3b8] hover:text-white hover:bg-[#F77F00]/20 rounded-xl transition-all border border-transparent hover:border-[#F77F00]/30 shadow-sm" title="Task Details">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => setDeleteConfirm(task.id)} className="p-2.5 text-[#94a3b8] hover:text-white hover:bg-[#D62828]/20 rounded-xl transition-all border border-transparent hover:border-[#D62828]/30 shadow-sm" title="Delete Task">
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Modal Overlay */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#001222]/90 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-[#001829] border border-[#F77F00]/30 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row"
              >
                {/* Left Side: Form */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-white tracking-tight">
                      {editingTask ? 'Task Configuration' : 'Deploy New Task'}
                    </h2>
                    <button onClick={() => { setShowCreateModal(false); setEditingTask(null); }} className="p-2 text-brand-yellow/60 hover:text-[#D62828] transition-colors"><X size={24} /></button>
                  </div>

                  <TaskForm 
                    task={editingTask}
                    projects={projects}
                    isEditing={!!editingTask}
                    onSuccess={(data) => {
                      if (!editingTask) {
                        setEditingTask(data);
                      } else {
                        setEditingTask(null);
                        setShowCreateModal(false);
                      }
                      fetchTasks();
                    }}
                    onCancel={() => {
                      setShowCreateModal(false);
                      setEditingTask(null);
                    }}
                  />
                </div>

                {/* Right Side: Attachments & Activity */}
                <div className="w-full md:w-[380px] bg-[#001222]/50 border-l border-[#F77F00]/10 p-8 flex flex-col overflow-y-auto custom-scrollbar">
                  {editingTask ? (
                    <>
                      <h3 className="text-sm font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest"><Paperclip size={16} className="text-[#F77F00]" /> Attachments</h3>
                      
                      {/* Upload Form (Redesigned) */}
                      <div className="space-y-4 mb-8">
                        <div className="grid grid-cols-1 gap-3">
                          <input type="text" placeholder="File Title" className="so-input w-full text-xs py-2.5" value={fileForm.title} onChange={e => setFileForm({...fileForm, title: e.target.value})} />
                          <textarea placeholder="Description / Purpose" rows="2" className="so-input w-full text-xs py-2.5 resize-none" value={fileForm.description} onChange={e => setFileForm({...fileForm, description: e.target.value})} />
                        </div>
                        
                        <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-[#F77F00]/20 hover:border-[#F77F00]/50 transition-all p-6 text-center cursor-pointer bg-[#001829]/40">
                          <Upload size={24} className="text-[#F77F00] mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                          <p className="text-[10px] font-black text-[#cbd5e1] uppercase tracking-widest">Select Source</p>
                          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                          
                          {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="absolute bottom-0 left-0 h-1 bg-[#F77F00] transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                          )}
                        </div>
                      </div>

                      {/* Attachment List */}
                      <div className="space-y-3 flex-1 overflow-y-auto mb-8 pr-2 custom-scrollbar">
                        {files.map(file => (
                          <div key={file.id} className="p-3 bg-[#002038] border border-[#F77F00]/10 rounded-xl hover:border-[#F77F00]/30 transition-all group">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <FileText size={14} className="text-[#FCBF49]" />
                                <p className="text-xs font-bold text-white truncate max-w-[150px]">{file.name}</p>
                              </div>
                              <a href={API_ENDPOINTS.FILES.DOWNLOAD(file.id)} className="p-1.5 bg-[#001222] rounded-lg text-[#94a3b8] hover:text-white transition-colors"><Download size={14} /></a>
                            </div>
                            <p className="text-[9px] text-[var(--so-text-secondary)] uppercase font-bold leading-relaxed">{file.description || 'No description provided'}</p>
                          </div>
                        ))}
                      </div>

                      {/* Mock Activity Feed */}
                      <div className="pt-6 border-t border-[#003049]">
                        <h3 className="text-[10px] font-black text-brand-yellow/80 uppercase tracking-[0.2em] mb-4">Activity Stream</h3>
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#F77F00] mt-1.5"></div>
                            <p className="text-[11px] text-[#94a3b8] font-bold leading-relaxed">
                              <span className="text-white">Admin</span> updated status to <span className="text-[#F77F00]">{editingTask.status}</span>
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FCBF49] mt-1.5"></div>
                            <p className="text-[11px] text-[#94a3b8] font-bold leading-relaxed">
                              Task initialized by <span className="text-white">System AI</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                      <Clock size={48} className="text-[#F77F00] mb-4" />
                      <p className="text-xs font-black text-white uppercase tracking-widest">Metadata Locked</p>
                      <p className="text-[10px] text-[#94a3b8] mt-2">Initialize task to access attachments and activity</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
