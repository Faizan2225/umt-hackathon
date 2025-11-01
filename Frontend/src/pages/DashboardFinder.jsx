import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCardFinder from '../components/JobCardFinder';
import Loader from '../components/Loader';
import { jobService } from '../services/jobService';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';

const DashboardFinder = () => {
  const [user, setUser] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    skills: '',
    type: 'part-time',
    status: 'active',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      const u = localStorage.getItem('user');
      if (!u) {
        navigate('/login');
        return;
      }

      try {
        // Always fetch fresh user data from backend to ensure role is up-to-date
        const freshUser = await authService.getCurrentUser();
        setUser(freshUser);
        
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(freshUser));
        
        // Check actual user role from backend
        const userRole = freshUser.role;
        
        // If user role is not finder, redirect to seeker dashboard
        if (userRole !== 'finder') {
          navigate('/dashboard/seeker');
          return;
        }
        
        // User is a finder, fetch jobs
        fetchJobs();
      } catch (error) {
        console.error('Failed to load user data:', error);
        // Fallback to localStorage data
        const parsedUser = JSON.parse(u);
        setUser(parsedUser);
        
        if (parsedUser.role !== 'finder') {
          navigate('/dashboard/seeker');
          return;
        }
        fetchJobs();
      }
    };

    loadUserData();

    // Listen for auth changes (role switches)
    const handleAuthChange = () => {
      loadUserData();
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, [navigate]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Get all jobs and filter by current user (finder's jobs)
      const allJobs = await jobService.getAllJobs();
      const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
      // Filter jobs created by current user
      const userId = currentUser.id || currentUser._id;
      const myJobs = allJobs.filter(job => job.created_by === userId || job.created_by === String(userId));
      setMyJobs(myJobs);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setMyJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setNewJob({ ...job, skills: (job.skills || []).join(', ') });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // ALWAYS fetch fresh user data from backend before checking role
    let currentUser;
    try {
      currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
    } catch (error) {
      console.error('Failed to get user data:', error);
      currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
    }
    
    // Check if user is actually a finder
    if (currentUser.role !== 'finder') {
      alert('Only finders can post jobs. Please switch to Finder mode first using the Finder button in the navbar.');
      return;
    }
    
    try {
      const payload = {
        title: newJob.title,
        description: newJob.description,
        tags: newJob.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingJob) {
        const jobId = editingJob.id || editingJob._id;
        await jobService.updateJob(jobId, payload);
        // Refresh jobs list
        await fetchJobs();
      } else {
        await jobService.createJob(payload);
        // Refresh jobs list
        await fetchJobs();
      }

      setShowForm(false);
      setEditingJob(null);
      setNewJob({
        title: '',
        company: '',
        location: '',
        salary: '',
        description: '',
        skills: '',
        type: 'part-time',
        status: 'active',
      });
    } catch (err) {
      console.error('Failed to save job:', err);
      alert(err.response?.data?.detail || 'Failed to save job');
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
            Welcome, <span className="text-indigo-600">{user?.name || 'Finder'}</span>
          </h1>
          <p className="text-lg text-gray-600">
            Post opportunities and manage your listings efficiently.
          </p>
        </motion.div>

        <div className="flex justify-end mb-8">
          <button
            onClick={async () => {
              // If closing form, just close it
              if (showForm) {
                setShowForm(false);
                setEditingJob(null);
                return;
              }
              
              // If opening form, refresh user data and check role first
              try {
                const freshUser = await authService.getCurrentUser();
                setUser(freshUser);
                localStorage.setItem('user', JSON.stringify(freshUser));
                
                if (freshUser.role !== 'finder') {
                  alert('Only finders can post jobs. Please switch to Finder mode first using the Finder button in the navbar.');
                  return;
                }
                
                // User is a finder, show the form
                setShowForm(true);
                setEditingJob(null);
              } catch (error) {
                console.error('Failed to refresh user data:', error);
                // Fallback check
                const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
                if (currentUser.role !== 'finder') {
                  alert('Only finders can post jobs. Please switch to Finder mode first using the Finder button in the navbar.');
                  return;
                }
                setShowForm(true);
                setEditingJob(null);
              }
            }}
            className="glow-button px-6 py-3 text-white rounded-xl"
          >
            {showForm ? 'Cancel' : '+ Create Job'}
          </button>
        </div>

        {showForm && (
          <SectionWrapper title={editingJob ? 'Edit Job' : 'Create Job'}>
            <form
              onSubmit={handleSave}
              className="glass-card p-8 rounded-2xl space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['title', 'company', 'location', 'salary'].map((field) => (
                  <input
                    key={field}
                    required
                    className="glass-input p-3"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={newJob[field]}
                    onChange={(e) =>
                      setNewJob({ ...newJob, [field]: e.target.value })
                    }
                  />
                ))}
              </div>
              <textarea
                className="glass-input w-full p-3"
                rows="4"
                placeholder="Description"
                value={newJob.description}
                onChange={(e) =>
                  setNewJob({ ...newJob, description: e.target.value })
                }
              />
              <input
                className="glass-input w-full p-3"
                placeholder="Skills (comma separated)"
                value={newJob.skills}
                onChange={(e) =>
                  setNewJob({ ...newJob, skills: e.target.value })
                }
              />
              <div className="flex justify-end">
                <button type="submit" className="glow-button px-6 py-3">
                  {editingJob ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </SectionWrapper>
        )}

        <SectionWrapper title="My Job Posts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myJobs.map((j) => (
              <JobCardFinder 
                key={j.id || j._id} 
                job={j} 
                onEdit={handleEdit}
                onDelete={async (jobId) => {
                  if (window.confirm('Are you sure you want to delete this job?')) {
                    try {
                      await jobService.deleteJob(jobId);
                      await fetchJobs();
                    } catch (error) {
                      alert(error.response?.data?.detail || 'Failed to delete job');
                    }
                  }
                }}
                onMarkFilled={async (jobId) => {
                  try {
                    await jobService.updateJob(jobId, { status: 'filled' });
                    await fetchJobs();
                  } catch (error) {
                    alert(error.response?.data?.detail || 'Failed to update job status');
                  }
                }}
              />
            ))}
          </div>
        </SectionWrapper>
      </main>
    </div>
  );
};

export default DashboardFinder;
