import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';

/**
 * Job Details Page
 * Modern job detail layout with gradient buttons and clean design
 * - Gradient apply button
 * - Enhanced card layouts
 * - Better typography and spacing
 */
const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [user, setUser] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API endpoint when backend is ready
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);
      
      // Check if user has already applied
      if (user && user.role === 'seeker') {
        checkApplicationStatus();
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      // Mock data for development
      setJob(getMockJob(id));
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      // TODO: Check application status when backend is ready
      // const response = await api.get(`/jobs/${id}/application-status`);
      // setApplied(response.data.applied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  // Mock data function (remove when backend is ready)
  const getMockJob = (jobId) => {
    const mockJobs = {
      1: {
        id: 1,
        title: 'Frontend Developer',
        company: 'Tech Corp',
        location: 'Remote',
        salary: 70000,
        description: 'We are looking for an experienced frontend developer to join our team. You will work on building modern web applications using React and modern JavaScript frameworks.',
        fullDescription: `We are seeking a talented Frontend Developer to join our dynamic team. In this role, you will be responsible for:
        
- Developing responsive web applications using React and modern JavaScript
- Collaborating with designers and backend developers
- Writing clean, maintainable code following best practices
- Participating in code reviews and team meetings
- Optimizing applications for maximum speed and scalability

Requirements:
- 2+ years of experience with React
- Strong knowledge of JavaScript, HTML, and CSS
- Experience with state management libraries
- Good understanding of RESTful APIs
- Excellent problem-solving skills`,
        skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Redux'],
        requirements: [
          '2+ years of experience with React',
          'Strong knowledge of JavaScript, HTML, and CSS',
          'Experience with state management',
          'Good communication skills',
        ],
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        companyInfo: 'Tech Corp is a leading technology company focused on innovation and cutting-edge solutions.',
      },
    };
    return mockJobs[jobId] || mockJobs[1];
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    if (user.role !== 'seeker') {
      alert('Only job seekers can apply for jobs.');
      return;
    }

    setApplying(true);
    try {
      // TODO: Replace with actual API endpoint when backend is ready
      await api.post(`/jobs/${id}/apply`);
      setApplied(true);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      // Mock application for development
      setApplied(true);
      alert('Application submitted successfully! (Mock)');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <Link to="/jobs" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Back to Job List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Button */}
        <Link
          to="/jobs"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6 font-semibold transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Jobs
        </Link>

        {/* Job Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{job.title}</h1>
              <p className="text-xl text-gray-600 mb-4 flex items-center gap-2">
                <span className="font-semibold">{job.company}</span>
                <span className="text-gray-400">•</span>
                <span>{job.location}</span>
              </p>
              {job.salary && (
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${job.salary.toLocaleString()} / year
                </p>
              )}
            </div>
            {user && user.role === 'seeker' && (
              <button
                onClick={handleApply}
                disabled={applying || applied}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  applied
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                } disabled:opacity-50`}
              >
                {applying ? 'Applying...' : applied ? '✓ Applied' : 'Apply Now'}
              </button>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">
              {job.fullDescription || job.description}
            </p>
          </div>
        </div>

        {/* Skills & Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {job.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-lg text-sm font-semibold border border-indigo-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Requirements
            </h3>
            <ul className="list-none space-y-3">
              {job.requirements?.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <span className="text-indigo-600 mt-1">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Company Info */}
        {job.companyInfo && (
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">About {job.company}</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{job.companyInfo}</p>
          </div>
        )}

        {/* Call to Action */}
        {!user && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Interested in this position?</h3>
            <p className="text-gray-700 mb-6">
              Sign in or create an account to apply.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-200 font-semibold shadow-md"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;