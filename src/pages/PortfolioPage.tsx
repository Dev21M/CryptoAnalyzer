import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Download,
  History,
  PieChart,
  Plus,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { RegimeBadge } from '../components/common/RegimeBadge';
import {
  addTransaction,
  getPortfolioHoldings,
  getTransactions,
} from '../services/portfolioService';
import { exportToCSV } from '../services/storage';
import { CoinSummary, PortfolioHolding } from '../types/crypto';

interface PortfolioPageProps {
  coins: CoinSummary[];
  onNavigate: (route: string) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  coins,
  onNavigate,
  onShowToast,
}) => {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(getPortfolioHoldings());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Adding Trade
  const [formSymbol, setFormSymbol] = useState('BTC');
  const [formType, setFormType] = useState<'BUY' | 'SELL'>('BUY');
  const [formAmount, setFormAmount] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const handleOpenAddModal = (sym: string = 'BTC') => {
    setFormSymbol(sym);
    const coin = coins.find((c) => c.symbol === sym);
    setFormPrice(coin ? String(coin.price) : '77000');
    setFormAmount('1');
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const handleSaveTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(formAmount);
    const parsedPrice = parseFloat(formPrice);

    if (isNaN(parsedAmount) || parsedAmount <= 0 || isNaN(parsedPrice) || parsedPrice <= 0) {
      onShowToast?.('Invalid Inputs', 'Please provide a valid trade quantity and price.', 'error');
      return;
    }

    const coin = coins.find((c) => c.symbol === formSymbol.toUpperCase());
    addTransaction({
      symbol: formSymbol.toUpperCase(),
      coinName: coin ? coin.name : formSymbol.toUpperCase(),
      type: formType,
      amount: parsedAmount,
      pricePerCoin: parsedPrice,
      fee: 0,
      date: new Date().toISOString().split('T')[0],
      notes: formNotes,
    });

    const updatedHoldings = getPortfolioHoldings();
    setHoldings(updatedHoldings);
    setIsAddModalOpen(false);
    onShowToast?.('Holding Added', `Recorded ${formType} transaction for ${parsedAmount} ${formSymbol}.`, 'success');
  };

  // Portfolio Calculations
  const calculatedHoldings = holdings.map((h) => {
    const coin = coins.find((c) => c && c.symbol && c.symbol.toUpperCase() === (h.symbol || '').toUpperCase());
    const buyPrice = h.buyPrice || 0;
    const amount = h.amount || 0;
    const currentPrice = coin?.price ?? buyPrice;
    const marketValue = amount * currentPrice;
    const costBasis = amount * buyPrice;
    const pnlUsd = marketValue - costBasis;
    const pnlPct = costBasis > 0 ? (pnlUsd / costBasis) * 100 : 0;

    return {
      ...h,
      amount,
      buyPrice,
      currentPrice,
      marketValue,
      costBasis,
      pnlUsd,
      pnlPct,
      change24h: coin?.change24h ?? 0,
      currentRegime: coin?.currentRegime ?? 'Sideways',
    };
  });

  const totalValue = calculatedHoldings.reduce((acc, h) => acc + (h.marketValue || 0), 0);
  const totalCost = calculatedHoldings.reduce((acc, h) => acc + (h.costBasis || 0), 0);
  const totalPnlUsd = totalValue - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnlUsd / totalCost) * 100 : 0;

  // 24h PnL estimate based on current holdings and their 24h change
  const dayPnlUsd = calculatedHoldings.reduce((acc, h) => {
    const fraction = h.change24h / 100;
    return acc + (h.marketValue * fraction) / (1 + fraction);
  }, 0);
  const dayPnlPct = totalValue > 0 ? (dayPnlUsd / totalValue) * 100 : 0;

  const handleExportCSV = () => {
    const txs = getTransactions();
    exportToCSV(`cryptoanalyzer_portfolio_${new Date().toISOString().split('T')[0]}`, txs);
    onShowToast?.('Export Complete', 'Exported transactions to CSV file.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Personal Portfolio Tracker</h1>
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              Multi-Transaction Ledger
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time asset valuation, profit/loss attribution, and cost-basis analysis
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('/transactions')}
            icon={<History className="w-3.5 h-3.5" />}
          >
            Ledger
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenAddModal('BTC')}
            icon={<Plus className="w-4 h-4" />}
          >
            Record Trade
          </Button>
        </div>
      </div>

      {/* Portfolio Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Value */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Current Portfolio Value</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold font-mono text-white">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              Cost Basis: ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {calculatedHoldings.length} Active Asset Positions
          </span>
        </Card>

        {/* All-Time P&L */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Profit / Loss</span>
            {totalPnlUsd >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div className="my-2">
            <div
              className={`text-3xl font-extrabold font-mono ${
                totalPnlUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {totalPnlUsd >= 0 ? '+' : ''}${totalPnlUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div
              className={`text-xs font-mono font-bold mt-0.5 ${
                totalPnlPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {totalPnlPct >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}% All-Time ROI
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Unrealized position return</span>
        </Card>

        {/* 24-Hour P&L */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>24-Hour Return</span>
            {dayPnlUsd >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div className="my-2">
            <div
              className={`text-3xl font-extrabold font-mono ${
                dayPnlUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {dayPnlUsd >= 0 ? '+' : ''}${dayPnlUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div
              className={`text-xs font-mono font-bold mt-0.5 ${
                dayPnlPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {dayPnlPct >= 0 ? '+' : ''}{dayPnlPct.toFixed(2)}% in last 24h
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Intraday asset change</span>
        </Card>

        {/* Top Asset Allocation */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Primary Holding Share</span>
            <PieChart className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-2">
            {calculatedHoldings.length > 0 ? (
              <>
                <div className="text-2xl font-bold font-mono text-white">
                  {calculatedHoldings[0].symbol} (
                  {((calculatedHoldings[0].marketValue / (totalValue || 1)) * 100).toFixed(1)}%)
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  ${calculatedHoldings[0].marketValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-500 font-mono">No holdings recorded</div>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Dominant position weight</span>
        </Card>
      </div>

      {/* Asset Allocation Distribution Bar */}
      {calculatedHoldings.length > 0 && (
        <Card className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Portfolio Allocation Distribution</span>
            <span>{calculatedHoldings.length} Coins</span>
          </div>

          <div className="h-4 w-full bg-slate-800 rounded-lg overflow-hidden flex font-mono text-[9px] font-bold text-white">
            {calculatedHoldings.map((h, idx) => {
              const share = ((h.marketValue / (totalValue || 1)) * 100).toFixed(1);
              const colors = ['bg-emerald-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-amber-500', 'bg-purple-500'];
              const bg = colors[idx % colors.length];

              return (
                <div
                  key={h.symbol}
                  style={{ width: `${share}%` }}
                  className={`${bg} flex items-center justify-center transition-all`}
                  title={`${h.symbol}: ${share}% ($${h.marketValue.toLocaleString()})`}
                >
                  {Number(share) > 8 && `${h.symbol} ${share}%`}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Holdings Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-sm font-bold text-white">Current Asset Holdings</div>
          <span className="text-xs font-mono text-slate-400">
            Weighted Average Cost Basis
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4 text-right">Holding Units</th>
                <th className="py-3 px-4 text-right">Avg Buying Price</th>
                <th className="py-3 px-4 text-right">Current Spot</th>
                <th className="py-3 px-4 text-right">Market Value</th>
                <th className="py-3 px-4 text-right">Unrealized P&L</th>
                <th className="py-3 px-4 text-right">Allocation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {calculatedHoldings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No holdings in portfolio. Record your first trade to begin tracking.
                  </td>
                </tr>
              ) : (
                calculatedHoldings.map((h) => {
                  const allocPct = ((h.marketValue / (totalValue || 1)) * 100).toFixed(1);

                  return (
                    <tr key={h.symbol} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div
                          onClick={() => onNavigate(`/coin/${h.symbol}`)}
                          className="flex items-center gap-2.5 cursor-pointer group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                            {h.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                              {h.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 ml-1.5">{h.symbol}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-slate-200 text-right">
                        {h.amount.toLocaleString()} {h.symbol}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-300 text-right">
                        ${h.buyPrice < 1 ? h.buyPrice.toFixed(4) : h.buyPrice.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-white text-right">
                        ${h.currentPrice < 1 ? h.currentPrice.toFixed(4) : h.currentPrice.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-white text-right">
                        ${h.marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      <td className="py-3 px-4 font-mono text-right">
                        <div
                          className={`font-bold ${
                            h.pnlUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {h.pnlUsd >= 0 ? '+' : ''}${h.pnlUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div
                          className={`text-[10px] ${
                            h.pnlPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          ({h.pnlPct >= 0 ? '+' : ''}{h.pnlPct.toFixed(2)}%)
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-300 text-right">
                        {allocPct}%
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenAddModal(h.symbol)}
                          className="text-xs font-medium text-emerald-400 hover:text-emerald-300 cursor-pointer"
                        >
                          + Add Trade
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Record Trade Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Portfolio Transaction"
        subtitle="Automatic weighted cost-basis calculation"
      >
        <form onSubmit={handleSaveTrade} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Asset</label>
              <select
                value={formSymbol}
                onChange={(e) => {
                  const s = e.target.value;
                  setFormSymbol(s);
                  const c = coins.find((coin) => coin.symbol === s);
                  if (c) setFormPrice(String(c.price));
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {coins.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Trade Type</label>
              <div className="flex rounded-lg overflow-hidden border border-slate-800">
                <button
                  type="button"
                  onClick={() => setFormType('BUY')}
                  className={`flex-1 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    formType === 'BUY' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('SELL')}
                  className={`flex-1 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    formType === 'SELL' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  SELL
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Amount ({formSymbol})</label>
              <input
                type="number"
                step="any"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Execution Price ($ USD)</label>
              <input
                type="number"
                step="any"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Notes / Rationale</label>
            <input
              type="text"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="e.g. Dollar cost average accumulation..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Trade
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
