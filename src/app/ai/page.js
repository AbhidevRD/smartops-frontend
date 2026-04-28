'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Badge } from '@/components/ui';

export default function AIAssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const aiFeatures = [
    { title: 'Task Parser', desc: 'Convert notes to tasks', icon: '📝' },
    { title: 'Risk Prediction', desc: 'Identify project risks early', icon: '⚠️' },
    { title: 'Standup Generator', desc: 'Generate standup reports', icon: '📊' },
    { title: 'Sprint Planner', desc: 'Plan sprints intelligently', icon: '🎯' },
    { title: 'Burnout Detector', desc: 'Monitor team wellness', icon: '🔥' },
    { title: 'Voice Commands', desc: 'Create tasks by voice', icon: '🎤' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResponse(`AI Response to: "${prompt}"\n\nThis is a sample response from the AI assistant.`);
      setLoading(false);
      setPrompt('');
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">AI Assistant</h1>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {aiFeatures.map((feature) => (
            <Card key={feature.title} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardBody className="text-center">
                <p className="text-3xl mb-3">{feature.icon}</p>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Chat Interface */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Chat</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {response && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-900 dark:text-green-100 whitespace-pre-wrap">{response}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask the AI assistant anything..."
                  disabled={loading}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Thinking...' : 'Send'}
                </Button>
              </form>
            </div>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
