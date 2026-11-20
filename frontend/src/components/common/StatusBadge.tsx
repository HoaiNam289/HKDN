import React from 'react';

export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger' | 'info' | 'default';
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const statusConfig: Record<
  StatusBadgeProps['status'],
  { badgeClass: string; dotClass: string }
> = {
  success: {
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    dotClass: 'bg-emerald-500',
  },
  warning: {
    badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    dotClass: 'bg-amber-500',
  },
  danger: {
    badgeClass: 'bg-red-50 text-red-700 border border-red-200/60',
    dotClass: 'bg-red-500',
  },
  info: {
    badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200/60',
    dotClass: 'bg-blue-500',
  },
  default: {
    badgeClass: 'bg-slate-100 text-slate-600 border border-slate-200/60',
    dotClass: 'bg-slate-400',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'default',
  children,
  dot = false,
  className = '',
}) => {
  const config = statusConfig[status] || statusConfig.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${config.badgeClass} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.dotClass}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};

export default StatusBadge;
