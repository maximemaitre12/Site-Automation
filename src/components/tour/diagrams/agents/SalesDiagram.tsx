import React, { useMemo } from 'react';
import { DiagramShell } from '../DiagramShell';
import { DiagramNode, DiagramEdge, MetricChip, ParticleFlow } from '../primitives';

interface SalesDiagramProps {
  progress: number;
  compact?: boolean;
}

export function SalesDiagram({ progress, compact = false }: SalesDiagramProps) {
  const phase = useMemo(() => {
    if (progress < 20) return 0;
    if (progress < 40) return 1;
    if (progress < 60) return 2;
    if (progress < 80) return 3;
    return 4;
  }, [progress]);

  const viewBox = compact ? '0 0 360 100' : '0 0 400 120';

  // Funnel visualization data
  const funnelSteps = [
    { label: 'Leads', width: 50, count: '2.4K', color: 'hsl(220 80% 55%)' },
    { label: 'Qualified', width: 42, count: '890', color: 'hsl(200 80% 55%)' },
    { label: 'Proposal', width: 34, count: '340', color: 'hsl(180 80% 45%)' },
    { label: 'Closed', width: 26, count: '127', color: 'hsl(142 76% 46%)' },
  ];

  return (
    <DiagramShell viewBox={viewBox} accentColor="hsl(38 92% 50%)">
      {/* Title */}
      <text x="10" y="14" fill="hsl(var(--muted-foreground))" fontSize="8" fontWeight="500" opacity="0.6">
        PREDICTIVE DEAL SCORING
      </text>

      {/* Funnel visualization */}
      <g transform="translate(10, 25)">
        {funnelSteps.map((step, i) => {
          const yOffset = i * 22;
          const xOffset = (50 - step.width) / 2;
          const isActive = phase >= i;
          
          return (
            <g key={i}>
              <rect
                x={xOffset}
                y={yOffset}
                width={step.width}
                height={18}
                rx={3}
                fill={isActive ? step.color : 'hsl(var(--muted))'}
                opacity={isActive ? 0.85 : 0.4}
                style={{ transition: 'all 0.3s' }}
              />
              <text x={25} y={yOffset + 11} textAnchor="middle" fill="white" fontSize="7" fontWeight="500">
                {step.count}
              </text>
              <text x={58} y={yOffset + 11} fill="hsl(var(--muted-foreground))" fontSize="6">
                {step.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* XGBoost Model Block */}
      <g transform="translate(100, 25)">
        <rect
          x={0}
          y={0}
          width={90}
          height={70}
          rx={6}
          fill="hsl(38 92% 50% / 0.1)"
          stroke="hsl(38 92% 50%)"
          strokeWidth={phase === 2 ? 2 : 1}
        />
        <text x={45} y={14} textAnchor="middle" fill="hsl(38 92% 50%)" fontSize="8" fontWeight="600">
          XGBoost
        </text>
        
        {/* Decision trees visualization */}
        <g transform="translate(10, 22)">
          {[0, 1, 2].map((tree) => (
            <g key={tree} transform={`translate(${tree * 25}, 0)`}>
              {/* Tree structure */}
              <circle cx={10} cy={5} r={4} fill={phase >= 2 ? 'hsl(38 92% 50%)' : 'hsl(var(--muted))'} opacity={0.8}>
                {phase === 2 && <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" begin={`${tree * 0.3}s`} />}
              </circle>
              <line x1={10} y1={9} x2={5} y2={20} stroke="hsl(var(--border))" strokeWidth="1" />
              <line x1={10} y1={9} x2={15} y2={20} stroke="hsl(var(--border))" strokeWidth="1" />
              <circle cx={5} cy={22} r={3} fill={phase >= 2 ? 'hsl(38 70% 45%)' : 'hsl(var(--muted))'} />
              <circle cx={15} cy={22} r={3} fill={phase >= 2 ? 'hsl(38 70% 45%)' : 'hsl(var(--muted))'} />
              <line x1={5} y1={25} x2={2} y2={34} stroke="hsl(var(--border))" strokeWidth="0.5" />
              <line x1={5} y1={25} x2={8} y2={34} stroke="hsl(var(--border))" strokeWidth="0.5" />
              <line x1={15} y1={25} x2={12} y2={34} stroke="hsl(var(--border))" strokeWidth="0.5" />
              <line x1={15} y1={25} x2={18} y2={34} stroke="hsl(var(--border))" strokeWidth="0.5" />
            </g>
          ))}
        </g>
        
        <text x={45} y={64} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6">
          Ensemble: 150 trees
        </text>
      </g>

      {/* Feature Engineering */}
      <g>
        <DiagramNode x={205} y={28} width={55} height={22} label="Features" sublabel="47 dims" variant={phase >= 1 ? 'accent' : 'muted'} shape="rounded" active={phase === 1} />
        <DiagramNode x={205} y={55} width={55} height={22} label="Temporal" variant={phase >= 1 ? 'accent' : 'muted'} shape="rounded" active={phase === 1} />
        <DiagramNode x={205} y={82} width={55} height={22} label="Behavior" variant={phase >= 1 ? 'accent' : 'muted'} shape="rounded" active={phase === 1} />
      </g>

      {/* Predictions Output */}
      <g transform="translate(280, 25)">
        <text x={55} y={0} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7" fontWeight="500">
          Predictions
        </text>
        
        {/* Deal cards with probabilities */}
        {[
          { name: 'Acme Corp', prob: 87, value: '$145K' },
          { name: 'TechStart', prob: 72, value: '$89K' },
          { name: 'GlobalFin', prob: 34, value: '$210K' },
        ].map((deal, i) => {
          const isActive = phase >= 4;
          const barWidth = (deal.prob / 100) * 55;
          
          return (
            <g key={i} transform={`translate(0, ${12 + i * 26})`}>
              <rect
                x={0}
                y={0}
                width={110}
                height={22}
                rx={4}
                fill={isActive ? 'hsl(var(--card))' : 'hsl(var(--muted))'}
                stroke={isActive ? (deal.prob > 70 ? 'hsl(142 76% 46%)' : deal.prob > 50 ? 'hsl(38 92% 50%)' : 'hsl(0 84% 60%)') : 'hsl(var(--border))'}
                strokeWidth={isActive ? 1.5 : 0.5}
                style={{ transition: 'all 0.3s' }}
              />
              <text x={5} y={10} fill="hsl(var(--foreground))" fontSize="7" fontWeight="500">
                {deal.name}
              </text>
              <text x={5} y={18} fill="hsl(var(--muted-foreground))" fontSize="6">
                {deal.value}
              </text>
              
              {/* Probability bar */}
              <rect x={50} y={6} width={55} height={10} rx={2} fill="hsl(var(--muted))" />
              <rect
                x={50}
                y={6}
                width={isActive ? barWidth : 0}
                height={10}
                rx={2}
                fill={deal.prob > 70 ? 'hsl(142 76% 46%)' : deal.prob > 50 ? 'hsl(38 92% 50%)' : 'hsl(0 84% 60%)'}
                style={{ transition: 'width 0.5s ease-out' }}
              />
              <text x={102} y={14} fill="hsl(var(--foreground))" fontSize="7" fontWeight="600">
                {isActive ? `${deal.prob}%` : '--'}
              </text>
            </g>
          );
        })}
      </g>

      {/* Edges */}
      <DiagramEdge from={{ x: 60, y: 55 }} to={{ x: 100, y: 60 }} animated={phase >= 1} variant={phase >= 1 ? 'primary' : 'muted'} />
      <DiagramEdge from={{ x: 190, y: 60 }} to={{ x: 205, y: 40 }} animated={phase >= 2} variant={phase >= 2 ? 'accent' : 'muted'} type="straight" />
      <DiagramEdge from={{ x: 190, y: 60 }} to={{ x: 205, y: 66 }} animated={phase >= 2} variant={phase >= 2 ? 'accent' : 'muted'} type="straight" />
      <DiagramEdge from={{ x: 190, y: 60 }} to={{ x: 205, y: 93 }} animated={phase >= 2} variant={phase >= 2 ? 'accent' : 'muted'} type="straight" />
      <DiagramEdge from={{ x: 260, y: 55 }} to={{ x: 280, y: 55 }} animated={phase >= 3} variant={phase >= 4 ? 'success' : 'muted'} />

      {/* Metrics */}
      {!compact && (
        <g>
          <MetricChip x={100} y={100} label="AUC-ROC" value="0.94" variant="success" size="sm" />
          <MetricChip x={165} y={100} label="Pipeline" value="$2.1M" variant="accent" size="sm" trend="up" />
        </g>
      )}
    </DiagramShell>
  );
}
