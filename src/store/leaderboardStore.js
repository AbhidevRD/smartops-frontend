import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

function normalizeBadgeDetails(entry) {
  if (Array.isArray(entry.badgeDetails)) {
    return entry.badgeDetails;
  }

  if (!Array.isArray(entry.badges)) {
    return [];
  }

  return entry.badges.map((badge) => {
    if (typeof badge === 'string') {
      return {
        id: badge,
        name: badge,
        description: '',
        icon: 'award',
      };
    }

    return badge;
  });
}

export const useLeaderboardStore = create((set, get) => ({
  leaderboard: [],
  isLoading: false,
  error: null,

  fetchLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.AI.LEADERBOARD);
      const payload = response.data;
      const entries = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.users)
            ? payload.users
            : [];

      const leaderboard = entries.map((entry, index) => {
        const badgeDetails = normalizeBadgeDetails(entry);

        return {
          ...entry,
          userId: entry.userId || entry.id,
          userName: entry.userName || entry.name,
          points: entry.points ?? entry.xpPoints ?? entry.xp ?? 0,
          xpPoints: entry.xpPoints ?? entry.points ?? entry.xp ?? 0,
          rank: entry.rank ?? index + 1,
          badges: Array.isArray(entry.badges) ? entry.badges : badgeDetails.map((badge) => badge.name),
          badgeDetails,
        };
      });

      set({ leaderboard, isLoading: false });
      return { success: true, data: leaderboard };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch leaderboard';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  checkBadges: async () => {
    try {
      const response = await axiosInstance.post('/api/ai/badges/check');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
}));
