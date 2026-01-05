import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Building2, MapPin, Database, RefreshCw, CheckCircle2,
  AlertTriangle, TrendingUp, Globe, Layers, ArrowRight,
  Cloud, Server, Wifi, WifiOff, Activity, BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SiteDataSource {
  id: string;
  siteName: string;
  location: string;
  country: string;
  status: 'connected' | 'syncing' | 'offline' | 'error';
  lastSync: string;
  recordsCount: number;
  dataQuality: number;
  sources: {
    name: string;
    type: 'database' | 'api' | 'file' | 'manual';
    status: 'active' | 'inactive';
    records: number;
  }[];
}

const mockSiteData: SiteDataSource[] = [
  {
    id: '1',
    siteName: 'Headquarters',
    location: 'Kirchheim unter Teck',
    country: 'DE',
    status: 'connected',
    lastSync: '2 min ago',
    recordsCount: 1245000,
    dataQuality: 98,
    sources: [
      { name: 'SAP S/4HANA', type: 'database', status: 'active', records: 890000 },
      { name: 'HR System', type: 'api', status: 'active', records: 45000 },
      { name: 'Operations DB', type: 'database', status: 'active', records: 310000 },
    ]
  },
  {
    id: '2',
    siteName: 'Technical Center North',
    location: 'Hamburg',
    country: 'DE',
    status: 'connected',
    lastSync: '5 min ago',
    recordsCount: 567000,
    dataQuality: 95,
    sources: [
      { name: 'Local SAP', type: 'database', status: 'active', records: 450000 },
      { name: 'Workshop System', type: 'api', status: 'active', records: 117000 },
    ]
  },
  {
    id: '3',
    siteName: 'Logistics Hub West',
    location: 'Düsseldorf',
    country: 'DE',
    status: 'syncing',
    lastSync: '12 min ago',
    recordsCount: 423000,
    dataQuality: 92,
    sources: [
      { name: 'Warehouse Management', type: 'database', status: 'active', records: 380000 },
      { name: 'Fleet Tracking', type: 'api', status: 'active', records: 43000 },
    ]
  },
  {
    id: '4',
    siteName: 'Distribution Center',
    location: 'Lyon',
    country: 'FR',
    status: 'connected',
    lastSync: '8 min ago',
    recordsCount: 312000,
    dataQuality: 89,
    sources: [
      { name: 'Local ERP', type: 'database', status: 'active', records: 290000 },
      { name: 'Delivery System', type: 'api', status: 'inactive', records: 22000 },
    ]
  },
  {
    id: '5',
    siteName: 'Service Center',
    location: 'Milan',
    country: 'IT',
    status: 'connected',
    lastSync: '3 min ago',
    recordsCount: 198000,
    dataQuality: 94,
    sources: [
      { name: 'Service DB', type: 'database', status: 'active', records: 178000 },
      { name: 'CRM Integration', type: 'api', status: 'active', records: 20000 },
    ]
  },
  {
    id: '6',
    siteName: 'Technical Center East',
    location: 'Prague',
    country: 'CZ',
    status: 'error',
    lastSync: '2 hours ago',
    recordsCount: 156000,
    dataQuality: 78,
    sources: [
      { name: 'Workshop System', type: 'database', status: 'inactive', records: 156000 },
    ]
  },
  {
    id: '7',
    siteName: 'Compound South',
    location: 'Valencia',
    country: 'ES',
    status: 'connected',
    lastSync: '6 min ago',
    recordsCount: 234000,
    dataQuality: 91,
    sources: [
      { name: 'Yard Management', type: 'database', status: 'active', records: 210000 },
      { name: 'Vehicle Tracking', type: 'api', status: 'active', records: 24000 },
    ]
  },
  {
    id: '8',
    siteName: 'Processing Center',
    location: 'Antwerp',
    country: 'BE',
    status: 'connected',
    lastSync: '4 min ago',
    recordsCount: 189000,
    dataQuality: 96,
    sources: [
      { name: 'Processing DB', type: 'database', status: 'active', records: 165000 },
      { name: 'Quality System', type: 'api', status: 'active', records: 24000 },
    ]
  },
];

const statusConfig = {
  connected: { 
    label: 'Connected', 
    color: 'bg-success/10 text-success border-success/20', 
    icon: Wifi,
    dotColor: 'bg-success'
  },
  syncing: { 
    label: 'Syncing', 
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', 
    icon: RefreshCw,
    dotColor: 'bg-blue-500'
  },
  offline: { 
    label: 'Offline', 
    color: 'bg-muted text-muted-foreground border-border', 
    icon: WifiOff,
    dotColor: 'bg-muted-foreground'
  },
  error: { 
    label: 'Error', 
    color: 'bg-destructive/10 text-destructive border-destructive/20', 
    icon: AlertTriangle,
    dotColor: 'bg-destructive'
  },
};

