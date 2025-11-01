import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const JobCard = ({ job, applied, onApply }) => {
  const [showModal, setShowModal] = useState(false);
  const [proposal, setProposal] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const handleApplyClick = () => {
    setShowModal(true);
  };

  const handleSubmit = () => {
    onApply({ jobId: job.id || job._id, proposal, resumeFile });
    setShowModal(false);
  };

  return (
    <>
      {/* ===== Job Card ===== */}
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 250, damping: 15 }}
        className="glass-card relative overflow-hidden p-6 rounded-2xl shadow-md border border-white/30 backdrop-blur-lg bg-white/50 hover:shadow-xl transition-all duration-300"
      >
        {/* Job Info */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
        <p className="text-gray-700 font-medium mb-1">{job.company}</p>
        <p className="text-sm text-gray-600 mb-3">{job.location}</p>
        <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed mb-3">
          {job.description}
        </p>

        <div className="flex justify-between items-center pt-3 border-t border-gray-200/40">
          <span className="text-indigo-700 font-semibold">
            {job.salary ? `$${job.salary.toLocaleString()}` : "Negotiable"}
          </span>
          <button
            onClick={handleApplyClick}
            disabled={applied}
            className={`px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all duration-300 shadow-md ${
              applied
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
            }`}
          >
            {applied ? "Applied – Pending" : "Apply Now"}
          </button>
        </div>
      </motion.div>

      {/* ===== Apply Modal ===== */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card bg-white/80 border border-white/40 rounded-2xl shadow-2xl p-8 w-full max-w-lg backdrop-blur-xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-5">
                Apply for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {job.title}
                </span>
              </h3>

              <div className="space-y-5">
                <textarea
                  placeholder="Write your proposal..."
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  className="w-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl p-4 text-gray-800 resize-none"
                  rows="5"
                />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Upload Resume
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="text-sm text-gray-600 w-full sm:w-auto"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all shadow-md"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JobCard;
