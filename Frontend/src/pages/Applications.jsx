import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { applicationsAPI } from '../api/applications';
import { jobService } from '../services/jobService';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';

/**
 * Applications Page
 * Shows all applications for seekers or applicants for finders
 */
const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(u));
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationsAPI.getMyApplications();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Failed to load applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
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

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

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
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            My Applications
          </h1>
          <p className="text-lg text-gray-600">Track the status of your job applications</p>
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

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-600 text-lg">No applications found</p>
            <Link to="/jobs" className="text-indigo-600 hover:underline mt-4 inline-block">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <ApplicationList applications={filteredApplications} getStatusColor={getStatusColor} />
        )}
      </main>
    </div>
  );
};

const ApplicationList = ({ applications, getStatusColor }) => {
  const [jobsMap, setJobsMap] = useState({});
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      const jobs = {};
      for (const app of applications) {
        try {
          const job = await jobService.getJobById(app.job_id);
          jobs[app.job_id] = job;
        } catch (error) {
          console.error('Failed to load job:', error);
        }
      }
      setJobsMap(jobs);
      setLoadingJobs(false);
    };

    loadJobs();
  }, [applications]);

  if (loadingJobs) {
    return <div className="text-center py-8">Loading application details...</div>;
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => {
        const job = jobsMap[app.job_id];
        
        return (
          <motion.div
            key={app.id || app._id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {job ? (
                  <>
                    <Link
                      to={`/jobs/${app.job_id}`}
                      className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors"
                    >
                      {job.title}
                    </Link>
                    <p className="text-gray-600 mt-1">{job.description?.substring(0, 150)}...</p>
                  </>
                ) : (
                  <div>
                    <p className="text-xl font-bold text-gray-900">Job ID: {app.job_id}</p>
                    <p className="text-gray-600 mt-1">Job details unavailable</p>
                  </div>
                )}
                
                {app.proposal && (
                  <p className="text-gray-700 mt-3 italic">"{app.proposal.substring(0, 100)}..."</p>
                )}
                
                <p className="text-sm text-gray-500 mt-3">
                  Applied on: {new Date(app.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="ml-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Applications;

