import React from 'react';

export default function Logo({ size = 'md', showTagline = false, className = '' }) {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      {/* Brand Icon: Connected Heart + People + Leaf */}
      <div 
        className={`${iconSizes[size] || iconSizes.md} rounded-xl bg-[#16A36A] flex items-center justify-center text-white shadow-sm shrink-0`}
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-5 h-5 text-white"
        >
          {/* Heart outline with sprout leaf center */}
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M12 9v4" strokeWidth="2.4" />
          <path d="M10 11c1-1 3-1 4 0" strokeWidth="2.2" />
        </svg>
      </div>

      <div>
        <div className="flex items-center">
          <span className={`font-extrabold tracking-tight text-slate-900 ${textSizes[size] || textSizes.md}`}>
            Impact<span className="text-[#16A36A]">Connect</span>
          </span>
        </div>
        {showTagline && (
          <p className="text-[11px] text-slate-500 font-medium tracking-tight -mt-0.5">
            Connecting People. Creating Impact.
          </p>
        )}
      </div>
    </div>
  );
}
