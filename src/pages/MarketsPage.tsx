import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Download,
  Filter,
  Layers,
  Search,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ExportModal } from '../components/common/ExportModal';
import { RegimeBadge } from '../components/common/RegimeBadge';
import { toggleWatchlistSymbol } from '../services/storage';
import { CoinSummary, MarketRegime } from '../types/crypto';

interface MarketsPageProps {
  coins: CoinSummary[];
  watchlist: string[];
  onWatchlistChange: (updated: string[]) => void;
  onNavigate: (route: string) => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

export const MarketsPage: React.FC<MarketsPageProps> = ({
  coins,
  watchlist,
  onWatchlistChange,
  onNavigate,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeRegime, setActiveRegime] = useState<string>('All');
  const [onlyWatchlist, setOnlyWatchlist] = useState(false);
  const [sortBy, setSortBy] = useState<'marketCap' | 'change24h' | 'volume24h' | 'price'>(
    'marketCap'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isExportOpen, setIsExportOpen] = useState(false);

  const categories = ['All', 'Layer 1', 'DeFi', 'AI & Big Data', 'Layer 2', 'Meme', 'Infra'];
  const regimes = ['All', 'Bull', 'Bear', 'Sideways', 'High Volatility'];

  const filteredCoins = coins
    .filter((c) => {
      if (onlyWatchlist && !watchlist.includes(c.symbol)) return false;
      if (activeCategory !== 'All' && c.category !== activeCategory) return false;
      if (activeRegime !== 'All' && c.currentRegime !== activeRegime) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      let diff = 0;
      if (sortBy === 'marketCap') diff = a.marketCap - b.marketCap;
      else if (sortBy === 'change24h') diff = a.change24h - b.change24h;
      else if (sortBy === 'volume24h') diff = a.volume24h - b.volume24h;
      else if (sortBy === 'price') diff = a.price - b.price;
      return sortOrder === 'desc' ? -diff : diff;
    });

  const handleSort = (field: 'marketCap' | 'change24h' | 'volume24h' | 'price') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleToggleWatchlist = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    const isCurrentlySaved = watchlist.includes(symbol);
    const updated = toggleWatchlistSymbol(symbol);
    onWatchlistChange(updated);
    if (!isCurrentlySaved) {
      onShowToast?.('Added to Watchlist', `${symbol} added to priority research alerts.`, 'success');
    } else {
      onShowToast?.('Removed from Watchlist', `${symbol} removed from priority alerts.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Cryptocurrency Markets Matrix</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-asset intelligence, HMM regime state, and machine learning price momentum
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={onlyWatchlist ? 'primary' : 'outline'}
            size="sm"
            icon={onlyWatchlist ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            onClick={() => setOnlyWatchlist(!onlyWatchlist)}
          >
            {onlyWatchlist ? `Watchlist (${watchlist.length})` : 'Filter Watchlist'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => setIsExportOpen(true)}
          >
            Export Markets
          </Button>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <Card padding="sm" floating={true}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search coin name or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
            <span className="text-slate-500 text-[11px] font-mono mr-1">Sector:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-slate-800 text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-850'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Regime Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
            <span className="text-slate-500 text-[11px] font-mono mr-1">Regime:</span>
            {regimes.map((reg) => (
              <button
                key={reg}
                onClick={() => setActiveRegime(reg)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-colors ${
                  activeRegime === reg
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Markets Table */}
      <Card padding="none" floating={true}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase select-none">
              <tr>
                <th className="py-3 px-3 w-10 text-center">★</th>
                <th className="py-3 px-4">Asset</th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('price')}
                >
                  Spot Price {sortBy === 'price' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th className="py-3 px-4 text-right">1h %</th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('change24h')}
                >
                  24h Change {sortBy === 'change24h' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th className="py-3 px-4 text-right">7d Change</th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('volume24h')}
                >
                  24h Volume {sortBy === 'volume24h' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('marketCap')}
                >
                  Market Cap {sortBy === 'marketCap' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th className="py-3 px-4 text-center">HMM Regime</th>
                <th className="py-3 px-4 text-right">Primary ML Forecast</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredCoins.length > 0 ? (
                filteredCoins.map((coin) => {
                  const isSaved = watchlist.includes(coin.symbol);
                  const isBull = coin.primaryForecast.direction === 'Bullish';
                  const isBear = coin.primaryForecast.direction === 'Bearish';

                  return (
                    <tr
                      key={coin.symbol}
                      onClick={() => onNavigate(`/coin/${coin.symbol}`)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      {/* Watchlist toggle */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => handleToggleWatchlist(e, coin.symbol)}
                          className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                          aria-label={`Toggle ${coin.symbol} watchlist`}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Coin Name & Symbol */}
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center font-mono font-bold text-white text-xs">
                            {coin.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                              {coin.symbol}
                            </div>
                            <div className="text-[11px] text-slate-400">{coin.name}</div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-right font-bold text-slate-100">
                        ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
                      </td>

                      {/* 1h Change */}
                      <td
                        className={`py-3.5 px-4 text-right font-medium ${
                          coin.change1h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {coin.change1h >= 0 ? '+' : ''}
                        {coin.change1h.toFixed(2)}%
                      </td>

                      {/* 24h Change */}
                      <td
                        className={`py-3.5 px-4 text-right font-semibold ${
                          coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {coin.change24h >= 0 ? '+' : ''}
                        {coin.change24h.toFixed(2)}%
                      </td>

                      {/* 7d Change */}
                      <td
                        className={`py-3.5 px-4 text-right ${
                          coin.change7d >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {coin.change7d >= 0 ? '+' : ''}
                        {coin.change7d.toFixed(2)}%
                      </td>

                      {/* 24h Volume */}
                      <td className="py-3.5 px-4 text-right text-slate-300">
                        ${(coin.volume24h / 1e6).toFixed(1)}M
                      </td>

                      {/* Market Cap */}
                      <td className="py-3.5 px-4 text-right text-slate-300">
                        ${(coin.marketCap / 1e9).toFixed(2)}B
                      </td>

                      {/* Regime */}
                      <td className="py-3.5 px-4 text-center">
                        <RegimeBadge regime={coin.currentRegime} size="sm" />
                      </td>

                      {/* Forecast */}
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`font-semibold ${
                            isBull ? 'text-emerald-400' : isBear ? 'text-rose-400' : 'text-slate-300'
                          }`}
                        >
                          {coin.primaryForecast.direction} ({coin.primaryForecast.expectedReturnPct >= 0 ? '+' : ''}
                          {coin.primaryForecast.expectedReturnPct}%)
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No coins found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        symbol="ALL_MARKETS"
        data={filteredCoins.map((c) => ({
          symbol: c.symbol,
          name: c.name,
          category: c.category,
          price: c.price,
          change24h: c.change24h,
          volume24h: c.volume24h,
          marketCap: c.marketCap,
          regime: c.currentRegime,
          forecastDirection: c.primaryForecast.direction,
          expectedReturn: c.primaryForecast.expectedReturnPct,
        }))}
        title="Export Markets Matrix"
      />
    </div>
  );
};
