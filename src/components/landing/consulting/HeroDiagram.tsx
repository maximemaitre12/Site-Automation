import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const nodes = [
  { id: "supply", label: "Supply Chain", cx: 80, cy: 60 },
  { id: "rh", label: "RH", cx: 280, cy: 40 },
  { id: "logistique", label: "Logistique", cx: 180, cy: 160 },
  { id: "ops", label: "Opérations", cx: 360, cy: 150 },
];

const edges = [
  { from: "supply", to: "logistique", path: "M 80 80 Q 130 130 180 140" },
  { from: "supply", to: "rh", path: "M 100 60 Q 180 30 260 40" },
  { from: "rh", to: "ops", path: "M 300 50 Q 340 90 360 130" },
  { from: "logistique", to: "ops", path: "M 200 160 Q 280 165 340 150" },
  { from: "rh", to: "logistique", path: "M 270 55 Q 230 100 190 140" },
];

export function HeroDiagram() {
  const [scanY, setScanY] = useState(-10);
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setScanY((prev) => {
          if (prev >= 200) {
            clearInterval(interval);
            return 200;
          }
          return prev + 2;
        });
      }, 20);
      return () => clearInterval(interval);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    nodes.forEach((node, i) => {
      const threshold = (node.cy / 200) * 200;
      if (scanY >= threshold) {
        setTimeout(() => {
          setActiveNodes((prev) => new Set([...prev, node.id]));
        }, i * 100);
      }
    });
  }, [scanY]);

  return (
    <svg
      viewBox="0 0 440 210"
      className="w-full max-w-md mx-auto"
      preserveAspectRatio="xMidYMid meet"
    >
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
              stroke={edgeActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.2)"}
              strokeWidth="1.5"
              strokeDasharray={edgeActive ? "none" : "4 4"}
              className="transition-all duration-700"
            />
            {edgeActive && (
              <circle r="2.5" fill="hsl(var(--primary))" opacity="0.8">
                <animateMotion dur="2s" repeatCount="indefinite" path={edge.path} />
              </circle>
            )}
          </g>
        );
      })}

      {/* Scan beam */}
      {scanY < 200 && (
        <rect
          x="0"
          y={scanY}
          width="440"
          height="3"
          fill="hsl(var(--primary))"
          opacity="0.3"
          rx="1.5"
        />
      )}

      {/* Nodes */}
      {nodes.map((node) => {
        const isActive = activeNodes.has(node.id);
        return (
          <g key={node.id}>
            <circle
              cx={node.cx}
              cy={node.cy}
              r={isActive ? 26 : 24}
              fill={isActive ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted))"}
              stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.2)"}
              strokeWidth="1.5"
              className="transition-all duration-500"
            />
            {isActive && (
              <circle
                cx={node.cx}
                cy={node.cy}
                r="26"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                opacity="0.4"
              >
                <animate
                  attributeName="r"
                  values="26;34;26"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0;0.4"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <text
              x={node.cx}
              y={node.cy + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              className={cn(
                "text-[9px] font-medium transition-colors duration-500",
                isActive ? "fill-primary" : "fill-muted-foreground"
              )}
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
