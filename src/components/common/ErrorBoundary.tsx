import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Check if error is from an external browser extension or userscript
    const stack = error?.stack || '';
    const message = error?.message || '';
    if (
      stack.includes('moz-extension:') ||
      stack.includes('chrome-extension:') ||
      stack.includes('.user.js') ||
      message.includes('__f__')
    ) {
      // Don't crash for third-party browser extensions
      console.warn('Suppressed third-party browser extension error:', message);
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside component tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="text-xs text-slate-400">
              The research workstation encountered an unexpected runtime exception. Your research data in localStorage is intact.
            </p>
            {this.state.error && (
              <div className="p-3 bg-slate-950 rounded-lg text-left text-[11px] font-mono text-rose-300 max-h-32 overflow-y-auto border border-slate-800">
                {this.state.error.message || 'Unknown error'}
              </div>
            )}
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Home className="w-4 h-4" />}
                onClick={this.handleReset}
              >
                Return to Dashboard
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
