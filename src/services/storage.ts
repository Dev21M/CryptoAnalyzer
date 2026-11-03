/**
 * Local Storage Persistence & Data Export Service
 */

import { PortfolioHolding, UserSettings } from '../types/crypto';

const WATCHLIST_KEY = 'cryptoanalyzer_watchlist_v1';
const PORTFOLIO_KEY = 'cryptoanalyzer_portfolio_v1';
const SETTINGS_KEY = 'cryptoanalyzer_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  defaultTimeframe: '1h',
  defaultHorizon: '1h',
  defaultArchitecture: 'lstm',
  defaultFeatureSet: 'full',
  refreshIntervalSec: 15,
  currency: 'USD',
  showDisclaimerBanner: true,
  activeProviderPreference: 'auto',
};

export function getWatchlist(): string[] {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    if (!raw) return ['BTC', 'ETH', 'SOL', 'BNB'];
    return JSON.parse(raw);
  } catch {
    return ['BTC', 'ETH', 'SOL', 'BNB'];
  }
}

export function saveWatchlist(watchlist: string[]): void {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  } catch (e) {
    console.error('Failed to save watchlist', e);
  }
}

export function toggleWatchlistSymbol(symbol: string): string[] {
  const current = getWatchlist();
  const upper = symbol.toUpperCase();
  const exists = current.includes(upper);
  const updated = exists ? current.filter((s) => s !== upper) : [...current, upper];
  saveWatchlist(updated);
  return updated;
}

export function getPortfolio(): PortfolioHolding[] {
  try {
    const raw = localStorage.getItem(PORTFOLIO_KEY);
    if (!raw) {
      // Seed initial sample portfolio for research simulation
      const initial: PortfolioHolding[] = [
        {
          id: 'p-1',
          symbol: 'BTC',
          name: 'Bitcoin',
          amount: 0.45,
          buyPrice: 62400,
          buyDate: '2024-09-15',
          notes: 'DCA Accumulation position in HMM Bull Regime',
        },
        {
          id: 'p-2',
          symbol: 'ETH',
          name: 'Ethereum',
          amount: 4.2,
          buyPrice: 2850,
          buyDate: '2024-10-02',
          notes: 'Staking position research test',
        },
        {
          id: 'p-3',
          symbol: 'SOL',
          name: 'Solana',
          amount: 35,
          buyPrice: 145,
          buyDate: '2024-10-20',
          notes: 'High momentum allocation',
        },
      ];
      localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((h: any) => h && typeof h === 'object' && h.symbol)
      .map((h: any) => ({
        id: String(h.id || `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`),
        symbol: String(h.symbol).toUpperCase(),
        name: String(h.name || h.symbol),
        amount: typeof h.amount === 'number' && !isNaN(h.amount) ? h.amount : parseFloat(h.amount) || 0,
        buyPrice: typeof h.buyPrice === 'number' && !isNaN(h.buyPrice) ? h.buyPrice : parseFloat(h.buyPrice) || 0,
        buyDate: String(h.buyDate || new Date().toISOString().split('T')[0]),
        notes: String(h.notes || ''),
      }));
  } catch {
    return [];
  }
}

export function savePortfolio(holdings: PortfolioHolding[]): void {
  try {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(holdings));
  } catch (e) {
    console.error('Failed to save portfolio', e);
  }
}

export function addPortfolioHolding(holding: Omit<PortfolioHolding, 'id'>): PortfolioHolding[] {
  const current = getPortfolio();
  const newHolding: PortfolioHolding = {
    ...holding,
    id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  };
  const updated = [newHolding, ...current];
  savePortfolio(updated);
  return updated;
}

export function removePortfolioHolding(id: string): PortfolioHolding[] {
  const current = getPortfolio();
  const updated = current.filter((h) => h.id !== id);
  savePortfolio(updated);
  return updated;
}

export function getSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

/**
 * Universal file export utilities
 */
export function exportToCSV(filename: string, rows: Record<string, any>[]): void {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const val = row[header];
          if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val !== undefined && val !== null ? val : '';
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(filename: string, data: any): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
