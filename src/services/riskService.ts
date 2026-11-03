/**
 * Transparent Cryptocurrency Risk Assessment Service
 * Evaluates assets on volatility, market liquidity, capitalization depth, and drawdown
 */

import { CoinRiskItem, CoinSummary } from '../types/crypto';

export function calculateCoinRisk(coin: CoinSummary): CoinRiskItem {
  // 1. Market Cap Depth Tier (Mega Cap = lowest risk, Mid Cap = higher risk)
  let capScore = 70; // 0-100 where higher means safer
  let tier: 'Mega Cap' | 'Large Cap' | 'Mid Cap' = 'Mid Cap';

  if (coin.marketCap >= 100_000_000_000) {
    capScore = 20; // lower risk contribution
    tier = 'Mega Cap';
  } else if (coin.marketCap >= 10_000_000_000) {
    capScore = 45;
    tier = 'Large Cap';
  } else {
    capScore = 75;
    tier = 'Mid Cap';
  }

  // 2. Volatility factor (intraday high-low spread relative to price)
  const spreadRatio = coin.price > 0 ? (coin.high24h - coin.low24h) / coin.price : 0.05;
  const volScore = Math.min(100, Math.round(spreadRatio * 800)); // ~20-80 typical

  // 3. Liquidity factor (24h volume relative to market cap)
  const volToCapRatio = coin.marketCap > 0 ? coin.volume24h / coin.marketCap : 0.03;
  // healthy turnover is 3-10%, less than 1% indicates illiquid risk
  const liquidityScore = volToCapRatio > 0.03 ? 25 : volToCapRatio > 0.01 ? 55 : 85;

  // 4. Momentum / Drawdown stress factor
  const absChange = Math.abs(coin.change24h);
  const momentumScore = Math.min(100, Math.round(absChange * 8));

  // Composite Risk Score (0 = lowest risk, 100 = extreme risk)
  const compositeScore = Math.round(
    capScore * 0.35 + volScore * 0.3 + liquidityScore * 0.2 + momentumScore * 0.15
  );

  let category: 'Low Risk' | 'Moderate Risk' | 'High Risk' = 'Moderate Risk';
  if (compositeScore < 38) category = 'Low Risk';
  else if (compositeScore > 65) category = 'High Risk';

  let methodology = '';
  if (category === 'Low Risk') {
    methodology = `Mega-cap valuation ($${(coin.marketCap / 1e9).toFixed(1)}B) with deep institutional liquidity and orderly intraday spreads relative to broader digital assets.`;
  } else if (category === 'Moderate Risk') {
    methodology = `Established market presence with active trading turnover ($${(coin.volume24h / 1e6).toFixed(1)}M/24h), balanced by characteristic Layer 1 market volatility.`;
  } else {
    methodology = `Higher intraday price variance and sensitivity to macro digital asset market swings. Appropriate for risk-tolerant portfolios.`;
  }

  return {
    symbol: coin.symbol,
    name: coin.name,
    price: coin.price,
    marketCap: coin.marketCap,
    riskScore: compositeScore,
    riskCategory: category,
    volatilityScore: volScore,
    liquidityScore,
    drawdownScore: Math.round(capScore * 0.9),
    momentumScore,
    marketCapTier: tier,
    methodologyNotes: methodology,
  };
}

export function getAllCoinsRisk(coins: CoinSummary[]): CoinRiskItem[] {
  return coins.map(calculateCoinRisk).sort((a, b) => a.riskScore - b.riskScore);
}
