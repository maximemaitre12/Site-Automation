import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, MapPin, FileText, Users, Search, 
  ChevronRight, Globe, Database, CheckCircle2,
  TrendingUp, AlertTriangle, FolderOpen, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Site {
  id: string;
  name: string;
  location: string;
  country: string;
  documentsCount: number;
  lastSync: string;
  status: 'synced' | 'syncing' | 'outdated';
  categories: { name: string; count: number }[];
}

const mockSites: Site[] = [
  {
    id: '1',
    name: 'Siège Social',
    location: 'Région Parisienne',
    country: 'France',
    documentsCount: 1247,
    lastSync: '2 min ago',
    status: 'synced',
    categories: [
      { name: 'Politiques', count: 89 },
      { name: 'Procédures', count: 234 },
      { name: 'Formation', count: 156 },
      { name: 'Rapports', count: 768 },
    ]
  },
  {
    id: '2',
    name: 'Centre Technique Nord',
    location: 'Lille',
    country: 'France',
    documentsCount: 456,
    lastSync: '15 min ago',
    status: 'synced',
    categories: [
      { name: 'Politiques', count: 45 },
      { name: 'Procédures', count: 112 },
      { name: 'Formation', count: 78 },
      { name: 'Rapports', count: 221 },
    ]
  },
  {
    id: '3',
    name: 'Plateforme Logistique Ouest',
    location: 'Nantes',
    country: 'France',
    documentsCount: 389,
    lastSync: '1 hour ago',
    status: 'syncing',
    categories: [
      { name: 'Politiques', count: 34 },
      { name: 'Procédures', count: 98 },
      { name: 'Formation', count: 45 },
      { name: 'Rapports', count: 212 },
    ]
  },
  {
    id: '4',
    name: 'Centre de Distribution',
    location: 'Barcelone',
    country: 'Espagne',
    documentsCount: 278,
    lastSync: '3 hours ago',
    status: 'outdated',
    categories: [
      { name: 'Politiques', count: 28 },
      { name: 'Procédures', count: 67 },
      { name: 'Formation', count: 34 },
      { name: 'Rapports', count: 149 },
    ]
  },
  {
    id: '5',
    name: 'Centre de Services',
    location: 'Bruxelles',
    country: 'Belgique',
    documentsCount: 198,
    lastSync: '30 min ago',
    status: 'synced',
    categories: [
      { name: 'Politiques', count: 22 },
      { name: 'Procédures', count: 45 },
      { name: 'Formation', count: 28 },
      { name: 'Rapports', count: 103 },
    ]
  },
  {
    id: '6',
    name: 'Unité Technique Est',
    location: 'Strasbourg',
    country: 'France',
    documentsCount: 234,
    lastSync: '45 min ago',
    status: 'synced',
    categories: [
      { name: 'Politiques', count: 26 },
      { name: 'Procédures', count: 58 },
      { name: 'Formation', count: 32 },
      { name: 'Rapports', count: 118 },
    ]
  },
];

const statusConfig = {
  synced: { label: 'Synchronized', color: 'bg-success/10 text-success border-success/20', icon: CheckCircle2 },
  syncing: { label: 'Syncing...', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: TrendingUp },
  outdated: { label: 'Needs update', color: 'bg-warning/10 text-warning border-warning/20', icon: AlertTriangle },
};

export function KnowledgeHubPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [viewMode, setViewMode] = useState<'sites' | 'unified'>('unified');

  const filteredSites = mockSites.filter(site => 
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDocs = mockSites.reduce((sum, site) => sum + site.documentsCount, 0);
  const syncedSites = mockSites.filter(s => s.status === 'synced').length;

  const aggregatedCategories = mockSites.reduce((acc, site) => {
    site.categories.forEach(cat => {
      const existing = acc.find(c => c.name === cat.name);
      if (existing) {
        existing.count += cat.count;
      } else {
        acc.push({ ...cat });
      }
    });
    return acc;
  }, [] as { name: string; count: number }[]);

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-card/50 border-agent-brain/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agent-brain/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-agent-brain" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockSites.length}</p>
                <p className="text-xs text-muted-foreground">Sites</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{syncedSites}/{mockSites.length}</p>
                <p className="text-xs text-muted-foreground">Synced</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalDocs.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-agent-brain/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agent-brain/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-agent-brain" />
              </div>
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-muted-foreground">Countries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex rounded-lg border border-border p-1 bg-muted/30">
          <button
            onClick={() => setViewMode('unified')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              viewMode === 'unified' 
                ? "bg-agent-brain text-white shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Layers className="w-4 h-4" />
            Single Source of Truth
          </button>
          <button
            onClick={() => setViewMode('sites')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              viewMode === 'sites' 
                ? "bg-agent-brain text-white shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Building2 className="w-4 h-4" />
            By Location
          </button>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all locations..."
            className="pl-10"
          />
        </div>
      </div>

      {viewMode === 'unified' ? (
        /* Unified Knowledge Hub View */
        <Card className="border-agent-brain/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agent-brain to-agent-brain/60 flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Unified Knowledge Hub</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Aggregated view across all {mockSites.length} locations
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {aggregatedCategories.map((category, i) => (
                <button
                  key={category.name}
                  className="group p-4 rounded-xl border border-border/50 hover:border-agent-brain/30 hover:bg-agent-brain/5 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <FolderOpen className="w-5 h-5 text-agent-brain" />
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-agent-brain transition-colors" />
                  </div>
                  <p className="font-semibold text-foreground">{category.name}</p>
                  <p className="text-2xl font-bold text-agent-brain">{category.count.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">documents</p>
                </button>
              ))}
            </div>

            {/* Coverage Progress */}
            <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Knowledge Coverage</span>
                <span className="text-sm text-agent-brain font-semibold">94%</span>
              </div>
              <Progress value={94} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {syncedSites} of {mockSites.length} sites fully synchronized
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Sites List View */
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {filteredSites.map((site) => {
              const status = statusConfig[site.status];
              const StatusIcon = status.icon;
              
              return (
                <Card 
                  key={site.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedSite?.id === site.id 
                      ? "border-agent-brain ring-1 ring-agent-brain/20" 
                      : "hover:border-agent-brain/30"
                  )}
                  onClick={() => setSelectedSite(site)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-agent-brain/10 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5 text-agent-brain" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{site.name}</h3>
                            <Badge variant="outline" className={cn("text-xs", status.color)}>
                              <StatusIcon className={cn("w-3 h-3 mr-1", site.status === 'syncing' && "animate-spin")} />
                              {status.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" />
                            {site.location}, {site.country}
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm">
                              <span className="font-semibold text-foreground">{site.documentsCount.toLocaleString()}</span>
                              <span className="text-muted-foreground"> docs</span>
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Last sync: {site.lastSync}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>

                    {selectedSite?.id === site.id && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Document Categories</p>
                        <div className="grid grid-cols-2 gap-2">
                          {site.categories.map((cat) => (
                            <div 
                              key={cat.name}
                              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                            >
                              <span className="text-sm">{cat.name}</span>
                              <Badge variant="secondary" className="text-xs">{cat.count}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}