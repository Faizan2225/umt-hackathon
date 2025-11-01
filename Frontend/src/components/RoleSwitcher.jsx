import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSwitcher = ({ user, onChange }) => {
  const [active, setActive] = useState(user?.activeRole || user?.role || 'seeker');
  const navigate = useNavigate();

  useEffect(() => {
    const r = localStorage.getItem('activeRole') || user?.activeRole || user?.role || 'seeker';
    setActive(r);
  }, [user]);

  const switchTo = (role) => {
    setActive(role);
    localStorage.setItem('activeRole', role);
    const updatedUser = user ? { ...user, activeRole: role, role } : null;
    if (updatedUser) localStorage.setItem('user', JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('auth-change'));
    if (onChange) onChange(role);
    if (role === 'seeker') navigate('/dashboard/seeker'); else navigate('/dashboard/finder');
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 bg-white/60 p-1 rounded-lg">
      <button onClick={() => switchTo('seeker')} className={`px-3 py-1 rounded-md text-sm ${active === 'seeker' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-white/60'}`}>Seeker</button>
      <button onClick={() => switchTo('finder')} className={`px-3 py-1 rounded-md text-sm ${active === 'finder' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-white/60'}`}>Finder</button>
    </div>
  );
};

export default RoleSwitcher;
