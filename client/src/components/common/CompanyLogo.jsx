import React, { useState } from 'react';

const CompanyLogo = ({ opportunity, className = 'w-10 h-10', textClassName = 'text-xs' }) => {
  const [err, setErr] = useState(false);

  const company = opportunity?.companyName || 'Company';
  const logoUrl = opportunity?.companyLogo;

  if (logoUrl && !err) {
    return (
      <img
        src={logoUrl}
        alt={company}
        onError={() => setErr(true)}
        className={`${className} rounded-xl object-contain bg-white p-1 border border-[#D9E5EF] shadow-sm flex-shrink-0`}
      />
    );
  }

  return (
    <div className={`${className} rounded-xl bg-[#1677D2] text-[#19D3AE] font-extrabold flex items-center justify-center border border-[#123B73] shadow-sm flex-shrink-0 font-sans`}>
      <span className={textClassName}>{company[0]?.toUpperCase() || 'C'}</span>
    </div>
  );
};

export default CompanyLogo;
