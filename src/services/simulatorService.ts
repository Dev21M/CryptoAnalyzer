/**
 * Virtual Paper Trading Simulator Service
 * Provides risk-free hands-on cryptocurrency trading practice with live spot prices
 */

import { SimulatedAccount, SimulatedTrade } from '../types/crypto';

const SIMULATOR_STORAGE_KEY = 'cryptoanalyzer_paper_sim_v1';
const INITIAL_CASH = 10000; // $10,000 USD virtual starting balance

export function getSimulatedAccount(): SimulatedAccount {
  try {
    const raw = localStorage.getItem(SIMULATOR_STORAGE_KEY);
    if (!raw) {
      const initial: SimulatedAccount = {
        cashBalance: INITIAL_CASH,
        initialBalance: INITIAL_CASH,
        trades: [],
        holdings: {},
      };
      localStorage.setItem(SIMULATOR_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return {
      cashBalance: INITIAL_CASH,
      initialBalance: INITIAL_CASH,
      trades: [],
      holdings: {},
    };
  }
}

export function saveSimulatedAccount(account: SimulatedAccount): void {
  try {
    localStorage.setItem(SIMULATOR_STORAGE_KEY, JSON.stringify(account));
  } catch (e) {
    console.error('Failed to save paper trading account:', e);
  }
}

export function executePaperTrade(
  symbol: string,
  coinName: string,
  type: 'BUY' | 'SELL',
  amount: number,
  currentPrice: number
): { success: boolean; message: string; account: SimulatedAccount } {
  const account = getSimulatedAccount();
  const sym = symbol.toUpperCase();
  const totalCost = amount * currentPrice;

  if (amount <= 0 || currentPrice <= 0) {
    return { success: false, message: 'Invalid trade volume or price.', account };
  }

  if (type === 'BUY') {
    if (account.cashBalance < totalCost) {
      return {
        success: false,
        message: `Insufficient virtual cash balance ($${account.cashBalance.toFixed(2)} available, $${totalCost.toFixed(2)} required).`,
        account,
      };
    }

    account.cashBalance -= totalCost;
    const existing = account.holdings[sym] || { amount: 0, avgCost: 0 };
    const newAmount = existing.amount + amount;
    const newAvgCost = (existing.amount * existing.avgCost + totalCost) / newAmount;

    account.holdings[sym] = {
      amount: newAmount,
      avgCost: newAvgCost,
    };
  } else {
    // SELL
    const existing = account.holdings[sym] || { amount: 0, avgCost: 0 };
    if (existing.amount < amount) {
      return {
        success: false,
        message: `Insufficient ${sym} position (${existing.amount.toFixed(4)} available to sell).`,
        account,
      };
    }

    account.cashBalance += totalCost;
    const remainingAmount = existing.amount - amount;

    if (remainingAmount <= 0.000001) {
      delete account.holdings[sym];
    } else {
      account.holdings[sym] = {
        amount: remainingAmount,
        avgCost: existing.avgCost,
      };
    }
  }

  const trade: SimulatedTrade = {
    id: `sim-tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    symbol: sym,
    coinName,
    type,
    amount,
    price: currentPrice,
    totalCost,
    timestamp: new Date().toISOString(),
  };

  account.trades.unshift(trade);
  saveSimulatedAccount(account);

  return {
    success: true,
    message: `Successfully executed virtual ${type} order for ${amount} ${sym} at $${currentPrice.toLocaleString()}`,
    account,
  };
}

export function resetPaperAccount(): SimulatedAccount {
  const fresh: SimulatedAccount = {
    cashBalance: INITIAL_CASH,
    initialBalance: INITIAL_CASH,
    trades: [],
    holdings: {},
  };
  saveSimulatedAccount(fresh);
  return fresh;
}
