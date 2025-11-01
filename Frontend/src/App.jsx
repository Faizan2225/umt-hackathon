import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { chatService } from './services/chatService';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardSeeker from './pages/DashboardSeeker';
import DashboardFinder from './pages/DashboardFinder';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';

import Chat from './pages/Chat';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Applications from './pages/Applications';
import JobApplicants from './pages/JobApplicants';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleGoogleCallback = async (code) => {
    try {
      const { authAPI } = await import('./api/auth');
      const response = await authAPI.googleCallback(code);
      
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        const userData = await authAPI.getMe();
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('auth-change'));
        
        // Google OAuth users are automatically verified
        // Redirect to appropriate dashboard
        const role = userData.role || 'seeker';
        navigate(role === 'seeker' ? '/dashboard/seeker' : '/dashboard/finder', { replace: true });
      }
    } catch (error) {
      console.error('Google OAuth callback failed:', error);
      navigate('/login?error=oauth_failed', { replace: true });
    }
  };

  useEffect(() => {
    // Handle Google OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      handleGoogleCallback(code);
      return;
    }

    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);

    // Listen to auth changes
    const handleAuthChange = () => {
      const u = localStorage.getItem('user');
      setUser(u ? JSON.parse(u) : null);
    };
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      chatService.disconnect();
    };
  }, []);

  // Protected route wrapper
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/dashboard/seeker"
            element={
              <PrivateRoute>
                <DashboardSeeker />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/finder"
            element={
              <PrivateRoute>
                <DashboardFinder />
              </PrivateRoute>
            }
          />

          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          <Route
            path="/chat/:conversationId?"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/applications"
            element={
              <PrivateRoute>
                <Applications />
              </PrivateRoute>
            }
          />

          <Route
            path="/job/:jobId/applicants"
            element={
              <PrivateRoute>
                <JobApplicants />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
