import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const useAdminStore = create((set, get) => ({
  users: [],
  emailLogs: [],
  isLoading: false,
  error: null,

  // Fetch all users
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.USERS);
      set({ users: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.ADMIN.USERS}/${userId}/role`,
        { role }
      );
      const updatedUsers = get().users.map(u => 
        u.id === userId ? { ...u, role } : u
      );
      set({ users: updatedUsers, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user role';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Send email
  sendEmail: async (email, subject, message) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ADMIN_EMAIL.SEND,
        { email, subject, message }
      );
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send email';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Send bulk emails
  sendBulkEmails: async (emails, subject, message) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ADMIN_EMAIL.BULK,
        { emails, subject, message }
      );
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send bulk emails';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Fetch email logs
  fetchEmailLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_EMAIL.LOGS);
      const logs = Array.isArray(response.data) ? response.data : (response.data?.logs || []);
      set({ emailLogs: logs, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch email logs';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },
}));
