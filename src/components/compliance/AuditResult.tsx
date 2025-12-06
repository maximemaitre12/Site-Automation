import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, XCircle, ChevronRight, Trash2, FileText, Download } from "lucide-react";
import { Audit, Risk, Recommendation } from "@/hooks/useCompliance";
import { cn } from "@/lib/utils";

interface AuditResultProps {
  audit: Audit;
  onDelete: (id: string) => void;
  onGenerateReport: (id: string) => void;
}

const severityColors = {
  low: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  medium: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
  high: 'bg-orange-500/20 text-orange-600 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-600 border-red-500/30'
};

const priorityColors = {
  low: 'bg-blue-500/20 text-blue-600',
  medium: 'bg-yellow-500/20 text-yellow-600',
  high: 'bg-red-500/20 text-red-600'
};

export function AuditResult({ audit, onDelete, onGenerateReport }: AuditResultProps) {
  const score = audit.compliance_score || 0;
  const scoreColor = score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500';
  const scoreBg = score >= 80 ? 'bg-green-500/20' : score >= 60 ? 'bg-yellow-500/20' : 'bg-red-500/20';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{audit.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(audit.created_at).toLocaleDateString('fr-FR', { 
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
              })}
            </p>
          </div>
          <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", scoreBg)}>
            <span className={cn("text-2xl font-bold", scoreColor)}>{score}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary">{audit.audit_type.toUpperCase()}</Badge>
          <Badge variant={audit.status === 'completed' ? 'default' : 'secondary'}>
            {audit.status === 'completed' ? 'Terminé' : 'En cours'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Risks */}
        {audit.risks && audit.risks.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Risques identifiés ({audit.risks.length})
            </h4>
            <ScrollArea className="h-48">
              <div className="space-y-2 pr-4">
                {audit.risks.map((risk, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "p-3 rounded-lg border",
                      severityColors[risk.severity]
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{risk.category}</span>
                      <Badge variant="outline" className="text-xs">
                        {risk.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-90">{risk.description}</p>
                    {risk.article && (
                      <p className="text-xs mt-1 opacity-70">{risk.article}</p>
                    )}
                    <div className="mt-2 pt-2 border-t border-current/20">
                      <p className="text-xs flex items-start gap-1">
                        <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {risk.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Recommendations */}
        {audit.recommendations && audit.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Recommandations ({audit.recommendations.length})
            </h4>
            <div className="space-y-2">
              {audit.recommendations.slice(0, 5).map((rec, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={priorityColors[rec.priority]} variant="secondary">
                      {rec.priority === 'high' ? 'Prioritaire' : rec.priority === 'medium' ? 'Moyen' : 'Faible'}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{rec.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rec.impact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Content Preview */}
        {audit.report_content && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Analyse détaillée</h4>
            <div className="p-3 rounded-lg bg-muted/30 border border-border max-h-32 overflow-y-auto">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {audit.report_content.slice(0, 500)}...
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => onGenerateReport(audit.id)}
          >
            <FileText className="w-4 h-4 mr-2" />
            Rapport complet
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(audit.id)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
