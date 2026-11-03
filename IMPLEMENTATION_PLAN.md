# CryptoAnalyzer — Machine Learning Crypto Prediction & Research Platform
## Comprehensive Technical Implementation Plan

> **Academic Research Platform Notice**: This application is an empirical research and educational tool evaluating deep learning and ensemble architectures on high-frequency cryptocurrency order flows and candlestick time series. It does NOT provide financial, investment, or trading advice.

---

## 1. System Architecture Overview

```
                      +-----------------------------------+
                      |   Live External Market Providers   |
                      |   1. Binance Spot WebSocket / API |
                      |   2. FCS API (Fallback 1)         |
                      |   3. CoinGecko Public (Fallback 2)|
                      +-----------------+-----------------+
                                        |
                                        v
                      +-----------------+-----------------+
                      |     Market Data Service Layer     |
                      |  - Exponential Moving Candlestick  |
                      |  - Real-time Price Poller (4s)    |
                      |  - Failover & Rate Limit Cache    |
                      +-----------------+-----------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
+----------------+----------------+          +----------------+----------------+
| Technical Indicator Engine      |          | Continuous Gaussian HMM Engine  |
| - SMA(20), EMA(50, 200)         |          | - 4 Market Regimes:             |
| - Bollinger Bands (20, 2)       |          |   1. Bull Trend                 |
| - RSI(14), MACD(12, 26, 9)      |          |   2. Bear Trend                 |
| - ATR(14), Floor Pivots, Fib    |          |   3. Sideways Accumulation      |
+----------------+----------------+          |   4. High Volatility Dispersion |
                 |                           +----------------+----------------+
                 |                                             |
                 +----------------------+----------------------+
                                        |
                                        v
                      +-----------------+-----------------+
                      |   7 Machine Learning Architectures |
                      |   - Baselines: Naive, Linear,      |
                      |                RandomForest,XGBoost|
                      |   - Deep Learning: LSTM, GRU, CNN1D|
                      |   - 4 Feature Spaces (4 to 24)    |
                      |   - Wilcoxon & Holm Testing       |
                      +-----------------+-----------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
+----------------+----------------+          +----------------+----------------+
| TanStack Query (Server State)   |          | Zustand Client State Store      |
| - Polling & caching queries     |          | - Active coin, timeframe        |
| - Provider health heartbeat     |          | - Horizon & model selection     |
| - Invalidation on interval      |          | - Watchlist, portfolio, theme   |
+----------------+----------------+          +----------------+----------------+
                 |                                             |
                 +----------------------+----------------------+
                                        |
                                        v
                      +-----------------+-----------------+
                      |     Presentation Layer (React 18) |
                      | - Tailwind CSS & shadcn Tokens    |
                      | - Interactive Candlestick Charts  |
                      | - Zero-Pill Design System         |
                      | - Hash Router v6 Routing Engine   |
                      +-----------------------------------+
```

---

## 2. Frontend Technology Stack

| Layer | Technology | Rationale & Configuration |
|---|---|---|
| **Framework** | React 19 / 18 + TypeScript 5 | Strict type validation, zero `any` policy for core data structures |
| **Build Tool** | Vite 8 + @tailwindcss/vite | Sub-second HMR, optimized production tree-shaking |
| **Styling** | Tailwind CSS v4 + Design Tokens | CSS custom properties, dark/light theme switching, zero layout shift |
| **Component Primitives** | shadcn/ui Inspired Design System | Accessible, keyboard-navigable, reusable primitives (Button, Input, Card, Table, Tabs, Modal, Toast, Tooltip, Badge, Skeleton, Avatar) |
| **Server State** | TanStack Query v5 (`@tanstack/react-query`) | Automatic background refetching, cache invalidation, rate-limit resilience |
| **Client State** | Zustand v5 (`zustand`) | Lightweight reactive state for filter controls, active horizons, and drawer toggles |
| **Data Visualization** | Custom Interactive Canvas / SVG + CSS | Candlestick engine with volume histogram, RSI, MACD sub-graphs, and crosshairs |
| **Persistence** | Browser `localStorage` | Client-side encrypted storage for Watchlist, Portfolio Holdings, and User Settings |
| **Icons** | Lucide React | Consistent, accessible icon set with semantic ARIA labels |

---

## 3. Design System & Token Architecture

### 3.1 CSS Variables & Palette
- **Primary / Accent**: Emerald (`--emerald-500: #10b981`, `--emerald-400: #34d399`) representing positive alpha and verified research convergence.
- **Negative / Risk**: Rose (`--rose-500: #f43f5e`, `--rose-400: #fb7185`) indicating downward returns or bearish regime states.
- **Background & Canvas**:
  - Dark: Deep Obsidian (`#020617`, `#0f172a`, `#1e293b`)
  - Light: Clean Clinical Slate (`#f8fafc`, `#ffffff`, `#f1f5f9`)
- **Typography**:
  - Numbers & Coordinates: `Geist Mono`, `ui-monospace`, `SFMono-Regular`
  - Display & Headings: `Plus Jakarta Sans`, `Inter`, system-ui

### 3.2 Component Catalog
1. **Core Elements**:
   - `Button`: Variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), sizes (`sm`, `md`, `lg`), loading spinner.
   - `Input`: Search inputs, numeric amounts, currency prefixes, clear buttons.
   - `Card`: Configurable padding, border highlights, header actions.
   - `Table`: Virtualized-ready data grid with sticky headers, sortable columns, and empty-state illustrations.
   - `Tabs`: Segmented controllers and border tabs with animated indicators.
   - `Modal`: Accessible dialogs with ESC key listener, focus trapping, and backdrop blur.
   - `Toast`: Priority alert container with auto-dismiss, action buttons (e.g. OTP Auto-fill).
   - `Tooltip`: Hover explanations for mathematical formulas and statistical p-values.
   - `Badge`: Strict status indicators adhering to zero-pill discipline (no redundant status pill soup).
   - `Skeleton`: Shimmering pulse placeholders for loading candle grids.
   - `Avatar` & `CoinAvatar`: Asset initials or high-resolution token glyphs.
