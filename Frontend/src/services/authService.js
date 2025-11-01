import api from '../api/axios';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  // Resend verification email
  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  // OAuth login (Google)
  googleLogin: async () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
  },

  // OAuth login (GitHub)
  githubLogin: async () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/github`;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // Logout (client-side only, server may invalidate token)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('activeRole');
    localStorage.removeItem('applications');
    localStorage.removeItem('bookmarks');
    window.dispatchEvent(new Event('auth-change'));
  },
};

