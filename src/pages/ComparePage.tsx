import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Plus,
  Sliders,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { PriceChange } from '../components/common/PriceChange';
import { CoinSummary } from '../types/crypto';

interface ComparePageProps {
  coins: CoinSummary[];
  onNavigate: (route: string) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ coins, onNavigate }) => {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['BTC', 'ETH', 'SOL']);

  const toggleCoin = (sym: string) => {
    if (selectedSymbols.includes(sym)) {
      if (selectedSymbols.length > 2) {
        setSelectedSymbols((prev) => prev.filter((s) => s !== sym));
      }
    } else {
      if (selectedSymbols.length < 5) {
        setSelectedSymbols((prev) => [...prev, sym]);
      }
    }
  };

  const selectedCoins = selectedSymbols
    .map((sym) => coins.find((c) => c.symbol === sym))
    .filter(Boolean) as CoinSummary[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Side-by-Side Cryptocurrency Comparison</h1>
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              Multi-Asset Benchmark
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare 2 to 5 cryptocurrencies across price action, market cap dominance, volume turnover, and volatility
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 self-start">
          Comparing: <strong className="text-white">{selectedSymbols.length} / 5</strong> assets
        </div>
      </div>

      {/* Coin Selector Chips */}
      <Card className="p-4 bg-slate-900/80">
        <div className="text-xs font-semibold text-slate-300 mb-2">Select assets to include in comparison:</div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {coins.map((c) => {
            const isSelected = selectedSymbols.includes(c.symbol);
            return (
              <button
                key={c.symbol}
                onClick={() => toggleCoin(c.symbol)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{c.symbol}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
            <tr>
              <th className="py-4 px-5">Financial Metric</th>
              {selectedCoins.map((c) => (
                <th key={c.symbol} className="py-4 px-5 min-w-[160px]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center">
                      {c.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{c.name}</div>
                      <div className="text-[10px] text-slate-500">{c.symbol}</div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {/* Live Spot Price */}
            <tr className="hover:bg-slate-800/30">
              <td className="py-3.5 px-5 font-semibold text-slate-300">Live Spot Price</td>
              {selectedCoins.map((c) => (
                <td key={c.symbol} className="py-3.5 px-5 font-mono font-bold text-sm text-white">
                  ${c.price < 1 ? c.price.toFixed(4) : c.price.toLocaleString()}
                </td>
              ))}
            </tr>

            {/* 24-Hour Return */}
            <tr className="hover:bg-slate-800/30">
              <td className="py-3.5 px-5 font-semibold text-slate-300">24h Price Change</td>
              {selectedCoins.map((c) => (
                <td key={c.symbol} className="py-3.5 px-5 font-mono font-semibold">
                  <PriceChange value={c.change24h} />
                </td>
              ))}
            </tr>

            {/* 7-Day Performance */}
            <tr className="hover:bg-slate-800/30">
              <td className="py-3.5 px-5 font-semibold text-slate-300">7-Day Change</td>
              {selectedCoins.map((c) => (
                <td key={c.symbol} className="py-3.5 px-5 font-mono font-semibold">
                  <PriceChange value={c.change7d} />
                </td>
              ))}
            </tr>

            {/* Market Capitalization */}
            <tr className="hover:bg-slate-800/30">
              <td className="py-3.5 px-5 font-semibold text-slate-300">Market Capitalization</td>
              {selectedCoins.map((c) => (
                <td key={c.symbol} className="py-3.5 px-5 font-mono text-slate-200">
                  ${(c.marketCap / 1e9).toFixed(2)} Billion
                </td>
              ))}
            </tr>

            {/* 24h Trading Volume */}
            <tr className="hover:bg-slate-800/30">
              <td className="py-3.5 px-5 font-semibold text-slate-300">24h Trading Volume</td>
              {selectedCoins.map((c) => (
                <td key={c.symbol} className="py-3.5 px-5 font-mono text-slate-200">
                  ${(c.volume24h / 1e6).toFixed(1)} Million
                </td>
              ))}
            </tr>

            {/* Volume to Market Cap Ratio */}
            <tr className="hover:bg-slate-800/30">
              <td className="py-3.5 px-5 font-semibold text-slate-300">Liquidity Turnover Ratio</td>
              {selectedCoins.map((c) => {
                const ratio = ((c.volume24h / (c.marketCap || 1)) * 100).toFixed(2);
                return (
                  <td key={c.symbol} className="py-3.5 px-5 font-mono text-slate-300">
                    {ratio}% daily turnover
                  </td>
                );
              })}
            </tr>

            {/* Intraday Spread (Volatility) */}
            <tr className="hover:bg-slate-800/30">
              <td className="py-3.5 px-5 font-semibold text-slate-300">24h High / Low Spread</td>
              {selectedCoins.map((c) => {
                const spreadPct = (((c.high24h - c.low24h) / (c.price || 1)) * 100).toFixed(2);
                return (
                  <td key={c.symbol} className="py-3.5 px-5 font-mono text-slate-300">
                    {spreadPct}% spread
                  </td>
                );
              })}
            </tr>

            {/* Sector Category */}
            <tr className="hover:bg-slate-800/30">
              <td className="py-3.5 px-5 font-semibold text-slate-300">Sector Category</td>
              {selectedCoins.map((c) => (
                <td key={c.symbol} className="py-3.5 px-5 font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">
                    {c.category}
                  </span>
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr className="hover:bg-slate-800/30 bg-slate-950/40">
              <td className="py-4 px-5 font-semibold text-slate-400">Deep Analysis</td>
              {selectedCoins.map((c) => (
                <td key={c.symbol} className="py-4 px-5">
                  <button
                    onClick={() => onNavigate(`/coin/${c.symbol}`)}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    Open {c.symbol} Chart →
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
