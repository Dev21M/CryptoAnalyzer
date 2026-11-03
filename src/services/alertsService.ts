/**
 * Real-Time Price Alerts & Notification Service
 */

import { PriceAlert } from '../types/crypto';

const ALERTS_KEY = 'cryptoanalyzer_price_alerts_v1';

const INITIAL_ALERTS: PriceAlert[] = [
  {
    id: 'alert-1',
    symbol: 'BTC',
    coinName: 'Bitcoin',
    targetPrice: 80000,
    condition: 'ABOVE',
    createdAt: '2025-01-10T12:00:00Z',
    triggered: false,
    active: true,
  },
  {
    id: 'alert-2',
    symbol: 'ETH',
    coinName: 'Ethereum',
    targetPrice: 2200,
    condition: 'BELOW',
    createdAt: '2025-01-12T15:30:00Z',
    triggered: false,
    active: true,
  },
  {
    id: 'alert-3',
    symbol: 'SOL',
    coinName: 'Solana',
    targetPrice: 100,
    condition: 'ABOVE',
    createdAt: '2025-01-14T09:15:00Z',
    triggered: false,
    active: true,
  },
];

export function getAlerts(): PriceAlert[] {
  try {
    const raw = localStorage.getItem(ALERTS_KEY);
    if (!raw) {
      localStorage.setItem(ALERTS_KEY, JSON.stringify(INITIAL_ALERTS));
      return INITIAL_ALERTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ALERTS;
  }
}

export function saveAlerts(alerts: PriceAlert[]): void {
  try {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to save alerts:', e);
  }
}

export function addAlert(alert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered' | 'active'>): PriceAlert[] {
  const current = getAlerts();
  const newAlert: PriceAlert = {
    ...alert,
    id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
    triggered: false,
    active: true,
  };
  const updated = [newAlert, ...current];
  saveAlerts(updated);
  return updated;
}

export function deleteAlert(id: string): PriceAlert[] {
  const current = getAlerts();
  const updated = current.filter((a) => a.id !== id);
  saveAlerts(updated);
  return updated;
}

export function toggleAlertActive(id: string): PriceAlert[] {
  const current = getAlerts();
  const updated = current.map((a) => (a.id === id ? { ...a, active: !a.active } : a));
  saveAlerts(updated);
  return updated;
}

/**
 * Play pleasant synthesizer audio chime using Web Audio API
 */
export function playAlertChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio context may be restricted before user gesture
  }
}

/**
 * Evaluates active alerts against live spot prices
 * Returns an array of newly triggered alerts
 */
export function evaluateAlerts(
  prices: Record<string, number>,
  changes24h: Record<string, number>
): PriceAlert[] {
  const alerts = getAlerts();
  const newlyTriggered: PriceAlert[] = [];
  let changed = false;

  const updated = alerts.map((alert) => {
    if (!alert.active || alert.triggered) return alert;

    const currentPrice = prices[alert.symbol.toUpperCase()];
    const change24h = changes24h[alert.symbol.toUpperCase()];
    if (currentPrice === undefined) return alert;

    let isTriggered = false;

    if (alert.condition === 'ABOVE' && currentPrice >= alert.targetPrice) {
      isTriggered = true;
    } else if (alert.condition === 'BELOW' && currentPrice <= alert.targetPrice) {
      isTriggered = true;
    } else if (alert.condition === 'PERCENT_INCREASE' && alert.percentageValue && change24h >= alert.percentageValue) {
      isTriggered = true;
    } else if (alert.condition === 'PERCENT_DECREASE' && alert.percentageValue && change24h <= -alert.percentageValue) {
      isTriggered = true;
    }

    if (isTriggered) {
      changed = true;
      const triggeredAlert = {
        ...alert,
        triggered: true,
        triggeredAt: new Date().toISOString(),
      };
      newlyTriggered.push(triggeredAlert);
      return triggeredAlert;
    }

    return alert;
  });

  if (changed) {
    saveAlerts(updated);
    if (newlyTriggered.length > 0) {
      playAlertChime();
    }
  }

  return newlyTriggered;
}
