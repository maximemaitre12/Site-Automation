import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Loader2, Sparkles, CheckCircle, User, Mail, Phone, Briefcase, Star, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { JobDescription } from '@/hooks/useHR';

interface AddCandidateDialogProps {
  onAdd: (data: { 
    name: string; 
    email?: string; 
    phone?: string; 
    cvText?: string;
    skills?: string[];
    experience_years?: number;
    match_score?: number;
    ai_analysis?: any;
    job_id?: string;
  }) => Promise<any>;
  jobs?: JobDescription[];
  children: React.ReactNode;
}

interface ExtractedInfo {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience_years: number;
  education: string;
  summary: string;
  strengths: string[];
  score: number;
  job_match?: {
    score: number;
    match_reasons: string[];
    gaps: string[];
    recommendation: string;
  };
}

export function AddCandidateDialog({ onAdd, jobs = [], children }: AddCandidateDialogProps) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'idle' | 'uploading' | 'parsing' | 'analyzing' | 'matching' | 'done'>('idle');
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const supportedFormats = ['PDF', 'DOCX', 'DOC', 'TXT', 'RTF', 'ODT'];
  const activeJobs = jobs.filter(j => j.is_active);

  const resetState = () => {
    setIsProcessing(false);
    setProgress(0);
    setStage('idle');
    setExtractedInfo(null);
    setSelectedJobId('');
  };

  const parseDocument = async (file: File): Promise<string> => {
    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.slice(i, i + chunkSize));
    }
    const base64 = btoa(binary);

    const { data, error } = await supabase.functions.invoke('cv-parse', {
      body: {
        fileBase64: base64,
        fileName: file.name,
        mimeType: file.type
      }
    });

    if (error) throw new Error('Erreur lors du parsing du document');
    return data?.text || '';
  };

  const analyzeCV = async (cvText: string, job?: JobDescription): Promise<ExtractedInfo> => {
    // Build prompt based on whether a job is selected
    let prompt = '';
    
    if (job) {
      // Job-specific analysis - score is based on job fit
      const jobSkills = Array.isArray(job.skills) ? job.skills.join(', ') : '';
      const jobRequirements = Array.isArray(job.requirements) ? job.requirements.join(', ') : '';
      
      prompt = `Tu es un expert RH. Analyse ce CV PAR RAPPORT au poste de "${job.title}" et calcule un score d'adéquation.

POSTE CIBLE:
- Titre: ${job.title}
- Description: ${job.description || 'N/A'}
- Compétences requises: ${jobSkills || 'N/A'}
- Exigences: ${jobRequirements || 'N/A'}
- Département: ${job.department || 'N/A'}

CRITÈRES DE SCORING (score 0-100):
- Correspondance des compétences (40%)
- Expérience pertinente pour ce poste (30%)
- Formation adéquate (15%)
- Potentiel d'adaptation (15%)

IMPORTANT: Réponds UNIQUEMENT avec le JSON, sans markdown, sans explication.

{
  "name": "nom complet du candidat",
  "email": "email si présent, sinon chaîne vide",
  "phone": "téléphone si présent, sinon chaîne vide",
  "skills": ["liste", "des", "compétences", "techniques", "et", "soft skills"],
  "experience_years": nombre d'années d'expérience (entier),
  "education": "formation principale / diplôme le plus élevé",
  "summary": "résumé professionnel en 2-3 phrases",
  "strengths": ["point fort 1", "point fort 2", "point fort 3"],
  "score": score d'ADÉQUATION AU POSTE de 0 à 100 basé sur les critères ci-dessus,
  "job_match": {
    "score": même score que ci-dessus,
    "match_reasons": ["raison 1 de la correspondance", "raison 2"],
    "gaps": ["compétence ou expérience manquante 1", "gap 2"],
    "recommendation": "recommandation courte sur la pertinence du candidat pour ce poste"
  }
}

CV à analyser:
${cvText.substring(0, 8000)}`;
    } else {
      // Generic CV analysis
      prompt = `Tu es un expert RH. Analyse ce CV et extrais toutes les informations en JSON strict.

IMPORTANT: Réponds UNIQUEMENT avec le JSON, sans markdown, sans explication.

{
  "name": "nom complet du candidat",
  "email": "email si présent, sinon chaîne vide",
  "phone": "téléphone si présent, sinon chaîne vide",
  "skills": ["liste", "des", "compétences", "techniques", "et", "soft skills"],
  "experience_years": nombre d'années d'expérience (entier),
  "education": "formation principale / diplôme le plus élevé",
  "summary": "résumé professionnel en 2-3 phrases",
  "strengths": ["point fort 1", "point fort 2", "point fort 3"],
  "score": score de qualité du profil de 0 à 100 basé sur la clarté du CV, les compétences, l'expérience et la cohérence du parcours
}

CV à analyser:
${cvText.substring(0, 8000)}`;
    }

    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        messages: [{ role: 'user', content: prompt }]
      }
    });

    if (error) throw new Error('Erreur lors de l\'analyse IA');

    let content = data?.content || data?.choices?.[0]?.message?.content || '';
    
    // Clean markdown wrapper if present
    if (content.includes('```')) {
      content = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }

    try {
      return JSON.parse(content);
    } catch {
      return {
        name: 'Candidat',
        email: '',
        phone: '',
        skills: [],
        experience_years: 0,
        education: '',
        summary: content.substring(0, 200),
        strengths: [],
        score: 50
      };
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setStage('uploading');
    setExtractedInfo(null);

    const selectedJob = selectedJobId ? activeJobs.find(j => j.id === selectedJobId) : undefined;

    try {
      // Stage 1: Upload/Read file
      setProgress(20);
      setStage('parsing');

      let cvText = '';
      
      // For text files, read directly
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        cvText = await file.text();
      } else {
        // For other formats, use doc-analyze edge function
        cvText = await parseDocument(file);
      }

      if (!cvText || cvText.length < 50) {
        throw new Error('Le document ne contient pas assez de texte à analyser');
      }

      // Stage 2: AI Analysis (with optional job matching)
      setProgress(50);
      setStage(selectedJob ? 'matching' : 'analyzing');

      const extracted = await analyzeCV(cvText, selectedJob);
      
      setProgress(80);

      // Stage 3: Create candidate with all extracted data
      await onAdd({
        name: extracted.name || 'Candidat',
        email: extracted.email || undefined,
        phone: extracted.phone || undefined,
        cvText: cvText,
        skills: extracted.skills,
        experience_years: extracted.experience_years,
        match_score: extracted.score,
        job_id: selectedJob?.id,
        ai_analysis: {
          education: extracted.education,
          summary: extracted.summary,
          strengths: extracted.strengths,
          score: extracted.score,
          job_match: extracted.job_match,
          analyzed_at: new Date().toISOString()
        }
      });

      setProgress(100);
      setStage('done');
      setExtractedInfo(extracted);

      const scoreLabel = selectedJob 
        ? `Score d'adéquation: ${extracted.score}/100` 
        : `Score: ${extracted.score}/100`;

      toast({
        title: 'Candidat ajouté avec succès',
        description: `${extracted.name} - ${scoreLabel}`
      });

      // Auto close after showing results
      setTimeout(() => {
        setOpen(false);
        resetState();
      }, 3000);

    } catch (error: any) {
      console.error('Processing error:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de traiter le document',
        variant: 'destructive'
      });
      resetState();
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.rtf', '.odt', '.md'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExt)) {
      toast({
        title: 'Format non supporté',
        description: `Formats acceptés: ${supportedFormats.join(', ')}`,
        variant: 'destructive'
      });
      return;
    }

    processFile(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const getStageText = () => {
    switch (stage) {
      case 'uploading': return 'Chargement du fichier...';
      case 'parsing': return 'Extraction du texte...';
      case 'analyzing': return 'Analyse IA du CV...';
      case 'matching': return 'Calcul du score d\'adéquation au poste...';
      case 'done': return 'Terminé !';
      default: return '';
    }
  };

  const getMatchBadge = (score: number) => {
    if (score >= 80) return { label: 'Excellent match', className: 'bg-success/20 text-success' };
    if (score >= 60) return { label: 'Bon match', className: 'bg-primary/20 text-primary' };
    if (score >= 40) return { label: 'À évaluer', className: 'bg-warning/20 text-warning' };
    return { label: 'Peu adapté', className: 'bg-destructive/20 text-destructive' };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetState(); }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Ajouter un candidat par CV
          </DialogTitle>
          <DialogDescription>
            Uploadez un CV et l'IA analysera automatiquement le profil
          </DialogDescription>
        </DialogHeader>

        {stage === 'idle' && (
          <div className="space-y-4">
            {/* Job Selector */}
            {activeJobs.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Poste ciblé (optionnel)
                </Label>
                <select 
                  className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-sm"
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                >
                  <option value="">Aucun - Score générique du CV</option>
                  {activeJobs.map(job => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
                {selectedJobId && (
                  <p className="text-xs text-primary">
                    Le score sera calculé selon l'adéquation au poste sélectionné
                  </p>
                )}
              </div>
            )}

            {/* Drop Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                ${isDragging 
                  ? 'border-primary bg-primary/10 scale-[1.02]' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center transition-colors
                  ${isDragging ? 'bg-primary/20' : 'bg-muted'}
                `}>
                  <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <p className="font-medium">
                    Glissez-déposez un CV ici
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ou cliquez pour sélectionner
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {supportedFormats.map(format => (
                    <span 
                      key={format}
                      className="px-2 py-0.5 text-xs bg-muted rounded-full text-muted-foreground"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt,.rtf,.odt,.md"
              onChange={handleFileChange}
              className="hidden"
            />

            <p className="text-xs text-center text-muted-foreground">
              {selectedJobId 
                ? "L'IA calculera le score d'adéquation du candidat au poste sélectionné"
                : "L'IA extraira les informations et attribuera un score de qualité du profil"
              }
            </p>
          </div>
        )}

        {(stage === 'uploading' || stage === 'parsing' || stage === 'analyzing' || stage === 'matching') && (
          <div className="py-8 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                {stage === 'matching' ? (
                  <Target className="w-6 h-6 text-primary absolute -top-1 -right-1 animate-pulse" />
                ) : (
                  <Sparkles className="w-6 h-6 text-primary absolute -top-1 -right-1 animate-pulse" />
                )}
              </div>
              <div className="text-center">
                <p className="font-medium">{getStageText()}</p>
                <p className="text-sm text-muted-foreground">
                  {stage === 'analyzing' && 'Extraction des compétences, expérience et score...'}
                  {stage === 'matching' && 'Analyse de la correspondance avec le poste...'}
                </p>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {stage === 'done' && extractedInfo && (
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-center gap-2 text-success">
              <CheckCircle className="w-8 h-8" />
              <span className="text-lg font-medium">Candidat ajouté !</span>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              {/* Name & Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{extractedInfo.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {extractedInfo.job_match && (
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getMatchBadge(extractedInfo.score).className}`}>
                      {getMatchBadge(extractedInfo.score).label}
                    </span>
                  )}
                  <div className={`flex items-center gap-1 font-bold ${getScoreColor(extractedInfo.score)}`}>
                    <Star className="w-4 h-4 fill-current" />
                    {extractedInfo.score}/100
                  </div>
                </div>
              </div>

              {/* Job Match Details */}
              {extractedInfo.job_match && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Target className="w-4 h-4" />
                    Analyse d'adéquation au poste
                  </div>
                  {extractedInfo.job_match.match_reasons?.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <span className="text-success">✓</span> {extractedInfo.job_match.match_reasons.slice(0, 2).join(' • ')}
                    </div>
                  )}
                  {extractedInfo.job_match.gaps?.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <span className="text-warning">!</span> {extractedInfo.job_match.gaps.slice(0, 2).join(' • ')}
                    </div>
                  )}
                </div>
              )}

              {/* Contact Info */}
              {extractedInfo.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{extractedInfo.email}</span>
                </div>
              )}
              {extractedInfo.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{extractedInfo.phone}</span>
                </div>
              )}

              {/* Experience */}
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>{extractedInfo.experience_years} ans d'expérience</span>
              </div>

              {/* Skills */}
              {extractedInfo.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {extractedInfo.skills.slice(0, 6).map((skill, i) => (
                    <span 
                      key={i}
                      className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {extractedInfo.skills.length > 6 && (
                    <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                      +{extractedInfo.skills.length - 6}
                    </span>
                  )}
                </div>
              )}

              {/* Summary */}
              {extractedInfo.summary && (
                <p className="text-sm text-muted-foreground italic">
                  "{extractedInfo.summary}"
                </p>
              )}
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Fermeture automatique...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
