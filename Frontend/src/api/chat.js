import api from './axios';

/**
 * Chat API endpoints
 * Matches backend routes in backend/routes/chat_routes.py
 */

export const chatAPI = {
  // Get chat history for a room
  getChatHistory: async (roomId) => {
    const response = await api.get(`/chat/${roomId}`);
    return response.data;
  },
};
