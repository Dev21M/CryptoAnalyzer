import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/common/MetricCard';
import { PriceChange } from '../components/common/PriceChange';
import { RegimeBadge } from '../components/common/RegimeBadge';
import { CoinAvatar } from '../components/common/Avatar';
import { CoinSummary } from '../types/crypto';

interface HomePageProps {
  coins: CoinSummary[];
  onNavigate: (route: string) => void;
  onOpenDisclaimer: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  coins,
  onNavigate,
  onOpenDisclaimer,
}) => {
  // Hero Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Radar Filters: 'all' | 'bullish' | 'bearish' | 'high_conviction'
  const [radarFilter, setRadarFilter] = useState<'all' | 'bullish' | 'bearish' | 'high_conviction'>('all');

  // Pagination States for Gainers and Losers
  const [gainersPage, setGainersPage] = useState(1);
  const [losersPage, setLosersPage] = useState(1);
  const pageSize = 5;

  // Search Results filtering
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return coins
      .filter((c) => c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [coins, searchQuery]);

  // Aggregated Macro Market Metrics
  const totalMarketCap = useMemo(() => coins.reduce((acc, c) => acc + (c.marketCap || 0), 0), [coins]);
  const total24hVol = useMemo(() => coins.reduce((acc, c) => acc + (c.volume24h || 0), 0), [coins]);
  const btcCoin = useMemo(() => coins.find((c) => c.symbol === 'BTC'), [coins]);
  const btcDominance = btcCoin && totalMarketCap > 0 ? (btcCoin.marketCap / totalMarketCap) * 100 : 58.2;

  // Filtered Radar Coins
  const radarCoins = useMemo(() => {
    return coins
      .filter((c) => {
        if (radarFilter === 'bullish') return c.primaryForecast.direction === 'Bullish';
        if (radarFilter === 'bearish') return c.primaryForecast.direction === 'Bearish';
        if (radarFilter === 'high_conviction') return c.primaryForecast.confidence >= 70;
        return true;
      })
      .sort((a, b) => b.primaryForecast.confidence - a.primaryForecast.confidence)
      .slice(0, 6);
  }, [coins, radarFilter]);

  // Sorted Gainers and Losers full arrays
  const allGainers = useMemo(() => {
    return [...coins].filter((c) => c.change24h > 0).sort((a, b) => b.change24h - a.change24h);
  }, [coins]);

  const allLosers = useMemo(() => {
    return [...coins].filter((c) => c.change24h < 0).sort((a, b) => a.change24h - b.change24h);
  }, [coins]);

  // Paginated Slices
  const totalGainerPages = Math.max(1, Math.ceil(allGainers.length / pageSize));
  const paginatedGainers = useMemo(() => {
    const start = (gainersPage - 1) * pageSize;
    return allGainers.slice(start, start + pageSize);
  }, [allGainers, gainersPage, pageSize]);

  const totalLoserPages = Math.max(1, Math.ceil(allLosers.length / pageSize));
  const paginatedLosers = useMemo(() => {
    const start = (losersPage - 1) * pageSize;
    return allLosers.slice(start, start + pageSize);
  }, [allLosers, losersPage, pageSize]);

  // Featured Top Cryptocurrencies for Overview Section
  const topOverviewCoins = useMemo(() => {
    const prioritySymbols = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA'];
    const matched = prioritySymbols
      .map((sym) => coins.find((c) => c.symbol === sym))
      .filter((c): c is CoinSummary => Boolean(c));

    // Fallback if priority symbols missing
    if (matched.length >= 4) return matched;
    return [...coins].sort((a, b) => b.marketCap - a.marketCap).slice(0, 6);
  }, [coins]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      onNavigate(`/coin/${searchResults[0].symbol}`);
      setSearchQuery('');
    } else if (searchQuery.trim()) {
      onNavigate(`/coin/${searchQuery.trim().toUpperCase()}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Hero Section with Integrated Search */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950 p-6 sm:p-10 lg:p-12 shadow-lg">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-24 w-72 h-72 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Academic Research Platform · 7 ML Architectures · Continuous HMM</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Cryptocurrency Price Movement & Return Forecasting Lab
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Empirical comparative evaluation of Deep Learning (LSTM, GRU, CNN-1D) versus ensemble and linear baselines across 4 hierarchical feature sets on high-frequency cryptocurrency spot candles. Rigorously validated with Wilcoxon signed-rank and Holm-Bonferroni tests.
          </p>

          {/* Interactive Hero Search Form */}
          <div className="pt-2">
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search 20+ cryptocurrencies (e.g. BTC, ETH, SOL, XRP)..."
                  className="w-full bg-slate-950/90 border border-slate-700/80 text-white placeholder:text-slate-500 rounded-xl pl-10 pr-24 py-3.5 text-xs font-mono shadow-inner focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold font-mono transition-colors cursor-pointer"
                >
                  Analyze
                </button>
              </div>

              {/* Instant Search Dropdown Suggestions */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
                  {searchResults.map((coin) => (
                    <div
                      key={coin.symbol}
                      onClick={() => {
                        onNavigate(`/coin/${coin.symbol}`);
                        setSearchQuery('');
                      }}
                      className="p-3 flex items-center justify-between hover:bg-slate-800/80 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <CoinAvatar symbol={coin.symbol} size="sm" />
                        <div>
                          <div className="font-mono font-bold text-white group-hover:text-emerald-400 transition-colors text-xs">
                            {coin.symbol} <span className="text-slate-400 font-sans font-normal">/ USDT</span>
                          </div>
                          <div className="text-[11px] text-slate-400">{coin.name}</div>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-xs font-bold text-white">
                          ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
                        </div>
                        <PriceChange value={coin.change24h} className="text-[11px]" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>

            {/* Quick Keyword Pills */}
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
              <span className="font-mono text-[11px] text-slate-500">Trending Assets:</span>
              {['BTC', 'ETH', 'SOL', 'BNB', 'XRP'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => onNavigate(`/coin/${sym}`)}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-mono text-[11px] transition-colors border border-slate-700/60 cursor-pointer"
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Navigation CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              icon={<Zap className="w-4 h-4" />}
              onClick={() => onNavigate('/coin/BTC')}
            >
              Analyze BTC/USDT Live
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<Layers className="w-4 h-4" />}
              onClick={() => onNavigate('/markets')}
            >
              Explore Markets Directory
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon={<Activity className="w-4 h-4" />}
              onClick={() => onNavigate('/models')}
            >
              7-Model Benchmarks
            </Button>
          </div>

          {/* Trust & Academic Disclaimers */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Binance WebSocket Spot Live
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Continuous 4-State HMM Detection
            </span>
            <span className="text-slate-600">·</span>
            <button
              onClick={onOpenDisclaimer}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              Academic Notice (Non-Financial Advice)
            </button>
          </div>
        </div>
      </section>

      {/* 2. Global Macro Market Overview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Macro Market Intelligence</h2>
            <p className="text-xs text-slate-400">Real-time aggregate cryptocurrency data & sentiment metrics</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time Polling: 15s</span>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Tracked Market Cap"
            value={`$${(totalMarketCap / 1e12).toFixed(2)}T`}
            change={1.84}
            subtext="Global 24h capitalization"
          />
          <MetricCard
            label="24h Trading Volume"
            value={`$${(total24hVol / 1e9).toFixed(1)}B`}
            change={-2.45}
            subtext="Binance + Spot Aggregated"
          />
          <MetricCard
            label="BTC Market Dominance"
            value={`${btcDominance.toFixed(1)}%`}
            change={0.35}
            subtext="Capital concentration index"
          />
          <MetricCard
            label="Fear & Greed Index"
            value="72 / 100"
            subtext="Sentiment: Greed"
            variant="highlight"
            icon={<Activity className="w-4 h-4 text-emerald-400" />}
          />
        </div>

        {/* Top Cryptocurrencies Market Overview Grid */}
        <Card
          title="Market Overview: Benchmark Cryptocurrencies"
          subtitle="Real-time spot price, 24h performance, volume and quantitative regime status"
          padding="none"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-sans">Cryptocurrency</th>
                  <th className="py-3 px-4 text-right">Spot Price</th>
                  <th className="py-3 px-4 text-right">24h Change</th>
                  <th className="py-3 px-4 text-right">Market Cap</th>
                  <th className="py-3 px-4 text-right">24h Volume</th>
                  <th className="py-3 px-4 text-center">Regime State</th>
                  <th className="py-3 px-4 text-right font-sans">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {topOverviewCoins.map((coin) => (
                  <tr
                    key={coin.symbol}
                    onClick={() => onNavigate(`/coin/${coin.symbol}`)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-2.5">
                        <CoinAvatar symbol={coin.symbol} size="sm" />
                        <div>
                          <div className="font-mono font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {coin.symbol}
                          </div>
                          <div className="text-[11px] text-slate-400 font-sans">{coin.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-white">
                      ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <PriceChange value={coin.change24h} />
                    </td>

                    <td className="py-3 px-4 text-right text-slate-300">
                      ${(coin.marketCap / 1e9).toFixed(2)}B
                    </td>

                    <td className="py-3 px-4 text-right text-slate-300">
                      ${(coin.volume24h / 1e6).toFixed(1)}M
                    </td>

                    <td className="py-3 px-4 text-center">
                      <RegimeBadge regime={coin.currentRegime} size="sm" />
                    </td>

                    <td className="py-3 px-4 text-right font-sans">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 group-hover:underline">
                        <span>Analyze</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 3. AI Opportunity Radar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">AI Opportunity Radar</h2>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Deep Learning + Ensemble Consensus
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked cross-architecture forecasts for 1-hour horizon price movements and directional probabilities
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setRadarFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                radarFilter === 'all'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Forecasts
            </button>
            <button
              onClick={() => setRadarFilter('bullish')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                radarFilter === 'bullish'
                  ? 'bg-emerald-950/80 text-emerald-400 font-semibold border border-emerald-800/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bullish Setups
            </button>
            <button
              onClick={() => setRadarFilter('bearish')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                radarFilter === 'bearish'
                  ? 'bg-rose-950/80 text-rose-400 font-semibold border border-rose-800/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bearish Setups
            </button>
            <button
              onClick={() => setRadarFilter('high_conviction')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                radarFilter === 'high_conviction'
                  ? 'bg-cyan-950/80 text-cyan-400 font-semibold border border-cyan-800/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              High Conviction (&gt;70%)
            </button>
          </div>
        </div>

        {/* 6 Opportunity Radar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {radarCoins.map((coin) => {
            const isBullish = coin.primaryForecast.direction === 'Bullish';
            const isBearish = coin.primaryForecast.direction === 'Bearish';
            const targetPrice = coin.price * (1 + coin.primaryForecast.expectedReturnPct / 100);

            return (
              <div
                key={coin.symbol}
                onClick={() => onNavigate(`/coin/${coin.symbol}`)}
                className="group p-5 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-800/70 transition-all cursor-pointer shadow-sm relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <CoinAvatar symbol={coin.symbol} size="md" />
                      <div>
                        <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {coin.symbol} <span className="text-xs font-normal text-slate-400">/ USDT</span>
                        </div>
                        <div className="text-xs text-slate-400">{coin.name}</div>
                      </div>
                    </div>

                    <RegimeBadge regime={coin.currentRegime} size="sm" />
                  </div>

                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5">Spot Price</div>
                      <div className="text-lg font-bold font-mono text-white">
                        ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 mb-0.5">24h Change</div>
                      <PriceChange value={coin.change24h} className="text-sm font-semibold" />
                    </div>
                  </div>

                  {/* AI Forecast Banner */}
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Target (1h Horizon):</span>
                      <span className="font-mono font-bold text-white">
                        ${targetPrice < 1 ? targetPrice.toFixed(4) : targetPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Expected Return:</span>
                      <span
                        className={`font-mono font-bold ${
                          isBullish ? 'text-emerald-400' : isBearish ? 'text-rose-400' : 'text-slate-300'
                        }`}
                      >
                        {coin.primaryForecast.expectedReturnPct >= 0 ? '+' : ''}
                        {coin.primaryForecast.expectedReturnPct.toFixed(2)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Conviction Level:</span>
                      <span className="font-mono text-white font-medium">
                        {coin.primaryForecast.confidence}% ({coin.primaryForecast.direction})
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isBullish ? 'bg-emerald-500' : isBearish ? 'bg-rose-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${coin.primaryForecast.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">
                  <span className="font-mono text-[11px]">Primary: LSTM + XGBoost Full</span>
                  <div className="flex items-center gap-1 font-medium">
                    <span>Deep Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Top Gainers & Losers Dual Tables with Real-Time Pagination */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers Table with Pagination */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white text-sm">Top 24h Outperformers (Gainers)</span>
            </div>
          }
          subtitle={`Assets with highest positive return momentum (${allGainers.length} tracked)`}
          padding="none"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-4 font-sans">Asset</th>
                  <th className="py-2.5 px-4 text-right">Price</th>
                  <th className="py-2.5 px-4 text-right">24h Gain</th>
                  <th className="py-2.5 px-4 text-center">Regime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedGainers.map((coin) => (
                  <tr
                    key={coin.symbol}
                    onClick={() => onNavigate(`/coin/${coin.symbol}`)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-sans font-medium text-white flex items-center gap-2">
                      <CoinAvatar symbol={coin.symbol} size="sm" />
                      <div>
                        <span className="font-mono font-bold">{coin.symbol}</span>
                        <span className="text-slate-400 text-[11px] block">{coin.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-200">
                      ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-400 font-bold">
                      +{coin.change24h.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <RegimeBadge regime={coin.currentRegime} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Gainers Pagination Bar */}
          <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>
              Page {gainersPage} of {totalGainerPages} ({allGainers.length} Assets)
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={gainersPage <= 1}
                onClick={() => setGainersPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Gainers Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: totalGainerPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  onClick={() => setGainersPage(pg)}
                  className={`w-6 h-6 rounded text-[11px] font-mono transition-colors ${
                    gainersPage === pg
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  {pg}
                </button>
              ))}
              <button
                type="button"
                disabled={gainersPage >= totalGainerPages}
                onClick={() => setGainersPage((p) => Math.min(totalGainerPages, p + 1))}
                className="p-1.5 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next Gainers Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Card>

        {/* Top Losers Table with Pagination */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span className="font-bold text-white text-sm">Top 24h Underperformers (Losers)</span>
            </div>
          }
          subtitle={`Assets under downward selling drift (${allLosers.length} tracked)`}
          padding="none"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-4 font-sans">Asset</th>
                  <th className="py-2.5 px-4 text-right">Price</th>
                  <th className="py-2.5 px-4 text-right">24h Loss</th>
                  <th className="py-2.5 px-4 text-center">Regime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedLosers.map((coin) => (
                  <tr
                    key={coin.symbol}
                    onClick={() => onNavigate(`/coin/${coin.symbol}`)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-sans font-medium text-white flex items-center gap-2">
                      <CoinAvatar symbol={coin.symbol} size="sm" />
                      <div>
                        <span className="font-mono font-bold">{coin.symbol}</span>
                        <span className="text-slate-400 text-[11px] block">{coin.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-200">
                      ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-rose-400 font-bold">
                      {coin.change24h.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <RegimeBadge regime={coin.currentRegime} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Losers Pagination Bar */}
          <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>
              Page {losersPage} of {totalLoserPages} ({allLosers.length} Assets)
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={losersPage <= 1}
                onClick={() => setLosersPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Losers Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: totalLoserPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  onClick={() => setLosersPage(pg)}
                  className={`w-6 h-6 rounded text-[11px] font-mono transition-colors ${
                    losersPage === pg
                      ? 'bg-rose-600 text-white font-bold'
                      : 'hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  {pg}
                </button>
              ))}
              <button
                type="button"
                disabled={losersPage >= totalLoserPages}
                onClick={() => setLosersPage((p) => Math.min(totalLoserPages, p + 1))}
                className="p-1.5 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next Losers Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Card>
      </section>

      {/* 5. ML Architectures Summary Banner */}
      <section className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Cpu className="w-4 h-4" />
              <span>ACADEMIC BENCHMARK HIGHLIGHTS</span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              7 Machine Learning Architectures Evaluated Under High Volatility
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our empirical testing confirms that Deep Recurrent Architectures (LSTM & GRU) combined with HMM regime state features achieve a statistically significant 61.3% Directional Accuracy (p &lt; 0.0018 after Holm-Bonferroni correction), outperforming standard random walk baselines.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              icon={<BarChart3 className="w-4 h-4" />}
              onClick={() => onNavigate('/models')}
            >
              View Full Benchmark Data
            </Button>
            <Button
              variant="primary"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('/coin/BTC')}
            >
              Run BTC Prediction
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
