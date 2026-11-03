import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  DollarSign,
  Percent,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { CoinSummary } from '../types/crypto';

interface ProfitCalculatorPageProps {
  coins: CoinSummary[];
}

export const ProfitCalculatorPage: React.FC<ProfitCalculatorPageProps> = ({ coins }) => {
  const [selectedCoinSymbol, setSelectedCoinSymbol] = useState('BTC');
  const [investmentAmount, setInvestmentAmount] = useState('1000');
  const [buyPrice, setBuyPrice] = useState('77000');
  const [sellPrice, setSellPrice] = useState('95000');
  const [feePercent, setFeePercent] = useState('0.1'); // 0.1% typical exchange fee

  const handleSelectCoin = (sym: string) => {
    setSelectedCoinSymbol(sym);
    const coin = coins.find((c) => c.symbol === sym);
    if (coin) {
      setBuyPrice(String(coin.price));
      setSellPrice(String(Number((coin.price * 1.25).toFixed(coin.price < 1 ? 4 : 2))));
    }
  };

  const parsedInvestment = parseFloat(investmentAmount) || 0;
  const parsedBuyPrice = parseFloat(buyPrice) || 1;
  const parsedSellPrice = parseFloat(sellPrice) || 0;
  const parsedFee = parseFloat(feePercent) || 0;

  // Quantity acquired
  const coinQuantity = parsedBuyPrice > 0 ? parsedInvestment / parsedBuyPrice : 0;

  // Gross return
  const grossValue = coinQuantity * parsedSellPrice;

  // Deduct entry fee and exit fee
  const entryFee = parsedInvestment * (parsedFee / 100);
  const exitFee = grossValue * (parsedFee / 100);
  const totalFees = entryFee + exitFee;

  const netValue = grossValue - exitFee;
  const netProfit = netValue - parsedInvestment;
  const roiPct = parsedInvestment > 0 ? (netProfit / parsedInvestment) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Crypto Profit & Loss Calculator</h1>
          <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
            Financial Modeling
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Calculate projected returns, net profit/loss, exchange fee overhead, and return on investment (ROI)
        </p>
      </div>

      {/* Quick Coin Auto-fill selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-mono text-slate-400 shrink-0">Auto-fill live spot price:</span>
        {coins.slice(0, 8).map((c) => (
          <button
            key={c.symbol}
            onClick={() => handleSelectCoin(c.symbol)}
            className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors shrink-0 cursor-pointer ${
              selectedCoinSymbol === c.symbol
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {c.symbol} (${c.price < 1 ? c.price.toFixed(4) : c.price.toLocaleString()})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Parameters Form */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">Trade Parameters</h3>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Total Investment Capital ($ USD)</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="number"
                step="any"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="1000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Buy / Entry Price ($ USD)</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="number"
                step="any"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="77000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Sell / Target Exit Price ($ USD)</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="number"
                step="any"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder="95000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Trading Fee per Order (%)</label>
            <div className="relative">
              <Percent className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="number"
                step="0.01"
                value={feePercent}
                onChange={(e) => setFeePercent(e.target.value)}
                placeholder="0.1"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Standard maker/taker fees range from 0.05% to 0.15% on major spot exchanges.
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Purchased Units:</span>
            <span className="font-bold text-slate-200">
              {coinQuantity.toFixed(6)} {selectedCoinSymbol}
            </span>
          </div>
        </Card>

        {/* Results Card */}
        <div className="space-y-4">
          <Card
            className={`p-6 border ${
              netProfit >= 0 ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-rose-950/20 border-rose-500/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Net Projected Profit / Loss</span>
              {netProfit >= 0 ? (
                <ArrowUpRight className="w-5 h-5 text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-rose-400" />
              )}
            </div>

            <div className="my-4">
              <div
                className={`text-3xl font-extrabold font-mono ${
                  netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div
                className={`text-sm font-mono font-bold mt-1 ${
                  roiPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {roiPct >= 0 ? '+' : ''}{roiPct.toFixed(2)}% ROI
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Capital Invested:</span>
                <span className="font-semibold text-white">${parsedInvestment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gross Return Value:</span>
                <span className="font-semibold text-white">${grossValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cumulative Trading Fees:</span>
                <span className="text-rose-300 font-semibold">-${totalFees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 font-bold">
                <span className="text-slate-200">Net Exit Value:</span>
                <span className="text-white">${netValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 text-xs text-slate-400 space-y-2 bg-slate-900/60">
            <span className="font-bold text-slate-300">Financial Insights:</span>
            <p className="leading-relaxed text-[11px]">
              {netProfit >= 0
                ? `A return of +${roiPct.toFixed(2)}% would require ${selectedCoinSymbol} to appreciate from $${parsedBuyPrice.toLocaleString()} to $${parsedSellPrice.toLocaleString()}. Always account for market depth and slippage on large market orders.`
                : `Selling at $${parsedSellPrice.toLocaleString()} would realize a drawdown of ${Math.abs(roiPct).toFixed(2)}% from your initial cost basis.`}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
