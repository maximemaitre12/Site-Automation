import React from 'react';
import { Workflow, Mail, Database, MessageSquare, Play, Zap, CheckCircle, GitBranch, ArrowDown, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnimationTimeline, Timeline } from '@/hooks/useAnimationTimeline';
import { SpringIn, FadeSlide, StaggerGroup, CountUp, PulseGlow, ParticleExplosion, ScalePop } from '../animations';

interface FlowSceneProps {
  isActive: boolean;
  progress: number;
}

const flowTimeline: Timeline = {
  header: { start: 0, end: 8 },
  palette: { start: 5, end: 18, stagger: 100, items: 4 },
  canvas: { start: 12, end: 25 },
  block1: { start: 20, end: 32 },
  connection1: { start: 30, end: 40 },
  block2: { start: 35, end: 47 },
  connection2: { start: 45, end: 55 },
  block3: { start: 50, end: 62 },
  executeButton: { start: 60, end: 72 },
  execution: { start: 70, end: 85, stagger: 200, items: 3 },
  result: { start: 82, end: 92 },
  finalGlow: { start: 90, end: 100 },
};

const paletteBlocks = [
  { type: 'trigger', label: 'Email Trigger', icon: Mail, color: 'bg-blue-500' },
  { type: 'action', label: 'Enrich CRM', icon: Database, color: 'bg-purple-500' },
  { type: 'action', label: 'Slack Notify', icon: MessageSquare, color: 'bg-green-500' },
  { type: 'condition', label: 'Condition', icon: GitBranch, color: 'bg-amber-500' },
];

const workflowBlocks = [
  { id: 'trigger', label: 'Email received', icon: Mail, color: 'bg-blue-500', y: 0 },
  { id: 'enrich', label: 'Enrich CRM', icon: Database, color: 'bg-purple-500', y: 1 },
  { id: 'notify', label: 'Notify Slack', icon: MessageSquare, color: 'bg-green-500', y: 2 },
];

