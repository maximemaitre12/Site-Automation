import React from 'react';
import { Users, FileText, Calendar, Mail, Sparkles, BarChart3, Brain, Star, Upload, Send, Clock, CheckCircle, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnimationTimeline, Timeline } from '@/hooks/useAnimationTimeline';
import { SpringIn, FadeSlide, StaggerGroup, CountUp, ScanLine, PulseGlow, ParticleExplosion, ScalePop } from '../animations';

interface HRSceneProps {
  isActive: boolean;
  progress: number;
}

// Professional timeline with precise orchestration
const hrTimeline: Timeline = {
  header: { start: 0, end: 8 },
  pipeline: { start: 5, end: 18, stagger: 120, items: 4 },
  cvSection: { start: 15, end: 28 },
  cvUpload: { start: 20, end: 32 },
  scanEffect: { start: 28, end: 42 },
  candidates: { start: 38, end: 55, stagger: 150, items: 3 },
  matchScores: { start: 48, end: 62 },
  interviews: { start: 55, end: 70, stagger: 100, items: 3 },
  emails: { start: 65, end: 78 },
  jobGen: { start: 72, end: 85 },
  stats: { start: 80, end: 92 },
  finalGlow: { start: 90, end: 100 },
};

const pipelineStages = [
  { label: 'New', count: 24, color: 'bg-blue-500' },
  { label: 'CV Analyzed', count: 18, color: 'bg-violet-500' },
  { label: 'Interviews', count: 8, color: 'bg-purple-500' },
  { label: 'Offers', count: 3, color: 'bg-emerald-500' },
];

const candidates = [
  { name: 'Sophie Martin', role: 'UX Designer', score: 94, skills: ['Figma', 'Research'] },
  { name: 'Lucas Bernard', role: 'Frontend Dev', score: 88, skills: ['React', 'TypeScript'] },
  { name: 'Emma Dubois', role: 'Product Manager', score: 91, skills: ['Agile', 'Data'] },
];

const interviews = [
  { time: '09:00', name: 'Sophie M.', type: 'Technical', live: true },
  { time: '11:30', name: 'Lucas B.', type: 'HR', live: false },
  { time: '14:00', name: 'Emma D.', type: 'Final', live: false },
];

