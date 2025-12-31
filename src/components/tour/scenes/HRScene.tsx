import React from 'react';
import { Users, FileText, Calendar, Mail, Sparkles, BarChart3, UserPlus, CheckCircle, Star, Clock, MessageSquare, Briefcase, Brain, Search, Upload, Send, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HRSceneProps {
  isActive: boolean;
  progress: number;
}

export function HRScene({ isActive, progress }: HRSceneProps) {
  // Progressive reveals - smoother timing
  const phase1 = progress >= 0;    // Header + Pipeline skeleton
  const phase2 = progress >= 10;   // Pipeline fills in
  const phase3 = progress >= 20;   // CV upload animation
  const phase4 = progress >= 32;   // AI analysis starts
  const phase5 = progress >= 45;   // Match scores appear
  const phase6 = progress >= 55;   // Interview panel
  const phase7 = progress >= 68;   // Email automation
  const phase8 = progress >= 80;   // Job generator
  const phase9 = progress >= 90;   // Final stats glow

  return (
    <div 
      className="absolute inset-0 flex flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      style={{ fontSize: 'clamp(8px, 1.2vw, 14px)' }}
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--agent-hr)) 1px, transparent 0)`,
            backgroundSize: '2em 2em',
          }}
        />
        <div className={cn(
          "absolute top-1/4 -left-[5%] w-[35%] aspect-square rounded-full blur-[80px] transition-all duration-1000",
          phase1 ? "bg-agent-hr/20 opacity-100" : "opacity-0"
        )} />
        <div className={cn(
          "absolute bottom-1/4 -right-[5%] w-[30%] aspect-square rounded-full blur-[70px] transition-all duration-1000 delay-500",
          phase3 ? "bg-purple-500/15 opacity-100" : "opacity-0"
        )} />
      </div>

      {/* Header */}
      <div className={cn(
        "relative z-10 px-[2%] py-[1.5%] flex items-center justify-between border-b border-white/5 transition-all duration-700",
        phase1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}>
        <div className="flex items-center gap-[0.8em]">
          <div className="w-[2.5em] h-[2.5em] rounded-xl bg-agent-hr/20 flex items-center justify-center border border-agent-hr/30">
            <Users className="w-[1.2em] h-[1.2em] text-agent-hr" />
          </div>
          <div>
            <h1 className="text-[1.3em] font-bold text-white leading-tight">Agent RH</h1>
            <p className="text-[0.75em] text-white/40">Recrutement intelligent</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-[0.5em] px-[0.8em] py-[0.4em] rounded-full bg-agent-hr/10 border border-agent-hr/20 transition-all duration-500",
          phase2 ? "opacity-100" : "opacity-0"
        )}>
          <div className="w-[0.5em] h-[0.5em] rounded-full bg-agent-hr animate-pulse" />
          <span className="text-[0.75em] text-agent-hr">IA Active</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex gap-[1%] p-[1.5%] overflow-hidden min-h-0">
        {/* Left - Pipeline */}
        <div className={cn(
          "w-[22%] flex flex-col gap-[0.6em] transition-all duration-700",
          phase1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
        )}>
          <div className="text-[0.7em] font-medium text-white/60 uppercase tracking-wider mb-[0.3em]">Pipeline</div>
          
          {[
            { label: 'Nouveaux', count: 24, color: 'bg-blue-500', delay: 0 },
            { label: 'CV analysés', count: 18, color: 'bg-agent-hr', delay: 100 },
            { label: 'Entretiens', count: 8, color: 'bg-purple-500', delay: 200 },
            { label: 'Offres', count: 3, color: 'bg-green-500', delay: 300 },
          ].map((stage, i) => (
            <div 
              key={stage.label}
              className={cn(
                "relative p-[0.8em] rounded-xl bg-white/[0.03] border border-white/[0.06] transition-all duration-500",
                phase2 && "hover:bg-white/[0.06]"
              )}
              style={{ 
                transitionDelay: `${stage.delay}ms`,
                opacity: phase2 ? 1 : 0.3,
                transform: phase2 ? 'translateX(0)' : 'translateX(-10px)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[0.5em]">
                  <div className={cn("w-[0.5em] h-[0.5em] rounded-full", stage.color)} />
                  <span className="text-[0.85em] text-white/70">{stage.label}</span>
                </div>
                <span className={cn(
                  "text-[1.2em] font-bold text-white transition-all duration-700",
                  phase2 ? "opacity-100" : "opacity-0"
                )}>
                  {stage.count}
                </span>
              </div>
              {/* Progress bar */}
              <div className="mt-[0.5em] h-[0.25em] bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-1000", stage.color)}
                  style={{ 
                    width: phase2 ? `${(stage.count / 24) * 100}%` : '0%',
                    transitionDelay: `${stage.delay + 200}ms`
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Center - Main feature area */}
        <div className="flex-1 flex flex-col gap-[0.8em] min-w-0">
          {/* CV Analysis Section */}
          <div className={cn(
            "flex-1 rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden transition-all duration-700 min-h-0 flex flex-col",
            phase3 ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}>
            <div className="p-[0.8em] border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-[0.5em]">
                <Brain className="w-[1em] h-[1em] text-agent-hr" />
                <span className="text-[0.9em] font-medium text-white">Analyse IA des CV</span>
              </div>
              <div className={cn(
                "flex items-center gap-[0.5em] transition-all duration-500",
                phase4 ? "opacity-100" : "opacity-0"
              )}>
                <Sparkles className="w-[1em] h-[1em] text-agent-hr animate-pulse" />
                <span className="text-[0.75em] text-agent-hr">Analyse en cours...</span>
              </div>
            </div>
            
            <div className="flex-1 p-[1em] flex gap-[1em] min-h-0 overflow-hidden">
              {/* CV Upload simulation */}
              <div className={cn(
                "w-[18%] flex flex-col items-center justify-center gap-[0.5em] p-[0.8em] rounded-xl border-2 border-dashed transition-all duration-700",
                phase3 ? "border-agent-hr/30 bg-agent-hr/5" : "border-white/10"
              )}>
                <Upload className={cn(
                  "w-[2em] h-[2em] transition-all duration-500",
                  phase3 ? "text-agent-hr" : "text-white/30"
                )} />
                <span className="text-[0.7em] text-center text-white/50">
                  {phase3 ? "12 CV importés" : "Importer CV"}
                </span>
              </div>

              {/* Analyzed candidates */}
              <div className="flex-1 flex flex-col gap-[0.5em] overflow-hidden">
                {[
                  { name: 'Sophie Martin', role: 'UX Designer', score: 94, skills: ['Figma', 'Research'] },
                  { name: 'Lucas Bernard', role: 'Dev Frontend', score: 88, skills: ['React', 'TypeScript'] },
                  { name: 'Emma Dubois', role: 'Product Manager', score: 91, skills: ['Agile', 'Data'] },
                ].map((candidate, i) => (
                  <div 
                    key={candidate.name}
                    className={cn(
                      "p-[0.6em] rounded-xl border transition-all duration-500",
                      phase5 && i === 0 ? "bg-agent-hr/10 border-agent-hr/30 ring-1 ring-agent-hr/20" : "bg-white/[0.02] border-white/[0.06]"
                    )}
                    style={{ 
                      transitionDelay: `${i * 150}ms`,
                      opacity: phase4 ? 1 : 0,
                      transform: phase4 ? 'translateY(0)' : 'translateY(10px)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[0.6em]">
                        <div className="w-[1.8em] h-[1.8em] rounded-full bg-gradient-to-br from-agent-hr to-purple-500 flex items-center justify-center text-white font-medium text-[0.7em]">
                          {candidate.name[0]}
                        </div>
                        <div>
                          <div className="text-[0.85em] font-medium text-white">{candidate.name}</div>
                          <div className="text-[0.7em] text-white/40">{candidate.role}</div>
                        </div>
                      </div>
                      <div className={cn(
                        "flex items-center gap-[0.3em] transition-all duration-700",
                        phase5 ? "opacity-100 scale-100" : "opacity-0 scale-75"
                      )} style={{ transitionDelay: `${i * 100 + 300}ms` }}>
                        <Star className="w-[1em] h-[1em] text-amber-400 fill-amber-400" />
                        <span className="text-white font-bold text-[0.9em]">{candidate.score}%</span>
                      </div>
                    </div>
                    <div className="mt-[0.4em] flex gap-[0.3em]">
                      {candidate.skills.map(skill => (
                        <span key={skill} className="px-[0.5em] py-[0.15em] rounded-full bg-white/5 text-[0.65em] text-white/50">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex gap-[0.8em] h-[28%] min-h-0">
            {/* Email automation */}
            <div className={cn(
              "flex-1 rounded-xl bg-white/[0.02] border border-white/[0.06] p-[0.8em] transition-all duration-700 flex flex-col",
              phase7 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <div className="flex items-center gap-[0.5em] mb-[0.6em]">
                <Mail className="w-[1em] h-[1em] text-blue-400" />
                <span className="text-[0.9em] font-medium text-white">Emails automatiques</span>
              </div>
              <div className="flex-1 flex gap-[0.5em]">
                {[
                  { icon: Send, label: 'Invitations', color: 'text-blue-400' },
                  { icon: Clock, label: 'Rappels', color: 'text-amber-400' },
                  { icon: CheckCircle, label: 'Confirmations', color: 'text-green-400' },
                ].map((email, i) => (
                  <div 
                    key={email.label}
                    className="flex-1 p-[0.5em] rounded-lg bg-white/[0.03] border border-white/[0.06] flex flex-col items-center justify-center transition-all duration-500"
                    style={{ 
                      transitionDelay: `${i * 100}ms`,
                      opacity: phase7 ? 1 : 0
                    }}
                  >
                    <email.icon className={cn("w-[1.2em] h-[1.2em] mb-[0.3em]", email.color)} />
                    <div className="text-[0.65em] text-white/50">{email.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job post generator */}
            <div className={cn(
              "w-[28%] rounded-xl bg-white/[0.02] border border-white/[0.06] p-[0.8em] transition-all duration-700 flex flex-col",
              phase8 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            )}>
              <div className="flex items-center gap-[0.5em] mb-[0.5em]">
                <Briefcase className="w-[1em] h-[1em] text-agent-hr" />
                <span className="text-[0.9em] font-medium text-white">Générateur d'offres</span>
              </div>
              <div className={cn(
                "flex-1 p-[0.5em] rounded-lg bg-agent-hr/10 border border-agent-hr/20 transition-all duration-500 flex flex-col justify-center",
                phase8 ? "opacity-100" : "opacity-0"
              )}>
                <div className="flex items-center gap-[0.3em] mb-[0.3em]">
                  <Sparkles className="w-[0.8em] h-[0.8em] text-agent-hr animate-pulse" />
                  <span className="text-[0.7em] text-agent-hr">Génération IA</span>
                </div>
                <p className="text-[0.7em] text-white/60 line-clamp-2">
                  "Nous recherchons un UX Designer passionné..."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Interviews & Stats */}
        <div className={cn(
          "w-[22%] flex flex-col gap-[0.8em] transition-all duration-700",
          phase6 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        )}>
          {/* Interviews */}
          <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/[0.06] p-[0.8em] flex flex-col min-h-0">
            <div className="flex items-center gap-[0.5em] mb-[0.6em]">
              <Calendar className="w-[1em] h-[1em] text-purple-400" />
              <span className="text-[0.9em] font-medium text-white">Entretiens</span>
            </div>
            <div className="flex-1 flex flex-col gap-[0.4em] overflow-hidden">
              {[
                { time: '09:00', name: 'Sophie M.', type: 'Technique', live: true },
                { time: '11:30', name: 'Lucas B.', type: 'RH', live: false },
                { time: '14:00', name: 'Emma D.', type: 'Final', live: false },
              ].map((interview, i) => (
                <div 
                  key={i}
                  className={cn(
                    "p-[0.5em] rounded-lg border transition-all duration-500",
                    interview.live ? "bg-green-500/10 border-green-500/30" : "bg-white/[0.02] border-white/[0.06]"
                  )}
                  style={{ 
                    transitionDelay: `${i * 100}ms`,
                    opacity: phase6 ? 1 : 0
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[0.75em] font-medium text-white">{interview.time}</span>
                    {interview.live && (
                      <span className="px-[0.4em] py-[0.15em] rounded text-[0.55em] bg-green-500 text-white animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[0.7em] text-white/60">{interview.name}</div>
                  <div className="text-[0.6em] text-white/40">{interview.type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className={cn(
            "rounded-xl bg-white/[0.02] border border-white/[0.06] p-[0.8em] transition-all duration-700",
            phase9 ? "ring-1 ring-agent-hr/20" : ""
          )}>
            <div className="flex items-center gap-[0.5em] mb-[0.6em]">
              <BarChart3 className="w-[1em] h-[1em] text-green-400" />
              <span className="text-[0.9em] font-medium text-white">Performance</span>
            </div>
            <div className="space-y-[0.4em]">
              {[
                { label: 'Taux match', value: '94%' },
                { label: 'Délai moyen', value: '8j' },
                { label: 'Automatisation', value: '87%' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-[0.7em] text-white/50">{stat.label}</span>
                  <span className={cn(
                    "text-[0.85em] font-bold text-white transition-all duration-500",
                    phase9 ? "text-agent-hr" : ""
                  )}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
