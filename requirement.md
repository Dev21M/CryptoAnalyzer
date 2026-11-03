# CryptoAnalyzer — Requirements & Library Usage Guide (`requirement.md`)

Yeh document CryptoAnalyzer ke sabhi system requirements, installed libraries (dependencies), unka architectural purpose, aur actual code usage examples detail me explain karta hai taaki koi bhi developer project me aasani se kaam kar sake.

---

## 1. System & Runtime Requirements

| Requirement | Minimum Version | Recommended Version | Details |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.18.0` | `v20.x` ya `v22.x LTS` | Full-stack execution with ESM support |
| **Package Manager** | `npm v9.0.0+` | `npm v10+` ya `bun v1.2+` | Handles package installation and lockfiles |
| **Port Requirement** | `3000` | `3000` | Dev server and API run simultaneously on Port 3000 |
| **Operating System** | Any | Linux / macOS / Windows (WSL2) | Cross-platform container ready |

---

## 2. Quick Setup & Commands

```bash
# 1. Clone repository & install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env
# Edit .env file and insert your GEMINI_API_KEY if available (optional, fallback engine active)

# 3. Start development server (Full-stack: Express API + Vite Frontend)
npm run dev

# 4. Type check / lint
npm run lint

# 5. Build for production
npm run build

# 6. Start production server
npm run start
```

---

## 3. Environment Variables Reference (`.env`)

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional | `""` | Google Gemini API key for real-time market summaries, coin sentiment & AI chat. If empty or quota exceeded (HTTP 429), the built-in algorithmic financial fallback engine generates verified insights automatically. |
| `PORT` | Optional | `3000` | Port for Express server and Vite development middleware. |
| `HOST` | Optional | `0.0.0.0` | Network interface to bind the application server. |
| `NODE_ENV` | Optional | `development` | Set to `production` in container deployment. |

---

## 4. Complete Libraries & Dependencies Catalog

### Category A: AI & LLM Engine

#### 1. `@google/genai` (v2.4.0)
* **Purpose**: Official, modern TypeScript SDK for Google Gemini models.
* **Architecture Role**: Used exclusively server-side in `server.ts` to keep API keys secure and never expose secrets in frontend client code.
* **Models Used**:
  * Primary: `gemini-3.8-flash`
  * Rapid Fallback: `gemini-3.1-flash-lite`
* **How It Is Used**:
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Calling Gemini with automatic structured output
const response = await ai.models.generateContent({
  model: 'gemini-3.8-flash',
  contents: 'Analyze current Bitcoin market trend and risk level.',
});
console.log(response.text);
```

---

### Category B: Frontend Framework & Build Tools

#### 2. `react` (v19.0.1) & `react-dom` (v19.0.1)
* **Purpose**: Core UI component library.
* **Features**: Modern React 19 functional components, hooks (`useState`, `useEffect`, `useMemo`, `useCallback`), and concurrent rendering.
* **How It Is Used**:
```tsx
import React, { useState } from 'react';

export const WatchlistToggle: React.FC<{ coinId: string }> = ({ coinId }) => {
  const [active, setActive] = useState(false);
  return (
    <button onClick={() => setActive(!active)}>
      {active ? '★ In Watchlist' : '☆ Add to Watchlist'}
    </button>
  );
};
```

#### 3. `vite` (v8.3.0) & `@vitejs/plugin-react` (v6.1.1)
* **Purpose**: Next-generation lightning-fast frontend tooling and ESM dev server.
* **Configuration**: Located in `vite.config.ts`, seamlessly mounted onto Express in `server.ts` via `vite.middlewares`.

---

### Category C: State Management & Server-Data Fetching

