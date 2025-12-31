import React from 'react';
import { Brain, Search, FileText, MessageSquare, Sparkles, Link2, Database, Zap, Globe, ImageIcon, Code, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnimationTimeline, Timeline } from '@/hooks/useAnimationTimeline';
import { SpringIn, FadeSlide, StaggerGroup, CountUp, PulseGlow, ParticleExplosion, ScalePop, ZoomSpotlight } from '../animations';

interface BrainSceneProps {
  isActive: boolean;
  progress: number;
}

const brainTimeline: Timeline = {
  interface: { start: 0, end: 10 },
  search: { start: 5, end: 15 },
  docs: { start: 10, end: 25, stagger: 80, items: 5 },
  docCount: { start: 20, end: 30 },
  question: { start: 25, end: 38 },
  thinking: { start: 35, end: 48 },
  response: { start: 45, end: 65 },
  sources: { start: 58, end: 72, stagger: 100, items: 3 },
  tools: { start: 68, end: 82, stagger: 100, items: 4 },
  finalStats: { start: 85, end: 100 },
};

const documents = [
  { name: 'HR Policy.pdf', pages: 45 },
  { name: 'Standard Contracts.docx', pages: 28 },
  { name: 'Product FAQ.pdf', pages: 62 },
  { name: 'Technical Guide.md', pages: 120 },
  { name: 'Procedures.pdf', pages: 34 },
];

const sources = [
  { doc: 'HR Policy.pdf', page: 'p.12-14' },
  { doc: 'Standard Contracts.docx', page: 'p.8' },
  { doc: 'Product FAQ.pdf', page: 'p.23' },
];

const tools = [
  { name: 'Web search', icon: Globe, color: 'text-blue-500', active: true },
  { name: 'Image analysis', icon: ImageIcon, color: 'text-pink-500' },
  { name: 'Code generation', icon: Code, color: 'text-emerald-500' },
  { name: 'Document summary', icon: BookOpen, color: 'text-amber-500' },
];

