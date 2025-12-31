import React from 'react';
import { TrendingUp, Phone, FileSignature, DollarSign, Sparkles, Target, Users, Volume2, MessageSquare, Shield, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnimationTimeline, Timeline } from '@/hooks/useAnimationTimeline';
import { SpringIn, FadeSlide, StaggerGroup, CountUp, ScanLine, PulseGlow, ParticleExplosion, ScalePop } from '../animations';

interface SalesSceneProps {
  isActive: boolean;
  progress: number;
}

const salesTimeline: Timeline = {
  header: { start: 0, end: 8 },
  pipeline: { start: 5, end: 18, stagger: 100, items: 4 },
  callSection: { start: 15, end: 28 },
  waveform: { start: 22, end: 38 },
  transcript: { start: 32, end: 48, stagger: 150, items: 3 },
  analysis: { start: 45, end: 60 },
  metrics: { start: 52, end: 68, stagger: 80, items: 4 },
  proposal: { start: 62, end: 75 },
  team: { start: 55, end: 70 },
  compliance: { start: 72, end: 85 },
  finalGlow: { start: 88, end: 100 },
};

const deals = [
  { name: 'TechCorp', stage: 'Negotiation', prob: 85, hot: true },
  { name: 'DataFlow', stage: 'Proposal', prob: 70, hot: false },
  { name: 'CloudFirst', stage: 'Discovery', prob: 45, hot: false },
  { name: 'AI Labs', stage: 'Closing', prob: 95, hot: true },
];

const transcriptLines = [
  { speaker: 'You', text: '"I understand your automation needs..."', you: true },
  { speaker: 'Client', text: '"Exactly, we are looking to save time..."', you: false },
  { speaker: 'You', text: '"Our solution allows you to..."', you: true },
];

const analysisMetrics = [
  { label: 'Score', value: 92, suffix: '%', color: 'text-emerald-600' },
  { label: 'Sentiment', value: '↑', color: 'text-emerald-500' },
  { label: 'Objections', value: 2, color: 'text-amber-500' },
  { label: 'Interest', value: 'High', color: 'text-blue-500' },
];

const teamMembers = [
  { name: 'Marie', quota: 110 },
  { name: 'Thomas', quota: 85 },
  { name: 'Julie', quota: 95 },
];

