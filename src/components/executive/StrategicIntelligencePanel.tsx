import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Radar, AlertTriangle, TrendingUp, TrendingDown, 
  Globe, Shield, Target, Clock, Loader2, Send,
  Zap, FileText, ExternalLink, Sparkles, RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface StrategicSignal {
  id: string;
  title: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  type: 'threat' | 'opportunity' | 'trend' | 'regulatory' | 'competitive';
  timeHorizon: '3m' | '12m' | '5y';
  isStructural: boolean;
  sources: Array<{ name: string; tier: number; url?: string }>;
  strategicReading: string;
  implications: string[];
  recommendations: string[];
  confidence: number;
}

interface IntelligenceResult {
  content: string;
  sources: Array<{ name: string; tier: number; url?: string }>;
  confidence: number;
  signals?: StrategicSignal[];
  timestamp: string;
}

const signalTypeConfig = {
  threat: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Menace' },
  opportunity: { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Opportunité' },
  trend: { icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Tendance' },
  regulatory: { icon: Shield, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Réglementaire' },
  competitive: { icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Concurrence' },
};

const levelConfig = {
  critical: { color: 'bg-red-500', label: 'Critique' },
  high: { color: 'bg-orange-500', label: 'Élevé' },
  medium: { color: 'bg-yellow-500', label: 'Moyen' },
  low: { color: 'bg-green-500', label: 'Faible' },
};

const horizonLabels = {
  '3m': '3 mois',
  '12m': '12 mois',
  '5y': '5 ans',
};

interface StrategicIntelligencePanelProps {
  sector?: string;
  companyContext?: string;
  internalMetrics?: Record<string, any>;
}

export function StrategicIntelligencePanel({ 
  sector = 'technologie', 
  companyContext,
  internalMetrics 
}: StrategicIntelligencePanelProps) {
  const [activeTab, setActiveTab] = useState<'briefing' | 'signals' | 'explore'>('briefing');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntelligenceResult | null>(null);
  const [explorationQuery, setExplorationQuery] = useState('');
  const [lastBriefingTime, setLastBriefingTime] = useState<Date | null>(null);

  const fetchIntelligence = async (
    analysisType: 'signal' | 'briefing' | 'exploration',
    query?: string
  ) => {
    setLoading(true);
    try {
      await supabase.auth.refreshSession();
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/strategic-intelligence`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            query: query || `Latest strategic developments in ${sector} sector`,
            sector,
            companyContext,
            analysisType,
            internalMetrics,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setResult(data);
        if (analysisType === 'briefing') {
          setLastBriefingTime(new Date());
        }
      }
    } catch (error) {
      console.error('Intelligence fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExplore = () => {
    if (explorationQuery.trim()) {
      fetchIntelligence('exploration', explorationQuery);
    }
  };

  const SourceBadge = ({ source }: { source: { name: string; tier: number; url?: string } }) => {
    const tierColors = {
      1: 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30',
      2: 'bg-blue-500/20 text-blue-700 border-blue-500/30',
      3: 'bg-purple-500/20 text-purple-700 border-purple-500/30',
      4: 'bg-gray-500/20 text-gray-600 border-gray-500/30',
    };
    
    return (
      <Badge 
        variant="outline" 
        className={cn('text-xs gap-1', tierColors[source.tier as keyof typeof tierColors] || tierColors[4])}
      >
        {source.name}
        {source.url && (
          <a href={source.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
      </Badge>
    );
  };

  const SignalCard = ({ signal }: { signal: StrategicSignal }) => {
    const typeConf = signalTypeConfig[signal.type];
    const levelConf = levelConfig[signal.level];
    const TypeIcon = typeConf.icon;

    return (
      <Card className="border-l-4" style={{ borderLeftColor: `var(--${signal.level === 'critical' ? 'destructive' : signal.level === 'high' ? 'warning' : 'primary'})` }}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={cn('p-1.5 rounded-md', typeConf.bg)}>
                <TypeIcon className={cn('w-4 h-4', typeConf.color)} />
              </div>
              <div>
                <h4 className="font-semibold text-sm">{signal.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-[10px]">{typeConf.label}</Badge>
                  <Badge className={cn('text-[10px] text-white', levelConf.color)}>{levelConf.label}</Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {horizonLabels[signal.timeHorizon]}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">{signal.confidence}%</div>
              <div className="text-[10px] text-muted-foreground">confiance</div>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">LECTURE STRATÉGIQUE</div>
              <p className="text-sm">{signal.strategicReading}</p>
            </div>

            {signal.implications.length > 0 && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">IMPLICATIONS</div>
                <ul className="text-sm space-y-1">
                  {signal.implications.slice(0, 3).map((impl, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">→</span>
                      <span>{impl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {signal.recommendations.length > 0 && (
              <div className="bg-primary/5 rounded-lg p-3">
                <div className="text-xs font-medium text-primary mb-1 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  RECOMMANDATIONS
                </div>
                <ul className="text-sm space-y-1">
                  {signal.recommendations.slice(0, 2).map((rec, i) => (
                    <li key={i} className="font-medium">{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-1 pt-2 border-t">
              {signal.sources.slice(0, 3).map((source, i) => (
                <SourceBadge key={i} source={source} />
              ))}
              {signal.isStructural && (
                <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 border-amber-500/30">
                  Structurel
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
              <Radar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span>Veille Stratégique</span>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                Intelligence en temps réel • Sources Tier 1
              </p>
            </div>
          </CardTitle>
          {lastBriefingTime && (
            <div className="text-xs text-muted-foreground">
              Dernière mise à jour : {lastBriefingTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 p-0">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex flex-col flex-1">
          <TabsList className="mx-4 mt-3 grid grid-cols-3 bg-muted/50">
            <TabsTrigger value="briefing" className="gap-1.5 text-xs">
              <FileText className="w-3.5 h-3.5" />
              Briefing
            </TabsTrigger>
            <TabsTrigger value="signals" className="gap-1.5 text-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              Signaux
            </TabsTrigger>
            <TabsTrigger value="explore" className="gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Explorer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="briefing" className="flex-1 flex flex-col min-h-0 m-0 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Briefing Exécutif</h3>
              <Button 
                size="sm" 
                onClick={() => fetchIntelligence('briefing')}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Actualiser
              </Button>
            </div>

            <ScrollArea className="flex-1">
              {result?.content ? (
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.content}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Sources :</span>
                      <div className="flex flex-wrap gap-1">
                        {result.sources.slice(0, 4).map((source, i) => (
                          <SourceBadge key={i} source={source} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Confiance :</span>
                      <span className="font-semibold text-primary">{result.confidence}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Radar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                  <h4 className="font-medium mb-2">Briefing non généré</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Cliquez sur Actualiser pour générer votre briefing stratégique quotidien.
                  </p>
                  <Button onClick={() => fetchIntelligence('briefing')} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Générer le briefing
                  </Button>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="signals" className="flex-1 flex flex-col min-h-0 m-0 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Signaux Stratégiques</h3>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => fetchIntelligence('signal', `Strategic signals and market movements in ${sector}`)}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radar className="w-4 h-4" />}
              </Button>
            </div>

            <ScrollArea className="flex-1">
              {result?.signals && result.signals.length > 0 ? (
                <div className="space-y-3">
                  {result.signals.map((signal) => (
                    <SignalCard key={signal.id} signal={signal} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                  <h4 className="font-medium mb-2">Aucun signal détecté</h4>
                  <p className="text-sm text-muted-foreground">
                    Lancez une analyse pour détecter les signaux stratégiques.
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="explore" className="flex-1 flex flex-col min-h-0 m-0 p-4">
            <div className="space-y-4 flex flex-col flex-1">
              <div>
                <h3 className="font-semibold text-sm mb-2">Exploration Stratégique</h3>
                <p className="text-xs text-muted-foreground">
                  Posez vos questions stratégiques pour une analyse approfondie.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  "Quelles tendances sous-estimées émergent dans notre secteur ?",
                  "Quels signaux ignorent encore nos concurrents ?",
                  "Quelles décisions seront évidentes dans 18 mois ?",
                  "Où le consensus de marché est-il probablement faux ?"
                ].map((question, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 px-3 text-left text-xs justify-start"
                    onClick={() => {
                      setExplorationQuery(question);
                      fetchIntelligence('exploration', question);
                    }}
                    disabled={loading}
                  >
                    {question}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={explorationQuery}
                  onChange={(e) => setExplorationQuery(e.target.value)}
                  placeholder="Posez votre question stratégique..."
                  className="min-h-[80px] resize-none text-sm"
                />
                <Button
                  onClick={handleExplore}
                  disabled={!explorationQuery.trim() || loading}
                  size="icon"
                  className="h-auto aspect-square"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>

              <ScrollArea className="flex-1">
                {result?.content && activeTab === 'explore' && (
                  <div className="space-y-3">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.content}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {result.sources.slice(0, 4).map((source, i) => (
                        <SourceBadge key={i} source={source} />
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
