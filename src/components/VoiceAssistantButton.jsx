'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { useProjectStore } from '@/store/projectStore';
import { useTaskStore } from '@/store/taskStore';

const INTENT_CFG = {
  CREATE_TASK:   { color:'#00ff88', bg:'rgba(0,255,136,0.12)',   label:'✨ Task Created' },
  UPDATE_STATUS: { color:'#60a5fa', bg:'rgba(96,165,250,0.12)',  label:'🔄 Status Updated' },
  QUERY_TASKS:   { color:'#FCBF49', bg:'rgba(252,191,73,0.12)',  label:'🔍 Tasks Found' },
  NAVIGATE:      { color:'#a78bfa', bg:'rgba(167,139,250,0.12)', label:'🧭 Navigating' },
  GENERAL:       { color:'#94a3b8', bg:'rgba(148,163,184,0.1)',  label:'💬 AI Response' },
};

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22,pointerEvents:'none'}}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8"  y1="23" x2="16" y2="23"/>
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18,pointerEvents:'none'}}>
      <rect x="6" y="6" width="12" height="12" rx="2"/>
    </svg>
  );
}

function Waveform({ active }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:'3px',height:'20px'}}>
      {[0,1,2,3,4,5,6].map(i => (
        <div key={i} style={{
          width:'3px', borderRadius:'99px',
          background: active ? '#F77F00' : '#334155',
          animation: active ? `vcWave 0.9s ease-in-out ${i*0.09}s infinite` : 'none',
          height: active ? '100%' : '4px',
          transition:'height 0.3s',
        }}/>
      ))}
    </div>
  );
}

