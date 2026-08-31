import React, { useState, useEffect } from 'react';
import { TrafficSourceItem } from '../types';
import { MOCK_TRAFFIC_SOURCES } from '../mockData';
import { exportToCsv } from '../utils/exportCsv';
import { 
  Globe, 
  HelpCircle, 
  ArrowUpRight, 
  BarChart2, 
  Upload, 
  CheckCircle2, 
  FileSpreadsheet, 
  RotateCcw, 
  Download,
  AlertCircle
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

const LOCAL_STORAGE_KEY = 'substack_traffic_sources_csv_v1';

export const TrafficSourcesTab: React.FC = () => {
  const [sources, setSources] = useState<TrafficSourceItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return MOCK_TRAFFIC_SOURCES;
  });

  const [isCustomImport, setIsCustomImport] = useState<boolean>(() => {
    return !!localStorage.getItem(LOCAL_STORAGE_KEY);
  });
  const [importFileName, setImportFileName] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Save custom uploaded sources to localStorage
  useEffect(() => {
    if (isCustomImport && sources.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sources));
    }
  }, [sources, isCustomImport]);

  // Robust Substack CSV parser
  const handleFileUpload = (file: File) => {
    setUploadError(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) throw new Error('File content is empty.');

        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) throw new Error('CSV must contain a header and at least 1 data row.');

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());

        // Find relevant column indexes
        const sourceIdx = headers.findIndex(h => h.includes('source') || h.includes('referrer') || h.includes('name'));
        const categoryIdx = headers.findIndex(h => h.includes('category') || h.includes('type'));
        const visitorIdx = headers.findIndex(h => h.includes('visitor') || h.includes('view') || h.includes('count'));
        const subIdx = headers.findIndex(h => h.includes('sub') || h.includes('signup') || h.includes('conversion'));
        const convIdx = headers.findIndex(h => h.includes('rate') || h.includes('%'));

        const parsedItems: TrafficSourceItem[] = [];

        for (let i = 1; i < lines.length; i++) {
          // Naive CSV row split handling quoted strings
          const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
          if (!row || row.length === 0) continue;

          const clean = (val: string) => (val || '').replace(/^"|"$/g, '').trim();

          const sourceName = sourceIdx !== -1 && row[sourceIdx] ? clean(row[sourceIdx]) : `Source ${i}`;
          let categoryName: any = categoryIdx !== -1 && row[categoryIdx] ? clean(row[categoryIdx]) : 'Substack Internal';
          if (!['Substack Internal', 'Organic Search', 'Social Media', 'Direct / Unattributed', 'Other External'].includes(categoryName)) {
            categoryName = 'Other External';
          }
          
          const rawVisitors = visitorIdx !== -1 && row[visitorIdx] ? clean(row[visitorIdx]).replace(/,/g, '') : '0';
          const visitors = parseInt(rawVisitors, 10) || 0;

          const rawSubs = subIdx !== -1 && row[subIdx] ? clean(row[subIdx]).replace(/[^0-9]/g, '') : '0';
          const subs = parseInt(rawSubs, 10) || 0;

          let convRate = 0;
          if (convIdx !== -1 && row[convIdx]) {
            convRate = parseFloat(clean(row[convIdx]).replace(/%/g, '')) || 0;
          } else {
            convRate = visitors > 0 ? Number(((subs / visitors) * 100).toFixed(2)) : 0;
          }

          let quality: 'High' | 'Medium' | 'Low' = 'Low';
          if (convRate >= 5.0) quality = 'High';
          else if (convRate >= 2.5) quality = 'Medium';

          parsedItems.push({
            id: `imported-${i}`,
            source: sourceName,
            category: categoryName,
            uniqueVisitors: visitors,
            newSubscribers: subs,
            conversionRate: convRate,
            qualityClassification: quality,
            description: `Imported from Substack export file: ${file.name}`
          });
        }

        if (parsedItems.length === 0) {
          throw new Error('Could not parse any valid traffic rows from the CSV file.');
        }

        setSources(parsedItems);
        setIsCustomImport(true);
        setImportFileName(file.name);
      } catch (err: any) {
        setUploadError(err.message || 'Failed to parse CSV file. Please check file format.');
      }
    };

    reader.readAsText(file);
  };

  const handleResetToBaseline = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setSources(MOCK_TRAFFIC_SOURCES);
    setIsCustomImport(false);
    setImportFileName('');
    setUploadError(null);
  };

  // Sort ranking data by Conversion Rate descending for the horizontal bar chart
  const rankingData = [...sources]
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .map(ts => ({
      source: ts.source.length > 25 ? ts.source.substring(0, 25) + '...' : ts.source,
      fullSource: ts.source,
      rate: ts.conversionRate,
      subscribers: ts.newSubscribers,
      category: ts.category
    }));

  const topChannel = rankingData[0] || { fullSource: 'N/A', rate: 0 };

  const handleExportCsv = () => {
    exportToCsv('substack_traffic_sources', sources, [
      { key: 'source', label: 'Traffic Source' },
      { key: 'category', label: 'Source Category' },
      { key: 'uniqueVisitors', label: 'Unique Visitors' },
      { key: 'newSubscribers', label: 'New Subscribers' },
      { key: 'conversionRate', label: 'Conversion Rate %' },
      { key: 'qualityClassification', label: 'Quality Classification' }
    ]);
  };

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
              Official Substack Traffic Export Breakdown & Conversion Ranking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCustomImport ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Live Substack CSV Active ({sources.length} sources)
              </span>
              <button
                onClick={handleResetToBaseline}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
                title="Reset to default baseline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>CSV Importer Ready</span>
            </div>
          )}

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* CSV UPLOADER ZONE */}
      <div className="glass-panel p-5 rounded-2xl bg-gradient-to-r from-amber-50/60 via-white to-amber-50/40 border border-amber-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-amber-100/70 rounded-xl text-amber-700 border border-amber-200 shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <span>Import Official Substack Traffic CSV</span>
                {isCustomImport && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300">
                    File: {importFileName || 'Substack Traffic Export'}
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Log into <strong>psicapital.substack.com</strong> ➔ <strong>Stats</strong> ➔ <strong>Traffic</strong> ➔ <strong>Export CSV</strong>. Drop the downloaded file here to render your exact client traffic metrics.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0">
            <Upload className="w-4 h-4" />
            <span>{isCustomImport ? 'Update CSV File' : 'Upload Substack Traffic CSV'}</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>

        {uploadError && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* VISUAL CHART: Conversion Rate Quality Ranking Horizontal Bar Chart */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              Traffic Source Conversion Quality Ranking (%)
            </h4>
            <p className="text-xs text-slate-500">Ranks acquisition channels by conversion efficiency</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Top Channel: {topChannel.fullSource} ({topChannel.rate.toFixed(2)}%)
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
                    fill={entry.rate >= 5.0 ? '#059669' : entry.rate >= 2.5 ? '#2563eb' : '#d97706'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic Sources Table */}
      <div className="glass-panel rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {isCustomImport ? 'Imported Substack Traffic Sources' : 'Traffic Acquisition Matrix'}
          </h4>
          <span className="text-xs text-slate-500 font-medium">
            Showing {sources.length} total channels
          </span>
        </div>

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
              {sources.map((ts) => (
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
