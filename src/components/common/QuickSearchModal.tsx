import React, { useEffect, useState } from 'react';
import {
  Activity,
  BarChart2,
  Bookmark,
  Boxes,
  Briefcase,
  Compass,
  Cpu,
  Layers,
  Newspaper,
  PieChart,
  Search,
  ShieldAlert,
  Sliders,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import { CoinSummary } from '../../types/crypto';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: CoinSummary[];
  onNavigate: (route: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  coins,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickPages = [
    { name: 'Dashboard', path: '/', icon: <Compass className="w-4 h-4 text-emerald-400" /> },
    { name: 'Markets Directory', path: '/markets', icon: <Layers className="w-4 h-4 text-cyan-400" /> },
    { name: 'Watchlist', path: '/watchlist', icon: <Bookmark className="w-4 h-4 text-amber-400" /> },
    { name: 'Market Sentiment', path: '/sentiment', icon: <Activity className="w-4 h-4 text-indigo-400" /> },
    { name: 'AI Intelligence Assistant', path: '/ai-intelligence', icon: <Zap className="w-4 h-4 text-emerald-400" /> },
    { name: 'Price Forecast', path: '/forecast', icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
    { name: 'Risk Analysis', path: '/risk-analysis', icon: <ShieldAlert className="w-4 h-4 text-rose-400" /> },
    { name: 'My Portfolio', path: '/portfolio', icon: <Briefcase className="w-4 h-4 text-blue-400" /> },
    { name: 'Price Alerts', path: '/alerts', icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { name: 'Crypto News', path: '/news', icon: <Newspaper className="w-4 h-4 text-teal-400" /> },
    { name: 'Learn Crypto', path: '/learn', icon: <PieChart className="w-4 h-4 text-violet-400" /> },
    { name: 'Market Heatmap', path: '/heatmap', icon: <Boxes className="w-4 h-4 text-pink-400" /> },
    { name: 'Profit Calculator', path: '/tools/profit-calculator', icon: <BarChart2 className="w-4 h-4 text-emerald-400" /> },
    { name: 'DCA Calculator', path: '/tools/dca-calculator', icon: <BarChart2 className="w-4 h-4 text-cyan-400" /> },
    { name: 'Coin Comparison', path: '/tools/compare', icon: <Sliders className="w-4 h-4 text-amber-400" /> },
    { name: 'Trading Simulator', path: '/tools/simulator', icon: <Cpu className="w-4 h-4 text-emerald-400" /> },
  ];

  const q = query.trim().toLowerCase();
  const matchedCoins = q
    ? coins.filter(
        (c) => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
      ).slice(0, 8)
    : coins.slice(0, 6);

  const matchedPages = q
    ? quickPages.filter((p) => p.name.toLowerCase().includes(q))
    : quickPages.slice(0, 6);

  const handleSelect = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-10 animate-slide-in">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cryptocurrencies, analysis, or tools (e.g. BTC, DCA, News)..."
            className="w-full bg-transparent border-0 px-3 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3">
          {/* Cryptocurrencies */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1">
              Cryptocurrencies
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {matchedCoins.map((coin) => (
                <button
                  key={coin.symbol}
                  onClick={() => handleSelect(`/coin/${coin.symbol}`)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px]">
                      {coin.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {coin.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">{coin.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-200">
                      ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
                    </div>
                    <div
                      className={`text-[10px] font-mono ${
                        coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {coin.change24h >= 0 ? '+' : ''}
                      {coin.change24h.toFixed(2)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Pages & Tools */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1">
              Pages & Intelligence Tools
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {matchedPages.map((page) => (
                <button
                  key={page.path}
                  onClick={() => handleSelect(page.path)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
                >
                  <div className="p-1 rounded bg-slate-800 border border-slate-700/60">
                    {page.icon}
                  </div>
                  <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                    {page.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Key hint */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/70 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>Use arrows to navigate</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
