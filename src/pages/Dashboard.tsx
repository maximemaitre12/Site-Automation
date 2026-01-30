import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Workflow,
  FileText,
  BarChart3,
  Users,
  MessageSquare,
  Database,
  ShieldCheck,
  Clock,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  ChevronRight,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import { useWorkflowRuns } from "@/hooks/useWorkflows";
import { useCompliance } from "@/hooks/useCompliance";
import { useHR } from "@/hooks/useHR";
import { useInterviews } from "@/hooks/useInterviews";
import { useSupport } from "@/hooks/useSupport";
import { useBrain } from "@/hooks/useBrain";
import { useSalesProposals } from "@/hooks/useSalesProposals";
import { useNegotiationSheets } from "@/hooks/useNegotiationSheets";
import { useAetherDocs } from "@/hooks/useAetherDocs";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format, subDays, startOfWeek, startOfMonth, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { AnimatedCounter } from "@/components/landing/AnimatedCounter";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// Estimations de temps par action (en minutes) - Benchmarks sectoriels
const TIME_ESTIMATES = {
  workflow_run: 15,        // Automatisation de tâches répétitives
  document_generated: 45,  // Rédaction structurée complète
  document_analyzed: 20,   // Extraction mots-clés + résumé
  proposal_generated: 60,  // Recherche + personnalisation
  call_analyzed: 30,       // Réécoute + synthèse
  negotiation_sheet: 50,   // Préparation argumentaire
  ticket_resolved: 25,     // Classification + réponse IA
  audit_completed: 120,    // Analyse réglementaire complète
  candidate_screened: 35,  // Lecture CV + scoring
  interview_analyzed: 40,  // Rapport + recommandations
  brain_conversation: 10,  // Recherche info + formulation
};

const HOURLY_RATE = 85; // €/heure (taux consultant moyen)

interface TimeSavedByTool {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  bgClass: string;
  minutes: number;
  actions: number;
  path: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { company } = useCompany();
  const { runs: workflowRuns, loading: runsLoading } = useWorkflowRuns();
  const { audits, loading: auditsLoading } = useCompliance();
  const { candidates, loading: hrLoading } = useHR();
  const { interviews, loading: interviewsLoading } = useInterviews();
  const { tickets, loading: ticketsLoading } = useSupport();
  const { conversations, loading: brainLoading } = useBrain();
  const { proposals, callAnalyses, loading: salesLoading } = useSalesProposals();
  const { sheets: negotiationSheets, loading: sheetsLoading } = useNegotiationSheets();
  const { documents: aetherDocs, loading: docsLoading } = useAetherDocs();

  const [period, setPeriod] = useState<"week" | "month" | "all">("month");
  const [currentTime, setCurrentTime] = useState(new Date());

  const isLoading = runsLoading || auditsLoading || hrLoading || interviewsLoading || 
                    ticketsLoading || brainLoading || salesLoading || sheetsLoading || docsLoading;

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Filtrage par période - données réelles uniquement
  const filterByPeriod = <T extends { created_at: string }>(data: T[] | undefined): T[] => {
    if (!data?.length) return [];
    if (period === "all") return data;

    const now = new Date();
    const startDate = period === "week" 
      ? startOfWeek(now, { weekStartsOn: 1 }) 
      : startOfMonth(now);

    return data.filter(item => new Date(item.created_at) >= startDate);
  };

