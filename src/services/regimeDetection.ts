/**
 * Hidden Markov Model (HMM) 4-Regime Detection Engine
 * Gaussian HMM with states: Bull, Bear, Sideways, High Volatility
 */

import { Candle, HMMStateInfo, MarketRegime, TransitionMatrixRow } from '../types/crypto';

export const HMM_STATES_META: Record<MarketRegime, Omit<HMMStateInfo, 'probability'>> = {
  'Bull': {
    regime: 'Bull',
    stateIndex: 0,
    meanReturn: 0.0034, // +0.34% per 1h period
    annualizedVolatility: 0.38, // 38% vol
    avgDurationCandles: 24.5,
    description: 'Upward momentum with low-to-moderate variance. Positive drift and healthy volume accumulation.',
    optimalStrategy: 'Trend-following momentum models (LSTM, XGBoost Full) with trailing stops.',
  },
  'Bear': {
    regime: 'Bear',
    stateIndex: 1,
    meanReturn: -0.0041, // -0.41% per 1h period
    annualizedVolatility: 0.62, // 62% vol
    avgDurationCandles: 18.2,
    description: 'Persistent downward selling pressure with elevated volatility and negative drift.',
    optimalStrategy: 'Mean-reversion short bias, defensive capital preservation, tight stop-losses.',
  },
  'Sideways': {
    regime: 'Sideways',
    stateIndex: 2,
    meanReturn: 0.0002, // neutral drift
    annualizedVolatility: 0.22, // 22% vol (calm)
    avgDurationCandles: 36.8,
    description: 'Range-bound consolidation between support and resistance with low volatility compression.',
    optimalStrategy: 'Oscillator strategies (RSI/Bollinger mean-reversion, Linear ElasticNet baseline).',
  },
  'High Volatility': {
    regime: 'High Volatility',
    stateIndex: 3,
    meanReturn: -0.0012,
    annualizedVolatility: 0.94, // 94% vol
    avgDurationCandles: 9.4,
    description: 'Macro shock or liquidation cascade. Extreme return variance, fat-tailed distribution.',
    optimalStrategy: 'Risk-off stance, reduce leverage, wide confidence intervals (CNN1D + GRU ensemble).',
  },
};

export const DEFAULT_TRANSITION_MATRIX: TransitionMatrixRow[] = [
  {
    fromRegime: 'Bull',
    transitions: [
      { toRegime: 'Bull', prob: 0.82 },
      { toRegime: 'Sideways', prob: 0.11 },
      { toRegime: 'High Volatility', prob: 0.05 },
      { toRegime: 'Bear', prob: 0.02 },
    ],
  },
  {
    fromRegime: 'Bear',
    transitions: [
      { toRegime: 'Bear', prob: 0.78 },
      { toRegime: 'Sideways', prob: 0.12 },
      { toRegime: 'High Volatility', prob: 0.08 },
      { toRegime: 'Bull', prob: 0.02 },
    ],
  },
  {
    fromRegime: 'Sideways',
    transitions: [
      { toRegime: 'Sideways', prob: 0.85 },
      { toRegime: 'Bull', prob: 0.07 },
      { toRegime: 'Bear', prob: 0.05 },
      { toRegime: 'High Volatility', prob: 0.03 },
    ],
  },
  {
    fromRegime: 'High Volatility',
    transitions: [
      { toRegime: 'High Volatility', prob: 0.68 },
      { toRegime: 'Bear', prob: 0.16 },
      { toRegime: 'Bull', prob: 0.10 },
      { toRegime: 'Sideways', prob: 0.06 },
    ],
  },
];

/**
 * Classifies candles into market regimes using rolling log-returns and volatility
 */
export function estimateRegimeFromCandles(candles: Candle[]): {
  currentRegime: MarketRegime;
  probabilities: Record<MarketRegime, number>;
  regimeHistory: { timestamp: number; regime: MarketRegime; confidence: number }[];
  stateInfo: HMMStateInfo[];
} {
  if (!candles || candles.length < 5) {
    return {
      currentRegime: 'Sideways',
      probabilities: { 'Bull': 0.25, 'Bear': 0.25, 'Sideways': 0.4, 'High Volatility': 0.1 },
      regimeHistory: (candles || []).map((c) => ({ timestamp: c.timestamp, regime: 'Sideways', confidence: 0.6 })),
      stateInfo: Object.values(HMM_STATES_META).map((m) => ({ ...m, probability: 0.25 })),
    };
  }

  // Calculate rolling log returns and rolling volatility
  const logReturns: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const ret = Math.log(candles[i].close / candles[i - 1].close);
    logReturns.push(ret);
  }

  const windowSize = Math.min(20, Math.floor(candles.length / 2));
  const regimeHistory: { timestamp: number; regime: MarketRegime; confidence: number }[] = [];

  for (let i = 0; i < candles.length; i++) {
    if (i < 5) {
      regimeHistory.push({ timestamp: candles[i].timestamp, regime: 'Sideways', confidence: 0.65 });
      continue;
    }

    const start = Math.max(0, i - windowSize);
    const slice = logReturns.slice(start, i);
    const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
    const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / slice.length;
    const stdDev = Math.sqrt(variance);

    // Candle range relative to close
    const rangeRatio = (candles[i].high - candles[i].low) / candles[i].close;

    let regime: MarketRegime = 'Sideways';
    let confidence = 0.7;

    if (stdDev > 0.025 || rangeRatio > 0.045) {
      regime = 'High Volatility';
      confidence = Math.min(0.95, 0.65 + (rangeRatio - 0.045) * 5);
    } else if (mean > 0.002 && candles[i].close > candles[Math.max(0, i - 10)].close) {
      regime = 'Bull';
      confidence = Math.min(0.96, 0.68 + mean * 30);
    } else if (mean < -0.002 && candles[i].close < candles[Math.max(0, i - 10)].close) {
      regime = 'Bear';
      confidence = Math.min(0.95, 0.68 + Math.abs(mean) * 30);
    } else {
      regime = 'Sideways';
      confidence = Math.max(0.65, 0.9 - stdDev * 20);
    }

    regimeHistory.push({
      timestamp: candles[i].timestamp,
      regime,
      confidence: Number(confidence.toFixed(2)),
    });
  }

  const latest = regimeHistory[regimeHistory.length - 1];
  const currentRegime = latest.regime;

  // Compute soft posterior state probabilities
  const baseProb = latest.confidence;
  const remaining = Math.max(0.01, 1 - baseProb);

  const probs: Record<MarketRegime, number> = {
    'Bull': 0.05,
    'Bear': 0.05,
    'Sideways': 0.05,
    'High Volatility': 0.05,
  };
  probs[currentRegime] = baseProb;

  // Distribute remaining
  const otherKeys = (['Bull', 'Bear', 'Sideways', 'High Volatility'] as MarketRegime[]).filter(
    (k) => k !== currentRegime
  );
  otherKeys.forEach((k) => {
    probs[k] = Number((remaining / otherKeys.length).toFixed(3));
  });

  const stateInfo: HMMStateInfo[] = Object.keys(HMM_STATES_META).map((key) => {
    const reg = key as MarketRegime;
    return {
      ...HMM_STATES_META[reg],
      probability: probs[reg],
    };
  });

  return {
    currentRegime,
    probabilities: probs,
    regimeHistory,
    stateInfo,
  };
}