export function BrainScene({ isActive, progress }: BrainSceneProps) {
  const timeline = useAnimationTimeline(progress, brainTimeline);
  const showParticles = timeline.isActive('finalStats') && progress >= 92;
  const isThinking = timeline.isActive('thinking') && !timeline.isActive('response');

  return (
    <div 
      className="absolute inset-0 bg-white overflow-hidden"
      style={{ fontSize: 'clamp(8px, 1.2vw, 14px)' }}
    >
      {/* Subtle background */}
      <div className="absolute inset-0">
        <div className={cn(
          "absolute top-1/4 left-1/4 w-[35%] aspect-square rounded-full bg-cyan-500/8 blur-[100px] transition-opacity duration-1000",
          timeline.isActive('interface') ? "opacity-100" : "opacity-0"
        )} />
        <div className={cn(
          "absolute bottom-1/4 right-1/4 w-[30%] aspect-square rounded-full bg-violet-500/6 blur-[100px] transition-opacity duration-1000",
          timeline.isActive('response') ? "opacity-100" : "opacity-0"
        )} />
      </div>

      <ParticleExplosion 
        active={showParticles} 
        count={25} 
        colors={['#06B6D4', '#22D3EE', '#67E8F9', '#A5F3FC', '#0891B2']}
        originX={88}
        originY={85}
      />

      <div className="absolute inset-[2%] flex gap-[1.5%]">
        {/* Left - Knowledge Base */}
        <SpringIn active={timeline.isActive('interface')} className="w-[24%] bg-slate-50 rounded-2xl border border-slate-100 p-[1em] flex flex-col">
          <div className="flex items-center gap-[0.6em] mb-[1em]">
            <PulseGlow active={timeline.isActive('finalStats')} color="hsl(187, 85%, 43%)" intensity="medium">
              <div className="w-[2.2em] h-[2.2em] rounded-xl bg-cyan-100 flex items-center justify-center">
                <Brain className="w-[1.1em] h-[1.1em] text-cyan-600" />
              </div>
            </PulseGlow>
            <div>
              <h2 className="font-bold text-slate-900 text-[1em]">Brain</h2>
              <p className="text-[0.65em] text-slate-500">Collective intelligence</p>
            </div>
          </div>

          {/* Search */}
          <FadeSlide active={timeline.isActive('search')} direction="down">
            <div className="flex items-center gap-[0.5em] p-[0.6em] rounded-xl bg-white border border-slate-200 mb-[1em]">
              <Search className="w-[1em] h-[1em] text-slate-400" />
              <span className="text-slate-400 text-[0.8em]">Search...</span>
            </div>
          </FadeSlide>

          {/* Documents */}
          <div className="flex items-center gap-[0.5em] mb-[0.6em]">
            <Database className="w-[1em] h-[1em] text-cyan-600" />
            <span className="text-slate-700 text-[0.8em] font-medium">Knowledge base</span>
          </div>

          <StaggerGroup active={timeline.isActive('docs')} stagger={80} animation="slide" className="flex-1 flex flex-col gap-[0.4em] overflow-hidden">
            {documents.map((doc) => (
              <div key={doc.name} className="p-[0.6em] rounded-xl bg-white border border-slate-100">
                <div className="flex items-center gap-[0.4em]">
                  <FileText className="w-[0.9em] h-[0.9em] text-cyan-500" />
                  <span className="text-slate-700 text-[0.75em] truncate flex-1">{doc.name}</span>
                </div>
                <div className="text-slate-400 text-[0.6em] mt-[0.2em]">{doc.pages} pages indexed</div>
              </div>
            ))}
          </StaggerGroup>

          <ScalePop active={timeline.isActive('docCount')}>
            <div className="mt-[0.8em] p-[0.7em] rounded-xl bg-cyan-50 border border-cyan-100">
              <div className="text-cyan-600 font-bold text-[1.1em]">
                <CountUp value={5} active={timeline.isActive('docCount')} /> docs
              </div>
              <div className="text-cyan-500 text-[0.65em]">indexed in base</div>
            </div>
          </ScalePop>
        </SpringIn>

        {/* Center - Chat */}
        <div className="flex-1 flex flex-col bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex-1 p-[1.2em] overflow-auto flex flex-col">
            {/* Welcome */}
            <div className={cn(
              "text-center mb-[1.5em] transition-all duration-700",
              timeline.isActive('question') ? "opacity-30 scale-90" : "opacity-100 scale-100"
            )}>
              <Brain className="w-[3em] h-[3em] mx-auto mb-[0.5em] text-cyan-300" />
              <p className="text-slate-400 text-[0.85em]">Ask any question</p>
            </div>

            {/* User question */}
            <FadeSlide active={timeline.isActive('question')} direction="up" className="flex justify-end mb-[1em]">
              <div className="max-w-[70%] p-[0.8em] rounded-2xl rounded-br-sm bg-cyan-500 text-white">
                <p className="text-[0.85em]">What is our refund policy for enterprise clients?</p>
              </div>
            </FadeSlide>

            {/* AI Thinking */}
            {isThinking && (
              <div className="flex gap-[0.6em] mb-[1em] animate-fade-in">
                <div className="w-[2em] h-[2em] rounded-full bg-cyan-100 flex items-center justify-center">
                  <Brain className="w-[1em] h-[1em] text-cyan-600 animate-pulse" />
                </div>
                <div className="p-[0.8em] rounded-2xl rounded-bl-sm bg-white border border-slate-100">
                  <div className="flex items-center gap-[0.6em]">
                    <div className="flex gap-[0.2em]">
                      <span className="w-[0.4em] h-[0.4em] rounded-full bg-cyan-500 animate-bounce" />
                      <span className="w-[0.4em] h-[0.4em] rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-[0.4em] h-[0.4em] rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-slate-500 text-[0.75em]">Searching 5 documents...</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Response */}
            <FadeSlide active={timeline.isActive('response')} direction="up" className="flex gap-[0.6em]">
              <div className="w-[2em] h-[2em] rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
                <Brain className="w-[1em] h-[1em] text-cyan-600" />
              </div>
              <div className="flex-1 max-w-[85%]">
                <div className="p-[0.8em] rounded-2xl rounded-bl-sm bg-white border border-slate-100 mb-[0.6em]">
                  <p className="text-slate-700 text-[0.8em] leading-relaxed">
                    According to our <span className="text-cyan-600 font-medium">HR Policy (section 4.2)</span>, refunds for enterprise clients follow these rules:
                  </p>
                  <ul className="mt-[0.5em] space-y-[0.3em] text-slate-600 text-[0.75em]">
                    <li className="flex items-start gap-[0.4em]">
                      <span className="text-cyan-500">•</span>
                      <span>Full refund within the <strong className="text-slate-800">first 30 days</strong></span>
                    </li>
                    <li className="flex items-start gap-[0.4em]">
                      <span className="text-cyan-500">•</span>
                      <span>Pro-rata for annual contracts during the <strong className="text-slate-800">first 3 months</strong></span>
                    </li>
                    <li className="flex items-start gap-[0.4em]">
                      <span className="text-cyan-500">•</span>
                      <span>Exception: server licenses are non-refundable after activation</span>
                    </li>
                  </ul>
                </div>

                {/* Sources */}
                <FadeSlide active={timeline.isActive('sources')} direction="up">
                  <div className="flex items-center gap-[0.4em] mb-[0.4em]">
                    <Link2 className="w-[0.9em] h-[0.9em] text-slate-400" />
                    <span className="text-slate-400 text-[0.65em]">Sources</span>
                  </div>
                  <div className="flex flex-wrap gap-[0.3em]">
                    {sources.map((source, i) => (
                      <span 
                        key={source.doc}
                        className={cn(
                          "px-[0.5em] py-[0.25em] rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-600 text-[0.6em] transition-all duration-500",
                          timeline.isStaggerItemActive('sources', i) ? "opacity-100" : "opacity-0"
                        )}
                        style={{ transitionDelay: `${i * 100}ms` }}
                      >
                        📄 {source.doc} - {source.page}
                      </span>
                    ))}
                  </div>
                </FadeSlide>
              </div>
            </FadeSlide>
          </div>

          {/* Input */}
          <div className="p-[0.8em] border-t border-slate-100">
            <div className="flex items-center gap-[0.6em] p-[0.6em] rounded-xl bg-white border border-slate-200">
              <MessageSquare className="w-[1.1em] h-[1.1em] text-slate-400" />
              <span className="flex-1 text-slate-400 text-[0.8em]">Ask your question...</span>
              <button className="p-[0.4em] rounded-lg bg-cyan-500 text-white">
                <Zap className="w-[0.9em] h-[0.9em]" />
              </button>
            </div>
          </div>
        </div>

        {/* Right - AI Tools */}
        <SpringIn active={timeline.isActive('tools')} className="w-[22%] bg-slate-50 rounded-2xl border border-slate-100 p-[1em] flex flex-col">
          <div className="flex items-center gap-[0.5em] mb-[1em]">
            <Sparkles className="w-[1.1em] h-[1.1em] text-amber-500" />
            <span className="text-slate-800 font-semibold text-[0.95em]">AI Tools</span>
          </div>

          <StaggerGroup active={timeline.isActive('tools')} stagger={100} animation="spring" className="flex-1 flex flex-col gap-[0.4em]">
            {tools.map((tool) => (
              <div 
                key={tool.name}
                className={cn(
                  "p-[0.6em] rounded-xl border transition-all",
                  tool.active 
                    ? "bg-white border-slate-200 shadow-sm" 
                    : "bg-slate-50 border-slate-100"
                )}
              >
                <div className="flex items-center gap-[0.4em]">
                  <tool.icon className={cn("w-[0.9em] h-[0.9em]", tool.color)} />
                  <span className="text-slate-700 text-[0.8em]">{tool.name}</span>
                </div>
                {tool.active && (
                  <div className="mt-[0.3em] text-[0.6em] text-slate-400">Enabled for this session</div>
                )}
              </div>
            ))}
          </StaggerGroup>

          {/* Stats */}
          <PulseGlow active={timeline.isActive('finalStats')} color="hsl(187, 85%, 43%)" intensity="high">
            <ScalePop active={timeline.isActive('finalStats')}>
              <div className={cn(
                "mt-[0.8em] p-[0.7em] rounded-xl bg-gradient-to-br from-cyan-50 to-violet-50 border border-cyan-100 transition-all duration-500",
                timeline.isActive('finalStats') && "border-cyan-200"
              )}>
                <div className="grid grid-cols-2 gap-[0.5em] text-center">
                  <div>
                    <div className="text-[1.1em] font-bold text-slate-800">
                      <CountUp value={4} active={timeline.isActive('finalStats')} />
                    </div>
                    <div className="text-slate-500 text-[0.6em]">AI Tools</div>
                  </div>
                  <div>
                    <div className="text-[1.1em] font-bold text-cyan-600">RAG</div>
                    <div className="text-slate-500 text-[0.6em]">Precision</div>
                  </div>
                </div>
              </div>
            </ScalePop>
          </PulseGlow>
        </SpringIn>
      </div>
    </div>
  );
}
