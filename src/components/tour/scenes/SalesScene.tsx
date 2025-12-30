import React, { useState, useEffect } from 'react';
import { TrendingUp, Phone, FileText, DollarSign, BarChart3, Play, Square, Sparkles, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedCursor } from '../core/AnimatedCursor';
import { TypeWriter } from '../core/TypeWriter';

interface SalesSceneProps {
  isActive: boolean;
  progress: number;
}

const deals = [
  { id: 1, name: 'TechCorp', value: '45K€', stage: 'Négociation', probability: 75 },
  { id: 2, name: 'DataFlow Inc', value: '120K€', stage: 'Proposition', probability: 60 },
  { id: 3, name: 'CloudFirst', value: '85K€', stage: 'Découverte', probability: 40 },
];

export function SalesScene({ isActive, progress }: SalesSceneProps) {
  const [phase, setPhase] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 100, y: 100 });
  const [isClicking, setIsClicking] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<typeof deals[0] | null>(null);
  const [showRecording, setShowRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisScore, setAnalysisScore] = useState(0);
  const [showProposal, setShowProposal] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      setSelectedDeal(null);
      setShowRecording(false);
      setRecordingTime(0);
      setShowTranscript(false);
      setShowAnalysis(false);
      setAnalysisScore(0);
      setShowProposal(false);
      return;
    }

    // Animation phases
    if (progress < 8) {
      setPhase(1); // Interface appears
    } else if (progress < 15) {
      setPhase(2); // Cursor moves to deal
      setCursorPos({ x: 300, y: 280 });
    } else if (progress < 20) {
      setPhase(3); // Click on deal
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 400);
      setSelectedDeal(deals[0]);
    } else if (progress < 30) {
      setPhase(4); // Panel opens, cursor to call button
      setCursorPos({ x: 750, y: 220 });
    } else if (progress < 35) {
      setPhase(5); // Click record
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 400);
    } else if (progress < 50) {
      setPhase(6); // Recording
      setShowRecording(true);
      setRecordingTime(Math.floor((progress - 35) * 2));
    } else if (progress < 60) {
      setPhase(7); // Stop, show transcript
      setShowRecording(false);
      setShowTranscript(true);
    } else if (progress < 75) {
      setPhase(8); // AI Analysis
      setShowAnalysis(true);
      const scoreProgress = (progress - 60) / 15;
      setAnalysisScore(Math.round(87 * scoreProgress));
    } else if (progress < 90) {
      setPhase(9); // Generate proposal
      setCursorPos({ x: 750, y: 450 });
      setShowProposal(true);
    } else {
      setPhase(10); // Final
      setAnalysisScore(87);
    }
  }, [isActive, progress]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <AnimatedCursor
        targetPosition={cursorPos}
        isClicking={isClicking}
        isVisible={phase >= 2 && phase < 10}
        duration={600}
      />

      {/* Sales Interface */}
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
            <div className="w-10 h-10 rounded-xl bg-agent-sales/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-agent-sales" />
            </div>
            <div>
              <h2 className="font-semibold">Agent Ventes</h2>
              <p className="text-xs text-muted-foreground">Pipeline intelligent</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="font-semibold">250K€</span>
            <span className="text-muted-foreground">pipeline</span>
          </div>
        </div>

        <div className="flex h-full">
          {/* Pipeline */}
          <div className="w-96 border-r border-border p-4 overflow-auto">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Pipeline actif
            </h3>
            
            <div className="space-y-2">
              {deals.map((deal, index) => (
                <div 
                  key={deal.id}
                  className={cn(
                    "p-3 rounded-xl border transition-all cursor-pointer",
                    selectedDeal?.id === deal.id 
                      ? "border-primary bg-primary/5 shadow-md" 
                      : "border-border/50 hover:border-border",
                    phase >= 2 && phase < 4 && index === 0 && "ring-2 ring-primary/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{deal.name}</span>
                    <span className="font-bold text-primary">{deal.value}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{deal.stage}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <span className="text-xs">{deal.probability}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deal detail panel */}
          <div className={cn(
            "flex-1 p-6 transition-all duration-500",
            selectedDeal ? "opacity-100" : "opacity-30"
          )}>
            {selectedDeal && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold">{selectedDeal.name}</h3>
                    <p className="text-muted-foreground">Deal: {selectedDeal.value}</p>
                  </div>
                  <button 
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      showRecording 
                        ? "bg-red-500 text-white" 
                        : "bg-primary text-primary-foreground",
                      phase >= 4 && phase < 6 && "ring-4 ring-primary/30 animate-element-highlight"
                    )}
                  >
                    {showRecording ? (
                      <>
                        <Square className="w-4 h-4 fill-current" />
                        {String(Math.floor(recordingTime / 60)).padStart(2, '0')}:{String(recordingTime % 60).padStart(2, '0')}
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4" />
                        Enregistrer appel
                      </>
                    )}
                  </button>
                </div>

                {/* Recording waveform */}
                {showRecording && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-fade-in">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-red-500 font-medium">Enregistrement en cours...</span>
                    </div>
                    <div className="flex items-end gap-1 h-12">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-red-500/50 rounded-sm animate-waveform"
                          style={{ 
                            animationDelay: `${i * 50}ms`,
                            height: `${20 + Math.random() * 80}%`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Transcript */}
                {showTranscript && (
                  <div className="mb-6 p-4 rounded-xl bg-muted/30 border border-border animate-fade-in">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Transcription
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p className="animate-stagger-in" style={{ animationDelay: '0ms' }}>
                        <span className="text-primary">Vous:</span> "Merci d'avoir pris le temps de discuter..."
                      </p>
                      <p className="animate-stagger-in" style={{ animationDelay: '200ms' }}>
                        <span className="text-foreground">Client:</span> "Nous sommes intéressés par la solution..."
                      </p>
                      <p className="animate-stagger-in" style={{ animationDelay: '400ms' }}>
                        <span className="text-primary">Vous:</span> "Parfait, je vous envoie une proposition..."
                      </p>
                    </div>
                  </div>
                )}

                {/* AI Analysis */}
                {showAnalysis && (
                  <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20 animate-fade-in">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Analyse IA
                    </h4>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 rounded-lg bg-background">
                        <div className="text-2xl font-bold text-primary">{analysisScore}%</div>
                        <div className="text-xs text-muted-foreground">Score appel</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-background">
                        <div className="text-2xl font-bold text-green-500">Positif</div>
                        <div className="text-xs text-muted-foreground">Sentiment</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-background">
                        <div className="text-2xl font-bold text-amber-500">2</div>
                        <div className="text-xs text-muted-foreground">Objections</div>
                      </div>
                    </div>
                    
                    {phase >= 9 && (
                      <button 
                        className={cn(
                          "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all",
                          phase >= 9 && "animate-element-highlight"
                        )}
                      >
                        <FileText className="w-4 h-4" />
                        Générer proposition
                      </button>
                    )}
                  </div>
                )}

                {/* Generated proposal */}
                {showProposal && phase >= 10 && (
                  <div className="p-4 rounded-xl border-2 border-green-500/50 bg-green-500/5 animate-zoom-in">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Proposition générée</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <TypeWriter 
                        text="Proposition commerciale personnalisée pour TechCorp incluant les points discutés lors de l'appel..."
                        speed={30}
                        isActive={phase >= 10}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
