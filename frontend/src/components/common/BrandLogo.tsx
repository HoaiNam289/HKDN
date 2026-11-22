import React from 'react';

interface BrandLogoProps { compact?: boolean; onDark?: boolean; showTagline?: boolean; className?: string; }

const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false, onDark = false, showTagline = true, className = '' }) => (
  <div className={`flex items-center gap-3 min-w-0 ${className}`}>
    <svg className={`shrink-0 ${compact ? 'w-9 h-9' : 'w-10 h-10'}`} viewBox="0 0 64 64" fill="none" role="img" aria-label="EduCertify logo">
      <rect x="2" y="2" width="60" height="60" rx="14" fill={onDark ? '#ffffff' : '#eef3ff'} />
      <path d="M10 21 32 10l22 11-22 11-22-11Z" fill="#1d4ed8" />
      <path d="M17 24v14M17 42a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="#173f9f" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M21 27v12c0 9 6 14 11 16 5-2 11-7 11-16V27L32 33l-11-6Z" fill="#1d4ed8" />
      <path d="m26 41 5 5 9-11" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 49c10 8 28 8 40-2" stroke="#b7791f" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
    {!compact && (
      <div className="flex flex-col min-w-0">
        <span className={`text-[18px] font-semibold tracking-[-0.03em] leading-none whitespace-nowrap ${onDark ? 'text-white' : 'text-[#172033]'}`}>
          <span className={onDark ? 'text-white' : 'text-[#1d4ed8]'}>Edu</span>Certify
        </span>
        {showTagline && <span className={`text-[10px] mt-1 whitespace-nowrap ${onDark ? 'text-blue-100' : 'text-[#6d7a8d]'}`}>Xác thực chứng chỉ & học liệu số</span>}
      </div>
    )}
  </div>
);

export default BrandLogo;
