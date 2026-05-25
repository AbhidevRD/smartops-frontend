import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import socketService from '@/services/socketService';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  _socketInitialized: false,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.LIST);
      const notifications = response.data;
      const unreadCount = notifications.filter(n => !n.isRead).length;
      set({ notifications, unreadCount, isLoading: false });
      return { success: true, data: notifications };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch notifications';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  markAsRead: async (id) => {
    try {
      await axiosInstance.patch(API_ENDPOINTS.NOTIFICATIONS.READ(id));
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  markAllAsRead: async () => {
    try {
      await axiosInstance.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0
      }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  // Initialize Socket.IO listener for real-time notifications
  initSocketListener: () => {
    const { _socketInitialized } = get();
    if (_socketInitialized) return;

    const socket = socketService.connect();
    if (!socket) return;

    socket.on('new-notification', (notification) => {
      console.log('[Notification] Real-time:', notification.title);
      get().addNotification(notification);
    });

    set({ _socketInitialized: true });
  },

  // Cleanup socket listener
  cleanupSocketListener: () => {
    const socket = socketService.socket;
    if (socket) {
      socket.off('new-notification');
    }
    set({ _socketInitialized: false });
  },
}));
