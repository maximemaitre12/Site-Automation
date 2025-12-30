import React, { useState, useEffect } from 'react';
import { Brain, Search, FileText, Image, Send, Sparkles, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TourAgentWrapper } from './TourAgentWrapper';

interface TourAgentBrainProps {
  isActive?: boolean;
}

const documents = [
  { name: 'Politique RH 2024.pdf', type: 'pdf', date: '15 jan' },
  { name: 'Guide Produit v3.docx', type: 'doc', date: '12 jan' },
  { name: 'FAQ Support.md', type: 'md', date: '10 jan' },
  { name: 'Process Onboarding.pdf', type: 'pdf', date: '8 jan' },
];

export function TourAgentBrain({ isActive }: TourAgentBrainProps) {
  const [step, setStep] = useState(0);
  const [typedQuery, setTypedQuery] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  
  const query = "Quelle est notre politique de remboursement?";

  useEffect(() => {
    if (!isActive) {
      setStep(0);
      setTypedQuery('');
      setShowResponse(false);
      return;
    }

    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setStep(1), 1000));
    
    // Typing effect
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex <= query.length) {
        setTypedQuery(query.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 60);
    
    timers.push(setTimeout(() => setStep(2), 4000));
    timers.push(setTimeout(() => setShowResponse(true), 5500));
    timers.push(setTimeout(() => setStep(3), 8000));

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(typingInterval);
    };
  }, [isActive]);

  return (
    <TourAgentWrapper title="Brain" url="app.aether.ai/brain">
      <div className="flex h-[480px]">
        {/* Sidebar - Documents */}
        <div className="w-56 border-r border-border bg-muted/30 p-3 space-y-3">
          <div className="flex items-center gap-2 px-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Base de connaissances</span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-border rounded-md"
            />
          </div>

          <div className="space-y-1">
            {documents.map((doc, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md text-sm transition-all duration-300",
                  step >= 2 && doc.name.includes('FAQ') 
                    ? "bg-primary/10 border border-primary/30" 
                    : "hover:bg-muted"
                )}
              >
                <FileText className={cn(
                  "w-4 h-4",
                  doc.type === 'pdf' ? "text-red-500" : 
                  doc.type === 'doc' ? "text-blue-500" : "text-muted-foreground"
                )} />
                <div className="flex-1 truncate">
                  <div className="truncate">{doc.name}</div>
                  <div className="text-xs text-muted-foreground">{doc.date}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground px-2 mb-2">Statistiques</div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-muted/50 rounded">
                <div className="text-lg font-bold">847</div>
                <div className="text-xs text-muted-foreground">Documents</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <div className="text-lg font-bold">12K</div>
                <div className="text-xs text-muted-foreground">Requêtes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-medium">AETHER Brain</div>
              <div className="text-xs text-muted-foreground">Intelligence collective de votre entreprise</div>
            </div>
          </div>

          {/* Chat content */}
          <div className="flex-1 p-4 space-y-4 overflow-auto">
            {/* User message */}
            {step >= 1 && (
              <div className="flex justify-end animate-fade-in">
                <div className="max-w-[80%] p-3 bg-primary text-primary-foreground rounded-2xl rounded-tr-sm">
                  <p className="text-sm">{typedQuery}<span className="animate-pulse">|</span></p>
                </div>
              </div>
            )}

            {/* AI thinking */}
            {step >= 2 && !showResponse && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="p-3 bg-muted rounded-2xl rounded-tl-sm">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span>Recherche dans 847 documents...</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Response */}
            {showResponse && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="max-w-[85%] space-y-3">
                  <div className="p-4 bg-muted rounded-2xl rounded-tl-sm">
                    <p className="text-sm leading-relaxed">
                      Selon notre <span className="text-primary font-medium">FAQ Support</span>, 
                      la politique de remboursement est la suivante:
                    </p>
                    <ul className="mt-3 space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                        <span>Remboursement intégral dans les 30 jours suivant l'achat</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                        <span>50% de remboursement entre 30 et 60 jours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                        <span>Aucun remboursement après 60 jours</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Sources */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="w-3 h-3" />
                    <span>Source: FAQ Support.md (page 12)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Image generation hint */}
            {step >= 3 && (
              <div className="flex gap-3 animate-fade-in mt-6">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Image className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="p-3 bg-muted/50 border border-dashed border-border rounded-lg text-sm text-muted-foreground">
                  <span className="text-primary font-medium">Astuce:</span> Je peux aussi générer des images. 
                  Essayez "Génère une illustration de notre politique de remboursement"
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
              <input
                type="text"
                placeholder="Posez une question..."
                className="flex-1 bg-transparent border-0 text-sm focus:outline-none"
              />
              <button className="p-2 bg-primary text-primary-foreground rounded-md">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </TourAgentWrapper>
  );
}
