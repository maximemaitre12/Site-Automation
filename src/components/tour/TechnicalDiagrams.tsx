import React, { useMemo } from 'react';
import {
  HRDiagram,
  SalesDiagram,
  SupportDiagram,
  BrainDiagram,
  ComplianceDiagram,
  FlowDiagram,
  DataDiagram,
  OverviewDiagram,
} from './diagrams/agents';

// Map agent IDs to CSS variable references for perfect color sync
const agentAccentColors: Record<string, string> = {
  hr: 'hsl(var(--agent-hr))',
  sales: 'hsl(var(--agent-sales))',
  support: 'hsl(var(--agent-support))',
  brain: 'hsl(var(--agent-brain))',
  compliance: 'hsl(var(--agent-compliance))',
  flow: 'hsl(var(--agent-flow))',
  data: 'hsl(var(--agent-data))',
};

interface TechnicalDiagramsProps {
  sceneId: string;
  progress: number;
  compact?: boolean;
  agentColor?: string;
}

export function TechnicalDiagrams({ sceneId, progress, compact = false }: TechnicalDiagramsProps) {
  const accentColor = agentAccentColors[sceneId] || 'hsl(var(--primary))';
  
  const DiagramComponent = useMemo(() => {
    switch (sceneId) {
      case 'hr':
        return HRDiagram;
      case 'sales':
        return SalesDiagram;
      case 'support':
        return SupportDiagram;
      case 'brain':
        return BrainDiagram;
      case 'compliance':
        return ComplianceDiagram;
      case 'flow':
        return FlowDiagram;
      case 'data':
        return DataDiagram;
      case 'intro':
      case 'conclusion':
      default:
        return OverviewDiagram;
    }
  }, [sceneId]);

  return (
    <div className="w-full h-full">
      <DiagramComponent progress={progress} compact={compact} accentColor={accentColor} />
    </div>
  );
}
