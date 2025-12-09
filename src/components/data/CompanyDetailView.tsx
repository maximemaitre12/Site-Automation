import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, Building2, MapPin, Globe, Linkedin, Twitter, Facebook,
  Users, Calendar, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Shield, Target, Landmark, Bot, Database, ExternalLink, Download,
  Briefcase, Hash, FileText
} from 'lucide-react';
import { EnrichedCompany, CompanyFinancial, CompanyAlert } from '@/hooks/useEnrichedCompanies';
import { CompanyFinancialChart } from './CompanyFinancialChart';
import { CompanyAlertsList } from './CompanyAlertsList';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CompanyDetailViewProps {
  company: EnrichedCompany;
  financials: CompanyFinancial[];
  alerts: CompanyAlert[];
  onBack: () => void;
  onMarkAlertRead: (id: string) => Promise<boolean>;
}

export function CompanyDetailView({ 
  company, 
  financials, 
  alerts,
  onBack,
  onMarkAlertRead
}: CompanyDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return 'N/A';
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)} Md€`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)} M€`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(0)} K€`;
    return `${value.toFixed(0)} €`;
  };

  const getVerificationBadge = () => {
    if (company.verification_status === 'verified') {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <CheckCircle className="h-3 w-3 mr-1" />
          Vérifié ({company.confidence_score}%)
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground">
        En attente de vérification
      </Badge>
    );
  };

  const getRiskBadge = () => {
    const score = company.ai_risk_score;
    if (!score) return null;
    if (score <= 30) {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <Shield className="h-3 w-3 mr-1" />
          Risque faible ({score}/100)
        </Badge>
      );
    }
    if (score <= 60) {
      return (
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Risque modéré ({score}/100)
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Risque élevé ({score}/100)
      </Badge>
    );
  };

  const getOpportunityBadge = () => {
    const score = company.ai_opportunity_score;
    if (!score) return null;
    if (score >= 70) {
      return (
        <Badge className="bg-primary/20 text-primary border-primary/30">
          <Target className="h-3 w-3 mr-1" />
          Forte opportunité ({score}/100)
        </Badge>
      );
    }
    if (score >= 40) {
      return (
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
          <Target className="h-3 w-3 mr-1" />
          Opportunité modérée ({score}/100)
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground">
        <Target className="h-3 w-3 mr-1" />
        Opportunité limitée ({score}/100)
      </Badge>
    );
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'data.gouv.fr':
      case 'registre_officiel':
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <Landmark className="h-3 w-3 mr-1" />
            Registre officiel
          </Badge>
        );
      case 'website':
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Globe className="h-3 w-3 mr-1" />
            Site web
          </Badge>
        );
      case 'ai_analysis':
        return (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Bot className="h-3 w-3 mr-1" />
            Analyse IA
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Database className="h-3 w-3 mr-1" />
            {source}
          </Badge>
        );
    }
  };

  const executives = Array.isArray(company.executives) ? company.executives : [];
  const keywords = Array.isArray(company.ai_keywords) ? company.ai_keywords : [];
  const dataSources = Array.isArray(company.data_sources) ? company.data_sources : [];
  const unreadAlerts = alerts.filter(a => !a.is_read).length;

  return (
    <div className="space-y-6 h-full overflow-auto pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{company.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  {company.naf_label && <span>{company.naf_label}</span>}
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
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {getVerificationBadge()}
        {getRiskBadge()}
        {getOpportunityBadge()}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Synthèse</TabsTrigger>
          <TabsTrigger value="identity">Identité</TabsTrigger>
          <TabsTrigger value="financials">Finances</TabsTrigger>
          <TabsTrigger value="executives">Dirigeants</TabsTrigger>
          <TabsTrigger value="alerts" className="relative">
            Alertes
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* AI Summary */}
          {company.ai_summary && (
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  Résumé IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{company.ai_summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Chiffre d'affaires</div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(company.revenue)}
                </div>
                {company.revenue_year && (
                  <div className="text-xs text-muted-foreground">Année {company.revenue_year}</div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Résultat net</div>
                <div className={`text-2xl font-bold ${(company.net_income || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(company.net_income)}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Effectifs</div>
                <div className="text-2xl font-bold">
                  {company.employees_count?.toLocaleString() || company.employees_range || 'N/A'}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Capital</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(company.capital)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Keywords */}
          {keywords.length > 0 && (
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Mots-clés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Industry Analysis */}
          {company.ai_industry_analysis && (
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Analyse sectorielle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{company.ai_industry_analysis}</p>
              </CardContent>
            </Card>
          )}

          {/* Competitive Position */}
          {company.ai_competitive_position && (
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Position concurrentielle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{company.ai_competitive_position}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="identity" className="mt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Legal Info */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Informations légales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SIREN</span>
                  <span className="font-mono">{company.siren || 'N/A'}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SIRET</span>
                  <span className="font-mono">{company.siret || 'N/A'}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">N° TVA</span>
                  <span className="font-mono">{company.tva_number || 'N/A'}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Forme juridique</span>
                  <span>{company.legal_form || 'N/A'}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Code NAF</span>
                  <span className="font-mono">{company.naf_code || 'N/A'}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date de création</span>
                  <span>
                    {company.creation_date 
                      ? format(new Date(company.creation_date), 'dd MMMM yyyy', { locale: fr })
                      : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Address & Contact */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Adresse & Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-muted-foreground text-sm">Adresse</span>
                  <p className="mt-1">
                    {company.address || 'N/A'}
                    {company.postal_code && company.city && (
                      <><br />{company.postal_code} {company.city}</>
                    )}
                    {company.country && <><br />{company.country}</>}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  {company.website && (
                    <a 
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      {company.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {company.linkedin_url && (
                    <a 
                      href={company.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {company.twitter_url && (
                    <a 
                      href={company.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Twitter className="h-4 w-4" />
                      Twitter
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {company.facebook_url && (
                    <a 
                      href={company.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financials" className="mt-6">
          <CompanyFinancialChart 
            company={company}
            financials={financials}
          />
        </TabsContent>

        <TabsContent value="executives" className="mt-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Dirigeants ({executives.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {executives.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucun dirigeant enregistré
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {executives.map((exec: any, index: number) => (
                    <Card key={index} className="bg-muted/30 border-border/30">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {exec.prenom} {exec.nom}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {exec.qualite || exec.fonction || 'Dirigeant'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <CompanyAlertsList 
            alerts={alerts}
            onMarkAsRead={onMarkAlertRead}
          />
        </TabsContent>

        <TabsContent value="sources" className="mt-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Sources de données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataSources.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucune source enregistrée
                  </p>
                ) : (
                  dataSources.map((source: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      {getSourceBadge(source)}
                      <span className="text-sm text-muted-foreground">
                        {company.last_enriched_at 
                          ? format(new Date(company.last_enriched_at), 'dd/MM/yyyy HH:mm', { locale: fr })
                          : 'Date inconnue'}
                      </span>
                    </div>
                  ))
                )}
                
                {/* Enrichment info */}
                <Separator className="my-4" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Dernière mise à jour</span>
                  <span>
                    {company.last_enriched_at 
                      ? format(new Date(company.last_enriched_at), 'dd MMMM yyyy à HH:mm', { locale: fr })
                      : 'Jamais'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Score de confiance</span>
                  <Badge variant={company.confidence_score && company.confidence_score >= 80 ? 'default' : 'secondary'}>
                    {company.confidence_score || 0}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
