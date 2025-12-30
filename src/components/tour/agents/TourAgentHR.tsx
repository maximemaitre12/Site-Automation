import React, { useState, useEffect } from 'react';
import { Users, FileText, Calendar, Star, CheckCircle, Clock, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TourAgentWrapper } from './TourAgentWrapper';

interface TourAgentHRProps {
  isActive?: boolean;
}

const candidates = [
  { id: 1, name: 'Marie Dupont', role: 'Senior Developer', score: 95, status: 'Entretien planifié', avatar: 'MD' },
  { id: 2, name: 'Thomas Martin', role: 'Product Manager', score: 88, status: 'CV analysé', avatar: 'TM' },
  { id: 3, name: 'Sophie Bernard', role: 'UX Designer', score: 92, status: 'Nouveau', avatar: 'SB' },
];

export function TourAgentHR({ isActive }: TourAgentHRProps) {
  const [analysisStep, setAnalysisStep] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setAnalysisStep(0);
      setShowScore(false);
      setSelectedCandidate(0);
      return;
    }

    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setAnalysisStep(1), 1000));
    timers.push(setTimeout(() => setAnalysisStep(2), 2500));
    timers.push(setTimeout(() => setShowScore(true), 3500));
    timers.push(setTimeout(() => setSelectedCandidate(1), 5000));
    timers.push(setTimeout(() => setAnalysisStep(3), 6500));

    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  return (
    <TourAgentWrapper title="HR" url="app.aether.ai/hr/recrutement">
      <div className="flex h-[480px]">
        {/* Sidebar */}
        <div className="w-48 border-r border-border bg-muted/30 p-3 space-y-1">
          <div className="text-xs font-medium text-muted-foreground mb-3 px-2">RECRUTEMENT</div>
          {[
            { icon: Users, label: 'Candidats', count: 24, active: true },
            { icon: Briefcase, label: 'Postes', count: 5 },
            { icon: Calendar, label: 'Entretiens', count: 8 },
            { icon: FileText, label: 'Templates' },
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
              {item.count && <span className="text-xs bg-muted px-1.5 rounded">{item.count}</span>}
            </div>
          ))}
          
          <div className="text-xs font-medium text-muted-foreground mt-6 mb-3 px-2">ÉQUIPE</div>
          {[
            { icon: Users, label: 'Employés', count: 47 },
            { icon: Star, label: 'Performance' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted">
              <item.icon className="w-4 h-4" />
              <span className="flex-1">{item.label}</span>
              {item.count && <span className="text-xs bg-muted px-1.5 rounded">{item.count}</span>}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 space-y-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pipeline Candidats</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md">
                + Ajouter
              </button>
            </div>
          </div>

          {/* Candidates list */}
          <div className="space-y-3">
            {candidates.map((candidate, i) => (
              <div
                key={candidate.id}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-500",
                  selectedCandidate === i 
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-sm font-medium">
                    {candidate.avatar}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="font-medium">{candidate.name}</div>
                    <div className="text-sm text-muted-foreground">{candidate.role}</div>
                  </div>

                  {/* Score */}
                  {(i === 0 || (i === selectedCandidate && showScore)) && (
                    <div className={cn(
                      "flex items-center gap-2 transition-all duration-700",
                      i === selectedCandidate && showScore ? "animate-fade-in" : ""
                    )}>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Match IA</div>
                        <div className={cn(
                          "text-lg font-bold",
                          candidate.score >= 90 ? "text-green-500" : "text-yellow-500"
                        )}>
                          {candidate.score}%
                        </div>
                      </div>
                      <div className={cn(
                        "w-12 h-12 rounded-full border-4 flex items-center justify-center",
                        candidate.score >= 90 ? "border-green-500/30" : "border-yellow-500/30"
                      )}>
                        <Star className={cn(
                          "w-5 h-5",
                          candidate.score >= 90 ? "text-green-500" : "text-yellow-500"
                        )} />
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    candidate.status === 'Nouveau' ? "bg-blue-500/10 text-blue-500" :
                    candidate.status === 'CV analysé' ? "bg-yellow-500/10 text-yellow-500" :
                    "bg-green-500/10 text-green-500"
                  )}>
                    {candidate.status}
                  </div>
                </div>

                {/* Analysis in progress */}
                {i === selectedCandidate && analysisStep >= 1 && analysisStep < 3 && (
                  <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>
                        {analysisStep === 1 && "Analyse du CV en cours..."}
                        {analysisStep === 2 && "Évaluation des compétences..."}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 ease-out"
                        style={{ width: analysisStep === 1 ? '40%' : '80%' }}
                      />
                    </div>
                  </div>
                )}

                {/* Analysis complete */}
                {i === selectedCandidate && analysisStep >= 3 && (
                  <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                    <div className="flex items-center gap-2 text-sm text-green-500 mb-3">
                      <CheckCircle className="w-4 h-4" />
                      <span>Analyse complète</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="p-2 bg-muted/50 rounded">
                        <div className="text-muted-foreground">Expérience</div>
                        <div className="font-medium">8 ans</div>
                      </div>
                      <div className="p-2 bg-muted/50 rounded">
                        <div className="text-muted-foreground">Compétences</div>
                        <div className="font-medium">12 matchs</div>
                      </div>
                      <div className="p-2 bg-muted/50 rounded">
                        <div className="text-muted-foreground">Disponibilité</div>
                        <div className="font-medium">Immédiate</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </TourAgentWrapper>
  );
}
