import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

function normalizeBadges(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.badges)) return payload.badges;
  return [];
}

export const useBadgeStore = create((set, get) => ({
  badges: [],
  userBadges: {},
  isLoading: false,
  error: null,

  fetchBadges: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.BADGES.LIST);
      const badges = normalizeBadges(response.data);
      set({ badges, isLoading: false });
      return { success: true, data: badges };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch badges';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  fetchUserBadges: async (userId) => {
    if (!userId) {
      return { success: false, error: 'userId is required' };
    }

    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.BADGES.USER(userId));
      const badges = normalizeBadges(response.data);
      set({
        userBadges: {
          ...get().userBadges,
          [userId]: badges,
        },
        isLoading: false,
      });
      return { success: true, data: badges };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch user badges';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  assignBadge: async ({ userId, badgeId }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.BADGES.ASSIGN, {
        userId,
        badgeId,
      });
      const assignedBadge = response.data?.data || response.data?.badge;
      const currentBadges = get().userBadges[userId] || [];

      set({
        userBadges: {
          ...get().userBadges,
          [userId]: assignedBadge ? [assignedBadge, ...currentBadges] : currentBadges,
        },
        isLoading: false,
      });

      return { success: true, data: assignedBadge };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to assign badge';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },
}));
