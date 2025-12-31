import React, { useMemo } from 'react';
import { DiagramShell } from '../DiagramShell';
import { DiagramNode, DiagramEdge, MetricChip, ParticleFlow } from '../primitives';

interface BrainDiagramProps {
  progress: number;
  compact?: boolean;
  accentColor?: string;
}

export function BrainDiagram({ progress, compact = false, accentColor = 'hsl(271 91% 65%)' }: BrainDiagramProps) {
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
        RAG KNOWLEDGE ARCHITECTURE
      </text>

      {/* Document Input Layer */}
      <g transform="translate(10, 25)">
        {['PDF', 'DOC', 'API'].map((type, i) => (
          <g key={i} transform={`translate(0, ${i * 24})`}>
            <rect
              x={0}
              y={0}
              width={35}
              height={20}
              rx={3}
              fill={phase >= 0 ? 'hsl(var(--card))' : 'hsl(var(--muted))'}
              stroke={phase >= 0 ? 'hsl(var(--border))' : 'hsl(var(--border))'}
              strokeWidth="1"
            />
            <text x={17} y={13} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="7" fontWeight="500">
              {type}
            </text>
          </g>
        ))}
      </g>

      {/* Chunking + Embedding */}
      <g transform="translate(60, 28)">
        <rect
          x={0}
          y={0}
          width={55}
          height={64}
          rx={4}
          fill="hsl(280 70% 50% / 0.1)"
          stroke="hsl(280 70% 50%)"
          strokeWidth={phase === 1 ? 2 : 1}
        />
        <text x={27} y={12} textAnchor="middle" fill="hsl(280 70% 50%)" fontSize="7" fontWeight="600">
          Chunker
        </text>
        
        {/* Chunk visualization */}
        <g transform="translate(5, 18)">
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={i * 9}
              y={0}
              width={7}
              height={12}
              rx={1}
              fill={phase >= 1 ? `hsl(280 ${60 + i * 5}% ${50 + i * 5}%)` : 'hsl(var(--muted))'}
              opacity={phase >= 1 ? 0.8 : 0.4}
              style={{ transition: 'all 0.3s', transitionDelay: `${i * 0.05}s` }}
            />
          ))}
        </g>
        
        <text x={27} y={42} textAnchor="middle" fill="hsl(280 70% 50%)" fontSize="7" fontWeight="600">
          Embed
        </text>
        
        {/* Vector dots */}
        <g transform="translate(5, 48)">
          {[...Array(15)].map((_, i) => (
            <circle
              key={i}
              cx={3 + (i % 5) * 10}
              cy={Math.floor(i / 5) * 5}
              r={1.5}
              fill={phase >= 1 ? 'hsl(280 70% 50%)' : 'hsl(var(--muted))'}
              opacity={phase >= 1 ? 0.7 : 0.3}
            >
              {phase === 1 && (
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1s" repeatCount="indefinite" begin={`${i * 0.05}s`} />
              )}
            </circle>
          ))}
        </g>
      </g>

      {/* Vector Database */}
      <g transform="translate(130, 22)">
        <rect
          x={0}
          y={0}
          width={65}
          height={76}
          rx={6}
          fill="hsl(142 76% 46% / 0.1)"
          stroke="hsl(142 76% 46%)"
          strokeWidth={phase === 2 ? 2 : 1}
        />
        <text x={32} y={14} textAnchor="middle" fill="hsl(142 76% 46%)" fontSize="8" fontWeight="600">
          VectorDB
        </text>
        
        {/* Index visualization - 3D cube effect */}
        <g transform="translate(10, 22)">
          {/* Layers */}
          {[0, 1, 2].map((layer) => (
            <g key={layer} transform={`translate(${layer * 4}, ${layer * 12})`}>
              <rect
                x={0}
                y={0}
                width={38}
                height={14}
                rx={2}
                fill={phase >= 2 ? `hsl(142 ${70 - layer * 10}% ${50 - layer * 8}%)` : 'hsl(var(--muted))'}
                opacity={phase >= 2 ? 0.8 : 0.4}
              />
              <text x={19} y={10} textAnchor="middle" fill="white" fontSize="6">
                {['idx_main', 'idx_meta', 'idx_rel'][layer]}
              </text>
            </g>
          ))}
        </g>
        
        <text x={32} y={70} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6">
          1.2M vectors
        </text>
      </g>

      {/* Retrieval + Reranker */}
      <g transform="translate(210, 30)">
        <DiagramNode x={0} y={0} width={50} height={28} label="Retrieval" sublabel="k=10" variant={phase >= 2 ? 'accent' : 'muted'} shape="rounded" active={phase === 2} />
        <DiagramNode x={0} y={35} width={50} height={28} label="Reranker" sublabel="Cross-enc" variant={phase >= 3 ? 'primary' : 'muted'} shape="rounded" active={phase === 3} glow={phase === 3} />
      </g>

      {/* LLM Generation */}
      <g transform="translate(275, 25)">
        <rect
          x={0}
          y={0}
          width={60}
          height={70}
          rx={8}
          fill="hsl(var(--primary) / 0.15)"
          stroke="hsl(var(--primary))"
          strokeWidth={phase === 4 ? 2 : 1}
        />
        <text x={30} y={16} textAnchor="middle" fill="hsl(var(--primary))" fontSize="9" fontWeight="700">
          LLM
        </text>
        
        {/* Generation indicator */}
        <g transform="translate(8, 24)">
          <rect x={0} y={0} width={44} height={6} rx={2} fill="hsl(var(--muted))" />
          <rect
            x={0}
            y={0}
            width={phase >= 4 ? 44 : 0}
            height={6}
            rx={2}
            fill="hsl(var(--primary))"
            style={{ transition: 'width 0.8s ease-out' }}
          />
        </g>
        
        {/* Output lines */}
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={8}
            y={36 + i * 7}
            width={[40, 35, 44, 28][i]}
            height={4}
            rx={1}
            fill={phase >= 4 ? 'hsl(var(--foreground))' : 'hsl(var(--muted))'}
            opacity={phase >= 4 ? 0.3 + i * 0.15 : 0.2}
            style={{ transition: 'all 0.3s', transitionDelay: `${i * 0.1}s` }}
          />
        ))}
        
        <text x={30} y={66} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6">
          + citations
        </text>
      </g>

      {/* Feedback Loop */}
      {phase >= 4 && (
        <path
          d="M 335 50 Q 355 50, 355 70 Q 355 95, 160 98 Q 100 98, 100 85"
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1"
          strokeDasharray="4 2"
          opacity="0.4"
        >
          <animate attributeName="stroke-dashoffset" values="20;0" dur="2s" repeatCount="indefinite" />
        </path>
      )}

      {/* Edges */}
      <DiagramEdge from={{ x: 45, y: 50 }} to={{ x: 60, y: 55 }} animated={phase >= 0} variant={phase >= 1 ? 'primary' : 'muted'} />
      <DiagramEdge from={{ x: 115, y: 55 }} to={{ x: 130, y: 55 }} animated={phase >= 1} variant={phase >= 2 ? 'success' : 'muted'} />
      <DiagramEdge from={{ x: 195, y: 55 }} to={{ x: 210, y: 44 }} animated={phase >= 2} variant={phase >= 2 ? 'accent' : 'muted'} type="straight" />
      <DiagramEdge from={{ x: 195, y: 60 }} to={{ x: 210, y: 79 }} animated={phase >= 2} variant={phase >= 3 ? 'primary' : 'muted'} type="straight" />
      <DiagramEdge from={{ x: 260, y: 60 }} to={{ x: 275, y: 60 }} animated={phase >= 3} variant={phase >= 4 ? 'primary' : 'muted'} />

      {/* Particle flows */}
      {phase >= 2 && phase <= 3 && (
        <ParticleFlow
          path="M 195 55 Q 220 55, 275 55"
          count={5}
          color="hsl(142 76% 46%)"
          speed={1.2}
        />
      )}

      {/* Metrics */}
      {!compact && (
        <g>
          <MetricChip x={345} y={30} label="Recall" value="94" unit="%" variant="success" size="sm" />
          <MetricChip x={345} y={65} label="Latency" value="120" unit="ms" variant="default" size="sm" />
        </g>
      )}
    </DiagramShell>
  );
}
