import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Copy, 
  Merge, 
  Search, 
  Building2, 
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { useAIIntelligence } from '@/hooks/useAIIntelligence';

interface DuplicateCandidate {
  entity_1_id: string;
  entity_2_id: string;
  entity_1_name: string;
  entity_2_name: string;
  similarity_score: number;
  matching_fields: string[];
}

export function DeduplicationPanel() {
  const { detectDuplicates, enrichEntity } = useAIIntelligence();
  const [activeTab, setActiveTab] = useState('companies');
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [enrichmentResult, setEnrichmentResult] = useState<any>(null);
  const [enrichingId, setEnrichingId] = useState<string | null>(null);

  const handleDetectDuplicates = async (entityType: 'company' | 'deal') => {
    setLoading(true);
    setDuplicates([]);
    const result = await detectDuplicates(entityType);
    if (result?.duplicates) {
      setDuplicates(result.duplicates);
    }
    setLoading(false);
  };

  const handleEnrich = async (entityId: string, entityType: 'company' | 'deal') => {
    setEnrichingId(entityId);
    const result = await enrichEntity(entityId, entityType);
    if (result) {
      setEnrichmentResult(result);
    }
    setEnrichingId(null);
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 0.9) return 'text-red-500';
    if (score >= 0.8) return 'text-orange-500';
    if (score >= 0.7) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Entreprises
          </TabsTrigger>
          <TabsTrigger value="deals" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Deals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="h-5 w-5 text-orange-500" />
                  Détection des Doublons - Entreprises
                </CardTitle>
                <CardDescription>
                  Identifiez et fusionnez les entreprises en double
                </CardDescription>
              </div>
              <Button onClick={() => handleDetectDuplicates('company')} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Analyser
              </Button>
            </CardHeader>
            <CardContent>
              {duplicates.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {duplicates.map((dup, idx) => (
                      <Card key={idx} className="border-l-4 border-orange-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                                <span className={`font-bold ${getSimilarityColor(dup.similarity_score)}`}>
                                  {(dup.similarity_score * 100).toFixed(0)}% similaire
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-2 bg-muted/50 rounded">
                                  <p className="font-medium">{dup.entity_1_name}</p>
                                  <p className="text-xs text-muted-foreground">{dup.entity_1_id.slice(0, 8)}...</p>
                                </div>
                                <div className="p-2 bg-muted/50 rounded">
                                  <p className="font-medium">{dup.entity_2_name}</p>
                                  <p className="text-xs text-muted-foreground">{dup.entity_2_id.slice(0, 8)}...</p>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-2">
                                {dup.matching_fields.map((field, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {field}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <XCircle className="h-4 w-4 mr-1" />
                                Ignorer
                              </Button>
                              <Button size="sm">
                                <Merge className="h-4 w-4 mr-1" />
                                Fusionner
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>Aucun doublon détecté</p>
                  <p className="text-sm">Lancez une analyse pour vérifier vos données</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="h-5 w-5 text-orange-500" />
                  Détection des Doublons - Deals
                </CardTitle>
                <CardDescription>
                  Identifiez les deals potentiellement dupliqués
                </CardDescription>
              </div>
              <Button onClick={() => handleDetectDuplicates('deal')} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Analyser
              </Button>
            </CardHeader>
            <CardContent>
              {duplicates.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {duplicates.map((dup, idx) => (
                      <Card key={idx} className="border-l-4 border-orange-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                                <span className={`font-bold ${getSimilarityColor(dup.similarity_score)}`}>
                                  {(dup.similarity_score * 100).toFixed(0)}% similaire
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-2 bg-muted/50 rounded">
                                  <p className="font-medium">{dup.entity_1_name}</p>
                                </div>
                                <div className="p-2 bg-muted/50 rounded">
                                  <p className="font-medium">{dup.entity_2_name}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-2">
                                {dup.matching_fields.map((field, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {field}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <XCircle className="h-4 w-4 mr-1" />
                                Ignorer
                              </Button>
                              <Button size="sm">
                                <Merge className="h-4 w-4 mr-1" />
                                Fusionner
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>Aucun doublon détecté</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enrichment Result */}
      {enrichmentResult && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Résultat d'Enrichissement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Qualité des données</span>
                <div className="flex items-center gap-2">
                  <Progress value={enrichmentResult.enrichment?.enrichment_quality || 50} className="w-32" />
                  <span className="text-sm font-medium">
                    {enrichmentResult.enrichment?.enrichment_quality || 50}%
                  </span>
                </div>
              </div>
              
              {enrichmentResult.enrichment?.missing_fields?.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Champs manquants :</p>
                  <div className="flex flex-wrap gap-2">
                    {enrichmentResult.enrichment.missing_fields.map((field: string, i: number) => (
                      <Badge key={i} variant="destructive">{field}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {enrichmentResult.enrichment?.recommendations?.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Recommandations :</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {enrichmentResult.enrichment.recommendations.map((rec: string, i: number) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}