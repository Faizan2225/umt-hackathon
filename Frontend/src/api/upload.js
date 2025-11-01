import api from './axios';

/**
 * Upload API endpoints
 * Matches backend routes in backend/routes/upload_routes.py
 */

export const uploadAPI = {
  // Upload resume
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload resume and extract skills
  uploadResumeAndExtractSkills: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload/resume/skills', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
