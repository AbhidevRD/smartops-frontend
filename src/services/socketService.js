import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (this.socket) return this.socket;

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token || localStorage.getItem('token'),
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Chat methods
  sendMessage(message) {
    this.emit('message:send', message);
  }

  onMessage(callback) {
    this.on('message:receive', callback);
  }

  // Typing indicator
  startTyping(projectId) {
    this.emit('typing:start', { projectId });
  }

  stopTyping(projectId) {
    this.emit('typing:stop', { projectId });
  }

  onTyping(callback) {
    this.on('typing:indicator', callback);
  }

  // Dashboard updates
  onDashboardUpdate(callback) {
    this.on('dashboard:update', callback);
  }

  // Notification
  onNotification(callback) {
    this.on('notification:new', callback);
  }
}

const socketService = new SocketService();
export default socketService;
