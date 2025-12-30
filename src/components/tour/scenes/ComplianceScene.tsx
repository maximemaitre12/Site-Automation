import React, { useState, useEffect } from 'react';
import { Shield, FileSearch, AlertTriangle, CheckCircle, FileText, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedCursor } from '../core/AnimatedCursor';

interface ComplianceSceneProps {
  isActive: boolean;
  progress: number;
}

const risks = [
  { id: 1, text: 'Données personnelles non anonymisées', severity: 'high' },
  { id: 2, text: 'Consentement explicite manquant', severity: 'high' },
  { id: 3, text: 'Durée de conservation non spécifiée', severity: 'medium' },
];

export function ComplianceScene({ isActive, progress }: ComplianceSceneProps) {
  const [phase, setPhase] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 100, y: 100 });
  const [isClicking, setIsClicking] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [scoreValue, setScoreValue] = useState(0);
  const [showRisks, setShowRisks] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      setSelectedType('');
      setShowAnalysis(false);
      setAnalysisProgress(0);
      setShowScore(false);
      setScoreValue(0);
      setShowRisks(false);
      setShowRecommendations(false);
      return;
    }

    if (progress < 8) {
      setPhase(1);
    } else if (progress < 15) {
      setPhase(2);
      setCursorPos({ x: 350, y: 200 });
    } else if (progress < 20) {
      setPhase(3);
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 400);
      setSelectedType('RGPD');
    } else if (progress < 35) {
      setPhase(4);
      setCursorPos({ x: 500, y: 380 });
    } else if (progress < 40) {
      setPhase(5);
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 400);
    } else if (progress < 55) {
      setPhase(6);
      setShowAnalysis(true);
      setAnalysisProgress(Math.min((progress - 40) * 7, 100));
    } else if (progress < 70) {
      setPhase(7);
      setShowScore(true);
      const scoreProgress = (progress - 55) / 15;
      setScoreValue(Math.round(72 * scoreProgress));
    } else if (progress < 85) {
      setPhase(8);
      setScoreValue(72);
      setShowRisks(true);
    } else {
      setPhase(9);
      setShowRecommendations(true);
    }
  }, [isActive, progress]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <AnimatedCursor
        targetPosition={cursorPos}
        isClicking={isClicking}
        isVisible={phase >= 2 && phase < 7}
        duration={600}
      />

      {/* Compliance Interface */}
      <div 
        className={cn(
          "relative w-full max-w-5xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden transition-all duration-700",
          phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        style={{ height: '70vh', maxHeight: '600px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-agent-compliance/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-agent-compliance" />
            </div>
            <div>
              <h2 className="font-semibold">Agent Conformité</h2>
              <p className="text-xs text-muted-foreground">Audit automatisé</p>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-auto" style={{ height: 'calc(100% - 72px)' }}>
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Audit type selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">Type d'audit</label>
              <div className="grid grid-cols-3 gap-3">
                {['RGPD', 'ISO 27001', 'SOC 2'].map((type) => (
                  <button
                    key={type}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all text-sm font-medium",
                      selectedType === type 
                        ? "border-primary bg-primary/10 text-primary" 
                        : "border-border hover:border-primary/50",
                      phase >= 2 && phase < 4 && type === 'RGPD' && "ring-2 ring-primary/30 animate-element-highlight"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Document input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Document à analyser</label>
              <div 
                className={cn(
                  "p-4 rounded-xl border-2 border-dashed border-border min-h-32 transition-all",
                  phase >= 4 && phase < 6 && "border-primary bg-primary/5"
                )}
              >
                {phase >= 4 ? (
                  <div className="text-sm text-muted-foreground">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="text-center">Contrat_Fournisseur_2024.pdf</p>
                    <p className="text-center text-xs">12 pages • 2.4 MB</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Glissez un document ici...
                  </p>
                )}
              </div>
            </div>

            {/* Analyze button */}
            <button 
              className={cn(
                "w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 transition-all",
                phase >= 4 && phase < 6 && "ring-4 ring-primary/30"
              )}
            >
              <FileSearch className="w-5 h-5" />
              Analyser le document
            </button>

            {/* Analysis progress */}
            {showAnalysis && !showScore && (
              <div className="p-4 rounded-xl bg-muted/50 border border-border animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Analyse en cours...</span>
                  <span className="text-sm text-muted-foreground">{Math.round(analysisProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Score display */}
            {showScore && (
              <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Score de conformité</h3>
                    <p className="text-sm text-muted-foreground">Audit RGPD</p>
                  </div>
                  <div className="relative w-24 h-24">
                    {/* Circular progress */}
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="8"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--warning))"
                        strokeWidth="8"
                        strokeDasharray={`${(scoreValue / 100) * 251} 251`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{scoreValue}%</span>
                    </div>
                  </div>
                </div>

                {/* Risks list */}
                {showRisks && (
                  <div className="space-y-2 mt-4">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Risques détectés ({risks.length})
                    </h4>
                    {risks.map((risk, index) => (
                      <div 
                        key={risk.id}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg text-sm animate-stagger-in",
                          risk.severity === 'high' ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"
                        )}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        {risk.text}
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommendations */}
                {showRecommendations && (
                  <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 animate-fade-in">
                    <h4 className="text-sm font-medium flex items-center gap-2 text-green-600 mb-2">
                      <CheckCircle className="w-4 h-4" />
                      Recommandations
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Ajouter une clause de consentement explicite</li>
                      <li>• Anonymiser les données clients avant traitement</li>
                      <li>• Définir une durée de conservation de 3 ans max</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
