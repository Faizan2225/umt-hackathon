import api from './axios';

/**
 * Jobs API endpoints
 * Matches backend routes in backend/routes/job_routes.py
 */

export const jobsAPI = {
  // Get all jobs
  getAllJobs: async () => {
    const response = await api.get('/jobs/');
    return response.data;
  },

  // Get job by ID
  getJobById: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  // Create new job (finder only)
  createJob: async (jobData) => {
    const response = await api.post('/jobs/', jobData);
    return response.data;
  },

  // Update job (creator only)
  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data;
  },

  // Delete job (creator only)
  deleteJob: async (jobId) => {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  },

  // Filter/search jobs
  filterJobs: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.title) params.append('title', filters.title);
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/jobs/filter/?${params.toString()}`);
    return response.data;
  },

  // Get recommended jobs for current user
  getRecommendedJobs: async () => {
    const response = await api.get('/jobs/recommended');
    return response.data;
  },
};
