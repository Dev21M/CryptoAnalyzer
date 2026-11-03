import React from 'react';
import { MarketRegime } from '../../types/crypto';

interface RegimeBadgeProps {
  regime: MarketRegime;
  confidence?: number;
  showConfidence?: boolean;
  size?: 'sm' | 'md';
}

export const RegimeBadge: React.FC<RegimeBadgeProps> = ({
  regime,
  confidence,
  showConfidence = false,
  size = 'md',
}) => {
  const configs: Record<
    MarketRegime,
    { dot: string; text: string; label: string }
  > = {
    'Bull': {
      dot: 'bg-emerald-400',
      text: 'text-emerald-400 font-medium',
      label: 'Bull Trend',
    },
    'Bear': {
      dot: 'bg-rose-400',
      text: 'text-rose-400 font-medium',
      label: 'Bear Trend',
    },
    'Sideways': {
      dot: 'bg-amber-400',
      text: 'text-amber-300 font-medium',
      label: 'Sideways Consolidation',
    },
    'High Volatility': {
      dot: 'bg-purple-400',
      text: 'text-purple-300 font-medium',
      label: 'High Volatility Shock',
    },
  };

  const conf = configs[regime] || configs['Sideways'];

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      }`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${conf.dot} animate-pulse`} />
      <span className={conf.text}>{conf.label}</span>
      {showConfidence && confidence !== undefined && (
        <>
          <span className="text-slate-500 font-mono">·</span>
          <span className="text-xs text-slate-400 font-mono">
            {Math.round(confidence * 100)}% conf
          </span>
        </>
      )}
    </div>
  );
};
