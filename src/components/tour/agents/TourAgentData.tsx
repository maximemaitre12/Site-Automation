import React, { useState, useEffect } from 'react';
import { Building2, TrendingUp, AlertCircle, Search, Globe, Users, DollarSign, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TourAgentWrapper } from './TourAgentWrapper';

interface TourAgentDataProps {
  isActive?: boolean;
}

const companies = [
  { id: 1, name: 'TechCorp Industries', domain: 'techcorp.com', employees: '2,500', revenue: '45M€', status: 'enriched' },
  { id: 2, name: 'StartupXYZ', domain: 'startupxyz.io', employees: '85', revenue: '3M€', status: 'enriched' },
  { id: 3, name: 'GlobalTrade SA', domain: 'globaltrade.eu', employees: null, revenue: null, status: 'pending' },
];

export function TourAgentData({ isActive }: TourAgentDataProps) {
  const [step, setStep] = useState(0);
  const [enrichProgress, setEnrichProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setStep(0);
      setEnrichProgress(0);
      setShowAlert(false);
      return;
    }

    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setStep(1), 1000));
    timers.push(setTimeout(() => setStep(2), 2500));
    
    // Enrichment progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      setEnrichProgress(progress);
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 150);
    
    timers.push(setTimeout(() => setStep(3), 4500));
    timers.push(setTimeout(() => setShowAlert(true), 6000));

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, [isActive]);

  return (
    <TourAgentWrapper title="Data" url="app.aether.ai/data/companies">
      <div className="flex h-[480px]">
        {/* Sidebar */}
        <div className="w-48 border-r border-border bg-muted/30 p-3 space-y-1">
          <div className="text-xs font-medium text-muted-foreground mb-3 px-2">DATA PLATFORM</div>
          {[
            { icon: Building2, label: 'Entreprises', count: 847, active: true },
            { icon: Globe, label: 'Sources', count: 12 },
            { icon: TrendingUp, label: 'Analytics' },
            { icon: AlertCircle, label: 'Alertes', count: 3 },
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
                  item.label === 'Alertes' ? "bg-yellow-500/10 text-yellow-500" : "bg-muted"
                )}>
                  {item.count}
                </span>
              )}
            </div>
          ))}

          {/* Quick stats */}
          <div className="mt-6 pt-6 border-t border-border space-y-3">
            <div className="px-2">
              <div className="text-xs text-muted-foreground">Enrichissement</div>
              <div className="text-lg font-bold text-green-500">94%</div>
            </div>
            <div className="px-2">
              <div className="text-xs text-muted-foreground">Mises à jour</div>
              <div className="text-lg font-bold">Temps réel</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher une entreprise..."
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm"
              />
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Enrichir
            </button>
          </div>

          {/* Companies list */}
          <div className="space-y-2">
            {companies.map((company, i) => (
              <div
                key={company.id}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-500",
                  step >= 1 && i === 2 ? "border-primary bg-primary/5" : "border-border bg-card"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Logo placeholder */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{company.name}</span>
                      {company.status === 'enriched' && (
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs rounded-full">
                          Enrichi
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{company.domain}</div>
                  </div>

                  {/* Stats */}
                  {company.employees ? (
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-3 h-3" />
                          <span>Employés</span>
                        </div>
                        <div className="font-bold">{company.employees}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="w-3 h-3" />
                          <span>CA</span>
                        </div>
                        <div className="font-bold">{company.revenue}</div>
                      </div>
                    </div>
                  ) : step >= 2 && i === 2 ? (
                    <div className="flex items-center gap-3">
                      <div className="text-sm">
                        <div className="text-muted-foreground mb-1">Enrichissement...</div>
                        <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-150"
                            style={{ width: `${enrichProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button className="px-3 py-1.5 border border-border text-sm rounded-md hover:bg-muted">
                      Enrichir
                    </button>
                  )}
                </div>

                {/* Enriched data for GlobalTrade */}
                {step >= 3 && i === 2 && (
                  <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Employés</div>
                        <div className="font-bold text-lg">1,250</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">CA 2024</div>
                        <div className="font-bold text-lg text-green-500">28M€</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Croissance</div>
                        <div className="font-bold text-lg text-green-500">+34%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Secteur</div>
                        <div className="font-bold">Commerce B2B</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Alert */}
          {showAlert && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg animate-fade-in flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-600">Nouvelle alerte détectée</div>
                <div className="text-sm text-muted-foreground mt-1">
                  GlobalTrade SA vient d'annoncer une levée de fonds de 15M€. 
                  <span className="text-primary cursor-pointer hover:underline ml-1">Voir les détails →</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TourAgentWrapper>
  );
}
