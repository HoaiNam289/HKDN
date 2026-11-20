import React from 'react';

interface BrandLogoProps {
  compact?: boolean;
  onDark?: boolean;
  showTagline?: boolean;
  className?: string;
}

/** EduCertify brand mark inspired by the supplied graduation-cap and shield logo. */
const BrandLogo: React.FC<BrandLogoProps> = ({
  compact = false,
  onDark = false,
  showTagline = true,
  className = '',
}) => (
  <div className={`flex items-center gap-2 min-w-0 ${className}`}>
    <svg
      className={`shrink-0 drop-shadow-sm ${compact ? 'w-9 h-9' : 'w-10 h-10'}`}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="EduCertify logo"
    >
      <defs>
        <linearGradient id="brand-shield-gradient" x1="16" y1="18" x2="52" y2="57" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0EA5E9" />
          <stop offset="0.55" stopColor="#2563EB" />
          <stop offset="1" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="62" height="62" rx="15" fill="white" />
      <path d="M10 20L29 10L51 18L30 29L10 20Z" fill="#2563EB" />
      <path d="M16 22V35" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16" cy="38" r="2.7" fill="#1E3A8A" />
      <path d="M20 25L33 31L47 25V39C47 47 40 54 33 57C26 54 20 47 20 39V25Z" fill="url(#brand-shield-gradient)" />
      <path d="M26 40L31 45L41 33" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 46C21 56 39 58 50 47C54 43 56 39 57 35" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
      <rect x="49" y="9" width="3.5" height="3.5" rx="0.7" fill="#2563EB" />
      <rect x="55" y="16" width="2.8" height="2.8" rx="0.5" fill="#0EA5E9" />
    </svg>

    {!compact && (
      <div className="flex flex-col min-w-0">
        <span
          className={`text-xl font-extrabold tracking-tight leading-none whitespace-nowrap ${
            onDark ? 'bg-white/95 rounded-md px-1.5 py-1' : ''
          }`}
        >
          <span className="text-[#2563EB]">Edu</span>
          <span className="text-[#0F172A]">Certify</span>
        </span>
        {showTagline && (
          <span className={`text-[10px] font-medium tracking-[-0.015em] whitespace-nowrap mt-1 ${onDark ? 'text-blue-100' : 'text-slate-500'}`}>
            Xác thực chứng chỉ &amp; học liệu số
          </span>
        )}
      </div>
    )}
  </div>
);

export default BrandLogo;
