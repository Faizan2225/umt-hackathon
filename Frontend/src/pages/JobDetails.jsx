import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import api from '../api/axios';

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
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      setJob({
        id,
        title:'Frontend Developer',
        company:'Tech Corp',
        location:'Remote',
        salary:70000,
        description:'Short description',
        fullDescription:'Full details...',
        skills:['React','CSS'],
        postedDate: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
      const apps = JSON.parse(localStorage.getItem('applications') || '[]');
      setApplied(apps.some(a => a.jobId === id && a.userId === (user?.id)));
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login', { state: { from: `/jobs/${id}` }});
    try {
      await api.post(`/jobs/${id}/apply`, { proposal, resume: resume?.name });
      const saved = JSON.parse(localStorage.getItem('applications') || '[]');
      saved.push({ jobId: id, userId: user.id, status: 'pending', proposal, appliedAt: new Date().toISOString() });
      localStorage.setItem('applications', JSON.stringify(saved));
      setApplied(true);
      setShowApply(false);
      alert('Applied successfully');
    } catch (err) {
      const saved = JSON.parse(localStorage.getItem('applications') || '[]');
      saved.push({ jobId: id, userId: user?.id, status: 'pending', proposal, appliedAt: new Date().toISOString() });
      localStorage.setItem('applications', JSON.stringify(saved));
      setApplied(true);
      setShowApply(false);
      alert('Applied (mock)');
    }
  };

  if (loading) return <Loader />;
  if (!job) return <div className="min-h-screen flex items-center justify-center">Job not found</div>;

  return (
    <div className="min-h-screen relative">
      <div className="campus-dots"></div>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link to="/jobs" className="text-indigo-600 hover:underline mb-4 inline-block">← Back to jobs</Link>

        <div className="glass-card p-6 mb-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <p className="text-gray-600">{job.company} • {job.location}</p>
              {job.salary && <p className="mt-2 font-semibold text-indigo-600">${job.salary.toLocaleString()}</p>}
            </div>
            <div>
              {!applied ? (
                <button onClick={() => setShowApply(true)} className="glow-button px-4 py-2">Apply Now</button>
              ) : (
                <button disabled className="px-4 py-2 bg-green-600 text-white rounded-md">✓ Applied</button>
              )}
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{job.fullDescription || job.description}</p>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <h4 className="font-semibold mb-2">Skills</h4>
              <div className="flex gap-2 flex-wrap">
                {job.skills?.map((s,i)=><span key={i} className="px-2 py-1 bg-white/60 rounded-full text-xs text-indigo-700">{s}</span>)}
              </div>
            </div>
            <div className="glass-card p-4">
              <h4 className="font-semibold mb-2">Details</h4>
              <p className="text-sm text-gray-600">Posted: {new Date(job.postedDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

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
