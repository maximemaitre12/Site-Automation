import React, { useState, useEffect } from 'react';
import { Workflow, Play, Zap, Mail, Database, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TourAgentWrapper } from './TourAgentWrapper';

interface TourAgentFlowProps {
  isActive?: boolean;
}

const blocks = [
  { id: 1, type: 'trigger', icon: Mail, label: 'Nouveau Email', x: 50, y: 80 },
  { id: 2, type: 'action', icon: Database, label: 'Enrichir CRM', x: 250, y: 80 },
  { id: 3, type: 'action', icon: MessageSquare, label: 'Notifier Slack', x: 450, y: 80 },
  { id: 4, type: 'end', icon: CheckCircle, label: 'Terminé', x: 650, y: 80 },
];

export function TourAgentFlow({ isActive }: TourAgentFlowProps) {
  const [step, setStep] = useState(0);
  const [executingBlock, setExecutingBlock] = useState(-1);
  const [completedBlocks, setCompletedBlocks] = useState<number[]>([]);

  useEffect(() => {
    if (!isActive) {
      setStep(0);
      setExecutingBlock(-1);
      setCompletedBlocks([]);
      return;
    }

    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setStep(1), 1000));
    timers.push(setTimeout(() => setStep(2), 2500));
    
    // Execute blocks sequentially
    timers.push(setTimeout(() => {
      setExecutingBlock(0);
    }, 3500));
    
    timers.push(setTimeout(() => {
      setCompletedBlocks([0]);
      setExecutingBlock(1);
    }, 4500));
    
    timers.push(setTimeout(() => {
      setCompletedBlocks([0, 1]);
      setExecutingBlock(2);
    }, 5500));
    
    timers.push(setTimeout(() => {
      setCompletedBlocks([0, 1, 2]);
      setExecutingBlock(3);
    }, 6500));
    
    timers.push(setTimeout(() => {
      setCompletedBlocks([0, 1, 2, 3]);
      setExecutingBlock(-1);
      setStep(3);
    }, 7500));

    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  return (
    <TourAgentWrapper title="Flow" url="app.aether.ai/flow/workflows">
      <div className="flex h-[480px]">
        {/* Sidebar - Block palette */}
        <div className="w-48 border-r border-border bg-muted/30 p-3 space-y-3">
          <div className="text-xs font-medium text-muted-foreground mb-3 px-2">BLOCS</div>
          
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground px-2">Triggers</div>
            {[
              { icon: Mail, label: 'Email reçu' },
              { icon: Workflow, label: 'Webhook' },
              { icon: Database, label: 'Nouvelle donnée' },
            ].map((block, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-background border border-border rounded-md text-sm cursor-grab hover:border-primary/50">
                <block.icon className="w-4 h-4 text-blue-500" />
                <span>{block.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3">
            <div className="text-xs text-muted-foreground px-2">Actions</div>
            {[
              { icon: MessageSquare, label: 'Envoyer message' },
              { icon: Database, label: 'Mettre à jour CRM' },
              { icon: Zap, label: 'Appel IA' },
            ].map((block, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-background border border-border rounded-md text-sm cursor-grab hover:border-primary/50">
                <block.icon className="w-4 h-4 text-green-500" />
                <span>{block.label}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-auto pt-6 border-t border-border">
            <div className="text-xs text-muted-foreground px-2 mb-2">Ce workflow</div>
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="p-2 bg-muted/50 rounded">
                <div className="font-bold">247</div>
                <div className="text-xs text-muted-foreground">Exécutions</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="font-bold text-green-500">99%</div>
                <div className="text-xs text-muted-foreground">Succès</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main canvas */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="p-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Workflow className="w-5 h-5 text-primary" />
              <span className="font-medium">Onboarding Client Automatique</span>
              <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs rounded-full">Actif</span>
            </div>
            <div className="flex gap-2">
              <button className={cn(
                "px-3 py-1.5 text-sm rounded-md flex items-center gap-2 transition-all",
                step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                <Play className="w-4 h-4" />
                Exécuter
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative bg-[radial-gradient(circle,_hsl(var(--muted))_1px,_transparent_1px)] bg-[size:20px_20px] overflow-hidden">
            {/* Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {blocks.slice(0, -1).map((block, i) => {
                const nextBlock = blocks[i + 1];
                const isActive = executingBlock === i || completedBlocks.includes(i);
                return (
                  <g key={i}>
                    <line
                      x1={block.x + 80}
                      y1={block.y + 30}
                      x2={nextBlock.x}
                      y2={nextBlock.y + 30}
                      stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--border))"}
                      strokeWidth={isActive ? 3 : 2}
                      strokeDasharray={isActive ? "0" : "5,5"}
                      className="transition-all duration-500"
                    />
                    {/* Animated dot */}
                    {executingBlock === i && (
                      <circle
                        r="6"
                        fill="hsl(var(--primary))"
                        className="animate-pulse"
                      >
                        <animateMotion
                          dur="0.8s"
                          repeatCount="1"
                          path={`M${block.x + 80},${block.y + 30} L${nextBlock.x},${nextBlock.y + 30}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Blocks */}
            {blocks.map((block, i) => {
              const isExecuting = executingBlock === i;
              const isCompleted = completedBlocks.includes(i);
              
              return (
                <div
                  key={block.id}
                  className={cn(
                    "absolute w-36 p-3 bg-card border-2 rounded-lg transition-all duration-300",
                    isExecuting ? "border-primary shadow-lg shadow-primary/30 scale-105" :
                    isCompleted ? "border-green-500" :
                    step >= 1 ? "border-border" : "border-transparent opacity-50"
                  )}
                  style={{ left: block.x, top: block.y }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      block.type === 'trigger' ? "bg-blue-500/10" :
                      block.type === 'end' ? "bg-green-500/10" : "bg-primary/10"
                    )}>
                      <block.icon className={cn(
                        "w-4 h-4",
                        block.type === 'trigger' ? "text-blue-500" :
                        block.type === 'end' ? "text-green-500" : "text-primary"
                      )} />
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                    )}
                    {isExecuting && (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin ml-auto" />
                    )}
                  </div>
                  <div className="text-sm font-medium">{block.label}</div>
                </div>
              );
            })}

            {/* Completion message */}
            {step >= 3 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg animate-fade-in flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <div className="font-medium text-green-500">Workflow exécuté avec succès!</div>
                  <div className="text-sm text-muted-foreground">3 clients onboardés automatiquement</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TourAgentWrapper>
  );
}
