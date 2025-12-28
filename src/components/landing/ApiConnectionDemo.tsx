import { useState, useEffect } from "react";
import { Check, Loader2, Bell } from "lucide-react";
import { SlackLogo } from "./BrandLogos";

const notifications = [
  { user: "Sarah", message: "Deal closed: TechCorp $45K", time: "now" },
  { user: "Mike", message: "New lead assigned to you", time: "2s" },
  { user: "AI Bot", message: "Weekly report ready", time: "5s" },
];

export function ApiConnectionDemo() {
  const [phase, setPhase] = useState<"idle" | "typing" | "connecting" | "connected" | "notifications">("idle");
  const [typedKey, setTypedKey] = useState("");
  const [visibleNotifications, setVisibleNotifications] = useState<number[]>([]);
  
  const apiKey = "xoxb-8274••••••••";
  
  // Auto-start animation loop
  useEffect(() => {
    const startAnimation = () => {
      setPhase("idle");
      setTypedKey("");
      setVisibleNotifications([]);
      
      // Start typing after a brief pause
      setTimeout(() => {
        setPhase("typing");
      }, 800);
    };
    
    startAnimation();
    const interval = setInterval(startAnimation, 10000);
    return () => clearInterval(interval);
  }, []);
  
  // Typing effect
  useEffect(() => {
    if (phase !== "typing") return;
    
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < apiKey.length) {
        setTypedKey(apiKey.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setPhase("connecting"), 300);
      }
    }, 80);
    
    return () => clearInterval(typeInterval);
  }, [phase]);
  
  // Connecting -> Connected
  useEffect(() => {
    if (phase === "connecting") {
      setTimeout(() => setPhase("connected"), 1200);
    }
  }, [phase]);
  
  // Connected -> Show notifications
  useEffect(() => {
    if (phase === "connected") {
      setTimeout(() => setPhase("notifications"), 400);
    }
  }, [phase]);
  
  // Show notifications one by one
  useEffect(() => {
    if (phase !== "notifications") return;
    
    notifications.forEach((_, i) => {
      setTimeout(() => {
        setVisibleNotifications(prev => [...prev, i]);
      }, i * 400);
    });
  }, [phase]);

  return (
    <div className="relative w-full max-w-xs mx-auto">
      {/* Main card */}
      <div className="relative bg-card border border-border rounded-xl p-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[#4A154B] flex items-center justify-center">
            <SlackLogo className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground">Slack</p>
            <p className="text-[10px] text-muted-foreground">API Integration</p>
          </div>
          {(phase === "connected" || phase === "notifications") && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 animate-scale-in">
              <Check className="w-2.5 h-2.5" />
              <span className="text-[9px] font-medium">Live</span>
            </div>
          )}
        </div>
        
        {/* API Key input */}
        <div className="relative mb-3">
          <div className={`
            flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono
            transition-all duration-300
            ${phase === "connecting" ? "border-primary bg-primary/5" : "border-border bg-secondary/50"}
            ${(phase === "connected" || phase === "notifications") ? "border-emerald-500/50 bg-emerald-500/5" : ""}
          `}>
            <span className="text-muted-foreground select-none">Key:</span>
            <span className="text-foreground flex-1">
              {typedKey}
              {phase === "typing" && (
                <span className="inline-block w-0.5 h-3.5 bg-primary ml-0.5 animate-pulse" />
              )}
            </span>
            {phase === "connecting" && (
              <Loader2 className="w-3 h-3 text-primary animate-spin" />
            )}
            {(phase === "connected" || phase === "notifications") && (
              <Check className="w-3 h-3 text-emerald-500" />
            )}
          </div>
          
          {/* Connection line animation */}
          {phase === "connecting" && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1">
              <div className="h-full bg-gradient-to-r from-transparent via-primary to-transparent rounded-full animate-pulse" />
            </div>
          )}
        </div>
        
        {/* Notifications area */}
        <div className="space-y-1.5 min-h-[72px]">
          {phase === "notifications" && notifications.map((notif, i) => (
            <div
              key={i}
              className={`
                flex items-start gap-2 p-2 rounded-lg bg-secondary/70 border border-border/50
                transition-all duration-300
                ${visibleNotifications.includes(i) 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-2"
                }
              `}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <Bell className="w-3 h-3 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-foreground truncate">{notif.user}</p>
                <p className="text-[9px] text-muted-foreground truncate">{notif.message}</p>
              </div>
              <span className="text-[8px] text-muted-foreground shrink-0">{notif.time}</span>
            </div>
          ))}
          
          {/* Placeholder when not showing notifications */}
          {phase !== "notifications" && (
            <div className="flex items-center justify-center h-[72px] text-[10px] text-muted-foreground">
              {phase === "idle" && "Waiting for API key..."}
              {phase === "typing" && "Entering credentials..."}
              {phase === "connecting" && "Establishing connection..."}
              {phase === "connected" && "Connection established!"}
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle glow effect when connected */}
      {(phase === "connected" || phase === "notifications") && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-xl blur-xl animate-pulse" />
      )}
    </div>
  );
}