import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Star, Sparkles, Mail, Phone, Briefcase, 
  FileText, Trash2, UserCheck, MessageSquare, 
  Loader2, ChevronDown, ChevronUp, Eye
} from 'lucide-react';
import { Candidate, JobDescription } from '@/hooks/useHR';

interface CandidateCardProps {
  candidate: Candidate;
  jobs: JobDescription[];
  onAnalyze: (id: string, cvText: string) => Promise<boolean>;
  onMatch: (candidateId: string, jobId: string) => Promise<number | null>;
  onAnalyzeInterview: (id: string, notes: string) => Promise<string | null>;
  onDelete: (id: string) => Promise<boolean>;
}

export function CandidateCard({ 
  candidate, 
  jobs, 
  onAnalyze, 
  onMatch, 
  onAnalyzeInterview,
  onDelete 
}: CandidateCardProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [isAnalyzingInterview, setIsAnalyzingInterview] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [interviewResult, setInterviewResult] = useState<string | null>(null);

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'analyzed':
        return <Badge className="bg-success/20 text-success border-success/30">Analysé</Badge>;
      case 'interview':
        return <Badge className="bg-primary/20 text-primary border-primary/30">Entretien</Badge>;
      case 'screening':
        return <Badge className="bg-warning/20 text-warning border-warning/30">Présélection</Badge>;
      case 'hired':
        return <Badge className="bg-success/20 text-success border-success/30">Embauché</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">Nouveau</Badge>;
    }
  };

  const handleAnalyze = async () => {
    if (!candidate.cv_text) return;
    setIsAnalyzing(true);
    await onAnalyze(candidate.id, candidate.cv_text);
    setIsAnalyzing(false);
  };

  const handleMatch = async () => {
    if (!selectedJobId) return;
    setIsMatching(true);
    await onMatch(candidate.id, selectedJobId);
    setIsMatching(false);
  };

  const handleAnalyzeInterview = async () => {
    if (!interviewNotes.trim()) return;
    setIsAnalyzingInterview(true);
    const result = await onAnalyzeInterview(candidate.id, interviewNotes);
    if (result) {
      setInterviewResult(result);
    }
    setIsAnalyzingInterview(false);
  };

  const skills = Array.isArray(candidate.skills) ? candidate.skills : [];
  const analysis = candidate.ai_analysis || {};

  return (
    <Card className="border-border hover:border-primary/30 transition-all">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {candidate.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate">{candidate.name}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {candidate.email && (
                    <span className="flex items-center gap-1 truncate">
                      <Mail className="w-3 h-3" />
                      {candidate.email}
                    </span>
                  )}
                  {candidate.experience_years && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {candidate.experience_years} ans
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {candidate.match_score && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
                    <Star className="w-3 h-3 text-primary fill-primary" />
                    <span className="text-sm font-semibold text-primary">{candidate.match_score}%</span>
                  </div>
                )}
                {getStatusBadge(candidate.status)}
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {skills.slice(0, 5).map((skill: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                    {skill}
                  </span>
                ))}
                {skills.length > 5 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    +{skills.length - 5}
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {/* Analyze CV */}
              {candidate.cv_text && !candidate.ai_analysis && (
                <Button 
                  variant="subtle" 
                  size="sm" 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 mr-1" />
                  )}
                  Analyser CV
                </Button>
              )}

              {/* View Analysis */}
              {candidate.ai_analysis && (
                <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
                  <DialogTrigger asChild>
                    <Button variant="subtle" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      Voir analyse
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Analyse IA - {candidate.name}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh]">
                      <div className="space-y-4">
                        {analysis.summary && (
                          <div>
                            <Label className="text-sm font-medium">Résumé</Label>
                            <p className="text-sm text-muted-foreground mt-1">{analysis.summary}</p>
                          </div>
                        )}
                        {analysis.strengths && (
                          <div>
                            <Label className="text-sm font-medium">Points forts</Label>
                            <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                              {(analysis.strengths as string[]).map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                          </div>
                        )}
                        {analysis.concerns && (
                          <div>
                            <Label className="text-sm font-medium">Points d'attention</Label>
                            <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                              {(analysis.concerns as string[]).map((c, i) => <li key={i}>{c}</li>)}
                            </ul>
                          </div>
                        )}
                        {analysis.recommended_roles && (
                          <div>
                            <Label className="text-sm font-medium">Postes recommandés</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {(analysis.recommended_roles as string[]).map((r, i) => (
                                <Badge key={i} variant="outline">{r}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {analysis.job_match && (
                          <div className="border-t pt-4">
                            <Label className="text-sm font-medium">Matching avec le poste</Label>
                            <div className="mt-2 p-3 rounded-lg bg-muted/50">
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="w-4 h-4 text-primary fill-primary" />
                                <span className="font-semibold">Score: {analysis.job_match.score}%</span>
                              </div>
                              {analysis.job_match.match_reasons && (
                                <div className="text-sm text-muted-foreground">
                                  <strong>Correspondances:</strong>
                                  <ul className="list-disc list-inside">
                                    {(analysis.job_match.match_reasons as string[]).map((r, i) => <li key={i}>{r}</li>)}
                                  </ul>
                                </div>
                              )}
                              {analysis.job_match.gaps && (
                                <div className="text-sm text-muted-foreground mt-2">
                                  <strong>Écarts:</strong>
                                  <ul className="list-disc list-inside">
                                    {(analysis.job_match.gaps as string[]).map((g, i) => <li key={i}>{g}</li>)}
                                  </ul>
                                </div>
                              )}
                              {analysis.job_match.recommendation && (
                                <p className="text-sm mt-2"><strong>Recommandation:</strong> {analysis.job_match.recommendation}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              )}

              {/* Match with Job */}
              {jobs.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <UserCheck className="w-3 h-3 mr-1" />
                      Matcher
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Matcher avec un poste</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Sélectionner un poste</Label>
                        <select 
                          className="w-full h-10 rounded-lg bg-secondary border border-border px-3"
                          value={selectedJobId}
                          onChange={(e) => setSelectedJobId(e.target.value)}
                        >
                          <option value="">Choisir un poste...</option>
                          {jobs.filter(j => j.is_active).map(job => (
                            <option key={job.id} value={job.id}>{job.title}</option>
                          ))}
                        </select>
                      </div>
                      <Button 
                        onClick={handleMatch} 
                        disabled={!selectedJobId || isMatching}
                        className="w-full"
                      >
                        {isMatching ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        Calculer le matching
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Interview Analysis */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Entretien
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Analyse d'entretien - {candidate.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Notes d'entretien</Label>
                      <Textarea 
                        placeholder="Collez ou saisissez vos notes d'entretien ici..."
                        value={interviewNotes}
                        onChange={(e) => setInterviewNotes(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>
                    <Button 
                      onClick={handleAnalyzeInterview}
                      disabled={!interviewNotes.trim() || isAnalyzingInterview}
                      className="w-full"
                    >
                      {isAnalyzingInterview ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      Analyser l'entretien
                    </Button>
                    {interviewResult && (
                      <div className="p-4 rounded-lg bg-muted/50">
                        <Label className="text-sm font-medium mb-2 block">Résultat de l'analyse</Label>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{interviewResult}</p>
                      </div>
                    )}
                    {candidate.interview_notes && (
                      <div className="border-t pt-4">
                        <Label className="text-sm font-medium mb-2 block">Notes précédentes</Label>
                        <ScrollArea className="h-32">
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{candidate.interview_notes}</p>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Delete */}
              <Button 
                variant="ghost" 
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(candidate.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            {/* CV Preview Toggle */}
            {candidate.cv_text && (
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-xs text-muted-foreground mt-3 hover:text-foreground transition-colors"
              >
                <FileText className="w-3 h-3" />
                {showDetails ? 'Masquer CV' : 'Voir CV'}
                {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
            {showDetails && candidate.cv_text && (
              <div className="mt-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground max-h-40 overflow-y-auto whitespace-pre-wrap">
                {candidate.cv_text}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
