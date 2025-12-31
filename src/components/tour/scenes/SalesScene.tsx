import React from 'react';
import { TrendingUp, Phone, FileText, DollarSign, BarChart3, Sparkles, CheckCircle, Target, Users, ArrowUpRight, Mic, FileSignature, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalesSceneProps {
  isActive: boolean;
  progress: number;
}

export function SalesScene({ isActive, progress }: SalesSceneProps) {
  const showPipeline = progress >= 0;
  const showDeals = progress >= 8;
  const showRecording = progress >= 20;
  const showTranscript = progress >= 35;
  const showAnalysis = progress >= 50;
  const showProposal = progress >= 65;
  const showCompliance = progress >= 80;
  const showFinal = progress >= 92;

  const deals = [
    { name: 'TechCorp', value: '120K€', stage: 'Négociation', prob: 85, hot: true },
    { name: 'DataFlow', value: '85K€', stage: 'Proposition', prob: 70 },
    { name: 'CloudFirst', value: '200K€', stage: 'Découverte', prob: 45 },
    { name: 'AI Labs', value: '65K€', stage: 'Closing', prob: 95 },
  ];

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated grid */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--agent-sales)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--agent-sales)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glows */}
      <div className="absolute top-10 right-20 w-96 h-96 rounded-full bg-agent-sales/15 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="absolute inset-4 flex gap-4">
        {/* Left - Pipeline */}
        <div 
          className={cn(
            "w-72 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 transition-all duration-700",
            showPipeline ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-agent-sales/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-agent-sales" />
            </div>
            <div>
              <h2 className="font-bold text-white">Agent Ventes</h2>
              <p className="text-xs text-white/50">Pipeline intelligent</p>
            </div>
          </div>

          {/* Pipeline value */}
          <div 
            className={cn(
              "p-4 rounded-xl bg-gradient-to-br from-agent-sales/30 to-agent-sales/10 border border-agent-sales/30 mb-4 transition-all duration-700",
              showDeals ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="text-3xl font-bold text-white mb-1">470K€</div>
            <div className="flex items-center gap-2 text-agent-sales text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>+23% ce mois</span>
            </div>
          </div>

          {/* Deals */}
          <div className="space-y-2">
            {deals.map((deal, i) => (
              <div 
                key={deal.name}
                className={cn(
                  "p-3 rounded-xl border transition-all duration-500",
                  deal.hot ? "bg-agent-sales/20 border-agent-sales/40" : "bg-white/5 border-white/10"
                )}
                style={{ 
                  transitionDelay: `${i * 100}ms`,
                  opacity: showDeals ? 1 : 0,
                  transform: showDeals ? 'translateX(0)' : 'translateX(-20px)'
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium text-sm">{deal.name}</span>
                  <span className="text-agent-sales font-bold text-sm">{deal.value}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">{deal.stage}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-agent-sales rounded-full"
                        style={{ width: `${deal.prob}%` }}
                      />
                    </div>
                    <span className="text-white/70 text-xs">{deal.prob}%</span>
                  </div>
                </div>
                {deal.hot && (
                  <div className="mt-2 flex items-center gap-1 text-amber-400 text-xs">
                    <Target className="w-3 h-3" />
                    <span>Closing imminent</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center - Features */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Call Recording & Transcript */}
          <div className="flex-1 flex gap-4">
            {/* Recording */}
            <div 
              className={cn(
                "flex-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 transition-all duration-700",
                showRecording ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}
            >
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-red-400" />
                <span className="text-white font-semibold">Enregistrement d'appels</span>
              </div>

              {/* Waveform visualization */}
              <div 
                className={cn(
                  "p-4 rounded-xl bg-red-500/10 border border-red-500/30 mb-4 transition-all duration-700",
                  showRecording && progress > 25 ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 font-medium text-sm">Appel TechCorp - 04:32</span>
                </div>
                <div className="flex items-end gap-0.5 h-12">
                  {[...Array(40)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-red-500/60 rounded-sm"
                      style={{ 
                        height: `${20 + Math.sin(i * 0.3) * 30 + Math.random() * 30}%`,
                        animation: showRecording ? `waveform 0.5s ease-in-out infinite alternate ${i * 30}ms` : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Transcript */}
              <div 
                className={cn(
                  "space-y-2 transition-all duration-700",
                  showTranscript ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Mic className="w-4 h-4 text-white/50" />
                  <span className="text-white/50 text-xs">Transcription en temps réel</span>
                </div>
                {[
                  { speaker: 'Vous', text: '"Je comprends vos besoins en matière de..."' },
                  { speaker: 'Client', text: '"Nous cherchons une solution qui puisse..."' },
                  { speaker: 'Vous', text: '"Parfait, notre plateforme offre exactement..."' },
                ].map((line, i) => (
                  <div 
                    key={i}
                    className="p-2 rounded-lg bg-white/5"
                    style={{ 
                      transitionDelay: `${i * 200}ms`,
                      opacity: showTranscript ? 1 : 0
                    }}
                  >
                    <span className={cn(
                      "text-xs font-medium",
                      line.speaker === 'Vous' ? "text-agent-sales" : "text-blue-400"
                    )}>
                      {line.speaker}:
                    </span>
                    <span className="text-white/70 text-xs ml-2">{line.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Analysis */}
            <div 
              className={cn(
                "w-80 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 transition-all duration-700",
                showAnalysis ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              )}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-agent-sales" />
                <span className="text-white font-semibold">Analyse IA</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: 'Score appel', value: '92%', color: 'text-agent-sales' },
                  { label: 'Sentiment', value: 'Positif', color: 'text-green-400' },
                  { label: 'Objections', value: '2', color: 'text-amber-400' },
                  { label: 'Intérêt', value: 'Élevé', color: 'text-blue-400' },
                ].map((metric, i) => (
                  <div 
                    key={metric.label}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 transition-all duration-500"
                    style={{ 
                      transitionDelay: `${i * 100 + 300}ms`,
                      opacity: showAnalysis ? 1 : 0
                    }}
                  >
                    <div className={cn("text-xl font-bold", metric.color)}>{metric.value}</div>
                    <div className="text-white/50 text-xs">{metric.label}</div>
                  </div>
                ))}
              </div>

              {/* Insights */}
              <div 
                className={cn(
                  "p-3 rounded-xl bg-agent-sales/20 border border-agent-sales/30 transition-all duration-700",
                  showAnalysis && progress > 58 ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-agent-sales animate-pulse" />
                  <span className="text-agent-sales text-xs font-medium">Recommandations</span>
                </div>
                <ul className="text-white/70 text-xs space-y-1">
                  <li>• Proposer demo personnalisée</li>
                  <li>• Mentionner cas client similaire</li>
                  <li>• Prévoir appel de suivi J+3</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom - Proposal & Compliance */}
          <div className="h-40 flex gap-4">
            {/* Proposal Generator */}
            <div 
              className={cn(
                "flex-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 transition-all duration-700",
                showProposal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileSignature className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold">Propositions commerciales</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                  IA générative
                </span>
              </div>

              <div className="flex gap-3">
                {[
                  { name: 'TechCorp', status: 'Générée', time: 'Il y a 2h' },
                  { name: 'DataFlow', status: 'En attente', time: 'Planifiée' },
                ].map((prop, i) => (
                  <div 
                    key={prop.name}
                    className={cn(
                      "flex-1 p-3 rounded-xl border transition-all duration-500",
                      i === 0 ? "bg-purple-500/20 border-purple-500/30" : "bg-white/5 border-white/10"
                    )}
                    style={{ 
                      transitionDelay: `${i * 150}ms`,
                      opacity: showProposal ? 1 : 0
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium text-sm">{prop.name}</span>
                      {i === 0 && <CheckCircle className="w-4 h-4 text-purple-400" />}
                    </div>
                    <div className="text-white/50 text-xs">{prop.status}</div>
                    <div className="text-white/30 text-xs">{prop.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Check */}
            <div 
              className={cn(
                "w-72 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 transition-all duration-700",
                showCompliance ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-white font-semibold">Conformité</span>
              </div>

              <div 
                className={cn(
                  "p-3 rounded-xl bg-green-500/20 border border-green-500/30 transition-all duration-700",
                  showCompliance ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">100% conforme</span>
                </div>
                <div className="text-white/60 text-xs">
                  Discours vérifié • RGPD OK • Tarifs validés
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Team & Stats */}
        <div 
          className={cn(
            "w-56 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 transition-all duration-700",
            showFinal ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">Équipe</span>
          </div>

          {/* Performance bars */}
          <div className="space-y-3">
            {[
              { name: 'Marie', deals: 12, quota: 85 },
              { name: 'Thomas', deals: 9, quota: 72 },
              { name: 'Julie', deals: 15, quota: 110 },
            ].map((member, i) => (
              <div 
                key={member.name}
                className="transition-all duration-500"
                style={{ 
                  transitionDelay: `${i * 100}ms`,
                  opacity: showFinal ? 1 : 0
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/80 text-sm">{member.name}</span>
                  <span className={cn(
                    "text-xs font-medium",
                    member.quota >= 100 ? "text-green-400" : "text-white/50"
                  )}>
                    {member.quota}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      member.quota >= 100 ? "bg-green-500" : "bg-agent-sales"
                    )}
                    style={{ width: `${Math.min(member.quota, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes waveform {
          from { transform: scaleY(0.8); }
          to { transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
}
