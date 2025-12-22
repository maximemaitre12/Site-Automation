import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Sparkles, Loader2, CheckCircle2, 
  AlertCircle, User, Mail, FileText, Briefcase,
  ChevronDown, ChevronUp, Zap, Upload,
  FilePlus, X, Eye, RefreshCw, Clock,
  Cloud, Settings, Play
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useHREmails } from '@/hooks/useHREmails';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ExtractionResult {
  email_id: string;
  subject: string;
  from: string;
  analysis: {
    is_candidature: boolean;
    confidence: number;
    candidate_name: string | null;
    candidate_email: string | null;
    candidate_phone: string | null;
    job_title_applied: string | null;
    skills_mentioned: string[];
    experience_years: number | null;
    motivation_summary: string | null;
    has_cv_attachment: boolean;
    cv_parsed?: boolean;
    cv_summary?: string | null;
  };
}

interface AttachmentFile {
  file: File;
  filename: string;
  type: string;
  content?: string;
}

export function EmailExtractor({ onComplete }: { onComplete?: () => void }) {
  const { activeAccount, fetchAccounts } = useHREmails();
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [results, setResults] = useState<ExtractionResult[]>([]);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
  const [autoExtractionStats, setAutoExtractionStats] = useState<any>(null);
  
  // Manual mode state
  const [quickEmail, setQuickEmail] = useState('');
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const hasOutlookConnected = activeAccount?.provider === 'outlook' && 
    (activeAccount as any)?.oauth_refresh_token;

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    
    const newAttachments: AttachmentFile[] = [];
    
    for (const file of Array.from(files)) {
      if (file.type === 'application/pdf' || 
          file.type.includes('word') ||
          file.name.endsWith('.pdf') ||
          file.name.endsWith('.docx')) {
        
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.readAsDataURL(file);
        });

        newAttachments.push({
          file,
          filename: file.name,
          type: file.type,
          content: base64,
        });
      } else {
        toast.error(`Format non supporté: ${file.name}`);
      }
    }

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Fetch emails from connected Outlook account
  const handleAutoExtract = async () => {
    if (!activeAccount) {
      toast.error('Connectez d\'abord votre boîte mail Outlook');
      return;
    }

    setIsExtracting(true);
    setProgress(10);
    setProgressText('Connexion à Outlook...');
    setResults([]);
    setAutoExtractionStats(null);

    try {
      setProgress(30);
      setProgressText('Récupération des emails récents...');

      const { data, error } = await supabase.functions.invoke('hr-email-extract', {
        body: { 
          action: 'fetch_outlook_emails',
          accountId: activeAccount.id,
        },
      });

      setProgress(90);
      setProgressText('Finalisation...');

      if (error) {
        throw new Error(error.message);
      }

      if (data.success && data.results?.length > 0) {
        const accountResult = data.results[0];
        
        if (accountResult.error) {
          toast.error(`Erreur: ${accountResult.error}`);
        } else {
          setAutoExtractionStats(accountResult);
          
          const message = [
            `${accountResult.emails_imported} nouveaux emails`,
            accountResult.candidates_created > 0 ? `${accountResult.candidates_created} candidats créés` : null,
            accountResult.cvs_stored > 0 ? `${accountResult.cvs_stored} CVs stockés` : null,
          ].filter(Boolean).join(', ');
          
          toast.success(message || 'Extraction terminée');
          onComplete?.();
        }
      } else if (data.results?.[0]?.error) {
        toast.error(data.results[0].error);
      } else {
        toast.info('Aucun nouvel email à traiter');
      }
    } catch (error) {
      console.error('Extraction error:', error);
      toast.error('Erreur lors de l\'extraction');
    } finally {
      setProgress(100);
      setTimeout(() => {
        setIsExtracting(false);
        setProgress(0);
        setProgressText('');
      }, 500);
    }
  };

  // Manual email import
  const handleManualExtract = async () => {
    if (!quickEmail.trim() && attachments.length === 0) {
      toast.error('Collez un email ou ajoutez un CV');
      return;
    }

    const emails = [parseQuickEmail()];

    setIsExtracting(true);
    setProgress(20);
    setProgressText('Analyse en cours...');

    try {
      if (attachments.length > 0) {
        setProgressText(`Parsing du CV (${attachments[0].filename})...`);
        setProgress(40);
      }

      const { data, error } = await supabase.functions.invoke('hr-email-extract', {
        body: { action: 'analyze', emails },
      });

      setProgress(90);

      if (error) throw new Error(error.message);

      if (data.success) {
        setResults(data.results || []);
        
        const stats = data.stats;
        toast.success(`${stats.imported} email(s), ${stats.candidates_created} candidat(s)`);
        
        setQuickEmail('');
        setAttachments([]);
        onComplete?.();
      } else {
        toast.error(data.message || 'Erreur');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de l\'extraction');
    } finally {
      setProgress(100);
      setTimeout(() => {
        setIsExtracting(false);
        setProgress(0);
      }, 500);
    }
  };

  const parseQuickEmail = () => {
    const lines = quickEmail.split('\n');
    let from = '', subject = '', date = '', body = '';
    let inBody = false;
    
    for (const line of lines) {
      if (!inBody) {
        if (line.match(/^(De|From|Expéditeur)\s*:/i)) {
          from = line.replace(/^(De|From|Expéditeur)\s*:\s*/i, '').trim();
        } else if (line.match(/^(Sujet|Subject|Objet)\s*:/i)) {
          subject = line.replace(/^(Sujet|Subject|Objet)\s*:\s*/i, '').trim();
        } else if (line.match(/^(Date|Reçu|Received)\s*:/i)) {
          date = line.replace(/^(Date|Reçu|Received)\s*:\s*/i, '').trim();
        } else if (line.trim() === '') {
          inBody = true;
        }
      } else {
        body += line + '\n';
      }
    }

    let fromEmail = '';
    let fromName = '';
    const emailMatch = from.match(/<(.+@.+)>/);
    if (emailMatch) {
      fromEmail = emailMatch[1];
      fromName = from.replace(/<.+>/, '').trim();
    } else if (from.includes('@')) {
      fromEmail = from.split(/\s/).find(p => p.includes('@')) || '';
      fromName = from.replace(fromEmail, '').trim();
    } else {
      const anyEmail = quickEmail.match(/[\w.-]+@[\w.-]+\.\w+/);
      fromEmail = anyEmail ? anyEmail[0] : 'inconnu@email.com';
      fromName = from || 'Candidat';
    }

    return {
      from_email: fromEmail,
      from_name: fromName || fromEmail.split('@')[0],
      subject: subject || 'Candidature',
      body_text: body.trim() || quickEmail,
      email_date: date ? new Date(date).toISOString() : new Date().toISOString(),
      to_email: '',
      attachments: attachments.map(a => ({
        filename: a.filename,
        content_type: a.type,
        size: a.file.size,
        content: a.content,
      })),
    };
  };

  const toggleResult = (id: string) => {
    setExpandedResults(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Extraction automatique de candidatures
          </CardTitle>
          <CardDescription>
            Connectez votre Outlook pour extraire automatiquement les candidatures, 
            parser les CVs et créer les fiches candidats.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'auto' | 'manual')}>
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="auto" className="gap-2">
                <Cloud className="w-4 h-4" />
                Extraction Outlook
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-2">
                <FilePlus className="w-4 h-4" />
                Import manuel
              </TabsTrigger>
            </TabsList>

            {/* Auto Extraction Mode */}
            <TabsContent value="auto" className="space-y-4 pt-4">
              {hasOutlookConnected ? (
                <div className="space-y-4">
                  {/* Connected account info */}
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activeAccount.email_address}</p>
                        <p className="text-sm text-muted-foreground">
                          {(activeAccount as any).last_extraction_at ? (
                            <>Dernière extraction: {formatDistanceToNow(new Date((activeAccount as any).last_extraction_at), { addSuffix: true, locale: fr })}</>
                          ) : (
                            <>Jamais extrait</>
                          )}
                        </p>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Connecté
                      </Badge>
                    </div>
                  </div>

                  {/* Extraction settings */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Extraction automatique</p>
                        <p className="text-sm text-muted-foreground">
                          Analyse les nouveaux emails toutes les 30 minutes
                        </p>
                      </div>
                    </div>
                    <Switch 
                      checked={(activeAccount as any)?.extraction_enabled ?? true}
                      onCheckedChange={() => toast.info('Configuration en cours...')}
                    />
                  </div>

                  {/* Extract button */}
                  <Button 
                    onClick={handleAutoExtract} 
                    disabled={isExtracting}
                    size="lg"
                    className="w-full gap-2"
                  >
                    {isExtracting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {isExtracting ? 'Extraction en cours...' : 'Lancer l\'extraction maintenant'}
                  </Button>

                  {/* Stats */}
                  {autoExtractionStats && (
                    <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{autoExtractionStats.emails_fetched}</div>
                        <div className="text-xs text-muted-foreground">Emails lus</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{autoExtractionStats.emails_imported}</div>
                        <div className="text-xs text-muted-foreground">Nouveaux</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{autoExtractionStats.candidates_created}</div>
                        <div className="text-xs text-muted-foreground">Candidats</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{autoExtractionStats.cvs_stored}</div>
                        <div className="text-xs text-muted-foreground">CVs stockés</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <Cloud className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">Connectez votre Outlook</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pour extraire automatiquement vos emails de candidature
                    </p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Configurer la connexion
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Ou utilisez l'import manuel ci-dessous
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Manual Import Mode */}
            <TabsContent value="manual" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Email de candidature</Label>
                <Textarea
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  placeholder={`De: Jean Dupont <jean.dupont@email.com>
Sujet: Candidature - Poste de Développeur
Date: 2024-01-15

Bonjour,

Je me permets de vous adresser ma candidature...

Cordialement,
Jean Dupont
06 12 34 56 78`}
                  className="min-h-[160px] font-mono text-sm"
                />
              </div>

              {/* CV Upload */}
              <div className="space-y-3">
                <Label>CV (PDF, DOCX)</Label>
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer",
                    "hover:border-primary hover:bg-primary/5",
                    attachments.length > 0 ? "border-primary/50 bg-primary/5" : "border-muted"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUpload(e.dataTransfer.files);
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Glissez-déposez ou cliquez
                  </p>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                        <FileText className="w-4 h-4 text-primary shrink-0" />
                        <span className="flex-1 text-sm truncate">{att.filename}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeAttachment(idx)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                onClick={handleManualExtract} 
                disabled={isExtracting}
                className="w-full gap-2"
              >
                {isExtracting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                {isExtracting ? 'Analyse...' : 'Analyser et importer'}
              </Button>
            </TabsContent>
          </Tabs>

          {/* Progress */}
          {isExtracting && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">{progressText}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Résultats ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.map((result) => (
              <div 
                key={result.email_id}
                className={cn(
                  "border rounded-lg overflow-hidden",
                  result.analysis.is_candidature ? "border-primary/30 bg-primary/5" : "border-muted"
                )}
              >
                <button
                  onClick={() => toggleResult(result.email_id)}
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      result.analysis.is_candidature ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{result.subject}</div>
                      <div className="text-xs text-muted-foreground truncate">{result.from}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {result.analysis.cv_parsed && (
                      <Badge variant="outline" className="text-xs">CV</Badge>
                    )}
                    {result.analysis.is_candidature && (
                      <Badge className="text-xs">{result.analysis.confidence}%</Badge>
                    )}
                    {expandedResults.has(result.email_id) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {expandedResults.has(result.email_id) && result.analysis.is_candidature && (
                  <div className="px-3 pb-3 pt-1 border-t bg-background">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {result.analysis.candidate_name && (
                        <div>
                          <span className="text-muted-foreground">Nom:</span>{' '}
                          <span className="font-medium">{result.analysis.candidate_name}</span>
                        </div>
                      )}
                      {result.analysis.candidate_phone && (
                        <div>
                          <span className="text-muted-foreground">Tél:</span>{' '}
                          <span className="font-medium">{result.analysis.candidate_phone}</span>
                        </div>
                      )}
                      {result.analysis.job_title_applied && (
                        <div>
                          <span className="text-muted-foreground">Poste:</span>{' '}
                          <span className="font-medium">{result.analysis.job_title_applied}</span>
                        </div>
                      )}
                      {result.analysis.skills_mentioned.length > 0 && (
                        <div className="col-span-2 flex flex-wrap gap-1">
                          {result.analysis.skills_mentioned.slice(0, 6).map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{skill}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
