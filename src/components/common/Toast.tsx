import React from 'react';
import { AlertCircle, CheckCircle, Info, KeyRound, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'otp' | 'error';
  title: string;
  message: string;
  code?: string;
  onAction?: () => void;
  actionLabel?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isOtp = toast.type === 'otp';
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-in flex items-start gap-3 ${
              isOtp
                ? 'bg-slate-900/95 border-emerald-500/50 shadow-emerald-950/30 text-white'
                : isSuccess
                ? 'bg-slate-900/95 border-emerald-500/30 text-white'
                : isError
                ? 'bg-slate-900/95 border-rose-500/40 text-white'
                : 'bg-slate-900/95 border-slate-800 text-white'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isOtp ? (
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <KeyRound className="w-4 h-4 animate-bounce" />
                </div>
              ) : isSuccess ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : isError ? (
                <AlertCircle className="w-5 h-5 text-rose-400" />
              ) : (
                <Info className="w-5 h-5 text-cyan-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white font-mono tracking-tight">
                  {toast.title}
                </h4>
                <button
                  onClick={() => onDismiss(toast.id)}
                  className="text-slate-400 hover:text-white p-0.5"
                  aria-label="Dismiss toast"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{toast.message}</p>

              {toast.code && (
                <div className="mt-2.5 p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">OTP:</span>
                    <span className="text-base font-bold font-mono tracking-widest text-emerald-400">
                      {toast.code}
                    </span>
                  </div>
                  {toast.onAction && (
                    <button
                      onClick={() => {
                        toast.onAction?.();
                        onDismiss(toast.id);
                      }}
                      className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition-colors cursor-pointer"
                    >
                      {toast.actionLabel || 'Auto-fill'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
