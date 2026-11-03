import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  floating?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  padding = 'md',
  floating = false,
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={`bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm ${
        floating ? 'card-float hover:border-slate-700' : ''
      } ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-950/40">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-sm font-semibold text-slate-100 tracking-tight">{title}</h3>
            ) : (
              title
            )}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={paddingStyles[padding]}>{children}</div>
    </div>
  );
};

