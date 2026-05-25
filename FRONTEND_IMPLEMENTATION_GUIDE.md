# SmartOps Frontend - Page Implementation Guide

## Overview
This guide provides step-by-step implementation for connecting all frontend pages to the backend API.

---

## 1. Dashboard Page (`/src/app/dashboard/page.js`)

**What it should do:**
- Display user statistics (projects, tasks, completed tasks)
- Show recent activity
- Display quick action buttons

**Implementation:**

```jsx
'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { dashboardData, fetchDashboard, isLoading, error } = useAnalyticsStore();

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) return <AppLayout><div className="p-6">Loading...</div></AppLayout>;
  if (error) return <AppLayout><div className="p-6 text-red-600">{error}</div></AppLayout>;

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Projects" value={dashboardData?.stats?.totalProjects || 0} />
          <StatCard label="Total Tasks" value={dashboardData?.stats?.totalTasks || 0} />
          <StatCard label="Completed" value={dashboardData?.stats?.completed || 0} />
          <StatCard label="Pending" value={dashboardData?.stats?.pending || 0} />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader><h2 className="text-lg font-semibold">Recent Activity</h2></CardHeader>
          <CardBody>
            {dashboardData?.recentActivity?.length > 0 ? (
              <div className="space-y-2">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex justify-between py-2 border-b">
                    <span>{activity.action}</span>
                    <span className="text-sm text-gray-500">{new Date(activity.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent activity</p>
            )}
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
```

**Stores Used:** `useAnalyticsStore`

---

## 2. Projects Page (`/src/app/projects/page.js`)

**What it should do:**
- List all projects
- Create new project
- Edit/Delete projects
- Show project members count

**Key Features to Add:**
```jsx
// Add to existing Projects page:
import { useProjectStore } from '@/store/projectStore';
import Link from 'next/link';

export default function ProjectsPage() {
  const { projects, fetchProjects, createProject, updateProject, deleteProject, isLoading } = useProjectStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await createProject(formData);
    if (result.success) {
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
    }
  };

  // Add click handlers to project cards to navigate to project details
  // Use Link to `/projects/${project.id}` or router.push
}
```

**Stores Used:** `useProjectStore`

---

## 3. Tasks Page (`/src/app/tasks/page.js`)

**What it should do:**
- Display list of tasks with filters
- Create new task modal
- Edit/Delete tasks
- Update task status (drag-drop or buttons)

**Key Features to Add:**
```jsx
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';

// In component:
const { tasks, fetchTasks, createTask, updateTask, updateTaskStatus, deleteTask } = useTaskStore();
const { projects } = useProjectStore();

useEffect(() => {
  fetchTasks();
}, []);

const handleStatusChange = async (taskId, newStatus) => {
  await updateTaskStatus(taskId, newStatus);
};

// Make task rows clickable to show details
// Add inline editing for task properties
```

**Stores Used:** `useTaskStore`, `useProjectStore`

---

## 4. Chat Page (`/src/app/chat/page.js`)

**What it should do:**
- Display chat history for selected project
- Send messages in real-time
- Show unread count
- Socket.io integration for real-time updates

**Key Features to Add:**
```jsx
import { useChatStore } from '@/store/chatStore';
import { useProjectStore } from '@/store/projectStore';
import { useEffect, useState } from 'react';

// In component:
const { messages, sendMessage, fetchChatHistory } = useChatStore();
const { projects } = useProjectStore();
const [selectedProjectId, setSelectedProjectId] = useState(null);
const [newMessage, setNewMessage] = useState('');

useEffect(() => {
  if (selectedProjectId) {
    fetchChatHistory(selectedProjectId);
  }
}, [selectedProjectId]);

const handleSendMessage = async () => {
  if (newMessage.trim() && selectedProjectId) {
    await sendMessage(selectedProjectId, newMessage);
    setNewMessage('');
  }
};

// Add Socket.io listener for real-time messages
```

