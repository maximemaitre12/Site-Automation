import React, { useMemo } from 'react';
import { DiagramShell } from '../DiagramShell';
import { DiagramNode, DiagramEdge, MetricChip, ParticleFlow } from '../primitives';

interface HRDiagramProps {
  progress: number;
  compact?: boolean;
}

export function HRDiagram({ progress, compact = false }: HRDiagramProps) {
  const phase = useMemo(() => {
    if (progress < 20) return 0;
    if (progress < 40) return 1;
    if (progress < 60) return 2;
    if (progress < 80) return 3;
    return 4;
  }, [progress]);

  const viewBox = compact ? '0 0 360 100' : '0 0 400 120';

  return (
    <DiagramShell viewBox={viewBox} accentColor="hsl(280 80% 55%)">
      {/* Title */}
      <text x="10" y="14" fill="hsl(var(--muted-foreground))" fontSize="8" fontWeight="500" opacity="0.6">
        NEURAL MATCHING ENGINE
      </text>

      {/* Input Layer - CV Features */}
      <g>
        <DiagramNode x={10} y={28} width={50} height={24} label="CV Parser" variant={phase >= 0 ? 'primary' : 'muted'} shape="rounded" active={phase === 0} glow={phase === 0} />
        <DiagramNode x={10} y={58} width={50} height={24} label="Skills NER" variant={phase >= 0 ? 'primary' : 'muted'} shape="rounded" active={phase === 0} />
        <DiagramNode x={10} y={88} width={50} height={24} label="XP Extract" variant={phase >= 0 ? 'primary' : 'muted'} shape="rounded" active={phase === 0} />
      </g>

      {/* Feature Embedding */}
      <g>
        <DiagramNode x={80} y={38} width={60} height={50} label="Embedding" sublabel="768-dim" variant={phase >= 1 ? 'accent' : 'muted'} shape="hexagon" active={phase === 1} glow={phase === 1} />
      </g>

      {/* Neural Matching Core */}
      <g>
        <rect x={160} y={25} width={80} height={70} rx={8} fill="hsl(280 80% 55% / 0.1)" stroke="hsl(280 80% 55%)" strokeWidth={phase === 2 ? 2 : 1} strokeDasharray="4 2" />
        <text x={200} y={38} textAnchor="middle" fill="hsl(280 80% 55%)" fontSize="8" fontWeight="600">TRANSFORMER</text>
        
        {/* Attention heads */}
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={175 + i * 25}
            cy={60}
            r={8}
            fill={phase >= 2 ? 'hsl(280 80% 55%)' : 'hsl(var(--muted))'}
            opacity={phase === 2 ? 0.9 : 0.5}
          >
            {phase === 2 && (
              <animate attributeName="r" values="8;10;8" dur="1s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
            )}
          </circle>
        ))}
        <text x={200} y={82} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7">Multi-Head Attention</text>
      </g>

      {/* Similarity Scoring */}
      <g>
        <DiagramNode x={260} y={38} width={55} height={50} label="Cosine" sublabel="Similarity" variant={phase >= 3 ? 'success' : 'muted'} shape="diamond" active={phase === 3} glow={phase === 3} />
      </g>

      {/* Output - Match Scores */}
      <g>
        <DiagramNode x={330} y={28} width={60} height={24} label="Match: 94%" variant={phase >= 4 ? 'success' : 'muted'} shape="pill" active={phase === 4} />
        <DiagramNode x={330} y={58} width={60} height={24} label="Match: 87%" variant={phase >= 4 ? 'success' : 'muted'} shape="pill" active={phase === 4} />
        <DiagramNode x={330} y={88} width={60} height={24} label="Match: 76%" variant={phase >= 4 ? 'warning' : 'muted'} shape="pill" active={phase === 4} />
      </g>

      {/* Edges with flow */}
      <DiagramEdge from={{ x: 60, y: 40 }} to={{ x: 80, y: 55 }} animated={phase >= 0} variant={phase >= 1 ? 'primary' : 'muted'} />
      <DiagramEdge from={{ x: 60, y: 70 }} to={{ x: 80, y: 63 }} animated={phase >= 0} variant={phase >= 1 ? 'primary' : 'muted'} />
      <DiagramEdge from={{ x: 60, y: 100 }} to={{ x: 80, y: 75 }} animated={phase >= 0} variant={phase >= 1 ? 'primary' : 'muted'} />
      
      <DiagramEdge from={{ x: 140, y: 63 }} to={{ x: 160, y: 63 }} animated={phase >= 1} variant={phase >= 2 ? 'accent' : 'muted'} />
      <DiagramEdge from={{ x: 240, y: 63 }} to={{ x: 260, y: 63 }} animated={phase >= 2} variant={phase >= 3 ? 'success' : 'muted'} />
      
      <DiagramEdge from={{ x: 315, y: 55 }} to={{ x: 330, y: 40 }} animated={phase >= 3} variant={phase >= 4 ? 'success' : 'muted'} type="straight" />
      <DiagramEdge from={{ x: 315, y: 63 }} to={{ x: 330, y: 70 }} animated={phase >= 3} variant={phase >= 4 ? 'success' : 'muted'} type="straight" />
      <DiagramEdge from={{ x: 315, y: 71 }} to={{ x: 330, y: 100 }} animated={phase >= 3} variant={phase >= 4 ? 'warning' : 'muted'} type="straight" />

      {/* Particle flows for active phase */}
      {phase >= 1 && phase <= 2 && (
        <ParticleFlow
          path="M 60 50 Q 100 50, 160 60"
          count={4}
          color="hsl(280 80% 55%)"
          speed={1.5}
        />
      )}

      {/* Metrics */}
      {!compact && (
        <g>
          <MetricChip x={155} y={2} label="Latency" value="45" unit="ms" variant="success" size="sm" />
          <MetricChip x={220} y={2} label="Accuracy" value="96.2" unit="%" variant="success" size="sm" trend="up" />
        </g>
      )}
    </DiagramShell>
  );
}
