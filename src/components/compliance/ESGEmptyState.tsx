import { Leaf, Plus, Building2, BarChart3, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ESGEmptyStateProps {
  onAddSite: () => void;
  onAddKPI: () => void;
  onAddTarget: () => void;
}

export function ESGEmptyState({ onAddSite, onAddKPI, onAddTarget }: ESGEmptyStateProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">ESG & Sustainability Dashboard</h2>
          <p className="text-sm text-muted-foreground">Suivi décarbonation & indicateurs environnementaux</p>
        </div>
      </div>

      {/* Empty State */}
      <Card className="border-dashed">
        <CardContent className="py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-8 h-8 text-emerald-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Aucune donnée ESG configurée
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
            Commencez par ajouter vos données d'émissions réelles. 
            AETHER Compliance n'affiche que des données vérifiées - aucune estimation n'est générée.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <Card className="bg-muted/50 hover:bg-muted transition-colors cursor-pointer group" onClick={onAddSite}>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500/20 transition-colors">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <p className="font-medium text-sm">Ajouter un site</p>
                <p className="text-xs text-muted-foreground mt-1">Émissions par localisation</p>
              </CardContent>
            </Card>

            <Card className="bg-muted/50 hover:bg-muted transition-colors cursor-pointer group" onClick={onAddKPI}>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-500/20 transition-colors">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <p className="font-medium text-sm">Ajouter un KPI</p>
                <p className="text-xs text-muted-foreground mt-1">Indicateurs de performance</p>
              </CardContent>
            </Card>

            <Card className="bg-muted/50 hover:bg-muted transition-colors cursor-pointer group" onClick={onAddTarget}>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-500/20 transition-colors">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="font-medium text-sm">Définir un objectif</p>
                <p className="text-xs text-muted-foreground mt-1">Trajectoire décarbonation</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
            <span className="text-amber-600 text-sm">⚠️</span>
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Politique Zéro Données Fictives</p>
            <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-1">
              Ce dashboard n'affiche que les données que vous saisissez. Aucune estimation, simulation ou donnée générée par IA n'est utilisée pour garantir la fiabilité de vos rapports ESG.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
