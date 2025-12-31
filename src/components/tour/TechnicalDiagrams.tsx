import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TechnicalDiagramsProps {
  sceneId: string;
  progress: number;
}

interface DiagramNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

interface DiagramConnection {
  from: string;
  to: string;
}

interface DiagramData {
  title: string;
  nodes: DiagramNode[];
  connections: DiagramConnection[];
  metrics: { label: string; value: string; suffix?: string }[];
}

const diagrams: Record<string, DiagramData> = {
  hr: {
    title: 'ML Matching Pipeline',
    nodes: [
      { id: 'cv', label: 'CV Input', x: 5, y: 50, color: 'bg-agent-hr' },
      { id: 'nlp', label: 'NLP Parser', x: 25, y: 30, color: 'bg-agent-hr/80' },
      { id: 'embed', label: 'Embeddings', x: 45, y: 50, color: 'bg-agent-hr/60' },
      { id: 'sim', label: 'Similarity', x: 65, y: 30, color: 'bg-agent-hr/80' },
      { id: 'rank', label: 'Ranking', x: 85, y: 50, color: 'bg-agent-hr' },
    ],
    connections: [
      { from: 'cv', to: 'nlp' },
      { from: 'nlp', to: 'embed' },
      { from: 'embed', to: 'sim' },
      { from: 'sim', to: 'rank' },
    ],
    metrics: [
      { label: 'Precision', value: '95', suffix: '%' },
      { label: 'Latency', value: '120', suffix: 'ms' },
      { label: 'Vectors', value: '768', suffix: 'D' },
    ],
  },
  sales: {
    title: 'Prediction Architecture',
    nodes: [
      { id: 'crm', label: 'CRM Data', x: 5, y: 50, color: 'bg-agent-sales' },
      { id: 'feat', label: 'Features', x: 25, y: 30, color: 'bg-agent-sales/80' },
      { id: 'model', label: 'XGBoost', x: 45, y: 50, color: 'bg-agent-sales/60' },
      { id: 'prob', label: 'Probability', x: 65, y: 30, color: 'bg-agent-sales/80' },
      { id: 'action', label: 'Actions', x: 85, y: 50, color: 'bg-agent-sales' },
    ],
    connections: [
      { from: 'crm', to: 'feat' },
      { from: 'feat', to: 'model' },
      { from: 'model', to: 'prob' },
      { from: 'prob', to: 'action' },
    ],
    metrics: [
      { label: 'AUC-ROC', value: '0.92', suffix: '' },
      { label: 'Features', value: '147', suffix: '' },
      { label: 'Refresh', value: '5', suffix: 'min' },
    ],
  },
  support: {
    title: 'Resolution Flow',
    nodes: [
      { id: 'ticket', label: 'Ticket', x: 5, y: 50, color: 'bg-agent-support' },
      { id: 'intent', label: 'Intent', x: 25, y: 30, color: 'bg-agent-support/80' },
      { id: 'kb', label: 'Knowledge', x: 45, y: 50, color: 'bg-agent-support/60' },
      { id: 'gen', label: 'Response', x: 65, y: 30, color: 'bg-agent-support/80' },
      { id: 'handoff', label: 'Handoff', x: 85, y: 50, color: 'bg-agent-support' },
    ],
    connections: [
      { from: 'ticket', to: 'intent' },
      { from: 'intent', to: 'kb' },
      { from: 'kb', to: 'gen' },
      { from: 'gen', to: 'handoff' },
    ],
    metrics: [
      { label: 'Auto-resolve', value: '72', suffix: '%' },
      { label: 'Response', value: '12', suffix: 's' },
      { label: 'CSAT', value: '+40', suffix: '%' },
    ],
  },
  brain: {
    title: 'RAG Architecture',
    nodes: [
      { id: 'docs', label: 'Documents', x: 5, y: 50, color: 'bg-agent-brain' },
      { id: 'chunk', label: 'Chunking', x: 20, y: 30, color: 'bg-agent-brain/80' },
      { id: 'vec', label: 'VectorDB', x: 40, y: 50, color: 'bg-agent-brain/60' },
      { id: 'search', label: 'Search', x: 60, y: 30, color: 'bg-agent-brain/80' },
      { id: 'ctx', label: 'Context', x: 75, y: 50, color: 'bg-agent-brain/60' },
      { id: 'llm', label: 'LLM', x: 90, y: 30, color: 'bg-agent-brain' },
    ],
    connections: [
      { from: 'docs', to: 'chunk' },
      { from: 'chunk', to: 'vec' },
      { from: 'vec', to: 'search' },
      { from: 'search', to: 'ctx' },
      { from: 'ctx', to: 'llm' },
    ],
    metrics: [
      { label: 'Chunks', value: '512', suffix: 'tok' },
      { label: 'Top-K', value: '5', suffix: '' },
      { label: 'Latency', value: '800', suffix: 'ms' },
    ],
  },
  compliance: {
    title: 'Scanning Pipeline',
    nodes: [
      { id: 'doc', label: 'Document', x: 5, y: 50, color: 'bg-agent-compliance' },
      { id: 'pii', label: 'PII Scan', x: 25, y: 30, color: 'bg-agent-compliance/80' },
      { id: 'regex', label: 'Regex+ML', x: 45, y: 50, color: 'bg-agent-compliance/60' },
      { id: 'risk', label: 'Risk Score', x: 65, y: 30, color: 'bg-agent-compliance/80' },
      { id: 'report', label: 'Report', x: 85, y: 50, color: 'bg-agent-compliance' },
    ],
    connections: [
      { from: 'doc', to: 'pii' },
      { from: 'pii', to: 'regex' },
      { from: 'regex', to: 'risk' },
      { from: 'risk', to: 'report' },
    ],
    metrics: [
      { label: 'PII Types', value: '23', suffix: '' },
      { label: 'Accuracy', value: '99.2', suffix: '%' },
      { label: 'Scan', value: '<1', suffix: 's' },
    ],
  },
  flow: {
    title: 'Event-Driven Architecture',
    nodes: [
      { id: 'event', label: 'Event', x: 5, y: 50, color: 'bg-agent-flow' },
      { id: 'trigger', label: 'Trigger', x: 25, y: 30, color: 'bg-agent-flow/80' },
      { id: 'queue', label: 'Queue', x: 45, y: 50, color: 'bg-agent-flow/60' },
      { id: 'orch', label: 'Orchestrator', x: 65, y: 30, color: 'bg-agent-flow/80' },
      { id: 'webhook', label: 'Webhook', x: 85, y: 50, color: 'bg-agent-flow' },
    ],
    connections: [
      { from: 'event', to: 'trigger' },
      { from: 'trigger', to: 'queue' },
      { from: 'queue', to: 'orch' },
      { from: 'orch', to: 'webhook' },
    ],
    metrics: [
      { label: 'Throughput', value: '10K', suffix: '/s' },
      { label: 'P99', value: '45', suffix: 'ms' },
      { label: 'Uptime', value: '99.9', suffix: '%' },
    ],
  },
  data: {
    title: 'ETL Pipeline',
    nodes: [
      { id: 'api', label: 'APIs', x: 5, y: 50, color: 'bg-agent-data' },
      { id: 'ingest', label: 'Ingest', x: 25, y: 30, color: 'bg-agent-data/80' },
      { id: 'transform', label: 'Transform', x: 45, y: 50, color: 'bg-agent-data/60' },
      { id: 'enrich', label: 'Enrich', x: 65, y: 30, color: 'bg-agent-data/80' },
      { id: 'store', label: 'Storage', x: 85, y: 50, color: 'bg-agent-data' },
    ],
    connections: [
      { from: 'api', to: 'ingest' },
      { from: 'ingest', to: 'transform' },
      { from: 'transform', to: 'enrich' },
      { from: 'enrich', to: 'store' },
    ],
    metrics: [
      { label: 'Sources', value: '50+', suffix: '' },
      { label: 'Records', value: '1M', suffix: '/day' },
      { label: 'Freshness', value: '5', suffix: 'min' },
    ],
  },
};

