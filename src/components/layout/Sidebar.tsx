import React from 'react';
import {
  Activity,
  BarChart2,
  Bookmark,
  Boxes,
  Briefcase,
  ChevronRight,
  Compass,
  Cpu,
  History,
  Layers,
  Newspaper,
  PieChart,
  Settings,
  ShieldAlert,
  Sliders,
  TrendingUp,
  User as UserIcon,
  X,
  Zap,
} from 'lucide-react';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: string;
  onNavigate: (route: string) => void;
  watchlistCount?: number;
  alertsCount?: number;
  portfolioCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentRoute,
  onNavigate,
  watchlistCount = 0,
  alertsCount = 0,
  portfolioCount = 0,
}) => {
  if (!isOpen) return null;

  const sections = [
    {
      title: 'MAIN',
      items: [
        { label: 'Dashboard', path: '/', icon: <Compass className="w-4 h-4" /> },
        { label: 'Markets', path: '/markets', icon: <Layers className="w-4 h-4" /> },
        {
          label: 'Watchlist',
          path: '/watchlist',
          icon: <Bookmark className="w-4 h-4" />,
          badge: watchlistCount > 0 ? watchlistCount : undefined,
        },
      ],
    },
    {
      title: 'ANALYSIS',
      items: [
        { label: 'Coin Analysis', path: '/coin/BTC', icon: <Zap className="w-4 h-4" /> },
        { label: 'Market Sentiment', path: '/sentiment', icon: <Activity className="w-4 h-4" /> },
        { label: 'AI Intelligence', path: '/ai-intelligence', icon: <Cpu className="w-4 h-4" /> },
        { label: 'Price Forecast', path: '/forecast', icon: <TrendingUp className="w-4 h-4" /> },
        { label: 'Risk Analysis', path: '/risk-analysis', icon: <ShieldAlert className="w-4 h-4" /> },
      ],
    },
    {
      title: 'MY FINANCE',
      items: [
        {
          label: 'My Portfolio',
          path: '/portfolio',
          icon: <Briefcase className="w-4 h-4" />,
          badge: portfolioCount > 0 ? portfolioCount : undefined,
        },
        { label: 'Transactions', path: '/transactions', icon: <History className="w-4 h-4" /> },
        {
          label: 'Price Alerts',
          path: '/alerts',
          icon: <Zap className="w-4 h-4" />,
          badge: alertsCount > 0 ? alertsCount : undefined,
        },
      ],
    },
    {
      title: 'DISCOVER',
      items: [
        { label: 'Crypto News', path: '/news', icon: <Newspaper className="w-4 h-4" /> },
        { label: 'Learn Crypto', path: '/learn', icon: <PieChart className="w-4 h-4" /> },
        { label: 'Market Heatmap', path: '/heatmap', icon: <Boxes className="w-4 h-4" /> },
      ],
    },
    {
      title: 'TOOLS',
      items: [
        { label: 'Profit Calculator', path: '/tools/profit-calculator', icon: <BarChart2 className="w-4 h-4" /> },
        { label: 'DCA Calculator', path: '/tools/dca-calculator', icon: <BarChart2 className="w-4 h-4" /> },
        { label: 'Coin Comparison', path: '/tools/compare', icon: <Sliders className="w-4 h-4" /> },
        { label: 'Trading Simulator', path: '/tools/simulator', icon: <Cpu className="w-4 h-4" /> },
      ],
    },
    {
      title: 'PREFERENCES',
      items: [
        { label: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
        { label: 'User Profile', path: '/profile', icon: <UserIcon className="w-4 h-4" /> },
      ],
    },
  ];

  const handleItemClick = (path: string) => {
    onNavigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] bg-slate-900 border-r border-slate-800 flex flex-col justify-between shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              CA
            </div>
            <div>
              <span className="font-bold text-white tracking-tight font-mono text-sm block">
                Crypto<span className="text-emerald-400">Analyzer</span>
              </span>
              <span className="text-[10px] text-slate-400">Complete Crypto Intelligence</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 px-3 py-1 font-semibold">
                {section.title}
              </div>
              {section.items.map((item) => {
                const isActive =
                  item.path === '/'
                    ? currentRoute === '/'
                    : currentRoute === item.path || (item.path.startsWith('/coin/') && currentRoute.startsWith('/coin/'));

                return (
                  <button
                    key={item.path}
                    onClick={() => handleItemClick(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge !== undefined && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="w-3 h-3 text-slate-500 opacity-60" />
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Brand Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px]">Real-Time Market Engine</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">v2.5 Pro</span>
        </div>
      </div>
    </div>
  );
};
