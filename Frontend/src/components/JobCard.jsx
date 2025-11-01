import { motion } from 'framer-motion';
import { useState } from 'react';

const JobCard = ({ job, applied, onApply }) => {
  const [showModal, setShowModal] = useState(false);
  const [proposal, setProposal] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  const handleApplyClick = () => {
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!onApply || typeof onApply !== 'function') {
      console.error('onApply prop is not provided or is not a function');
      alert('Application functionality is not available. Please try from the dashboard.');
      setShowModal(false);
      return;
    }

    try {
      // Call parent callback to save application
      await onApply({ jobId: job.id || job._id, proposal, resumeFile });
      setShowModal(false);
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 250, damping: 15 }}
        className="glass-card relative overflow-hidden p-8 rounded-2xl shadow-lg border border-white/40 backdrop-blur-xl bg-white/60 hover:shadow-2xl transition-all duration-300 group"
      >
        {/* Gradient Accent Bar */}
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>

        {/* Job Info */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            {job.company && (
              <>
                <span className="text-gray-600 font-medium">{job.company}</span>
                <span className="text-gray-400">•</span>
              </>
            )}
            {job.location && (
              <span className="text-gray-600">{job.location}</span>
            )}
          </div>
          <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
            {job.description || 'No description available'}
          </p>
        </div>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full"
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                +{job.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-200/60">
          <span className="text-indigo-700 font-bold text-lg">
            {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
          </span>
          <button
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all duration-300 transform hover:scale-105 ${
              applied
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg'
            }`}
            onClick={handleApplyClick}
            disabled={applied}
          >
            {applied ? '✓ Applied' : 'Apply Now'}
          </button>
        </div>
      </motion.div>

      {/* Modal for resume/proposal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Apply for {job.title}</h3>
              <p className="text-sm text-gray-600">Fill in your details below</p>
            </div>

            <div className="space-y-5 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Proposal / Cover Letter
                </label>
                <textarea
                  placeholder="Tell us why you're a great fit for this position..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Resume (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Accepted formats: PDF, DOC, DOCX</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Submit Application
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default JobCard;
