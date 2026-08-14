import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiXCircle, FiBookmark, FiExternalLink } from 'react-icons/fi';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CompanyLogo from '../../components/common/CompanyLogo';
import { timeAgo, capitalize, getStatusClass } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const Applications = () => {
  const [activeTab, setActiveTab] = useState('applied');
  const [applications, setApplications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appRes, bookRes] = await Promise.all([
          api.get('/applications/my'),
          api.get('/opportunities/bookmarks'),
        ]);
        setApplications(appRes.data.applications);
        setBookmarks(bookRes.data.bookmarks);
      } catch (err) {
        console.error('Failed to fetch applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFilteredItems = () => {
    if (activeTab === 'saved') {
      return bookmarks.map(b => ({ ...b, isBookmark: true }));
    }
    if (activeTab === 'closed') {
      return applications.filter(a => ['rejected', 'withdrawn', 'closed'].includes(a.status));
    }
    return applications.filter(a => !['rejected', 'withdrawn', 'closed'].includes(a.status));
  };

  const items = getFilteredItems();

  return (
    <div className="page-enter max-w-5xl mx-auto pb-12 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] font-display mb-1">
          Application Tracker
        </h1>
        <p className="text-[#62748A] text-sm font-medium">Track saved opportunities, active job applications, and status history.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-8 border-b border-[#D9E5EF]">
        {['applied', 'saved', 'closed'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-bold text-sm uppercase tracking-wider transition-colors relative cursor-pointer border-none bg-none font-sans ${
              activeTab === tab ? 'text-[#1677D2]' : 'text-[#62748A] hover:text-[#102A43]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="app-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1677D2]" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" color="#1677D2" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#D9E5EF] shadow-sm p-8">
          {activeTab === 'saved' && <FiBookmark className="mx-auto text-4xl text-[#94A3B8] mb-4 block" />}
          {activeTab === 'applied' && <FiCheckCircle className="mx-auto text-4xl text-[#94A3B8] mb-4 block" />}
          {activeTab === 'closed' && <FiXCircle className="mx-auto text-4xl text-[#94A3B8] mb-4 block" />}
          <h3 className="text-xl font-extrabold text-[#102A43] font-display mb-2">No {activeTab} opportunities found</h3>
          <p className="text-[#62748A] text-sm max-w-md mx-auto mb-6">Explore the opportunity catalog to find and apply for top roles.</p>
          <Link to="/student/opportunities" className="btn-primary py-3 px-6 text-xs uppercase tracking-wider">
            Browse Opportunities
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => {
            const opp = item.isBookmark ? item.opportunity : item.opportunity;
            if (!opp) return null;
            
            return (
              <motion.div 
                key={item._id} 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-[#D9E5EF] hover:border-[#1677D2] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <CompanyLogo opportunity={opp} className="w-12 h-12" textClassName="text-sm" />
                  <div>
                    <h3 className="font-bold text-[#102A43] text-lg font-sans leading-snug">{opp.title}</h3>
                    <div className="text-xs font-medium text-[#62748A] flex items-center gap-2 mt-1 font-sans">
                      <span>{opp.companyName}</span>
                      <span>&bull;</span>
                      <span className="capitalize">{opp.type}</span>
                      <span>&bull;</span>
                      <span>{opp.location || opp.locationType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {!item.isBookmark ? (
                    <div className="text-right flex-1 sm:flex-none">
                      <span className={`badge ${getStatusClass(item.status)} capitalize text-xs`}>
                        {activeTab === 'closed' ? 'Closed' : item.status.replace('_', ' ')}
                      </span>
                      <div className="text-[0.7rem] font-medium text-[#94A3B8] mt-1 font-sans">Applied {timeAgo(item.appliedAt)}</div>
                    </div>
                  ) : (
                    <div className="text-right flex-1 sm:flex-none">
                      <span className="badge badge-mint text-xs">Saved</span>
                      <div className="text-[0.7rem] font-medium text-[#94A3B8] mt-1 font-sans">Saved {timeAgo(item.createdAt)}</div>
                    </div>
                  )}
                  <Link to={`/student/opportunities/${opp._id}`} className="btn-secondary px-3.5 py-2 text-xs uppercase tracking-wider flex-shrink-0">
                    View <FiExternalLink size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applications;
