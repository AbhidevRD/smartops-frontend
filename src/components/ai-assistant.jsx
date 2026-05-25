'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Send, X, CheckCircle2, AlertCircle, Sparkles, User, Calendar, Flag, FolderOpen } from 'lucide-react';
import aiService from '@/services/ai';
import { Logo } from './logo';
import { useProjectStore } from '@/store/projectStore';
import { useTaskStore } from '@/store/taskStore';

// ─── Task intent detection (mirrors backend logic) ────────────────────────────
function detectTaskIntent(msg) {
  if (!msg || msg.trim().length < 5) return false;
  const lower = msg.toLowerCase().trim();
  const kws = [
    'create task','create a task','add task','add a task','make task',
    'assign task','assign a task','new task','create new task',
    'create bug','add bug','create feature','add feature','create issue',
    'due friday','due monday','due tuesday','due wednesday',
    'due thursday','due saturday','due sunday','due tomorrow',
  ];
  for (const kw of kws) { if (lower.includes(kw)) return true; }
  return /^(create|add|make|assign|build)\s+\w+/.test(lower);
}

// ─── Priority badge ───────────────────────────────────────────────────────────
const PriorityBadge = ({ priority }) => {
  const cfg = {
    HIGH:   { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   label: '🔴 High' },
    MEDIUM: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  label: '🟡 Medium' },
    LOW:    { color: '#22c55e', bg: 'rgba(34,197,94,0.15)',   label: '🟢 Low' },
  }[priority] || { color: '#94a3b8', bg: 'rgba(148,163,184,0.15)', label: priority };
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.color}40`,
      padding: '2px 8px', borderRadius: '12px',
      fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px'
    }}>{cfg.label}</span>
  );
};

// ─── Task Created Success Card ────────────────────────────────────────────────
const TaskCreatedCard = ({ data }) => {
  const { extracted, warning } = data;
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(0,255,136,0.08) 0%, rgba(0,200,100,0.04) 100%)',
      border: '1px solid rgba(0,255,136,0.25)',
      borderRadius: '16px', padding: '14px', marginTop: '4px',
      boxShadow: '0 0 20px rgba(0,255,136,0.1)',
      animation: 'nlpCardIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
        <div style={{
          width:'28px', height:'28px', borderRadius:'50%',
          background: 'linear-gradient(135deg,#00ff88,#00c864)',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow: '0 0 12px rgba(0,255,136,0.5)',
          flexShrink: 0
        }}>
          <CheckCircle2 size={16} color="#001829" />
        </div>
        <div>
          <div style={{ color:'#00ff88', fontWeight:'800', fontSize:'13px', letterSpacing:'0.3px' }}>
            Task Created Successfully!
          </div>
          <div style={{ color:'#94a3b8', fontSize:'10px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.8px' }}>
            Powered by Groq AI • Added to Kanban
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
        <DetailRow icon={<Sparkles size={12}/>} label="Title" value={extracted.title} valueColor="#ffffff" />
        {extracted.assigneeName && (
          <DetailRow icon={<User size={12}/>} label="Assignee" value={extracted.assigneeName} />
        )}
        {extracted.projectName && (
          <DetailRow icon={<FolderOpen size={12}/>} label="Project" value={extracted.projectName} />
        )}
        <DetailRow
          icon={<Flag size={12}/>}
          label="Priority"
          value={<PriorityBadge priority={extracted.priority} />}
          isNode
        />
        {extracted.deadline && (
          <DetailRow
            icon={<Calendar size={12}/>}
            label="Deadline"
            value={new Date(extracted.deadline).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' })}
          />
        )}
        <DetailRow
          icon={<span style={{fontSize:'10px'}}>●</span>}
          label="Status"
          value={<span style={{
            background:'rgba(59,130,246,0.15)', color:'#60a5fa',
            border:'1px solid rgba(59,130,246,0.3)', padding:'2px 8px',
            borderRadius:'12px', fontSize:'11px', fontWeight:'700'
          }}>TODO</span>}
          isNode
        />
      </div>

      {warning && (
        <div style={{
          marginTop:'10px', padding:'8px 10px',
          background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)',
          borderRadius:'8px', display:'flex', alignItems:'flex-start', gap:'6px'
        }}>
          <AlertCircle size={13} color="#f59e0b" style={{flexShrink:0, marginTop:'1px'}} />
          <span style={{ color:'#fbbf24', fontSize:'11px', fontWeight:'500' }}>{warning}</span>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ icon, label, value, valueColor = '#94a3b8', isNode = false }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'12px' }}>
    <span style={{ color:'#475569', width:'14px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</span>
    <span style={{ color:'#64748b', fontWeight:'600', minWidth:'58px', fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}:</span>
    {isNode ? value : <span style={{ color: valueColor, fontWeight:'600' }}>{value}</span>}
  </div>
);

// ─── Intent hint banner ───────────────────────────────────────────────────────
const IntentHint = ({ hasProject }) => (
  <div style={{
    margin:'0 4px 8px', padding:'8px 12px',
    background: hasProject ? 'rgba(247,127,0,0.1)' : 'rgba(100,116,139,0.1)',
    border: `1px solid ${hasProject ? 'rgba(247,127,0,0.3)' : 'rgba(100,116,139,0.2)'}`,
    borderRadius:'10px', display:'flex', alignItems:'center', gap:'8px'
  }}>
    <Sparkles size={13} color={hasProject ? '#F77F00' : '#64748b'} style={{flexShrink:0}} />
    <span style={{ fontSize:'11px', color: hasProject ? '#FCBF49' : '#64748b', fontWeight:'600' }}>
      {hasProject
        ? '✨ Task creation detected — press Send to create it!'
        : '⚠️ Select a project first to create tasks via AI'}
    </span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIAssistant({ projectId: propProjectId = null }) {
  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);
  const [position, setPosition]   = useState({ bottom: 24, right: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const dragPos        = useRef({ startX:0, startY:0, startBottom:24, startRight:24 });

  const { activeProjectId } = useProjectStore();
  const { upsertTaskFromSocket } = useTaskStore();

  // Resolve active project: prop takes precedence, then global store
  const effectiveProjectId = propProjectId || activeProjectId || null;

  // Detect task intent on every input change
  const isTaskIntent = detectTaskIntent(inputValue);

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    setIsDragging(true); setHasDragged(false);
    e.target.setPointerCapture(e.pointerId);
    dragPos.current = { startX:e.clientX, startY:e.clientY, startBottom:position.bottom, startRight:position.right };
  };
  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = dragPos.current.startX - e.clientX;
    const dy = dragPos.current.startY - e.clientY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setHasDragged(true);
    setPosition({ bottom: Math.max(0, dragPos.current.startBottom+dy), right: Math.max(0, dragPos.current.startRight+dx) });
  };
  const handlePointerUp = (e) => {
    if (isDragging) { setIsDragging(false); e.target.releasePointerCapture(e.pointerId); }
  };
  const handleButtonClick = (e) => {
    if (hasDragged) { e.preventDefault(); e.stopPropagation(); return; }
    setIsOpen(true);
  };

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);
  useEffect(() => { if (isOpen && inputRef.current) inputRef.current.focus(); }, [isOpen]);

  // ── Welcome message ────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1', sender: 'ai', timestamp: new Date(),
        content: "Hi! I'm SmartOps AI. I can answer questions AND create real tasks.\n\nTry: \"Create login bug task for Rahul due Friday with high priority\"",
      }]);
    }
  }, [isOpen]);

  const addMessage = (msg) => setMessages(prev => [...prev, msg]);

  // ── Send message handler ───────────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const text = inputValue.trim();
    addMessage({ id: Date.now().toString(), content: text, sender: 'user', timestamp: new Date() });
    setInputValue('');
    setError(null);
    setIsLoading(true);

    try {
      // ── NLP Task Creation path ─────────────────────────────────────────────
      if (isTaskIntent) {
        if (!effectiveProjectId) {
          addMessage({
            id: (Date.now()+1).toString(), sender: 'ai', timestamp: new Date(),
            content: '⚠️ Please select a project from the sidebar first, then I can create tasks for you!',
          });
          setIsLoading(false);
          return;
        }

        const result = await aiService.createTaskFromNLP(text, effectiveProjectId);

        if (result.success) {
          // Push created task into local Kanban store immediately
          upsertTaskFromSocket(result.data.task);

          addMessage({
            id: (Date.now()+1).toString(), sender: 'ai', timestamp: new Date(),
            content: result.data.message,
            taskCard: result.data,   // special field → renders TaskCreatedCard
          });
        } else {
          addMessage({
            id: (Date.now()+1).toString(), sender: 'ai', timestamp: new Date(),
            content: `❌ Task creation failed: ${result.error || 'Unknown error'}`,
          });
        }
      } else {
        // ── Regular AI chat path ───────────────────────────────────────────
        const response = await aiService.chatWithAI(text, effectiveProjectId);
        if (response.success) {
          addMessage({ id: (Date.now()+1).toString(), sender: 'ai', timestamp: new Date(), content: response.data.message });
        } else {
          setError('Failed to get response. Please try again.');
        }
      }
    } catch (err) {
      console.error('AI error:', err);
      const errMsg = err?.response?.data?.error || err?.message || 'Connection error';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => setMessages([{
    id: '1', sender: 'ai', timestamp: new Date(),
    content: "Hi! I'm SmartOps AI. I can answer questions AND create real tasks.\n\nTry: \"Create login bug task for Rahul due Friday with high priority\"",
  }]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes nlpCardIn {
          from { opacity:0; transform:scale(0.92) translateY(8px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 20px rgba(247,127,0,0.5); }
          50%      { box-shadow: 0 0 35px rgba(247,127,0,0.9); }
        }
        @keyframes intentGlow {
          0%,100% { border-color: rgba(247,127,0,0.4); }
          50%      { border-color: rgba(247,127,0,0.8); }
        }
        .so-msg { animation: fadeInUp 0.25s ease; }
        .so-scroll::-webkit-scrollbar { width:4px; }
        .so-scroll::-webkit-scrollbar-track { background:transparent; }
        .so-scroll::-webkit-scrollbar-thumb { background:rgba(247,127,0,0.3); border-radius:2px; }
      `}</style>

      {/* Floating Button */}
      {!isOpen && (
        <button
          onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}
          onClick={handleButtonClick}
          style={{
            position:'fixed', bottom:`${position.bottom}px`, right:`${position.right}px`,
            width:'56px', height:'56px', borderRadius:'50%', zIndex:40,
            background:'linear-gradient(135deg,#F77F00,#D62828)',
            border:'1px solid rgba(252,191,73,0.3)', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 0 20px rgba(247,127,0,0.5)',
            animation:'pulseGlow 3s ease infinite',
            touchAction:'none', transition:'transform 0.2s',
          }}
          title="Open SmartOps AI"
          onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
        >
          <MessageCircle size={24} color="white" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div style={{
          position:'fixed', bottom:`${position.bottom}px`, right:`${position.right}px`,
          width:'400px', height:'620px', zIndex:50,
          background:'rgba(0,24,41,0.97)', backdropFilter:'blur(20px)',
          borderRadius:'20px', border:'1px solid rgba(247,127,0,0.2)',
          boxShadow:'0 20px 60px rgba(0,0,0,0.6)',
          display:'flex', flexDirection:'column', overflow:'hidden',
        }}>

          {/* Header */}
          <div
            onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}
            style={{
              background:'#001222', padding:'14px 16px',
              borderBottom:'1px solid rgba(247,127,0,0.2)',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              cursor:'move', userSelect:'none', touchAction:'none', flexShrink:0,
            }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:'10px', pointerEvents:'none' }}>
              <div style={{
                background:'#001829', padding:'5px', borderRadius:'10px',
                border:'1px solid rgba(247,127,0,0.3)', display:'flex', alignItems:'center',
              }}>
                <Logo size="sm" variant="iconOnly" animate={isLoading} />
              </div>
              <div>
                <div style={{ color:'white', fontWeight:'800', fontSize:'14px' }}>SmartOps AI</div>
                <div style={{
                  fontSize:'10px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px',
                  color: isLoading ? '#FCBF49' : '#F77F00',
                }}>
                  {isLoading
                    ? (isTaskIntent ? '🤖 Creating task...' : '⚡ Thinking...')
                    : effectiveProjectId ? '● Online • Task Mode Ready' : '● Online'}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:'4px' }}>
              <button onClick={handleClearChat} style={{
                background:'none', border:'none', cursor:'pointer', padding:'6px',
                color:'#64748b', borderRadius:'6px', display:'flex', alignItems:'center',
              }}
                title="Clear chat"
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background='none'}
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button onClick={() => setIsOpen(false)} style={{
                background:'none', border:'none', cursor:'pointer', padding:'6px',
                color:'#64748b', borderRadius:'6px', display:'flex', alignItems:'center',
              }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background='none'}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="so-scroll" style={{
            flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:'12px',
            background:'#001829',
          }}>
            {messages.map(msg => (
              <div key={msg.id} className="so-msg" style={{ display:'flex', justifyContent: msg.sender==='user' ? 'flex-end':'flex-start' }}>
                <div style={{
                  maxWidth:'88%',
                  background: msg.sender==='user'
                    ? 'linear-gradient(135deg,#F77F00,#D62828)'
                    : '#002038',
                  color: msg.sender==='user' ? 'white' : '#cbd5e1',
                  border: msg.sender==='user' ? 'none' : '1px solid rgba(247,127,0,0.15)',
                  borderRadius: msg.sender==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding:'10px 14px',
                  boxShadow: msg.sender==='user'
                    ? '0 4px 15px rgba(247,127,0,0.25)'
                    : '0 4px 15px rgba(0,0,0,0.3)',
                }}>
                  <p style={{ fontSize:'13px', lineHeight:'1.5', fontWeight:'500', whiteSpace:'pre-wrap', wordBreak:'break-word', margin:0 }}>
                    {msg.content}
                  </p>
                  {msg.taskCard && <TaskCreatedCard data={msg.taskCard} />}
                  <span style={{
                    display:'block', marginTop:'6px', fontSize:'10px', fontWeight:'700',
                    textTransform:'uppercase', letterSpacing:'0.6px',
                    color: msg.sender==='user' ? 'rgba(252,191,73,0.8)' : 'rgba(100,116,139,0.7)'
                  }}>
                    {msg.timestamp.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="so-msg" style={{ display:'flex', justifyContent:'flex-start' }}>
                <div style={{
                  background:'#002038', border:'1px solid rgba(247,127,0,0.15)',
                  borderRadius:'16px 16px 16px 4px', padding:'10px 14px',
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{
                      width:'16px', height:'16px', borderRadius:'50%',
                      border:'2px solid #F77F00', borderTopColor:'transparent',
                      animation:'spin 0.8s linear infinite',
                    }}/>
                    <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
                    <span style={{ fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.8px', color:'#FCBF49' }}>
                      {isTaskIntent ? 'Creating task with AI...' : 'AI is thinking...'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div style={{
                background:'rgba(214,40,40,0.1)', border:'1px solid rgba(214,40,40,0.3)',
                borderRadius:'12px', padding:'10px 14px', display:'flex', alignItems:'center', gap:'8px'
              }}>
                <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#D62828', flexShrink:0, animation:'nlpCardIn 0.5s ease' }} />
                <p style={{ color:'#ef4444', fontSize:'12px', fontWeight:'600', margin:0 }}>{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Intent hint */}
          {isTaskIntent && (
            <div style={{ padding:'0 12px', flexShrink:0 }}>
              <IntentHint hasProject={!!effectiveProjectId} />
            </div>
          )}

          {/* Input area */}
          <div style={{
            padding:'12px 16px', background:'#001222',
            borderTop:'1px solid rgba(247,127,0,0.15)', flexShrink:0
          }}>
            <form onSubmit={handleSendMessage} style={{ display:'flex', gap:'8px' }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={effectiveProjectId
                  ? 'Ask anything or "Create login bug for Rahul due Friday"...'
                  : 'Ask AI anything about your projects...'}
                disabled={isLoading}
                style={{
                  flex:1, padding:'11px 14px',
                  background:'#001829',
                  border: isTaskIntent
                    ? '1px solid rgba(247,127,0,0.6)'
                    : '1px solid rgba(247,127,0,0.2)',
                  borderRadius:'12px', fontSize:'13px',
                  color:'white', outline:'none',
                  transition:'border-color 0.2s',
                  animation: isTaskIntent ? 'intentGlow 2s ease infinite' : 'none',
                }}
                onFocus={e => { if (!isTaskIntent) e.target.style.borderColor='rgba(247,127,0,0.5)'; }}
                onBlur={e => { if (!isTaskIntent) e.target.style.borderColor='rgba(247,127,0,0.2)'; }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                style={{
                  padding:'11px 14px',
                  background: isTaskIntent
                    ? 'linear-gradient(135deg,#00ff88,#00c864)'
                    : 'linear-gradient(135deg,#F77F00,#D62828)',
                  border:'none', borderRadius:'12px', cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  opacity: (!inputValue.trim() || isLoading) ? 0.5 : 1,
                  transition:'all 0.2s',
                  boxShadow: isTaskIntent ? '0 0 12px rgba(0,255,136,0.4)' : '0 0 12px rgba(247,127,0,0.3)',
                }}
              >
                {isLoading
                  ? <div style={{ width:'18px', height:'18px', borderRadius:'50%', border:'2px solid white', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }} />
                  : isTaskIntent
                    ? <Sparkles size={18} color="#001829" />
                    : <Send size={18} color="white" />
                }
              </button>
            </form>
            <div style={{ textAlign:'center', marginTop:'8px' }}>
              <span style={{ fontSize:'9px', color:'rgba(100,116,139,0.7)', textTransform:'uppercase', letterSpacing:'1px', fontWeight:'700' }}>
                SmartOps AI • F12 NLP Task Creation
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
