import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Leaf, Factory, Truck, Zap, TrendingDown, TrendingUp,
  Target, AlertTriangle, CheckCircle2, BarChart3, 
  Building2, Fuel, Recycle, FileText, Download, ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmissionData {
  category: string;
  icon: React.ElementType;
  scope1: number;
  scope2: number;
  scope3: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

const emissionsData: EmissionData[] = [
  { 
    category: 'Vehicle Fleet', 
    icon: Truck, 
    scope1: 12450, 
    scope2: 0, 
    scope3: 3200,
    trend: 'down',
    trendValue: 8.5
  },
  { 
    category: 'Facilities', 
    icon: Building2, 
    scope1: 4200, 
    scope2: 8900, 
    scope3: 1500,
    trend: 'down',
    trendValue: 12.3
  },
  { 
    category: 'Energy', 
    icon: Zap, 
    scope1: 0, 
    scope2: 15600, 
    scope3: 0,
    trend: 'down',
    trendValue: 15.7
  },
  { 
    category: 'Fuel Consumption', 
    icon: Fuel, 
    scope1: 8900, 
    scope2: 0, 
    scope3: 2100,
    trend: 'up',
    trendValue: 2.1
  },
];

const kpiData = [
  { 
    label: 'Carbon Intensity', 
    value: 0.42, 
    unit: 'tCO₂e/M€', 
    target: 0.35, 
    status: 'warning' as const,
    description: 'Emissions per million revenue'
  },
  { 
    label: 'Renewable Energy', 
    value: 67, 
    unit: '%', 
    target: 80, 
    status: 'warning' as const,
    description: 'Share of renewable electricity'
  },
  { 
    label: 'Fleet Electrification', 
    value: 23, 
    unit: '%', 
    target: 50, 
    status: 'alert' as const,
    description: 'Electric vehicles in fleet'
  },
  { 
    label: 'Waste Recycling Rate', 
    value: 89, 
    unit: '%', 
    target: 85, 
    status: 'success' as const,
    description: 'Materials recycled vs landfill'
  },
];

const siteEmissions = [
  { name: 'Headquarters', location: 'Kirchheim', emissions: 8450, percentage: 24 },
  { name: 'Technical Center North', location: 'Hamburg', emissions: 5230, percentage: 15 },
  { name: 'Logistics Hub West', location: 'Düsseldorf', emissions: 6780, percentage: 19 },
  { name: 'Distribution Center', location: 'Lyon', emissions: 4560, percentage: 13 },
  { name: 'Service Center', location: 'Milan', emissions: 3890, percentage: 11 },
  { name: 'Other Sites', location: '12 locations', emissions: 6340, percentage: 18 },
];

export function ESGDashboard() {
  const [selectedScope, setSelectedScope] = useState<'all' | '1' | '2' | '3'>('all');

  const totalScope1 = emissionsData.reduce((sum, e) => sum + e.scope1, 0);
  const totalScope2 = emissionsData.reduce((sum, e) => sum + e.scope2, 0);
  const totalScope3 = emissionsData.reduce((sum, e) => sum + e.scope3, 0);
  const totalEmissions = totalScope1 + totalScope2 + totalScope3;

  const getStatusColor = (status: 'success' | 'warning' | 'alert') => {
    switch (status) {
      case 'success': return 'text-success bg-success/10 border-success/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'alert': return 'text-destructive bg-destructive/10 border-destructive/20';
    }
  };

  const getStatusIcon = (status: 'success' | 'warning' | 'alert') => {
    switch (status) {
      case 'success': return CheckCircle2;
      case 'warning': return AlertTriangle;
      case 'alert': return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">ESG & Sustainability Dashboard</h2>
            <p className="text-sm text-muted-foreground">Decarbonization tracking & environmental KPIs</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Total Emissions Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-1 bg-gradient-to-br from-emerald-500/10 to-green-600/5 border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Factory className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Total Emissions</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{(totalEmissions / 1000).toFixed(1)}k</p>
            <p className="text-sm text-muted-foreground">tCO₂e / year</p>
            <div className="flex items-center gap-1 mt-2 text-success">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-medium">-9.2% vs last year</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm font-medium">Scope 1</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{(totalScope1 / 1000).toFixed(1)}k</p>
            <p className="text-xs text-muted-foreground">Direct emissions</p>
            <Progress value={(totalScope1 / totalEmissions) * 100} className="h-1.5 mt-3" />
            <p className="text-xs text-muted-foreground mt-1">{((totalScope1 / totalEmissions) * 100).toFixed(0)}% of total</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm font-medium">Scope 2</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{(totalScope2 / 1000).toFixed(1)}k</p>
            <p className="text-xs text-muted-foreground">Indirect (energy)</p>
            <Progress value={(totalScope2 / totalEmissions) * 100} className="h-1.5 mt-3" />
            <p className="text-xs text-muted-foreground mt-1">{((totalScope2 / totalEmissions) * 100).toFixed(0)}% of total</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm font-medium">Scope 3</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{(totalScope3 / 1000).toFixed(1)}k</p>
            <p className="text-xs text-muted-foreground">Value chain</p>
            <Progress value={(totalScope3 / totalEmissions) * 100} className="h-1.5 mt-3" />
            <p className="text-xs text-muted-foreground mt-1">{((totalScope3 / totalEmissions) * 100).toFixed(0)}% of total</p>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const StatusIcon = getStatusIcon(kpi.status);
          const progress = (kpi.value / kpi.target) * 100;
          
          return (
            <Card key={kpi.label} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold">{kpi.value}</span>
                      <span className="text-sm text-muted-foreground">{kpi.unit}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("text-xs", getStatusColor(kpi.status))}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {kpi.status === 'success' ? 'On Track' : kpi.status === 'warning' ? 'At Risk' : 'Behind'}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress to target</span>
                    <span className="font-medium">{kpi.target} {kpi.unit}</span>
                  </div>
                  <Progress 
                    value={Math.min(progress, 100)} 
                    className={cn(
                      "h-2",
                      kpi.status === 'success' && "[&>div]:bg-success",
                      kpi.status === 'warning' && "[&>div]:bg-warning",
                      kpi.status === 'alert' && "[&>div]:bg-destructive"
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Emissions by Category & Site */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-agent-compliance" />
              Emissions by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {emissionsData.map((emission) => {
              const Icon = emission.icon;
              const total = emission.scope1 + emission.scope2 + emission.scope3;
              const percentage = (total / totalEmissions) * 100;
              
              return (
                <div key={emission.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-sm">{emission.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">{(total / 1000).toFixed(1)}k tCO₂e</span>
                      <div className={cn(
                        "flex items-center gap-1 text-xs font-medium",
                        emission.trend === 'down' ? "text-success" : "text-destructive"
                      )}>
                        {emission.trend === 'down' ? (
                          <ArrowDown className="w-3 h-3" />
                        ) : (
                          <TrendingUp className="w-3 h-3" />
                        )}
                        {emission.trendValue}%
                      </div>
                    </div>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                    <div 
                      className="bg-blue-500 transition-all" 
                      style={{ width: `${(emission.scope1 / total) * 100}%` }} 
                    />
                    <div 
                      className="bg-purple-500 transition-all" 
                      style={{ width: `${(emission.scope2 / total) * 100}%` }} 
                    />
                    <div 
                      className="bg-amber-500 transition-all" 
                      style={{ width: `${(emission.scope3 / total) * 100}%` }} 
                    />
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Scope 1
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Scope 2
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Scope 3
              </div>
            </div>
          </CardContent>
        </Card>

        {/* By Site */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-agent-compliance" />
              Emissions by Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {siteEmissions.map((site, index) => (
              <div key={site.name} className="flex items-center gap-3">
                <div className="w-8 text-center">
                  <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm font-medium">{site.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{site.location}</span>
                    </div>
                    <span className="text-sm font-semibold">{(site.emissions / 1000).toFixed(1)}k</span>
                  </div>
                  <Progress value={site.percentage} className="h-1.5" />
                </div>
                <div className="w-12 text-right">
                  <span className="text-xs text-muted-foreground">{site.percentage}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Decarbonization Targets */}
      <Card className="bg-gradient-to-r from-emerald-500/5 to-green-600/5 border-emerald-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-emerald-600" />
            <h3 className="font-semibold text-lg">Decarbonization Roadmap</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">2024 Target</p>
              <p className="text-xl font-bold">-10%</p>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" /> On track (-9.2%)
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">2025 Target</p>
              <p className="text-xl font-bold">-25%</p>
              <p className="text-xs text-muted-foreground mt-1">vs 2023 baseline</p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">2030 Target</p>
              <p className="text-xl font-bold">-50%</p>
              <p className="text-xs text-muted-foreground mt-1">Science-based target</p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">2050 Target</p>
              <p className="text-xl font-bold">Net Zero</p>
              <p className="text-xs text-muted-foreground mt-1">Carbon neutrality</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}