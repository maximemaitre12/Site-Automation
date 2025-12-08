import { useDataPlatform } from '@/hooks/useDataPlatform';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, Lock, Eye, Users, FileText, Loader2 } from 'lucide-react';

const DataGovernance = () => {
  const { catalog, qualityChecks, stats, loading } = useDataPlatform();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sensitivityBreakdown = {
    public: catalog.filter(c => c.sensitivity_level === 'public').length,
    internal: catalog.filter(c => c.sensitivity_level === 'internal').length,
    confidential: catalog.filter(c => c.sensitivity_level === 'confidential').length,
    restricted: catalog.filter(c => c.sensitivity_level === 'restricted').length
  };

  const qualityStats = {
    passed: qualityChecks.filter(c => c.status === 'passed').length,
    failed: qualityChecks.filter(c => c.status === 'failed').length,
    warning: qualityChecks.filter(c => c.status === 'warning').length,
    pending: qualityChecks.filter(c => c.status === 'pending').length
  };

  const complianceScore = catalog.length > 0
    ? Math.round((catalog.filter(c => c.owner && c.description).length / catalog.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Governance Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{complianceScore}%</div>
                <p className="text-sm text-muted-foreground">Score conformité</p>
              </div>
            </div>
            <Progress value={complianceScore} className="mt-4 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.piiDatasets}</div>
                <p className="text-sm text-muted-foreground">Datasets avec PII</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.avgQualityScore}%</div>
                <p className="text-sm text-muted-foreground">Qualité moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sensitivity Classification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Classification des données
          </CardTitle>
          <CardDescription>Répartition par niveau de sensibilité</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700">🌍 Public</span>
                <Badge variant="outline" className="text-green-600">{sensitivityBreakdown.public}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Données accessibles publiquement</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">🏢 Interne</span>
                <Badge variant="outline" className="text-blue-600">{sensitivityBreakdown.internal}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Accès réservé aux employés</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-700">🔒 Confidentiel</span>
                <Badge variant="outline" className="text-orange-600">{sensitivityBreakdown.confidential}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Accès restreint par équipe</p>
            </div>
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-700">⛔ Restreint</span>
                <Badge variant="outline" className="text-red-600">{sensitivityBreakdown.restricted}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Données hautement sensibles</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Quality Checks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Contrôles qualité
          </CardTitle>
          <CardDescription>État des vérifications automatiques</CardDescription>
        </CardHeader>
        <CardContent>
          {qualityChecks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun contrôle qualité configuré</p>
              <p className="text-sm">Les contrôles seront exécutés automatiquement lors des ingestions</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <div className="text-lg font-bold text-green-600">{qualityStats.passed}</div>
                  <div className="text-xs text-muted-foreground">Réussis</div>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10">
                  <div className="text-lg font-bold text-red-600">{qualityStats.failed}</div>
                  <div className="text-xs text-muted-foreground">Échoués</div>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10">
                  <div className="text-lg font-bold text-orange-600">{qualityStats.warning}</div>
                  <div className="text-xs text-muted-foreground">Avertissements</div>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="text-lg font-bold">{qualityStats.pending}</div>
                  <div className="text-xs text-muted-foreground">En attente</div>
                </div>
              </div>

              <div className="space-y-2">
                {qualityChecks.slice(0, 10).map(check => {
                  const statusColors = {
                    passed: 'text-green-600 bg-green-500/10',
                    failed: 'text-red-600 bg-red-500/10',
                    warning: 'text-orange-600 bg-orange-500/10',
                    pending: 'text-muted-foreground bg-muted'
                  };
                  return (
                    <div key={check.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Badge className={statusColors[check.status]}>
                          {check.status === 'passed' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {check.status === 'failed' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {check.check_type}
                        </Badge>
                        <span className="font-medium">{check.check_name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(check.executed_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Governance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {catalog.filter(c => !c.owner).length > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <Users className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <div className="font-medium text-orange-700">Datasets sans propriétaire</div>
                  <p className="text-sm text-muted-foreground">
                    {catalog.filter(c => !c.owner).length} dataset(s) n'ont pas de propriétaire assigné
                  </p>
                </div>
              </div>
            )}
            {catalog.filter(c => !c.description).length > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-700">Descriptions manquantes</div>
                  <p className="text-sm text-muted-foreground">
                    {catalog.filter(c => !c.description).length} dataset(s) n'ont pas de description
                  </p>
                </div>
              </div>
            )}
            {stats.piiDatasets > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <div className="font-medium text-red-700">Données personnelles détectées</div>
                  <p className="text-sm text-muted-foreground">
                    {stats.piiDatasets} dataset(s) contiennent des données personnelles (PII)
                  </p>
                </div>
              </div>
            )}
            {complianceScore === 100 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-green-700">Gouvernance complète</div>
                  <p className="text-sm text-muted-foreground">
                    Tous vos datasets sont correctement documentés
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataGovernance;
