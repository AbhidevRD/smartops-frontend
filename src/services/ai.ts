import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

/**
 * Frontend AI Service
 * Centralized API calls for all AI features
 */

// Parse natural language into task
export async function parseTask(text) {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AI.PARSE_TASK, {
      text
    });
    return response.data;
  } catch (error) {
    console.error('[parseTask] Error:', error.message);
    throw error;
  }
}

// Prioritize task using AI
export async function prioritizeTask(title, dueDays = 7, workload = 0) {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AI.PRIORITY, {
      title,
      dueDays,
      workload
    });
    return response.data;
  } catch (error) {
    console.error('[prioritizeTask] Error:', error.message);
    throw error;
  }
}

// Generate daily standup report
export async function generateStandup() {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.AI.STANDUP);
    return response.data;
  } catch (error) {
    console.error('[generateStandup] Error:', error.message);
    throw error;
  }
}

// Get task risk prediction
export async function getTaskRisk(taskId) {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.AI.RISK(taskId));
    return response.data;
  } catch (error) {
    console.error('[getTaskRisk] Error:', error.message);
    throw error;
  }
}

// Get project velocity forecast
export async function getVelocityForecast(projectId) {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.AI.VELOCITY(projectId));
    return response.data;
  } catch (error) {
    console.error('[getVelocityForecast] Error:', error.message);
    throw error;
  }
}

// Detect project bottlenecks
export async function detectBottlenecks() {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.AI.BOTTLENECK);
    return response.data;
  } catch (error) {
    console.error('[detectBottlenecks] Error:', error.message);
    throw error;
  }
}

// Get team burnout analysis
export async function getBurnoutAnalysis() {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.AI.BURNOUT);
    return response.data;
  } catch (error) {
    console.error('[getBurnoutAnalysis] Error:', error.message);
    throw error;
  }
}

// Get team sentiment analysis
export async function getSentimentAnalysis() {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.AI.SENTIMENT);
    return response.data;
  } catch (error) {
    console.error('[getSentimentAnalysis] Error:', error.message);
    throw error;
  }
}

// Extract tasks from meeting notes
export async function extractTasksFromNotes(projectId, notes) {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AI.NOTES_TO_TASKS, {
      projectId,
      notes
    });
    return response.data;
  } catch (error) {
    console.error('[extractTasksFromNotes] Error:', error.message);
    throw error;
  }
}

// Process voice command
export async function processVoiceCommand(projectId, command) {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AI.VOICE_COMMAND, {
      projectId,
      command
    });
    return response.data;
  } catch (error) {
    console.error('[processVoiceCommand] Error:', error.message);
    throw error;
  }
}

// Generate dependency graph
export async function getDependencyGraph(projectId) {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.AI.DEPENDENCY(projectId));
    return response.data;
  } catch (error) {
    console.error('[getDependencyGraph] Error:', error.message);
    throw error;
  }
}

// Plan sprint allocation
export async function planSprint(projectId, capacityHours = 40) {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AI.SPRINT_PLAN, {
      projectId,
      capacityHours
    });
    return response.data;
  } catch (error) {
    console.error('[planSprint] Error:', error.message);
    throw error;
  }
}

// Start pomodoro session
export async function startPomodoro(taskId, minutes = 25) {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AI.POMODORO_START, {
      taskId,
      minutes
    });
    return response.data;
  } catch (error) {
    console.error('[startPomodoro] Error:', error.message);
    throw error;
  }
}

// Get pomodoro stats
export async function getPomodoroStats() {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.AI.POMODORO_STATS);
    return response.data;
  } catch (error) {
    console.error('[getPomodoroStats] Error:', error.message);
    throw error;
  }
}

// Get leaderboard
export async function getLeaderboard() {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.AI.LEADERBOARD);
    return response.data;
  } catch (error) {
    console.error('[getLeaderboard] Error:', error.message);
    throw error;
  }
}

// Check and award badges
export async function checkBadges() {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AI.BADGES);
    return response.data;
  } catch (error) {
    console.error('[checkBadges] Error:', error.message);
    throw error;
  }
}

// AI Chat with context awareness
export async function chatWithAI(message, projectId = null) {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AI.CHAT, {
      message,
      projectId
    });
    return response.data;
  } catch (error) {
    console.error('[chatWithAI] Error:', error.message);
    throw error;
  }
}

/**
 * F12 — NLP Task Creation
 * Creates a real task in the database from a natural language message.
 * @param {string} message - Natural language input (e.g. "Create login bug for Rahul due Friday")
 * @param {string} projectId - The active project ID
 * @returns {Promise<object>} - { success, data: { task, extracted, message, warning } }
 */
export async function createTaskFromNLP(message, projectId) {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AI.CREATE_TASK_NLP, {
      message,
      projectId
    });
    return response.data;
  } catch (error) {
    console.error('[createTaskFromNLP] Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Client-side task intent detection.
 * Mirrors the backend's detectTaskIntent logic for instant UI feedback.
 * @param {string} message
 * @returns {boolean}
 */
export function detectTaskIntent(message) {
  if (!message || message.trim().length < 5) return false;
  const lower = message.toLowerCase().trim();

  const taskKeywords = [
    'create task', 'create a task',
    'add task', 'add a task',
    'make task', 'make a task',
    'assign task', 'assign a task',
    'new task', 'create new task',
    'create bug', 'add bug',
    'create feature', 'add feature',
    'create issue', 'schedule task',
    'set up task', 'build task',
    'due friday', 'due monday', 'due tuesday', 'due wednesday',
    'due thursday', 'due saturday', 'due sunday', 'due tomorrow',
  ];

  for (const kw of taskKeywords) {
    if (lower.includes(kw)) return true;
  }

  if (/^(create|add|make|assign|build)\s+\w+/.test(lower)) return true;

  return false;
}

/**
 * F28 — Meeting Notes → Tasks AI
 * 1. Analyze meeting notes to extract task candidates
 */
export async function analyzeMeetingNotes(notes, projectId) {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AI.MEETING_ANALYZE, {
      notes,
      projectId
    });
    return response.data;
  } catch (error) {
    console.error('[analyzeMeetingNotes] Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * F28 — Meeting Notes → Tasks AI
 * 2. Bulk create tasks from extracted candidates
 */
export async function createMeetingTasks(tasks, projectId) {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AI.MEETING_CREATE_TASKS, {
      tasks,
      projectId
    });
    return response.data;
  } catch (error) {
    console.error('[createMeetingTasks] Error:', error.response?.data || error.message);
    throw error;
  }
}

export default {
  parseTask,
  prioritizeTask,
  generateStandup,
  getTaskRisk,
  getVelocityForecast,
  detectBottlenecks,
  getBurnoutAnalysis,
  getSentimentAnalysis,
  extractTasksFromNotes,
  processVoiceCommand,
  getDependencyGraph,
  planSprint,
  startPomodoro,
  getPomodoroStats,
  getLeaderboard,
  checkBadges,
  chatWithAI,
  createTaskFromNLP,
  detectTaskIntent,
  analyzeMeetingNotes,
  createMeetingTasks,
};
