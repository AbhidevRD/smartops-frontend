import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const useActivityStore = create((set, get) => ({
  activities: [],
  filteredActivities: [],
  isLoading: false,
  error: null,

  // Fetch all activities
  fetchActivities: async (limit = 50, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.ACTIVITY}?limit=${limit}&offset=${offset}` || `/api/activity?limit=${limit}&offset=${offset}`
      );
      set({ activities: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch activities';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Fetch activities for a project
  fetchProjectActivities: async (projectId, limit = 50) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/api/projects/${projectId}/activity?limit=${limit}`
      );
      set({ filteredActivities: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch project activities';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Fetch activities for a task
  fetchTaskActivities: async (taskId, limit = 50) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/api/tasks/${taskId}/activity?limit=${limit}`
      );
      set({ filteredActivities: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch task activities';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Filter activities by type
  filterActivitiesByType: (type) => {
    const filtered = get().activities.filter(a => a.action.includes(type));
    set({ filteredActivities: filtered });
  },

  // Filter activities by date range
  filterActivitiesByDateRange: (startDate, endDate) => {
    const filtered = get().activities.filter(a => {
      const actDate = new Date(a.createdAt);
      return actDate >= startDate && actDate <= endDate;
    });
    set({ filteredActivities: filtered });
  },
}));
