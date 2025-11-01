import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { applicationsAPI } from '../api/applications';
import { jobService } from '../services/jobService';
import { authService } from '../services/authService';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';

/**
 * Job Applicants Page
 * Shows all applicants for a specific job (Finder view)
 */
const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [users, setUsers] = useState({});

  useEffect(() => {
    loadData();
  }, [jobId, filter]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load job details
      const jobData = await jobService.getJobById(jobId);
      setJob(jobData);

      // Load applicants
      let appsData;
      if (filter === 'all') {
        appsData = await applicationsAPI.getJobApplicants(jobId);
      } else {
        appsData = await applicationsAPI.filterApplicants(jobId, filter);
      }

      setApplicants(appsData.applicants || appsData.results || []);

      // Load user details for each applicant
      const userIds = [...new Set((appsData.applicants || appsData.results || []).map(a => a.user_id))];
      const userMap = {};
      for (const userId of userIds) {
        try {
          // We can't directly fetch other users, so we'll use the data from applications
          // In a real app, you'd have a user lookup endpoint
          userMap[userId] = { id: userId, name: 'User', email: '' };
        } catch (error) {
          console.error('Failed to load user:', error);
        }
      }
      setUsers(userMap);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await applicationsAPI.updateApplicationStatus(applicationId, newStatus);
      await loadData(); // Reload to show updated status
    } catch (error) {
      console.error('Failed to update status:', error);
      alert(error.response?.data?.detail || 'Failed to update application status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="campus-dots"></div>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16 relative z-10">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link to="/dashboard/finder" className="text-indigo-600 hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            Applicants for {job?.title || 'Job'}
          </h1>
          <p className="text-lg text-gray-600">
            {applicants.length} {applicants.length === 1 ? 'applicant' : 'applicants'}
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {['all', 'Pending', 'Shortlisted', 'Accepted', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status === 'all' ? 'all' : status)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === status || (status === 'all' && filter === 'all')
                  ? 'glow-button text-white'
                  : 'bg-white/70 text-gray-700 hover:bg-white/90'
              }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        {/* Applicants List */}
        {applicants.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-600 text-lg">No applicants found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => (
              <motion.div
                key={app.id || app._id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {(users[app.user_id]?.name || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-900">
                          {users[app.user_id]?.name || 'Applicant'}
                        </p>
                        <p className="text-sm text-gray-500">User ID: {app.user_id}</p>
                      </div>
                    </div>

                    {app.proposal && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Proposal:</p>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{app.proposal}</p>
                      </div>
                    )}

                    {app.resume_url && (
                      <div className="mt-3">
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline text-sm"
                        >
                          📄 View Resume
                        </a>
                      </div>
                    )}

                    <p className="text-sm text-gray-500 mt-4">
                      Applied on: {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="ml-4 flex flex-col gap-3 items-end">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>

                    {app.status !== 'Accepted' && (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleStatusUpdate(app.id || app._id, 'Shortlisted')}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.id || app._id, 'Accepted')}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.id || app._id, 'Rejected')}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    <Link
                      to={`/chat/${app.job_id}`}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-200 transition-colors"
                    >
                      💬 Chat
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default JobApplicants;

