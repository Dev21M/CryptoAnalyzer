# CryptoAnalyzer — Professional AI-Powered Cryptocurrency Intelligence Platform

> **"One Platform. Complete Crypto Intelligence."**
> 
> *A commercial-grade cryptocurrency intelligence SaaS platform designed for beginners, intermediate investors, and experienced traders. Built on high-performance React 19, an Express proxy backend, Google Gemini 3.8 Flash AI, institutional Binance Spot & CoinGecko feeds, and multi-model quantitative time series analysis.*

---

## 🏛️ Architecture Overview

CryptoAnalyzer transforms raw cryptocurrency market dynamics into clear, actionable intelligence without technical clutter, while preserving advanced mathematical indicators for power users.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CRYPTOANALYZER CLIENT                         │
│   (React 19 SPA • Tailwind CSS • Lucide Icons • Web Audio API)         │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ /api/*
┌────────────────────────────────────▼───────────────────────────────────┐
│                       FULL-STACK EXPRESS ENGINE                        │
│  • In-Memory Feed Cache (15s TTL)      • Alternative.me Fear & Greed   │
│  • Binance Spot REST & Klines Proxy    • Verified Crypto RSS Parser    │
│  • CoinGecko Global Metrics Proxy      • Server-side Google Gemini 3.8 │
└──────────────┬─────────────────────┬───────────────────┬───────────────┘
               │                     │                   │
               ▼                     ▼                   ▼
    ┌────────────────────┐ ┌───────────────────┐ ┌───────────────┐
    │ Binance Spot REST  │ │ Alternative.me /  │ │ Google Gemini │
    │ & Kline Hist Data  │ │ CoinGecko APIs    │ │ 3.8 Flash AI  │
    └────────────────────┘ └───────────────────┘ └───────────────┘
```

---

## 🧭 Navigation Structure

The platform organizes 19 production-ready views into 6 intuitive domains:

### 1. MAIN
- **Dashboard (`/`)**: Macro global market cap, 24h trading volume, BTC dominance, Alternative.me Fear & Greed index, dynamic Gemini 3.8 Market Digest, top gainers/losers, and trending coins.
- **Markets (`/markets`)**: Searchable, sortable matrix across 20+ cryptocurrency spot pairs with sector filters (Layer 1, DeFi, AI, Layer 2, Meme, Infra) and watchlist quick toggles.
- **Watchlist (`/watchlist`)**: Dedicated prioritized tracking hub with 24h metrics, high/low ranges, and one-click removal.

### 2. ANALYSIS
- **Coin Analysis (`/coin/:symbol`)**:
  - High-performance Candlestick & Volume chart with crosshair and timeframes (`5m`, `15m`, `1h`, `4h`, `1d`, `1w`).
  - Technical Overlays: SMA 20, EMA 50, Bollinger Bands, Classical Floor Pivot Points, and Fibonacci Retracements.
  - Sub-charts: Realized Volume, RSI (14) with overbought/oversold levels, MACD (12, 26, 9) histogram.
  - Plain-Language Indicator Explanations for beginners.
  - Gemini AI Assistant Tab: Bullish/bearish indicators, momentum, volatility, support/resistance, and risk rating.
- **Market Sentiment (`/sentiment`)**: Real-time Fear & Greed index visual gauge, Bitcoin vs Altcoin dominance breakdown, market breadth advance/decline ratio.
- **AI Intelligence (`/ai-intelligence`)**: Interactive market assistant powered by Gemini 3.8 Flash with live spot context, daily market digest, and coin query inspector.
- **Price Forecast (`/forecast`)**: Multi-horizon (`24h`, `7d`, `30d`) regression channels with confidence intervals and plain-language trend descriptions.
- **Risk Analysis (`/risk-analysis`)**: Transparent risk matrix evaluating volatility, liquidity, max drawdown, and market-cap stability with a composite 1–100 risk score.

### 3. MY FINANCE
- **My Portfolio (`/portfolio`)**: Real-time position valuation, cost basis tracking, unrealized P/L ($ and %), asset allocation bar, and trade entry modal.
- **Transactions (`/transactions`)**: Audit-grade trade ledger with multi-buy/sell record tracking, transaction editing/deletion, and CSV export.
- **Price Alerts (`/alerts`)**: Real-time price threshold monitors (Above, Below, % Gain, % Drop) with synthesized Web Audio chimes (zero external audio file dependencies).

### 4. DISCOVER
- **Crypto News (`/news`)**: Curated live RSS feed from Cointelegraph and CoinDesk with sentiment tagging and 1-click Gemini AI key takeaway summaries.
- **Learn Crypto (`/learn`)**: Beginner-to-advanced academy featuring 5 interactive lessons, a searchable 12+ term glossary with English and Hindi translations, and an interactive knowledge quiz.
- **Market Heatmap (`/heatmap`)**: Treemap visualization sizing assets by market capitalization and coloring them by 24h price performance.

### 5. TOOLS
- **Profit Calculator (`/tools/profit-calculator`)**: Interactive trade P/L and ROI calculator factoring in exchange fee overhead.
- **DCA Calculator (`/tools/dca-calculator`)**: Dollar-cost averaging recurring simulation vs. lump-sum comparison.
- **Coin Comparison (`/tools/compare`)**: Side-by-side comparison table of 2–5 cryptocurrencies across price, 24h/7d change, volume, market cap, and risk tier.
- **Trading Simulator (`/tools/simulator`)**: Risk-free paper trading account with $10,000 USD virtual balance, real-time market buy/sell execution, position accounting, and full trade log.

### 6. PREFERENCES & SECURITY
- **Settings (`/settings`)**: Theme switcher (Deep Obsidian Dark / High-Contrast Light), base quotation currency (USD, EUR, GBP, INR), polling interval selection, sound alert toggle, and advanced mode switch.
- **User Profile (`/profile`)**: Session overview, risk tolerance profile selector, and simulated credential management.
- **Authentication (`/login`)**: Secure researcher authentication with email OTP verification code flow.

---

## ⚡ Server-Side Endpoints (`/api/*`)

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | System status and Gemini configuration check |
| `/api/market/global` | GET | Global market cap, volume, BTC/ETH dominance, Fear & Greed index |
| `/api/market/tickers` | GET | Cached (15s) proxy for 24hr Binance spot ticker statistics |
| `/api/market/candles/:symbol` | GET | Historical OHLCV candle klines proxy (`5m`, `15m`, `1h`, `4h`, `1d`) |
| `/api/news` | GET | Live cryptocurrency RSS feed parsed with sentiment metadata |
| `/api/ai/ask` | POST | Grounded Gemini 3.8 Flash cryptocurrency assistant |
| `/api/ai/coin-insights` | POST | Structured JSON coin insights (bullish/bearish signals, support/resistance, risk) |
| `/api/ai/market-summary` | POST | Macro market digest generated from live market parameters |
| `/api/ai/summarize-news` | POST | 2-sentence key financial takeaway generator for articles |

---

## 💻 Quick Start & Development

### 1. Prerequisites
- Node.js 18+
- npm

### 2. Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Populate your environment variables:
```env
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Installation
```bash
npm install
```

### 4. Running the Development Server
```bash
npm run dev
```
The application will be live at `http://localhost:3000`.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🛡️ Security & Zero-Leak Standards

- **Server-Side API Proxying**: No third-party API keys or `GEMINI_API_KEY` are exposed to the browser client.
- **Web Audio Synthesis**: Alert chimes are synthesized dynamically via the Web Audio API without downloading external audio files or relying on cross-origin audio CDNs.
- **Resilient Fallback Hierarchy**: Automatic 3-tier data failover (FCS Financial → Binance Spot → CoinGecko).
