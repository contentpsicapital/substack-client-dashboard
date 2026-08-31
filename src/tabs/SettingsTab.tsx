import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Key, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Save,
  FileSpreadsheet
} from 'lucide-react';
import { MOCK_ARTICLES, MOCK_NOTES, MOCK_TRAFFIC_SOURCES } from '../mockData';
import { exportToCsv } from '../utils/exportCsv';

export const SettingsTab: React.FC = () => {
  const [sessionCookie, setSessionCookie] = useState<string>('s%3ArFPUdVKCOosKmMxq5tt75WXoNvos8XhD.q4fd%2FD8fRDeb8p9FbPS02hc48nhUHh8cAjsq0Uoxe6k');
  const [syncFrequency, setSyncFrequency] = useState<string>('Daily');
  const [highConversionMin, setHighConversionMin] = useState<number>(2.5);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportCombined = () => {
    setIsExporting(true);

    // Prepare combined rows of articles with their performance
    const combinedData = MOCK_ARTICLES.map(art => {
      const linkedNotes = MOCK_NOTES.filter(n => n.linkedArticleId === art.id);
      const totalNoteImpressions = linkedNotes.reduce((s, n) => s + n.impressions, 0);
      const totalNoteLikes = linkedNotes.reduce((s, n) => s + n.likes, 0);
      return {
        articleTitle: art.title,
        publishDate: art.publishDate,
        topic: art.topic,
        CTAtype: art.CTAtype,
        views: art.views,
        subscribersGained: art.subscribersGained,
        conversionRate: `${art.conversionRate}%`,
        supportingNotesCount: linkedNotes.length,
        supportingNotesViews: totalNoteImpressions,
        supportingNotesLikes: totalNoteLikes,
        smmRecommendation: art.smmAdvice
      };
    });

    exportToCsv(
      'substack_combined_growth_analytics',
      combinedData,
      [
        { key: 'articleTitle', label: 'Article Title' },
        { key: 'publishDate', label: 'Publish Date' },
        { key: 'topic', label: 'Topic Category' },
        { key: 'CTAtype', label: 'CTA Strategy' },
        { key: 'views', label: 'Essay Views' },
        { key: 'subscribersGained', label: 'Subscribers Gained' },
        { key: 'conversionRate', label: 'Conversion Rate' },
        { key: 'supportingNotesCount', label: 'Linked Notes Count' },
        { key: 'supportingNotesViews', label: 'Linked Notes Total Views' },
        { key: 'supportingNotesLikes', label: 'Linked Notes Total Likes' },
        { key: 'smmRecommendation', label: 'SMM Takeaway Advice' }
      ]
    );

    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 flex items-center gap-3">
        <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 border border-amber-200">
          <SettingsIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold font-display text-slate-900">Dashboard Settings & Data Connections</h3>
          <p className="text-xs text-slate-500">
            Configure authenticated Substack API access keys, sync frequencies, and export reports
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Connection Section */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h4 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-600" />
            Authenticated Substack API Permission Key
          </h4>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 font-medium">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Active Cookie: substack.sid verified (psicapital.substack.com)</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Because detailed post statistics are private to your publication, the automated background scraper uses this session key to query private Substack endpoints without storing your password.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Substack Session Cookie (`substack.sid`)
            </label>
            <input
              type="password"
              value={sessionCookie}
              onChange={(e) => setSessionCookie(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono outline-none focus:border-amber-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Sync Frequency Section */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h4 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600" />
            Automated Data Sync Frequency
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Every 6 Hours', 'Daily', 'Manual Only'].map((freq) => (
              <button
                type="button"
                key={freq}
                onClick={() => setSyncFrequency(freq)}
                className={`p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                  syncFrequency === freq
                    ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Thresholds */}
        <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h4 className="text-sm font-bold font-display text-slate-900">
            SMM Metric Threshold Preferences
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                High Conversion Benchmark (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={highConversionMin}
                onChange={(e) => setHighConversionMin(parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono outline-none focus:border-amber-500 focus:bg-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Articles exceeding this rate receive "High Conversion" badges in SMM diagnostics.
              </span>
            </div>
          </div>
        </div>

        {/* Save Button & Real CSV Export */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>

            {isSaved && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settings updated successfully!
              </span>
            )}
          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            onClick={handleExportCombined}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{isExporting ? 'Generating CSV...' : 'Download Full Combined CSV Report'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
