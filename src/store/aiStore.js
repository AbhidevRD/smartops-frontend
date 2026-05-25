import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const useAIStore = create((set, get) => ({
  isLoading: false,
  error: null,

  // Task Parsing
  parseTask: async (text) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AI.PARSE_TASK, { text });
      set({ isLoading: false });
      // backend returns { success, data }
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to parse task';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Task Priority Analysis
  analyzePriority: async (title, dueDays, workload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AI.PRIORITY, {
        title,
        dueDays,
        workload,
      });
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to analyze priority';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Standup Report
  generateStandup: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AI.STANDUP);
      set({ isLoading: false });
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate standup';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Risk Prediction
  predictRisk: async (taskId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AI.RISK(taskId));
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to predict risk';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Velocity Forecast
  forecastVelocity: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AI.VELOCITY(projectId));
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to forecast velocity';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Bottleneck Detection
  detectBottleneck: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AI.BOTTLENECK);
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to detect bottleneck';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Burnout Detection
  detectBurnout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AI.BURNOUT);
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to detect burnout';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Sentiment Analysis
  analyzeSentiment: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AI.SENTIMENT);
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to analyze sentiment';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Dependency Graph
  getDependencies: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AI.DEPENDENCY(projectId));
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to get dependencies';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Sprint Planning
  planSprint: async (projectId, duration) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AI.SPRINT_PLAN, {
        projectId,
        duration,
      });
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to plan sprint';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Notes to Tasks
  convertNotesToTasks: async (notes) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AI.NOTES_TO_TASKS, {
        notes,
      });
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to convert notes';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Voice Command
  processVoiceCommand: async (audioBlob) => {
    set({ isLoading: true, error: null });
    try {
      // frontend currently should send text commands (server expects { projectId, command })
      // if caller passed an object with { projectId, command } forward it
      if (audioBlob && audioBlob.command) {
        const { projectId, command } = audioBlob;
        const response = await axiosInstance.post(API_ENDPOINTS.AI.VOICE_COMMAND, { projectId, command });
        set({ isLoading: false });
        return { success: true, data: response.data };
      }

      // otherwise signal unsupported payload
      set({ isLoading: false });
      return { success: false, error: 'Client-side transcription required. Send {projectId, command}.' };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to process voice command';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },
}));
