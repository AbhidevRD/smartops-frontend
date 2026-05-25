'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAIStore } from '@/store/aiStore';
import { useProjectStore } from '@/store/projectStore';
import {
  Brain, Sparkles, AlertTriangle, BarChart3,
  Target, Flame, Mic, FileText, Loader2,
  ChevronRight, CheckCircle2, XCircle, Send, User
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Badge } from '@/components/ui';

const FeatureCard = ({ icon: Icon, title, desc, accent, onClick, isLoading }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`group relative text-left w-full p-6 rounded-3xl border transition-all duration-500 overflow-hidden
      bg-[#001829]/60 backdrop-blur-md border-[#F77F00]/10 hover:border-[#F77F00]/60
      hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(247,127,0,0.1)] disabled:opacity-60 disabled:cursor-not-allowed`}
  >
    <div className={`inline-flex p-3 rounded-2xl mb-4 transition-transform group-hover:scale-110 shadow-lg`} style={{ background: accent, boxShadow: `0 8px 20px ${accent}40` }}>
      <Icon size={20} className="text-white drop-shadow-md" />
    </div>
    <h3 className="font-semibold text-white mb-1.5 text-base group-hover:text-[#FCBF49] transition-colors tracking-tight uppercase tracking-widest">{title}</h3>
    <p className="text-[11px] font-bold text-[#94a3b8] leading-relaxed pr-6">{desc}</p>
    <ChevronRight size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#F77F00] opacity-30 group-hover:opacity-100 transition-all group-hover:translate-x-2" />
    
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F77F00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
  </button>
);

