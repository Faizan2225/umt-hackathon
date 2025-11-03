import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

/* ──────── Floating orb animation ──────── */
const float = {
  float: {
    y: [0, -45, 0],
    x: [0, 25, 0],
    rotate: [0, 6, 0],
    transition: { repeat: Infinity, duration: 9, ease: 'easeInOut' },
  },
};

/* ──────── Parallax wrapper ──────── */
const Parallax = ({ children, speed = -0.5 }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1200], [0, speed * 150]);
  return <motion.div style={{ y }}>{children}</motion.div>;
};

/* ──────── Animated counter on scroll ──────── */
const Counter = ({ end, label }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const inc = end / 80;
    const timer = setInterval(() => {
      cur += inc;
      if (cur >= end) {
        setValue(end);
        clearInterval(timer);
      } else setValue(Math.floor(cur));
    }, 25);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <div ref={ref} className="text-center">
      <motion.div
        className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        {value}+
      </motion.div>
      <p className="mt-2 text-sm md:text-lg font-medium text-gray-700">{label}</p>
    </div>
  );
};

/* ──────── 3D Tilt Card (mouse move) ──────── */
const TiltCard = ({ children, idx }) => {
  const card = useRef(null);
  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);

  const onMove = (e) => {
    const el = card.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.width / 2, cy = r.height / 2;
    const dx = (e.clientX - r.left - cx) / cx;
    const dy = (e.clientY - r.top - cy) / cy;
    setRy(dx * 16);
    setRx(-dy * 16);
  };
  const onLeave = () => { setRx(0); setRy(0); };

  return (
    <motion.div
      ref={card}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: idx * 0.15, duration: 0.7 }}
      style={{
        transform: `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`,
        transition: 'transform 0.12s ease-out',
      }}
      className="relative group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-70 blur-lg transition-opacity duration-500" />
      {children}
    </motion.div>
  );
};

/* ──────── Main Landing Component ──────── */
const Landing = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const m = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', m);
    return () => window.removeEventListener('mousemove', m);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Cursor glow */}
      <div
        className="pointer-events-none fixed inset-0 z-30"
        style={{
          background: `radial-gradient(600px at ${mouse.x}px ${mouse.y}px, rgba(139,92,246,0.15), transparent 80%)`,
        }}
      />

      {/* Floating orbs */}
      <motion.div
        variants={float}
        animate="float"
        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-3xl opacity-30"
      />
      <motion.div
        variants={float}
        animate="float"
        transition={{ delay: 1 }}
        className="absolute bottom-32 right-20 w-96 h-96 bg-gradient-to-tr from-pink-400 to-purple-600 rounded-full blur-3xl opacity-25"
      />

      {/* ───── HERO SECTION ───── */}
      <section className="relative z-10 flex min-h-screen items-center justify-center pt-32 pb-16 px-4">
        <Parallax speed={-0.5}>
          <div className="mx-auto max-w-7xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight"
            >
              <span className="block text-gray-900">Connect</span>
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Talent & Opportunity
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mx-auto mt-8 max-w-3xl text-lg font-medium text-gray-600 md:text-xl"
            >
              CampusConnect — where students meet dream jobs and employers discover top talent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center"
            >
              <Link
                to="/register"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-10 py-5 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-20" />
              </Link>

              <Link
                to="/jobs"
                className="rounded-full border-2 border-indigo-200 bg-white px-10 py-5 text-lg font-bold text-indigo-700 shadow-lg transition-all duration-300 hover:border-indigo-400 hover:shadow-xl"
              >
                Browse Jobs
              </Link>
            </motion.div>
          </div>
        </Parallax>
      </section>

      {/* ───── STATS SECTION (with more space) ───── */}
      <section className="py-24 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-24 text-center md:grid-cols-3">
            <Counter end={1000} label="Active Jobs" />
            <Counter end={500} label="Students" />
            <Counter end={50} label="Employers" />
          </div>
        </div>
      </section>

      {/* ───── FEATURES SECTION (with more space between cards) ───── */}
      <section className="py-48 px-4">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-24 text-center text-4xl font-bold md:text-5xl"
          >
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Why CampusConnect Stands Out
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 gap-32 md:grid-cols-3">
            {[{
                title: 'For Seekers', desc: 'AI-matched jobs, one-click apply, real-time tracking.', grad: 'from-blue-500 to-indigo-600' },
              { title: 'For Employers', desc: 'Post roles, screen talent, hire faster with smart tools.', grad: 'from-purple-500 to-pink-600' },
              { title: 'Smart Matching', desc: 'AI recommends perfect fits. No more guesswork.', grad: 'from-emerald-500 to-teal-600' },
            ].map((f, i) => (
              <TiltCard key={i} idx={i}>
                <div className="relative rounded-2xl bg-white/90 p-10 shadow-xl backdrop-blur-xl transition-transform duration-300 group-hover:scale-105">
                  <div className={`mb-8 bg-gradient-to-br ${f.grad} bg-clip-text text-6xl text-transparent`}></div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-800">{f.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA (with more space) ───── */}
      <section className="relative py-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <Parallax speed={0.4}>
          <div className="mx-auto max-w-5xl text-center horizontal-gap-45">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 text-4xl font-bold md:text-5xl"
            >
              Ready to Shape the Future?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-16 text-xl text-white/90"
            >
              Join 1,500+ users already building careers and teams.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-8 sm:flex-row sm:justify-center"
            >
              <Link
                to="/register"
                className="group relative rounded-full bg-white px-12 py-6 text-lg font-bold text-purple-700 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-white/50"
              >
                <span className="relative z-10">Create Free Account</span>
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-full bg-white/30 opacity-0 group-hover:opacity-100"
                />
              </Link>

              <Link
                to="/jobs"
                className="rounded-full border border-white/30 bg-white/20 px-12 py-6 text-lg font-bold backdrop-blur-md transition-all duration-300 hover:bg-white/30"
              >
                Explore Opportunities
              </Link>
            </motion.div>
          </div>
        </Parallax>
      </section>
    </div>
  );
};

export default Landing;