export function SalesScene({ isActive, progress }: SalesSceneProps) {
  const timeline = useAnimationTimeline(progress, salesTimeline);
  const showParticles = timeline.isActive('finalGlow') && progress >= 92;

  return (
    <div 
      className="absolute inset-0 overflow-hidden bg-white"
      style={{ fontSize: 'clamp(8px, 1.2vw, 14px)' }}
    >
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(142, 76%, 36%) 1px, transparent 1px), linear-gradient(90deg, hsl(142, 76%, 36%) 1px, transparent 1px)`,
            backgroundSize: '3em 3em',
          }}
        />
        <div className={cn(
          "absolute top-0 right-1/4 w-[40%] aspect-square rounded-full blur-[100px] transition-all duration-1000",
          timeline.isActive('header') ? "bg-emerald-500/10 opacity-100" : "opacity-0"
        )} />
      </div>

      <ParticleExplosion 
        active={showParticles} 
        count={25} 
        colors={['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#059669']}
        originX={80}
        originY={80}
      />

      <div className="absolute inset-0 flex flex-col">
        {/* Header */}
        <SpringIn active={timeline.isActive('header')} className="relative z-10 px-[2%] py-[1.5%] border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[0.8em]">
              <PulseGlow active={timeline.isActive('finalGlow')} color="hsl(142, 76%, 36%)" intensity="medium">
                <div className="w-[2.5em] h-[2.5em] rounded-xl bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-[1.2em] h-[1.2em] text-emerald-600" />
                </div>
              </PulseGlow>
              <div className="min-w-0">
                <h1 className="text-[1.3em] font-bold text-slate-900 leading-tight truncate">Sales Copilot</h1>
                <p className="text-[0.75em] text-slate-500 truncate">Commercial intelligence</p>
              </div>
            </div>
            <FadeSlide active={timeline.isActive('pipeline')} direction="left">
              <div className="px-[0.8em] py-[0.4em] rounded-full bg-emerald-50 border border-emerald-200">
                <span className="text-[0.75em] text-emerald-600 font-medium">4 active deals</span>
              </div>
            </FadeSlide>
          </div>
        </SpringIn>

        {/* Main content */}
        <div className="relative z-10 flex-1 flex gap-[1%] p-[1.5%] overflow-hidden min-h-0">
          {/* Left - Pipeline */}
          <FadeSlide active={timeline.isActive('pipeline')} direction="left" className="w-[22%] flex flex-col gap-[0.6em] min-w-0">
            <div className="text-[0.7em] font-semibold text-slate-500 uppercase tracking-wider mb-[0.3em]">Pipeline</div>
            
            <StaggerGroup active={timeline.isActive('pipeline')} stagger={100} animation="spring" className="flex flex-col gap-[0.5em]">
              {deals.map((deal, i) => (
                <div 
                  key={deal.name}
                  className={cn(
                    "p-[0.8em] rounded-xl border transition-all overflow-hidden",
                    deal.hot ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-100"
                  )}
                >
                  <div className="flex items-center justify-between mb-[0.3em]">
                    <span className="text-[0.9em] font-medium text-slate-800 truncate">{deal.name}</span>
                    {deal.hot && <Target className="w-[0.9em] h-[0.9em] text-amber-500 shrink-0" />}
                  </div>
                  <div className="text-[0.7em] text-slate-500 mb-[0.5em] truncate">{deal.stage}</div>
                  <div className="flex items-center gap-[0.5em]">
                    <div className="flex-1 h-[0.3em] bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                        style={{ 
                          width: timeline.isActive('pipeline') ? `${deal.prob}%` : '0%',
                          transitionDelay: `${i * 100 + 200}ms`
                        }}
                      />
                    </div>
                    <span className="text-[0.7em] text-slate-600 shrink-0">
                      <CountUp value={deal.prob} active={timeline.isActive('pipeline')} delay={i * 100} suffix="%" />
                    </span>
                  </div>
                </div>
              ))}
            </StaggerGroup>
          </FadeSlide>

          {/* Center - Call recording & analysis */}
          <div className="flex-1 flex flex-col gap-[0.8em] min-w-0">
            {/* Call recording section */}
            <SpringIn active={timeline.isActive('callSection')} className="flex-1 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden min-h-0 flex flex-col">
              <div className="p-[0.8em] border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-[0.5em]">
                  <Phone className="w-[1em] h-[1em] text-red-500" />
                  <span className="text-[0.9em] font-semibold text-slate-800">Call Recording</span>
                </div>
                <FadeSlide active={timeline.isActive('waveform')} direction="right">
                  <div className="flex items-center gap-[0.5em]">
                    <div className="w-[0.5em] h-[0.5em] rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[0.7em] text-red-500 font-medium">REC • 04:32</span>
                  </div>
                </FadeSlide>
              </div>
              
              <div className="flex-1 p-[1em] flex gap-[1em] min-h-0 overflow-hidden">
                {/* Waveform */}
                <ScalePop active={timeline.isActive('waveform')} className="w-[40%]">
                  <div className="h-full p-[0.8em] rounded-xl bg-red-50 border border-red-100 flex flex-col overflow-hidden">
                    <div className="flex items-center gap-[0.5em] mb-[0.5em]">
                      <Volume2 className="w-[1em] h-[1em] text-red-500" />
                      <span className="text-[0.7em] text-red-600 font-medium truncate">TechCorp Call</span>
                    </div>
                    <div className="flex-1 flex items-end gap-[3%] min-h-0">
                      {[...Array(16)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-red-400 rounded-sm transition-all"
                          style={{ 
                            height: `${20 + Math.sin(i * 0.4) * 30 + Math.random() * 30}%`,
                            animation: timeline.isActive('waveform') ? `wave 0.6s ease-in-out infinite alternate ${i * 40}ms` : 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </ScalePop>

                {/* Transcript */}
                <ScanLine active={timeline.isActive('transcript')} direction="vertical" color="hsl(142, 76%, 36%)" className="flex-1">
                  <div className="flex flex-col gap-[0.4em]">
                    <div className="flex items-center gap-[0.5em] mb-[0.3em]">
                      <MessageSquare className="w-[1em] h-[1em] text-slate-400" />
                      <span className="text-[0.7em] text-slate-500">Real-time transcription</span>
                    </div>
                    {transcriptLines.map((line, i) => (
                      <FadeSlide 
                        key={i}
                        active={timeline.isStaggerItemActive('transcript', i)}
                        direction="left"
                        delay={i * 150}
                        className="p-[0.5em] rounded-lg bg-white border border-slate-100 overflow-hidden"
                      >
                        <span className={cn("text-[0.75em] font-medium", line.you ? "text-emerald-600" : "text-blue-500")}>
                          {line.speaker}:
                        </span>
                        <span className="text-[0.75em] text-slate-600 ml-[0.3em] line-clamp-1">{line.text}</span>
                      </FadeSlide>
                    ))}
                  </div>
                </ScanLine>
              </div>
            </SpringIn>

            {/* Bottom row */}
            <div className="flex gap-[0.8em] h-[30%] min-h-0">
              {/* AI Analysis */}
              <SpringIn active={timeline.isActive('analysis')} className="flex-1 rounded-xl bg-slate-50 border border-slate-100 p-[0.8em] flex flex-col overflow-hidden">
                <div className="flex items-center gap-[0.5em] mb-[0.5em]">
                  <Sparkles className="w-[1em] h-[1em] text-emerald-500" />
                  <span className="text-[0.9em] font-semibold text-slate-800">AI Analysis</span>
                </div>
                <StaggerGroup active={timeline.isActive('metrics')} stagger={80} className="flex-1 grid grid-cols-4 gap-[0.5em]">
                  {analysisMetrics.map((metric) => (
                    <div key={metric.label} className="p-[0.5em] rounded-lg bg-white border border-slate-100 flex flex-col items-center justify-center overflow-hidden">
                      <div className={cn("text-[1.2em] font-bold leading-none", metric.color)}>
                        {typeof metric.value === 'number' ? (
                          <CountUp value={metric.value} active={timeline.isActive('metrics')} suffix={metric.suffix || ''} />
                        ) : metric.value}
                      </div>
                      <div className="text-[0.6em] text-slate-500 mt-[0.2em] truncate">{metric.label}</div>
                    </div>
                  ))}
                </StaggerGroup>
              </SpringIn>

              {/* Proposal */}
              <ScalePop active={timeline.isActive('proposal')} className="w-[25%] rounded-xl bg-slate-50 border border-slate-100 p-[0.8em] flex flex-col overflow-hidden">
                <div className="flex items-center gap-[0.5em] mb-[0.5em]">
                  <FileSignature className="w-[1em] h-[1em] text-purple-500" />
                  <span className="text-[0.9em] font-semibold text-slate-800">Proposal</span>
                </div>
                <div className="flex-1 p-[0.5em] rounded-lg bg-purple-50 border border-purple-100 flex flex-col justify-center overflow-hidden">
                  <div className="flex items-center gap-[0.3em] mb-[0.3em]">
                    <Sparkles className="w-[0.8em] h-[0.8em] text-purple-500 animate-pulse shrink-0" />
                    <span className="text-[0.65em] text-purple-600 font-medium">Generated</span>
                  </div>
                  <div className="text-[0.75em] text-slate-600 truncate">TechCorp • Ready</div>
                </div>
              </ScalePop>
            </div>
          </div>

          {/* Right - Team & Compliance */}
          <FadeSlide active={timeline.isActive('team')} direction="right" className="w-[20%] flex flex-col gap-[0.8em] min-w-0">
            {/* Team performance */}
            <div className="flex-1 rounded-xl bg-slate-50 border border-slate-100 p-[0.8em] flex flex-col min-h-0 overflow-hidden">
              <div className="flex items-center gap-[0.5em] mb-[0.6em]">
                <Users className="w-[1em] h-[1em] text-blue-500" />
                <span className="text-[0.9em] font-semibold text-slate-800">Team</span>
              </div>
              <StaggerGroup active={timeline.isActive('team')} stagger={100} className="flex-1 flex flex-col gap-[0.5em] justify-center">
                {teamMembers.map((member) => (
                  <div key={member.name} className="overflow-hidden">
                    <div className="flex items-center justify-between mb-[0.2em]">
                      <span className="text-[0.7em] text-slate-600 truncate">{member.name}</span>
                      <span className={cn("text-[0.7em] font-semibold shrink-0", member.quota >= 100 ? "text-emerald-500" : "text-slate-500")}>
                        <CountUp value={member.quota} active={timeline.isActive('team')} suffix="%" />
                      </span>
                    </div>
                    <div className="h-[0.3em] bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000", member.quota >= 100 ? "bg-emerald-500" : "bg-emerald-400")}
                        style={{ width: `${Math.min(member.quota, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </StaggerGroup>
            </div>

            {/* Compliance */}
            <PulseGlow active={timeline.isActive('finalGlow')} color="hsl(142, 76%, 36%)" intensity="high">
              <SpringIn active={timeline.isActive('compliance')} className={cn(
                "rounded-xl bg-slate-50 border border-slate-100 p-[0.8em] transition-all duration-500 overflow-hidden",
                timeline.isActive('finalGlow') && "border-emerald-200 bg-emerald-50/50"
              )}>
                <div className="flex items-center gap-[0.5em] mb-[0.5em]">
                  <Shield className="w-[1em] h-[1em] text-emerald-500" />
                  <span className="text-[0.9em] font-semibold text-slate-800">Compliance</span>
                </div>
                <div className="flex items-center gap-[0.5em] p-[0.5em] rounded-lg bg-emerald-50 border border-emerald-100">
                  <CheckCircle className="w-[1em] h-[1em] text-emerald-500 shrink-0" />
                  <span className="text-[0.75em] text-emerald-700 font-medium truncate">100% compliant</span>
                </div>
              </SpringIn>
            </PulseGlow>
          </FadeSlide>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0% { height: 20%; }
          100% { height: 80%; }
        }
      `}</style>
    </div>
  );
}