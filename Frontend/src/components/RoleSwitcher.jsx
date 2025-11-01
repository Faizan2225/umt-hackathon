import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const RoleSwitcher = ({ user, onChange }) => {
  const [active, setActive] = useState(user?.activeRole || user?.role || 'seeker');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const r = localStorage.getItem('activeRole') || user?.activeRole || user?.role || 'seeker';
    setActive(r);
  }, [user]);

  const switchTo = async (role) => {
    // Don't switch if already on that role
    if (active === role && user?.role === role) return;

    setLoading(true);
    try {
      // Call backend API to switch role
      const response = await authService.switchRole();
      
      // Get fresh user data from backend
      const updatedUser = await authService.getCurrentUser();
      
      // Update local state with fresh data
      setActive(updatedUser.role);
      localStorage.setItem('activeRole', updatedUser.role);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Dispatch event to update UI everywhere
      window.dispatchEvent(new Event('auth-change'));
      
      if (onChange) onChange(updatedUser.role);
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        // Navigate to appropriate dashboard
        if (updatedUser.role === 'seeker') {
          navigate('/dashboard/seeker');
        } else {
          navigate('/dashboard/finder');
        }
      }, 100);
    } catch (error) {
      console.error('Failed to switch role:', error);
      alert(error.response?.data?.detail || 'Failed to switch role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 bg-white/60 p-1 rounded-lg">
      <button 
        onClick={() => switchTo('seeker')} 
        disabled={loading}
        className={`px-3 py-1 rounded-md text-sm transition-all ${
          active === 'seeker' 
            ? 'bg-indigo-600 text-white' 
            : 'text-gray-700 hover:bg-white/60'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading && active !== 'seeker' ? '...' : 'Seeker'}
      </button>
      <button 
        onClick={() => switchTo('finder')} 
        disabled={loading}
        className={`px-3 py-1 rounded-md text-sm transition-all ${
          active === 'finder' 
            ? 'bg-indigo-600 text-white' 
            : 'text-gray-700 hover:bg-white/60'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading && active !== 'finder' ? '...' : 'Finder'}
      </button>
    </div>
  );
};

export default RoleSwitcher;
