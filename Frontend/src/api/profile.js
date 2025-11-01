import api from './axios';

/**
 * Profile API endpoints
 * Matches backend routes in backend/routes/profile_routes.py
 */

export const profileAPI = {
  // Get my profile
  getMyProfile: async () => {
    const response = await api.get('/profile/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/profile/edit', profileData);
    return response.data;
  },
};
