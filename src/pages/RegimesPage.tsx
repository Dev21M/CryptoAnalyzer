import React from 'react';
import { Activity, AlertTriangle, ArrowRight, Boxes, CheckCircle2, Shield, TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/common/MetricCard';
import { RegimeBadge } from '../components/common/RegimeBadge';
import { DEFAULT_TRANSITION_MATRIX, HMM_STATES_META } from '../services/regimeDetection';
import { CoinSummary, MarketRegime } from '../types/crypto';

interface RegimesPageProps {
  coins: CoinSummary[];
  onNavigate: (route: string) => void;
}

export const RegimesPage: React.FC<RegimesPageProps> = ({ coins, onNavigate }) => {
  // Compute distribution of regimes across tracked coins
  const counts: Record<MarketRegime, number> = {
    'Bull': 0,
    'Bear': 0,
    'Sideways': 0,
    'High Volatility': 0,
  };

  coins.forEach((c) => {
    counts[c.currentRegime] = (counts[c.currentRegime] || 0) + 1;
  });

  const total = coins.length || 1;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Hidden Markov Model (HMM) Market Regime Architecture
          </h1>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            4-State Continuous Gaussian HMM
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Automated classification of cryptocurrency price series into discrete non-stationary market regimes using rolling log-returns, volatility ratios, and Baum-Welch trained transition dynamics.
        </p>
      </div>

      {/* Macro Regime Distribution KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Bull Trend Distribution"
          value={`${((counts['Bull'] / total) * 100).toFixed(0)}%`}
          subtext={`${counts['Bull']} Assets in Bull State`}
          icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
        />
        <MetricCard
          label="Bear Trend Distribution"
          value={`${((counts['Bear'] / total) * 100).toFixed(0)}%`}
          subtext={`${counts['Bear']} Assets in Bear State`}
          icon={<TrendingDown className="w-4 h-4 text-rose-400" />}
        />
        <MetricCard
          label="Sideways Consolidation"
          value={`${((counts['Sideways'] / total) * 100).toFixed(0)}%`}
          subtext={`${counts['Sideways']} Assets Range-Bound`}
          icon={<Boxes className="w-4 h-4 text-amber-400" />}
        />
        <MetricCard
          label="High Volatility Shock"
          value={`${((counts['High Volatility'] / total) * 100).toFixed(0)}%`}
          subtext={`${counts['High Volatility']} Assets in Volatility Spike`}
          icon={<Activity className="w-4 h-4 text-purple-400" />}
          variant={counts['High Volatility'] > 0 ? 'highlight' : 'default'}
        />
      </div>

      {/* 4 Regimes Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(HMM_STATES_META).map(([key, meta]) => {
          const reg = key as MarketRegime;
          return (
            <Card
              key={reg}
              title={<RegimeBadge regime={reg} size="md" />}
              subtitle={`State ${meta.stateIndex} · Gaussian Emission Parameter`}
            >
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">{meta.description}</p>

                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Mean 1h Return</div>
                    <div
                      className={`text-sm font-bold mt-0.5 ${
                        meta.meanReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {meta.meanReturn >= 0 ? '+' : ''}
                      {(meta.meanReturn * 100).toFixed(2)}%
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Ann. Volatility</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {(meta.annualizedVolatility * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Avg Duration</div>
                    <div className="text-sm font-bold text-slate-300 mt-0.5">
                      {meta.avgDurationCandles} hrs
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                  <span className="text-slate-400 block mb-1 font-mono text-[11px]">
                    Recommended Analytical Stance:
                  </span>
                  <span className="text-slate-200">{meta.optimalStrategy}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Transition Probability Matrix */}
      <Card
        title="HMM Transition Probability Matrix P(S_{t+1} | S_t)"
        subtitle="Empirical stationary Markov transition matrix calibrated on Binance Spot BTC/USDT 5m data"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4 text-left">From State \ To State</th>
                <th className="py-2.5 px-4">Bull Trend</th>
                <th className="py-2.5 px-4">Bear Trend</th>
                <th className="py-2.5 px-4">Sideways</th>
                <th className="py-2.5 px-4">High Volatility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {DEFAULT_TRANSITION_MATRIX.map((row) => (
                <tr key={row.fromRegime} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 text-left font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span>{row.fromRegime}</span>
                  </td>
                  {row.transitions.map((t) => {
                    const probPct = (t.prob * 100).toFixed(0);
                    const isSelf = t.toRegime === row.fromRegime;

                    return (
                      <td key={t.toRegime} className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded ${
                            isSelf
                              ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                              : t.prob > 0.1
                              ? 'bg-slate-800 text-slate-200'
                              : 'text-slate-500'
                          }`}
                        >
                          {probPct}%
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-[11px] text-slate-400">
          *Note: High diagonal probabilities (&gt;75%) demonstrate that cryptocurrency regimes exhibit high temporal persistence, making regime identification valuable for stabilizing neural network predictions.
        </div>
      </Card>

      {/* Assets Grouped by Regime */}
      <Card title="Current Asset Distribution by Detected Regime">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['Bull', 'Bear', 'Sideways', 'High Volatility'] as MarketRegime[]).map((reg) => {
            const matching = coins.filter((c) => c.currentRegime === reg);

            return (
              <div key={reg} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <RegimeBadge regime={reg} size="sm" />
                  <span className="text-xs font-mono text-slate-400">{matching.length}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {matching.map((c) => (
                    <button
                      key={c.symbol}
                      onClick={() => onNavigate(`/coin/${c.symbol}`)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-emerald-600/20 text-white text-xs font-mono transition-colors"
                    >
                      {c.symbol}
                    </button>
                  ))}
                  {matching.length === 0 && (
                    <span className="text-xs text-slate-500 italic">No assets currently in this state</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
