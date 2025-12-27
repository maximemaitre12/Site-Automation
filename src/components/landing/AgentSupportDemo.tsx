import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight, Check, Mail, Bot, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const tickets = [
  { id: "#1042", subject: "Can't login to my account", time: "2 min ago", priority: "high" },
  { id: "#1043", subject: "Need invoice for last month", time: "5 min ago", priority: "medium" },
  { id: "#1044", subject: "How to export my data?", time: "8 min ago", priority: "low" },
];

const aiTypingMessage = "I've analyzed your issue and found that your account was locked due to multiple failed login attempts. I've sent a password reset link to your email. You should be able to access your account within the next few minutes.";

interface AgentSupportDemoProps {
  className?: string;
}

export function AgentSupportDemo({ className }: AgentSupportDemoProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: false });
  const [phase, setPhase] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [typedMessage, setTypedMessage] = useState("");
  const [satisfaction, setSatisfaction] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setPhase(0);
      setResolvedCount(0);
      setTypedMessage("");
      setSatisfaction(0);
      return;
    }

    // Animate phases
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2500);
    const t4 = setTimeout(() => setPhase(4), 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isVisible]);

  // Counter animation for resolved tickets
  useEffect(() => {
    if (phase >= 2) {
      const interval = setInterval(() => {
        setResolvedCount(prev => {
          if (prev >= 847) {
            clearInterval(interval);
            return 847;
          }
          return prev + 17;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Satisfaction animation
  useEffect(() => {
    if (phase >= 3) {
      const interval = setInterval(() => {
        setSatisfaction(prev => {
          if (prev >= 72) {
            clearInterval(interval);
            return 72;
          }
          return prev + 2;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Typing effect
  useEffect(() => {
    if (phase < 4) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= aiTypingMessage.length) {
        setTypedMessage(aiTypingMessage.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-background to-teal-500/5 border border-emerald-500/20 overflow-hidden",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10">
        {/* Header stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
          <div className={cn(
            "text-center p-4 rounded-xl bg-secondary/50 transition-all duration-500",
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="text-2xl font-bold text-emerald-500">{resolvedCount}</div>
            <div className="text-xs text-muted-foreground">Tickets Today</div>
          </div>
          <div className={cn(
            "text-center p-4 rounded-xl bg-secondary/50 transition-all duration-500",
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="text-2xl font-bold text-emerald-500">{satisfaction}%</div>
            <div className="text-xs text-muted-foreground">Auto-Resolved</div>
          </div>
          <div className={cn(
            "text-center p-4 rounded-xl bg-secondary/50 transition-all duration-500",
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )} style={{ transitionDelay: "200ms" }}>
            <div className="text-2xl font-bold text-emerald-500">4.8/5</div>
            <div className="text-xs text-muted-foreground">Satisfaction</div>
          </div>
        </div>

        {/* Ticket resolution demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Incoming tickets */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Mail className="w-4 h-4 text-amber-500" />
              Incoming Tickets
            </div>
            {tickets.map((ticket, i) => (
              <div
                key={ticket.id}
                className={cn(
                  "p-3 rounded-lg bg-secondary/50 border border-border/50 transition-all duration-500",
                  phase >= 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8",
                  phase >= 2 + i && "border-emerald-500/30 bg-emerald-500/5"
                )}
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        ticket.priority === "high" ? "bg-red-500" :
                        ticket.priority === "medium" ? "bg-amber-500" : "bg-blue-500"
                      )} />
                    </div>
                    <p className="text-sm text-foreground truncate">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {ticket.time}
                    </p>
                  </div>
                  {phase >= 2 + i && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center animate-scale-in">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* AI Response */}
          <div className={cn(
            "transition-all duration-700",
            phase >= 4 ? "opacity-100" : "opacity-0"
          )}>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              <Bot className="w-4 h-4 text-emerald-500" />
              AI Agent Response
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Support AI</span>
                    {phase === 4 && typedMessage.length < aiTypingMessage.length && (
                      <span className="text-xs text-muted-foreground animate-pulse">typing...</span>
                    )}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {typedMessage}
                    {phase === 4 && typedMessage.length < aiTypingMessage.length && (
                      <span className="animate-blink">|</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={cn(
          "text-center transition-all duration-700",
          phase >= 4 && typedMessage.length >= aiTypingMessage.length ? "opacity-100" : "opacity-0"
        )}>
          <p className="text-base font-medium text-foreground mb-4">
            Resolve 70% of support tickets automatically
          </p>
          <Link to="/signup" onClick={(e) => e.stopPropagation()}>
            <Button size="lg" className="shadow-lg shadow-emerald-500/25 bg-emerald-500 hover:bg-emerald-600">
              Create Your Agent
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
