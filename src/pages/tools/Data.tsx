import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Database, FolderSearch, Shield, Search, Sparkles, TrendingUp, AlertTriangle, CheckCircle, Building2 } from 'lucide-react';
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
        {/* Modern Header */}
        <header className="px-4 md:px-8 py-4 md:py-6 shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-agent-data/20 to-agent-data/5 border border-agent-data/20 flex items-center justify-center shrink-0 shadow-lg shadow-agent-data/10">
                <Database className="w-6 h-6 md:w-7 md:h-7 text-agent-data" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">Data Platform</h1>
                  <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-agent-data/10 text-agent-data text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    Intelligence IA
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mt-0.5 hidden md:block">
                  Catalogue de données, gouvernance et qualité
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="group p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 hover:border-agent-data/30 transition-all hover:shadow-lg hover:shadow-agent-data/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-agent-data/10 flex items-center justify-center">
                    <Database className="w-5 h-5 text-agent-data" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">24</p>
                    <p className="text-xs text-muted-foreground">Datasets</p>
                  </div>
                </div>
              </div>
              <div className="group p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 hover:border-success/30 transition-all hover:shadow-lg hover:shadow-success/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">94%</p>
                    <p className="text-xs text-muted-foreground">Qualité</p>
                  </div>
                </div>
              </div>
              <div className="group p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 hover:border-warning/30 transition-all hover:shadow-lg hover:shadow-warning/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">3</p>
                    <p className="text-xs text-muted-foreground">Alertes</p>
                  </div>
                </div>
              </div>
              <div className="group p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">1.2M</p>
                    <p className="text-xs text-muted-foreground">Lignes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
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
