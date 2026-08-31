import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Layers, 
  Globe, 
  Lightbulb, 
  Settings,
  Sparkles,
  X
} from 'lucide-react';

export type TabKey = 
  | 'Dashboard'
  | 'Article Performance'
  | 'Notes Performance'
  | 'Campaign Overlay'
  | 'Traffic Sources'
  | 'SMM Diagnostics'
  | 'Settings';

interface SidebarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const navItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'Article Performance', label: 'Article Performance', icon: <FileText className="w-4 h-4" /> },
    { key: 'Notes Performance', label: 'Notes Performance', icon: <MessageSquare className="w-4 h-4" /> },
    { key: 'Campaign Overlay', label: 'Campaign Overlay', icon: <Layers className="w-4 h-4" /> },
    { key: 'Traffic Sources', label: 'Traffic Sources', icon: <Globe className="w-4 h-4" /> },
    { key: 'SMM Diagnostics', label: 'SMM Diagnostics', icon: <Lightbulb className="w-4 h-4" /> },
    { key: 'Settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSelect = (key: TabKey) => {
    onSelectTab(key);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-30
        w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen select-none shadow-sm
        transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div>
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 font-bold font-display text-lg">
                S2
              </div>
              <div>
                <h1 className="font-display font-bold text-slate-900 text-base tracking-tight leading-tight">
                  PSI Capital
                </h1>
                <p className="text-[11px] font-bold text-amber-600 tracking-wide uppercase">
                  Substack Dashboard 2
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Canonical Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleSelect(item.key)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <span className={isActive ? 'text-amber-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* SMM Assistant Badge at bottom */}
        <div className="p-4 m-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-slate-900 text-xs font-bold font-display">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>SMM Growth Mode</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Actionable takeaways & CTA optimization active across all tabs.
          </p>
        </div>
      </aside>
    </>
  );
};
