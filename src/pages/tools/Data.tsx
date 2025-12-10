import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, FolderSearch, Activity, Shield, Search, Building2, Brain, GitMerge } from 'lucide-react';
import DataSources from '@/components/data/DataSources';
import DataCatalog from '@/components/data/DataCatalog';
import DataMonitoring from '@/components/data/DataMonitoring';
import DataGovernance from '@/components/data/DataGovernance';
import DataSearch from '@/components/data/DataSearch';
import { CompanyEnrichment } from '@/components/data/CompanyEnrichment';
import { AIIntelligenceDashboard } from '@/components/data/AIIntelligenceDashboard';
import { DeduplicationPanel } from '@/components/data/DeduplicationPanel';

const Data = () => {
  const [activeTab, setActiveTab] = useState('catalog');

  return (
    <DashboardLayout>
      <div className="space-y-6 h-full overflow-auto p-6">
        <div>
          <h1 className="text-3xl font-bold">AETHER Data</h1>
          <p className="text-muted-foreground mt-1">
            Plateforme de données d'entreprise - Enrichissement, Veille et Intelligence
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto lg:inline-grid">
            <TabsTrigger value="intelligence" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Intelligence IA</span>
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <FolderSearch className="h-4 w-4" />
              <span className="hidden sm:inline">Catalogue</span>
            </TabsTrigger>
            <TabsTrigger value="enrichment" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Enrichissement</span>
            </TabsTrigger>
            <TabsTrigger value="dedupe" className="flex items-center gap-2">
              <GitMerge className="h-4 w-4" />
              <span className="hidden sm:inline">Déduplication</span>
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Sources</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Recherche</span>
            </TabsTrigger>
            <TabsTrigger value="governance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Gouvernance</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Monitoring</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="intelligence">
            <AIIntelligenceDashboard />
          </TabsContent>
          <TabsContent value="enrichment">
            <CompanyEnrichment />
          </TabsContent>
          <TabsContent value="dedupe">
            <DeduplicationPanel />
          </TabsContent>
          <TabsContent value="sources">
            <DataSources />
          </TabsContent>
          <TabsContent value="catalog">
            <DataCatalog />
          </TabsContent>
          <TabsContent value="search">
            <DataSearch />
          </TabsContent>
          <TabsContent value="governance">
            <DataGovernance />
          </TabsContent>
          <TabsContent value="monitoring">
            <DataMonitoring />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Data;
