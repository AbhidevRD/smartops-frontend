export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    VERIFY_OTP: '/api/auth/verify-otp',
    RESEND_OTP: '/api/auth/resend-otp',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  
  // Projects
  PROJECTS: {
    LIST: '/api/projects',
    GET: (id) => `/api/projects/${id}`,
    CREATE: '/api/projects',
    UPDATE: (id) => `/api/projects/${id}`,
    DELETE: (id) => `/api/projects/${id}`,
  },
  
  // Tasks
  TASKS: {
    LIST: '/api/tasks',
    GET: (id) => `/api/tasks/${id}`,
    CREATE: '/api/tasks',
    UPDATE: (id) => `/api/tasks/${id}`,
    DELETE: (id) => `/api/tasks/${id}`,
    BY_PROJECT: (projectId) => `/api/projects/${projectId}/tasks`,
  },
  
  // Dashboard
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    ACTIVITY: '/api/dashboard/activity',
  },
  
  // AI
  AI: {
    PARSE_TASK: '/api/ai/parse-task',
    PRIORITY: '/api/ai/priority',
    STANDUP: '/api/ai/standup',
    RISK: (taskId) => `/api/ai/risk/${taskId}`,
    VELOCITY: (projectId) => `/api/ai/velocity/${projectId}`,
    BOTTLENECK: '/api/ai/bottleneck',
    BURNOUT: '/api/ai/burnout',
    SENTIMENT: '/api/ai/sentiment',
    POMODORO_START: '/api/ai/pomodoro/start',
    POMODORO_STATS: '/api/ai/pomodoro/stats',
    LEADERBOARD: '/api/ai/leaderboard',
    DEPENDENCY: (projectId) => `/api/ai/dependency/${projectId}`,
    SPRINT_PLAN: '/api/ai/sprint-plan',
    NOTES_TO_TASKS: '/api/ai/notes-to-tasks',
    VOICE_COMMAND: '/api/ai/voice-command',
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
    READ: (id) => `/api/notifications/${id}`,
  },
  
  // Comments
  COMMENTS: {
    LIST: '/api/comments',
    CREATE: '/api/comments',
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
  },
  
  // Activity
  ACTIVITY: {
    LIST: '/api/activity',
  },
};
