import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, CheckCircle, Target, Lightbulb, 
  TrendingUp, MessageSquare, ArrowRight, Mail
} from "lucide-react";
import { useMemo } from "react";

interface ProposalDisplayProps {
  proposal: string;
  clientName: string;
  productName: string;
  onCopy: () => void;
}

interface ParsedProposal {
  accroche: string;
  probleme: string;
  solution: string;
  benefices: string[];
  preuves: string;
  objection_reponse: string;
  prochaine_etape: string;
  email_court: string;
}

export function ProposalDisplay({ proposal, clientName, productName, onCopy }: ProposalDisplayProps) {
  const parsed = useMemo((): ParsedProposal | null => {
    try {
      // Try to extract JSON from the response
      let jsonContent = proposal;
      const jsonMatch = proposal.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1].trim();
      }
      // Also try to find JSON object directly
      const directJsonMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (directJsonMatch) {
        jsonContent = directJsonMatch[0];
      }
      return JSON.parse(jsonContent);
    } catch {
      return null;
    }
  }, [proposal]);

  // Fallback to raw text if parsing fails
  if (!parsed) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-semibold">Proposition générée</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onCopy}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
            {proposal}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Proposition pour {clientName}</h3>
            <p className="text-sm text-muted-foreground">{productName}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onCopy} className="gap-2">
          <Copy className="w-4 h-4" />
          Copier tout
        </Button>
      </div>

      {/* Accroche - Big quote */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-lg font-medium text-foreground leading-relaxed">
            "{parsed.accroche}"
          </p>
        </CardContent>
      </Card>

      {/* Problem & Solution Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Le problème</span>
            </div>
            <p className="text-foreground text-sm leading-relaxed">{parsed.probleme}</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Notre solution</span>
            </div>
            <p className="text-foreground text-sm leading-relaxed">{parsed.solution}</p>
          </CardContent>
        </Card>
      </div>

      {/* Benefits */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Ce que vous gagnez</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {parsed.benefices.map((b, i) => (
              <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm">
                ✓ {b}
              </Badge>
            ))}
          </div>
          {parsed.preuves && (
            <p className="mt-4 text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
              {parsed.preuves}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Objection Response */}
      {parsed.objection_reponse && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-600">Réponse à l'objection</span>
            </div>
            <p className="text-foreground text-sm leading-relaxed">{parsed.objection_reponse}</p>
          </CardContent>
        </Card>
      )}

      {/* Next Step - CTA */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <CardContent className="pt-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm opacity-80">Prochaine étape</span>
              <p className="font-medium mt-1">{parsed.prochaine_etape}</p>
            </div>
            <ArrowRight className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Email Draft */}
      {parsed.email_court && (
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Email prêt à envoyer</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigator.clipboard.writeText(parsed.email_court)}
                className="h-8"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copier
              </Button>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {parsed.email_court}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}