import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const useAnalyticsStore = create((set, get) => ({
  dashboardData: null,
  stats: null,
  activity: [],
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.DEFAULT);
      set({ dashboardData: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.STATS);
      set({ stats: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch stats';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  fetchActivity: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.ACTIVITY);
      set({ activity: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch activity';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },
}));
