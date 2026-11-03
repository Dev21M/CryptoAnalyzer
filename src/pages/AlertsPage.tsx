import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BellOff,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Volume2,
  Zap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import {
  addAlert,
  deleteAlert,
  getAlerts,
  playAlertChime,
  toggleAlertActive,
} from '../services/alertsService';
import { CoinSummary, PriceAlert } from '../types/crypto';

interface AlertsPageProps {
  coins: CoinSummary[];
  onNavigate: (route: string) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ coins, onNavigate, onShowToast }) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>(getAlerts());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [symbol, setSymbol] = useState('BTC');
  const [condition, setCondition] = useState<PriceAlert['condition']>('ABOVE');
  const [targetPrice, setTargetPrice] = useState('80000');
  const [percentageValue, setPercentageValue] = useState('5');

  const selectedCoin = coins.find((c) => c.symbol === symbol.toUpperCase()) || coins[0];

  const handleOpenAddModal = (sym: string = 'BTC') => {
    setSymbol(sym);
    const coin = coins.find((c) => c.symbol === sym);
    if (coin) {
      setTargetPrice(String(Number((coin.price * 1.05).toFixed(coin.price < 1 ? 4 : 2))));
    }
    setCondition('ABOVE');
    setPercentageValue('5');
    setIsAddModalOpen(true);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTarget = parseFloat(targetPrice);
    const parsedPct = parseFloat(percentageValue);

    if (condition === 'ABOVE' || condition === 'BELOW') {
      if (isNaN(parsedTarget) || parsedTarget <= 0) {
        onShowToast('Invalid Price', 'Please enter a valid target price threshold.', 'error');
        return;
      }
    } else {
      if (isNaN(parsedPct) || parsedPct <= 0) {
        onShowToast('Invalid Percentage', 'Please enter a valid percentage value.', 'error');
        return;
      }
    }

    const coin = coins.find((c) => c.symbol === symbol.toUpperCase());
    const updated = addAlert({
      symbol: symbol.toUpperCase(),
      coinName: coin ? coin.name : symbol.toUpperCase(),
      targetPrice: condition === 'ABOVE' || condition === 'BELOW' ? parsedTarget : (coin ? coin.price : 0),
      condition,
      percentageValue: condition.includes('PERCENT') ? parsedPct : undefined,
    });

    setAlerts(updated);
    setIsAddModalOpen(false);
    onShowToast('Price Alert Armed', `Active real-time alert set for ${symbol}.`, 'success');
  };

  const handleDelete = (id: string, sym: string) => {
    const updated = deleteAlert(id);
    setAlerts(updated);
    onShowToast('Alert Removed', `Alert for ${sym} has been removed.`, 'info');
  };

  const handleToggle = (id: string) => {
    const updated = toggleAlertActive(id);
    setAlerts(updated);
  };

  const handleTestChime = () => {
    playAlertChime();
    onShowToast('Audio Tested', 'Web Audio synthesizer notification chime played.', 'info');
  };

  const activeAlerts = alerts.filter((a) => a.active && !a.triggered);
  const triggeredAlerts = alerts.filter((a) => a.triggered);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Real-Time Price Alerts</h1>
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              {activeAlerts.length} Active Triggers
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure instant triggers for price thresholds, support breaks, and percentage spikes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestChime}
            icon={<Volume2 className="w-3.5 h-3.5" />}
          >
            Test Sound
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenAddModal('BTC')}
            icon={<Plus className="w-4 h-4" />}
          >
            Create Price Alert
          </Button>
        </div>
      </div>

      {/* Alert Monitoring Engine Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            <strong>Active Monitoring Loop:</strong> Alerts are evaluated on every incoming Binance spot ticker. When a condition is met, an audio chime and in-app toast are dispatched immediately.
          </span>
        </div>
      </div>

      {/* Active Alerts Section */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold px-1">
          Active Watchers ({activeAlerts.length})
        </div>

        {activeAlerts.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 text-xs">
            No active price alerts right now. Click "Create Price Alert" to configure your first alert.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAlerts.map((alert) => {
              const liveCoin = coins.find((c) => c.symbol === alert.symbol);
              const livePrice = liveCoin ? liveCoin.price : 0;
              const distance =
                livePrice > 0
                  ? (((alert.targetPrice - livePrice) / livePrice) * 100).toFixed(2)
                  : '0';

              return (
                <Card
                  key={alert.id}
                  className="p-4 border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                          {alert.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs">{alert.coinName}</span>
                          <span className="text-[10px] font-mono text-slate-400 block">{alert.symbol}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggle(alert.id)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            alert.active ? 'text-emerald-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'
                          }`}
                          title={alert.active ? 'Disable Alert' : 'Enable Alert'}
                        >
                          {alert.active ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(alert.id, alert.symbol)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete Alert"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Condition details */}
                    <div className="my-3 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <span className="text-slate-500 font-mono">Condition:</span>
                        <span className="font-semibold text-emerald-400 font-mono">
                          {alert.condition === 'ABOVE' && `Rises Above $${alert.targetPrice.toLocaleString()}`}
                          {alert.condition === 'BELOW' && `Drops Below $${alert.targetPrice.toLocaleString()}`}
                          {alert.condition === 'PERCENT_INCREASE' && `Increases by ${alert.percentageValue}% in 24h`}
                          {alert.condition === 'PERCENT_DECREASE' && `Drops by ${alert.percentageValue}% in 24h`}
                        </span>
                      </div>

                      {/* Distance metric */}
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Current Spot Price:</span>
                        <span className="text-white font-bold">${livePrice.toLocaleString()}</span>
                      </div>

                      {alert.condition === 'ABOVE' || alert.condition === 'BELOW' ? (
                        <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between px-1">
                          <span>Target Distance:</span>
                          <span className={Number(distance) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {Number(distance) >= 0 ? '+' : ''}{distance}% away
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                    <span>Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => onNavigate(`/coin/${alert.symbol}`)}
                      className="text-emerald-400 hover:underline cursor-pointer"
                    >
                      Inspect Chart
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Triggered History */}
      {triggeredAlerts.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-800">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold px-1">
            Triggered Alert History ({triggeredAlerts.length})
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {triggeredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs flex items-center justify-between opacity-80"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
                    {alert.symbol}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">
                      {alert.condition} threshold reached (${alert.targetPrice.toLocaleString()})
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Triggered {alert.triggeredAt ? new Date(alert.triggeredAt).toLocaleTimeString() : 'recently'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(alert.id, alert.symbol)}
                  className="p-1 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Alert Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Real-Time Price Alert"
        subtitle="Monitored 24/7 against live exchange tickers"
      >
        <form onSubmit={handleCreateAlert} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Target Cryptocurrency</label>
            <select
              value={symbol}
              onChange={(e) => {
                const s = e.target.value;
                setSymbol(s);
                const coin = coins.find((c) => c.symbol === s);
                if (coin) {
                  setTargetPrice(String(Number((coin.price * 1.05).toFixed(coin.price < 1 ? 4 : 2))));
                }
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {coins.map((c) => (
                <option key={c.symbol} value={c.symbol}>
                  {c.name} ({c.symbol}) — Current: ${c.price < 1 ? c.price.toFixed(4) : c.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Alert Trigger Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as PriceAlert['condition'])}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="ABOVE">Price Rises Above Target ($)</option>
              <option value="BELOW">Price Drops Below Target ($)</option>
              <option value="PERCENT_INCREASE">24-Hour Surge (+% Gain)</option>
              <option value="PERCENT_DECREASE">24-Hour Dump (-% Loss)</option>
            </select>
          </div>

          {condition === 'ABOVE' || condition === 'BELOW' ? (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Target Price ($ USD)</label>
              <input
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Percentage Threshold (%)</label>
              <input
                type="number"
                step="any"
                value={percentageValue}
                onChange={(e) => setPercentageValue(e.target.value)}
                placeholder="e.g. 5"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Arm Alert
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
