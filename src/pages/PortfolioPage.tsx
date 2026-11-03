import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Download,
  Plus,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ExportModal } from '../components/common/ExportModal';
import { MetricCard } from '../components/common/MetricCard';
import { Modal } from '../components/common/Modal';
import { RegimeBadge } from '../components/common/RegimeBadge';
import {
  addPortfolioHolding,
  getPortfolio,
  removePortfolioHolding,
  toggleWatchlistSymbol,
} from '../services/storage';
import { CoinSummary, PortfolioHolding } from '../types/crypto';

interface PortfolioPageProps {
  coins: CoinSummary[];
  watchlist: string[];
  onWatchlistChange: (updated: string[]) => void;
  onNavigate: (route: string) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  initialTab?: 'holdings' | 'watchlist';
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  coins,
  watchlist,
  onWatchlistChange,
  onNavigate,
  onShowToast,
  initialTab = 'holdings',
}) => {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(getPortfolio());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'holdings' | 'watchlist'>(initialTab);

  // Form State for Adding Holding
  const [formSymbol, setFormSymbol] = useState('BTC');
  const [formAmount, setFormAmount] = useState('');
  const [formBuyPrice, setFormBuyPrice] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Watchlisted Coin Objects
  const watchlistedCoins = coins.filter((c) => watchlist.includes(c.symbol));

  // Safe formatting helpers
  const formatNum = (val: number | undefined, decimals = 2): string => {
    const n = typeof val === 'number' && !isNaN(val) ? val : 0;
    return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const formatPriceVal = (val: number | undefined): string => {
    const n = typeof val === 'number' && !isNaN(val) ? val : 0;
    if (n < 1 && n > 0) return n.toFixed(4);
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Portfolio Calculations with complete defensive guards
  const calculatedHoldings = holdings.map((h) => {
    const coin = coins.find((c) => c && c.symbol && c.symbol.toUpperCase() === (h.symbol || '').toUpperCase());
    const buyPrice = typeof h.buyPrice === 'number' && !isNaN(h.buyPrice) ? h.buyPrice : 0;
    const amount = typeof h.amount === 'number' && !isNaN(h.amount) ? h.amount : 0;
    const currentPrice = typeof coin?.price === 'number' && !isNaN(coin.price) ? coin.price : buyPrice;
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

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(formAmount);
    const price = parseFloat(formBuyPrice);
    if (isNaN(amt) || amt <= 0 || isNaN(price) || price <= 0) return;

    const coin = coins.find((c) => c.symbol === formSymbol);
    const updated = addPortfolioHolding({
      symbol: formSymbol,
      name: coin?.name ?? formSymbol,
      amount: amt,
      buyPrice: price,
      buyDate: new Date().toISOString().split('T')[0],
      notes: formNotes,
    });

    setHoldings(updated);
    setIsAddModalOpen(false);
    setFormAmount('');
    setFormBuyPrice('');
    setFormNotes('');
    onShowToast?.(
      'Position Saved',
      `Recorded ${amt} ${formSymbol} at $${price.toLocaleString()} in your research portfolio.`,
      'success'
    );
  };

  const handleDeleteHolding = (id: string) => {
    const target = holdings.find((h) => h.id === id);
    const updated = removePortfolioHolding(id);
    setHoldings(updated);
    onShowToast?.(
      'Holding Removed',
      `Removed ${target?.symbol || 'position'} from portfolio tracking.`,
      'info'
    );
  };

  const handleRemoveWatchlist = (symbol: string) => {
    const updated = toggleWatchlistSymbol(symbol);
    onWatchlistChange(updated);
    onShowToast?.('Watchlist Updated', `Removed ${symbol} from priority research alerts.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Portfolio & Watchlist Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track multi-coin positions, unrealized P/L, and monitor priority watchlisted research assets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              const btc = coins.find((c) => c.symbol === 'BTC');
              setFormSymbol('BTC');
              setFormBuyPrice(btc ? btc.price.toString() : '65000');
              setIsAddModalOpen(true);
            }}
          >
            Add Holding
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => setIsExportOpen(true)}
          >
            Export Portfolio
          </Button>
        </div>
      </div>

      {/* Portfolio Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Portfolio Valuation"
          value={`$${formatNum(totalValue)}`}
          subtext={`Cost basis: $${formatNum(totalCost)}`}
          icon={<Wallet className="w-4 h-4 text-emerald-400" />}
          variant="highlight"
        />
        <MetricCard
          label="Total Unrealized P/L ($)"
          value={`${totalPnlUsd >= 0 ? '+' : ''}$${formatNum(totalPnlUsd)}`}
          change={totalPnlPct}
          changeLabel="Total P/L"
        />
        <MetricCard
          label="Active Positions"
          value={holdings.length}
          subtext="Stored safely in localStorage"
          icon={<Briefcase className="w-4 h-4 text-slate-400" />}
        />
        <MetricCard
          label="Saved Watchlist"
          value={watchlist.length}
          subtext="High-conviction research alerts"
          icon={<BookmarkCheck className="w-4 h-4 text-amber-400" />}
        />
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-1 border-b border-slate-800 bg-slate-900/60 p-1 rounded-lg text-xs font-medium">
        <button
          onClick={() => setActiveTab('holdings')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'holdings'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Portfolio Holdings ({holdings.length})
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'watchlist'
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Watchlist Coins ({watchlist.length})
        </button>
      </div>

      {/* Tab Content 1: Holdings */}
      {activeTab === 'holdings' && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-sans">Asset</th>
                  <th className="py-3 px-4 text-right">Holding Size</th>
                  <th className="py-3 px-4 text-right">Avg Buy Price</th>
                  <th className="py-3 px-4 text-right">Current Spot</th>
                  <th className="py-3 px-4 text-right">Market Value</th>
                  <th className="py-3 px-4 text-right">Unrealized P/L</th>
                  <th className="py-3 px-4 text-center">Regime</th>
                  <th className="py-3 px-4 text-right font-sans">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {calculatedHoldings.length > 0 ? (
                  calculatedHoldings.map((h) => (
                    <tr
                      key={h.id}
                      onClick={() => onNavigate(`/coin/${h.symbol}`)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white group-hover:text-emerald-400">
                            {h.symbol}
                          </span>
                          <span className="text-slate-400 text-[11px]">{h.name}</span>
                        </div>
                        {h.notes && <div className="text-[10px] text-slate-500 italic mt-0.5">{h.notes}</div>}
                      </td>

                      <td className="py-3.5 px-4 text-right text-slate-200">
                        {h.amount} {h.symbol}
                      </td>

                      <td className="py-3.5 px-4 text-right text-slate-300">
                        ${formatPriceVal(h.buyPrice)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-white">
                        ${formatPriceVal(h.currentPrice)}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-slate-100">
                        ${formatNum(h.marketValue)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div
                          className={`font-bold flex items-center justify-end gap-0.5 ${
                            h.pnlUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {h.pnlUsd >= 0 ? '+' : ''}${formatNum(h.pnlUsd)}
                        </div>
                        <div
                          className={`text-[10px] ${
                            h.pnlPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          ({h.pnlPct >= 0 ? '+' : ''}{formatNum(h.pnlPct)}%)
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <RegimeBadge regime={h.currentRegime} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-right font-sans">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteHolding(h.id);
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete holding"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-sans">
                      No holdings in portfolio yet. Click "Add Holding" to track research positions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab Content 2: Watchlist */}
      {activeTab === 'watchlist' && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-sans">Asset</th>
                  <th className="py-3 px-4 text-right">Spot Price</th>
                  <th className="py-3 px-4 text-right">24h Change</th>
                  <th className="py-3 px-4 text-right">24h Volume</th>
                  <th className="py-3 px-4 text-center">Regime</th>
                  <th className="py-3 px-4 text-right">AI 1h Horizon Forecast</th>
                  <th className="py-3 px-4 text-right font-sans">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {watchlistedCoins.length > 0 ? (
                  watchlistedCoins.map((coin) => (
                    <tr
                      key={coin.symbol}
                      onClick={() => onNavigate(`/coin/${coin.symbol}`)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white group-hover:text-emerald-400">
                            {coin.symbol}
                          </span>
                          <span className="text-slate-400 text-[11px]">{coin.name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-white">
                        ${formatPriceVal(coin.price)}
                      </td>

                      <td
                        className={`py-3.5 px-4 text-right font-semibold ${
                          (coin.change24h ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {(coin.change24h ?? 0) >= 0 ? '+' : ''}
                        {formatNum(coin.change24h)}%
                      </td>

                      <td className="py-3.5 px-4 text-right text-slate-300">
                        ${formatNum((coin.volume24h ?? 0) / 1e6, 1)}M
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <RegimeBadge regime={coin.currentRegime ?? 'Sideways'} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-right font-semibold text-emerald-400">
                        {coin.primaryForecast?.direction ?? 'Neutral'} (
                        {(coin.primaryForecast?.expectedReturnPct ?? 0) >= 0 ? '+' : ''}
                        {formatNum(coin.primaryForecast?.expectedReturnPct)}%)
                      </td>

                      <td className="py-3.5 px-4 text-right font-sans">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveWatchlist(coin.symbol);
                          }}
                          className="text-xs text-rose-400 hover:text-rose-300 underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-sans">
                      Your watchlist is empty. Add coins from the Markets page or Coin Analysis page.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Holding Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Holding to Research Portfolio"
        subtitle="Simulate position returns and compare with ML forecasts"
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Select Cryptocurrency
            </label>
            <select
              value={formSymbol}
              onChange={(e) => {
                const s = e.target.value;
                setFormSymbol(s);
                const match = coins.find((c) => c.symbol === s);
                if (match) setFormBuyPrice(match.price.toString());
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            >
              {coins.map((c) => (
                <option key={c.symbol} value={c.symbol}>
                  {c.symbol} — {c.name} (${c.price.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Holding Amount
            </label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 0.5"
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Cost Basis / Buy Price (USD)
            </label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 64200"
              value={formBuyPrice}
              onChange={(e) => setFormBuyPrice(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
              Research Thesis / Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Accumulation at 200 EMA support"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Holding
            </Button>
          </div>
        </form>
      </Modal>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        symbol="PORTFOLIO"
        data={calculatedHoldings}
        title="Export Research Portfolio"
      />
    </div>
  );
};
