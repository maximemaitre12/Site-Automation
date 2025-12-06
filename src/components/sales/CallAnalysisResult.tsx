import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Copy,
  Download,
  FileText
} from 'lucide-react';
import { CallAnalysis } from '@/hooks/useSalesProposals';
import { useToast } from '@/hooks/use-toast';

interface CallAnalysisResultProps {
  analysis: CallAnalysis;
  onClose?: () => void;
}

export function CallAnalysisResult({ analysis, onClose }: CallAnalysisResultProps) {
  const { toast } = useToast();

  const getSentimentIcon = (sentiment: string | null) => {
    switch (sentiment?.toLowerCase()) {
      case 'positif':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'négatif':
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <Minus className="w-4 h-4 text-warning" />;
    }
  };

  const getSentimentColor = (sentiment: string | null) => {
    switch (sentiment?.toLowerCase()) {
      case 'positif':
        return 'bg-success/20 text-success border-success/30';
      case 'négatif':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-warning/20 text-warning border-warning/30';
    }
  };

  const copyToClipboard = async () => {
    const text = `
Analyse d'appel: ${analysis.title}
Date: ${new Date(analysis.created_at).toLocaleDateString('fr-FR')}

📋 RÉSUMÉ
${analysis.summary}

💬 SENTIMENT: ${analysis.sentiment}

🎯 POINTS CLÉS
${(analysis.key_points as string[] || []).map(p => `• ${p}`).join('\n')}

⚠️ OBJECTIONS DÉTECTÉES
${(analysis.objections as string[] || []).map(o => `• ${o}`).join('\n')}

➡️ PROCHAINES ÉTAPES
${(analysis.next_steps as string[] || []).map(s => `• ${s}`).join('\n')}
    `.trim();

    await navigator.clipboard.writeText(text);
    toast({ title: 'Copié', description: 'Analyse copiée dans le presse-papiers' });
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {analysis.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              <Copy className="w-4 h-4" />
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                Fermer
              </Button>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {new Date(analysis.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sentiment Badge */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Sentiment global:</span>
          <Badge variant="outline" className={`${getSentimentColor(analysis.sentiment)} gap-1`}>
            {getSentimentIcon(analysis.sentiment)}
            {analysis.sentiment || 'Neutre'}
          </Badge>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Résumé
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 rounded-lg p-3">
            {analysis.summary || 'Aucun résumé disponible'}
          </p>
        </div>

        {/* Key Points */}
        {Array.isArray(analysis.key_points) && analysis.key_points.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              Points clés ({analysis.key_points.length})
            </h4>
            <ul className="space-y-1.5">
              {(analysis.key_points as string[]).map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Objections */}
        {Array.isArray(analysis.objections) && analysis.objections.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Objections détectées ({analysis.objections.length})
            </h4>
            <ul className="space-y-1.5">
              {(analysis.objections as string[]).map((objection, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                  <span className="text-foreground">{objection}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Steps */}
        {Array.isArray(analysis.next_steps) && analysis.next_steps.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-primary" />
              Prochaines étapes ({analysis.next_steps.length})
            </h4>
            <ul className="space-y-1.5">
              {(analysis.next_steps as string[]).map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-foreground">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Transcript preview */}
        {analysis.transcript && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Transcript original
            </h4>
            <ScrollArea className="h-32 rounded-lg border border-border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                {analysis.transcript}
              </p>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
