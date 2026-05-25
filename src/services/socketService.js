import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (typeof window === 'undefined') {
      return null;
    }

    if (this.socket?.connected) {
      return this.socket;
    }

    const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

    if (!authToken) {
      console.warn('Socket connection deferred: No authentication token found');
      return null;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token: authToken },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('%c[Socket] Connected:', 'color: #22c55e; font-weight: bold;', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('%c[Socket] Error:', 'color: #ef4444; font-weight: bold;', error.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('%c[Socket] Disconnected:', 'color: #f59e0b; font-weight: bold;', reason);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data, callback) {
    this.socket?.emit(event, data, callback);
  }

  on(event, callback) {
    this.socket?.on(event, callback);
  }

  off(event, callback) {
    this.socket?.off(event, callback);
  }

  joinProject(projectId, callback) {
    this.emit('join-project', projectId, callback);
  }

  leaveProject(projectId) {
    this.emit('leave-project', projectId);
  }

  onTaskCreated(callback) {
    this.on('task-created', callback);
  }

  onTaskUpdated(callback) {
    this.on('task-updated', callback);
  }

  onTaskDeleted(callback) {
    this.on('task-deleted', callback);
  }

  onMemberJoined(callback) {
    this.on('member-joined', callback);
  }

  onFileUploaded(callback) {
    this.on('file-uploaded', callback);
  }

  onFileUpdated(callback) {
    this.on('file-updated', callback);
  }

  onMessageSent(callback) {
    this.on('message-sent', callback);
  }

  sendMessage(message) {
    this.emit('send-message', message);
  }

  startTyping(projectId) {
    this.emit('typing', { projectId });
  }

  stopTyping(projectId) {
    this.emit('typing:stop', { projectId });
  }
}

const socketService = new SocketService();
export default socketService;
