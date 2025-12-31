import React, { useMemo } from 'react';
import { DiagramShell } from '../DiagramShell';
import { DiagramNode, DiagramEdge, MetricChip, ParticleFlow } from '../primitives';

interface FlowDiagramProps {
  progress: number;
  compact?: boolean;
}

export function FlowDiagram({ progress, compact = false }: FlowDiagramProps) {
  const phase = useMemo(() => {
    if (progress < 20) return 0;
    if (progress < 40) return 1;
    if (progress < 60) return 2;
    if (progress < 80) return 3;
    return 4;
  }, [progress]);

  const viewBox = compact ? '0 0 360 100' : '0 0 400 120';

  return (
    <DiagramShell viewBox={viewBox} accentColor="hsl(260 80% 55%)">
      {/* Title */}
      <text x="10" y="14" fill="hsl(var(--muted-foreground))" fontSize="8" fontWeight="500" opacity="0.6">
        EVENT-DRIVEN ORCHESTRATION
      </text>

      {/* Event Sources */}
      <g transform="translate(10, 25)">
        <text x={25} y={0} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6" fontWeight="500">
          Sources
        </text>
        {['Webhook', 'Schedule', 'DB Trigger'].map((source, i) => (
          <g key={i} transform={`translate(0, ${8 + i * 22})`}>
            <rect
              x={0}
              y={0}
              width={50}
              height={18}
              rx={3}
              fill={phase >= 0 ? 'hsl(220 80% 55% / 0.2)' : 'hsl(var(--muted))'}
              stroke={phase >= 0 ? 'hsl(220 80% 55%)' : 'hsl(var(--border))'}
              strokeWidth="1"
            />
            <text x={25} y={12} textAnchor="middle" fill={phase >= 0 ? 'hsl(220 80% 55%)' : 'hsl(var(--muted-foreground))'} fontSize="6">
              {source}
            </text>
            {phase >= 0 && i === 0 && (
              <circle cx={52} cy={9} r={3} fill="hsl(142 76% 46%)">
                <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        ))}
      </g>

      {/* Message Queue */}
      <g transform="translate(75, 28)">
        <rect
          x={0}
          y={0}
          width={55}
          height={64}
          rx={4}
          fill="hsl(260 80% 55% / 0.1)"
          stroke="hsl(260 80% 55%)"
          strokeWidth={phase === 1 ? 2 : 1}
        />
        <text x={27} y={12} textAnchor="middle" fill="hsl(260 80% 55%)" fontSize="7" fontWeight="600">
          Queue
        </text>
        
        {/* Message packets */}
        <g transform="translate(5, 18)">
          {[0, 1, 2, 3, 4].map((i) => {
            const isActive = phase >= 1;
            const yPos = i * 9;
            
            return (
              <g key={i}>
                <rect
                  x={0}
                  y={yPos}
                  width={45}
                  height={7}
                  rx={2}
                  fill={isActive ? 'hsl(260 80% 55%)' : 'hsl(var(--muted))'}
                  opacity={isActive ? 0.7 - i * 0.12 : 0.3}
                  style={{ transition: 'all 0.3s', transitionDelay: `${i * 0.05}s` }}
                >
                  {isActive && i === 0 && (
                    <animate attributeName="x" values="0;50;0" dur="1.5s" repeatCount="indefinite" />
                  )}
                </rect>
                {isActive && (
                  <rect x={42} y={yPos + 2} width={3} height={3} rx={1} fill="white" opacity="0.5" />
                )}
              </g>
            );
          })}
        </g>
      </g>

      {/* Orchestrator */}
      <g transform="translate(145, 20)">
        <rect
          x={0}
          y={0}
          width={75}
          height={80}
          rx={8}
          fill="hsl(var(--primary) / 0.1)"
          stroke="hsl(var(--primary))"
          strokeWidth={phase === 2 ? 2 : 1}
        />
        <text x={37} y={14} textAnchor="middle" fill="hsl(var(--primary))" fontSize="8" fontWeight="700">
          Orchestrator
        </text>
        
        {/* State machine visualization */}
        <g transform="translate(10, 22)">
          {/* States */}
          {[
            { x: 27, y: 5, label: 'Init', active: phase >= 2 },
            { x: 10, y: 25, label: 'Validate', active: phase >= 2 },
            { x: 45, y: 25, label: 'Process', active: phase >= 2 },
            { x: 10, y: 45, label: 'Retry', active: phase >= 3 },
            { x: 45, y: 45, label: 'Complete', active: phase >= 4 },
          ].map((state, i) => (
            <g key={i}>
              <circle
                cx={state.x}
                cy={state.y}
                r={8}
                fill={state.active ? 'hsl(var(--primary))' : 'hsl(var(--muted))'}
                opacity={state.active ? 0.9 : 0.4}
              >
                {phase === 2 && i === 2 && (
                  <animate attributeName="r" values="8;10;8" dur="1s" repeatCount="indefinite" />
                )}
              </circle>
              <text x={state.x} y={state.y + 2} textAnchor="middle" fill="white" fontSize="4" fontWeight="500">
                {state.label.slice(0, 4)}
              </text>
            </g>
          ))}
          
          {/* Transitions */}
          <path d="M 27 13 L 12 19" stroke="hsl(var(--border))" strokeWidth="1" markerEnd="url(#arrow)" />
          <path d="M 27 13 L 43 19" stroke="hsl(var(--border))" strokeWidth="1" />
          <path d="M 10 33 L 10 39" stroke="hsl(var(--border))" strokeWidth="1" />
          <path d="M 45 33 L 45 39" stroke="hsl(var(--border))" strokeWidth="1" />
          <path d="M 17 45 L 38 45" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2 1" />
        </g>
        
        <text x={37} y={74} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="5">
          Stateful execution
        </text>
      </g>

      {/* Agent Triggers */}
      <g transform="translate(235, 22)">
        <text x={35} y={0} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6" fontWeight="500">
          Actions
        </text>
        
        {[
          { name: 'Send Email', icon: '✉', color: 'hsl(200 80% 50%)' },
          { name: 'Update CRM', icon: '📊', color: 'hsl(142 76% 46%)' },
          { name: 'Notify Slack', icon: '💬', color: 'hsl(38 92% 50%)' },
          { name: 'Generate Doc', icon: '📄', color: 'hsl(280 70% 50%)' },
        ].map((action, i) => {
          const isActive = phase >= 3;
          const isExecuting = phase === 3 && i < 2;
          const isComplete = phase >= 4;
          
          return (
            <g key={i} transform={`translate(0, ${8 + i * 18})`}>
              <rect
                x={0}
                y={0}
                width={70}
                height={15}
                rx={3}
                fill={isActive ? `${action.color}20` : 'hsl(var(--muted))'}
                stroke={isActive ? action.color : 'hsl(var(--border))'}
                strokeWidth={isExecuting ? 2 : 1}
                style={{ transition: 'all 0.3s' }}
              />
              <text x={8} y={11} fill={isActive ? action.color : 'hsl(var(--muted-foreground))'} fontSize="8">
                {action.icon}
              </text>
              <text x={20} y={10} fill={isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))'} fontSize="6">
                {action.name}
              </text>
              {isComplete && (
                <circle cx={66} cy={7} r={3} fill="hsl(142 76% 46%)" />
              )}
              {isExecuting && (
                <circle cx={66} cy={7} r={3} fill={action.color}>
                  <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}
      </g>

      {/* Observability Panel */}
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
        <text x={35} y={12} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="7" fontWeight="600">
          Metrics
        </text>
        
        {/* Mini chart */}
        <g transform="translate(5, 18)">
          <rect x={0} y={22} width={60} height={1} fill="hsl(var(--border))" />
          {phase >= 2 && (
            <polyline
              points="0,20 10,15 20,18 30,8 40,12 50,5 60,10"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1s" fill="freeze" />
            </polyline>
          )}
        </g>
        
        <text x={10} y={50} fill="hsl(var(--muted-foreground))" fontSize="5">Throughput</text>
        <text x={45} y={50} fill="hsl(var(--foreground))" fontSize="7" fontWeight="600">
          {phase >= 2 ? '847/s' : '--'}
        </text>
        
        <text x={10} y={62} fill="hsl(var(--muted-foreground))" fontSize="5">Success</text>
        <text x={45} y={62} fill={phase >= 4 ? 'hsl(142 76% 46%)' : 'hsl(var(--foreground))'} fontSize="7" fontWeight="600">
          {phase >= 3 ? '99.2%' : '--'}
        </text>
      </g>

      {/* Edges */}
      <DiagramEdge from={{ x: 60, y: 50 }} to={{ x: 75, y: 55 }} animated={phase >= 0} variant={phase >= 1 ? 'primary' : 'muted'} />
      <DiagramEdge from={{ x: 130, y: 55 }} to={{ x: 145, y: 55 }} animated={phase >= 1} variant={phase >= 2 ? 'accent' : 'muted'} />
      <DiagramEdge from={{ x: 220, y: 55 }} to={{ x: 235, y: 40 }} animated={phase >= 2} variant={phase >= 3 ? 'success' : 'muted'} type="straight" />
      <DiagramEdge from={{ x: 305, y: 55 }} to={{ x: 320, y: 55 }} animated={phase >= 3} variant={phase >= 4 ? 'success' : 'muted'} />

      {/* Particle flow */}
      {phase >= 1 && phase <= 2 && (
        <ParticleFlow
          path="M 60 50 Q 100 50, 145 55"
          count={4}
          color="hsl(260 80% 55%)"
          speed={1.2}
        />
      )}

      {/* DLQ indicator */}
      {phase >= 3 && (
        <g transform="translate(75, 95)">
          <rect x={0} y={0} width={40} height={12} rx={2} fill="hsl(0 84% 60% / 0.15)" stroke="hsl(0 84% 60%)" strokeWidth="0.5" />
          <text x={20} y={8} textAnchor="middle" fill="hsl(0 84% 60%)" fontSize="5">DLQ: 3</text>
        </g>
      )}
    </DiagramShell>
  );
}
