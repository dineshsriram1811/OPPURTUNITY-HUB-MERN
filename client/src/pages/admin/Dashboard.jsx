import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiBriefcase, FiX, FiList, FiClock, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CompanyLogo from '../../components/common/CompanyLogo';
import toast from 'react-hot-toast';
import { timeAgo } from '../../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1677D2', '#19D3AE', '#123B73', '#E8FBF6', '#19A974', '#62748A', '#0E2E5B'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/admin/stats');
        setData(res.data);
      } catch (_) {
        toast.error('Failed to load dashboard data');
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" color="#1677D2" /></div>;

  const { stats, recentUsers, recentOpps } = data || {};

  const statCards = [
    { label: 'Total Users',        value: stats?.totalUsers,        icon: FiUsers, link: '/admin/users' },
    { label: 'Opportunities',      value: stats?.totalOpportunities,icon: FiBriefcase, link: '/admin/opportunities' },
    { label: 'Categories',         value: stats?.totalCategories,   icon: FiList, link: '/admin/categories' },
    { label: 'Active Opps',        value: stats?.activeOpps,        icon: FiActivity, link: '/admin/opportunities' },
    { label: 'Expired Opps',       value: stats?.expiredOpps,       icon: FiX, link: '/admin/opportunities' },
    { label: 'New This Month',     value: stats?.newOppsThisMonth,  icon: FiTrendingUp, link: '/admin/opportunities' },
  ];

  return (
    <div className="page-enter max-w-6xl mx-auto pb-12 font-sans">
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] font-display">
            Admin Overview
          </h1>
          <p className="text-[#62748A] text-sm font-medium mt-1">Platform operations, analytics, and listings management.</p>
        </div>
        <div className="flex gap-3 font-sans">
          <Link to="/admin/opportunities" className="btn-secondary py-2.5 px-4 text-xs uppercase tracking-wider">
            <FiBriefcase size={14} /> Manage Opportunities
          </Link>
          <Link to="/admin/users" className="btn-primary py-2.5 px-4 text-xs uppercase tracking-wider">
            <FiUsers size={14} /> Manage Users
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((s, i) => (
          <Link to={s.link} key={s.label} className="no-underline">
            <motion.div
              className="bg-white rounded-2xl border border-[#D9E5EF] hover:border-[#1677D2] p-4 shadow-sm hover:shadow-md transition-all h-full"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#1677D2] flex items-center justify-center mb-3 border border-[#19D3AE]">
                <s.icon size={18} className="text-[#19D3AE]" />
              </div>
              <div className="text-[0.7rem] text-[#62748A] font-bold uppercase tracking-wider mb-1 font-sans">{s.label}</div>
              <div className="text-xl font-extrabold text-[#102A43] font-display">{s.value ?? 0}</div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
        {/* Left Column: Recent Items */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Opportunities */}
          <div className="bg-white rounded-2xl border border-[#D9E5EF] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#D9E5EF]">
              <h2 className="text-base font-extrabold text-[#102A43] font-display">Recently Added Opportunities</h2>
              <Link to="/admin/opportunities" className="text-xs font-bold uppercase tracking-wider text-[#1677D2] hover:underline">
                View All
              </Link>
            </div>
            
            {recentOpps?.length === 0 ? (
              <div className="text-center py-8 text-[#62748A] text-sm">No recent opportunities</div>
            ) : (
              <div className="divide-y divide-[#D9E5EF]">
                {recentOpps?.map(opp => (
                  <div key={opp._id} className="py-3.5 flex items-center gap-4">
                    <CompanyLogo opportunity={opp} className="w-10 h-10 rounded-xl" textClassName="text-xs" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-[#102A43] truncate">{opp.title}</div>
                      <div className="text-xs font-medium text-[#62748A] truncate">{opp.companyName} &bull; <span className="capitalize">{opp.type}</span></div>
                    </div>
                    <div className="text-xs font-medium text-[#94A3B8] flex items-center gap-1 flex-shrink-0">
                      <FiClock size={13} /> {timeAgo(opp.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl border border-[#D9E5EF] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#D9E5EF]">
              <h2 className="text-base font-extrabold text-[#102A43] font-display">Newly Registered Users</h2>
              <Link to="/admin/users" className="text-xs font-bold uppercase tracking-wider text-[#1677D2] hover:underline">
                View All
              </Link>
            </div>
            
            {recentUsers?.length === 0 ? (
              <div className="text-center py-8 text-[#62748A] text-sm">No recent users</div>
            ) : (
              <div className="divide-y divide-[#D9E5EF]">
                {recentUsers?.map(user => (
                  <div key={user._id} className="py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#1677D2] text-[#19D3AE] flex items-center justify-center font-extrabold text-sm border border-[#19D3AE]">
                        {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : user.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#102A43]">{user.name}</div>
                        <div className="text-xs text-[#94A3B8] font-medium">{user.email}</div>
                      </div>
                    </div>
                    <span className="badge badge-mint capitalize text-xs">{user.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Charts */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-[#D9E5EF] p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-[#102A43] font-display mb-4 flex items-center gap-2 pb-3 border-b border-[#D9E5EF]">
              <FiList className="text-[#1677D2]" /> Category Breakdown
            </h2>
            <div className="h-56 w-full">
              {stats?.categoryStats?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.categoryStats} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2}>
                      {stats.categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-[#94A3B8] text-xs">No category data</div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {stats?.categoryStats?.map((cat, i) => (
                <div key={cat._id} className="flex items-center gap-1.5 text-xs font-bold text-[#102A43] capitalize bg-[#F3F8FC] px-2.5 py-1 rounded-lg border border-[#D9E5EF]">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {cat._id} ({cat.count})
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#D9E5EF] p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-[#102A43] font-display mb-4 flex items-center gap-2 pb-3 border-b border-[#D9E5EF]">
              <FiTrendingUp className="text-[#1677D2]" /> Monthly Postings
            </h2>
            <div className="h-48 w-full">
              {stats?.monthlyOpps?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.monthlyOpps.map(d => ({ name: `${d._id.month}/${d._id.year}`, count: d.count }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#D9E5EF" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#62748A' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#62748A' }} />
                    <RechartsTooltip cursor={{ fill: '#EBF3FA' }} contentStyle={{ borderRadius: '8px', border: '1px solid #D9E5EF', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="count" fill="#1677D2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-[#94A3B8] text-xs">No monthly data</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
