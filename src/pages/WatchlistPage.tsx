import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Bookmark,
  ExternalLink,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { PriceChange } from '../components/common/PriceChange';
import { CoinSummary } from '../types/crypto';

interface WatchlistPageProps {
  coins: CoinSummary[];
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onNavigate: (route: string) => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  coins,
  watchlist,
  onToggleWatchlist,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const watchedCoins = coins.filter((c) => watchlist.includes(c.symbol.toUpperCase()));
  const unselectedCoins = coins.filter((c) => !watchlist.includes(c.symbol.toUpperCase()));

  const filteredUnselected = unselectedCoins.filter(
    (c) =>
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Personal Watchlist</h1>
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              {watchedCoins.length} Tracked Coins
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time market tracking and quick access to your preferred cryptocurrencies
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAddOpen(!isAddOpen)}
          icon={<Plus className="w-4 h-4" />}
        >
          {isAddOpen ? 'Close Add Coin' : 'Add to Watchlist'}
        </Button>
      </div>

      {/* Add Coin Search Panel (collapsible) */}
      {isAddOpen && (
        <Card className="p-4 border-emerald-500/30 bg-slate-900/90 animate-slide-in">
          <div className="text-xs font-semibold text-slate-300 mb-2">Select Cryptocurrencies to Watch:</div>
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter available coins..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
            {filteredUnselected.map((coin) => (
              <button
                key={coin.symbol}
                onClick={() => onToggleWatchlist(coin.symbol)}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-colors text-left cursor-pointer group"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-400">{coin.symbol}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[80px]">{coin.name}</div>
                </div>
                <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Watchlist Cards Grid */}
      {watchedCoins.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Your Watchlist is Empty</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Add your favorite coins from the Markets page or click "Add to Watchlist" above to start tracking prices.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => onNavigate('/markets')}>
            Browse Markets
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchedCoins.map((coin) => (
            <Card
              key={coin.symbol}
              className="p-4 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div
                    onClick={() => onNavigate(`/coin/${coin.symbol}`)}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                      {coin.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {coin.name}
                      </div>
                      <div className="text-xs font-mono text-slate-400">{coin.symbol} / USDT</div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleWatchlist(coin.symbol)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Price and 24h change */}
                <div className="mt-4 flex items-baseline justify-between">
                  <div className="text-xl font-bold font-mono text-white">
                    ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
                  </div>
                  <PriceChange value={coin.change24h} size="md" />
                </div>

                {/* Mini Stats Grid */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                  <div>
                    <span className="text-slate-500 block text-[10px]">24h High</span>
                    <span className="text-slate-200">${coin.high24h.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">24h Low</span>
                    <span className="text-slate-200">${coin.low24h.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Market Cap</span>
                    <span className="text-slate-200">${(coin.marketCap / 1e9).toFixed(2)}B</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">24h Volume</span>
                    <span className="text-slate-200">${(coin.volume24h / 1e6).toFixed(1)}M</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => onNavigate(`/coin/${coin.symbol}`)}
                  className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Technical Analysis</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onNavigate('/alerts')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Set Alert
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
