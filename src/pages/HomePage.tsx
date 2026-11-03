import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Cpu,
  Gauge,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/common/MetricCard';
import { PriceChange } from '../components/common/PriceChange';
import { fetchAiMarketSummary } from '../services/aiService';
import { fetchGlobalMarketData } from '../services/globalMarketService';
import { CoinSummary, GlobalMarketData } from '../types/crypto';

interface HomePageProps {
  coins: CoinSummary[];
  onNavigate: (route: string) => void;
  onOpenDisclaimer?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ coins, onNavigate }) => {
  const [globalData, setGlobalData] = useState<GlobalMarketData | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination for Gainers / Losers
  const [gainersPage, setGainersPage] = useState(1);
  const [losersPage, setLosersPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchGlobalMarketData().then((data) => {
      setGlobalData(data);
    });
  }, []);

  useEffect(() => {
    if (coins.length > 0) {
      setIsSummaryLoading(true);
      fetchAiMarketSummary(coins, globalData || undefined)
        .then(setAiSummary)
        .finally(() => setIsSummaryLoading(false));
    }
  }, [coins.length, globalData]);

  // Derived coins
  const btcCoin = useMemo(() => coins.find((c) => c.symbol === 'BTC'), [coins]);
  const ethCoin = useMemo(() => coins.find((c) => c.symbol === 'ETH'), [coins]);
  const solCoin = useMemo(() => coins.find((c) => c.symbol === 'SOL'), [coins]);

  const allGainers = useMemo(() => {
    return [...coins].filter((c) => c.change24h > 0).sort((a, b) => b.change24h - a.change24h);
  }, [coins]);

  const allLosers = useMemo(() => {
    return [...coins].filter((c) => c.change24h < 0).sort((a, b) => a.change24h - b.change24h);
  }, [coins]);

  const trendingCoins = useMemo(() => {
    return [...coins].sort((a, b) => b.volume24h - a.volume24h).slice(0, 6);
  }, [coins]);

  const paginatedGainers = useMemo(() => {
    const start = (gainersPage - 1) * pageSize;
    return allGainers.slice(start, start + pageSize);
  }, [allGainers, gainersPage]);

  const paginatedLosers = useMemo(() => {
    const start = (losersPage - 1) * pageSize;
    return allLosers.slice(start, start + pageSize);
  }, [allLosers, losersPage]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return coins.filter((c) => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)).slice(0, 6);
  }, [coins, searchQuery]);

  const fearGreed = globalData?.fearGreedIndex ?? 65;
  const fearGreedSentiment = globalData?.fearGreedSentiment ?? 'Greed';

  return (
    <div className="space-y-8">
      {/* Hero Banner & Live AI Market Summary */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Real-Time Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            One Platform. <br className="hidden sm:inline" />
            <span className="text-emerald-400">Complete Crypto Intelligence.</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Track real-time cryptocurrency markets, forecast price movements across multi-horizons, explore AI sentiment intelligence, and manage personal portfolio risk with institutional precision.
          </p>

          {/* AI Executive Summary Card */}
          <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-emerald-500/20 text-xs text-slate-200 leading-relaxed font-sans space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Today's Live AI Market Digest</span>
            </div>
            {isSummaryLoading ? (
              <div className="flex items-center gap-2 text-slate-400 py-1 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Synthesizing live aggregate liquidity & sentiment...</span>
              </div>
            ) : (
              <p className="text-slate-200">{aiSummary}</p>
            )}
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <Button variant="primary" size="sm" onClick={() => onNavigate('/markets')}>
              Explore Markets
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onNavigate('/ai-intelligence')}>
              Ask AI Assistant
            </Button>
            <Button variant="outline" size="sm" onClick={() => onNavigate('/forecast')}>
              View Price Forecasts
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('/portfolio')}>
              Portfolio Tracker
            </Button>
          </div>
        </div>
      </div>

      {/* Global Market Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Market Cap */}
        <Card className="p-4">
          <span className="text-[11px] font-mono text-slate-400 block">Total Market Cap</span>
          <span className="text-lg sm:text-xl font-extrabold font-mono text-white mt-1 block">
            ${((globalData?.totalMarketCap || 2.85e12) / 1e12).toFixed(2)}T
          </span>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" />
            +{(globalData?.marketCapChange24h || 1.85)}% 24h
          </span>
        </Card>

        {/* 24h Global Volume */}
        <Card className="p-4">
          <span className="text-[11px] font-mono text-slate-400 block">24h Global Volume</span>
          <span className="text-lg sm:text-xl font-extrabold font-mono text-white mt-1 block">
            ${((globalData?.total24hVolume || 1.14e11) / 1e9).toFixed(1)}B
          </span>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">Liquid exchange turnover</span>
        </Card>

        {/* Bitcoin Dominance */}
        <Card className="p-4">
          <span className="text-[11px] font-mono text-slate-400 block">Bitcoin Dominance</span>
          <span className="text-lg sm:text-xl font-extrabold font-mono text-white mt-1 block">
            {globalData?.btcDominance || 56.4}%
          </span>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">BTC.D market share</span>
        </Card>

        {/* Fear & Greed Index */}
        <Card
          className="p-4 cursor-pointer hover:border-slate-700 transition-colors"
          onClick={() => onNavigate('/sentiment')}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">Fear & Greed</span>
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-lg sm:text-xl font-extrabold font-mono text-emerald-400 mt-1 block">
            {fearGreed} / 100
          </span>
          <span className="text-[10px] font-mono text-slate-300 mt-0.5 block">{fearGreedSentiment}</span>
        </Card>

        {/* Bitcoin Spot Spotlight */}
        <Card
          className="p-4 cursor-pointer hover:border-slate-700 transition-colors"
          onClick={() => onNavigate('/coin/BTC')}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">Bitcoin Spot</span>
            <span className="text-[10px] font-mono text-emerald-400">BTC</span>
          </div>
          <span className="text-lg sm:text-xl font-extrabold font-mono text-white mt-1 block">
            ${btcCoin ? btcCoin.price.toLocaleString() : '77,092'}
          </span>
          {btcCoin && (
            <span
              className={`text-[10px] font-mono flex items-center gap-0.5 mt-0.5 ${
                btcCoin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {btcCoin.change24h >= 0 ? '+' : ''}{btcCoin.change24h}%
            </span>
          )}
        </Card>

        {/* Ethereum Spot Spotlight */}
        <Card
          className="p-4 cursor-pointer hover:border-slate-700 transition-colors"
          onClick={() => onNavigate('/coin/ETH')}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">Ethereum Spot</span>
            <span className="text-[10px] font-mono text-cyan-400">ETH</span>
          </div>
          <span className="text-lg sm:text-xl font-extrabold font-mono text-white mt-1 block">
            ${ethCoin ? ethCoin.price.toLocaleString() : '2,270'}
          </span>
          {ethCoin && (
            <span
              className={`text-[10px] font-mono flex items-center gap-0.5 mt-0.5 ${
                ethCoin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {ethCoin.change24h >= 0 ? '+' : ''}{ethCoin.change24h}%
            </span>
          )}
        </Card>
      </div>

      {/* Featured Cryptocurrencies Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Market Bluechips</h2>
            <span className="text-xs text-slate-400">Highest market capitalization protocols</span>
          </div>
          <button
            onClick={() => onNavigate('/markets')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Markets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coins.slice(0, 4).map((coin) => (
            <Card
              key={coin.symbol}
              onClick={() => onNavigate(`/coin/${coin.symbol}`)}
              className="p-4 hover:border-slate-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                    {coin.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {coin.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">{coin.symbol} / USDT</div>
                  </div>
                </div>
                <PriceChange value={coin.change24h} />
              </div>

              <div className="mt-3 flex items-baseline justify-between font-mono">
                <span className="text-lg font-bold text-white">
                  ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">
                  Vol: ${(coin.volume24h / 1e6).toFixed(1)}M
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Gainers and Losers Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-white">Top 24h Gainers</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
              <button
                onClick={() => setGainersPage((p) => Math.max(1, p - 1))}
                disabled={gainersPage === 1}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>{gainersPage}</span>
              <button
                onClick={() => setGainersPage((p) => p + 1)}
                disabled={paginatedGainers.length < pageSize}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-800/60">
            {paginatedGainers.map((c) => (
              <div
                key={c.symbol}
                onClick={() => onNavigate(`/coin/${c.symbol}`)}
                className="py-2.5 flex items-center justify-between hover:bg-slate-800/40 rounded-lg px-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                    {c.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">{c.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 ml-1.5">{c.symbol}</span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs text-white font-semibold">
                    ${c.price < 1 ? c.price.toFixed(4) : c.price.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold">+{c.change24h}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Losers */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-bold text-white">Top 24h Losers</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
              <button
                onClick={() => setLosersPage((p) => Math.max(1, p - 1))}
                disabled={losersPage === 1}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>{losersPage}</span>
              <button
                onClick={() => setLosersPage((p) => p + 1)}
                disabled={paginatedLosers.length < pageSize}
                className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-800/60">
            {paginatedLosers.map((c) => (
              <div
                key={c.symbol}
                onClick={() => onNavigate(`/coin/${c.symbol}`)}
                className="py-2.5 flex items-center justify-between hover:bg-slate-800/40 rounded-lg px-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-rose-500/10 text-rose-400 font-mono font-bold text-xs flex items-center justify-center">
                    {c.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">{c.name}</span>
                    <span className="text-[10px] font-mono text-slate-500 ml-1.5">{c.symbol}</span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs text-white font-semibold">
                    ${c.price < 1 ? c.price.toFixed(4) : c.price.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-rose-400 font-bold">{c.change24h}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Heatmap & Intelligence Tools Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          onClick={() => onNavigate('/heatmap')}
          className="p-5 border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-3">
            <Boxes className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
            Market Sector Heatmap
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Visual treemap weighting Layer 1, DeFi, and Layer 2 capital distribution.
          </p>
        </Card>

        <Card
          onClick={() => onNavigate('/forecast')}
          className="p-5 border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
            Price Forecast Projections
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Statistical multi-horizon volatility envelopes and price target ranges.
          </p>
        </Card>

        <Card
          onClick={() => onNavigate('/risk-analysis')}
          className="p-5 border-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
            Risk Analysis Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Transparent liquidity depth and drawdown sensitivity classifications.
          </p>
        </Card>
      </div>
    </div>
  );
};
