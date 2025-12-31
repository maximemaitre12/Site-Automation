import React, { useMemo } from 'react';
import { DiagramShell } from '../DiagramShell';
import { DiagramNode, DiagramEdge, MetricChip } from '../primitives';

interface SupportDiagramProps {
  progress: number;
  compact?: boolean;
  accentColor?: string;
}

export function SupportDiagram({ progress, compact = false, accentColor = 'hsl(173 80% 40%)' }: SupportDiagramProps) {
  const phase = useMemo(() => {
    if (progress < 20) return 0;
    if (progress < 40) return 1;
    if (progress < 60) return 2;
    if (progress < 80) return 3;
    return 4;
  }, [progress]);

  const viewBox = compact ? '0 0 360 100' : '0 0 400 120';

  return (
    <DiagramShell viewBox={viewBox} accentColor={accentColor}>
      {/* Title */}
      <text x="10" y="14" fill="hsl(var(--muted-foreground))" fontSize="8" fontWeight="500" opacity="0.6">
        INTELLIGENT ROUTING ENGINE
      </text>

      {/* Ticket Input */}
      <g>
        <DiagramNode x={10} y={40} width={55} height={40} label="Ticket" sublabel="Inbound" variant={phase >= 0 ? 'primary' : 'muted'} shape="rounded" active={phase === 0} glow={phase === 0} />
      </g>

      {/* Intent Classification */}
      <g transform="translate(85, 25)">
        <rect
          x={0}
          y={0}
          width={70}
          height={70}
          rx={6}
          fill="hsl(200 80% 50% / 0.1)"
          stroke="hsl(200 80% 50%)"
          strokeWidth={phase === 1 ? 2 : 1}
        />
        <text x={35} y={14} textAnchor="middle" fill="hsl(200 80% 50%)" fontSize="8" fontWeight="600">
          Intent NLU
        </text>
        
        {/* Intent categories */}
        {['Technical', 'Billing', 'General', 'Urgent'].map((intent, i) => {
          const isActive = phase >= 1;
          const confidence = [0.87, 0.12, 0.01, 0.0][i];
          const barWidth = confidence * 50;
          
          return (
            <g key={i} transform={`translate(5, ${20 + i * 12})`}>
              <text x={0} y={7} fill="hsl(var(--muted-foreground))" fontSize="6">
                {intent}
              </text>
              <rect x={35} y={2} width={30} height={6} rx={1} fill="hsl(var(--muted))" />
              <rect
                x={35}
                y={2}
                width={isActive ? barWidth * 0.6 : 0}
                height={6}
                rx={1}
                fill={i === 0 ? 'hsl(200 80% 50%)' : 'hsl(var(--muted-foreground))'}
                style={{ transition: 'width 0.4s ease-out', transitionDelay: `${i * 0.1}s` }}
              />
            </g>
          );
        })}
      </g>

      {/* Decision Tree Router */}
      <g transform="translate(175, 20)">
        {/* Root */}
        <circle cx={40} cy={10} r={8} fill={phase >= 2 ? 'hsl(280 70% 50%)' : 'hsl(var(--muted))'} />
        <text x={40} y={12} textAnchor="middle" fill="white" fontSize="6" fontWeight="600">?</text>
        
        {/* Branches */}
        <line x1={40} y1={18} x2={20} y2={38} stroke="hsl(var(--border))" strokeWidth={phase >= 2 ? 2 : 1} />
        <line x1={40} y1={18} x2={60} y2={38} stroke="hsl(var(--border))" strokeWidth={phase >= 2 ? 2 : 1} />
        
        {/* Level 2 nodes */}
        <circle cx={20} cy={42} r={6} fill={phase >= 2 ? 'hsl(200 80% 50%)' : 'hsl(var(--muted))'} />
        <circle cx={60} cy={42} r={6} fill={phase >= 2 ? 'hsl(38 92% 50%)' : 'hsl(var(--muted))'} />
        
        {/* Level 3 branches */}
        <line x1={20} y1={48} x2={10} y2={65} stroke="hsl(var(--border))" strokeWidth="1" />
        <line x1={20} y1={48} x2={30} y2={65} stroke="hsl(var(--border))" strokeWidth="1" />
        <line x1={60} y1={48} x2={50} y2={65} stroke="hsl(var(--border))" strokeWidth="1" />
        <line x1={60} y1={48} x2={70} y2={65} stroke="hsl(var(--border))" strokeWidth="1" />
        
        {/* Leaf nodes */}
        {[[10, 70], [30, 70], [50, 70], [70, 70]].map(([cx, cy], i) => (
          <g key={i}>
            <rect x={cx - 12} y={cy - 5} width={24} height={16} rx={3} fill={phase >= 3 ? ['hsl(142 76% 46%)', 'hsl(142 76% 46%)', 'hsl(38 92% 50%)', 'hsl(0 84% 60%)'][i] : 'hsl(var(--muted))'} opacity={0.9} />
            <text x={cx} y={cy + 3} textAnchor="middle" fill="white" fontSize="5">
              {['Auto', 'KB', 'L2', 'Esc'][i]}
            </text>
          </g>
        ))}
        
        {/* Labels */}
        <text x={40} y={95} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6">
          Routing Logic
        </text>
      </g>

      {/* Outputs */}
      <g>
        <DiagramNode x={270} y={25} width={60} height={24} label="Auto-Resolve" variant={phase >= 4 ? 'success' : 'muted'} shape="pill" active={phase === 4 && true} glow={phase === 4} />
        
        <rect x={270} y={55} width={60} height={20} rx={4} fill={phase >= 3 ? 'hsl(200 80% 50% / 0.15)' : 'hsl(var(--muted))'} stroke={phase >= 3 ? 'hsl(200 80% 50%)' : 'hsl(var(--border))'} strokeWidth="1" />
        <text x={300} y={67} textAnchor="middle" fill={phase >= 3 ? 'hsl(200 80% 50%)' : 'hsl(var(--muted-foreground))'} fontSize="7">
          Tier 2
        </text>
        
        <rect x={270} y={80} width={60} height={20} rx={4} fill={phase >= 3 ? 'hsl(0 84% 60% / 0.15)' : 'hsl(var(--muted))'} stroke={phase >= 3 ? 'hsl(0 84% 60%)' : 'hsl(var(--border))'} strokeWidth="1" />
        <text x={300} y={92} textAnchor="middle" fill={phase >= 3 ? 'hsl(0 84% 60%)' : 'hsl(var(--muted-foreground))'} fontSize="7">
          Escalate
        </text>
      </g>

      {/* SLA Badge */}
      <g transform="translate(340, 30)">
        <rect x={0} y={0} width={50} height={60} rx={6} fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
        <text x={25} y={14} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6" fontWeight="500">SLA</text>
        <text x={25} y={32} textAnchor="middle" fill={phase >= 4 ? 'hsl(142 76% 46%)' : 'hsl(var(--foreground))'} fontSize="14" fontWeight="700">
          98%
        </text>
        <text x={25} y={45} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6">compliance</text>
        <circle cx={25} cy={52} r={3} fill={phase >= 4 ? 'hsl(142 76% 46%)' : 'hsl(var(--muted))'}>
          {phase >= 4 && <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />}
        </circle>
      </g>

      {/* Edges */}
      <DiagramEdge from={{ x: 65, y: 60 }} to={{ x: 85, y: 60 }} animated={phase >= 0} variant={phase >= 1 ? 'primary' : 'muted'} />
      <DiagramEdge from={{ x: 155, y: 60 }} to={{ x: 175, y: 50 }} animated={phase >= 1} variant={phase >= 2 ? 'accent' : 'muted'} />
      <DiagramEdge from={{ x: 253, y: 55 }} to={{ x: 270, y: 37 }} animated={phase >= 3} variant={phase >= 4 ? 'success' : 'muted'} type="straight" />
      <DiagramEdge from={{ x: 253, y: 70 }} to={{ x: 270, y: 65 }} animated={phase >= 3} variant={phase >= 3 ? 'primary' : 'muted'} type="straight" />
      <DiagramEdge from={{ x: 253, y: 85 }} to={{ x: 270, y: 90 }} animated={phase >= 3} variant={phase >= 3 ? 'warning' : 'muted'} type="straight" />

      {/* Metrics */}
      {!compact && (
        <g>
          <MetricChip x={10} y={95} label="MTTR" value="4.2" unit="min" variant="success" size="sm" trend="down" />
          <MetricChip x={75} y={95} label="Auto %" value="67" unit="%" variant="success" size="sm" trend="up" />
        </g>
      )}
    </DiagramShell>
  );
}
