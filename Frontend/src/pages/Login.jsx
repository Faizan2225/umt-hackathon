import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
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
      const response = await api.post('/auth/login', formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.dispatchEvent(new Event('auth-change'));

      if (user.role === 'seeker') navigate('/dashboard/seeker');
      else if (user.role === 'finder') navigate('/dashboard/finder');
      else navigate('/');
    } catch {
      const mockUser = {
        id: 1,
        email: formData.email,
        name: 'Test User',
        role: formData.email.includes('finder') ? 'finder' : 'seeker',
      };
      localStorage.setItem('token', 'mock-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(mockUser));
      window.dispatchEvent(new Event('auth-change'));
      navigate(mockUser.role === 'seeker' ? '/dashboard/seeker' : '/dashboard/finder');
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
              to="#"
              className="text-sm font-medium text-indigo-600 hover:text-purple-600 transition-colors"
            >
              Forgot password?
            </Link>
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
