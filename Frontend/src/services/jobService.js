import { jobsAPI } from '../api/jobs';
import { applicationsAPI } from '../api/applications';

/**
 * Job Service
 * Handles all job-related API calls
 * Uses jobsAPI and applicationsAPI from api directory
 */

export const jobService = {
  // Get all jobs
  getAllJobs: async (filters = {}) => {
    if (Object.keys(filters).length > 0) {
      return await jobsAPI.filterJobs(filters);
    }
    return await jobsAPI.getAllJobs();
  },

  // Get job by ID
  getJobById: async (id) => {
    return await jobsAPI.getJobById(id);
  },

  // Create job post (finder only)
  createJob: async (jobData) => {
    // Backend expects: title, description, tags
    const payload = {
      title: jobData.title,
      description: jobData.description || jobData.fullDescription || '',
      tags: Array.isArray(jobData.tags) ? jobData.tags : (jobData.skills || '').split(',').map(s => s.trim()).filter(Boolean),
    };
    return await jobsAPI.createJob(payload);
  },

  // Update job post
  updateJob: async (id, jobData) => {
    const payload = {};
    if (jobData.title) payload.title = jobData.title;
    if (jobData.description) payload.description = jobData.description;
    if (jobData.tags || jobData.skills) {
      payload.tags = Array.isArray(jobData.tags) 
        ? jobData.tags 
        : (jobData.skills || '').split(',').map(s => s.trim()).filter(Boolean);
    }
    if (jobData.status) payload.status = jobData.status;
    return await jobsAPI.updateJob(id, payload);
  },

  // Delete job post
  deleteJob: async (id) => {
    return await jobsAPI.deleteJob(id);
  },

  // Get recommended jobs
  getRecommendedJobs: async () => {
    const response = await jobsAPI.getRecommendedJobs();
    // Backend returns { total_jobs, recommendations: [{ job, match_score }, ...] }
    // Extract jobs from recommendations
    if (response.recommendations && Array.isArray(response.recommendations)) {
      return response.recommendations.map(rec => rec.job || rec);
    }
    return response.recommendations || [];
  },

  // Apply to job (uses applications API)
  applyToJob: async (jobId, applicationData = {}) => {
    return await applicationsAPI.applyToJob(jobId, applicationData);
  },

  // Get job applicants (uses applications API)
  getApplicants: async (jobId) => {
    return await applicationsAPI.getJobApplicants(jobId);
  },

  // Update applicant status (uses applications API)
  updateApplicantStatus: async (applicationId, status) => {
    return await applicationsAPI.updateApplicationStatus(applicationId, status);
  },

  // Filter jobs
  filterJobs: async (filters) => {
    const response = await jobsAPI.filterJobs(filters);
    return response.results || response;
  },
};

