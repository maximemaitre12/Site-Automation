import { useState } from 'react';
import { useDataPlatform } from '@/hooks/useDataPlatform';
import { useWebSearch } from '@/hooks/useWebSearch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, FileText, Table, Database, Clock, ArrowRight, Loader2, Globe, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DataSearch = () => {
  const { catalog, sources, loading } = useDataPlatform();
  const { searchWeb, isSearching: isWebSearching } = useWebSearch();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'internal' | 'web'>('internal');
  const [isSearching, setIsSearching] = useState(false);
  const [webResults, setWebResults] = useState<{ content: string; citations: string[] } | null>(null);
  const [results, setResults] = useState<Array<{
    type: 'dataset' | 'source';
    id: string;
    name: string;
    description?: string;
    score: number;
    tags?: string[];
  }>>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    if (searchType === 'web') {
      const result = await searchWeb(query);
      if (result) {
        setWebResults({
          content: result.content,
          citations: result.citations || []
        });
      }
      return;
    }
    
    setIsSearching(true);
    
    // Simulate semantic search delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const searchLower = query.toLowerCase();
    
    // Search in catalog
    const catalogResults = catalog
      .filter(entry => 
        entry.name.toLowerCase().includes(searchLower) ||
        entry.description?.toLowerCase().includes(searchLower) ||
        entry.tags.some(t => t.toLowerCase().includes(searchLower)) ||
        entry.owner?.toLowerCase().includes(searchLower)
      )
      .map(entry => ({
        type: 'dataset' as const,
        id: entry.id,
        name: entry.name,
        description: entry.description || undefined,
        score: Math.random() * 0.3 + 0.7, // Simulated relevance score
        tags: entry.tags
      }));
    
    // Search in sources
    const sourceResults = sources
      .filter(source => 
        source.name.toLowerCase().includes(searchLower) ||
        source.connector.toLowerCase().includes(searchLower)
      )
      .map(source => ({
        type: 'source' as const,
        id: source.id,
        name: source.name,
        description: `Connecteur ${source.connector}`,
        score: Math.random() * 0.3 + 0.6,
        tags: undefined
      }));
    
    // Combine and sort by score
    const allResults = [...catalogResults, ...sourceResults]
      .sort((a, b) => b.score - a.score);
    
    setResults(allResults);
    setWebResults(null);
    setIsSearching(false);
  };

  const recentSearches = ['clients', 'facturation', 'produits', 'leads', 'commandes'];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-3">
                <Sparkles className="h-4 w-4" />
                Recherche sémantique IA
              </div>
              <h2 className="text-2xl font-bold">Trouvez vos données</h2>
              <p className="text-muted-foreground">Recherche intelligente dans tous vos datasets et sur le web</p>
            </div>
            
            <Tabs value={searchType} onValueChange={(v) => setSearchType(v as 'internal' | 'web')} className="mb-4">
              <TabsList className="w-full">
                <TabsTrigger value="internal" className="flex-1 gap-2">
                  <Database className="h-4 w-4" />
                  Données internes
                </TabsTrigger>
                <TabsTrigger value="web" className="flex-1 gap-2">
                  <Globe className="h-4 w-4" />
                  Recherche Web IA
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={searchType === 'web' 
                    ? "Rechercher sur le web avec l'IA Perplexity..." 
                    : "Rechercher des datasets, colonnes, tags, descriptions..."
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button size="lg" onClick={handleSearch} disabled={isSearching || isWebSearching || !query.trim()}>
                {isSearching || isWebSearching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {searchType === 'web' ? <Globe className="h-5 w-5 mr-2" /> : <Search className="h-5 w-5 mr-2" />}
                    Rechercher
                  </>
                )}
              </Button>
            </div>

            {/* Recent Searches */}
            <div className="flex items-center gap-2 flex-wrap">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Récent:</span>
              {recentSearches.map(term => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  className="h-7"
                  onClick={() => { setQuery(term); handleSearch(); }}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Web Search Results */}
      {webResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-500" />
              Résultats Web IA
            </CardTitle>
            <CardDescription>Propulsé par Perplexity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap">{webResults.content}</div>
            </div>
            {webResults.citations.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Sources</h4>
                <div className="flex flex-wrap gap-2">
                  {webResults.citations.map((url, i) => (
                    <a 
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {new URL(url).hostname}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Résultats ({results.length})
            </CardTitle>
            <CardDescription>Classés par pertinence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div 
                  key={`${result.type}-${result.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      result.type === 'dataset' ? 'bg-blue-500/10' : 'bg-green-500/10'
                    }`}>
                      {result.type === 'dataset' ? (
                        <Table className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Database className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {result.name}
                        <Badge variant="outline" className="text-xs">
                          {result.type === 'dataset' ? 'Dataset' : 'Source'}
                        </Badge>
                      </div>
                      {result.description && (
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                      )}
                      {result.tags && result.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {result.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">
                        {Math.round(result.score * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">pertinence</div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isSearching && results.length === 0 && query && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun résultat pour "{query}"</p>
            <p className="text-sm">Essayez avec d'autres termes de recherche</p>
          </CardContent>
        </Card>
      )}

      {/* Initial State */}
      {!query && results.length === 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Table className="h-5 w-5 text-blue-600" />
                </div>
                <div className="font-medium">Datasets</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Parcourez tous vos datasets catalogués avec leurs métadonnées
              </p>
              <div className="mt-3 text-2xl font-bold">{catalog.length}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Database className="h-5 w-5 text-green-600" />
                </div>
                <div className="font-medium">Sources</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Explorez les connecteurs et sources de données configurés
              </p>
              <div className="mt-3 text-2xl font-bold">{sources.length}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div className="font-medium">Documentation</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Accédez à la documentation et aux schémas de données
              </p>
              <div className="mt-3 text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DataSearch;
