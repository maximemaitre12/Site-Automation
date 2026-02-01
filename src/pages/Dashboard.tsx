import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Clock, 
  Zap, 
  Users,
  Workflow,
  FileText,
  BarChart3,
  MessageSquare,
  ShieldCheck,
  Brain,
  Database,
  DollarSign,
  Info,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWorkflows, useWorkflowRuns } from "@/hooks/useWorkflows";
import { useAetherDocs } from "@/hooks/useAetherDocs";
import { useSupport } from "@/hooks/useSupport";
import { useCompliance } from "@/hooks/useCompliance";
import { useHR } from "@/hooks/useHR";
import { useInterviews } from "@/hooks/useInterviews";
import { useBrain } from "@/hooks/useBrain";
import { useSalesProposals } from "@/hooks/useSalesProposals";
import { useNegotiationSheets } from "@/hooks/useNegotiationSheets";
import { useDataPlatform } from "@/hooks/useDataPlatform";
import { format, subDays, startOfWeek, startOfMonth, isAfter } from "date-fns";
import { fr } from "date-fns/locale";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Time estimates in minutes (industry benchmarks)
const TIME_ESTIMATES = {
  workflow_run: 15,
  document_generated: 45,
  document_analyzed: 20,
  proposal_generated: 60,
  call_analyzed: 30,
  negotiation_sheet: 50,
  ticket_resolved: 25,
  audit_completed: 120,
  candidate_screened: 35,
  interview_analyzed: 40,
  brain_conversation: 10,
};

const HOURLY_RATE = 25; // €/hour

// Tool definitions
const TOOLS = [
  { id: "flow", name: "AETHER Flow", icon: Workflow, path: "/tools/flow", color: "hsl(var(--agent-flow))" },
  { id: "doc", name: "AETHER Doc", icon: FileText, path: "/tools/doc", color: "hsl(var(--agent-brain))" },
  { id: "data", name: "AETHER Data", icon: Database, path: "/tools/data", color: "hsl(var(--primary))" },
  { id: "sales", name: "Sales Copilot", icon: BarChart3, path: "/tools/sales", color: "hsl(var(--agent-sales))" },
  { id: "hr", name: "HR Copilot", icon: Users, path: "/tools/hr", color: "hsl(var(--agent-hr))" },
  { id: "support", name: "Support", icon: MessageSquare, path: "/tools/support", color: "hsl(var(--agent-support))" },
  { id: "brain", name: "Brain", icon: Brain, path: "/tools/brain", color: "hsl(var(--agent-brain))" },
  { id: "compliance", name: "Compliance", icon: ShieldCheck, path: "/tools/compliance", color: "hsl(var(--agent-compliance))" },
];

type Period = "week" | "month" | "all";

