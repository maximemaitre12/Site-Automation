import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Leaf, TrendingDown, Factory, Zap, Truck, Building2, Target, CheckCircle2, AlertTriangle } from "lucide-react";

const scopeData = [
  { scope: "Scope 1", label: "Direct", value: 25.5, color: "bg-blue-500", trend: -8.5 },
  { scope: "Scope 2", label: "Énergie", value: 24.5, color: "bg-purple-500", trend: -12.3 },
  { scope: "Scope 3", label: "Chaîne", value: 6.8, color: "bg-amber-500", trend: -5.2 },
];

const kpis = [
  { label: "Intensité Carbone", value: 0.42, target: 0.35, unit: "tCO₂e/M€", status: "warning" as const },
  { label: "Énergie Renouvelable", value: 67, target: 80, unit: "%", status: "warning" as const },
  { label: "Recyclage", value: 89, target: 85, unit: "%", status: "success" as const },
];

const siteEmissions = [
  { name: "Siège Paris", emissions: 8.4, flag: "🇫🇷" },
  { name: "Logistique Nantes", emissions: 6.8, flag: "🇫🇷" },
  { name: "Tech Lille", emissions: 5.2, flag: "🇫🇷" },
  { name: "Distribution BCN", emissions: 4.6, flag: "🇪🇸" },
];

interface AgentComplianceDemoProps {
  className?: string;
}

export function AgentComplianceDemo({ className }: AgentComplianceDemoProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const [phase, setPhase] = useState(0);
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    if (!isVisible) {
      setPhase(0);
      setAnimatedValues([0, 0, 0]);
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isVisible]);

  // Animate scope values
  useEffect(() => {
    if (phase >= 1) {
      const duration = 1500;
      const steps = 30;
      const interval = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        setAnimatedValues(scopeData.map(s => s.value * progress));
        
        if (step >= steps) clearInterval(timer);
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [phase]);

  const totalEmissions = scopeData.reduce((sum, s) => sum + s.value, 0);

  return (
    <div
      ref={ref}
      className={cn(
        "relative p-4 rounded-xl bg-card border border-border overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 right-1/4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />

      <div className="relative z-10 space-y-3">
        {/* ESG Header */}
        <div className={cn(
          "flex items-center justify-between transition-all duration-500",
          phase >= 1 ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-foreground">Dashboard ESG</p>
              <p className="text-[8px] text-muted-foreground">Suivi Décarbonation</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-success">
            <TrendingDown className="w-3 h-3" />
            <span className="text-[9px] font-semibold">-9.2% YoY</span>
          </div>
        </div>

        {/* Scope 1/2/3 Cards */}
        <div className={cn(
          "grid grid-cols-3 gap-2 transition-all duration-700",
          phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          {scopeData.map((scope, i) => (
            <div 
              key={scope.scope}
              className="p-2 rounded-lg bg-secondary/50 border border-border"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="flex items-center gap-1 mb-1">
                <div className={cn("w-2 h-2 rounded-full", scope.color)} />
                <span className="text-[8px] font-medium text-muted-foreground">{scope.scope}</span>
              </div>
              <p className="text-sm font-bold text-foreground">{animatedValues[i].toFixed(1)}k</p>
              <p className="text-[7px] text-muted-foreground">{scope.label}</p>
              <div className="flex items-center gap-0.5 mt-1 text-success">
                <TrendingDown className="w-2 h-2" />
                <span className="text-[7px] font-medium">{scope.trend}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* KPI Progress Bars */}
        <div className={cn(
          "space-y-2 transition-all duration-700",
          phase >= 2 ? "opacity-100" : "opacity-0"
        )}>
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">KPIs Durabilité</p>
          {kpis.map((kpi, i) => {
            const progress = (kpi.value / kpi.target) * 100;
            return (
              <div key={kpi.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-foreground">{kpi.label}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-semibold">{kpi.value}{kpi.unit}</span>
                    {kpi.status === 'success' ? (
                      <CheckCircle2 className="w-2.5 h-2.5 text-success" />
                    ) : (
                      <AlertTriangle className="w-2.5 h-2.5 text-warning" />
                    )}
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      kpi.status === 'success' ? "bg-success" : "bg-warning"
                    )}
                    style={{ 
                      width: phase >= 2 ? `${Math.min(progress, 100)}%` : '0%',
                      transitionDelay: `${i * 200}ms`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Site Emissions Breakdown */}
        <div className={cn(
          "p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 transition-all duration-700",
          phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-3 h-3 text-emerald-600" />
            <span className="text-[9px] font-semibold text-foreground">Émissions par Site</span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {siteEmissions.map((site) => (
              <div key={site.name} className="flex items-center justify-between px-1.5 py-1 rounded bg-background/50">
                <div className="flex items-center gap-1">
                  <span className="text-[10px]">{site.flag}</span>
                  <span className="text-[8px] text-foreground truncate">{site.name}</span>
                </div>
                <span className="text-[8px] font-semibold text-foreground">{site.emissions}k</span>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap Target */}
        <div className={cn(
          "flex items-center justify-center gap-2 transition-all duration-700",
          phase >= 3 ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Target className="w-3 h-3 text-emerald-600" />
            <span className="text-[9px] font-medium text-emerald-700">Objectif 2030: -50%</span>
            <span className="text-[8px] text-emerald-600/70">Net Zero 2050</span>
          </div>
        </div>
      </div>
    </div>
  );
}