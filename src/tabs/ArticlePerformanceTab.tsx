import React, { useState, useMemo } from 'react';
import { Article, TopicOption, CtaTypeOption } from '../types';
import { MOCK_ARTICLES } from '../mockData';
import { exportToCsv } from '../utils/exportCsv';
import {
  FileText,
  Filter,
  ChevronRight,
  X,
  Sparkles,
  TrendingUp,
  Tag,
  BookOpen,
  BarChart2,
  Award,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  ChevronLeft
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

type SortKey = 'title' | 'publishDate' | 'views' | 'subscribersGained' | 'conversionRate';
type SortDirection = 'asc' | 'desc';

export const ArticlePerformanceTab: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<TopicOption>('All');
  const [selectedCta, setSelectedCta] = useState<CtaTypeOption>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortKey, setSortKey] = useState<SortKey>('publishDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [leaderboardLimit, setLeaderboardLimit] = useState<number>(10);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const topics: TopicOption[] = ['All', 'Macro', 'Oil', 'Geopolitics', 'Hard Assets', 'AI', 'Markets'];
  const ctas: CtaTypeOption[] = ['All', 'Subscribe', 'Read Post', 'Reply', 'Comment', 'Restack'];

  // Handle column header sort toggle
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  // Filter & Search logic
  const filteredArticles = useMemo(() => {
    return MOCK_ARTICLES.filter((art) => {
      const matchTopic = selectedTopic === 'All' || art.topic === selectedTopic;
      const matchCta = selectedCta === 'All' || art.CTAtype === selectedCta;
      const matchSearch = searchQuery.trim() === '' ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.thesis.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTopic && matchCta && matchSearch;
    });
  }, [selectedTopic, selectedCta, searchQuery]);

  // Sort logic
  const sortedArticles = useMemo(() => {
    return [...filteredArticles].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];
      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }
      return sortDirection === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [filteredArticles, sortKey, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(sortedArticles.length / pageSize) || 1;
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedArticles.slice(start, start + pageSize);
  }, [sortedArticles, currentPage, pageSize]);

  // Chart Data: Leaderboard of Subscribers Gained
  const leaderboardData = useMemo(() => {
    return [...filteredArticles]
      .sort((a, b) => b.subscribersGained - a.subscribersGained)
      .slice(0, leaderboardLimit)
      .map(art => ({
        name: art.title.length > 24 ? art.title.substring(0, 24) + '...' : art.title,
        fullTitle: art.title,
        subscribers: art.subscribersGained,
        conversionRate: art.conversionRate,
        views: art.views,
        topic: art.topic
      }));
  }, [filteredArticles, leaderboardLimit]);

  // CSV Export Handler
  const handleExportCsv = () => {
    exportToCsv(
      'substack_articles_performance',
      sortedArticles,
      [
        { key: 'title', label: 'Article Title' },
        { key: 'publishDate', label: 'Publish Date' },
        { key: 'topic', label: 'Topic' },
        { key: 'CTAtype', label: 'CTA Type' },
        { key: 'format', label: 'Format' },
        { key: 'views', label: 'Total Views' },
        { key: 'likes', label: 'Likes' },
        { key: 'comments', label: 'Comments' },
        { key: 'subscribersGained', label: 'Subscribers Gained' },
        { key: 'conversionRate', label: 'Conversion Rate %' },
        { key: 'baselinePerformance', label: 'Baseline Performance' }
      ]
    );
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />;
    return sortDirection === 'asc'
      ? <ArrowUp className="w-3 h-3 text-amber-600 font-bold" />
      : <ArrowDown className="w-3 h-3 text-amber-600 font-bold" />;
  };

  return (
    <div className="space-y-6">
      {/* Header & Local Controls */}
      <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 border border-amber-200">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-slate-900">Article Performance</h3>
            <p className="text-xs text-slate-500">
              Showing {filteredArticles.length} total published articles across your catalog
            </p>
          </div>
        </div>

        {/* Local Filters, Search & Export */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Keyword Search Bar */}
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-xs w-full font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Topic Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-medium">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-semibold text-slate-500">Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value as TopicOption);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer"
            >
              {topics.map((t) => (
                <option key={t} value={t} className="bg-white text-slate-900">
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* CTA Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-medium">
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-semibold text-slate-500">CTA:</span>
            <select
              value={selectedCta}
              onChange={(e) => {
                setSelectedCta(e.target.value as CtaTypeOption);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer"
            >
              {ctas.map((c) => (
                <option key={c} value={c} className="bg-white text-slate-900">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Download full articles report as CSV"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* VISUAL CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Article Conversion Leaderboard Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                Subscribers Gained by Article
              </h4>
              <p className="text-xs text-slate-500">Ranked by new subscriber conversions</p>
            </div>

            {/* Display Limit Toggle: Top 5 / Top 10 / All */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-[11px] font-semibold">
              {[5, 10, 30].map(limit => (
                <button
                  key={limit}
                  onClick={() => setLeaderboardLimit(limit)}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-all ${leaderboardLimit === limit
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  {limit === 30 ? 'All' : `Top ${limit}`}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaderboardData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} width={140} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontWeight: '600' }}
                  formatter={(val: any) => [`+${val} Subscribers`, 'Signups']}
                />
                <Bar dataKey="subscribers" radius={[0, 6, 6, 0]}>
                  {leaderboardData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#d97706' : index < 3 ? '#2563eb' : '#059669'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Conversion Efficiency Comparison */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                Conversion Rate % per Article
              </h4>
              <p className="text-xs text-slate-500">Color-coded: High (&gt;2.5%) vs Medium vs Low</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Avg: 2.16%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaderboardData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-25} textAnchor="end" interval={0} />
                <YAxis stroke="#64748b" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontWeight: '600' }}
                  formatter={(val: any) => [`${val}%`, 'Conversion Rate']}
                />
                <Bar dataKey="conversionRate" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                  {leaderboardData.map((entry, index) => (
                    <Cell
                      key={`rate-cell-${index}`}
                      fill={entry.conversionRate >= 2.5 ? '#059669' : entry.conversionRate >= 1.5 ? '#d97706' : '#dc2626'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Articles Table with Clickable Column Sorting & Pagination */}
      <div className="glass-panel rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Detailed Article Performance Matrix
            </h4>
            <span className="text-xs text-slate-500">
              Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedArticles.length)} of {sortedArticles.length} articles
            </span>
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span>Per page:</span>
            {[10, 25, 50].map(sz => (
              <button
                key={sz}
                onClick={() => {
                  setPageSize(sz);
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold cursor-pointer ${pageSize === sz
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200 select-none">
              <tr>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Article Title</span>
                    {renderSortIcon('title')}
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('publishDate')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Publish Date</span>
                    {renderSortIcon('publishDate')}
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('views')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Views</span>
                    {renderSortIcon('views')}
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('subscribersGained')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Subscribers Gained</span>
                    {renderSortIcon('subscribersGained')}
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('conversionRate')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Conversion Rate</span>
                    {renderSortIcon('conversionRate')}
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    No articles match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                        <span className="truncate" title={art.title}>{art.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                      {art.publishDate}
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-slate-900">
                      {art.views.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-amber-600">
                      +{art.subscribersGained}
                    </td>
                    <td className="py-4 px-4 font-mono">
                      <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-md ${art.conversionRate >= 2.5
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                          : art.conversionRate >= 1.5
                            ? 'text-amber-700 bg-amber-50 border border-amber-200'
                            : 'text-rose-700 bg-rose-50 border border-rose-200'
                        }`}>
                        {art.conversionRate.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setActiveArticle(art)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer shadow-xs"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Navigation Footer */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentPage === p
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Article Detail Drawer / Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel max-w-2xl w-full rounded-2xl p-6 border border-slate-300 bg-white shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600 border border-amber-200">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">
                  Article Performance Drawer
                </span>
                <h3 className="text-lg font-bold font-display text-slate-900 leading-snug">
                  {activeArticle.title}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 mb-5 text-center text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Views</span>
                <strong className="text-slate-900 font-mono text-sm">{activeArticle.views.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Signups</span>
                <strong className="text-amber-600 font-mono text-sm">+{activeArticle.subscribersGained}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Conversion</span>
                <strong className="text-emerald-600 font-mono text-sm">{activeArticle.conversionRate}%</strong>
              </div>
            </div>

            <div className="space-y-3 mb-5 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>Baseline: {activeArticle.baselinePerformance}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-1">Content Thesis / Summary:</h4>
                <p className="text-slate-600 leading-relaxed">{activeArticle.thesis}</p>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-semibold">
                  Topic: {activeArticle.topic}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold">
                  CTA Type: {activeArticle.CTAtype}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                  Format: {activeArticle.format}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold font-display mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Social Media Manager (SMM) Takeaway:</span>
              </div>
              <p className="text-amber-950 leading-relaxed font-medium">
                {activeArticle.smmAdvice}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