export default function Dashboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>("month");

  // Data hooks
  const { workflows, loading: workflowsLoading } = useWorkflows();
  const { runs: workflowRuns, loading: runsLoading } = useWorkflowRuns();
  const { documents: aetherDocs, loading: docsLoading } = useAetherDocs();
  const { tickets, loading: ticketsLoading } = useSupport();
  const { audits, loading: auditsLoading } = useCompliance();
  const { candidates, loading: hrLoading } = useHR();
  const { interviews, loading: interviewsLoading } = useInterviews();
  const { conversations, loading: brainLoading } = useBrain();
  const { proposals, callAnalyses, loading: salesLoading } = useSalesProposals();
  const { sheets: negotiationSheets, loading: sheetsLoading } = useNegotiationSheets();
  const { pipelineRuns, loading: dataLoading } = useDataPlatform();

  const isLoading = workflowsLoading || runsLoading || docsLoading || ticketsLoading || 
    auditsLoading || hrLoading || interviewsLoading || brainLoading || salesLoading || 
    sheetsLoading || dataLoading;

  // Filter by period
  // Filter by period - uses rolling windows to ensure month >= week
  const filterByPeriod = <T extends { created_at: string }>(data: T[] | undefined): T[] => {
    if (!data?.length) return [];
    if (period === "all") return data;
    
    const now = new Date();
    // Use rolling windows: 7 days for week, 30 days for month
    const daysAgo = period === "week" ? 7 : 30;
    const startDate = subDays(now, daysAgo);
    
    return data.filter(item => isAfter(new Date(item.created_at), startDate));
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const filteredWorkflowRuns = filterByPeriod(workflowRuns);
    const filteredDocs = filterByPeriod(aetherDocs);
    const filteredTickets = filterByPeriod(tickets);
    const filteredAudits = filterByPeriod(audits);
    const filteredCandidates = filterByPeriod(candidates);
    const filteredInterviews = filterByPeriod(interviews);
    const filteredConversations = filterByPeriod(conversations);
    const filteredProposals = filterByPeriod(proposals);
    const filteredCallAnalyses = filterByPeriod(callAnalyses);
    const filteredSheets = filterByPeriod(negotiationSheets);
    const filteredPipelineRuns = filterByPeriod(pipelineRuns);

    // Count actions by type
    const docsGenerated = filteredDocs.filter(d => d.ai_summary).length;
    const docsAnalyzed = filteredDocs.filter(d => d.ai_keywords && (d.ai_keywords as any[]).length > 0).length;
    const ticketsResolved = filteredTickets.filter(t => t.status === "resolved").length;
    const interviewsWithReport = filteredInterviews.filter(i => i.ai_report && Object.keys(i.ai_report as object).length > 0).length;
    const candidatesWithAnalysis = filteredCandidates.filter(c => c.ai_analysis).length;

    // Calculate time saved by tool
    const toolMetrics = [
      {
        id: "flow",
        name: "AETHER Flow",
        actions: filteredWorkflowRuns.length,
        minutes: filteredWorkflowRuns.length * TIME_ESTIMATES.workflow_run,
      },
      {
        id: "doc",
        name: "AETHER Doc",
        actions: docsGenerated + docsAnalyzed,
        minutes: (docsGenerated * TIME_ESTIMATES.document_generated) + (docsAnalyzed * TIME_ESTIMATES.document_analyzed),
      },
      {
        id: "data",
        name: "AETHER Data",
        actions: filteredPipelineRuns.length,
        minutes: filteredPipelineRuns.length * 20,
      },
      {
        id: "sales",
        name: "Sales Copilot",
        actions: filteredProposals.length + filteredCallAnalyses.length + filteredSheets.length,
        minutes: (filteredProposals.length * TIME_ESTIMATES.proposal_generated) + 
                 (filteredCallAnalyses.length * TIME_ESTIMATES.call_analyzed) +
                 (filteredSheets.length * TIME_ESTIMATES.negotiation_sheet),
      },
      {
        id: "hr",
        name: "HR Copilot",
        actions: candidatesWithAnalysis + interviewsWithReport,
        minutes: (candidatesWithAnalysis * TIME_ESTIMATES.candidate_screened) + 
                 (interviewsWithReport * TIME_ESTIMATES.interview_analyzed),
      },
      {
        id: "support",
        name: "Support",
        actions: ticketsResolved,
        minutes: ticketsResolved * TIME_ESTIMATES.ticket_resolved,
      },
      {
        id: "brain",
        name: "Brain",
        actions: filteredConversations.length,
        minutes: filteredConversations.length * TIME_ESTIMATES.brain_conversation,
      },
      {
        id: "compliance",
        name: "Compliance",
        actions: filteredAudits.length,
        minutes: filteredAudits.length * TIME_ESTIMATES.audit_completed,
      },
    ].sort((a, b) => b.minutes - a.minutes);

    // Totals
    const totalActions = toolMetrics.reduce((sum, t) => sum + t.actions, 0);
    const totalMinutes = toolMetrics.reduce((sum, t) => sum + t.minutes, 0);
    const totalHours = Math.round(totalMinutes / 60 * 10) / 10;
    const totalValue = Math.round((totalMinutes / 60) * HOURLY_RATE);

    return {
      toolMetrics,
      totalActions,
      totalMinutes,
      totalHours,
      totalValue,
      workdays: Math.round(totalHours / 8 * 10) / 10,
    };
  }, [workflowRuns, aetherDocs, tickets, audits, candidates, interviews, conversations, 
      proposals, callAnalyses, negotiationSheets, pipelineRuns, period]);

  // Chart data - adapts to selected period
  const chartData = useMemo(() => {
    const now = new Date();
    
    // Determine number of data points and granularity based on period
    let days: { date: string; fullDate: string; minutes: number }[] = [];
    
    if (period === "week") {
      // Last 7 days for week view
      days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(now, 6 - i);
        return {
          date: format(date, "EEE", { locale: fr }),
          fullDate: format(date, "yyyy-MM-dd"),
          minutes: 0,
        };
      });
    } else if (period === "month") {
      // Last 30 days grouped by ~5 day periods (6 data points)
      days = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(now, 29 - i);
        return {
          date: format(date, "d MMM", { locale: fr }),
          fullDate: format(date, "yyyy-MM-dd"),
          minutes: 0,
        };
      });
    } else {
      // "all" - show monthly data for last 6 months
      days = Array.from({ length: 6 }, (_, i) => {
        const date = subDays(now, (5 - i) * 30);
        return {
          date: format(date, "MMM", { locale: fr }),
          fullDate: format(date, "yyyy-MM"),
          minutes: 0,
        };
      });
    }

    // Count actions per day/period
    const countByPeriod = (items: any[] | undefined, estimateKey: keyof typeof TIME_ESTIMATES) => {
      if (!items) return;
      items.forEach(item => {
        const itemDate = period === "all" 
          ? format(new Date(item.created_at), "yyyy-MM")
          : format(new Date(item.created_at), "yyyy-MM-dd");
        const dayIndex = days.findIndex(d => d.fullDate === itemDate);
        if (dayIndex !== -1) {
          days[dayIndex].minutes += TIME_ESTIMATES[estimateKey];
        }
      });
    };

    countByPeriod(workflowRuns, "workflow_run");
    countByPeriod(aetherDocs?.filter(d => d.ai_summary), "document_generated");
    countByPeriod(tickets?.filter(t => t.status === "resolved"), "ticket_resolved");
    countByPeriod(audits, "audit_completed");
    countByPeriod(conversations, "brain_conversation");
    countByPeriod(proposals, "proposal_generated");

    return days;
  }, [workflowRuns, aetherDocs, tickets, audits, conversations, proposals, period]);

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins === 0 ? `${hours}h` : `${hours}h${mins}`;
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Utilisateur";

  if (isLoading) {
    return (
      <DashboardLayout>
        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid gap-4 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        </ScrollArea>
      </DashboardLayout>
    );
  }

  const maxMinutes = Math.max(...metrics.toolMetrics.map(t => t.minutes), 1);

  return (
    <DashboardLayout>
      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Bonjour, {userName}
              </h1>
              <p className="text-muted-foreground">
                Votre tableau de bord AETHER
              </p>
            </div>
            <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <TabsList>
                <TabsTrigger value="week">Semaine</TabsTrigger>
                <TabsTrigger value="month">Mois</TabsTrigger>
                <TabsTrigger value="all">Total</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Main KPIs */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Temps économisé - Hero card */}
            <Card className="md:col-span-1 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2 text-primary/80">
                  <Clock className="w-4 h-4" />
                  Temps économisé
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">
                  {metrics.totalHours}h
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  = {metrics.workdays} jours de travail
                </p>
                {metrics.totalActions > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    +{Math.round(metrics.totalMinutes / 7)}min/jour en moyenne
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Actions automatisées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {metrics.totalActions}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  sur {metrics.toolMetrics.filter(t => t.actions > 0).length} outils
                </p>
              </CardContent>
            </Card>

            {/* Valeur */}
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2 text-green-600/80">
                  <DollarSign className="w-4 h-4" />
                  Valeur économisée
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">
                  {metrics.totalValue.toLocaleString()}€
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  @{HOURLY_RATE}€/h
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart - Évolution adaptée à la période */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {period === "week" ? "Évolution sur 7 jours" : period === "month" ? "Évolution sur 30 jours" : "Évolution sur 6 mois"}
              </CardTitle>
              <CardDescription>Temps économisé par {period === "all" ? "mois" : "jour"} (en minutes)</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.some(d => d.minutes > 0) ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false}
                        className="text-xs"
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tickFormatter={(value) => `${value}min`}
                        className="text-xs"
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border rounded-lg shadow-lg p-3">
                                <p className="text-sm font-medium">{formatTime(payload[0].value as number)}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="minutes"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorMinutes)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Pas encore d'activité cette semaine
                </div>
              )}
            </CardContent>
          </Card>

          {/* Par Outil */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Par outil</CardTitle>
              <CardDescription>Temps économisé par module AETHER</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {metrics.toolMetrics.filter(t => t.actions > 0).length > 0 ? (
                metrics.toolMetrics
                  .filter(t => t.actions > 0)
                  .map((tool) => {
                    const toolDef = TOOLS.find(t => t.id === tool.id);
                    const Icon = toolDef?.icon || Workflow;
                    const percentage = (tool.minutes / maxMinutes) * 100;
                    
                    return (
                      <Link 
                        key={tool.id} 
                        to={toolDef?.path || "#"}
                        className="block group"
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${toolDef?.color}20` }}
                          >
                            <Icon 
                              className="w-5 h-5" 
                              style={{ color: toolDef?.color }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium group-hover:text-primary transition-colors">
                                {tool.name}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {formatTime(tool.minutes)} ({tool.actions})
                              </span>
                            </div>
                            <Progress 
                              value={percentage} 
                              className="h-2"
                            />
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    );
                  })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Pas encore d'activité enregistrée</p>
                  <p className="text-sm mt-1">Utilisez les outils AETHER pour voir vos statistiques ici</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Accès rapide */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Accès rapide</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {TOOLS.map((tool) => {
                const Icon = tool.icon;
                const toolMetric = metrics.toolMetrics.find(t => t.id === tool.id);
                
                return (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="group"
                  >
                    <Card className="p-4 hover:border-primary/50 transition-colors h-full">
                      <div className="flex flex-col items-center text-center gap-2">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: `${tool.color}20` }}
                        >
                          <Icon 
                            className="w-5 h-5" 
                            style={{ color: tool.color }}
                          />
                        </div>
                        <span className="text-xs font-medium line-clamp-1">
                          {tool.name.replace("AETHER ", "")}
                        </span>
                        {toolMetric && toolMetric.minutes > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {formatTime(toolMetric.minutes)}
                          </span>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Méthodologie */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Méthodologie</p>
                  <p>
                    Le temps économisé est calculé selon des benchmarks sectoriels : 
                    workflow ({TIME_ESTIMATES.workflow_run}min), 
                    document IA ({TIME_ESTIMATES.document_generated}min), 
                    audit ({TIME_ESTIMATES.audit_completed}min), 
                    etc. Valorisation à {HOURLY_RATE}€/h.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
}
