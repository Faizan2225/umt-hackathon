import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import api from '../api/axios';
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
      const rec = await api.get('/jobs/recommended');
      setRecommended(rec.data || []);
    } catch {
      // Mock data
      setRecommended([
        {
          id: 1,
          title: 'Frontend Developer',
          company: 'Tech Corp',
          location: 'Remote',
          salary: 70000,
          description: 'Work on modern web applications using React and Tailwind.',
          skills: ['React', 'JavaScript', 'CSS'],
          postedDate: new Date().toISOString(),
        },
      ]);
    }

    const b = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarked(b);

    const apps = JSON.parse(localStorage.getItem('applications') || '[]').filter(
      (a) => a.userId === JSON.parse(localStorage.getItem('user')).id
    );
    setApplied(apps.map((a) => a.jobId));

    setLoading(false);
  };

  // Handle Apply button click
  const handleApply = (jobId) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const existingApps = JSON.parse(localStorage.getItem('applications') || '[]');

    if (!existingApps.some(a => a.jobId === jobId && a.userId === currentUser.id)) {
      const newApps = [
        ...existingApps,
        { jobId, userId: currentUser.id, date: new Date().toISOString() }
      ];
      localStorage.setItem('applications', JSON.stringify(newApps));
      setApplied(prev => [...prev, jobId]);
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
          <br></br>
          <p className="text-lg text-gray-600">
            Manage applications and explore new opportunities.
          </p>
        </motion.div>

        {/* Recommended Jobs */}
        <SectionWrapper title="Recommended Jobs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((j) => (
              <JobCard
                key={j.id || j._id}
                job={j}
                applied={applied.includes(j.id || j._id)}
                onApply={() => handleApply(j.id || j._id)}
              />
            ))}
          </div>
        </SectionWrapper>

        {/* Saved Jobs */}
        <SectionWrapper title="Saved Jobs">
          {bookmarked.length === 0 ? (
            <div className="glass-card p-10 text-center text-gray-600">
              You have no saved jobs yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended
                .filter((j) => bookmarked.includes(j.id || j._id))
                .map((j) => (
                  <JobCard
                    key={j.id || j._id}
                    job={j}
                    applied={applied.includes(j.id || j._id)}
                    onApply={() => handleApply(j.id || j._id)}
                  />
                ))}
            </div>
          )}
        </SectionWrapper>
      </main>
    </div>
  );
};

export default DashboardSeeker;
