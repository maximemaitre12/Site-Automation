import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
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
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [typedQuery, setTypedQuery] = useState("");
  const [typedResponse, setTypedResponse] = useState("");
  const [queryComplete, setQueryComplete] = useState(false);
  const [responseStarted, setResponseStarted] = useState(false);

  // Start animation immediately on mount
  useEffect(() => {
    const phase1 = setTimeout(() => setPhase(1), 300);
    const phase2 = setTimeout(() => setPhase(2), 1200);
    const phase3 = setTimeout(() => setPhase(3), 2000);

    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
    };
  }, []);

  // Type the query only when phase becomes exactly 3
  useEffect(() => {
    if (phase !== 3 || queryComplete) return;
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
  }, [phase, queryComplete]);

  // Type the response only when phase becomes exactly 5
  useEffect(() => {
    if (phase !== 5 || responseStarted) return;
    setResponseStarted(true);
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
        "relative p-4 rounded-xl bg-card border border-border overflow-hidden",
        className
      )}
    >
      {/* Subtle background */}
      <div className="absolute top-0 left-1/4 w-20 h-20 bg-muted/50 rounded-full blur-2xl" />

      <div className="relative z-10 space-y-3">
        {/* Document Upload Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2">
              Knowledge Base
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {documents.map((doc, i) => (
              <div
                key={doc.name}
                className={cn(
                  "relative flex flex-col items-center gap-1 p-2 rounded-lg bg-secondary/50 border border-border transition-all duration-700 min-w-[50px]",
                  phase >= 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8",
                  phase >= 2 && "border-primary/30 bg-primary/5"
                )}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <span className="text-base">{doc.icon}</span>
                <span className="text-[9px] font-medium text-muted-foreground truncate max-w-[50px]">{doc.name}</span>
                
                {phase === 2 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping" />
                )}
                {phase >= 3 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-[6px] text-primary-foreground">✓</span>
                  </div>
                )}
              </div>
            ))}

            {/* AI Brain processing */}
            <div className={cn(
              "flex items-center gap-1.5 transition-all duration-500",
              phase >= 2 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            )}>
              <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
              <div className={cn(
                "w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm",
                phase === 2 && "animate-pulse"
              )}>
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Interface */}
        <div className={cn(
          "transition-all duration-700",
          phase >= 3 ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border border-border">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
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
          <div className="p-2.5 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-muted-foreground mb-0.5">AI Assistant</p>
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
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-[9px] text-muted-foreground mb-1">📎 Sources:</p>
                <div className="flex gap-1 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded bg-muted text-[9px] text-muted-foreground">Policy.pdf (p.12)</span>
                  <span className="px-1.5 py-0.5 rounded bg-muted text-[9px] text-muted-foreground">Contract.docx (§4)</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}