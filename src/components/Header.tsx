import React from 'react';
import { DateRangeOption } from '../types';
import { Calendar, RefreshCw, CheckCircle2, Menu } from 'lucide-react';

interface HeaderProps {
  activeTabTitle: string;
  selectedDateRange: DateRangeOption;
  onDateRangeChange: (range: DateRangeOption) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastSyncTime?: string;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTabTitle,
  selectedDateRange,
  onDateRangeChange,
  onRefresh,
  isRefreshing,
  lastSyncTime,
  onToggleMobileMenu
}) => {
  const dateOptions: DateRangeOption[] = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'All-Time'];

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
      {/* Title & Status with Mobile Hamburger */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 cursor-pointer"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">
            {activeTabTitle}
          </h2>
          <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Session Cookie Connected
            </span>
            <span className="text-slate-300">•</span>
            <span>Last sync: {lastSyncTime || 'Just now'}</span>
          </p>
        </div>
      </div>

      {/* Global Controls: Date Range Selector + Refresh */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        {/* Date Range Selector */}
        <div className="flex items-center bg-slate-100/80 border border-slate-200 rounded-xl p-1 shadow-xs overflow-x-auto max-w-full">
          <div className="px-2 text-slate-500 flex items-center gap-1 text-xs font-semibold shrink-0">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden md:inline">Timeframe:</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {dateOptions.map((opt) => {
              const isSelected = selectedDateRange === opt;
              return (
                <button
                  key={opt}
                  onClick={() => onDateRangeChange(opt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sync / Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
          title="Sync latest Substack stats"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Sync</span>
        </button>
      </div>
    </header>
  );
};
