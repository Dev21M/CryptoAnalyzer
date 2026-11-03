import React, { useState } from 'react';
import {
  Activity,
  BarChart2,
  Bell,
  Bookmark,
  Boxes,
  Briefcase,
  ChevronDown,
  Cpu,
  Layers,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
  User as UserIcon,
  Zap,
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
  onOpenSearch: () => void;
  onOpenSidebar: () => void;
  currency?: string;
  onSelectCurrency?: (curr: 'USD' | 'EUR' | 'GBP' | 'INR') => void;
  alertsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  coins,
  providerStatus,
  theme,
  onToggleTheme,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenSearch,
  onOpenSidebar,
  currency = 'USD',
  onSelectCurrency,
  alertsCount = 0,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);

  const primaryNav = [
    { label: 'Dashboard', route: '/' },
    { label: 'Markets', route: '/markets' },
    { label: 'AI Intelligence', route: '/ai-intelligence' },
    { label: 'Market Sentiment', route: '/sentiment' },
    { label: 'Price Forecast', route: '/forecast' },
    { label: 'Portfolio', route: '/portfolio' },
  ];

  const toolsList = [
    { label: 'Profit Calculator', route: '/tools/profit-calculator' },
    { label: 'DCA Calculator', route: '/tools/dca-calculator' },
    { label: 'Coin Comparison', route: '/tools/compare' },
    { label: 'Trading Simulator', route: '/tools/simulator' },
    { label: 'Risk Analysis', route: '/risk-analysis' },
    { label: 'Market Heatmap', route: '/heatmap' },
    { label: 'Crypto News', route: '/news' },
    { label: 'Learn Crypto', route: '/learn' },
  ];

  const currencies: Array<'USD' | 'EUR' | 'GBP' | 'INR'> = ['USD', 'EUR', 'GBP', 'INR'];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      {/* Ticker Top Bar */}
      <div className="hidden lg:flex items-center justify-between px-4 py-1.5 text-xs border-b border-slate-800/60 bg-slate-900/50 text-slate-400">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar font-mono text-[11px]">
          <span className="text-slate-500 font-sans uppercase text-[10px] tracking-wider font-semibold shrink-0">
            Live Stream
          </span>
          {coins.slice(0, 6).map((coin) => (
            <button
              key={coin.symbol}
              onClick={() => onNavigate(`/coin/${coin.symbol}`)}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer shrink-0"
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

        {/* Live Feed Status & AI indicator */}
        <div className="flex items-center gap-4 shrink-0 text-[11px]">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">
              Live Feed: <strong className="text-slate-200">{providerStatus.activeProvider}</strong>
            </span>
          </div>

          <button
            onClick={() => onNavigate('/ai-intelligence')}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Assistant Active</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Left: Sidebar Toggle + Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSidebar}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
              aria-label="Open Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="text-base font-bold tracking-tight text-white font-mono">
                  Crypto<span className="text-emerald-400">Analyzer</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  Intelligence Platform
                </span>
              </div>
            </button>
          </div>

          {/* Center: Primary Desktop Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {primaryNav.map((item) => {
              const isActive =
                item.route === '/'
                  ? currentRoute === '/'
                  : currentRoute === item.route;

              return (
                <button
                  key={item.route}
                  onClick={() => onNavigate(item.route)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <span>Tools</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {isToolsMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsToolsMenuOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 animate-slide-in">
                    {toolsList.map((tool) => (
                      <button
                        key={tool.route}
                        onClick={() => {
                          onNavigate(tool.route);
                          setIsToolsMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        {tool.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right: Quick Search + Currency + Alerts + Theme + Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Search Button (CMD+K) */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Search coins and tools (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Currency Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {isCurrencyMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsCurrencyMenuOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-24 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50">
                    {currencies.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          onSelectCurrency?.(c);
                          setIsCurrencyMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1 text-xs font-mono transition-colors cursor-pointer ${
                          currency === c ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Price Alerts Icon Button */}
            <button
              onClick={() => onNavigate('/alerts')}
              className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
              title="Price Alerts"
            >
              <Bell className="w-4 h-4" />
              {alertsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
              )}
            </button>

            {/* Watchlist Quick Button */}
            <button
              onClick={() => onNavigate('/watchlist')}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
              title="My Watchlist"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Session Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white hover:border-slate-700 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[11px] flex items-center justify-center">
                    {currentUser.avatarSeed || currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-medium max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-slide-in">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
                        <div className="text-[11px] font-mono text-slate-400 truncate">{currentUser.email}</div>
                      </div>
                      <button
                        onClick={() => {
                          onNavigate('/profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>User Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('/portfolio');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>My Portfolio</span>
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('/settings');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Settings</span>
                      </button>
                      <div className="border-t border-slate-800 my-1" />
                      <button
                        onClick={() => {
                          onLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
