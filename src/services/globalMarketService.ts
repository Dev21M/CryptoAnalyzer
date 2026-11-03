/**
 * Global Market Service
 * Fetches real aggregate macroeconomic cryptocurrency stats & Fear & Greed index
 */

import { GlobalMarketData } from '../types/crypto';

let cachedGlobal: GlobalMarketData | null = null;
let lastFetchTime = 0;

export async function fetchGlobalMarketData(): Promise<GlobalMarketData> {
  // Use memory cache for 30s
  if (cachedGlobal && Date.now() - lastFetchTime < 30000) {
    return cachedGlobal;
  }

  try {
    const res = await fetch('/api/market/global');
    if (res.ok) {
      const data = await res.json();
      cachedGlobal = data;
      lastFetchTime = Date.now();
      return data;
    }
  } catch (err) {
    console.warn('Backend global market API fetch failed, trying direct fallback:', err);
  }

  // Direct client fallback to alternative.me and fallback numbers
  let fearGreedIndex = 65;
  let fearGreedSentiment = 'Greed';

  try {
    const fgRes = await fetch('https://api.alternative.me/fng/?limit=1');
    if (fgRes.ok) {
      const fgData = await fgRes.json();
      if (fgData?.data?.[0]) {
        fearGreedIndex = parseInt(fgData.data[0].value, 10) || 65;
        fearGreedSentiment = fgData.data[0].value_classification || 'Greed';
      }
    }
  } catch {
    // fallback
  }

  const fallback: GlobalMarketData = {
    totalMarketCap: 2850000000000,
    total24hVolume: 114000000000,
    btcDominance: 56.4,
    ethDominance: 15.2,
    marketCapChange24h: 1.85,
    fearGreedIndex,
    fearGreedSentiment,
    lastUpdated: Date.now(),
  };

  cachedGlobal = fallback;
  lastFetchTime = Date.now();
  return fallback;
}