**Stores Used:** `useChatStore`, `useProjectStore`
**Real-time:** Socket.io integration needed

---

## 5. Notifications Page (`/src/app/notifications/page.js`)

**What it should do:**
- Display all notifications
- Mark as read
- Delete notifications
- Show unread count

**Key Features to Add:**
```jsx
import { useNotificationStore } from '@/store/notificationStore';

const { notifications, fetchNotifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();

useEffect(() => {
  fetchNotifications();
  // Poll every 30 seconds
  const interval = setInterval(fetchNotifications, 30000);
  return () => clearInterval(interval);
}, []);

const handleMarkAsRead = async (id) => {
  await markAsRead(id);
};
```

**Stores Used:** `useNotificationStore`

---

## 6. Focus/Pomodoro Page (`/src/app/focus/page.js`)

**What it should do:**
- Timer for Pomodoro sessions
- Track focus sessions
- Display stats
- Award badges

**Key Features to Add:**
```jsx
import { useFocusStore } from '@/store/focusStore';
import { useAIStore } from '@/store/aiStore';

const { startPomodoroSession, fetchPomodoroStats, stats } = useFocusStore();
const { checkBadges } = useAIStore();

const handleStartSession = async () => {
  const result = await startPomodoroSession(selectedTaskId, 25);
  if (result.success) {
    startTimer();
  }
};

const handleSessionComplete = async () => {
  // Check for badges
  await checkBadges();
  await fetchPomodoroStats();
};
```

**Stores Used:** `useFocusStore`, `useAIStore`

---

## 7. Leaderboard Page (`/src/app/leaderboard/page.js`)

**What it should do:**
- Display top performers
- Show badges
- Display user stats
- Show current user rank

**Key Features to Add:**
```jsx
import { useLeaderboardStore } from '@/store/leaderboardStore';

const { leaderboard, fetchLeaderboard, isLoading } = useLeaderboardStore();

useEffect(() => {
  fetchLeaderboard();
}, []);

// Replace mock data with real leaderboard data
// Display real user names and XP points
```

**Stores Used:** `useLeaderboardStore`

---

## 8. Analytics Page (`/src/app/analytics/page.js`)

**What it should do:**
- Display project velocity charts
- Burnout indicators
- Team sentiment analysis
- Risk predictions

**Key Features to Add:**
```jsx
import { useAIStore } from '@/store/aiStore';
import { useProjectStore } from '@/store/projectStore';

const aiStore = useAIStore();
const { projects } = useProjectStore();
const [selectedProjectId, setSelectedProjectId] = useState(null);

const loadAnalytics = async () => {
  if (selectedProjectId) {
    const velocity = await aiStore.forecastVelocity(selectedProjectId);
    const burnout = await aiStore.detectBurnout();
    const sentiment = await aiStore.analyzeSentiment();
    // Update state with results
  }
};

useEffect(() => {
  loadAnalytics();
}, [selectedProjectId]);
```

**Stores Used:** `useAIStore`, `useProjectStore`

---

## 9. Board/Kanban Page (`/src/app/board/page.js`)

**What it should do:**
- Display tasks in Kanban columns (Todo, In Progress, Review, Done)
- Drag-drop to update status
- Show task details

**Key Features to Add:**
```jsx
import { useTaskStore } from '@/store/taskStore';
import { useDragAndDrop } from 'some-dnd-library'; // e.g., react-beautiful-dnd

const { tasks, fetchTasks, updateTaskStatus } = useTaskStore();

useEffect(() => {
  fetchTasks();
}, []);

const handleDragEnd = async (result) => {
  const { source, destination, draggableId } = result;
  if (source.droppableId !== destination.droppableId) {
    const newStatus = destination.droppableId; // e.g., 'DONE'
    await updateTaskStatus(draggableId, newStatus);
  }
};
```

**Stores Used:** `useTaskStore`

---

## 10. Reports Page (`/src/app/reports/page.js`)