export function TechnicalDiagrams({ sceneId, progress }: TechnicalDiagramsProps) {
  const [activeNodes, setActiveNodes] = useState<number>(0);
  const diagram = diagrams[sceneId];

  useEffect(() => {
    if (!diagram) {
      setActiveNodes(0);
      return;
    }
    
    // Animate nodes based on progress
    const nodeCount = diagram.nodes.length;
    const activeCount = Math.floor((progress / 100) * (nodeCount + 1));
    setActiveNodes(Math.min(activeCount, nodeCount));
  }, [diagram, progress]);

  if (!diagram) {
    return (
      <div className="w-full h-20 flex items-center justify-center">
        <div className="text-xs text-muted-foreground/50">
          Architecture Overview
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Title */}
      <div className="text-center mb-2">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          {diagram.title}
        </span>
      </div>

      {/* Diagram area */}
      <div className="relative h-16 bg-slate-50/50 rounded-lg border border-slate-200/50 overflow-hidden">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {diagram.connections.map((conn, idx) => {
            const fromNode = diagram.nodes.find(n => n.id === conn.from);
            const toNode = diagram.nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            
            const fromIdx = diagram.nodes.indexOf(fromNode);
            const toIdx = diagram.nodes.indexOf(toNode);
            const isActive = activeNodes > fromIdx && activeNodes > toIdx;

            return (
              <line
                key={idx}
                x1={`${fromNode.x + 5}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.2)'}
                strokeWidth="1"
                strokeDasharray={isActive ? '0' : '3,3'}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {diagram.nodes.map((node, idx) => {
          const isActive = idx < activeNodes;
          return (
            <div
              key={node.id}
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500",
                isActive ? "opacity-100 scale-100" : "opacity-30 scale-75"
              )}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
            >
              <div
                className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-medium text-white shadow-sm",
                  node.color
                )}
              >
                {node.label}
              </div>
            </div>
          );
        })}

        {/* Animated particle */}
        {activeNodes > 0 && activeNodes < diagram.nodes.length && (
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
            style={{
              left: `${diagram.nodes[Math.min(activeNodes, diagram.nodes.length - 1)]?.x || 50}%`,
              top: `${diagram.nodes[Math.min(activeNodes, diagram.nodes.length - 1)]?.y || 50}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </div>

      {/* Metrics */}
      <div className="flex justify-center gap-4 mt-2">
        {diagram.metrics.map((metric, idx) => (
          <div
            key={idx}
            className={cn(
              "text-center transition-all duration-500",
              idx < activeNodes ? "opacity-100" : "opacity-30"
            )}
            style={{ transitionDelay: `${idx * 100}ms` }}
          >
            <div className="text-xs font-semibold text-foreground">
              {metric.value}
              <span className="text-[10px] text-muted-foreground">{metric.suffix}</span>
            </div>
            <div className="text-[9px] text-muted-foreground">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
