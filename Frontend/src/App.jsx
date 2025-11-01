import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ✅ Exact file names (case-sensitive)
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardSeeker from './pages/DashboardSeeker';
import DashboardFinder from './pages/DashboardFinder';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* ✅ Must match the navigate() paths in your code */}
          <Route path="/dashboard/seeker" element={<DashboardSeeker />} />
          <Route path="/dashboard/finder" element={<DashboardFinder />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
