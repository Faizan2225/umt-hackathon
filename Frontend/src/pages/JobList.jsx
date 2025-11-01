import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import { jobService } from '../services/jobService';
import { applicationsAPI } from '../api/applications';
import { uploadAPI } from '../api/upload';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [appliedJobs, setAppliedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const jobs = await jobService.getAllJobs();
      setJobs(jobs || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setJobs([]);
    } finally { 
      setLoading(false); 
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // User not logged in
      
      const appsData = await applicationsAPI.getMyApplications();
      const applied = (appsData.applications || []).map(app => app.job_id);
      setAppliedJobs(applied);
    } catch (err) {
      // User might not be logged in, ignore error
      console.log('Could not fetch applications:', err);
    }
  };

  const handleApply = async ({ jobId, proposal, resumeFile }) => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { from: '/jobs' } });
        return;
      }

      let resumeUrl = null;
      
      // Upload resume if provided
      if (resumeFile) {
        try {
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

      // Update applied jobs list
      setAppliedJobs(prev => [...prev, jobId]);
      
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Failed to apply:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to submit application';
      alert(errorMsg);
      throw error;
    }
  };

  if (loading) return <Loader />;

  const filtered = jobs.filter(j => {
    const s = search.trim().toLowerCase();
    const matchesSearch = !s || j.title.toLowerCase().includes(s) || j.company.toLowerCase().includes(s) || (j.description||'').toLowerCase().includes(s);
    const matchesLoc = !locationFilter || (j.location||'').toLowerCase().includes(locationFilter.toLowerCase());
    const matchesSalary = !salaryFilter || (j.salary && Number(j.salary) >= Number(salaryFilter));
    const matchesType = !typeFilter || j.type === typeFilter;
    return matchesSearch && matchesLoc && matchesSalary && matchesType;
  });

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">
      <div className="campus-dots"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Browse <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Opportunities</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find roles that match your skills and interests
          </p>
        </motion.div>

        {/* Search/Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 sm:p-8 mb-10 rounded-2xl shadow-xl border border-white/50 backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1 mb-2">
                🔍 Search
              </label>
              <input
                className="glass-input w-full px-4 py-3.5 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                placeholder="Job title, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1 mb-2">
                📍 Location
              </label>
              <input
                className="glass-input w-full px-4 py-3.5 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                placeholder="City, State..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1 mb-2">
                💰 Min Salary
              </label>
              <input
                type="number"
                className="glass-input w-full px-4 py-3.5 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                placeholder="0"
                value={salaryFilter}
                onChange={(e) => setSalaryFilter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 ml-1 mb-2">
                🏷️ Job Type
              </label>
              <select
                className="glass-input w-full px-4 py-3.5 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer shadow-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All types</option>
                <option value="part-time">Part-time</option>
                <option value="startup">Startup</option>
                <option value="academic-project">Academic Project</option>
                <option value="competition">Competition</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-8 sm:mb-10 flex items-center justify-between">
          <p className="text-gray-700 text-lg font-medium">
            Found <strong className="text-indigo-600 font-bold text-2xl">{filtered.length}</strong> {filtered.length === 1 ? 'job' : 'jobs'}
          </p>
        </div>

        {/* Job Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {filtered.map((j, idx) => (
              <motion.div
                key={j.id || j._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <JobCard
                  job={j}
                  applied={appliedJobs.includes(j.id || j._id)}
                  onApply={handleApply}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 sm:p-16 text-center rounded-2xl"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl font-semibold text-gray-700 mb-2">No jobs found</p>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobList;
