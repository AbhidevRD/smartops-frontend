'use client';

import { useEffect, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { ProjectSelector } from '@/components/ProjectSelector';
import { Badge } from '@/components/ui';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useProjectStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';
import { AlertCircle, TrendingUp, CheckCircle, Clock, FolderOpen } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';

const StatCard = ({ label, value, icon: Icon, href }) => {
  const content = (
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gradient-to-br from-[#F77F00] to-[#D62828] shadow-[0_0_20px_rgba(247,127,0,0.4)] rounded-2xl group-hover:scale-110 transition-transform">
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-[10px] text-[#FCBF49]/70 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-3xl font-black text-white tracking-tight">{value ?? 0}</p>
      </div>
    </div>
  );
  const cls = "so-card p-6 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(247,127,0,0.1)] transition-all duration-300 block group border-[#F77F00]/10 hover:border-[#F77F00]/40";
  return href ? <Link href={href} className={cls}>{content}</Link> : <div className={cls}>{content}</div>;
};

const COLORS = ['#22c55e', '#F77F00', '#94a3b8'];

export default function Dashboard() {
  const { dashboardData, fetchDashboard, isLoading, error } = useAnalyticsStore();
  const { projects, fetchProjects, activeProjectId } = useProjectStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchDashboard();
    fetchProjects();
    const interval = setInterval(fetchDashboard, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboard, fetchProjects]);

  const globalStats = dashboardData?.stats || {};
  const recentActivity = dashboardData?.recentActivity || [];

  const activeProject = projects.find(p => p.id === activeProjectId);

  const projectStats = useMemo(() => {
    if (!activeProject) return null;
    const { todo = 0, inProgress = 0, done = 0 } = activeProject.taskStats || {};
    const total = todo + inProgress + done;
    return {
      totalProjects: 1,
      totalTasks: total,
      completedTasks: done,
      inProgressTasks: inProgress,
      pendingTasks: todo,
      completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
      teamSize: activeProject.memberCount || activeProject.members?.length || 0,
    };
  }, [activeProject]);

  const stats = activeProject ? projectStats : globalStats;

  const pieData = useMemo(() => {
    if (activeProject?.taskStats) {
      const { todo = 0, inProgress = 0, done = 0 } = activeProject.taskStats;
      return [
        { name: 'Done',        value: done },
        { name: 'In Progress', value: inProgress },
        { name: 'Todo',        value: todo },
      ].filter(d => d.value > 0);
    }
    return [
      { name: 'Completed', value: globalStats.completedTasks || 0 },
      { name: 'Pending',   value: globalStats.pendingTasks   || 0 },
    ].filter(d => d.value > 0);
  }, [activeProject, globalStats]);

  const mockChartData = [
    { name: 'Mon', completed: 4, pending: 3 },
    { name: 'Tue', completed: 3, pending: 4 },
    { name: 'Wed', completed: 5, pending: 2 },
    { name: 'Thu', completed: 6, pending: 1 },
    { name: 'Fri', completed: 4, pending: 3 },
  ];

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6 h-full flex flex-col relative z-10">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-[#003049] rounded-2xl w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-[#003049] rounded-2xl border border-[#F77F00]/10" />)}
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 h-80 bg-[#003049] rounded-2xl border border-[#F77F00]/10" />
              <div className="col-span-1 h-80 bg-[#003049] rounded-2xl border border-[#F77F00]/10" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 relative z-10 flex flex-col min-h-full">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="hidden md:block">
              <Logo size="lg" animate={true} variant="iconOnly" className="drop-shadow-[0_0_20px_rgba(247,127,0,0.4)]" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white mb-1 tracking-tight">Welcome back {user?.name} 👋</h1>
              <p className="text-sm font-bold text-[#FCBF49]/60 uppercase tracking-[0.2em]">
                {activeProject ? `Workspace: ${activeProject.name}` : 'Platform Overview · Real-time Intelligence'}
              </p>
            </div>
          </div>
          <ProjectSelector />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-[#D62828]/10 border border-[#D62828]/30 rounded-2xl flex items-center gap-3">
            <AlertCircle size={20} className="text-[#ef4444]" />
            <span className="text-[#ef4444] font-bold text-sm">{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Active Projects"  value={stats?.totalProjects}    icon={FolderOpen}  href="/projects" />
          <StatCard label="Total Tasks"      value={stats?.totalTasks}       icon={TrendingUp}  href="/tasks" />
          <StatCard label="Completed Tasks"  value={stats?.completedTasks}   icon={CheckCircle} href="/tasks" />
          <StatCard label="Completion Rate"  value={`${stats?.completionRate || 0}%`} icon={Clock} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="so-card p-8 lg:col-span-2 border-[#F77F00]/10">
            <div className="border-b border-[#F77F00]/10 pb-6 mb-6 flex items-center justify-between">
              <h3 className="text-xl font-black text-white tracking-tight">Task Lifecycle Trend</h3>
              <Badge variant="primary" className="!px-3 !py-1 text-[10px] font-black uppercase tracking-widest">Live</Badge>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F77F00" strokeOpacity={0.08} vertical={false} />
                  <XAxis stroke="#FCBF49" strokeOpacity={0.5} fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dy={15} />
                  <YAxis stroke="#FCBF49" strokeOpacity={0.5} fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ stroke: 'rgba(247,127,0,0.2)', strokeWidth: 2 }}
                    contentStyle={{ backgroundColor: 'rgba(0,24,41,0.95)', border: '1px solid rgba(247,127,0,0.3)', borderRadius: '16px', backdropFilter: 'blur(10px)' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line type="monotone" name="Completed" dataKey="completed" stroke="#F77F00" strokeWidth={4}
                    dot={{ r: 6, fill: '#001829', stroke: '#F77F00', strokeWidth: 2 }} activeDot={{ r: 8, fill: '#F77F00', stroke: '#fff', strokeWidth: 2 }} />
                  <Line type="monotone" name="In Progress" dataKey="pending" stroke="#FCBF49" strokeWidth={4}
                    dot={{ r: 6, fill: '#001829', stroke: '#FCBF49', strokeWidth: 2 }} activeDot={{ r: 8, fill: '#FCBF49', stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="so-card p-8 border-[#F77F00]/10">
            <div className="border-b border-[#F77F00]/10 pb-6 mb-6">
              <h3 className="text-xl font-black text-white tracking-tight">Status Distribution</h3>
            </div>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={90} innerRadius={55} paddingAngle={4} dataKey="value" stroke="rgba(0,0,0,0.5)" strokeWidth={2}>
                    {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,24,41,0.95)', border: '1px solid rgba(247,127,0,0.3)', borderRadius: '16px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center opacity-30">
                <Clock size={40} className="text-[#FCBF49] mb-4" />
                <p className="text-xs font-black text-white uppercase tracking-widest">No Data</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="so-card p-8 border-[#F77F00]/10">
          <div className="border-b border-[#F77F00]/10 pb-6 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-[#F77F00]" />
              <h3 className="text-xl font-black text-white tracking-tight">Recent Intelligence</h3>
            </div>
            <Link href="/analytics" className="text-[10px] font-black text-[#FCBF49] uppercase tracking-widest hover:text-white transition-colors">View All</Link>
          </div>
          {recentActivity.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentActivity.slice(0, 10).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-[#001222]/40 border border-[#F77F00]/5 rounded-2xl hover:border-[#F77F00]/30 hover:bg-[#001222]/60 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#F77F00] shadow-[0_0_8px_rgba(247,127,0,0.5)] group-hover:scale-150 transition-transform" />
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-[#FCBF49] transition-colors">{item.action || item.details}</p>
                      <p className="text-[10px] text-[#94a3b8] uppercase font-black tracking-wider mt-1 opacity-60">
                        {new Date(item.createdAt).toLocaleDateString()} · {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="gold" className="!px-2 !py-0.5 text-[9px] font-black">{item.type || 'SYSTEM'}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center opacity-30">
              <AlertCircle size={48} className="text-[var(--so-text-secondary)] mb-4" />
              <p className="text-xs font-black text-white uppercase tracking-widest">No Recent Signals Detected</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
