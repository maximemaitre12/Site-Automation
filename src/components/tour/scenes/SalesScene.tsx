import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, Phone, FileText, DollarSign, BarChart3, Sparkles, CheckCircle, Target, Users, ArrowUpRight, Mic, FileSignature, Shield, Play, Volume2, MessageSquare, Zap, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FrameCallouts, type FrameCalloutTarget } from '@/components/tour/core/FrameCallouts';
interface SalesSceneProps {
  isActive: boolean;
  progress: number;
}

export function SalesScene({ isActive, progress }: SalesSceneProps) {
  const phase1 = progress >= 0;    // Header + pipeline skeleton
  const phase2 = progress >= 10;   // Deals appear
  const phase3 = progress >= 22;   // Call recording starts
  const phase4 = progress >= 35;   // Waveform animation
  const phase5 = progress >= 48;   // Transcript appears
  const phase6 = progress >= 60;   // AI analysis
  const phase7 = progress >= 72;   // Proposal generation
  const phase8 = progress >= 85;   // Compliance check
  const phase9 = progress >= 95;   // Final glow

  const deals = [
    { name: 'TechCorp', stage: 'Négociation', prob: 85, hot: true },
    { name: 'DataFlow', stage: 'Proposition', prob: 70, hot: false },
    { name: 'CloudFirst', stage: 'Découverte', prob: 45, hot: false },
    { name: 'AI Labs', stage: 'Closing', prob: 95, hot: true },
  ];

  type CalloutStep = 'none' | 'call' | 'analysis' | 'proposal' | 'compliance';
  const calloutStep: CalloutStep =
    progress < 22
      ? 'none'
      : progress < 60
        ? 'call'
        : progress < 72
          ? 'analysis'
          : progress < 85
            ? 'proposal'
            : 'compliance';

  const rootRef = useRef<HTMLDivElement | null>(null);
  const callRef = useRef<HTMLDivElement | null>(null);
  const analysisRef = useRef<HTMLDivElement | null>(null);
  const proposalRef = useRef<HTMLDivElement | null>(null);
  const complianceRef = useRef<HTMLDivElement | null>(null);

  const [callout, setCallout] = useState<FrameCalloutTarget | null>(null);

  useEffect(() => {
    if (calloutStep === 'none' || !isActive) {
      setCallout(null);
      return;
    }

    const container = rootRef.current;
    const el =
      calloutStep === 'call'
        ? callRef.current
        : calloutStep === 'analysis'
          ? analysisRef.current
          : calloutStep === 'proposal'
            ? proposalRef.current
            : complianceRef.current;

    if (!container || !el) return;

    const c = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (!c.width || !c.height) return;

    const x = ((r.left - c.left) / c.width) * 100;
    const y = ((r.top - c.top) / c.height) * 100;
    const w = (r.width / c.width) * 100;
    const h = (r.height / c.height) * 100;

    const copy: Record<Exclude<CalloutStep, 'none'>, { title: string; body: string }> = {
      call: {
        title: "Appels → transcription live",
        body: "Enregistrement + transcription en temps réel, prêt pour l’analyse IA.",
      },
      analysis: {
        title: "Analyse IA automatique",
        body: "Score, sentiment, objections et signaux d’intérêt en quelques secondes.",
      },
      proposal: {
        title: "Proposition générée",
        body: "La proposition est rédigée à partir de l’appel et du contexte deal.",
      },
      compliance: {
        title: "Contrôle conformité",
        body: "Vérifie que la proposition respecte les règles (RGPD, pricing, etc.).",
      },
    };

    setCallout({
      id: calloutStep,
      x,
      y,
      w,
      h,
      title: copy[calloutStep].title,
      body: copy[calloutStep].body,
    });
  }, [calloutStep, isActive]);

  return (
    <div 
      ref={rootRef} 
      className="absolute inset-0 flex flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-950"
      style={{ fontSize: 'clamp(8px, 1.2vw, 14px)' }}
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--agent-sales)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--agent-sales)) 1px, transparent 1px)`,
            backgroundSize: '3em 3em',
          }}
        />
        <div className={cn(
          "absolute top-0 right-1/4 w-[40%] aspect-square rounded-full blur-[100px] transition-all duration-1000",
          phase1 ? "bg-agent-sales/15 opacity-100" : "opacity-0"
        )} />
        <div className={cn(
          "absolute bottom-0 left-1/4 w-[30%] aspect-square rounded-full blur-[80px] transition-all duration-1000 delay-300",
          phase3 ? "bg-red-500/10 opacity-100" : "opacity-0"
        )} />
      </div>

      <FrameCallouts target={callout} isVisible={isActive && !!callout} />

      {/* Header */}
      <div className={cn(
        "relative z-10 px-[2%] py-[1.5%] flex items-center justify-between border-b border-white/5 transition-all duration-700",
        phase1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}>
        <div className="flex items-center gap-[0.8em]">
          <div className="w-[2.5em] h-[2.5em] rounded-xl bg-agent-sales/20 flex items-center justify-center border border-agent-sales/30">
            <TrendingUp className="w-[1.2em] h-[1.2em] text-agent-sales" />
          </div>
          <div>
            <h1 className="text-[1.3em] font-bold text-white leading-tight">Agent Ventes</h1>
            <p className="text-[0.75em] text-white/40">Intelligence commerciale</p>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-[0.8em] transition-all duration-500",
          phase2 ? "opacity-100" : "opacity-0"
        )}>
          <div className="px-[0.8em] py-[0.4em] rounded-full bg-agent-sales/10 border border-agent-sales/20">
            <span className="text-[0.75em] text-agent-sales font-medium">4 deals actifs</span>
          </div>
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
          
          {deals.map((deal, i) => (
            <div 
              key={deal.name}
              className={cn(
                "p-[0.8em] rounded-xl border transition-all duration-500",
                deal.hot ? "bg-agent-sales/10 border-agent-sales/30" : "bg-white/[0.02] border-white/[0.06]"
              )}
              style={{ 
                transitionDelay: `${i * 80}ms`,
                opacity: phase2 ? 1 : 0.3,
                transform: phase2 ? 'translateX(0)' : 'translateX(-10px)'
              }}
            >
              <div className="flex items-center justify-between mb-[0.3em]">
                <span className="text-[0.9em] font-medium text-white">{deal.name}</span>
                {deal.hot && <Target className="w-[0.9em] h-[0.9em] text-amber-400" />}
              </div>
              <div className="text-[0.7em] text-white/40 mb-[0.5em]">{deal.stage}</div>
              <div className="flex items-center gap-[0.5em]">
                <div className="flex-1 h-[0.3em] bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-agent-sales rounded-full transition-all duration-1000"
                    style={{ 
                      width: phase2 ? `${deal.prob}%` : '0%',
                      transitionDelay: `${i * 100 + 200}ms`
                    }}
                  />
                </div>
                <span className="text-[0.7em] text-white/60">{deal.prob}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Center - Call recording & analysis */}
        <div className="flex-1 flex flex-col gap-[0.8em] min-w-0">
          {/* Call recording section */}
          <div className={cn(
            "flex-1 rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden transition-all duration-700 min-h-0",
            phase3 ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}>
            <div className="p-[0.8em] border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-[0.5em]">
                <Phone className="w-[1em] h-[1em] text-red-400" />
                <span className="text-[0.9em] font-medium text-white">Enregistrement d'appel</span>
              </div>
              <div className={cn(
                "flex items-center gap-[0.5em] transition-all duration-500",
                phase4 ? "opacity-100" : "opacity-0"
              )}>
                <div className="w-[0.5em] h-[0.5em] rounded-full bg-red-500 animate-pulse" />
                <span className="text-[0.7em] text-red-400">REC • 04:32</span>
              </div>
            </div>
            
            <div className="p-[1em] flex gap-[1em] h-[calc(100%-3em)] min-h-0">
              {/* Waveform */}
              <div
                ref={callRef}
                className={cn(
                  "w-[40%] p-[0.8em] rounded-xl bg-red-500/5 border border-red-500/20 transition-all duration-700 flex flex-col",
                  phase4 ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="flex items-center gap-[0.5em] mb-[0.5em]">
                  <Volume2 className="w-[1em] h-[1em] text-red-400" />
                  <span className="text-[0.7em] text-red-400">Appel TechCorp</span>
                </div>
                <div className="flex-1 flex items-end gap-[2%] min-h-0">
                  {[...Array(24)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-red-500/60 rounded-sm transition-all"
                      style={{ 
                        height: `${20 + Math.sin(i * 0.4) * 30 + Math.random() * 30}%`,
                        animation: phase4 ? `wave 0.6s ease-in-out infinite alternate ${i * 40}ms` : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Transcript */}
              <div className={cn(
                "flex-1 flex flex-col transition-all duration-700 min-h-0",
                phase5 ? "opacity-100" : "opacity-0"
              )}>
                <div className="flex items-center gap-[0.5em] mb-[0.5em]">
                  <MessageSquare className="w-[1em] h-[1em] text-white/40" />
                  <span className="text-[0.7em] text-white/40">Transcription temps réel</span>
                </div>
                <div className="flex-1 flex flex-col gap-[0.4em] overflow-hidden">
                  {[
                    { speaker: 'Vous', text: '"Je comprends vos besoins en automatisation..."', you: true },
                    { speaker: 'Client', text: '"Exactement, nous cherchons à gagner du temps..."', you: false },
                    { speaker: 'Vous', text: '"Notre solution permet justement de..."', you: true },
                  ].map((line, i) => (
                    <div 
                      key={i}
                      className="p-[0.5em] rounded-lg bg-white/[0.03] transition-all duration-500"
                      style={{ 
                        transitionDelay: `${i * 150}ms`,
                        opacity: phase5 ? 1 : 0,
                        transform: phase5 ? 'translateX(0)' : 'translateX(10px)'
                      }}
                    >
                      <span className={cn("text-[0.75em] font-medium", line.you ? "text-agent-sales" : "text-blue-400")}>
                        {line.speaker}:
                      </span>
                      <span className="text-[0.75em] text-white/60 ml-[0.3em]">{line.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex gap-[0.8em] h-[30%] min-h-0">
            {/* AI Analysis */}
            <div
              ref={analysisRef}
              className={cn(
                "flex-1 rounded-xl bg-white/[0.02] border border-white/[0.06] p-[0.8em] transition-all duration-700 flex flex-col",
                phase6 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <div className="flex items-center gap-[0.5em] mb-[0.5em]">
                <Sparkles className="w-[1em] h-[1em] text-agent-sales" />
                <span className="text-[0.9em] font-medium text-white">Analyse IA</span>
              </div>
              <div className="flex-1 grid grid-cols-4 gap-[0.5em] min-h-0">
                {[
                  { label: 'Score', value: '92%', color: 'text-agent-sales' },
                  { label: 'Sentiment', value: '↑', color: 'text-green-400' },
                  { label: 'Objections', value: '2', color: 'text-amber-400' },
                  { label: 'Intérêt', value: 'Fort', color: 'text-blue-400' },
                ].map((metric, i) => (
                  <div 
                    key={metric.label}
                    className="p-[0.5em] rounded-lg bg-white/[0.03] flex flex-col items-center justify-center transition-all duration-500"
                    style={{ 
                      transitionDelay: `${i * 80}ms`,
                      opacity: phase6 ? 1 : 0
                    }}
                  >
                    <div className={cn("text-[1.2em] font-bold leading-none", metric.color)}>{metric.value}</div>
                    <div className="text-[0.6em] text-white/40 mt-[0.2em]">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Proposal */}
            <div
              ref={proposalRef}
              className={cn(
                "w-[25%] rounded-xl bg-white/[0.02] border border-white/[0.06] p-[0.8em] transition-all duration-700 flex flex-col",
                phase7 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
              )}
            >
              <div className="flex items-center gap-[0.5em] mb-[0.5em]">
                <FileSignature className="w-[1em] h-[1em] text-purple-400" />
                <span className="text-[0.9em] font-medium text-white">Proposition</span>
              </div>
              <div className={cn(
                "flex-1 p-[0.5em] rounded-lg bg-purple-500/10 border border-purple-500/20 transition-all duration-500 flex flex-col justify-center",
                phase7 ? "opacity-100" : "opacity-0"
              )}>
                <div className="flex items-center gap-[0.3em] mb-[0.3em]">
                  <Zap className="w-[0.8em] h-[0.8em] text-purple-400 animate-pulse" />
                  <span className="text-[0.65em] text-purple-400">Générée</span>
                </div>
                <div className="text-[0.75em] text-white/60">TechCorp • Prête</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Team & Compliance */}
        <div className={cn(
          "w-[20%] flex flex-col gap-[0.8em] transition-all duration-700",
          phase6 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        )}>
          {/* Team performance */}
          <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/[0.06] p-[0.8em] flex flex-col min-h-0">
            <div className="flex items-center gap-[0.5em] mb-[0.6em]">
              <Users className="w-[1em] h-[1em] text-blue-400" />
              <span className="text-[0.9em] font-medium text-white">Équipe</span>
            </div>
            <div className="flex-1 flex flex-col gap-[0.5em] justify-center">
              {[
                { name: 'Marie', quota: 110 },
                { name: 'Thomas', quota: 85 },
                { name: 'Julie', quota: 95 },
              ].map((member, i) => (
                <div key={member.name} className="transition-all duration-500" style={{ transitionDelay: `${i * 100}ms`, opacity: phase6 ? 1 : 0 }}>
                  <div className="flex items-center justify-between mb-[0.2em]">
                    <span className="text-[0.7em] text-white/60">{member.name}</span>
                    <span className={cn("text-[0.7em] font-medium", member.quota >= 100 ? "text-green-400" : "text-white/50")}>
                      {member.quota}%
                    </span>
                  </div>
                  <div className="h-[0.3em] bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", member.quota >= 100 ? "bg-green-500" : "bg-agent-sales")}
                      style={{ width: `${Math.min(member.quota, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance */}
          <div
            ref={complianceRef}
            className={cn(
              "rounded-xl bg-white/[0.02] border border-white/[0.06] p-[0.8em] transition-all duration-700",
              phase8 ? "ring-1 ring-green-500/30 bg-green-500/5" : ""
            )}
          >
            <div className="flex items-center gap-[0.5em] mb-[0.5em]">
              <Shield className="w-[1em] h-[1em] text-green-400" />
              <span className="text-[0.9em] font-medium text-white">Conformité</span>
            </div>
            <div className={cn(
              "flex items-center gap-[0.5em] p-[0.5em] rounded-lg bg-green-500/10 border border-green-500/20 transition-all duration-500",
              phase8 ? "opacity-100" : "opacity-0"
            )}>
              <CheckCircle className="w-[1em] h-[1em] text-green-400" />
              <div>
                <div className="text-[0.75em] text-green-400 font-medium">100% OK</div>
                <div className="text-[0.6em] text-white/40">RGPD • Tarifs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          from { transform: scaleY(0.7); }
          to { transform: scaleY(1.3); }
        }
      `}</style>
    </div>
  );
}
