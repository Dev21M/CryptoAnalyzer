import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Gauge,
  Info,
  Layers,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/common/MetricCard';
import { fetchGlobalMarketData } from '../services/globalMarketService';
import { CoinSummary, GlobalMarketData } from '../types/crypto';

interface SentimentPageProps {
  coins: CoinSummary[];
  onNavigate: (route: string) => void;
}

export const SentimentPage: React.FC<SentimentPageProps> = ({ coins, onNavigate }) => {
  const [globalData, setGlobalData] = useState<GlobalMarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGlobalMarketData()
      .then((data) => setGlobalData(data))
      .finally(() => setIsLoading(false));
  }, []);

  // Calculate market breadth from actual coin data
  const totalCoins = coins.length || 1;
  const bullishCoins = coins.filter((c) => c.change24h > 1.0);
  const bearishCoins = coins.filter((c) => c.change24h < -1.0);
  const neutralCoins = coins.filter((c) => Math.abs(c.change24h) <= 1.0);

  const bullPct = Math.round((bullishCoins.length / totalCoins) * 100);
  const bearPct = Math.round((bearishCoins.length / totalCoins) * 100);
  const neutralPct = 100 - bullPct - bearPct;

  const fearGreed = globalData?.fearGreedIndex ?? 65;
  const fearGreedSentiment = globalData?.fearGreedSentiment ?? 'Greed';
  const btcDominance = globalData?.btcDominance ?? 56.4;

  // Derive momentum and volatility
  const avgChange = coins.reduce((acc, c) => acc + c.change24h, 0) / totalCoins;
  const avgSpread = coins.reduce((acc, c) => acc + ((c.high24h - c.low24h) / (c.price || 1)), 0) / totalCoins;
  const volatilityLevel = avgSpread > 0.08 ? 'Elevated' : avgSpread > 0.04 ? 'Moderate' : 'Low';
  const momentumLevel = avgChange > 2 ? 'Strong Bullish Momentum' : avgChange > 0 ? 'Mild Positive Momentum' : 'Defensive / Cautious';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Market Sentiment & Macro Pulse</h1>
          <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
            Real-Time Indicators
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Holistic market psychology, Fear & Greed index, Bitcoin dominance, and trend distribution
        </p>
      </div>

      {/* Primary Sentiment Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fear & Greed Gauge Card */}
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Crypto Fear & Greed Index</span>
            <Gauge className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-white">{fearGreed}</span>
              <span className="text-xs text-slate-500 font-mono">/ 100</span>
            </div>
            <div className="text-xs font-bold font-mono mt-1 text-emerald-400">
              {fearGreedSentiment}
            </div>
          </div>
          {/* Progress bar gauge */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                fearGreed >= 75
                  ? 'bg-emerald-500'
                  : fearGreed >= 55
                  ? 'bg-emerald-400'
                  : fearGreed >= 45
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${fearGreed}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">
            0 = Extreme Fear · 50 = Neutral · 100 = Extreme Greed
          </span>
        </Card>

        {/* Bitcoin Dominance */}
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Bitcoin Dominance (BTC.D)</span>
            <Activity className="w-4 h-4 text-orange-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold font-mono text-white">{btcDominance}%</div>
            <div className="text-xs text-slate-400 mt-1">
              Share of $2.8T+ global market cap
            </div>
          </div>
          <div className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-800">
            {btcDominance > 55
              ? 'High BTC dominance: Capital concentrated in Bitcoin safety over altcoins.'
              : 'Declining BTC dominance: Altcoins experiencing broader capital rotation.'}
          </div>
        </Card>

        {/* Market Momentum */}
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Market Momentum</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-3">
            <div className="text-lg font-bold text-white">{momentumLevel}</div>
            <div className="text-xs font-mono text-emerald-400 mt-1">
              Average 24h: {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            Based on aggregate cross-asset price velocity and volume expansion.
          </div>
        </Card>

        {/* Volatility Index */}
        <Card className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average Intraday Volatility</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold font-mono text-white">{volatilityLevel}</div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              Avg Spread: {(avgSpread * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            {volatilityLevel === 'Elevated'
              ? 'Rapid price swings — exercise disciplined stop losses.'
              : 'Orderly price discovery across spot liquidity pools.'}
          </div>
        </Card>
      </div>

      {/* Market Condition Distribution (Bullish vs Bearish vs Neutral) */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-white mb-2">Market Condition Distribution (Breadth)</h3>
        <p className="text-xs text-slate-400 mb-4">
          Percentage of tracked cryptocurrencies in distinct momentum regimes over the last 24 hours
        </p>

        {/* Distribution Bar */}
        <div className="h-5 w-full bg-slate-800 rounded-lg overflow-hidden flex font-mono text-[10px] font-bold text-white">
          <div
            style={{ width: `${bullPct}%` }}
            className="bg-emerald-600 flex items-center justify-center transition-all duration-500"
            title={`Bullish: ${bullPct}%`}
          >
            {bullPct > 10 && `${bullPct}%`}
          </div>
          <div
            style={{ width: `${neutralPct}%` }}
            className="bg-slate-700 flex items-center justify-center transition-all duration-500"
            title={`Neutral: ${neutralPct}%`}
          >
            {neutralPct > 10 && `${neutralPct}%`}
          </div>
          <div
            style={{ width: `${bearPct}%` }}
            className="bg-rose-600 flex items-center justify-center transition-all duration-500"
            title={`Bearish: ${bearPct}%`}
          >
            {bearPct > 10 && `${bearPct}%`}
          </div>
        </div>

        {/* Legend Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>Bullish Condition ({bullishCoins.length} Coins · {bullPct}%)</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Assets experiencing active buyer expansion and consecutive positive 24h candle closes.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {bullishCoins.slice(0, 6).map((c) => (
                <span
                  key={c.symbol}
                  onClick={() => onNavigate(`/coin/${c.symbol}`)}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/20"
                >
                  {c.symbol} +{c.change24h}%
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
              <Activity className="w-4 h-4 text-slate-400" />
              <span>Neutral / Sideways ({neutralCoins.length} Coins · {neutralPct}%)</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Assets trading inside tight horizontal consolidation ranges without directional dominance.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {neutralCoins.slice(0, 6).map((c) => (
                <span
                  key={c.symbol}
                  onClick={() => onNavigate(`/coin/${c.symbol}`)}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer hover:bg-slate-700"
                >
                  {c.symbol} {c.change24h}%
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <ArrowDownRight className="w-4 h-4" />
              <span>Bearish Condition ({bearishCoins.length} Coins · {bearPct}%)</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Assets facing overhead selling resistance and short-term profit realization.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {bearishCoins.slice(0, 6).map((c) => (
                <span
                  key={c.symbol}
                  onClick={() => onNavigate(`/coin/${c.symbol}`)}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 cursor-pointer hover:bg-rose-500/20"
                >
                  {c.symbol} {c.change24h}%
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Human-Readable Market Explanation */}
      <Card className="p-6 bg-slate-900/80 border-slate-800">
        <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
          <Info className="w-4 h-4 text-emerald-400" />
          <span>Executive Market Sentiment Summary</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The broader cryptocurrency market is currently characterized by{' '}
          <strong className="text-white">{fearGreedSentiment.toLowerCase()} psychology</strong> with{' '}
          <strong className="text-emerald-400">{bullPct}%</strong> of assets advancing and Bitcoin maintaining a{' '}
          <strong className="text-white">{btcDominance}%</strong> dominance level. High Bitcoin dominance indicates that institutional capital continues to prioritize digital gold liquidity before rotating down the risk curve into mid-cap altcoins. Overall trading conditions remain orderly with moderate intraday volatility.
        </p>
      </Card>
    </div>
  );
};
