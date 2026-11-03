# CryptoAnalyzer — Quantitative Research & ML Forecasting Lab

> **Academic Research Project Notice:** CryptoAnalyzer is an empirical machine learning research tool evaluating statistical significance (Wilcoxon signed-rank + Holm-Bonferroni correction) of price movement forecasts across financial time series. **This is strictly an academic research tool and does NOT constitute financial, investment, or trading advice.**

---

## 🔬 Research Overview

CryptoAnalyzer investigates whether deep recurrent architectures (LSTM, GRU) and temporal convolutional networks (CNN-1D) provide statistically significant predictive power over traditional baseline models (Naive Martingale random walk, ElasticNet Regularized Linear, Random Forest, and XGBoost) in high-frequency cryptocurrency spot markets.

### Key Research Dimensions

1. **7 Model Architectures**:
   - `Naive Baseline`: Martingale persistence benchmark ($E[r_{t+1}] = 0$)
   - `ElasticNet Linear`: L1/L2 penalized sparse linear model
   - `Random Forest`: 100-tree bootstrapped ensemble
   - `XGBoost`: Second-order gradient-boosted decision trees
   - `LSTM`: 2-layer Recurrent Neural Network with forget gates
   - `GRU`: Gated Recurrent Unit with reset & update gates
   - `CNN-1D`: Temporal Dilated Convolutional Network

2. **4 Hierarchical Feature Regimes (Ablation Study)**:
   - **Price Only (4 features)**: Open, High, Low, Close
   - **Price + Volume (5 features)**: OHLC + Realized Volume
   - **Technical Indicators (19 features)**: OHLCV + SMA20, EMA50, EMA200, Bollinger Bands (Upper, Middle, Lower), RSI(14), MACD (Line, Signal, Hist), ATR(14), OBV, Stochastic %K, Williams %R
   - **Full Academic Set (24 features)**: All above + continuous 4-state HMM regime posterior probabilities, Volatility Ratio, Order Flow Proxy, and Log-Return Momentum

3. **Continuous 4-State Gaussian Hidden Markov Model (HMM)**:
   - **Bull Trend**: High positive drift, low-to-moderate variance
   - **Bear Trend**: Negative drift, elevated volatility
   - **Sideways Consolidation**: Mean-reverting range, low variance compression
   - **High Volatility Shock**: Fat-tailed extreme variance, regime transition risk

4. **Statistical Significance Testing**:
   - Two-tailed Wilcoxon signed-rank test against the Naive Baseline
   - Step-down Holm-Bonferroni p-value corrections for multiple hypothesis testing ($α = 0.05$)

---

## 🚀 Features

- **Public Homepage**: Global market capitalization, 24h volume, Fear & Greed index, AI Opportunity Radar, and top gainers/losers.
- **Interactive Coin Analysis (`/coin/:symbol`)**:
  - High-performance Candlestick & Volume chart with crosshair, HUD bar, and timeframe selectors (`5m`, `15m`, `1h`, `4h`, `1d`, `1w`).
  - Overlays: SMA 20, EMA 50, Bollinger Bands, Classical Floor Pivot Points, and Fibonacci Retracements.
  - Sub-charts: Realized Volume, RSI (14) with 70/30 bands, MACD (12, 26, 9) histogram.
  - Real-time ML Forecast engine with confidence interval bounds and SHAP feature importance rankings.
- **Cryptocurrency Markets Matrix (`/markets`)**: Searchable list of 20+ top coins with sector and regime filters, sortable columns, and watchlist toggles.
- **Predictions Intelligence Lab (`/predictions`)**: Macro AI Opportunity Radar ranking directional conviction.
- **7-Model Benchmark Lab (`/models`)**: Full comparison table of RMSE, MAE, MAPE, Directional Accuracy %, Sharpe ratio, and Wilcoxon + Holm test metrics.
- **HMM Regimes Explorer (`/regimes`)**: Transition probability matrix heatmap, state emissions, and asset clustering.
- **Portfolio & Watchlist Tracker (`/portfolio`)**: `localStorage` position tracker with cost basis, unrealized P/L ($ and %), and custom research notes.
- **Data Export**: Export historical candles, indicators, and model predictions to CSV or JSON.
- **Theme & Accessibility**: WCAG AA compliant contrast, dark/light theme toggle, responsive design.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Data Providers**:
  - Primary: FCS Financial API
  - Fallback: Binance Spot Public REST API & WebSockets
  - Backup: CoinGecko API
- **Persistence**: `localStorage` (Watchlist, Portfolio holdings, Preferences)

---

## 📦 Getting Started

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Open browser
http://localhost:3000
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🐳 Docker Deployment

### Run with Docker Compose

```bash
docker-compose up --build
```

---

## 📜 Academic Disclaimer

This software is provided purely for academic evaluation of machine learning algorithms in time-series forecasting. **No claim is made regarding financial profitability, and outputs must not be used for live capital allocation or financial trading.**
