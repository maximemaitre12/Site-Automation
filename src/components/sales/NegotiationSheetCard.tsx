import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, Shield, Zap, Euro, Trophy, ArrowRight, 
  Calendar, Copy, Trash2, CheckCircle, AlertTriangle
} from 'lucide-react';
import { NegotiationSheet } from '@/hooks/useNegotiationSheets';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface NegotiationSheetCardProps {
  sheet: NegotiationSheet;
  onDelete?: () => void;
  expanded?: boolean;
}

export function NegotiationSheetCard({ sheet, onDelete, expanded = false }: NegotiationSheetCardProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('arguments');

  const copyToClipboard = async () => {
    const content = `
FICHE DE NÉGOCIATION - ${sheet.title}
${sheet.company_context ? `Entreprise: ${sheet.company_context}` : ''}
${sheet.contact_context ? `Contact: ${sheet.contact_context}` : ''}

ARGUMENTS CLÉS:
${(sheet.key_arguments || []).map((a, i) => `${i + 1}. ${a}`).join('\n')}

OBJECTIONS ANTICIPÉES:
${(sheet.anticipated_objections || []).map((o, i) => `${i + 1}. ${o}`).join('\n')}

CONTRE-ARGUMENTS:
${(sheet.counter_arguments || []).map((c, i) => `${i + 1}. ${c}`).join('\n')}

JUSTIFICATION PRIX:
${sheet.price_justification || 'Non définie'}

AVANTAGES CONCURRENTIELS:
${(sheet.competitive_advantages || []).map((a, i) => `${i + 1}. ${a}`).join('\n')}

STRATÉGIES DE CLOSING:
${(sheet.closing_strategies || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}

PROCHAINES ÉTAPES:
${(sheet.next_steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}
`.trim();

    await navigator.clipboard.writeText(content);
    toast({ title: 'Copié', description: 'Fiche copiée dans le presse-papiers' });
  };

  const getStatusBadge = () => {
    const statuses: Record<string, { label: string; color: string }> = {
      preparation: { label: 'Préparation', color: 'bg-blue-500/20 text-blue-600 border-blue-500/30' },
      in_progress: { label: 'En cours', color: 'bg-orange-500/20 text-orange-600 border-orange-500/30' },
      completed: { label: 'Terminé', color: 'bg-green-500/20 text-green-600 border-green-500/30' },
    };
    const status = statuses[sheet.negotiation_status] || statuses.preparation;
    return <Badge variant="outline" className={status.color}>{status.label}</Badge>;
  };

  if (!expanded) {
    return (
      <Card className="hover:border-primary/30 transition-all cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-medium text-sm">{sheet.title}</h4>
              {sheet.company_context && (
                <p className="text-xs text-muted-foreground">{sheet.company_context}</p>
              )}
            </div>
            {getStatusBadge()}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {format(new Date(sheet.created_at), 'dd MMM yyyy', { locale: fr })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              {sheet.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              {sheet.company_context && <span>{sheet.company_context}</span>}
              {sheet.contact_context && (
                <>
                  <span>•</span>
                  <span>{sheet.contact_context}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
              <Copy className="w-4 h-4" />
            </Button>
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="arguments">Arguments</TabsTrigger>
            <TabsTrigger value="objections">Objections</TabsTrigger>
            <TabsTrigger value="strategy">Stratégie</TabsTrigger>
            <TabsTrigger value="next">Suivi</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-64 mt-4">
            <TabsContent value="arguments" className="space-y-4 mt-0">
              <div>
                <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Arguments Clés
                </h5>
                <div className="space-y-2">
                  {(sheet.key_arguments || []).map((arg, i) => (
                    <div key={i} className="p-2 rounded-lg bg-card border border-border text-sm">
                      {arg}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-green-500" />
                  Avantages Concurrentiels
                </h5>
                <div className="flex flex-wrap gap-2">
                  {(sheet.competitive_advantages || []).map((adv, i) => (
                    <Badge key={i} variant="secondary">{adv}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Euro className="w-4 h-4 text-blue-500" />
                  Justification Prix
                </h5>
                <p className="text-sm text-muted-foreground bg-card p-3 rounded-lg border border-border">
                  {sheet.price_justification || 'Non définie'}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="objections" className="space-y-4 mt-0">
              <div>
                <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Objections Anticipées
                </h5>
                <div className="space-y-2">
                  {(sheet.anticipated_objections || []).map((obj, i) => (
                    <div key={i} className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-sm">
                      {obj}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  Contre-Arguments
                </h5>
                <div className="space-y-2">
                  {(sheet.counter_arguments || []).map((counter, i) => (
                    <div key={i} className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-sm">
                      {counter}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="strategy" className="space-y-4 mt-0">
              <div>
                <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-500" />
                  Stratégies de Closing
                </h5>
                <div className="space-y-2">
                  {(sheet.closing_strategies || []).map((strat, i) => (
                    <div key={i} className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{strat}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="next" className="space-y-4 mt-0">
              <div>
                <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                  Prochaines Étapes
                </h5>
                <div className="space-y-2">
                  {(sheet.next_steps || []).map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-card border border-border">
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium">
                        {i + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {sheet.follow_up_date && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    <span className="font-medium">Suivi prévu:</span>
                    {format(new Date(sheet.follow_up_date), 'dd MMMM yyyy', { locale: fr })}
                  </div>
                  {sheet.follow_up_notes && (
                    <p className="text-xs text-muted-foreground mt-1">{sheet.follow_up_notes}</p>
                  )}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
