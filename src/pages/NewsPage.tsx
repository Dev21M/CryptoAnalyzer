import React, { useEffect, useState } from 'react';
import {
  ExternalLink,
  Filter,
  Newspaper,
  Search,
  Sparkles,
  Tag,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { fetchAiNewsTakeaway } from '../services/aiService';
import { fetchCryptoNews } from '../services/newsService';
import { CryptoNewsItem } from '../types/crypto';

interface NewsPageProps {
  onNavigate: (route: string) => void;
}

export const NewsPage: React.FC<NewsPageProps> = () => {
  const [news, setNews] = useState<CryptoNewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // AI Summary Modal state
  const [activeArticle, setActiveArticle] = useState<CryptoNewsItem | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const categories = [
    'all',
    'Market Updates',
    'Bitcoin',
    'Ethereum',
    'Altcoins',
    'Blockchain',
    'Regulations',
    'Institutional Investments',
  ];

  const loadNews = async (cat: string) => {
    setIsLoading(true);
    try {
      const items = await fetchCryptoNews(cat);
      setNews(items);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews(selectedCategory);
  }, [selectedCategory]);

  const handleOpenAiSummary = async (article: CryptoNewsItem) => {
    setActiveArticle(article);
    setAiSummary('');
    setIsSummarizing(true);
    try {
      const takeaway = await fetchAiNewsTakeaway(article.title, article.summary);
      setAiSummary(takeaway);
    } catch {
      setAiSummary('Failed to generate summary at this time.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const filteredNews = news.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Verified Crypto Intelligence News</h1>
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              Live Verified Feeds
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Curated industry reporting from CoinDesk, CoinTelegraph, and Decrypt with 1-click AI executive summaries
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news headlines..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat === 'all' ? 'All Intelligence' : cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-400">Loading verified industry dispatches...</span>
        </div>
      ) : filteredNews.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 text-xs">
          No articles matching your current filter. Try selecting "All Intelligence".
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNews.map((item) => (
            <Card
              key={item.id}
              className="p-5 flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                {/* Meta Top Line */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-300 font-mono">{item.source}</span>
                    <span>·</span>
                    <span className="text-slate-500">
                      {new Date(item.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      item.sentiment === 'Bullish'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : item.sentiment === 'Bearish'
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.sentiment}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors mt-3 line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>

                {/* Category badge */}
                <div className="mt-3">
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => handleOpenAiSummary(item)}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Takeaway</span>
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <span>Source Article</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* AI News Takeaway Modal */}
      <Modal
        isOpen={!!activeArticle}
        onClose={() => setActiveArticle(null)}
        title="AI Executive Takeaway"
        subtitle={activeArticle?.title}
      >
        <div className="space-y-4">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400">
            Source: <strong className="text-slate-200">{activeArticle?.source}</strong> · Published:{' '}
            {activeArticle?.publishedAt ? new Date(activeArticle.publishedAt).toLocaleString() : ''}
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
              <Sparkles className="w-4 h-4" />
              <span>Key Financial Takeaway</span>
            </div>
            {isSummarizing ? (
              <div className="py-6 flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Generating concise market takeaway with Gemini AI...</span>
              </div>
            ) : (
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{aiSummary}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setActiveArticle(null)}>
              Close
            </Button>
            {activeArticle && (
              <a
                href={activeArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium"
              >
                <span>Read Full Article</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
