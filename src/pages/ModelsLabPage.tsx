import React, { useState } from 'react';
import {
  Activity,
  Award,
  CheckCircle2,
  Cpu,
  Download,
  HelpCircle,
  Layers,
  Scale,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ExportModal } from '../components/common/ExportModal';
import { MetricCard } from '../components/common/MetricCard';
import {
  FEATURE_SETS_INFO,
  ML_ARCHITECTURES_INFO,
  MODEL_EVALUATION_BENCHMARK,
} from '../services/mlModels';
import { FeatureSet } from '../types/crypto';

interface ModelsLabPageProps {
  onNavigate: (route: string) => void;
  onOpenDisclaimer: () => void;
}

export const ModelsLabPage: React.FC<ModelsLabPageProps> = ({
  onNavigate,
  onOpenDisclaimer,
}) => {
  const [selectedFeatureSet, setSelectedFeatureSet] = useState<FeatureSet>('full');
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Best performing model by Directional Accuracy
  const bestModel = [...MODEL_EVALUATION_BENCHMARK].sort(
    (a, b) => b.directionalAccuracyPct - a.directionalAccuracyPct
  )[0];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              7-Architecture ML Benchmark & Statistical Testing
            </h1>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Academic Research Dataset
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Empirical comparative analysis of 4 baselines vs 3 Deep Learning networks on Binance Spot BTC/USDT 5-minute candles predicting 1-hour horizon returns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => setIsExportOpen(true)}
          >
            Export Benchmark CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<HelpCircle className="w-4 h-4" />}
            onClick={onOpenDisclaimer}
          >
            Methodology Notes
          </Button>
        </div>
      </div>

      {/* Benchmark Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Top Performing Architecture"
          value={bestModel.name}
          subtext={`DA: ${bestModel.directionalAccuracyPct}% (Sharpe: ${bestModel.sharpeRatio})`}
          icon={<Award className="w-4 h-4 text-emerald-400" />}
          variant="highlight"
        />
        <MetricCard
          label="Naive Baseline DA"
          value="49.85%"
          subtext="Random walk martingale baseline"
        />
        <MetricCard
          label="Deep Learning Alpha"
          value="+11.45%"
          subtext="Net lift over random guess"
        />
        <MetricCard
          label="Statistical Significance"
          value="p < 0.0018"
          subtext="Holm-Bonferroni corrected"
          icon={<Scale className="w-4 h-4 text-cyan-400" />}
        />
      </div>

      {/* Main Benchmark Comparison Table */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">
              Model Performance & Hypothesis Testing vs. Naive Martingale
            </span>
          </div>
        }
        subtitle="Evaluated on out-of-sample test split with Wilcoxon signed-rank W and Holm-adjusted p-values"
        padding="none"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Architecture</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Feature Set</th>
                <th className="py-3 px-4 text-right">RMSE ($)</th>
                <th className="py-3 px-4 text-right">MAE ($)</th>
                <th className="py-3 px-4 text-right">MAPE (%)</th>
                <th className="py-3 px-4 text-right">Directional Acc (%)</th>
                <th className="py-3 px-4 text-right">Sharpe</th>
                <th className="py-3 px-4 text-right">Wilcoxon W</th>
                <th className="py-3 px-4 text-right">Holm p-value</th>
                <th className="py-3 px-4 text-center">Significant (α=0.05)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MODEL_EVALUATION_BENCHMARK.map((row) => (
                <tr
                  key={row.architecture}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    row.architecture === 'lstm' ? 'bg-emerald-950/20' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    {row.architecture === 'lstm' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                    <span>{row.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-sans">{row.category}</td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {FEATURE_SETS_INFO[row.featureSet].name}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-200">{row.rmse.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-right text-slate-200">{row.mae.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-right text-slate-200">{row.mape.toFixed(2)}%</td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                    {row.directionalAccuracyPct.toFixed(2)}%
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-200">{row.sharpeRatio.toFixed(2)}</td>
                  <td className="py-3.5 px-4 text-right text-slate-400">{row.wilcoxonW.toFixed(1)}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-cyan-300">
                    {row.holmAdjustedPValue < 0.001
                      ? '< 0.001'
                      : row.holmAdjustedPValue.toFixed(4)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.isStatisticallySignificant ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-sans text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>p &lt; 0.05</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 font-sans text-[11px]">Baseline</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Feature Space Ablation Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Feature Set Information Gain (Ablation Study)"
          subtitle="How directional prediction accuracy scales as feature richness expands"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white font-medium">1. Price Only (4 features: OHLC)</span>
                <span className="text-slate-400">51.2% DA</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-slate-500 h-full rounded-full" style={{ width: '51.2%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white font-medium">2. Price + Volume (5 features: OHLCV)</span>
                <span className="text-slate-400">53.8% DA (+2.6% lift)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '53.8%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white font-medium">3. Tech Indicators (19 features: RSI, MACD, BB, ATR)</span>
                <span className="text-slate-400">57.4% DA (+3.6% lift)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '57.4%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white font-medium">4. Full Academic Set (24 features + HMM Regimes)</span>
                <span className="text-emerald-400 font-bold">61.3% DA (+3.9% lift)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '61.3%' }} />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              *Key finding: Incorporating continuous HMM regime probabilities yields the largest single-step informational gain, preventing false breakouts during sideways consolidation.
            </p>
          </div>
        </Card>

        <Card
          title="Statistical Significance & Methodology Rigor"
          subtitle="Overcoming Multiple Hypothesis Testing in Financial Machine Learning"
        >
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              In quantitative finance research, evaluating multiple model configurations against a price series risks false discoveries (Type I error inflation).
            </p>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="text-emerald-400 font-bold">Wilcoxon Signed-Rank Test:</div>
              <div className="text-slate-400">
                Non-parametric paired difference test comparing absolute forecast residuals |y - ŷ_model| versus |y - ŷ_naive|.
              </div>
              <div className="text-cyan-400 font-bold pt-1">Holm-Bonferroni Correction:</div>
              <div className="text-slate-400">
                Step-down p-value adjustment ranking tests by ascending significance to control the Family-Wise Error Rate (FWER) at α = 0.05.
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Both LSTM (p = 0.0018) and XGBoost Full (p = 0.0048) retain statistical significance after Holm adjustment, confirming reproducible non-random predictive structure.
            </p>
          </div>
        </Card>
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        symbol="ML_BENCHMARK"
        data={MODEL_EVALUATION_BENCHMARK}
        title="Export 7-Model Benchmark Dataset"
      />
    </div>
  );
};
