import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Download, Sparkles, Loader2, CheckCircle2, 
  AlertCircle, User, Mail, FileText, Briefcase,
  ChevronDown, ChevronUp, Inbox, Zap, Upload,
  Paperclip, FilePlus, X, Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useHREmails } from '@/hooks/useHREmails';

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
    cv_content?: string | null;
  };
}

interface AttachmentFile {
  file: File;
  filename: string;
  type: string;
  content?: string;
}

export function EmailExtractor({ onComplete }: { onComplete?: () => void }) {
  const { activeAccount } = useHREmails();
  const [mode, setMode] = useState<'quick' | 'full'>('quick');
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [results, setResults] = useState<ExtractionResult[]>([]);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
  
  // Quick mode state
  const [quickEmail, setQuickEmail] = useState('');
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Full mode state
  const [rawEmails, setRawEmails] = useState('');

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    
    const newAttachments: AttachmentFile[] = [];
    
    for (const file of Array.from(files)) {
      // Only accept PDF, DOCX, DOC
      if (file.type === 'application/pdf' || 
          file.type.includes('word') ||
          file.name.endsWith('.pdf') ||
          file.name.endsWith('.docx') ||
          file.name.endsWith('.doc')) {
        
        // Read file as base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); // Remove data URL prefix
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

    // Extract email from "From" field
    let fromEmail = '';
    let fromName = '';
    const emailMatch = from.match(/<(.+@.+)>/);
    if (emailMatch) {
      fromEmail = emailMatch[1];
      fromName = from.replace(/<.+>/, '').trim();
    } else if (from.includes('@')) {
      const parts = from.split(/\s/);
      fromEmail = parts.find(p => p.includes('@')) || '';
      fromName = parts.filter(p => !p.includes('@')).join(' ').trim();
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

  const parseRawEmails = (): any[] => {
    const blocks = rawEmails.split(/(?:\n-{3,}\n|\n={3,}\n|\n\n---\n\n)/);
    const emails: any[] = [];
    
    for (const block of blocks) {
      if (!block.trim()) continue;
      
      const fromMatch = block.match(/(?:De|From|Expéditeur)\s*:\s*(.+?)(?:\n|$)/i);
      const subjectMatch = block.match(/(?:Sujet|Subject|Objet)\s*:\s*(.+?)(?:\n|$)/i);
      const dateMatch = block.match(/(?:Date|Reçu|Received)\s*:\s*(.+?)(?:\n|$)/i);
      
      let fromEmail = '';
      let fromName = '';
      if (fromMatch) {
        const fromField = fromMatch[1].trim();
        const emailInBrackets = fromField.match(/<(.+@.+)>/);
        if (emailInBrackets) {
          fromEmail = emailInBrackets[1];
          fromName = fromField.replace(/<.+>/, '').trim();
        } else if (fromField.includes('@')) {
          fromEmail = fromField;
        }
      }
      
      let body = block;
      const headerEnd = block.search(/\n\n/);
      if (headerEnd > 0) {
        body = block.substring(headerEnd + 2);
      }
      
      if (fromEmail || subjectMatch) {
        emails.push({
          from_email: fromEmail || 'inconnu@email.com',
          from_name: fromName || 'Candidat',
          subject: subjectMatch ? subjectMatch[1].trim() : 'Sans sujet',
          body_text: body.trim(),
          body_html: '',
          email_date: dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString(),
          to_email: '',
          attachments: [],
        });
      }
    }
    
    if (emails.length === 0 && rawEmails.trim()) {
      const emailMatch = rawEmails.match(/[\w.-]+@[\w.-]+\.\w+/);
      emails.push({
        from_email: emailMatch ? emailMatch[0] : 'inconnu@email.com',
        from_name: 'Candidat',
        subject: 'Email importé',
        body_text: rawEmails.trim(),
        body_html: '',
        email_date: new Date().toISOString(),
        to_email: '',
        attachments: [],
      });
    }
    
    return emails;
  };

  const handleExtract = async () => {
    let emails: any[] = [];
    
    if (mode === 'quick') {
      if (!quickEmail.trim() && attachments.length === 0) {
        toast.error('Collez un email ou ajoutez un CV');
        return;
      }
      emails = [parseQuickEmail()];
    } else {
      if (!rawEmails.trim()) {
        toast.error('Collez des emails à analyser');
        return;
      }
      emails = parseRawEmails();
    }

    if (emails.length === 0) {
      toast.error('Aucun email détecté');
      return;
    }

    setIsExtracting(true);
    setProgress(10);
    setProgressText('Préparation...');
    setResults([]);

    try {
      setProgress(20);
      setProgressText(`Analyse de ${emails.length} email(s)...`);
      
      if (attachments.length > 0 && mode === 'quick') {
        setProgressText(`Parsing du CV (${attachments[0].filename})...`);
        setProgress(40);
      }

      const { data, error } = await supabase.functions.invoke('hr-email-extract', {
        body: { action: 'analyze', emails },
      });

      setProgress(90);
      setProgressText('Finalisation...');

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setResults(data.results || []);
        
        const stats = data.stats;
        const message = [
          `${stats.imported} email(s) analysé(s)`,
          stats.candidatures_detected > 0 ? `${stats.candidatures_detected} candidature(s) détectée(s)` : null,
          stats.candidates_created > 0 ? `${stats.candidates_created} candidat(s) créé(s)` : null,
          stats.cvs_parsed > 0 ? `${stats.cvs_parsed} CV(s) parsé(s)` : null,
        ].filter(Boolean).join(', ');
        
        toast.success(message);
        
        // Clear inputs
        setQuickEmail('');
        setRawEmails('');
        setAttachments([]);
        
        onComplete?.();
      } else {
        toast.error(data.message || 'Erreur lors de l\'extraction');
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
      {/* Main Input Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Extraction automatique de candidatures
          </CardTitle>
          <CardDescription>
            Collez un email avec son CV joint ou importez plusieurs emails. L'IA analysera le contenu, 
            parsera les CV PDF et créera automatiquement les fiches candidats.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={mode} onValueChange={(v) => setMode(v as 'quick' | 'full')}>
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="quick" className="gap-2">
                <FilePlus className="w-4 h-4" />
                Import rapide
              </TabsTrigger>
              <TabsTrigger value="full" className="gap-2">
                <Inbox className="w-4 h-4" />
                Multi-emails
              </TabsTrigger>
            </TabsList>

            {/* Quick Import Mode */}
            <TabsContent value="quick" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Email de candidature</Label>
                <Textarea
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  placeholder={`Collez l'email complet ici...

De: Jean Dupont <jean.dupont@email.com>
Sujet: Candidature - Poste de Développeur
Date: 2024-01-15

Bonjour,

Je me permets de vous adresser ma candidature pour le poste...

Cordialement,
Jean Dupont
06 12 34 56 78`}
                  className="min-h-[180px] font-mono text-sm"
                />
              </div>

              {/* CV Upload */}
              <div className="space-y-3">
                <Label>CV / Pièces jointes (PDF, DOCX)</Label>
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                    "hover:border-primary hover:bg-primary/5",
                    attachments.length > 0 ? "border-primary/50 bg-primary/5" : "border-muted"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFileUpload(e.dataTransfer.files);
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Glissez-déposez ou cliquez pour ajouter des fichiers
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOCX, DOC
                  </p>
                </div>

                {/* Uploaded files list */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((att, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <FileText className="w-5 h-5 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{att.filename}</p>
                          <p className="text-xs text-muted-foreground">
                            {(att.file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          {att.filename.endsWith('.pdf') ? 'PDF' : 'DOCX'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 h-8 w-8"
                          onClick={() => removeAttachment(idx)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Full Multi-Email Mode */}
            <TabsContent value="full" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Plusieurs emails (séparés par ---)</Label>
                <Textarea
                  value={rawEmails}
                  onChange={(e) => setRawEmails(e.target.value)}
                  placeholder={`Collez plusieurs emails séparés par --- ou ===

De: Jean Dupont <jean.dupont@email.com>
Sujet: Candidature Développeur
...

---

De: Marie Martin <marie.martin@email.com>
Sujet: Candidature spontanée
...`}
                  className="min-h-[250px] font-mono text-sm"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Note: Pour parser les CV joints, utilisez l'import rapide avec upload de fichiers
              </p>
            </TabsContent>
          </Tabs>

          {/* Extract Button */}
          <div className="flex items-center gap-4 pt-2">
            <Button 
              onClick={handleExtract} 
              disabled={isExtracting}
              size="lg"
              className="gap-2 min-w-[200px]"
            >
              {isExtracting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {isExtracting ? 'Extraction en cours...' : 'Lancer l\'extraction'}
            </Button>
            
            {mode === 'quick' && (
              <span className="text-sm text-muted-foreground">
                {attachments.length > 0 
                  ? `${attachments.length} fichier(s) à analyser` 
                  : 'L\'IA extraira les informations du candidat'}
              </span>
            )}
          </div>

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
                  "border rounded-lg overflow-hidden transition-colors",
                  result.analysis.is_candidature 
                    ? "border-primary/30 bg-primary/5" 
                    : "border-muted"
                )}
              >
                <button
                  onClick={() => toggleResult(result.email_id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      result.analysis.is_candidature 
                        ? "bg-primary/10 text-primary" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {result.analysis.is_candidature ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <Mail className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{result.subject}</div>
                      <div className="text-sm text-muted-foreground truncate">{result.from}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {result.analysis.cv_parsed && (
                      <Badge variant="outline" className="gap-1">
                        <FileText className="w-3 h-3" />
                        CV parsé
                      </Badge>
                    )}
                    {result.analysis.is_candidature ? (
                      <Badge className="gap-1">
                        <Zap className="w-3 h-3" />
                        {result.analysis.confidence}%
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Autre</Badge>
                    )}
                    {expandedResults.has(result.email_id) ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {expandedResults.has(result.email_id) && result.analysis.is_candidature && (
                  <div className="px-4 pb-4 pt-2 border-t bg-background">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {result.analysis.candidate_name && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Nom:</span>
                          <span className="font-medium">{result.analysis.candidate_name}</span>
                        </div>
                      )}
                      {result.analysis.candidate_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-medium">{result.analysis.candidate_email}</span>
                        </div>
                      )}
                      {result.analysis.candidate_phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Tél:</span>
                          <span className="font-medium">{result.analysis.candidate_phone}</span>
                        </div>
                      )}
                      {result.analysis.job_title_applied && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Poste:</span>
                          <span className="font-medium">{result.analysis.job_title_applied}</span>
                        </div>
                      )}
                      {result.analysis.experience_years && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Expérience:</span>
                          <span className="font-medium">{result.analysis.experience_years} ans</span>
                        </div>
                      )}
                      {result.analysis.skills_mentioned.length > 0 && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Compétences: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.analysis.skills_mentioned.slice(0, 10).map((skill, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {result.analysis.skills_mentioned.length > 10 && (
                              <Badge variant="outline" className="text-xs">
                                +{result.analysis.skills_mentioned.length - 10}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      {result.analysis.motivation_summary && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Motivation: </span>
                          <p className="mt-1 text-sm italic">"{result.analysis.motivation_summary}"</p>
                        </div>
                      )}
                      {result.analysis.cv_content && (
                        <div className="col-span-2 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground font-medium">Résumé du CV:</span>
                          </div>
                          <p className="text-sm">{result.analysis.cv_content}</p>
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
