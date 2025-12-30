import React, { useState, useEffect } from 'react';
import { Users, Plus, Upload, Star, FileText, Clock, CheckCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedCursor } from '../core/AnimatedCursor';
import { TypeWriter } from '../core/TypeWriter';

interface HRSceneProps {
  isActive: boolean;
  progress: number;
}

// Mock data for HR interface
const candidates = [
  { id: 1, name: 'Sophie Martin', role: 'Designer UX', score: 92, status: 'Entretien' },
  { id: 2, name: 'Lucas Bernard', role: 'Dev Frontend', score: 88, status: 'Nouveau' },
  { id: 3, name: 'Emma Dubois', role: 'Product Manager', score: 95, status: 'Évaluation' },
];

export function HRScene({ isActive, progress }: HRSceneProps) {
  const [phase, setPhase] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 100, y: 100 });
  const [isClicking, setIsClicking] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [typedName, setTypedName] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [scoreValue, setScoreValue] = useState(0);
  const [newCandidate, setNewCandidate] = useState<typeof candidates[0] | null>(null);

  useEffect(() => {
    if (!isActive) {
      setPhase(0);
      setShowDialog(false);
      setTypedName('');
      setShowUpload(false);
      setUploadProgress(0);
      setShowScore(false);
      setScoreValue(0);
      setNewCandidate(null);
      return;
    }

    // Animation phases based on progress
    if (progress < 8) {
      setPhase(1); // Interface appears
    } else if (progress < 15) {
      setPhase(2); // Cursor moves to + button
      setCursorPos({ x: 680, y: 150 });
    } else if (progress < 20) {
      setPhase(3); // Click
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 400);
    } else if (progress < 25) {
      setPhase(4); // Dialog opens
      setShowDialog(true);
    } else if (progress < 30) {
      setPhase(5); // Cursor moves to name field
      setCursorPos({ x: 500, y: 320 });
    } else if (progress < 45) {
      setPhase(6); // Typing name
      setTypedName('Marie Dupont');
    } else if (progress < 50) {
      setPhase(7); // Cursor moves to upload
      setCursorPos({ x: 500, y: 420 });
    } else if (progress < 60) {
      setPhase(8); // Upload animation
      setShowUpload(true);
      setUploadProgress(Math.min((progress - 50) * 10, 100));
    } else if (progress < 70) {
      setPhase(9); // Dialog closes, new candidate appears
      setShowDialog(false);
      setNewCandidate({
        id: 4,
        name: 'Marie Dupont',
        role: 'Product Manager',
        score: 0,
        status: 'Analyse IA...',
      });
    } else if (progress < 85) {
      setPhase(10); // AI analysis
      setShowScore(true);
      const targetScore = 95;
      const scoreProgress = (progress - 70) / 15;
      setScoreValue(Math.round(targetScore * scoreProgress));
    } else {
      setPhase(11); // Final state
      setScoreValue(95);
      if (newCandidate) {
        setNewCandidate(prev => prev ? { ...prev, score: 95, status: 'Évalué' } : null);
      }
    }
  }, [isActive, progress]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      {/* Animated cursor */}
      <AnimatedCursor
        targetPosition={cursorPos}
        isClicking={isClicking}
        isVisible={phase >= 2 && phase < 11}
        duration={600}
      />

      {/* HR Interface mockup */}
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
            <div className="w-10 h-10 rounded-xl bg-agent-hr/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-agent-hr" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Agent RH</h2>
              <p className="text-xs text-muted-foreground">Recrutement intelligent</p>
            </div>
          </div>
          
          <button 
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all",
              phase >= 2 && phase < 4 && "ring-4 ring-primary/30 animate-element-highlight"
            )}
          >
            <Plus className="w-4 h-4" />
            Ajouter candidat
          </button>
        </div>

        {/* Content grid */}
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-56 border-r border-border p-4 bg-muted/10">
            <nav className="space-y-1">
              {['Pipeline', 'Candidats', 'Entretiens', 'Offres'].map((item, i) => (
                <div 
                  key={item}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm transition-colors",
                    i === 1 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {item}
                </div>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6 overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Candidats récents</h3>
            
            {/* Candidates list */}
            <div className="space-y-3">
              {candidates.map((candidate, index) => (
                <div 
                  key={candidate.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground">{candidate.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{candidate.score}%</span>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                      {candidate.status}
                    </span>
                  </div>
                </div>
              ))}

              {/* New candidate being added */}
              {newCandidate && (
                <div 
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 border-primary/50 bg-primary/5 animate-stagger-in",
                    showScore && "animate-element-highlight"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{newCandidate.name}</p>
                      <p className="text-sm text-muted-foreground">{newCandidate.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {showScore ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-lg text-primary">{scoreValue}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-muted-foreground">Analyse IA...</span>
                      </div>
                    )}
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      showScore && scoreValue >= 90 
                        ? "bg-green-500/20 text-green-600" 
                        : "bg-primary/10 text-primary"
                    )}>
                      {newCandidate.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dialog overlay */}
        {showDialog && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-20 animate-fade-in">
            <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-6 animate-zoom-in">
              <h3 className="text-lg font-semibold mb-4">Nouveau candidat</h3>
              
              <div className="space-y-4">
                {/* Name field */}
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Nom complet</label>
                  <div 
                    className={cn(
                      "px-4 py-3 rounded-lg bg-muted/50 border border-border text-foreground",
                      phase >= 5 && phase < 7 && "ring-2 ring-primary"
                    )}
                  >
                    {phase >= 6 ? (
                      <TypeWriter 
                        text={typedName} 
                        speed={60} 
                        isActive={phase >= 6}
                      />
                    ) : (
                      <span className="text-muted-foreground">Entrez le nom...</span>
                    )}
                  </div>
                </div>

                {/* Upload field */}
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">CV</label>
                  <div 
                    className={cn(
                      "px-4 py-6 rounded-lg border-2 border-dashed border-border flex flex-col items-center gap-2 transition-all",
                      phase >= 7 && phase < 9 && "border-primary bg-primary/5",
                      showUpload && "border-green-500 bg-green-500/5"
                    )}
                  >
                    {showUpload ? (
                      <>
                        <div className="flex items-center gap-2 text-green-600">
                          {uploadProgress >= 100 ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Upload className="w-5 h-5 animate-bounce" />
                          )}
                          <span className="font-medium">
                            {uploadProgress >= 100 ? 'CV_Marie_Dupont.pdf' : 'Téléchargement...'}
                          </span>
                        </div>
                        {uploadProgress < 100 && (
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Glissez un CV ici</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tooltip for score */}
      {phase >= 11 && (
        <div 
          className="absolute top-1/2 right-[15%] -translate-y-1/2 bg-card border border-border rounded-xl px-4 py-3 shadow-xl animate-tooltip-appear"
        >
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">CV analysé en 3 secondes</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Score de matching: 95% • Expérience: 5 ans
          </p>
        </div>
      )}
    </div>
  );
}
