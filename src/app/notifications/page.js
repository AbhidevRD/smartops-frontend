'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Badge } from '@/components/ui';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.LIST);
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockNotifications = [
    { id: 1, title: 'Task assigned', message: 'You have been assigned "API Integration"', type: 'task', timestamp: '2 hours ago', read: false },
    { id: 2, title: 'Project update', message: 'Project "SmartOps MVP" status changed to In Progress', type: 'project', timestamp: '4 hours ago', read: false },
    { id: 3, title: 'Comment reply', message: 'Raj replied to your comment', type: 'comment', timestamp: '1 day ago', read: true },
    { id: 4, title: 'Team mention', message: 'You were mentioned in a conversation', type: 'mention', timestamp: '2 days ago', read: true },
  ];

  const getNotificationColor = (type) => {
    switch (type) {
      case 'task':
        return 'primary';
      case 'project':
        return 'success';
      case 'comment':
        return 'warning';
      case 'mention':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Notifications</h1>

        {loading ? (
          <p>Loading notifications...</p>
        ) : (
          <Card>
            <CardBody>
              <div className="space-y-1">
                {mockNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      !notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-900'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{notif.title}</h3>
                      {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{notif.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{notif.timestamp}</span>
                      <Badge variant={getNotificationColor(notif.type)} size="sm">
                        {notif.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
