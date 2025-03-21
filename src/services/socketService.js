import { io } from 'socket.io-client';

let socket;

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

const socketService = {
  connect: (token) => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        auth: {
          token
        }
      });
      
      socket.on('connect', () => {
        console.log('Socket connected');
      });
      
      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
    
    return socket;
  },
  
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      console.log('Socket disconnected');
    }
  },
  
  subscribeToAuditUpdates: (callback) => {
    if (!socket) return false;
    
    socket.on('audit_update', (data) => {
      callback(data);
    });
    
    return true;
  },
  
  subscribeToAuditCounters: (callback) => {
    if (!socket) return false;
    
    socket.on('audit_counters', (data) => {
      callback(data);
    });
    
    return true;
  },
  
  unsubscribeFromEvent: (eventName) => {
    if (!socket) return;
    
    socket.off(eventName);
  }
};

export default socketService;