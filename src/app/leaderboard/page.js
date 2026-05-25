'use client';

import { useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { Trophy, Medal, Star, Target, Crown, Sparkles, Zap, Award, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

export default function LeaderboardPage() {
  const { leaderboard, fetchLeaderboard, isLoading } = useLeaderboardStore();
  const { user } = useAuthStore();

  const userStats = leaderboard.find(e => e.userId === user?.id) || null;
  const badges = userStats?.badgeDetails || [];

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getRankStyle = (index) => {
    switch (index) {
      case 0: return { color: '#FCBF49', bg: 'rgba(252,191,73,0.1)', border: '#FCBF49', glow: 'shadow-[0_0_20px_rgba(252,191,73,0.2)]' }; // Gold
      case 1: return { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: '#94a3b8', glow: '' }; // Silver
      case 2: return { color: '#F77F00', bg: 'rgba(247,127,0,0.1)', border: '#F77F00', glow: '' }; // Bronze
      default: return { color: '#FCBF49', bg: 'rgba(0,48,73,0.4)', border: '#003049', glow: '' };
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Crown size={24} className="text-[#FCBF49] drop-shadow-[0_0_12px_rgba(252,191,73,0.8)]" />;
      case 1: return <Medal size={24} className="text-[#94a3b8]" />;
      case 2: return <Medal size={24} className="text-[#F77F00]" />;
      default: return <span className="font-black text-[#FCBF49]/40 text-lg tracking-widest">{index + 1}</span>;
    }
  };

  return (
    <AppLayout>
      <div className="p-6 h-full flex flex-col animate-fade-in-up relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 shrink-0">
          <div>
            <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tight">
              Elite Performance <Trophy size={32} className="text-[#FCBF49] drop-shadow-[0_0_15px_rgba(252,191,73,0.4)]" />
            </h1>
            <p className="text-sm font-bold uppercase tracking-[0.2em] mt-1 text-[#FCBF49]/60">
              Neural Network Ranking System
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
          {/* Main Leaderboard - Left 2 Columns */}
          <div className="lg:col-span-2 flex flex-col bg-[#001829]/60 backdrop-blur-xl rounded-3xl border border-[#F77F00]/10 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
            <div className="p-6 border-b border-[#F77F00]/10 bg-[#001222]/80 flex items-center justify-between">
              <h2 className="font-black text-white text-xs uppercase tracking-[0.3em] flex items-center gap-3">
                <Sparkles size={16} className="text-[#FCBF49]" /> Protocol Rankings
              </h2>
              <Badge variant="warning" className="!px-3 !py-1 text-[10px] font-black uppercase tracking-widest">Season 1 Active</Badge>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
              {isLoading ? (
                [...Array(5)].map((_, i) => <div key={i} className="h-20 rounded-2xl shimmer" />)
              ) : leaderboard.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-20">
                  <Trophy size={64} className="mb-4" />
                  <p className="text-xs font-black uppercase tracking-[0.2em]">No Active Participants</p>
                </div>
              ) : (
                leaderboard.map((entry, index) => {
                  const style = getRankStyle(index);
                  const isCurrentUser = entry.userId === user?.id;
                  const displayName = entry.name || entry.userName || 'Unknown Participant';
                  const displayAvatar = entry.avatarUrl || entry.avatar;
                  const displayXP = entry.xpPoints || entry.points || 0;

                  return (
                    <div
                      key={entry.userId || index}
                      className={`flex items-center gap-6 p-5 rounded-2xl transition-all duration-300 group ${isCurrentUser ? 'border-2 border-[#F77F00] bg-[#F77F00]/5 shadow-[0_0_30px_rgba(247,127,0,0.15)]' : 'border border-[#F77F00]/10 hover:border-[#F77F00]/40 hover:bg-[#003049]/40'} ${style.glow}`}
                      style={!isCurrentUser ? { backgroundColor: style.bg } : {}}
                    >
                      {/* Rank */}
                      <div className="w-10 flex justify-center shrink-0">
                        {getRankIcon(index)}
                      </div>

                      {/* Avatar & Name */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {displayAvatar ? (
                          <img src={displayAvatar} alt={displayName} className="w-12 h-12 rounded-2xl object-cover border-2 border-[#003049] shadow-lg" />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black text-white bg-gradient-to-br from-[#003049] to-[#001222] border-2 border-[#F77F00]/20 shadow-lg">
                            {displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-black text-white text-base tracking-tight truncate flex items-center gap-3">
                            {displayName}
                            {isCurrentUser && <Badge variant="gold" className="!px-2 !py-0.5 !text-[9px] font-black uppercase">Active User</Badge>}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="h-1 w-20 bg-[#003049] rounded-full overflow-hidden">
                                <div className="h-full bg-[#FCBF49]" style={{ width: `${(displayXP % 1000) / 10}%` }}></div>
                             </div>
                             <p className="text-[9px] text-[#94a3b8] font-black uppercase tracking-widest">
                                Lvl {Math.floor(displayXP / 1000) + 1}
                             </p>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-8 shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-lg font-black text-white tracking-tighter">{entry.tasksCompleted || 0}</p>
                          <p className="text-[9px] text-[var(--so-text-secondary)] font-black uppercase tracking-widest">Tasks Hub</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black tracking-tighter" style={{ color: style.color }}>{displayXP.toLocaleString()}</p>
                          <p className="text-[9px] text-[var(--so-text-secondary)] font-black uppercase tracking-widest">Neural XP</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column - User Stats & Badges */}
          <div className="lg:col-span-1 space-y-8 overflow-y-auto custom-scrollbar pr-2 pb-10">
            {/* My Stats Card */}
            <div className="bg-gradient-to-br from-[#002038] to-[#001222] rounded-3xl border border-[#F77F00]/30 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] animate-fade-in-up delay-75 relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F77F00]/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:bg-[#F77F00]/20 transition-colors" />

              <div className="p-6 border-b border-[#F77F00]/10 flex justify-between items-start relative z-10">
                <div>
                  <h3 className="font-black text-white text-base tracking-tight mb-1">My Performance</h3>
                  <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">Active Cycle Metrics</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F77F00]/10 text-[#F77F00] shadow-inner">
                  <Target size={20} />
                </div>
              </div>

              <div className="p-6 grid grid-cols-2 gap-6 relative z-10">
                <div className="bg-[#001829]/60 backdrop-blur-md rounded-2xl p-4 border border-[#F77F00]/10 text-center hover:border-[#F77F00]/40 transition-all">
                  <p className="text-[10px] font-black text-[#FCBF49] uppercase tracking-[0.2em] mb-2">Global Rank</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {leaderboard.findIndex(e => e.userId === user?.id) !== -1
                      ? `#${leaderboard.findIndex(e => e.userId === user?.id) + 1}`
                      : '—'}
                  </p>
                </div>
                <div className="bg-[#001829]/60 backdrop-blur-md rounded-2xl p-4 border border-[#F77F00]/10 text-center hover:border-[#F77F00]/40 transition-all">
                  <p className="text-10px font-black text-[#FCBF49] uppercase tracking-[0.2em] mb-2">Neural XP</p>
                  <p className="text-3xl font-black text-white tracking-tighter">{userStats?.xpPoints?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-[#001829]/60 backdrop-blur-md rounded-2xl p-5 border border-[#F77F00]/10 text-center col-span-2 hover:border-[#22c55e]/40 transition-all">
                  <p className="text-[10px] font-black text-[#22c55e] uppercase tracking-[0.2em] mb-2">Operational Success</p>
                  <p className="text-3xl font-black text-white flex items-center justify-center gap-3 tracking-tighter">
                    <CheckCircle2 size={24} className="text-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" /> {userStats?.tasksCompleted || 0} <span className="text-xs text-[var(--so-text-secondary)] font-black uppercase tracking-widest ml-1">Tasks</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Badges Collection */}
            <div className="bg-[#001829]/80 backdrop-blur-xl rounded-3xl border border-[#F77F00]/10 overflow-hidden animate-fade-in-up delay-150 shadow-xl">
              <div className="p-5 border-b border-[#F77F00]/10 flex items-center justify-between bg-[#001222]/40">
                <div className="flex items-center gap-3">
                  <Award size={18} className="text-[#D62828]" />
                  <h3 className="font-black text-white text-xs uppercase tracking-[0.2em]">Neural Achievements</h3>
                </div>
                <Badge variant="gold" className="!text-[9px] font-black uppercase tracking-widest">{badges.length} Unlocked</Badge>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="grid grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="aspect-square rounded-2xl shimmer" />)}
                  </div>
                ) : !badges || badges.length === 0 ? (
                  <div className="text-center py-10 opacity-20">
                    <Award size={48} className="mx-auto mb-4" />
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">No Protocol Badges Earned</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {badges.map((badge, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-[#002038] to-[#001222] border border-[#F77F00]/10 relative overflow-hidden group hover:border-[#F77F00]/60 hover:-translate-y-1 transition-all cursor-default shadow-lg"
                        title={badge.description}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F77F00]/0 to-[#F77F00]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-3xl drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] relative z-10 group-hover:scale-110 transition-transform">{badge.icon}</span>
                        <span className="text-[9px] font-black text-[#FCBF49] text-center px-1 leading-tight relative z-10 uppercase tracking-tighter opacity-80 group-hover:opacity-100">
                          {badge.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* XP Info Box */}
            <div className="bg-[#002038] rounded-2xl p-5 border border-[#003049] flex items-start gap-4 animate-fade-in-up delay-200 shadow-lg group hover:border-[#FCBF49]/30 transition-colors">
              <div className="p-2 rounded-xl bg-[#FCBF49]/10 text-[#FCBF49] shrink-0 mt-0.5 shadow-inner group-hover:scale-110 transition-transform">
                <Zap size={18} />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-widest mb-1.5">Neural Advancement Protocol</p>
                <p className="text-[11px] text-[#94a3b8] leading-relaxed font-bold">
                  Execute tasks to accumulate <span className="text-[#F77F00]">Neural XP</span>. Sustained high-velocity completion grants access to elite status tiers and unique cryptographic badges.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
