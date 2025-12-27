import { useState } from "react";
import { 
  Zap, Brain, Sparkles, ScanSearch, ShieldCheck, LineChart,
  ChevronDown, Workflow, MessageSquare, FileText, Target, Users,
  BarChart3, Mail, Calendar, Shield, AlertTriangle, TrendingUp,
  Phone, FileCheck, Database
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Tool {
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  color: string;
  features: Feature[];
}

const tools: Tool[] = [
  {
    name: "Flow",
    tagline: "Predictive automation",
    description: "AI anticipates your needs and triggers workflows before you even think about it.",
    icon: Zap,
    color: "bg-blue-500",
    features: [
      { icon: Workflow, title: "Visual Builder", description: "Drag & drop workflow creation" },
      { icon: Zap, title: "Auto Triggers", description: "Intelligent event detection" },
      { icon: Mail, title: "Multi-channel", description: "Email, SMS, webhooks" },
    ],
  },
  {
    name: "Brain",
    tagline: "Contextual intelligence",
    description: "An AI that understands your business context and responds with precision.",
    icon: Brain,
    color: "bg-violet-500",
    features: [
      { icon: MessageSquare, title: "Smart Chat", description: "Natural conversations" },
      { icon: Database, title: "Knowledge Base", description: "Learn from your docs" },
      { icon: FileText, title: "Doc Generation", description: "AI-powered content" },
    ],
  },
  {
    name: "Support",
    tagline: "Conversational AI",
    description: "Autonomous ticket resolution with continuous learning. Significant time reduction.",
    icon: Sparkles,
    color: "bg-emerald-500",
    features: [
      { icon: MessageSquare, title: "Auto Response", description: "Instant answers 24/7" },
      { icon: Target, title: "Smart Routing", description: "Right agent, first time" },
      { icon: BarChart3, title: "Analytics", description: "Satisfaction tracking" },
    ],
  },
  {
    name: "HR",
    tagline: "Predictive matching",
    description: "AI predicts candidate-job compatibility and accelerates your hiring process.",
    icon: ScanSearch,
    color: "bg-orange-500",
    features: [
      { icon: Users, title: "CV Parsing", description: "Extract skills instantly" },
      { icon: Calendar, title: "Interview AI", description: "Smart scheduling" },
      { icon: Target, title: "Match Score", description: "Candidate-job fit %" },
    ],
  },
  {
    name: "Compliance",
    tagline: "Proactive detection",
    description: "Anticipate risks before they occur. Automated GDPR compliance.",
    icon: ShieldCheck,
    color: "bg-rose-500",
    features: [
      { icon: Shield, title: "Risk Scan", description: "Automatic detection" },
      { icon: AlertTriangle, title: "Alerts", description: "Real-time notifications" },
      { icon: FileCheck, title: "Reports", description: "Compliance documentation" },
    ],
  },
  {
    name: "Sales",
    tagline: "Intelligent forecasting",
    description: "Forecast revenue, analyze sentiment, and generate winning proposals.",
    icon: LineChart,
    color: "bg-cyan-500",
    features: [
      { icon: TrendingUp, title: "Forecasting", description: "AI revenue predictions" },
      { icon: Phone, title: "Call Analysis", description: "Sentiment & insights" },
      { icon: FileText, title: "Proposals", description: "Auto-generated docs" },
    ],
  },
];

export function PainPointsSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="product" className="py-16 sm:py-24 lg:py-32 bg-secondary/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3 sm:mb-4">
            Six AI agents. One revolution.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground px-2">
            Each agent solves a specific business problem. Together, they transform your operations.
          </p>
        </div>
        
        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tools.map((tool, i) => {
            const IconComponent = tool.icon;
            const isExpanded = expandedIndex === i;
            
            return (
              <div 
                key={i} 
                className={cn(
                  "group rounded-2xl bg-background border transition-all duration-300 cursor-pointer overflow-hidden",
                  isExpanded 
                    ? "border-primary shadow-lg shadow-primary/10" 
                    : "border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                )}
                onClick={() => handleToggle(i)}
              >
                {/* Header - always visible */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" strokeWidth={1.5} />
                    </div>
                    <div className={cn(
                      "w-8 h-8 rounded-full bg-secondary flex items-center justify-center transition-transform duration-300",
                      isExpanded && "rotate-180"
                    )}>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="mt-5">
                    <div className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
                      {tool.tagline}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      AETHER {tool.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Expanded content - features */}
                <div className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}>
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-2 border-t border-border/50">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                        Key Features
                      </div>
                      <div className="space-y-3">
                        {tool.features.map((feature, j) => {
                          const FeatureIcon = feature.icon;
                          return (
                            <div 
                              key={j}
                              className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                tool.color + "/20"
                              )}>
                                <FeatureIcon className={cn("w-4 h-4", `text-${tool.color.replace('bg-', '')}`)} strokeWidth={1.5} />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-foreground">
                                  {feature.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {feature.description}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
