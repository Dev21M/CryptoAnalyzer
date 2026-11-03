import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Cpu,
  HelpCircle,
  MessageSquare,
  Newspaper,
  Send,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User as UserIcon,
  Zap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import {
  askAiAssistant,
  fetchAiMarketSummary,
  fetchCoinAiInsights,
  CoinAiInsights,
} from '../services/aiService';
import { fetchGlobalMarketData } from '../services/globalMarketService';
import { CoinSummary, GlobalMarketData } from '../types/crypto';

interface AiIntelligencePageProps {
  coins: CoinSummary[];
  onNavigate: (route: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiIntelligencePage: React.FC<AiIntelligencePageProps> = ({ coins, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'assistant' | 'coinInsights' | 'dailySummary'>('assistant');

  // AI Assistant Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Hello! I am your CryptoAnalyzer AI Intelligence Assistant. Ask me anything about current cryptocurrency trends, technical indicators like RSI or MACD, coin comparisons, or market mechanics. How can I assist your research today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // Selected Coin for Deep-Dive Insights
  const [selectedCoinSymbol, setSelectedCoinSymbol] = useState<string>('BTC');
  const [coinInsights, setCoinInsights] = useState<CoinAiInsights | null>(null);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);

  // Daily Market Summary
  const [dailySummary, setDailySummary] = useState<string>('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [globalData, setGlobalData] = useState<GlobalMarketData | null>(null);

  useEffect(() => {
    fetchGlobalMarketData().then(setGlobalData);
  }, []);

  const selectedCoin = coins.find((c) => c.symbol === selectedCoinSymbol) || coins[0];

  // Preset prompt quick buttons
  const presetQuestions = [
    'Why is Bitcoin showing positive momentum today?',
    'Compare Bitcoin and Ethereum investment profiles',
    'What does RSI mean in plain language?',
    'What are the primary risk factors for Solana?',
    'Explain the concept of Dollar-Cost Averaging (DCA)',
  ];

  // Handle Asking Question
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || userInput).trim();
    if (!text || isAsking) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserInput('');
    setIsAsking(true);

    try {
      const btc = coins.find((c) => c.symbol === 'BTC');
      const marketContext = {
        bitcoinPrice: btc ? btc.price : 77000,
        bitcoinChange24h: btc ? btc.change24h : 1.5,
        totalMarketCap: globalData?.totalMarketCap || 2840000000000,
        fearGreed: globalData?.fearGreedIndex || 65,
      };

      const answer = await askAiAssistant(text, marketContext);

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Unable to process your request at this moment. Please check backend connection and API key.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsAsking(false);
    }
  };

  // Load Coin Insights
  useEffect(() => {
    if (!selectedCoin) return;
    setIsInsightsLoading(true);
    fetchCoinAiInsights(selectedCoin)
      .then(setCoinInsights)
      .finally(() => setIsInsightsLoading(false));
  }, [selectedCoinSymbol, selectedCoin]);

  // Load Daily Summary
  useEffect(() => {
    if (coins.length === 0) return;
    setIsSummaryLoading(true);
    fetchAiMarketSummary(coins, globalData || undefined)
      .then(setDailySummary)
      .finally(() => setIsSummaryLoading(false));
  }, [coins.length, globalData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Intelligence Lab</h1>
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Powered by Gemini 3.8
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounded market intelligence, objective question-answering, and real-time asset breakdowns
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg self-start">
          <button
            onClick={() => setActiveTab('assistant')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'assistant'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AI Assistant
          </button>
          <button
            onClick={() => setActiveTab('coinInsights')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'coinInsights'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Coin Insights
          </button>
          <button
            onClick={() => setActiveTab('dailySummary')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'dailySummary'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Market Briefing
          </button>
        </div>
      </div>

      {/* Financial Disclaimer Banner */}
      <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-amber-200/90 text-xs flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Research Disclaimer:</strong> AI-generated commentary is derived from algorithmic processing of live market metrics. It does not constitute investment, financial, or trading advice.
        </span>
      </div>

      {/* Tab 1: AI Assistant */}
      {activeTab === 'assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Window */}
          <Card className="lg:col-span-2 flex flex-col h-[580px] p-0 overflow-hidden">
            {/* Chat Header */}
            <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">CryptoAnalyzer Assistant</div>
                  <div className="text-[10px] text-slate-400">Connected to live market feed</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Online
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                      msg.sender === 'user'
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {msg.sender === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700/60'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`text-[9px] font-mono block mt-1.5 opacity-60 ${
                        msg.sender === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isAsking && (
                <div className="flex gap-3 max-w-[80%] mr-auto">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 rounded-2xl rounded-tl-none bg-slate-800/80 border border-slate-700/60 text-xs text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Analyzing live market data & crafting response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2"
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask about price moves, indicators, or coin fundamentals..."
                disabled={isAsking}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!userInput.trim() || isAsking}
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Send
              </Button>
            </form>
          </Card>

          {/* Quick Prompts & Knowledge Sidebar */}
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-3">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Suggested Questions</span>
              </div>
              <div className="space-y-2">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    disabled={isAsking}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer group flex items-start justify-between gap-2"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-4 text-xs text-slate-400 space-y-2 bg-slate-900/50">
              <div className="font-bold text-slate-300">Grounding Capabilities</div>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Live spot prices & 24h spreads from Binance Spot</li>
                <li>Crypto Fear & Greed index from alternative.me</li>
                <li>Mathematical indicators (RSI, Moving Averages, MACD)</li>
                <li>No fabricated price projections or financial advice</li>
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: AI Coin Insights */}
      {activeTab === 'coinInsights' && (
        <div className="space-y-6">
          {/* Coin Selector Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {coins.map((c) => (
              <button
                key={c.symbol}
                onClick={() => setSelectedCoinSymbol(c.symbol)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors shrink-0 cursor-pointer ${
                  selectedCoinSymbol === c.symbol
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {c.symbol} (${c.price < 1 ? c.price.toFixed(4) : c.price.toLocaleString()})
              </button>
            ))}
          </div>

          {selectedCoin && (
            <div className="space-y-6">
              {/* Coin Overview Hero Card */}
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
                      {selectedCoin.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>{selectedCoin.name}</span>
                        <span className="text-xs font-mono text-slate-400">({selectedCoin.symbol})</span>
                      </h2>
                      <div className="text-xs text-slate-400">
                        Category: {selectedCoin.category} · Pair: {selectedCoin.pair}
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-2xl font-bold font-mono text-white">
                      ${selectedCoin.price < 1 ? selectedCoin.price.toFixed(4) : selectedCoin.price.toLocaleString()}
                    </div>
                    <div
                      className={`text-xs font-mono font-semibold ${
                        selectedCoin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {selectedCoin.change24h >= 0 ? '+' : ''}{selectedCoin.change24h}% (24h)
                    </div>
                  </div>
                </div>

                {/* AI Structured Insights Breakdown */}
                {isInsightsLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    <span className="text-xs font-mono text-slate-400">
                      Analyzing on-chain and order book liquidity for {selectedCoin.symbol}...
                    </span>
                  </div>
                ) : coinInsights ? (
                  <div className="mt-6 space-y-6">
                    {/* Market Overview */}
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono mb-1">
                        Executive Market Overview
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {coinInsights.marketOverview}
                      </p>
                    </div>

                    {/* Bullish vs Bearish Factors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
                          <TrendingUp className="w-4 h-4" />
                          <span>Constructive / Bullish Factors</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {coinInsights.bullishSignals.map((signal, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{signal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
                        <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider font-mono">
                          <TrendingDown className="w-4 h-4" />
                          <span>Cautionary / Bearish Factors</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {coinInsights.bearishSignals.map((signal, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                              <span>{signal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Momentum, Volatility & Key Levels */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                          Momentum Analysis
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {coinInsights.momentumAnalysis}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                          Volatility Evaluation
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {coinInsights.volatilityAnalysis}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                          Support & Resistance Levels
                        </span>
                        <p className="text-xs font-mono text-emerald-400 font-medium">
                          {coinInsights.keyWatchLevels}
                        </p>
                      </div>
                    </div>

                    {/* Risk Profile */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          AI Risk Classification
                        </span>
                        <div className="text-xs font-semibold text-slate-200">
                          {coinInsights.riskAssessment}
                        </div>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onNavigate(`/coin/${selectedCoin.symbol}`)}
                      >
                        Open Interactive Chart
                      </Button>
                    </div>
                  </div>
                ) : null}
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Daily Market Briefing */}
      {activeTab === 'dailySummary' && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Today's Daily Cryptocurrency Briefing</span>
              </h2>
              <span className="text-xs text-slate-400">
                Generated from live aggregate capitalization, volume, and sentiment data
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {isSummaryLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <span className="text-xs font-mono text-slate-400">Synthesizing macro market intelligence...</span>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans">
                {dailySummary}
              </div>

              {/* Macro Key Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-xs block">Total Market Cap</span>
                  <span className="text-base font-bold font-mono text-white">
                    ${((globalData?.totalMarketCap || 2.84e12) / 1e12).toFixed(2)}T
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-xs block">24h Global Volume</span>
                  <span className="text-base font-bold font-mono text-white">
                    ${((globalData?.total24hVolume || 1.12e11) / 1e9).toFixed(1)}B
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-xs block">BTC Dominance</span>
                  <span className="text-base font-bold font-mono text-white">
                    {globalData?.btcDominance || 56.4}%
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-xs block">Market Sentiment</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    {globalData?.fearGreedSentiment || 'Greed'} ({globalData?.fearGreedIndex || 65})
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
