'use client';

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { useAIStore } from '@/store/aiStore';
import aiService from '@/services/ai';
import VoiceCommand from '@/components/voice-command';

export default function AIDemoPage() {
  const [text, setText] = useState('Create a task to fix the login bug and write tests');
  const [notes, setNotes] = useState('Team meeting notes:\n- Add integration tests\n- Fix login bug\n- Deploy to staging');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState([]);
  const [output, setOutput] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);

  const { parseTask, generateStandup, processVoiceCommand, analyzePriority } = useAIStore();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axiosInstance.get(API_ENDPOINTS.PROJECTS.LIST);
        if (mounted) setProjects(res.data || []);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false };
  }, []);

  const runParse = async () => {
    setLocalLoading(true);
    try {
      const res = await parseTask(text);
      const payload = res?.data || res?.data?.data || res;
      setOutput({ source: 'parse', result: payload, raw: res });
    } catch (err) {
      setOutput({ error: err.message || String(err) });
    } finally { setLocalLoading(false); }
  };

  const runStandup = async () => {
    setLocalLoading(true);
    try {
      const res = await generateStandup();
      const payload = res?.data || res?.data?.data || res;
      setOutput({ source: 'standup', result: payload, raw: res });
    } catch (err) {
      setOutput({ error: err.message || String(err) });
    } finally { setLocalLoading(false); }
  };

  const runNotes = async () => {
    if (!projectId) return setOutput({ success: false, error: 'Select project' });
    setLocalLoading(true);
    try {
      const res = await aiService.extractTasksFromNotes(projectId, notes);
      setOutput({ source: 'notes-to-tasks', result: res });
    } catch (err) {
      setOutput({ error: err.message || String(err) });
    } finally { setLocalLoading(false); }
  };

  const [titleField, setTitleField] = useState('Fix login redirect bug');
  const [dueDays, setDueDays] = useState(3);
  const [workload, setWorkload] = useState(2);

  const runPriority = async () => {
    setLocalLoading(true);
    try {
      const res = await analyzePriority(titleField, dueDays, workload);
      setOutput({ source: 'priority', result: res });
    } catch (err) {
      setOutput({ error: err.message || String(err) });
    } finally { setLocalLoading(false); }
  };

  const [voiceText, setVoiceText] = useState('Create a task to add integration tests for auth');
  const runVoice = async () => {
    if (!projectId) return setOutput({ success: false, error: 'Select project' });
    setLocalLoading(true);
    try {
      const res = await processVoiceCommand({ projectId, command: voiceText });
      setOutput({ source: 'voice', result: res });
    } catch (err) {
      setOutput({ error: err.message || String(err) });
    } finally { setLocalLoading(false); }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>AI Assistant — Demo &amp; Controls</h1>

      <section style={{ marginBottom: 12 }}>
        <label><strong>Project</strong></label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={projectId} onChange={e => setProjectId(e.target.value)}>
            <option value="">-- select project --</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name || p.id}</option>
            ))}
          </select>
          <input placeholder="or paste projectId" value={projectId} onChange={e => setProjectId(e.target.value)} />
        </div>
      </section>

      <section style={{ marginBottom: 12 }}>
        <h3>Parse Task (NLP)</h3>
        <textarea rows={3} value={text} onChange={e => setText(e.target.value)} style={{ width: '100%' }} />
        <button onClick={runParse} disabled={localLoading}>Parse</button>
      </section>

      <section style={{ marginBottom: 12 }}>
        <h3>Priority Analysis</h3>
        <input value={titleField} onChange={e => setTitleField(e.target.value)} style={{ width: '60%' }} />
        <input type="number" value={dueDays} onChange={e => setDueDays(Number(e.target.value))} style={{ width: 80, marginLeft: 8 }} />
        <input type="number" value={workload} onChange={e => setWorkload(Number(e.target.value))} style={{ width: 80, marginLeft: 8 }} />
        <div>
          <button onClick={runPriority} disabled={localLoading}>Analyze Priority</button>
        </div>
      </section>

      <section style={{ marginBottom: 12 }}>
        <h3>Generate Standup</h3>
        <button onClick={runStandup} disabled={localLoading}>Generate Standup</button>
      </section>

      <section style={{ marginBottom: 12 }}>
        <h3>Notes → Tasks</h3>
        <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%' }} />
        <button onClick={runNotes} disabled={localLoading}>Extract Tasks</button>
      </section>

      <section style={{ marginBottom: 12 }}>
        <h3>Voice Command</h3>
        <div style={{ marginBottom: 8 }}>
          <VoiceCommand projectId={projectId} onTaskCreated={(task) => setOutput({ source: 'voice', result: task })} />
        </div>
        <div style={{ marginTop: 8 }}>
          <div style={{ marginBottom: 6 }}>Or send text command:</div>
          <input style={{ width: '80%' }} value={voiceText} onChange={e => setVoiceText(e.target.value)} />
          <button onClick={runVoice} disabled={localLoading}>Send Command</button>
        </div>
      </section>

      <section>
        <h3>Output</h3>
        <div style={{ marginBottom: 8 }}>{localLoading ? <strong>Loading...</strong> : null}</div>
        <pre style={{ background: '#f6f8fa', padding: 12, maxHeight: 400, overflow: 'auto' }}>{JSON.stringify(output, null, 2)}</pre>
      </section>
    </div>
  );
}