export function FlowScene({ isActive, progress }: FlowSceneProps) {
  const timeline = useAnimationTimeline(progress, flowTimeline);
  const showParticles = timeline.isActive('finalGlow') && progress >= 92;

  const getBlockActive = (index: number) => {
    if (index === 0) return timeline.isActive('block1');
    if (index === 1) return timeline.isActive('block2');
    return timeline.isActive('block3');
  };

  const getExecutionState = (index: number) => {
    return timeline.isStaggerItemActive('execution', index);
  };

  return (
    <div 
      className="absolute inset-0 flex flex-col overflow-hidden bg-white"
      style={{ fontSize: 'clamp(8px, 1.2vw, 14px)' }}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={cn(
          "absolute top-1/3 left-1/3 w-[35%] aspect-square rounded-full blur-[60px] transition-all duration-1000",
          timeline.isActive('header') ? "bg-indigo-500/6 opacity-100" : "opacity-0"
        )} />
      </div>

      <ParticleExplosion 
        active={showParticles} 
        count={25} 
        colors={['#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE', '#4F46E5']}
        originX={70}
        originY={70}
      />

      {/* Header */}
      <SpringIn active={timeline.isActive('header')} className="relative z-10 px-[2%] py-[1.5%] border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[0.8em]">
            <PulseGlow active={timeline.isActive('finalGlow')} color="hsl(239, 84%, 67%)" intensity="medium">
              <div className="w-[2.5em] h-[2.5em] rounded-xl bg-indigo-100 flex items-center justify-center">
                <Workflow className="w-[1.2em] h-[1.2em] text-indigo-600" />
              </div>
            </PulseGlow>
            <div>
              <h1 className="text-[1.3em] font-bold text-slate-900 leading-tight">Flow Automation</h1>
              <p className="text-[0.75em] text-slate-500">No-code workflows</p>
            </div>
          </div>
          <ScalePop active={timeline.isActive('executeButton')}>
            <button className={cn(
              "flex items-center gap-[0.5em] px-[1em] py-[0.5em] rounded-lg bg-primary text-white text-[0.85em] font-medium transition-all",
              timeline.isActive('executeButton') && !timeline.isActive('execution') && "ring-4 ring-primary/30"
            )}>
              <Play className="w-[0.9em] h-[0.9em]" />
              Execute
            </button>
          </ScalePop>
        </div>
      </SpringIn>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex gap-[1%] p-[1.5%] overflow-hidden min-h-0">
        {/* Left - Block palette */}
        <FadeSlide active={timeline.isActive('palette')} direction="left" className="w-[22%] flex flex-col">
          <div className="text-[0.7em] font-semibold text-slate-500 uppercase tracking-wider mb-[0.6em]">Blocks</div>
          
          <StaggerGroup active={timeline.isActive('palette')} stagger={100} animation="spring" className="space-y-[0.5em]">
            {paletteBlocks.map((block) => {
              const Icon = block.icon;
              return (
                <div
                  key={block.label}
                  className="flex items-center gap-[0.6em] p-[0.7em] rounded-xl border border-slate-200 bg-white cursor-grab hover:border-primary/50 transition-all"
                >
                  <div className={cn("w-[2em] h-[2em] rounded-lg flex items-center justify-center", block.color)}>
                    <Icon className="w-[1em] h-[1em] text-white" />
                  </div>
                  <span className="text-[0.8em] text-slate-700">{block.label}</span>
                </div>
              );
            })}
          </StaggerGroup>

          {/* Stats */}
          <SpringIn active={timeline.isActive('header')} delay={300} className="mt-auto pt-[1em]">
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-[0.8em]">
              <div className="flex items-center gap-[0.5em] mb-[0.5em]">
                <BarChart3 className="w-[1em] h-[1em] text-indigo-500" />
                <span className="text-[0.8em] font-semibold text-slate-700">Statistics</span>
              </div>
              <div className="space-y-[0.3em]">
                {[
                  { label: 'Workflows', value: 12 },
                  { label: 'Executions', value: 1847 },
                  { label: 'Success rate', value: 99, suffix: '%' },
                ].map((stat, i) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-[0.7em] text-slate-500">{stat.label}</span>
                    <span className="text-[0.8em] font-bold text-slate-800">
                      <CountUp value={stat.value} active={timeline.isActive('header')} delay={i * 80} suffix={stat.suffix || ''} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </SpringIn>
        </FadeSlide>

        {/* Center - Canvas */}
        <div className="flex-1 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden relative">
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
              backgroundSize: '1.5em 1.5em',
            }}
          />

          {/* Workflow blocks and connections */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-[1em] py-[2em]">
            {workflowBlocks.map((block, index) => {
              const Icon = block.icon;
              const isActive = getBlockActive(index);
              const isExecuting = getExecutionState(index);
              
              return (
                <div key={block.id} className="flex flex-col items-center">
                  {/* Connection line from previous block */}
                  {index > 0 && (
                    <div className={cn(
                      "w-[2px] h-[2em] mb-[0.5em] transition-all duration-500",
                      (index === 1 && timeline.isActive('connection1')) || (index === 2 && timeline.isActive('connection2'))
                        ? "bg-slate-300"
                        : "bg-transparent",
                      isExecuting && "bg-primary"
                    )}>
                      {isExecuting && (
                        <div className="w-[0.6em] h-[0.6em] rounded-full bg-primary absolute -left-[0.2em] animate-bounce" />
                      )}
                    </div>
                  )}
                  
                  {/* Block */}
                  <ScalePop active={isActive}>
                    <div className={cn(
                      "flex items-center gap-[0.8em] p-[0.8em] rounded-xl border-2 bg-white shadow-lg transition-all duration-300",
                      isExecuting 
                        ? "border-primary shadow-primary/30" 
                        : "border-slate-200"
                    )}>
                      <div className={cn("w-[2.5em] h-[2.5em] rounded-lg flex items-center justify-center", block.color)}>
                        <Icon className="w-[1.2em] h-[1.2em] text-white" />
                      </div>
                      <div>
                        <p className="text-[0.9em] font-medium text-slate-800">{block.label}</p>
                        {isExecuting && (
                          <p className="text-[0.7em] text-primary flex items-center gap-[0.3em]">
                            <Zap className="w-[0.7em] h-[0.7em]" />
                            Executing...
                          </p>
                        )}
                      </div>
                      {isExecuting && (
                        <div className="absolute -top-[0.5em] -right-[0.5em] w-[1.5em] h-[1.5em] rounded-full bg-primary flex items-center justify-center animate-scale-in">
                          <CheckCircle className="w-[1em] h-[1em] text-white" />
                        </div>
                      )}
                    </div>
                  </ScalePop>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {!timeline.isActive('block1') && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <GitBranch className="w-[3em] h-[3em] mx-auto mb-[0.5em] opacity-50" />
                <p className="text-[0.85em]">Drag blocks here to create a workflow</p>
              </div>
            </div>
          )}

          {/* Result notification */}
          <PulseGlow active={timeline.isActive('finalGlow')} color="hsl(142, 76%, 36%)" intensity="high">
            <ScalePop active={timeline.isActive('result')}>
              <div className={cn(
                "absolute bottom-[1em] right-[1em] p-[0.8em] rounded-xl bg-emerald-50 border border-emerald-200 transition-all duration-500",
                timeline.isActive('finalGlow') && "border-emerald-300"
              )}>
                <div className="flex items-center gap-[0.5em] text-emerald-600">
                  <CheckCircle className="w-[1em] h-[1em]" />
                  <span className="font-medium text-[0.85em]">Workflow executed!</span>
                </div>
                <p className="text-[0.75em] text-slate-600 mt-[0.2em]">
                  3 customers automatically enriched and notified
                </p>
              </div>
            </ScalePop>
          </PulseGlow>
        </div>

        {/* Right - Logs */}
        <FadeSlide active={timeline.isActive('execution')} direction="right" className="w-[22%] flex flex-col">
          <div className="text-[0.7em] font-semibold text-slate-500 uppercase tracking-wider mb-[0.6em]">Execution Logs</div>
          
          <div className="flex-1 rounded-xl bg-slate-900 border border-slate-700 p-[0.8em] overflow-hidden">
            <div className="space-y-[0.5em] font-mono text-[0.7em]">
              {timeline.isStaggerItemActive('execution', 0) && (
                <div className="text-emerald-400 animate-fade-in">
                  <span className="text-slate-500">[12:34:01]</span> Trigger: Email received
                </div>
              )}
              {timeline.isStaggerItemActive('execution', 1) && (
                <div className="text-blue-400 animate-fade-in">
                  <span className="text-slate-500">[12:34:02]</span> Action: CRM enriched
                </div>
              )}
              {timeline.isStaggerItemActive('execution', 2) && (
                <div className="text-purple-400 animate-fade-in">
                  <span className="text-slate-500">[12:34:03]</span> Action: Slack notified
                </div>
              )}
              {timeline.isActive('result') && (
                <div className="text-emerald-300 animate-fade-in mt-[0.5em] pt-[0.5em] border-t border-slate-700">
                  ✓ Workflow completed successfully
                </div>
              )}
            </div>
          </div>
        </FadeSlide>
      </div>
    </div>
  );
}
