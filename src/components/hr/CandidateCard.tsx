import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Star, Sparkles, Mail, Phone, Briefcase, 
  FileText, Trash2, UserCheck, MessageSquare, 
  Loader2, ChevronDown, ChevronUp, Eye, Check, 
  Link, Edit, CheckCircle
} from 'lucide-react';
import { Candidate, JobDescription } from '@/hooks/useHR';

interface CandidateCardProps {
  candidate: Candidate;
  jobs: JobDescription[];
  onValidateScore: (id: string, score: number) => Promise<boolean>;
  onActivate: (id: string) => Promise<boolean>;
  onLinkToJob: (candidateId: string, jobId: string) => Promise<boolean>;
  onUpdateDescription: (id: string, description: string) => Promise<boolean>;
  onAddInterviewNotes: (id: string, notes: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export function CandidateCard({ 
  candidate, 
  jobs, 
  onValidateScore,
  onActivate,
  onLinkToJob,
  onUpdateDescription,
  onAddInterviewNotes,
  onDelete 
}: CandidateCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [customScore, setCustomScore] = useState(candidate.match_score?.toString() || '');
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showDescDialog, setShowDescDialog] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [description, setDescription] = useState(candidate.ai_analysis?.user_description || '');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [isSavingDesc, setIsSavingDesc] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary">Nouveau</Badge>;
      case 'analyzed':
        return <Badge className="bg-primary/20 text-primary border-primary/30">Analysé</Badge>;
      case 'active':
        return <Badge className="bg-success/20 text-success border-success/30">Actif</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">Nouveau</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const handleValidateScore = async (useCustom: boolean) => {
    setIsValidating(true);
    const score = useCustom ? parseInt(customScore) : (candidate.match_score || 0);
    if (score >= 0 && score <= 100) {
      await onValidateScore(candidate.id, score);
      setShowScoreDialog(false);
    }
    setIsValidating(false);
  };

  const handleLinkJob = async () => {
    if (!selectedJobId) return;
    setIsLinking(true);
    await onLinkToJob(candidate.id, selectedJobId);
    setShowJobDialog(false);
    setIsLinking(false);
  };

  const handleSaveDescription = async () => {
    setIsSavingDesc(true);
    await onUpdateDescription(candidate.id, description);
    setShowDescDialog(false);
    setIsSavingDesc(false);
  };

