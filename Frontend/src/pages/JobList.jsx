import { useState, useEffect } from 'react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';

/**
 * Job List Page
 * Modern job browsing with enhanced search, filters, and card animations
 * - Enhanced search bar with gradient accents
 * - Better filter cards with hover effects
 * - Improved job card grid with animations
 */
const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterSalary, setFilterSalary] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API endpoint when backend is ready
      const response = await api.get('/jobs');
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Mock data for development (using placeholder API structure)
      setJobs(getMockJobs());
    } finally {
      setLoading(false);
    }
  };

  // Mock data function (remove when backend is ready)
  const getMockJobs = () => {
    return [
      {
        id: 1,
        title: 'Frontend Developer',
        company: 'Tech Corp',
        location: 'Remote',
        salary: 70000,
        description: 'We are looking for an experienced frontend developer to join our team. You will work on building modern web applications using React and modern JavaScript frameworks.',
        skills: ['React', 'JavaScript', 'CSS', 'HTML'],
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        title: 'Full Stack Engineer',
        company: 'StartupXYZ',
        location: 'San Francisco, CA',
        salary: 90000,
        description: 'Join our growing startup as a full stack engineer. You will work on both frontend and backend systems, helping to scale our platform.',
        skills: ['React', 'Node.js', 'MongoDB', 'Express'],
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        title: 'UI/UX Designer',
        company: 'Design Studio',
        location: 'New York, NY',
        salary: 75000,
        description: 'We are seeking a creative UI/UX designer to help shape our product experiences. You will work closely with engineers and product managers.',
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 4,
        title: 'Backend Developer',
        company: 'Cloud Services Inc',
        location: 'Remote',
        salary: 85000,
        description: 'Looking for a backend developer with experience in microservices architecture. You will work on API development and database design.',
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 5,
        title: 'Data Scientist',
        company: 'Analytics Pro',
        location: 'Boston, MA',
        salary: 100000,
        description: 'Join our data science team to help build predictive models and analyze large datasets. Work with cutting-edge ML technologies.',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
        postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  };

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchTerm === '' ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      filterLocation === '' ||
      job.location.toLowerCase().includes(filterLocation.toLowerCase());

    const matchesSalary =
      filterSalary === '' ||
      (job.salary && parseFloat(job.salary) >= parseFloat(filterSalary));

    return matchesSearch && matchesLocation && matchesSalary;
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Browse Job <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Opportunities</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your next career opportunity from hundreds of available positions.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Jobs
                </span>
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, company..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location
                </span>
              </label>
              <input
                type="text"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                placeholder="Filter by location..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Min Salary (USD)
                </span>
              </label>
              <input
                type="number"
                value={filterSalary}
                onChange={(e) => setFilterSalary(e.target.value)}
                placeholder="Minimum salary..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Found <span className="font-bold text-indigo-600">{filteredJobs.length}</span> job
            {filteredJobs.length !== 1 ? 's' : ''}
          </p>
          {(searchTerm || filterLocation || filterSalary) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterLocation('');
                setFilterSalary('');
              }}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Job List */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id || job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg mb-4">No jobs found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterLocation('');
                setFilterSalary('');
              }}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;