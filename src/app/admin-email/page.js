'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Badge } from '@/components/ui';

export default function EmailAdminPage() {
  const [emails, setEmails] = useState([
    { id: 1, to: 'team@smartops.ai', subject: 'Weekly Report', status: 'sent', date: '2026-04-27' },
    { id: 2, to: 'priya@smartops.ai', subject: 'Task Assignment', status: 'sent', date: '2026-04-27' },
  ]);
  const [showCompose, setShowCompose] = useState(false);
  const [formData, setFormData] = useState({ to: '', subject: '', body: '' });

  const handleSendEmail = async (e) => {
    e.preventDefault();
    // Would send email via /api/admin-email/send
    setEmails([
      ...emails,
      {
        id: emails.length + 1,
        to: formData.to,
        subject: formData.subject,
        status: 'sent',
        date: new Date().toISOString().split('T')[0],
      },
    ]);
    setFormData({ to: '', subject: '', body: '' });
    setShowCompose(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Admin</h1>
          <Button onClick={() => setShowCompose(!showCompose)}>
            {showCompose ? 'Cancel' : 'Compose Email'}
          </Button>
        </div>

        {showCompose && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Compose Email</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <Label htmlFor="to">Recipients</Label>
                  <Input
                    id="to"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Email subject"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="body">Message</Label>
                  <textarea
                    id="body"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="Email body..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit">Send Email</Button>
              </form>
            </CardBody>
          </Card>
        )}

        {/* Email History */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Email History</h2>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">To</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Subject</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email) => (
                    <tr key={email.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{email.to}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{email.subject}</td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusColor(email.status)}>{email.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{email.date}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
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
