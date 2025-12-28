import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, FolderSearch, Shield, Search } from 'lucide-react';
import DataSources from '@/components/data/DataSources';
import DataCatalog from '@/components/data/DataCatalog';
import DataGovernance from '@/components/data/DataGovernance';
import DataSearch from '@/components/data/DataSearch';

const Data = () => {
  const [activeTab, setActiveTab] = useState('catalog');

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-3 md:px-6 py-3 md:py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">AETHER Data</h1>
              <p className="text-muted-foreground text-xs md:text-sm hidden md:block">
                Plateforme de données d'entreprise
              </p>
            </div>
          </div>
        </header>

        {/* Tabs and Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <div className="px-3 md:px-6 py-2 border-b border-border shrink-0 overflow-x-auto">
              <TabsList className="inline-flex w-auto min-w-full md:min-w-0 h-9 md:h-10">
                <TabsTrigger value="catalog" className="flex items-center gap-1.5 px-2 md:px-3 text-xs md:text-sm">
                  <FolderSearch className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Catalogue</span>
                </TabsTrigger>
                <TabsTrigger value="sources" className="flex items-center gap-1.5 px-2 md:px-3 text-xs md:text-sm">
                  <Database className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Sources</span>
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center gap-1.5 px-2 md:px-3 text-xs md:text-sm">
                  <Search className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Recherche</span>
                </TabsTrigger>
                <TabsTrigger value="governance" className="flex items-center gap-1.5 px-2 md:px-3 text-xs md:text-sm">
                  <Shield className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Gouvernance</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-3 md:p-6">
              <TabsContent value="catalog" className="mt-0 h-full">
                <DataCatalog />
              </TabsContent>
              <TabsContent value="sources" className="mt-0 h-full">
                <DataSources />
              </TabsContent>
              <TabsContent value="search" className="mt-0 h-full">
                <DataSearch />
              </TabsContent>
              <TabsContent value="governance" className="mt-0 h-full">
                <DataGovernance />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Data;
