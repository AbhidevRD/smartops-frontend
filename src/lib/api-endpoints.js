export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    VERIFY_OTP: '/api/auth/verify-otp',
    RESET_PASSWORD: '/api/auth/reset-password',
    GOOGLE_LOGIN: '/api/auth/google-login',
  },

  // Projects
  PROJECTS: {
    LIST: '/api/projects',
    GET: (id) => `/api/projects/${id}`,
    CREATE: '/api/projects',
    UPDATE: (id) => `/api/projects/${id}`,
    DELETE: (id) => `/api/projects/${id}`,
    JOIN: '/api/projects/join',
    GET_CODE: (id) => `/api/projects/${id}/code`,
    REGENERATE_CODE: (id) => `/api/projects/${id}/regenerate-code`,
  },

  // Tasks
  TASKS: {
    LIST: '/api/tasks',
    GET: (id) => `/api/tasks/${id}`,
    CREATE: '/api/tasks',
    UPDATE: (id) => `/api/tasks/${id}`,
    DELETE: (id) => `/api/tasks/${id}`,
    UPDATE_STATUS: (id) => `/api/tasks/${id}/status`,
    BY_PROJECT: (projectId) => `/api/projects/${projectId}/tasks`,
  },

  // Files
  FILES: {
    UPLOAD: '/api/files/upload',
    PROJECT_FILES: (projectId) => `/api/files/project/${projectId}`,
    TASK_FILES: (taskId) => `/api/files/task/${taskId}`,
    DOWNLOAD: (fileId) => `/api/files/${fileId}/download`,
    UPDATE: (fileId) => `/api/files/${fileId}`,
    DELETE: (fileId) => `/api/files/${fileId}`,
  },

  // Dashboard
  DASHBOARD: {
    DEFAULT: '/api/dashboard',
    STATS: '/api/dashboard/stats',
    ACTIVITY: '/api/dashboard/activity',
  },

  // Admin
  ADMIN: {
    USERS: '/api/admin/users',
  },

  // AI
  AI: {
    CHAT: '/api/ai/chat',
    PARSE_TASK: '/api/ai/parse-task',
    CREATE_TASK_NLP: '/api/ai/create-task',
    PRIORITY: '/api/ai/priority',
    STANDUP: '/api/ai/standup',
    RISK: (taskId) => `/api/ai/risk/${taskId}`,
    VELOCITY: (projectId) => `/api/ai/velocity/${projectId}`,
    BOTTLENECK: '/api/ai/bottleneck',
    BURNOUT: '/api/ai/burnout',
    SENTIMENT: '/api/ai/sentiment',
    POMODORO_START: '/api/ai/pomodoro/start',
    POMODORO_STATS: '/api/ai/pomodoro/stats',
    BADGES: '/api/ai/badges/check',
    LEADERBOARD: '/api/ai/leaderboard',
    DEPENDENCY: (projectId) => `/api/ai/dependency/${projectId}`,
    SPRINT_PLAN: '/api/ai/sprint-plan',
    NOTES_TO_TASKS: '/api/ai/notes-to-tasks',
    VOICE_COMMAND: '/api/ai/voice-command',
    MEETING_ANALYZE: '/api/ai/meeting-notes/analyze',
    MEETING_CREATE_TASKS: '/api/ai/meeting-notes/create-tasks',
  },

  // Badges
  BADGES: {
    LIST: '/api/badges',
    ASSIGN: '/api/badges/assign',
    USER: (userId) => `/api/badges/user/${userId}`,
    SEED: '/api/badges/seed',
  },

  // Chat
  CHAT: {
    SEND: '/api/chat/send',
    HISTORY: (projectId) => `/api/chat/history/${projectId}`,
    READ: (id) => `/api/chat/read/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    READ: (id) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: '/api/notifications/read-all',
  },

  // Comments
  COMMENTS: {
    LIST: (taskId) => `/api/comments/${taskId}`,
    CREATE: (taskId) => `/api/comments/${taskId}`,
    DELETE: (id) => `/api/comments/${id}`,
  },

  // Admin Email
  ADMIN_EMAIL: {
    SEND: '/api/admin-email/send',
    BULK: '/api/admin-email/bulk',
    LOGS: '/api/admin-email/logs',
  },

  // Reports
  REPORTS: {
    GENERATE: '/api/reports/generate',
    LIST: '/api/reports',
    DETAIL: (projectId) => `/api/reports/project/${projectId}`,
    DOWNLOAD: (projectId) => `/api/reports/project/${projectId}/download`,
  },

  // Activity
  ACTIVITY: {
    LIST: '/api/activity',
  },

  // Invites
  INVITES: {
    SEND: '/api/projects/invite',
    ACCEPT: '/api/projects/invite/accept',
    REJECT: '/api/projects/invite/reject',
    INFO: '/api/projects/invite/info',
    GET_PROJECT_INVITES: (projectId) => `/api/invites/project/${projectId}`,
    CANCEL: (inviteId) => `/api/invites/${inviteId}`,
  },

  // Members
  MEMBERS: {
    GET_PROJECT_MEMBERS: (projectId) => `/api/projects/${projectId}/members`,
    ADD: (projectId) => `/api/projects/${projectId}/members`,
    UPDATE: (projectId, memberId) => `/api/projects/${projectId}/members/${memberId}`,
    REMOVE: (projectId, memberId) => `/api/projects/${projectId}/members/${memberId}`,
  },

  // Files
  FILES: {
    UPLOAD: '/api/files/upload',
    PROJECT_FILES: (projectId) => `/api/files/project/${projectId}`,
    TASK_FILES: (taskId) => `/api/files/task/${taskId}`,
    DOWNLOAD: (id) => `/api/files/${id}/download`,
    UPDATE: (id) => `/api/files/${id}`,
    DELETE: (id) => `/api/files/${id}`,
  },
};
