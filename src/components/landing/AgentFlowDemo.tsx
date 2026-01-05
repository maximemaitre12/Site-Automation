import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, Check, Zap, Brain, Mail, Sparkles, Building2, RefreshCw, Globe, Layers } from "lucide-react";

const sites = [
  { name: "Paris", flag: "🇫🇷", status: "active" },
  { name: "Lyon", flag: "🇫🇷", status: "active" },
  { name: "Shanghai", flag: "🇨🇳", status: "syncing" },
  { name: "Beijing", flag: "🇨🇳", status: "active" },
  { name: "Marseille", flag: "🇫🇷", status: "active" },
];

const workflowSteps = [
  { label: "Collect", icon: Globe, description: "Multi-site", color: "bg-primary" },
  { label: "Harmonize", icon: Layers, description: "Standards", color: "bg-primary" },
  { label: "AI Process", icon: Brain, description: "Automate", color: "bg-primary" },
  { label: "Deploy", icon: RefreshCw, description: "All sites", color: "bg-primary" },
];

interface AgentFlowDemoProps {
  className?: string;
}

export function AgentFlowDemo({ className }: AgentFlowDemoProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const [activeStep, setActiveStep] = useState(-1);
  const [showComplete, setShowComplete] = useState(false);
  const [activeSites, setActiveSites] = useState<number[]>([]);

  useEffect(() => {
    if (!isVisible) {
      setActiveStep(-1);
      setShowComplete(false);
      setActiveSites([]);
      return;
    }

    // Animate sites first
    sites.forEach((_, i) => {
      setTimeout(() => setActiveSites(prev => [...prev, i]), i * 150);
    });

    // Then workflow steps
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= workflowSteps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => setShowComplete(true), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 900);

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
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />

      <div className="relative z-10 space-y-3">
        {/* Multi-Site Sources */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Multi-Site Sources
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
                    ? "bg-primary/5 border-primary/30 opacity-100" 
                    : "bg-secondary/50 border-border opacity-50"
                )}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="text-sm">{site.flag}</span>
                <span className="text-[9px] font-medium text-foreground">{site.name}</span>
                {activeSites.includes(i) && site.status === 'syncing' && (
                  <RefreshCw className="w-2.5 h-2.5 text-primary animate-spin" />
                )}
                {activeSites.includes(i) && site.status === 'active' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Process Harmonization Workflow */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Process Harmonization
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 hidden md:block" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-1">
              {workflowSteps.map((step, i) => {
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
                            ? `${step.color} scale-100`
                            : "bg-secondary scale-90",
                          isCurrent && "ring-2 ring-primary/25"
                        )}
                      >
                        {showComplete && i === workflowSteps.length - 1 ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <StepIcon className={cn(
                            "w-5 h-5 transition-colors duration-300",
                            isActive ? "text-primary-foreground" : "text-muted-foreground",
                            isCurrent && i === 3 && "animate-spin"
                          )} />
                        )}
                        
                        {isActive && (
                          <div className={cn(
                            "absolute inset-0 rounded-xl blur-lg opacity-40",
                            step.color
                          )} />
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
                    
                    {i < workflowSteps.length - 1 && (
                      <div className="hidden md:flex items-center mx-2">
                        <div className={cn(
                          "w-4 h-0.5 rounded-full transition-all duration-500",
                          activeStep > i ? "bg-primary" : "bg-border"
                        )} />
                        <ArrowRight className={cn(
                          "w-3 h-3 -ml-0.5 transition-all duration-500",
                          activeStep > i ? "text-primary" : "text-muted-foreground/30"
                        )} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Success indicator with cross-site deployment */}
        <div className={cn(
          "space-y-2 transition-all duration-700",
          showComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
              <Check className="w-3 h-3" />
              Process Standardized
            </div>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-[8px] text-muted-foreground">Deployed to</span>
            {sites.map((site, i) => (
              <span 
                key={site.name}
                className="text-sm animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {site.flag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
