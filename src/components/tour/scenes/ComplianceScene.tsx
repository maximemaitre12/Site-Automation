import React from 'react';
import { Shield, FileSearch, AlertTriangle, CheckCircle, FileText, BarChart3, Upload, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnimationTimeline, Timeline } from '@/hooks/useAnimationTimeline';
import { SpringIn, FadeSlide, StaggerGroup, CountUp, PulseGlow, ParticleExplosion, ScalePop, ScanLine } from '../animations';

interface ComplianceSceneProps {
  isActive: boolean;
  progress: number;
}

const complianceTimeline: Timeline = {
  header: { start: 0, end: 8 },
  auditTypes: { start: 5, end: 18, stagger: 100, items: 3 },
  selectType: { start: 15, end: 25 },
  documentUpload: { start: 22, end: 35 },
  analyzeButton: { start: 32, end: 42 },
  scanning: { start: 40, end: 55 },
  score: { start: 52, end: 68 },
  risks: { start: 62, end: 78, stagger: 120, items: 3 },
  recommendations: { start: 75, end: 88 },
  finalGlow: { start: 86, end: 100 },
};

const auditTypes = ['GDPR', 'ISO 27001', 'SOC 2'];

const risks = [
  { text: 'Non-anonymized personal data', severity: 'high' },
  { text: 'Missing explicit consent', severity: 'high' },
  { text: 'Retention period not specified', severity: 'medium' },
];

const recommendations = [
  'Add explicit consent clause',
  'Anonymize customer data before processing',
  'Define a maximum retention period of 3 years',
];

