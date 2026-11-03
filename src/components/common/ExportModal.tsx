import React, { useState } from 'react';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';
import { exportToCSV, exportToJSON } from '../../services/storage';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  data: any;
  title?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  symbol,
  data,
  title = 'Export Research Data',
}) => {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [includeIndicators, setIncludeIndicators] = useState(true);
  const [includePredictions, setIncludePredictions] = useState(true);

  const handleExport = () => {
    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-');
    const baseName = `CryptoAnalyzer_${symbol}_${timestampStr}`;

    if (format === 'json') {
      const payload = {
        symbol,
        exportTimestamp: new Date().toISOString(),
        researchTool: 'CryptoAnalyzer Academic Lab v1.0',
        disclaimer: 'For academic research only. Not financial advice.',
        payload: data,
      };
      exportToJSON(baseName, payload);
    } else {
      // CSV format: export candles with indicator fields if available
      let rows: Record<string, any>[] = [];
      if (Array.isArray(data)) {
        rows = data;
      } else if (data && data.candles && Array.isArray(data.candles)) {
        rows = data.candles.map((c: any, idx: number) => {
          const row: Record<string, any> = {
            timestamp: new Date(c.timestamp).toISOString(),
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
            volume: c.volume,
          };
          if (includeIndicators && data.indicators) {
            row.sma20 = data.indicators.sma20?.[idx] ?? '';
            row.ema50 = data.indicators.ema50?.[idx] ?? '';
            row.rsi14 = data.indicators.rsi14?.[idx] ?? '';
            row.macdHist = data.indicators.macd?.histogram?.[idx] ?? '';
          }
          return row;
        });
      } else {
        rows = [data];
      }
      exportToCSV(baseName, rows);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${title} (${symbol})`}
      subtitle="Download research time series, indicators, and ML predictions"
      maxWidth="md"
    >
      <div className="space-y-5">
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            File Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
                format === 'csv'
                  ? 'border-emerald-500 bg-emerald-500/10 text-white'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
              }`}
            >
              <FileSpreadsheet className={`w-5 h-5 ${format === 'csv' ? 'text-emerald-400' : 'text-slate-500'}`} />
              <div>
                <div className="text-sm font-medium">CSV Table</div>
                <div className="text-[11px] text-slate-400">Excel, Python, R analysis</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat('json')}
              className={`flex items-center gap-2.5 p-3 rounded-lg border text-left transition-all ${
                format === 'json'
                  ? 'border-emerald-500 bg-emerald-500/10 text-white'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
              }`}
            >
              <FileJson className={`w-5 h-5 ${format === 'json' ? 'text-emerald-400' : 'text-slate-500'}`} />
              <div>
                <div className="text-sm font-medium">JSON Dataset</div>
                <div className="text-[11px] text-slate-400">Nested metrics & SHAP</div>
              </div>
            </button>
          </div>
        </div>

        {format === 'csv' && (
          <div className="space-y-2 border-t border-slate-800/80 pt-4">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
              Included Columns
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeIndicators}
                onChange={(e) => setIncludeIndicators(e.target.checked)}
                className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
              <span>Include Technical Indicators (RSI, SMA, EMA, MACD)</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includePredictions}
                onChange={(e) => setIncludePredictions(e.target.checked)}
                className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
              <span>Include ML Horizon Forecasts</span>
            </label>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 border-t border-slate-800/80 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
            Download {format.toUpperCase()}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
