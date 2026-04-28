'use client';

import { AppLayout } from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Badge } from '@/components/ui';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function AnalyticsPage() {
  const velocityData = [
    { sprint: 'Sprint 1', velocity: 40, planned: 45 },
    { sprint: 'Sprint 2', velocity: 52, planned: 50 },
    { sprint: 'Sprint 3', velocity: 48, planned: 55 },
    { sprint: 'Sprint 4', velocity: 61, planned: 60 },
  ];

  const productivityData = [
    { day: 'Mon', tasks: 8, bugs: 2 },
    { day: 'Tue', tasks: 12, bugs: 1 },
    { day: 'Wed', tasks: 10, bugs: 3 },
    { day: 'Thu', tasks: 15, bugs: 2 },
    { day: 'Fri', tasks: 9, bugs: 0 },
  ];

  const teamPerformanceData = [
    { name: 'Priya', tasks: 12, completed: 10, quality: 95 },
    { name: 'Raj', tasks: 15, completed: 14, quality: 98 },
    { name: 'Sarah', tasks: 8, completed: 8, quality: 92 },
    { name: 'Alex', tasks: 11, completed: 9, quality: 90 },
  ];

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Analytics</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">AVG VELOCITY</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">50 pts</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">COMPLETION RATE</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">92%</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">AVG QUALITY</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">94%</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">TEAM HEALTH</p>
              <Badge variant="success">Excellent</Badge>
            </CardBody>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Velocity Chart */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sprint Velocity</h3>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="planned" fill="#3b82f6" />
                  <Bar dataKey="velocity" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Productivity Chart */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Productivity</h3>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="tasks" stackId="1" fill="#3b82f6" />
                  <Area type="monotone" dataKey="bugs" stackId="1" fill="#ef4444" />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* Team Performance Table */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Performance</h3>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white">Member</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white">Tasks</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white">Completed</th>
                    <th className="text-left py-2 px-4 font-semibold text-gray-900 dark:text-white">Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {teamPerformanceData.map((member) => (
                    <tr key={member.name} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{member.name}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{member.tasks}</td>
                      <td className="py-3 px-4">
                        <Badge variant="success">{member.completed}/{member.tasks}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="primary">{member.quality}%</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
