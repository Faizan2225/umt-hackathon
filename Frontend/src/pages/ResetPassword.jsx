import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { authService } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-20 overflow-hidden bg-[#fafbff]">
      {/* Optional background pattern to match theme */}
      <div className="campus-dots"></div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card relative z-10 w-full max-w-md p-10 md:p-12 rounded-3xl shadow-2xl border border-white/40 backdrop-blur-xl"
      >
        {success ? (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Email Sent!
            </h2>
            <p className="text-gray-600">
              If your email is registered, you’ll receive a password reset link
              shortly.
            </p>
            <Link
              to="/login"
              className="inline-block mt-4 text-sm font-semibold text-indigo-600 hover:text-purple-600 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-2">
              Forgot Password
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Enter your email and we’ll send you a reset link
            </p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Added padding wrapper for balanced left/right spacing */}
            <form onSubmit={handleSubmit} className="space-y-6 px-2 sm:px-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="glass-input w-full px-4 py-3.5 rounded-xl placeholder-gray-400 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full py-3.5 px-4 text-white rounded-xl font-semibold text-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 disabled:opacity-50 transition"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </motion.button>

              <div className="text-center mt-8">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-indigo-600 hover:text-purple-600 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
