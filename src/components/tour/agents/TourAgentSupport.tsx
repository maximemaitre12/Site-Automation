import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, AlertTriangle, CheckCircle, Zap, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TourAgentWrapper } from './TourAgentWrapper';

interface TourAgentSupportProps {
  isActive?: boolean;
}

const tickets = [
  { id: '#4521', subject: 'Problème de facturation', priority: 'high', status: 'new', time: '2 min' },
  { id: '#4520', subject: 'Comment exporter mes données?', priority: 'medium', status: 'resolved', time: '15 min' },
  { id: '#4519', subject: 'Intégration API', priority: 'low', status: 'pending', time: '1h' },
];

export function TourAgentSupport({ isActive }: TourAgentSupportProps) {
  const [step, setStep] = useState(0);
  const [responseTimer, setResponseTimer] = useState(0);
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setStep(0);
      setResponseTimer(0);
      setShowResponse(false);
      return;
    }

    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setStep(1), 1000));
    timers.push(setTimeout(() => setStep(2), 2500));
    
    // Timer animation
    let counter = 0;
    const timerInterval = setInterval(() => {
      counter++;
      setResponseTimer(counter);
      if (counter >= 12) {
        clearInterval(timerInterval);
        setShowResponse(true);
      }
    }, 200);
    
    timers.push(setTimeout(() => setStep(3), 5000));

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(timerInterval);
    };
  }, [isActive]);

  return (
    <TourAgentWrapper title="Support" url="app.aether.ai/support/tickets">
      <div className="flex h-[480px]">
        {/* Sidebar */}
        <div className="w-48 border-r border-border bg-muted/30 p-3 space-y-1">
          <div className="text-xs font-medium text-muted-foreground mb-3 px-2">SUPPORT</div>
          {[
            { icon: MessageSquare, label: 'Tous les tickets', count: 156, active: true },
            { icon: AlertTriangle, label: 'Critiques', count: 3 },
            { icon: Clock, label: 'En attente', count: 12 },
            { icon: CheckCircle, label: 'Résolus', count: 141 },
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
                  item.label === 'Critiques' ? "bg-red-500/10 text-red-500" : "bg-muted"
                )}>
                  {item.count}
                </span>
              )}
            </div>
          ))}

          {/* Stats */}
          <div className="mt-6 pt-6 border-t border-border space-y-3">
            <div className="px-2">
              <div className="text-xs text-muted-foreground">Temps moyen</div>
              <div className="text-lg font-bold text-primary">12s</div>
            </div>
            <div className="px-2">
              <div className="text-xs text-muted-foreground">Résolution auto</div>
              <div className="text-lg font-bold text-green-500">72%</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex">
          {/* Tickets list */}
          <div className="w-72 border-r border-border p-3 space-y-2">
            <div className="text-sm font-medium mb-3">Tickets récents</div>
            {tickets.map((ticket, i) => (
              <div
                key={ticket.id}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-500 cursor-pointer",
                  i === 0 && step >= 1
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{ticket.id}</span>
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    ticket.priority === 'high' ? "bg-red-500/10 text-red-500" :
                    ticket.priority === 'medium' ? "bg-yellow-500/10 text-yellow-500" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {ticket.priority === 'high' ? 'Critique' : ticket.priority === 'medium' ? 'Moyen' : 'Faible'}
                  </span>
                </div>
                <div className="text-sm font-medium truncate">{ticket.subject}</div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{ticket.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Ticket detail */}
          <div className="flex-1 p-4 space-y-4 overflow-auto">
            {step >= 1 && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">#4521</div>
                    <h3 className="text-lg font-medium">Problème de facturation</h3>
                  </div>
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Priorité critique</span>
                  </div>
                </div>

                {/* Customer message */}
                <div className="p-4 bg-muted/50 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Client: Jean Dupont</div>
                      <div className="text-xs text-muted-foreground">Il y a 2 minutes</div>
                    </div>
                  </div>
                  <p className="text-sm">
                    Bonjour, j'ai été facturé deux fois ce mois-ci pour mon abonnement. 
                    Pouvez-vous vérifier et me rembourser le paiement en double? Merci.
                  </p>
                </div>

                {/* AI Processing */}
                {step >= 2 && !showResponse && (
                  <div className="p-4 border border-primary/30 bg-primary/5 rounded-lg animate-fade-in">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">IA en cours d'analyse...</div>
                        <div className="text-xs text-muted-foreground">
                          Classification: Facturation • Sentiment: Frustré
                        </div>
                      </div>
                      <div className="text-2xl font-mono font-bold text-primary">
                        {responseTimer}s
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-200"
                        style={{ width: `${(responseTimer / 12) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* AI Response */}
                {showResponse && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Réponse générée en 12 secondes</span>
                    </div>
                    
                    <div className="p-4 border border-green-500/30 bg-green-500/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Réponse IA</div>
                          <div className="text-xs text-muted-foreground">Générée automatiquement</div>
                        </div>
                      </div>
                      <p className="text-sm">
                        Bonjour Jean, je comprends votre frustration concernant ce double prélèvement. 
                        J'ai vérifié votre compte et je confirme qu'une erreur s'est produite. 
                        Le remboursement de 49€ a été initié et sera visible sous 3-5 jours ouvrés. 
                        Nous vous présentons nos excuses pour ce désagrément.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md">
                          Envoyer
                        </button>
                        <button className="px-3 py-1.5 border border-border text-sm rounded-md">
                          Modifier
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </TourAgentWrapper>
  );
}