  // Calcul du temps économisé par outil - basé sur données réelles
  const timeSavedByTool = useMemo((): TimeSavedByTool[] => {
    const filteredWorkflowRuns = filterByPeriod(workflowRuns);
    const filteredProposals = filterByPeriod(proposals);
    const filteredCallAnalyses = filterByPeriod(callAnalyses);
    const filteredNegotiationSheets = filterByPeriod(negotiationSheets);
    const filteredTickets = filterByPeriod(tickets?.filter(t => t.status === "resolved"));
    const filteredAudits = filterByPeriod(audits);
    const filteredCandidates = filterByPeriod(candidates);
    const filteredInterviews = filterByPeriod(interviews?.filter(i => i.ai_report && Object.keys(i.ai_report as object).length > 0));
    const filteredConversations = filterByPeriod(conversations);
    const filteredDocs = filterByPeriod(aetherDocs);

    // Documents générés (avec ai_summary) vs analysés (avec ai_keywords)
    const generatedDocs = filteredDocs?.filter(d => d.ai_summary) || [];
    const analyzedDocs = filteredDocs?.filter(d => d.ai_keywords && Array.isArray(d.ai_keywords) && (d.ai_keywords as unknown[]).length > 0) || [];

    return [
      {
        name: "AETHER Flow",
        icon: Workflow,
        colorClass: "text-agent-flow",
        bgClass: "bg-agent-flow/10",
        minutes: filteredWorkflowRuns.length * TIME_ESTIMATES.workflow_run,
        actions: filteredWorkflowRuns.length,
        path: "/tools/flow",
      },
      {
        name: "AETHER Doc",
        icon: FileText,
        colorClass: "text-agent-doc",
        bgClass: "bg-agent-doc/10",
        minutes: generatedDocs.length * TIME_ESTIMATES.document_generated + analyzedDocs.length * TIME_ESTIMATES.document_analyzed,
        actions: generatedDocs.length + analyzedDocs.length,
        path: "/tools/doc",
      },
      {
        name: "Sales Copilot",
        icon: BarChart3,
        colorClass: "text-agent-sales",
        bgClass: "bg-agent-sales/10",
        minutes: 
          filteredProposals.length * TIME_ESTIMATES.proposal_generated +
          filteredCallAnalyses.length * TIME_ESTIMATES.call_analyzed +
          filteredNegotiationSheets.length * TIME_ESTIMATES.negotiation_sheet,
        actions: filteredProposals.length + filteredCallAnalyses.length + filteredNegotiationSheets.length,
        path: "/tools/sales",
      },
      {
        name: "HR Copilot",
        icon: Users,
        colorClass: "text-agent-hr",
        bgClass: "bg-agent-hr/10",
        minutes: 
          filteredCandidates.length * TIME_ESTIMATES.candidate_screened +
          filteredInterviews.length * TIME_ESTIMATES.interview_analyzed,
        actions: filteredCandidates.length + filteredInterviews.length,
        path: "/tools/hr",
      },
      {
        name: "Support Copilot",
        icon: MessageSquare,
        colorClass: "text-agent-support",
        bgClass: "bg-agent-support/10",
        minutes: filteredTickets.length * TIME_ESTIMATES.ticket_resolved,
        actions: filteredTickets.length,
        path: "/tools/support",
      },
      {
        name: "Brain",
        icon: Database,
        colorClass: "text-agent-brain",
        bgClass: "bg-agent-brain/10",
        minutes: filteredConversations.length * TIME_ESTIMATES.brain_conversation,
        actions: filteredConversations.length,
        path: "/tools/brain",
      },
      {
        name: "Compliance",
        icon: ShieldCheck,
        colorClass: "text-agent-compliance",
        bgClass: "bg-agent-compliance/10",
        minutes: filteredAudits.length * TIME_ESTIMATES.audit_completed,
        actions: filteredAudits.length,
        path: "/tools/compliance",
      },
    ].sort((a, b) => b.minutes - a.minutes);
  }, [workflowRuns, proposals, callAnalyses, negotiationSheets, tickets, audits, candidates, interviews, conversations, aetherDocs, period]);

  // Total temps économisé
  const totalMinutesSaved = useMemo(() => {
    return timeSavedByTool.reduce((sum, tool) => sum + tool.minutes, 0);
  }, [timeSavedByTool]);

  const totalHoursSaved = Math.round(totalMinutesSaved / 60);
  const totalDaysSaved = (totalMinutesSaved / 60 / 8).toFixed(1);

  // Total actions
  const totalActions = useMemo(() => {
    return timeSavedByTool.reduce((sum, tool) => sum + tool.actions, 0);
  }, [timeSavedByTool]);

  // Valeur économisée
  const moneySaved = totalHoursSaved * HOURLY_RATE;

  // Données pour le graphique 7 jours - basées sur données réelles
  const weeklyData = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const isInRange = (createdAt: string) => {
        const d = new Date(createdAt);
        return d >= dayStart && d <= dayEnd;
      };

