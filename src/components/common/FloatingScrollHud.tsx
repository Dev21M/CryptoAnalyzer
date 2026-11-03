import React, { useEffect, useState } from 'react';
import {
  Activity,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CoinSummary } from '../../types/crypto';

interface FloatingScrollHudProps {
  coins: CoinSummary[];
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenDisclaimer: () => void;
}

export const FloatingScrollHud: React.FC<FloatingScrollHudProps> = ({
  coins,
  currentRoute,
  onNavigate,
  onOpenDisclaimer,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.round((scrollY / docHeight) * 100)) : 0;

      setScrollProgress(progress);
      setIsVisible(scrollY > 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const btcCoin = coins.find((c) => c.symbol === 'BTC');
  const ethCoin = coins.find((c) => c.symbol === 'ETH');
  const solCoin = coins.find((c) => c.symbol === 'SOL');

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      aria-label="Floating Research HUD and navigation controls"
      className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5 animate-slide-in select-none pointer-events-auto"
    >
      {/* Expanded Quick Floating Panel */}
      {isExpanded && (
        <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl w-72 sm:w-80 space-y-3 mb-1 animate-slide-in text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-300 font-medium">
            <div className="flex items-center gap-1.5 font-mono text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Real-Time Research HUD</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Binance Spot</span>
          </div>

          {/* Quick Coin Jumpers */}
          <div className="space-y-1.5">
            <div className="text-[11px] text-slate-400">Quick Analysis Jump:</div>
            <div className="grid grid-cols-3 gap-1.5">
              {[btcCoin, ethCoin, solCoin].filter(Boolean).map((coin) => (
                <button
                  key={coin!.symbol}
                  onClick={() => {
                    onNavigate(`/coin/${coin!.symbol}`);
                    setIsExpanded(false);
                  }}
                  className="p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/60 hover:border-emerald-500/40 text-left transition-all cursor-pointer group"
                >
                  <div className="font-mono font-bold text-white group-hover:text-emerald-400">
                    {coin!.symbol}
                  </div>
                  <div className="font-mono text-[10px] text-slate-300">
                    ${coin!.price > 1000 ? coin!.price.toLocaleString(undefined, { maximumFractionDigits: 0 }) : coin!.price.toFixed(2)}
                  </div>
                  <div
                    className={`text-[9px] font-mono ${
                      coin!.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {coin!.change24h >= 0 ? '+' : ''}
                    {coin!.change24h.toFixed(1)}%
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Direct page shortcuts */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <button
              onClick={() => {
                onNavigate('/predictions');
                setIsExpanded(false);
              }}
              className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Cpu className="w-3 h-3 text-emerald-400" />
              <span>Predictions Lab</span>
            </button>
            <button
              onClick={() => {
                onNavigate('/markets');
                setIsExpanded(false);
              }}
              className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>All 20+ Coins</span>
            </button>
            <button
              onClick={() => {
                onOpenDisclaimer();
                setIsExpanded(false);
              }}
              className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              Notice
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Pill */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-slate-900/90 border border-slate-700/70 shadow-2xl backdrop-blur-xl hover:border-emerald-500/50 transition-all duration-300 animate-float-slow">
        {/* Live BTC Ticker Pill Button */}
        {btcCoin && (
          <button
            onClick={() => onNavigate('/coin/BTC')}
            className="flex items-center gap-2 pl-3 pr-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 text-xs text-white transition-colors cursor-pointer group"
            title="Click to analyze BTC/USDT"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
              BTC
            </span>
            <span className="font-mono text-emerald-400 font-semibold">
              ${btcCoin.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span
              className={`text-[10px] font-mono px-1 rounded ${
                btcCoin.change24h >= 0 ? 'bg-emerald-950/60 text-emerald-400' : 'bg-rose-950/60 text-rose-400'
              }`}
            >
              {btcCoin.change24h >= 0 ? '+' : ''}
              {btcCoin.change24h.toFixed(1)}%
            </span>
          </button>
        )}

        {/* HUD Drawer Expand/Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1.5 rounded-full transition-all cursor-pointer ${
            isExpanded
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
          title={isExpanded ? 'Collapse HUD' : 'Expand Quick Research HUD'}
          aria-label="Toggle Research HUD"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <Activity className="w-4 h-4 text-emerald-400" />
          )}
        </button>

        {/* Scroll Progress & Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white transition-all duration-300 cursor-pointer group shadow-sm"
          title={`Scroll to top (${scrollProgress}%)`}
          aria-label="Scroll back to top"
        >
          {/* Circular SVG Progress Ring */}
          <svg className="absolute inset-0 w-8 h-8 -rotate-90 pointer-events-none" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="13"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="2.5"
            />
            <circle
              cx="16"
              cy="16"
              r="13"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray={81.68}
              strokeDashoffset={81.68 - (81.68 * scrollProgress) / 100}
              strokeLinecap="round"
              className="transition-all duration-150"
            />
          </svg>
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </aside>
  );
};
