import { chatAPI } from '../api/chat';
import { WebSocketClient } from '../api/websocket';

/**
 * Chat Service
 * Handles real-time messaging via WebSockets
 * Uses FastAPI WebSocket endpoints
 */

let wsClient = null;

export const chatService = {
  // Initialize WebSocket connection for a room
  connect: (roomId, senderId, senderName, onMessage, onError) => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
    
    if (wsClient) {
      wsClient.disconnect();
    }

    wsClient = new WebSocketClient(wsUrl, roomId, onMessage, onError);
    wsClient.connect(senderId, senderName);
    
    return wsClient;
  },

  // Disconnect WebSocket
  disconnect: () => {
    if (wsClient) {
      wsClient.disconnect();
      wsClient = null;
    }
  },

  // Send message via WebSocket
  sendMessage: (message) => {
    if (wsClient) {
      wsClient.sendMessage(message);
    }
  },

  // Get chat history for a room (HTTP API)
  getMessages: async (roomId) => {
    try {
      const response = await chatAPI.getChatHistory(roomId);
      // Backend returns { room_id, total_messages, messages }
      return response.messages || [];
    } catch (error) {
      console.error('Failed to load messages:', error);
      return [];
    }
  },

  // Get all conversations from applications
  getConversations: async () => {
    try {
      // Get user's applications to generate conversation list
      const { applicationsAPI } = await import('../api/applications');
      const { jobService } = await import('./jobService');
      const { chatAPI } = await import('../api/chat');
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const conversations = [];
      
      if (user.role === 'seeker') {
        // For seekers: conversations are based on jobs they applied to
        const appsData = await applicationsAPI.getMyApplications();
        const applications = appsData.applications || [];
        
        for (const app of applications) {
          try {
            const job = await jobService.getJobById(app.job_id);
            // Get last message for preview
            try {
              const history = await chatAPI.getChatHistory(app.job_id);
              const lastMsg = history.messages?.[history.messages.length - 1];
              conversations.push({
                id: app.job_id,
                jobId: app.job_id,
                jobTitle: job.title,
                participants: [
                  { id: user.id || user._id, name: user.name },
                  { id: job.created_by, name: 'Employer' }
                ],
                lastMessage: lastMsg?.message || 'No messages yet',
                application: app
              });
            } catch {
              conversations.push({
                id: app.job_id,
                jobId: app.job_id,
                jobTitle: job.title,
                participants: [
                  { id: user.id || user._id, name: user.name },
                  { id: job.created_by, name: 'Employer' }
                ],
                lastMessage: 'No messages yet',
                application: app
              });
            }
          } catch (error) {
            console.error('Failed to load job:', error);
          }
        }
      } else if (user.role === 'finder') {
        // For finders: conversations are based on jobs they posted
        const allJobs = await jobService.getAllJobs();
        const myJobs = allJobs.filter(job => job.created_by === (user.id || user._id));
        
        for (const job of myJobs) {
          if (job.applicants && job.applicants.length > 0) {
            try {
              const history = await chatAPI.getChatHistory(job.id || job._id);
              const lastMsg = history.messages?.[history.messages.length - 1];
              
              // Create a conversation for each applicant
              for (const applicantId of job.applicants) {
                conversations.push({
                  id: job.id || job._id, // Use job_id as room_id for finders
                  jobId: job.id || job._id,
                  jobTitle: job.title,
                  participants: [
                    { id: user.id || user._id, name: user.name },
                    { id: applicantId, name: 'Applicant' }
                  ],
                  lastMessage: lastMsg?.message || 'No messages yet',
                  applicantId: applicantId
                });
              }
            } catch {
              // If no messages yet, still create conversation entry
              for (const applicantId of job.applicants) {
                conversations.push({
                  id: job.id || job._id,
                  jobId: job.id || job._id,
                  jobTitle: job.title,
                  participants: [
                    { id: user.id || user._id, name: user.name },
                    { id: applicantId, name: 'Applicant' }
                  ],
                  lastMessage: 'No messages yet',
                  applicantId: applicantId
                });
              }
            }
          }
        }
      }
      
      return conversations;
    } catch (error) {
      console.error('Failed to load conversations:', error);
      return [];
    }
  },

  // Listen for new messages (handled by WebSocketClient)
  onMessage: (callback) => {
    // This is handled by the WebSocketClient constructor
    // Use it when creating the connection
    return callback;
  },

  // Listen for typing indicators (not implemented in backend yet)
  onTyping: (callback) => {
    // Not implemented in FastAPI backend yet
    return callback;
  },

  // Send typing indicator (not implemented in backend yet)
  sendTyping: (receiverId, isTyping) => {
    // Not implemented in FastAPI backend yet
  },

  // Remove event listeners
  off: (event, callback) => {
    // WebSocketClient doesn't use event listeners in the same way
    // Messages are handled via callback
  },
};