export function ComplianceScene({ isActive, progress }: ComplianceSceneProps) {
  const timeline = useAnimationTimeline(progress, complianceTimeline);
  const showParticles = timeline.isActive('finalGlow') && progress >= 92;
  const scoreValue = timeline.isActive('score') ? 72 : 0;

  return (
    <div 
      className="absolute inset-0 flex flex-col overflow-hidden bg-white"
      style={{ fontSize: 'clamp(8px, 1.2vw, 14px)' }}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={cn(
          "absolute top-1/4 right-1/4 w-[35%] aspect-square rounded-full blur-[60px] transition-all duration-1000",
          timeline.isActive('header') ? "bg-red-500/6 opacity-100" : "opacity-0"
        )} />
      </div>

      <ParticleExplosion 
        active={showParticles} 
        count={25} 
        colors={['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#DC2626']}
        originX={50}
        originY={50}
      />

      {/* Header */}
      <SpringIn active={timeline.isActive('header')} className="relative z-10 px-[2%] py-[1.5%] border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[0.8em]">
            <PulseGlow active={timeline.isActive('finalGlow')} color="hsl(0, 84%, 60%)" intensity="medium">
              <div className="w-[2.5em] h-[2.5em] rounded-xl bg-red-100 flex items-center justify-center">
                <Shield className="w-[1.2em] h-[1.2em] text-red-600" />
              </div>
            </PulseGlow>
            <div>
              <h1 className="text-[1.3em] font-bold text-slate-900 leading-tight">Compliance Agent</h1>
              <p className="text-[0.75em] text-slate-500">Automated auditing</p>
            </div>
          </div>
        </div>
      </SpringIn>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex gap-[1%] p-[1.5%] overflow-hidden min-h-0">
        {/* Left - Audit config */}
        <FadeSlide active={timeline.isActive('auditTypes')} direction="left" className="w-[30%] flex flex-col gap-[0.8em]">
          <div className="text-[0.7em] font-semibold text-slate-500 uppercase tracking-wider mb-[0.3em]">Audit Type</div>
          
          <StaggerGroup active={timeline.isActive('auditTypes')} stagger={100} animation="spring">
            {auditTypes.map((type, i) => (
              <button 
                key={type}
                className={cn(
                  "p-[0.8em] rounded-xl border-2 transition-all text-left w-full",
                  timeline.isActive('selectType') && type === 'GDPR'
                    ? "border-primary bg-primary/10"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <span className="text-[0.9em] font-medium text-slate-800">{type}</span>
              </button>
            ))}
          </StaggerGroup>

          {/* Document upload */}
          <SpringIn active={timeline.isActive('documentUpload')} className="flex-1 mt-[0.5em]">
            <div className="text-[0.7em] font-semibold text-slate-500 uppercase tracking-wider mb-[0.5em]">Document</div>
            <div className={cn(
              "h-full min-h-[8em] p-[1em] rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center",
              timeline.isActive('analyzeButton') ? "border-primary bg-primary/5" : "border-slate-200"
            )}>
              {timeline.isActive('analyzeButton') ? (
                <>
                  <FileText className="w-[2em] h-[2em] text-primary mb-[0.5em]" />
                  <p className="text-[0.8em] text-slate-700 font-medium">Supplier_Contract_2024.pdf</p>
                  <p className="text-[0.65em] text-slate-400">12 pages • 2.4 MB</p>
                </>
              ) : (
                <>
                  <Upload className="w-[2em] h-[2em] text-slate-400 mb-[0.5em]" />
                  <p className="text-[0.75em] text-slate-500">Drop a document here...</p>
                </>
              )}
            </div>
          </SpringIn>

          <ScalePop active={timeline.isActive('analyzeButton')}>
            <button className={cn(
              "w-full py-[0.8em] rounded-xl bg-primary text-white font-medium flex items-center justify-center gap-[0.5em] text-[0.9em]",
              timeline.isActive('analyzeButton') && !timeline.isActive('scanning') && "ring-4 ring-primary/30"
            )}>
              <FileSearch className="w-[1em] h-[1em]" />
              Analyze document
            </button>
          </ScalePop>
        </FadeSlide>

        {/* Center - Results */}
        <div className="flex-1 flex flex-col gap-[0.8em] min-w-0">
          {/* Scanning animation */}
          {timeline.isActive('scanning') && !timeline.isActive('score') && (
            <SpringIn active={true} className="flex-1 rounded-2xl bg-slate-50 border border-slate-100 p-[1.5em] flex flex-col items-center justify-center">
              <ScanLine active={true} direction="vertical" color="hsl(0, 84%, 60%)" className="w-full max-w-[20em]">
                <div className="p-[2em] rounded-xl bg-white border border-slate-200">
                  <FileText className="w-[3em] h-[3em] text-slate-300 mx-auto mb-[1em]" />
                  <div className="h-[0.3em] bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${((progress - 40) / 15) * 100}%` }}
                    />
                  </div>
                  <p className="text-[0.8em] text-slate-500 mt-[0.5em] text-center">Analyzing...</p>
                </div>
              </ScanLine>
            </SpringIn>
          )}

          {/* Score display */}
          {timeline.isActive('score') && (
            <SpringIn active={true} className="flex-1 rounded-2xl bg-amber-50 border border-amber-200 p-[1.5em] flex flex-col">
              <div className="flex items-center justify-between mb-[1em]">
                <div>
                  <h3 className="text-[1.1em] font-semibold text-slate-800">Compliance Score</h3>
                  <p className="text-[0.75em] text-slate-500">GDPR Audit</p>
                </div>
                
                {/* Circular progress */}
                <div className="relative w-[5em] h-[5em]">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8%"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="hsl(38, 92%, 50%)"
                      strokeWidth="8%"
                      strokeDasharray={`${(scoreValue / 100) * 283} 283`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[1.3em] font-bold text-slate-800">
                      <CountUp value={scoreValue} active={timeline.isActive('score')} suffix="%" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Risks */}
              <div className="flex-1">
                <div className="flex items-center gap-[0.5em] mb-[0.6em]">
                  <AlertTriangle className="w-[1em] h-[1em] text-amber-500" />
                  <span className="text-[0.85em] font-medium text-slate-700">Detected risks ({risks.length})</span>
                </div>
                <StaggerGroup active={timeline.isActive('risks')} stagger={120} className="space-y-[0.4em]">
                  {risks.map((risk, i) => (
                    <div 
                      key={risk.text}
                      className={cn(
                        "flex items-center gap-[0.5em] p-[0.6em] rounded-lg text-[0.8em]",
                        risk.severity === 'high' ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      )}
                    >
                      <AlertTriangle className="w-[0.9em] h-[0.9em] shrink-0" />
                      <span>{risk.text}</span>
                    </div>
                  ))}
                </StaggerGroup>
              </div>

              {/* Recommendations */}
              <PulseGlow active={timeline.isActive('finalGlow')} color="hsl(142, 76%, 36%)" intensity="medium">
                <FadeSlide active={timeline.isActive('recommendations')} direction="up">
                  <div className={cn(
                    "mt-[0.8em] p-[0.8em] rounded-xl bg-emerald-50 border border-emerald-200 transition-all duration-500",
                    timeline.isActive('finalGlow') && "border-emerald-300"
                  )}>
                    <div className="flex items-center gap-[0.5em] mb-[0.5em]">
                      <CheckCircle className="w-[0.9em] h-[0.9em] text-emerald-600" />
                      <span className="text-[0.85em] font-medium text-emerald-700">Recommendations</span>
                    </div>
                    <ul className="space-y-[0.3em]">
                      {recommendations.map((rec, i) => (
                        <li key={i} className="text-[0.75em] text-slate-600 flex items-start gap-[0.4em]">
                          <span className="text-emerald-500">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeSlide>
              </PulseGlow>
            </SpringIn>
          )}

          {/* Empty state before scanning */}
          {!timeline.isActive('scanning') && !timeline.isActive('score') && (
            <div className="flex-1 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <Shield className="w-[3em] h-[3em] mx-auto mb-[0.5em] opacity-50" />
                <p className="text-[0.85em]">Select an audit type and upload a document</p>
              </div>
            </div>
          )}
        </div>

        {/* Right - Stats */}
        <FadeSlide active={timeline.isActive('header')} direction="right" className="w-[20%] flex flex-col gap-[0.8em]">
          <SpringIn active={timeline.isActive('header')} delay={200} className="rounded-xl bg-slate-50 border border-slate-100 p-[0.8em]">
            <div className="flex items-center gap-[0.5em] mb-[0.6em]">
              <BarChart3 className="w-[1em] h-[1em] text-red-500" />
              <span className="text-[0.9em] font-semibold text-slate-800">Statistics</span>
            </div>
            <div className="space-y-[0.5em]">
              {[
                { label: 'Audits completed', value: 47 },
                { label: 'Documents analyzed', value: 234 },
                { label: 'Risks detected', value: 89 },
                { label: 'Avg. score', value: 78, suffix: '%' },
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

          <SpringIn active={timeline.isActive('header')} delay={300} className="flex-1 rounded-xl bg-red-50 border border-red-100 p-[0.8em] flex flex-col">
            <div className="flex items-center gap-[0.5em] mb-[0.5em]">
              <Sparkles className="w-[1em] h-[1em] text-red-600" />
              <span className="text-[0.85em] font-semibold text-slate-800">AI Insights</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[0.75em] text-slate-500 text-center">
                Real-time compliance monitoring with automatic alerts
              </p>
            </div>
          </SpringIn>
        </FadeSlide>
      </div>
    </div>
  );
}
