import React from 'react';
import { MOCK_TRAFFIC_SOURCES } from '../mockData';
import { Globe, HelpCircle, ArrowUpRight, BarChart2 } from 'lucide-react';
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

export const TrafficSourcesTab: React.FC = () => {
  // Sort traffic sources by conversion rate for ranking chart
  const rankingData = [...MOCK_TRAFFIC_SOURCES]
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .map(ts => ({
      source: ts.source.length > 25 ? ts.source.substring(0, 25) + '...' : ts.source,
      fullSource: ts.source,
      rate: ts.conversionRate,
      subscribers: ts.newSubscribers,
      category: ts.category
    }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 border border-amber-200">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-slate-900">Traffic Sources & Acquisition</h3>
            <p className="text-xs text-slate-500">
              Reader acquisition breakdown across the 5 canonical Substack traffic categories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>5 Traffic Taxonomy Categories Active</span>
        </div>
      </div>

      {/* VISUAL CHART: Conversion Rate Quality Ranking Horizontal Bar Chart */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              Traffic Source Conversion Quality Ranking (%)
            </h4>
            <p className="text-xs text-slate-500">Visually ranks acquisition channels by conversion efficiency</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Top Channel: Substack App (5.30%)
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rankingData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={11} unit="%" />
              <YAxis dataKey="source" type="category" stroke="#475569" fontSize={11} width={170} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', fontWeight: '600' }}
                formatter={(val: any) => [`${val}% Conversion`, 'Conversion Rate']}
              />
              <Bar dataKey="rate" radius={[0, 8, 8, 0]}>
                {rankingData.map((entry, index) => (
                  <Cell 
                    key={`traffic-cell-${index}`} 
                    fill={entry.rate >= 5.0 ? '#059669' : entry.rate >= 3.0 ? '#2563eb' : entry.rate >= 2.0 ? '#d97706' : '#64748b'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic Sources Table */}
      <div className="glass-panel rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Traffic Source</th>
                <th className="py-3.5 px-4">Source Category</th>
                <th className="py-3.5 px-4">Unique Visitors</th>
                <th className="py-3.5 px-4">New Subscribers</th>
                <th className="py-3.5 px-4">Conversion Rate</th>
                <th className="py-3.5 px-4">Quality Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {MOCK_TRAFFIC_SOURCES.map((ts) => (
                <tr key={ts.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-900">
                    <div>
                      <span className="block">{ts.source}</span>
                      {ts.description && (
                        <span className="text-[10px] text-slate-500 font-normal leading-tight block mt-0.5 max-w-sm">
                          {ts.description}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider">
                      {ts.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono font-semibold text-slate-900">
                    {ts.uniqueVisitors.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-amber-600">
                    +{ts.newSubscribers.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-slate-900">
                    {ts.conversionRate.toFixed(2)}%
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase px-2.5 py-1 rounded-lg ${
                      ts.qualityClassification === 'High'
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                        : ts.qualityClassification === 'Medium'
                        ? 'text-amber-700 bg-amber-50 border border-amber-200'
                        : 'text-slate-700 bg-slate-100 border border-slate-200'
                    }`}>
                      <ArrowUpRight className="w-3 h-3" /> {ts.qualityClassification} Quality
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explainer Card for Direct / Unattributed Traffic */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-amber-600">
          <HelpCircle className="w-5 h-5" />
          <h4 className="text-sm font-bold font-display text-slate-900">
            Understanding Direct / Unattributed Traffic
          </h4>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
          <strong>Direct / Unattributed</strong> traffic accounts for visits where the Substack web analytics engine does not receive a usable referrer string in the HTTP header. This includes visits originating from:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs text-slate-600">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-slate-900 block mb-1">1. Email Clients & Apps</strong>
            <span>Readers clicking essay links inside desktop Apple Mail, Outlook, or mobile mail clients.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-slate-900 block mb-1">2. Private Tabs & VPNs</strong>
            <span>Browser instances with strict privacy extensions, incognito windows, or blocked trackers.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <strong className="text-slate-900 block mb-1">3. Direct Bookmarks</strong>
            <span>Returning subscribers typing your Substack URL directly or opening saved bookmarks.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
