import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../api/profile';
import { uploadAPI } from '../api/upload';
import { authService } from '../services/authService';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';

/**
 * Profile Management Page
 * Allows users to view and edit their profile
 */
const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    skills: [],
    interests: [],
  });
  const [skillsInput, setSkillsInput] = useState('');
  const [interestsInput, setInterestsInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await profileAPI.getMyProfile();
      setUser(userData);
      setFormData({
        name: userData.name || '',
        skills: userData.skills || [],
        interests: userData.interests || [],
      });
      setSkillsInput((userData.skills || []).join(', '));
      setInterestsInput((userData.interests || []).join(', '));
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const updateData = {
        name: formData.name,
        skills: skillsInput.split(',').map(s => s.trim()).filter(Boolean),
        interests: interestsInput.split(',').map(s => s.trim()).filter(Boolean),
      };

      await profileAPI.updateProfile(updateData);
      
      // Refresh user data
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('auth-change'));
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const result = await uploadAPI.uploadResumeAndExtractSkills(file);
      
      // Refresh profile to get updated skills
      await loadProfile();
      
      setSuccess(`Resume uploaded! Extracted ${result.skills_found?.length || 0} skills.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to upload resume');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="campus-dots"></div>

      <main className="max-w-4xl mx-auto px-6 md:px-10 py-16 relative z-10">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            My Profile
          </h1>
          <p className="text-lg text-gray-600">Manage your profile information and skills</p>
        </motion.div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl mb-6">
            {success}
          </div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-8 rounded-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="glass-input w-full px-4 py-3 rounded-xl"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="glass-input w-full px-4 py-3 rounded-xl bg-gray-100 opacity-60"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role
              </label>
              <input
                type="text"
                value={user?.role === 'seeker' ? 'Talent Seeker' : 'Talent Finder'}
                disabled
                className="glass-input w-full px-4 py-3 rounded-xl bg-gray-100 opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-xl"
                placeholder="e.g., Python, JavaScript, React, Node.js"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current skills: {formData.skills.join(', ') || 'None'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Interests (comma separated)
              </label>
              <input
                type="text"
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                className="glass-input w-full px-4 py-3 rounded-xl"
                placeholder="e.g., Web Development, AI, Mobile Apps"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Resume Upload (PDF)
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer">
                  <span className="glow-button px-6 py-3 rounded-xl inline-block">
                    {uploading ? 'Uploading...' : 'Upload Resume'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-600">
                  Upload your resume to automatically extract skills
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="glow-button px-6 py-3 rounded-xl disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;

