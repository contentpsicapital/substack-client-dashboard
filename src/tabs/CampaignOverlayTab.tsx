import React, { useState, useMemo } from 'react';
import { MOCK_ARTICLES, MOCK_NOTES } from '../mockData';
import { 
  Layers, 
  Search, 
  AlertTriangle, 
  Eye, 
  Heart, 
  MessageCircle, 
  Repeat, 
  BookOpen, 
  Share2,
  BarChart2
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

export const CampaignOverlayTab: React.FC = () => {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(MOCK_ARTICLES[0].id);

  const activeArticle = MOCK_ARTICLES.find(a => a.id === selectedArticleId) || MOCK_ARTICLES[0];
  const linkedNotes = MOCK_NOTES.filter(n => n.linkedArticleId === selectedArticleId);

  const totalNoteImpressions = linkedNotes.reduce((sum, n) => sum + n.impressions, 0);

  // Comparison Chart Data
  const campaignChartData = useMemo(() => {
    return [
      { name: 'Parent Article Views', value: activeArticle.views, fill: '#3b82f6' },
      { name: 'Promotional Notes Views', value: totalNoteImpressions, fill: '#d97706' },
    ];
  }, [activeArticle, totalNoteImpressions]);

  return (
    <div className="space-y-6">
      {/* Explicit Attribution Limitations Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-950 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-amber-900 block font-display text-sm mb-0.5">
            Platform Limitation Disclosure
          </strong>
          Item-level attribution (linking an individual Note directly to a specific subscriber conversion) is <strong>Not Reliably Available</strong> from Substack’s authenticated API responses. The Campaign Overlay pairs article metrics with supporting Notes based on directly supportable metrics (views, likes, restacks, replies).
        </div>
      </div>

      {/* Header & Searchable Article Selector */}
      <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 border border-amber-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-slate-900">Campaign Overlay</h3>
            <p className="text-xs text-slate-500">
              Cross-analyse long-form essays alongside their promotional short-form Notes
            </p>
          </div>
        </div>

        {/* Article Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium w-full md:w-auto min-w-[300px]">
          <Search className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold text-slate-500 shrink-0">Select Article:</span>
          <select
            value={selectedArticleId}
            onChange={(e) => setSelectedArticleId(e.target.value)}
            className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer w-full truncate"
          >
            {MOCK_ARTICLES.map((art) => (
              <option key={art.id} value={art.id} className="bg-white text-slate-900">
                {art.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VISUAL CHART & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article Summary Card */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Selected Parent Article</span>
            </div>

            <h3 className="text-xl font-bold font-display text-slate-900 mb-2">
              {activeArticle.title}
            </h3>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {activeArticle.thesis}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Publish Date</span>
              <strong className="text-slate-900 font-mono text-xs">{activeArticle.publishDate}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Article Views</span>
              <strong className="text-slate-900 font-mono text-xs">{activeArticle.views.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Article Likes</span>
              <strong className="text-rose-600 font-mono text-xs">{activeArticle.likes}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Article Comments</span>
              <strong className="text-amber-600 font-mono text-xs">{activeArticle.comments}</strong>
            </div>
          </div>
        </div>

        {/* Campaign Reach Visual Comparison Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold font-display text-slate-900 mb-1 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              Campaign Reach Impact
            </h4>
            <p className="text-xs text-slate-500 mb-4">Essay Views vs Promo Notes Views</p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontWeight: '600' }}
                    formatter={(val: any) => [val.toLocaleString(), 'Views']}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {campaignChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <span className="text-[11px] text-slate-500 text-center font-medium block mt-2">
            Total Campaign Reach: <strong>{(activeArticle.views + totalNoteImpressions).toLocaleString()}</strong> views
          </span>
        </div>
      </div>

      {/* Supporting Notes Table */}
      <div className="glass-panel rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-600" />
            Supporting Notes Promos ({linkedNotes.length} Linked Notes)
          </h4>
          <span className="text-xs text-slate-500">Short-form teasers driving awareness</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Note Hook / Teaser</th>
                <th className="py-3.5 px-4">Publish Date</th>
                <th className="py-3.5 px-4">Format</th>
                <th className="py-3.5 px-4">Impressions</th>
                <th className="py-3.5 px-4">Likes</th>
                <th className="py-3.5 px-4">Restacks</th>
                <th className="py-3.5 px-4">Replies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {linkedNotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    No promotional Notes linked to this specific article yet.
                  </td>
                </tr>
              ) : (
                linkedNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-900 max-w-md">
                      <p className="line-clamp-2 leading-relaxed">{note.hook}</p>
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
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-blue-600" /> {note.impressions.toLocaleString()}
                      </span>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