  const handleSaveNotes = async () => {
    if (!interviewNotes.trim()) return;
    setIsSavingNotes(true);
    await onAddInterviewNotes(candidate.id, interviewNotes);
    setInterviewNotes('');
    setShowNotesDialog(false);
    setIsSavingNotes(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(candidate.id);
    setIsDeleting(false);
  };

  const handleActivate = async () => {
    setIsActivating(true);
    await onActivate(candidate.id);
    setIsActivating(false);
  };

  const skills = Array.isArray(candidate.skills) ? candidate.skills : [];
  const analysis = candidate.ai_analysis || {};
  const linkedJob = jobs.find(j => j.id === candidate.job_id);

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
                <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
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
                  {linkedJob && (
                    <span className="flex items-center gap-1 text-primary">
                      <Link className="w-3 h-3" />
                      {linkedJob.title}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {candidate.match_score !== null && candidate.match_score !== undefined && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 ${getScoreColor(candidate.match_score)}`}>
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-sm font-semibold">{candidate.match_score}%</span>
                  </div>
                )}
                {getStatusBadge(candidate.status)}
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {skills.slice(0, 6).map((skill: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                    {skill}
                  </span>
                ))}
                {skills.length > 6 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    +{skills.length - 6}
                  </span>
                )}
              </div>
            )}

            {/* User Description (for analyzed/active candidates) */}
            {analysis.user_description && (
              <p className="text-sm text-muted-foreground mb-3 italic">
                "{analysis.user_description}"
              </p>
            )}

            {/* Action Buttons based on status */}
            <div className="flex flex-wrap gap-2">
              {/* NEW STATUS: Validate score */}
              {candidate.status === 'new' && (
                <Dialog open={showScoreDialog} onOpenChange={setShowScoreDialog}>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm">
                      <Check className="w-3 h-3 mr-1" />
                      Valider le score
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Valider le score du candidat</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50 text-center">
                        <p className="text-sm text-muted-foreground mb-2">Score proposé par l'IA</p>
                        <div className={`text-4xl font-bold ${getScoreColor(candidate.match_score || 0)}`}>
                          {candidate.match_score || 0}%
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleValidateScore(false)}
                          disabled={isValidating}
                          className="flex-1"
                        >
                          {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Valider ce score'}
                        </Button>
                      </div>

                      <div className="border-t pt-4">
                        <Label className="text-sm">Ou définir un score personnalisé</Label>
                        <div className="flex gap-2 mt-2">
                          <Input 
                            type="number"
                            min="0"
                            max="100"
                            value={customScore}
                            onChange={(e) => setCustomScore(e.target.value)}
                            placeholder="0-100"
                            className="flex-1"
                          />
                          <Button 
                            variant="outline"
                            onClick={() => handleValidateScore(true)}
                            disabled={isValidating || !customScore}
                          >
                            Appliquer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* ANALYZED STATUS: Link to job, add description, interview notes, activate */}
              {candidate.status === 'analyzed' && (
                <>
                  {/* Link to Job */}
                  <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Link className="w-3 h-3 mr-1" />
                        {linkedJob ? 'Changer de poste' : 'Relier à un poste'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Relier à un poste</DialogTitle>
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
                          onClick={handleLinkJob} 
                          disabled={!selectedJobId || isLinking}
                          className="w-full"
                        >
                          {isLinking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Relier au poste'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Description */}
                  <Dialog open={showDescDialog} onOpenChange={setShowDescDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3 mr-1" />
                        Description
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Description du candidat</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea 
                          placeholder="Ajoutez une description personnelle du candidat..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="min-h-[150px]"
                        />
                        <Button 
                          onClick={handleSaveDescription}
                          disabled={isSavingDesc}
                          className="w-full"
                        >
                          {isSavingDesc ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enregistrer'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Interview Notes */}
                  <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Notes d'entretien
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Notes d'entretien - {candidate.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {candidate.interview_notes && (
                          <div className="border-b pb-4">
                            <Label className="text-sm font-medium mb-2 block">Notes existantes</Label>
                            <ScrollArea className="h-40 rounded-lg bg-muted/50 p-3">
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{candidate.interview_notes}</p>
                            </ScrollArea>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label>Ajouter de nouvelles notes</Label>
                          <Textarea 
                            placeholder="Saisissez vos notes d'entretien..."
                            value={interviewNotes}
                            onChange={(e) => setInterviewNotes(e.target.value)}
                            className="min-h-[120px]"
                          />
                        </div>
                        <Button 
                          onClick={handleSaveNotes}
                          disabled={!interviewNotes.trim() || isSavingNotes}
                          className="w-full"
                        >
                          {isSavingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ajouter les notes'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Activate Candidate */}
                  <Button 
                    variant="subtle" 
                    size="sm"
                    onClick={handleActivate}
                    disabled={isActivating}
                    className="bg-success/10 hover:bg-success/20 text-success"
                  >
                    {isActivating ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    )}
                    Valider → Actif
                  </Button>
                </>
              )}

              {/* ACTIVE STATUS: View only with notes */}
              {candidate.status === 'active' && (
                <>
                  {/* Interview Notes (read-only style) */}
                  <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Voir les notes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Notes d'entretien - {candidate.name}</DialogTitle>
                      </DialogHeader>
                      {candidate.interview_notes ? (
                        <ScrollArea className="h-60 rounded-lg bg-muted/50 p-3">
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{candidate.interview_notes}</p>
                        </ScrollArea>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">Aucune note d'entretien</p>
                      )}
                    </DialogContent>
                  </Dialog>

                  {linkedJob && (
                    <Badge variant="outline" className="text-success border-success/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Poste: {linkedJob.title}
                    </Badge>
                  )}
                </>
              )}

              {/* View Analysis (all statuses if analysis exists) */}
              {candidate.ai_analysis && (
                <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      Analyse IA
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
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              )}

              {/* Delete */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    disabled={isDeleting}
                  >
                    {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer ce candidat ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. {candidate.name} sera définitivement supprimé.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
