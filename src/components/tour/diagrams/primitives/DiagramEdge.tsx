import React from 'react';

interface Point {
  x: number;
  y: number;
}

interface DiagramEdgeProps {
  from: Point;
  to: Point;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'muted' | 'data' | 'warning';
  type?: 'straight' | 'curved' | 'step' | 'elbow';
  animated?: boolean;
  flowSpeed?: 'slow' | 'medium' | 'fast';
  dashed?: boolean;
  arrow?: boolean;
  bidirectional?: boolean;
  label?: string;
  thickness?: number;
}

const variantColors = {
  default: 'hsl(var(--border))',
  primary: 'hsl(var(--primary))',
  accent: 'hsl(var(--accent))',
  success: 'hsl(142 76% 46%)',
  muted: 'hsl(var(--muted-foreground) / 0.3)',
  data: 'hsl(200 80% 50%)',
  warning: 'hsl(38 92% 50%)',
};

const flowSpeeds = {
  slow: '3s',
  medium: '1.5s',
  fast: '0.8s',
};

export function DiagramEdge({
  from,
  to,
  variant = 'default',
  type = 'curved',
  animated = false,
  flowSpeed = 'medium',
  dashed = false,
  arrow = true,
  bidirectional = false,
  label,
  thickness = 1.5,
}: DiagramEdgeProps) {
  const color = variantColors[variant];
  const id = `edge-${from.x}-${from.y}-${to.x}-${to.y}`;

  const getPath = () => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    switch (type) {
      case 'straight':
        return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
      case 'step': {
        const midX = from.x + dx / 2;
        return `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`;
      }
      case 'elbow': {
        return `M ${from.x} ${from.y} L ${from.x} ${to.y} L ${to.x} ${to.y}`;
      }
      case 'curved':
      default: {
        const cx1 = from.x + dx * 0.5;
        const cy1 = from.y;
        const cx2 = from.x + dx * 0.5;
        const cy2 = to.y;
        return `M ${from.x} ${from.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${to.x} ${to.y}`;
      }
    }
  };

  const path = getPath();
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  return (
    <g className="diagram-edge">
      <defs>
        <marker
          id={`arrow-${id}`}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L8,3 z" fill={color} />
        </marker>
        {bidirectional && (
          <marker
            id={`arrow-start-${id}`}
            markerWidth="8"
            markerHeight="8"
            refX="2"
            refY="3"
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path d="M8,0 L8,6 L0,3 z" fill={color} />
          </marker>
        )}
        {animated && (
          <linearGradient id={`flow-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        )}
      </defs>

      {/* Base path */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeDasharray={dashed ? '4 2' : undefined}
        markerEnd={arrow ? `url(#arrow-${id})` : undefined}
        markerStart={bidirectional ? `url(#arrow-start-${id})` : undefined}
        opacity={animated ? 0.3 : 0.6}
        style={{ transition: 'opacity 0.3s' }}
      />

      {/* Animated flow overlay */}
      {animated && (
        <path
          d={path}
          fill="none"
          stroke={`url(#flow-${id})`}
          strokeWidth={thickness + 1}
          strokeLinecap="round"
          style={{
            strokeDasharray: '20 80',
            animation: `flowAnimation ${flowSpeeds[flowSpeed]} linear infinite`,
          }}
        />
      )}

      {/* Label */}
      {label && (
        <g>
          <rect
            x={midX - 16}
            y={midY - 8}
            width="32"
            height="16"
            rx="4"
            fill="hsl(var(--background))"
            stroke={color}
            strokeWidth="0.5"
          />
          <text
            x={midX}
            y={midY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={color}
            fontSize="7"
            fontWeight="500"
          >
            {label}
          </text>
        </g>
      )}

      <style>{`
        @keyframes flowAnimation {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </g>
  );
}
