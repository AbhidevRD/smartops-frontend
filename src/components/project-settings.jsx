'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Copy, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

export function ProjectSettings({ projectId, projectName, isAdmin }) {
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJoinCode();
  }, [projectId]);

  const fetchJoinCode = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/api/project/${projectId}/code`);
      setJoinCode(response.data.joinCode);
    } catch (err) {
      setError('Failed to load join code');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy code');
    }
  };

  const handleRegenerateCode = async () => {
    if (!confirm('Regenerating the code will make the old code invalid. Continue?')) {
      return;
    }

    try {
      setRegenerating(true);
      setError('');
      setMessage('');
      const response = await axios.patch(`/api/project/${projectId}/regenerate-code`);
      setJoinCode(response.data.project.joinCode);
      setMessage('Join code regenerated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to regenerate code');
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-theme-text mb-6">Project Settings</h2>

      {/* Join Code Section */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Join Code</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Share this code with team members to let them join this project
        </p>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600">
            <p className="font-mono text-2xl font-bold text-center text-gray-900 dark:text-theme-text tracking-widest">
              {joinCode}
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            className="p-3 bg-blue-600 hover:bg-blue-700 text-theme-text rounded-lg transition-colors"
            title="Copy code"
          >
            {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
          </button>
        </div>

        {isAdmin && (
          <button
            onClick={handleRegenerateCode}
            disabled={regenerating}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 
                     dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 
                     dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <RotateCcw size={16} />
            {regenerating ? 'Regenerating...' : 'Regenerate Code'}
          </button>
        )}

        {!isAdmin && (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            Only admins can regenerate the join code
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="mt-4 space-y-2">
        {message && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-800 dark:text-green-300">{message}</p>
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
