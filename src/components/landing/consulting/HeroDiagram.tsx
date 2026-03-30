import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Brain, Database, BarChart3, Zap, Shield, TrendingUp,
  Activity, Globe, Cpu, ArrowUpRight,
} from "lucide-react";

const orbitNodes = [
  { icon: Database, label: "Data", angle: 0, ring: 1, color: "from-blue-500 to-cyan-400" },
  { icon: Activity, label: "Process", angle: 60, ring: 1, color: "from-violet-500 to-purple-400" },
  { icon: Shield, label: "Compliance", angle: 120, ring: 1, color: "from-emerald-500 to-teal-400" },
  { icon: Globe, label: "Supply", angle: 180, ring: 1, color: "from-amber-500 to-orange-400" },
  { icon: BarChart3, label: "Analytics", angle: 240, ring: 1, color: "from-rose-500 to-pink-400" },
  { icon: Zap, label: "Automation", angle: 300, ring: 1, color: "from-indigo-500 to-blue-400" },
];

const metrics = [
  { value: "+12%", label: "Efficacité", trend: "up" },
  { value: "−40%", label: "Coûts", trend: "down" },
  { value: "×2", label: "Vitesse", trend: "up" },
];

export function HeroDiagram() {
  const [phase, setPhase] = useState(0);
  const [pulseIdx, setPulseIdx] = useState(-1);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2000);

    const pulseLoop = setInterval(() => {
      setPulseIdx(p => (p + 1) % orbitNodes.length);
    }, 1800);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearInterval(pulseLoop);
    };
  }, []);

  const size = 280; // viewBox logical size
  const cx = size / 2;
  const cy = size / 2;
  const r1 = 100;

  return (
    <div className="relative aspect-square max-w-[380px] mx-auto">
      {/* Ambient glow layers */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 rounded-full bg-primary/[0.06] blur-[60px] animate-[pulse_6s_ease-in-out_infinite]" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-28 h-28 rounded-full bg-[hsl(260_70%_60%/0.08)] blur-[40px] animate-[pulse_4s_ease-in-out_infinite_1s]" />
      </div>

      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full relative z-10">
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(239 84% 67%)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(239 84% 67%)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(239 84% 67%)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="hsl(260 70% 60%)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(239 84% 67%)" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Center glow */}
        <circle cx={cx} cy={cy} r="60" fill="url(#centerGlow)" />

        {/* Orbit ring */}
        <circle
          cx={cx} cy={cy} r={r1}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="1"
          className={cn(
            "transition-all duration-1000",
            phase >= 1 ? "opacity-100" : "opacity-0"
          )}
          strokeDasharray="4 6"
        />

        {/* Connection lines from center to nodes */}
        {orbitNodes.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx = cx + r1 * Math.cos(rad);
          const ny = cy + r1 * Math.sin(rad);
          return (
            <line
              key={`line-${i}`}
              x1={cx} y1={cy} x2={nx} y2={ny}
              stroke="hsl(239 84% 67%)"
              strokeOpacity={pulseIdx === i ? 0.35 : 0.08}
              strokeWidth={pulseIdx === i ? 1.5 : 0.5}
              className="transition-all duration-700"
            />
          );
        })}

        {/* Pulse traveling dot */}
        {pulseIdx >= 0 && phase >= 2 && (() => {
          const node = orbitNodes[pulseIdx];
          const rad = (node.angle * Math.PI) / 180;
          const nx = cx + r1 * Math.cos(rad);
          const ny = cy + r1 * Math.sin(rad);
          return (
            <circle r="2.5" fill="hsl(239 84% 67%)" filter="url(#glow)">
              <animate
                attributeName="cx"
                from={cx} to={nx}
                dur="0.8s" fill="freeze"
                key={`px-${pulseIdx}`}
              />
              <animate
                attributeName="cy"
                from={cy} to={ny}
                dur="0.8s" fill="freeze"
                key={`py-${pulseIdx}`}
              />
              <animate
                attributeName="opacity"
                values="1;1;0" dur="1.2s" fill="freeze"
                key={`po-${pulseIdx}`}
              />
            </circle>
          );
        })()}

        {/* Center brain node */}
        <g className={cn(
          "transition-all duration-700",
          phase >= 1 ? "opacity-100" : "opacity-0"
        )}>
          <circle cx={cx} cy={cy} r="28" fill="white" stroke="hsl(239 84% 67%)" strokeWidth="1.5" strokeOpacity="0.3" />
          <circle cx={cx} cy={cy} r="28" fill="hsl(239 84% 67%)" fillOpacity="0.06" />
          {/* Rotating ring */}
          <circle
            cx={cx} cy={cy} r="34"
            fill="none" stroke="hsl(239 84% 67%)" strokeWidth="0.8" strokeOpacity="0.15"
            strokeDasharray="8 16"
          >
            <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="20s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Orbit nodes */}
        {orbitNodes.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx = cx + r1 * Math.cos(rad);
          const ny = cy + r1 * Math.sin(rad);
          const Icon = node.icon;
          const isActive = pulseIdx === i;

          return (
            <g
              key={node.label}
              className={cn(
                "transition-all duration-500",
                phase >= 2 ? "opacity-100" : "opacity-0"
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Active glow */}
              {isActive && (
                <circle cx={nx} cy={ny} r="22" fill="hsl(239 84% 67%)" fillOpacity="0.08" className="animate-[pulse_1.5s_ease-in-out]" />
              )}
              <circle
                cx={nx} cy={ny} r="18"
                fill="white"
                stroke={isActive ? "hsl(239 84% 67%)" : "hsl(220 14% 85%)"}
                strokeWidth={isActive ? 1.5 : 1}
                className="transition-all duration-300"
                filter={isActive ? "url(#glow)" : undefined}
              />
              {/* Icon placeholder — foreignObject */}
              <foreignObject x={nx - 10} y={ny - 10} width="20" height="20">
                <div className="w-full h-full flex items-center justify-center">
                  <Icon className={cn(
                    "w-[12px] h-[12px] transition-colors duration-300",
                    isActive ? "text-primary" : "text-slate-400"
                  )} />
                </div>
              </foreignObject>
              {/* Label */}
              <text
                x={nx} y={ny + 28}
                textAnchor="middle"
                className={cn(
                  "text-[8px] font-semibold transition-all duration-300 fill-current",
                  isActive ? "fill-primary" : "fill-slate-400"
                )}
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {/* Center brain icon */}
        <foreignObject x={cx - 14} y={cy - 14} width="28" height="28">
          <div className="w-full h-full flex items-center justify-center">
            <Brain className="w-[18px] h-[18px] text-primary drop-shadow-[0_0_6px_hsl(239_84%_67%/0.4)]" />
          </div>
        </foreignObject>
      </svg>

      {/* Floating metric cards */}
      <div className={cn(
        "absolute top-3 right-2 sm:top-4 sm:right-3 flex flex-col gap-1.5 transition-all duration-700",
        phase >= 3 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      )}>
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-100 shadow-sm"
            style={{ transitionDelay: `${i * 100 + 200}ms` }}
          >
            <span className="text-[11px] sm:text-xs font-bold text-slate-900 font-mono">{m.value}</span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">{m.label}</span>
            <ArrowUpRight className={cn(
              "w-2.5 h-2.5",
              m.trend === "up" ? "text-emerald-500" : "text-emerald-500 rotate-180"
            )} />
          </div>
        ))}
      </div>

      {/* Bottom status */}
      <div className={cn(
        "absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm transition-all duration-700",
        phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      )}>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_hsl(142_76%_36%/0.5)] animate-[pulse_2s_ease-in-out_infinite]" />
        <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 tracking-[0.1em] uppercase whitespace-nowrap">
          AI Engine Active
        </span>
      </div>
    </div>
  );
}
