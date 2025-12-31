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

// Map agent IDs to their HSL accent colors from the design system
const agentAccentColors: Record<string, string> = {
  hr: 'hsl(340 82% 52%)',        // --agent-hr
  sales: 'hsl(142 76% 36%)',     // --agent-sales  
  support: 'hsl(173 80% 40%)',   // --agent-support
  brain: 'hsl(271 91% 65%)',     // --agent-brain
  compliance: 'hsl(25 95% 53%)', // --agent-compliance
  flow: 'hsl(262 83% 58%)',      // --agent-flow
  data: 'hsl(199 89% 48%)',      // --agent-data
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
