import React from 'react';
import {
  Activity,
  BarChart2,
  Bookmark,
  Briefcase,
  Compass,
  Cpu,
  Layers,
  Settings,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '../common/Button';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: string;
  onNavigate: (route: string) => void;
  watchlistCount?: number;
  portfolioCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentRoute,
  onNavigate,
  watchlistCount = 0,
  portfolioCount = 0,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { label: 'Public Homepage', path: '/', icon: <Compass className="w-4 h-4" /> },
    { label: 'Markets Directory', path: '/markets', icon: <Layers className="w-4 h-4" /> },
    { label: 'BTC Live Analysis', path: '/coin/BTC', icon: <Zap className="w-4 h-4" /> },
    { label: 'AI Opportunity Radar', path: '/predictions', icon: <BarChart2 className="w-4 h-4" /> },
    { label: '7-Model Benchmarks', path: '/models', icon: <Cpu className="w-4 h-4" /> },
    { label: 'HMM Regimes', path: '/regimes', icon: <Activity className="w-4 h-4" /> },
    {
      label: 'Watchlist',
      path: '/watchlist',
      icon: <Bookmark className="w-4 h-4" />,
      badge: watchlistCount > 0 ? watchlistCount : undefined,
    },
    {
      label: 'Portfolio Tracker',
      path: '/portfolio',
      icon: <Briefcase className="w-4 h-4" />,
      badge: portfolioCount > 0 ? portfolioCount : undefined,
    },
    { label: 'Workstation Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shadow-2xl z-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
                CA
              </div>
              <span className="font-extrabold text-white tracking-tight font-mono text-sm">
                Crypto<span className="text-emerald-400">Analyzer</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 px-3 mb-2">
              Research Navigation
            </div>
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? currentRoute === '/'
                  : currentRoute.startsWith(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
          <div className="font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Binance Spot Online</span>
          </div>
          <div>Academic Research Lab v2.4</div>
        </div>
      </div>
    </div>
  );
};
