import api from './axios';

/**
 * Authentication API endpoints
 * Matches backend routes in backend/routes/auth_routes.py
 */

export const authAPI = {
  // Register new user
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user profile
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Switch role (seeker <-> finder)
  switchRole: async () => {
    const response = await api.patch('/auth/switch-role');
    return response.data;
  },

  // Request email verification
  requestVerification: async (email) => {
    const response = await api.post('/auth/request-verification', { email });
    return response.data;
  },

  // Verify email with token
  verifyEmail: async (token) => {
    const response = await api.get('/auth/verify', { params: { token } });
    return response.data;
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token, new_password) => {
    const response = await api.post('/auth/reset-password', { 
      token, 
      new_password 
    });
    return response.data;
  },

  // Get Google OAuth login URL
  getGoogleLoginUrl: async () => {
    const response = await api.get('/auth/google/login');
    return response.data;
  },

  // Handle Google OAuth callback
  googleCallback: async (code) => {
    const response = await api.get('/auth/google/callback', { params: { code } });
    return response.data;
  },
};
