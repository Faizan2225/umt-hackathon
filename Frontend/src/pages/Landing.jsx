import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Floating shape component (no changes)
const FloatingShape = ({ position, size, bgColor, delay = 0 }) => {
  const floatingVariants = {
    float: {
      y: [0, -20, 0],
      transition: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div
      className={`absolute ${position} w-${size} h-${size} ${bgColor} rounded-full filter blur-3xl`}
      variants={floatingVariants}
      animate="float"
      transition={{ delay }}
    />
  );
};

// Button component (no changes)
const Button = ({ to, text, gradient, bgColor, textColor, icon, extraClasses }) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        to={to}
        className={`inline-block px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg ${gradient} ${bgColor} ${textColor} shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 relative overflow-hidden group ${extraClasses}`}
      >
        <span className="relative z-10 flex items-center gap-2">
          {text}
          {icon && <span className="group-hover:translate-x-1 transition-transform">{icon}</span>}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </Link>
    </motion.div>
  );
};

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background Shapes */}
      <div className="campus-dots"></div>
      <FloatingShape position="top-20 left-1/4" size="96" bgColor="bg-indigo-400/20" />
      <FloatingShape position="top-1/2 right-1/4" size="128" bgColor="bg-purple-400/15" delay={0.5} />
      <FloatingShape position="bottom-20 left-1/3" size="80" bgColor="bg-pink-400/15" delay={1} />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center flex-grow px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100/50 backdrop-blur-sm border border-indigo-200/50 mb-6">
              <span className="text-indigo-700 font-semibold text-sm">🚀 Join thousands of students and employers</span>
            </div>
          </motion.div>

          {/* Primary CTA */}
          <Button
            to="/register"
            text="Get Started"
            gradient="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
            bgColor="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
            textColor="text-white"
            icon="→"
          />

          {/* Secondary CTA */}
          <Button
            to="/jobs"
            text="🔍 Browse Jobs"
            bgColor="bg-white/80 backdrop-blur-xl"
            textColor="text-gray-900"
            extraClasses="hover:border-indigo-400/70 hover:bg-white"
          />
        </div>
      </section>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto text-center"
      >
        {[{ number: '1000+', label: 'Active Jobs' }, { number: '500+', label: 'Students' }, { number: '50+', label: 'Employers' }].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + idx * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {stat.number}
            </div>
            <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Feature Cards */}
      <section className="w-full py-16 sm:py-20 md:py-28 mb-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">CampusConnect</span>?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to connect talent with opportunity
            </p>
          </motion.div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full" style={{ maxWidth: '1000px' }}>
              {[{ icon: "🎓", title: "For Seekers", desc: "Browse opportunities, apply effortlessly, and track your career growth.", gradient: "from-indigo-500/20 to-purple-500/20", borderGradient: "from-indigo-400/50 to-purple-400/50", features: ["Smart Job Matching", "Easy Applications", "Track Progress"] },
              { icon: "💼", title: "For Finders", desc: "Post roles, connect with talent, and manage applicants with ease.", gradient: "from-purple-500/20 to-pink-500/20", borderGradient: "from-purple-400/50 to-pink-400/50", features: ["Post Jobs Easily", "Manage Applicants", "Chat Integration"] },
              { icon: "🤖", title: "Smart Matching", desc: "AI-powered recommendations connect the right candidates to the right roles.", gradient: "from-blue-500/20 to-indigo-500/20", borderGradient: "from-blue-400/50 to-indigo-400/50", features: ["AI Recommendations", "Skill Matching", "Instant Notifications"] }]
                .map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                    transition={{ delay: idx * 0.15, duration: 0.5 }}
                    className="relative group w-full"
                  >
                    <div className={`relative overflow-hidden p-8 sm:p-10 rounded-3xl border-2 border-white/40 shadow-2xl backdrop-blur-2xl bg-white/60 hover:border-indigo-300/60 transition-all duration-500 h-full flex flex-col w-full`}>
                      {/* Gradient Accent Bar */}
                      <div className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${item.borderGradient} rounded-t-3xl`}></div>

                      {/* Gradient Overlay on Hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl`}></div>

                      {/* Content */}
                      <div className="relative z-10 flex flex-col flex-grow">
                        <div className="text-6xl sm:text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 tracking-tight group-hover:text-indigo-700 transition-colors">{item.title}</h3>
                        <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6 flex-grow">{item.desc}</p>
                        
                        {/* Features List */}
                        <ul className="space-y-2">
                          {item.features.map((feature, fIdx) => (
                            <li key={fIdx} className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="text-indigo-600 font-bold">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Animated Glow Border on Hover */}
                      <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-indigo-300/50 transition-all duration-500 pointer-events-none`}></div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full mb-24 relative z-10"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl p-12 sm:p-16 md:p-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to Get Started?</h2>
              <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students and employers who are already using CampusConnect to build their future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button to="/register" text="Create Account" bgColor="bg-white text-indigo-600" />
                <Button to="/jobs" text="Explore Jobs" bgColor="bg-white/10 backdrop-blur-sm text-white" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Spacer before footer */}
      <div className="h-12 md:h-16"></div>
    </div>
  );
};

export default Landing;
