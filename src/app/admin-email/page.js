'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Badge } from '@/components/ui';
import { useAdminStore } from '@/store/adminStore';
import { AlertCircle, Download, Eye, RefreshCw, X, Target, Users } from 'lucide-react';

export default function EmailAdminPage() {
  const { emailLogs, sendEmail, fetchEmailLogs, isLoading, error } = useAdminStore();
  const [showCompose, setShowCompose] = useState(false);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ to: '', subject: '', body: '' });

  useEffect(() => {
    fetchEmailLogs();
  }, [fetchEmailLogs]);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!formData.to || !formData.subject) {
      alert('Please fill in all required fields');
      return;
    }
    
    const sent = await sendEmail(formData.to, formData.subject, formData.body);
    if (sent) {
      setSuccess('Email sent successfully!');
      setFormData({ to: '', subject: '', body: '' });
      setShowCompose(false);
      setTimeout(() => setSuccess(''), 3000);
      fetchEmailLogs();
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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
        <div className="flex items-center justify-between mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase tracking-widest">Email Registry</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-2 text-[var(--so-text-secondary)]">
              Strategic Communications Audit Log
            </p>
          </div>
          <Button 
            onClick={() => setShowCompose(!showCompose)}
            className="bg-[#003049] border border-[#F77F00]/30 text-[#FCBF49] font-black uppercase tracking-[0.2em] hover:bg-[#F77F00] hover:text-white transition-all px-8 py-6 rounded-2xl shadow-xl"
          >
            {showCompose ? 'ABORT UPLINK' : 'INITIATE UPLINK'}
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <span className="text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <span className="text-green-600 dark:text-green-400">{success}</span>
          </div>
        )}

        {showCompose && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-theme-text">Compose Email</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <Label htmlFor="to">Recipients (comma-separated)</Label>
                  <Input
                    id="to"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="email@example.com, another@example.com"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-theme-text min-h-32"
                  />
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Email'}
                </Button>
              </form>
            </CardBody>
          </Card>
        )}

        {/* Email Logs */}
        <div className="bg-[#001829]/60 border border-[#F77F00]/10 rounded-[2.5rem] p-8 shadow-2xl animate-fade-in-up delay-75">
            <h2 className="text-xs font-black text-[#FCBF49] uppercase tracking-[0.3em] mb-8 border-b border-[#F77F00]/10 pb-4 flex items-center gap-3">
              <Eye size={18} /> Strategic Transmission Logs
            </h2>
            
            {isLoading && !emailLogs?.length ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-[#001222] border border-[#F77F00]/5 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-[var(--so-text-secondary)] text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="text-left py-3 px-6">Personnel</th>
                    <th className="text-left py-3 px-6">Subject Matter</th>
                    <th className="text-left py-3 px-6 text-center">Status</th>
                    <th className="text-left py-3 px-6 text-right">Uplink Date</th>
                  </tr>
                </thead>
                <tbody className="space-y-3">
                  {(emailLogs || []).map((log, idx) => (
                    <tr key={log.id || idx} className="bg-[#001222]/40 border border-[#F77F00]/5 hover:bg-[#003049]/40 transition-colors group">
                      <td className="py-4 px-6 text-sm font-black text-white rounded-l-2xl border-y border-l border-[#F77F00]/5 group-hover:border-[#F77F00]/20">{log.recipient || log.to}</td>
                      <td className="py-4 px-6 text-xs font-bold text-[#94a3b8] border-y border-[#F77F00]/5 group-hover:border-[#F77F00]/20">{log.subject}</td>
                      <td className="py-4 px-6 text-center border-y border-[#F77F00]/5 group-hover:border-[#F77F00]/20">
                        <Badge variant={getStatusColor(log.status)} className="!text-[8px] font-black tracking-widest uppercase">{log.status}</Badge>
                      </td>
                      <td className="py-4 px-6 text-right text-[10px] font-black text-[var(--so-text-secondary)] rounded-r-2xl border-y border-r border-[#F77F00]/5 group-hover:border-[#F77F00]/20 uppercase">
                        {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : log.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!emailLogs || emailLogs.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center gap-4">
                   <AlertCircle size={40} className="text-[var(--so-text-secondary)] opacity-20" />
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--so-text-secondary)]">No Transmission records found in history</p>
                </div>
              ) : null}
            </div>
            )}
        </div>
      </div>
    </AppLayout>
  );
}

