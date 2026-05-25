'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { updateSettings, updateNotificationPreferences, isLoading, error } = useSettingsStore();
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    taskReminders: true,
    dailyDigest: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    await updateSettings(formData);
    setSuccess('Settings saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handlePreferencesChange = async (key) => {
    const updated = { ...notificationPrefs, [key]: !notificationPrefs[key] };
    setNotificationPrefs(updated);
    await updateNotificationPreferences(updated);
    setSuccess('Preferences updated!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-2xl mx-auto relative z-10">
        <div className="mb-8 border-b border-[#F77F00]/20 pb-4">
          <h1 className="text-3xl font-black text-white tracking-wide">Account Settings</h1>
          <p className="text-sm font-bold text-[var(--so-text-secondary)] uppercase tracking-wider mt-1">Manage your preferences and profile details</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#D62828]/10 border border-[#D62828]/30 rounded-xl flex items-center gap-3 animate-fade-in-up">
            <AlertCircle size={20} className="text-[#D62828]" />
            <span className="text-[#D62828] font-bold text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-xl flex items-center gap-3 animate-fade-in-up">
            <CheckCircle size={20} className="text-[#22c55e]" />
            <span className="text-[#22c55e] font-bold text-sm">{success}</span>
          </div>
        )}

        {/* Profile Settings */}
        <div className="so-card p-6 mb-8">
          <div className="border-b border-[#F77F00]/10 pb-4 mb-6">
            <h2 className="text-lg font-bold text-white tracking-wide">Profile Information</h2>
          </div>
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Full Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="so-input w-full"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="so-input w-full opacity-60 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Phone Number</label>
              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="so-input w-full"
              />
            </div>

            <button 
              onClick={handleSave} 
              disabled={isLoading}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-[#F77F00] to-[#D62828] text-white font-black rounded-xl hover:shadow-[0_0_20px_rgba(247,127,0,0.4)] transition-all disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="so-card p-6">
          <div className="border-b border-[#F77F00]/10 pb-4 mb-6">
            <h2 className="text-lg font-bold text-white tracking-wide">Notification Preferences</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={notificationPrefs.emailNotifications}
                  onChange={() => handlePreferencesChange('emailNotifications')}
                  className="peer sr-only"
                />
                <div className="w-10 h-5 bg-[#001222] border border-[#003049] rounded-full peer-checked:bg-[#F77F00] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[var(--so-text-secondary)] peer-checked:after:bg-white after:border-none after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-[20px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"></div>
              </div>
              <span className="text-sm font-bold text-[#cbd5e1] group-hover:text-white transition-colors">Email Notifications</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={notificationPrefs.taskReminders}
                  onChange={() => handlePreferencesChange('taskReminders')}
                  className="peer sr-only"
                />
                <div className="w-10 h-5 bg-[#001222] border border-[#003049] rounded-full peer-checked:bg-[#F77F00] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[var(--so-text-secondary)] peer-checked:after:bg-white after:border-none after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-[20px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"></div>
              </div>
              <span className="text-sm font-bold text-[#cbd5e1] group-hover:text-white transition-colors">Task Reminders</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={notificationPrefs.dailyDigest}
                  onChange={() => handlePreferencesChange('dailyDigest')}
                  className="peer sr-only"
                />
                <div className="w-10 h-5 bg-[#001222] border border-[#003049] rounded-full peer-checked:bg-[#F77F00] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[var(--so-text-secondary)] peer-checked:after:bg-white after:border-none after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-[20px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"></div>
              </div>
              <span className="text-sm font-bold text-[#cbd5e1] group-hover:text-white transition-colors">Daily Digest</span>
            </label>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
