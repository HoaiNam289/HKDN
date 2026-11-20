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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Top row: Colored icon container on left, trend indicator on right */}
      <div className="flex items-center justify-between">
        <div
          className={`rounded-lg p-3 ${currentVariant.bg} ${currentVariant.text} flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 stroke-[2]" aria-hidden="true" />
        </div>

        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
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
        <div className="text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </div>
        <p className="text-sm text-slate-500 mt-1 font-medium">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
