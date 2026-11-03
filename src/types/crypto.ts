/**
 * CryptoAnalyzer - Core Types & Interfaces
 * Academic research platform for cryptocurrency time series forecasting
 */

export type Timeframe = '5m' | '15m' | '1h' | '4h' | '1d' | '1w';

export type PredictionHorizon = '5m' | '15m' | '1h' | '4h' | '1d';

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

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  buyPrice: number;
  buyDate: string;
  notes?: string;
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
}
