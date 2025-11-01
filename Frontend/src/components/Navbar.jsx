import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RoleSwitcher from './RoleSwitcher';

const Navbar = () => {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check both user and token to ensure proper authentication state
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const u = localStorage.getItem('user');
      
      // Only set user if both token and user exist
      if (token && u) {
        try {
          setUser(JSON.parse(u));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();

    const handleAuth = () => {
      checkAuth();
    };
    
    window.addEventListener('auth-change', handleAuth);
    window.addEventListener('storage', handleAuth);
    return () => {
      window.removeEventListener('auth-change', handleAuth);
      window.removeEventListener('storage', handleAuth);
    };
  }, []);

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('activeRole');
    localStorage.removeItem('applications');
    localStorage.removeItem('bookmarks');
    
    // Dispatch auth change event
    window.dispatchEvent(new Event('auth-change'));
    
    // Close mobile menu if open
    setMobileOpen(false);
    
    // Navigate to login page
    navigate('/login', { replace: true });
  };

  return (
    <nav className="glass-navbar fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">CC</div>
            <span className="hidden sm:inline text-lg font-bold text-gray-900">CampusConnect</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-800 hover:text-indigo-600 font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="text-gray-800 hover:text-indigo-600 font-medium transition-colors duration-200"
            >
              Jobs
            </Link>
            <Link
              to="/about"
              className="text-gray-800 hover:text-indigo-600 font-medium transition-colors duration-200"
            >
              About
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-800 hover:text-indigo-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-indigo-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="glow-button px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <RoleSwitcher user={user} />
                <Link
                  to={(() => {
                    const activeRole = localStorage.getItem('activeRole');
                    const userRole = user?.role;
                    return (activeRole || userRole) === 'seeker' ? '/dashboard/seeker' : '/dashboard/finder';
                  })()}
                  className="text-gray-800 hover:text-indigo-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-indigo-50"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-800 hover:text-indigo-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-indigo-50"
                >
                  Profile
                </Link>
                <Link
                  to="/applications"
                  className="text-gray-800 hover:text-indigo-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-indigo-50"
                >
                  Applications
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 font-medium transition-all duration-200"
                >
                  Logout
                </button>
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
      <div className={`md:hidden transition-all ${isMobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50`}>
        <div className="px-4 pt-4 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block py-3 px-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
          >
            Home
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileOpen(false)}
            className="block py-3 px-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
          >
            Jobs
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileOpen(false)}
            className="block py-3 px-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
          >
            About
          </Link>
          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block py-3 px-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block py-3 px-3 rounded-lg glow-button text-center font-semibold"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <div className="py-2 px-3">
                <RoleSwitcher user={user} />
              </div>
              <Link
                to={(() => {
                  const activeRole = localStorage.getItem('activeRole');
                  const userRole = user?.role;
                  return (activeRole || userRole) === 'seeker' ? '/dashboard/seeker' : '/dashboard/finder';
                })()}
                onClick={() => setMobileOpen(false)}
                className="block py-3 px-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="block py-3 px-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
              >
                Profile
              </Link>
              <Link
                to="/applications"
                onClick={() => setMobileOpen(false)}
                className="block py-3 px-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
              >
                Applications
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-3 px-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