#### 4. `@tanstack/react-query` (v5.105.3)
* **Purpose**: Async server state management, automated refetching, background data syncing, and caching.
* **Benefits**: Prevents redundant network calls to cryptocurrency data feeds and manages loading/error states cleanly.
* **How It Is Used**:
```tsx
import { useQuery } from '@tanstack/react-query';

// Fetching live crypto prices with automatic caching & 30s background refetch
export function useCryptoPrices() {
  return useQuery({
    queryKey: ['crypto-prices'],
    queryFn: async () => {
      const res = await fetch('/api/market/coins');
      if (!res.ok) throw new Error('Failed to fetch prices');
      return res.json();
    },
    staleTime: 30_000, // Data fresh for 30 seconds
    refetchInterval: 60_000, // Background poll every minute
  });
}
```

#### 5. `zustand` (v5.0.16)
* **Purpose**: Ultra-lightweight, boilerplate-free client state management for user preferences, portfolio assets, watchlists, and active filters.
* **How It Is Used**:
```typescript
import { create } from 'zustand';

interface AppStore {
  watchlist: string[];
  addToWatchlist: (id: string) => void;
  removeFromWatchlist: (id: string) => void;
  activeCurrency: 'USD' | 'EUR' | 'INR';
  setCurrency: (c: 'USD' | 'EUR' | 'INR') => void;
}

export const useStore = create<AppStore>((set) => ({
  watchlist: ['bitcoin', 'ethereum', 'solana'],
  addToWatchlist: (id) =>
    set((state) => ({ watchlist: [...new Set([...state.watchlist, id])] })),
  removeFromWatchlist: (id) =>
    set((state) => ({ watchlist: state.watchlist.filter((item) => item !== id) })),
  activeCurrency: 'USD',
  setCurrency: (currency) => set({ activeCurrency: currency }),
}));
```

---

### Category D: UI Styling & Animation

#### 6. `tailwindcss` (v4.3.3) & `@tailwindcss/vite` (v4.3.3)
* **Purpose**: CSS-first utility styling framework.
* **Setup**: Configured directly in `src/index.css` via `@import "tailwindcss";` and in `vite.config.ts` with the official `@tailwindcss/vite` plugin.
* **Design Pattern**: Dark modern theme with glassmorphism, precise borders, and responsive grid layouts.

#### 7. `clsx` (v2.1.1) & `tailwind-merge` (v3.7.0)
* **Purpose**: Dynamic className composition without specificity conflicts.
* **Utility Helper**: `cn(...)` in `src/components/common/` or inline.
* **How It Is Used**:
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Example: Safely overriding base padding or colors conditionally
const buttonClass = cn(
  "px-4 py-2 rounded-lg font-medium transition-colors",
  isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400",
  customClassName
);
```

#### 8. `lucide-react` (v0.546.0)
* **Purpose**: Modern, consistent SVG icon system.
* **How It Is Used**:
```tsx
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  BrainCircuit, 
  Search, 
  ArrowUpRight 
} from 'lucide-react';

export const MetricBadge = ({ change }: { change: number }) => (
  <div className="flex items-center gap-1 font-semibold">
    {change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-emerald-400" />
    ) : (
      <TrendingDown className="w-4 h-4 text-rose-400" />
    )}
    <span>{change.toFixed(2)}%</span>
  </div>
);
```

#### 9. `motion` (v12.23.24) *(formerly framer-motion)*
* **Purpose**: Declarative animations, page transitions, and smooth hover effects.
* **How It Is Used**:
```tsx
import { motion, AnimatePresence } from 'motion/react';

