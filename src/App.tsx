import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './services/queryClient';
import { AuthModal } from './components/auth/AuthModal';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { Modal } from './components/common/Modal';
import { QuickSearchModal } from './components/common/QuickSearchModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

// Pages
import { AiIntelligencePage } from './pages/AiIntelligencePage';
import { AlertsPage } from './pages/AlertsPage';
import { CoinAnalysisPage } from './pages/CoinAnalysisPage';
import { ComparePage } from './pages/ComparePage';
import { DcaCalculatorPage } from './pages/DcaCalculatorPage';
import { ForecastPage } from './pages/ForecastPage';
import { HeatmapPage } from './pages/HeatmapPage';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { LoginPage } from './pages/LoginPage';
import { MarketsPage } from './pages/MarketsPage';
import { ModelsLabPage } from './pages/ModelsLabPage';
import { NewsPage } from './pages/NewsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProfitCalculatorPage } from './pages/ProfitCalculatorPage';
import { RegimesPage } from './pages/RegimesPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { SentimentPage } from './pages/SentimentPage';
import { SettingsPage } from './pages/SettingsPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { WatchlistPage } from './pages/WatchlistPage';

// Services
import { evaluateAlerts, getAlerts } from './services/alertsService';
import { getCurrentUser, logoutUser, User } from './services/auth';
import { fetchAllCoinsSummary, getProviderStatus } from './services/marketData';
import { getPortfolioHoldings } from './services/portfolioService';
import {
  DEFAULT_SETTINGS,
  getSettings,
  getWatchlist,
  saveSettings,
  toggleWatchlistSymbol,
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

  // Navigation & Drawer states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [activeAlertsCount, setActiveAlertsCount] = useState<number>(() => {
    return getAlerts().filter((a) => a.active && !a.triggered).length;
  });

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

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial and periodic market data load + Price Alert evaluation
  const loadMarketData = async () => {
    try {
      const summaries = await fetchAllCoinsSummary();
      setCoins(summaries);
      setProviderStatus(getProviderStatus());

      // Price alert check
      if (summaries && summaries.length > 0) {
        const priceMap: Record<string, number> = {};
        const changeMap: Record<string, number> = {};
        summaries.forEach((c) => {
          priceMap[c.symbol.toUpperCase()] = c.price;
          changeMap[c.symbol.toUpperCase()] = c.change24h;
        });

        const triggered = evaluateAlerts(priceMap, changeMap);
        if (triggered.length > 0) {
          triggered.forEach((t) => {
            addToast(
              '🎯 Price Alert Triggered',
              `${t.symbol} has hit your target of $${t.targetPrice.toLocaleString()} (${t.condition}).`,
              'info'
            );
          });
        }
        setActiveAlertsCount(getAlerts().filter((a) => a.active && !a.triggered).length);
      }
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

  const handleSelectCurrency = (curr: 'USD' | 'EUR' | 'GBP' | 'INR') => {
    const next: UserSettings = { ...settings, currency: curr };
    setSettings(next);
    saveSettings(next);
    addToast('Currency Base Updated', `Base quotation denomination set to ${curr}.`, 'info');
  };

  const handleToggleWatchlist = (symbol: string) => {
    const updated = toggleWatchlistSymbol(symbol);
    setWatchlist(updated);
    const added = updated.includes(symbol.toUpperCase());
    addToast(
      added ? 'Added to Watchlist' : 'Removed from Watchlist',
      `${symbol} has been ${added ? 'added to' : 'removed from'} your tracked portfolio watchlist.`,
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
    const route = currentRoute.toLowerCase();

    // 1. MAIN
    if (route === '/' || route === '/dashboard') {
      return (
        <HomePage
          coins={coins}
          onNavigate={navigateTo}
          onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
        />
      );
    }

    if (route === '/markets') {
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

    if (route === '/watchlist') {
      return (
        <WatchlistPage
          coins={coins}
          watchlist={watchlist}
          onToggleWatchlist={handleToggleWatchlist}
          onNavigate={navigateTo}
        />
      );
    }

    // 2. ANALYSIS
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

    if (route === '/sentiment') {
      return <SentimentPage coins={coins} onNavigate={navigateTo} />;
    }

    if (route === '/ai-intelligence' || route === '/ai') {
      return <AiIntelligencePage coins={coins} onNavigate={navigateTo} />;
    }

    if (route === '/forecast') {
      return <ForecastPage coins={coins} onNavigate={navigateTo} />;
    }

    if (route === '/risk-analysis' || route === '/risk') {
      return <RiskAnalysisPage coins={coins} onNavigate={navigateTo} />;
    }

    // 3. MY FINANCE
    if (route === '/portfolio') {
      return (
        <PortfolioPage
          coins={coins}
          onNavigate={navigateTo}
          onShowToast={(title, msg, type) => addToast(title, msg, type)}
        />
      );
    }

    if (route === '/transactions') {
      return (
        <TransactionsPage
          coins={coins}
          onNavigate={navigateTo}
          onShowToast={(title, msg, type) => addToast(title, msg, type)}
        />
      );
    }

    if (route === '/alerts') {
      return (
        <AlertsPage
          coins={coins}
          onNavigate={navigateTo}
          onShowToast={(title, msg, type) => addToast(title, msg, type)}
        />
      );
    }

    // 4. DISCOVER
    if (route === '/news') {
      return <NewsPage onNavigate={navigateTo} />;
    }

    if (route === '/learn') {
      return <LearnPage onNavigate={navigateTo} />;
    }

    if (route === '/heatmap') {
      return <HeatmapPage coins={coins} onNavigate={navigateTo} />;
    }

    // 5. TOOLS
    if (route === '/tools/profit-calculator' || route === '/profit-calculator') {
      return <ProfitCalculatorPage coins={coins} />;
    }

    if (route === '/tools/dca-calculator' || route === '/dca-calculator') {
      return <DcaCalculatorPage coins={coins} />;
    }

    if (route === '/tools/compare' || route === '/compare') {
      return <ComparePage coins={coins} onNavigate={navigateTo} />;
    }

    if (route === '/tools/simulator' || route === '/simulator') {
      return (
        <SimulatorPage
          coins={coins}
          onShowToast={(title, msg, type) => addToast(title, msg, type)}
        />
      );
    }

    // 6. PREFERENCES & AUTH
    if (route === '/settings') {
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

    if (route === '/profile') {
      return (
        <ProfilePage
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenAuth={handleOpenAuth}
          onShowToast={(title, msg, type) => addToast(title, msg, type)}
        />
      );
    }

    if (route === '/login') {
      return (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
          onNotifyOtp={handleNotifyOtp}
        />
      );
    }

    // Legacy Power Features (Preserved in code for advanced users)
    if (route === '/predictions') {
      return (
        <PredictionsPage
          coins={coins}
          onNavigate={navigateTo}
          onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
        />
      );
    }

    if (route === '/models') {
      return (
        <ModelsLabPage
          onNavigate={navigateTo}
          onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
        />
      );
    }

    if (route === '/regimes') {
      return <RegimesPage coins={coins} onNavigate={navigateTo} />;
    }

    // Fallback
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

        {/* Responsive Drawer Sidebar Navigation */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          watchlistCount={watchlist.length}
          alertsCount={activeAlertsCount}
          portfolioCount={getPortfolioHoldings().length}
        />

        {/* Global Instant Search Modal (Cmd+K / Ctrl+K) */}
        <QuickSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          coins={coins}
          onNavigate={navigateTo}
        />

        {/* Main App Navigation Header */}
        <Header
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          coins={coins}
          providerStatus={providerStatus}
          theme={settings.theme}
          onToggleTheme={handleToggleTheme}
          onOpenDisclaimer={() => setIsDisclaimerModalOpen(false)}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          currency={settings.currency}
          onSelectCurrency={handleSelectCurrency}
          alertsCount={activeAlertsCount}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {isInitialLoading && coins.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
              <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              <div className="text-sm font-mono text-slate-400">
                Connecting to Spot Markets & AI Intelligence Feed...
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
          title="CryptoAnalyzer — Platform Methodology & Notice"
          subtitle="Empirical Machine Learning in Cryptocurrency Financial Time Series"
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-200 text-xs">
              <strong>Non-Financial Advice Disclaimer:</strong> CryptoAnalyzer is an educational and cryptocurrency intelligence research platform designed for market exploration, trend evaluation, and empirical comparison of predictive models. Under no circumstances should any prediction, regime label, or AI insight be construed as investment, financial, or trading advice.
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-1">
                AI Intelligence & Price Forecasting
              </h4>
              <p className="text-xs text-slate-400">
                The platform integrates real-time Gemini 3.8 Flash intelligence with quantitative indicators (RSI, MACD, Bollinger Bands, ATR) and mathematical regression channels to provide clear, actionable summaries for both beginner and experienced investors.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-1">
                Real-Time Spot Feeds & Transparency
              </h4>
              <p className="text-xs text-slate-400">
                All prices, volumes, order book dynamics, and historical candles are synced from institutional spot APIs (Binance Spot REST & WebSocket endpoints, CoinGecko, and Alternative.me Fear & Greed).
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
