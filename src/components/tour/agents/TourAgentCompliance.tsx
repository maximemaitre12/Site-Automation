import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, FileSearch, ClipboardList, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TourAgentWrapper } from './TourAgentWrapper';

interface TourAgentComplianceProps {
  isActive?: boolean;
}

const risks = [
  { title: 'Consentement cookies incomplet', severity: 'high', category: 'RGPD Art. 7' },
  { title: 'Durée de rétention non spécifiée', severity: 'medium', category: 'RGPD Art. 5' },
  { title: 'Transfert hors UE non documenté', severity: 'high', category: 'RGPD Art. 44' },
];

export function TourAgentCompliance({ isActive }: TourAgentComplianceProps) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setStep(0);
      setScore(0);
      setScanProgress(0);
      return;
    }

    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setStep(1), 1000));
    
    // Scan progress animation
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 100);
    
    timers.push(setTimeout(() => setStep(2), 3500));
    
    // Score animation
    timers.push(setTimeout(() => {
      let currentScore = 0;
      const scoreInterval = setInterval(() => {
        currentScore += 2;
        setScore(currentScore);
        if (currentScore >= 72) {
          clearInterval(scoreInterval);
        }
      }, 30);
    }, 4000));
    
    timers.push(setTimeout(() => setStep(3), 6000));

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, [isActive]);

  return (
    <TourAgentWrapper title="Compliance" url="app.aether.ai/compliance/audit">
      <div className="flex h-[480px]">
        {/* Sidebar */}
        <div className="w-48 border-r border-border bg-muted/30 p-3 space-y-1">
          <div className="text-xs font-medium text-muted-foreground mb-3 px-2">CONFORMITÉ</div>
          {[
            { icon: FileSearch, label: 'Nouvel Audit', active: true },
            { icon: ClipboardList, label: 'Rapports', count: 12 },
            { icon: Scale, label: 'Règlements' },
            { icon: AlertTriangle, label: 'Risques', count: 5 },
          ].map((item, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
                item.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="flex-1">{item.label}</span>
              {item.count && (
                <span className={cn(
                  "text-xs px-1.5 rounded",
                  item.label === 'Risques' ? "bg-red-500/10 text-red-500" : "bg-muted"
                )}>
                  {item.count}
                </span>
              )}
            </div>
          ))}

          {/* Quick stats */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="px-2 space-y-3">
              <div>
                <div className="text-xs text-muted-foreground">Score moyen</div>
                <div className="text-lg font-bold text-yellow-500">78%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Audits ce mois</div>
                <div className="text-lg font-bold">24</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Audit de Conformité</h2>
            <div className="flex gap-2">
              {['RGPD', 'Cookies', 'CGV', 'CCPA'].map((type, i) => (
                <button
                  key={type}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md transition-all",
                    i === 0 ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Document input area */}
          <div className={cn(
            "p-4 border-2 border-dashed rounded-lg transition-all",
            step >= 1 ? "border-primary/50 bg-primary/5" : "border-border"
          )}>
            <div className="text-sm text-muted-foreground mb-2">Document analysé:</div>
            <div className="p-3 bg-background rounded border border-border">
              <div className="text-sm font-medium">politique-confidentialite-2024.pdf</div>
              <div className="text-xs text-muted-foreground">2.4 MB • Téléversé il y a 2 min</div>
            </div>
          </div>

          {/* Scanning animation */}
          {step >= 1 && step < 2 && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Analyse RGPD en cours...</div>
                  <div className="text-xs text-muted-foreground">Vérification des 99 articles</div>
                </div>
                <div className="text-lg font-bold text-primary">{scanProgress}%</div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-100"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {step >= 2 && (
            <div className="space-y-4 animate-fade-in">
              {/* Score display */}
              <div className="flex items-center gap-6 p-4 bg-card border border-border rounded-lg">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={`${score * 2.51} 251`}
                      className={cn(
                        "transition-all duration-300",
                        score >= 80 ? "text-green-500" :
                        score >= 60 ? "text-yellow-500" : "text-red-500"
                      )}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn(
                      "text-2xl font-bold",
                      score >= 80 ? "text-green-500" :
                      score >= 60 ? "text-yellow-500" : "text-red-500"
                    )}>
                      {score}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold">Score de Conformité RGPD</div>
                  <div className="text-sm text-muted-foreground">3 risques identifiés • 12 articles vérifiés</div>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500">9 points conformes</span>
                  </div>
                </div>
              </div>

              {/* Risk list */}
              {step >= 3 && (
                <div className="space-y-2 animate-fade-in">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Risques détectés
                  </div>
                  {risks.map((risk, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "p-3 rounded-lg border flex items-center gap-3",
                        risk.severity === 'high' 
                          ? "bg-red-500/5 border-red-500/30" 
                          : "bg-yellow-500/5 border-yellow-500/30"
                      )}
                      style={{ animationDelay: `${i * 150}ms` }}
                    >
                      <AlertTriangle className={cn(
                        "w-4 h-4",
                        risk.severity === 'high' ? "text-red-500" : "text-yellow-500"
                      )} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{risk.title}</div>
                        <div className="text-xs text-muted-foreground">{risk.category}</div>
                      </div>
                      <button className="px-2 py-1 text-xs bg-background border border-border rounded hover:bg-muted">
                        Corriger
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </TourAgentWrapper>
  );
}
