import React from 'react';

const LoadingSpinner = ({ size = 'md', text, color = '#1677D2' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} rounded-full animate-spin border-t-transparent`}
        style={{ borderColor: color, borderTopColor: 'transparent' }}
      />
      {text && <span className="text-xs font-semibold text-[#62748A] font-sans">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
