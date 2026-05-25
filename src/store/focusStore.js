import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const useFocusStore = create((set, get) => ({
  sessions: [],
  stats: null,
  isLoading: false,
  error: null,

  startPomodoroSession: async (taskId, durationMinutes = 25) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AI.POMODORO_START, {
        taskId,
        minutes: durationMinutes,
      });
      set((state) => ({
        sessions: [...state.sessions, response.data.data],
        isLoading: false,
      }));
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to start Pomodoro session';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  fetchPomodoroStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AI.POMODORO_STATS);
      set({ stats: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch Pomodoro stats';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  addSession: (session) => {
    set((state) => ({
      sessions: [...state.sessions, session],
    }));
  },
}));
