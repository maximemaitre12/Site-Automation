import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, Video, Phone, Building, User, ChevronDown, Trash2, CheckCircle, XCircle, MessageSquare, Mic, FileText, BarChart3 } from 'lucide-react';
import { Interview, useInterviews } from '@/hooks/useInterviews';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { InterviewRecorder } from './InterviewRecorder';
import { InterviewAnalysisDialog } from './InterviewAnalysisDialog';
import { MatchScoreGauge } from './MatchScoreGauge';

interface InterviewCardProps {
  interview: Interview;
  showCandidate?: boolean;
  onAnalysisComplete?: () => void;
}

export function InterviewCard({ interview, showCandidate = false, onAnalysisComplete }: InterviewCardProps) {
  const { updateInterview, deleteInterview } = useInterviews();
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(interview.notes || '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const getStatusBadge = () => {
    switch (interview.status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Planifié</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Confirmé</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Annulé</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = () => {
    switch (interview.interview_type) {
      case 'video': return <Video className="h-4 w-4 text-blue-500" />;
      case 'phone': return <Phone className="h-4 w-4 text-green-500" />;
      case 'in_person': return <Building className="h-4 w-4 text-amber-500" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await updateInterview(interview.id, { notes });
    } finally {
      setSavingNotes(false);
    }
  };

  const handleMarkComplete = async (outcome: 'passed' | 'failed') => {
    await updateInterview(interview.id, { status: 'completed', outcome });
  };

  const handleCancel = async () => {
    await updateInterview(interview.id, { status: 'cancelled' });
  };

  const handleDelete = async () => {
    if (confirm('Supprimer cet entretien ?')) {
      await deleteInterview(interview.id);
    }
  };

  const handleRecordingComplete = () => {
    setShowRecorder(false);
    onAnalysisComplete?.();
  };

  const scheduledDate = new Date(interview.scheduled_at);
  const isPast = scheduledDate < new Date();
  const hasQuestions = interview.ai_suggested_questions && Object.values(interview.ai_suggested_questions).some(arr => arr && arr.length > 0);
  const hasAnalysis = interview.match_score !== null && interview.match_score !== undefined;
  const hasTranscript = !!interview.transcript;

  const questionCategories = [
    { key: 'technical', label: 'Techniques' },
    { key: 'behavioral', label: 'Comportementales' },
    { key: 'experience', label: 'Expérience' },
    { key: 'motivation', label: 'Motivation' },
    { key: 'specific', label: 'Spécifiques' },
  ];

  return (
    <Card className={`${interview.status === 'cancelled' ? 'opacity-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {getTypeIcon()}
              {showCandidate && interview.candidate && (
                <span className="font-medium">{interview.candidate.name}</span>
              )}
              {getStatusBadge()}
              {interview.outcome === 'passed' && (
                <Badge className="bg-green-500">Réussi</Badge>
              )}
              {interview.outcome === 'failed' && (
                <Badge variant="destructive">Non retenu</Badge>
              )}
              {hasTranscript && (
                <Badge variant="outline" className="gap-1">
                  <FileText className="h-3 w-3" />
                  Transcrit
                </Badge>
              )}
              {hasAnalysis && (
                <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/30">
                  <BarChart3 className="h-3 w-3" />
                  Analysé
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(scheduledDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {format(scheduledDate, 'HH:mm')} ({interview.duration_minutes} min)
              </span>
            </div>

            {interview.location && (
              <p className="text-sm text-muted-foreground mt-1 truncate max-w-sm">
                📍 {interview.location}
              </p>
            )}

            {interview.interviewers.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {interview.interviewers.join(', ')}
                </span>
              </div>
            )}

            {/* Match Score Display */}
            {hasAnalysis && (
              <div className="mt-3 flex items-center gap-4">
                <MatchScoreGauge score={interview.match_score || 0} size="sm" />
                <Button size="sm" variant="outline" onClick={() => setShowReport(true)} className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Voir le rapport
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            {/* Record/Analyze button for scheduled interviews */}
            {(interview.status === 'scheduled' || interview.status === 'confirmed') && isPast && (
              <Button size="sm" variant="default" className="gap-2" onClick={() => setShowRecorder(true)}>
                <Mic className="h-4 w-4" />
                Enregistrer
              </Button>
            )}
            
            {interview.status !== 'completed' && interview.status !== 'cancelled' && (
              <>
                {isPast && !hasAnalysis && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="text-green-600" onClick={() => handleMarkComplete('passed')}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleMarkComplete('failed')}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={handleCancel}>
                  Annuler
                </Button>
              </>
            )}
            <Button size="sm" variant="ghost" className="text-destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Collapsible section for questions and notes */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Questions & Notes
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            {/* AI Questions */}
            {hasQuestions && (
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  ✨ Questions suggérées par l'IA
                </h4>
                {questionCategories.map(cat => {
                  const questions = interview.ai_suggested_questions[cat.key as keyof typeof interview.ai_suggested_questions];
                  if (!questions?.length) return null;
                  
                  return (
                    <div key={cat.key}>
                      <p className="text-xs font-medium text-muted-foreground mb-1">{cat.label}</p>
                      <ul className="space-y-1">
                        {questions.map((q, i) => (
                          <li key={i} className="text-sm flex gap-2">
                            <span className="text-primary">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Transcript Preview */}
            {hasTranscript && (
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Transcription
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {interview.transcript}
                </p>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="text-sm font-medium mb-2 block">Notes d'entretien</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ajoutez vos notes sur l'entretien..."
                rows={4}
              />
              <Button
                size="sm"
                className="mt-2"
                onClick={handleSaveNotes}
                disabled={savingNotes || notes === interview.notes}
              >
                {savingNotes ? 'Enregistrement...' : 'Enregistrer les notes'}
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      {/* Interview Recorder Dialog */}
      <Dialog open={showRecorder} onOpenChange={setShowRecorder}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enregistrer l'entretien</DialogTitle>
          </DialogHeader>
          <InterviewRecorder
            interviewId={interview.id}
            candidateId={interview.candidate_id}
            onComplete={handleRecordingComplete}
          />
        </DialogContent>
      </Dialog>

      {/* Analysis Report Dialog */}
      <InterviewAnalysisDialog
        interview={interview}
        candidateName={interview.candidate?.name || 'Candidat'}
        open={showReport}
        onOpenChange={setShowReport}
      />
    </Card>
  );
}
