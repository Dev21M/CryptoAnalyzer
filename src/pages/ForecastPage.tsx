import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Filter,
  Info,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/common/MetricCard';
import { getAllCoinForecasts } from '../services/forecastService';
import { CoinSummary } from '../types/crypto';

interface ForecastPageProps {
  coins: CoinSummary[];
  onNavigate: (route: string) => void;
}

export const ForecastPage: React.FC<ForecastPageProps> = ({ coins, onNavigate }) => {
  const [horizon, setHorizon] = useState<'24h' | '7d' | '30d'>('24h');
  const [trendFilter, setTrendFilter] = useState<'all' | 'Upward' | 'Downward' | 'Consolidation'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const forecasts = getAllCoinForecasts(coins, horizon);

  const filteredForecasts = forecasts.filter((f) => {
    if (trendFilter !== 'all' && f.expectedTrend !== trendFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return f.symbol.toLowerCase().includes(q) || f.coinName.toLowerCase().includes(q);
    }
    return true;
  });

  const upwardCount = forecasts.filter((f) => f.expectedTrend === 'Upward').length;
  const downwardCount = forecasts.filter((f) => f.expectedTrend === 'Downward').length;
  const consolidationCount = forecasts.filter((f) => f.expectedTrend === 'Consolidation').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Price Movement Forecasts</h1>
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              Multi-Horizon Statistical Projections
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mathematical trend projection channels, expected ranges, and confidence levels based on current market dynamics
          </p>
        </div>

        {/* Horizon selector buttons */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg self-start">
          <button
            onClick={() => setHorizon('24h')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
              horizon === '24h' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setHorizon('7d')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
              horizon === '7d' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setHorizon('30d')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
              horizon === '30d' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Disclaimers & Methodology Banner */}
      <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-white">Forecasting Methodology & Transparency:</span>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            All forecast price ranges are computed deterministically using exponential moving average drift, historical volatility expansion channels, and momentum oscillation. Forecasts model statistical probability distribution bands and are not guaranteed price outcomes. Never risk capital without independent verification.
          </p>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-slate-400 text-xs block">Active Horizon</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">
            {horizon === '24h' ? '24 Hours (Intraday)' : horizon === '7d' ? '7 Days (Weekly)' : '30 Days (Monthly)'}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Dynamic volatility channels</span>
        </Card>

        <Card className="p-4">
          <span className="text-slate-400 text-xs block">Projected Upward</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
            {upwardCount} Assets
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Constructive drift rate</span>
        </Card>

        <Card className="p-4">
          <span className="text-slate-400 text-xs block">Projected Consolidation</span>
          <span className="text-xl font-bold font-mono text-slate-200 mt-1 block">
            {consolidationCount} Assets
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Range-bound support tests</span>
        </Card>

        <Card className="p-4">
          <span className="text-slate-400 text-xs block">Projected Downward</span>
          <span className="text-xl font-bold font-mono text-rose-400 mt-1 block">
            {downwardCount} Assets
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Overhead resistance barrier</span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg w-full sm:w-auto">
          {(['all', 'Upward', 'Consolidation', 'Downward'] as const).map((trend) => (
            <button
              key={trend}
              onClick={() => setTrendFilter(trend)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                trendFilter === trend
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {trend === 'all' ? 'All Trends' : trend}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter forecast assets (e.g. BTC)..."
          className="w-full sm:w-64 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Forecast Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredForecasts.map((item) => (
          <Card
            key={item.symbol}
            className="p-5 flex flex-col justify-between hover:border-slate-700 transition-all group"
          >
            <div>
              {/* Top row */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div
                  onClick={() => onNavigate(`/coin/${item.symbol}`)}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                    {item.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {item.coinName}
                    </span>
                    <span className="text-xs font-mono text-slate-400 block">{item.symbol}</span>
                  </div>
                </div>

                {/* Trend Badge */}
                <div
                  className={`flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded font-semibold ${
                    item.expectedTrend === 'Upward'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : item.expectedTrend === 'Downward'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.expectedTrend === 'Upward' && <TrendingUp className="w-3.5 h-3.5" />}
                  {item.expectedTrend === 'Downward' && <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{item.expectedTrend}</span>
                </div>
              </div>

              {/* Price & Target Range */}
              <div className="mt-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Current Spot Price:</span>
                  <span className="text-sm font-mono font-bold text-slate-200">
                    ${item.currentPrice < 1 ? item.currentPrice.toFixed(4) : item.currentPrice.toLocaleString()}
                  </span>
                </div>

                {/* Estimated Price Range Box */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Estimated {item.horizon} Range:</span>
                    <span className="text-emerald-400 font-semibold">{item.confidenceLevel} Confidence</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-white flex items-center justify-between">
                    <span>${item.estimatedRange[0].toLocaleString()}</span>
                    <span className="text-xs text-slate-500">to</span>
                    <span>${item.estimatedRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Plain-English Explanation */}
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {item.forecastExplanation}
                </p>

                {/* Confidence & Historical Accuracy Metrics */}
                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                  <div>
                    <span className="text-slate-500 block">Confidence Score</span>
                    <span className="text-slate-200 font-bold">{item.confidencePercent}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Historical Backtest Accuracy</span>
                    <span className="text-slate-200 font-bold">{item.historicalAccuracy}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => onNavigate(`/coin/${item.symbol}`)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Full Coin Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('/alerts')}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Set Forecast Alert
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
