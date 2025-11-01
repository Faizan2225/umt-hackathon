import { Link } from 'react-router-dom';

/**
 * Landing Page
 * Modern homepage with hero section, gradient background, and feature cards
 * - Hero section with gradient background and CTA buttons
 * - Section cards for "For Seekers" and "For Finders" (2-column on desktop, stacked on mobile)
 * - Modern, minimal design with smooth transitions
 */
const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-600/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Connect Talent with
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Opportunity
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              CampusConnect bridges the gap between talented students and innovative employers.
              Find your dream job or discover the next generation of talent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                to="/jobs"
                className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-200 font-semibold text-lg shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Find Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Seekers & For Finders Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Choose Your Path
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Whether you're looking for talent or opportunities, we've got you covered.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* For Seekers Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">For Talent Seekers</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Students and job seekers can discover amazing opportunities, apply with ease, 
              and get matched with roles that fit your skills and aspirations.
            </p>
            <ul className="space-y-3 mb-6 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">✓</span>
                Browse hundreds of job opportunities
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">✓</span>
                Get personalized job recommendations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">✓</span>
                Track your applications easily
              </li>
            </ul>
            <Link
              to="/register"
              className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              Start Seeking →
            </Link>
          </div>

          {/* For Finders Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">For Talent Finders</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Employers can post job openings, reach talented candidates, and find the perfect 
              fit for your team from a pool of motivated students and professionals.
            </p>
            <ul className="space-y-3 mb-6 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-purple-600">✓</span>
                Post jobs and reach top talent
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-600">✓</span>
                Manage applications efficiently
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-600">✓</span>
                Connect directly with candidates
              </li>
            </ul>
            <Link
              to="/register"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              Start Finding →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-white/50 rounded-3xl mx-4 md:mx-auto mb-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Why Choose CampusConnect?
        </h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Experience the future of talent recruitment
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-center border border-gray-100 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Targeted Matching</h3>
            <p className="text-gray-600 leading-relaxed">
              Our smart matching algorithm connects you with opportunities that fit your skills and goals.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-center border border-gray-100 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Fast & Easy</h3>
            <p className="text-gray-600 leading-relaxed">
              Simple application process. Get started in minutes and find opportunities quickly.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-center border border-gray-100 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Connection</h3>
            <p className="text-gray-600 leading-relaxed">
              Connect directly with employers and candidates without middlemen.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl md:text-2xl mb-10 text-indigo-100">
            Join thousands of students and employers already using CampusConnect.
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-100 transition-all duration-200 font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;