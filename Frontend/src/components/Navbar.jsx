import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RoleSwitcher from './RoleSwitcher';

const Navbar = () => {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('user');
    setUser(u ? JSON.parse(u) : null);

    const handleAuth = () => {
      const u2 = localStorage.getItem('user');
      setUser(u2 ? JSON.parse(u2) : null);
    };
    window.addEventListener('auth-change', handleAuth);
    window.addEventListener('storage', handleAuth);
    return () => {
      window.removeEventListener('auth-change', handleAuth);
      window.removeEventListener('storage', handleAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('activeRole');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <nav className="glass-navbar fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">CC</div>
            <span className="hidden sm:inline text-lg font-bold text-gray-900">CampusConnect</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-800 hover:text-indigo-600">Home</Link>
            <Link to="/jobs" className="text-gray-800 hover:text-indigo-600">Jobs</Link>
            <Link to="/about" className="text-gray-800 hover:text-indigo-600">About</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link to="/login" className="text-gray-800 hover:text-indigo-600">Login</Link>
                <Link to="/register" className="glow-button px-4 py-2">Sign up</Link>
              </>
            ) : (
              <>
                <RoleSwitcher user={user} />
                <Link to={ (localStorage.getItem('activeRole') || user.activeRole || user.role) === 'seeker' ? '/dashboard/seeker' : '/dashboard/finder' } className="text-gray-800 hover:text-indigo-600">Dashboard</Link>
                <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button onClick={() => setMobileOpen(v => !v)} className="p-2 rounded-lg hover:bg-white/30">
              {isMobileOpen ? (
                <svg className="w-6 h-6 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                <svg className="w-6 h-6 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"></path></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all ${isMobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-4 pt-4 pb-6 space-y-3">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2">Home</Link>
          <Link to="/jobs" onClick={() => setMobileOpen(false)} className="block py-2">Jobs</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block py-2">About</Link>
          {!user ? (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block py-2 glow-button text-center">Sign up</Link>
            </>
          ) : (
            <>
              <div className="py-2"><RoleSwitcher user={user} /></div>
              <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="w-full text-left py-2 text-red-600">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
