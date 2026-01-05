import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  Building2, Database, CheckCircle2, Globe, Sparkles, 
  ArrowRight, RefreshCw, Shield, Layers, TrendingUp
} from "lucide-react";

const sites = [
  { name: "HQ Paris", flag: "🇫🇷", records: "1.2M", status: "synced" },
  { name: "Lyon Tech", flag: "🇫🇷", records: "856K", status: "synced" },
  { name: "Shanghai", flag: "🇨🇳", records: "2.1M", status: "syncing" },
  { name: "Barcelona", flag: "🇪🇸", records: "445K", status: "synced" },
];

const enrichmentSteps = [
  { label: "Collect", icon: Globe, description: "Multi-site" },
  { label: "Dedupe", icon: Layers, description: "Merge" },
  { label: "Enrich", icon: Sparkles, description: "AI" },
  { label: "Govern", icon: Shield, description: "Quality" },
];

interface AgentDataDemoProps {
  className?: string;
}

export function AgentDataDemo({ className }: AgentDataDemoProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const [activeStep, setActiveStep] = useState(-1);
  const [showComplete, setShowComplete] = useState(false);
  const [activeSites, setActiveSites] = useState<number[]>([]);
  const [enrichedData, setEnrichedData] = useState<{field: string; value: string}[]>([]);

  useEffect(() => {
    if (!isVisible) {
      setActiveStep(-1);
      setShowComplete(false);
      setActiveSites([]);
      setEnrichedData([]);
      return;
    }

    // Animate sites first
    sites.forEach((_, i) => {
      setTimeout(() => setActiveSites(prev => [...prev, i]), i * 150);
    });

    // Then workflow steps
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= enrichmentSteps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setShowComplete(true);
            // Show enriched data
            setEnrichedData([
              { field: "Industry", value: "Automotive" },
              { field: "Revenue", value: "€2.4B" },
              { field: "Quality", value: "98%" },
            ]);
          }, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(stepInterval);
  }, [isVisible]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative p-4 rounded-xl bg-card border border-border overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-agent-data/10 rounded-full blur-2xl" />

      <div className="relative z-10 space-y-3">
        {/* Multi-Site Data Sources */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Multi-Site Data
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {sites.map((site, i) => (
              <div
                key={site.name}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-lg border transition-all duration-500",
                  activeSites.includes(i) 
                    ? "bg-agent-data/5 border-agent-data/30 opacity-100" 
                    : "bg-secondary/50 border-border opacity-50"
                )}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="text-sm">{site.flag}</span>
                <div className="text-left">
                  <span className="text-[9px] font-medium text-foreground block">{site.name}</span>
                  <span className="text-[7px] text-muted-foreground">{site.records}</span>
                </div>
                {activeSites.includes(i) && site.status === 'syncing' && (
                  <RefreshCw className="w-2.5 h-2.5 text-agent-data animate-spin" />
                )}
                {activeSites.includes(i) && site.status === 'synced' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Pipeline */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
              AI Data Pipeline
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 hidden md:block" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-1">
              {enrichmentSteps.map((step, i) => {
                const StepIcon = step.icon;
                const isActive = activeStep >= i;
                const isCurrent = activeStep === i;

                return (
                  <div key={step.label} className="flex items-center w-full md:w-auto">
                    <div className="flex flex-col items-center gap-1.5 flex-1 md:flex-initial">
                      <div
                        className={cn(
                          "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm",
                          isActive
                            ? "bg-agent-data scale-100"
                            : "bg-secondary scale-90",
                          isCurrent && "ring-2 ring-agent-data/25"
                        )}
                      >
                        {showComplete && i === enrichmentSteps.length - 1 ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : (
                          <StepIcon className={cn(
                            "w-5 h-5 transition-colors duration-300",
                            isActive ? "text-white" : "text-muted-foreground",
                            isCurrent && i === 2 && "animate-pulse"
                          )} />
                        )}
                        
                        {isActive && (
                          <div className="absolute inset-0 rounded-xl bg-agent-data blur-lg opacity-40" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className={cn(
                          "text-[10px] font-semibold transition-colors duration-300",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {step.label}
                        </p>
                        <p className="text-[8px] text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    
                    {i < enrichmentSteps.length - 1 && (
                      <div className="hidden md:flex items-center mx-2">
                        <div className={cn(
                          "w-4 h-0.5 rounded-full transition-all duration-500",
                          activeStep > i ? "bg-agent-data" : "bg-border"
                        )} />
                        <ArrowRight className={cn(
                          "w-3 h-3 -ml-0.5 transition-all duration-500",
                          activeStep > i ? "text-agent-data" : "text-muted-foreground/30"
                        )} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Enrichment Result */}
        <div className={cn(
          "space-y-2 transition-all duration-700",
          showComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-agent-data/10 text-agent-data text-[10px] font-medium">
              <Sparkles className="w-3 h-3" />
              Data Enriched & Governed
            </div>
          </div>
          
          {/* Enriched fields preview */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {enrichedData.map((data, i) => (
              <div
                key={data.field}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/50 border border-agent-data/20 animate-fade-in"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <span className="text-[8px] text-muted-foreground">{data.field}:</span>
                <span className="text-[9px] font-semibold text-agent-data">{data.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
