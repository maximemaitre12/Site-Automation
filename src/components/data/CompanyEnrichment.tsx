import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Building2, Globe, Hash, Loader2, CheckCircle2, 
  AlertTriangle, TrendingUp, TrendingDown, Users, Euro,
  MapPin, Calendar, ExternalLink, Trash2, RefreshCw, Shield
} from 'lucide-react';
import { useEnrichedCompanies, EnrichedCompany } from '@/hooks/useEnrichedCompanies';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function CompanyEnrichment() {
  const { 
    companies, 
    alerts, 
    requests,
    loading, 
    enriching, 
    stats,
    enrichCompany, 
    deleteCompany 
  } = useEnrichedCompanies();
  
  const [searchType, setSearchType] = useState<'name' | 'siren' | 'siret' | 'website'>('name');
  const [searchValue, setSearchValue] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<EnrichedCompany | null>(null);

  const handleEnrich = async () => {
    if (!searchValue.trim()) return;
    
    const result = await enrichCompany(searchType, searchValue.trim());
    if (result) {
      setSelectedCompany(result);
      setSearchValue('');
    }
  };

  const getVerificationBadge = (status?: string, confidence?: number) => {
    if (status === 'verified' && confidence && confidence >= 70) {
      return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" /> Vérifié ({confidence}%)</Badge>;
    }
    if (status === 'partial') {
      return <Badge variant="secondary"><AlertTriangle className="w-3 h-3 mr-1" /> Partiel ({confidence}%)</Badge>;
    }
    return <Badge variant="outline">Non vérifié</Badge>;
  };

  const getRiskBadge = (score?: number) => {
    if (!score) return null;
    if (score >= 70) return <Badge variant="destructive"><TrendingDown className="w-3 h-3 mr-1" /> Risque élevé</Badge>;
    if (score >= 40) return <Badge variant="secondary">Risque modéré</Badge>;
    return <Badge className="bg-green-500">Risque faible</Badge>;
  };

  const getOpportunityBadge = (score?: number) => {
    if (!score) return null;
    if (score >= 70) return <Badge className="bg-blue-500"><TrendingUp className="w-3 h-3 mr-1" /> Forte opportunité</Badge>;
    if (score >= 40) return <Badge variant="secondary">Opportunité modérée</Badge>;
    return <Badge variant="outline">Opportunité faible</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-sm text-muted-foreground">Entreprises</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.verifiedCompanies}</div>
            <p className="text-sm text-muted-foreground">Vérifiées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.avgConfidenceScore}%</div>
            <p className="text-sm text-muted-foreground">Confiance moyenne</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-500">{stats.unreadAlerts}</div>
            <p className="text-sm text-muted-foreground">Alertes</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Enrichir une entreprise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={searchType} onValueChange={(v) => setSearchType(v as any)}>
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="name">Nom</TabsTrigger>
              <TabsTrigger value="siren">SIREN</TabsTrigger>
              <TabsTrigger value="siret">SIRET</TabsTrigger>
              <TabsTrigger value="website">Site web</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder={
                  searchType === 'name' ? 'Nom de l\'entreprise...' :
                  searchType === 'siren' ? 'Numéro SIREN (9 chiffres)...' :
                  searchType === 'siret' ? 'Numéro SIRET (14 chiffres)...' :
                  'https://exemple.com'
                }
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEnrich()}
              />
            </div>
            <Button onClick={handleEnrich} disabled={enriching || !searchValue.trim()}>
              {enriching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enrichissement...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Enrichir
                </>
              )}
            </Button>
          </div>

          {enriching && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Recherche en cours sur les sources officielles et web...
              </div>
              <Progress value={45} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Companies List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Entreprises enrichies ({companies.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {companies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune entreprise enrichie. Utilisez la recherche ci-dessus.
                </div>
              ) : (
                <div className="space-y-3">
                  {companies.map((company) => (
                    <Card 
                      key={company.id} 
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedCompany?.id === company.id ? 'border-primary' : ''
                      }`}
                      onClick={() => setSelectedCompany(company)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="font-medium">{company.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              {company.city && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {company.city}
                                </span>
                              )}
                              {company.naf_label && (
                                <span className="truncate max-w-[150px]">{company.naf_label}</span>
                              )}
                            </div>
                            <div className="flex gap-2 flex-wrap mt-2">
                              {getVerificationBadge(company.verification_status, company.confidence_score)}
                              {getRiskBadge(company.ai_risk_score)}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCompany(company.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Company Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Fiche entreprise
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCompany ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{selectedCompany.name}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {getVerificationBadge(selectedCompany.verification_status, selectedCompany.confidence_score)}
                      {getRiskBadge(selectedCompany.ai_risk_score)}
                      {getOpportunityBadge(selectedCompany.ai_opportunity_score)}
                    </div>
                  </div>

                  {/* AI Summary */}
                  {selectedCompany.ai_summary && (
                    <div className="p-3 bg-muted rounded-lg">
                      <Label className="text-xs text-muted-foreground">Résumé IA</Label>
                      <p className="text-sm mt-1">{selectedCompany.ai_summary}</p>
                    </div>
                  )}

                  {/* Key Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedCompany.siren && (
                      <div>
                        <Label className="text-xs text-muted-foreground">SIREN</Label>
                        <div className="font-mono">{selectedCompany.siren}</div>
                      </div>
                    )}
                    {selectedCompany.siret && (
                      <div>
                        <Label className="text-xs text-muted-foreground">SIRET</Label>
                        <div className="font-mono">{selectedCompany.siret}</div>
                      </div>
                    )}
                    {selectedCompany.legal_form && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Forme juridique</Label>
                        <div>{selectedCompany.legal_form}</div>
                      </div>
                    )}
                    {selectedCompany.naf_label && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Secteur</Label>
                        <div>{selectedCompany.naf_label}</div>
                      </div>
                    )}
                    {selectedCompany.employees_count && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Effectifs</Label>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {selectedCompany.employees_count.toLocaleString()}
                        </div>
                      </div>
                    )}
                    {selectedCompany.revenue && (
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          CA {selectedCompany.revenue_year || ''}
                        </Label>
                        <div className="flex items-center gap-1">
                          <Euro className="h-3 w-3" />
                          {selectedCompany.revenue.toLocaleString()}€
                        </div>
                      </div>
                    )}
                    {selectedCompany.capital && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Capital</Label>
                        <div>{selectedCompany.capital.toLocaleString()}€</div>
                      </div>
                    )}
                    {selectedCompany.creation_date && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Création</Label>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {selectedCompany.creation_date}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  {(selectedCompany.address || selectedCompany.city) && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Adresse</Label>
                      <div className="text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {[selectedCompany.address, selectedCompany.postal_code, selectedCompany.city]
                          .filter(Boolean).join(', ')}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-2 flex-wrap">
                    {selectedCompany.website && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-3 w-3 mr-1" /> Site web
                        </a>
                      </Button>
                    )}
                    {selectedCompany.linkedin_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={selectedCompany.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" /> LinkedIn
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Executives */}
                  {selectedCompany.executives && selectedCompany.executives.length > 0 && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Dirigeants</Label>
                      <div className="space-y-1 mt-1">
                        {selectedCompany.executives.map((exec: any, i: number) => (
                          <div key={i} className="text-sm flex items-center gap-2">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{exec.name}</span>
                            {exec.role && <span className="text-muted-foreground">- {exec.role}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Analysis */}
                  {selectedCompany.ai_industry_analysis && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Analyse sectorielle</Label>
                      <p className="text-sm mt-1">{selectedCompany.ai_industry_analysis}</p>
                    </div>
                  )}

                  {selectedCompany.ai_competitive_position && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Position concurrentielle</Label>
                      <p className="text-sm mt-1">{selectedCompany.ai_competitive_position}</p>
                    </div>
                  )}

                  {/* Keywords */}
                  {selectedCompany.ai_keywords && selectedCompany.ai_keywords.length > 0 && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Mots-clés</Label>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {selectedCompany.ai_keywords.map((keyword: string, i: number) => (
                          <Badge key={i} variant="outline">{keyword}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Data Sources */}
                  {selectedCompany.data_sources && selectedCompany.data_sources.length > 0 && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Sources de données</Label>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {selectedCompany.data_sources.map((source: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">{source}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Last updated */}
                  {selectedCompany.last_enriched_at && (
                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Dernière mise à jour: {format(new Date(selectedCompany.last_enriched_at), 'PPpp', { locale: fr })}
                    </div>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Sélectionnez une entreprise pour voir les détails
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      {requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Historique des enrichissements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {requests.slice(0, 10).map((req) => (
                <div key={req.id} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{req.query_type.toUpperCase()}</Badge>
                    <span className="font-mono text-sm">{req.query_value}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {req.processing_time_ms && (
                      <span className="text-xs text-muted-foreground">{req.processing_time_ms}ms</span>
                    )}
                    <Badge 
                      variant={req.status === 'completed' ? 'default' : req.status === 'failed' ? 'destructive' : 'secondary'}
                    >
                      {req.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
