import React, { useState, useEffect } from 'react';
import { Brain, Search, FileText, MessageSquare, Sparkles, Send, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedCursor } from '../core/AnimatedCursor';
import { TypeWriter } from '../core/TypeWriter';

interface BrainSceneProps {
  isActive: boolean;
  progress: number;
}

const documents = [
  { name: 'Politique RH.pdf', pages: 45 },
  { name: 'Contrat type.docx', pages: 12 },
  { name: 'FAQ Produit.pdf', pages: 28 },
  { name: 'Guide onboarding.pdf', pages: 15 },
];

export function BrainScene({ isActive, progress }: BrainSceneProps) {
  const [phase, setPhase] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 100, y: 100 });
  const [isClicking, setIsClicking] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showSources, setShowSources] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      setShowTyping(false);
      setShowThinking(false);
      setShowResponse(false);
      setShowSources(false);
      return;
    }

    if (progress < 8) {
      setPhase(1);
    } else if (progress < 15) {
      setPhase(2);
      setCursorPos({ x: 500, y: 450 });
    } else if (progress < 40) {
      setPhase(3);
      setShowTyping(true);
    } else if (progress < 50) {
      setPhase(4);
      setCursorPos({ x: 780, y: 450 });
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 400);
    } else if (progress < 60) {
      setPhase(5);
      setShowThinking(true);
    } else if (progress < 85) {
      setPhase(6);
      setShowThinking(false);
      setShowResponse(true);
    } else {
      setPhase(7);
      setShowSources(true);
    }
  }, [isActive, progress]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <AnimatedCursor
        targetPosition={cursorPos}
        isClicking={isClicking}
        isVisible={phase >= 2 && phase < 6}
        duration={600}
      />

      {/* Brain Interface */}
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
            <div className="w-10 h-10 rounded-xl bg-agent-brain/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-agent-brain" />
            </div>
            <div>
              <h2 className="font-semibold">Brain</h2>
              <p className="text-xs text-muted-foreground">Intelligence collective</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm">
            <Search className="w-4 h-4" />
            <span className="text-muted-foreground">Rechercher...</span>
          </div>
        </div>

        <div className="flex h-full">
          {/* Documents sidebar */}
          <div className="w-64 border-r border-border p-4 bg-muted/10">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </h3>
            
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <div 
                  key={doc.name}
                  className="p-2.5 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors animate-stagger-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.pages} pages</p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-primary font-medium">4 documents indexés</p>
              <p className="text-xs text-muted-foreground">100 pages analysées</p>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6 overflow-auto">
              {/* Welcome message */}
              <div className="text-center text-muted-foreground mb-6">
                <Brain className="w-12 h-12 mx-auto mb-2 text-agent-brain/50" />
                <p>Posez une question sur vos documents</p>
              </div>

              {/* User question */}
              {showTyping && (
                <div className="flex justify-end mb-4 animate-fade-in">
                  <div className="max-w-md p-4 rounded-2xl rounded-br-none bg-primary text-primary-foreground">
                    <TypeWriter
                      text="Quelle est notre politique de remboursement ?"
                      speed={40}
                      isActive={phase >= 3}
                      showCursor={phase < 4}
                    />
                  </div>
                </div>
              )}

              {/* Thinking indicator */}
              {showThinking && (
                <div className="flex gap-3 mb-4 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-agent-brain/20 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-agent-brain animate-pulse" />
                  </div>
                  <div className="p-4 rounded-2xl rounded-bl-none bg-muted/50 border border-border">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm text-muted-foreground">Recherche dans 4 documents...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Response */}
              {showResponse && (
                <div className="flex gap-3 mb-4 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-agent-brain/20 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-agent-brain" />
                  </div>
                  <div className="flex-1 max-w-2xl">
                    <div className="p-4 rounded-2xl rounded-bl-none bg-muted/50 border border-border mb-2">
                      <TypeWriter
                        text="Selon notre politique RH (page 12), les remboursements sont accordés dans les 30 jours suivant l'achat, sur présentation du justificatif. Pour les abonnements annuels, un remboursement au prorata est possible pendant les 3 premiers mois."
                        speed={15}
                        isActive={phase >= 6}
                        showCursor={phase < 7}
                      />
                    </div>

                    {/* Sources */}
                    {showSources && (
                      <div className="animate-stagger-in">
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                          <Link2 className="w-3 h-3" />
                          Sources
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 rounded-md text-xs bg-primary/10 text-primary border border-primary/20 animate-stagger-in">
                            📄 Politique RH.pdf - p.12
                          </span>
                          <span className="px-2 py-1 rounded-md text-xs bg-primary/10 text-primary border border-primary/20 animate-stagger-in" style={{ animationDelay: '100ms' }}>
                            📄 FAQ Produit.pdf - p.8
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-border">
              <div 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border transition-all",
                  phase >= 2 && phase < 5 && "ring-2 ring-primary"
                )}
              >
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1 text-muted-foreground">
                  {showTyping ? '' : 'Posez votre question...'}
                </span>
                <button className="p-2 rounded-lg bg-primary text-primary-foreground">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
