import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const useTeamStore = create((set, get) => ({
  teamMembers: [],
  projectMembers: [],
  isLoading: false,
  error: null,

  // Fetch team members for a project
  fetchTeamMembers: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.MEMBERS.GET_PROJECT_MEMBERS(projectId)
      );
      set({ teamMembers: response.data, projectMembers: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch team members';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Add team member to project
  addTeamMember: async (projectId, userId, role = 'member') => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.MEMBERS.ADD(projectId),
        { userId, role }
      );
      const updatedMembers = [...get().projectMembers, response.data];
      set({ projectMembers: updatedMembers, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to add team member';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Update team member role
  updateMemberRole: async (projectId, memberId, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.MEMBERS.UPDATE(projectId, memberId),
        { role }
      );
      const updatedMembers = get().projectMembers.map(m =>
        m.id === memberId ? { ...m, role } : m
      );
      set({ projectMembers: updatedMembers, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to update member role';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Remove team member from project
  removeTeamMember: async (projectId, memberId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(API_ENDPOINTS.MEMBERS.REMOVE(projectId, memberId));
      const updatedMembers = get().projectMembers.filter(m => m.id !== memberId);
      set({ projectMembers: updatedMembers, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to remove team member';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Get team statistics
  getTeamStats: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/api/project/${projectId}/stats`);
      set({ isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch team stats';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },
}));
