import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Role Switcher Component
 * Allows users to switch between Talent Finder and Talent Seeker modes
 */
const RoleSwitcher = ({ user, onRoleChange }) => {
  const [activeRole, setActiveRole] = useState(user?.activeRole || user?.role || 'seeker');
  const navigate = useNavigate();

  useEffect(() => {
    // Update active role when user changes
    if (user) {
      const storedRole = localStorage.getItem('activeRole');
      setActiveRole(storedRole || user.activeRole || user.role || 'seeker');
    }
  }, [user]);

  const handleRoleSwitch = (newRole) => {
    setActiveRole(newRole);
    
    // Store active role in localStorage
    localStorage.setItem('activeRole', newRole);
    
    // Update user object
    const updatedUser = {
      ...user,
      activeRole: newRole,
      role: newRole, // For backward compatibility
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Dispatch event to update all components
    window.dispatchEvent(new Event('auth-change'));
    
    // Navigate to appropriate dashboard
    if (newRole === 'seeker') {
      navigate('/dashboard/seeker');
    } else {
      navigate('/dashboard/finder');
    }
    
    // Call callback if provided
    if (onRoleChange) {
      onRoleChange(newRole);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-2 glass-card p-1">
      <button
        onClick={() => handleRoleSwitch('seeker')}
        className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
          activeRole === 'seeker'
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'text-gray-700 hover:bg-white/60 hover:text-indigo-600'
        }`}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Seeker
        </span>
      </button>
      <button
        onClick={() => handleRoleSwitch('finder')}
        className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
          activeRole === 'finder'
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'text-gray-700 hover:bg-white/60 hover:text-indigo-600'
        }`}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Finder
        </span>
      </button>
    </div>
  );
};

export default RoleSwitcher;
