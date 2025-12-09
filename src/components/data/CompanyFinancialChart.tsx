import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnrichedCompany, CompanyFinancial } from '@/hooks/useEnrichedCompanies';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface CompanyFinancialChartProps {
  company: EnrichedCompany;
  financials: CompanyFinancial[];
}

export function CompanyFinancialChart({ company, financials }: CompanyFinancialChartProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}Md€`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M€`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K€`;
    return `${value.toFixed(0)}€`;
  };

  // Prepare chart data from financials
  const chartData = financials
    .sort((a, b) => a.fiscal_year - b.fiscal_year)
    .map(f => ({
      year: f.fiscal_year.toString(),
      revenue: f.revenue || 0,
      netIncome: f.net_income || 0,
      ebitda: f.ebitda || 0,
    }));

  // If no financials from DB, use company's current data
  if (chartData.length === 0 && company.revenue) {
    chartData.push({
      year: company.revenue_year?.toString() || new Date().getFullYear().toString(),
      revenue: company.revenue || 0,
      netIncome: company.net_income || 0,
      ebitda: company.ebitda || 0,
    });
  }

  // Risk/Opportunity pie chart data
  const riskOpportunityData = [
    { name: 'Risque', value: company.ai_risk_score || 0, color: '#ef4444' },
    { name: 'Opportunité', value: company.ai_opportunity_score || 0, color: '#22c55e' },
  ];

  // Calculate growth if multiple years
  const calculateGrowth = () => {
    if (chartData.length < 2) return null;
    const latest = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];
    if (!previous.revenue || previous.revenue === 0) return null;
    return ((latest.revenue - previous.revenue) / previous.revenue * 100).toFixed(1);
  };

  const growth = calculateGrowth();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Chiffre d'affaires</div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(company.revenue || 0)}
            </div>
            {growth && (
              <div className={`flex items-center gap-1 text-xs ${parseFloat(growth) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {parseFloat(growth) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {growth}% vs année précédente
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Résultat net</div>
            <div className={`text-2xl font-bold ${(company.net_income || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatCurrency(company.net_income || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">EBITDA</div>
            <div className="text-2xl font-bold">
              {company.ebitda ? formatCurrency(company.ebitda) : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Marge nette</div>
            <div className="text-2xl font-bold">
              {company.revenue && company.net_income 
                ? `${((company.net_income / company.revenue) * 100).toFixed(1)}%`
                : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue & Net Income Chart */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
              Évolution financière
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    name="Chiffre d'affaires" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="netIncome" 
                    name="Résultat net" 
                    fill="#22c55e" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Pas de données financières disponibles
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Trend Line Chart */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tendance CA
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Chiffre d'affaires"
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Historique insuffisant pour afficher la tendance
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Risk/Opportunity Score */}
      {(company.ai_risk_score || company.ai_opportunity_score) && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Analyse Risque / Opportunité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-center justify-center">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={riskOpportunityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskOpportunityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10">
                  <span className="text-red-400 font-medium">Score de risque</span>
                  <span className="text-2xl font-bold text-red-400">
                    {company.ai_risk_score || 0}/100
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10">
                  <span className="text-emerald-400 font-medium">Score d'opportunité</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {company.ai_opportunity_score || 0}/100
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial History Table */}
      {financials.length > 0 && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Historique financier détaillé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Année</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">CA</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Résultat net</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">EBITDA</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {financials.map((f) => (
                    <tr key={f.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="py-3 px-4 font-medium">{f.fiscal_year}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(f.revenue || 0)}</td>
                      <td className={`py-3 px-4 text-right ${(f.net_income || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatCurrency(f.net_income || 0)}
                      </td>
                      <td className="py-3 px-4 text-right">{f.ebitda ? formatCurrency(f.ebitda) : '-'}</td>
                      <td className="py-3 px-4 text-right text-muted-foreground text-sm">{f.source || 'API'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
