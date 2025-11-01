import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCardFinder from '../components/JobCardFinder';
import Loader from '../components/Loader';
import api from '../api/axios';
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
    const u = localStorage.getItem('user');
    if (!u) return navigate('/login');
    const parsedUser = JSON.parse(u);
    setUser(parsedUser);
    const ar = localStorage.getItem('activeRole') || parsedUser.role;
    if (ar !== 'finder') navigate('/dashboard/seeker');
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs/my-jobs');
      setMyJobs(res.data || []);
    } catch {
      setMyJobs([
        {
          id: 1,
          title: 'Software Engineer',
          company: 'CampusConnect Labs',
          location: 'Remote',
          salary: 120000,
          description: 'Build scalable applications using React & Node.js.',
          skills: ['React', 'Node.js', 'MongoDB'],
          type: 'full-time',
          status: 'active',
          postedDate: new Date().toISOString(),
        },
      ]);
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

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      ...newJob,
      skills: newJob.skills.split(',').map((s) => s.trim()).filter(Boolean),
    };

    if (editingJob) {
      setMyJobs((m) =>
        m.map((j) => (j.id === editingJob.id ? { ...j, ...payload } : j))
      );
    } else {
      setMyJobs((m) => [
        {
          id: Date.now(),
          ...payload,
          postedDate: new Date().toISOString(),
          company: user?.name || 'Your Company',
        },
        ...m,
      ]);
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
            onClick={() => {
              setShowForm((s) => !s);
              setEditingJob(null);
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
              <JobCardFinder key={j.id} job={j} onEdit={handleEdit} />
            ))}
          </div>
        </SectionWrapper>
      </main>
    </div>
  );
};

export default DashboardFinder;
