import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, FileText, Search, Brain, MessageSquare, Sparkles } from "lucide-react";

const documents = [
  { name: "Policy.pdf", type: "PDF", icon: "📄" },
  { name: "Contract.docx", type: "DOC", icon: "📝" },
  { name: "Data.xlsx", type: "XLS", icon: "📊" },
];

const searchQuery = "What's our refund policy for enterprise clients?";
const aiResponse = "According to your Enterprise Agreement (Section 4.2), refunds are available within 30 days of purchase. Enterprise clients receive priority processing within 48 hours...";

interface AgentBrainDemoProps {
  className?: string;
}

export function AgentBrainDemo({ className }: AgentBrainDemoProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const [phase, setPhase] = useState(0);
  const [typedQuery, setTypedQuery] = useState("");
  const [typedResponse, setTypedResponse] = useState("");
  const [queryComplete, setQueryComplete] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);

  // Start animation when visible
  useEffect(() => {
    if (!isVisible || animationStarted) return;

    // Reset all states
    setPhase(0);
    setTypedQuery("");
    setTypedResponse("");
    setQueryComplete(false);
    setAnimationStarted(true);
    
    // Start the animation sequence
    const phase1 = setTimeout(() => setPhase(1), 300);
    const phase2 = setTimeout(() => setPhase(2), 1500);
    const phase3 = setTimeout(() => setPhase(3), 2800);

    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
    };
  }, [isVisible, animationStarted]);

  useEffect(() => {
    if (phase < 3) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= searchQuery.length) {
        setTypedQuery(searchQuery.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setQueryComplete(true);
        setTimeout(() => setPhase(5), 800);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase < 5) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= aiResponse.length) {
        setTypedResponse(aiResponse.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative p-4 rounded-xl bg-gradient-to-br from-violet-500/5 via-background to-purple-500/5 border border-violet-500/20 overflow-hidden",
        className
      )}
    >
      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-20 h-20 bg-violet-500/20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 space-y-3">
        {/* Document Upload Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2">
              Knowledge Base
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {documents.map((doc, i) => (
              <div
                key={doc.name}
                className={cn(
                  "relative flex flex-col items-center gap-1 p-2 rounded-lg bg-secondary/50 border border-border/50 transition-all duration-700 min-w-[50px]",
                  phase >= 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8",
                  phase >= 2 && "border-violet-500/30 bg-violet-500/5"
                )}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <span className="text-base">{doc.icon}</span>
                <span className="text-[9px] font-medium text-muted-foreground truncate max-w-[50px]">{doc.name}</span>
                
                {phase === 2 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-violet-500 rounded-full animate-ping" />
                )}
                {phase >= 3 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-[6px] text-white">✓</span>
                  </div>
                )}
              </div>
            ))}

            {/* AI Brain processing */}
            <div className={cn(
              "flex items-center gap-1.5 transition-all duration-500",
              phase >= 2 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            )}>
              <ArrowRight className="w-3 h-3 text-violet-500/50" />
              <div className={cn(
                "w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg",
                phase === 2 && "animate-pulse"
              )}>
                <Brain className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Interface */}
        <div className={cn(
          "transition-all duration-700",
          phase >= 3 ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border border-border/50">
            <Search className="w-3.5 h-3.5 text-violet-500" />
            <span className="flex-1 text-xs text-foreground">
              {typedQuery}
              {phase === 3 && !queryComplete && (
                <span className="animate-blink">|</span>
              )}
            </span>
          </div>
        </div>

        {/* AI Response */}
        <div className={cn(
          "transition-all duration-700",
          phase >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="p-2.5 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-violet-600 dark:text-violet-400 mb-0.5">AI Assistant</p>
                <p className="text-[11px] text-foreground leading-relaxed">
                  {typedResponse}
                  {phase === 5 && typedResponse.length < aiResponse.length && (
                    <span className="animate-blink">|</span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Sources */}
            {typedResponse.length >= aiResponse.length && (
              <div className="mt-2 pt-2 border-t border-violet-500/20">
                <p className="text-[9px] text-muted-foreground mb-1">📎 Sources:</p>
                <div className="flex gap-1 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded bg-violet-500/10 text-[9px] text-violet-600">Policy.pdf (p.12)</span>
                  <span className="px-1.5 py-0.5 rounded bg-violet-500/10 text-[9px] text-violet-600">Contract.docx (§4)</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}