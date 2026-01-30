import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Users,
  Workflow,
  FileText,
  BarChart3,
  MessageSquare,
  ShieldCheck,
  Brain,
  Database,
  Activity,
  DollarSign,
  Target,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Lightbulb
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
import { format, subDays, startOfWeek, startOfMonth, isAfter, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
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

const HOURLY_RATE = 85; // €/hour

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
  const { tickets, loading: ticketsLoading, getStats: getSupportStats } = useSupport();
  const { audits, loading: auditsLoading } = useCompliance();
  const { candidates, jobs, loading: hrLoading } = useHR();
  const { interviews, loading: interviewsLoading } = useInterviews();
  const { conversations, loading: brainLoading } = useBrain();
  const { proposals, callAnalyses, loading: salesLoading } = useSalesProposals();
  const { sheets: negotiationSheets, loading: sheetsLoading } = useNegotiationSheets();
  const { sources: dataSources, pipelineRuns, stats: dataStats, loading: dataLoading } = useDataPlatform();

  const isLoading = workflowsLoading || runsLoading || docsLoading || ticketsLoading || 
    auditsLoading || hrLoading || interviewsLoading || brainLoading || salesLoading || 
    sheetsLoading || dataLoading;

  // Filter by period
  const filterByPeriod = <T extends { created_at: string }>(data: T[] | undefined): T[] => {
    if (!data?.length) return [];
    if (period === "all") return data;
    
    const now = new Date();
    const startDate = period === "week" ? startOfWeek(now, { weekStartsOn: 1 }) : startOfMonth(now);
    
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
        successRate: filteredWorkflowRuns.length > 0 
          ? Math.round((filteredWorkflowRuns.filter(r => r.status === "completed").length / filteredWorkflowRuns.length) * 100)
          : 0,
        errors: filteredWorkflowRuns.filter(r => r.status === "failed").length,
      },
      {
        id: "doc",
        name: "AETHER Doc",
        actions: docsGenerated + docsAnalyzed,
        minutes: (docsGenerated * TIME_ESTIMATES.document_generated) + (docsAnalyzed * TIME_ESTIMATES.document_analyzed),
        successRate: 100,
        errors: 0,
      },
      {
        id: "data",
        name: "AETHER Data",
        actions: filteredPipelineRuns.length,
        minutes: filteredPipelineRuns.length * 20,
        successRate: filteredPipelineRuns.length > 0
          ? Math.round((filteredPipelineRuns.filter(r => r.status === "completed").length / filteredPipelineRuns.length) * 100)
          : 0,
        errors: filteredPipelineRuns.filter(r => r.status === "failed").length,
      },
      {
        id: "sales",
        name: "Sales Copilot",
        actions: filteredProposals.length + filteredCallAnalyses.length + filteredSheets.length,
        minutes: (filteredProposals.length * TIME_ESTIMATES.proposal_generated) + 
                 (filteredCallAnalyses.length * TIME_ESTIMATES.call_analyzed) +
                 (filteredSheets.length * TIME_ESTIMATES.negotiation_sheet),
        successRate: 100,
        errors: 0,
      },
      {
        id: "hr",
        name: "HR Copilot",
        actions: candidatesWithAnalysis + interviewsWithReport,
        minutes: (candidatesWithAnalysis * TIME_ESTIMATES.candidate_screened) + 
                 (interviewsWithReport * TIME_ESTIMATES.interview_analyzed),
        successRate: 100,
        errors: 0,
      },
      {
        id: "support",
        name: "Support",
        actions: ticketsResolved,
        minutes: ticketsResolved * TIME_ESTIMATES.ticket_resolved,
        successRate: filteredTickets.length > 0
          ? Math.round((ticketsResolved / filteredTickets.length) * 100)
          : 0,
        errors: filteredTickets.filter(t => t.priority === "critical" && t.status !== "resolved").length,
      },
      {
        id: "brain",
        name: "Brain",
        actions: filteredConversations.length,
        minutes: filteredConversations.length * TIME_ESTIMATES.brain_conversation,
        successRate: 100,
        errors: 0,
      },
      {
        id: "compliance",
        name: "Compliance",
        actions: filteredAudits.length,
        minutes: filteredAudits.length * TIME_ESTIMATES.audit_completed,
        successRate: 100,
        errors: 0,
      },
    ].sort((a, b) => b.minutes - a.minutes);

    // Totals
    const totalActions = toolMetrics.reduce((sum, t) => sum + t.actions, 0);
    const totalMinutes = toolMetrics.reduce((sum, t) => sum + t.minutes, 0);
    const totalHours = Math.round(totalMinutes / 60 * 10) / 10;
    const totalValue = Math.round((totalMinutes / 60) * HOURLY_RATE);
    const totalErrors = toolMetrics.reduce((sum, t) => sum + t.errors, 0);
    const globalSuccessRate = totalActions > 0
      ? Math.round(toolMetrics.reduce((sum, t) => sum + (t.successRate * t.actions), 0) / totalActions)
      : 0;

    // Active resources
    const activeWorkflows = workflows.filter(w => w.is_active).length;
    const activeSources = dataSources.filter(s => s.status === "active").length;
    const openTickets = tickets.filter(t => t.status === "open").length;
    const criticalTickets = tickets.filter(t => t.priority === "critical" || t.priority === "high").length;

    return {
      toolMetrics,
      totalActions,
      totalMinutes,
      totalHours,
      totalValue,
      totalErrors,
      globalSuccessRate,
      activeWorkflows,
      activeSources,
      openTickets,
      criticalTickets,
      workdays: Math.round(totalHours / 8 * 10) / 10,
    };
  }, [workflowRuns, aetherDocs, tickets, audits, candidates, interviews, conversations, 
      proposals, callAnalyses, negotiationSheets, pipelineRuns, workflows, dataSources, period]);

  // Daily chart data (last 7 days)
  const chartData = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(now, 6 - i);
      return {
        date: format(date, "EEE", { locale: fr }),
        fullDate: format(date, "yyyy-MM-dd"),
        minutes: 0,
        actions: 0,
      };
    });

    // Count actions per day
    const countByDay = (items: any[] | undefined, estimateKey: keyof typeof TIME_ESTIMATES) => {
      if (!items) return;
      items.forEach(item => {
        const itemDate = format(new Date(item.created_at), "yyyy-MM-dd");
        const dayIndex = days.findIndex(d => d.fullDate === itemDate);
        if (dayIndex !== -1) {
          days[dayIndex].minutes += TIME_ESTIMATES[estimateKey];
          days[dayIndex].actions += 1;
        }
      });
    };

    countByDay(workflowRuns, "workflow_run");
    countByDay(aetherDocs?.filter(d => d.ai_summary), "document_generated");
    countByDay(tickets?.filter(t => t.status === "resolved"), "ticket_resolved");
    countByDay(audits, "audit_completed");
    countByDay(conversations, "brain_conversation");
    countByDay(proposals, "proposal_generated");

    return days;
  }, [workflowRuns, aetherDocs, tickets, audits, conversations, proposals]);

  // Risk analysis
  const risks = useMemo(() => {
    const items: Array<{ type: "critical" | "warning" | "opportunity"; label: string; tool: string; action?: string; path?: string }> = [];

    // Critical: Failed workflows
    const failedWorkflows = workflowRuns.filter(r => r.status === "failed").length;
    if (failedWorkflows > 0) {
      items.push({
        type: "critical",
        label: `${failedWorkflows} workflow(s) en échec`,
        tool: "AETHER Flow",
        action: "Corriger",
        path: "/tools/flow",
      });
    }

    // Critical: Critical tickets
    const criticalOpen = tickets.filter(t => t.priority === "critical" && t.status === "open").length;
    if (criticalOpen > 0) {
      items.push({
        type: "critical",
        label: `${criticalOpen} ticket(s) critique(s) ouvert(s)`,
        tool: "Support",
        action: "Traiter",
        path: "/tools/support",
      });
    }

    // Warning: Data sources in error
    const errorSources = dataSources.filter(s => s.status === "error").length;
    if (errorSources > 0) {
      items.push({
        type: "warning",
        label: `${errorSources} source(s) de données en erreur`,
        tool: "AETHER Data",
        action: "Vérifier",
        path: "/tools/data",
      });
    }

    // Warning: Low workflow success rate
    const workflowSuccessRate = workflowRuns.length > 0 
      ? (workflowRuns.filter(r => r.status === "completed").length / workflowRuns.length) * 100 
      : 100;
    if (workflowSuccessRate < 80 && workflowRuns.length > 0) {
      items.push({
        type: "warning",
        label: `Taux de succès workflows faible (${Math.round(workflowSuccessRate)}%)`,
        tool: "AETHER Flow",
        action: "Optimiser",
        path: "/tools/flow",
      });
    }

    // Opportunity: Inactive workflows
    const inactiveWorkflows = workflows.filter(w => !w.is_active).length;
    if (inactiveWorkflows > 0) {
      items.push({
        type: "opportunity",
        label: `${inactiveWorkflows} workflow(s) inactif(s) à réactiver`,
        tool: "AETHER Flow",
        path: "/tools/flow",
      });
    }

    // Opportunity: Candidates without analysis
    const candidatesNoAnalysis = candidates.filter(c => !c.ai_analysis).length;
    if (candidatesNoAnalysis > 0) {
      items.push({
        type: "opportunity",
        label: `${candidatesNoAnalysis} candidat(s) sans analyse IA`,
        tool: "HR Copilot",
        action: "Analyser",
        path: "/tools/hr",
      });
    }

    return items;
  }, [workflowRuns, tickets, dataSources, workflows, candidates]);

  // Support stats
  const supportStats = getSupportStats();

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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        </ScrollArea>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Bonjour, {userName}
              </h1>
              <p className="text-muted-foreground">
                Centre de contrôle AETHER
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
                <TabsList>
                  <TabsTrigger value="week">Semaine</TabsTrigger>
                  <TabsTrigger value="month">Mois</TabsTrigger>
                  <TabsTrigger value="all">Total</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Niveau 1: Vue Exécutive */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Vue Exécutive
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Temps économisé */}
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Temps économisé
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {metrics.totalHours}h
                  </div>
                  <p className="text-sm text-muted-foreground">
                    = {metrics.workdays} jours de travail
                  </p>
                </CardContent>
              </Card>

              {/* Actions automatisées */}
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Actions automatisées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {metrics.totalActions}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    sur {metrics.toolMetrics.filter(t => t.actions > 0).length} outils actifs
                  </p>
                </CardContent>
              </Card>

              {/* Valeur générée */}
              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Valeur générée
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {metrics.totalValue.toLocaleString()}€
                  </div>
                  <p className="text-sm text-muted-foreground">
                    @{HOURLY_RATE}€/h économisé
                  </p>
                </CardContent>
              </Card>

              {/* Taux de succès */}
              <Card className={cn(
                metrics.globalSuccessRate >= 90 ? "bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20" :
                metrics.globalSuccessRate >= 70 ? "bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20" :
                "bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20"
              )}>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Taux de succès global
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={cn(
                    "text-3xl font-bold",
                    metrics.globalSuccessRate >= 90 ? "text-green-600" :
                    metrics.globalSuccessRate >= 70 ? "text-yellow-600" : "text-red-600"
                  )}>
                    {metrics.globalSuccessRate}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {metrics.totalErrors > 0 ? `${metrics.totalErrors} erreur(s)` : "Aucune erreur"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Secondary stats row */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Workflows actifs</p>
                    <p className="text-2xl font-bold">{metrics.activeWorkflows}</p>
                  </div>
                  <Workflow className="w-8 h-8 text-muted-foreground/50" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Sources données</p>
                    <p className="text-2xl font-bold">{metrics.activeSources}</p>
                  </div>
                  <Database className="w-8 h-8 text-muted-foreground/50" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tickets ouverts</p>
                    <p className="text-2xl font-bold">{metrics.openTickets}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Incidents critiques</p>
                    <p className={cn("text-2xl font-bold", metrics.criticalTickets > 0 && "text-red-600")}>
                      {metrics.criticalTickets}
                    </p>
                  </div>
                  <AlertTriangle className={cn("w-8 h-8", metrics.criticalTickets > 0 ? "text-red-500" : "text-muted-foreground/50")} />
                </div>
              </Card>
            </div>
          </div>

          {/* Niveau 2: Santé Opérationnelle */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Santé Opérationnelle
            </h2>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Evolution chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Évolution sur 7 jours</CardTitle>
                  <CardDescription>Minutes économisées par jour</CardDescription>
                </CardHeader>
                <CardContent>
                  {chartData.some(d => d.minutes > 0) ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <YAxis hide />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload?.length) {
                              return (
                                <div className="bg-background border rounded-lg p-2 shadow-lg">
                                  <p className="font-medium">{formatTime(payload[0].value as number)}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {payload[0].payload.actions} action(s)
                                  </p>
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
                          fill="url(#colorMinutes)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      Pas de données sur les 7 derniers jours
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Performance par outil */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Performance par Outil</CardTitle>
                  <CardDescription>Temps économisé et taux de succès</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {metrics.toolMetrics.filter(t => t.actions > 0).length > 0 ? (
                    metrics.toolMetrics.filter(t => t.actions > 0).slice(0, 5).map((tool) => {
                      const toolDef = TOOLS.find(t => t.id === tool.id);
                      const Icon = toolDef?.icon || Zap;
                      const maxMinutes = Math.max(...metrics.toolMetrics.map(t => t.minutes), 1);
                      
                      return (
                        <Link 
                          key={tool.id} 
                          to={toolDef?.path || "#"}
                          className="block hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${toolDef?.color}20` }}
                            >
                              <Icon className="w-4 h-4" style={{ color: toolDef?.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium truncate">{tool.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold">{formatTime(tool.minutes)}</span>
                                  <Badge variant={tool.successRate >= 90 ? "default" : tool.successRate >= 70 ? "secondary" : "destructive"} className="text-xs">
                                    {tool.successRate}%
                                  </Badge>
                                </div>
                              </div>
                              <Progress 
                                value={(tool.minutes / maxMinutes) * 100} 
                                className="h-1.5"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {tool.actions} action(s) {tool.errors > 0 && `· ${tool.errors} erreur(s)`}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Aucune activité sur cette période</p>
                      <p className="text-sm">Commencez à utiliser les outils AETHER</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Niveau 3: Analyse & Décisions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Analyse & Décisions
            </h2>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Alertes et risques */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Alertes & Actions Requises
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {risks.length > 0 ? (
                    <div className="space-y-2">
                      {risks.map((risk, idx) => (
                        <div 
                          key={idx}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg",
                            risk.type === "critical" && "bg-red-500/10 border border-red-500/20",
                            risk.type === "warning" && "bg-yellow-500/10 border border-yellow-500/20",
                            risk.type === "opportunity" && "bg-blue-500/10 border border-blue-500/20"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {risk.type === "critical" && <XCircle className="w-4 h-4 text-red-500" />}
                            {risk.type === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                            {risk.type === "opportunity" && <Lightbulb className="w-4 h-4 text-blue-500" />}
                            <div>
                              <p className="text-sm font-medium">{risk.label}</p>
                              <p className="text-xs text-muted-foreground">{risk.tool}</p>
                            </div>
                          </div>
                          {risk.path && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={risk.path}>
                                {risk.action || "Voir"}
                                <ArrowRight className="w-3 h-3 ml-1" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
                      <p className="font-medium text-green-600">Tout est opérationnel</p>
                      <p className="text-sm text-muted-foreground">Aucune alerte à signaler</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick access */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Accès Rapide</CardTitle>
                  <CardDescription>Accédez directement à vos outils</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    {TOOLS.map((tool) => {
                      const toolMetric = metrics.toolMetrics.find(t => t.id === tool.id);
                      return (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors text-center"
                        >
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${tool.color}20` }}
                          >
                            <tool.icon className="w-5 h-5" style={{ color: tool.color }} />
                          </div>
                          <div>
                            <p className="text-xs font-medium truncate">{tool.name.split(" ")[0]}</p>
                            {toolMetric && toolMetric.actions > 0 && (
                              <p className="text-[10px] text-muted-foreground">{toolMetric.actions} actions</p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Méthodologie */}
          <Card className="bg-muted/30">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Méthodologie de calcul</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Temps économisé basé sur des benchmarks sectoriels : workflow automatisé (15min), 
                    document IA (45min), audit compliance (2h), analyse CV (35min). 
                    Valeur calculée au taux horaire de {HOURLY_RATE}€/h.
                    Toutes les données proviennent exclusivement de votre activité réelle.
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
