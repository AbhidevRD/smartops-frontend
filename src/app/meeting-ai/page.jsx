'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useProjectStore } from '@/store/projectStore';
import { analyzeMeetingNotes, createMeetingTasks } from '@/services/ai';
import { 
  Clipboard, 
  FileText, 
  Sparkles, 
  CheckCircle, 
  User, 
  Calendar, 
  AlertCircle, 
  X, 
  Trash2, 
  Check,
  ChevronRight,
  Loader2,
  Upload
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function MeetingAIPage() {
  const { activeProjectId, activeProject } = useProjectStore();
  const [notes, setNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState([]);
  const [summary, setSummary] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // 1. Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNotes(event.target.result);
        toast.success(`Loaded: ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setNotes(event.target.result);
        toast.success(`Dropped: ${file.name}`);
      };
      reader.readAsText(file);
    }
  };

  // 2. Analyze Notes
  const handleAnalyze = async () => {
    if (!activeProjectId) {
      toast.error("Please select a project first");
      return;
    }
    if (!notes || notes.trim().length < 10) {
      toast.error("Meeting notes are too short");
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await analyzeMeetingNotes(notes, activeProjectId);
      if (res.success) {
        setExtractedTasks(res.data.tasks);
        setSummary(res.data.summary);
        toast.success(`Extracted ${res.data.tasks.length} tasks!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "AI Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 3. Edit Task Field
  const updateTask = (index, field, value) => {
    const newTasks = [...extractedTasks];
    newTasks[index][field] = value;
    setExtractedTasks(newTasks);
  };

  const removeTask = (index) => {
    setExtractedTasks(extractedTasks.filter((_, i) => i !== index));
  };

  // 4. Create Tasks
  const handleConfirmCreate = async () => {
    if (extractedTasks.length === 0) return;

    setIsCreating(true);
    try {
      const res = await createMeetingTasks(extractedTasks, activeProjectId);
      if (res.success) {
        toast.success(`Created ${res.data.count} tasks successfully!`);
        setExtractedTasks([]);
        setNotes('');
        setSummary('');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create tasks");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
            <span className="p-3 bg-gradient-to-br from-[#F77F00] to-[#D62828] rounded-2xl shadow-lg shadow-[#F77F00]/20">
              <Clipboard className="w-8 h-8 text-white" />
            </span>
            Meeting Notes → Tasks AI
          </h1>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl">
            Transform your unstructured meeting transcripts and notes into actionable project tasks automatically using AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div 
              className={`bg-[#001222]/80 backdrop-blur-xl border-2 ${dragActive ? 'border-[#F77F00] bg-[#F77F00]/5' : 'border-white/5'} rounded-3xl p-6 transition-all duration-300 relative overflow-hidden`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#F77F00]" />
                  Meeting Transcript
                </label>
                <div className="flex gap-2">
                   <button 
                    onClick={() => setNotes('')}
                    className="text-xs text-gray-500 hover:text-white transition-colors"
                  >Clear</button>
                </div>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your meeting notes, action items, or a full transcript here..."
                className="w-full h-80 bg-[#001829] border border-white/5 rounded-2xl p-5 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#F77F00]/50 transition-all resize-none text-base leading-relaxed"
              />

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <label className="cursor-pointer group flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                    <Upload className="w-4 h-4 text-gray-500 group-hover:text-[#F77F00]" />
                    Upload .txt file
                    <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                <div className="text-[10px] text-gray-500 font-medium">
                  {notes.length} characters
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || notes.length < 10}
                className={`w-full mt-6 py-4 rounded-2xl flex items-center justify-center gap-3 text-white font-bold transition-all duration-500 group relative overflow-hidden ${
                  isAnalyzing 
                    ? 'bg-gray-800 cursor-wait' 
                    : 'bg-gradient-to-r from-[#F77F00] to-[#D62828] hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#F77F00]/40'
                }`}
              >
                {isAnalyzing ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 transition-transform group-hover:rotate-12" />
                    <span>Analyze & Extract Tasks</span>
                  </>
                )}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
              </button>
            </div>

            {/* Context Widget */}
            <div className="bg-[#001222]/40 border border-white/5 rounded-3xl p-6">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Current Context</h3>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#F77F00] border border-white/10">
                  <ChevronRight className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{activeProject?.name || 'No Project Selected'}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Active Scope</div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7">
            {!extractedTasks.length && !isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-300">Ready for Analysis</h3>
                <p className="text-gray-500 mt-2 max-w-xs">
                  Your extracted tasks will appear here after AI processing.
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center p-12 space-y-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-t-2 border-[#F77F00] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#F77F00] animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white animate-pulse">Groq AI is Thinking...</h3>
                  <p className="text-gray-500 mt-2">Extracting action items and mapping team members.</p>
                </div>
              </div>
            )}

            {extractedTasks.length > 0 && !isAnalyzing && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Summary Header */}
                <div className="bg-gradient-to-br from-[#001222] to-[#001829] border border-white/10 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F77F00]/10 flex items-center justify-center text-[#F77F00] border border-[#F77F00]/20">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Extracted Action Items</h2>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{extractedTasks.length} Potential Tasks Found</div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed italic border-l-2 border-[#F77F00]/30 pl-4 py-1">
                    "{summary}"
                  </p>
                </div>

                {/* Task Cards */}
                <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {extractedTasks.map((task, idx) => (
                    <div 
                      key={idx} 
                      className="bg-[#001222]/80 border border-white/5 rounded-3xl p-5 hover:border-white/10 transition-all group"
                    >
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-4">
                          <input
                            type="text"
                            value={task.title}
                            onChange={(e) => updateTask(idx, 'title', e.target.value)}
                            className="w-full bg-transparent text-lg font-bold text-white focus:outline-none focus:text-[#F77F00] transition-colors"
                          />
                          <textarea
                            value={task.description}
                            onChange={(e) => updateTask(idx, 'description', e.target.value)}
                            className="w-full bg-transparent text-sm text-gray-400 focus:outline-none focus:text-gray-300 resize-none h-12"
                          />
                          
                          <div className="flex flex-wrap gap-4 pt-2">
                            {/* Assignee */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                              <User className="w-3.5 h-3.5 text-gray-500" />
                              <span className="text-xs font-bold text-gray-300">
                                {task.resolvedAssigneeName || 'Unassigned'}
                              </span>
                              {!task.assigneeId && task.assigneeName && (
                                <AlertCircle className="w-3 h-3 text-[#FCBF49]" title="Fuzzy matched but not verified" />
                              )}
                            </div>

                            {/* Priority */}
                            <select
                              value={task.priority}
                              onChange={(e) => updateTask(idx, 'priority', e.target.value)}
                              className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border focus:outline-none appearance-none cursor-pointer ${
                                task.priority === 'HIGH' ? 'bg-[#D62828]/10 text-[#D62828] border-[#D62828]/20' :
                                task.priority === 'MEDIUM' ? 'bg-[#FCBF49]/10 text-[#FCBF49] border-[#FCBF49]/20' :
                                'bg-[#219EBC]/10 text-[#219EBC] border-[#219EBC]/20'
                              }`}
                            >
                              <option value="LOW">Low</option>
                              <option value="MEDIUM">Medium</option>
                              <option value="HIGH">High</option>
                            </select>

                            {/* Deadline */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                              <Calendar className="w-3.5 h-3.5 text-gray-500" />
                              <input 
                                type="date"
                                value={task.deadline || ''}
                                onChange={(e) => updateTask(idx, 'deadline', e.target.value)}
                                className="bg-transparent text-xs font-bold text-gray-300 outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => removeTask(idx)}
                          className="self-start p-2 text-gray-600 hover:text-[#D62828] transition-colors bg-white/5 rounded-xl hover:bg-[#D62828]/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Confirm Create Button */}
                <button
                  onClick={handleConfirmCreate}
                  disabled={isCreating}
                  className="w-full py-5 bg-gradient-to-r from-[#059669] to-[#10B981] rounded-[30px] flex items-center justify-center gap-3 text-white font-black text-lg shadow-2xl shadow-[#059669]/30 hover:scale-[1.01] transition-transform active:scale-[0.99] disabled:opacity-50"
                >
                  {isCreating ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-7 h-7" />
                      <span>Confirm & Create {extractedTasks.length} Tasks</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(247, 127, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(247, 127, 0, 0.4);
        }
      `}</style>
    </AppLayout>
  );
}
