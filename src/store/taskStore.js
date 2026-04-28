import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.TASKS.LIST);
      set({ tasks: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  fetchProjectTasks: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.TASKS.BY_PROJECT(projectId));
      set({ tasks: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch project tasks';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  setCurrentTask: (task) => set({ currentTask: task }),

  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.TASKS.CREATE, taskData);
      set((state) => ({
        tasks: [...state.tasks, response.data],
        isLoading: false,
      }));
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  updateTask: async (id, taskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.TASKS.UPDATE(id), taskData);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? response.data : t)),
        isLoading: false,
      }));
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(API_ENDPOINTS.TASKS.DELETE(id));
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },
}));
