import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Brain, Database, BarChart3, Zap, Target, TrendingUp,
  Activity, Cpu, Globe, Shield, LineChart, Layers,
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
      setTimeout(() => setVisibleNodes(i + 1), 200 + i * 80)
    );
    const connTimer = setTimeout(() => setConnectionsLit(true), 200 + nodes.length * 80 + 300);

    const flowTimers = dataFlows.map((f, i) => {
      const show = setTimeout(() => setActiveFlows(prev => new Set([...prev, i])), f.delay);
      const hide = setTimeout(() => setActiveFlows(prev => {
        const n = new Set(prev);
        n.delete(i);
        return n;
      }), f.delay + 1200);
      return [show, hide];
    }).flat();

    const loopInterval = setInterval(() => {
      dataFlows.forEach((f, i) => {
        setTimeout(() => setActiveFlows(prev => new Set([...prev, i])), f.delay - 2000);
        setTimeout(() => setActiveFlows(prev => {
          const n = new Set(prev);
          n.delete(i);
          return n;
        }), f.delay - 2000 + 1200);
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
    <div className="relative p-4">
      {/* Ambient glow behind the center node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-primary/8 blur-[60px] animate-[pulse_6s_ease-in-out_infinite]" />

      <div className="grid grid-cols-3 gap-3 sm:gap-4 relative">
        {nodes.map((node, i) => {
          const Icon = node.icon;
          const visible = i < visibleNodes;

          return (
            <div
              key={node.id}
              className={cn(
                "relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border transition-all duration-500",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
                node.center
                  ? "bg-primary/10 border-primary/30 shadow-[0_0_20px_hsl(239_84%_67%/0.1)]"
                  : "bg-white border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md"
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-500",
                node.center
                  ? "bg-primary/20 text-primary shadow-[0_0_15px_hsl(239_84%_67%/0.15)]"
                  : "bg-slate-100 text-slate-500"
              )}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={cn(
                "text-[10px] sm:text-xs font-medium",
                node.center ? "text-primary" : "text-slate-500"
              )}>
                {node.label}
              </span>

              {/* Connection indicator dot */}
              {connectionsLit && !node.center && (
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary/60 shadow-[0_0_6px_hsl(239_84%_67%/0.3)]" />
              )}
            </div>
          );
        })}

        {/* Connection lines */}
        {connectionsLit && (
          <div className="absolute inset-0 pointer-events-none">
            {[0, 1, 2].map(row => (
              <div
                key={`h-${row}`}
                className="absolute h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent"
                style={{
                  top: `${(row * 33.33) + 16.66}%`,
                  left: '10%',
                  right: '10%',
                }}
              />
            ))}
            {[0, 1, 2].map(col => (
              <div
                key={`v-${col}`}
                className="absolute w-px bg-gradient-to-b from-transparent via-primary/15 to-transparent"
                style={{
                  left: `${(col * 33.33) + 16.66}%`,
                  top: '10%',
                  bottom: '10%',
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
            { top: '25%', left: '20%' },
            { top: '60%', right: '15%' },
            { bottom: '20%', left: '30%' },
            { top: '40%', left: '55%' },
          ];
          return (
            <div
              key={i}
              className={cn(
                "absolute px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-mono font-bold text-primary backdrop-blur-sm transition-all duration-500",
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
      <div className="mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
        <Cpu className="w-3 h-3 text-primary/60" />
        <span className="text-[10px] sm:text-xs font-medium text-slate-400 tracking-wider uppercase">
          Neural Processing Engine — Active
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_hsl(142_76%_36%/0.4)]" />
      </div>
    </div>
  );
}
