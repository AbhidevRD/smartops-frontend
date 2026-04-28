'use client';

import { AppLayout } from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';

export default function ReportsPage() {
  const reports = [
    { id: 1, name: 'Sprint 4 Summary', type: 'Sprint', createdAt: '2026-04-27', status: 'completed' },
    { id: 2, name: 'Team Productivity', type: 'Analytics', createdAt: '2026-04-26', status: 'completed' },
    { id: 3, name: 'Risk Assessment', type: 'Risk', createdAt: '2026-04-25', status: 'pending' },
    { id: 4, name: 'Monthly Metrics', type: 'Monthly', createdAt: '2026-04-20', status: 'completed' },
  ];

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <Button>Generate Report</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{report.name}</h3>
                  <Badge variant={report.status === 'completed' ? 'success' : 'warning'}>
                    {report.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Type: {report.type}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Created: {report.createdAt}</p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    View
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    Download
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
