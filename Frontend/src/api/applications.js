import api from './axios';

/**
 * Applications API endpoints
 * Matches backend routes in backend/routes/application_routes.py
 */

export const applicationsAPI = {
  // Apply to a job
  applyToJob: async (jobId, applicationData = {}) => {
    const params = new URLSearchParams();
    params.append('job_id', jobId);
    if (applicationData.proposal) params.append('proposal', applicationData.proposal);
    if (applicationData.resume_url) params.append('resume_url', applicationData.resume_url);

    // Backend expects POST /applications/?job_id=xxx&proposal=xxx&resume_url=xxx
    const response = await api.post(`/applications/?${params.toString()}`);
    return response.data;
  },

  // Get my applications (seeker)
  getMyApplications: async () => {
    const response = await api.get('/applications/my');
    return response.data;
  },

  // Get applicants for a job (finder)
  getJobApplicants: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  // Update application status (finder only)
  updateApplicationStatus: async (applicationId, status) => {
    const params = new URLSearchParams();
    params.append('status', status);
    const response = await api.patch(`/applications/${applicationId}?${params.toString()}`);
    return response.data;
  },

  // Filter applicants by status
  filterApplicants: async (jobId, status = null) => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/applications/job/${jobId}/filter${params}`);
    return response.data;
  },
};