export const FadeInCard = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="bg-neutral-900 border border-neutral-800 rounded-xl p-5"
  >
    {children}
  </motion.div>
);
```

---

### Category E: Backend & Utility Infrastructure

#### 10. `express` (v4.21.2) & `@types/express` (v4.17.21)
* **Purpose**: Full-stack Node.js server.
* **Endpoints Provided**:
  * `GET /api/health`: Server health & uptime status.
  * `GET /api/market/coins`: Aggregated crypto market data with fallback resilience.
  * `GET /api/ai/market-summary`: AI macro crypto overview with multi-tier caching.
  * `POST /api/ai/coin-insights`: In-depth AI token analysis.
  * `POST /api/ai/ask`: Interactive crypto AI assistant.

#### 11. `dotenv` (v17.2.3)
* **Purpose**: Automatically injects `.env` configuration into `process.env`.
* **How It Is Used**: `import 'dotenv/config';` at the very top of `server.ts`.

#### 12. `tsx` (v4.21.0)
* **Purpose**: TypeScript execution engine that runs `server.ts` directly in development without needing a separate compile step.

#### 13. `typescript` (v7.0.2)
* **Purpose**: Static type checking and interface validation (`src/types/crypto.ts`).
* **Command**: `npm run lint` (runs `tsc --noEmit`).

---

## 5. Architectural Directory Layout

```
├── .env.example               # Template environment configuration
├── package.json               # All project dependencies & scripts
├── requirement.md             # This comprehensive library guide
├── server.ts                  # Express API server + Vite dev middleware
├── index.html                 # HTML entry point with meta tags & dark theme
├── vite.config.ts             # Vite + Tailwind v4 + React plugins
├── tsconfig.json              # TypeScript compilation rules
└── src/
    ├── main.tsx               # Client React DOM entry point
    ├── App.tsx                # Main application layout, routing & navigation
    ├── index.css              # Global styles with Tailwind CSS v4
    ├── types/
    │   └── crypto.ts          # Core TypeScript definitions for market data & AI
    ├── services/
    │   ├── aiService.ts       # Client API adapter with multi-tier caching
    │   ├── marketData.ts      # Price feeds, OHLCV data & ticker aggregator
    │   ├── store.ts           # Zustand global state (portfolio, watchlist)
    │   └── queryClient.ts     # TanStack Query Client configuration
    ├── components/
    │   ├── common/            # Reusable buttons, cards, modals, tables, badges
    │   ├── layout/            # Navbar, footer, and sidebar components
    │   └── charts/            # Financial charts and candlestick visuals
    └── pages/
        ├── HomePage.tsx       # Market dashboard, macro analysis & top movers
        ├── MarketsPage.tsx    # Complete coin listings with filtering & search
        ├── CoinAnalysisPage.tsx # Individual coin deep-dive with AI insights
        ├── PortfolioPage.tsx  # Track personal crypto assets & profits
        └── PredictionsPage.tsx# AI & quantitative market regime projections
```

---

## 6. Common Developer Recipes

### Recipe 1: Fetching AI Insights with Built-in Fallback
Client components should always call `aiService.ts` methods instead of directly fetching from `/api/ai/*` to benefit from the automatic 30-minute sessionStorage cache:
```typescript
import { getMarketSummary } from './services/aiService';

// Automatically returns cached response if fresh, or queries server
const summary = await getMarketSummary();
console.log(summary.macroOverview, summary.dominantTrend);
```

### Recipe 2: Adding a New Metric Badge with Lucide & Tailwind
```tsx
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from './utils';

export const RiskBadge: React.FC<{ level: 'Low' | 'Medium' | 'High' }> = ({ level }) => {
  const styles = {
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border', styles[level])}>
      <ShieldCheck className="w-3.5 h-3.5" />
      {level} Risk
    </span>
  );
};
```

---

## 7. Troubleshooting Common Issues

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Gemini 429 Rate Limit** | Free tier limit of 20 requests/day exceeded on Google Cloud | Already handled: The app automatically falls back to `gemini-3.1-flash-lite`, and if also exhausted, uses the built-in algorithmic financial calculation engine. No action required. |
| **Port 3000 In Use** | Another process is holding port 3000 | Run `kill $(lsof -t -i:3000)` or configure `PORT=3001` in `.env`. |
| **TypeScript Type Errors** | Mismatched API response types | Check `src/types/crypto.ts` and run `npm run lint` (`tsc --noEmit`) to verify. |
| **Tailwind classes not applying** | Incorrect Tailwind v4 syntax | Tailwind v4 uses standard `@import "tailwindcss";` in `src/index.css` without requiring a legacy `tailwind.config.js`. |
