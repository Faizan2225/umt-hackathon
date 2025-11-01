import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="glass-footer mt-24 relative z-10 overflow-hidden">
      {/* Background dots */}
      <div className="campus-dots"></div>

      {/* Top gradient separator to prevent merging with cards */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Brand Section */}
          <div>
            <div className="flex justify-center md:justify-start items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                CC
              </div>
              <h3 className="text-xl font-bold text-gray-900">CampusConnect</h3>
            </div>
            <p className="text-gray-700 max-w-xs mx-auto md:mx-0 leading-relaxed">
              Connecting students and employers — build your career with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-2 text-gray-700">
              {[
                { label: 'Home', path: '/' },
                { label: 'Browse Jobs', path: '/jobs' },
                { label: 'Sign Up', path: '/register' },
              ].map((link, i) => (
                <motion.li
                  key={link.path}
                  whileHover={{ x: 4, color: '#4f46e5' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link to={link.path} className="hover:text-indigo-600 transition-colors duration-200">
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Contact</h4>
            <p className="text-gray-700 mb-4">support@campusconnect.com</p>
            <div className="flex justify-center md:justify-start gap-4">
              {[
                { icon: 'in', color: 'bg-[#0077b5]/10 text-[#0077b5]' },
                { icon: 'tw', color: 'bg-[#1DA1F2]/10 text-[#1DA1F2]' },
                { icon: 'fb', color: 'bg-[#1877F2]/10 text-[#1877F2]' },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.15 }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${social.color} transition-transform duration-200`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-white/20 pt-6 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} <span className="font-semibold text-indigo-600">CampusConnect</span>. All rights reserved.
        </div>
      </motion.div>

      {/* Soft gradient background overlay */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/70 via-white/30 to-transparent pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
