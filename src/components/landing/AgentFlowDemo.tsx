import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  ArrowRight, Check, Zap, Brain, Mail, GitBranch, 
  Play, CheckCircle2, Clock, FileText
} from "lucide-react";

// Workflow blocks representing the real Flow agent capabilities
const workflowBlocks = [
  { id: "trigger", label: "New Lead", icon: Zap, type: "trigger", color: "bg-amber-500" },
  { id: "condition", label: "Score > 80?", icon: GitBranch, type: "condition", color: "bg-blue-500" },
  { id: "ai", label: "AI Analysis", icon: Brain, type: "action", color: "bg-purple-500" },
  { id: "notify", label: "Send Email", icon: Mail, type: "action", color: "bg-green-500" },
];

const executionLog = [
  { step: "Trigger activated", icon: Zap, status: "done" },
  { step: "Condition evaluated: TRUE", icon: GitBranch, status: "done" },
  { step: "AI processing lead...", icon: Brain, status: "running" },
  { step: "Email queued", icon: Mail, status: "pending" },
];

interface AgentFlowDemoProps {
  className?: string;
}

export function AgentFlowDemo({ className }: AgentFlowDemoProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const [activeBlockIndex, setActiveBlockIndex] = useState(-1);
  const [executionStep, setExecutionStep] = useState(-1);
  const [showComplete, setShowComplete] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setActiveBlockIndex(-1);
      setExecutionStep(-1);
      setShowComplete(false);
      setIsExecuting(false);
      return;
    }

    // Phase 1: Show blocks appearing
    workflowBlocks.forEach((_, i) => {
      setTimeout(() => setActiveBlockIndex(i), i * 200);
    });

    // Phase 2: Start execution animation
    const startExecution = setTimeout(() => {
      setIsExecuting(true);
      
      // Animate through execution steps
      executionLog.forEach((_, i) => {
        setTimeout(() => setExecutionStep(i), i * 700);
      });

      // Complete
      setTimeout(() => {
        setShowComplete(true);
        setIsExecuting(false);
      }, executionLog.length * 700 + 500);
    }, workflowBlocks.length * 200 + 500);

    return () => clearTimeout(startExecution);
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
        {/* Workflow Canvas Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-foreground">Lead Qualification</p>
              <p className="text-[8px] text-muted-foreground">4 blocks • Auto-trigger</p>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-medium transition-all",
            isExecuting 
              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" 
              : showComplete
                ? "bg-success/10 text-success border border-success/20"
                : "bg-muted text-muted-foreground"
          )}>
            {isExecuting ? (
              <>
                <Play className="w-3 h-3 animate-pulse" />
                Running...
              </>
            ) : showComplete ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                Complete
              </>
            ) : (
              <>
                <Clock className="w-3 h-3" />
                Ready
              </>
            )}
          </div>
        </div>

        {/* Visual Workflow Builder */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Workflow Canvas
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 hidden md:block" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-1">
              {workflowBlocks.map((block, i) => {
                const BlockIcon = block.icon;
                const isVisible = activeBlockIndex >= i;
                const isActive = executionStep >= i;
                const isCurrent = executionStep === i;

                return (
                  <div key={block.id} className="flex items-center w-full md:w-auto">
                    <div 
                      className={cn(
                        "flex flex-col items-center gap-1.5 flex-1 md:flex-initial transition-all duration-500",
                        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"
                      )}
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <div
                        className={cn(
                          "relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm border-2",
                          isActive 
                            ? `${block.color} border-transparent` 
                            : "bg-secondary border-border",
                          isCurrent && "ring-2 ring-offset-2 ring-primary/30"
                        )}
                      >
                        {isActive && showComplete ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <BlockIcon className={cn(
                            "w-5 h-5 transition-colors duration-300",
                            isActive ? "text-white" : "text-muted-foreground",
                            isCurrent && "animate-pulse"
                          )} />
                        )}
                        
                        {/* Block type indicator */}
                        <div className={cn(
                          "absolute -top-1 -right-1 w-4 h-4 rounded-full text-[7px] font-bold flex items-center justify-center",
                          block.type === "trigger" && "bg-amber-100 text-amber-700",
                          block.type === "condition" && "bg-blue-100 text-blue-700",
                          block.type === "action" && "bg-green-100 text-green-700"
                        )}>
                          {block.type === "trigger" && "T"}
                          {block.type === "condition" && "?"}
                          {block.type === "action" && "A"}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className={cn(
                          "text-[10px] font-semibold transition-colors duration-300",
                          isActive ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {block.label}
                        </p>
                      </div>
                    </div>
                    
                    {i < workflowBlocks.length - 1 && (
                      <div className="hidden md:flex items-center mx-2">
                        <div className={cn(
                          "w-4 h-0.5 rounded-full transition-all duration-500",
                          executionStep > i ? "bg-primary" : "bg-border"
                        )} />
                        <ArrowRight className={cn(
                          "w-3 h-3 -ml-0.5 transition-all duration-500",
                          executionStep > i ? "text-primary" : "text-muted-foreground/30"
                        )} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Execution Log */}
        <div className={cn(
          "transition-all duration-500",
          isExecuting || showComplete ? "opacity-100" : "opacity-0"
        )}>
          <div className="p-2 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center gap-1.5 mb-2">
              <FileText className="w-3 h-3 text-muted-foreground" />
              <span className="text-[9px] font-semibold text-muted-foreground">Execution Log</span>
            </div>
            <div className="space-y-1">
              {executionLog.map((log, i) => {
                const LogIcon = log.icon;
                const isReached = executionStep >= i;
                const isDone = executionStep > i || showComplete;
                
                return (
                  <div 
                    key={i}
                    className={cn(
                      "flex items-center gap-2 text-[9px] transition-all duration-300",
                      isReached ? "opacity-100" : "opacity-30"
                    )}
                  >
                    <LogIcon className={cn(
                      "w-3 h-3",
                      isDone ? "text-success" : executionStep === i ? "text-primary animate-pulse" : "text-muted-foreground"
                    )} />
                    <span className={cn(
                      isDone ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {log.step}
                    </span>
                    {isDone && <Check className="w-3 h-3 text-success ml-auto" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Success indicator */}
        <div className={cn(
          "flex items-center justify-center transition-all duration-700",
          showComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-[10px] font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Workflow Executed Successfully
          </div>
        </div>
      </div>
    </div>
  );
}
