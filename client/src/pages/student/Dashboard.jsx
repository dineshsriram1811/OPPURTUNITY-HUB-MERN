import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiFileText, FiBookmark, FiBriefcase, FiArrowRight, FiClock, FiZap, FiCheckCircle } from 'react-icons/fi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CompanyLogo from '../../components/common/CompanyLogo';
import OpportunityCard from '../../components/opportunities/OpportunityCard';
import { timeAgo, capitalize } from '../../utils/helpers';

const StatCard = ({ icon: Icon, label, value, subtext, link, bgClass = 'bg-white' }) => (
  <Link to={link || '#'} className="no-underline">
    <motion.div
      whileHover={{ y: -3 }}
      className={`${bgClass} rounded-2xl border border-[#D9E5EF] p-5 shadow-sm hover:border-[#1677D2] hover:shadow-md transition-all flex items-center gap-4 h-full`}
    >
      <div className="w-12 h-12 rounded-full bg-[#1677D2] flex items-center justify-center flex-shrink-0 shadow-sm border border-[#19D3AE]">
        <Icon size={20} className="text-[#19D3AE]" />
      </div>
      <div>
        <div className="text-[0.7rem] font-bold uppercase tracking-wider text-[#62748A] mb-0.5 font-sans">{label}</div>
        <div className="text-3xl font-extrabold text-[#102A43] font-display leading-none mb-1">{value}</div>
        {subtext && <div className="text-[0.7rem] font-medium text-[#62748A] font-sans">{subtext}</div>}
      </div>
    </motion.div>
  </Link>
);

const getStatusBadge = (status) => {
  const st = (status || '').toLowerCase();
  if (st.includes('shortlisted') || st.includes('interview')) {
    return 'bg-[#E8FBF6] text-[#0C6B58] border border-[#19D3AE]';
  }
  if (st.includes('reject') || st.includes('closed')) {
    return 'bg-[#FDF2F2] text-[#E05252] border border-[#F8B4B4]';
  }
  if (st.includes('pending') || st.includes('under_review')) {
    return 'bg-[#FFF8E6] text-[#B47D00] border border-[#F4B942]';
  }
  return 'bg-[#EBF3FA] text-[#123B73] border border-[#BFE0F8]';
};

const StudentDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats]         = useState(null);
  const [apps, setApps]           = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes, recRes] = await Promise.all([
          api.get('/users/stats'),
          api.get('/applications/my?limit=5'),
          api.get('/opportunities?limit=3&sort=latest'),
        ]);
        setStats(statsRes.data.stats);
        setApps(appsRes.data.applications || []);
        setRecommended(recRes.data.opportunities || []);
      } catch (_) {} finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner size="lg" text="Loading dashboard..." color="#1677D2" /></div>;

  const statCards = [
    { icon: FiBriefcase, label: 'Total Opportunities',  value: stats?.totalOpportunities || 0, subtext: 'Active listings catalog', link: '/student/opportunities', bgClass: 'bg-white' },
    { icon: FiBookmark,  label: 'Saved Opportunities',  value: stats?.bookmarks || 0,          subtext: 'Bookmarked for later',   link: '/student/applications',  bgClass: 'bg-[#E8FBF6]' },
    { icon: FiFileText,  label: 'Applied Opportunities',value: stats?.totalApplications || 0, subtext: 'Submitted applications', link: '/student/applications',  bgClass: 'bg-[#EBF3FA]' },
    { icon: FiClock,     label: 'Deadlines This Week',  value: stats?.deadlinesThisWeek || 0,  subtext: 'Upcoming target dates', link: '/student/calendar',      bgClass: 'bg-white' },
  ];

  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <div className="page-enter max-w-7xl mx-auto pb-12 font-sans">
      {/* ── HERO BANNER SECTION ─────────────────────────────────────────────── */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#123B73] via-[#1677D2] to-[#1E88E5] p-8 sm:p-10 text-white border border-[#0E2E5B] shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Abstract Mint Geometric Circles in Background */}
        <div className="absolute -right-10 -bottom-10 w-56 h-56 rounded-full bg-[#19D3AE]/15 blur-2xl pointer-events-none" />
        <div className="absolute right-32 top-0 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#E8FBF6] mb-3">
            <FiZap className="text-[#19D3AE]" /> Career Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display mb-2 leading-tight">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-blue-100 text-sm sm:text-base font-normal leading-relaxed">
            Your career opportunities, applications and deadlines — all in one place.
          </p>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <Link
            to="/student/opportunities"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm no-underline transition-all shadow-lg hover:shadow-xl cursor-pointer"
            style={{ background: '#19D3AE', color: '#102A43' }}
          >
            <FiBriefcase size={17} /> Browse Opportunities <FiArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Profile completion warning banner */}
      {(stats?.profileCompletion ?? 0) < 80 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-l-4 border-l-[#19D3AE] border border-[#D9E5EF] rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#E8FBF6] flex items-center justify-center text-[#19A974] font-extrabold text-lg flex-shrink-0">
              <FiCheckCircle size={20} />
            </div>
            <div>
              <div className="font-bold text-sm text-[#102A43] mb-0.5">Profile Completion &bull; {stats?.profileCompletion}%</div>
              <div className="text-[#62748A] text-xs font-medium">Complete your details to increase visibility to recruiters.</div>
            </div>
          </div>
          <Link to="/student/profile" className="btn-outline py-2 px-4 text-xs font-bold uppercase tracking-wider flex-shrink-0">
            Complete Profile
          </Link>
        </motion.div>
      )}

      {/* ── ALTERNATING STATISTICS CARDS ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* ── RECENT APPLICATIONS SECTION ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#D9E5EF] p-6 shadow-sm mb-10">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#D9E5EF]">
          <h2 className="text-xl font-extrabold text-[#102A43] font-display">Recent Applications</h2>
          <Link to="/student/applications" className="text-xs font-bold uppercase tracking-wider text-[#1677D2] hover:underline flex items-center gap-1">
            View All &rarr;
          </Link>
        </div>

        {apps.length === 0 ? (
          <div className="text-center py-12 text-[#62748A]">
            <FiFileText size={38} className="mx-auto mb-3 text-[#94A3B8] block" />
            <p className="m-0 text-sm font-semibold text-[#102A43] mb-4">No applications submitted yet</p>
            <Link to="/student/opportunities" className="btn-primary py-2.5 px-5 text-xs uppercase tracking-wider">
              Browse Jobs & Roles
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#D9E5EF]">
            {apps.map((app) => (
              <motion.div
                key={app._id}
                whileHover={{ backgroundColor: '#F3F8FC' }}
                className="py-3.5 px-2 rounded-xl flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <CompanyLogo opportunity={app.opportunity} className="w-11 h-11" textClassName="text-xs" />
                  <div className="min-w-0">
                    <div className="font-extrabold text-sm text-[#102A43] truncate font-sans">{app.opportunity?.title}</div>
                    <div className="text-xs font-semibold text-[#62748A]">{app.opportunity?.companyName} &bull; Applied {timeAgo(app.appliedAt)}</div>
                  </div>
                </div>
                <span className={`badge text-xs capitalize flex-shrink-0 ${getStatusBadge(app.status)}`}>
                  {capitalize(app.status)}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── RECOMMENDED FOR YOU PREVIEW ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-[#102A43] font-display">Recommended For You</h2>
          <Link to="/student/opportunities" className="text-xs font-bold uppercase tracking-wider text-[#1677D2] hover:underline">
            Explore All Catalog &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommended.map((opp) => (
            <OpportunityCard key={opp._id} opportunity={opp} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
