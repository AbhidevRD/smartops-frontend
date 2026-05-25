'use client';

import { useEffect, useState, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { useChatStore } from '@/store/chatStore';
import { useProjectStore } from '@/store/projectStore';
import { useFileStore } from '@/store/fileStore';
import { Send, AlertCircle, MessageSquare, Paperclip, X, Image as ImageIcon, FileText, Download, Loader2 } from 'lucide-react';

export default function ChatPage() {
  const { messages, sendMessage, fetchChatHistory, isLoading, error } = useChatStore();
  const { projects, fetchProjects, activeProjectId, setActiveProject } = useProjectStore();
  const { uploadFile, uploadProgress, isLoading: isUploading } = useFileStore();
  
  // Use global activeProjectId as the selected project for chat
  const selectedProjectId = activeProjectId;
  const setSelectedProjectId = (id) => setActiveProject(id);
  const [newMessage, setNewMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchChatHistory(selectedProjectId);
    }
  }, [selectedProjectId, fetchChatHistory]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !selectedProjectId) return;

    setSubmitting(true);
    let fileData = null;

    if (selectedFile) {
      const result = await uploadFile(selectedFile, selectedProjectId);
      if (result.success) {
        fileData = result.data;
      } else {
        alert('Failed to upload file');
        setSubmitting(false);
        return;
      }
    }

    const result = await sendMessage(selectedProjectId, newMessage, fileData);
    setSubmitting(false);

    if (result.success) {
      setNewMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const isImage = (type) => type?.startsWith('image/');

  return (
    <AppLayout>
      <div className="p-6 h-full flex flex-col relative z-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8 tracking-tight flex items-center gap-3">
          Team Chat
          <span className="h-2 w-2 rounded-full bg-[#F77F00] animate-pulse"></span>
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-[#D62828]/10 border border-[#D62828]/30 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} className="text-[#D62828]" />
            <span className="text-[#ef4444] text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden h-full">
          {/* Sidebar - Project List */}
          <div className="w-full md:w-72 bg-[#001829]/60 backdrop-blur-xl border border-[#F77F00]/10 rounded-2xl overflow-y-auto custom-scrollbar shadow-[0_8px_32px_rgba(0,0,0,0.3)] shrink-0 h-[200px] md:h-auto">
            <div className="p-5">
              <h3 className="text-xs font-bold text-[#FCBF49] uppercase tracking-widest mb-4">Projects</h3>
              <div className="space-y-2">
                {projects && projects.length > 0 ? (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={`p-3.5 rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedProjectId === project.id
                          ? 'bg-gradient-to-r from-[#F77F00]/20 to-transparent border-l-4 border-[#F77F00] shadow-[inset_0_0_20px_rgba(247,127,0,0.1)]'
                          : 'bg-[#002038]/50 hover:bg-[#002038] hover:border-[#F77F00]/30 border-l-4 border-transparent'
                      }`}
                    >
                      <p className={`text-sm font-bold truncate transition-colors ${selectedProjectId === project.id ? 'text-white' : 'text-[#cbd5e1]'}`}>{project.name}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[var(--so-text-secondary)] font-medium text-center py-4">No projects available</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Chat */}
          {selectedProjectId ? (
            <div className="so-card flex-1 flex flex-col overflow-hidden h-[600px] md:h-auto">
              {/* Header */}
              <div className="p-5 border-b border-[#F77F00]/10 bg-[#001829]/40 relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F77F00]/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <MessageSquare size={18} className="text-[#F77F00]" />
                    {projects.find(p => p.id === selectedProjectId)?.name || 'Chat'}
                  </h2>
                  <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider font-semibold ml-6">Secure Project Conversation</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#001222]/40">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex items-center gap-3">
                      <Loader2 size={24} className="text-[#F77F00] animate-spin" />
                      <p className="text-xs font-bold text-[#FCBF49] uppercase tracking-widest">Loading messages...</p>
                    </div>
                  </div>
                ) : messages && messages.length > 0 ? (
                  <>
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex gap-4 animate-fade-in-up">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#003049] to-[#001222] border border-[#F77F00]/30 rounded-2xl flex items-center justify-center text-xs font-black text-white shadow-[0_10px_20px_rgba(0,0,0,0.4)] flex-shrink-0 group-hover:scale-110 transition-transform">
                          {(msg.sender?.name || msg.user || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 max-w-[85%] bg-[#002038]/40 backdrop-blur-md border border-[#F77F00]/10 rounded-2xl rounded-tl-sm p-5 shadow-xl hover:border-[#F77F00]/30 transition-all">
                          <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-3">
                                <span className="text-sm font-black text-white tracking-tight">
                                  {msg.sender?.name || msg.user || 'User'}
                                </span>
                             </div>
                             <span className="text-[9px] text-[var(--so-text-secondary)] uppercase tracking-widest font-black">
                               {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'now'}
                             </span>
                          </div>
                          
                          {/* File Attachment Renderer */}
                          {msg.fileUrl && (
                            <div className="mb-3 mt-1 inline-block">
                              {isImage(msg.fileType) ? (
                                <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="block relative group overflow-hidden rounded-xl border border-[#F77F00]/20">
                                  <img src={msg.fileUrl} alt={msg.fileName} className="max-w-[280px] max-h-[280px] object-cover group-hover:scale-105 transition-transform duration-300" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <Download size={24} className="text-white drop-shadow-md" />
                                  </div>
                                </a>
                              ) : (
                                <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-[#001222]/80 border border-[#F77F00]/20 rounded-xl hover:border-[#F77F00]/50 hover:bg-[#001829] transition-all group">
                                  <div className="p-2 bg-[#003049] rounded-lg text-[#FCBF49]">
                                    <FileText size={20} />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-white truncate max-w-[200px] group-hover:text-[#F77F00] transition-colors">{msg.fileName}</p>
                                    <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider">Document</p>
                                  </div>
                                  <Download size={16} className="text-[var(--so-text-secondary)] ml-2 group-hover:text-white" />
                                </a>
                              )}
                            </div>
                          )}

                          {msg.message && (
                            <p className="text-sm text-[#e2e8f0] font-bold break-words leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <MessageSquare size={48} className="text-[#F77F00]/20 mb-4" />
                    <p className="text-sm font-medium text-[#94a3b8]">No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="bg-[#001829]/60 backdrop-blur-md shrink-0">
                
                {/* File Preview before sending */}
                {selectedFile && (
                  <div className="px-5 py-3 border-t border-[#F77F00]/10 bg-[#001222] flex items-center gap-3">
                    <div className="p-2 bg-[#002038] rounded-lg border border-[#F77F00]/20 text-[#FCBF49]">
                      {isImage(selectedFile.type) ? <ImageIcon size={18} /> : <FileText size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white truncate max-w-sm">{selectedFile.name}</p>
                      <p className="text-[10px] text-[#94a3b8]">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button 
                      onClick={() => setSelectedFile(null)} 
                      className="p-1.5 text-[#94a3b8] hover:text-[#D62828] hover:bg-[#D62828]/10 rounded-md transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Upload Progress */}
                {isUploading && uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="h-1 w-full bg-[#001222]">
                    <div className="h-full bg-gradient-to-r from-[#F77F00] to-[#D62828] transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}

                {/* Chat Input */}
                <div className="p-5 border-t border-[#F77F00]/10 flex items-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={submitting || isUploading}
                    className="p-3 text-[#cbd5e1] bg-[#001222] border border-[#F77F00]/20 rounded-xl hover:text-white hover:border-[#F77F00]/50 hover:bg-[#002038] transition-all disabled:opacity-50 group"
                    title="Attach File"
                  >
                    <Paperclip size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                  
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !submitting && handleSendMessage()}
                    placeholder="Type a message or attach a file..."
                    disabled={submitting || isUploading}
                    className="flex-1 bg-[#001222] border border-[#F77F00]/20 rounded-xl px-4 py-3 text-sm text-white placeholder-[var(--so-text-secondary)] focus:outline-none focus:border-[#F77F00]/50 focus:ring-1 focus:ring-[#F77F00]/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                  />
                  
                  <button 
                    onClick={handleSendMessage} 
                    disabled={submitting || isUploading || (!newMessage.trim() && !selectedFile)}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#F77F00] to-[#D62828] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(247,127,0,0.4)] transition-all duration-300"
                  >
                    {submitting || isUploading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} className={(newMessage.trim() || selectedFile) ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#001829]/40 backdrop-blur-xl border border-[#F77F00]/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] h-[600px] md:h-auto">
              <div className="p-6 bg-[#001222] rounded-full border border-[#F77F00]/20 mb-6 shadow-[0_0_30px_rgba(247,127,0,0.15)] animate-pulse-slow">
                <MessageSquare size={48} className="text-[#F77F00]/40" />
              </div>
              <p className="text-xl font-black text-white mb-2 tracking-wide">Select a project</p>
              <p className="text-sm text-[#94a3b8]">Choose a project from the sidebar to start collaborating</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
