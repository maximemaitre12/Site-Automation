import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Wrench, Brain, Briefcase, Lightbulb, Star, 
  Copy, Check, Sparkles, Loader2, FileDown, User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InterviewQuestionsDisplayProps {
  questions: {
    technical?: string[];
    behavioral?: string[];
    experience?: string[];
    motivation?: string[];
    specific?: string[];
  } | null;
  candidateName: string;
  jobTitle?: string;
  matchScore?: number;
  onRegenerate?: () => void;
  isGenerating?: boolean;
}

const questionCategories = [
  { 
    key: 'technical', 
    label: 'Techniques', 
    icon: Wrench, 
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    tag: 'TECHNIQUE'
  },
  { 
    key: 'behavioral', 
    label: 'Comportementales', 
    icon: Brain, 
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    tag: 'STAR'
  },
  { 
    key: 'experience', 
    label: 'Expérience', 
    icon: Briefcase, 
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    tag: 'PARCOURS'
  },
  { 
    key: 'motivation', 
    label: 'Motivation', 
    icon: Lightbulb, 
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    tag: 'MOTIVATION'
  },
  { 
    key: 'specific', 
    label: 'Spécifiques au profil', 
    icon: Star, 
    color: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
    tag: 'PERSONNALISÉ'
  },
];

export function InterviewQuestionsDisplay({ 
  questions, 
  candidateName, 
  jobTitle, 
  matchScore,
  onRegenerate, 
  isGenerating 
}: InterviewQuestionsDisplayProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopyAll = () => {
    if (!questions) return;
    const allQuestions = questionCategories
      .map(cat => {
        const qs = questions[cat.key as keyof typeof questions];
        if (!qs?.length) return '';
        return `## ${cat.label}\n${qs.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
      })
      .filter(Boolean)
      .join('\n\n');
    
    navigator.clipboard.writeText(allQuestions);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyQuestion = (question: string, key: string) => {
    navigator.clipboard.writeText(question);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const totalQuestions = questions ? 
    Object.values(questions).reduce((sum, arr) => sum + (arr?.length || 0), 0) : 0;

  if (!questions) {
    return (
      <Card className="border-dashed bg-muted/20">
        <CardContent className="py-12 text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary/40" />
          <h3 className="text-lg font-medium mb-2">Questions d'entretien IA</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
            Générez des questions personnalisées basées sur le CV du candidat et les exigences du poste
          </p>
          <Button onClick={onRegenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Générer les questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{candidateName}</h3>
                {jobTitle && (
                  <p className="text-sm text-muted-foreground">{jobTitle}</p>
                )}
              </div>
              {matchScore !== undefined && (
                <Badge className={cn(
                  "ml-2",
                  matchScore >= 80 ? "bg-emerald-500/20 text-emerald-600" :
                  matchScore >= 60 ? "bg-blue-500/20 text-blue-600" :
                  "bg-amber-500/20 text-amber-600"
                )}>
                  Score: {matchScore}%
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                {totalQuestions} questions
              </Badge>
              <Button size="sm" variant="outline" onClick={handleCopyAll}>
                {copiedAll ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copiedAll ? 'Copié' : 'Tout copier'}
              </Button>
              <Button size="sm" variant="outline" onClick={onRegenerate} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions by Category */}
      <div className="grid grid-cols-1 gap-4">
        {questionCategories.map(cat => {
          const categoryQuestions = questions[cat.key as keyof typeof questions];
          if (!categoryQuestions?.length) return null;

          const Icon = cat.icon;

          return (
            <Card key={cat.key} className={cn("border", cat.color)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", cat.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {cat.label}
                  <Badge className={cat.badgeColor} variant="secondary">
                    {categoryQuestions.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {categoryQuestions.map((question, idx) => {
                    const key = `${cat.key}-${idx}`;
                    return (
                      <div 
                        key={key} 
                        className="group flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
                      >
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground leading-relaxed">{question}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {cat.tag}
                          </Badge>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleCopyQuestion(question, key)}
                        >
                          {copiedIndex === key ? 
                            <Check className="h-3 w-3 text-success" /> : 
                            <Copy className="h-3 w-3" />
                          }
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
