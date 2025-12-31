import React from 'react';
import { Headphones, MessageSquare, Clock, CheckCircle, AlertCircle, Sparkles, Send, User, Zap, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnimationTimeline, Timeline } from '@/hooks/useAnimationTimeline';
import { SpringIn, FadeSlide, StaggerGroup, CountUp, PulseGlow, ParticleExplosion, ScalePop, ZoomSpotlight } from '../animations';

interface SupportSceneProps {
  isActive: boolean;
  progress: number;
}

const supportTimeline: Timeline = {
  header: { start: 0, end: 8 },
  stats: { start: 5, end: 15 },
  ticketList: { start: 10, end: 22, stagger: 100, items: 3 },
  newTicket: { start: 18, end: 30 },
  selectTicket: { start: 28, end: 38 },
  customerMessage: { start: 35, end: 45 },
  aiClassification: { start: 42, end: 55, stagger: 100, items: 3 },
  aiResponse: { start: 52, end: 70 },
  sendButton: { start: 68, end: 80 },
  resolved: { start: 78, end: 90 },
  finalGlow: { start: 88, end: 100 },
};

const existingTickets = [
  { id: 1, subject: 'Connection issue', status: 'Resolved', priority: 'Medium' },
  { id: 2, subject: 'Billing question', status: 'In progress', priority: 'High' },
];

const classificationTags = [
  { label: 'Category: Billing', color: 'bg-blue-500/20 text-blue-600' },
  { label: 'Priority: High', color: 'bg-red-500/20 text-red-600' },
  { label: 'Sentiment: Frustrated', color: 'bg-purple-500/20 text-purple-600' },
];

