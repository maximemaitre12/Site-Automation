import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const departments = [
  { id: "supply", label: "Supply Chain", x: 90, y: 55, size: 42 },
  { id: "rh", label: "RH", x: 310, y: 45, size: 38 },
  { id: "logistique", label: "Logistique", x: 140, y: 195, size: 40 },
  { id: "ops", label: "Opérations", x: 380, y: 185, size: 44 },
  { id: "finance", label: "Finance", x: 240, y: 115, size: 36 },
];

const connections = [
  { from: "supply", to: "finance", path: "M 130 65 Q 185 80 210 105" },
  { from: "supply", to: "logistique", path: "M 100 97 Q 110 140 135 170" },
  { from: "finance", to: "rh", path: "M 270 110 Q 290 80 295 55" },
  { from: "finance", to: "ops", path: "M 272 125 Q 325 155 360 170" },
  { from: "finance", to: "logistique", path: "M 220 130 Q 185 160 155 175" },
  { from: "rh", to: "ops", path: "M 335 65 Q 365 120 380 155" },
  { from: "logistique", to: "ops", path: "M 175 200 Q 275 210 350 195" },
];

// Data packets flowing through the network
const dataFlows = [
  { path: "M 130 65 Q 185 80 210 105", speed: 2.2, delay: 0 },
  { path: "M 272 125 Q 325 155 360 170", speed: 1.8, delay: 0.5 },
  { path: "M 175 200 Q 275 210 350 195", speed: 2.5, delay: 1 },
  { path: "M 295 55 Q 290 80 270 110", speed: 2, delay: 1.5 },
  { path: "M 135 170 Q 110 140 100 97", speed: 2.3, delay: 0.8 },
];

