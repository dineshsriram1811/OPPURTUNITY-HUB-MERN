import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiDollarSign, FiBriefcase, FiBookmark, FiShare2, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ReportModal from '../../components/opportunities/ReportModal';
import CompanyLogo from '../../components/common/CompanyLogo';
import { timeAgo } from '../../utils/helpers';

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

const decodeEntities = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ');
};

const getSanitizedHtml = (htmlContent) => {
  if (!htmlContent) return '';
  const decoded = decodeEntities(htmlContent);
  const hasHtml = /<[a-z][\s\S]*>/i.test(decoded);
  const formattedContent = hasHtml ? decoded : decoded.replace(/\n/g, '<br />');
  return DOMPurify.sanitize(formattedContent, {
    ADD_ATTR: ['target', 'rel'],
  });
};

const OpportunityDetails = () => {
  const { id } = useParams();
  const { user } = useSelector(state => state.auth);
  const [opp, setOpp] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const fetchOpp = async () => {
      try {
        const res = await api.get(`/opportunities/${id}`);
        setOpp(res.data.opportunity);
        setIsBookmarked(res.data.isBookmarked);
        setHasApplied(res.data.hasApplied);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpp();
    window.scrollTo(0, 0);
  }, [id]);

  const handleBookmark = async () => {
    if (!user) return toast.error('Please login to bookmark');
    try {
      const res = await api.post(`/opportunities/${id}/bookmark`);
      setIsBookmarked(res.data.isBookmarked);
      toast.success(res.data.message);
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleApply = async () => {
    if (!user) return toast.error('Please login to apply');
    setApplying(true);
    try {
      if (!hasApplied) {
        await api.post(`/applications/${id}`);
        setHasApplied(true);
      }
      if (opp.applyLink) {
        window.open(opp.applyLink, '_blank', 'noopener,noreferrer');
      }
      toast.success('Successfully applied!');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.toLowerCase().includes('already applied')) {
        setHasApplied(true);
        if (opp.applyLink) {
          window.open(opp.applyLink, '_blank', 'noopener,noreferrer');
        }
      } else {
        toast.error(msg || 'Failed to apply');
      }
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return <div className="py-20 flex justify-center"><LoadingSpinner size="lg" color="#1677D2" /></div>;
  if (!opp) return <div className="py-20 text-center text-xl font-extrabold text-[#102A43] font-display">Opportunity not found</div>;

  const allSkills = Array.from(new Set([...(opp.requiredSkills || []), ...(opp.skills || [])])).filter(Boolean);

  return (
    <div className="page-enter max-w-5xl mx-auto pb-12 px-4 sm:px-6 pt-4 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#D9E5EF] overflow-hidden shadow-sm mb-8">
        <div className="h-36 sm:h-48 bg-gradient-to-r from-[#123B73] via-[#1677D2] to-[#1E88E5] w-full relative p-6 border-b border-[#0E2E5B] flex justify-end items-start">
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center hover:bg-[#19D3AE] hover:text-[#102A43] transition cursor-pointer"
              title="Share"
            >
              <FiShare2 size={18} />
            </button>
            <button
              onClick={handleBookmark}
              className={`w-10 h-10 rounded-full border transition cursor-pointer flex items-center justify-center ${
                isBookmarked ? 'bg-[#19D3AE] text-[#102A43] border-[#19D3AE]' : 'bg-white/20 border-white/30 text-white hover:bg-[#19D3AE] hover:text-[#102A43]'
              }`}
              title={isBookmarked ? 'Saved' : 'Save Opportunity'}
            >
              <FiBookmark size={18} fill={isBookmarked ? '#102A43' : 'none'} />
            </button>
          </div>
        </div>
        
        <div className="px-6 sm:px-10 pb-8 relative">
          <CompanyLogo opportunity={opp} className="w-24 h-24 sm:w-32 sm:h-32 -mt-12 sm:-mt-16 mb-4 shadow-xl" textClassName="text-2xl sm:text-3xl" />
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#102A43] font-display mb-2">{opp.title}</h1>
              <div className="text-base font-semibold text-[#62748A] mb-4 font-sans">
                {opp.companyName}
              </div>
              
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#62748A] font-sans">
                <div className="flex items-center gap-1.5"><FiBriefcase className="text-[#1677D2]" /> <span className="capitalize">{opp.type}</span></div>
                <div className="flex items-center gap-1.5"><FiMapPin className="text-[#1677D2]" /> <span className="capitalize">{opp.workMode || opp.locationType}</span> • {opp.location || 'Anywhere'}</div>
                {opp.salary ? (
                  <div className="flex items-center gap-1.5 font-bold text-[#102A43]">
                    <FiDollarSign className="text-emerald-600" /> {opp.salary}
                  </div>
                ) : opp.salaryMax ? (
                  <div className="flex items-center gap-1.5 font-bold text-[#102A43]">
                    <FiDollarSign className="text-emerald-600" /> {opp.salaryMin ? `$${opp.salaryMin} - ` : ''}${opp.salaryMax}
                  </div>
                ) : null}
                <div className="flex items-center gap-1.5"><FiClock className="text-[#94A3B8]" /> Posted {timeAgo(opp.createdAt || opp.postedDate)}</div>
              </div>
            </div>
            
            <div className="flex-shrink-0 flex flex-col gap-3">
              {hasApplied ? (
                <button disabled className="btn-secondary min-w-[160px] justify-center bg-[#E8FBF6] text-[#0C6B58] border-[#19D3AE] opacity-100 cursor-default font-semibold">
                  <FiCheckCircle size={18} /> Applied
                </button>
              ) : (
                <button onClick={handleApply} disabled={applying} className="btn-primary min-w-[160px] justify-center py-3.5 px-6 text-sm font-semibold uppercase tracking-wider rounded-xl cursor-pointer">
                  {applying ? <LoadingSpinner size="sm" color="#FFFFFF" /> : 'Apply Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl border border-[#D9E5EF] p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-extrabold text-[#102A43] font-display mb-4 pb-2 border-b border-[#D9E5EF]">
              Job Description
            </h3>
            <div
              className="prose max-w-none text-[#62748A] leading-relaxed font-normal"
              dangerouslySetInnerHTML={{ __html: getSanitizedHtml(opp.description || 'Description not provided.') }}
            />
          </section>

          {opp.eligibility && (
            <section className="bg-white rounded-2xl border border-[#D9E5EF] p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-extrabold text-[#102A43] font-display mb-4 pb-2 border-b border-[#D9E5EF]">
                Eligibility
              </h3>
              <div
                className="prose max-w-none text-[#62748A] leading-relaxed font-normal"
                dangerouslySetInnerHTML={{ __html: getSanitizedHtml(opp.eligibility) }}
              />
            </section>
          )}

          {allSkills.length > 0 && (
            <section className="bg-white rounded-2xl border border-[#D9E5EF] p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-extrabold text-[#102A43] font-display mb-4 pb-2 border-b border-[#D9E5EF]">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill, i) => (
                  <span key={i} className="px-3.5 py-1.5 bg-[#1677D2] text-white font-bold text-xs rounded-xl font-sans">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-[#D9E5EF] p-6 shadow-sm">
            <h3 className="font-extrabold text-[#102A43] font-display mb-4 pb-2 border-b border-[#D9E5EF] text-base">
              Key Details
            </h3>
            <div className="space-y-4 text-sm font-sans">
              <div>
                <div className="text-xs font-semibold text-[#62748A] uppercase tracking-wider mb-1">Category</div>
                <div className="font-bold text-[#102A43] capitalize">{opp.category || opp.type || 'Jobs'}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-[#62748A] uppercase tracking-wider mb-1">Work Mode</div>
                <div className="font-bold text-[#102A43] capitalize">{opp.workMode || opp.locationType || 'Remote'}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-[#62748A] uppercase tracking-wider mb-1">Location</div>
                <div className="font-bold text-[#102A43]">{opp.location || 'Anywhere / Remote'}</div>
              </div>
              {opp.salary ? (
                <div>
                  <div className="text-xs font-semibold text-[#62748A] uppercase tracking-wider mb-1">Compensation</div>
                  <div className="font-bold text-[#1677D2]">{opp.salary}</div>
                </div>
              ) : null}
              {opp.applicationDeadline && (
                <div>
                  <div className="text-xs font-semibold text-[#62748A] uppercase tracking-wider mb-1">Application Deadline</div>
                  <div className="font-bold text-[#E05252]">{new Date(opp.applicationDeadline).toLocaleDateString()}</div>
                </div>
              )}
            </div>
          </section>

          <button 
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 text-xs font-semibold text-[#62748A] hover:text-[#E05252] mx-auto transition-colors cursor-pointer border-none bg-none font-sans"
          >
            <FiAlertTriangle /> Report this opportunity
          </button>
        </div>
      </div>

      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} opportunityId={opp._id} />
    </div>
  );
};

export default OpportunityDetails;
