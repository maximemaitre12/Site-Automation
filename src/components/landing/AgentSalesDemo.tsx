import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, TrendingUp, Phone, DollarSign, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const deals = [
  { name: "Acme Corp", value: 450000, probability: 85, stage: "Negotiation" },
  { name: "TechStart Inc", value: 280000, probability: 72, stage: "Proposal" },
  { name: "BigData Ltd", value: 190000, probability: 61, stage: "Discovery" },
];

interface AgentSalesDemoProps {
  className?: string;
}

export function AgentSalesDemo({ className }: AgentSalesDemoProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.5, triggerOnce: false });
  const [phase, setPhase] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [dealProgress, setDealProgress] = useState<number[]>([0, 0, 0]);
  const [chartHeight, setChartHeight] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    if (!isVisible) {
      setPhase(0);
      setRevenue(0);
      setDealProgress([0, 0, 0]);
      setChartHeight([0, 0, 0, 0]);
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => setPhase(3), 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isVisible]);

  // Revenue counter
  useEffect(() => {
    if (phase >= 1) {
      const target = 2400000;
      const interval = setInterval(() => {
        setRevenue(prev => {
          if (prev >= target) {
            clearInterval(interval);
            return target;
          }
          return prev + 48000;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Deal progress animation
  useEffect(() => {
    if (phase >= 2) {
      const targets = deals.map(d => d.probability);
      const interval = setInterval(() => {
        setDealProgress(prev => {
          const newProgress = prev.map((p, i) => Math.min(p + 2, targets[i]));
          if (newProgress.every((p, i) => p >= targets[i])) {
            clearInterval(interval);
          }
          return newProgress;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Chart animation
  useEffect(() => {
    if (phase >= 3) {
      const targets = [60, 75, 85, 95];
      const interval = setInterval(() => {
        setChartHeight(prev => {
          const newHeights = prev.map((h, i) => Math.min(h + 3, targets[i]));
          if (newHeights.every((h, i) => h >= targets[i])) {
            clearInterval(interval);
          }
          return newHeights;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-background to-blue-500/5 border border-cyan-500/20 overflow-hidden",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10">
        {/* Revenue header */}
        <div className={cn(
          "mb-6 transition-all duration-500",
          phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Q4 Forecast</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{formatCurrency(revenue)}</span>
                <span className="flex items-center text-emerald-500 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +23%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10">
              <Phone className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-medium text-foreground">12 calls analyzed today</span>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Deals pipeline */}
          <div className={cn(
            "transition-all duration-700",
            phase >= 2 ? "opacity-100" : "opacity-0"
          )}>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              <Target className="w-4 h-4 text-cyan-500" />
              Active Pipeline
            </div>
            <div className="space-y-3">
              {deals.map((deal, i) => (
                <div
                  key={deal.name}
                  className="p-3 rounded-lg bg-secondary/50 border border-border/50"
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{deal.name}</p>
                      <p className="text-xs text-muted-foreground">{deal.stage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-cyan-500">{formatCurrency(deal.value)}</p>
                      <p className="text-xs text-muted-foreground">{dealProgress[i]}% likely</p>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${dealProgress[i]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue chart */}
          <div className={cn(
            "transition-all duration-700",
            phase >= 3 ? "opacity-100" : "opacity-0"
          )}>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              <DollarSign className="w-4 h-4 text-cyan-500" />
              Revenue Trend
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
              <div className="flex items-end justify-between h-32 gap-3">
                {["Q1", "Q2", "Q3", "Q4"].map((quarter, i) => (
                  <div key={quarter} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative flex-1 flex items-end">
                      <div
                        className={cn(
                          "w-full rounded-t-md transition-all duration-700",
                          i === 3 
                            ? "bg-gradient-to-t from-cyan-500 to-blue-400"
                            : "bg-cyan-500/30"
                        )}
                        style={{ 
                          height: `${chartHeight[i]}%`,
                          transitionDelay: `${i * 150}ms`
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{quarter}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment analysis preview */}
        <div className={cn(
          "p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 mb-6 transition-all duration-700",
          phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">Latest Call Analysis</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-xs text-emerald-600">Positive</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Client showed strong buying signals. Key objection: pricing. Recommended action: Prepare competitive analysis and schedule follow-up.
              </p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className={cn(
          "grid grid-cols-3 gap-4 mb-6 transition-all duration-700",
          phase >= 3 ? "opacity-100" : "opacity-0"
        )}>
          <div className="text-center p-3 rounded-lg bg-cyan-500/10">
            <div className="text-2xl font-bold text-cyan-500">+35%</div>
            <div className="text-xs text-muted-foreground">Conversion</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-cyan-500/10">
            <div className="text-2xl font-bold text-cyan-500">95%</div>
            <div className="text-xs text-muted-foreground">Forecast Accuracy</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-cyan-500/10">
            <div className="text-2xl font-bold text-cyan-500">-50%</div>
            <div className="text-xs text-muted-foreground">Proposal Time</div>
          </div>
        </div>

        {/* CTA */}
        <div className={cn(
          "text-center transition-all duration-700",
          phase >= 3 ? "opacity-100" : "opacity-0"
        )}>
          <p className="text-base font-medium text-foreground mb-4">
            Close more deals with AI-powered sales intelligence
          </p>
          <Link to="/signup" onClick={(e) => e.stopPropagation()}>
            <Button size="lg" className="shadow-lg shadow-cyan-500/25 bg-cyan-500 hover:bg-cyan-600">
              Create Your Agent
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
