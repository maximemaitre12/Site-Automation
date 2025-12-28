import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, Phone, DollarSign, Target } from "lucide-react";

const deals = [
  { name: "Acme Corp", value: 450000, probability: 85, stage: "Negotiation" },
  { name: "TechStart Inc", value: 280000, probability: 72, stage: "Proposal" },
  { name: "BigData Ltd", value: 190000, probability: 61, stage: "Discovery" },
];

interface AgentSalesDemoProps {
  className?: string;
}

export function AgentSalesDemo({ className }: AgentSalesDemoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [dealProgress, setDealProgress] = useState<number[]>([0, 0, 0]);
  const [chartHeight, setChartHeight] = useState<number[]>([0, 0, 0, 0]);

  // Start animation immediately on mount
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    if (phase >= 1) {
      const target = 2400000;
      const interval = setInterval(() => {
        setRevenue(prev => {
          if (prev >= target) {
            clearInterval(interval);
            return target;
          }
          return prev + 60000;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase >= 2) {
      const targets = deals.map(d => d.probability);
      const interval = setInterval(() => {
        setDealProgress(prev => {
          const newProgress = prev.map((p, i) => Math.min(p + 3, targets[i]));
          if (newProgress.every((p, i) => p >= targets[i])) clearInterval(interval);
          return newProgress;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase >= 3) {
      const targets = [60, 75, 85, 95];
      const interval = setInterval(() => {
        setChartHeight(prev => {
          const newHeights = prev.map((h, i) => Math.min(h + 4, targets[i]));
          if (newHeights.every((h, i) => h >= targets[i])) clearInterval(interval);
          return newHeights;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative p-4 rounded-xl bg-card border border-border overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 left-1/4 w-24 h-24 bg-muted/50 rounded-full blur-2xl" />

      <div className="relative z-10">
        {/* Revenue header */}
        <div className={cn(
          "mb-3 transition-all duration-500",
          phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Q4 Forecast</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-foreground">{formatCurrency(revenue)}</span>
                <span className="flex items-center text-primary text-[10px] font-medium">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  +23%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-secondary border border-border">
              <Phone className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-medium text-foreground">12 calls</span>
            </div>
          </div>
        </div>

        {/* Deals + Chart grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Deals pipeline */}
          <div className={cn("transition-all duration-500", phase >= 2 ? "opacity-100" : "opacity-0")}>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase mb-2">
              <Target className="w-3 h-3 text-primary" />
              Pipeline
            </div>
            <div className="space-y-1.5">
              {deals.map((deal, i) => (
                <div key={deal.name} className="p-1.5 rounded bg-secondary/50 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-medium text-foreground truncate">{deal.name}</p>
                    <p className="text-[10px] font-bold text-primary">{formatCurrency(deal.value)}</p>
                  </div>
                  <div className="h-1 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${dealProgress[i]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue chart */}
          <div className={cn("transition-all duration-500", phase >= 3 ? "opacity-100" : "opacity-0")}>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase mb-2">
              <DollarSign className="w-3 h-3 text-primary" />
              Revenue
            </div>
            <div className="p-2 rounded bg-secondary/50 border border-border">
              <div className="flex items-end justify-between gap-1.5">
                {["Q1", "Q2", "Q3", "Q4"].map((quarter, i) => (
                  <div key={quarter} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="h-14 w-full relative flex items-end">
                      <div
                        className={cn(
                          "w-full rounded-t transition-all duration-500",
                          i === 3 ? "bg-primary" : "bg-primary/30"
                        )}
                        style={{ height: `${chartHeight[i]}%`, transitionDelay: `${i * 100}ms` }}
                      />
                    </div>
                    <span className="text-[8px] text-muted-foreground">{quarter}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call analysis - compact */}
        <div className={cn(
          "p-2 rounded-lg bg-secondary/50 border border-border mb-3 transition-all duration-500",
          phase >= 3 ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center shrink-0">
              <Phone className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-foreground">Latest Call</span>
                <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-[8px] text-primary">Positive</span>
              </div>
              <p className="text-[9px] text-muted-foreground truncate">
                Strong buying signals. Action: competitive analysis
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}