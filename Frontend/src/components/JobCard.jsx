import { Link } from 'react-router-dom';

/**
 * JobCard Component
 * Modern job card with hover animations and gradient accents
 * - Smooth scale-up and shadow increase on hover
 * - Gradient tags for skills
 * - Clean, modern styling
 */
const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:scale-[1.02] hover:border-indigo-200 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
            {job.title || 'Software Engineer'}
          </h3>
          <p className="text-gray-600 text-sm mb-2 flex items-center gap-2">
            <span className="font-medium">{job.company || 'Company Name'}</span>
            <span className="text-gray-400">•</span>
            <span>{job.location || 'Remote'}</span>
          </p>
        </div>
        {job.salary && (
          <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold text-sm shadow-md">
            ${(job.salary / 1000).toFixed(0)}k
          </span>
        )}
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-2 text-sm leading-relaxed">
        {job.description || 'Job description goes here...'}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills?.slice(0, 3).map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100"
          >
            {skill}
          </span>
        ))}
        {job.skills?.length > 3 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {job.postedDate ? new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently'}
        </span>
        <Link
          to={`/jobs/${job.id || job._id || 1}`}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default JobCard;