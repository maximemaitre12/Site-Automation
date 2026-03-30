import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Brain, Database, BarChart3, Zap, Target, TrendingUp,
  Activity, Cpu, Globe, Shield, LineChart,
} from "lucide-react";

const nodes = [
  { id: "data", label: "Données", icon: Database, row: 0, col: 0 },
  { id: "process", label: "Processus", icon: Activity, row: 0, col: 1 },
  { id: "security", label: "Conformité", icon: Shield, row: 0, col: 2 },
  { id: "supply", label: "Supply Chain", icon: Globe, row: 1, col: 0 },
  { id: "ai", label: "IA Engine", icon: Brain, row: 1, col: 1, center: true },
  { id: "analytics", label: "Analytics", icon: LineChart, row: 1, col: 2 },
  { id: "optim", label: "Optimisation", icon: Zap, row: 2, col: 0 },
  { id: "predict", label: "Prédiction", icon: TrendingUp, row: 2, col: 1 },
  { id: "decision", label: "Décision", icon: Target, row: 2, col: 2 },
];

const dataFlows = [
  { text: "+12%", delay: 2000 },
  { text: "−3j", delay: 3500 },
  { text: "×2", delay: 5000 },
  { text: "−40%", delay: 6500 },
];

export function HeroDiagram() {
  const [visibleNodes, setVisibleNodes] = useState(0);
  const [connectionsLit, setConnectionsLit] = useState(false);
  const [activeFlows, setActiveFlows] = useState<Set<number>>(new Set());

  useEffect(() => {
    const nodeTimers = nodes.map((_, i) =>
      setTimeout(() => setVisibleNodes(i + 1), 300 + i * 100)
    );
    const connTimer = setTimeout(() => setConnectionsLit(true), 300 + nodes.length * 100 + 400);

    const flowTimers = dataFlows.map((f, i) => {
      const show = setTimeout(() => setActiveFlows(prev => new Set([...prev, i])), f.delay);
      const hide = setTimeout(() => setActiveFlows(prev => {
        const n = new Set(prev);
        n.delete(i);
        return n;
      }), f.delay + 1400);
      return [show, hide];
    }).flat();

    const loopInterval = setInterval(() => {
      dataFlows.forEach((f, i) => {
        setTimeout(() => setActiveFlows(prev => new Set([...prev, i])), f.delay - 2000);
        setTimeout(() => setActiveFlows(prev => {
          const n = new Set(prev);
          n.delete(i);
          return n;
        }), f.delay - 2000 + 1400);
      });
    }, 8000);

    return () => {
      nodeTimers.forEach(clearTimeout);
      clearTimeout(connTimer);
      flowTimers.forEach(clearTimeout);
      clearInterval(loopInterval);
    };
  }, []);

  return (
    <div className="relative p-3 sm:p-4">
      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-primary/6 blur-[50px] animate-[pulse_8s_ease-in-out_infinite]" />

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 relative">
        {nodes.map((node, i) => {
          const Icon = node.icon;
          const visible = i < visibleNodes;

          return (
            <div
              key={node.id}
              className={cn(
                "relative flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3.5 rounded-xl border transition-all duration-500",
                visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95",
                node.center
                  ? "bg-gradient-to-br from-primary/12 to-primary/6 border-primary/25 shadow-[0_0_24px_hsl(239_84%_67%/0.1),inset_0_1px_0_hsl(0_0%_100%/0.5)] ring-1 ring-primary/10"
                  : "bg-white border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={cn(
                "w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all duration-500",
                node.center
                  ? "bg-primary/20 text-primary"
                  : "bg-slate-50 text-slate-400 group-hover:text-slate-600"
              )}>
                <Icon className={cn("w-3.5 h-3.5 sm:w-4.5 sm:h-4.5", node.center && "drop-shadow-[0_0_4px_hsl(239_84%_67%/0.4)]")} />
              </div>
              <span className={cn(
                "text-[9px] sm:text-[11px] font-semibold tracking-wide",
                node.center ? "text-primary" : "text-slate-500"
              )}>
                {node.label}
              </span>

              {connectionsLit && !node.center && (
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(239_84%_67%/0.5)]" />
              )}
            </div>
          );
        })}

        {/* Connection lines — subtle animated grid */}
        {connectionsLit && (
          <div className="absolute inset-0 pointer-events-none">
            {[0, 1, 2].map(row => (
              <div
                key={`h-${row}`}
                className="absolute h-px"
                style={{
                  top: `${(row * 33.33) + 16.66}%`,
                  left: '8%',
                  right: '8%',
                  background: 'linear-gradient(90deg, transparent, hsl(239 84% 67% / 0.12), hsl(239 84% 67% / 0.2), hsl(239 84% 67% / 0.12), transparent)',
                }}
              />
            ))}
            {[0, 1, 2].map(col => (
              <div
                key={`v-${col}`}
                className="absolute w-px"
                style={{
                  left: `${(col * 33.33) + 16.66}%`,
                  top: '8%',
                  bottom: '8%',
                  background: 'linear-gradient(180deg, transparent, hsl(239 84% 67% / 0.12), hsl(239 84% 67% / 0.2), hsl(239 84% 67% / 0.12), transparent)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating data labels */}
      <div className="absolute inset-0 pointer-events-none">
        {dataFlows.map((flow, i) => {
          const positions = [
            { top: '22%', left: '18%' },
            { top: '58%', right: '12%' },
            { bottom: '22%', left: '28%' },
            { top: '38%', left: '53%' },
          ];
          return (
            <div
              key={i}
              className={cn(
                "absolute px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] sm:text-[10px] font-mono font-bold text-primary transition-all duration-600",
                activeFlows.has(i) ? "opacity-100 scale-100" : "opacity-0 scale-75"
              )}
              style={positions[i]}
            >
              {flow.text}
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <div className="mt-3 flex items-center justify-center gap-2 px-3 py-1.5 sm:py-2 rounded-lg bg-slate-50 border border-slate-100">
        <Cpu className="w-3 h-3 text-primary/50" />
        <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 tracking-[0.15em] uppercase">
          Neural Processing Engine
        </span>
        <span className="text-[9px] sm:text-[10px] text-slate-300">•</span>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_hsl(142_76%_36%/0.5)]" />
          <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-500">Active</span>
        </div>
      </div>
    </div>
  );
}
