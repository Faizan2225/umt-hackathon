import { Link } from 'react-router-dom';

/**
 * JobCardFinder Component
 * Job card for Finder dashboard with edit/delete/mark filled actions
 */
const JobCardFinder = ({ job, onEdit, onDelete, onMarkFilled }) => {
  const getJobTypeLabel = (type) => {
    const types = {
      'academic-project': 'Academic Project',
      'startup': 'Startup/Collab',
      'part-time': 'Part-time',
      'competition': 'Competition',
      'team-search': 'Team Search',
    };
    return types[type] || type;
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'academic-project': 'from-blue-500 to-blue-600',
      'startup': 'from-purple-500 to-purple-600',
      'part-time': 'from-green-500 to-green-600',
      'competition': 'from-orange-500 to-orange-600',
      'team-search': 'from-pink-500 to-pink-600',
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getStatusBadge = (status) => {
    if (status === 'filled') {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
          ✓ Filled
        </span>
      );
    }
    if (status === 'draft') {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
          Draft
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
        Active
      </span>
    );
  };

  return (
    <div className="glass-card p-6 hover:shadow-glass transition-all duration-300 hover:scale-[1.02] group relative">
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {getStatusBadge(job.status)}
      </div>

      <div className="flex justify-between items-start mb-4 pr-20">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
            {job.title || 'Software Engineer'}
          </h3>
          <p className="text-gray-600 text-sm mb-2 flex items-center gap-2">
            <span className="font-medium">{job.company || 'Company Name'}</span>
            <span className="text-gray-400">•</span>
            <span>{job.location || 'Remote'}</span>
          </p>
          <span className={`inline-block px-3 py-1 bg-gradient-to-r ${getJobTypeColor(job.type || 'part-time')} text-white rounded-lg text-xs font-semibold mb-2`}>
            {getJobTypeLabel(job.type || 'part-time')}
          </span>
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
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {job.postedDate ? new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently'}
        </span>
        <div className="flex gap-2">
          {job.status !== 'filled' && (
            <button
              onClick={() => onMarkFilled(job.id || job._id)}
              className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-xs font-semibold"
              title="Mark as Filled"
            >
              Mark Filled
            </button>
          )}
          <button
            onClick={() => onEdit(job)}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 text-xs font-semibold"
            title="Edit Job"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(job.id || job._id)}
            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 text-xs font-semibold"
            title="Delete Job"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCardFinder;
