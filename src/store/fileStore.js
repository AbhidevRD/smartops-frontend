import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const useFileStore = create((set, get) => ({
  files: [],
  isLoading: false,
  uploadProgress: 0,
  error: null,

  fetchTaskFiles: async (taskId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.FILES.TASK_FILES(taskId));
      set({ files: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch files', isLoading: false });
      return { success: false };
    }
  },

  fetchProjectFiles: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.FILES.PROJECT_FILES(projectId));
      set({ files: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to fetch files', isLoading: false });
      return { success: false };
    }
  },

  uploadFile: async (file, projectId, taskId = null, metadata = {}) => {
    set({ isLoading: true, error: null, uploadProgress: 0 });
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);
      if (taskId) formData.append('taskId', taskId);
      if (metadata.description) formData.append('description', metadata.description);
      if (metadata.tags) formData.append('tags', metadata.tags);

      const response = await axiosInstance.post(API_ENDPOINTS.FILES.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          set({ uploadProgress: percentCompleted });
        },
      });

      set((state) => ({ 
        files: [response.data, ...state.files],
        isLoading: false,
        uploadProgress: 0 
      }));
      return { success: true, data: response.data };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to upload file', isLoading: false, uploadProgress: 0 });
      return { success: false, error: error.response?.data?.error || 'Failed to upload' };
    }
  },

  deleteFile: async (fileId) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.FILES.DELETE(fileId));
      set((state) => ({
        files: state.files.filter(f => f.id !== fileId)
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.error || 'Failed to delete file' });
      return { success: false };
    }
  },

  addRealtimeFile: (file) => {
    set((state) => {
      if (state.files.find(f => f.id === file.id)) return state;
      return { files: [file, ...state.files] };
    });
  }
}));
