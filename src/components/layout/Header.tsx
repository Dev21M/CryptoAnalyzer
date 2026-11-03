import React, { useState } from 'react';
import {
  Activity,
  BarChart2,
  BookOpen,
  Boxes,
  Briefcase,
  ChevronDown,
  Cpu,
  Layers,
  LogOut,
  Moon,
  Search,
  Sun,
  User as UserIcon,
  UserCheck,
} from 'lucide-react';
import { User } from '../../services/auth';
import { CoinSummary, DataProviderStatus } from '../../types/crypto';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  coins: CoinSummary[];
  providerStatus: DataProviderStatus;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenDisclaimer: () => void;
  currentUser: User | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  coins,
  providerStatus,
  theme,
  onToggleTheme,
  onOpenDisclaimer,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', route: '/', icon: <BarChart2 className="w-4 h-4" /> },
    { label: 'Markets', route: '/markets', icon: <Layers className="w-4 h-4" /> },
    { label: 'Predictions Lab', route: '/predictions', icon: <Cpu className="w-4 h-4" /> },
    { label: '7-Model Benchmark', route: '/models', icon: <Activity className="w-4 h-4" /> },
    { label: 'HMM Regimes', route: '/regimes', icon: <Boxes className="w-4 h-4" /> },
    { label: 'Portfolio', route: '/portfolio', icon: <Briefcase className="w-4 h-4" /> },
  ];

  const filteredCoins = searchQuery.trim()
    ? coins.filter(
        (c) =>
          c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Ticker Top Bar */}
      <div className="hidden lg:flex items-center justify-between px-4 py-1.5 text-xs border-b border-slate-800/60 bg-slate-900/50 text-slate-400">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar font-mono">
          <span className="text-slate-500 font-sans uppercase text-[10px] tracking-wider font-semibold">
            Live Stream
          </span>
          {coins.slice(0, 5).map((coin) => (
            <button
              key={coin.symbol}
              onClick={() => onNavigate(`/coin/${coin.symbol}`)}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <span className="font-semibold text-slate-300">{coin.symbol}</span>
              <span>${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}</span>
              <span className={coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {coin.change24h >= 0 ? '+' : ''}
                {coin.change24h.toFixed(2)}%
              </span>
            </button>
          ))}
        </div>

        {/* Data Provider Health Status & Disclaimer */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-mono">
              Feed: <strong className="text-slate-200">{providerStatus.activeProvider}</strong> ({providerStatus.fallback.latencyMs}ms)
            </span>
          </div>
          <button
            onClick={onOpenDisclaimer}
            className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3 h-3" />
            <span>Academic Research Notice</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3 sm:gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight text-white font-mono">
                    Crypto<span className="text-emerald-400">Analyzer</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    v2.4 ML-LAB
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 hidden sm:block">
                  Quantitative Time Series Research
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const isActive =
                item.route === '/'
                  ? currentRoute === '/'
                  : currentRoute.startsWith(item.route);

              return (
                <button
                  key={item.route}
                  onClick={() => onNavigate(item.route)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Search, Theme Single-Switch, Auth & Settings */}
          <div className="flex items-center gap-2">
            {/* Quick Coin Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Search coin...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] bg-slate-800 rounded border border-slate-700 text-slate-400 font-mono">
                  /
                </kbd>
              </button>

              {/* Quick Search Dropdown / Dialog */}
              {isSearchOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-sm">
                  <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-3 border-b border-slate-800 flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by coin symbol or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="w-full bg-transparent text-sm text-white focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="text-xs text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
                      >
                        Esc
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto p-2 divide-y divide-slate-800/50">
                      {searchQuery.trim() === '' ? (
                        <div className="p-3 text-xs text-slate-400">
                          Popular coins:
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'AVAX', 'NEAR'].map((sym) => (
                              <button
                                key={sym}
                                onClick={() => {
                                  onNavigate(`/coin/${sym}`);
                                  setIsSearchOpen(false);
                                  setSearchQuery('');
                                }}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-600/20 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
                              >
                                {sym}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : filteredCoins.length > 0 ? (
                        filteredCoins.map((coin) => (
                          <button
                            key={coin.symbol}
                            onClick={() => {
                              onNavigate(`/coin/${coin.symbol}`);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/80 text-left transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono font-bold text-white">{coin.symbol}</span>
                              <span className="text-xs text-slate-400">{coin.name}</span>
                            </div>
                            <div className="text-right font-mono">
                              <div className="text-xs text-white">
                                ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString()}
                              </div>
                              <div
                                className={`text-[10px] ${
                                  coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                              >
                                {coin.change24h >= 0 ? '+' : ''}
                                {coin.change24h.toFixed(2)}%
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-400">
                          No coins found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* UNIFIED 1-CLICK REAL-TIME DARK / LIGHT MODE SWITCH BUTTON */}
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm select-none"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Dark and Light Mode"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 transition-transform hover:rotate-45" />
                  <span className="hidden lg:inline text-[11px] font-medium">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-400 transition-transform hover:-rotate-12" />
                  <span className="hidden lg:inline text-[11px] font-medium">Dark</span>
                </>
              )}
            </button>

            {/* AUTHENTICATION BUTTON / PROFILE DROPDOWN */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 text-xs transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                    {currentUser.avatarSeed || 'CR'}
                  </div>
                  <span className="hidden sm:inline font-medium text-slate-200 max-w-[120px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-xl py-2 z-50 text-xs">
                    <div className="px-3.5 py-2 border-b border-slate-800">
                      <div className="font-semibold text-white truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                        {currentUser.role}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate('/portfolio');
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      <span>My Portfolio & Watchlist</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate('/settings');
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Cpu className="w-4 h-4 text-slate-400" />
                      <span>Lab Preferences</span>
                    </button>

                    <div className="border-t border-slate-800 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3.5 py-2 text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In / Register</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}

            {/* Settings shortcut button */}
            <button
              onClick={() => onNavigate('/settings')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                currentRoute === '/settings'
                  ? 'text-emerald-400 bg-slate-800'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Settings"
            >
              <Cpu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Tabs */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar text-xs">
          {navLinks.map((item) => (
            <button
              key={item.route}
              onClick={() => onNavigate(item.route)}
              className={`px-3 py-1.5 rounded-lg shrink-0 font-medium cursor-pointer ${
                currentRoute === item.route
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
