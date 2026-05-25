import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const useReportsStore = create((set, get) => ({
  reports: [],
  currentReport: null,
  isLoading: false,
  error: null,

  fetchReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.REPORTS.LIST);
      set({ reports: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch reports';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  generateReport: async (reportType, projectId = null) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.REPORTS.GENERATE, {
        type: reportType,
        projectId,
      });
      set((state) => ({
        reports: [...state.reports, response.data],
        currentReport: response.data,
        isLoading: false,
      }));
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate report';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  fetchProjectReport: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.REPORTS.DETAIL(projectId));
      set({ currentReport: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to load report';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  downloadProjectReport: async (projectId, format = 'csv') => {
    set({ error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.REPORTS.DOWNLOAD(projectId), {
        params: { format },
        responseType: 'blob',
      });

      const disposition = response.headers['content-disposition'] || '';
      const filenameMatch = disposition.match(/filename="([^"]+)"/);
      const filename = filenameMatch?.[1] || `project-report.${format}`;

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to download report';
      set({ error: message });
      return { success: false, error: message };
    }
  },

  setCurrentReport: (report) => set({ currentReport: report }),
}));
