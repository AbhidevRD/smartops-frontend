import { create } from 'zustand';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,

  fetchTasks: async (options = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (options.projectId) params.set('projectId', options.projectId);
      if (options.status)    params.set('status',    options.status);
      const url = params.toString() ? `${API_ENDPOINTS.TASKS.LIST}?${params}` : API_ENDPOINTS.TASKS.LIST;
      const response = await axiosInstance.get(url);
      set({ tasks: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch tasks';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  upsertTaskFromSocket: (task) => {
    set((state) => {
      const exists = state.tasks.some((item) => item.id === task.id);

      return {
        tasks: exists
          ? state.tasks.map((item) => (item.id === task.id ? task : item))
          : [task, ...state.tasks],
        currentTask: state.currentTask?.id === task.id ? task : state.currentTask,
      };
    });
  },

  removeTaskFromSocket: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
      currentTask: state.currentTask?.id === taskId ? null : state.currentTask,
    }));
  },

  fetchTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.TASKS.GET(id));
      set({ currentTask: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch task';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  fetchProjectTasks: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.TASKS.BY_PROJECT(projectId));
      set({ tasks: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch project tasks';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  setCurrentTask: (task) => set({ currentTask: task }),

  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.TASKS.CREATE, taskData);
      set((state) => ({
        tasks: [...state.tasks, response.data],
        isLoading: false,
      }));
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to create task';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  updateTask: async (id, taskData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.TASKS.UPDATE(id), taskData);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? response.data : t)),
        currentTask: state.currentTask?.id === id ? response.data : state.currentTask,
        isLoading: false,
      }));
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to update task';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  updateTaskStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch(API_ENDPOINTS.TASKS.UPDATE_STATUS(id), {
        status,
      });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? response.data : t)),
        currentTask: state.currentTask?.id === id ? response.data : state.currentTask,
        isLoading: false,
      }));
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to update task status';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(API_ENDPOINTS.TASKS.DELETE(id));
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        currentTask: state.currentTask?.id === id ? null : state.currentTask,
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to delete task';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Real-time synchronization
  _socketInitialized: false,

  initTaskSocketListener: (token) => {
    const { _socketInitialized } = get();
    if (_socketInitialized) return;

    import('@/services/socketService').then(({ default: socketService }) => {
      const socket = socketService.connect(token);
      if (!socket) return;

      socket.on('task-created', (task) => {
        console.log('[Realtime] Task Created:', task.title);
        get().upsertTaskFromSocket(task);
      });

      socket.on('task-updated', (task) => {
        console.log('[Realtime] Task Updated:', task.title);
        get().upsertTaskFromSocket(task);
      });

      socket.on('task-deleted', ({ id }) => {
        console.log('[Realtime] Task Deleted:', id);
        get().removeTaskFromSocket(id);
      });

      set({ _socketInitialized: true });
    });
  },

  cleanupTaskSocketListener: () => {
    import('@/services/socketService').then(({ default: socketService }) => {
      const socket = socketService.socket;
      if (socket) {
        socket.off('task-created');
        socket.off('task-updated');
        socket.off('task-deleted');
      }
      set({ _socketInitialized: false });
    });
  },
}));
