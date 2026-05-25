import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const useSettingsStore = create((set, get) => ({
  settings: null,
  preferences: {},
  isLoading: false,
  error: null,

  // Fetch user settings
  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SETTINGS?.GET || '/api/users/settings');
      set({ settings: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch settings';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Update settings
  updateSettings: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.SETTINGS?.UPDATE || '/api/users/settings',
        updates
      );
      set({ settings: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update settings';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.SETTINGS?.NOTIFICATIONS || '/api/users/settings/notifications',
        preferences
      );
      set({ preferences: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update preferences';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Update privacy settings
  updatePrivacySettings: async (privacy) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.SETTINGS?.PRIVACY || '/api/users/settings/privacy',
        privacy
      );
      set({ settings: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update privacy settings';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.SETTINGS?.CHANGE_PASSWORD || '/api/users/change-password',
        { currentPassword, newPassword }
      );
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },
}));
