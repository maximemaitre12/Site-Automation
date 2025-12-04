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
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const tools = [
  {
    name: "AETHER Flow",
    description: "Visual workflow automation",
    icon: Workflow,
    color: "from-blue-500 to-cyan-400",
    path: "/flow",
    stats: { active: 12, runs: "1.2k" },
  },
  {
    name: "AETHER Docs",
    description: "Document AI processing",
    icon: FileText,
    color: "from-purple-500 to-pink-400",
    path: "/docs",
    stats: { active: 48, runs: "890" },
  },
  {
    name: "Sales Copilot",
    description: "AI sales assistant",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-400",
    path: "/sales",
    stats: { active: 8, runs: "456" },
  },
  {
    name: "Finance",
    description: "Financial automation",
    icon: DollarSign,
    color: "from-yellow-500 to-orange-400",
    path: "/finance",
    stats: { active: 23, runs: "2.1k" },
  },
  {
    name: "HR Copilot",
    description: "HR assistant",
    icon: Users,
    color: "from-indigo-500 to-blue-400",
    path: "/hr",
    stats: { active: 15, runs: "324" },
  },
  {
    name: "Support Copilot",
    description: "Support AI",
    icon: HeadphonesIcon,
    color: "from-rose-500 to-red-400",
    path: "/support",
    stats: { active: 67, runs: "4.5k" },
  },
  {
    name: "Insights",
    description: "BI & Analytics",
    icon: BarChart3,
    color: "from-teal-500 to-cyan-400",
    path: "/insights",
    stats: { active: 9, runs: "567" },
  },
  {
    name: "Brain",
    description: "Internal assistant",
    icon: Brain,
    color: "from-violet-500 to-purple-400",
    path: "/brain",
    stats: { active: 1, runs: "12k" },
  },
  {
    name: "Compliance",
    description: "Audit & compliance",
    icon: Shield,
    color: "from-slate-500 to-gray-400",
    path: "/compliance",
    stats: { active: 4, runs: "89" },
  },
];

const quickStats = [
  { label: "Active Workflows", value: "187", icon: Activity, trend: "+12%" },
  { label: "AI Calls Today", value: "24.5k", icon: Zap, trend: "+8%" },
  { label: "Avg. Response", value: "1.2s", icon: Clock, trend: "-15%" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Here's an overview of your AETHER AI Suite</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, i) => (
            <div
              key={stat.label}
              className="p-6 rounded-2xl bg-card border border-border animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-success">{stat.trend}</span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Your Tools</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, index) => (
            <Link
              key={tool.name}
              to={tool.path}
              className="group relative p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${(index + 3) * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="w-5 h-5 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {tool.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{tool.stats.active} active</span>
                    <span>{tool.stats.runs} runs</span>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}