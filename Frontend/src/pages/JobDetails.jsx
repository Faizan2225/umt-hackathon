import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import { jobService } from '../services/jobService';
import { uploadAPI } from '../api/upload';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [proposal, setProposal] = useState('');
  const [resume, setResume] = useState(null);
  const [user, setUser] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('user');
    setUser(u ? JSON.parse(u) : null);
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const jobData = await jobService.getJobById(id);
      setJob(jobData);
      
      // Check if already applied
      const { applicationsAPI } = await import('../api/applications');
      const appsData = await applicationsAPI.getMyApplications();
      const apps = appsData.applications || [];
      setApplied(apps.some(a => a.job_id === id));
    } catch (err) {
      console.error('Failed to fetch job:', err);
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login', { state: { from: `/jobs/${id}` }});
    
    try {
      let resumeUrl = null;
      
      // Upload resume if provided
      if (resume) {
        const uploadRes = await uploadAPI.uploadResume(resume);
        resumeUrl = uploadRes.path;
      }

      // Apply to job
      await jobService.applyToJob(id, {
        proposal,
        resume_url: resumeUrl,
      });

      setApplied(true);
      setShowApply(false);
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Failed to apply:', err);
      alert(err.response?.data?.detail || 'Failed to submit application');
    }
  };

  if (loading) return <Loader />;
  if (!job) return <div className="min-h-screen flex items-center justify-center">Job not found</div>;

  return (
    <div className="min-h-screen relative pt-20 pb-20">
      <div className="campus-dots"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-purple-600 mb-6 font-medium transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to jobs
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 sm:p-8 lg:p-10 mb-8 rounded-2xl border border-white/50 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-6">
            <div className="flex-1 space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">{job.title}</h1>
              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pt-2">
                <span className="flex items-center gap-1">
                  📅 Posted: {new Date(job.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  👁️ Views: {job.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  👥 Applicants: {job.applicants?.length || 0}
                </span>
              </div>
            </div>
            <div>
              {user && (
                <>
                  {user.role === 'seeker' ? (
                    !applied ? (
                      <button onClick={() => {
                        if (!user) {
                          navigate('/login', { state: { from: `/jobs/${id}` }});
                          return;
                        }
                        setShowApply(true);
                      }} className="glow-button px-4 py-2">Apply Now</button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button disabled className="px-4 py-2 bg-green-600 text-white rounded-md">✓ Applied</button>
                        <Link to="/applications" className="text-sm text-indigo-600 hover:underline text-center">
                          View Application Status
                        </Link>
                      </div>
                    )
                  ) : user.role === 'finder' && job.created_by === (user.id || user._id) ? (
                    <Link
                      to={`/job/${id}/applicants`}
                      className="glow-button px-4 py-2 text-center inline-block"
                    >
                      View Applicants ({job.applicants?.length || 0})
                    </Link>
                  ) : null}
                </>
              )}
              {!user && (
                <Link to="/login" className="glow-button px-4 py-2 text-center inline-block">
                  Login to Apply
                </Link>
              )}
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{job.fullDescription || job.description}</p>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <h4 className="font-semibold mb-2">Required Skills/Tags</h4>
              <div className="flex gap-2 flex-wrap">
                {job.tags?.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-white/60 rounded-full text-xs text-indigo-700">
                    {tag}
                  </span>
                ))}
                {(!job.tags || job.tags.length === 0) && (
                  <span className="text-xs text-gray-500">No tags specified</span>
                )}
              </div>
            </div>
            <div className="glass-card p-4">
              <h4 className="font-semibold mb-2">Job Status</h4>
              <p className={`text-sm font-semibold ${
                job.status === 'open' ? 'text-green-600' : 
                job.status === 'filled' ? 'text-gray-600' : 
                'text-yellow-600'
              }`}>
                {job.status?.charAt(0).toUpperCase() + job.status?.slice(1) || 'Open'}
              </p>
            </div>
          </div>
        </motion.div>

        {showApply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="glass-card p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Apply for {job.title}</h3>
                <button onClick={() => setShowApply(false)} className="text-gray-600">✕</button>
              </div>

              <form onSubmit={handleApply} className="space-y-4">
                <textarea required className="glass-input w-full" rows={5} placeholder="Write a short proposal" value={proposal} onChange={e=>setProposal(e.target.value)} />
                <input type="file" accept=".pdf,.doc" onChange={e=>setResume(e.target.files[0])} className="glass-input" />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowApply(false)} className="px-4 py-2 bg-gray-100 rounded-md">Cancel</button>
                  <button type="submit" className="glow-button px-4 py-2">Submit Application</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
