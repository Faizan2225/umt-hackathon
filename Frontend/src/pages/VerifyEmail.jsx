import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';

/**
 * Email Verification Page
 * Handles email verification and resend verification
 */
const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    }
  }, [searchParams]);

  const verifyEmail = async (token) => {
    setLoading(true);
    setError('');
    try {
      await authService.verifyEmail(token);
      setVerified(true);
      setMessage('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired verification link');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await authService.requestVerification(email);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">

      <motion.div
        className="max-w-md w-full relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative bg-white border border-gray-200 rounded-xl p-8 md:p-10 space-y-6 shadow-lg max-w-md w-full">

          {verified ? (
            <div className="text-center space-y-4 relative z-10">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Email Verified!
              </h2>
              <p className="text-gray-700">{message}</p>
            </div>
          ) : (
            <>
              <div className="text-center space-y-4 relative z-10">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Verify Your Email
                </h2>
                <p className="text-gray-700">
                  We've sent a verification link to your email. Please check your inbox and click the link to verify your account.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-xl relative z-10">
                  <p className="font-semibold">{error}</p>
                </div>
              )}

              {message && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-5 py-4 rounded-xl relative z-10">
                  <p className="font-semibold">{message}</p>
                </div>
              )}

              <div className="space-y-4 relative z-10">
                <div>
                  <label htmlFor="resendEmail" className="block text-sm font-bold text-gray-800 mb-2">
                    Didn't receive the email?
                  </label>
                  <input
                    id="resendEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full px-4 py-3.5 rounded-xl placeholder-gray-400 text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  onClick={resendVerification}
                  disabled={loading}
                  className="relative w-full py-4 px-4 text-white rounded-xl disabled:opacity-50 font-bold overflow-hidden group/btn"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></span>
                  <span className="relative z-10">{loading ? 'Sending...' : 'Resend Verification Email'}</span>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 transition-all"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;

