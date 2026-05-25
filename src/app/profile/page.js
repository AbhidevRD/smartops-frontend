'use client';

import { useAuthStore } from '@/store/authStore';
import AppLayout from '@/components/AppLayout';
import { UserCircle, Mail, Key, Shield, Camera, Edit2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const initials = (user?.name || 'U').split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();

  return (
    <AppLayout>
      <div className="p-6 h-full flex flex-col max-w-3xl mx-auto w-full animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              My Profile <UserCircle size={20} className="text-[#F77F00]" />
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(252,191,73,0.6)' }}>
              Manage your personal information
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pb-6">
          {/* Top Banner & Avatar */}
          <div className="rounded-2xl border border-[#F77F00]/20 bg-[#001829]/60 backdrop-blur-md overflow-hidden shadow-xl relative">
            <div className="h-32 bg-gradient-to-r from-[#F77F00] via-[#D62828] to-[#001829] opacity-80" />
            
            <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row gap-6 sm:items-end -mt-12">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-xl border-4 border-[#001829] bg-gradient-to-br from-[#003049] to-[#001222]">
                  {initials}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-[#F77F00] text-white rounded-full hover:bg-[#FCBF49] transition-colors shadow-lg border-2 border-[#001829]">
                  <Camera size={14} />
                </button>
              </div>
              
              <div className="flex-1 pb-2">
                <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                <p className="text-[#FCBF49] font-medium text-sm flex items-center gap-1.5 mt-1">
                  <Shield size={14} /> Member
                </p>
              </div>
              
              <div className="pb-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#002038] hover:bg-[#F77F00]/20 border border-[#F77F00]/30 text-white rounded-xl text-sm font-medium transition-colors">
                  <Edit2 size={16} className="text-[#F77F00]" /> Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Details Form */}
          <div className="rounded-2xl border border-[#F77F00]/15 bg-[#002038]/40 backdrop-blur-md p-6 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-[#F77F00]/10 pb-3">Personal Information</h3>
            
            <div className="space-y-5 max-w-xl">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#FCBF49]/80 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--so-text-secondary)]" />
                  <input type="text" disabled value={user?.name || ''} className="w-full pl-9 pr-4 py-2.5 bg-[#001222]/50 border border-[#F77F00]/10 rounded-xl text-white text-sm cursor-not-allowed opacity-70" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#FCBF49]/80 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--so-text-secondary)]" />
                  <input type="email" disabled value={user?.email || ''} className="w-full pl-9 pr-4 py-2.5 bg-[#001222]/50 border border-[#F77F00]/10 rounded-xl text-white text-sm cursor-not-allowed opacity-70" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#FCBF49]/80 mb-1.5">Password</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--so-text-secondary)]" />
                    <input type="password" disabled value="••••••••" className="w-full pl-9 pr-4 py-2.5 bg-[#001222]/50 border border-[#F77F00]/10 rounded-xl text-white text-sm cursor-not-allowed opacity-70" />
                  </div>
                  <button className="px-4 py-2 bg-[#001829] border border-[#F77F00]/20 text-[#94a3b8] hover:text-[#FCBF49] hover:border-[#FCBF49]/50 rounded-xl text-sm font-medium transition-colors shrink-0">
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