export default function VoiceAssistantButton({ position = { bottom:96, right:24 } }) {
  const router = useRouter();
  const { activeProjectId } = useProjectStore();
  const { upsertTaskFromSocket } = useTaskStore();

  // ── Refs (avoid stale-closure bugs) ────────────────────────────────────────
  const recognitionRef  = useRef(null);
  const finalTextRef    = useRef('');
  const hasDraggedRef   = useRef(false);
  const isDraggingRef   = useRef(false);
  const dragStartRef    = useRef({x:0,y:0,bottom:0,right:0});
  const resetTimer      = useRef(null);
  const supportedRef    = useRef(false);   // set in useEffect (SSR-safe)

  // ── State ──────────────────────────────────────────────────────────────────
  const [phase, setPhase]           = useState('idle'); // idle|listening|processing|success|error
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim]       = useState('');
  const [result, setResult]         = useState(null);
  const [errorMsg, setErrorMsg]     = useState('');
  const [panelOpen, setPanelOpen]   = useState(false);
  const [pos, setPos]               = useState(position);

  // Check speech support after mount (window exists on client only)
  useEffect(() => {
    supportedRef.current = !!(
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)
    );
  }, []);

  // ── Auto-reset to idle ─────────────────────────────────────────────────────
  const autoReset = useCallback((ms = 5000) => {
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setPhase('idle');
      setResult(null);
      setTranscript('');
      setInterim('');
      setErrorMsg('');
    }, ms);
  }, []);

  // ── Send transcript to backend ────────────────────────────────────────────
  const sendToBackend = useCallback(async (text) => {
    const projId = useProjectStore.getState().activeProjectId;

    if (!projId) {
      setPhase('error');
      setErrorMsg('No active project selected. Pick a project from the sidebar first.');
      autoReset(4000);
      return;
    }

    setPhase('processing');
    console.log('[Voice] Sending:', text, '| Project:', projId);

    try {
      const res = await axiosInstance.post(API_ENDPOINTS.AI.VOICE_COMMAND, {
        transcript: text,
        command:    text,
        projectId:  projId,
      });

      const body = res.data;
      console.log('[Voice] Response:', body);

      setResult({
        intent:   body.intent   || 'GENERAL',
        response: body.response || body.data?.message || 'Done!',
        data:     body.data     || {},
      });

      if (body.intent === 'CREATE_TASK' && body.data?.task) {
        upsertTaskFromSocket(body.data.task);
      }
      if (body.intent === 'UPDATE_STATUS' && body.data?.task) {
        upsertTaskFromSocket(body.data.task);
      }

      setPhase('success');

      if (body.intent === 'NAVIGATE' && body.data?.route) {
        setTimeout(() => router.push(body.data.route), 800);
      }

      autoReset(6000);
    } catch (err) {
      console.error('[Voice] Backend error:', err);
      setPhase('error');
      setErrorMsg(err?.response?.data?.error || err?.message || 'Command failed. Try again.');
      autoReset(4000);
    }
  }, [autoReset, router, upsertTaskFromSocket]);

  // ── Build & start recognition ─────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!supportedRef.current) {
      setPhase('error');
      setErrorMsg('Voice commands require Chrome or Edge browser.');
      autoReset(4000);
      return;
    }

    // Clean up any previous instance
    try { recognitionRef.current?.stop(); } catch(_) {}

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r  = new SR();
    r.lang           = 'en-US';
    r.interimResults = true;
    r.continuous     = false;
    r.maxAlternatives= 1;

    finalTextRef.current = '';

    r.onstart = () => {
      console.log('[Voice] Recognition started');
      setPhase('listening');
      setTranscript('');
      setInterim('');
      setResult(null);
      setPanelOpen(true);
    };

    r.onresult = (e) => {
      let fin = '', intr = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const seg = e.results[i];
        if (seg.isFinal) fin  += seg[0].transcript;
        else             intr += seg[0].transcript;
      }
      if (intr) setInterim(intr);
      if (fin) {
        finalTextRef.current += (finalTextRef.current ? ' ' : '') + fin;
        setTranscript(finalTextRef.current);
        setInterim('');
      }
    };

    r.onerror = (e) => {
      console.error('[Voice] Error:', e.error);
      if (e.error === 'not-allowed' || e.error === 'permission-denied') {
        setPhase('error');
        setErrorMsg('Microphone access denied. Allow it in your browser settings.');
        autoReset(5000);
      } else if (e.error === 'no-speech') {
        setPhase('idle');
      } else {
        setPhase('error');
        setErrorMsg(`Recognition error: ${e.error}`);
        autoReset(4000);
      }
    };

    r.onend = () => {
      console.log('[Voice] Recognition ended. Final:', finalTextRef.current);
      const text = finalTextRef.current.trim();
      if (text) {
        sendToBackend(text);
      } else {
        setPhase('idle');
      }
    };

    recognitionRef.current = r;

    try {
      r.start();
      console.log('[Voice] r.start() called');
    } catch (err) {
      console.error('[Voice] r.start() threw:', err.message);
      setPhase('error');
      setErrorMsg('Could not start microphone: ' + err.message);
      autoReset(4000);
    }
  }, [autoReset, sendToBackend]);

  // ── Button click — NO drag check, dedicated click handler ─────────────────
  const handleClick = useCallback(() => {
    // Ignore if this was a drag
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    clearTimeout(resetTimer.current);

    if (phase === 'listening') {
      recognitionRef.current?.stop();
      return;
    }
    if (phase === 'processing') return;

    startListening();
  }, [phase, startListening]);

  // ── Drag: on the wrapper div, separate from button click ──────────────────
  const onWrapperPointerDown = (e) => {
    // Only initiate drag from the wrapper, not the button itself
    if (e.target.closest('button')) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { x:e.clientX, y:e.clientY, bottom:pos.bottom, right:pos.right };
  };

  // Allow dragging the panel header
  const onHeaderPointerDown = (e) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { x:e.clientX, y:e.clientY, bottom:pos.bottom, right:pos.right };
  };

  const onPointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = dragStartRef.current.x - e.clientX;
    const dy = dragStartRef.current.y - e.clientY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasDraggedRef.current = true;
    setPos({
      bottom: Math.max(0, dragStartRef.current.bottom + dy),
      right:  Math.max(0, dragStartRef.current.right  + dx),
    });
  };

  const onPointerUp = (e) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(_) {}
    }
  };

  // Cleanup on unmount
  useEffect(() => () => {
    clearTimeout(resetTimer.current);
    try { recognitionRef.current?.stop(); } catch(_) {}
  }, []);

  // ── Visual config by phase ─────────────────────────────────────────────────
  const cfg = {
    idle:       { btnBg:'linear-gradient(135deg,#F77F00,#D62828)', glow:'rgba(247,127,0,0.55)', label:'Voice Command' },
    listening:  { btnBg:'linear-gradient(135deg,#D62828,#991b1b)', glow:'rgba(214,40,40,0.7)',  label:'Listening… tap to stop' },
    processing: { btnBg:'linear-gradient(135deg,#7c3aed,#4f46e5)', glow:'rgba(124,58,237,0.6)', label:'Processing…' },
    success:    { btnBg:'linear-gradient(135deg,#059669,#047857)', glow:'rgba(5,150,105,0.6)',  label:'Done!' },
    error:      { btnBg:'linear-gradient(135deg,#b91c1c,#7f1d1d)', glow:'rgba(185,28,28,0.6)',  label:'Error' },
  }[phase] || { btnBg:'linear-gradient(135deg,#F77F00,#D62828)', glow:'rgba(247,127,0,0.5)', label:'' };

  const intentCfg = result ? (INTENT_CFG[result.intent] || INTENT_CFG.GENERAL) : null;

  return (
    <>
      <style>{`
        @keyframes vcSpin  { to { transform: rotate(360deg); } }
        @keyframes vcWave  { 0%,100% { transform:scaleY(0.3); } 50% { transform:scaleY(1); } }
        @keyframes vcRipple{ 0% { transform:scale(1); opacity:0.7; } 100% { transform:scale(2.4); opacity:0; } }
        @keyframes vcGlow  { 0%,100% { box-shadow:0 0 16px var(--vg); } 50% { box-shadow:0 0 36px var(--vg),0 0 60px var(--vg); } }
        @keyframes vcSlideUp{ from { opacity:0; transform:translateY(10px) scale(0.95); } to { opacity:1; transform:none; } }
      `}</style>

      {/* ── Fixed container ── */}
      <div
        style={{ position:'fixed', bottom:`${pos.bottom}px`, right:`${pos.right}px`, zIndex:49 }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerDown={onWrapperPointerDown}
      >
        {/* Ripple rings while listening */}
        {phase === 'listening' && [0,1,2].map(i => (
          <div key={i} style={{
            position:'absolute', inset:0, borderRadius:'50%',
            border:'2px solid #D62828',
            animation:`vcRipple 1.8s ease-out ${i*0.6}s infinite`,
            pointerEvents:'none',
          }}/>
        ))}

        {/* ── Mic button ── */}
        <button
          onClick={handleClick}
          title={cfg.label}
          style={{
            '--vg': cfg.glow,
            position:'relative', display:'flex', alignItems:'center', justifyContent:'center',
            width:'56px', height:'56px', borderRadius:'50%',
            background: cfg.btnBg,
            border:'2px solid rgba(255,255,255,0.15)',
            color:'white', cursor: phase === 'processing' ? 'wait' : 'pointer',
            boxShadow:`0 0 20px ${cfg.glow}`,
            animation: phase === 'idle' || phase === 'listening' ? 'vcGlow 2.5s ease infinite' : 'none',
            transition:'background 0.3s, box-shadow 0.3s',
            outline:'none',
          }}
        >
          {phase === 'listening'  && <StopIcon />}
          {phase === 'processing' && (
            <div style={{
              width:20, height:20, borderRadius:'50%',
              border:'2.5px solid white', borderTopColor:'transparent',
              animation:'vcSpin 0.8s linear infinite',
            }}/>
          )}
          {phase === 'success' && <span style={{fontSize:20}}>✓</span>}
          {phase === 'error'   && <span style={{fontSize:18}}>!</span>}
          {(phase === 'idle')  && <MicIcon />}

          {/* Status dot */}
          <span style={{
            position:'absolute', bottom:'2px', right:'2px',
            width:'10px', height:'10px', borderRadius:'50%',
            border:'2px solid #001829',
            background:{
              idle:'#F77F00', listening:'#ef4444', processing:'#8b5cf6',
              success:'#22c55e', error:'#ef4444',
            }[phase] || '#F77F00',
          }}/>
        </button>

        {/* ── Expanded panel ── */}
        {panelOpen && (
          <div style={{
            position:'absolute', bottom:'68px', right:'0',
            width:'310px', background:'rgba(0,18,34,0.97)',
            backdropFilter:'blur(20px)', border:'1px solid rgba(247,127,0,0.22)',
            borderRadius:'18px', overflow:'hidden',
            boxShadow:'0 20px 60px rgba(0,0,0,0.7)',
            animation:'vcSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {/* Header — has a small drag grip, X button is NOT inside draggable zone */}
            <div
              style={{
                background:'#001222', padding:'10px 14px',
                borderBottom:'1px solid rgba(247,127,0,0.12)',
                display:'flex', alignItems:'center', justifyContent:'space-between',
              }}
            >
              {/* Drag grip — only this area initiates drag */}
              <div
                onPointerDown={onHeaderPointerDown}
                style={{
                  display:'flex', alignItems:'center', gap:'8px',
                  cursor:'move', touchAction:'none', flex:1,
                }}
              >
                <Waveform active={phase === 'listening'} />
                <span style={{color:'#F77F00',fontSize:'11px',fontWeight:'800',textTransform:'uppercase',letterSpacing:'1px', pointerEvents:'none'}}>
                  {cfg.label}
                </span>
              </div>
              {/* X button — stopPropagation prevents header drag capture */}
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setPanelOpen(false);
                  setPhase('idle');
                  setResult(null);
                  setTranscript('');
                  setInterim('');
                  setErrorMsg('');
                  try { recognitionRef.current?.stop(); } catch(_) {}
                }}
                style={{
                  background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
                  color:'#94a3b8', cursor:'pointer', fontSize:'14px', lineHeight:1,
                  padding:'4px 8px', borderRadius:'6px',
                  transition:'all 0.15s',
                  flexShrink:0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(214,40,40,0.2)'; e.currentTarget.style.color='#ef4444'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='#94a3b8'; }}
              >✕</button>
            </div>

            {/* Live transcript */}
            {(transcript || interim) && (
              <div style={{padding:'12px 14px',borderBottom:'1px solid rgba(247,127,0,0.08)'}}>
                <div style={{fontSize:'10px',color:'#475569',fontWeight:'700',textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:'5px'}}>
                  🎙️ You said:
                </div>
                <p style={{color:'#e2e8f0',fontSize:'13px',lineHeight:'1.5',fontWeight:'500',margin:0}}>
                  {transcript}
                  {interim && <span style={{color:'#64748b',fontStyle:'italic'}}> {interim}</span>}
                </p>
              </div>
            )}

            {/* Hint when listening but no speech yet */}
            {phase === 'listening' && !transcript && !interim && (
              <div style={{padding:'14px',display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#ef4444',animation:'vcGlow 0.8s ease infinite',flexShrink:0}}/>
                <span style={{color:'#94a3b8',fontSize:'12px',fontWeight:'600'}}>Speak now… I'm listening</span>
              </div>
            )}

            {/* Processing */}
            {phase === 'processing' && (
              <div style={{padding:'14px',display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'16px',height:'16px',borderRadius:'50%',border:'2px solid #8b5cf6',borderTopColor:'transparent',animation:'vcSpin 0.8s linear infinite',flexShrink:0}}/>
                <span style={{color:'#a78bfa',fontSize:'12px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'0.7px'}}>AI processing…</span>
              </div>
            )}

            {/* Success result */}
            {phase === 'success' && result && intentCfg && (
              <div style={{padding:'12px 14px'}}>
                <div style={{
                  display:'inline-flex',alignItems:'center',gap:'6px',
                  background:intentCfg.bg, border:`1px solid ${intentCfg.color}40`,
                  borderRadius:'20px',padding:'3px 10px',marginBottom:'8px',
                }}>
                  <span style={{width:'6px',height:'6px',borderRadius:'50%',background:intentCfg.color,display:'block'}}/>
                  <span style={{color:intentCfg.color,fontSize:'10px',fontWeight:'800',textTransform:'uppercase',letterSpacing:'0.8px'}}>{intentCfg.label}</span>
                </div>
                <p style={{color:'#cbd5e1',fontSize:'13px',lineHeight:'1.6',margin:'0 0 8px'}}>{result.response}</p>

                {result.intent === 'CREATE_TASK' && result.data?.extracted && (
                  <div style={{background:'rgba(0,255,136,0.06)',border:'1px solid rgba(0,255,136,0.2)',borderRadius:'10px',padding:'8px 10px'}}>
                    {[
                      ['Title',    result.data.extracted.title],
                      result.data.extracted.assigneeName && ['Assignee', result.data.extracted.assigneeName],
                      result.data.extracted.priority    && ['Priority', result.data.extracted.priority],
                      result.data.extracted.deadline    && ['Deadline', result.data.extracted.deadline],
                    ].filter(Boolean).map(([k,v]) => (
                      <div key={k} style={{display:'flex',gap:'8px',marginBottom:'3px'}}>
                        <span style={{color:'#64748b',fontWeight:'700',minWidth:'56px',textTransform:'uppercase',fontSize:'10px'}}>{k}:</span>
                        <span style={{color:'#a7f3d0',fontWeight:'600',fontSize:'12px'}}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {result.intent === 'QUERY_TASKS' && result.data?.tasks?.length > 0 && (
                  <div>
                    {result.data.tasks.slice(0,4).map(t => (
                      <div key={t.id} style={{display:'flex',justifyContent:'space-between',padding:'5px 8px',borderRadius:'8px',background:'rgba(252,191,73,0.06)',marginBottom:'3px'}}>
                        <span style={{color:'#cbd5e1',fontSize:'11px',fontWeight:'600',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.title}</span>
                        <span style={{color:'#94a3b8',fontSize:'10px',fontWeight:'700',marginLeft:'8px',textTransform:'uppercase'}}>{t.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {phase === 'error' && (
              <div style={{padding:'12px 14px'}}>
                <p style={{color:'#fca5a5',fontSize:'12px',fontWeight:'600',margin:0,lineHeight:'1.5'}}>⚠️ {errorMsg}</p>
              </div>
            )}

            {/* Footer */}
            <div style={{padding:'7px 14px',borderTop:'1px solid rgba(247,127,0,0.08)',textAlign:'center'}}>
              <span style={{fontSize:'9px',color:'rgba(100,116,139,0.5)',textTransform:'uppercase',letterSpacing:'1px',fontWeight:'700'}}>
                SmartOps AI • F27 Voice Interface
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
