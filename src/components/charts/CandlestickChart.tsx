import React, { useMemo, useState } from 'react';
import {
  Candle,
  FibonacciLevels,
  PivotPoints,
  TechnicalIndicators,
  Timeframe,
} from '../../types/crypto';

interface CandlestickChartProps {
  candles: Candle[];
  indicators: TechnicalIndicators;
  pivotPoints?: PivotPoints;
  fibonacci?: FibonacciLevels;
  activeTimeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  predictedPrice?: number;
  confidenceInterval?: [number, number];
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  candles,
  indicators,
  pivotPoints,
  activeTimeframe,
  onTimeframeChange,
  predictedPrice,
  confidenceInterval,
}) => {
  const [showSMA20, setShowSMA20] = useState(true);
  const [showEMA50, setShowEMA50] = useState(true);
  const [showBB, setShowBB] = useState(false);
  const [showPivots, setShowPivots] = useState(false);
  const [subChart, setSubChart] = useState<'volume' | 'rsi' | 'macd'>('volume');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Timeframe options
  const timeframes: Timeframe[] = ['5m', '15m', '1h', '4h', '1d', '1w'];

  // Slice display window: show last 60 candles by default for clarity
  const displayCandles = useMemo(() => {
    return candles.slice(-60);
  }, [candles]);

  const startIndex = candles.length - displayCandles.length;

  // Active hovered or latest candle for HUD display
  const activeCandle =
    hoverIndex !== null && hoverIndex >= 0 && hoverIndex < displayCandles.length
      ? displayCandles[hoverIndex]
      : displayCandles[displayCandles.length - 1];

  const activeIndicatorIdx =
    hoverIndex !== null ? startIndex + hoverIndex : candles.length - 1;

  // Price range bounds
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (displayCandles.length === 0) {
      return { minPrice: 0, maxPrice: 100, maxVolume: 100 };
    }
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;

    displayCandles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    });

    if (predictedPrice) {
      if (predictedPrice > max) max = predictedPrice;
      if (predictedPrice < min) min = predictedPrice;
    }
    if (confidenceInterval) {
      if (confidenceInterval[1] > max) max = confidenceInterval[1];
      if (confidenceInterval[0] < min) min = confidenceInterval[0];
    }

    const padding = (max - min) * 0.08 || 1;
    return {
      minPrice: min - padding,
      maxPrice: max + padding,
      maxVolume: maxVol || 1,
    };
  }, [displayCandles, predictedPrice, confidenceInterval]);

  // Chart Dimensions
  const chartWidth = 900;
  const mainHeight = 360;
  const subHeight = 110;
  const paddingRight = 65;
  const paddingLeft = 10;
  const effectiveWidth = chartWidth - paddingRight - paddingLeft;
  const candleCount = displayCandles.length;
  const candleSpacing = effectiveWidth / Math.max(1, candleCount);
  const candleWidth = Math.max(2, Math.min(12, candleSpacing * 0.72));

  // Coordinate transforms
  const getY = (price: number) => {
    const range = maxPrice - minPrice;
    if (range <= 0) return mainHeight / 2;
    return mainHeight - ((price - minPrice) / range) * mainHeight;
  };

  const getX = (index: number) => {
    return paddingLeft + index * candleSpacing + candleSpacing / 2;
  };

  // Active Candle calculations
  const candleChangePct = activeCandle
    ? ((activeCandle.close - activeCandle.open) / activeCandle.open) * 100
    : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
      {/* Chart Top Controls & HUD Bar */}
      <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                activeTimeframe === tf
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Overlays and Subchart Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Indicator toggles */}
          <div className="flex items-center gap-1 text-xs font-mono">
            <button
              onClick={() => setShowSMA20(!showSMA20)}
              className={`px-2 py-1 rounded border transition-colors ${
                showSMA20
                  ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              SMA 20
            </button>
            <button
              onClick={() => setShowEMA50(!showEMA50)}
              className={`px-2 py-1 rounded border transition-colors ${
                showEMA50
                  ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              EMA 50
            </button>
            <button
              onClick={() => setShowBB(!showBB)}
              className={`px-2 py-1 rounded border transition-colors ${
                showBB
                  ? 'border-purple-500/60 bg-purple-500/10 text-purple-300'
                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              BBands
            </button>
            {pivotPoints && (
              <button
                onClick={() => setShowPivots(!showPivots)}
                className={`px-2 py-1 rounded border transition-colors ${
                  showPivots
                    ? 'border-indigo-500/60 bg-indigo-500/10 text-indigo-300'
                    : 'border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                Pivots
              </button>
            )}
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Subchart toggle */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setSubChart('volume')}
              className={`px-2 py-1 rounded transition-colors ${
                subChart === 'volume' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Volume
            </button>
            <button
              onClick={() => setSubChart('rsi')}
              className={`px-2 py-1 rounded transition-colors ${
                subChart === 'rsi' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              RSI (14)
            </button>
            <button
              onClick={() => setSubChart('macd')}
              className={`px-2 py-1 rounded transition-colors ${
                subChart === 'macd' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              MACD
            </button>
          </div>
        </div>
      </div>

      {/* Realtime / Hover HUD Bar */}
      {activeCandle && (
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 text-xs font-mono flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400">
          <span className="text-slate-300 font-medium">
            {new Date(activeCandle.timestamp).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <span>
            O: <strong className="text-white font-mono">{activeCandle.open.toLocaleString()}</strong>
          </span>
          <span>
            H: <strong className="text-emerald-400 font-mono">{activeCandle.high.toLocaleString()}</strong>
          </span>
          <span>
            L: <strong className="text-rose-400 font-mono">{activeCandle.low.toLocaleString()}</strong>
          </span>
          <span>
            C:{' '}
            <strong
              className={`font-mono ${candleChangePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
            >
              {activeCandle.close.toLocaleString()} ({candleChangePct >= 0 ? '+' : ''}
              {candleChangePct.toFixed(2)}%)
            </strong>
          </span>
          <span>
            Vol: <strong className="text-slate-300 font-mono">{Math.round(activeCandle.volume).toLocaleString()}</strong>
          </span>

          {showSMA20 && indicators.sma20[activeIndicatorIdx] && (
            <span className="text-amber-400 font-mono">
              SMA20: {indicators.sma20[activeIndicatorIdx]?.toLocaleString()}
            </span>
          )}
          {showEMA50 && indicators.ema50[activeIndicatorIdx] && (
            <span className="text-cyan-400 font-mono">
              EMA50: {indicators.ema50[activeIndicatorIdx]?.toLocaleString()}
            </span>
          )}
          {subChart === 'rsi' && indicators.rsi14[activeIndicatorIdx] && (
            <span className="text-purple-400 font-mono">
              RSI: {indicators.rsi14[activeIndicatorIdx]}
            </span>
          )}
        </div>
      )}

      {/* SVG Canvas Chart */}
      <div className="relative w-full overflow-hidden bg-slate-950">
        <svg
          viewBox={`0 0 ${chartWidth} ${mainHeight + subHeight}`}
          className="w-full h-auto cursor-crosshair select-none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * chartWidth;
            const idx = Math.floor((relX - paddingLeft) / candleSpacing);
            if (idx >= 0 && idx < displayCandles.length) {
              setHoverIndex(idx);
            }
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Background grid lines */}
          <g className="stroke-slate-800/40" strokeWidth="1" strokeDasharray="3 3">
            {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
              const y = mainHeight * ratio;
              return <line key={ratio} x1={paddingLeft} y1={y} x2={chartWidth - paddingRight} y2={y} />;
            })}
            <line
              x1={paddingLeft}
              y1={mainHeight}
              x2={chartWidth}
              y2={mainHeight}
              strokeDasharray="none"
              className="stroke-slate-800"
            />
          </g>

          {/* Right Price Scale Axis Labels */}
          <g className="text-[10px] font-mono fill-slate-500 select-none">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((ratio) => {
              const p = maxPrice - (maxPrice - minPrice) * ratio;
              const y = mainHeight * ratio;
              return (
                <text key={ratio} x={chartWidth - paddingRight + 6} y={y + 3}>
                  {p < 1 ? p.toFixed(4) : p.toFixed(2)}
                </text>
              );
            })}
          </g>

          {/* Pivot Points Overlays */}
          {showPivots && pivotPoints && (
            <g className="text-[9px] font-mono">
              <line
                x1={paddingLeft}
                y1={getY(pivotPoints.r1)}
                x2={chartWidth - paddingRight}
                y2={getY(pivotPoints.r1)}
                stroke="#f43f5e"
                strokeDasharray="4 2"
                strokeWidth="1"
              />
              <text x={chartWidth - paddingRight + 4} y={getY(pivotPoints.r1) + 3} fill="#f43f5e">
                R1 {pivotPoints.r1}
              </text>

              <line
                x1={paddingLeft}
                y1={getY(pivotPoints.pivot)}
                x2={chartWidth - paddingRight}
                y2={getY(pivotPoints.pivot)}
                stroke="#38bdf8"
                strokeDasharray="4 2"
                strokeWidth="1"
              />
              <text x={chartWidth - paddingRight + 4} y={getY(pivotPoints.pivot) + 3} fill="#38bdf8">
                PP {pivotPoints.pivot}
              </text>

              <line
                x1={paddingLeft}
                y1={getY(pivotPoints.s1)}
                x2={chartWidth - paddingRight}
                y2={getY(pivotPoints.s1)}
                stroke="#10b981"
                strokeDasharray="4 2"
                strokeWidth="1"
              />
              <text x={chartWidth - paddingRight + 4} y={getY(pivotPoints.s1) + 3} fill="#10b981">
                S1 {pivotPoints.s1}
              </text>
            </g>
          )}

          {/* Bollinger Bands Fill */}
          {showBB && (
            <path
              d={(() => {
                const upperPoints: string[] = [];
                const lowerPoints: string[] = [];
                for (let i = 0; i < displayCandles.length; i++) {
                  const idx = startIndex + i;
                  const up = indicators.bollingerBands.upper[idx];
                  const low = indicators.bollingerBands.lower[idx];
                  if (up !== null && low !== null) {
                    const x = getX(i);
                    upperPoints.push(`${x},${getY(up)}`);
                    lowerPoints.unshift(`${x},${getY(low)}`);
                  }
                }
                if (upperPoints.length === 0) return '';
                return `M ${upperPoints.join(' L ')} L ${lowerPoints.join(' L ')} Z`;
              })()}
              fill="rgba(168, 85, 247, 0.08)"
              stroke="rgba(168, 85, 247, 0.4)"
              strokeWidth="1"
            />
          )}

          {/* SMA 20 Line */}
          {showSMA20 && (
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={displayCandles
                .map((_, i) => {
                  const val = indicators.sma20[startIndex + i];
                  if (val === null) return null;
                  return `${getX(i).toFixed(1)},${getY(val).toFixed(1)}`;
                })
                .filter(Boolean)
                .join(' ')}
            />
          )}

          {/* EMA 50 Line */}
          {showEMA50 && (
            <polyline
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={displayCandles
                .map((_, i) => {
                  const val = indicators.ema50[startIndex + i];
                  if (val === null) return null;
                  return `${getX(i).toFixed(1)},${getY(val).toFixed(1)}`;
                })
                .filter(Boolean)
                .join(' ')}
            />
          )}

          {/* Candlesticks (OHLC) */}
          <g>
            {displayCandles.map((c, i) => {
              const x = getX(i);
              const isUp = c.close >= c.open;
              const candleColor = isUp ? '#10b981' : '#f43f5e';
              const yOpen = getY(c.open);
              const yClose = getY(c.close);
              const yHigh = getY(c.high);
              const yLow = getY(c.low);
              const bodyTop = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(1.5, Math.abs(yClose - yOpen));

              return (
                <g key={c.timestamp} className="transition-opacity">
                  {/* Upper / Lower wick line */}
                  <line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={candleColor}
                    strokeWidth="1.2"
                  />
                  {/* Candle real body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={candleColor}
                    rx="0.5"
                  />
                </g>
              );
            })}
          </g>

          {/* AI Model Predicted Horizon Target Projection */}
          {predictedPrice && displayCandles.length > 0 && (
            <g>
              {/* Prediction target line */}
              <line
                x1={getX(displayCandles.length - 1)}
                y1={getY(displayCandles[displayCandles.length - 1].close)}
                x2={getX(displayCandles.length - 1) + 40}
                y2={getY(predictedPrice)}
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <circle
                cx={getX(displayCandles.length - 1) + 40}
                cy={getY(predictedPrice)}
                r="4"
                fill="#10b981"
                className="animate-ping"
              />
              <circle
                cx={getX(displayCandles.length - 1) + 40}
                cy={getY(predictedPrice)}
                r="3"
                fill="#10b981"
              />

              {/* Confidence Interval band */}
              {confidenceInterval && (
                <line
                  x1={getX(displayCandles.length - 1) + 40}
                  y1={getY(confidenceInterval[0])}
                  x2={getX(displayCandles.length - 1) + 40}
                  y2={getY(confidenceInterval[1])}
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </g>
          )}

          {/* Subchart Area (Volume / RSI / MACD) */}
          <g transform={`translate(0, ${mainHeight})`}>
            {/* Subchart separator line */}
            <line x1={0} y1={0} x2={chartWidth} y2={0} stroke="#1e293b" strokeWidth="1" />

            {subChart === 'volume' && (
              <g>
                <text x={paddingLeft} y={15} fill="#64748b" className="text-[10px] font-mono">
                  Volume (24h Realized)
                </text>
                {displayCandles.map((c, i) => {
                  const x = getX(i);
                  const isUp = c.close >= c.open;
                  const vHeight = (c.volume / maxVolume) * (subHeight - 25);
                  return (
                    <rect
                      key={`vol-${c.timestamp}`}
                      x={x - candleWidth / 2}
                      y={subHeight - vHeight}
                      width={candleWidth}
                      height={vHeight}
                      fill={isUp ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}
                      rx="0.5"
                    />
                  );
                })}
              </g>
            )}

            {subChart === 'rsi' && (
              <g>
                {/* 70 / 30 reference lines */}
                <line
                  x1={paddingLeft}
                  y1={subHeight * 0.3}
                  x2={chartWidth - paddingRight}
                  y2={subHeight * 0.3}
                  stroke="rgba(244, 63, 94, 0.4)"
                  strokeDasharray="3 3"
                />
                <text x={chartWidth - paddingRight + 4} y={subHeight * 0.3 + 3} fill="#f43f5e" className="text-[9px] font-mono">
                  70 OB
                </text>

                <line
                  x1={paddingLeft}
                  y1={subHeight * 0.7}
                  x2={chartWidth - paddingRight}
                  y2={subHeight * 0.7}
                  stroke="rgba(16, 185, 129, 0.4)"
                  strokeDasharray="3 3"
                />
                <text x={chartWidth - paddingRight + 4} y={subHeight * 0.7 + 3} fill="#10b981" className="text-[9px] font-mono">
                  30 OS
                </text>

                {/* RSI Line */}
                <polyline
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="1.5"
                  points={displayCandles
                    .map((_, i) => {
                      const val = indicators.rsi14[startIndex + i];
                      if (val === null) return null;
                      const y = subHeight - (val / 100) * subHeight;
                      return `${getX(i).toFixed(1)},${y.toFixed(1)}`;
                    })
                    .filter(Boolean)
                    .join(' ')}
                />
              </g>
            )}

            {subChart === 'macd' && (
              <g>
                <line x1={paddingLeft} y1={subHeight / 2} x2={chartWidth - paddingRight} y2={subHeight / 2} stroke="#334155" />
                {displayCandles.map((_, i) => {
                  const hist = indicators.macd.histogram[startIndex + i];
                  if (hist === null) return null;
                  const x = getX(i);
                  const isPos = hist >= 0;
                  const hHeight = Math.min(subHeight / 2 - 2, Math.abs(hist * 2));
                  const y = isPos ? subHeight / 2 - hHeight : subHeight / 2;
                  return (
                    <rect
                      key={`macd-${i}`}
                      x={x - candleWidth / 2}
                      y={y}
                      width={candleWidth}
                      height={hHeight}
                      fill={isPos ? '#10b981' : '#f43f5e'}
                    />
                  );
                })}
              </g>
            )}
          </g>

          {/* Crosshair Cursor Tracking Line */}
          {hoverIndex !== null && displayCandles[hoverIndex] && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={0}
                x2={getX(hoverIndex)}
                y2={mainHeight + subHeight}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1={paddingLeft}
                y1={getY(displayCandles[hoverIndex].close)}
                x2={chartWidth - paddingRight}
                y2={getY(displayCandles[hoverIndex].close)}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Price badge on axis */}
              <rect
                x={chartWidth - paddingRight}
                y={getY(displayCandles[hoverIndex].close) - 9}
                width={paddingRight - 2}
                height={18}
                fill="#1e293b"
                rx="2"
              />
              <text
                x={chartWidth - paddingRight + 4}
                y={getY(displayCandles[hoverIndex].close) + 3}
                fill="#ffffff"
                className="text-[10px] font-mono font-medium"
              >
                {displayCandles[hoverIndex].close.toFixed(displayCandles[hoverIndex].close < 1 ? 4 : 2)}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