export function HeroDiagram() {
  const [phase, setPhase] = useState(0); // 0=idle, 1=scanning, 2=connected, 3=optimized
  const [scanProgress, setScanProgress] = useState(0);
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
  const [optimizedPaths, setOptimizedPaths] = useState<Set<number>>(new Set());

  // Phase progression
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Scanning animation
  useEffect(() => {
    if (phase < 1) return;
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 1.2;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [phase]);

  // Activate nodes as scan passes
  useEffect(() => {
    departments.forEach(dept => {
      const threshold = (dept.y / 250) * 100;
      if (scanProgress >= threshold) {
        setActiveNodes(prev => {
          if (prev.has(dept.id)) return prev;
          return new Set([...prev, dept.id]);
        });
      }
    });
  }, [scanProgress]);

  // Optimize paths sequentially
  useEffect(() => {
    if (phase < 3) return;
    connections.forEach((_, i) => {
      setTimeout(() => setOptimizedPaths(prev => new Set([...prev, i])), i * 200);
    });
  }, [phase]);

  const scanY = (scanProgress / 100) * 260;

  return (
    <div className="relative">
      {/* Ambient glow */}
      <div className={cn(
        "absolute inset-0 rounded-2xl transition-opacity duration-1000",
        phase >= 2 ? "opacity-100" : "opacity-0",
        "bg-gradient-to-br from-primary/8 via-transparent to-primary/4"
      )} />

      <svg viewBox="0 0 480 270" className="w-full relative z-10" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Subtle grid */}
          <pattern id="hero-grid-v2" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="0.5" fill="hsl(var(--muted-foreground))" opacity="0.12" />
          </pattern>

          {/* Scan gradient */}
          <linearGradient id="scan-beam-v2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="40%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
            <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>

          {/* Node glow */}
          <filter id="node-glow-v2">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Optimized edge gradient */}
          <linearGradient id="edge-active-v2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="480" height="270" fill="url(#hero-grid-v2)" rx="12" />

        {/* Scan beam */}
        {phase >= 1 && scanProgress < 100 && (
          <g>
            <rect x="0" y={scanY - 25} width="480" height="50" fill="url(#scan-beam-v2)" />
            {/* Scan line */}
            <line x1="0" y1={scanY} x2="480" y2={scanY} stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.5">
              <animate attributeName="opacity" values="0.5;0.2;0.5" dur="0.5s" repeatCount="indefinite" />
            </line>
          </g>
        )}

        {/* Connections */}
        {connections.map((conn, i) => {
          const fromActive = activeNodes.has(conn.from);
          const toActive = activeNodes.has(conn.to);
          const bothActive = fromActive && toActive;
          const isOptimized = optimizedPaths.has(i);

          return (
            <g key={`edge-${i}`}>
              {/* Base path */}
              <path
                d={conn.path}
                fill="none"
                stroke={isOptimized ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                strokeWidth={isOptimized ? 2 : 1}
                strokeDasharray={bothActive ? "none" : "4 6"}
                opacity={isOptimized ? 0.5 : bothActive ? 0.2 : 0.08}
                className="transition-all duration-700"
              />

              {/* Data packets */}
              {isOptimized && (
                <>
                  <circle r="3.5" fill="hsl(var(--primary))" filter="url(#node-glow-v2)" opacity="0.9">
                    <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite" path={conn.path} />
                  </circle>
                  <circle r="2" fill="hsl(var(--primary))" opacity="0.4">
                    <animateMotion dur={`${2 + i * 0.3}s`} repeatCount="indefinite" path={conn.path} begin={`${0.7 + i * 0.1}s`} />
                  </circle>
                </>
              )}
            </g>
          );
        })}

        {/* Department nodes */}
        {departments.map(dept => {
          const isActive = activeNodes.has(dept.id);
          const isOptimized = phase >= 3;

          return (
            <g key={dept.id}>
              {/* Outer pulse */}
              {isActive && isOptimized && (
                <circle cx={dept.x} cy={dept.y} r={dept.size} fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0">
                  <animate attributeName="r" values={`${dept.size};${dept.size + 18};${dept.size + 22}`} dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.08;0" dur="3s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Background fill */}
              <circle
                cx={dept.x} cy={dept.y} r={dept.size}
                fill={isActive ? "hsl(var(--primary) / 0.08)" : "hsl(var(--muted) / 0.6)"}
                stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.12)"}
                strokeWidth={isActive ? 2 : 0.8}
                className="transition-all duration-700"
                filter={isActive && isOptimized ? "url(#node-glow-v2)" : undefined}
              />

              {/* Status dot */}
              {isActive && (
                <g>
                  <circle
                    cx={dept.x + dept.size * 0.6}
                    cy={dept.y - dept.size * 0.6}
                    r="6"
                    fill={isOptimized ? "hsl(var(--primary))" : "hsl(var(--warning))"}
                    stroke="hsl(var(--background))"
                    strokeWidth="2"
                  >
                    {isOptimized && <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />}
                  </circle>
                  {/* Checkmark for optimized */}
                  {isOptimized && (
                    <text
                      x={dept.x + dept.size * 0.6}
                      y={dept.y - dept.size * 0.6 + 1}
                      textAnchor="middle" dominantBaseline="middle"
                      className="text-[7px] fill-primary-foreground font-bold select-none"
                    >
                      ✓
                    </text>
                  )}
                </g>
              )}

              {/* Label */}
              <text
                x={dept.x} y={dept.y + 1}
                textAnchor="middle" dominantBaseline="middle"
                className={cn(
                  "font-semibold transition-colors duration-500 select-none",
                  isActive ? "fill-primary" : "fill-muted-foreground",
                  dept.size >= 42 ? "text-[11px]" : "text-[10px]"
                )}
              >
                {dept.label}
              </text>
            </g>
          );
        })}

        {/* Phase indicator */}
        <g className="transition-all duration-500">
          <rect x="350" y="235" width="120" height="24" rx="12" fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1" />
          <text x="410" y="248" textAnchor="middle" dominantBaseline="middle" className="text-[8px] font-semibold fill-primary select-none">
            {phase < 1 ? "Initialisation…" : phase < 2 ? "Scan en cours…" : phase < 3 ? "Analyse…" : "✓ Optimisé"}
          </text>
        </g>
      </svg>
    </div>
  );
}
