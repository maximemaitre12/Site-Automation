import React, { useMemo } from 'react';
import { DiagramShell } from '../DiagramShell';

interface OverviewDiagramProps {
  progress: number;
  compact?: boolean;
  accentColor?: string;
}

export function OverviewDiagram({ progress, compact = false, accentColor = 'hsl(var(--primary))' }: OverviewDiagramProps) {
  const viewBox = compact ? '0 0 320 80' : '0 0 400 120';

  // Use CSS variables for perfect color sync with agent themes
  const agents = useMemo(() => [
    { id: 'hr', label: 'HR', color: 'hsl(var(--agent-hr))', angle: 0 },
    { id: 'sales', label: 'Sales', color: 'hsl(var(--agent-sales))', angle: 51 },
    { id: 'support', label: 'Support', color: 'hsl(var(--agent-support))', angle: 103 },
    { id: 'brain', label: 'Brain', color: 'hsl(var(--agent-brain))', angle: 154 },
    { id: 'compliance', label: 'Compliance', color: 'hsl(var(--agent-compliance))', angle: 206 },
    { id: 'flow', label: 'Flow', color: 'hsl(var(--agent-flow))', angle: 257 },
    { id: 'data', label: 'Data', color: 'hsl(var(--agent-data))', angle: 308 },
  ], []);

  const centerX = compact ? 160 : 200;
  const centerY = compact ? 45 : 60;
  const radius = compact ? 28 : 42;

  return (
    <DiagramShell viewBox={viewBox} accentColor={accentColor}>
      {/* Title */}
      <text x="10" y="14" fill="hsl(var(--muted-foreground))" fontSize="8" fontWeight="500" opacity="0.6">
        AETHER AGENT MESH
      </text>

      {/* Central core */}
      <g>
        {/* Outer ring */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius + 12}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          strokeDasharray="4 2"
          opacity="0.5"
        />
        
        {/* Inner ring with animation */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius + 6}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeDasharray={`${2 * Math.PI * (radius + 6) * (progress / 100)} ${2 * Math.PI * (radius + 6)}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${centerX} ${centerY})`}
          style={{ transition: 'stroke-dasharray 0.3s' }}
        />
        
        {/* Core node */}
        <circle
          cx={centerX}
          cy={centerY}
          r={18}
          fill="hsl(var(--primary))"
          opacity="0.9"
        >
          <animate attributeName="r" values="18;20;18" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x={centerX} y={centerY - 2} textAnchor="middle" fill="white" fontSize="7" fontWeight="700">
          AETHER
        </text>
        <text x={centerX} y={centerY + 6} textAnchor="middle" fill="white" fontSize="5" opacity="0.8">
          Core
        </text>
      </g>

      {/* Agent nodes around the center */}
      {agents.map((agent, i) => {
        const angleRad = (agent.angle * Math.PI) / 180;
        const x = centerX + radius * Math.cos(angleRad);
        const y = centerY + radius * Math.sin(angleRad);
        
        const pulseDelay = (i * 0.3) % 2;
        
        return (
          <g key={agent.id}>
            {/* Connection line */}
            <line
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke={agent.color}
              strokeWidth="1.5"
              opacity="0.4"
            />
            
            {/* Data flow particle */}
            <circle r="2" fill={agent.color}>
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                begin={`${pulseDelay}s`}
                path={`M ${centerX} ${centerY} L ${x} ${y}`}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.2;0.8;1"
                dur="2s"
                repeatCount="indefinite"
                begin={`${pulseDelay}s`}
              />
            </circle>
            
            {/* Agent node */}
            <circle
              cx={x}
              cy={y}
              r={12}
              fill={agent.color}
              opacity="0.9"
            >
              <animate
                attributeName="r"
                values="12;13;12"
                dur="1.5s"
                repeatCount="indefinite"
                begin={`${pulseDelay}s`}
              />
            </circle>
            <text x={x} y={y + 2} textAnchor="middle" fill="white" fontSize="6" fontWeight="600">
              {agent.label.slice(0, 3)}
            </text>
          </g>
        );
      })}

      {/* Event bus ring */}
      <ellipse
        cx={centerX}
        cy={centerY}
        rx={radius + 25}
        ry={12}
        fill="none"
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1"
        strokeDasharray="8 4"
        opacity="0.3"
        transform={`rotate(-15 ${centerX} ${centerY})`}
      >
        <animate attributeName="stroke-dashoffset" values="0;24" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* Stats panel */}
      <g transform="translate(320, 25)">
        <rect
          x={0}
          y={0}
          width={70}
          height={70}
          rx={6}
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />
        <text x={35} y={14} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="7" fontWeight="600">
          Platform
        </text>
        
        <text x={10} y={30} fill="hsl(var(--muted-foreground))" fontSize="5">Agents</text>
        <text x={55} y={30} textAnchor="end" fill="hsl(var(--foreground))" fontSize="8" fontWeight="600">7</text>
        
        <text x={10} y={44} fill="hsl(var(--muted-foreground))" fontSize="5">Events/s</text>
        <text x={55} y={44} textAnchor="end" fill="hsl(var(--primary))" fontSize="8" fontWeight="600">2.4K</text>
        
        <text x={10} y={58} fill="hsl(var(--muted-foreground))" fontSize="5">Uptime</text>
        <text x={55} y={58} textAnchor="end" fill="hsl(142 76% 46%)" fontSize="8" fontWeight="600">99.9%</text>
      </g>

      {/* Policy layer indicator */}
      <g transform="translate(10, 95)">
        <rect x={0} y={0} width={80} height={15} rx={3} fill="hsl(var(--muted))" opacity="0.5" />
        <text x={40} y={10} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6">
          🔒 Policy Layer Active
        </text>
      </g>
    </DiagramShell>
  );
}
