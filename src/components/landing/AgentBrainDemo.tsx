import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Building2, MapPin, Database, CheckCircle2, Layers, Globe, Search, Brain, Sparkles } from "lucide-react";

const sites = [
  { name: "HQ", location: "Paris", flag: "🇫🇷", docs: 1247, status: "synced" },
  { name: "Tech Hub", location: "Lyon", flag: "🇫🇷", docs: 456, status: "synced" },
  { name: "Asia Pacific", location: "Shanghai", flag: "🇨🇳", docs: 892, status: "syncing" },
  { name: "Northern", location: "Beijing", flag: "🇨🇳", docs: 278, status: "synced" },
  { name: "Southern", location: "Marseille", flag: "🇫🇷", docs: 198, status: "synced" },
];

const searchQuery = "Maintenance procedure for Shanghai site?";
const aiResponse = "According to the Asia Pacific Technical Manual (v3.2), preventive maintenance follows protocol MT-2024. Unified documentation from 5 sites...";

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
  const [syncedSites, setSyncedSites] = useState<number[]>([]);

  useEffect(() => {
    const phase1 = setTimeout(() => setPhase(1), 300);
    const phase2 = setTimeout(() => setPhase(2), 1500);
    const phase3 = setTimeout(() => setPhase(3), 2800);

    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
      clearTimeout(phase3);
    };
  }, []);

  // Animate sites syncing
  useEffect(() => {
    if (phase >= 1) {
      sites.forEach((_, i) => {
        setTimeout(() => {
          setSyncedSites(prev => [...prev, i]);
        }, i * 200);
      });
    }
  }, [phase]);

  // Type the query
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
        setTimeout(() => setPhase(5), 600);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [phase, queryComplete]);

  // Type the response
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
    }, 18);
    return () => clearInterval(interval);
  }, [phase, responseStarted]);

  const totalDocs = sites.reduce((sum, s) => sum + s.docs, 0);

  return (
    <div
      ref={ref}
      className={cn(
        "relative p-4 rounded-xl bg-card border border-border overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 left-1/4 w-20 h-20 bg-agent-brain/20 rounded-full blur-2xl" />

      <div className="relative z-10 space-y-3">
        {/* Multi-Site Hub Header */}
        <div className={cn(
          "flex items-center justify-between transition-all duration-500",
          phase >= 1 ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-agent-brain to-agent-brain/60 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-foreground">Unified Hub</p>
              <p className="text-[8px] text-muted-foreground">{sites.length} sites • {totalDocs.toLocaleString()} docs</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-success/10 border border-success/20">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[9px] font-medium text-success">Synchronized</span>
          </div>
        </div>

        {/* Sites Grid - Multi-location visualization */}
        <div className={cn(
          "transition-all duration-500",
          phase >= 1 ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
              Knowledge Sources
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {sites.map((site, i) => (
              <div
                key={site.name}
                className={cn(
                  "relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-secondary/50 border transition-all duration-500",
                  syncedSites.includes(i) 
                    ? "border-agent-brain/30 bg-agent-brain/5" 
                    : "border-border opacity-50"
                )}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="text-sm">{site.flag}</span>
                <div>
                  <p className="text-[9px] font-medium text-foreground">{site.name}</p>
                  <p className="text-[7px] text-muted-foreground">{site.docs} docs</p>
                </div>
                {syncedSites.includes(i) && (
                  <CheckCircle2 className="w-3 h-3 text-success absolute -top-1 -right-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Central Hub Animation */}
        <div className={cn(
          "flex items-center justify-center gap-2 py-2 transition-all duration-700",
          phase >= 2 ? "opacity-100" : "opacity-0"
        )}>
          <Globe className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-0.5">
            {[0,1,2].map(i => (
              <div 
                key={i}
                className="w-1 h-1 rounded-full bg-agent-brain animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agent-brain to-agent-brain/60 flex items-center justify-center shadow-lg shadow-agent-brain/20">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div className="flex gap-0.5">
            {[0,1,2].map(i => (
              <div 
                key={i}
                className="w-1 h-1 rounded-full bg-agent-brain animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          <Brain className="w-4 h-4 text-muted-foreground" />
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
                <span className="animate-pulse">|</span>
              )}
            </span>
          </div>
        </div>

        {/* AI Response with Multi-Site Context */}
        <div className={cn(
          "transition-all duration-700",
          phase >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="p-2.5 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-md bg-agent-brain flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-muted-foreground mb-0.5">AI Assistant</p>
                <p className="text-[10px] text-foreground leading-relaxed">
                  {typedResponse}
                  {phase === 5 && typedResponse.length < aiResponse.length && (
                    <span className="animate-pulse">|</span>
                  )}
                </p>
              </div>
            </div>
            
            {typedResponse.length >= aiResponse.length && (
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-[8px] text-muted-foreground mb-1">📍 Multi-site sources:</p>
                <div className="flex gap-1 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded bg-agent-brain/10 text-[8px] text-agent-brain">🇨🇳 Shanghai - Tech Manual</span>
                  <span className="px-1.5 py-0.5 rounded bg-agent-brain/10 text-[8px] text-agent-brain">🇫🇷 Paris - Procedures</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
