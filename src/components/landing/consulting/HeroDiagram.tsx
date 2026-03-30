import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const nodes = [
  { id: "supply", label: "Supply Chain", cx: 120, cy: 80, r: 38 },
  { id: "rh", label: "RH", cx: 380, cy: 60, r: 34 },
  { id: "logistique", label: "Logistique", cx: 200, cy: 240, r: 36 },
  { id: "ops", label: "Opérations", cx: 440, cy: 220, r: 40 },
  { id: "finance", label: "Finance", cx: 300, cy: 140, r: 32 },
];

const edges = [
  { from: "supply", to: "finance", path: "M 155 90 Q 220 100 270 130" },
  { from: "supply", to: "logistique", path: "M 130 118 Q 150 170 195 205" },
  { from: "finance", to: "rh", path: "M 330 135 Q 350 100 355 70" },
  { from: "finance", to: "ops", path: "M 330 155 Q 380 190 415 210" },
  { from: "finance", to: "logistique", path: "M 275 155 Q 240 190 210 215" },
  { from: "rh", to: "ops", path: "M 400 85 Q 430 140 440 185" },
  { from: "logistique", to: "ops", path: "M 235 245 Q 330 250 405 230" },
];

export function HeroDiagram() {
  const [scanY, setScanY] = useState(-20);
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setScanY((prev) => {
        if (prev >= 300) { clearInterval(interval); return 300; }
        return prev + 1.5;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [started]);

  useEffect(() => {
    nodes.forEach((node) => {
      if (scanY >= node.cy - 20) {
        setActiveNodes((prev) => {
          if (prev.has(node.id)) return prev;
          return new Set([...prev, node.id]);
        });
      }
    });
  }, [scanY]);

  return (
    <div className="relative">
      {/* Glow backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 rounded-2xl" />
      
      <svg
        viewBox="0 0 560 320"
        className="w-full relative z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background grid */}
        <defs>
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.3" opacity="0.15" />
          </pattern>
          <linearGradient id="scan-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="560" height="320" fill="url(#hero-grid)" rx="12" />

        {/* Edges */}
        {edges.map((edge, i) => {
          const fromActive = activeNodes.has(edge.from);
          const toActive = activeNodes.has(edge.to);
          const edgeActive = fromActive && toActive;
          return (
            <g key={i}>
              <path
                d={edge.path}
                fill="none"
                stroke={edgeActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                strokeWidth={edgeActive ? "2" : "1"}
                strokeDasharray={edgeActive ? "none" : "6 4"}
                opacity={edgeActive ? 0.6 : 0.15}
                className="transition-all duration-700"
              />
              {edgeActive && (
                <>
                  <circle r="3.5" fill="hsl(var(--primary))" filter="url(#glow)">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path={edge.path} />
                  </circle>
                  <circle r="2" fill="hsl(var(--primary))" opacity="0.4">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path={edge.path} begin="0.8s" />
                  </circle>
                </>
              )}
            </g>
          );
        })}

        {/* Scan beam */}
        {started && scanY < 300 && (
          <rect
            x="0"
            y={scanY - 15}
            width="560"
            height="30"
            fill="url(#scan-grad)"
            className="transition-none"
          />
        )}

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = activeNodes.has(node.id);
          return (
            <g key={node.id}>
              {/* Outer pulse ring */}
              {isActive && (
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.r}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  opacity="0"
                >
                  <animate attributeName="r" values={`${node.r};${node.r + 16};${node.r + 20}`} dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0.1;0" dur="2.5s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Background circle */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                fill={isActive ? "hsl(var(--primary) / 0.12)" : "hsl(var(--muted) / 0.8)"}
                stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.15)"}
                strokeWidth={isActive ? 2 : 1}
                className="transition-all duration-600"
                filter={isActive ? "url(#glow)" : undefined}
              />

              {/* Status indicator */}
              {isActive && (
                <circle
                  cx={node.cx + node.r * 0.65}
                  cy={node.cy - node.r * 0.65}
                  r="5"
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--background))"
                  strokeWidth="2"
                >
                  <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Label */}
              <text
                x={node.cx}
                y={node.cy + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  "font-semibold transition-colors duration-500 select-none",
                  isActive ? "fill-primary" : "fill-muted-foreground",
                  node.r >= 38 ? "text-[11px]" : "text-[10px]"
                )}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
