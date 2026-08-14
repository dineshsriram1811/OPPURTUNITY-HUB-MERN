import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiZap, FiArrowRight, FiTrendingUp, FiBriefcase, FiBookOpen, FiCpu, FiUsers, FiCheckCircle, FiCompass, FiShield, FiTarget } from 'react-icons/fi';
import api from '../services/api';

const heroStats = [
  { value: '50K+', label: 'Students Empowered' },
  { value: '15K+', label: 'Verified Listings' },
  { value: '94%', label: 'Success Rate' },
];

const CATEGORIES = [
  { icon: FiBriefcase,  label: 'Jobs',         slug: 'jobs' },
  { icon: FiTrendingUp, label: 'Internships',  slug: 'internships' },
  { icon: FiUsers,      label: 'Freelancing',  slug: 'freelancing' },
  { icon: FiCpu,        label: 'Hackathons',   slug: 'hackathons' },
  { icon: FiBookOpen,   label: 'Scholarships', slug: 'scholarships' },
];

const features = [
  {
    icon: FiShield,
    title: 'Verified Opportunities Only',
    desc: 'Every listing is vetted to ensure legitimate companies, transparent roles, and zero spam.',
  },
  {
    icon: FiTarget,
    title: 'Application & Deadline Tracker',
    desc: 'Never miss a key date. Track your saved opportunities and application deadlines in one calendar.',
  },
  {
    icon: FiCompass,
    title: 'Direct Career Growth',
    desc: 'Filter opportunities matched precisely to your technical skills, work mode preference, and goals.',
  },
];

const LandingPage = () => {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [totalFeatured, setTotalFeatured] = useState(0);
  const [loadingCounts, setLoadingCounts] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await api.get('/opportunities?limit=1');

        const counts = await Promise.all(
          CATEGORIES.map(async (cat) => {
            try {
              const r = await api.get(`/opportunities?category=${cat.label}&limit=1`);
              return { label: cat.label, count: r.data.total || 0 };
            } catch (_) { return { label: cat.label, count: 0 }; }
          })
        );

        const countMap = {};
        counts.forEach(({ label, count }) => { countMap[label] = count; });
        setCategoryCounts(countMap);

        const featuredRes = await api.get('/opportunities?isFeatured=true&limit=1');
        setTotalFeatured(featuredRes.data.total || 0);
      } catch (_) {
        setCategoryCounts({});
        setTotalFeatured(0);
      } finally {
        setLoadingCounts(false);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="bg-[#F7FAFC] text-[#111827] min-h-screen">
      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0B5FA5] to-[#1677C8] text-white overflow-hidden shadow-md">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-[#18E0C0]/30 rounded-full text-xs font-bold text-[#18E0C0] mb-8 uppercase tracking-widest">
              <FiZap size={14} className="text-[#18E0C0]" />
              Discover. Apply. Succeed.
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight font-display">
              Find Your <br />
              <span className="text-[#18E0C0] relative inline-block">
                Next Opportunity.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Find verified jobs, internships, freelancing opportunities, hackathons and scholarships — all in one powerful student platform.
            </p>

            <div className="flex flex-wrap gap-4 justify-center items-center">
              <Link to="/opportunities" className="btn-secondary px-8 py-4 text-base shadow-lg">
                Explore Opportunities <FiArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn-primary px-8 py-4 text-base bg-white text-[#1677C8] hover:bg-blue-50 border-none shadow-lg">
                Get Started
              </Link>
            </div>
          </motion.div>

          {/* Hero stats banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-20 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl"
          >
            {heroStats.map((s) => (
              <div key={s.label} className="text-center p-3">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#18E0C0] font-display mb-1">{s.value}</div>
                <div className="text-xs font-bold text-blue-100 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Categories Section ────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F7FAFC] text-[#111827]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] font-display mb-3">
              Explore Categories
            </h2>
            <p className="text-[#475569] text-base max-w-xl mx-auto">
              Curated opportunities across all major pathways for students and early professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {CATEGORIES.map((cat, i) => {
              const count = categoryCounts[cat.label] ?? 0;
              return (
                <motion.div
                  key={cat.label}
                  whileHover={{ y: -6 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link to={`/opportunities/${cat.slug}`} className="no-underline block h-full">
                    <div className="bg-white p-6 rounded-2xl border border-[#DDE5EA] hover:border-[#1677C8] shadow-sm hover:shadow-xl transition-all h-full flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-[#1677C8] flex items-center justify-center mb-5">
                          <cat.icon size={22} className="text-[#18E0C0]" />
                        </div>
                        <h3 className="font-extrabold text-lg text-[#111827] font-display mb-2">{cat.label}</h3>
                      </div>
                      {loadingCounts ? (
                        <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse mt-3" />
                      ) : (
                        <div className="text-xs font-extrabold uppercase tracking-wider text-[#1677C8] mt-3">
                          {count === 0 ? 'Explore' : `${count} Active`}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured CTA Banner ───────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0B5FA5] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-3">
            Live Opportunities Waiting For You
          </h2>
          <p className="text-blue-100 text-base mb-8 max-w-xl mx-auto">
            {loadingCounts
              ? 'Loading active listings...'
              : `Browse over ${totalFeatured > 0 ? totalFeatured : 'hundreds of'} active job postings, internships, and hackathons updated daily.`}
          </p>
          <Link to="/opportunities" className="btn-secondary px-8 py-3.5 text-base">
            View All Opportunities <FiArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Why OpportunityHub Section ────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F7FAFC] text-[#111827]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] font-display mb-3">
              Why OpportunityHub?
            </h2>
            <p className="text-[#475569] text-base max-w-xl mx-auto">
              Designed specifically for students seeking quality, transparency, and structure in their career search.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-[#DDE5EA] shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#1677C8] flex items-center justify-center mb-6">
                  <f.icon size={26} className="text-[#18E0C0]" />
                </div>
                <h3 className="text-xl font-extrabold text-[#111827] font-display mb-3">{f.title}</h3>
                <p className="text-[#475569] text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final Call to Action ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0B5FA5] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display mb-6">
            Ready to Take Your Next Step?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of students applying to top roles and managing deadlines seamlessly.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="btn-secondary px-8 py-4 text-base">
              Start Free Today <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 bg-[#073862] border-t border-[#094B83] text-blue-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[#1677C8] flex items-center justify-center">
            <FiZap size={16} className="text-[#18E0C0]" />
          </div>
          <span className="font-extrabold text-white text-lg tracking-tight font-display">
            Opportunity<span className="text-[#18E0C0]">Hub</span>
          </span>
        </div>
        <p className="text-xs text-blue-200 font-medium m-0">
          Discover. Apply. Succeed. &copy; {new Date().getFullYear()} OpportunityHub. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
