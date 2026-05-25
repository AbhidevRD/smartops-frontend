'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Menu, X, Bell, Search, Home, FolderOpen, CheckSquare, BarChart3, Settings, Users, MessageSquare, ChevronRight, Plus, User, Paintbrush, Sparkles } from 'lucide-react';
import { Logo } from './logo';
import { useNotificationStore } from '@/store/notificationStore';
import { JoinProjectModal } from './join-project-modal';
import { useProjectStore } from '@/store/projectStore';
import { useTaskStore } from '@/store/taskStore';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/projects', label: 'Projects', icon: FolderOpen },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare },
    { href: '/board', label: 'Kanban Board', icon: BarChart3 },
    { href: '/ai', label: 'AI Assistant', icon: BarChart3 },
    { href: '/chat', label: 'Chat', icon: MessageSquare },
    { href: '/meeting-ai', label: 'Meeting AI', icon: Sparkles },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/focus', label: 'Focus Mode', icon: CheckSquare },
    { href: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin-email', label: 'Email', icon: BarChart3 },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-navy-gradient border-r border-primary/10 transform transition-transform duration-300 z-50 md:relative md:translate-x-0 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{
          background: 'linear-gradient(180deg, rgba(0, 24, 41, 0.95) 0%, rgba(0, 48, 73, 0.9) 100%)',
          backdropFilter: 'blur(12px)',
          borderRight: '1px solid rgba(247, 127, 0, 0.1)',
        }}
      >
        {/* Logo Section */}
        <div
          className="px-6 py-6 border-b border-primary/10"
          style={{ borderColor: 'rgba(247, 127, 0, 0.12)' }}
        >
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <Logo size="md" variant="iconOnly" animate={true} />
            <div>
              <div className="text-sm font-bold text-white group-hover:text-[#FCBF49] transition-colors">SmartOps AI</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${active
                    ? 'sidebar-nav-active'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                style={
                  active
                    ? {
                      background: 'linear-gradient(90deg, rgba(247, 127, 0, 0.2), rgba(252, 191, 73, 0.1))',
                      borderLeft: '3px solid #F77F00',
                      paddingLeft: 'calc(1rem - 3px)',
                      boxShadow: '0 0 12px rgba(247, 127, 0, 0.1)',
                    }
                    : {}
                }
              >
                <Icon size={20} className={active ? 'text-orange-primary' : 'text-gray-500 group-hover:text-orange-primary transition-colors'} />
                <span className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors`}>
                  {item.label}
                </span>
                {active && <ChevronRight size={16} className="ml-auto text-orange-primary" />}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div
          className="border-t border-primary/10 px-4 py-4"
          style={{ borderColor: 'rgba(247, 127, 0, 0.12)' }}
        >
          <div
            className="rounded-lg p-4 mb-4 backdrop-blur"
            style={{
              background: 'rgba(247, 127, 0, 0.08)',
              border: '1px solid rgba(247, 127, 0, 0.15)',
            }}
          >
            <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">LOGGED IN</p>
            <p className="text-sm font-bold text-white mb-3">{user?.name || 'User'}</p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-orange-primary transition-colors w-full hover:bg-white/5 px-2 py-2 rounded-lg"
            >
              <LogOut size={14} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const TopBar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotificationStore();
  const { projects, fetchProjects, initProjectSocketListener } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
    fetchProjects();
    fetchTasks();
    // Initialize realtime project listeners (member-joined, project-deleted)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) initProjectSocketListener(token);
  }, [fetchNotifications, fetchProjects, fetchTasks, initProjectSocketListener]);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute search results
  const query = searchQuery.trim().toLowerCase();
  const matchedProjects = query
    ? (projects || []).filter(p => p.name?.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query)).slice(0, 4)
    : [];
  const matchedTasks = query
    ? (tasks || []).filter(t => t.title?.toLowerCase().includes(query) || t.description?.toLowerCase().includes(query)).slice(0, 4)
    : [];
  const hasResults = matchedProjects.length > 0 || matchedTasks.length > 0;

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setIsNotificationsOpen(false);
    if (notification.type === 'TASK_ASSIGNED' || notification.type === 'TASK_UPDATE') router.push('/tasks');
    else if (notification.type === 'PROJECT_INVITE') router.push('/projects');
    else router.push('/notifications');
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  return (
    <>
      <header className="h-16 bg-[#001829]/95 backdrop-blur-xl border-b border-[#F77F00]/20 z-40 relative shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-white hover:bg-[#002038] hover:text-[#FCBF49] rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/dashboard" className="text-lg font-black text-white hidden md:block hover:text-[#FCBF49] transition-colors tracking-wide">
              SmartOps AI
            </Link>
          </div>

          {/* Center - Search & Join */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8 items-center gap-4">
            <div className="flex-1 relative group" ref={searchRef}>
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--so-text-secondary)] group-focus-within:text-[#F77F00] transition-colors z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search projects, tasks..."
                className="so-input w-full pl-10"
              />
              {/* Search Dropdown */}
              {isSearchOpen && query && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#001222]/98 backdrop-blur-xl border border-[#F77F00]/30 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.7)] overflow-hidden z-50 animate-scale-in origin-top">
                  {!hasResults ? (
                    <div className="px-4 py-6 text-center text-sm text-[#94a3b8] font-medium">No results found for &ldquo;{searchQuery}&rdquo;</div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      {matchedProjects.length > 0 && (
                        <div>
                          <div className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-[#F77F00]/70 border-b border-[#F77F00]/10">Projects</div>
                          {matchedProjects.map(p => (
                            <button
                              key={p.id}
                              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); router.push(`/projects`); }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#002038] transition-colors text-left"
                            >
                              <FolderOpen size={14} className="text-[#F77F00] shrink-0" />
                              <div>
                                <p className="text-sm font-bold text-white truncate">{p.name}</p>
                                {p.description && <p className="text-xs text-[#94a3b8] truncate mt-0.5">{p.description}</p>}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      {matchedTasks.length > 0 && (
                        <div>
                          <div className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-[#FCBF49]/70 border-b border-[#F77F00]/10">Tasks</div>
                          {matchedTasks.map(t => (
                            <button
                              key={t.id}
                              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); router.push(`/tasks`); }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#002038] transition-colors text-left"
                            >
                              <CheckSquare size={14} className="text-[#FCBF49] shrink-0" />
                              <div>
                                <p className="text-sm font-bold text-white truncate">{t.title}</p>
                                {t.description && <p className="text-xs text-[#94a3b8] truncate mt-0.5">{t.description}</p>}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsJoinModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#002038] hover:bg-[#003049] border border-[#F77F00]/30 hover:border-[#F77F00] text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_10px_rgba(247,127,0,0.1)] hover:shadow-[0_0_15px_rgba(247,127,0,0.3)]"
            >
              <Plus size={16} className="text-[#F77F00]" />
              Join Project
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
                className={`p-2.5 rounded-xl relative transition-all duration-300 ${isNotificationsOpen ? 'bg-[#003049] text-[#F77F00] shadow-[inset_0_0_10px_rgba(247,127,0,0.2)]' : 'text-[#94a3b8] hover:bg-[#002038] hover:text-white'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D62828] rounded-full shadow-[0_0_8px_rgba(214,40,40,0.8)] animate-pulse"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-[#001222]/95 backdrop-blur-xl border border-[#F77F00]/30 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] overflow-hidden z-50 animate-scale-in origin-top-right">
                  <div className="p-4 border-b border-[#F77F00]/10 flex justify-between items-center bg-[#001829]">
                    <h3 className="font-black text-white tracking-wide">Notifications</h3>
                    <Link href="/notifications" className="text-[10px] uppercase font-bold text-[#F77F00] hover:text-[#FCBF49]" onClick={() => setIsNotificationsOpen(false)}>View All</Link>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => handleNotificationClick(n)}
                          className={`p-4 border-b border-[#003049]/50 cursor-pointer hover:bg-[#002038] transition-colors flex gap-3 ${!n.isRead ? 'bg-[#003049]/20' : ''}`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-[#F77F00] shadow-[0_0_8px_rgba(247,127,0,0.6)]' : 'bg-transparent'}`} />
                          <div>
                            <p className="text-sm font-bold text-white mb-1">{n.title}</p>
                            <p className="text-xs text-[#94a3b8] line-clamp-2">{n.message}</p>
                            <p className="text-[9px] text-[var(--so-text-secondary)] uppercase font-bold tracking-wider mt-2">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-[var(--so-text-secondary)] font-bold text-sm">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button 
                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#F77F00] to-[#D62828] rounded-full blur-[6px] opacity-40 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative w-9 h-9 bg-[#001829] border border-[#F77F00]/50 rounded-full flex items-center justify-center text-xs font-black text-white overflow-hidden z-10">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#001222]/95 backdrop-blur-xl border border-[#F77F00]/30 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] overflow-hidden z-50 animate-scale-in origin-top-right">
                  <div className="p-4 border-b border-[#F77F00]/10 bg-gradient-to-b from-[#002038] to-[#001222]">
                    <p className="text-sm font-black text-white truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-[#94a3b8] truncate">{user?.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button onClick={() => { setIsProfileOpen(false); router.push('/settings'); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#cbd5e1] hover:text-white hover:bg-[#002038] rounded-xl transition-colors">
                      <User size={16} className="text-[#F77F00]" /> Profile
                    </button>
                    <button onClick={() => { setIsProfileOpen(false); router.push('/settings'); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#cbd5e1] hover:text-white hover:bg-[#002038] rounded-xl transition-colors">
                      <Settings size={16} className="text-[#FCBF49]" /> Settings
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#cbd5e1] hover:text-white hover:bg-[#002038] rounded-xl transition-colors">
                      <Paintbrush size={16} className="text-[#22c55e]" /> Theme
                    </button>
                    <div className="h-px bg-[#003049] my-2 mx-2"></div>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#ef4444] hover:text-white hover:bg-[#D62828] rounded-xl transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {isJoinModalOpen && (
        <JoinProjectModal onClose={() => setIsJoinModalOpen(false)} onSuccess={() => { setIsJoinModalOpen(false); router.push('/projects'); }} />
      )}
    </>
  );
};

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const { projects, joinProjectRoom, initProjectSocketListener } = useProjectStore();
  const { initTaskSocketListener } = useTaskStore();

  useEffect(() => {
    if (isAuthenticated) {
      const { token } = useAuthStore.getState();
      initTaskSocketListener(token);
      initProjectSocketListener(token);
    }
  }, [isAuthenticated, initTaskSocketListener, initProjectSocketListener]);

  useEffect(() => {
    if (isAuthenticated && projects?.length > 0) {
      projects.forEach(project => {
        joinProjectRoom(project.id);
      });
    }
  }, [isAuthenticated, projects, joinProjectRoom]);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#001829] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto relative">
          {/* Background Decorative Glows */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#F77F00]/5 rounded-full blur-[120px]" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D62828]/5 rounded-full blur-[120px]" />
          </div>
          <div className="relative z-10 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