export function HRScene({ isActive, progress }: HRSceneProps) {
  const timeline = useAnimationTimeline(progress, hrTimeline);
  const showParticles = timeline.isActive('finalGlow') && progress >= 92;

  return (
    <div 
      className="absolute inset-0 flex flex-col overflow-hidden bg-white"
      style={{ fontSize: 'clamp(8px, 1.2vw, 14px)' }}
    >
      {/* Subtle background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '2em 2em',
          }}
        />
        <div className={cn(
          "absolute top-1/4 -left-[10%] w-[40%] aspect-square rounded-full blur-[100px] transition-all duration-1000",
          timeline.isActive('header') ? "bg-violet-500/10 opacity-100" : "opacity-0"
        )} />
        <div className={cn(
          "absolute bottom-1/4 -right-[10%] w-[35%] aspect-square rounded-full blur-[100px] transition-all duration-1000",
          timeline.isActive('cvSection') ? "bg-purple-500/8 opacity-100" : "opacity-0"
        )} />
      </div>

      {/* Particle explosion for final celebration */}
      <ParticleExplosion 
        active={showParticles} 
        count={30} 
        colors={['#8B5CF6', '#A855F7', '#C084FC', '#E879F9', '#F0ABFC']}
        originX={85}
        originY={85}
      />

      {/* Header */}
      <SpringIn active={timeline.isActive('header')} className="relative z-10 px-[2%] py-[1.5%] border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[0.8em]">
            <PulseGlow active={timeline.isActive('finalGlow')} color="hsl(var(--primary))" intensity="medium">
              <div className="w-[2.5em] h-[2.5em] rounded-xl bg-violet-100 flex items-center justify-center">
                <Users className="w-[1.2em] h-[1.2em] text-violet-600" />
              </div>
            </PulseGlow>
            <div>
              <h1 className="text-[1.3em] font-bold text-slate-900 leading-tight">HR Copilot</h1>
              <p className="text-[0.75em] text-slate-500">Intelligent recruitment</p>
            </div>
          </div>
          <FadeSlide active={timeline.isActive('pipeline')} direction="left" delay={200}>
            <div className="flex items-center gap-[0.5em] px-[0.8em] py-[0.4em] rounded-full bg-violet-50 border border-violet-200">
              <div className="w-[0.5em] h-[0.5em] rounded-full bg-violet-500 animate-pulse" />
              <span className="text-[0.75em] text-violet-600 font-medium">AI Active</span>
            </div>
          </FadeSlide>
        </div>
      </SpringIn>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex gap-[1%] p-[1.5%] overflow-hidden min-h-0">
        {/* Left - Pipeline */}
        <FadeSlide active={timeline.isActive('pipeline')} direction="left" className="w-[22%] flex flex-col gap-[0.6em]">
          <div className="text-[0.7em] font-semibold text-slate-500 uppercase tracking-wider mb-[0.3em]">Pipeline</div>
          
          <StaggerGroup active={timeline.isActive('pipeline')} stagger={120} animation="spring">
            {pipelineStages.map((stage, i) => (
              <div 
                key={stage.label}
                className="relative p-[0.8em] rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[0.5em]">
                    <div className={cn("w-[0.5em] h-[0.5em] rounded-full", stage.color)} />
                    <span className="text-[0.85em] text-slate-600">{stage.label}</span>
                  </div>
                  <span className="text-[1.2em] font-bold text-slate-900">
                    <CountUp value={stage.count} active={timeline.isActive('pipeline')} delay={i * 150} duration={1200} />
                  </span>
                </div>
                <div className="mt-[0.5em] h-[0.25em] bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000", stage.color)}
                    style={{ 
                      width: timeline.isActive('pipeline') ? `${(stage.count / 24) * 100}%` : '0%',
                      transitionDelay: `${i * 100 + 300}ms`
                    }}
                  />
                </div>
              </div>
            ))}
          </StaggerGroup>
        </FadeSlide>

        {/* Center - Main feature area */}
        <div className="flex-1 flex flex-col gap-[0.8em] min-w-0">
          {/* CV Analysis Section */}
          <SpringIn active={timeline.isActive('cvSection')} className="flex-1 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden min-h-0 flex flex-col">
            <div className="p-[0.8em] border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-[0.5em]">
                <Brain className="w-[1em] h-[1em] text-violet-600" />
                <span className="text-[0.9em] font-semibold text-slate-800">AI CV Analysis</span>
              </div>
              <FadeSlide active={timeline.isActive('scanEffect')} direction="right">
                <div className="flex items-center gap-[0.5em]">
                  <Sparkles className="w-[1em] h-[1em] text-violet-500 animate-pulse" />
                  <span className="text-[0.75em] text-violet-600">Analysis in progress...</span>
                </div>
              </FadeSlide>
            </div>
            
            <div className="flex-1 p-[1em] flex gap-[1em] min-h-0 overflow-hidden">
              {/* CV Upload */}
              <ScalePop active={timeline.isActive('cvUpload')} className="w-[18%]">
                <div className={cn(
                  "h-full flex flex-col items-center justify-center gap-[0.5em] p-[0.8em] rounded-xl border-2 border-dashed transition-all duration-500",
                  timeline.isActive('scanEffect') ? "border-violet-300 bg-violet-50" : "border-slate-200"
                )}>
                  <Upload className={cn(
                    "w-[2em] h-[2em] transition-colors duration-500",
                    timeline.isActive('scanEffect') ? "text-violet-500" : "text-slate-400"
                  )} />
                  <span className="text-[0.7em] text-center text-slate-500">
                    {timeline.isActive('scanEffect') ? "12 CVs imported" : "Import CV"}
                  </span>
                </div>
              </ScalePop>

              {/* Candidates with scan effect */}
              <ScanLine active={timeline.isActive('scanEffect')} direction="vertical" color="hsl(262, 83%, 58%)" className="flex-1">
                <div className="flex flex-col gap-[0.5em]">
                  {candidates.map((candidate, i) => (
                    <FadeSlide 
                      key={candidate.name}
                      active={timeline.isStaggerItemActive('candidates', i)}
                      direction="up"
                      delay={i * 150}
                      className={cn(
                        "p-[0.6em] rounded-xl border transition-all duration-300",
                        timeline.isActive('matchScores') && i === 0 
                          ? "bg-violet-50 border-violet-200 shadow-sm" 
                          : "bg-white border-slate-100"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[0.6em]">
                          <div className="w-[1.8em] h-[1.8em] rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium text-[0.7em]">
                            {candidate.name[0]}
                          </div>
                          <div>
                            <div className="text-[0.85em] font-medium text-slate-800">{candidate.name}</div>
                            <div className="text-[0.7em] text-slate-500">{candidate.role}</div>
                          </div>
                        </div>
                        <ScalePop active={timeline.isActive('matchScores')} delay={i * 100 + 200}>
                          <div className="flex items-center gap-[0.3em]">
                            <Star className="w-[1em] h-[1em] text-amber-400 fill-amber-400" />
                            <span className="text-slate-900 font-bold text-[0.9em]">
                              <CountUp value={candidate.score} active={timeline.isActive('matchScores')} delay={i * 100} suffix="%" />
                            </span>
                          </div>
                        </ScalePop>
                      </div>
                      <div className="mt-[0.4em] flex gap-[0.3em]">
                        {candidate.skills.map(skill => (
                          <span key={skill} className="px-[0.5em] py-[0.15em] rounded-full bg-slate-100 text-[0.65em] text-slate-600">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </FadeSlide>
                  ))}
                </div>
              </ScanLine>
            </div>
          </SpringIn>

          {/* Bottom row */}
          <div className="flex gap-[0.8em] h-[28%] min-h-0">
            {/* Email automation */}
            <FadeSlide active={timeline.isActive('emails')} direction="up" className="flex-1 rounded-xl bg-slate-50 border border-slate-100 p-[0.8em] flex flex-col">
              <div className="flex items-center gap-[0.5em] mb-[0.6em]">
                <Mail className="w-[1em] h-[1em] text-blue-500" />
                <span className="text-[0.9em] font-semibold text-slate-800">Automated emails</span>
              </div>
              <StaggerGroup active={timeline.isActive('emails')} stagger={80} className="flex-1 flex gap-[0.5em]">
                {[
                  { icon: Send, label: 'Invitations', color: 'text-blue-500' },
                  { icon: Clock, label: 'Reminders', color: 'text-amber-500' },
                  { icon: CheckCircle, label: 'Confirmations', color: 'text-emerald-500' },
                ].map((email) => (
                  <div 
                    key={email.label}
                    className="flex-1 p-[0.5em] rounded-lg bg-white border border-slate-100 flex flex-col items-center justify-center"
                  >
                    <email.icon className={cn("w-[1.2em] h-[1.2em] mb-[0.3em]", email.color)} />
                    <div className="text-[0.65em] text-slate-500">{email.label}</div>
                  </div>
                ))}
              </StaggerGroup>
            </FadeSlide>

            {/* Job post generator */}
            <SpringIn active={timeline.isActive('jobGen')} className="w-[28%] rounded-xl bg-slate-50 border border-slate-100 p-[0.8em] flex flex-col">
              <div className="flex items-center gap-[0.5em] mb-[0.5em]">
                <Briefcase className="w-[1em] h-[1em] text-violet-600" />
                <span className="text-[0.9em] font-semibold text-slate-800">Job Post Generator</span>
              </div>
              <div className="flex-1 p-[0.5em] rounded-lg bg-violet-50 border border-violet-100 flex flex-col justify-center">
                <div className="flex items-center gap-[0.3em] mb-[0.3em]">
                  <Sparkles className="w-[0.8em] h-[0.8em] text-violet-500 animate-pulse" />
                  <span className="text-[0.7em] text-violet-600 font-medium">AI Generation</span>
                </div>
                <p className="text-[0.7em] text-slate-600 line-clamp-2">
                  "We are looking for a passionate UX Designer..."
                </p>
              </div>
            </SpringIn>
          </div>
        </div>

        {/* Right - Interviews & Stats */}
        <FadeSlide active={timeline.isActive('interviews')} direction="right" className="w-[22%] flex flex-col gap-[0.8em]">
          {/* Interviews */}
          <div className="flex-1 rounded-xl bg-slate-50 border border-slate-100 p-[0.8em] flex flex-col min-h-0">
            <div className="flex items-center gap-[0.5em] mb-[0.6em]">
              <Calendar className="w-[1em] h-[1em] text-purple-500" />
              <span className="text-[0.9em] font-semibold text-slate-800">Interviews</span>
            </div>
            <StaggerGroup active={timeline.isActive('interviews')} stagger={100} animation="slide" className="flex-1 flex flex-col gap-[0.4em] overflow-hidden">
              {interviews.map((interview) => (
                <div 
                  key={interview.time}
                  className={cn(
                    "p-[0.5em] rounded-lg border transition-all",
                    interview.live 
                      ? "bg-emerald-50 border-emerald-200" 
                      : "bg-white border-slate-100"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[0.75em] font-semibold text-slate-800">{interview.time}</span>
                    {interview.live && (
                      <span className="px-[0.4em] py-[0.15em] rounded text-[0.55em] bg-emerald-500 text-white animate-pulse font-medium">
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[0.7em] text-slate-600">{interview.name}</div>
                  <div className="text-[0.6em] text-slate-400">{interview.type}</div>
                </div>
              ))}
            </StaggerGroup>
          </div>

          {/* Stats */}
          <PulseGlow active={timeline.isActive('finalGlow')} color="hsl(262, 83%, 58%)" intensity="high">
            <SpringIn active={timeline.isActive('stats')} className={cn(
              "rounded-xl bg-slate-50 border border-slate-100 p-[0.8em] transition-all duration-500",
              timeline.isActive('finalGlow') && "border-violet-200 bg-violet-50/50"
            )}>
              <div className="flex items-center gap-[0.5em] mb-[0.6em]">
                <BarChart3 className="w-[1em] h-[1em] text-emerald-500" />
                <span className="text-[0.9em] font-semibold text-slate-800">Performance</span>
              </div>
              <div className="space-y-[0.4em]">
                {[
                  { label: 'Match rate', value: 94, suffix: '%' },
                  { label: 'Avg. time', value: 8, suffix: 'd' },
                  { label: 'Automation', value: 87, suffix: '%' },
                ].map((stat, i) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-[0.7em] text-slate-500">{stat.label}</span>
                    <span className={cn(
                      "text-[0.85em] font-bold transition-colors duration-500",
                      timeline.isActive('finalGlow') ? "text-violet-600" : "text-slate-800"
                    )}>
                      <CountUp value={stat.value} active={timeline.isActive('stats')} delay={i * 100} suffix={stat.suffix} />
                    </span>
                  </div>
                ))}
              </div>
            </SpringIn>
          </PulseGlow>
        </FadeSlide>
      </div>
    </div>
  );
}
