'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Input } from '@/components/ui';

export default function PomodoroPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [taskInput, setTaskInput] = useState('');
  const [focusTasks, setFocusTasks] = useState([
    { id: 1, title: 'Fix login bug', duration: 25, completed: false },
    { id: 2, title: 'Review PR #234', duration: 25, completed: false },
  ]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleStartSession = async () => {
    setIsRunning(true);
    // Would integrate with /api/ai/pomodoro/start
  };

  const handleCompleteSession = () => {
    setSessions(sessions + 1);
    setTimeLeft(25 * 60);
    setIsRunning(false);
  };

  const addTask = () => {
    if (!taskInput.trim()) return;
    setFocusTasks([
      ...focusTasks,
      {
        id: focusTasks.length + 1,
        title: taskInput,
        duration: 25,
        completed: false,
      },
    ]);
    setTaskInput('');
  };

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Focus & Pomodoro</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Focus Session</h2>
            </CardHeader>
            <CardBody className="text-center">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-2xl p-12 mb-8">
                <div className="text-7xl font-bold text-gray-900 dark:text-white mb-4">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Pomodoro Timer</p>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleStartSession}
                    disabled={isRunning}
                    className={isRunning ? 'opacity-50' : ''}
                  >
                    {isRunning ? 'In Progress...' : 'Start Session'}
                  </Button>
                  <Button variant="secondary" onClick={() => setTimeLeft(25 * 60)}>
                    Reset
                  </Button>
                  {isRunning && (
                    <Button onClick={handleCompleteSession} className="bg-green-600 hover:bg-green-700">
                      Complete Session
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">COMPLETED SESSIONS</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{sessions}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">FOCUS TIME TODAY</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{sessions * 25}m</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">FOCUS STREAK</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">3 days 🔥</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Stats</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Mon</span>
                    <Badge>4 sessions</Badge>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Tue</span>
                    <Badge>5 sessions</Badge>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Wed</span>
                    <Badge>3 sessions</Badge>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Focus Tasks */}
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Focus Tasks</h2>
          </CardHeader>
          <CardBody>
            <div className="mb-4 flex gap-2">
              <Input
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a focus task..."
              />
              <Button onClick={addTask}>Add</Button>
            </div>

            <div className="space-y-2">
              {focusTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <input type="checkbox" className="rounded w-4 h-4" defaultChecked={task.completed} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                  </div>
                  <Badge variant="secondary" size="sm">
                    {task.duration}m
                  </Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