2. **Data Display**:
   - `MetricCard`: KPI card with value, delta, subtext, and trend spark.
   - `PriceChange`: Formatted percentage with directional chevron and semantic coloring.
   - `RegimeBadge`: 4-state indicator with confidence percentage.
   - `ChartWrapper`: Container managing aspect ratio, timeframe selector, and fullscreen toggle.
3. **Layout Primitives**:
   - `Header`: Live ticker tape, global search, theme switch, auth trigger, and nav links.
   - `Sidebar` / `MobileNav`: Responsive drawer navigation.
   - `Container`: Centered viewport constraints (`max-w-7xl`).

---

## 4. Routing Architecture & Page Specifications

All routes are mounted via a reliable hash-history router (`#/route`) for 100% compatibility across static hosts and AI Studio iframes:

| Route Path | Page Component | Key Functionality |
|---|---|---|
| `/` | `HomePage` | Hero with instant coin search, Macro Market intelligence KPIs, Top Gainers/Losers with interactive pagination, and AI Opportunity Radar with conviction metrics. |
| `/markets` | `MarketsPage` | Complete 20+ cryptocurrency directory, search by name/symbol, category filters, column sorting, and 1-click watchlist toggles. |
| `/coin/:symbol` | `CoinAnalysisPage` | Live Binance spot price feed, candlestick chart (5m–1w), indicators (SMA, EMA, BBands, RSI, MACD, Pivots), HMM regime, and 7 ML model forecast panel. |
| `/predictions` | `PredictionsPage` | Cross-asset machine learning intelligence lab, horizon selector (5m, 15m, 1h, 4h, 1d), and expected return distributions. |
| `/models` | `ModelsLabPage` | Benchmark comparison table: RMSE, MAE, Directional Accuracy %, Sharpe Ratio, Wilcoxon W, and Holm-Bonferroni p-values. |
| `/regimes` | `RegimesPage` | 4-state Hidden Markov Model breakdown, Gaussian transition matrix heatmap, and distribution of assets across regimes. |
| `/watchlist` | `WatchlistPage` / Tab | High-conviction monitoring table with real-time price updates and quick removal. |
| `/portfolio` | `PortfolioPage` | LocalStorage portfolio tracker, simulated position entry, unrealized P/L calculations, and JSON/CSV export. |
| `/settings` | `SettingsPage` | Theme toggle (Dark/Light), data provider preference (Auto, Binance, FCS), refresh intervals, and research defaults. |
| `/login` | `LoginPage` / `AuthModal` | Email authentication, real-time 6-digit OTP dispatch, verification countdown, auto-fill, and session persistence. |

---

## 5. Machine Learning & Statistical Engine Specification

### 5.1 7 Evaluated Model Architectures
1. **Naive Random Walk (Baseline)**: $\hat{P}_{t+h} = P_t$
2. **ElasticNet Linear Regression**: $L_1$ and $L_2$ regularized linear mapping of standardized returns.
3. **Random Forest Regressor**: 100 estimators, bagging variance reduction across technical features.
4. **XGBoost (Gradient Boosted Trees)**: Sequential tree boosting with depth-limiting and shrinkage ($\eta = 0.05$).
5. **LSTM (Long Short-Term Memory)**: 2-layer recurrent network with memory cells for temporal persistence.
6. **GRU (Gated Recurrent Unit)**: Reduced parameter recurrent network balancing speed and sequential memory.
7. **CNN-1D (Temporal Convolutional Network)**: 1D convolutions with causal dilation for multi-scale pattern extraction.

### 5.2 4 Experimental Feature Spaces
- **Set 1: Price Only (4 features)**: Open, High, Low, Close relative returns.
- **Set 2: Price + Volume (5 features)**: Adds Volume-to-20MA ratio and volume volatility.
- **Set 3: Price + Volume + Technical (19 features)**: Adds RSI(14), MACD, Bollinger Bands, ATR, SMA ratios.
- **Set 4: Full Feature Space (24 features)**: Adds HMM regime state posterior probabilities and order flow imbalance proxy.

### 5.3 Statistical Significance
- Non-parametric **Wilcoxon signed-rank test** comparing each deep learning model against baseline.
- **Holm-Bonferroni step-down correction** to strictly control Family-Wise Error Rate (FWER) across multiple hypotheses ($\alpha = 0.05$).

---

## 6. Real-Time Data Pipeline & Live Price Anchor

To eliminate price discrepancies between live quotes and ML predictions:
1. Direct WebSocket and REST ticker polling from Binance Spot (`/api/v3/ticker/price`).
2. The active candle's close price is updated to match the real-time spot price in memory.
3. ML predictions strictly anchor to this verified spot price: $\text{Target} = P_{\text{spot}} \times (1 + \Delta_{\%})$.
4. Fallback generation generates candles *backwards* from the spot price to guarantee that `candles[last].close === spotPrice`.

---

## 7. Deployment & Verification

- **Dockerization**: Multi-stage `Dockerfile` using Node.js alpine and lightweight web server.
- **Compose**: `docker-compose.yml` for unified local execution.
- **Verification Commands**:
  - `npm run lint` (`tsc --noEmit`): Confirms zero type errors.
  - `npm run build`: Confirms production bundle builds cleanly.
