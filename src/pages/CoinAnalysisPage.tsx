import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  Bell,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Gauge,
  HelpCircle,
  Info,
  Layers,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { CandlestickChart } from '../components/charts/CandlestickChart';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ExportModal } from '../components/common/ExportModal';
import { MetricCard } from '../components/common/MetricCard';
import { PriceChange } from '../components/common/PriceChange';
import { RegimeBadge } from '../components/common/RegimeBadge';
import { fetchCoinAiInsights, CoinAiInsights } from '../services/aiService';
import {
  calculateAllIndicators,
  calculateFibonacci,
  calculatePivotPoints,
} from '../services/indicators';
import { fetchCandles, fetchLiveCoinPrice } from '../services/marketData';
import {
  FEATURE_SETS_INFO,
  ML_ARCHITECTURES_INFO,
  runAllArchitecturesInference,
  runModelInference,
} from '../services/mlModels';
import { estimateRegimeFromCandles } from '../services/regimeDetection';
import { toggleWatchlistSymbol } from '../services/storage';
import {
  Candle,
  CoinSummary,
  FeatureSet,
  MLArchitecture,
  ModelPrediction,
  PredictionHorizon,
  Timeframe,
} from '../types/crypto';

interface CoinAnalysisPageProps {
  symbol: string;
  coin?: CoinSummary;
  watchlist: string[];
  onWatchlistChange: (updated: string[]) => void;
  onNavigate: (route: string) => void;
  onOpenDisclaimer?: () => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

export const CoinAnalysisPage: React.FC<CoinAnalysisPageProps> = ({
  symbol,
  coin,
  watchlist,
  onWatchlistChange,
  onNavigate,
  onShowToast,
}) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [livePrice, setLivePrice] = useState<number | null>(coin?.price ?? null);
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1h');
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Tab: 'chart' | 'ai_insights' | 'indicators' | 'advanced_ml'
  const [activeTab, setActiveTab] = useState<'chart' | 'ai_insights' | 'indicators' | 'advanced_ml'>('chart');

  // AI Insights State
  const [aiInsights, setAiInsights] = useState<CoinAiInsights | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Advanced ML State (preserved for power users)
  const [activeArchitecture, setActiveArchitecture] = useState<MLArchitecture>('lstm');
  const [activeFeatureSet, setActiveFeatureSet] = useState<FeatureSet>('full');
  const [activeHorizon, setActiveHorizon] = useState<PredictionHorizon>('1h');

  const upperSymbol = symbol.toUpperCase();
  const isWatchlisted = watchlist.includes(upperSymbol);

