'use client';

import { useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { useNotificationStore } from '@/store/notificationStore';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, fetchNotifications, markAsRead, markAllAsRead, isLoading, error } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const getNotificationColor = (type) => {
    switch (type?.toLowerCase()) {
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

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">System Intelligence</h1>
            {unreadCount > 0 && (
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-2 text-[#F77F00] animate-pulse">
                {unreadCount} Unprocessed Signal{unreadCount > 1 ? 's' : ''} detected
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="secondary" size="sm" className="bg-[#003049] border border-[#F77F00]/20 text-[#FCBF49] font-black uppercase tracking-widest hover:bg-[#F77F00] hover:text-white transition-all">
              Clear All Signals
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <span className="text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-[#001829] border border-[#F77F00]/5 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-6 rounded-3xl border transition-all duration-500 relative overflow-hidden group
                  ${!notif.read 
                    ? 'bg-[#003049]/40 border-[#F77F00]/40 shadow-[0_10px_30px_rgba(247,127,0,0.1)]' 
                    : 'bg-[#001829]/40 border-[#F77F00]/5 opacity-60 hover:opacity-100 hover:border-[#F77F00]/20'
                  }`}
              >
                {!notif.read && <div className="absolute top-0 left-0 w-1.5 h-full bg-[#F77F00] shadow-[0_0_15px_rgba(247,127,0,0.5)]"></div>}
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2.5 rounded-xl bg-[#001222] border border-[#F77F00]/20`}>
                       <AlertCircle size={18} className="text-[#FCBF49]" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-base tracking-tight">{notif.title}</h3>
                      <p className="text-[11px] font-bold text-[#94a3b8] mt-1 leading-relaxed">
                        {notif.message || notif.content}
                      </p>
                    </div>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-2 rounded-xl bg-[#F77F00] text-white hover:bg-[#D62828] transition-all shadow-lg hover:scale-110 active:scale-95"
                      title="Mark as read"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F77F00]/5">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--so-text-secondary)]">
                    Uplink: {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString() : 'Real-time'}
                  </span>
                  <Badge variant={getNotificationColor(notif.type)} className="!px-3 !py-1 !text-[9px] font-black tracking-widest uppercase">
                    {notif.type || 'SIGNAL'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border border-[#F77F00]/10 rounded-[3rem] bg-[#001829]/40 backdrop-blur-xl">
            <div className="p-8 rounded-full bg-[#001222] border border-[#F77F00]/20 mb-6 shadow-2xl">
              <CheckCircle2 size={48} className="text-[#F77F00] opacity-20" />
            </div>
            <p className="text-lg font-black text-white tracking-tight">Signals Neutralized</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--so-text-secondary)] mt-2">All data packets processed</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
