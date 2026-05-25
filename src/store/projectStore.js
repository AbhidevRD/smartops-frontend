import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export const useProjectStore = create(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      activeProjectId: null, // globally selected project (null = "All Projects")
      isLoading: false,
      error: null,

      // ── Active project ─────────────────────────────────────────────
      setActiveProject: (id) => set({ activeProjectId: id }),

      // ── CRUD ────────────────────────────────────────────────────────
      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get(API_ENDPOINTS.PROJECTS.LIST);
          const projects = response.data;
          set({ projects, isLoading: false });

          // If active project was deleted externally, reset to null
          const { activeProjectId } = get();
          if (activeProjectId && !projects.find(p => p.id === activeProjectId)) {
            set({ activeProjectId: null });
          }

          return { success: true, data: projects };
        } catch (error) {
          const message = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch projects';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      fetchProject: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get(API_ENDPOINTS.PROJECTS.GET(id));
          set({ currentProject: response.data, isLoading: false });
          return { success: true, data: response.data };
        } catch (error) {
          const message = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch project';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      setCurrentProject: (project) => set({ currentProject: project }),

      createProject: async (projectData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post(API_ENDPOINTS.PROJECTS.CREATE, projectData);
          set((state) => ({
            projects: [response.data, ...state.projects],
            isLoading: false,
          }));
          return { success: true, data: response.data };
        } catch (error) {
          const message = error.response?.data?.error || error.response?.data?.message || 'Failed to create project';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      updateProject: async (id, projectData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.put(API_ENDPOINTS.PROJECTS.UPDATE(id), projectData);
          set((state) => ({
            projects: state.projects.map((p) => (p.id === id ? response.data : p)),
            currentProject: state.currentProject?.id === id ? response.data : state.currentProject,
            isLoading: false,
          }));
          return { success: true, data: response.data };
        } catch (error) {
          const message = error.response?.data?.error || error.response?.data?.message || 'Failed to update project';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      deleteProject: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            currentProject: state.currentProject?.id === id ? null : state.currentProject,
            activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
            isLoading: false,
          }));
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.error || error.response?.data?.message || 'Failed to delete project';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      getProjectMembers: async (projectId) => {
        try {
          const response = await axiosInstance.get(API_ENDPOINTS.MEMBERS.GET_PROJECT_MEMBERS(projectId));
          return { success: true, data: response.data };
        } catch (error) {
          const message = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch project members';
          return { success: false, error: message };
        }
      },

      joinProject: async (code) => {
        try {
          const response = await axiosInstance.post(API_ENDPOINTS.PROJECTS.JOIN, {
            joinCode: code.toUpperCase().trim(),
          });
          const newProject = response.data.project;
          set((state) => {
            const exists = state.projects.some((p) => p.id === newProject.id);
            return {
              projects: exists ? state.projects : [newProject, ...state.projects],
            };
          });
          return { success: true, data: response.data };
        } catch (error) {
          const message = error.response?.data?.error || error.response?.data?.message || 'Failed to join project';
          return { success: false, error: message };
        }
      },

      getJoinCode: async (id) => {
        try {
          const response = await axiosInstance.get(API_ENDPOINTS.PROJECTS.GET_CODE(id));
          return { success: true, data: response.data };
        } catch (error) {
          const message = error.response?.data?.error || error.response?.data?.message || 'Failed to get join code';
          return { success: false, error: message };
        }
      },

      regenerateJoinCode: async (id) => {
        try {
          const response = await axiosInstance.patch(API_ENDPOINTS.PROJECTS.REGENERATE_CODE(id));
          const newJoinCode = response.data.project?.joinCode;
          set((state) => ({
            currentProject:
              state.currentProject?.id === id
                ? { ...state.currentProject, joinCode: newJoinCode }
                : state.currentProject,
            projects: state.projects.map((p) =>
              p.id === id ? { ...p, joinCode: newJoinCode } : p
            ),
          }));
          return { success: true, data: response.data };
        } catch (error) {
          const message = error.response?.data?.error || error.response?.data?.message || 'Failed to regenerate join code';
          return { success: false, error: message };
        }
      },

      // ── Real-time ────────────────────────────────────────────────────
      _socketInitialized: false,

      initProjectSocketListener: (token) => {
        const { _socketInitialized } = get();
        if (_socketInitialized) return;

        import('@/services/socketService').then(({ default: socketService }) => {
          const socket = socketService.connect(token);
          if (!socket) return;

          // A new member joined a project — refresh that project's member list
          socket.on('member-joined', async (data) => {
            console.log('%c[Realtime] Member Joined Project:', 'color: #3b82f6; font-weight: bold;', data.projectId);
            try {
              const response = await axiosInstance.get(API_ENDPOINTS.PROJECTS.GET(data.projectId));
              const updated = response.data;
              set((state) => ({
                projects: state.projects.map((p) => p.id === data.projectId ? { ...p, ...updated, memberCount: updated.members?.length || p.memberCount } : p),
                currentProject: state.currentProject?.id === data.projectId ? { ...state.currentProject, ...updated } : state.currentProject,
              }));
            } catch {
              get().fetchProjects();
            }
          });

          // Current user just joined a new project — add it to the list
          socket.on('joined-project', ({ project }) => {
            console.log('%c[Realtime] I Joined New Project:', 'color: #22c55e; font-weight: bold;', project?.id);
            if (!project) return;
            set((state) => {
              const exists = state.projects.some(p => p.id === project.id);
              return exists ? {} : { projects: [project, ...state.projects] };
            });
          });

          // A project was deleted by its owner — remove it from state
          socket.on('project-deleted', ({ projectId }) => {
            console.log('%c[Realtime] Project Deleted:', 'color: #ef4444; font-weight: bold;', projectId);
            set((state) => ({
              projects: state.projects.filter((p) => p.id !== projectId),
              currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
              activeProjectId: state.activeProjectId === projectId ? null : state.activeProjectId,
            }));
          });

          set({ _socketInitialized: true });
        });
      },

      joinProjectRoom: (projectId) => {
        import('@/services/socketService').then(({ default: socketService }) => {
          socketService.joinProject(projectId, (response) => {
            if (response?.success) {
              console.log(`%c[Socket] Joined project room: ${projectId}`, 'color: #8b5cf6;');
            } else {
              console.warn(`[Socket] Could not join project room ${projectId}:`, response?.error || 'Access denied');
            }
          });
        });
      },
    }),
    {
      name: 'project-store',
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
      // Only persist the active project selection — the project list is always re-fetched fresh
      partialize: (state) => ({ activeProjectId: state.activeProjectId }),
    }
  )
);