**What it should do:**
- Generate different report types
- Display report data
- Export functionality

**Key Features to Add:**
```jsx
import { useReportsStore } from '@/store/reportsStore';

const { reports, fetchReports, generateReport, isLoading } = useReportsStore();

useEffect(() => {
  fetchReports();
}, []);

const handleGenerateReport = async (reportType) => {
  const result = await generateReport(reportType, selectedProjectId);
  if (result.success) {
    // Show generated report
  }
};
```

**Stores Used:** `useReportsStore`

---

## 11. AI Assistant Page (`/src/app/ai/page.js`)

**What it should do:**
- Task parsing interface
- Priority analysis tool
- Sprint planning interface
- Voice command input

**Key Features to Add:**
```jsx
import { useAIStore } from '@/store/aiStore';

const aiStore = useAIStore();

const handleParseTask = async () => {
  const result = await aiStore.parseTask(userInput);
  if (result.success) {
    // Show parsed task and allow user to create it
  }
};

const handleAnalyzePriority = async () => {
  const result = await aiStore.analyzePriority(title, dueDays, workload);
  // Show priority analysis
};
```

**Stores Used:** `useAIStore`

---

## 12. Team Page (`/src/app/team/page.js`)

**What it should do:**
- Display team members
- Add/remove members
- Manage roles
- Show member stats

**Needs:**
- Need to create TeamStore with member management
- Get project members endpoint in backend
- Member role management

---

## 13. Settings Page (`/src/app/settings/page.js`)

**What it should do:**
- Update user profile
- Change preferences
- Notification settings
- Privacy settings

**Needs:**
- Need to create SettingsStore
- User profile update endpoint
- Preferences endpoint

---

## 14. Admin Email Page (`/src/app/admin-email/page.js`)

**What it should do:**
- Send emails (single/bulk)
- View email logs
- Template management

**Key Features to Add:**
```jsx
import { useAdminStore } from '@/store/adminStore'; // Create this

const handleSendEmail = async () => {
  const result = await axiosInstance.post(API_ENDPOINTS.ADMIN_EMAIL.SEND, {
    email,
    subject,
    message,
  });
  // Show success/error
};
```

**Stores Needed:** Admin store for email management

---

## Integration Checklist

### Phase 1: Core Pages (Priority HIGH)
- [ ] Dashboard - fetch stats & activity
- [ ] Projects - full CRUD + navigation
- [ ] Tasks - full CRUD + status updates
- [ ] Chat - send/receive messages
- [ ] Notifications - fetch & mark read

### Phase 2: Advanced Features (Priority HIGH)
- [ ] Board - drag-drop functionality
- [ ] Leaderboard - display rankings
- [ ] Focus - timer + tracking
- [ ] Analytics - display charts
- [ ] Reports - generate & display

### Phase 3: Optional Features (Priority MEDIUM)
- [ ] Team management
- [ ] Settings page
- [ ] Admin email
- [ ] Advanced AI features

### Phase 4: Real-time (Priority MEDIUM)
- [ ] Socket.io chat
- [ ] Live notifications
- [ ] Real-time activity feed
- [ ] Collaborative updates

---

## Common Patterns

### Loading State Management
```jsx
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
```

### Error Handling
```jsx
const result = await store.action();
if (result.success) {
  // Show success
} else {
  // Show error: result.error
}
```

### Form Submission
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await store.create(formData);
  if (result.success) {
    // Reset form and redirect
  }
};
```

---

## Missing Stores to Create

- [ ] Admin Store - for admin operations
- [ ] Settings Store - for user preferences
- [ ] Team Store - for team management
- [ ] Activity Store - for activity tracking

---

## Next Steps

1. Update all pages with store integrations
2. Add proper error handling and loading states
3. Implement Socket.io real-time features
4. Add input validation on frontend
5. Implement optimistic updates for better UX
6. Add success/error notifications
7. Test all workflows end-to-end

