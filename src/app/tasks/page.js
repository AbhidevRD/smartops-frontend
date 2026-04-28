'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { useTaskStore } from '@/store/taskStore';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function TasksPage() {
  const { tasks, fetchTasks, isLoading } = useTaskStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'pending') return task.status !== 'completed';
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            New Task
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'completed'].map((tab) => (
            <Button
              key={tab}
              variant={filter === tab ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <p>Loading tasks...</p>
        ) : filteredTasks.length > 0 ? (
          <Card>
            <CardBody>
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <input type="checkbox" className="rounded" />
                        <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{task.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No tasks to show</p>
            </CardBody>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
