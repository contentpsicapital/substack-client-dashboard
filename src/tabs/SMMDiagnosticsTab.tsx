import React, { useState, useMemo } from 'react';
import { DiagnosticTypeOption, TopicOption } from '../types';
import { MOCK_SMM_DIAGNOSTICS } from '../mockData';
import { 
  Lightbulb, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle,
  PieChart as PieIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  Compass,
  Calendar,
  Layers,
  ArrowRight,
  Flame,
  FileText,
  MessageSquare,
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
  Cell
} from 'recharts';

export const SMMDiagnosticsTab: React.FC = () => {
  // Filter States
  const [selectedContentType, setSelectedContentType] = useState<'All' | 'Article' | 'Note'>('All');
  const [selectedDiagType, setSelectedDiagType] = useState<DiagnosticTypeOption>('All');
  const [selectedTopic, setSelectedTopic] = useState<TopicOption>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);

  // Future Article Blueprint Generator States
  const [plannerTopic, setPlannerTopic] = useState<TopicOption>('Oil');
  const [plannerFormat, setPlannerFormat] = useState<string>('Deep-Dive Essay');

  const diagTypes: DiagnosticTypeOption[] = [
    'All', 
    'High Conversion', 
    'CTA Opportunity', 
    'Low Engagement'
  ];
  const topics: TopicOption[] = ['All', 'Oil', 'Geopolitics', 'Macro', 'Hard Assets', 'AI', 'Markets'];

  // Filtered Diagnostics
  const filteredDiagnostics = useMemo(() => {
    return MOCK_SMM_DIAGNOSTICS.filter((diag) => {
      const matchContent = selectedContentType === 'All' || diag.contentType === selectedContentType;
      const matchDiag = selectedDiagType === 'All' || diag.diagnosticType === selectedDiagType;
      const matchTopic = selectedTopic === 'All' || (diag.topic && diag.topic === selectedTopic);
      const matchSearch = searchQuery.trim() === '' ||
        diag.contentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        diag.theWhy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        diag.futureAction.toLowerCase().includes(searchQuery.toLowerCase());
      return matchContent && matchDiag && matchTopic && matchSearch;
    });
  }, [selectedContentType, selectedDiagType, selectedTopic, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredDiagnostics.length / pageSize) || 1;
  const paginatedDiagnostics = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDiagnostics.slice(start, start + pageSize);
  }, [filteredDiagnostics, currentPage, pageSize]);

  // Chart Data: Diagnostic Types Distribution
  const diagSummaryData = useMemo(() => {
    const counts: Record<string, number> = {
      'High Conversion': 0,
      'CTA Opportunity': 0,
      'Low Engagement': 0,
    };
    MOCK_SMM_DIAGNOSTICS.forEach(d => {
      if (counts[d.diagnosticType] !== undefined) {
        counts[d.diagnosticType]++;
      }
    });
    return [
      { category: 'High Conversion', count: counts['High Conversion'], fill: '#059669' },
      { category: 'CTA Opportunity', count: counts['CTA Opportunity'], fill: '#d97706' },
      { category: 'Low Engagement', count: counts['Low Engagement'], fill: '#dc2626' },
    ];
  }, []);

  // Future Article Strategy Generation Blueprint
  const blueprintStrategy = useMemo(() => {
    switch (plannerTopic) {
      case 'Oil':
        return {
          momentum: '🔥 Top Momentum (Avg. 2.8% Conversion)',
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          idealCTA: 'Inline Callout after Section 2: "Subscribe to PSI Refining & Physical Crude Flow Dispatches"',
          placementTip: 'Place CTA at 38% scroll depth immediately below the first tanker flow or inventory draw chart.',
          timeline: [
            { step: 'T-2 Hours (Teaser Note)', action: 'Post 2-sentence Note highlighting a counter-intuitive inventory draw stat without revealing full conclusion.' },
            { step: 'Launch (8:30 AM EST)', action: 'Publish main essay with high-contrast header graphic and free email signup block.' },
            { step: 'T+4 Hours (Follow-up Note)', action: 'Restack a key quote from section 3 asking: "How are you positioning around the STS relay bottleneck?"' }
          ],
          hooks: [
            '"The market survived on stored barrels. The next phase is an active choice."',
            '"Most analysts are watching crude price. The real stress is emerging in refinery yield distillation."',
            '"15% slowing in Hormuz tanker speeds isn\'t a transit delay—it\'s a structural reallocation."'
          ]
        };
      case 'Geopolitics':
        return {
          momentum: '⚡ High Virality (Top Restack Velocity)',
          badge: 'bg-blue-50 text-blue-800 border-blue-200',
          idealCTA: 'Header Free-Preview Lock: "Unlock Private Geopolitical Corridor Intelligence"',
          placementTip: 'Include 300 words of public situational briefing, then lock specialized trade route analysis behind free email signup.',
          timeline: [
            { step: 'T-1 Hour (Quote Note)', action: 'Post a direct pull-quote regarding naval escrow or insurance rate spikes.' },
            { step: 'Launch (9:00 AM EST)', action: 'Publish full dispatch with geopolitical map markup.' },
            { step: 'T+6 Hours (Chart Note)', action: 'Share regional chokepoint transit breakdown graphic.' }
          ],
          hooks: [
            '"A declaration of transit is not insurance cover. Here is who is actually bearing maritime risk."',
            '"Three diplomatic negotiations are underway this week. None of them involve the physical strait."',
            '"The tollbooth didn\'t close—it simply relocated 140 nautical miles south."'
          ]
        };
      case 'Hard Assets':
        return {
          momentum: '📈 High Retention (Deep Institutional Readership)',
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          idealCTA: 'Mid-Article Subscribe Block: "Get Weekly Ore-to-Metal Supply Chain Teardowns"',
          placementTip: 'Insert subscribe prompt right after presenting mining CAPEX / acid supply shortage data.',
          timeline: [
            { step: 'T-3 Hours (Data Note)', action: 'Post quick stat on LME warehouse inventory vs smelting lead times.' },
            { step: 'Launch (7:30 AM EST)', action: 'Publish full supply chain breakdown.' },
            { step: 'T+5 Hours (Discussion Note)', action: 'Ask commodity PMs about physical delivery bottlenecks.' }
          ],
          hooks: [
            '"The mine has high-grade ore. The processing plant still needs acid it cannot source."',
            '"Central banks accelerated gold accumulation this quarter—yet spot fell. Here is the vault variable."',
            '"The bottleneck is not extraction capacity; it is the physical refining corridor."'
          ]
        };
      case 'AI':
      case 'Macro':
      default:
        return {
          momentum: '💡 High Search Intent (Strong Direct Subscriptions)',
          badge: 'bg-purple-50 text-purple-800 border-purple-200',
          idealCTA: 'Bottom Discussion & Newsletter Join Prompt',
          placementTip: 'Anchor the subscribe box above the concluding macro forecast table.',
          timeline: [
            { step: 'T-2 Hours (Macro Note)', action: 'Share chart on 10-year yield curve steepening vs power demand.' },
            { step: 'Launch (8:00 AM EST)', action: 'Publish macro synthesis.' },
            { step: 'T+3 Hours (Recap Note)', action: 'Summarize 3 core takeaways in a bulleted Note.' }
          ],
          hooks: [
            '"Announced gigawatts on paper are not operational megawatts on the grid."',
            '"The rate didn\'t move today, but the financing path for long-duration infrastructure did."',
            '"Lower long-term yields are not a free lunch for power-hungry compute centers."'
          ]
        };
    }
  }, [plannerTopic]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 border border-amber-200">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-slate-900">SMM Diagnostics & Engagement Playbook</h3>
            <p className="text-xs text-slate-500">
              Detailed SMM diagnosis for all 30 articles and 20 notes, plus future content engagement planner
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            50 Content Diagnostics Active
          </span>
        </div>
      </div>

      {/* 🔮 FUTURE ARTICLE ENGAGEMENT BLUEPRINT GENERATOR */}
      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-amber-50/30 border border-amber-200/80 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold font-display text-slate-900">
                  Future Article Engagement Blueprint Generator
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                  Strategic Planner
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Select your next topic to generate tailored CTA placement, Note cross-promotion schedules, and tested hook templates.
              </p>
            </div>
          </div>

          {/* Generator Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold shadow-xs">
              <span className="text-slate-500">Topic:</span>
              <select
                value={plannerTopic}
                onChange={(e) => setPlannerTopic(e.target.value as TopicOption)}
                className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer"
              >
                {['Oil', 'Geopolitics', 'Hard Assets', 'Macro', 'AI'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold shadow-xs">
              <span className="text-slate-500">Format:</span>
              <select
                value={plannerFormat}
                onChange={(e) => setPlannerFormat(e.target.value)}
                className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer"
              >
                {['Deep-Dive Essay', 'Weekly Scorecard', 'Market Playbook'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Blueprint Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Pillar 1: Topic Momentum & CTA Strategy */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Pillar 1: CTA Strategy
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${blueprintStrategy.badge}`}>
                  {blueprintStrategy.momentum}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <strong className="block text-slate-900 font-bold mb-1">Recommended CTA Blueprint:</strong>
                  <p className="text-amber-800 font-semibold">{blueprintStrategy.idealCTA}</p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-emerald-950">
                  <strong className="block text-emerald-900 font-bold mb-1">Optimal Placement:</strong>
                  <p className="text-xs leading-relaxed font-medium">{blueprintStrategy.placementTip}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 2: Cross-Promotion Note Schedule */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-500" />
                Pillar 2: 3-Stage Note Teaser Schedule
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                3-Part Rollout
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {blueprintStrategy.timeline.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-900 uppercase block mb-0.5">
                    {item.step}
                  </span>
                  <p className="text-slate-700 leading-snug">{item.action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pillar 3: Tested Hook Frameworks */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Pillar 3: High-Converting Hooks
              </span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                Ready to Use
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {blueprintStrategy.hooks.map((hook, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-purple-50/50 border border-purple-200/80 text-purple-950 font-medium leading-relaxed italic">
                  {hook}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR FOR 50 DIAGNOSTICS */}
      <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        {/* Content Type Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          {(['All', 'Article', 'Note'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedContentType(type);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedContentType === type
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type === 'All' ? 'All Content (50)' : type === 'Article' ? 'Articles (30)' : 'Notes (20)'}
            </button>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search diagnostic insights..."
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

          {/* Diagnostic Category */}
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-medium">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={selectedDiagType}
              onChange={(e) => {
                setSelectedDiagType(e.target.value as DiagnosticTypeOption);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer"
            >
              {diagTypes.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-medium">
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
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DIAGNOSTIC RESULTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedDiagnostics.length === 0 ? (
          <div className="col-span-2 glass-panel p-12 text-center text-slate-500 rounded-2xl bg-white border border-slate-200 font-medium">
            No diagnostic playbooks match your current filter combination.
          </div>
        ) : (
          paginatedDiagnostics.map((diag) => (
            <div key={diag.id} className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 glass-panel-hover flex flex-col justify-between shadow-xs">
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase flex items-center gap-1">
                      {diag.contentType === 'Article' ? <FileText className="w-3 h-3 text-amber-600" /> : <MessageSquare className="w-3 h-3 text-blue-600" />}
                      {diag.contentType}
                    </span>

                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${
                      diag.diagnosticType === 'CTA Opportunity'
                        ? 'text-amber-700 bg-amber-50 border border-amber-200'
                        : diag.diagnosticType === 'High Conversion'
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                        : 'text-rose-700 bg-rose-50 border border-rose-200'
                    }`}>
                      {diag.diagnosticType === 'CTA Opportunity' && <AlertCircle className="w-3.5 h-3.5" />}
                      {diag.diagnosticType === 'High Conversion' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {diag.diagnosticType === 'Low Engagement' && <TrendingUp className="w-3.5 h-3.5" />}
                      {diag.diagnosticType}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-700 font-bold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                    {diag.metricHighlight}
                  </span>
                </div>

                {/* Content Title */}
                <h4 className="text-sm font-bold font-display text-slate-900 mb-3 leading-snug">
                  {diag.contentTitle}
                </h4>

                {/* The Metric Diagnosis (The Why) */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-3 text-xs">
                  <strong className="text-amber-800 block font-display text-[10px] mb-0.5 uppercase tracking-wider">
                    🔍 The Metric Diagnosis (The Why):
                  </strong>
                  <p className="text-slate-700 leading-relaxed font-medium">{diag.theWhy}</p>
                </div>

                {/* Engagement Friction Point */}
                {diag.frictionPoint && (
                  <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200 mb-3 text-xs">
                    <strong className="text-rose-800 block font-display text-[10px] mb-0.5 uppercase tracking-wider">
                      ⚠️ Engagement Friction Point:
                    </strong>
                    <p className="text-rose-950 leading-relaxed font-medium">{diag.frictionPoint}</p>
                  </div>
                )}
              </div>

              {/* The Future Action Blueprint */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold font-display mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>🚀 The Future Action (Actionable Blueprint):</span>
                </div>
                <p className="text-emerald-950 leading-relaxed font-semibold">
                  {diag.futureAction}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 glass-panel rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs text-slate-600 shadow-xs">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 mr-2">Page {currentPage} of {totalPages}</span>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === p
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
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium cursor-pointer"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
