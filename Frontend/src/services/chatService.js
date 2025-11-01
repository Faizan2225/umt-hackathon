import io from 'socket.io-client';

/**
 * Chat Service
 * Handles real-time messaging via WebSockets
 */

let socket = null;

export const chatService = {
  // Initialize socket connection
  connect: (userId, token) => {
    if (socket?.connected) {
      return socket;
    }

    socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to chat server');
      socket.emit('join', userId);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    return socket;
  },

  // Disconnect socket
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  // Send message
  sendMessage: (receiverId, message, jobId = null) => {
    if (socket) {
      socket.emit('send-message', {
        receiverId,
        message,
        jobId,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // Get conversation messages
  getMessages: async (conversationId) => {
    // This would be an HTTP API call to get historical messages
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat/conversations/${conversationId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.json();
  },

  // Get all conversations
  getConversations: async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat/conversations`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.json();
  },

  // Listen for new messages
  onMessage: (callback) => {
    if (socket) {
      socket.on('receive-message', callback);
    }
  },

  // Listen for typing indicators
  onTyping: (callback) => {
    if (socket) {
      socket.on('typing', callback);
    }
  },

  // Send typing indicator
  sendTyping: (receiverId, isTyping) => {
    if (socket) {
      socket.emit('typing', { receiverId, isTyping });
    }
  },

  // Remove event listeners
  off: (event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  },
};