      let dayMinutes = 0;

      // Workflows
      dayMinutes += (workflowRuns?.filter(r => isInRange(r.created_at)).length || 0) * TIME_ESTIMATES.workflow_run;

      // Conversations Brain
      dayMinutes += (conversations?.filter(c => isInRange(c.created_at)).length || 0) * TIME_ESTIMATES.brain_conversation;

      // Tickets résolus
      dayMinutes += (tickets?.filter(t => t.status === "resolved" && t.resolved_at && isInRange(t.resolved_at)).length || 0) * TIME_ESTIMATES.ticket_resolved;

      // Propositions commerciales
      dayMinutes += (proposals?.filter(p => isInRange(p.created_at)).length || 0) * TIME_ESTIMATES.proposal_generated;

      // Analyses d'appels
      dayMinutes += (callAnalyses?.filter(c => isInRange(c.created_at)).length || 0) * TIME_ESTIMATES.call_analyzed;

      // Fiches de négociation
      dayMinutes += (negotiationSheets?.filter(n => isInRange(n.created_at)).length || 0) * TIME_ESTIMATES.negotiation_sheet;

      // Audits
      dayMinutes += (audits?.filter(a => isInRange(a.created_at)).length || 0) * TIME_ESTIMATES.audit_completed;

      // Documents AETHER
      dayMinutes += (aetherDocs?.filter(d => d.ai_summary && isInRange(d.created_at)).length || 0) * TIME_ESTIMATES.document_generated;
      dayMinutes += (aetherDocs?.filter(d => d.ai_keywords && Array.isArray(d.ai_keywords) && (d.ai_keywords as unknown[]).length > 0 && isInRange(d.created_at)).length || 0) * TIME_ESTIMATES.document_analyzed;

      // Candidats
      dayMinutes += (candidates?.filter(c => isInRange(c.created_at)).length || 0) * TIME_ESTIMATES.candidate_screened;

      // Entretiens analysés
      dayMinutes += (interviews?.filter(i => i.ai_report && Object.keys(i.ai_report as object).length > 0 && isInRange(i.created_at)).length || 0) * TIME_ESTIMATES.interview_analyzed;

