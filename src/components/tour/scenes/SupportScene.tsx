import React, { useState, useEffect } from 'react';
import { Headphones, MessageSquare, Clock, CheckCircle, AlertCircle, Sparkles, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedCursor } from '../core/AnimatedCursor';
import { TypeWriter } from '../core/TypeWriter';

interface SupportSceneProps {
  isActive: boolean;
  progress: number;
}

const existingTickets = [
  { id: 1, subject: 'Problème de connexion', status: 'Résolu', priority: 'Moyenne' },
  { id: 2, subject: 'Question facturation', status: 'En cours', priority: 'Haute' },
];

export function SupportScene({ isActive, progress }: SupportSceneProps) {
  const [phase, setPhase] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 100, y: 100 });
  const [isClicking, setIsClicking] = useState(false);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(false);
  const [showClassification, setShowClassification] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      setShowNewTicket(false);
      setSelectedTicket(false);
      setShowClassification(false);
      setShowResponse(false);
      setShowResolved(false);
      return;
    }

    if (progress < 8) {
      setPhase(1);
    } else if (progress < 15) {
      setPhase(2);
      setShowNewTicket(true);
    } else if (progress < 25) {
      setPhase(3);
      setCursorPos({ x: 400, y: 350 });
    } else if (progress < 30) {
      setPhase(4);
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 400);
      setSelectedTicket(true);
    } else if (progress < 45) {
      setPhase(5);
      setShowClassification(true);
    } else if (progress < 70) {
      setPhase(6);
      setShowResponse(true);
    } else if (progress < 90) {
      setPhase(7);
      setCursorPos({ x: 700, y: 500 });
    } else {
      setPhase(8);
      setShowResolved(true);
    }
  }, [isActive, progress]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <AnimatedCursor
        targetPosition={cursorPos}
        isClicking={isClicking}
        isVisible={phase >= 3 && phase < 8}
        duration={600}
        mode="container"
      />

      {/* Support Interface */}
      <div 
        className={cn(
          "relative w-full max-w-5xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden transition-all duration-700",
          phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        style={{ height: 'min(70vh, 100%)', maxHeight: 'min(600px, 100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-agent-support/20 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-agent-support" />
            </div>
            <div>
              <h2 className="font-semibold">Agent Support</h2>
              <p className="text-xs text-muted-foreground">Assistance automatisée</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span><strong>12s</strong> temps moyen</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span><strong>72%</strong> auto-résolu</span>
            </div>
          </div>
        </div>

        {/* New ticket notification */}
        {showNewTicket && (
          <div 
            className={cn(
              "absolute top-20 right-6 z-10 bg-destructive text-destructive-foreground px-4 py-3 rounded-xl shadow-lg animate-slide-in-left",
              phase >= 3 && "opacity-50"
            )}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Nouveau ticket urgent!</span>
            </div>
          </div>
        )}

        <div className="flex h-full">
          {/* Tickets list */}
          <div className="w-80 border-r border-border p-4 overflow-auto">
            <h3 className="text-sm font-semibold mb-3">Tickets</h3>
            
            <div className="space-y-2">
              {/* New urgent ticket */}
              {showNewTicket && (
                <div 
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all",
                    selectedTicket 
                      ? "border-primary bg-primary/5" 
                      : "border-destructive/50 bg-destructive/5 animate-pulse",
                    phase >= 3 && phase < 5 && "ring-2 ring-primary/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">Erreur paiement</span>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-destructive text-destructive-foreground">
                      Urgent
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    "Je n'arrive pas à effectuer mon paiement, j'ai un message d'erreur..."
                  </p>
                </div>
              )}

              {existingTickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  className="p-3 rounded-xl border border-border/50 opacity-60"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{ticket.subject}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs",
                      ticket.status === 'Résolu' 
                        ? "bg-green-500/20 text-green-600" 
                        : "bg-amber-500/20 text-amber-600"
                    )}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket detail */}
          <div className="flex-1 p-6">
            {selectedTicket && (
              <div className="space-y-4">
                {/* Customer message */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-muted/50 border border-border">
                    <p className="text-sm">
                      "Je n'arrive pas à effectuer mon paiement. J'ai le message d'erreur 'Transaction refusée'. 
                      Pouvez-vous m'aider rapidement ? C'est urgent car mon abonnement expire demain."
                    </p>
                  </div>
                </div>

                {/* AI Classification */}
                {showClassification && (
                  <div className="ml-11 p-4 rounded-xl bg-primary/5 border border-primary/20 animate-fade-in">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm">Analyse IA</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-600 animate-stagger-in">
                        Catégorie: Facturation
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs bg-red-500/20 text-red-600 animate-stagger-in" style={{ animationDelay: '100ms' }}>
                        Priorité: Haute
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-600 animate-stagger-in" style={{ animationDelay: '200ms' }}>
                        Sentiment: Frustré
                      </span>
                    </div>
                  </div>
                )}

                {/* AI Generated response */}
                {showResponse && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-3">
                        <p className="text-sm">
                          <TypeWriter
                            text="Bonjour, je comprends votre frustration. J'ai vérifié votre compte et le problème vient d'une carte expirée. J'ai prolongé votre abonnement de 24h gratuitement pendant que vous mettez à jour vos informations de paiement. Voici le lien direct: [Mettre à jour la carte]. N'hésitez pas si vous avez des questions !"
                            speed={20}
                            isActive={phase >= 6}
                            showCursor={phase < 7}
                          />
                        </p>
                      </div>
                      
                      {phase >= 7 && (
                        <button 
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium",
                            phase >= 7 && phase < 8 && "ring-4 ring-primary/30 animate-element-highlight"
                          )}
                        >
                          <Send className="w-4 h-4" />
                          Envoyer la réponse
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Resolution confirmation */}
                {showResolved && (
                  <div className="ml-11 p-4 rounded-xl bg-green-500/10 border border-green-500/30 animate-zoom-in">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Résolu en 12 secondes</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Le client a reçu une solution personnalisée et son abonnement est prolongé.
                    </p>
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
