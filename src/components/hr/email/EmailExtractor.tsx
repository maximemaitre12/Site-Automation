import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Download, Sparkles, Loader2, CheckCircle2, 
  AlertCircle, User, Mail, FileText, Briefcase,
  ChevronDown, ChevronUp, Inbox, Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
  };
}

interface ExtractionStats {
  total: number;
  imported: number;
  candidates_created: number;
  candidatures_detected: number;
}

export function EmailExtractor({ onComplete }: { onComplete?: () => void }) {
  const [rawEmails, setRawEmails] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ExtractionResult[]>([]);
  const [stats, setStats] = useState<ExtractionStats | null>(null);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());

  const parseRawEmails = (raw: string): any[] => {
    const emails: any[] = [];
    
    // Try to detect email format (mbox, simple paste, etc.)
    // Simple format: emails separated by --- or ====
    const blocks = raw.split(/(?:\n-{3,}\n|\n={3,}\n|\n\n---\n\n)/);
    
    for (const block of blocks) {
      if (!block.trim()) continue;
      
      // Try to extract email parts
      const fromMatch = block.match(/(?:De|From|Expéditeur)\s*:\s*(.+?)(?:\n|$)/i);
      const subjectMatch = block.match(/(?:Sujet|Subject|Objet)\s*:\s*(.+?)(?:\n|$)/i);
      const dateMatch = block.match(/(?:Date|Reçu|Received)\s*:\s*(.+?)(?:\n|$)/i);
      
      // Extract email from "From" field
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
      
      // Get body (everything after headers)
      let body = block;
      const headerEnd = block.search(/\n\n/);
      if (headerEnd > 0) {
        body = block.substring(headerEnd + 2);
      }
      
      if (fromEmail || subjectMatch) {
        emails.push({
          from_email: fromEmail || 'inconnu@email.com',
          from_name: fromName || 'Inconnu',
          subject: subjectMatch ? subjectMatch[1].trim() : 'Sans sujet',
          body_text: body.trim(),
          body_html: '',
          email_date: dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString(),
          to_email: '',
          attachments: [],
        });
      }
    }
    
    // If no structured emails found, treat whole text as one email
    if (emails.length === 0 && raw.trim()) {
      const emailMatch = raw.match(/[\w.-]+@[\w.-]+\.\w+/);
      emails.push({
        from_email: emailMatch ? emailMatch[0] : 'inconnu@email.com',
        from_name: 'Candidat',
        subject: 'Email importé',
        body_text: raw.trim(),
        body_html: '',
        email_date: new Date().toISOString(),
        to_email: '',
        attachments: [],
      });
    }
    
    return emails;
  };

  const handleExtract = async () => {
    if (!rawEmails.trim()) {
      toast.error('Collez des emails à analyser');
      return;
    }

    setIsExtracting(true);
    setProgress(10);
    setResults([]);
    setStats(null);

    try {
      const emails = parseRawEmails(rawEmails);
      
      if (emails.length === 0) {
        toast.error('Aucun email détecté dans le texte');
        setIsExtracting(false);
        return;
      }

      setProgress(30);
      toast.info(`${emails.length} email(s) détecté(s), analyse en cours...`);

      const { data, error } = await supabase.functions.invoke('hr-email-extract', {
        body: { action: 'analyze', emails },
      });

      setProgress(90);

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setResults(data.results || []);
        setStats(data.stats);
        toast.success(data.message);
        setRawEmails('');
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
      }, 500);
    }
  };

  const toggleResult = (id: string) => {
    setExpandedResults(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="w-5 h-5" />
            Extraction automatique
          </CardTitle>
          <CardDescription>
            Collez vos emails de candidature. L'IA analysera automatiquement chaque email 
            pour détecter les candidatures et créer les fiches candidats.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={rawEmails}
            onChange={(e) => setRawEmails(e.target.value)}
            placeholder={`Collez ici un ou plusieurs emails...

Exemple de format:
De: Jean Dupont <jean.dupont@email.com>
Sujet: Candidature - Poste de Développeur
Date: 2024-01-15

Bonjour,

Je me permets de vous adresser ma candidature pour le poste de développeur...

Cordialement,
Jean Dupont
06 12 34 56 78

---

De: Marie Martin <marie.martin@email.com>
Sujet: Candidature spontanée
...`}
            className="min-h-[200px] font-mono text-sm"
          />

          <div className="flex items-center gap-3">
            <Button 
              onClick={handleExtract} 
              disabled={isExtracting || !rawEmails.trim()}
              className="gap-2"
              size="lg"
            >
              {isExtracting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isExtracting ? 'Analyse en cours...' : 'Lancer l\'extraction'}
            </Button>
            
            <span className="text-sm text-muted-foreground">
              L'IA détectera les candidatures et extraira les informations
            </span>
          </div>

          {isExtracting && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {progress < 30 ? 'Parsing des emails...' :
                 progress < 90 ? 'Analyse IA en cours...' :
                 'Finalisation...'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Card */}
      {stats && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Emails analysés</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{stats.candidatures_detected}</div>
                <div className="text-sm text-muted-foreground">Candidatures détectées</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{stats.candidates_created}</div>
                <div className="text-sm text-muted-foreground">Candidats créés</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.imported}</div>
                <div className="text-sm text-muted-foreground">Emails importés</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Résultats de l'extraction
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
                    {result.analysis.is_candidature ? (
                      <Badge className="gap-1">
                        <Zap className="w-3 h-3" />
                        Candidature ({result.analysis.confidence}%)
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
                      {result.analysis.has_cv_attachment && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <Badge variant="outline" className="gap-1">
                            <FileText className="w-3 h-3" />
                            CV joint
                          </Badge>
                        </div>
                      )}
                      {result.analysis.skills_mentioned.length > 0 && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Compétences: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.analysis.skills_mentioned.map((skill, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.analysis.motivation_summary && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Motivation: </span>
                          <p className="mt-1 text-sm italic">
                            "{result.analysis.motivation_summary}"
                          </p>
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
