'use client';

import { AppLayout } from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';

export default function TeamPage() {
  const teamMembers = [
    { id: 1, name: 'Priya Sharma', role: 'Product Manager', avatar: 'PS', status: 'online' },
    { id: 2, name: 'Raj Kumar', role: 'Lead Developer', avatar: 'RK', status: 'online' },
    { id: 3, name: 'Sarah Chen', role: 'Designer', avatar: 'SC', status: 'idle' },
    { id: 4, name: 'Alex Johnson', role: 'QA Engineer', avatar: 'AJ', status: 'offline' },
    { id: 5, name: 'Maria Garcia', role: 'DevOps', avatar: 'MG', status: 'online' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'idle':
        return 'warning';
      case 'offline':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team</h1>
          <Button>Invite Members</Button>
        </div>

        <Card>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-sm font-bold text-white dark:text-gray-900">
                        {member.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                      </div>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      member.status === 'online'
                        ? 'bg-green-500'
                        : member.status === 'idle'
                        ? 'bg-yellow-500'
                        : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1">
                      Message
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1">
                      Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
