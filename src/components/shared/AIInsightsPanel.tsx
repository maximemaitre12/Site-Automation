import { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  BarChart3, 
  MessageSquare,
  Check,
  ChevronRight,
  RefreshCw,
  Bell
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAether, AgentType } from '@/contexts/AetherContext';
import { useAetherIntelligence } from '@/hooks/useAetherIntelligence';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const insightTypeIcons: Record<string, any> = {
  opportunity: TrendingUp,
  warning: AlertTriangle,
  suggestion: Lightbulb,
  info: Bell,
};

const insightTypeColors: Record<string, string> = {
  opportunity: 'text-green-500 bg-green-500/10',
  warning: 'text-orange-500 bg-orange-500/10',
  suggestion: 'text-blue-500 bg-blue-500/10',
  info: 'text-muted-foreground bg-muted',
};

const agentIcons: Record<string, any> = {
  hr: Users,
  sales: BarChart3,
  support: MessageSquare,
};

const priorityLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'Faible', color: 'text-muted-foreground' },
  5: { label: 'Normal', color: 'text-foreground' },
  8: { label: 'Important', color: 'text-orange-500' },
  10: { label: 'Critique', color: 'text-destructive' },
};

export function AIInsightsPanel() {
  const { 
    isInsightsPanelOpen, 
    closeInsightsPanel,
    insights,
    insightsLoading,
    suggestedActions,
    actionsLoading,
    markInsightAsRead,
    dismissInsight,
    executeAction,
    dismissAction,
    unreadInsightsCount,
  } = useAether();
  
  const { generateInsights, loading: aiLoading } = useAetherIntelligence();
  const [activeTab, setActiveTab] = useState('insights');

  const handleRefreshInsights = async () => {
    await generateInsights('brain');
  };

  const getPriorityInfo = (priority: number) => {
    if (priority >= 9) return priorityLabels[10];
    if (priority >= 7) return priorityLabels[8];
    if (priority >= 4) return priorityLabels[5];
    return priorityLabels[1];
  };

  return (
    <Sheet open={isInsightsPanelOpen} onOpenChange={() => closeInsightsPanel()}>
      <SheetContent className="w-full sm:max-w-md p-0 gap-0 bg-background/95 backdrop-blur-xl">
        <SheetHeader className="px-4 py-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-base">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              Intelligence AETHER
              {unreadInsightsCount > 0 && (
                <Badge variant="destructive" className="text-[10px] h-5">
                  {unreadInsightsCount}
                </Badge>
              )}
            </SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleRefreshInsights}
              disabled={aiLoading}
            >
              <RefreshCw className={cn("w-4 h-4", aiLoading && "animate-spin")} />
            </Button>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="w-full justify-start gap-1 px-4 py-2 h-auto bg-transparent border-b border-border/50 rounded-none">
            <TabsTrigger 
              value="insights" 
              className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg px-3 py-1.5"
            >
              Insights
              {insights.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 text-[10px] h-4">
                  {insights.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="actions" 
              className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg px-3 py-1.5"
            >
              Actions suggérées
              {suggestedActions.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 text-[10px] h-4">
                  {suggestedActions.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-140px)]">
            <TabsContent value="insights" className="m-0 p-3">
              {insightsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : insights.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-full bg-muted/50 mb-4">
                    <Lightbulb className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Aucun insight pour le moment
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRefreshInsights}
                    disabled={aiLoading}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Générer des insights
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {insights.map((insight) => {
                    const TypeIcon = insightTypeIcons[insight.insight_type] || Lightbulb;
                    const AgentIcon = agentIcons[insight.source_agent];
                    const priorityInfo = getPriorityInfo(insight.priority);
                    
                    return (
                      <div 
                        key={insight.id}
                        className={cn(
                          "p-3 rounded-xl border transition-all",
                          insight.is_read 
                            ? "bg-muted/30 border-border/30" 
                            : "bg-card border-border shadow-sm"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-2 rounded-lg shrink-0",
                            insightTypeColors[insight.insight_type]
                          )}>
                            <TypeIcon className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm leading-tight">
                                {insight.title}
                              </h4>
                              <span className={cn("text-[10px]", priorityInfo.color)}>
                                {priorityInfo.label}
                              </span>
                            </div>
                            
                            {insight.content && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {insight.content}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {AgentIcon && (
                                  <Badge variant="secondary" className="text-[10px] h-5 gap-1">
                                    <AgentIcon className="w-3 h-3" />
                                    {insight.source_agent}
                                  </Badge>
                                )}
                                <span className="text-[10px] text-muted-foreground">
                                  {formatDistanceToNow(new Date(insight.created_at), { 
                                    addSuffix: true, 
                                    locale: fr 
                                  })}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                {!insight.is_read && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6"
                                    onClick={() => markInsightAsRead(insight.id)}
                                  >
                                    <Check className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                  onClick={() => dismissInsight(insight.id)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="actions" className="m-0 p-3">
              {actionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : suggestedActions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-full bg-muted/50 mb-4">
                    <ChevronRight className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Aucune action suggérée
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {suggestedActions.map((action) => {
                    const AgentIcon = agentIcons[action.target_agent];
                    
                    return (
                      <div 
                        key={action.id}
                        className="p-3 rounded-xl bg-card border border-border shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                            <ChevronRight className="w-4 h-4 text-primary" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm mb-1">
                              {action.title}
                            </h4>
                            
                            {action.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {action.description}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between">
                              {AgentIcon && (
                                <Badge variant="secondary" className="text-[10px] h-5 gap-1">
                                  <AgentIcon className="w-3 h-3" />
                                  {action.target_agent}
                                </Badge>
                              )}
                              
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  className="h-7 text-xs"
                                  onClick={() => executeAction(action.id)}
                                >
                                  Exécuter
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 text-muted-foreground"
                                  onClick={() => dismissAction(action.id)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
