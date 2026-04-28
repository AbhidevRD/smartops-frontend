'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import { useTaskStore } from '@/store/taskStore';

export default function BoardPage() {
  const { tasks, fetchTasks, isLoading } = useTaskStore();
  const [tasksByStatus, setTasksByStatus] = useState({});

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const grouped = {
      todo: tasks.filter((t) => t.status === 'todo'),
      'in-progress': tasks.filter((t) => t.status === 'in-progress'),
      review: tasks.filter((t) => t.status === 'review'),
      completed: tasks.filter((t) => t.status === 'completed'),
    };
    setTasksByStatus(grouped);
  }, [tasks]);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100 dark:bg-gray-800' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 'review', title: 'Review', color: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { id: 'completed', title: 'Completed', color: 'bg-green-100 dark:bg-green-900/20' },
  ];

  const TaskCard = ({ task }) => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{task.title}</h4>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
      <div className="flex items-center justify-between">
        <Badge variant="secondary" size="sm">
          {task.priority}
        </Badge>
        <span className="text-xs text-gray-500 dark:text-gray-400">2 days</span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">Loading board...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Task Board</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <Card key={column.id} className="h-full">
              <CardHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
                  <Badge variant="secondary">{tasksByStatus[column.id]?.length || 0}</Badge>
                </div>
              </CardHeader>
              <CardBody className="overflow-y-auto max-h-96">
                <div className={`p-2 rounded-lg mb-4 ${column.color}`}>
                  {(tasksByStatus[column.id] || []).length > 0 ? (
                    (tasksByStatus[column.id] || []).map((task) => <TaskCard key={task.id} task={task} />)
                  ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400 py-8">No tasks</p>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
