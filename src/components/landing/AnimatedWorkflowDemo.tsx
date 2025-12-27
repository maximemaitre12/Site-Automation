import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, Check, Zap, Brain, Mail, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const integrations = [
  { name: "Slack", color: "#E01E5A", letter: "S" },
  { name: "Gmail", color: "#EA4335", letter: "G" },
  { name: "Figma", color: "#A259FF", letter: "F" },
  { name: "Notion", color: "#000000", letter: "N" },
  { name: "Salesforce", color: "#00A1E0", letter: "SF" },
];

const workflowSteps = [
  { label: "Trigger", icon: Zap, description: "New lead detected" },
  { label: "AI Parse", icon: Brain, description: "Extract key data" },
  { label: "Enrich", icon: Sparkles, description: "Add context" },
  { label: "Notify", icon: Mail, description: "Alert team" },
];

interface AnimatedWorkflowDemoProps {
  className?: string;
  agentType?: "flow" | "brain" | "support" | "hr" | "compliance" | "sales";
}

export function AnimatedWorkflowDemo({ className, agentType = "flow" }: AnimatedWorkflowDemoProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
  const [activeStep, setActiveStep] = useState(-1);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setActiveStep(-1);
      setShowComplete(false);
      return;
    }

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= workflowSteps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => setShowComplete(true), 500);
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
        "relative p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-primary/5 border border-primary/20 overflow-hidden",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10">
        {/* Connected Apps Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Connected Apps
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {integrations.map((app, i) => (
              <div
                key={app.name}
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md transition-all duration-500",
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
                )}
                style={{
                  backgroundColor: app.color,
                  transitionDelay: `${i * 100}ms`,
                }}
                title={app.name}
              >
                {app.letter}
              </div>
            ))}
            <span
              className={cn(
                "text-xs text-muted-foreground ml-2 transition-all duration-500",
                isVisible ? "opacity-100" : "opacity-0"
              )}
              style={{ transitionDelay: "500ms" }}
            >
              +100 more
            </span>
          </div>
        </div>

        {/* Workflow Animation */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Workflow Building
          </p>
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {workflowSteps.map((step, i) => {
              const StepIcon = step.icon;
              const isActive = activeStep >= i;
              const isCurrent = activeStep === i;

              return (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center gap-2 min-w-[70px]">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg",
                        isActive
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-secondary text-muted-foreground",
                        isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-background animate-pulse"
                      )}
                    >
                      {showComplete && i === workflowSteps.length - 1 ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-center">
                      <p
                        className={cn(
                          "text-xs font-medium transition-colors duration-300",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {i < workflowSteps.length - 1 && (
                    <div className="mx-2">
                      <ArrowRight
                        className={cn(
                          "w-4 h-4 transition-all duration-500",
                          activeStep > i ? "text-primary" : "text-muted-foreground/30"
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Success Message */}
        <div
          className={cn(
            "text-center transition-all duration-500",
            showComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <p className="text-sm font-medium text-foreground mb-3">
            Build your own intelligent agent in minutes
          </p>
          <Link to="/signup">
            <Button size="sm" className="shadow-lg shadow-primary/25">
              Create Your Agent
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
