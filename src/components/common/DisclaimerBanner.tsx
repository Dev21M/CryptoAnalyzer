import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export interface DisclaimerBannerProps {
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  dismissible = true,
  onDismiss,
  className = '',
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={`relative z-40 bg-amber-950/70 dark:bg-amber-950/80 border-b border-amber-800/40 text-amber-200 px-4 py-2 text-xs transition-colors backdrop-blur-sm ${className}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="truncate sm:whitespace-normal font-sans text-[11px] sm:text-xs">
            <span className="font-semibold text-amber-300">Academic Research Lab:</span>{' '}
            CryptoAnalyzer is an empirical machine learning research tool. All model forecasts and regime states are strictly for scientific study and do not constitute financial, investment, or trading advice.
          </p>
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss disclaimer banner"
            className="shrink-0 p-1 rounded hover:bg-amber-800/30 text-amber-300/80 hover:text-amber-100 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
