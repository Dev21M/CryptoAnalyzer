import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './services/queryClient';
import { AuthModal } from './components/auth/AuthModal';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { Modal } from './components/common/Modal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { CoinAnalysisPage } from './pages/CoinAnalysisPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MarketsPage } from './pages/MarketsPage';
import { ModelsLabPage } from './pages/ModelsLabPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { RegimesPage } from './pages/RegimesPage';
import { SettingsPage } from './pages/SettingsPage';
import { getCurrentUser, logoutUser, User } from './services/auth';
import { fetchAllCoinsSummary, getProviderStatus } from './services/marketData';
import {
  DEFAULT_SETTINGS,
  getSettings,
  getWatchlist,
  saveSettings,
} from './services/storage';
import { CoinSummary, DataProviderStatus, UserSettings } from './types/crypto';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/';
  });

  const [coins, setCoins] = useState<CoinSummary[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>(getWatchlist());
  const [settings, setSettings] = useState<UserSettings>(getSettings());
  const [providerStatus, setProviderStatus] = useState<DataProviderStatus>(getProviderStatus());
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Helper
  const addToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'otp' | 'error' = 'info',
    code?: string,
    actionLabel?: string,
    onAction?: () => void
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = {
      id,
      type,
      title,
      message,
      code,
      actionLabel,
      onAction,
    };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 6 seconds for regular toasts, 12 seconds for OTP
    const duration = type === 'otp' ? 12000 : 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync theme with DOM root class
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Handle browser popstate / hashchange for smooth client-side routing
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setCurrentRoute(hash || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleLocationChange);
    return () => window.removeEventListener('hashchange', handleLocationChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial and periodic market data load
  const loadMarketData = async () => {
    try {
      const summaries = await fetchAllCoinsSummary();
      setCoins(summaries);
      setProviderStatus(getProviderStatus());
    } catch (e) {
      console.error('Failed to load coins summary', e);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    loadMarketData();
    const intervalMs = (settings.refreshIntervalSec || 15) * 1000;
    const intervalId = setInterval(loadMarketData, intervalMs);
    return () => clearInterval(intervalId);
  }, [settings.refreshIntervalSec]);

  // Unified 1-Click Real-time Theme Toggle
  const handleToggleTheme = () => {
    const nextTheme: 'dark' | 'light' = settings.theme === 'dark' ? 'light' : 'dark';
    const next: UserSettings = { ...settings, theme: nextTheme };
    setSettings(next);
    saveSettings(next);
    addToast(
      'Appearance Mode Switched',
      `Interface switched to ${nextTheme === 'dark' ? 'Deep Obsidian Dark' : 'High-Contrast Light'} mode.`,
      'info'
    );
  };

  // Auth Handlers
  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleNotifyOtp = (otp: string, email: string) => {
    addToast(
      '🔐 Real-Time Verification OTP Dispatched',
      `A single-use verification PIN has been generated for ${email}. Valid for 5 minutes.`,
      'otp',
      otp,
      'Click to Auto-fill',
      () => {
        // Trigger auto fill
        const btn = document.querySelector('button[title="Click to auto-fill generated OTP"]') as HTMLButtonElement;
        if (btn) btn.click();
      }
    );
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    addToast(
      'Session Verified & Authenticated',
      `Welcome, ${user.name}! Connected as ${user.role} (${user.institution}).`,
      'success'
    );
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    addToast(
      'Signed Out',
      'Research session cleared from browser localStorage.',
      'info'
    );
  };

  // Route Parser
  const renderCurrentPage = () => {
    if (currentRoute === '/') {
      return (
        <HomePage
          coins={coins}
          onNavigate={navigateTo}
          onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
        />
      );
    }

    if (currentRoute === '/markets') {
      return (
        <MarketsPage
          coins={coins}
          watchlist={watchlist}
          onWatchlistChange={setWatchlist}
          onNavigate={navigateTo}
          onShowToast={(title, msg, type) => addToast(title, msg, type)}
        />
      );
    }

    if (currentRoute.startsWith('/coin/')) {
      const symbol = currentRoute.replace('/coin/', '').toUpperCase();
      const coin = coins.find((c) => c.symbol.toUpperCase() === symbol);
      return (
        <CoinAnalysisPage
          symbol={symbol}
          coin={coin}
          watchlist={watchlist}
          onWatchlistChange={setWatchlist}
          onNavigate={navigateTo}
          onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
          onShowToast={(title, msg, type) => addToast(title, msg, type)}
        />
      );
    }

    if (currentRoute === '/predictions') {
      return (
        <PredictionsPage
          coins={coins}
          onNavigate={navigateTo}
          onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
        />
      );
    }

    if (currentRoute === '/models') {
      return (
        <ModelsLabPage
          onNavigate={navigateTo}
          onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
        />
      );
    }

    if (currentRoute === '/regimes') {
      return <RegimesPage coins={coins} onNavigate={navigateTo} />;
    }

    if (currentRoute === '/portfolio') {
      return (
        <PortfolioPage
          coins={coins}
          watchlist={watchlist}
          onWatchlistChange={setWatchlist}
          onNavigate={navigateTo}
          onShowToast={(title, msg, type) => addToast(title, msg, type)}
          initialTab="holdings"
        />
      );
    }

    if (currentRoute === '/watchlist') {
      return (
        <PortfolioPage
          coins={coins}
          watchlist={watchlist}
          onWatchlistChange={setWatchlist}
          onNavigate={navigateTo}
          onShowToast={(title, msg, type) => addToast(title, msg, type)}
          initialTab="watchlist"
        />
      );
    }

    if (currentRoute === '/login') {
      return (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
          onNotifyOtp={handleNotifyOtp}
        />
      );
    }

    if (currentRoute === '/settings') {
      return (
        <SettingsPage
          settings={settings}
          onSettingsChange={setSettings}
          providerStatus={providerStatus}
          onRefreshFeed={loadMarketData}
          onShowToast={(title, msg, type) => addToast(title, msg, type)}
        />
      );
    }

    // Default fallback
    return (
      <HomePage
        coins={coins}
        onNavigate={navigateTo}
        onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
      />
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Academic Disclaimer Banner */}
      {settings.showDisclaimerBanner && (
        <DisclaimerBanner dismissible={true} />
      )}

      {/* Main App Navigation Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        coins={coins}
        providerStatus={providerStatus}
        theme={settings.theme}
        onToggleTheme={handleToggleTheme}
        onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isInitialLoading && coins.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <div className="text-sm font-mono text-slate-400">
              Connecting to Binance Spot & FCS Feed...
            </div>
          </div>
        ) : (
          renderCurrentPage()
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
      />

      {/* Global Academic Disclaimer Modal */}
      <Modal
        isOpen={isDisclaimerModalOpen}
        onClose={() => setIsDisclaimerModalOpen(false)}
        title="CryptoAnalyzer — Academic Research Notice"
        subtitle="Empirical Machine Learning in Cryptocurrency Financial Time Series"
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-200 text-xs">
            <strong>Non-Financial Advice Disclaimer:</strong> CryptoAnalyzer is an academic research platform designed solely for scientific study, algorithmic evaluation, and empirical comparison of machine learning models. Under no circumstances should any prediction, regime label, or metric be construed as investment, financial, or trading advice.
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">
              7 Machine Learning Architectures
            </h4>
            <p className="text-xs text-slate-400">
              The project evaluates 4 baselines (Naive Persistence Random Walk, Ridge/ElasticNet Linear, Random Forest 100 Trees, XGBoost Gradient Boosting) against 3 Deep Learning networks (2-Layer LSTM with forget gates, Gated Recurrent Unit [GRU], and 1D Temporal Dilated Convolutional Networks).
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">
              4 Hierarchical Feature Sets
            </h4>
            <p className="text-xs text-slate-400">
              Ablation testing spans Price Only (OHLC, 4 features), Price + Volume (OHLCV, 5 features), Technical Indicators (19 features), and the Full Feature Set (24 features, including continuous Gaussian HMM state probabilities, volatility ratios, and return momentum).
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">
              Hidden Markov Model (HMM) Regimes
            </h4>
            <p className="text-xs text-slate-400">
              A 4-state continuous HMM partitions the state space into Bull Trend, Bear Trend, Sideways Consolidation, and High Volatility Shock to mitigate non-stationarity in financial series.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1">
              Hypothesis Testing (Wilcoxon + Holm)
            </h4>
            <p className="text-xs text-slate-400">
              All out-of-sample directional forecasts are rigorously tested against the naive random-walk baseline using Wilcoxon signed-rank tests with Holm-Bonferroni step-down adjustments to ensure statistical significance at α = 0.05.
            </p>
          </div>
        </div>
      </Modal>

      {/* Auth Modal (Email + OTP Verification) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={handleLoginSuccess}
        onNotifyOtp={handleNotifyOtp}
      />

        {/* Global Real-time Toast Notifications */}
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    </QueryClientProvider>
  );
}
