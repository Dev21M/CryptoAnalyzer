import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Download,
  Edit2,
  FileSpreadsheet,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from '../services/portfolioService';
import { exportToCSV } from '../services/storage';
import { CoinSummary, PortfolioTransaction } from '../types/crypto';

interface TransactionsPageProps {
  coins: CoinSummary[];
  onNavigate: (route: string) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  coins,
  onNavigate,
  onShowToast,
}) => {
  const [transactions, setTransactions] = useState<PortfolioTransaction[]>(getTransactions());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<PortfolioTransaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [symbol, setSymbol] = useState('BTC');
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [amount, setAmount] = useState('');
  const [pricePerCoin, setPricePerCoin] = useState('');
  const [fee, setFee] = useState('0');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleOpenAdd = (selectedSymbol: string = 'BTC') => {
    setEditingTx(null);
    setSymbol(selectedSymbol);
    const coin = coins.find((c) => c.symbol === selectedSymbol);
    setPricePerCoin(coin ? String(coin.price) : '77000');
    setAmount('1');
    setFee('0');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (tx: PortfolioTransaction) => {
    setEditingTx(tx);
    setSymbol(tx.symbol);
    setType(tx.type);
    setAmount(String(tx.amount));
    setPricePerCoin(String(tx.pricePerCoin));
    setFee(String(tx.fee));
    setDate(tx.date);
    setNotes(tx.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    const parsedPrice = parseFloat(pricePerCoin);
    const parsedFee = parseFloat(fee) || 0;

    if (isNaN(parsedAmount) || parsedAmount <= 0 || isNaN(parsedPrice) || parsedPrice <= 0) {
      onShowToast('Invalid Inputs', 'Please provide a valid trade quantity and price.', 'error');
      return;
    }

    const coin = coins.find((c) => c.symbol === symbol.toUpperCase());
    const coinName = coin ? coin.name : symbol.toUpperCase();

    if (editingTx) {
      const updated = updateTransaction(editingTx.id, {
        symbol: symbol.toUpperCase(),
        coinName,
        type,
        amount: parsedAmount,
        pricePerCoin: parsedPrice,
        fee: parsedFee,
        date,
        notes,
      });
      setTransactions(updated);
      onShowToast('Transaction Updated', `Successfully updated ${symbol} trade record.`, 'success');
    } else {
      const updated = addTransaction({
        symbol: symbol.toUpperCase(),
        coinName,
        type,
        amount: parsedAmount,
        pricePerCoin: parsedPrice,
        fee: parsedFee,
        date,
        notes,
      });
      setTransactions(updated);
      onShowToast('Trade Recorded', `Recorded ${type} transaction for ${parsedAmount} ${symbol}.`, 'success');
    }

    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string, sym: string) => {
    if (confirm(`Delete this ${sym} transaction record?`)) {
      const updated = deleteTransaction(id);
      setTransactions(updated);
      onShowToast('Record Deleted', 'Transaction removed from portfolio ledger.', 'info');
    }
  };

  const handleExportCSV = () => {
    exportToCSV(`cryptoanalyzer_transactions_${new Date().toISOString().split('T')[0]}`, transactions);
    onShowToast('Export Complete', 'Exported transactions to CSV file.', 'success');
  };

  const filteredTransactions = transactions.filter((t) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.symbol.toLowerCase().includes(q) ||
        t.coinName.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Transaction Ledger</h1>
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              {transactions.length} Recorded Trades
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Audit-grade history of all cryptocurrency purchases, sales, and position adjustments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenAdd('BTC')}
            icon={<Plus className="w-4 h-4" />}
          >
            Record Transaction
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by coin, note, or type..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onNavigate('/portfolio')}
        >
          View Portfolio Breakdown
        </Button>
      </div>

      {/* Transactions Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4 text-right">Price per Coin</th>
                <th className="py-3 px-4 text-right">Fee</th>
                <th className="py-3 px-4 text-right">Total Trade Value</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No transactions found. Click "Record Transaction" to add your first trade.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                      {tx.date}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] ${
                          tx.type === 'BUY'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {tx.type === 'BUY' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {tx.type}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[10px] flex items-center justify-center">
                          {tx.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <span className="font-bold text-white">{tx.coinName}</span>
                          <span className="text-[10px] font-mono text-slate-400 ml-1.5">({tx.symbol})</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-slate-200 text-right">
                      {tx.amount.toLocaleString()} {tx.symbol}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300 text-right">
                      ${tx.pricePerCoin < 1 ? tx.pricePerCoin.toFixed(4) : tx.pricePerCoin.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400 text-right">
                      ${tx.fee.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white text-right">
                      ${tx.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4 text-slate-400 max-w-[200px] truncate text-[11px]">
                      {tx.notes || '—'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(tx)}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id, tx.symbol)}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Transaction Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingTx ? 'Edit Transaction' : 'Record Portfolio Transaction'}
        subtitle="Update cost-basis and portfolio performance attribution"
      >
        <form onSubmit={handleSaveTransaction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Cryptocurrency</label>
              <select
                value={symbol}
                onChange={(e) => {
                  const s = e.target.value;
                  setSymbol(s);
                  const c = coins.find((coin) => coin.symbol === s);
                  if (c) setPricePerCoin(String(c.price));
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {coins.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Trade Direction</label>
              <div className="flex rounded-lg overflow-hidden border border-slate-800">
                <button
                  type="button"
                  onClick={() => setType('BUY')}
                  className={`flex-1 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    type === 'BUY' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setType('SELL')}
                  className={`flex-1 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    type === 'SELL' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  SELL
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Quantity (Amount)</label>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Price per Coin ($)</label>
              <input
                type="number"
                step="any"
                value={pricePerCoin}
                onChange={(e) => setPricePerCoin(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Transaction Fee ($)</label>
              <input
                type="number"
                step="any"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Trade Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Notes / Rationale</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. DCA buy into support level, staking allocation..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingTx ? 'Update Transaction' : 'Save Transaction'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
