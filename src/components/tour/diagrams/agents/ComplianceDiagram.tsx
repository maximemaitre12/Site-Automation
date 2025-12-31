import React, { useMemo } from 'react';
import { DiagramShell } from '../DiagramShell';
import { DiagramNode, DiagramEdge, MetricChip, ScanBeam } from '../primitives';

interface ComplianceDiagramProps {
  progress: number;
  compact?: boolean;
  accentColor?: string;
}

export function ComplianceDiagram({ progress, compact = false, accentColor = 'hsl(25 95% 53%)' }: ComplianceDiagramProps) {
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
        COMPLIANCE SCANNING ENGINE
      </text>

      {/* Document Scanner Input */}
      <g transform="translate(10, 25)">
        <rect
          x={0}
          y={0}
          width={55}
          height={70}
          rx={4}
          fill="hsl(var(--card))"
          stroke={phase >= 0 ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
          strokeWidth={phase === 0 ? 2 : 1}
        />
        
        {/* Document lines */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={5}
            y={10 + i * 9}
            width={[40, 45, 35, 42, 30, 38][i]}
            height={4}
            rx={1}
            fill={phase >= 0 ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted))'}
            opacity={0.3}
          />
        ))}
        
        {/* Scan beam */}
        {phase === 0 && (
          <ScanBeam x={3} y={8} width={49} height={58} color="hsl(var(--primary))" speed={1.5} />
        )}
        
        <text x={27} y={85} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="6">
          Source Doc
        </text>
      </g>

      {/* Detection Grid */}
      <g transform="translate(80, 22)">
        <rect
          x={0}
          y={0}
          width={90}
          height={78}
          rx={6}
          fill="hsl(0 84% 60% / 0.08)"
          stroke="hsl(0 84% 60%)"
          strokeWidth={phase === 1 ? 2 : 1}
        />
        <text x={45} y={14} textAnchor="middle" fill="hsl(0 84% 60%)" fontSize="8" fontWeight="600">
          PII Detectors
        </text>
        
        {/* Detector grid */}
        <g transform="translate(5, 20)">
          {[
            { name: 'SSN', detected: true, count: 3 },
            { name: 'Email', detected: true, count: 12 },
            { name: 'Phone', detected: false, count: 0 },
            { name: 'Address', detected: true, count: 5 },
            { name: 'CC#', detected: false, count: 0 },
            { name: 'Name', detected: true, count: 28 },
          ].map((detector, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const isActive = phase >= 1;
            
            return (
              <g key={i} transform={`translate(${col * 27}, ${row * 26})`}>
                <rect
                  x={0}
                  y={0}
                  width={24}
                  height={22}
                  rx={3}
                  fill={isActive && detector.detected ? 'hsl(0 84% 60% / 0.2)' : 'hsl(var(--muted))'}
                  stroke={isActive && detector.detected ? 'hsl(0 84% 60%)' : 'hsl(var(--border))'}
                  strokeWidth={isActive && detector.detected ? 1.5 : 0.5}
                  style={{ transition: 'all 0.3s', transitionDelay: `${i * 0.05}s` }}
                />
                <text x={12} y={10} textAnchor="middle" fill={isActive && detector.detected ? 'hsl(0 84% 60%)' : 'hsl(var(--muted-foreground))'} fontSize="6" fontWeight="500">
                  {detector.name}
                </text>
                {isActive && detector.detected && (
                  <text x={12} y={18} textAnchor="middle" fill="hsl(0 84% 60%)" fontSize="7" fontWeight="700">
                    {detector.count}
                  </text>
                )}
                {isActive && detector.detected && (
                  <circle cx={22} cy={3} r={3} fill="hsl(0 84% 60%)">
                    <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" begin={`${i * 0.1}s`} />
                  </circle>
                )}
              </g>
            );
          })}
        </g>
      </g>

      {/* Policy Engine */}
      <g transform="translate(185, 28)">
        <rect
          x={0}
          y={0}
          width={65}
          height={64}
          rx={6}
          fill="hsl(38 92% 50% / 0.1)"
          stroke="hsl(38 92% 50%)"
          strokeWidth={phase === 2 ? 2 : 1}
        />
        <text x={32} y={14} textAnchor="middle" fill="hsl(38 92% 50%)" fontSize="8" fontWeight="600">
          Policy
        </text>
        
        {/* Rules checklist */}
        {['GDPR', 'HIPAA', 'SOC2'].map((rule, i) => {
          const isChecked = phase >= 2;
          const status = [true, true, false][i];
          
          return (
            <g key={i} transform={`translate(8, ${22 + i * 14})`}>
              <rect
                x={0}
                y={0}
                width={10}
                height={10}
                rx={2}
                fill={isChecked ? (status ? 'hsl(142 76% 46%)' : 'hsl(0 84% 60%)') : 'hsl(var(--muted))'}
                style={{ transition: 'all 0.3s', transitionDelay: `${i * 0.15}s` }}
              />
              {isChecked && status && (
                <path d="M 2 5 L 4 7 L 8 3" stroke="white" strokeWidth="1.5" fill="none" />
              )}
              {isChecked && !status && (
                <path d="M 3 3 L 7 7 M 7 3 L 3 7" stroke="white" strokeWidth="1.5" fill="none" />
              )}
              <text x={14} y={8} fill="hsl(var(--foreground))" fontSize="7">
                {rule}
              </text>
              <text x={50} y={8} fill={isChecked ? (status ? 'hsl(142 76% 46%)' : 'hsl(0 84% 60%)') : 'hsl(var(--muted-foreground))'} fontSize="6" fontWeight="500">
                {isChecked ? (status ? 'OK' : 'FAIL') : '—'}
              </text>
            </g>
          );
        })}
      </g>

      {/* Risk Score Output */}
      <g transform="translate(265, 22)">
        <rect
          x={0}
          y={0}
          width={65}
          height={76}
          rx={8}
          fill={phase >= 3 ? 'hsl(0 84% 60% / 0.1)' : 'hsl(var(--muted))'}
          stroke={phase >= 3 ? 'hsl(0 84% 60%)' : 'hsl(var(--border))'}
          strokeWidth={phase === 3 ? 2 : 1}
        />
        <text x={32} y={14} textAnchor="middle" fill={phase >= 3 ? 'hsl(0 84% 60%)' : 'hsl(var(--muted-foreground))'} fontSize="7" fontWeight="600">
          Risk Score
        </text>
        
        {/* Gauge */}
        <g transform="translate(32, 42)">
          <circle
            cx={0}
            cy={0}
            r={18}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="4"
            strokeDasharray="85 28"
            transform="rotate(-135)"
          />
          <circle
            cx={0}
            cy={0}
            r={18}
            fill="none"
            stroke={phase >= 3 ? 'hsl(38 92% 50%)' : 'hsl(var(--muted))'}
            strokeWidth="4"
            strokeDasharray={phase >= 3 ? '55 58' : '0 113'}
            strokeLinecap="round"
            transform="rotate(-135)"
            style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
          />
          <text x={0} y={4} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="12" fontWeight="700">
            {phase >= 3 ? '67' : '--'}
          </text>
        </g>
        
        <text x={32} y={68} textAnchor="middle" fill={phase >= 3 ? 'hsl(38 92% 50%)' : 'hsl(var(--muted-foreground))'} fontSize="7" fontWeight="600">
          MEDIUM
        </text>
      </g>

      {/* Remediation Actions */}
      <g transform="translate(340, 28)">
        {['Redact', 'Flag', 'Block'].map((action, i) => {
          const isActive = phase >= 4;
          const colors = ['hsl(142 76% 46%)', 'hsl(38 92% 50%)', 'hsl(0 84% 60%)'];
          
          return (
            <g key={i} transform={`translate(0, ${i * 22})`}>
              <rect
                x={0}
                y={0}
                width={50}
                height={18}
                rx={4}
                fill={isActive ? `${colors[i]}20` : 'hsl(var(--muted))'}
                stroke={isActive ? colors[i] : 'hsl(var(--border))'}
                strokeWidth={isActive ? 1.5 : 0.5}
                style={{ transition: 'all 0.3s', transitionDelay: `${i * 0.1}s` }}
              />
              <text x={25} y={12} textAnchor="middle" fill={isActive ? colors[i] : 'hsl(var(--muted-foreground))'} fontSize="7" fontWeight="500">
                {action}
              </text>
            </g>
          );
        })}
      </g>

      {/* Edges */}
      <DiagramEdge from={{ x: 65, y: 60 }} to={{ x: 80, y: 60 }} animated={phase >= 0} variant={phase >= 1 ? 'primary' : 'muted'} />
      <DiagramEdge from={{ x: 170, y: 60 }} to={{ x: 185, y: 60 }} animated={phase >= 1} variant={phase >= 2 ? 'warning' : 'muted'} />
      <DiagramEdge from={{ x: 250, y: 60 }} to={{ x: 265, y: 60 }} animated={phase >= 2} variant={phase >= 3 ? 'warning' : 'muted'} />
      <DiagramEdge from={{ x: 330, y: 60 }} to={{ x: 340, y: 45 }} animated={phase >= 3} variant={phase >= 4 ? 'success' : 'muted'} type="straight" />

      {/* Metrics */}
      {!compact && (
        <g>
          <MetricChip x={80} y={102} label="Scanned" value="2.4K" variant="default" size="sm" />
          <MetricChip x={145} y={102} label="Issues" value="48" variant="warning" size="sm" />
        </g>
      )}
    </DiagramShell>
  );
}
