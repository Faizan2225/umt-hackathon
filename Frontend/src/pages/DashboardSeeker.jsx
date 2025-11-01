import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import { jobService } from '../services/jobService';
import { applicationsAPI } from '../api/applications';
import { motion } from 'framer-motion';

const DashboardSeeker = () => {
  const [user, setUser] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [applied, setApplied] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(u));
    const ar = localStorage.getItem('activeRole') || JSON.parse(u).role;
    if (ar !== 'seeker') navigate('/dashboard/finder');
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get recommended jobs
      const rec = await jobService.getRecommendedJobs();
      setRecommended(rec || []);

      // Get my applications
      const appsData = await applicationsAPI.getMyApplications();
      const apps = appsData.applications || [];
      setApplications(apps);
      setApplied(apps.map((a) => a.job_id));
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setRecommended([]);
    }

    const b = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarked(b);

    setLoading(false);
  };

  // Handle Apply button click
  const handleApply = async ({ jobId, proposal, resumeFile }) => {
    try {
      let resumeUrl = null;
      
      // Upload resume if provided
      if (resumeFile) {
        try {
          const { uploadAPI } = await import('../api/upload');
          const uploadResult = await uploadAPI.uploadResume(resumeFile);
          resumeUrl = uploadResult.path;
        } catch (uploadError) {
          console.error('Failed to upload resume:', uploadError);
          // Continue with application even if resume upload fails
        }
      }

      // Submit application
      await jobService.applyToJob(jobId, {
        proposal: proposal || undefined,
        resume_url: resumeUrl || undefined
      });
      
      setApplied(prev => [...prev, jobId]);
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Failed to apply:', err);
      alert(err.response?.data?.detail || 'Failed to submit application');
      throw err;
    }
  };

  if (loading) return <Loader />;

  const SectionWrapper = ({ title, children }) => (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mb-12"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>
      {children}
    </motion.section>
  );

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="campus-dots"></div>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16 relative z-10">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Welcome back, <span className="text-indigo-600">{user?.name || 'Seeker'}</span>
          </h1>
          <p className="text-lg text-gray-600">
            Manage applications and explore new opportunities.
          </p>
        </motion.div>

        {/* Recommended Jobs */}
        <SectionWrapper title="Recommended Jobs">
          {recommended.length === 0 ? (
            <div className="glass-card p-10 text-center text-gray-600">
              No recommended jobs yet. Complete your profile to get personalized recommendations.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((j) => (
                <JobCard
                  key={j.id || j._id}
                  job={j}
                  applied={applied.includes(j.id || j._id)}
                  onApply={handleApply}
                />
              ))}
            </div>
          )}
        </SectionWrapper>

        {/* My Applications */}
        <SectionWrapper title="My Applications">
          <div className="flex justify-between items-center mb-4">
            <Link
              to="/applications"
              className="text-indigo-600 hover:text-purple-600 font-semibold"
            >
              View All Applications →
            </Link>
            <Link
              to="/chat"
              className="text-indigo-600 hover:text-purple-600 font-semibold"
            >
              💬 View Messages
            </Link>
          </div>
          {applied.length === 0 ? (
            <div className="glass-card p-10 text-center text-gray-600">
              You haven't applied to any jobs yet. Browse jobs and apply!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.slice(0, 3).map((app) => {
                const job = recommended.find(j => (j.id || j._id) === app.job_id);
                if (!job) return null;
                return (
                  <div key={app.id || app._id} className="glass-card p-6 rounded-2xl">
                    <Link to={`/jobs/${app.job_id}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{job.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-3">{job.description?.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                        app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status}
                      </span>
                      <Link
                        to={`/chat/${app.job_id}`}
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        💬 Chat
                      </Link>
                    </div>
                  </div>
                );
              })}
              {applications.length > 3 && (
                <Link
                  to="/applications"
                  className="glass-card p-6 rounded-2xl text-center hover:bg-indigo-50 transition-colors flex items-center justify-center"
                >
                  <p className="text-gray-700 font-semibold">
                    View {applications.length - 3} more applications →
                  </p>
                </Link>
              )}
            </div>
          )}
        </SectionWrapper>
      </main>
    </div>
  );
};

export default DashboardSeeker;
