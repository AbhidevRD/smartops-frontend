'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Send, MoreVertical } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Priya', text: 'Good morning team! Ready for the standup?', timestamp: '09:00 AM', avatar: 'PS' },
    { id: 2, user: 'You', text: 'Yes, let me share the progress', timestamp: '09:05 AM', avatar: 'YO' },
    { id: 3, user: 'Raj', text: 'Working on the API endpoints', timestamp: '09:10 AM', avatar: 'RK' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      user: 'You',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      avatar: 'YO',
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <AppLayout>
      <div className="p-6 h-full flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Chat</h1>

        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <Button className="w-full" size="sm">
                New Conversation
              </Button>
              <div className="mt-4 space-y-2">
                {['Project Updates', 'Team Standup', 'Sprint Planning'].map((conv) => (
                  <div
                    key={conv}
                    className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{conv}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Today</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat */}
          <Card className="flex-1 flex flex-col">
            {/* Header */}
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Project Updates</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400">5 members</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical size={18} />
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardBody className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-xs font-semibold text-white dark:text-gray-900">
                      {msg.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{msg.user}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
