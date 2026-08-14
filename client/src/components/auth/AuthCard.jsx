import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiZap, FiShield, FiTarget, FiBookmark, FiUserCheck } from 'react-icons/fi';

const trustFeatures = [
  { icon: FiShield,     title: 'Secure & Safe',      desc: 'Your data is protected with top-notch security.' },
  { icon: FiTarget,     title: 'Find Opportunities', desc: 'Discover jobs, internships, hackathons & more.' },
  { icon: FiBookmark,   title: 'Track Applications', desc: 'Track and manage all your applications.' },
  { icon: FiUserCheck,  title: 'Grow Your Career',   desc: 'Learn, connect and grow your career.' },
];

const AuthCard = ({
  children,
  illustration,
  maxWidth = 'max-w-5xl',
  showTrustBar = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#EFF6FF] p-4 sm:p-6 lg:p-10 font-sans selection:bg-[#34D399] selection:text-[#0F172A]">
      {/* Centered Main Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full ${maxWidth} bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col lg:flex-row relative my-auto`}
      >
        {/* LEFT SECTION: Blue Curved Gradient Form Panel */}
        <div className="lg:w-[54%] bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#38BDF8] p-6 sm:p-10 lg:p-12 text-white relative flex flex-col justify-between overflow-hidden">

          {/* S-Curve / Wave Boundary on Desktop */}
          <div className="hidden lg:block absolute -right-1 top-0 bottom-0 w-24 pointer-events-none z-10">
            <svg className="h-full w-full fill-white" viewBox="0 0 100 800" preserveAspectRatio="none">
              <path d="M 100 0 C 20 200, 100 500, 0 800 L 100 800 Z" />
            </svg>
          </div>

          {/* Logo Header */}
          <div className="flex items-center justify-between mb-8 z-20">
            <Link to="/" className="inline-flex items-center gap-3 no-underline group">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <FiZap size={22} className="text-[#34D399]" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight font-display">
                Opportunity<span className="text-[#34D399]">Hub</span>
              </span>
            </Link>
          </div>

          {/* Form Content Slot */}
          <div className="z-20 my-auto">
            {children}
          </div>

          {/* Bottom subtle copyright note */}
          <div className="mt-8 pt-4 border-t border-white/10 text-xs text-blue-100/70 font-medium z-20 flex justify-between items-center">
            <span>&copy; {new Date().getFullYear()} OpportunityHub</span>
            <span>Privacy &bull; Terms</span>
          </div>
        </div>

        {/* RIGHT SECTION: White Visual Illustration Panel */}
        <div className="lg:w-[46%] bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-center relative min-h-[300px] lg:min-h-[540px]">
          
          {/* Top-Right Decorative Dotted Grid */}
          <div className="absolute top-6 right-6 z-0 opacity-60 pointer-events-none">
            <svg width="100" height="100" fill="none" viewBox="0 0 100 100">
              <pattern id="dotPattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="2.5" fill="#BFDBFE" />
              </pattern>
              <rect width="100" height="100" fill="url(#dotPattern)" />
            </svg>
          </div>

          {/* Page Illustration */}
          <div className="z-10 w-full flex items-center justify-center">
            {illustration}
          </div>
        </div>
      </motion.div>

      {/* BOTTOM TRUST FEATURE BAR (as seen in reference image) */}
      {showTrustBar && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="w-full max-w-5xl mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 px-2"
        >
          {trustFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-[#E2E8F0] shadow-sm flex items-start gap-3 hover:border-[#38BDF8] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0 border border-[#BFDBFE]">
                <feat.icon size={20} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-[#0F172A] font-display">{feat.title}</h4>
                <p className="text-[0.7rem] text-[#64748B] font-medium leading-tight mt-0.5">{feat.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AuthCard;
