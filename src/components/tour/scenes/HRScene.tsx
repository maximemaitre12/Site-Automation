import React from 'react';
import { Users, FileText, Calendar, Mail, Sparkles, BarChart3, UserPlus, CheckCircle, Star, Clock, MessageSquare, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HRSceneProps {
  isActive: boolean;
  progress: number;
}

export function HRScene({ isActive, progress }: HRSceneProps) {
  // Feature highlights based on progress
  const showPipeline = progress >= 0;
  const showCandidates = progress >= 8;
  const showAIScore = progress >= 18;
  const showInterview = progress >= 30;
  const showEmail = progress >= 45;
  const showJobPost = progress >= 60;
  const showAnalytics = progress >= 75;
  const showFinal = progress >= 90;

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated background grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--agent-hr)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--agent-hr)) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-agent-hr/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-agent-hr/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main container */}
      <div className="absolute inset-4 flex gap-4">
        {/* Left panel - Pipeline */}
        <div 
          className={cn(
            "w-80 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 transition-all duration-700",
            showPipeline ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          )}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-agent-hr/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-agent-hr" />
            </div>
            <div>
              <h2 className="font-bold text-white">Agent RH</h2>
              <p className="text-xs text-white/50">Pipeline de recrutement</p>
            </div>
          </div>

          {/* Pipeline stages */}
          <div className="space-y-3">
            {[
              { label: 'Nouveaux', count: 24, color: 'bg-blue-500' },
              { label: 'En revue', count: 12, color: 'bg-amber-500' },
              { label: 'Entretien', count: 8, color: 'bg-purple-500' },
              { label: 'Offre', count: 3, color: 'bg-green-500' },
            ].map((stage, i) => (
              <div 
                key={stage.label}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 transition-all duration-500",
                  showCandidates && "hover:bg-white/10"
                )}
                style={{ 
                  transitionDelay: `${i * 100}ms`,
                  opacity: showCandidates ? 1 : 0,
                  transform: showCandidates ? 'translateX(0)' : 'translateX(-20px)'
                }}
              >
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", stage.color)} />
                  <span className="text-white/80 text-sm">{stage.label}</span>
                </div>
                <span className="text-white font-bold">{stage.count}</span>
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div 
            className={cn(
              "mt-6 grid grid-cols-2 gap-2 transition-all duration-700",
              showAnalytics ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">87%</div>
              <div className="text-xs text-green-400/70">Taux embauche</div>
            </div>
            <div className="p-3 rounded-xl bg-agent-hr/20 border border-agent-hr/30">
              <div className="text-2xl font-bold text-agent-hr">12j</div>
              <div className="text-xs text-agent-hr/70">Délai moyen</div>
            </div>
          </div>
        </div>

        {/* Center - Main feature showcase */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Top row - AI Analysis & Interview */}
          <div className="flex-1 flex gap-4">
            {/* AI CV Analysis */}
            <div 
              className={cn(
                "flex-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 transition-all duration-700",
                showAIScore ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-agent-hr" />
                <span className="text-white font-semibold">Analyse IA des CV</span>
              </div>

              {/* Candidate cards with scores */}
              <div className="space-y-2">
                {[
                  { name: 'Sophie Martin', role: 'UX Designer', score: 94, skills: ['Figma', 'Research', 'Prototyping'] },
                  { name: 'Lucas Bernard', role: 'Dev Frontend', score: 88, skills: ['React', 'TypeScript', 'CSS'] },
                  { name: 'Emma Dubois', role: 'Product Manager', score: 92, skills: ['Agile', 'Data', 'Strategy'] },
                ].map((candidate, i) => (
                  <div 
                    key={candidate.name}
                    className={cn(
                      "p-3 rounded-xl bg-white/5 border border-white/10 transition-all duration-500",
                      showAIScore && i === 0 && "ring-2 ring-agent-hr/50 bg-agent-hr/10"
                    )}
                    style={{ 
                      transitionDelay: `${i * 150 + 200}ms`,
                      opacity: showAIScore ? 1 : 0,
                      transform: showAIScore ? 'translateY(0)' : 'translateY(10px)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-agent-hr to-agent-hr/50 flex items-center justify-center text-white font-bold text-sm">
                          {candidate.name[0]}
                        </div>
                        <div>
                          <div className="text-white text-sm font-medium">{candidate.name}</div>
                          <div className="text-white/50 text-xs">{candidate.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-white font-bold">{candidate.score}%</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {candidate.skills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Management */}
            <div 
              className={cn(
                "w-72 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 transition-all duration-700",
                showInterview ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              )}
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">Entretiens</span>
              </div>

              <div className="space-y-2">
                {[
                  { time: '09:00', name: 'Sophie M.', type: 'Technique', status: 'now' },
                  { time: '11:30', name: 'Lucas B.', type: 'RH', status: 'upcoming' },
                  { time: '14:00', name: 'Emma D.', type: 'Final', status: 'upcoming' },
                ].map((interview, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "p-3 rounded-xl border transition-all duration-500",
                      interview.status === 'now' 
                        ? "bg-green-500/20 border-green-500/30" 
                        : "bg-white/5 border-white/10"
                    )}
                    style={{ 
                      transitionDelay: `${i * 100 + 300}ms`,
                      opacity: showInterview ? 1 : 0
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-white/50" />
                        <span className="text-white font-medium text-sm">{interview.time}</span>
                      </div>
                      {interview.status === 'now' && (
                        <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-medium animate-pulse">
                          En cours
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-white/70 text-sm">{interview.name}</div>
                    <div className="text-white/40 text-xs">{interview.type}</div>
                  </div>
                ))}
              </div>

              {/* AI suggested questions */}
              <div 
                className={cn(
                  "mt-4 p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 transition-all duration-700",
                  showInterview && progress > 38 ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300 text-xs font-medium">Questions suggérées</span>
                </div>
                <p className="text-white/60 text-xs leading-relaxed">
                  "Parlez-moi d'un projet complexe que vous avez mené..."
                </p>
              </div>
            </div>
          </div>

          {/* Bottom row - Email & Job Post */}
          <div className="h-44 flex gap-4">
            {/* Automated Emails */}
            <div 
              className={cn(
                "flex-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 transition-all duration-700",
                showEmail ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-semibold">Emails automatisés</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                  12 envoyés aujourd'hui
                </span>
              </div>

              <div className="flex gap-3">
                {[
                  { type: 'Confirmation', icon: CheckCircle, color: 'text-green-400' },
                  { type: 'Rappel', icon: Clock, color: 'text-amber-400' },
                  { type: 'Feedback', icon: MessageSquare, color: 'text-purple-400' },
                ].map((email, i) => (
                  <div 
                    key={email.type}
                    className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 transition-all duration-500"
                    style={{ 
                      transitionDelay: `${i * 100 + 400}ms`,
                      opacity: showEmail ? 1 : 0
                    }}
                  >
                    <email.icon className={cn("w-5 h-5 mb-2", email.color)} />
                    <div className="text-white text-sm font-medium">{email.type}</div>
                    <div className="text-white/40 text-xs">Auto-généré</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Post Generator */}
            <div 
              className={cn(
                "w-80 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 transition-all duration-700",
                showJobPost ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-agent-hr" />
                <span className="text-white font-semibold">Génération d'offres</span>
              </div>

              <div 
                className={cn(
                  "p-3 rounded-xl bg-agent-hr/20 border border-agent-hr/30 transition-all duration-700",
                  showJobPost && progress > 68 ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-agent-hr animate-pulse" />
                  <span className="text-agent-hr text-xs font-medium">Offre générée par IA</span>
                </div>
                <p className="text-white/70 text-xs leading-relaxed line-clamp-3">
                  "Nous recherchons un(e) UX Designer passionné(e) pour rejoindre notre équipe produit. Vous travaillerez sur des projets innovants..."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Analytics */}
        <div 
          className={cn(
            "w-64 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 transition-all duration-700",
            showAnalytics ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">Analytics</span>
          </div>

          {/* Chart visualization */}
          <div className="h-32 flex items-end gap-2 mb-4">
            {[65, 78, 45, 89, 72, 95, 82].map((value, i) => (
              <div 
                key={i}
                className="flex-1 bg-gradient-to-t from-agent-hr to-agent-hr/30 rounded-t transition-all duration-700"
                style={{ 
                  height: `${value}%`,
                  transitionDelay: `${i * 80 + 500}ms`,
                  opacity: showAnalytics ? 1 : 0.3
                }}
              />
            ))}
          </div>

          <div className="space-y-3">
            {[
              { label: 'CV analysés', value: '1,234', trend: '+15%' },
              { label: 'Temps gagné', value: '89h', trend: '+23%' },
              { label: 'Satisfaction', value: '4.8/5', trend: '+0.3' },
            ].map((stat, i) => (
              <div 
                key={stat.label}
                className="flex items-center justify-between transition-all duration-500"
                style={{ 
                  transitionDelay: `${i * 100 + 700}ms`,
                  opacity: showAnalytics ? 1 : 0
                }}
              >
                <span className="text-white/60 text-sm">{stat.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{stat.value}</span>
                  <span className="text-green-400 text-xs">{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlight glow effect */}
      {showFinal && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-agent-hr/0 via-agent-hr/10 to-agent-hr/0 animate-pulse" />
        </div>
      )}
    </div>
  );
}
