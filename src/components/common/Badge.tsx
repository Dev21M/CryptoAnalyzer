import React, { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    outline: 'bg-transparent text-slate-300 border-slate-700',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono font-medium rounded border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
