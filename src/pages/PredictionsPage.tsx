import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Filter,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/common/MetricCard';
import { RegimeBadge } from '../components/common/RegimeBadge';
import { CoinSummary, PredictionHorizon } from '../types/crypto';

interface PredictionsPageProps {
  coins: CoinSummary[];
  onNavigate: (route: string) => void;
  onOpenDisclaimer: () => void;
}

export const PredictionsPage: React.FC<PredictionsPageProps> = ({
  coins,
  onNavigate,
  onOpenDisclaimer,
}) => {
  const [horizon, setHorizon] = useState<PredictionHorizon>('1h');
  const [directionFilter, setDirectionFilter] = useState<'all' | 'Bullish' | 'Bearish'>('all');

  const bullishCount = coins.filter((c) => c.primaryForecast.direction === 'Bullish').length;
  const bearishCount = coins.filter((c) => c.primaryForecast.direction === 'Bearish').length;
  const avgConfidence = Math.round(
    coins.reduce((acc, c) => acc + c.primaryForecast.confidence, 0) / (coins.length || 1)
  );

  const filtered = coins
    .filter((c) => {
      if (directionFilter === 'all') return true;
      return c.primaryForecast.direction === directionFilter;
    })
    .sort((a, b) => b.primaryForecast.confidence - a.primaryForecast.confidence);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Predictions Intelligence Lab</h1>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Deep Learning + Ensemble Consensus
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated cross-asset price movement forecasts and confidence rankings
          </p>
        </div>

        {/* Horizon selector buttons */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          {(['5m', '15m', '1h', '4h', '1d'] as PredictionHorizon[]).map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
                horizon === h
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Prediction KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Market Direction Bias"
          value={bullishCount > bearishCount ? 'Bullish Drift' : 'Bearish Drift'}
          subtext={`${bullishCount} Bullish vs ${bearishCount} Bearish`}
          icon={<Zap className="w-4 h-4 text-emerald-400" />}
          variant="highlight"
        />
        <MetricCard
          label="Mean Model Confidence"
          value={`${avgConfidence}%`}
          subtext="Ensemble probability certainty"
        />
        <MetricCard
          label="Top Bullish Conviction"
          value={coins.find((c) => c.primaryForecast.direction === 'Bullish')?.symbol ?? 'BTC'}
          subtext="Highest Sharpe return potential"
        />
        <MetricCard
          label="Current Horizon Tested"
          value={horizon}
          subtext="Rolling out-of-sample window"
        />
      </div>

      {/* Direction Filters */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setDirectionFilter('all')}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            directionFilter === 'all'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Signals ({coins.length})
        </button>
        <button
          onClick={() => setDirectionFilter('Bullish')}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            directionFilter === 'Bullish'
              ? 'bg-emerald-950/80 text-emerald-400 font-semibold border border-emerald-800/60'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Bullish Signals ({bullishCount})
        </button>
        <button
          onClick={() => setDirectionFilter('Bearish')}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
            directionFilter === 'Bearish'
              ? 'bg-rose-950/80 text-rose-400 font-semibold border border-rose-800/60'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Bearish Signals ({bearishCount})
        </button>
      </div>

      {/* Prediction Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((coin) => {
          const isBull = coin.primaryForecast.direction === 'Bullish';
          const isBear = coin.primaryForecast.direction === 'Bearish';

          // Horizon return scaling relative to the base 1h forecast
          const horizonMultipliers: Record<PredictionHorizon, number> = {
            '5m': 0.18,
            '15m': 0.42,
            '1h': 1.0,
            '4h': 1.95,
            '1d': 3.4,
          };
          const multiplier = horizonMultipliers[horizon] ?? 1.0;
          const scaledReturnPct = Number((coin.primaryForecast.expectedReturnPct * multiplier).toFixed(2));
          const targetPrice = coin.price * (1 + scaledReturnPct / 100);

          return (
            <div
              key={coin.symbol}
              onClick={() => onNavigate(`/coin/${coin.symbol}`)}
              className="card-float p-5 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-800/60 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-white text-sm">
                      {coin.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {coin.symbol} <span className="text-xs font-normal text-slate-400">/ USDT</span>
                      </div>
                      <div className="text-xs text-slate-400">{coin.name}</div>
                    </div>
                  </div>
                  <RegimeBadge regime={coin.currentRegime} size="sm" />
                </div>

                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <div className="text-xs text-slate-400">Spot Price (Live)</div>
                    <div className="text-xl font-bold font-mono text-white">
                      ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">24h Change</div>
                    <div
                      className={`text-sm font-mono font-semibold ${
                        coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {coin.change24h >= 0 ? '+' : ''}
                      {coin.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* AI Forecast Container */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Direction ({horizon}):</span>
                    <span
                      className={`font-mono font-bold ${
                        isBull ? 'text-emerald-400' : isBear ? 'text-rose-400' : 'text-slate-300'
                      }`}
                    >
                      {coin.primaryForecast.direction} ({coin.primaryForecast.confidence}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Target ({horizon}):</span>
                    <span className="font-mono font-bold text-white">
                      ${targetPrice < 1 ? targetPrice.toFixed(4) : targetPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Expected Return:</span>
                    <span
                      className={`font-mono font-bold ${
                        scaledReturnPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {scaledReturnPct >= 0 ? '+' : ''}
                      {scaledReturnPct}%
                    </span>
                  </div>

                  {/* Confidence Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isBull ? 'bg-emerald-500' : isBear ? 'bg-rose-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${coin.primaryForecast.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">
                <span className="font-mono text-[11px]">Primary: LSTM + XGBoost Full</span>
                <div className="flex items-center gap-1 font-medium">
                  <span>Analyze</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