      days.push({
        name: format(date, "EEE", { locale: fr }),
        fullDate: format(date, "d MMM", { locale: fr }),
        minutes: dayMinutes,
      });
    }

    return days;
  }, [workflowRuns, conversations, tickets, proposals, callAnalyses, negotiationSheets, audits, aetherDocs, candidates, interviews]);

  // Labels période
  const periodLabel = period === "week" ? "cette semaine" : period === "month" ? "ce mois" : "au total";
  const periodDays = period === "week" ? 7 : period === "month" ? differenceInDays(new Date(), startOfMonth(new Date())) + 1 : 365;

  // Formatage temps
  const formatTimeSaved = (minutes: number): string => {
    if (minutes === 0) return "0 min";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    if (remainingMins === 0) return `${hours}h`;
    return `${hours}h ${remainingMins}min`;
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "là";

  return (
    <DashboardLayout>
      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Bonjour, <span className="text-gradient">{userName}</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {format(currentTime, "EEEE d MMMM yyyy", { locale: fr })}
                {company && <span className="ml-2 text-primary">• {company.name}</span>}
              </p>
            </div>

            <Tabs value={period} onValueChange={(v) => setPeriod(v as "week" | "month" | "all")} className="w-auto">
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="week" className="text-xs sm:text-sm">Semaine</TabsTrigger>
                <TabsTrigger value="month" className="text-xs sm:text-sm">Mois</TabsTrigger>
                <TabsTrigger value="all" className="text-xs sm:text-sm">Total</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Temps économisé - Card principale */}
            <Card className="md:col-span-2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-6 sm:p-8 relative">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">Temps économisé {periodLabel}</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      {isLoading ? (
                        <Skeleton className="h-16 w-32" />
                      ) : (
                        <>
                          <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tabular-nums">
                            <AnimatedCounter end={totalHoursSaved} duration={1500} />
                          </span>
                          <span className="text-2xl sm:text-3xl text-muted-foreground font-medium">heures</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      = <span className="text-primary font-semibold">{totalDaysSaved} jours</span> de travail
                    </p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium">
                      <TrendingUp className="w-4 h-4" />
                      +{Math.round(totalMinutesSaved / periodDays)} min/jour
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPIs secondaires */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <Card className="border-border bg-card/50">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      {isLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                          <AnimatedCounter end={totalActions} duration={1200} />
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">Actions automatisées</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card/50">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      {isLoading ? (
                        <Skeleton className="h-8 w-20" />
                      ) : (
                        <p className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                          <AnimatedCounter end={moneySaved} prefix="€" duration={1500} />
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">Valeur économisée</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Graphique + Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Graphique évolution 7 jours */}
            <Card className="lg:col-span-2 border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Évolution sur 7 jours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] sm:h-[280px]">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Skeleton className="w-full h-full" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyData}>
                        <defs>
                          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="name" 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(v) => `${v}min`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "12px",
                          }}
                          formatter={(value: number) => [`${value} min (${(value / 60).toFixed(1)}h)`, "Temps économisé"]}
                          labelFormatter={(_, payload) => payload[0]?.payload?.fullDate || ""}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="minutes" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          fill="url(#areaGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Breakdown par outil */}
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Par outil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))
                ) : timeSavedByTool.filter(t => t.minutes > 0).length > 0 ? (
                  timeSavedByTool.filter(t => t.minutes > 0).slice(0, 5).map((tool) => {
                    const percentage = totalMinutesSaved > 0 ? (tool.minutes / totalMinutesSaved) * 100 : 0;
                    return (
                      <Link 
                        key={tool.name} 
                        to={tool.path}
                        className="block group"
                      >
                        <div className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-secondary/50 transition-colors">
                          <div className={`w-9 h-9 rounded-lg ${tool.bgClass} flex items-center justify-center shrink-0`}>
                            <tool.icon className={`w-4 h-4 ${tool.colorClass}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-foreground truncate">{tool.name}</span>
                              <span className="text-sm font-semibold text-foreground tabular-nums">
                                {formatTimeSaved(tool.minutes)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={percentage} className="h-1.5 flex-1" />
                              <span className="text-xs text-muted-foreground w-10 text-right">({tool.actions})</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Pas encore d'activité</p>
                    <p className="text-xs mt-1">Utilisez les outils pour voir le temps économisé</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Accès rapide aux outils */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Accès rapide</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {timeSavedByTool.map((tool) => (
                <Link
                  key={tool.name}
                  to={tool.path}
                  className="group p-4 rounded-xl bg-card/50 border border-border/60 hover:bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-10 h-10 rounded-xl ${tool.bgClass} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <tool.icon className={`w-5 h-5 ${tool.colorClass}`} />
                  </div>
                  <h3 className="text-sm font-medium text-foreground leading-tight mb-1 line-clamp-2">
                    {tool.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeSaved(tool.minutes)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Méthodologie */}
          <Card className="border-border bg-card/30">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Méthodologie de calcul</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    Le temps économisé est calculé en comparant chaque action automatisée au temps moyen qu'elle prendrait manuellement, 
                    basé sur des benchmarks sectoriels. La valeur est estimée à {HOURLY_RATE}€/heure (taux consultant moyen).
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs text-muted-foreground">
                    <span>• Workflow: {TIME_ESTIMATES.workflow_run}min</span>
                    <span>• Document IA: {TIME_ESTIMATES.document_generated}min</span>
                    <span>• Audit: {TIME_ESTIMATES.audit_completed}min</span>
                    <span>• Proposition: {TIME_ESTIMATES.proposal_generated}min</span>
                    <span>• Analyse appel: {TIME_ESTIMATES.call_analyzed}min</span>
                    <span>• Fiche négo: {TIME_ESTIMATES.negotiation_sheet}min</span>
                    <span>• Ticket IA: {TIME_ESTIMATES.ticket_resolved}min</span>
                    <span>• CV analysé: {TIME_ESTIMATES.candidate_screened}min</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </DashboardLayout>
  );
}