const countryFlags: Record<string, string> = {
  DE: '🇩🇪',
  FR: '🇫🇷',
  IT: '🇮🇹',
  CZ: '🇨🇿',
  ES: '🇪🇸',
  BE: '🇧🇪',
  PL: '🇵🇱',
  NL: '🇳🇱',
};

export function MultiSiteDataView() {
  const [selectedSite, setSelectedSite] = useState<SiteDataSource | null>(null);

  const totalRecords = mockSiteData.reduce((sum, s) => sum + s.recordsCount, 0);
  const connectedSites = mockSiteData.filter(s => s.status === 'connected' || s.status === 'syncing').length;
  const avgQuality = Math.round(mockSiteData.reduce((sum, s) => sum + s.dataQuality, 0) / mockSiteData.length);
  const totalSources = mockSiteData.reduce((sum, s) => sum + s.sources.length, 0);

  return (
    <div className="space-y-6">
      {/* Aggregated Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-agent-data/10 to-agent-data/5 border-agent-data/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agent-data/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-agent-data" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockSiteData.length}</p>
                <p className="text-xs text-muted-foreground">Sites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{connectedSites}/{mockSiteData.length}</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(totalRecords / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground">Records</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Server className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalSources}</p>
                <p className="text-xs text-muted-foreground">Data Sources</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-agent-data/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agent-data/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-agent-data" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgQuality}%</p>
                <p className="text-xs text-muted-foreground">Avg Quality</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Central Data Hub Visualization */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agent-data to-agent-data/60 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Decentralized Data Collection</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Real-time aggregation from {mockSiteData.length} locations across {Object.keys(countryFlags).length} countries
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Sync All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Sites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {mockSiteData.map((site) => {
              const status = statusConfig[site.status];
              const StatusIcon = status.icon;
              
              return (
                <button
                  key={site.id}
                  onClick={() => setSelectedSite(selectedSite?.id === site.id ? null : site)}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all hover:shadow-md",
                    selectedSite?.id === site.id 
                      ? "border-agent-data ring-2 ring-agent-data/20 bg-agent-data/5" 
                      : "border-border/50 hover:border-agent-data/30"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{countryFlags[site.country] || '🌍'}</span>
                      <div className={cn("w-2 h-2 rounded-full", status.dotColor)} />
                    </div>
                    <Badge variant="outline" className={cn("text-[10px]", status.color)}>
                      <StatusIcon className={cn("w-3 h-3 mr-1", site.status === 'syncing' && "animate-spin")} />
                      {status.label}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-sm text-foreground truncate">{site.siteName}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{site.location}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Records</span>
                      <span className="font-medium">{(site.recordsCount / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Quality</span>
                      <span className={cn(
                        "font-medium",
                        site.dataQuality >= 90 ? "text-success" : 
                        site.dataQuality >= 80 ? "text-warning" : "text-destructive"
                      )}>
                        {site.dataQuality}%
                      </span>
                    </div>
                    <Progress 
                      value={site.dataQuality} 
                      className={cn(
                        "h-1.5",
                        site.dataQuality >= 90 && "[&>div]:bg-success",
                        site.dataQuality >= 80 && site.dataQuality < 90 && "[&>div]:bg-warning",
                        site.dataQuality < 80 && "[&>div]:bg-destructive"
                      )}
                    />
                  </div>
                  
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Last sync: {site.lastSync}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected Site Details */}
          {selectedSite && (
            <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{countryFlags[selectedSite.country]}</span>
                  <div>
                    <h3 className="font-semibold">{selectedSite.siteName}</h3>
                    <p className="text-sm text-muted-foreground">{selectedSite.location}, {selectedSite.country}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
              
              <p className="text-xs font-medium text-muted-foreground mb-2">Connected Data Sources</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {selectedSite.sources.map((source) => (
                  <div 
                    key={source.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50"
                  >
                    <div className="flex items-center gap-2">
                      {source.type === 'database' && <Database className="w-4 h-4 text-agent-data" />}
                      {source.type === 'api' && <Cloud className="w-4 h-4 text-blue-500" />}
                      <div>
                        <p className="text-sm font-medium">{source.name}</p>
                        <p className="text-xs text-muted-foreground">{(source.records / 1000).toFixed(0)}k records</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        source.status === 'active' 
                          ? "bg-success/10 text-success border-success/20" 
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {source.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Flow Indicator */}
          <div className="mt-6 flex items-center justify-center gap-4 p-4 rounded-xl bg-gradient-to-r from-agent-data/5 via-primary/5 to-agent-data/5 border border-agent-data/20">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-agent-data" />
              <span className="text-sm font-medium">{mockSiteData.length} Sites</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Central Hub</span>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-agent-data" />
              <span className="text-sm font-medium">Unified Analytics</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}