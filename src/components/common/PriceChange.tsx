import React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

export interface PriceChangeProps {
  value: number;
  showIcon?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceChange: React.FC<PriceChangeProps> = ({
  value,
  showIcon = true,
  prefix = '',
  suffix = '%',
  className = '',
  size = 'md',
}) => {
  const isPositive = value > 0;
  const isNegative = value < 0;

  const colorClass = isPositive
    ? 'text-emerald-400'
    : isNegative
    ? 'text-rose-400'
    : 'text-slate-400';

  const sizeClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base font-semibold' : 'text-sm';

  return (
    <span className={`inline-flex items-center font-mono font-medium ${sizeClass} ${colorClass} ${className}`}>
      {showIcon && (
        <span className="mr-0.5">
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5 inline" />
          ) : isNegative ? (
            <ArrowDownRight className="w-3.5 h-3.5 inline" />
          ) : (
            <Minus className="w-3.5 h-3.5 inline" />
          )}
        </span>
      )}
      <span>
        {prefix}
        {isPositive ? '+' : ''}
        {value.toFixed(2)}
        {suffix}
      </span>
    </span>
  );
};
