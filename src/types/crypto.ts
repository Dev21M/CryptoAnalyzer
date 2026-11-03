/**
 * CryptoAnalyzer - Core Types & Interfaces
 * Comprehensive professional cryptocurrency intelligence platform
 */

export type Timeframe = '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | '1m' | '1y' | 'all';

export type PredictionHorizon = '5m' | '15m' | '1h' | '4h' | '1d' | '24h' | '7d' | '30d';

export type MLArchitecture =
  | 'naive'
  | 'linear'
  | 'random_forest'
  | 'xgboost'
  | 'lstm'
  | 'gru'
  | 'cnn1d';

export type FeatureSet =
  | 'price_only' // 4 features: OHLC
  | 'price_volume' // 5 features: OHLCV
  | 'tech_indicators' // 19 features: OHLCV + RSI, MACD, EMA, BB, ATR, etc.
  | 'full'; // 24 features: above + HMM states, log returns, volatility ratios, flow proxy

export type MarketRegime = 'Bull' | 'Bear' | 'Sideways' | 'High Volatility';

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CoinSummary {
  symbol: string; // e.g. "BTC"
  name: string; // e.g. "Bitcoin"
  pair: string; // e.g. "BTC/USDT"
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  circulatingSupply: number;
  maxSupply?: number;
  allTimeHigh?: number;
  allTimeLow?: number;
  category: 'Layer 1' | 'DeFi' | 'AI & Big Data' | 'Layer 2' | 'Meme' | 'Infra';
  currentRegime: MarketRegime;
  regimeConfidence: number;
  primaryForecast: {
    direction: 'Bullish' | 'Bearish' | 'Neutral';
    expectedReturnPct: number;
    confidence: number;
    horizon: PredictionHorizon;
  };
  sparkline: number[];
}

export interface GlobalMarketData {
  totalMarketCap: number;
  total24hVolume: number;
  btcDominance: number;
  ethDominance: number;
  marketCapChange24h: number;
  fearGreedIndex: number;
  fearGreedSentiment: string;
  lastUpdated: number;
}

export interface TechnicalIndicators {
  sma20: (number | null)[];
  ema50: (number | null)[];
  ema200: (number | null)[];
  bollingerBands: {
    upper: (number | null)[];
    middle: (number | null)[];
    lower: (number | null)[];
  };
  rsi14: (number | null)[];
  macd: {
    macdLine: (number | null)[];
    signalLine: (number | null)[];
    histogram: (number | null)[];
  };
  atr14: (number | null)[];
}

export interface PivotPoints {
  pivot: number;
  r1: number;
  r2: number;
  r3: number;
  s1: number;
  s2: number;
  s3: number;
}

export interface FibonacciLevels {
  level0: number; // 0%
  level236: number; // 23.6%
  level382: number; // 38.2%
  level500: number; // 50%
  level618: number; // 61.8%
  level786: number; // 78.6%
  level1000: number; // 100%
}

export interface FeatureImportance {
  featureName: string;
  category: 'Price' | 'Volume' | 'Momentum' | 'Volatility' | 'Regime';
  importance: number; // 0 to 1
}

export interface ModelPrediction {
  architecture: MLArchitecture;
  architectureName: string;
  featureSet: FeatureSet;
  featureSetName: string;
  horizon: PredictionHorizon;
  currentPrice: number;
  predictedPrice: number;
  expectedReturnPct: number;
  confidenceInterval95: [number, number]; // [lower, upper]
  direction: 'Bullish' | 'Bearish' | 'Neutral';
  directionProbability: number; // 0 - 100%
  timestamp: number;
  featureImportances: FeatureImportance[];
  inferenceLatencyMs: number;
}

export interface ModelEvaluationMetric {
  architecture: MLArchitecture;
  name: string;
  category: 'Baseline' | 'Tree' | 'Deep Learning';
  featureSet: FeatureSet;
  rmse: number;
  mae: number;
  mape: number;
  directionalAccuracyPct: number;
  sharpeRatio: number;
  maxDrawdownPct: number;
  wilcoxonW: number;
  wilcoxonPValue: number;
  holmAdjustedPValue: number;
  isStatisticallySignificant: boolean; // p < 0.05
}

