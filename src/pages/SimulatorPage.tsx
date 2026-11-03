import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Cpu,
  DollarSign,
  History,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import {
  executePaperTrade,
  getSimulatedAccount,
  resetPaperAccount,
} from '../services/simulatorService';
import { CoinSummary, SimulatedAccount } from '../types/crypto';

interface SimulatorPageProps {
  coins: CoinSummary[];
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({ coins, onShowToast }) => {
  const [account, setAccount] = useState<SimulatedAccount>(getSimulatedAccount());
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeAmount, setTradeAmount] = useState('0.1');

  const selectedCoin = coins.find((c) => c.symbol === selectedSymbol) || coins[0];
  const currentPrice = selectedCoin ? selectedCoin.price : 77000;

  // Calculate current virtual portfolio valuation
  let holdingsValue = 0;
  const holdingItems = Object.entries(account.holdings).map(([sym, item]) => {
    const coin = coins.find((c) => c.symbol === sym);
    const price = coin ? coin.price : item.avgCost;
    const value = item.amount * price;
    holdingsValue += value;
    const costBasis = item.amount * item.avgCost;
    const pnl = value - costBasis;
    const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

    return {
      symbol: sym,
      name: coin ? coin.name : sym,
      amount: item.amount,
      avgCost: item.avgCost,
      currentPrice: price,
      value,
      pnl,
      pnlPct,
    };
  });

  const totalEquity = account.cashBalance + holdingsValue;
  const totalProfitLoss = totalEquity - account.initialBalance;
  const totalProfitLossPct = (totalProfitLoss / account.initialBalance) * 100;

  const handleTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(tradeAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      onShowToast('Invalid Amount', 'Please provide a valid trade quantity.', 'error');
      return;
    }

    const res = executePaperTrade(
      selectedSymbol,
      selectedCoin.name,
      tradeType,
      parsedAmount,
      currentPrice
    );

    if (res.success) {
      setAccount(res.account);
      onShowToast('Virtual Order Executed', res.message, 'success');
      setTradeAmount('');
    } else {
      onShowToast('Order Failed', res.message, 'error');
    }
  };

  const handleReset = () => {
    if (confirm('Reset virtual paper trading portfolio to original $10,000 cash balance?')) {
      const fresh = resetPaperAccount();
      setAccount(fresh);
      onShowToast('Account Reset', 'Paper trading balance restored to $10,000 USD virtual cash.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Paper Trading Simulator</h1>
            <span className="text-xs font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
              Risk-Free Virtual Environment
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test trading strategies in real time at live market spot prices with zero financial risk
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Balance
        </Button>
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-cyan-200 text-xs flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          <strong>Simulated Sandbox Environment:</strong> All funds and balances are virtual ($10,000 starting cash). No real cryptocurrency is purchased and no exchange connection is required.
        </span>
      </div>

      {/* Account Balance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-slate-400 text-xs block">Total Virtual Equity</span>
          <span className="text-2xl font-extrabold font-mono text-white mt-1 block">
            ${totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Cash + Open Positions</span>
        </Card>

        <Card className="p-4">
          <span className="text-slate-400 text-xs block">Simulated Cash Balance</span>
          <span className="text-2xl font-extrabold font-mono text-emerald-400 mt-1 block">
            ${account.cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Available dry powder</span>
        </Card>

        <Card className="p-4">
          <span className="text-slate-400 text-xs block">Holdings Market Value</span>
          <span className="text-2xl font-extrabold font-mono text-cyan-300 mt-1 block">
            ${holdingsValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">
            {holdingItems.length} Open Positions
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-slate-400 text-xs block">Total Virtual P&L</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`text-2xl font-extrabold font-mono ${
                totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span
              className={`text-xs font-mono font-bold ${
                totalProfitLossPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              ({totalProfitLossPct >= 0 ? '+' : ''}{totalProfitLossPct.toFixed(2)}%)
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">From $10,000 initial</span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trade Execution Panel */}
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
            Execute Virtual Market Order
          </h3>

          <form onSubmit={handleTrade} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Asset</label>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {coins.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.name} ({c.symbol}) — Spot: ${c.price < 1 ? c.price.toFixed(4) : c.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Order Type</label>
              <div className="flex rounded-lg overflow-hidden border border-slate-800">
                <button
                  type="button"
                  onClick={() => setTradeType('BUY')}
                  className={`flex-1 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    tradeType === 'BUY'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  BUY (Long)
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType('SELL')}
                  className={`flex-1 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    tradeType === 'SELL'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  SELL (Close)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Trade Amount ({selectedSymbol})</label>
              <input
                type="number"
                step="any"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Order Preview */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Live Spot Rate:</span>
                <span className="text-white">${currentPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Value:</span>
                <span className="text-white font-bold">
                  ${((parseFloat(tradeAmount) || 0) * currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <Button
              variant={tradeType === 'BUY' ? 'primary' : 'danger'}
              className="w-full justify-center"
              type="submit"
            >
              Submit Virtual {tradeType} Order
            </Button>
          </form>
        </Card>

        {/* Current Holdings & Recent Simulator Trades */}
        <div className="lg:col-span-2 space-y-6">
          {/* Virtual Holdings Table */}
          <Card className="p-0 overflow-hidden">
            <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-xs font-bold text-white">Open Virtual Positions</span>
              <span className="text-[10px] font-mono text-slate-400">
                {holdingItems.length} assets held
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4">Asset</th>
                    <th className="py-2.5 px-4 text-right">Holdings</th>
                    <th className="py-2.5 px-4 text-right">Avg Cost</th>
                    <th className="py-2.5 px-4 text-right">Market Value</th>
                    <th className="py-2.5 px-4 text-right">Unrealized P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {holdingItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                        No active holdings yet. Place a virtual BUY order to build your portfolio.
                      </td>
                    </tr>
                  ) : (
                    holdingItems.map((h) => (
                      <tr key={h.symbol} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-4">
                          <span className="font-bold text-white font-mono">{h.symbol}</span>
                          <span className="text-[10px] text-slate-400 ml-1.5">{h.name}</span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-200">
                          {h.amount.toFixed(4)}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-300">
                          ${h.avgCost < 1 ? h.avgCost.toFixed(4) : h.avgCost.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-white">
                          ${h.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono">
                          <span className={h.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {h.pnl >= 0 ? '+' : ''}${h.pnl.toFixed(2)} ({h.pnlPct >= 0 ? '+' : ''}{h.pnlPct.toFixed(2)}%)
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Trade Execution History */}
          <Card className="p-0 overflow-hidden">
            <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-xs font-bold text-white">Simulated Trade History</span>
              <span className="text-[10px] font-mono text-slate-400">
                {account.trades.length} executed
              </span>
            </div>

            <div className="max-h-56 overflow-y-auto divide-y divide-slate-800/60">
              {account.trades.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No virtual trades recorded yet.
                </div>
              ) : (
                account.trades.map((t) => (
                  <div key={t.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-800/30">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          t.type === 'BUY'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {t.type}
                      </span>
                      <span className="font-bold text-white font-mono">{t.amount} {t.symbol}</span>
                      <span className="text-slate-400">@ ${t.price.toLocaleString()}</span>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-slate-200">${t.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
