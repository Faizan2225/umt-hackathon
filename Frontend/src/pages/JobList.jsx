import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import api from '../api/axios';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(()=>{ fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs');
      setJobs(res.data || []);
    } catch (err) {
      setJobs([
        { id:1, title:'Frontend Developer', company:'Tech Corp', location:'Remote', salary:70000, type:'part-time', description:'Join team', skills:['React'] },
        { id:2, title:'Backend Engineer', company:'Cloud Co', location:'Boston', salary:90000, type:'startup', description:'Build APIs', skills:['Node','Python'] }
      ]);
    } finally { setLoading(false); }
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
    <div className="min-h-screen relative">
      <div className="campus-dots"></div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Browse Opportunities</h1>
          <p className="text-gray-600">Find roles that match your skills.</p>
        </div>

        <div className="glass-card p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input className="glass-input" placeholder="Search" value={search} onChange={e=>setSearch(e.target.value)} />
            <input className="glass-input" placeholder="Location" value={locationFilter} onChange={e=>setLocationFilter(e.target.value)} />
            <input type="number" className="glass-input" placeholder="Min salary" value={salaryFilter} onChange={e=>setSalaryFilter(e.target.value)} />
            <select className="glass-input" value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
              <option value="">All types</option>
              <option value="part-time">Part-time</option>
              <option value="startup">Startup</option>
              <option value="academic-project">Academic Project</option>
              <option value="competition">Competition</option>
            </select>
          </div>
        </div>

        <div className="mb-6 text-gray-700">Found <strong className="text-indigo-600">{filtered.length}</strong> jobs</div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(j => <JobCard key={j.id||j._id} job={j} />)}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">No jobs found.</div>
        )}
      </div>
    </div>
  );
};

export default JobList;
