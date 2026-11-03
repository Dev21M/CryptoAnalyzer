import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  subtext?: string;
  icon?: React.ReactNode;
  sparkline?: number[];
  variant?: 'default' | 'highlight';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  changeLabel = '24h',
  subtext,
  icon,
  sparkline,
  variant = 'default',
}) => {
  const isPositive = change !== undefined ? change >= 0 : null;

  return (
    <div
      className={`card-float border rounded-xl p-4 sm:p-5 transition-all hover:border-slate-700 ${
        variant === 'highlight'
          ? 'bg-slate-900 border-emerald-500/30 shadow-lg shadow-emerald-950/20'
          : 'bg-slate-900/90 border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <span className="font-medium uppercase tracking-wider text-[11px] text-slate-400">
          {label}
        </span>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold font-mono tracking-tight text-white">
          {value}
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-0.5 text-xs font-mono font-medium ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {change.toFixed(2)}%
            </span>
            <span className="text-slate-400 text-[10px] ml-0.5">{changeLabel}</span>
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
        {subtext && <span>{subtext}</span>}
        {sparkline && sparkline.length > 2 && (
          <div className="w-24 h-6 ml-auto">
            <SparklineMini data={sparkline} isPositive={isPositive ?? true} />
          </div>
        )}
      </div>
    </div>
  );
};

const SparklineMini: React.FC<{ data: number[]; isPositive: boolean }> = ({
  data,
  isPositive,
}) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 96;
  const height = 24;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const strokeColor = isPositive ? '#10b981' : '#f43f5e';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};
