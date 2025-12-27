import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, FileText, Search, Brain, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: false });
  const [phase, setPhase] = useState(0); // 0: idle, 1: docs uploading, 2: processing, 3: searching, 4: responding
  const [typedQuery, setTypedQuery] = useState("");
  const [typedResponse, setTypedResponse] = useState("");

  useEffect(() => {
    if (!isVisible) {
      setPhase(0);
      setTypedQuery("");
      setTypedResponse("");
      return;
    }

    // Phase 1: Documents upload
    const phase1 = setTimeout(() => setPhase(1), 500);
    // Phase 2: Processing
    const phase2 = setTimeout(() => setPhase(2), 2000);
    // Phase 3: Search query typing
    const phase3 = setTimeout(() => setPhase(3), 3500);
    // Phase 4: AI responding
    const phase4 = setTimeout(() => setPhase(4), 5500);

    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
      clearTimeout(phase4);
    };
  }, [isVisible]);

  // Typing effect for query
  useEffect(() => {
    if (phase < 3) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= searchQuery.length) {
        setTypedQuery(searchQuery.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [phase]);

  // Typing effect for response
  useEffect(() => {
    if (phase < 4) return;
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
        "relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-violet-500/5 via-background to-purple-500/5 border border-violet-500/20 overflow-hidden",
        className
      )}
    >
      {/* Neural network background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 15 }).map((_, i) => (
            <g key={i}>
              <circle
                cx={`${10 + (i % 5) * 20}%`}
                cy={`${10 + Math.floor(i / 5) * 35}%`}
                r="4"
                fill="hsl(var(--primary))"
              />
              {i < 12 && (
                <line
                  x1={`${10 + (i % 5) * 20}%`}
                  y1={`${10 + Math.floor(i / 5) * 35}%`}
                  x2={`${10 + ((i + 1) % 5) * 20}%`}
                  y2={`${10 + Math.floor((i + 1) / 5) * 35}%`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  opacity="0.3"
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 space-y-6">
        {/* Document Upload Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
              Knowledge Base
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
          </div>

          <div className="flex items-center justify-center gap-4">
            {documents.map((doc, i) => (
              <div
                key={doc.name}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/50 border border-border/50 transition-all duration-700",
                  phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                  phase >= 2 && "border-violet-500/30 bg-violet-500/5"
                )}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <span className="text-2xl">{doc.icon}</span>
                <span className="text-xs font-medium text-muted-foreground">{doc.name}</span>
                
                {/* Processing indicator */}
                {phase === 2 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 rounded-full animate-ping" />
                )}
                {phase >= 3 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-white">✓</span>
                  </div>
                )}
              </div>
            ))}

            {/* AI Brain processing */}
            <div className={cn(
              "flex items-center gap-3 transition-all duration-500",
              phase >= 2 ? "opacity-100" : "opacity-0"
            )}>
              <ArrowRight className="w-5 h-5 text-violet-500/50" />
              <div className={cn(
                "w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg",
                phase === 2 && "animate-pulse"
              )}>
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Interface */}
        <div className={cn(
          "transition-all duration-700",
          phase >= 3 ? "opacity-100" : "opacity-0"
        )}>
          <div className="relative">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border/50">
              <Search className="w-5 h-5 text-violet-500" />
              <span className="flex-1 text-sm text-foreground">
                {typedQuery}
                {phase === 3 && typedQuery.length < searchQuery.length && (
                  <span className="animate-blink">|</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* AI Response */}
        <div className={cn(
          "transition-all duration-700",
          phase >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-violet-600 dark:text-violet-400 mb-1">AI Assistant</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {typedResponse}
                  {phase === 4 && typedResponse.length < aiResponse.length && (
                    <span className="animate-blink">|</span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Sources */}
            {typedResponse.length >= aiResponse.length && (
              <div className="mt-4 pt-3 border-t border-violet-500/20">
                <p className="text-xs text-muted-foreground mb-2">📎 Sources:</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded bg-violet-500/10 text-xs text-violet-600">Policy.pdf (p.12)</span>
                  <span className="px-2 py-1 rounded bg-violet-500/10 text-xs text-violet-600">Contract.docx (§4)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className={cn(
          "text-center transition-all duration-700",
          phase >= 4 && typedResponse.length >= aiResponse.length ? "opacity-100" : "opacity-0"
        )}>
          <p className="text-base font-medium text-foreground mb-4">
            Turn your documents into an intelligent knowledge base
          </p>
          <Link to="/signup" onClick={(e) => e.stopPropagation()}>
            <Button size="lg" className="shadow-lg shadow-violet-500/25 bg-violet-500 hover:bg-violet-600">
              Create Your Agent
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
