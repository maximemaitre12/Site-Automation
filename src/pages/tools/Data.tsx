import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Database, FolderSearch, Shield, Search, Sparkles, Building2 } from 'lucide-react';
import DataSources from '@/components/data/DataSources';
import DataCatalog from '@/components/data/DataCatalog';
import DataGovernance from '@/components/data/DataGovernance';
import DataSearch from '@/components/data/DataSearch';
import { MultiSiteDataView } from '@/components/data/MultiSiteDataView';
import { AgentTabs } from '@/components/agents/AgentTabs';
import { cn } from '@/lib/utils';

const Data = () => {
  const [activeTab, setActiveTab] = useState('multisite');

  const tabs = [
    { id: 'multisite', label: 'Multi-Site Hub', icon: Building2 },
    { id: 'catalog', label: 'Catalogue', icon: FolderSearch },
    { id: 'sources', label: 'Sources', icon: Database },
    { id: 'search', label: 'Recherche', icon: Search },
    { id: 'governance', label: 'Gouvernance', icon: Shield },
  ];

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col overflow-hidden bg-gradient-to-b from-background to-background/95">
        {/* Header */}
        <header className="px-4 md:px-8 py-4 shrink-0">
          <div className="max-w-7xl mx-auto">
            <AgentTabs 
              tabs={tabs} 
              activeTab={activeTab} 
              onTabChange={setActiveTab}
              variant="pills"
            />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className={cn(activeTab !== 'multisite' && 'hidden')}>
              <MultiSiteDataView />
            </div>
            <div className={cn(activeTab !== 'catalog' && 'hidden')}>
              <DataCatalog />
            </div>
            <div className={cn(activeTab !== 'sources' && 'hidden')}>
              <DataSources />
            </div>
            <div className={cn(activeTab !== 'search' && 'hidden')}>
              <DataSearch />
            </div>
            <div className={cn(activeTab !== 'governance' && 'hidden')}>
              <DataGovernance />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Data;
