import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, Banknote, Clock } from 'lucide-react';
import { Employee } from '@/hooks/useEmployees';
import { differenceInMonths } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface EmployeeStatsProps {
  employees: Employee[];
}

export function EmployeeStats({ employees }: EmployeeStatsProps) {
  const activeEmployees = employees.filter(e => e.is_active);
  
  // Contract distribution
  const contractCounts: Record<string, number> = {};
  activeEmployees.forEach(e => {
    const type = e.contract_type || 'CDI';
    contractCounts[type] = (contractCounts[type] || 0) + 1;
  });
  
  const contractData = Object.entries(contractCounts).map(([name, value]) => ({ name, value }));
  
  const COLORS = {
    CDI: '#10b981',
    CDD: '#f59e0b',
    Stage: '#3b82f6',
    Freelance: '#6366f1',
    Alternance: '#a855f7',
  };

  // Average salary
  const salaries = activeEmployees
    .map(e => e.salary_current)
    .filter((s): s is number => s !== null && s > 0);
  const avgSalary = salaries.length > 0 
    ? salaries.reduce((a, b) => a + b, 0) / salaries.length 
    : 0;

  // Average seniority in months
  const seniorities = activeEmployees
    .map(e => e.hire_date ? differenceInMonths(new Date(), new Date(e.hire_date)) : 0)
    .filter(s => s > 0);
  const avgSeniorityMonths = seniorities.length > 0 
    ? Math.round(seniorities.reduce((a, b) => a + b, 0) / seniorities.length)
    : 0;
  const avgSeniorityYears = Math.floor(avgSeniorityMonths / 12);
  const avgSeniorityRemainingMonths = avgSeniorityMonths % 12;

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(salary);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Employees */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeEmployees.length}</p>
              <p className="text-xs text-muted-foreground">Employés actifs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Distribution */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12">
              {contractData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contractData}
                      cx="50%"
                      cy="50%"
                      innerRadius={12}
                      outerRadius={22}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {contractData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[entry.name as keyof typeof COLORS] || '#94a3b8'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value}`, name]}
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Contrats</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {contractData.slice(0, 3).map((entry) => (
                  <span 
                    key={entry.name} 
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ 
                      backgroundColor: `${COLORS[entry.name as keyof typeof COLORS]}20`,
                      color: COLORS[entry.name as keyof typeof COLORS]
                    }}
                  >
                    {entry.name}: {entry.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Salary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-600">{formatSalary(avgSalary)}</p>
              <p className="text-xs text-muted-foreground">Salaire moyen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Seniority */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">
                {avgSeniorityYears > 0 ? `${avgSeniorityYears}a ${avgSeniorityRemainingMonths}m` : `${avgSeniorityMonths}m`}
              </p>
              <p className="text-xs text-muted-foreground">Ancienneté moyenne</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
