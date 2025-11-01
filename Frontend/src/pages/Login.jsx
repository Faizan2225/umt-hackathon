import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend returns { access_token, token_type }
      await authService.login(formData);
      
      // User is already stored in localStorage by authService.login
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        
        // Check if user is verified
        if (!user.verified) {
          setError('Please verify your email before logging in. Check your inbox for the verification link or request a new one.');
          // Store token temporarily but don't complete login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Show option to resend verification
          setTimeout(() => {
            if (window.confirm('Would you like to request a new verification email?')) {
              navigate(`/verify-email?email=${encodeURIComponent(user.email)}`);
            }
          }, 1000);
          return;
        }
        
        window.dispatchEvent(new Event('auth-change'));
        
        if (user.role === 'seeker') navigate('/dashboard/seeker');
        else if (user.role === 'finder') navigate('/dashboard/finder');
        else navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-20 overflow-hidden">
      <div className="campus-dots"></div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card relative z-10 w-full max-w-2xl p-14 md:p-16 rounded-[2rem] shadow-2xl border border-white/40 backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Welcome Back
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Sign in to your <span className="text-indigo-600 font-semibold">CampusConnect</span> account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6 text-base">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="email"
              className="block text-base font-semibold text-gray-700 mb-3 ml-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="glass-input w-full px-8 py-5 rounded-2xl text-gray-900 text-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-base font-semibold text-gray-700 mb-3 ml-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="glass-input w-full px-8 py-5 rounded-2xl text-gray-900 text-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:text-purple-600 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Google OAuth Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  await authService.googleLogin();
                } catch (error) {
                  setError('Failed to initiate Google login. Please try again.');
                }
              }}
              className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium">Sign in with Google</span>
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className="w-full py-5 px-8 text-white text-xl rounded-2xl font-semibold glow-button disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>

          {/* Register link */}
          <p className="text-center text-base text-gray-600 mt-10">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-purple-600 transition-colors"
            >
              Create one
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
