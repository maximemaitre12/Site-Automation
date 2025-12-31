import React from 'react';
import { Database, Search, Building2, TrendingUp, Users, DollarSign, AlertCircle, Sparkles, ExternalLink, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnimationTimeline, Timeline } from '@/hooks/useAnimationTimeline';
import { SpringIn, FadeSlide, StaggerGroup, CountUp, PulseGlow, ParticleExplosion, ScalePop } from '../animations';

interface DataSceneProps {
  isActive: boolean;
  progress: number;
}

const dataTimeline: Timeline = {
  header: { start: 0, end: 8 },
  searchBar: { start: 5, end: 15 },
  companyList: { start: 10, end: 25, stagger: 100, items: 3 },
  typing: { start: 20, end: 32 },
  selectCompany: { start: 30, end: 42 },
  companyHeader: { start: 38, end: 50 },
  stats: { start: 45, end: 60, stagger: 100, items: 3 },
  enrichment: { start: 55, end: 68 },
  chart: { start: 62, end: 78 },
  alert: { start: 75, end: 88 },
  finalGlow: { start: 86, end: 100 },
};

const companies = [
  { id: 1, name: 'TechCorp', industry: 'SaaS', employees: 250, revenue: '€12M' },
  { id: 2, name: 'DataFlow', industry: 'Analytics', employees: 180, revenue: '€8M' },
  { id: 3, name: 'CloudFirst', industry: 'Cloud', employees: 320, revenue: '€25M' },
];

const companyStats = [
  { icon: Users, label: 'Employees', value: 250, color: 'text-blue-500' },
  { icon: DollarSign, label: 'Revenue', value: '€12M', color: 'text-emerald-500' },
  { icon: TrendingUp, label: 'Growth', value: '+24%', color: 'text-amber-500' },
];

const chartData = [40, 55, 45, 60, 70, 65, 80, 75, 90, 85, 95, 100];

