import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

type Props = {
  projectId: string;
  onTaskCreated?: (task: any) => void;
};

const VoiceCommand: React.FC<Props> = ({ projectId, onTaskCreated }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [interim, setInterim] = useState('');
  const [finalText, setFinalText] = useState('');
  const [status, setStatus] = useState('idle');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('unsupported');
      return;
    }

    const r = new SpeechRecognition();
    r.lang = 'en-US';
    r.interimResults = true;
    r.maxAlternatives = 1;
    r.continuous = false;

    r.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalTranscript += res[0].transcript;
        } else {
          interimTranscript += res[0].transcript;
        }
      }
      if (interimTranscript) setInterim(interimTranscript);
      if (finalTranscript) {
        setFinalText(prev => (prev ? prev + ' ' + finalTranscript : finalTranscript));
      }
    };

    r.onerror = (e: any) => {
      console.error('Speech error', e);
      setStatus('error');
      setIsRecording(false);
    };

    r.onend = async () => {
      setIsRecording(false);
      setInterim('');
      setStatus('idle');

      const text = (finalText || '').trim();
      if (text) {
        await sendToBackend(text);
      }
    };

    recognitionRef.current = r;

    return () => {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalText]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setStatus('unsupported');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setStatus('stopping');
    } else {
      setFinalText('');
      setInterim('');
      setIsRecording(true);
      setStatus('recording');
      try {
        recognitionRef.current.start();
      } catch (e) {
        // some browsers throw if start called too quickly
        console.warn('start error', e);
      }
    }
  };

  const sendToBackend = async (text: string) => {
    if (!projectId) {
      setStatus('no-project');
      return;
    }

    setStatus('sending');
    try {
      const res = await axiosInstance.post(API_ENDPOINTS.AI.VOICE_COMMAND, {
        projectId,
        command: text
      });

      if (res?.data?.success) {
        setStatus('success');
        if (onTaskCreated) onTaskCreated(res.data.data);
      } else {
        setStatus('ai-failed');
      }
    } catch (err: any) {
      console.error('Voice send failed', err?.message || err);
      setStatus('error');
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button onClick={toggleRecording} style={{ padding: 8 }}>
        {isRecording ? 'Stop 🎙️' : 'Start 🎙️'}
      </button>
      <div style={{ minWidth: 300 }}>
        <div style={{ fontSize: 12, color: '#666' }}>Transcript:</div>
        <div style={{ background: '#fff', padding: 8, borderRadius: 4, minHeight: 40 }}>
          <div>{finalText}</div>
          <div style={{ color: '#999', fontStyle: 'italic' }}>{interim}</div>
        </div>
      </div>
      <div style={{ minWidth: 140 }}>
        <div style={{ fontSize: 12, color: '#666' }}>Status:</div>
        <div>{status}</div>
      </div>
    </div>
  );
};

export default VoiceCommand;
