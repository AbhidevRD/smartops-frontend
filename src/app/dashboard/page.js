'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard = ({ label, value, icon: Icon }) => (
  <Card className="col-span-1">
    <CardBody className="flex items-center gap-4">
      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Icon size={24} className="text-gray-900 dark:text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </CardBody>
  </Card>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes] = await Promise.all([
        axiosInstance.get(API_ENDPOINTS.DASHBOARD.STATS),
        axiosInstance.get(API_ENDPOINTS.DASHBOARD.ACTIVITY),
      ]);
      
      setStats(statsRes.data);
      setActivity(activityRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 text-center">
          <p>Loading dashboard...</p>
        </div>
      </AppLayout>
    );
  }

  const mockChartData = [
    { name: 'Mon', completed: 4, pending: 3 },
    { name: 'Tue', completed: 3, pending: 4 },
    { name: 'Wed', completed: 5, pending: 2 },
    { name: 'Thu', completed: 6, pending: 1 },
    { name: 'Fri', completed: 4, pending: 3 },
  ];

  const mockPieData = [
    { name: 'Completed', value: 65 },
    { name: 'In Progress', value: 25 },
    { name: 'Pending', value: 10 },
  ];

  const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, Priya 👋</h1>
          <p className="text-gray-600 dark:text-gray-400">SmartOps MVP — Sprint 3 — Apr 28, 2026</p>
        </div>

        {/* Stats Grid */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Projects" value={stats?.totalProjects || 0} icon={() => null} />
          <StatCard label="Total Tasks" value={stats?.totalTasks || 0} icon={() => null} />
          <StatCard label="Completed" value={stats?.completedTasks || 0} icon={() => null} />
          <StatCard label="Overdue" value={stats?.overdueTasks || 0} icon={() => null} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Task Progress Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Progress</h3>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#22c55e" />
                  <Line type="monotone" dataKey="pending" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Task Status Pie Chart */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Status</h3>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          </CardHeader>
          <CardBody>
            {activity.length > 0 ? (
              <div className="space-y-4">
                {activity.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.description}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="secondary">{item.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">No recent activity</p>
            )}
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
