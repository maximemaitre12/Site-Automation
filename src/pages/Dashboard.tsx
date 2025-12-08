import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Workflow,
  FileText,
  TrendingUp,
  Users,
  HeadphonesIcon,
  Brain,
  Shield,
  ArrowRight,
  Activity,
  Zap,
  Clock,
  ArrowUpRight,
  Sparkles,
  Settings,
  Bell,
  Search,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import { useWorkflows, useWorkflowRuns } from "@/hooks/useWorkflows";
import { useCompliance } from "@/hooks/useCompliance";
import { useHR } from "@/hooks/useHR";
import { useSupport } from "@/hooks/useSupport";
import { useBrain } from "@/hooks/useBrain";
import { useSalesProposals } from "@/hooks/useSalesProposals";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subDays, isToday, isThisWeek } from "date-fns";
import { fr } from "date-fns/locale";

export default function Dashboard() {
  const { user } = useAuth();
  const { company, loading: companyLoading } = useCompany();
  const { workflows } = useWorkflows();
  const { runs: workflowRuns } = useWorkflowRuns();
  const { audits } = useCompliance();
  const { candidates, jobs } = useHR();
  const { tickets } = useSupport();
  const { conversations, documents: brainDocs } = useBrain();
  const { proposals, callAnalyses } = useSalesProposals();
  
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Helper function - must be defined before useMemo hooks that use it
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  // Calculate real stats
  const stats = useMemo(() => {
    const activeWorkflows = workflows?.filter(w => w.is_active)?.length || 0;
    const totalWorkflowRuns = workflowRuns?.length || 0;
    const totalDocuments = (brainDocs?.length || 0) + (audits?.length || 0);
    const totalConversations = conversations?.length || 0;
    const totalTickets = tickets?.length || 0;
    const resolvedTickets = tickets?.filter(t => t.status === 'resolved')?.length || 0;
    const totalCandidates = candidates?.length || 0;
    const totalProposals = proposals?.length || 0;
    const totalCallAnalyses = callAnalyses?.length || 0;
    
    return {
      activeWorkflows,
      totalWorkflowRuns,
      totalDocuments,
      totalConversations,
      totalTickets,
      resolvedTickets,
      totalCandidates,
      totalProposals,
      totalCallAnalyses,
      aiCalls: totalConversations + totalWorkflowRuns + (audits?.length || 0) + totalCallAnalyses,
    };
  }, [workflows, workflowRuns, brainDocs, audits, conversations, tickets, candidates, proposals, callAnalyses]);

  // Calculate usage by tool
  const usageByToolData = useMemo(() => {
    const flowUsage = (workflowRuns?.length || 0);
    const supportUsage = (tickets?.length || 0);
    const brainUsage = (conversations?.length || 0) + (brainDocs?.length || 0);
    const hrUsage = (candidates?.length || 0) + (jobs?.length || 0);
    const salesUsage = (proposals?.length || 0) + (callAnalyses?.length || 0);
    const complianceUsage = (audits?.length || 0);
    
    const total = flowUsage + supportUsage + brainUsage + hrUsage + salesUsage + complianceUsage;
    
    if (total === 0) {
      return [
        { name: "Flow", value: 0, color: "#3b82f6" },
        { name: "Support", value: 0, color: "#f43f5e" },
        { name: "Brain", value: 0, color: "#8b5cf6" },
        { name: "Autres", value: 0, color: "#64748b" },
      ];
    }
    
    return [
      { name: "Flow", value: Math.round((flowUsage / total) * 100), color: "#3b82f6" },
      { name: "Support", value: Math.round((supportUsage / total) * 100), color: "#f43f5e" },
      { name: "Brain", value: Math.round((brainUsage / total) * 100), color: "#8b5cf6" },
      { name: "Autres", value: Math.round(((hrUsage + salesUsage + complianceUsage) / total) * 100), color: "#64748b" },
    ];
  }, [workflowRuns, tickets, conversations, brainDocs, candidates, jobs, proposals, callAnalyses, audits]);

  // Build recent activity from real data
  const recentActivity = useMemo(() => {
    const activities: Array<{ type: string; name: string; status: string; time: Date; timeLabel: string }> = [];
    
    // Add workflow runs
    workflowRuns?.slice(0, 3).forEach(run => {
      const workflow = workflows?.find(w => w.id === run.workflow_id);
      activities.push({
        type: "workflow",
        name: workflow?.name || "Workflow",
        status: run.status || "completed",
        time: new Date(run.created_at),
        timeLabel: formatTimeAgo(new Date(run.created_at)),
      });
    });
    
    // Add tickets
    tickets?.slice(0, 2).forEach(ticket => {
      activities.push({
        type: "ticket",
        name: `Ticket ${ticket.ticket_number}`,
        status: ticket.status || "open",
        time: new Date(ticket.created_at),
        timeLabel: formatTimeAgo(new Date(ticket.created_at)),
      });
    });
    
    // Add audits
    audits?.slice(0, 2).forEach(audit => {
      activities.push({
        type: "audit",
        name: audit.title,
        status: audit.status || "completed",
        time: new Date(audit.created_at),
        timeLabel: formatTimeAgo(new Date(audit.created_at)),
      });
    });
    
    // Add conversations
    conversations?.slice(0, 2).forEach(conv => {
      activities.push({
        type: "ai",
        name: conv.title,
        status: "completed",
        time: new Date(conv.created_at),
        timeLabel: formatTimeAgo(new Date(conv.created_at)),
      });
    });
    
    // Sort by time and take top 5
    return activities
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 5);
  }, [workflowRuns, workflows, tickets, audits, conversations]);

  // Build weekly activity data
  const activityData = useMemo(() => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const today = new Date();
    
    return days.map((name, index) => {
      const date = subDays(today, 6 - index);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const workflowCount = workflowRuns?.filter(run => {
        const runDate = new Date(run.created_at);
        return runDate >= dayStart && runDate <= dayEnd;
      }).length || 0;
      
      const aiCount = (conversations?.filter(conv => {
        const convDate = new Date(conv.created_at);
        return convDate >= dayStart && convDate <= dayEnd;
      }).length || 0) + workflowCount;
      
      return {
        name,
        workflows: workflowCount,
        ai: aiCount,
      };
    });
  }, [workflowRuns, conversations]);


  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "là";

  const tools = [
    {
      name: "AETHER Flow",
      description: "Automatisation visuelle",
      icon: Workflow,
      color: "from-blue-500 to-cyan-400",
      path: "/tools/flow",
      stats: { active: stats.activeWorkflows, runs: stats.totalWorkflowRuns },
    },
    {
      name: "Sales Copilot",
      description: "Assistant commercial IA",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-400",
      path: "/tools/sales",
      stats: { active: stats.totalProposals, runs: stats.totalCallAnalyses },
    },
    {
      name: "HR Copilot",
      description: "Assistant RH",
      icon: Users,
      color: "from-indigo-500 to-blue-400",
      path: "/tools/hr",
      stats: { active: jobs?.length || 0, runs: stats.totalCandidates },
    },
    {
      name: "Support Copilot",
      description: "Support IA",
      icon: HeadphonesIcon,
      color: "from-rose-500 to-red-400",
      path: "/tools/support",
      stats: { active: stats.totalTickets - stats.resolvedTickets, runs: stats.totalTickets },
    },
    {
      name: "Brain",
      description: "Assistant interne",
      icon: Brain,
      color: "from-violet-500 to-purple-400",
      path: "/tools/brain",
      stats: { active: brainDocs?.length || 0, runs: stats.totalConversations },
    },
    {
      name: "Compliance",
      description: "Audit & conformité",
      icon: Shield,
      color: "from-slate-500 to-gray-400",
      path: "/tools/compliance",
      stats: { active: audits?.length || 0, runs: audits?.length || 0 },
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="animate-fade-in">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 md:mb-2">
              {greeting()}, <span className="text-gradient">{userName}</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {format(currentTime, "EEEE d MMMM", { locale: fr })}
              {company && (
                <span className="ml-2 text-primary">• {company.name}</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="w-40 md:w-64 pl-9 bg-secondary/50 border-border"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10">
              <Bell className="w-4 h-4 md:w-5 md:h-5" />
              {recentActivity.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </Button>
            <Link to="/settings/company">
              <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10">
                <Settings className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            {
              label: "Workflows actifs",
              value: stats.activeWorkflows,
              icon: Activity,
              color: "from-blue-500/20 to-cyan-500/20",
            },
            {
              label: "Appels IA",
              value: stats.aiCalls,
              icon: Zap,
              color: "from-purple-500/20 to-pink-500/20",
            },
            {
              label: "Documents traités",
              value: stats.totalDocuments,
              icon: FileText,
              color: "from-green-500/20 to-emerald-500/20",
            },
            {
              label: "Tickets support",
              value: stats.totalTickets,
              icon: MessageSquare,
              color: "from-orange-500/20 to-yellow-500/20",
            },
          ].map((stat, i) => (
            <Card
              key={stat.label}
              className="border-border bg-card/50 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${(i + 1) * 0.1}s` }}
            >
              <CardContent className="p-3 md:p-5 relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-0.5 md:mb-1 tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Activity Chart */}
          <Card className="lg:col-span-2 border-border bg-card/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="pb-2 px-4 md:px-6">
              <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                Activité de la semaine
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 md:px-6">
              <div className="h-[200px] md:h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="gradientWorkflows" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(235 99% 62%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(235 99% 62%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradientAI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(260 100% 65%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(260 100% 65%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(220 10% 46%)"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(220 10% 46%)"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      hide={true}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0 0% 100%)",
                        border: "1px solid hsl(220 13% 91%)",
                        borderRadius: "8px",
                        color: "hsl(220 15% 15%)",
                        fontSize: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ai"
                      stroke="hsl(260 100% 65%)"
                      strokeWidth={2}
                      fill="url(#gradientAI)"
                    />
                    <Area
                      type="monotone"
                      dataKey="workflows"
                      stroke="hsl(235 99% 62%)"
                      strokeWidth={2}
                      fill="url(#gradientWorkflows)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-4 md:gap-6 mt-3 md:mt-4">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary" />
                  <span className="text-xs md:text-sm text-muted-foreground">Workflows</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ background: "hsl(260 100% 65%)" }} />
                  <span className="text-xs md:text-sm text-muted-foreground">Appels IA</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage by Tool */}
          <Card className="border-border bg-card/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <CardHeader className="pb-2 px-4 md:px-6">
              <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                Utilisation par outil
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="h-[150px] md:h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={usageByToolData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {usageByToolData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0 0% 100%)",
                        border: "1px solid hsl(220 13% 91%)",
                        borderRadius: "8px",
                        color: "hsl(220 15% 15%)",
                        fontSize: "12px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-1.5 md:gap-2 mt-3 md:mt-4">
                {usageByToolData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-[10px] md:text-xs text-muted-foreground truncate">{item.name}</span>
                    <span className="text-[10px] md:text-xs font-medium text-foreground ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Recent Activity */}
          <Card className="border-border bg-card/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <CardHeader className="pb-2 px-4 md:px-6">
              <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              {recentActivity.length === 0 ? (
                <div className="text-center py-6 md:py-8 text-muted-foreground">
                  <Activity className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 opacity-50" />
                  <p className="text-xs md:text-sm">Aucune activité récente</p>
                  <p className="text-[10px] md:text-xs mt-1">Commencez à utiliser les outils AETHER</p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {recentActivity.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          item.status === "completed" || item.status === "resolved"
                            ? "bg-success"
                            : item.status === "running" || item.status === "pending"
                            ? "bg-warning animate-pulse"
                            : "bg-primary"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-[10px] md:text-xs text-muted-foreground capitalize">{item.status}</p>
                      </div>
                      <span className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">{item.timeLabel}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tools Grid */}
          <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-base md:text-lg font-semibold text-foreground">Vos outils</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
              {tools.map((tool, index) => (
                <Link
                  key={tool.name}
                  to={tool.path}
                  className="group p-3 md:p-4 rounded-lg md:rounded-xl bg-card/50 border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start gap-2 md:gap-3 mb-2 md:mb-3">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <tool.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs md:text-sm font-semibold text-foreground truncate">{tool.name}</h3>
                      <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">{tool.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] md:text-xs">
                    <span className="text-muted-foreground">
                      {tool.stats.active} actif{tool.stats.active > 1 ? 's' : ''}
                    </span>
                    <span className="text-primary font-medium">
                      {tool.stats.runs} exec.
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
