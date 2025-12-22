import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, Send, Sparkles, Wand2, FileText, 
  Check, Minimize2, RefreshCw, Calendar, User,
  Loader2, X
} from 'lucide-react';
import { HREmail, useHREmails } from '@/hooks/useHREmails';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface EmailComposerProps {
  replyTo?: HREmail;
  candidates?: any[];
  jobs?: any[];
  onClose: () => void;
  onSent: () => void;
}

export function EmailComposer({
  replyTo,
  candidates = [],
  jobs = [],
  onClose,
  onSent,
}: EmailComposerProps) {
  const { composeWithAI, sendEmail, composing } = useHREmails();
  
  const [to, setTo] = useState(replyTo?.from_email || '');
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [body, setBody] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    replyTo?.candidate_id || null
  );
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [tone, setTone] = useState<'professional' | 'formal' | 'friendly' | 'concise'>('professional');
  const [sending, setSending] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const candidate = candidates.find(c => c.id === selectedCandidate);
  const job = jobs.find(j => j.id === selectedJob);

  const handleGenerate = async () => {
    const result = await composeWithAI('generate', {
      context: {
        originalEmail: replyTo?.body_text || replyTo?.body_html,
      },
      candidateInfo: candidate ? {
        name: candidate.name,
        email: candidate.email,
        skills: candidate.skills,
        experience_years: candidate.experience_years,
      } : {
        name: replyTo?.from_name,
        email: to,
      },
      jobInfo: job ? { title: job.title } : undefined,
      tone,
    });

    if (result?.text) {
      setBody(result.text);
      toast.success('Réponse générée');
    }
  };

  const handleImprove = async () => {
    if (!body.trim()) {
      toast.error('Écrivez d\'abord un message');
      return;
    }

    const result = await composeWithAI('improve', {
      emailContent: body,
      tone,
    });

    if (result?.text) {
      setBody(result.text);
      toast.success('Message amélioré');
    }
  };

  const handleShorten = async () => {
    if (!body.trim()) {
      toast.error('Écrivez d\'abord un message');
      return;
    }

    const result = await composeWithAI('shorten', {
      emailContent: body,
    });

    if (result?.text) {
      setBody(result.text);
      toast.success('Message raccourci');
    }
  };

  const handleCheck = async () => {
    if (!body.trim()) {
      toast.error('Écrivez d\'abord un message');
      return;
    }

    const result = await composeWithAI('check', {
      emailContent: body,
    });

    if (result?.text) {
      setBody(result.text);
      if (result.corrections) {
        toast.success('Corrections appliquées');
      } else {
        toast.success('Aucune correction nécessaire');
      }
    }
  };

  const handleProposeInterview = async () => {
    const result = await composeWithAI('propose_interview', {
      candidateInfo: candidate ? {
        name: candidate.name,
      } : {
        name: replyTo?.from_name || to.split('@')[0],
      },
      jobInfo: job ? { title: job.title } : undefined,
    });

    if (result?.text) {
      setBody(result.text);
      toast.success('Proposition d\'entretien générée');
    }
  };

  const handleGetSuggestions = async () => {
    if (!body.trim()) {
      toast.error('Écrivez d\'abord un message');
      return;
    }

    const result = await composeWithAI('suggest_improvements', {
      emailContent: body,
      context: {
        originalEmail: replyTo?.body_text,
      },
      candidateInfo: candidate,
      jobInfo: job,
    });

    if (result?.suggestions) {
      setSuggestions(result.suggestions);
    }
  };

  const applySuggestion = (suggestion: any) => {
    if (suggestion.improved_text) {
      setBody(suggestion.improved_text);
    }
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
    toast.success('Suggestion appliquée');
  };

  const handleSend = async () => {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      toast.error('Remplissez tous les champs');
      return;
    }

    setSending(true);
    try {
      const result = await sendEmail({
        to,
        subject,
        bodyHtml: `<div>${body.replace(/\n/g, '<br>')}</div>`,
        bodyText: body,
        candidateId: selectedCandidate || undefined,
        parentEmailId: replyTo?.id,
      });

      if (result?.success) {
        onSent();
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        
        <div className="flex items-center gap-2">
          <Select value={tone} onValueChange={(v: any) => setTone(v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Ton" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professionnel</SelectItem>
              <SelectItem value="formal">Formel</SelectItem>
              <SelectItem value="friendly">Amical</SelectItem>
              <SelectItem value="concise">Concis</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="default" 
            onClick={handleSend}
            disabled={sending || !to || !subject || !body}
          >
            {sending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Envoyer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Composer */}
        <Card className="col-span-2">
          <CardContent className="pt-4 space-y-4">
            {/* To */}
            <div className="space-y-2">
              <label className="text-sm font-medium">À</label>
              <Input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="email@exemple.com"
                type="email"
              />
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sujet</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Objet de l'email"
              />
            </div>

            <Separator />

            {/* AI Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerate}
                disabled={composing}
              >
                {composing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
                Générer
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleImprove}
                disabled={composing}
              >
                <Wand2 className="w-4 h-4 mr-1" />
                Améliorer
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShorten}
                disabled={composing}
              >
                <Minimize2 className="w-4 h-4 mr-1" />
                Raccourcir
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCheck}
                disabled={composing}
              >
                <Check className="w-4 h-4 mr-1" />
                Vérifier
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleProposeInterview}
                disabled={composing}
              >
                <Calendar className="w-4 h-4 mr-1" />
                Proposer entretien
              </Button>
            </div>

            {/* Body */}
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Rédigez votre message ici..."
              className="min-h-[300px] resize-none"
            />

            {/* Original email preview if replying */}
            {replyTo && (
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">
                  Email original de {replyTo.from_name || replyTo.from_email}:
                </p>
                <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground max-h-32 overflow-y-auto">
                  {replyTo.body_text || replyTo.body_html?.replace(/<[^>]*>/g, '')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Context */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Contexte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Candidat</label>
                <Select 
                  value={selectedCandidate || ''} 
                  onValueChange={setSelectedCandidate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Poste</label>
                <Select 
                  value={selectedJob || ''} 
                  onValueChange={setSelectedJob}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((j) => (
                      <SelectItem key={j.id} value={j.id}>
                        {j.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {candidate && (
                <div className="p-2 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{candidate.name}</span>
                  </div>
                  {candidate.match_score && (
                    <Badge variant="outline" className="mt-1">
                      Score: {candidate.match_score}%
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Suggestions
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleGetSuggestions}
                  disabled={composing || !body.trim()}
                >
                  <RefreshCw className={`w-4 h-4 ${composing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {suggestions.length > 0 ? (
                <div className="space-y-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => applySuggestion(suggestion)}
                      className="w-full text-left p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{suggestion.label}</span>
                        <Check className="w-3 h-3 text-primary shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Cliquez sur le bouton pour obtenir des suggestions d'amélioration
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Conseils</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Utilisez "Générer" pour créer une réponse automatique</li>
                <li>• "Améliorer" reformule votre texte de façon professionnelle</li>
                <li>• "Vérifier" corrige l'orthographe et le ton</li>
                <li>• Sélectionnez un candidat pour personnaliser le message</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
