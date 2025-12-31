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
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--agent-hr)) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className={cn(
          "absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-[120px] transition-all duration-1000",
          phase1 ? "bg-agent-hr/20 opacity-100" : "opacity-0"
        )} />
        <div className={cn(
          "absolute bottom-1/4 -right-20 w-80 h-80 rounded-full blur-[100px] transition-all duration-1000 delay-500",
          phase3 ? "bg-purple-500/15 opacity-100" : "opacity-0"
        )} />
      </div>

      {/* Header */}
      <div className={cn(
        "relative z-10 px-6 py-4 flex items-center justify-between border-b border-white/5 transition-all duration-700",
        phase1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-agent-hr/20 flex items-center justify-center border border-agent-hr/30">
            <Users className="w-5 h-5 text-agent-hr" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Agent RH</h1>
            <p className="text-xs text-white/40">Recrutement intelligent</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full bg-agent-hr/10 border border-agent-hr/20 transition-all duration-500",
          phase2 ? "opacity-100" : "opacity-0"
        )}>
          <div className="w-2 h-2 rounded-full bg-agent-hr animate-pulse" />
          <span className="text-xs text-agent-hr">IA Active</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left - Pipeline */}
        <div className={cn(
          "w-56 flex flex-col gap-3 transition-all duration-700",
          phase1 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
        )}>
          <div className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1">Pipeline</div>
          
          {[
            { label: 'Nouveaux', count: 24, color: 'bg-blue-500', delay: 0 },
            { label: 'CV analysés', count: 18, color: 'bg-agent-hr', delay: 100 },
            { label: 'Entretiens', count: 8, color: 'bg-purple-500', delay: 200 },
            { label: 'Offres', count: 3, color: 'bg-green-500', delay: 300 },
          ].map((stage, i) => (
            <div 
              key={stage.label}
              className={cn(
                "relative p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] transition-all duration-500",
                phase2 && "hover:bg-white/[0.06]"
              )}
              style={{ 
                transitionDelay: `${stage.delay}ms`,
                opacity: phase2 ? 1 : 0.3,
                transform: phase2 ? 'translateX(0)' : 'translateX(-10px)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                  <span className="text-sm text-white/70">{stage.label}</span>
                </div>
                <span className={cn(
                  "text-lg font-bold text-white transition-all duration-700",
                  phase2 ? "opacity-100" : "opacity-0"
                )}>
                  {stage.count}
                </span>
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
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
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* CV Analysis Section */}
          <div className={cn(
            "flex-1 rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden transition-all duration-700",
            phase3 ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}>
            <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-agent-hr" />
                <span className="text-sm font-medium text-white">Analyse IA des CV</span>
              </div>
              <div className={cn(
                "flex items-center gap-2 transition-all duration-500",
                phase4 ? "opacity-100" : "opacity-0"
              )}>
                <Sparkles className="w-4 h-4 text-agent-hr animate-pulse" />
                <span className="text-xs text-agent-hr">Analyse en cours...</span>
              </div>
            </div>
            
            <div className="p-4 flex gap-4">
              {/* CV Upload simulation */}
              <div className={cn(
                "w-32 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-all duration-700",
                phase3 ? "border-agent-hr/30 bg-agent-hr/5" : "border-white/10"
              )}>
                <Upload className={cn(
                  "w-8 h-8 transition-all duration-500",
                  phase3 ? "text-agent-hr" : "text-white/30"
                )} />
                <span className="text-xs text-center text-white/50">
                  {phase3 ? "12 CV importés" : "Importer CV"}
                </span>
              </div>

              {/* Analyzed candidates */}
              <div className="flex-1 space-y-2">
                {[
                  { name: 'Sophie Martin', role: 'UX Designer', score: 94, skills: ['Figma', 'Research'] },
                  { name: 'Lucas Bernard', role: 'Dev Frontend', score: 88, skills: ['React', 'TypeScript'] },
                  { name: 'Emma Dubois', role: 'Product Manager', score: 91, skills: ['Agile', 'Data'] },
                ].map((candidate, i) => (
                  <div 
                    key={candidate.name}
                    className={cn(
                      "p-3 rounded-xl border transition-all duration-500",
                      phase5 && i === 0 ? "bg-agent-hr/10 border-agent-hr/30 ring-1 ring-agent-hr/20" : "bg-white/[0.02] border-white/[0.06]"
                    )}
                    style={{ 
                      transitionDelay: `${i * 150}ms`,
                      opacity: phase4 ? 1 : 0,
                      transform: phase4 ? 'translateY(0)' : 'translateY(10px)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-agent-hr to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                          {candidate.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{candidate.name}</div>
                          <div className="text-xs text-white/40">{candidate.role}</div>
                        </div>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 transition-all duration-700",
                        phase5 ? "opacity-100 scale-100" : "opacity-0 scale-75"
                      )} style={{ transitionDelay: `${i * 100 + 300}ms` }}>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-white font-bold">{candidate.score}%</span>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-1">
                      {candidate.skills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-white/50">
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
          <div className="flex gap-3 h-36">
            {/* Email automation */}
            <div className={cn(
              "flex-1 rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 transition-all duration-700",
              phase7 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Emails automatiques</span>
              </div>
              <div className="flex gap-2">
                {[
                  { icon: Send, label: 'Invitations', color: 'text-blue-400' },
                  { icon: Clock, label: 'Rappels', color: 'text-amber-400' },
                  { icon: CheckCircle, label: 'Confirmations', color: 'text-green-400' },
                ].map((email, i) => (
                  <div 
                    key={email.label}
                    className="flex-1 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center transition-all duration-500"
                    style={{ 
                      transitionDelay: `${i * 100}ms`,
                      opacity: phase7 ? 1 : 0
                    }}
                  >
                    <email.icon className={cn("w-5 h-5 mx-auto mb-1", email.color)} />
                    <div className="text-xs text-white/50">{email.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job post generator */}
            <div className={cn(
              "w-52 rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 transition-all duration-700",
              phase8 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-agent-hr" />
                <span className="text-sm font-medium text-white">Générateur d'offres</span>
              </div>
              <div className={cn(
                "p-2 rounded-lg bg-agent-hr/10 border border-agent-hr/20 transition-all duration-500",
                phase8 ? "opacity-100" : "opacity-0"
              )}>
                <div className="flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3 text-agent-hr animate-pulse" />
                  <span className="text-xs text-agent-hr">Génération IA</span>
                </div>
                <p className="text-xs text-white/60 line-clamp-2">
                  "Nous recherchons un UX Designer passionné..."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Interviews & Stats */}
        <div className={cn(
          "w-52 flex flex-col gap-3 transition-all duration-700",
          phase6 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        )}>
          {/* Interviews */}
          <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/[0.06] p-3">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white">Entretiens</span>
            </div>
            <div className="space-y-2">
              {[
                { time: '09:00', name: 'Sophie M.', type: 'Technique', live: true },
                { time: '11:30', name: 'Lucas B.', type: 'RH', live: false },
                { time: '14:00', name: 'Emma D.', type: 'Final', live: false },
              ].map((interview, i) => (
                <div 
                  key={i}
                  className={cn(
                    "p-2 rounded-lg border transition-all duration-500",
                    interview.live ? "bg-green-500/10 border-green-500/30" : "bg-white/[0.02] border-white/[0.06]"
                  )}
                  style={{ 
                    transitionDelay: `${i * 100}ms`,
                    opacity: phase6 ? 1 : 0
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white">{interview.time}</span>
                    {interview.live && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-500 text-white animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-white/60">{interview.name}</div>
                  <div className="text-[10px] text-white/40">{interview.type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className={cn(
            "rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 transition-all duration-700",
            phase9 ? "ring-1 ring-agent-hr/20" : ""
          )}>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">Performance</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Taux match', value: '94%' },
                { label: 'Délai moyen', value: '8j' },
                { label: 'Automatisation', value: '87%' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-xs text-white/50">{stat.label}</span>
                  <span className={cn(
                    "text-sm font-bold text-white transition-all duration-500",
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
