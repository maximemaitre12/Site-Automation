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
} from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  {
    name: "AETHER Flow",
    description: "Visual workflow orchestrator with drag & drop automation",
    icon: Workflow,
    color: "from-blue-500 to-cyan-400",
    path: "/flow",
  },
  {
    name: "Sales Copilot",
    description: "AI-powered sales proposals and prospect scoring",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-400",
    path: "/sales",
  },
  {
    name: "HR Copilot",
    description: "Resume analysis, candidate matching and HR automation",
    icon: Users,
    color: "from-indigo-500 to-blue-400",
    path: "/hr",
  },
  {
    name: "Support Copilot",
    description: "Ticket classification and automated response generation",
    icon: HeadphonesIcon,
    color: "from-rose-500 to-red-400",
    path: "/support",
  },
  {
    name: "Brain",
    description: "Internal AI assistant with semantic document search",
    icon: Brain,
    color: "from-violet-500 to-purple-400",
    path: "/brain",
  },
  {
    name: "Compliance",
    description: "Automated GDPR audit and compliance risk detection",
    icon: Shield,
    color: "from-slate-500 to-gray-400",
    path: "/compliance",
  },
];

export function ToolsShowcase() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">One Platform,</span>{" "}
            <span className="text-gradient">Infinite Power</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nine AI-powered tools designed to transform every aspect of your business operations.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Link
              key={tool.name}
              to={tool.path}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <tool.icon className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {tool.description}
              </p>
              
              {/* Hover effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}