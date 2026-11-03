import React, { useState } from 'react';
import { AlertTriangle, BookOpen, ChevronRight, X } from 'lucide-react';
import { Modal } from './Modal';

interface DisclaimerBannerProps {
  dismissible?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ dismissible = true }) => {
  const [dismissed, setDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div className="bg-amber-950/40 border-b border-amber-800/40 px-4 py-2.5 text-xs text-amber-200/90 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 max-w-5xl">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="font-semibold text-amber-300">Academic Research Project Notice:</strong>{' '}
            CryptoAnalyzer is an empirical machine learning research tool evaluating statistical significance (Wilcoxon + Holm test) of price movement forecasts. It is strictly for academic and analytical demonstration and does <strong className="text-amber-100 underline decoration-amber-400">NOT constitute financial, investment, or trading advice</strong>.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 text-amber-300 hover:text-white underline font-medium transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Research Methodology</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          {dismissible && (
            <button
              onClick={() => setDismissed(true)}
              className="text-amber-400/80 hover:text-amber-200 p-1 hover:bg-amber-900/40 rounded transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="CryptoAnalyzer — Academic Research Methodology"
        subtitle="Empirical time series forecasting framework & statistical significance"
        maxWidth="2xl"
      >
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs">
            <strong>Important Risk Disclosure:</strong> All forecasts, directional probabilities, and regime classifications presented by CryptoAnalyzer are generated through automated algorithmic models trained on historical data. Cryptocurrency markets exhibit extreme non-stationarity, fat-tailed drawdowns, liquidity shocks, and structural regime shifts. Never risk capital based on algorithmic outputs.
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1.5">1. Experimental Design & Architectures</h4>
            <p className="text-xs text-slate-400">
              The platform implements 7 distinct model families: 4 traditional baselines (Naive Persistence Martingale, ElasticNet Linear Regression, Random Forest with 100 bootstrapped trees, and XGBoost gradient boosted trees) and 3 Deep Learning recurrent/convolutional architectures (2-layer LSTM with forget gates, Gated Recurrent Unit [GRU], and 1D Temporal Dilated Convolutional Networks).
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1.5">2. Feature Space Ablation (4 Feature Sets)</h4>
            <p className="text-xs text-slate-400">
              To measure marginal informational gain, models are evaluated across 4 expanding feature regimes: Price Only (OHLC, 4 features), Price + Volume (OHLCV, 5 features), Technical Indicators (19 features including RSI, MACD, Bollinger Bands, ATR, OBV), and the Full Feature Set (24 features incorporating Gaussian HMM state probabilities, volatility ratios, and return momentum).
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1.5">3. Market Regime Modeling (Hidden Markov Models)</h4>
            <p className="text-xs text-slate-400">
              A 4-state continuous Gaussian HMM partitions financial time series into Bull Trend, Bear Trend, Sideways Consolidation, and High Volatility Shock regimes based on rolling log returns and variance, enabling regime-conditional risk adjustments.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-1.5">4. Statistical Rigor (Wilcoxon Signed-Rank + Holm Correction)</h4>
            <p className="text-xs text-slate-400">
              To reject the null hypothesis of equal forecast accuracy against the naive random-walk baseline without inflating Type I false discovery rates, two-tailed Wilcoxon signed-rank tests with Holm-Bonferroni step-down corrections are computed for out-of-sample prediction horizons.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};
