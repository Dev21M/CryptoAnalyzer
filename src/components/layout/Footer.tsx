import React from 'react';
import { AlertCircle, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenDisclaimer: () => void;
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDisclaimer, onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Project Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-white">CryptoAnalyzer Lab</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-emerald-400 font-mono">
                Academic Research Edition
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              An open academic benchmarking framework comparing 7 machine learning architectures (Naive, Linear, Random Forest, XGBoost, LSTM, GRU, CNN-1D) across 4 hierarchical feature sets and 4-state Gaussian Hidden Markov Model regime dynamics for high-frequency cryptocurrency time series.
            </p>
            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={onOpenDisclaimer}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium underline"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Full Methodology & Hypothesis Testing</span>
              </button>
            </div>
          </div>

          {/* Research Pages */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Research Sections
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('/models')}
                  className="hover:text-white transition-colors"
                >
                  7-Model Benchmark & Wilcoxon Tests
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/regimes')}
                  className="hover:text-white transition-colors"
                >
                  HMM 4-State Regime Dynamics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/predictions')}
                  className="hover:text-white transition-colors"
                >
                  AI Opportunity Radar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/markets')}
                  className="hover:text-white transition-colors"
                >
                  Cryptocurrency Market Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Data Providers */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Data Feeds & Standards
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Binance Spot Kline Stream</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>FCS Financial API (Primary)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>CoinGecko Market Cap Engine</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>WCAG AA Accessibility Tested</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <AlertCircle className="w-4 h-4 text-amber-500/80 shrink-0" />
            <span>
              Disclaimer: Not financial or investment advice. Time series predictions are probabilistic academic estimations.
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            © {new Date().getFullYear()} CryptoAnalyzer Quantitative Lab
          </div>
        </div>
      </div>
    </footer>
  );
};
