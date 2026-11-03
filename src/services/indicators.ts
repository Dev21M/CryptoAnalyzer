/**
 * Technical Indicators Calculation Engine
 * Pure TypeScript implementation for crypto research
 */

import { Candle, FibonacciLevels, PivotPoints, TechnicalIndicators } from '../types/crypto';

export function calculateSMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j];
      }
      result.push(Number((sum / period).toFixed(4)));
    }
  }
  return result;
}

export function calculateEMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const multiplier = 2 / (period + 1);

  let initialSMA = 0;
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      initialSMA += data[i];
      result.push(null);
    } else if (i === period - 1) {
      initialSMA = (initialSMA + data[i]) / period;
      result.push(Number(initialSMA.toFixed(4)));
    } else {
      const prevEMA = result[i - 1]!;
      const currentEMA = (data[i] - prevEMA) * multiplier + prevEMA;
      result.push(Number(currentEMA.toFixed(4)));
    }
  }
  return result;
}

export function calculateBollingerBands(
  closePrices: number[],
  period: number = 20,
  multiplier: number = 2
): { upper: (number | null)[]; middle: (number | null)[]; lower: (number | null)[] } {
  const middle = calculateSMA(closePrices, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < closePrices.length; i++) {
    const ma = middle[i];
    if (ma === null || i < period - 1) {
      upper.push(null);
      lower.push(null);
    } else {
      let sumOfSquares = 0;
      for (let j = 0; j < period; j++) {
        sumOfSquares += Math.pow(closePrices[i - j] - ma, 2);
      }
      const standardDeviation = Math.sqrt(sumOfSquares / period);
      upper.push(Number((ma + multiplier * standardDeviation).toFixed(4)));
      lower.push(Number((ma - multiplier * standardDeviation).toFixed(4)));
    }
  }

  return { upper, middle, lower };
}

export function calculateRSI(closePrices: number[], period: number = 14): (number | null)[] {
  const rsi: (number | null)[] = [];
  if (closePrices.length < period + 1) {
    return closePrices.map(() => null);
  }

  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 1; i <= period; i++) {
    const change = closePrices[i] - closePrices[i - 1];
    if (change > 0) avgGain += change;
    else avgLoss += Math.abs(change);
  }

  avgGain /= period;
  avgLoss /= period;

  for (let i = 0; i < period; i++) {
    rsi.push(null);
  }

  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  rsi.push(Number((100 - 100 / (1 + rs)).toFixed(2)));

  for (let i = period + 1; i < closePrices.length; i++) {
    const change = closePrices[i] - closePrices[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi.push(Number((100 - 100 / (1 + rs)).toFixed(2)));
  }

  return rsi;
}

export function calculateMACD(
  closePrices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): {
  macdLine: (number | null)[];
  signalLine: (number | null)[];
  histogram: (number | null)[];
} {
  const fastEMA = calculateEMA(closePrices, fastPeriod);
  const slowEMA = calculateEMA(closePrices, slowPeriod);

  const macdLine: (number | null)[] = [];
  const validMacdValues: number[] = [];

  for (let i = 0; i < closePrices.length; i++) {
    const fast = fastEMA[i];
    const slow = slowEMA[i];
    if (fast !== null && slow !== null) {
      const val = Number((fast - slow).toFixed(4));
      macdLine.push(val);
      validMacdValues.push(val);
    } else {
      macdLine.push(null);
    }
  }

  const rawSignal = calculateEMA(validMacdValues, signalPeriod);
  const signalLine: (number | null)[] = [];
  const histogram: (number | null)[] = [];

  let validIdx = 0;
  for (let i = 0; i < closePrices.length; i++) {
    if (macdLine[i] === null) {
      signalLine.push(null);
      histogram.push(null);
    } else {
      const sig = rawSignal[validIdx];
      signalLine.push(sig);
      if (sig !== null) {
        histogram.push(Number((macdLine[i]! - sig).toFixed(4)));
      } else {
        histogram.push(null);
      }
      validIdx++;
    }
  }

  return { macdLine, signalLine, histogram };
}

export function calculateATR(candles: Candle[], period: number = 14): (number | null)[] {
  const atr: (number | null)[] = [];
  if (candles.length < 2) return candles.map(() => null);

  const trueRanges: number[] = [candles[0].high - candles[0].low];

  for (let i = 1; i < candles.length; i++) {
    const high = candles[i].high;
    const low = candles[i].low;
    const prevClose = candles[i - 1].close;

    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    trueRanges.push(tr);
  }

  const initialATR = trueRanges.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      atr.push(null);
    } else if (i === period - 1) {
      atr.push(Number(initialATR.toFixed(4)));
    } else {
      const prevAtr = atr[i - 1]!;
      const currentAtr = (prevAtr * (period - 1) + trueRanges[i]) / period;
      atr.push(Number(currentAtr.toFixed(4)));
    }
  }

  return atr;
}

export function calculateAllIndicators(candles: Candle[]): TechnicalIndicators {
  if (!candles || candles.length === 0) {
    return {
      sma20: [],
      ema50: [],
      ema200: [],
      bollingerBands: { upper: [], middle: [], lower: [] },
      rsi14: [],
      macd: { macdLine: [], signalLine: [], histogram: [] },
      atr14: [],
    };
  }

  const closes = candles.map((c) => c.close);

  return {
    sma20: calculateSMA(closes, 20),
    ema50: calculateEMA(closes, 50),
    ema200: calculateEMA(closes, 200),
    bollingerBands: calculateBollingerBands(closes, 20, 2),
    rsi14: calculateRSI(closes, 14),
    macd: calculateMACD(closes, 12, 26, 9),
    atr14: calculateATR(candles, 14),
  };
}

export function calculatePivotPoints(high: number, low: number, close: number): PivotPoints {
  const pivot = (high + low + close) / 3;
  const r1 = 2 * pivot - low;
  const s1 = 2 * pivot - high;
  const r2 = pivot + (high - low);
  const s2 = pivot - (high - low);
  const r3 = high + 2 * (pivot - low);
  const s3 = low - 2 * (high - pivot);

  return {
    pivot: Number(pivot.toFixed(2)),
    r1: Number(r1.toFixed(2)),
    r2: Number(r2.toFixed(2)),
    r3: Number(r3.toFixed(2)),
    s1: Number(s1.toFixed(2)),
    s2: Number(s2.toFixed(2)),
    s3: Number(s3.toFixed(2)),
  };
}

export function calculateFibonacci(high: number, low: number): FibonacciLevels {
  const diff = high - low;
  return {
    level0: Number(low.toFixed(2)),
    level236: Number((low + diff * 0.236).toFixed(2)),
    level382: Number((low + diff * 0.382).toFixed(2)),
    level500: Number((low + diff * 0.5).toFixed(2)),
    level618: Number((low + diff * 0.618).toFixed(2)),
    level786: Number((low + diff * 0.786).toFixed(2)),
    level1000: Number(high.toFixed(2)),
  };
}