export interface HMMStateInfo {
  regime: MarketRegime;
  stateIndex: number;
  probability: number;
  meanReturn: number;
  annualizedVolatility: number;
  avgDurationCandles: number;
  description: string;
  optimalStrategy: string;
}

export interface TransitionMatrixRow {
  fromRegime: MarketRegime;
  transitions: { toRegime: MarketRegime; prob: number }[];
}

// Portfolio & Transaction Ledger
export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  buyPrice: number;
  buyDate: string;
  notes?: string;
}

export interface PortfolioTransaction {
  id: string;
  symbol: string;
  coinName: string;
  type: 'BUY' | 'SELL';
  amount: number;
  pricePerCoin: number;
  fee: number;
  totalValue: number;
  date: string;
  notes?: string;
}

// Price Alert
export interface PriceAlert {
  id: string;
  symbol: string;
  coinName: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW' | 'PERCENT_INCREASE' | 'PERCENT_DECREASE';
  percentageValue?: number;
  createdAt: string;
  triggered: boolean;
  triggeredAt?: string;
  active: boolean;
}

// News
export interface CryptoNewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: 'Bitcoin' | 'Ethereum' | 'Altcoins' | 'Blockchain' | 'Regulations' | 'Institutional Investments' | 'Market Updates';
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  aiTakeaway?: string;
}

// Price Forecast
export interface PriceForecastItem {
  symbol: string;
  coinName: string;
  currentPrice: number;
  horizon: '24h' | '7d' | '30d';
  estimatedRange: [number, number]; // [min, max]
  targetPrice: number;
  expectedTrend: 'Upward' | 'Downward' | 'Consolidation';
  confidenceLevel: 'Low' | 'Moderate' | 'High';
  confidencePercent: number;
  forecastExplanation: string;
  riskFactors: string[];
  historicalAccuracy: number;
}

// Risk Analysis
export interface CoinRiskItem {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  riskScore: number; // 0 - 100
  riskCategory: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  volatilityScore: number;
  liquidityScore: number;
  drawdownScore: number;
  momentumScore: number;
  marketCapTier: 'Mega Cap' | 'Large Cap' | 'Mid Cap';
  methodologyNotes: string;
}

// Paper Trading Simulator
export interface SimulatedTrade {
  id: string;
  symbol: string;
  coinName: string;
  type: 'BUY' | 'SELL';
  amount: number;
  price: number;
  totalCost: number;
  timestamp: string;
}

export interface SimulatedAccount {
  cashBalance: number;
  initialBalance: number;
  trades: SimulatedTrade[];
  holdings: Record<string, { amount: number; avgCost: number }>;
}

// Learn Crypto
export interface GlossaryTerm {
  id: string;
  term: string;
  category: 'Fundamentals' | 'Trading' | 'Technical Analysis' | 'Blockchain' | 'Security' | 'DeFi';
  definition: string;
  hindiDefinition?: string;
  example?: string;
}

export interface QuizQuestion {
  id: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  hindiQuestion?: string;
  options: string[];
  hindiOptions?: string[];
  correctIndex: number;
  explanation: string;
  hindiExplanation?: string;
}

export interface DataProviderStatus {
  primary: {
    name: 'FCS API';
    status: 'operational' | 'degraded' | 'offline';
    latencyMs: number;
  };
  fallback: {
    name: 'Binance Spot API';
    status: 'operational' | 'degraded' | 'offline';
    latencyMs: number;
  };
  backup: {
    name: 'CoinGecko API';
    status: 'operational' | 'degraded' | 'offline';
    latencyMs: number;
  };
  activeProvider: string;
  lastSyncTimestamp: number;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  defaultTimeframe: Timeframe;
  defaultHorizon: PredictionHorizon;
  defaultArchitecture: MLArchitecture;
  defaultFeatureSet: FeatureSet;
  refreshIntervalSec: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR';
  showDisclaimerBanner: boolean;
  activeProviderPreference: 'auto' | 'fcs' | 'binance' | 'coingecko';
  enableSoundAlerts?: boolean;
  enableBrowserAlerts?: boolean;
  advancedMode?: boolean; // Toggles advanced indicators for power users
}
