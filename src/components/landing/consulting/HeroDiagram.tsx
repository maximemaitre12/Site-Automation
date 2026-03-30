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

export function HeroDiagram() {
  const [phase, setPhase] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
  const [connectedEdges, setConnectedEdges] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

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

  useEffect(() => {
    if (phase < 3) return;
    connections.forEach((_, i) => {
      setTimeout(() => setConnectedEdges(prev => new Set([...prev, i])), i * 180);
    });
  }, [phase]);

  const scanY = (scanProgress / 100) * 260;

  return (
    <div className="relative">
      <svg viewBox="0 0 480 270" className="w-full relative z-10" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="grid-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.4" fill="hsl(var(--muted-foreground))" opacity="0.1" />
          </pattern>
          <linearGradient id="scan-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
          <filter id="soft-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width="480" height="270" fill="url(#grid-dots)" rx="8" />

        {/* Scan */}
        {phase >= 1 && scanProgress < 100 && (
          <rect x="0" y={scanY - 20} width="480" height="40" fill="url(#scan-line)" />
        )}

        {/* Edges */}
        {connections.map((conn, i) => {
          const fromActive = activeNodes.has(conn.from);
          const toActive = activeNodes.has(conn.to);
          const linked = connectedEdges.has(i);

          return (
            <g key={`e-${i}`}>
              <path
                d={conn.path} fill="none"
                stroke={linked ? "hsl(var(--primary))" : "hsl(var(--border))"}
                strokeWidth={linked ? 1.5 : 0.8}
                opacity={linked ? 0.4 : fromActive && toActive ? 0.15 : 0.06}
                className="transition-all duration-700"
              />
              {linked && (
                <circle r="2.5" fill="hsl(var(--primary))" opacity="0.6">
                  <animateMotion dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" path={conn.path} />
                </circle>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {departments.map(dept => {
          const isActive = activeNodes.has(dept.id);
          const isConnected = phase >= 3;

          return (
            <g key={dept.id}>
              {isActive && isConnected && (
                <circle cx={dept.x} cy={dept.y} r={dept.size} fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8" opacity="0">
                  <animate attributeName="r" values={`${dept.size};${dept.size + 12}`} dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0" dur="3s" repeatCount="indefinite" />
                </circle>
              )}

              <circle
                cx={dept.x} cy={dept.y} r={dept.size}
                fill={isActive ? "hsl(var(--primary) / 0.06)" : "hsl(var(--muted) / 0.4)"}
                stroke={isActive ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))"}
                strokeWidth={isActive ? 1.5 : 0.8}
                className="transition-all duration-700"
                filter={isActive && isConnected ? "url(#soft-glow)" : undefined}
              />

              {/* Small status circle */}
              {isActive && (
                <circle
                  cx={dept.x + dept.size * 0.55}
                  cy={dept.y - dept.size * 0.55}
                  r="4"
                  fill={isConnected ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                  opacity={isConnected ? 0.8 : 0.3}
                  className="transition-all duration-500"
                />
              )}

              <text
                x={dept.x} y={dept.y + 1}
                textAnchor="middle" dominantBaseline="middle"
                className={cn(
                  "font-medium transition-colors duration-500 select-none",
                  isActive ? "fill-foreground" : "fill-muted-foreground",
                  dept.size >= 42 ? "text-[10px]" : "text-[9px]"
                )}
              >
                {dept.label}
              </text>
            </g>
          );
        })}

        {/* Status label */}
        <rect x="358" y="238" width="112" height="22" rx="11" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.8" />
        <text x="414" y="250" textAnchor="middle" dominantBaseline="middle" className="text-[8px] font-medium fill-muted-foreground select-none">
          {phase < 1 ? "Initialisation" : phase < 2 ? "Scan en cours" : phase < 3 ? "Analyse" : "Connecté"}
        </text>
      </svg>
    </div>
  );
}
