import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Zap,
  RefreshCw,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Target,
  Brain,
  BarChart3,
  Loader2
} from 'lucide-react';
import { useAIIntelligence } from '@/hooks/useAIIntelligence';

const SALES_STATUSES = [
  { value: 'lead_created', label: 'Lead créé', color: 'bg-gray-500' },
  { value: 'contacted', label: 'Contacté', color: 'bg-blue-500' },
  { value: 'engaged', label: 'Engagé', color: 'bg-cyan-500' },
  { value: 'qualifying', label: 'Qualification', color: 'bg-indigo-500' },
  { value: 'qualified', label: 'Qualifié', color: 'bg-purple-500' },
  { value: 'proposal_sent', label: 'Proposition envoyée', color: 'bg-pink-500' },
  { value: 'negotiation', label: 'Négociation', color: 'bg-orange-500' },
  { value: 'closing_imminent', label: 'Closing imminent', color: 'bg-amber-500' },
  { value: 'won', label: 'Gagné', color: 'bg-green-500' },
  { value: 'lost', label: 'Perdu', color: 'bg-red-500' },
  { value: 'to_recontact', label: 'À relancer', color: 'bg-yellow-500' },
  { value: 'inactive', label: 'Inactif', color: 'bg-slate-400' },
];

export function AIIntelligenceDashboard() {
  const {
    forecasts,
    anomalies,
    segments,
    loading,
    forecastLoading,
    anomaliesLoading,
    segmentationLoading,
    generateForecast,
    detectAnomalies,
    generateSegments,
    resolveAnomaly,
  } = useAIIntelligence();

  const [activeTab, setActiveTab] = useState('forecasting');
  const [lastForecast, setLastForecast] = useState<any>(null);

  const handleGenerateForecast = async () => {
    const result = await generateForecast('monthly');
    if (result) setLastForecast(result);
  };

  const latestForecast = lastForecast || (forecasts.length > 0 ? forecasts[0] : null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
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
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prévisions Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forecasts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Anomalies Détectées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{anomalies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Segments IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{segments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Score Santé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {anomalies.length === 0 ? '100%' : `${Math.max(0, 100 - anomalies.length * 10)}%`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forecasting" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Forecasting
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Anomalies
          </TabsTrigger>
          <TabsTrigger value="segments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Segmentation
          </TabsTrigger>
        </TabsList>

        {/* Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Prévisions de Revenus
                </CardTitle>
                <CardDescription>
                  Prédictions basées sur l'historique et le pipeline actuel
                </CardDescription>
              </div>
              <Button onClick={handleGenerateForecast} disabled={forecastLoading}>
                {forecastLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Générer Prévision
              </Button>
            </CardHeader>
            <CardContent>
              {latestForecast ? (
                <div className="space-y-6">
                  {/* Main Prediction */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Revenus Prédits</div>
                        <div className="text-3xl font-bold text-primary">
                          €{(latestForecast.forecast?.predicted_revenue || latestForecast.predicted_revenue || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Intervalle: €{(latestForecast.forecast?.confidence_low || latestForecast.confidence_interval_low || 0).toLocaleString()} - 
                          €{(latestForecast.forecast?.confidence_high || latestForecast.confidence_interval_high || 0).toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-500/5 border-green-500/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Deals Gagnés Prédits</div>
                        <div className="text-3xl font-bold text-green-500">
                          {latestForecast.forecast?.predicted_deals_won || latestForecast.predicted_deals_won || 0}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-500/5 border-red-500/20">
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Deals Perdus Prédits</div>
                        <div className="text-3xl font-bold text-red-500">
                          {latestForecast.forecast?.predicted_deals_lost || latestForecast.predicted_deals_lost || 0}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Confidence Score */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Confiance du modèle</span>
                      <span className="text-sm text-muted-foreground">
                        {latestForecast.forecast?.confidence_score || latestForecast.model_accuracy || 70}%
                      </span>
                    </div>
                    <Progress value={latestForecast.forecast?.confidence_score || latestForecast.model_accuracy || 70} />
                  </div>

                  {/* Factors */}
                  {(latestForecast.forecast?.factors || latestForecast.factors)?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Facteurs d'influence</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {(latestForecast.forecast?.factors || latestForecast.factors || []).map((factor: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <span className="text-sm">{factor.factor}</span>
                            <Badge variant={factor.impact === 'positive' ? 'default' : 'destructive'}>
                              {factor.impact === 'positive' ? (
                                <ArrowUp className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDown className="h-3 w-3 mr-1" />
                              )}
                              {(factor.weight * 100).toFixed(0)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metrics */}
                  {latestForecast.metrics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{latestForecast.metrics.winRate?.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Taux de conversion</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">€{latestForecast.metrics.avgDealValue?.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Valeur moyenne</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{latestForecast.metrics.avgVelocity?.toFixed(0)}j</div>
                        <div className="text-xs text-muted-foreground">Cycle moyen</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{latestForecast.metrics.openDealsCount}</div>
                        <div className="text-xs text-muted-foreground">Deals actifs</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune prévision disponible</p>
                  <p className="text-sm">Cliquez sur "Générer Prévision" pour analyser vos données</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Anomalies Tab */}
        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Détection d'Anomalies
                </CardTitle>
                <CardDescription>
                  Problèmes et risques identifiés par l'IA
                </CardDescription>
              </div>
              <Button onClick={() => detectAnomalies()} disabled={anomaliesLoading}>
                {anomaliesLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                Analyser
              </Button>
            </CardHeader>
            <CardContent>
              {anomalies.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {anomalies.map((anomaly: any) => (
                      <Card key={anomaly.id} className="border-l-4" style={{ borderLeftColor: `var(--${anomaly.severity === 'critical' ? 'destructive' : anomaly.severity === 'high' ? 'warning' : 'primary'})` }}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={getSeverityColor(anomaly.severity)}>
                                  {anomaly.severity}
                                </Badge>
                                <Badge variant="outline">{anomaly.anomaly_type}</Badge>
                              </div>
                              <h4 className="font-medium">{anomaly.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{anomaly.description}</p>
                              {anomaly.detected_value !== null && anomaly.expected_value !== null && (
                                <div className="flex gap-4 mt-2 text-xs">
                                  <span>Détecté: <strong>{anomaly.detected_value}</strong></span>
                                  <span>Attendu: <strong>{anomaly.expected_value}</strong></span>
                                  {anomaly.deviation_percent && (
                                    <span className="text-red-500">
                                      Écart: {anomaly.deviation_percent.toFixed(1)}%
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => resolveAnomaly(anomaly.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>Aucune anomalie détectée</p>
                  <p className="text-sm">Votre système fonctionne normalement</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segments Tab */}
        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Segmentation Intelligente
                </CardTitle>
                <CardDescription>
                  Clustering automatique de vos données
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => generateSegments('prospect')} disabled={segmentationLoading}>
                  {segmentationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Prospects'}
                </Button>
                <Button variant="outline" onClick={() => generateSegments('company')} disabled={segmentationLoading}>
                  {segmentationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Entreprises'}
                </Button>
                <Button variant="outline" onClick={() => generateSegments('candidate')} disabled={segmentationLoading}>
                  {segmentationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Candidats'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {segments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {segments.map((segment: any) => (
                    <Card key={segment.id} className="relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{segment.segment_type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            Cluster #{segment.cluster_id}
                          </span>
                        </div>
                        <h4 className="font-semibold text-lg">{segment.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{segment.description}</p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{segment.member_count}</span>
                          </div>
                          {segment.avg_score && (
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{segment.avg_score.toFixed(0)}%</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun segment créé</p>
                  <p className="text-sm">Lancez une segmentation pour regrouper vos données</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}