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
      className="mb-14 sm:mb-16"
    >
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent"></div>
      </div>
      {children}
    </motion.section>
  );

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="campus-dots"></div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-16 relative z-10">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-14 sm:mb-16 text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Welcome back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{user?.name || 'Seeker'}</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Manage applications and explore new opportunities.
          </p>
        </motion.div>

        {/* Recommended Jobs */}
        <SectionWrapper title="⭐ Recommended Jobs">
          {recommended.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 sm:p-16 text-center rounded-2xl border border-white/50"
            >
              <div className="text-5xl mb-4">📋</div>
              <p className="text-lg font-semibold text-gray-700 mb-2">No recommendations yet</p>
              <p className="text-gray-600">Complete your profile to get personalized job recommendations.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
        <SectionWrapper title="📝 My Applications">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <Link
              to="/applications"
              className="text-indigo-600 hover:text-purple-600 font-semibold text-sm sm:text-base transition-colors flex items-center gap-2 group"
            >
              View All Applications
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/chat"
              className="px-4 py-2 rounded-xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              💬 View Messages
            </Link>
          </div>
          {applied.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 sm:p-16 text-center rounded-2xl border border-white/50"
            >
              <div className="text-5xl mb-4">📝</div>
              <p className="text-lg font-semibold text-gray-700 mb-2">No applications yet</p>
              <p className="text-gray-600 mb-6">Browse jobs and apply to get started!</p>
              <Link
                to="/jobs"
                className="inline-block px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Browse Jobs
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {applications.slice(0, 3).map((app, idx) => {
                const job = recommended.find(j => (j.id || j._id) === app.job_id);
                if (!job) return null;
                return (
                  <motion.div
                    key={app.id || app._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card p-6 sm:p-8 rounded-2xl border border-white/50 hover:shadow-xl transition-all duration-300 group"
                  >
                    <Link to={`/jobs/${app.job_id}`} className="block mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {job.description?.substring(0, 100)}...
                      </p>
                    </Link>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200/60">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        app.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                        app.status === 'Shortlisted' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status}
                      </span>
                      <Link
                        to={`/chat/${app.job_id}`}
                        className="px-4 py-1.5 rounded-lg text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                      >
                        💬 Chat
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
              {applications.length > 3 && (
                <Link
                  to="/applications"
                  className="glass-card p-6 sm:p-8 rounded-2xl text-center hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center group border border-white/50 hover:border-indigo-200 hover:shadow-lg"
                >
                  <p className="text-gray-700 font-semibold group-hover:text-indigo-600 transition-colors">
                    View {applications.length - 3} more applications
                    <span className="block mt-2 text-2xl group-hover:translate-x-2 transition-transform inline-block">→</span>
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