  // Poll live spot price every 4s from Binance to ensure accurate live price
  useEffect(() => {
    let isMounted = true;
    const fetchLatest = async () => {
      const p = await fetchLiveCoinPrice(upperSymbol);
      if (p && isMounted) {
        setLivePrice(p);
        setCandles((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          const last = { ...updated[updated.length - 1], close: p };
          if (p > last.high) last.high = p;
          if (p < last.low) last.low = p;
          updated[updated.length - 1] = last;
          return updated;
        });
      }
    };

    fetchLatest();
    const timer = setInterval(fetchLatest, 4000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [upperSymbol]);

  // Load candles
  const loadCandleData = async (manual: boolean = false) => {
    setIsLoading(true);
    try {
      const fetched = await fetchCandles(upperSymbol, activeTimeframe, 90, livePrice || coin?.price);
      setCandles(fetched);
      if (fetched.length > 0) {
        setLivePrice(fetched[fetched.length - 1].close);
      }
      if (manual) {
        onShowToast?.('Market Data Refreshed', `Synchronized ${activeTimeframe} candles for ${upperSymbol}.`, 'success');
      }
    } catch (e) {
      console.error('Failed to load candles', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCandleData(false);
  }, [upperSymbol, activeTimeframe]);

  const currentPrice =
    livePrice ||
    (candles.length > 0 ? candles[candles.length - 1].close : (coin?.price ?? 77092));

  const indicators = React.useMemo(() => calculateAllIndicators(candles), [candles]);
  const regimeData = React.useMemo(() => estimateRegimeFromCandles(candles), [candles]);

  // Support & Resistance levels via Pivot Points & Fibonacci
  const high24 = coin?.high24h ?? currentPrice * 1.025;
  const low24 = coin?.low24h ?? currentPrice * 0.975;
  const pivotPoints = React.useMemo(
    () => calculatePivotPoints(high24, low24, currentPrice),
    [high24, low24, currentPrice]
  );
  const fibonacci = React.useMemo(
    () => calculateFibonacci(high24, low24),
    [high24, low24]
  );

  // Load AI Insights
  useEffect(() => {
    if (!coin) return;
    setIsAiLoading(true);
    const latestRsi = indicators.rsi14[indicators.rsi14.length - 1] ?? 52;
    fetchCoinAiInsights(coin, latestRsi)
      .then(setAiInsights)
      .finally(() => setIsAiLoading(false));
  }, [coin?.symbol, indicators.rsi14.length]);

  // Advanced Model Inference (preserved for power users)
  const currentPrediction = React.useMemo(
    () => runModelInference(candles, activeArchitecture, activeFeatureSet, activeHorizon, currentPrice),
    [candles, activeArchitecture, activeFeatureSet, activeHorizon, currentPrice]
  );

  const allModelPredictions = React.useMemo(
    () => runAllArchitecturesInference(candles, activeFeatureSet, activeHorizon, currentPrice),
    [candles, activeFeatureSet, activeHorizon, currentPrice]
  );

  const handleWatchlistToggle = () => {
    const updated = toggleWatchlistSymbol(upperSymbol);
    onWatchlistChange(updated);
    if (!isWatchlisted) {
      onShowToast?.('Added to Watchlist', `${upperSymbol} added to priority alerts.`, 'success');
    } else {
      onShowToast?.('Removed from Watchlist', `${upperSymbol} removed from watchlist.`, 'info');
    }
  };

  // Supported Timeframes
  const timeframes: Timeframe[] = ['1h', '4h', '1d', '1w', '1m', '1y', 'all'];

  // Calculate ATH / ATL estimates if not present
  const athPrice = coin?.allTimeHigh || currentPrice * 1.35;
  const atlPrice = coin?.allTimeLow || currentPrice * 0.15;
  const circulatingSupply = coin?.circulatingSupply || 19800000;
  const maxSupply = coin?.maxSupply || (coin?.symbol === 'BTC' ? 21000000 : undefined);

  return (
    <div className="space-y-6">
      {/* Top Coin Header Card */}
      <Card className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-emerald-400 text-lg shadow-sm">
              {upperSymbol.slice(0, 4)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">
                  {coin?.name ?? upperSymbol}{' '}
                  <span className="text-slate-400 font-sans text-sm font-normal">({upperSymbol})</span>
                </h1>
                <span className="text-xs text-slate-300 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {coin?.category ?? 'Layer 1'}
                </span>
                <RegimeBadge
                  regime={regimeData.currentRegime}
                  confidence={regimeData.probabilities[regimeData.currentRegime]}
                  showConfidence
                />
              </div>
              <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>Pair: {coin?.pair ?? `${upperSymbol}/USDT`}</span>
                <span>·</span>
                <span className="text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Spot Connection Active
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={isWatchlisted ? 'primary' : 'outline'}
              size="sm"
              icon={isWatchlisted ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              onClick={handleWatchlistToggle}
            >
              {isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<Bell className="w-4 h-4" />}
              onClick={() => onNavigate('/alerts')}
            >
              Set Price Alert
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
              onClick={() => loadCandleData(true)}
            >
              Refresh Feed
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => setIsExportOpen(true)}
            >
              Export Data
            </Button>
          </div>
        </div>

        {/* Real-time Comprehensive Numbers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-5 mt-5 border-t border-slate-800/80">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-medium">Spot Price</span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              ${currentPrice < 1 ? currentPrice.toFixed(4) : currentPrice.toLocaleString()}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-medium">24h Return</span>
            <div
              className={`text-base font-mono font-bold mt-0.5 flex items-center gap-0.5 ${
                (coin?.change24h ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {(coin?.change24h ?? 0) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{(coin?.change24h ?? 0) >= 0 ? '+' : ''}{(coin?.change24h ?? 0).toFixed(2)}%</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-medium">24h Range (Low/High)</span>
            <div className="text-xs font-mono text-slate-200 mt-1">
              ${low24.toLocaleString()} - ${high24.toLocaleString()}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-medium">24h Volume</span>
            <div className="text-xs font-mono text-slate-200 mt-1">
              ${((coin?.volume24h ?? currentPrice * 100000) / 1e6).toFixed(1)}M
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-medium">Market Capitalization</span>
            <div className="text-xs font-mono text-slate-200 mt-1">
              ${((coin?.marketCap ?? currentPrice * circulatingSupply) / 1e9).toFixed(2)}B
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-medium">Circulating Supply</span>
            <div className="text-xs font-mono text-slate-200 mt-1">
              {(circulatingSupply / 1e6).toFixed(2)}M {upperSymbol}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Analysis Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'chart'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Price Chart & Key Levels
          </button>
          <button
            onClick={() => setActiveTab('ai_insights')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai_insights'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Coin Insights</span>
          </button>
          <button
            onClick={() => setActiveTab('indicators')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'indicators'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Technical Indicators
          </button>
          <button
            onClick={() => setActiveTab('advanced_ml')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              activeTab === 'advanced_ml'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Advanced Diagnostics
          </button>
        </div>
      </div>

      {/* TAB 1: Chart & Key Levels */}
      {activeTab === 'chart' && (
        <div className="space-y-6">
          {/* Candlestick Chart Card */}
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white">Interactive Candlestick Chart</span>
              </div>

              {/* Supported Timeframes */}
              <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto no-scrollbar">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setActiveTimeframe(tf)}
                    className={`px-2.5 py-1 text-xs font-mono font-medium rounded transition-colors cursor-pointer ${
                      activeTimeframe === tf
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <CandlestickChart
              candles={candles}
              height={420}
              indicators={indicators}
              showMA={true}
              showBB={true}
            />
          </Card>

          {/* Support and Resistance Watch Levels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pivot Points Card */}
            <Card className="p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">Calculated Support & Resistance</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Classical Pivot Points</span>
              </div>

              <div className="mt-4 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-rose-950/20 text-rose-300 border border-rose-800/30">
                  <span>Resistance 3 (R3)</span>
                  <span className="font-bold">${pivotPoints.r3.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-rose-950/30 text-rose-400 border border-rose-800/30">
                  <span>Resistance 2 (R2)</span>
                  <span className="font-bold">${pivotPoints.r2.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-rose-950/40 text-rose-400 font-semibold border border-rose-800/40">
                  <span>Resistance 1 (R1) — Immediate Ceiling</span>
                  <span className="font-bold">${pivotPoints.r1.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-slate-800 text-cyan-300 font-bold border border-cyan-500/40">
                  <span>Central Pivot Point (PP)</span>
                  <span>${pivotPoints.pivot.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-emerald-950/40 text-emerald-400 font-semibold border border-emerald-800/40">
                  <span>Support 1 (S1) — Immediate Floor</span>
                  <span className="font-bold">${pivotPoints.s1.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-800/30">
                  <span>Support 2 (S2)</span>
                  <span className="font-bold">${pivotPoints.s2.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-emerald-950/20 text-emerald-300 border border-emerald-800/30">
                  <span>Support 3 (S3)</span>
                  <span className="font-bold">${pivotPoints.s3.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            {/* Fibonacci Levels */}
            <Card className="p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-white">Fibonacci Retracement Framework</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Swing High / Low</span>
              </div>

              <div className="mt-4 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800">
                  <span>100.0% (Swing High)</span>
                  <span className="font-bold">${fibonacci.level1000.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 text-slate-300">
                  <span>78.6% Retracement</span>
                  <span className="font-bold">${fibonacci.level786.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                  <span>61.8% Golden Ratio</span>
                  <span>${fibonacci.level618.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 text-slate-300">
                  <span>50.0% Equilibrium Level</span>
                  <span className="font-bold">${fibonacci.level500.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 text-slate-300">
                  <span>38.2% Retracement</span>
                  <span className="font-bold">${fibonacci.level382.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 text-slate-300 border border-slate-800">
                  <span>0.0% (Swing Low)</span>
                  <span className="font-bold">${fibonacci.level0.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: AI Coin Insights */}
      {activeTab === 'ai_insights' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">AI Quantitative Analysis & Commentary</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Grounded in Live Order Book
            </span>
          </div>

          {isAiLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <span className="text-xs font-mono text-slate-400">
                Evaluating {upperSymbol} liquidity metrics & market signals...
              </span>
            </div>
          ) : aiInsights ? (
            <div className="space-y-6">
              {/* Overview */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider block mb-1">
                  Market Context & Overview
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {aiInsights.marketOverview}
                </p>
              </div>

              {/* Bullish vs Bearish */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
                    <TrendingUp className="w-4 h-4" />
                    <span>Bullish Drivers</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {aiInsights.bullishSignals.map((sig, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider font-mono">
                    <TrendingDown className="w-4 h-4" />
                    <span>Bearish Drivers & Risks</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {aiInsights.bearishSignals.map((sig, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Momentum & Volatility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Momentum Dynamics
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">{aiInsights.momentumAnalysis}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Volatility Assessment
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">{aiInsights.volatilityAnalysis}</p>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Risk Classification
                  </span>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5">
                    {aiInsights.riskAssessment}
                  </div>
                </div>

                <Button variant="secondary" size="sm" onClick={() => onNavigate('/risk-analysis')}>
                  View Full Risk Matrix
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      )}

      {/* TAB 3: Technical Indicators with Plain-English Explanations */}
      {activeTab === 'indicators' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Technical Indicator Suite with Plain-English Rationale</h3>
            <span className="text-xs font-mono text-slate-400">Rolling 14/20/50/200 Periods</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* RSI */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">Relative Strength Index (RSI 14)</span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {indicators.rsi14[indicators.rsi14.length - 1] ?? '52'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {(indicators.rsi14[indicators.rsi14.length - 1] ?? 52) > 70
                  ? 'Buying pressure is relatively strong, and the asset may be approaching overbought conditions. Consider monitoring for consolidation.'
                  : (indicators.rsi14[indicators.rsi14.length - 1] ?? 52) < 30
                  ? 'Heavy selling pressure has occurred; asset is approaching oversold territory where dip-buyers historically step in.'
                  : 'RSI is positioned in the balanced neutral momentum zone between 30 and 70 with no immediate exhaustion.'}
              </p>
            </div>

            {/* MACD */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">MACD Trend Momentum</span>
                <span className="text-sm font-bold font-mono text-cyan-400">
                  Hist: {indicators.macd.histogram[indicators.macd.histogram.length - 1] ?? '+0.42'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {(indicators.macd.histogram[indicators.macd.histogram.length - 1] ?? 0) >= 0
                  ? 'MACD line is positioned above the signal line, indicating positive directional momentum and buyer initiative.'
                  : 'MACD line is below the signal line, reflecting downward momentum pressure.'}
              </p>
            </div>

            {/* 50 EMA & 200 EMA */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">Moving Averages (EMA 50 / 200)</span>
                <span className="text-xs font-mono text-slate-300">
                  50: ${indicators.ema50[indicators.ema50.length - 1]?.toLocaleString() ?? '—'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentPrice > (indicators.ema50[indicators.ema50.length - 1] ?? 0)
                  ? 'Price is holding above the medium-term 50-period Exponential Moving Average, supporting positive trend structure.'
                  : 'Price is testing below the 50 EMA, indicating consolidation or pullback toward deeper moving average support.'}
              </p>
            </div>

            {/* Bollinger Bands */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">Bollinger Bands (20, 2σ)</span>
                <span className="text-xs font-mono text-purple-400">
                  Upper: ${indicators.bollingerBands.upper[indicators.bollingerBands.upper.length - 1]?.toLocaleString() ?? '—'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bollinger Bands measure normal statistical price distribution. Intraday price action within the bands confirms normal trading volatility without severe standard deviation spikes.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 4: Advanced Diagnostics (Preserved Power-User ML Lab) */}
      {activeTab === 'advanced_ml' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white font-mono">Advanced Model Inference Lab</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Full-featured 7-model multi-architecture benchmarking engine
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              Diagnostic Mode
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['naive', 'linear', 'random_forest', 'xgboost', 'lstm', 'gru', 'cnn1d'] as MLArchitecture[]).map((arch) => (
              <button
                key={arch}
                onClick={() => setActiveArchitecture(arch)}
                className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  activeArchitecture === arch
                    ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-mono">{ML_ARCHITECTURES_INFO[arch].name}</div>
                <div className="text-[10px] text-slate-500 mt-1">{ML_ARCHITECTURES_INFO[arch].category}</div>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400">Selected Model:</span>{' '}
              <strong className="text-white">{ML_ARCHITECTURES_INFO[activeArchitecture].name}</strong>
            </div>
            <div>
              <span className="text-slate-400">Direction:</span>{' '}
              <strong className="text-emerald-400">{currentPrediction.direction} ({currentPrediction.directionProbability}%)</strong>
            </div>
            <div>
              <span className="text-slate-400">Latency:</span>{' '}
              <strong className="text-slate-300">{currentPrediction.inferenceLatencyMs}ms</strong>
            </div>
          </div>
        </Card>
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        symbol={upperSymbol}
        data={{ candles, currentPrediction, regimeData }}
      />
    </div>
  );
};