export function SupportScene({ isActive, progress }: SupportSceneProps) {
  const timeline = useAnimationTimeline(progress, supportTimeline);
  const showParticles = timeline.isActive('finalGlow') && progress >= 92;

  return (
    <div 
      className="absolute inset-0 flex flex-col overflow-hidden bg-white"
      style={{ fontSize: 'clamp(8px, 1.2vw, 14px)' }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className={cn(
          "absolute top-1/4 -left-[10%] w-[40%] aspect-square rounded-full blur-[100px] transition-all duration-1000",
          timeline.isActive('header') ? "bg-amber-500/10 opacity-100" : "opacity-0"
        )} />
      </div>

      <ParticleExplosion 
        active={showParticles} 
        count={25} 
        colors={['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#D97706']}
        originX={85}
        originY={85}
      />

      {/* Header */}
      <SpringIn active={timeline.isActive('header')} className="relative z-10 px-[2%] py-[1.5%] border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[0.8em]">
            <PulseGlow active={timeline.isActive('finalGlow')} color="hsl(38, 92%, 50%)" intensity="medium">
              <div className="w-[2.5em] h-[2.5em] rounded-xl bg-amber-100 flex items-center justify-center">
                <Zap className="w-[1.2em] h-[1.2em] text-amber-600" />
              </div>
            </PulseGlow>
            <div>
              <h1 className="text-[1.3em] font-bold text-slate-900 leading-tight">Support Agent</h1>
              <p className="text-[0.75em] text-slate-500">Automated assistance</p>
            </div>
          </div>
          <FadeSlide active={timeline.isActive('stats')} direction="left" delay={200}>
            <div className="flex items-center gap-[1.5em]">
              <div className="flex items-center gap-[0.5em]">
                <Clock className="w-[1em] h-[1em] text-slate-400" />
                <span className="text-[0.8em]"><strong>12s</strong> avg time</span>
              </div>
              <div className="flex items-center gap-[0.5em]">
                <CheckCircle className="w-[1em] h-[1em] text-emerald-500" />
                <span className="text-[0.8em]"><strong>72%</strong> auto-resolved</span>
              </div>
            </div>
          </FadeSlide>
        </div>
      </SpringIn>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex gap-[1%] p-[1.5%] overflow-hidden min-h-0">
        {/* Left - Ticket list */}
        <FadeSlide active={timeline.isActive('ticketList')} direction="left" className="w-[28%] flex flex-col gap-[0.6em]">
          <div className="text-[0.7em] font-semibold text-slate-500 uppercase tracking-wider mb-[0.3em]">Tickets</div>
          
          {/* New urgent ticket */}
          <ScalePop active={timeline.isActive('newTicket')}>
            <div className={cn(
              "p-[0.8em] rounded-xl border-2 transition-all",
              timeline.isActive('selectTicket') 
                ? "border-primary bg-primary/5" 
                : "border-red-300 bg-red-50 animate-pulse"
            )}>
              <div className="flex items-center justify-between mb-[0.3em]">
                <span className="text-[0.9em] font-medium text-slate-800">Payment error</span>
                <span className="px-[0.5em] py-[0.15em] rounded-full text-[0.65em] bg-red-500 text-white font-medium">
                  Urgent
                </span>
              </div>
              <p className="text-[0.75em] text-slate-500 line-clamp-2">
                "I cannot complete my payment, I keep getting an error message..."
              </p>
            </div>
          </ScalePop>

          <StaggerGroup active={timeline.isActive('ticketList')} stagger={100} animation="slide">
            {existingTickets.map((ticket) => (
              <div 
                key={ticket.id}
                className="p-[0.8em] rounded-xl border border-slate-100 bg-slate-50 opacity-60"
              >
                <div className="flex items-center justify-between mb-[0.3em]">
                  <span className="text-[0.85em] font-medium text-slate-700">{ticket.subject}</span>
                  <span className={cn(
                    "px-[0.5em] py-[0.15em] rounded-full text-[0.6em] font-medium",
                    ticket.status === 'Resolved' 
                      ? "bg-emerald-100 text-emerald-600" 
                      : "bg-amber-100 text-amber-600"
                  )}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </StaggerGroup>
        </FadeSlide>

        {/* Center - Ticket detail */}
        <div className="flex-1 flex flex-col gap-[0.8em] min-w-0">
          <SpringIn active={timeline.isActive('selectTicket')} className="flex-1 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden min-h-0 flex flex-col">
            <div className="p-[0.8em] border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-[0.5em]">
                <MessageSquare className="w-[1em] h-[1em] text-amber-600" />
                <span className="text-[0.9em] font-semibold text-slate-800">Conversation</span>
              </div>
            </div>
            
            <div className="flex-1 p-[1em] flex flex-col gap-[0.8em] overflow-auto">
              {/* Customer message */}
              <FadeSlide active={timeline.isActive('customerMessage')} direction="up">
                <div className="flex gap-[0.6em]">
                  <div className="w-[2em] h-[2em] rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <User className="w-[1em] h-[1em] text-slate-500" />
                  </div>
                  <div className="flex-1 p-[0.8em] rounded-2xl rounded-bl-sm bg-slate-100 border border-slate-200">
                    <p className="text-[0.8em] text-slate-700">
                      "I cannot complete my payment. I keep getting the error 'Transaction declined'. 
                      Can you help me quickly? It's urgent because my subscription expires tomorrow."
                    </p>
                  </div>
                </div>
              </FadeSlide>

              {/* AI Classification */}
              <FadeSlide active={timeline.isActive('aiClassification')} direction="up" delay={100}>
                <div className="ml-[2.6em] p-[0.8em] rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-[0.5em] mb-[0.5em]">
                    <Sparkles className="w-[0.9em] h-[0.9em] text-primary" />
                    <span className="text-[0.8em] font-medium text-slate-700">AI Analysis</span>
                  </div>
                  <div className="flex flex-wrap gap-[0.4em]">
                    {classificationTags.map((tag, i) => (
                      <span 
                        key={tag.label}
                        className={cn(
                          "px-[0.6em] py-[0.25em] rounded-full text-[0.7em] font-medium transition-all duration-500",
                          tag.color,
                          timeline.isStaggerItemActive('aiClassification', i) ? "opacity-100 scale-100" : "opacity-0 scale-90"
                        )}
                        style={{ transitionDelay: `${i * 100}ms` }}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeSlide>

              {/* AI Response */}
              <FadeSlide active={timeline.isActive('aiResponse')} direction="up" delay={200}>
                <div className="flex gap-[0.6em]">
                  <div className="w-[2em] h-[2em] rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Sparkles className="w-[1em] h-[1em] text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="p-[0.8em] rounded-2xl rounded-bl-sm bg-primary/10 border border-primary/20 mb-[0.6em]">
                      <p className="text-[0.8em] text-slate-700">
                        Hello, I understand your frustration. I checked your account and the issue is due to an expired card. 
                        I have extended your subscription by 24h for free while you update your payment information. 
                        Here is the direct link: <span className="text-primary font-medium">[Update card]</span>. 
                        Feel free to reach out if you have any questions!
                      </p>
                    </div>
                    
                    <ScalePop active={timeline.isActive('sendButton')}>
                      <button 
                        className={cn(
                          "flex items-center gap-[0.5em] px-[1em] py-[0.5em] rounded-lg bg-primary text-white text-[0.8em] font-medium",
                          timeline.isActive('sendButton') && !timeline.isActive('resolved') && "ring-4 ring-primary/30"
                        )}
                      >
                        <Send className="w-[0.9em] h-[0.9em]" />
                        Send response
                      </button>
                    </ScalePop>
                  </div>
                </div>
              </FadeSlide>

              {/* Resolution confirmation */}
              <PulseGlow active={timeline.isActive('finalGlow')} color="hsl(142, 76%, 36%)" intensity="high">
                <ScalePop active={timeline.isActive('resolved')}>
                  <div className={cn(
                    "ml-[2.6em] p-[0.8em] rounded-xl bg-emerald-50 border border-emerald-200 transition-all duration-500",
                    timeline.isActive('finalGlow') && "border-emerald-300"
                  )}>
                    <div className="flex items-center gap-[0.5em] text-emerald-600 mb-[0.3em]">
                      <CheckCircle className="w-[1em] h-[1em]" />
                      <span className="font-medium text-[0.85em]">Resolved in 12 seconds</span>
                    </div>
                    <p className="text-[0.75em] text-slate-600">
                      Customer received a personalized solution and subscription extended.
                    </p>
                  </div>
                </ScalePop>
              </PulseGlow>
            </div>
          </SpringIn>
        </div>

        {/* Right - Stats */}
        <FadeSlide active={timeline.isActive('stats')} direction="right" className="w-[20%] flex flex-col gap-[0.8em]">
          <SpringIn active={timeline.isActive('stats')} className="rounded-xl bg-slate-50 border border-slate-100 p-[0.8em]">
            <div className="flex items-center gap-[0.5em] mb-[0.6em]">
              <BarChart3 className="w-[1em] h-[1em] text-amber-500" />
              <span className="text-[0.9em] font-semibold text-slate-800">Performance</span>
            </div>
            <div className="space-y-[0.5em]">
              {[
                { label: 'Tickets today', value: 156 },
                { label: 'Auto-resolved', value: 72, suffix: '%' },
                { label: 'Avg. response', value: 12, suffix: 's' },
                { label: 'Satisfaction', value: 98, suffix: '%' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-[0.75em] text-slate-500">{stat.label}</span>
                  <span className="text-[0.9em] font-bold text-slate-800">
                    <CountUp value={stat.value} active={timeline.isActive('stats')} delay={i * 80} suffix={stat.suffix || ''} />
                  </span>
                </div>
              ))}
            </div>
          </SpringIn>

          <SpringIn active={timeline.isActive('stats')} delay={200} className="flex-1 rounded-xl bg-amber-50 border border-amber-100 p-[0.8em] flex flex-col">
            <div className="flex items-center gap-[0.5em] mb-[0.5em]">
              <Headphones className="w-[1em] h-[1em] text-amber-600" />
              <span className="text-[0.85em] font-semibold text-slate-800">Queue</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[2em] font-bold text-amber-600">
                  <CountUp value={3} active={timeline.isActive('stats')} />
                </div>
                <div className="text-[0.7em] text-slate-500">waiting tickets</div>
              </div>
            </div>
          </SpringIn>
        </FadeSlide>
      </div>
    </div>
  );
}
