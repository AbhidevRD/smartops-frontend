import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PROJECTS.LIST);
      set({ projects: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch projects';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  createProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.PROJECTS.CREATE, projectData);
      set((state) => ({
        projects: [...state.projects, response.data],
        isLoading: false,
      }));
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create project';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  updateProject: async (id, projectData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.PROJECTS.UPDATE(id), projectData);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? response.data : p)),
        isLoading: false,
      }));
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update project';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete project';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },
}));
