import { authAPI } from '../api/auth';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 * Uses authAPI from api/auth.js
 */

export const authService = {
  // Register new user
  register: async (userData) => {
    return await authAPI.register(userData);
  },

  // Login user
  login: async (credentials) => {
    const response = await authAPI.login(credentials);
    // Backend returns { access_token, token_type }
    // Store token for future requests
    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
      // Get user profile
      const user = await authAPI.getMe();
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    return await authAPI.getMe();
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    return await authAPI.forgotPassword(email);
  },

  // Reset password with token
  resetPassword: async (token, new_password) => {
    return await authAPI.resetPassword(token, new_password);
  },

  // Verify email
  verifyEmail: async (token) => {
    return await authAPI.verifyEmail(token);
  },

  // Request verification email
  requestVerification: async (email) => {
    return await authAPI.requestVerification(email);
  },

  // Resend verification email (alias for requestVerification)
  resendVerification: async (email) => {
    return await authAPI.requestVerification(email);
  },

  // Switch role
  switchRole: async () => {
    const response = await authAPI.switchRole();
    // Update user in localStorage
    const user = await authAPI.getMe();
    localStorage.setItem('user', JSON.stringify(user));
    return response;
  },

  // OAuth login (Google)
  googleLogin: async () => {
    const response = await authAPI.getGoogleLoginUrl();
    // Redirect to Google OAuth
    window.location.href = response.url;
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

