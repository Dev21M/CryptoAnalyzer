import React, { forwardRef, InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, startIcon, endIcon, disabled, id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full bg-slate-950 border text-slate-100 placeholder:text-slate-500 rounded-lg text-xs font-mono transition-colors focus:outline-none focus:ring-1 ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30'
                : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/30'
            } ${startIcon ? 'pl-9' : 'pl-3'} ${endIcon ? 'pr-9' : 'pr-3'} py-2.5 ${
              disabled ? 'opacity-50 cursor-not-allowed bg-slate-900' : ''
            } ${className}`}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 flex items-center text-slate-400">
              {endIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-[11px] text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
