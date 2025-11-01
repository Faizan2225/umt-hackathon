import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Subtle dotted background */}
      <div className="campus-dots"></div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center flex-grow px-6 sm:px-10 lg:px-24 xl:px-32">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight"
        >
          Connect Talent with{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Opportunity
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          CampusConnect bridges the gap between students and employers — discover jobs, post
          opportunities, and build your future.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/register" className="glow-button px-8 py-4 rounded-xl font-semibold text-lg">
            Get Started
          </Link>
          <Link
            to="/jobs"
            className="glass-card px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
          >
            Find Jobs
          </Link>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-24 xl:px-32 py-20 md:py-28 mb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: "🎓",
              title: "For Seekers",
              desc: "Browse opportunities, apply effortlessly, and track your career growth.",
              gradient: "from-indigo-500/10 to-purple-500/10",
            },
            {
              icon: "💼",
              title: "For Finders",
              desc: "Post roles, connect with talent, and manage applicants with ease.",
              gradient: "from-purple-500/10 to-pink-500/10",
            },
            {
              icon: "🤖",
              title: "Smart Matching",
              desc: "AI-powered recommendations connect the right candidates to the right roles.",
              gradient: "from-blue-500/10 to-indigo-500/10",
            },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 * (idx + 1) }}
              className={`
                group glass-card relative overflow-hidden p-10 rounded-2xl
                hover:scale-[1.03] transition-all duration-500 ease-out
                border border-white/30 shadow-lg backdrop-blur-lg
              `}
            >
              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-60 group-hover:opacity-90 transition-all duration-500`}
              ></div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Glow border animation */}
              <div
                className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-indigo-400/40 transition-all duration-500"
              ></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Spacer before footer */}
      <div className="h-16 md:h-24"></div>
    </div>
  );
};

export default Landing;
