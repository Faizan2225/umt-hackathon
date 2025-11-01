import api from '../api/axios';

/**
 * Job Service
 * Handles all job-related API calls
 */

export const jobService = {
  // Get all jobs
  getAllJobs: async (filters = {}) => {
    const response = await api.get('/jobs', { params: filters });
    return response.data;
  },

  // Get job by ID
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create job post
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update job post
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete job post
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Mark job as filled
  markAsFilled: async (id) => {
    const response = await api.patch(`/jobs/${id}/filled`);
    return response.data;
  },

  // Apply to job
  applyToJob: async (id, applicationData) => {
    const response = await api.post(`/jobs/${id}/apply`, applicationData);
    return response.data;
  },

  // Get job applicants
  getApplicants: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/applicants`);
    return response.data;
  },

  // Update applicant status
  updateApplicantStatus: async (jobId, applicantId, status) => {
    const response = await api.patch(`/jobs/${jobId}/applicants/${applicantId}`, { status });
    return response.data;
  },

  // Get job analytics
  getJobAnalytics: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/analytics`);
    return response.data;
  },

  // Get recommended jobs
  getRecommendedJobs: async () => {
    const response = await api.get('/jobs/recommended');
    return response.data;
  },

  // Bookmark job
  bookmarkJob: async (jobId) => {
    const response = await api.post(`/jobs/${jobId}/bookmark`);
    return response.data;
  },

  // Remove bookmark
  removeBookmark: async (jobId) => {
    const response = await api.delete(`/jobs/${jobId}/bookmark`);
    return response.data;
  },

  // Get bookmarked jobs
  getBookmarkedJobs: async () => {
    const response = await api.get('/jobs/bookmarked');
    return response.data;
  },

  // Get application status
  getApplicationStatus: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/application-status`);
    return response.data;
  },

  // Calculate match score
  getMatchScore: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/match-score`);
    return response.data;
  },
};

