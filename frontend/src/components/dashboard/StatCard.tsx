import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  color?: 'blue' | 'emerald' | 'violet' | 'amber';
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
  },
  violet: {
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    border: 'border-violet-100',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
  },
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
}) => {
  const currentVariant = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-[14px] shadow-sm border border-slate-200 p-5 hover:-translate-y-0.5 transition-transform duration-200 flex flex-col justify-between min-h-[164px]">
      {/* Top row: Colored icon container on left, trend indicator on right */}
      <div className="flex items-center justify-between">
        <div
          className={`rounded-lg p-3 ${currentVariant.bg} ${currentVariant.text} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5 stroke-[1.7]" aria-hidden="true" />
        </div>

        {trend && (
          <div
            className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md ${
              trend.isPositive
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-100'
                : 'text-rose-700 bg-rose-50 border border-rose-100'
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span>
              {trend.isPositive ? '+' : '-'}
              {Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </div>

      {/* Content row: Value and Title */}
      <div className="mt-4">
        <div className="text-[30px] leading-none font-medium text-slate-900 tracking-[-0.04em] tabular-nums">
          {value}
        </div>
        <p className="text-xs text-slate-500 mt-2">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
