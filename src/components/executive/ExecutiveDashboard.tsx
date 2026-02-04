import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, TrendingDown, Minus, DollarSign, Users, 
  Headphones, Shield, BarChart3, Target, Activity,
  Briefcase, Clock, Calendar, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BusinessMetric } from '@/hooks/useExecutiveInsights';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface ExecutiveDashboardProps {
  metrics: BusinessMetric[];
  loading?: boolean;
}

// Simulated trend data for charts
const generateTrendData = (baseValue: number, months: number = 6) => {
  const data = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const variance = (Math.random() - 0.3) * baseValue * 0.2;
    data.push({
      month: date.toLocaleDateString('fr-FR', { month: 'short' }),
      value: Math.max(0, baseValue + variance + (baseValue * 0.05 * (months - i))),
    });
  }
  return data;
};

const KPICard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  color,
  subtitle
}: { 
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}) => {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground';

  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className={cn("absolute top-0 left-0 w-1 h-full", color)} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{value}</span>
              {change !== undefined && (
                <div className={cn("flex items-center text-xs font-medium", trendColor)}>
                  <TrendIcon className="w-3 h-3" />
                  {Math.abs(change)}%
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={cn("p-2 rounded-lg bg-opacity-10", color.replace('bg-', 'bg-opacity-10 '))}>
            <Icon className={cn("w-5 h-5", color.replace('bg-', 'text-'))} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function ExecutiveDashboard({ metrics, loading }: ExecutiveDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  // Extract key metrics
  const pipelineValue = metrics.find(m => m.id === 'pipeline')?.value || 0;
  const activeDeals = metrics.find(m => m.id === 'deals_active')?.value || 0;
  const winProbability = metrics.find(m => m.id === 'win_probability')?.value || '0%';
  const employees = metrics.find(m => m.id === 'employees')?.value || 0;
  const candidates = metrics.find(m => m.id === 'candidates')?.value || 0;
  const openTickets = metrics.find(m => m.id === 'tickets_open')?.value || 0;
  const criticalTickets = metrics.find(m => m.id === 'tickets_critical')?.value || 0;
  const complianceAlerts = metrics.find(m => m.id === 'compliance_alerts')?.value || 0;

  // Format large numbers
  const formatCurrency = (val: number | string) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return val;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M€`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k€`;
    return `${num}€`;
  };

  // Chart data
  const revenueData = generateTrendData(typeof pipelineValue === 'number' ? pipelineValue / 6 : 50000);
  
  const numActiveDeals = typeof activeDeals === 'number' ? activeDeals : parseInt(String(activeDeals)) || 0;
  const numOpenTickets = typeof openTickets === 'number' ? openTickets : parseInt(String(openTickets)) || 0;
  const numCandidates = typeof candidates === 'number' ? candidates : parseInt(String(candidates)) || 0;
  const numComplianceAlerts = typeof complianceAlerts === 'number' ? complianceAlerts : parseInt(String(complianceAlerts)) || 0;
  const numCriticalTickets = typeof criticalTickets === 'number' ? criticalTickets : parseInt(String(criticalTickets)) || 0;

  const departmentData = [
    { name: 'Ventes', value: numActiveDeals * 25000 || 100000, color: 'hsl(var(--primary))' },
    { name: 'Support', value: numOpenTickets * 500 || 5000, color: 'hsl(221, 83%, 53%)' },
    { name: 'RH', value: numCandidates * 2000 || 10000, color: 'hsl(262, 83%, 58%)' },
    { name: 'Conformité', value: numComplianceAlerts * 1000 || 2000, color: 'hsl(0, 84%, 60%)' },
  ];

  const activityData = [
    { day: 'Lun', deals: 4, tickets: 12, candidates: 2 },
    { day: 'Mar', deals: 7, tickets: 8, candidates: 5 },
    { day: 'Mer', deals: 3, tickets: 15, candidates: 1 },
    { day: 'Jeu', deals: 9, tickets: 6, candidates: 4 },
    { day: 'Ven', deals: 5, tickets: 10, candidates: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Tableau de Bord Exécutif</h3>
          <p className="text-sm text-muted-foreground">Vue consolidée temps réel</p>
        </div>
        <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
          <TabsList className="grid grid-cols-3 w-[240px]">
            <TabsTrigger value="week">Semaine</TabsTrigger>
            <TabsTrigger value="month">Mois</TabsTrigger>
            <TabsTrigger value="quarter">Trimestre</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          title="Pipeline Commercial"
          value={formatCurrency(pipelineValue)}
          change={12}
          trend="up"
          icon={DollarSign}
          color="bg-emerald-500"
          subtitle={`${activeDeals} deals actifs`}
        />
        <KPICard
          title="Taux de Conversion"
          value={winProbability}
          change={5}
          trend="up"
          icon={Target}
          color="bg-blue-500"
          subtitle="Probabilité moyenne"
        />
        <KPICard
          title="Effectif"
          value={employees}
          change={0}
          trend="stable"
          icon={Users}
          color="bg-violet-500"
          subtitle={`${candidates} candidats en cours`}
        />
        <KPICard
          title="Tickets Ouverts"
          value={openTickets}
          change={(typeof criticalTickets === 'number' ? criticalTickets : 0) > 0 ? -15 : 0}
          trend={(typeof criticalTickets === 'number' ? criticalTickets : 0) > 0 ? 'down' : 'stable'}
          icon={Headphones}
          color="bg-amber-500"
          subtitle={(typeof criticalTickets === 'number' ? criticalTickets : 0) > 0 ? `${criticalTickets} critiques` : 'Sous contrôle'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Évolution du Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis 
                    className="text-xs" 
                    tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Pipeline']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Répartition par Pôle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Valeur']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {departmentData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Activité Hebdomadaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="deals" name="Deals" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tickets" name="Tickets" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="candidates" name="Candidats" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
