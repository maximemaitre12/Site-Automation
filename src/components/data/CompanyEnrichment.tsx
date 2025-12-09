import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, Building2, Plus, Loader2, CheckCircle, AlertTriangle, 
  Globe, Hash, FileText, TrendingUp, Shield, Target, Clock,
  Database, Bot, Landmark, MapPin, Trash2, ChevronRight
} from 'lucide-react';
import { useEnrichedCompanies, EnrichedCompany } from '@/hooks/useEnrichedCompanies';
import { CompanyDetailView } from './CompanyDetailView';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const enrichmentSteps = [
  { id: 1, label: 'Recherche dans les registres officiels', icon: Landmark },
  { id: 2, label: 'Vérification des doublons', icon: Database },
  { id: 3, label: 'Analyse du site web', icon: Globe },
  { id: 4, label: 'Analyse IA et enrichissement', icon: Bot },
];

export function CompanyEnrichment() {
  const [searchType, setSearchType] = useState<'name' | 'siren' | 'siret' | 'website'>('name');
  const [searchValue, setSearchValue] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<EnrichedCompany | null>(null);
  const [enrichmentStep, setEnrichmentStep] = useState(0);
  
  const { 
    companies, 
    financials,
    alerts,
    requests,
    loading, 
    enriching, 
    stats,
    enrichCompany,
    deleteCompany,
    fetchFinancials,
    fetchAlerts,
    markAlertAsRead
  } = useEnrichedCompanies();

  // Simulate enrichment progress
  useEffect(() => {
    if (enriching) {
      setEnrichmentStep(1);
      const timers = [
        setTimeout(() => setEnrichmentStep(2), 1000),
        setTimeout(() => setEnrichmentStep(3), 2500),
        setTimeout(() => setEnrichmentStep(4), 4000),
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      setEnrichmentStep(0);
    }
  }, [enriching]);

  // Fetch company financials and alerts when selected
  useEffect(() => {
    if (selectedCompany) {
      fetchFinancials(selectedCompany.id);
      fetchAlerts(selectedCompany.id);
    }
  }, [selectedCompany, fetchFinancials, fetchAlerts]);

  const handleEnrich = async () => {
    if (!searchValue.trim()) return;
    const result = await enrichCompany(searchType, searchValue.trim());
    if (result) {
      setSelectedCompany(result);
    }
  };

  const handleSelectCompany = (company: EnrichedCompany) => {
    setSelectedCompany(company);
  };

  const getVerificationBadge = (company: EnrichedCompany) => {
    if (company.verification_status === 'verified') {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <CheckCircle className="h-3 w-3 mr-1" />
          Vérifié
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground">
        En attente
      </Badge>
    );
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return 'N/A';
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)} Md€`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)} M€`;
    return `${value.toLocaleString()} €`;
  };

  // Filter financials for selected company
  const companyFinancials = selectedCompany 
    ? financials.filter(f => f.company_id === selectedCompany.id)
    : [];

  // Filter alerts for selected company
  const companyAlerts = selectedCompany
    ? alerts.filter(a => a.company_id === selectedCompany.id)
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show detail view if company is selected
  if (selectedCompany) {
    return (
      <CompanyDetailView
        company={selectedCompany}
        financials={companyFinancials}
        alerts={companyAlerts}
        onBack={() => setSelectedCompany(null)}
        onMarkAlertRead={markAlertAsRead}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entreprises</p>
                <p className="text-2xl font-bold">{stats.totalCompanies}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vérifiées</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.verifiedCompanies}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confiance moy.</p>
                <p className="text-2xl font-bold">{stats.avgConfidenceScore}%</p>
              </div>
              <Shield className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertes</p>
                <p className="text-2xl font-bold text-amber-400">{stats.unreadAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Panel */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Enrichir une entreprise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={searchType} onValueChange={(v) => setSearchType(v as any)}>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="name" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Nom
              </TabsTrigger>
              <TabsTrigger value="siren" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                SIREN
              </TabsTrigger>
              <TabsTrigger value="siret" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                SIRET
              </TabsTrigger>
              <TabsTrigger value="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Site web
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Input
              placeholder={
                searchType === 'name' ? 'Ex: LVMH, Orange, Total...' :
                searchType === 'siren' ? 'Ex: 775670417' :
                searchType === 'siret' ? 'Ex: 77567041700015' :
                'Ex: www.lvmh.fr'
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEnrich()}
              className="flex-1"
            />
            <Button 
              onClick={handleEnrich} 
              disabled={enriching || !searchValue.trim()}
            >
              {enriching ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Enrichir
            </Button>
          </div>

          {/* Enrichment Progress */}
          {enriching && (
            <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm font-medium">Enrichissement en cours...</p>
              <div className="space-y-2">
                {enrichmentSteps.map((step) => (
                  <div 
                    key={step.id}
                    className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                      enrichmentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {enrichmentStep > step.id ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : enrichmentStep === step.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Companies List */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Entreprises enrichies ({companies.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {companies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune entreprise enrichie</p>
              <p className="text-sm">Commencez par rechercher une entreprise française</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {companies.map((company) => (
                  <div
                    key={company.id}
                    className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
                    onClick={() => handleSelectCompany(company)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium truncate">{company.name}</h4>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            {company.naf_label && <span className="truncate max-w-[200px]">{company.naf_label}</span>}
                            {company.city && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {company.city}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            {company.revenue && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <TrendingUp className="h-3 w-3" />
                                <span>CA: {formatCurrency(company.revenue)}</span>
                              </div>
                            )}
                            {company.employees_range && (
                              <div className="text-muted-foreground">
                                {company.employees_range}
                              </div>
                            )}
                            {company.siren && (
                              <div className="font-mono text-xs text-muted-foreground">
                                SIREN: {company.siren}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getVerificationBadge(company)}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCompany(company.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    {/* Source badges */}
                    {company.data_sources && Array.isArray(company.data_sources) && company.data_sources.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {company.data_sources.includes('Registre officiel (data.gouv.fr)') && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                            <Landmark className="h-3 w-3 mr-1" />
                            Officiel
                          </Badge>
                        )}
                        {company.data_sources.includes('Site web') && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                            <Globe className="h-3 w-3 mr-1" />
                            Web
                          </Badge>
                        )}
                        {company.data_sources.includes('Analyse IA') && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                            <Bot className="h-3 w-3 mr-1" />
                            IA
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Recent Requests */}
      {requests.length > 0 && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Dernières recherches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {requests.slice(0, 5).map((req) => (
                <div 
                  key={req.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/20"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {req.query_type}
                    </Badge>
                    <span className="font-medium">{req.query_value}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {req.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : req.status === 'failed' ? (
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    <span>
                      {format(new Date(req.created_at), 'dd/MM HH:mm', { locale: fr })}
                    </span>
                    {req.processing_time_ms && (
                      <span className="text-xs">({req.processing_time_ms}ms)</span>
                    )}
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
