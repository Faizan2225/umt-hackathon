import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';

const JobCardFinder = ({ job, onEdit, onDelete, onMarkFilled }) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 250, damping: 15 }}
      className="glass-card relative overflow-hidden p-6 rounded-2xl shadow-md border border-white/30 backdrop-blur-lg bg-white/50 hover:shadow-xl transition-all duration-300"
    >
      {/* Gradient Accent Bar */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>

      <div className="flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-gray-700 font-medium mb-1">{job.company}</p>
          <p className="text-sm text-gray-600 mb-3">{job.location}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {job.skills?.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>

          <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed mb-3">
            {job.description}
          </p>

          <div className="flex justify-between items-center pt-3 border-t border-gray-200/40">
            <span
              className={`text-sm font-semibold ${
                job.status === 'filled' ? 'text-green-600' : 'text-indigo-700'
              }`}
            >
              {job.status === 'filled' ? 'Filled' : 'Active'}
            </span>
            <span className="text-gray-700 font-semibold">
              {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => onEdit(job)}
            className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-semibold hover:bg-indigo-200 transition-all duration-300"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => {
              if (onMarkFilled) onMarkFilled(job.id || job._id);
              else {
                // Default: Update job status to filled
                jobService.updateJob(job.id || job._id, { status: 'filled' }).then(() => {
                  window.location.reload();
                });
              }
            }}
            className="px-4 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-semibold hover:bg-green-200 transition-all duration-300"
          >
            ✅ Mark Filled
          </button>
          <Link
            to={`/job/${job.id || job._id}/applicants`}
            className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold hover:bg-blue-200 transition-all duration-300 text-center"
          >
            👥 View Applicants
          </Link>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this job?')) {
                if (onDelete) onDelete(job.id || job._id);
                else {
                  jobService.deleteJob(job.id || job._id).then(() => {
                    window.location.reload();
                  });
                }
              }
            }}
            className="px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-semibold hover:bg-red-200 transition-all duration-300"
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCardFinder;
