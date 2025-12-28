import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, Check, Zap, Brain, Mail, Sparkles } from "lucide-react";
import { 
  SlackLogo, GmailLogo, FigmaLogo, NotionLogo, SalesforceLogo,
  HubSpotLogo, ZapierLogo 
} from "./BrandLogos";

const integrations = [
  { name: "Slack", Logo: SlackLogo, color: "#4A154B" },
  { name: "Gmail", Logo: GmailLogo, color: "#EA4335" },
  { name: "Figma", Logo: FigmaLogo, color: "#F24E1E" },
  { name: "Notion", Logo: NotionLogo, color: "#000000" },
  { name: "Salesforce", Logo: SalesforceLogo, color: "#00A1E0" },
  { name: "HubSpot", Logo: HubSpotLogo, color: "#FF7A59" },
  { name: "Zapier", Logo: ZapierLogo, color: "#FF4A00" },
];

const workflowSteps = [
  { label: "Trigger", icon: Zap, description: "New lead", color: "bg-blue-500" },
  { label: "AI Parse", icon: Brain, description: "Extract", color: "bg-violet-500" },
  { label: "Enrich", icon: Sparkles, description: "Context", color: "bg-amber-500" },
  { label: "Notify", icon: Mail, description: "Alert", color: "bg-emerald-500" },
];

interface AgentFlowDemoProps {
  className?: string;
}

export function AgentFlowDemo({ className }: AgentFlowDemoProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const [activeStep, setActiveStep] = useState(-1);
  const [showComplete, setShowComplete] = useState(false);
  const [dataParticles, setDataParticles] = useState<number[]>([]);

  useEffect(() => {
    if (!isVisible) {
      setActiveStep(-1);
      setShowComplete(false);
      setDataParticles([]);
      return;
    }

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= workflowSteps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => setShowComplete(true), 500);
          return prev;
        }
        setDataParticles(arr => [...arr, prev + 1]);
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(stepInterval);
  }, [isVisible]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative p-4 rounded-xl bg-gradient-to-br from-blue-500/5 via-background to-violet-500/5 border border-blue-500/20 overflow-hidden",
        className
      )}
    >
      {/* Background decorations */}
      <div 
        className="absolute top-0 right-0 w-32 h-24 bg-gradient-to-br from-[hsl(260_70%_80%/0.2)] to-[hsl(200_80%_85%/0.15)] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-2xl -translate-y-1/2 translate-x-1/4 animate-cloud-morph"
        style={{ animationDuration: "15s" }}
      />
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/15 rounded-full blur-2xl animate-pulse" />

      <div className="relative z-10">
        {/* Connected Apps */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2">
              Connected Apps
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          </div>
          
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {integrations.map((app, i) => {
              const Logo = app.Logo;
              return (
                <div
                  key={app.name}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-all duration-500 hover:scale-110",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={{
                    backgroundColor: app.color,
                    transitionDelay: `${i * 60}ms`,
                  }}
                  title={app.name}
                >
                  <Logo className="w-4 h-4 text-white" />
                </div>
              );
            })}
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/50 border border-border/50 transition-all duration-500",
                isVisible ? "opacity-100" : "opacity-0"
              )}
              style={{ transitionDelay: "500ms" }}
            >
              <span className="text-[10px] font-medium text-muted-foreground">+100</span>
            </div>
          </div>
        </div>

        {/* Workflow Animation */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2">
              Workflow
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-emerald-500/20 -translate-y-1/2 hidden md:block" />
            
            {dataParticles.map((step, i) => (
              <div
                key={i}
                className="absolute top-1/2 w-1.5 h-1.5 bg-blue-400/80 rounded-full -translate-y-1/2 animate-fade-in hidden md:block"
                style={{
                  left: `${(step / (workflowSteps.length - 1)) * 100}%`,
                }}
              />
            ))}

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
                          "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-md",
                          isActive
                            ? `${step.color} scale-100`
                            : "bg-secondary scale-90",
                          isCurrent && "ring-2 ring-blue-500/25"
                        )}
                      >
                        {showComplete && i === workflowSteps.length - 1 ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <StepIcon className={cn(
                            "w-5 h-5 transition-colors duration-300",
                            isActive ? "text-white" : "text-muted-foreground"
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
                        <p className="text-[9px] text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    
                    {i < workflowSteps.length - 1 && (
                      <div className="hidden md:flex items-center mx-2">
                        <div className={cn(
                          "w-4 h-0.5 rounded-full transition-all duration-500",
                          activeStep > i ? "bg-blue-500" : "bg-border"
                        )} />
                        <ArrowRight className={cn(
                          "w-3 h-3 -ml-0.5 transition-all duration-500",
                          activeStep > i ? "text-blue-500" : "text-muted-foreground/30"
                        )} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Success CTA */}
        <div className={cn(
          "text-center transition-all duration-700",
          showComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-medium mb-2">
            <Check className="w-3 h-3" />
            Workflow executed
          </div>
          <p className="text-xs font-medium text-foreground">
            Build intelligent automations in minutes
          </p>
        </div>
      </div>
    </div>
  );
}