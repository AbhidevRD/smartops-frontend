# Frontend Team Collaboration Implementation Guide

## Overview

This guide covers the frontend implementation of the Team Collaboration & Invitation System, including components, stores, and integration patterns.

## File Structure

```
frontend-smartops-main/src/
├── app/
│   ├── invite/
│   │   └── page.js              # Accept/reject invite page
│   └── projects/
│       └── [id]/
│           ├── page.js           # Project dashboard
│           └── members/
│               └── page.js       # Project members view
├── components/
│   ├── invite-modal.jsx          # Send invite modal
│   ├── project-members.jsx       # Members list & invites
│   └── ui/
│       └── dialog.jsx            # Base dialog component
├── lib/
│   └── api-endpoints.js          # API route constants
└── store/
    ├── authStore.js             # User auth state
    └── projectStore.js          # Project state (extend with members)
```

## Components

### 1. InvitePage (`/invite?token=...`)

**File**: `src/app/invite/page.js`

**Purpose**: Display and handle project invitations

**Key Features**:
- Automatic redirect to login if not authenticated
- Display project information from public endpoint
- Accept/reject button handling
- Redirect to project dashboard on accept

**Usage**:
```jsx
// Users access via email link
// http://localhost:3001/invite?token=crypto-token-here
```

**Implementation Details**:
- Uses `useSearchParams()` hook to get token from URL
- Calls `GET /api/invites/info` to get project details
- Handles token validation and expiry errors
- Shows user-friendly error messages

### 2. InviteModal Component

**File**: `src/components/invite-modal.jsx`

**Purpose**: Modal for sending project invitations

**Props**:
```javascript
{
  projectId: string,           // Project ID to invite to
  isOpen: boolean,             // Modal visibility state
  onClose: () => void,         // Close handler
  onInviteSent: () => void     // Callback after successful invite
}
```

**Usage**:
```jsx
import { InviteModal } from '@/components/invite-modal';
import { useState } from 'react';

export default function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Invite Member</button>
      <InviteModal
        projectId="proj-123"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onInviteSent={() => console.log('Invite sent!')}
      />
    </>
  );
}
```

**Features**:
- Email validation
- Loading state during submission
- Error/success messaging
- Auto-close on success
- Disabled state during loading

### 3. ProjectMembers Component

**File**: `src/components/project-members.jsx`

**Purpose**: Display project members and manage invitations

**Props**:
```javascript
{
  projectId: string,  // Project ID
  project: object     // Project details (with ownerId for ownership check)
}
```

**Usage**:
```jsx
import { ProjectMembers } from '@/components/project-members';

export default function ProjectPage({ params }) {
  const project = useProjectStore(state => state.project);

  return (
    <ProjectMembers
      projectId={params.id}
      project={project}
    />
  );
}
```

**Features**:
- Display active members with roles
- Show pending invites (owner only)
- Cancel pending invites (owner only)
- Invite new members button (owner only)
- Real-time updates via Socket.io

**Data Displayed**:
```
Members:
- Name, Email, Role (OWNER/MEMBER)
- Member count
- No members message

Pending Invites (Owner Only):
- Email, Status
- Created date
- Cancel button
- Invite count
```

## API Integration

### API Endpoints (in `lib/api-endpoints.js`)

```javascript
INVITES: {
  SEND: '/api/invites/send',
  ACCEPT: '/api/invites/accept',
  REJECT: '/api/invites/reject',
  INFO: '/api/invites/info',
  GET_PROJECT_INVITES: (projectId) => `/api/invites/project/${projectId}`,
  CANCEL: (inviteId) => `/api/invites/${inviteId}`,
},

MEMBERS: {
  GET_PROJECT_MEMBERS: (projectId) => `/api/projects/${projectId}/members`,
  ADD: (projectId) => `/api/projects/${projectId}/members`,
  UPDATE: (projectId, memberId) => `/api/projects/${projectId}/members/${memberId}`,
  REMOVE: (projectId, memberId) => `/api/projects/${projectId}/members/${memberId}`,
}
```

