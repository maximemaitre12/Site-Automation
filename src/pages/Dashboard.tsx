import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Workflow,
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  HeadphonesIcon,
  BarChart3,
  Brain,
  Shield,
  ArrowRight,
  Activity,
  Zap,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Settings,
  Bell,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useCompany } from "@/hooks/useCompany";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const tools = [
  {
    name: "AETHER Flow",
    description: "Visual workflow automation",
    icon: Workflow,
    color: "from-blue-500 to-cyan-400",
    path: "/tools/flow",
    stats: { active: 12, runs: "1.2k" },
  },
  {
    name: "Sales Copilot",
    description: "AI sales assistant",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-400",
    path: "/tools/sales",
    stats: { active: 8, runs: "456" },
  },
  {
    name: "Finance",
    description: "Financial automation",
    icon: DollarSign,
    color: "from-yellow-500 to-orange-400",
    path: "/tools/finance",
    stats: { active: 23, runs: "2.1k" },
  },
  {
    name: "HR Copilot",
    description: "HR assistant",
    icon: Users,
    color: "from-indigo-500 to-blue-400",
    path: "/tools/hr",
    stats: { active: 15, runs: "324" },
  },
  {
    name: "Support Copilot",
    description: "Support AI",
    icon: HeadphonesIcon,
    color: "from-rose-500 to-red-400",
    path: "/tools/support",
    stats: { active: 67, runs: "4.5k" },
  },
  {
    name: "Insights",
    description: "BI & Analytics",
    icon: BarChart3,
    color: "from-teal-500 to-cyan-400",
    path: "/tools/insights",
    stats: { active: 9, runs: "567" },
  },
  {
    name: "Brain",
    description: "Internal assistant",
    icon: Brain,
    color: "from-violet-500 to-purple-400",
    path: "/tools/brain",
    stats: { active: 1, runs: "12k" },
  },
  {
    name: "Compliance",
    description: "Audit & compliance",
    icon: Shield,
    color: "from-slate-500 to-gray-400",
    path: "/tools/compliance",
    stats: { active: 4, runs: "89" },
  },
];

// Mock data for charts
const activityData = [
  { name: "Mon", workflows: 45, documents: 32, ai: 120 },
  { name: "Tue", workflows: 52, documents: 41, ai: 145 },
  { name: "Wed", workflows: 61, documents: 38, ai: 180 },
  { name: "Thu", workflows: 48, documents: 55, ai: 156 },
  { name: "Fri", workflows: 72, documents: 48, ai: 210 },
  { name: "Sat", workflows: 35, documents: 22, ai: 95 },
  { name: "Sun", workflows: 28, documents: 18, ai: 78 },
];

const usageByToolData = [
  { name: "Flow", value: 40, color: "#3b82f6" },
  { name: "Support", value: 25, color: "#f43f5e" },
  { name: "Brain", value: 20, color: "#8b5cf6" },
  { name: "Others", value: 15, color: "#64748b" },
];

const recentActivity = [
  { type: "workflow", name: "Invoice Processing", status: "completed", time: "2 min ago" },
  { type: "document", name: "Q4 Report.pdf", status: "analyzed", time: "5 min ago" },
  { type: "ai", name: "Sales Analysis", status: "running", time: "8 min ago" },
  { type: "ticket", name: "Support #1234", status: "resolved", time: "12 min ago" },
  { type: "workflow", name: "Data Sync", status: "completed", time: "15 min ago" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { company, loading: companyLoading } = useCompany();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedStats, setAnimatedStats] = useState({
    workflows: 0,
    aiCalls: 0,
    documents: 0,
    response: 0,
  });

  // Animate stats on mount
  useEffect(() => {
    const targetStats = { workflows: 187, aiCalls: 24500, documents: 1420, response: 1.2 };
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      setAnimatedStats({
        workflows: Math.round(targetStats.workflows * eased),
        aiCalls: Math.round(targetStats.aiCalls * eased),
        documents: Math.round(targetStats.documents * eased),
        response: parseFloat((targetStats.response * eased).toFixed(1)),
      });

      if (step >= steps) clearInterval(interval);
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="animate-fade-in">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {greeting()}, <span className="text-gradient">{userName}</span>
            </h1>
            <p className="text-muted-foreground">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
              {company && (
                <span className="ml-2 text-primary">• {company.name}</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search anything..."
                className="w-64 pl-9 bg-secondary/50 border-border"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
            </Button>
            <Link to="/settings/company">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Active Workflows",
              value: animatedStats.workflows,
              icon: Activity,
              trend: "+12%",
              positive: true,
              color: "from-blue-500/20 to-cyan-500/20",
            },
            {
              label: "AI Calls Today",
              value: animatedStats.aiCalls.toLocaleString(),
              icon: Zap,
              trend: "+8%",
              positive: true,
              color: "from-purple-500/20 to-pink-500/20",
            },
            {
              label: "Documents Processed",
              value: animatedStats.documents.toLocaleString(),
              icon: FileText,
              trend: "+23%",
              positive: true,
              color: "from-green-500/20 to-emerald-500/20",
            },
            {
              label: "Avg. Response",
              value: `${animatedStats.response}s`,
              icon: Clock,
              trend: "-15%",
              positive: true,
              color: "from-orange-500/20 to-yellow-500/20",
            },
          ].map((stat, i) => (
            <Card
              key={stat.label}
              className="border-border bg-card/50 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${(i + 1) * 0.1}s` }}
            >
              <CardContent className="p-5 relative">
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        stat.positive ? "text-success" : "text-destructive"
                      }`}
                    >
                      {stat.positive ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {stat.trend}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart */}
          <Card className="lg:col-span-2 border-border bg-card/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 25%)" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(220 14% 65%)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(220 14% 65%)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(220 55% 12%)",
                        border: "1px solid hsl(220 30% 25%)",
                        borderRadius: "8px",
                        color: "hsl(220 14% 91%)",
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
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">Workflows</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: "hsl(260 100% 65%)" }} />
                  <span className="text-sm text-muted-foreground">AI Calls</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage by Tool */}
          <Card className="border-border bg-card/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Usage by Tool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={usageByToolData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {usageByToolData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(220 55% 12%)",
                        border: "1px solid hsl(220 30% 25%)",
                        borderRadius: "8px",
                        color: "hsl(220 14% 91%)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {usageByToolData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                    <span className="text-xs font-medium text-foreground ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="border-border bg-card/50 backdrop-blur-sm animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.status === "completed" || item.status === "resolved"
                          ? "bg-success"
                          : item.status === "running"
                          ? "bg-warning animate-pulse"
                          : "bg-primary"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.status}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tools Grid */}
          <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Your Tools</h2>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View all
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tools.slice(0, 6).map((tool, index) => (
                <Link
                  key={tool.name}
                  to={tool.path}
                  className="group relative p-4 rounded-xl bg-card/50 border border-border hover:border-primary/50 hover:bg-card transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <tool.icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        {!company && !companyLoading && (
          <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent animate-fade-in overflow-hidden relative" style={{ animationDelay: "0.7s" }}>
            <div className="absolute inset-0 bg-hero-pattern opacity-50" />
            <CardContent className="p-6 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Complete Your Setup
                  </h3>
                  <p className="text-muted-foreground">
                    Create your company workspace to unlock team collaboration and enterprise features.
                  </p>
                </div>
                <Link to="/onboarding">
                  <Button className="glow">
                    Create Workspace
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
