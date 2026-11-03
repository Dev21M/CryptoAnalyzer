import React, { useState } from 'react';
import {
  Boxes,
  Compass,
  Filter,
  Layers,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { CoinSummary } from '../types/crypto';

interface HeatmapPageProps {
  coins: CoinSummary[];
  onNavigate: (route: string) => void;
}

export const HeatmapPage: React.FC<HeatmapPageProps> = ({ coins, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Layer 1', 'Layer 2', 'DeFi', 'AI & Big Data', 'Meme', 'Infra'];

  const filteredCoins = coins.filter((c) =>
    selectedCategory === 'all' ? true : c.category === selectedCategory
  );

  const totalCap = filteredCoins.reduce((acc, c) => acc + (c.marketCap || 0), 0) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Market Performance Heatmap</h1>
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              Sector Treemap
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual market capitalization weighting and 24-hour return momentum across cryptocurrency sectors
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar self-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Sectors' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span>Treemap scale: Box size proportional to market capitalization ($ USD)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
            <span>&gt; +3%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-800 inline-block" />
            <span>0 to +3%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-800 inline-block" />
            <span>0 to -3%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-600 inline-block" />
            <span>&lt; -3%</span>
          </div>
        </div>
      </div>

      {/* Interactive Treemap Grid */}
      <div className="grid grid-cols-12 gap-2 min-h-[520px]">
        {filteredCoins.map((coin) => {
          // Weight calculation for grid col span
          const share = (coin.marketCap || 1) / totalCap;
          let colSpan = 'col-span-3 sm:col-span-2 lg:col-span-2';
          let rowSpan = 'min-h-[110px]';

          if (share > 0.35) {
            colSpan = 'col-span-12 sm:col-span-6 lg:col-span-5';
            rowSpan = 'min-h-[200px]';
          } else if (share > 0.15) {
            colSpan = 'col-span-12 sm:col-span-6 lg:col-span-4';
            rowSpan = 'min-h-[160px]';
          } else if (share > 0.05) {
            colSpan = 'col-span-6 sm:col-span-4 lg:col-span-3';
            rowSpan = 'min-h-[130px]';
          }

          // Color calculation
          let bgStyle = 'bg-slate-900 border-slate-800 text-slate-300';
          if (coin.change24h >= 4.0) {
            bgStyle = 'bg-emerald-600/90 hover:bg-emerald-500 border-emerald-500/40 text-white';
          } else if (coin.change24h >= 0.5) {
            bgStyle = 'bg-emerald-800/80 hover:bg-emerald-700 border-emerald-600/30 text-emerald-100';
          } else if (coin.change24h > -0.5) {
            bgStyle = 'bg-slate-800/90 hover:bg-slate-700 border-slate-700/50 text-slate-200';
          } else if (coin.change24h > -4.0) {
            bgStyle = 'bg-rose-800/80 hover:bg-rose-700 border-rose-600/30 text-rose-100';
          } else {
            bgStyle = 'bg-rose-600/90 hover:bg-rose-500 border-rose-500/40 text-white';
          }

          return (
            <div
              key={coin.symbol}
              onClick={() => onNavigate(`/coin/${coin.symbol}`)}
              className={`${colSpan} ${rowSpan} ${bgStyle} rounded-xl p-3.5 border transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-sm hover:scale-[1.01]`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold font-mono text-sm tracking-tight">{coin.symbol}</span>
                  <span className="text-[10px] font-mono opacity-80">{coin.category}</span>
                </div>
                <div className="text-[11px] truncate opacity-90">{coin.name}</div>
              </div>

              <div>
                <div className="text-base sm:text-lg font-mono font-bold">
                  ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
                </div>
                <div className="text-xs font-mono font-bold flex items-center gap-1 mt-0.5">
                  {coin.change24h >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>
                    {coin.change24h >= 0 ? '+' : ''}
                    {coin.change24h.toFixed(2)}%
                  </span>
                </div>
                <div className="text-[10px] font-mono opacity-70 mt-1">
                  Cap: ${(coin.marketCap / 1e9).toFixed(1)}B
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