### Making API Calls

```javascript
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

// Send invite
const response = await axiosInstance.post(
  API_ENDPOINTS.INVITES.SEND,
  { email, projectId }
);

// Accept invite (authenticated)
const response = await axiosInstance.post(
  API_ENDPOINTS.INVITES.ACCEPT,
  { token }
);

// Get invite info (no auth required)
const response = await axiosInstance.get(
  API_ENDPOINTS.INVITES.INFO,
  { params: { token } }
);

// Get project members
const response = await axiosInstance.get(
  API_ENDPOINTS.MEMBERS.GET_PROJECT_MEMBERS(projectId)
);

// Get project invites (owner only)
const response = await axiosInstance.get(
  API_ENDPOINTS.INVITES.GET_PROJECT_INVITES(projectId)
);

// Cancel invite (owner only)
await axiosInstance.delete(
  API_ENDPOINTS.INVITES.CANCEL(inviteId)
);
```

## State Management (Zustand)

### AuthStore Integration

```javascript
// In authStore.js, the user object contains:
{
  id: string,
  email: string,
  name: string,
  role: string
}

// Usage:
const { user, isAuthenticated } = useAuthStore();

if (user?.id === project.ownerId) {
  // User is project owner - show invite options
}
```

### ProjectStore Extension

```javascript
// Extend projectStore.js to track members and invites
const useProjectStore = create((set) => ({
  project: null,
  members: [],
  invites: [],
  
  setProject: (project) => set({ project }),
  setMembers: (members) => set({ members }),
  setInvites: (invites) => set({ invites }),
  
  // Add member from successful invite acceptance
  addMember: (member) => set((state) => ({
    members: [...state.members, member]
  })),
  
  // Remove invite from pending list
  removePendingInvite: (inviteId) => set((state) => ({
    invites: state.invites.filter(i => i.id !== inviteId)
  }))
}));
```

## Socket.io Integration

### Real-time Member Updates

```javascript
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

// Join project room
socket.emit('join-project', { projectId });

// Listen for new members
socket.on('member-added', (data) => {
  console.log('New member added:', data.member);
  // Update UI with new member
  useProjectStore.setState(state => ({
    members: [...state.members, data.member]
  }));
});

// Listen for new invites
socket.on('invite-sent', (data) => {
  console.log('Invite sent to:', data.email);
  // Refresh invite list
});

// Listen for canceled invites
socket.on('invite-canceled', (data) => {
  console.log('Invite canceled for:', data.email);
  // Update pending invites list
});
```

## Page Implementations

### Invite Page (`/invite/page.js`)

```jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const [inviteInfo, setInviteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/invite?token=${token}`);
      return;
    }

    fetchInviteInfo();
  }, [token, isAuthenticated]);

  const fetchInviteInfo = async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.INVITES.INFO,
        { params: { token } }
      );
      setInviteInfo(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load invite');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.INVITES.ACCEPT,
        { token }
      );
      router.push(`/projects/${response.data.projectId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to accept invite');
    }
  };

  const handleReject = async () => {
    try {
      await axiosInstance.post(
        API_ENDPOINTS.INVITES.REJECT,
        { token }
      );
      router.push('/projects');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject invite');
    }
  };

  // Return UI with loading, error, and success states
}
```

### Project Members Page

```jsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ProjectMembers } from '@/components/project-members';

export default function ProjectMembersPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const [project, setProject] = useState(null);

  useEffect(() => {
    // Fetch project details
    // Check if user is owner
  }, [params.id]);

  if (!project) return <div>Loading...</div>;

  return (
    <ProjectMembers
      projectId={params.id}
      project={project}
    />
  );
}
```

## Error Handling

### Common Errors

```javascript
// Invalid email format
{
  status: 400,
  data: { error: 'Invalid email format' }
}

// User already a member
{
  status: 400,
  data: { error: 'User is already a member of this project' }
}

// Duplicate pending invite
{
  status: 400,
  data: { error: 'Invite already sent to this email for this project' }
}

// Not project owner
{
  status: 403,
  data: { error: 'Only project owner can invite members' }
}

// Invite expired
{
  status: 400,
  data: { error: 'Invite has expired' }
}

// Email mismatch
{
  status: 403,
  data: { error: 'You can only accept invites sent to your email address' }
}
```

### Error UI Pattern

```jsx
{error && (
  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
    {error}
  </div>
)}
```

## UI Components

### Button States

```jsx
<button
  onClick={handleSubmit}
  disabled={isLoading}
  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
>
  {isLoading ? 'Processing...' : 'Send Invite'}
</button>
```

### Status Badges

```jsx
// Role badges
<span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
  OWNER
</span>

// Invite status badges
<span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">
  PENDING
</span>
```

## Testing

### Test User Flows

1. **Send Invite Flow**
   - Login as project owner
   - Navigate to project members
   - Click "Invite Member"
   - Enter email and submit
   - Verify success message

2. **Accept Invite Flow**
   - Get invite email
   - Click invite link
   - Redirect to login (if needed)
   - Accept invitation
   - Verify redirect to project

3. **Reject Invite Flow**
   - Get invite email
   - Click invite link
   - Decline invitation
   - Verify redirect to projects list

4. **Real-time Updates**
   - Open project members in two tabs
   - Send invite in one tab
   - Verify pending invites appear in other tab

## Performance Optimization

### Memoization

```jsx
// Memoize components to prevent unnecessary re-renders
export const ProjectMembers = memo(function ProjectMembers({ projectId, project }) {
  // Component code
});

export const InviteModal = memo(function InviteModal({ isOpen, onClose }) {
  // Component code
});
```

### Lazy Loading

```jsx
// Lazy load members page
const ProjectMembers = dynamic(
  () => import('@/components/project-members'),
  { loading: () => <p>Loading...</p> }
);
```

### Caching

```javascript
// Cache project members list with SWR
import useSWR from 'swr';

const { data: members } = useSWR(
  projectId ? `projects/${projectId}/members` : null,
  fetcher,
  { revalidateOnFocus: false }
);
```

## Accessibility

### ARIA Labels

```jsx
<button
  onClick={handleInvite}
  aria-label="Send invite to new team member"
>
  Invite Member
</button>

<input
  aria-label="Email address for invitation"
  placeholder="user@example.com"
/>
```

### Keyboard Navigation

```jsx
<div role="dialog" aria-labelledby="invite-modal-title">
  <h2 id="invite-modal-title">Invite Team Member</h2>
  {/* Form fields */}
</div>
```

## Deployment Checklist

- [ ] Update `.env.local` with API endpoints
- [ ] Configure Socket.io connection URL
- [ ] Test invite flow end-to-end
- [ ] Verify email service is operational
- [ ] Check error handling and messages
- [ ] Test on mobile devices
- [ ] Verify accessibility features
- [ ] Performance test with multiple users
- [ ] Check security of token handling
- [ ] Validate form inputs on client and server

## Troubleshooting

### Invite Link Not Working
- Check token in URL is complete
- Verify user is logged in
- Check browser console for errors
- Ensure FRONTEND_URL is correctly configured

### Emails Not Received
- Check backend logs for email service errors
- Verify RESEND_API_KEY is configured
- Check email bouncing (spam filter)
- See EmailLog table for delivery status

### Real-time Updates Not Working
- Verify Socket.io connection is established
- Check project room is joined correctly
- Verify event names match backend

### Members Not Loading
- Check API endpoint configuration
- Verify authentication token is sent
- Check network tab for API errors
- Verify user has project access

## Support

For issues or questions about the frontend implementation, contact the development team.
