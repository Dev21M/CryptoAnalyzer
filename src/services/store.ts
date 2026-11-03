import { create } from 'zustand';
import {
  CoinSummary,
  FeatureSet,
  MLArchitecture,
  PredictionHorizon,
  Timeframe,
  UserSettings,
} from '../types/crypto';
import { getSettings, saveSettings } from './storage';

interface AppState {
  // Navigation & Active Asset
  activeSymbol: string;
  setActiveSymbol: (symbol: string) => void;

  // Global Timeframes & Horizons
  activeTimeframe: Timeframe;
  setActiveTimeframe: (tf: Timeframe) => void;
  activeHorizon: PredictionHorizon;
  setActiveHorizon: (h: PredictionHorizon) => void;

  // ML Experiment Controls
  activeArchitecture: MLArchitecture;
  setActiveArchitecture: (arch: MLArchitecture) => void;
  activeFeatureSet: FeatureSet;
  setActiveFeatureSet: (fSet: FeatureSet) => void;

  // Search & Filters
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedRegimeFilter: string;
  setSelectedRegimeFilter: (regime: string) => void;

  // UI Drawer / Modal states
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isDisclaimerOpen: boolean;
  setIsDisclaimerOpen: (open: boolean) => void;

  // User Settings Sync
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeSymbol: 'BTC',
  setActiveSymbol: (symbol) => set({ activeSymbol: symbol.toUpperCase() }),

  activeTimeframe: '1h',
  setActiveTimeframe: (tf) => set({ activeTimeframe: tf }),

  activeHorizon: '1h',
  setActiveHorizon: (h) => set({ activeHorizon: h }),

  activeArchitecture: 'lstm',
  setActiveArchitecture: (arch) => set({ activeArchitecture: arch }),

  activeFeatureSet: 'full',
  setActiveFeatureSet: (fSet) => set({ activeFeatureSet: fSet }),

  globalSearchQuery: '',
  setGlobalSearchQuery: (q) => set({ globalSearchQuery: q }),

  selectedCategory: 'All',
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),

  selectedRegimeFilter: 'All',
  setSelectedRegimeFilter: (regime) => set({ selectedRegimeFilter: regime }),

  isSearchOpen: false,
  setIsSearchOpen: (open) => set({ isSearchOpen: open }),

  isDisclaimerOpen: false,
  setIsDisclaimerOpen: (open) => set({ isDisclaimerOpen: open }),

  settings: getSettings(),
  updateSettings: (partial) => {
    const current = get().settings;
    const updated = { ...current, ...partial };
    saveSettings(updated);
    set({ settings: updated });
  },

  toggleTheme: () => {
    const currentTheme = get().settings.theme;
    const nextTheme: 'dark' | 'light' = currentTheme === 'dark' ? 'light' : 'dark';
    const updated = { ...get().settings, theme: nextTheme };
    saveSettings(updated);
    set({ settings: updated });
  },
}));
