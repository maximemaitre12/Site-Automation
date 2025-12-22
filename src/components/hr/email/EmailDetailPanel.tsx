import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, Reply, Archive, Trash2, User, Calendar, 
  Paperclip, FileText, Download, UserPlus, Link, Sparkles,
  Mail, Clock
} from 'lucide-react';
import { HREmail } from '@/hooks/useHREmails';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useHREmails } from '@/hooks/useHREmails';
import { toast } from 'sonner';

interface EmailDetailPanelProps {
  email: HREmail;
  candidates?: any[];
  onBack: () => void;
  onReply: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onCreateCandidate?: (data: any) => Promise<any>;
}

export function EmailDetailPanel({
  email,
  candidates = [],
  onBack,
  onReply,
  onArchive,
  onDelete,
  onCreateCandidate,
}: EmailDetailPanelProps) {
  const { linkEmailToCandidate, composeWithAI } = useHREmails();
  const [generatingSuggestion, setGeneratingSuggestion] = useState(false);
  const [suggestedResponse, setSuggestedResponse] = useState<string | null>(null);

  const handleLinkCandidate = async (candidateId: string) => {
    await linkEmailToCandidate(email.id, candidateId);
  };

  const handleCreateCandidate = async () => {
    if (!onCreateCandidate) return;
    
    const candidateData = {
      name: email.from_name || email.from_email.split('@')[0],
      email: email.from_email,
      status: 'new',
    };

    const newCandidate = await onCreateCandidate(candidateData);
    if (newCandidate) {
      await linkEmailToCandidate(email.id, newCandidate.id);
      toast.success('Candidat créé et lié à l\'email');
    }
  };

  const handleGenerateSuggestion = async () => {
    setGeneratingSuggestion(true);
    try {
      const result = await composeWithAI('generate', {
        context: {
          originalEmail: email.body_text || email.body_html,
        },
        candidateInfo: email.candidate ? {
          name: email.candidate.name,
          email: email.candidate.email,
        } : {
          name: email.from_name,
          email: email.from_email,
        },
      });

      if (result?.text) {
        setSuggestedResponse(result.text);
      }
    } finally {
      setGeneratingSuggestion(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onArchive}>
            <Archive className="w-4 h-4 mr-2" />
            Archiver
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
          <Button variant="default" onClick={onReply}>
            <Reply className="w-4 h-4 mr-2" />
            Répondre
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Main content */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{email.subject}</CardTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span className="font-medium text-foreground">
                      {email.from_name || email.from_email}
                    </span>
                    {email.from_name && (
                      <span className="text-muted-foreground">
                        &lt;{email.from_email}&gt;
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Clock className="w-4 h-4" />
                  {format(new Date(email.email_date), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
                </div>
              </div>
              <Badge variant={email.status === 'new' ? 'default' : 'secondary'}>
                {email.status === 'new' ? 'Nouveau' : 
                 email.status === 'read' ? 'Lu' :
                 email.status === 'replied' ? 'Répondu' : 'Archivé'}
              </Badge>
            </div>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="pt-4">
            <ScrollArea className="h-[400px]">
              {email.body_html ? (
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: email.body_html }}
                />
              ) : (
                <div className="whitespace-pre-wrap text-sm">
                  {email.body_text}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Candidate info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="w-4 h-4" />
                Candidat
              </CardTitle>
            </CardHeader>
            <CardContent>
              {email.candidate ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{email.candidate.name}</div>
                      <div className="text-xs text-muted-foreground">{email.candidate.email}</div>
                    </div>
                  </div>
                  <Badge variant="outline">{email.candidate.status}</Badge>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Aucun candidat lié
                  </p>
                  
                  {candidates.length > 0 && (
                    <Select onValueChange={handleLinkCandidate}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Lier à un candidat..." />
                      </SelectTrigger>
                      <SelectContent>
                        {candidates.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {onCreateCandidate && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={handleCreateCandidate}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Créer candidat
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attachments */}
          {email.attachments && email.attachments.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Pièces jointes ({email.attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {email.attachments.map((attachment: any, index: number) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                    >
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm flex-1 truncate">{attachment.name}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Analysis */}
          {email.ai_analysis && Object.keys(email.ai_analysis).length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Analyse IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {email.ai_analysis.cv_detected && (
                  <Badge variant="secondary" className="gap-1">
                    <FileText className="w-3 h-3" />
                    CV détecté
                  </Badge>
                )}
                {email.ai_analysis.lm_detected && (
                  <Badge variant="secondary" className="gap-1">
                    <FileText className="w-3 h-3" />
                    Lettre de motivation
                  </Badge>
                )}
                {email.ai_analysis.summary && (
                  <p className="text-sm text-muted-foreground">
                    {email.ai_analysis.summary}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* AI Suggestion */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Suggestion IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              {suggestedResponse ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {suggestedResponse.substring(0, 200)}...
                  </p>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full"
                    onClick={onReply}
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Utiliser cette réponse
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={handleGenerateSuggestion}
                  disabled={generatingSuggestion}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generatingSuggestion ? 'Génération...' : 'Générer une suggestion'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
