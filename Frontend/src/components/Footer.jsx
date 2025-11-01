import { Link } from 'react-router-dom';

/**
 * Footer Component
 * Modern footer with gradient background and clean layout
 */
const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-white">CC</span>
              </div>
              <h3 className="text-xl font-bold">CampusConnect</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Connecting talent finders with talented students and job seekers. 
              Build your future career today.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors duration-200">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors duration-200">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg">Contact</h4>
            <p className="text-gray-400 mb-2">
              Email: <a href="mailto:support@campusconnect.com" className="hover:text-white transition-colors duration-200">
                support@campusconnect.com
              </a>
            </p>
            <p className="text-gray-400">
              Connect with us on social media
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} CampusConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;