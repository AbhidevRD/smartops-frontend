import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const useChatStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  fetchChatHistory: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CHAT.HISTORY(projectId));
      set({ messages: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch chat history';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  sendMessage: async (projectId, message, fileData = null) => {
    try {
      const payload = {
        projectId,
        message,
      };
      if (fileData) {
        payload.fileUrl = fileData.url;
        payload.fileName = fileData.name;
        payload.fileType = fileData.type;
      }

      const response = await axiosInstance.post(API_ENDPOINTS.CHAT.SEND, payload);
      set((state) => ({
        messages: state.messages.some((message) => message.id === response.data.data.id)
          ? state.messages
          : [...state.messages, response.data.data],
      }));
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.response?.data?.message };
    }
  },

  markMessageAsRead: async (messageId) => {
    try {
      await axiosInstance.patch(API_ENDPOINTS.CHAT.READ(messageId));
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === messageId ? { ...m, isRead: true } : m
        ),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.response?.data?.message };
    }
  },

  addMessage: (message) => {
    set((state) => ({
      messages: state.messages.some((existing) => existing.id === message.id)
        ? state.messages
        : [...state.messages, message],
    }));
  },
}));
