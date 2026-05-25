'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardBody } from '@/components/ui';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { useReportsStore } from '@/store/reportsStore';
import { AlertCircle, Download, Eye, RefreshCw, X, Target, Users } from 'lucide-react';

function formatDate(value) {
  if (!value) {
    return 'Not set';
  }

  return new Date(value).toLocaleString();
}

export default function ReportsPage() {
  const {
    reports,
    currentReport,
    fetchReports,
    fetchProjectReport,
    downloadProjectReport,
    setCurrentReport,
    isLoading,
    error
  } = useReportsStore();
  const [activeDownloadId, setActiveDownloadId] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleView = async (projectId) => {
    await fetchProjectReport(projectId);
  };

  const handleDownload = async (projectId) => {
    setActiveDownloadId(projectId);
    await downloadProjectReport(projectId, 'csv');
    setActiveDownloadId(null);
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase tracking-widest">Intelligence Reports</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-2 text-[var(--so-text-secondary)]">
              Strategic Project Analytics & Neural Exports
            </p>
          </div>
          <Button onClick={() => fetchReports()} disabled={isLoading} className="bg-[#003049] border border-[#F77F00]/30 text-[#FCBF49] font-black uppercase tracking-[0.2em] hover:bg-[#F77F00] hover:text-white transition-all px-8 py-6 rounded-2xl shadow-xl">
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            Update Registry
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <span className="text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}

        {isLoading && !currentReport ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-[#001829] border border-[#F77F00]/5 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border border-[#F77F00]/10 rounded-[3rem] bg-[#001829]/40 backdrop-blur-xl">
             <AlertCircle size={48} className="text-[#F77F00] opacity-20 mb-6" />
             <p className="text-lg font-black text-white tracking-tight">No Strategic Data Available</p>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--so-text-secondary)] mt-2 text-center px-6">
                Active project nodes must be initialized to generate analytics.
             </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report) => (
              <div key={report.id} className="bg-[#001829]/60 border border-[#F77F00]/10 rounded-[2.5rem] p-8 group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_20px_rgba(247,127,0,0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Badge variant={report.status === 'completed' ? 'success' : 'warning'} className="!text-[8px] font-black tracking-widest uppercase opacity-80">
                    {report.status}
                  </Badge>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-black text-white group-hover:text-[#FCBF49] transition-colors mb-1 tracking-tight">{report.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--so-text-secondary)]">Type: {report.type}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-2xl bg-[#001222] border border-[#F77F00]/5 p-4 shadow-inner">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[var(--so-text-secondary)] mb-1">Total Tasks</p>
                    <p className="text-2xl font-black text-white">{report.stats?.total || 0}</p>
                  </div>
                  <div className="rounded-2xl bg-[#001222] border border-[#F77F00]/5 p-4 shadow-inner">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[var(--so-text-secondary)] mb-1">Completion</p>
                    <p className="text-2xl font-black text-[#22c55e]">{report.stats?.completionRate || 0}%</p>
                  </div>
                </div>

                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--so-text-secondary)] mb-8 flex items-center gap-2">
                  <RefreshCw size={10} />
                  SYNCED: {formatDate(report.updatedAt || report.createdAt)}
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 bg-[#003049] border border-[#F77F00]/20 text-white font-black uppercase tracking-widest text-[10px] py-6 rounded-2xl hover:bg-[#F77F00] transition-all"
                    onClick={() => handleView(report.projectId || report.id)}
                  >
                    <Eye size={14} />
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 border border-white/5 text-[#94a3b8] font-black uppercase tracking-widest text-[10px] py-6 rounded-2xl hover:bg-white/5 transition-all"
                    onClick={() => handleDownload(report.projectId || report.id)}
                    disabled={activeDownloadId === (report.projectId || report.id)}
                  >
                    <Download size={14} />
                    {activeDownloadId === (report.projectId || report.id) ? 'EXPORTING' : 'EXPORT'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-fade-in">
            <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[3rem] bg-[#001829] border border-[#F77F00]/20 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative animate-fade-in-up">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F77F00] to-transparent opacity-50" />
              
              <div className="flex items-start justify-between gap-4 border-b border-[#F77F00]/10 px-10 py-8 bg-[#001222]/60">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter">
                    {currentReport.projectName} <span className="text-[#F77F00]">Report</span>
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--so-text-secondary)] mt-2">
                    Registry Entry {currentReport.id?.substring(0,8)} — Generated {formatDate(currentReport.generatedAt)}
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentReport(null)} 
                  className="p-3 rounded-2xl bg-[#003049] text-[#FCBF49] hover:bg-[#D62828] hover:text-white transition-all shadow-lg hover:rotate-90"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-120px)] px-10 py-10 custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                  {[
                    ['Total Nodes', currentReport.totalTasks, '#FCBF49'],
                    ['Resolved', currentReport.completed, '#22c55e'],
                    ['In Transit', currentReport.inProgress, '#F77F00'],
                    ['Queued', currentReport.todo, 'var(--so-text-secondary)'],
                    ['Yield', `${currentReport.completionRate}%`, '#F77F00']
                  ].map(([label, value, color]) => (
                    <div key={label} className="rounded-3xl bg-[#001222] border border-[#F77F00]/5 p-6 shadow-inner group hover:border-[#F77F00]/30 transition-all">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--so-text-secondary)] mb-2">{label}</p>
                      <p className="text-3xl font-black tracking-tighter transition-transform group-hover:scale-105" style={{ color }}>{value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
                  <div className="lg:col-span-2">
                    <h3 className="text-xs font-black text-[#FCBF49] uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
                       <Target size={16} /> Operational Manifest
                    </h3>
                    <div className="overflow-hidden rounded-3xl border border-[#F77F00]/10 bg-[#001222]/40 shadow-2xl">
                      <table className="min-w-full text-sm border-separate border-spacing-0">
                        <thead>
                          <tr className="bg-[#003049]/40 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--so-text-secondary)]">
                            <th className="px-6 py-4 text-left border-b border-[#F77F00]/10">Task Descriptor</th>
                            <th className="px-6 py-4 text-left border-b border-[#F77F00]/10">State</th>
                            <th className="px-6 py-4 text-left border-b border-[#F77F00]/10">Priority</th>
                            <th className="px-6 py-4 text-left border-b border-[#F77F00]/10">Personnel</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F77F00]/5">
                          {currentReport.tasks.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="px-6 py-12 text-center text-[10px] font-black uppercase tracking-widest text-[var(--so-text-secondary)]">
                                No operational data in this sector
                              </td>
                            </tr>
                          ) : currentReport.tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-[#003049]/20 transition-colors">
                              <td className="px-6 py-4 font-black text-white">{task.title}</td>
                              <td className="px-6 py-4">
                                <Badge variant="secondary" className="!text-[8px] font-black tracking-widest uppercase opacity-70">{task.status}</Badge>
                              </td>
                              <td className="px-6 py-4 font-bold text-[#94a3b8] uppercase text-[10px] tracking-tighter">{task.priority}</td>
                              <td className="px-6 py-4 font-black text-[#FCBF49] text-xs">
                                {task.assignee?.name || 'UNASSIGNED'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black text-[#FCBF49] uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
                       <Users size={16} /> Personnel Uplink
                    </h3>
                    <div className="space-y-3">
                      {currentReport.members.map((member) => (
                        <div key={member.id} className="rounded-2xl bg-[#001222] border border-[#F77F00]/5 p-5 flex items-center gap-4 group hover:border-[#F77F00]/30 transition-all shadow-lg">
                          <div className="w-10 h-10 rounded-xl bg-[#003049] border border-[#F77F00]/20 flex items-center justify-center font-black text-white text-xs shadow-md group-hover:bg-[#F77F00]">
                             {member.user.name[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-white text-sm truncate tracking-tight">{member.user.name}</p>
                            <p className="text-[9px] font-bold text-[var(--so-text-secondary)] uppercase tracking-tighter truncate">{member.user.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-[#F77F00]/10">
                  <Button 
                    onClick={() => handleDownload(currentReport.projectId)} 
                    className="bg-[#F77F00] text-white font-black uppercase tracking-[0.2em] py-6 px-10 rounded-2xl hover:bg-[#D62828] hover:shadow-[0_0_40px_rgba(247,127,0,0.4)] transition-all flex items-center gap-3 shadow-2xl"
                  >
                    <Download size={20} />
                    Export Manifest
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