export default function AIAssistantPage() {
  const {
    parseTask, generateStandup, detectBurnout,
    detectBottleneck, analyzeSentiment, isLoading
  } = useAIStore();
  const { projects, fetchProjects } = useProjectStore();

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Hi! I\'m the SmartOps AI. Ask me about your tasks, projects, team workload, or deadlines.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const [activeResult, setActiveResult] = useState(null);
  const [activeLabel, setActiveLabel] = useState('');
  const [resultLoading, setResultLoading] = useState(false);

  useEffect(() => { fetchProjects?.(); }, []);

  const runFeature = async (label, fn) => {
    setResultLoading(true);
    setActiveLabel(label);
    setActiveResult(null);
    try {
      const res = await fn();
      if (res?.success) {
        setActiveResult({ type: 'success', data: res.data });
      } else {
        setActiveResult({ type: 'error', data: res?.error || 'Operation failed' });
      }
    } catch (e) {
      setActiveResult({ type: 'error', data: e.message });
    } finally {
      setResultLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await parseTask(userMsg);
      if (res?.success) {
        setChatMessages(prev => [...prev, { role: 'ai', text: res.message || JSON.stringify(res.data) }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'ai', text: `Sorry, I couldn't process that: ${res?.error}` }]);
      }
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'ai', text: 'Connection error. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 h-full flex flex-col relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10 animate-fade-in-up">
          <div className="p-4 bg-[#002038] rounded-3xl border border-[#F77F00]/30 shadow-[0_0_30px_rgba(247,127,0,0.15)]">
            <Logo size="md" variant="iconOnly" animate={true} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tighter">
              AI Core Intelligence <Sparkles size={28} className="text-[#FCBF49] drop-shadow-[0_0_10px_rgba(252,191,73,0.4)]" />
            </h1>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] mt-1" style={{ color: 'rgba(252,191,73,0.7)' }}>
              Powered by Groq Neural Engine — v4.2 Stable
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Left Column - AI Tools */}
          <div className="lg:col-span-1 space-y-5 overflow-y-auto pr-3 pb-8 animate-fade-in-up delay-75 custom-scrollbar">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--so-text-secondary)] mb-4">Operational Protocols</h2>
            
            <FeatureCard
              icon={FileText} title="Standup Report"
              desc="Neural extraction of daily operational metrics"
              accent="#F77F00"
              isLoading={resultLoading}
              onClick={() => runFeature('Standup Report', generateStandup)}
            />
            
            <FeatureCard
              icon={Flame} title="Burnout Detector"
              desc="Emotional intelligence & bandwidth analysis"
              accent="#D62828"
              isLoading={resultLoading}
              onClick={() => runFeature('Burnout Detector', detectBurnout)}
            />
            
            <FeatureCard
              icon={AlertTriangle} title="Workflow Audit"
              desc="Neural bottleneck detection & remediation"
              accent="#FCBF49"
              isLoading={resultLoading}
              onClick={() => runFeature('Workflow Audit', detectBottleneck)}
            />
            
            <FeatureCard
              icon={Target} title="Sentiment Map"
              desc="Real-time morale & linguistic analysis"
              accent="#22c55e"
              isLoading={resultLoading}
              onClick={() => runFeature('Sentiment Map', analyzeSentiment)}
            />

            {/* Results Panel */}
            {activeLabel && (
              <div className="mt-8 rounded-3xl p-6 border border-[#F77F00]/20 bg-[#001222]/80 backdrop-blur-xl animate-fade-in-up shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#F77F00] shadow-[0_0_15px_rgba(247,127,0,0.5)]" />
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#F77F00]/10">
                  <h3 className="font-black text-[#FCBF49] text-xs uppercase tracking-[0.2em]">{activeLabel}</h3>
                  {resultLoading && <Loader2 size={16} className="animate-spin text-[#F77F00]" />}
                </div>
                
                <div className="text-sm text-white font-bold max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {resultLoading ? (
                    <div className="space-y-4">
                      <div className="h-4 bg-[#003049] rounded-xl animate-pulse w-3/4"></div>
                      <div className="h-4 bg-[#003049] rounded-xl animate-pulse w-full"></div>
                      <div className="h-4 bg-[#003049] rounded-xl animate-pulse w-5/6"></div>
                    </div>
                  ) : activeResult?.type === 'error' ? (
                    <div className="flex items-start gap-3 text-[#ef4444] bg-[#ef4444]/10 p-4 rounded-2xl border border-[#ef4444]/20">
                      <AlertTriangle size={18} className="shrink-0" />
                      <p className="text-[11px] font-black uppercase tracking-widest">{activeResult.data}</p>
                    </div>
                  ) : (
                    <div className="prose prose-sm prose-invert max-w-none">
                      {typeof activeResult?.data === 'string' ? (
                        <p className="whitespace-pre-wrap leading-relaxed text-[#cbd5e1] font-bold">{activeResult.data}</p>
                      ) : (
                        <pre className="text-[10px] bg-[#001222] p-5 rounded-2xl overflow-x-auto border border-[#F77F00]/10 text-[#FCBF49] font-mono font-black shadow-inner">
                          {JSON.stringify(activeResult?.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Chat Interface */}
          <div className="lg:col-span-2 flex flex-col rounded-[2.5rem] border border-[#F77F00]/20 bg-[#001829]/60 backdrop-blur-2xl overflow-hidden animate-fade-in-up delay-150 shadow-[0_30px_60px_rgba(0,0,0,0.4)] h-[700px] lg:h-full">
            <div className="p-6 border-b border-[#F77F00]/10 bg-[#001222]/60 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                <h2 className="text-xs font-black text-white tracking-[0.3em] uppercase">Neural Chat Interface</h2>
              </div>
              <Badge variant="success" className="!text-[8px] font-black tracking-widest opacity-60">UPLINK ACTIVE</Badge>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-[#001222]/20">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border transition-transform hover:scale-110
                    ${msg.role === 'ai' ? 'bg-[#002038] border-[#F77F00]/30 shadow-[0_0_15px_rgba(247,127,0,0.1)]' : 'bg-[#D62828] border-white/10 shadow-[0_0_15px_rgba(214,40,40,0.2)]'}`}>
                    {msg.role === 'ai' ? <Brain size={18} className="text-[#FCBF49]" /> : <User size={18} className="text-white" />}
                  </div>
                  
                  {/* Bubble */}
                  <div className={`max-w-[85%] rounded-3xl px-6 py-4 text-sm leading-relaxed shadow-xl relative group
                    ${msg.role === 'user' 
                      ? 'bg-gradient-to-br from-[#003049] to-[#001222] text-white border border-[#F77F00]/20 rounded-tr-none' 
                      : 'bg-gradient-to-br from-[#001829] to-[#001222] text-[#cbd5e1] border border-[#F77F00]/10 rounded-tl-none'}`}>
                    <p className="whitespace-pre-wrap font-bold">{msg.text}</p>
                    <div className={`absolute top-2 ${msg.role === 'user' ? '-right-1.5' : '-left-1.5'} w-3 h-3 bg-inherit transform rotate-45 border-t border-l border-[#F77F00]/10`}></div>
                  </div>
                </div>
              ))}
              
              {chatLoading && (
                <div className="flex gap-5 animate-fade-in">
                  <div className="w-10 h-10 rounded-2xl bg-[#002038] border border-[#F77F00]/30 shadow-lg flex items-center justify-center flex-shrink-0">
                    <Brain size={18} className="text-[#FCBF49]" />
                  </div>
                  <div className="bg-[#001829]/60 border border-[#F77F00]/10 rounded-3xl rounded-tl-none px-6 py-5 flex items-center gap-2 shadow-xl backdrop-blur-md">
                    <div className="w-2 h-2 bg-[#F77F00] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-[#F77F00] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-[#F77F00] rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-[#F77F00]/10 bg-[#001222]/80 backdrop-blur-xl">
              <form onSubmit={handleChatSubmit} className="relative flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Enter neural command..."
                    className="w-full pl-6 pr-14 py-4 text-sm font-bold rounded-2xl bg-[#001222] text-white placeholder-[var(--so-text-secondary)] outline-none border border-[#F77F00]/10 focus:border-[#F77F00]/50 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                    disabled={chatLoading}
                  />
                  <div className="absolute left-0 top-0 w-1 h-full bg-[#F77F00]/40 rounded-l-2xl"></div>
                </div>
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="p-4 rounded-2xl bg-gradient-to-r from-[#F77F00] to-[#D62828] text-white hover:shadow-[0_0_30px_rgba(247,127,0,0.5)] transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
