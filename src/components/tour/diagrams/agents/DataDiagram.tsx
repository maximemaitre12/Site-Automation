import React, { useMemo } from 'react';
import { DiagramShell } from '../DiagramShell';
import { DiagramNode, DiagramEdge, MetricChip, ParticleFlow } from '../primitives';

interface DataDiagramProps {
  progress: number;
  compact?: boolean;
}

export function DataDiagram({ progress, compact = false }: DataDiagramProps) {
  const phase = useMemo(() => {
    if (progress < 20) return 0;
    if (progress < 40) return 1;
    if (progress < 60) return 2;
    if (progress < 80) return 3;
    return 4;
  }, [progress]);

  const viewBox = compact ? '0 0 360 100' : '0 0 400 120';

  return (
    <DiagramShell viewBox={viewBox} accentColor="hsl(180 70% 45%)">
      {/* Title */}
      <text x="10" y="14" fill="hsl(var(--muted-foreground))" fontSize="8" fontWeight="500" opacity="0.6">
        UNIFIED DATA PLATFORM
      </text>

      {/* External Sources */}
      <g transform="translate(10, 22)">
        <text x={30} y={0} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6">
          Sources
        </text>
        
        {[
          { name: 'Salesforce', color: 'hsl(200 80% 50%)' },
          { name: 'HubSpot', color: 'hsl(16 90% 55%)' },
          { name: 'Stripe', color: 'hsl(260 80% 55%)' },
        ].map((source, i) => (
          <g key={i} transform={`translate(0, ${10 + i * 22})`}>
            <rect
              x={0}
              y={0}
              width={60}
              height={18}
              rx={3}
              fill={phase >= 0 ? `${source.color}20` : 'hsl(var(--muted))'}
              stroke={phase >= 0 ? source.color : 'hsl(var(--border))'}
              strokeWidth="1"
            />
            <text x={30} y={12} textAnchor="middle" fill={phase >= 0 ? source.color : 'hsl(var(--muted-foreground))'} fontSize="7" fontWeight="500">
              {source.name}
            </text>
            {phase >= 0 && (
              <circle cx={55} cy={9} r={2} fill="hsl(142 76% 46%)">
                <animate attributeName="opacity" values="1;0.3;1" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            )}
          </g>
        ))}
      </g>

      {/* ETL Pipeline */}
      <g transform="translate(85, 20)">
        <rect
          x={0}
          y={0}
          width={100}
          height={80}
          rx={6}
          fill="hsl(180 70% 45% / 0.08)"
          stroke="hsl(180 70% 45%)"
          strokeWidth={phase >= 1 && phase <= 2 ? 2 : 1}
        />
        <text x={50} y={14} textAnchor="middle" fill="hsl(180 70% 45%)" fontSize="8" fontWeight="700">
          ETL Pipeline
        </text>
        
        {/* Pipeline stages */}
        {['Extract', 'Transform', 'Enrich', 'Load'].map((stage, i) => {
          const isActive = phase >= 1;
          const isCurrent = phase === 1 && i < 2 || phase === 2 && i >= 2;
          
          return (
            <g key={i} transform={`translate(8, ${22 + i * 14})`}>
              <rect
                x={0}
                y={0}
                width={84}
                height={12}
                rx={2}
                fill={isActive ? (isCurrent ? 'hsl(180 70% 45%)' : 'hsl(180 70% 45% / 0.3)') : 'hsl(var(--muted))'}
                style={{ transition: 'all 0.3s', transitionDelay: `${i * 0.1}s` }}
              />
              <text x={6} y={9} fill={isActive ? 'white' : 'hsl(var(--muted-foreground))'} fontSize="6" fontWeight="500">
                {stage}
              </text>
              
              {/* Progress bar inside */}
              {isActive && (
                <rect
                  x={45}
                  y={3}
                  width={phase >= 2 ? 35 : (phase === 1 && i < 2 ? 35 : 0)}
                  height={6}
                  rx={1}
                  fill="white"
                  opacity="0.3"
                  style={{ transition: 'width 0.5s' }}
                />
              )}
              
              {/* Checkmark */}
              {phase >= 2 && i < 3 && (
                <circle cx={80} cy={6} r={3} fill="white" opacity="0.8" />
              )}
            </g>
          );
        })}
      </g>

      {/* Entity Resolution */}
      <g transform="translate(200, 25)">
        <rect
          x={0}
          y={0}
          width={55}
          height={70}
          rx={4}
          fill="hsl(38 92% 50% / 0.1)"
          stroke="hsl(38 92% 50%)"
          strokeWidth={phase === 2 ? 2 : 1}
        />
        <text x={27} y={12} textAnchor="middle" fill="hsl(38 92% 50%)" fontSize="7" fontWeight="600">
          Dedupe
        </text>
        
        {/* Entity matching visualization */}
        <g transform="translate(5, 18)">
          {/* Records */}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={0}
              y={i * 9}
              width={45}
              height={7}
              rx={1}
              fill={phase >= 2 ? (i < 3 ? 'hsl(38 92% 50%)' : 'hsl(var(--muted))') : 'hsl(var(--muted))'}
              opacity={phase >= 2 ? (i < 3 ? 0.6 : 0.3) : 0.3}
              style={{ transition: 'all 0.3s' }}
            />
          ))}
          
          {/* Merge arrows */}
          {phase >= 2 && (
            <>
              <path d="M 48 5 L 53 17 L 48 29" fill="none" stroke="hsl(38 92% 50%)" strokeWidth="1.5" />
              <circle cx={55} cy={17} r={4} fill="hsl(38 92% 50%)" />
              <text x={55} y={19} textAnchor="middle" fill="white" fontSize="5" fontWeight="600">1</text>
            </>
          )}
        </g>
        
        <text x={27} y={65} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="5">
          {phase >= 2 ? '-23% dupes' : '—'}
        </text>
      </g>

      {/* Data Lake Output */}
      <g transform="translate(270, 20)">
        <rect
          x={0}
          y={0}
          width={60}
          height={80}
          rx={8}
          fill="hsl(142 76% 46% / 0.1)"
          stroke="hsl(142 76% 46%)"
          strokeWidth={phase >= 3 ? 2 : 1}
        />
        <text x={30} y={14} textAnchor="middle" fill="hsl(142 76% 46%)" fontSize="8" fontWeight="600">
          Warehouse
        </text>
        
        {/* Table icons */}
        <g transform="translate(8, 22)">
          {['Accounts', 'Contacts', 'Revenue'].map((table, i) => (
            <g key={i} transform={`translate(0, ${i * 16})`}>
              <rect
                x={0}
                y={0}
                width={44}
                height={13}
                rx={2}
                fill={phase >= 3 ? 'hsl(142 76% 46% / 0.2)' : 'hsl(var(--muted))'}
                stroke={phase >= 3 ? 'hsl(142 76% 46%)' : 'hsl(var(--border))'}
                strokeWidth="0.5"
              />
              <text x={22} y={9} textAnchor="middle" fill={phase >= 3 ? 'hsl(142 76% 46%)' : 'hsl(var(--muted-foreground))'} fontSize="6">
                {table}
              </text>
              {phase >= 4 && (
                <circle cx={40} cy={6} r={2} fill="hsl(142 76% 46%)" />
              )}
            </g>
          ))}
        </g>
        
        <text x={30} y={74} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="5">
          {phase >= 3 ? '1.2M records' : '—'}
        </text>
      </g>

      {/* Quality Metrics Panel */}
      <g transform="translate(345, 25)">
        <rect
          x={0}
          y={0}
          width={48}
          height={70}
          rx={4}
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />
        <text x={24} y={12} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="6" fontWeight="600">
          Quality
        </text>
        
        {/* Quality gauge */}
        <g transform="translate(24, 32)">
          <circle cx={0} cy={0} r={12} fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
          <circle
            cx={0}
            cy={0}
            r={12}
            fill="none"
            stroke={phase >= 4 ? 'hsl(142 76% 46%)' : 'hsl(var(--muted))'}
            strokeWidth="3"
            strokeDasharray={phase >= 4 ? '68 7' : '0 75'}
            strokeLinecap="round"
            transform="rotate(-90)"
            style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
          />
          <text x={0} y={3} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontWeight="700">
            {phase >= 4 ? '94' : '--'}
          </text>
        </g>
        
        <text x={24} y={52} textAnchor="middle" fill={phase >= 4 ? 'hsl(142 76% 46%)' : 'hsl(var(--muted-foreground))'} fontSize="6">
          {phase >= 4 ? 'Healthy' : '—'}
        </text>
        
        <text x={24} y={64} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="5">
          Last: 2m ago
        </text>
      </g>

      {/* Edges */}
      <DiagramEdge from={{ x: 70, y: 55 }} to={{ x: 85, y: 55 }} animated={phase >= 0} variant={phase >= 1 ? 'primary' : 'muted'} />
      <DiagramEdge from={{ x: 185, y: 55 }} to={{ x: 200, y: 55 }} animated={phase >= 1} variant={phase >= 2 ? 'warning' : 'muted'} />
      <DiagramEdge from={{ x: 255, y: 55 }} to={{ x: 270, y: 55 }} animated={phase >= 2} variant={phase >= 3 ? 'success' : 'muted'} />
      <DiagramEdge from={{ x: 330, y: 55 }} to={{ x: 345, y: 55 }} animated={phase >= 3} variant={phase >= 4 ? 'success' : 'muted'} />

      {/* Particle flow */}
      {phase >= 1 && phase <= 2 && (
        <ParticleFlow
          path="M 70 55 Q 130 55, 200 55"
          count={6}
          color="hsl(180 70% 45%)"
          speed={1.5}
        />
      )}

      {/* Real-time indicator */}
      {phase >= 3 && (
        <g transform="translate(85, 102)">
          <rect x={0} y={0} width={50} height={12} rx={2} fill="hsl(142 76% 46% / 0.15)" stroke="hsl(142 76% 46%)" strokeWidth="0.5" />
          <circle cx={8} cy={6} r={2} fill="hsl(142 76% 46%)">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
          </circle>
          <text x={28} y={8} textAnchor="middle" fill="hsl(142 76% 46%)" fontSize="5">Real-time</text>
        </g>
      )}
    </DiagramShell>
  );
}
