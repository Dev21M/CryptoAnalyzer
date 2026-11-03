import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  Moon,
  RefreshCw,
  RotateCcw,
  Shield,
  Sun,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { DEFAULT_SETTINGS, saveSettings } from '../services/storage';
import {
  DataProviderStatus,
  MLArchitecture,
  PredictionHorizon,
  Timeframe,
  UserSettings,
} from '../types/crypto';

interface SettingsPageProps {
  settings: UserSettings;
  onSettingsChange: (updated: UserSettings) => void;
  providerStatus: DataProviderStatus;
  onRefreshFeed: () => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onSettingsChange,
  providerStatus,
  onRefreshFeed,
  onShowToast,
}) => {
  const [currentSettings, setCurrentSettings] = useState<UserSettings>(settings);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSave = (updated: Partial<UserSettings>) => {
    const next = { ...currentSettings, ...updated };
    setCurrentSettings(next);
    saveSettings(next);
    onSettingsChange(next);
    onShowToast?.('Preferences Saved', 'Your research platform configuration has been updated.', 'success');
  };

  const handleToggleTheme = () => {
    const nextTheme: 'dark' | 'light' = currentSettings.theme === 'dark' ? 'light' : 'dark';
    handleSave({ theme: nextTheme });
  };

  const handleResetDefaults = () => {
    setCurrentSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    onSettingsChange(DEFAULT_SETTINGS);
    onShowToast?.('Settings Reset', 'Restored default quantitative lab configuration.', 'info');
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    onRefreshFeed();
    setTimeout(() => {
      setIsRefreshing(false);
      onShowToast?.('Data Synchronized', 'Real-time spot market feed updated from Binance.', 'success');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Configuration & Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage real-time data feeds, theme preferences, inference defaults, and cache
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
            onClick={handleManualRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Syncing...' : 'Sync Market Feed'}
          </Button>
        </div>
      </div>

      {/* Section 1: Appearance & Display */}
      <Card title="Interface & Regional Preferences">
        <div className="space-y-4">
          {/* Unified 1-Click Dark/Light Mode Switch */}
          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <div>
              <div className="text-sm font-medium text-white">Color Theme Appearance</div>
              <div className="text-xs text-slate-400">
                Current mode: <strong className="text-slate-200 capitalize">{currentSettings.theme}</strong>
              </div>
            </div>

            <button
              onClick={handleToggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-white transition-all cursor-pointer shadow-sm group"
            >
              {currentSettings.theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                  <span>Switch to Light Theme</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-cyan-400 group-hover:-rotate-12 transition-transform" />
                  <span>Switch to Dark Theme</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <div>
              <div className="text-sm font-medium text-white">Academic Disclaimer Banner</div>
              <div className="text-xs text-slate-400">
                Show persistent risk and methodology notice on top of application
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentSettings.showDisclaimerBanner}
                onChange={(e) => handleSave({ showDisclaimerBanner: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <div>
              <div className="text-sm font-medium text-white">Default Quotation Currency</div>
              <div className="text-xs text-slate-400">
                Base denominator for spot prices and market valuations
              </div>
            </div>
            <select
              value={currentSettings.currency}
              onChange={(e) => handleSave({ currency: e.target.value as any })}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          {/* Real-time Audio Chimes */}
          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <div>
              <div className="text-sm font-medium text-white">Synthesizer Sound Alerts</div>
              <div className="text-xs text-slate-400">
                Play an instant audio chime via Web Audio API when target price triggers
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentSettings.enableSoundAlerts ?? true}
                onChange={(e) => handleSave({ enableSoundAlerts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Advanced Mode */}
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium text-white">Advanced Technical Mode</div>
              <div className="text-xs text-slate-400">
                Display quantitative metrics, HMM matrix, and raw indicators across pages
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentSettings.advancedMode ?? false}
                onChange={(e) => handleSave({ advancedMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Section 2: Data Provider Health & Failover Management */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Data Providers & Failover Chain</span>
          </div>
        }
        subtitle="Automatic 3-tier redundancy hierarchy: FCS Financial → Binance Spot → CoinGecko"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Primary */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Tier 1: FCS API</span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Primary
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Latency: {providerStatus.primary.latencyMs} ms</div>
              <div className="text-[10px] text-slate-500">Forex & Institutional Crypto API</div>
            </div>

            {/* Fallback */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Tier 2: Binance Spot</span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Latency: {providerStatus.fallback.latencyMs} ms</div>
              <div className="text-[10px] text-emerald-400 font-mono">Real-time WebSocket & Kline REST</div>
            </div>

            {/* Backup */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Tier 3: CoinGecko</span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  Standby
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Latency: {providerStatus.backup.latencyMs} ms</div>
              <div className="text-[10px] text-slate-500">Global Market Cap Fallback</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-sm font-medium text-white">Auto Refresh Polling Interval</div>
              <div className="text-xs text-slate-400">Frequency of price and candle sync</div>
            </div>
            <select
              value={currentSettings.refreshIntervalSec}
              onChange={(e) => handleSave({ refreshIntervalSec: parseInt(e.target.value) })}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value={5}>Every 5 seconds (High frequency)</option>
              <option value={15}>Every 15 seconds (Standard)</option>
              <option value={30}>Every 30 seconds</option>
              <option value={60}>Every 60 seconds (Conservative)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Section 3: Machine Learning Research Defaults */}
      <Card title="Machine Learning Inference Defaults">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Default Chart Timeframe
            </label>
            <select
              value={currentSettings.defaultTimeframe}
              onChange={(e) => handleSave({ defaultTimeframe: e.target.value as Timeframe })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="5m">5 Minutes (Scalping Research)</option>
              <option value="15m">15 Minutes</option>
              <option value="1h">1 Hour (Core Research Horizon)</option>
              <option value="4h">4 Hours</option>
              <option value="1d">1 Day (Macro Swing)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Default Prediction Target Horizon
            </label>
            <select
              value={currentSettings.defaultHorizon}
              onChange={(e) => handleSave({ defaultHorizon: e.target.value as PredictionHorizon })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="5m">5 Minutes</option>
              <option value="15m">15 Minutes</option>
              <option value="1h">1 Hour</option>
              <option value="4h">4 Hours</option>
              <option value="1d">24 Hours</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Danger Zone / Reset */}
      <Card title="Cache & Storage Maintenance">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-white">Reset Configuration to Default</div>
            <div className="text-xs text-slate-400">
              Restore default research horizons, theme, and data settings
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={handleResetDefaults}
          >
            Reset Defaults
          </Button>
        </div>
      </Card>
    </div>
  );
};
