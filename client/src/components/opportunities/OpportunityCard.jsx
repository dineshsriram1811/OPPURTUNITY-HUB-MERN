import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiDollarSign, FiBriefcase, FiBookmark } from 'react-icons/fi';
import { timeAgo } from '../../utils/helpers';
import CompanyLogo from '../common/CompanyLogo';

const OpportunityCard = ({ opportunity, isBookmarked, onBookmarkToggle }) => {
  const location = useLocation();
  const detailsPath = location.pathname.startsWith('/student')
    ? `/student/opportunities/${opportunity._id}`
    : `/opportunities/${opportunity._id}`;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-[#D9E5EF] hover:border-[#1677D2] p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all h-full font-sans"
    >
      <div>
        {/* Header row with Company Logo, type badge, bookmark button */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <CompanyLogo opportunity={opportunity} className="w-12 h-12" />

          <div className="flex items-center gap-2">
            <span className="bg-[#E8FBF6] text-[#0C6B58] border border-[#19D3AE] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-sans">
              {opportunity.type}
            </span>
            {onBookmarkToggle && (
              <button
                onClick={(e) => { e.preventDefault(); onBookmarkToggle(opportunity._id); }}
                className={`p-2 rounded-xl border border-[#D9E5EF] transition-colors cursor-pointer ${
                  isBookmarked ? 'bg-[#19D3AE] text-[#102A43] border-[#19D3AE]' : 'bg-white text-[#62748A] hover:text-[#1677D2]'
                }`}
                title={isBookmarked ? 'Saved' : 'Save Opportunity'}
              >
                <FiBookmark size={16} fill={isBookmarked ? '#102A43' : 'none'} />
              </button>
            )}
          </div>
        </div>

        {/* Title & Company */}
        <Link to={detailsPath} className="no-underline">
          <h3 className="text-lg font-bold text-[#102A43] mb-1 hover:text-[#1677D2] transition-colors line-clamp-2 font-sans leading-snug">
            {opportunity.title}
          </h3>
        </Link>
        <div className="text-xs font-semibold text-[#62748A] mb-4">
          {opportunity.companyName}
        </div>

        {/* Info pills */}
        <div className="flex flex-wrap gap-y-2 gap-x-4 mb-4 text-xs font-medium text-[#62748A]">
          <div className="flex items-center gap-1.5">
            <FiMapPin className="text-[#1677D2]" />
            <span className="capitalize">{opportunity.locationType || opportunity.location || 'Remote'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiBriefcase className="text-[#1677D2]" />
            {opportunity.category}
          </div>
          {opportunity.salaryMax && (
            <div className="flex items-center gap-1.5 font-bold text-[#102A43]">
              <FiDollarSign className="text-emerald-600" />
              {opportunity.salaryMin ? `$${opportunity.salaryMin} - ` : ''}${opportunity.salaryMax}
            </div>
          )}
        </div>
        
        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {opportunity.skills?.slice(0, 3).map((skill, i) => (
            <span key={i} className="skill-tag text-[0.75rem] py-0.5 px-2.5 bg-[#F3F8FC] text-[#102A43] border border-[#D9E5EF] font-semibold">
              {skill}
            </span>
          ))}
          {opportunity.skills?.length > 3 && (
            <span className="skill-tag text-[0.75rem] py-0.5 px-2.5 bg-[#F3F8FC] text-[#102A43] border border-[#D9E5EF] font-semibold">
              +{opportunity.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#D9E5EF]">
        <div className="text-xs font-medium text-[#62748A] flex items-center gap-1.5">
          <FiClock size={13} className="text-[#94A3B8]" /> {timeAgo(opportunity.createdAt)}
        </div>
        <Link to={detailsPath} className="btn-primary py-2 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider no-underline">
          Apply Now
        </Link>
      </div>
    </motion.div>
  );
};

export default OpportunityCard;
