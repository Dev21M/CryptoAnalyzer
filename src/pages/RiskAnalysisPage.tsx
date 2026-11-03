import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Info,
  Layers,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { getAllCoinsRisk } from '../services/riskService';
import { CoinSummary } from '../types/crypto';

interface RiskAnalysisPageProps {
  coins: CoinSummary[];
  onNavigate: (route: string) => void;
}

export const RiskAnalysisPage: React.FC<RiskAnalysisPageProps> = ({ coins, onNavigate }) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'Low Risk' | 'Moderate Risk' | 'High Risk'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const riskItems = getAllCoinsRisk(coins);

  const filtered = riskItems.filter((item) => {
    if (filterCategory !== 'all' && item.riskCategory !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.symbol.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
    }
    return true;
  });

  const lowCount = riskItems.filter((i) => i.riskCategory === 'Low Risk').length;
  const modCount = riskItems.filter((i) => i.riskCategory === 'Moderate Risk').length;
  const highCount = riskItems.filter((i) => i.riskCategory === 'High Risk').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Cryptocurrency Risk Intelligence</h1>
          <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
            Transparent Mathematical Scoring
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Quantitative multi-factor risk assessment analyzing liquidity depth, intraday volatility spreads, and drawdown sensitivity
        </p>
      </div>

      {/* Methodology & Risk Disclaimer Card */}
      <Card className="p-4 bg-slate-900/90 border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-white font-semibold text-xs">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span>Risk Assessment Methodology</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Risk scores (0–100) are computed dynamically using 4 transparent factors: Market Capitalization Depth (35%), Intraday Volatility Spreads (30%), Liquidity Turnover Ratio (20%), and 24h Momentum Shock (15%). Higher scores indicate greater exposure to market volatility. Risk classification does not guarantee asset safety or eliminate digital asset volatility.
        </p>
      </Card>

      {/* Summary Risk Tier Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-emerald-500/30 bg-emerald-950/10">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold font-mono">LOW RISK TIER</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white mt-2">{lowCount} Coins</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Mega-cap digital assets ($100B+) with deep institutional order books and established liquidity.
          </p>
        </Card>

        <Card className="p-4 border-amber-500/30 bg-amber-950/10">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold font-mono">MODERATE RISK TIER</span>
            <Shield className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white mt-2">{modCount} Coins</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Large-cap protocols ($10B–$100B) with high growth potential and typical market volatility.
          </p>
        </Card>

        <Card className="p-4 border-rose-500/30 bg-rose-950/10">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-bold font-mono">HIGH RISK TIER</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white mt-2">{highCount} Coins</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Mid-cap or meme tokens with wide intraday swings and higher sensitivity to broader market corrections.
          </p>
        </Card>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg w-full sm:w-auto">
          {(['all', 'Low Risk', 'Moderate Risk', 'High Risk'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Tiers' : cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by coin name or symbol..."
          className="w-full sm:w-64 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Risk Table */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">Cryptocurrency</th>
                <th className="py-3 px-4">Market Cap Tier</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Volatility Factor</th>
                <th className="py-3 px-4">Liquidity Factor</th>
                <th className="py-3 px-4">Methodology Rationale</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((item) => (
                <tr key={item.symbol} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div
                      onClick={() => onNavigate(`/coin/${item.symbol}`)}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                        {item.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block">{item.symbol}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-[10px]">
                      {item.marketCapTier}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-sm">
                    <span
                      className={
                        item.riskScore < 38
                          ? 'text-emerald-400'
                          : item.riskScore > 65
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }
                    >
                      {item.riskScore} / 100
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.riskCategory === 'Low Risk'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : item.riskCategory === 'High Risk'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {item.riskCategory}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-300">
                    {item.volatilityScore < 40 ? 'Low' : item.volatilityScore < 70 ? 'Moderate' : 'High'}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-300">
                    {item.liquidityScore < 40 ? 'Deep' : 'Moderate'}
                  </td>

                  <td className="py-3 px-4 text-slate-400 max-w-xs text-[11px] leading-relaxed">
                    {item.methodologyNotes}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onNavigate(`/coin/${item.symbol}`)}
                      className="text-emerald-400 hover:text-emerald-300 font-medium text-xs cursor-pointer"
                    >
                      Analyze
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