export function DataScene({ isActive, progress }: DataSceneProps) {
  const timeline = useAnimationTimeline(progress, dataTimeline);
  const showParticles = timeline.isActive('finalGlow') && progress >= 92;

  return (
    <div 
      className="absolute inset-0 flex flex-col overflow-hidden bg-white"
      style={{ fontSize: 'clamp(8px, 1.2vw, 14px)' }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className={cn(
          "absolute top-1/4 right-1/4 w-[40%] aspect-square rounded-full blur-[100px] transition-all duration-1000",
          timeline.isActive('header') ? "bg-orange-500/8 opacity-100" : "opacity-0"
        )} />
      </div>

      <ParticleExplosion 
        active={showParticles} 
        count={25} 
        colors={['#F97316', '#FB923C', '#FDBA74', '#FED7AA', '#EA580C']}
        originX={75}
        originY={50}
      />

      {/* Header */}
      <SpringIn active={timeline.isActive('header')} className="relative z-10 px-[2%] py-[1.5%] border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[0.8em]">
            <PulseGlow active={timeline.isActive('finalGlow')} color="hsl(25, 95%, 53%)" intensity="medium">
              <div className="w-[2.5em] h-[2.5em] rounded-xl bg-orange-100 flex items-center justify-center">
                <Database className="w-[1.2em] h-[1.2em] text-orange-600" />
              </div>
            </PulseGlow>
            <div>
              <h1 className="text-[1.3em] font-bold text-slate-900 leading-tight">Data Platform</h1>
              <p className="text-[0.75em] text-slate-500">Business intelligence</p>
            </div>
          </div>

          {/* Search bar */}
          <FadeSlide active={timeline.isActive('searchBar')} direction="left">
            <div className={cn(
              "flex items-center gap-[0.5em] px-[0.8em] py-[0.5em] rounded-xl bg-slate-100 border border-slate-200 w-[15em] transition-all",
              timeline.isActive('typing') && "ring-2 ring-primary"
            )}>
              <Search className="w-[1em] h-[1em] text-slate-400" />
              <span className={cn(
                "text-[0.8em] transition-all",
                timeline.isActive('typing') ? "text-slate-800" : "text-slate-400"
              )}>
                {timeline.isActive('typing') ? 'TechCorp' : 'Search a company...'}
              </span>
            </div>
          </FadeSlide>
        </div>
      </SpringIn>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex gap-[1%] p-[1.5%] overflow-hidden min-h-0">
        {/* Left - Company list */}
        <FadeSlide active={timeline.isActive('companyList')} direction="left" className={cn(
          "w-[28%] flex flex-col gap-[0.6em] transition-opacity duration-500",
          timeline.isActive('selectCompany') && "opacity-50"
        )}>
          <div className="text-[0.7em] font-semibold text-slate-500 uppercase tracking-wider mb-[0.3em]">Tracked companies</div>
          
          <StaggerGroup active={timeline.isActive('companyList')} stagger={100} animation="slide">
            {companies.map((company, i) => (
              <div 
                key={company.id}
                className={cn(
                  "p-[0.8em] rounded-xl border transition-all cursor-pointer",
                  timeline.isActive('selectCompany') && i === 0
                    ? "border-primary bg-primary/5"
                    : "border-slate-100 bg-slate-50 hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-[0.6em]">
                  <div className="w-[2.5em] h-[2.5em] rounded-lg bg-slate-200 flex items-center justify-center">
                    <Building2 className="w-[1.2em] h-[1.2em] text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[0.9em] font-medium text-slate-800">{company.name}</p>
                    <p className="text-[0.7em] text-slate-500">{company.industry}</p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerGroup>
        </FadeSlide>

        {/* Center - Company detail */}
        <div className="flex-1 flex flex-col gap-[0.8em] min-w-0">
          {timeline.isActive('selectCompany') ? (
            <>
              {/* Company header */}
              <SpringIn active={timeline.isActive('companyHeader')} className="rounded-2xl bg-slate-50 border border-slate-100 p-[1.2em]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-[1em]">
                    <div className="w-[4em] h-[4em] rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-[2em] h-[2em] text-primary" />
                    </div>
                    <div>
                      <h2 className="text-[1.5em] font-bold text-slate-800">TechCorp</h2>
                      <p className="text-[0.85em] text-slate-500">SaaS</p>
                    </div>
                  </div>
                  
                  <ScalePop active={timeline.isActive('enrichment')}>
                    <div className="flex items-center gap-[0.4em] px-[0.8em] py-[0.4em] rounded-full bg-primary/10 text-primary">
                      <Sparkles className="w-[0.9em] h-[0.9em]" />
                      <span className="text-[0.75em] font-medium">AI Enriched</span>
                    </div>
                  </ScalePop>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-[0.8em] mt-[1em]">
                  {companyStats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <ScalePop 
                        key={stat.label} 
                        active={timeline.isStaggerItemActive('stats', i)}
                        delay={i * 100}
                      >
                        <div className="p-[0.8em] rounded-xl bg-white border border-slate-100">
                          <Icon className={cn("w-[1.2em] h-[1.2em] mb-[0.4em]", stat.color)} />
                          <p className="text-[1.3em] font-bold text-slate-800">
                            {typeof stat.value === 'number' ? (
                              <CountUp value={stat.value} active={timeline.isStaggerItemActive('stats', i)} />
                            ) : stat.value}
                          </p>
                          <p className="text-[0.7em] text-slate-500">{stat.label}</p>
                        </div>
                      </ScalePop>
                    );
                  })}
                </div>
              </SpringIn>

              {/* Revenue chart */}
              <FadeSlide active={timeline.isActive('chart')} direction="up" className="flex-1 rounded-2xl bg-slate-50 border border-slate-100 p-[1em]">
                <div className="flex items-center gap-[0.5em] mb-[0.8em]">
                  <TrendingUp className="w-[1em] h-[1em] text-slate-500" />
                  <span className="text-[0.9em] font-semibold text-slate-800">Revenue Evolution</span>
                </div>
                <div className="h-[80%] flex items-end gap-[3%]">
                  {chartData.map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary/60 rounded-t transition-all duration-500"
                      style={{ 
                        height: timeline.isActive('chart') ? `${height}%` : '0%',
                        transitionDelay: `${i * 50}ms`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[0.65em] text-slate-400 mt-[0.5em]">
                  <span>Jan</span>
                  <span>Dec</span>
                </div>
              </FadeSlide>
            </>
          ) : (
            <div className="flex-1 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <Database className="w-[3em] h-[3em] mx-auto mb-[0.5em] opacity-50" />
                <p className="text-[0.85em]">Select a company to view details</p>
              </div>
            </div>
          )}
        </div>

        {/* Right - Alerts & Stats */}
        <FadeSlide active={timeline.isActive('header')} direction="right" className="w-[22%] flex flex-col gap-[0.8em]">
          {/* Alert */}
          <PulseGlow active={timeline.isActive('finalGlow')} color="hsl(38, 92%, 50%)" intensity="high">
            <ScalePop active={timeline.isActive('alert')}>
              <div className={cn(
                "rounded-xl bg-amber-50 border border-amber-200 p-[0.8em] transition-all duration-500",
                timeline.isActive('finalGlow') && "border-amber-300"
              )}>
                <div className="flex items-start gap-[0.5em]">
                  <AlertCircle className="w-[1.2em] h-[1.2em] text-amber-500 shrink-0 mt-[0.1em]" />
                  <div>
                    <h4 className="text-[0.85em] font-medium text-amber-700">New funding detected</h4>
                    <p className="text-[0.75em] text-slate-600 mt-[0.3em]">
                      TechCorp just announced a €15M Series B round.
                      <a href="#" className="text-primary ml-[0.3em] inline-flex items-center gap-[0.2em]">
                        View article <ExternalLink className="w-[0.7em] h-[0.7em]" />
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </ScalePop>
          </PulseGlow>

          {/* Stats */}
          <SpringIn active={timeline.isActive('header')} delay={200} className="rounded-xl bg-slate-50 border border-slate-100 p-[0.8em]">
            <div className="flex items-center gap-[0.5em] mb-[0.6em]">
              <BarChart3 className="w-[1em] h-[1em] text-orange-500" />
              <span className="text-[0.9em] font-semibold text-slate-800">Platform Stats</span>
            </div>
            <div className="space-y-[0.5em]">
              {[
                { label: 'Companies tracked', value: 1247 },
                { label: 'Data points', value: 45600 },
                { label: 'Alerts today', value: 23 },
                { label: 'Enrichment rate', value: 94, suffix: '%' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-[0.7em] text-slate-500">{stat.label}</span>
                  <span className="text-[0.85em] font-bold text-slate-800">
                    <CountUp value={stat.value} active={timeline.isActive('header')} delay={i * 80} suffix={stat.suffix || ''} />
                  </span>
                </div>
              ))}
            </div>
          </SpringIn>

          <SpringIn active={timeline.isActive('header')} delay={300} className="flex-1 rounded-xl bg-orange-50 border border-orange-100 p-[0.8em] flex flex-col">
            <div className="flex items-center gap-[0.5em] mb-[0.5em]">
              <Sparkles className="w-[1em] h-[1em] text-orange-600" />
              <span className="text-[0.85em] font-semibold text-slate-800">AI Enrichment</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[0.75em] text-slate-500 text-center">
                Automatic company data enrichment and real-time monitoring
              </p>
            </div>
          </SpringIn>
        </FadeSlide>
      </div>
    </div>
  );
}
