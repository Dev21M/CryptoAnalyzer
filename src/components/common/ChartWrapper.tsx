import React, { useState } from 'react';
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ChartWrapperProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  subtitle,
  actions,
  children,
  onRefresh,
  isRefreshing = false,
  className = '',
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900 transition-all ${
        isFullscreen
          ? 'fixed inset-4 z-50 flex flex-col p-6 shadow-2xl bg-slate-950/98 backdrop-blur'
          : 'p-4 sm:p-5'
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="text-sm font-bold text-white tracking-tight">{title}</div>
          {subtitle && <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>}
        </div>

        <div className="flex items-center gap-2">
          {actions}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
              onClick={onRefresh}
            >
              Sync
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            icon={isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            onClick={() => setIsFullscreen(!isFullscreen)}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          />
        </div>
      </div>

      <div className={`relative ${isFullscreen ? 'flex-1 overflow-auto' : ''}`}>{children}</div>
    </div>
  );
};
