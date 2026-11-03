/**
 * Portfolio Management & Multi-Transaction Ledger Service
 */

import { PortfolioHolding, PortfolioTransaction } from '../types/crypto';

const TRANSACTIONS_KEY = 'cryptoanalyzer_transactions_v2';
const HOLDINGS_KEY = 'cryptoanalyzer_portfolio_v2';

const INITIAL_TRANSACTIONS: PortfolioTransaction[] = [
  {
    id: 'tx-1',
    symbol: 'BTC',
    coinName: 'Bitcoin',
    type: 'BUY',
    amount: 0.35,
    pricePerCoin: 61500,
    fee: 15,
    totalValue: 21540,
    date: '2024-08-14',
    notes: 'Initial spot accumulation',
  },
  {
    id: 'tx-2',
    symbol: 'BTC',
    coinName: 'Bitcoin',
    type: 'BUY',
    amount: 0.15,
    pricePerCoin: 68200,
    fee: 8,
    totalValue: 10238,
    date: '2024-10-22',
    notes: 'DCA pullback entry',
  },
  {
    id: 'tx-3',
    symbol: 'ETH',
    coinName: 'Ethereum',
    type: 'BUY',
    amount: 4.5,
    pricePerCoin: 2650,
    fee: 12,
    totalValue: 11937,
    date: '2024-09-05',
    notes: 'Staking position',
  },
  {
    id: 'tx-4',
    symbol: 'SOL',
    coinName: 'Solana',
    type: 'BUY',
    amount: 40,
    pricePerCoin: 135,
    fee: 5,
    totalValue: 5405,
    date: '2024-09-20',
    notes: 'Ecosystem growth bet',
  },
];

export function getTransactions(): PortfolioTransaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) {
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function saveTransactions(transactions: PortfolioTransaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    recomputeAndSaveHoldings(transactions);
  } catch (e) {
    console.error('Failed to save transactions:', e);
  }
}

export function addTransaction(tx: Omit<PortfolioTransaction, 'id' | 'totalValue'>): PortfolioTransaction[] {
  const current = getTransactions();
  const totalValue = tx.amount * tx.pricePerCoin + (tx.fee || 0);
  const newTx: PortfolioTransaction = {
    ...tx,
    id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    totalValue,
  };

  const updated = [newTx, ...current];
  saveTransactions(updated);
  return updated;
}

export function deleteTransaction(id: string): PortfolioTransaction[] {
  const current = getTransactions();
  const updated = current.filter((t) => t.id !== id);
  saveTransactions(updated);
  return updated;
}

export function updateTransaction(id: string, updates: Partial<PortfolioTransaction>): PortfolioTransaction[] {
  const current = getTransactions();
  const updated = current.map((t) => {
    if (t.id === id) {
      const merged = { ...t, ...updates };
      merged.totalValue = merged.amount * merged.pricePerCoin + (merged.fee || 0);
      return merged;
    }
    return t;
  });
  saveTransactions(updated);
  return updated;
}

/**
 * Recompute aggregate holdings from the full transaction ledger
 */
export function recomputeAndSaveHoldings(transactions: PortfolioTransaction[]): PortfolioHolding[] {
  const map: Record<string, { amount: number; totalCost: number; name: string; firstDate: string }> = {};

  for (const tx of transactions) {
    const sym = tx.symbol.toUpperCase();
    if (!map[sym]) {
      map[sym] = { amount: 0, totalCost: 0, name: tx.coinName || sym, firstDate: tx.date };
    }

    if (tx.type === 'BUY') {
      map[sym].amount += tx.amount;
      map[sym].totalCost += tx.amount * tx.pricePerCoin + (tx.fee || 0);
    } else if (tx.type === 'SELL') {
      // Reduce amount and proportional cost
      if (map[sym].amount > 0) {
        const avgCost = map[sym].totalCost / map[sym].amount;
        map[sym].amount = Math.max(0, map[sym].amount - tx.amount);
        map[sym].totalCost = Math.max(0, map[sym].amount * avgCost);
      }
    }
  }

  const holdings: PortfolioHolding[] = Object.keys(map)
    .filter((sym) => map[sym].amount > 0.000001)
    .map((sym, idx) => {
      const item = map[sym];
      const avgPrice = item.amount > 0 ? item.totalCost / item.amount : 0;
      return {
        id: `holding-${sym}-${idx}`,
        symbol: sym,
        name: item.name,
        amount: Number(item.amount.toFixed(6)),
        buyPrice: Number(avgPrice.toFixed(avgPrice < 1 ? 4 : 2)),
        buyDate: item.firstDate,
      };
    });

  try {
    localStorage.setItem(HOLDINGS_KEY, JSON.stringify(holdings));
  } catch (e) {
    console.error('Failed to save holdings cache:', e);
  }

  return holdings;
}

export function getPortfolioHoldings(): PortfolioHolding[] {
  const txs = getTransactions();
  return recomputeAndSaveHoldings(txs);
}
