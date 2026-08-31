import { useState } from 'react';
import { Sidebar, TabKey } from './components/Sidebar';
import { Header } from './components/Header';
import { DateRangeOption } from './types';
import { DashboardTab } from './tabs/DashboardTab';
import { ArticlePerformanceTab } from './tabs/ArticlePerformanceTab';
import { NotesPerformanceTab } from './tabs/NotesPerformanceTab';
import { CampaignOverlayTab } from './tabs/CampaignOverlayTab';
import { TrafficSourcesTab } from './tabs/TrafficSourcesTab';
import { SMMDiagnosticsTab } from './tabs/SMMDiagnosticsTab';
import { SettingsTab } from './tabs/SettingsTab';

export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('Dashboard');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeOption>('Last 30 Days');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSyncTime('Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1200);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardTab dateRange={selectedDateRange} />;
      case 'Article Performance':
        return <ArticlePerformanceTab />;
      case 'Notes Performance':
        return <NotesPerformanceTab />;
      case 'Campaign Overlay':
        return <CampaignOverlayTab />;
      case 'Traffic Sources':
        return <TrafficSourcesTab />;
      case 'SMM Diagnostics':
        return <SMMDiagnosticsTab />;
      case 'Settings':
        return <SettingsTab />;
      default:
        return <DashboardTab dateRange={selectedDateRange} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex antialiased">
      {/* Canonical Sidebar Navigation (Responsive) */}
      <Sidebar 
        activeTab={activeTab} 
        onSelectTab={setActiveTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          activeTabTitle={activeTab} 
          selectedDateRange={selectedDateRange}
          onDateRangeChange={setSelectedDateRange}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          lastSyncTime={lastSyncTime}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {renderActiveTab()}
        </main>

        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-slate-500 text-[11px] font-medium">
          Substack Growth & Engagement Client Dashboard 2 • Built for Strategic Growth
        </footer>
      </div>
    </div>
  );
}

export default App;
