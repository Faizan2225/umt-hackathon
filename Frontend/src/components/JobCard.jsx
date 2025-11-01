import { motion } from 'framer-motion';
import { useState } from 'react';

const JobCard = ({ job, applied, onApply }) => {
  const [showModal, setShowModal] = useState(false);
  const [proposal, setProposal] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  // Button classes separated for readability
  const applyBtnClass = `glow-button px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-300 ${
    applied ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:shadow-lg'
  }`;

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
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 250, damping: 15 }}
        className="glass-card relative overflow-hidden p-6 rounded-2xl shadow-md border border-white/30 backdrop-blur-lg bg-white/50 hover:shadow-xl transition-all duration-300"
      >
        {/* Job Info */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
        <p className="text-gray-700 font-medium mb-1">{job.company}</p>
        <p className="text-sm text-gray-600 mb-3">{job.location}</p>
        <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed mb-3">{job.description}</p>
        <div className="flex justify-between items-center pt-3 border-t border-gray-200/40">
          <span className="text-indigo-700 font-semibold">
            {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
          </span>
          <button
            className={applyBtnClass}
            onClick={handleApplyClick}
            disabled={applied}
          >
            {applied ? 'Applied – Pending' : 'Apply Now'}
          </button>
        </div>
      </motion.div>

      {/* Modal for resume/proposal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-bold mb-4">Apply for {job.title}</h3>
            <textarea
              placeholder="Write a proposal..."
              className="w-full border p-2 rounded mb-4"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="mb-4"
              onChange={(e) => setResumeFile(e.target.files[0])}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobCard;
