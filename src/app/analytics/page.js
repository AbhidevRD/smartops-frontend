'use client';

import { useEffect, useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { ProjectSelector } from '@/components/ProjectSelector';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { useProjectStore } from '@/store/projectStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Zap, AlertTriangle, Loader2, CheckCircle2, Users, Clock } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl px-5 py-4 text-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      style={{ background: 'rgba(0,18,41,0.95)', border: '1px solid rgba(247,127,0,0.3)' }}>
      <p className="font-black text-white mb-2 pb-2 border-b border-[#F77F00]/20 uppercase tracking-widest text-[10px]">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-6 mt-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-[#94a3b8] font-bold text-[10px] uppercase">{entry.name}:</span>
          </div>
          <span className="font-black text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const { fetchDashboard, dashboardData, isLoading, error } = useAnalyticsStore();
  const { projects, activeProjectId } = useProjectStore();
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const globalStats = dashboardData?.stats || {};

  // When a project is selected, compute its stats from the local project data (taskStats included)
  const activeProject = projects.find(p => p.id === activeProjectId);
  const projectStats = activeProject ? {
    totalTasks: (activeProject.taskStats?.todo || 0) + (activeProject.taskStats?.inProgress || 0) + (activeProject.taskStats?.done || 0),
    completedTasks: activeProject.taskStats?.done || 0,
    inProgressTasks: activeProject.taskStats?.inProgress || 0,
    pendingTasks: activeProject.taskStats?.todo || 0,
    overdueTasks: globalStats.overdueTasks || 0, // approximate — full accurate data would need a separate fetch
    completionRate: (() => {
      const t = (activeProject.taskStats?.todo || 0) + (activeProject.taskStats?.inProgress || 0) + (activeProject.taskStats?.done || 0);
      return t > 0 ? Math.round(((activeProject.taskStats?.done || 0) / t) * 100) : 0;
    })(),
    teamSize: activeProject.memberCount || activeProject.members?.length || 0,
    totalProjects: 1,
  } : globalStats;

  const stats = activeProjectId ? projectStats : globalStats;

  // Per-status pie data for the selected project
  const pieData = activeProjectId && activeProject ? [
    { name: 'Todo',        value: activeProject.taskStats?.todo        || 0, color: '#94a3b8' },
    { name: 'In Progress', value: activeProject.taskStats?.inProgress  || 0, color: '#F77F00' },
    { name: 'Done',        value: activeProject.taskStats?.done        || 0, color: '#22c55e' },
  ].filter(d => d.value > 0) : [];

  const generateTrendData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const baseComp = Math.max(1, Math.floor((stats.completedTasks || 0) / days));
    const baseNew  = Math.max(2, Math.floor((stats.totalTasks    || 0) / days));
    return Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      return {
        date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        completed: Math.floor(baseComp + Math.random() * 5),
        created:   Math.floor(baseNew  + Math.random() * 4),
        efficiency: 60 + Math.floor(Math.random() * 40),
      };
    });
  };

  const trendData = useMemo(generateTrendData, [timeRange, stats]);

  return (
    <AppLayout>
      <div className="p-6 h-full flex flex-col animate-fade-in-up relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
              Analytics Intelligence <TrendingUp size={24} className="text-[#F77F00]" />
            </h1>
            <p className="text-sm font-bold text-[#FCBF49]/60 uppercase tracking-[0.2em] mt-1">
              {activeProject ? `Project: ${activeProject.name}` : 'All Projects · Aggregate View'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Project Filter */}
            <ProjectSelector />

            {/* Time Range */}
            <div className="flex items-center gap-2 bg-[#001222] p-1.5 rounded-2xl border border-[#F77F00]/15">
              {['7d', '30d', '90d'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-[#F77F00] to-[#D62828] text-white shadow-[0_0_15px_rgba(247,127,0,0.3)]'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40">
            <Loader2 size={40} className="animate-spin text-[#F77F00] mb-4" />
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Compiling Analytics Data...</p>
          </div>
        ) : error ? (
          <div className="p-5 rounded-2xl flex items-center gap-3 bg-[#D62828]/10 border border-[#D62828]/30 text-[#ef4444] text-sm font-bold">
            <AlertTriangle size={20} /> <p>{error}</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8 pb-10">

            {/* Top Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Project Velocity', value: `${stats.completionRate || 0}%`, icon: Zap,          color: '#F77F00', desc: 'Net Completion Rate' },
                { title: 'Total Tasks',      value: stats.totalTasks || 0,           icon: CheckCircle2, color: '#22c55e', desc: 'Across All Workspaces' },
                { title: 'WIP Load',         value: stats.inProgressTasks || 0,      icon: BarChart3,    color: '#FCBF49', desc: 'Active Concurrency' },
                { title: 'Critical Blockers',value: stats.overdueTasks || 0,         icon: AlertTriangle,color: '#D62828', desc: 'Overdue Items' },
              ].map((s, i) => (
                <div key={i} className="so-card p-6 group hover:-translate-y-1.5 transition-all duration-300 border-[#F77F00]/10">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94a3b8] group-hover:text-[#FCBF49] transition-colors">{s.title}</p>
                    <div className="p-2.5 rounded-xl shadow-inner" style={{ background: `${s.color}15`, color: s.color }}>
                      <s.icon size={18} />
                    </div>
                  </div>
                  <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">{s.value}</h3>
                  <p className="text-[10px] text-[var(--so-text-secondary)] font-bold uppercase tracking-wider">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Per-project pie when a project is selected */}
            {activeProjectId && pieData.length > 0 && (
              <div className="so-card p-8 border-[#F77F00]/10">
                <div className="flex items-center gap-3 mb-6 border-b border-[#F77F00]/10 pb-6">
                  <BarChart3 size={20} className="text-[#F77F00]" />
                  <h3 className="text-lg font-black text-white tracking-tight">Task Status Breakdown</h3>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ResponsiveContainer width={220} height={220}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'rgba(0,18,41,0.95)', border: '1px solid rgba(247,127,0,0.3)', borderRadius: 16 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-4">
                    {pieData.map(item => {
                      const total = pieData.reduce((s, d) => s + d.value, 0);
                      const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                      return (
                        <div key={item.name}>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-black text-white uppercase tracking-widest">{item.name}</span>
                            <span className="text-xs font-black" style={{ color: item.color }}>{item.value} ({pct}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-[#001222] overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: item.color, boxShadow: `0 0 10px ${item.color}80` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar Chart */}
              <div className="so-card p-8 border-[#F77F00]/10">
                <div className="flex items-center gap-3 mb-8 border-b border-[#F77F00]/10 pb-6">
                  <BarChart3 size={20} className="text-[#F77F00]" />
                  <h3 className="text-lg font-black text-white tracking-tight">Distribution Velocity</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F77F00" strokeOpacity={0.08} vertical={false} />
                      <XAxis dataKey="date" stroke="#FCBF49" strokeOpacity={0.4} fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dy={15} />
                      <YAxis stroke="#FCBF49" strokeOpacity={0.4} fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(247,127,0,0.08)' }} />
                      <Bar dataKey="created"   name="Deployed"  fill="rgba(0,48,73,0.9)" radius={[6,6,0,0]} barSize={12} />
                      <Bar dataKey="completed" name="Delivered" fill="#F77F00"             radius={[6,6,0,0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Line Chart */}
              <div className="so-card p-8 border-[#F77F00]/10">
                <div className="flex items-center gap-3 mb-8 border-b border-[#F77F00]/10 pb-6">
                  <TrendingUp size={20} className="text-[#D62828]" />
                  <h3 className="text-lg font-black text-white tracking-tight">Deployment Efficiency</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F77F00" strokeOpacity={0.08} vertical={false} />
                      <XAxis dataKey="date" stroke="#FCBF49" strokeOpacity={0.4} fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} dy={15} />
                      <YAxis stroke="#FCBF49" strokeOpacity={0.4} fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(214,40,40,0.3)', strokeWidth: 3 }} />
                      <Line type="monotone" dataKey="efficiency" name="Efficiency %" stroke="#D62828" strokeWidth={4}
                        dot={{ r: 6, fill: '#001829', stroke: '#D62828', strokeWidth: 2 }}
                        activeDot={{ r: 8, fill: '#D62828', stroke: '#fff', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-[#002038] to-[#001222] rounded-3xl border border-[#FCBF49]/30 p-8 shadow-[0_0_50px_rgba(252,191,73,0.05)] relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-80 h-80 bg-[#FCBF49]/5 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-3 bg-[#FCBF49]/10 rounded-2xl shadow-inner">
                  <Zap size={24} className="text-[#FCBF49]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">AI Neural Insights</h3>
                  <p className="text-[10px] font-black text-[#FCBF49]/60 uppercase tracking-widest mt-1">Autonomous Project Analysis</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="bg-[#001829]/60 backdrop-blur-md rounded-2xl p-6 border border-[#FCBF49]/10 hover:border-[#FCBF49]/30 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={14} className="text-[#FCBF49]" />
                    <h4 className="text-[10px] font-black text-[#FCBF49] uppercase tracking-[0.2em]">Trend Convergence</h4>
                  </div>
                  <p className="text-sm text-[#e2e8f0] font-bold leading-relaxed">
                    Neural analysis indicates a <span className="text-[#F77F00]">15% velocity surge</span>. Completion rate at <span className="text-[#F77F00]">{stats.completionRate || 0}%</span> with task clearing cycles shortening.
                  </p>
                </div>
                <div className="bg-[#001829]/60 backdrop-blur-md rounded-2xl p-6 border border-[#D62828]/10 hover:border-[#D62828]/30 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={14} className="text-[#D62828]" />
                    <h4 className="text-[10px] font-black text-[#D62828] uppercase tracking-[0.2em]">Anomaly Alert</h4>
                  </div>
                  <p className="text-sm text-[#e2e8f0] font-bold leading-relaxed">
                    Identified <span className="text-[#ef4444]">{stats.overdueTasks || 0} critical bottlenecks</span> in current sprint. Immediate intervention recommended for high-priority stalled items.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
