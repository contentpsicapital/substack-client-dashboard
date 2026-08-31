import React, { useState, useMemo } from 'react';
import { NoteFormatOption } from '../types';
import { MOCK_NOTES } from '../mockData';
import { exportToCsv } from '../utils/exportCsv';
import {
  MessageSquare,
  Filter,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Heart,
  Repeat,
  MessageCircle,
  UserCheck,
  Layers,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

type NoteSortKey = 'publishDate' | 'impressions' | 'likes' | 'restacks' | 'replies' | 'profileClicks' | 'subscribersGained';
type SortDirection = 'asc' | 'desc';

export const NotesPerformanceTab: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<NoteFormatOption>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortKey, setSortKey] = useState<NoteSortKey>('publishDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const formats: NoteFormatOption[] = ['All', 'Chart', 'Quote', 'Text', 'Image'];

  const handleSort = (key: NoteSortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  // Filter & Search logic
  const filteredNotes = useMemo(() => {
    return MOCK_NOTES.filter((note) => {
      const matchFormat = selectedFormat === 'All' || note.format === selectedFormat;
      const matchSearch = searchQuery.trim() === '' ||
        note.hook.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFormat && matchSearch;
    });
  }, [selectedFormat, searchQuery]);

  // Sort logic
  const sortedNotes = useMemo(() => {
    return [...filteredNotes].sort((a, b) => {
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
  }, [filteredNotes, sortKey, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(sortedNotes.length / pageSize) || 1;
  const paginatedNotes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedNotes.slice(start, start + pageSize);
  }, [sortedNotes, currentPage, pageSize]);

  // Aggregate Funnel Metrics
  const totalImpressions = filteredNotes.reduce((sum, n) => sum + n.impressions, 0);
  const totalProfileClicks = filteredNotes.reduce((sum, n) => sum + n.profileClicks, 0);
  const totalSubscribersGained = filteredNotes.reduce((sum, n) => sum + n.subscribersGained, 0);

  const clickThroughRate = totalImpressions > 0 ? ((totalProfileClicks / totalImpressions) * 100).toFixed(1) : '0';
  const conversionRate = totalProfileClicks > 0 ? ((totalSubscribersGained / totalProfileClicks) * 100).toFixed(1) : '0';

  // Grouped Bar Chart Data by Format
  const formatChartData = useMemo(() => {
    const formatTypes: NoteFormatOption[] = ['Chart', 'Quote', 'Text', 'Image'];
    return formatTypes.map(fmt => {
      const notesOfFmt = MOCK_NOTES.filter(n => n.format === fmt);
      const count = notesOfFmt.length || 1;
      const avgViews = Math.round(notesOfFmt.reduce((s, n) => s + n.impressions, 0) / count);
      const avgClicks = Math.round(notesOfFmt.reduce((s, n) => s + n.profileClicks, 0) / count);
      const avgSubs = Math.round(notesOfFmt.reduce((s, n) => s + n.subscribersGained, 0) / count);
      return {
        format: fmt,
        avgImpressions: avgViews,
        avgProfileClicks: avgClicks,
        avgSubscribers: avgSubs
      };
    });
  }, []);

  const handleExportCsv = () => {
    exportToCsv(
      'substack_notes_performance',
      sortedNotes,
      [
        { key: 'hook', label: 'Note Hook' },
        { key: 'publishDate', label: 'Publish Date' },
        { key: 'format', label: 'Format' },
        { key: 'impressions', label: 'Impressions / Views' },
        { key: 'likes', label: 'Likes' },
        { key: 'restacks', label: 'Restacks' },
        { key: 'replies', label: 'Replies' },
        { key: 'profileClicks', label: 'Profile Clicks' },
        { key: 'subscribersGained', label: 'Subscribers Gained' }
      ]
    );
  };

  const renderSortIcon = (key: NoteSortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-60" />;
    return sortDirection === 'asc'
      ? <ArrowUp className="w-3 h-3 text-amber-600 font-bold" />
      : <ArrowDown className="w-3 h-3 text-amber-600 font-bold" />;
  };

  return (
    <div className="space-y-6">
      {/* Required Canonical Disclosure Banner */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-xs text-blue-950 shadow-xs">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-blue-900 block font-display text-sm mb-0.5">Notes Channel & Aggregate Attribution Disclaimer</strong>
          This tab focuses on short-form Substack Notes, showing individual Note engagement alongside an aggregate Substack Internal discovery funnel. The funnel provides channel-level context and does not attribute profile activity or subscriber gains to individual Notes.
        </div>
      </div>

      {/* Header & Local Controls */}
      <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 border border-amber-200">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-slate-900">Notes Performance</h3>
            <p className="text-xs text-slate-500">
              Showing {filteredNotes.length} total short-form Substack Notes
            </p>
          </div>
        </div>

        {/* Local Search, Filter & Export */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search notes..."
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

          {/* Note Format Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-medium">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-semibold text-slate-500">Format:</span>
            <select
              value={selectedFormat}
              onChange={(e) => {
                setSelectedFormat(e.target.value as NoteFormatOption);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer"
            >
              {formats.map((f) => (
                <option key={f} value={f} className="bg-white text-slate-900">
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Download full notes report as CSV"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* VISUAL CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Note Format Comparative Performance Chart */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-600" />
                Note Format Reach vs. Profile Clicks
              </h4>
              <p className="text-xs text-slate-500">Comparing Average Impressions & Profile Clicks by Format</p>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Best Reach: Text / Chart
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formatChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="format" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontWeight: '600' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#475569' }} />
                <Bar dataKey="avgImpressions" name="Avg Views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgProfileClicks" name="Avg Clicks" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Substack Internal Discovery Funnel (Visual Funnel Bar) */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Substack Discovery Funnel (Channel Aggregate)
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                CTR: {clickThroughRate}%
              </span>
            </div>

            {/* Visual Funnel Flow */}
            <div className="space-y-4 my-2">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Step 1: Impressions (Total Views)</span>
                  <span className="font-mono text-slate-900">{totalImpressions.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Step 2: Profile Clicks ({clickThroughRate}% CTR)</span>
                  <span className="font-mono text-amber-600 font-bold">{totalProfileClicks.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(Number(clickThroughRate) * 3, 15)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Step 3: New Subscribers ({conversionRate}% Conv.)</span>
                  <span className="font-mono text-emerald-600 font-bold">+{totalSubscribersGained}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(Number(conversionRate) * 4, 10)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium">
            💡 <strong>Channel Performance:</strong> Every 1,000 Note views drive approximately <strong>{clickThroughRate}% CTR</strong> to creator profiles.
          </div>
        </div>
      </div>

      {/* Notes Performance Table with Sorting and Pagination */}
      <div className="glass-panel rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Individual Notes Engagement Matrix
            </h4>
            <span className="text-xs text-slate-500">
              Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedNotes.length)} of {sortedNotes.length} notes
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
                <th className="py-3.5 px-4">Note Hook</th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('publishDate')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Date</span>
                    {renderSortIcon('publishDate')}
                  </div>
                </th>
                <th className="py-3.5 px-4">Format</th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('impressions')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Impressions</span>
                    {renderSortIcon('impressions')}
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('likes')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Likes</span>
                    {renderSortIcon('likes')}
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('restacks')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Restacks</span>
                    {renderSortIcon('restacks')}
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('replies')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Replies</span>
                    {renderSortIcon('replies')}
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('profileClicks')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Profile Clicks</span>
                    {renderSortIcon('profileClicks')}
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('subscribersGained')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Subscribers</span>
                    {renderSortIcon('subscribersGained')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedNotes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-medium">
                    No notes match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-900 max-w-sm">
                      <p className="line-clamp-2 leading-relaxed" title={note.hook}>{note.hook}</p>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono text-[11px]">
                      {note.publishDate}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-bold uppercase">
                        {note.format}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-slate-900">
                      {note.impressions.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-mono text-rose-600 font-semibold">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-500" /> {note.likes}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-emerald-700 font-semibold">
                      <span className="flex items-center gap-1">
                        <Repeat className="w-3 h-3 text-emerald-600" /> {note.restacks}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-amber-700 font-semibold">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-amber-600" /> {note.replies}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-amber-600">
                      {note.profileClicks}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-emerald-600">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-emerald-600" /> +{note.subscribersGained}
                      </span>
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

      {/* Note Format Categories Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {formats.filter(f => f !== 'All').map((fmt) => {
          const formatNotes = MOCK_NOTES.filter(n => n.format === fmt);
          const avgViews = formatNotes.length > 0 ? Math.round(formatNotes.reduce((s, n) => s + n.impressions, 0) / formatNotes.length) : 0;
          return (
            <div key={fmt} className="glass-panel p-4 rounded-xl bg-white border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{fmt} Format</span>
                <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-xl font-bold font-display text-slate-900">{avgViews.toLocaleString()}</p>
              <span className="text-[10px] text-slate-500">Average views per Note</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
