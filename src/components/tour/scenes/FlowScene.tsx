import React, { useState, useEffect } from 'react';
import { GitBranch, Mail, Database, MessageSquare, Play, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedCursor } from '../core/AnimatedCursor';

interface FlowSceneProps {
  isActive: boolean;
  progress: number;
}

interface Block {
  id: string;
  type: string;
  label: string;
  icon: React.ElementType;
  x: number;
  y: number;
  color: string;
}

export function FlowScene({ isActive, progress }: FlowSceneProps) {
  const [phase, setPhase] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 100, y: 100 });
  const [isClicking, setIsClicking] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [connections, setConnections] = useState<Array<{ from: string; to: string }>>([]);
  const [showExecution, setShowExecution] = useState(false);
  const [executionStep, setExecutionStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      setBlocks([]);
      setConnections([]);
      setShowExecution(false);
      setExecutionStep(0);
      setShowResult(false);
      return;
    }

    if (progress < 8) {
      setPhase(1);
    } else if (progress < 15) {
      setPhase(2);
      setCursorPos({ x: 150, y: 200 });
    } else if (progress < 25) {
      setPhase(3);
      setCursorPos({ x: 400, y: 280 });
      setBlocks([{ id: 'trigger', type: 'trigger', label: 'Email reçu', icon: Mail, x: 400, y: 280, color: 'bg-blue-500' }]);
    } else if (progress < 35) {
      setPhase(4);
      setCursorPos({ x: 150, y: 280 });
    } else if (progress < 45) {
      setPhase(5);
      setCursorPos({ x: 400, y: 400 });
      setBlocks(prev => [...prev, { id: 'enrich', type: 'action', label: 'Enrichir CRM', icon: Database, x: 400, y: 400, color: 'bg-purple-500' }]);
      setConnections([{ from: 'trigger', to: 'enrich' }]);
    } else if (progress < 55) {
      setPhase(6);
      setCursorPos({ x: 150, y: 360 });
    } else if (progress < 65) {
      setPhase(7);
      setCursorPos({ x: 400, y: 520 });
      setBlocks(prev => [...prev, { id: 'notify', type: 'action', label: 'Notifier Slack', icon: MessageSquare, x: 400, y: 520, color: 'bg-green-500' }]);
      setConnections(prev => [...prev, { from: 'enrich', to: 'notify' }]);
    } else if (progress < 75) {
      setPhase(8);
      setCursorPos({ x: 700, y: 350 });
    } else if (progress < 90) {
      setPhase(9);
      setShowExecution(true);
      setExecutionStep(Math.min(Math.floor((progress - 75) / 5), 3));
    } else {
      setPhase(10);
      setShowResult(true);
    }
  }, [isActive, progress]);

  const paletteBlocks = [
    { type: 'trigger', label: 'Email Trigger', icon: Mail, color: 'bg-blue-500' },
    { type: 'action', label: 'Enrichir CRM', icon: Database, color: 'bg-purple-500' },
    { type: 'action', label: 'Slack Notify', icon: MessageSquare, color: 'bg-green-500' },
    { type: 'action', label: 'Condition', icon: GitBranch, color: 'bg-amber-500' },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <AnimatedCursor
        targetPosition={cursorPos}
        isClicking={isClicking}
        isVisible={phase >= 2 && phase < 9}
        duration={600}
        mode="container"
      />

      {/* Flow Interface */}
      <div 
        className={cn(
          "relative w-full max-w-5xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden transition-all duration-700",
          phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        style={{ height: 'min(70vh, 100%)', maxHeight: 'min(600px, 100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-agent-flow/20 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-agent-flow" />
            </div>
            <div>
              <h2 className="font-semibold">Flow</h2>
              <p className="text-xs text-muted-foreground">Automatisations no-code</p>
            </div>
          </div>
          <button 
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all",
              phase >= 8 && phase < 10 && "ring-4 ring-primary/30 animate-element-highlight"
            )}
          >
            <Play className="w-4 h-4" />
            Exécuter
          </button>
        </div>

        <div className="flex h-full">
          {/* Block palette */}
          <div className="w-52 border-r border-border p-4 bg-muted/10">
            <h3 className="text-sm font-semibold mb-3">Blocs</h3>
            
            <div className="space-y-2">
              {paletteBlocks.map((block, index) => {
                const Icon = block.icon;
                const isHighlighted = 
                  (phase >= 2 && phase < 3 && index === 0) ||
                  (phase >= 4 && phase < 5 && index === 1) ||
                  (phase >= 6 && phase < 7 && index === 2);
                
                return (
                  <div
                    key={block.type + index}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-lg border border-border bg-background cursor-grab transition-all hover:border-primary/50",
                      isHighlighted && "ring-2 ring-primary/30 border-primary animate-drag-float"
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", block.color)}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm">{block.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative bg-muted/5">
            {/* Grid pattern */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Connections SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((conn, index) => {
                const fromBlock = blocks.find(b => b.id === conn.from);
                const toBlock = blocks.find(b => b.id === conn.to);
                if (!fromBlock || !toBlock) return null;

                const isActive = showExecution && executionStep >= index;

                return (
                  <g key={`${conn.from}-${conn.to}`}>
                    <line
                      x1={fromBlock.x - 180}
                      y1={fromBlock.y - 50}
                      x2={toBlock.x - 180}
                      y2={toBlock.y - 100}
                      stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                      strokeWidth={isActive ? 3 : 2}
                      strokeDasharray={isActive ? '0' : '8 4'}
                      className={cn(
                        "transition-all duration-500",
                        isActive && "animate-line-draw"
                      )}
                    />
                    {isActive && (
                      <circle
                        r="6"
                        fill="hsl(var(--primary))"
                        className="animate-pulse"
                      >
                        <animateMotion
                          dur="1s"
                          repeatCount="1"
                          path={`M ${fromBlock.x - 180} ${fromBlock.y - 50} L ${toBlock.x - 180} ${toBlock.y - 100}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Placed blocks */}
            {blocks.map((block, index) => {
              const Icon = block.icon;
              const isActive = showExecution && executionStep >= index;
              
              return (
                <div
                  key={block.id}
                  className={cn(
                    "absolute flex items-center gap-3 p-3 rounded-xl border-2 bg-background shadow-lg transition-all duration-300 animate-zoom-in",
                    isActive 
                      ? "border-primary shadow-primary/30" 
                      : "border-border"
                  )}
                  style={{
                    left: block.x - 180,
                    top: block.y - 100,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", block.color)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{block.label}</p>
                    {isActive && (
                      <p className="text-xs text-primary flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Exécution...
                      </p>
                    )}
                  </div>
                  {isActive && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-zoom-in">
                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Result notification */}
            {showResult && (
              <div className="absolute bottom-8 right-8 p-4 rounded-xl bg-green-500/10 border border-green-500/30 animate-zoom-in">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Workflow exécuté !</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  3 clients automatiquement enrichis et notifiés
                </p>
              </div>
            )}

            {/* Empty state hint */}
            {blocks.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <GitBranch className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Glissez des blocs ici pour créer un workflow</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
