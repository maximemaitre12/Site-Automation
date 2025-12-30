import React, { useState, useEffect } from 'react';
import { Database, Search, Building2, TrendingUp, Users, DollarSign, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedCursor } from '../core/AnimatedCursor';
import { TypeWriter } from '../core/TypeWriter';

interface DataSceneProps {
  isActive: boolean;
  progress: number;
}

const companies = [
  { id: 1, name: 'TechCorp', industry: 'SaaS', employees: 250, revenue: '12M€' },
  { id: 2, name: 'DataFlow', industry: 'Analytics', employees: 180, revenue: '8M€' },
  { id: 3, name: 'CloudFirst', industry: 'Cloud', employees: 320, revenue: '25M€' },
];

export function DataScene({ isActive, progress }: DataSceneProps) {
  const [phase, setPhase] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 100, y: 100 });
  const [isClicking, setIsClicking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<typeof companies[0] | null>(null);
  const [showEnrichment, setShowEnrichment] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      setSearchQuery('');
      setSelectedCompany(null);
      setShowEnrichment(false);
      setShowChart(false);
      setShowAlert(false);
      return;
    }

    if (progress < 8) {
      setPhase(1);
    } else if (progress < 15) {
      setPhase(2);
      setCursorPos({ x: 400, y: 150 });
    } else if (progress < 30) {
      setPhase(3);
      setSearchQuery('TechCorp');
    } else if (progress < 40) {
      setPhase(4);
      setCursorPos({ x: 300, y: 280 });
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 400);
      setSelectedCompany(companies[0]);
    } else if (progress < 55) {
      setPhase(5);
      setShowEnrichment(true);
    } else if (progress < 75) {
      setPhase(6);
      setShowChart(true);
    } else if (progress < 90) {
      setPhase(7);
      setShowAlert(true);
    } else {
      setPhase(8);
    }
  }, [isActive, progress]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <AnimatedCursor
        targetPosition={cursorPos}
        isClicking={isClicking}
        isVisible={phase >= 2 && phase < 5}
        duration={600}
      />

      {/* Data Interface */}
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
            <div className="w-10 h-10 rounded-xl bg-agent-data/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-agent-data" />
            </div>
            <div>
              <h2 className="font-semibold">Data Platform</h2>
              <p className="text-xs text-muted-foreground">Intelligence d'entreprise</p>
            </div>
          </div>

          {/* Search bar */}
          <div 
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border w-72 transition-all",
              phase >= 2 && phase < 4 && "ring-2 ring-primary"
            )}
          >
            <Search className="w-4 h-4 text-muted-foreground" />
            {phase >= 3 ? (
              <TypeWriter 
                text={searchQuery}
                speed={80}
                isActive={phase >= 3}
                showCursor={phase < 4}
                className="text-sm"
              />
            ) : (
              <span className="text-sm text-muted-foreground">Rechercher une entreprise...</span>
            )}
          </div>
        </div>

        <div className="flex h-full">
          {/* Companies list */}
          <div className={cn(
            "w-80 border-r border-border p-4 transition-all duration-500",
            selectedCompany ? "opacity-50" : "opacity-100"
          )}>
            <h3 className="text-sm font-semibold mb-3">Entreprises suivies</h3>
            
            <div className="space-y-2">
              {companies.map((company, index) => (
                <div 
                  key={company.id}
                  className={cn(
                    "p-3 rounded-xl border transition-all cursor-pointer",
                    selectedCompany?.id === company.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border/50 hover:border-border",
                    phase >= 3 && phase < 5 && index === 0 && "ring-2 ring-primary/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-xs text-muted-foreground">{company.industry}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company detail */}
          <div className="flex-1 p-6 overflow-auto">
            {selectedCompany ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedCompany.name}</h2>
                      <p className="text-muted-foreground">{selectedCompany.industry}</p>
                    </div>
                  </div>
                  
                  {showEnrichment && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm animate-zoom-in">
                      <Sparkles className="w-4 h-4" />
                      Enrichi par IA
                    </div>
                  )}
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border animate-stagger-in">
                    <Users className="w-5 h-5 text-muted-foreground mb-2" />
                    <p className="text-2xl font-bold">{selectedCompany.employees}</p>
                    <p className="text-sm text-muted-foreground">Employés</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border animate-stagger-in" style={{ animationDelay: '100ms' }}>
                    <DollarSign className="w-5 h-5 text-muted-foreground mb-2" />
                    <p className="text-2xl font-bold">{selectedCompany.revenue}</p>
                    <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border animate-stagger-in" style={{ animationDelay: '200ms' }}>
                    <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
                    <p className="text-2xl font-bold text-green-500">+24%</p>
                    <p className="text-sm text-muted-foreground">Croissance</p>
                  </div>
                </div>

                {/* Revenue chart */}
                {showChart && (
                  <div className="p-4 rounded-xl bg-muted/30 border border-border animate-fade-in">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Évolution du CA
                    </h3>
                    <div className="h-32 flex items-end gap-3">
                      {[40, 55, 45, 60, 70, 65, 80, 75, 90, 85, 95, 100].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-primary/60 rounded-t-sm transition-all animate-stagger-in"
                          style={{ 
                            height: `${height}%`,
                            animationDelay: `${i * 50}ms`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Jan</span>
                      <span>Déc</span>
                    </div>
                  </div>
                )}

                {/* Alert */}
                {showAlert && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 animate-zoom-in">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-600">Nouvelle levée de fonds détectée</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          TechCorp vient d'annoncer une levée de 15M€ en Série B. 
                          <a href="#" className="text-primary ml-1 inline-flex items-center gap-1">
                            Voir l'article <ExternalLink className="w-3 h-3" />
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Sélectionnez une entreprise pour voir les détails</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
