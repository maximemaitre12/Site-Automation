import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Loader2, 
  Sparkles,
  Database,
  Users,
  Building2,
  FileText,
  Ticket,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { useAIIntelligence } from '@/hooks/useAIIntelligence';

const EXAMPLE_QUERIES = [
  "Quels deals sont à risque cette semaine ?",
  "Montre-moi les prospects avec un score > 80",
  "Quel est le taux de conversion ce mois-ci ?",
  "Combien de tickets support sont ouverts ?",
  "Quels candidats correspondent au poste de développeur ?",
  "Quelle est la valeur totale du pipeline ?",
];

export function UniversalSearch() {
  const { universalSearch, searchLoading } = useAIIntelligence();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    const data = await universalSearch(query);
    if (data) setResult(data);
  }, [query, universalSearch]);

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'deal': return <Building2 className="h-4 w-4" />;
      case 'company': return <Building2 className="h-4 w-4" />;
      case 'candidate': return <Users className="h-4 w-4" />;
      case 'ticket': return <Ticket className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Recherche Universelle IA
          </CardTitle>
          <CardDescription>
            Posez vos questions en langage naturel sur toutes vos données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Ex: Quels prospects ont le meilleur score cette semaine ?"
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={searchLoading || !query.trim()}>
              {searchLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </>
              )}
            </Button>
          </div>

          {/* Example Queries */}
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Exemples de questions :</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_QUERIES.map((example, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => handleExampleClick(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Main Answer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
                Réponse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{result.answer}</p>
              
              {/* Data Sources Used */}
              {result.data_used && result.data_used.length > 0 && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <span className="text-xs text-muted-foreground">Sources utilisées :</span>
                  {result.data_used.map((source: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key Findings */}
          {result.key_findings && result.key_findings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chiffres Clés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.key_findings.map((finding: any, idx: number) => (
                    <Card key={idx} className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-primary">{finding.value}</div>
                        <div className="text-sm font-medium">{finding.metric}</div>
                        {finding.insight && (
                          <div className="text-xs text-muted-foreground mt-1">{finding.insight}</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Relevant Records */}
          {result.relevant_records && result.relevant_records.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Enregistrements Pertinents</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {result.relevant_records.map((record: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-background rounded-lg">
                            {getEntityIcon(record.type)}
                          </div>
                          <div>
                            <div className="font-medium">{record.name}</div>
                            <div className="text-sm text-muted-foreground">{record.detail}</div>
                          </div>
                        </div>
                        <Badge variant="outline">{record.type}</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Follow-up Questions */}
          {result.follow_up_questions && result.follow_up_questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions Suggérées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.follow_up_questions.map((question: string, idx: number) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="text-left h-auto py-2"
                      onClick={() => {
                        setQuery(question);
                        handleSearch();
                      }}
                    >
                      {question}
                      <ArrowRight className="h-3 w-3 ml-2" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Context Stats */}
          {result.context_stats && (
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>Données analysées :</span>
              <span>{result.context_stats.deals} deals</span>
              <span>•</span>
              <span>{result.context_stats.companies} entreprises</span>
              <span>•</span>
              <span>{result.context_stats.candidates} candidats</span>
              <span>•</span>
              <span>{result.context_stats.tickets} tickets</span>
              <span>•</span>
              <span>{result.context_stats.documents} documents</span>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!result && !searchLoading && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg">Posez une question pour explorer vos données</p>
          <p className="text-sm mt-1">L'IA analysera toutes vos données pour vous répondre</p>
        </div>
      )}
    </div>
  );
}