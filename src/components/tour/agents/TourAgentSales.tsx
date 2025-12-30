import React, { useState, useEffect } from 'react';
import { TrendingUp, Phone, FileText, Target, DollarSign, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TourAgentWrapper } from './TourAgentWrapper';

interface TourAgentSalesProps {
  isActive?: boolean;
}

const deals = [
  { id: 1, name: 'TechCorp SaaS', value: '120K€', stage: 'Négociation', probability: 85, contact: 'J. Martin' },
  { id: 2, name: 'StartupXYZ', value: '45K€', stage: 'Proposition', probability: 60, contact: 'M. Dubois' },
  { id: 3, name: 'Enterprise Ltd', value: '250K€', stage: 'Découverte', probability: 35, contact: 'S. Laurent' },
];

const stages = ['Découverte', 'Qualification', 'Proposition', 'Négociation', 'Gagné'];

export function TourAgentSales({ isActive }: TourAgentSalesProps) {
  const [step, setStep] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showProposal, setShowProposal] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setStep(0);
      setShowAnalysis(false);
      setShowProposal(false);
      return;
    }

    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setStep(1), 1000));
    timers.push(setTimeout(() => setStep(2), 2500));
    timers.push(setTimeout(() => setShowAnalysis(true), 4000));
    timers.push(setTimeout(() => setShowProposal(true), 6500));

    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  return (
    <TourAgentWrapper title="Sales" url="app.aether.ai/sales/pipeline">
      <div className="flex h-[480px]">
        {/* Sidebar */}
        <div className="w-48 border-r border-border bg-muted/30 p-3 space-y-1">
          <div className="text-xs font-medium text-muted-foreground mb-3 px-2">COMMERCIAL</div>
          {[
            { icon: Target, label: 'Pipeline', active: true },
            { icon: Phone, label: 'Appels', count: 12 },
            { icon: FileText, label: 'Propositions' },
            { icon: TrendingUp, label: 'Analytics' },
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
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 space-y-4 overflow-hidden">
          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Pipeline', value: '415K€', icon: DollarSign },
              { label: 'Ce mois', value: '89K€', icon: TrendingUp, trend: '+23%' },
              { label: 'Deals actifs', value: '24', icon: Target },
              { label: 'Taux conversion', value: '34%', icon: ArrowRight },
            ].map((stat, i) => (
              <div key={i} className="p-3 bg-card rounded-lg border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <stat.icon className="w-4 h-4" />
                  <span className="text-xs">{stat.label}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">{stat.value}</span>
                  {stat.trend && <span className="text-xs text-green-500">{stat.trend}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline Kanban */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {stages.slice(0, 4).map((stage, stageIndex) => (
              <div key={stage} className="min-w-[180px] flex-1">
                <div className="text-sm font-medium text-muted-foreground mb-2 px-1">
                  {stage}
                </div>
                <div className="space-y-2">
                  {deals
                    .filter(d => d.stage === stage)
                    .map((deal, i) => (
                      <div
                        key={deal.id}
                        className={cn(
                          "p-3 bg-card rounded-lg border transition-all duration-500",
                          step >= 1 && deal.name === 'TechCorp SaaS'
                            ? "border-primary shadow-lg shadow-primary/10"
                            : "border-border"
                        )}
                      >
                        <div className="font-medium text-sm">{deal.name}</div>
                        <div className="text-lg font-bold text-primary mt-1">{deal.value}</div>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>{deal.contact}</span>
                          <span className={cn(
                            "px-1.5 py-0.5 rounded",
                            deal.probability >= 70 ? "bg-green-500/10 text-green-500" :
                            deal.probability >= 50 ? "bg-yellow-500/10 text-yellow-500" :
                            "bg-muted"
                          )}>
                            {deal.probability}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* AI Analysis Panel */}
          {showAnalysis && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-primary" />
                </div>
                <span className="font-medium">Analyse IA - TechCorp SaaS</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">Probabilité</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[85%]" />
                    </div>
                    <span className="font-bold text-green-500">85%</span>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Sentiment</div>
                  <span className="text-green-500 font-medium">Très positif</span>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Action suggérée</div>
                  <span className="font-medium">Envoyer proposition finale</span>
                </div>
              </div>

              {showProposal && (
                <div className="mt-4 pt-4 border-t border-primary/20 animate-fade-in">
                  <button className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Générer Proposition IA
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </TourAgentWrapper>
  );
}
