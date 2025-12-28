import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Check, Mail, Bot, Clock } from "lucide-react";

const tickets = [
  { id: "#1042", subject: "Can't login to my account", time: "2 min", priority: "high" },
  { id: "#1043", subject: "Need invoice for last month", time: "5 min", priority: "medium" },
];

const aiTypingMessage = "I've analyzed your issue and found your account was locked due to failed login attempts. I've sent a password reset link to your email.";

interface AgentSupportDemoProps {
  className?: string;
}

export function AgentSupportDemo({ className }: AgentSupportDemoProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const [phase, setPhase] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [typedMessage, setTypedMessage] = useState("");
  const [autoResolved, setAutoResolved] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setPhase(0);
      setResponseTime(0);
      setTypedMessage("");
      setAutoResolved(0);
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2500);
    const t4 = setTimeout(() => setPhase(4), 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isVisible]);

  useEffect(() => {
    if (phase >= 2) {
      const interval = setInterval(() => {
        setResponseTime(prev => {
          if (prev >= 12) {
            clearInterval(interval);
            return 12;
          }
          return prev + 1;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase >= 3) {
      const interval = setInterval(() => {
        setAutoResolved(prev => {
          if (prev >= 72) {
            clearInterval(interval);
            return 72;
          }
          return prev + 3;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [phase]);

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
        "relative p-4 rounded-xl bg-gradient-to-br from-violet-500/5 via-background to-blue-500/5 border border-violet-500/20 overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10">
        {/* Header stats */}
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className={cn(
            "text-center p-2 rounded-lg bg-secondary/50 transition-all duration-500",
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="text-lg font-bold text-violet-500">{responseTime}s</div>
            <div className="text-[9px] text-muted-foreground">Avg. Response</div>
          </div>
          <div className={cn(
            "text-center p-2 rounded-lg bg-secondary/50 transition-all duration-500",
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="text-lg font-bold text-violet-500">{autoResolved}%</div>
            <div className="text-[9px] text-muted-foreground">Auto-Resolved</div>
          </div>
          <div className={cn(
            "text-center p-2 rounded-lg bg-secondary/50 transition-all duration-500",
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )} style={{ transitionDelay: "150ms" }}>
            <div className="text-lg font-bold text-violet-500">4.8</div>
            <div className="text-[9px] text-muted-foreground">Satisfaction</div>
          </div>
        </div>

        {/* Ticket + AI response grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Tickets */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase">
              <Mail className="w-3 h-3 text-violet-500" />
              Tickets
            </div>
            {tickets.map((ticket, i) => (
              <div
                key={ticket.id}
                className={cn(
                  "p-2 rounded-lg bg-secondary/50 border border-border/50 transition-all duration-500",
                  phase >= 1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
                  phase >= 2 + i && "border-violet-500/30 bg-violet-500/5"
                )}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-[9px] font-mono text-muted-foreground">{ticket.id}</span>
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        ticket.priority === "high" ? "bg-violet-600" : "bg-violet-400"
                      )} />
                    </div>
                    <p className="text-[10px] text-foreground truncate">{ticket.subject}</p>
                    <p className="text-[8px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                      <Clock className="w-2 h-2" />
                      {ticket.time}
                    </p>
                  </div>
                  {phase >= 2 + i && (
                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                      <Check className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* AI Response */}
          <div className={cn(
            "transition-all duration-500",
            phase >= 4 ? "opacity-100" : "opacity-0"
          )}>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase mb-2">
              <Bot className="w-3 h-3 text-violet-500" />
              AI Response
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shrink-0">
                  <Bot className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-[9px] font-medium text-violet-600 dark:text-violet-400">Support AI</span>
                    {phase === 4 && typedMessage.length < aiTypingMessage.length && (
                      <span className="text-[8px] text-muted-foreground animate-pulse">typing...</span>
                    )}
                  </div>
                  <p className="text-[10px] text-foreground leading-relaxed">
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
          "text-center transition-all duration-500",
          phase >= 4 && typedMessage.length >= aiTypingMessage.length ? "opacity-100" : "opacity-0"
        )}>
          <p className="text-xs font-medium text-foreground">
            Resolve 70% of support tickets automatically
          </p>
        </div>
      </div>
    </div>
  );
}