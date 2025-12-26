import { 
  Zap, Brain, Sparkles, ScanSearch, ShieldCheck, LineChart
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Tool {
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const tools: Tool[] = [
  {
    name: "Flow",
    tagline: "Predictive automation",
    description: "AI anticipates your needs and triggers workflows before you even think about it.",
    icon: Zap,
    color: "bg-blue-500",
  },
  {
    name: "Brain",
    tagline: "Contextual intelligence",
    description: "An AI that understands your business context and responds with precision.",
    icon: Brain,
    color: "bg-violet-500",
  },
  {
    name: "Support",
    tagline: "Conversational AI",
    description: "Autonomous ticket resolution with continuous learning. Significant time reduction.",
    icon: Sparkles,
    color: "bg-emerald-500",
  },
  {
    name: "HR",
    tagline: "Predictive matching",
    description: "AI predicts candidate-job compatibility and accelerates your hiring process.",
    icon: ScanSearch,
    color: "bg-orange-500",
  },
  {
    name: "Compliance",
    tagline: "Proactive detection",
    description: "Anticipate risks before they occur. Automated GDPR compliance.",
    icon: ShieldCheck,
    color: "bg-rose-500",
  },
  {
    name: "Sales",
    tagline: "Intelligent forecasting",
    description: "Predict your sales, analyze sentiment, and generate winning proposals.",
    icon: LineChart,
    color: "bg-cyan-500",
  },
];

export function PainPointsSection() {
  return (
    <section id="product" className="py-24 lg:py-32 bg-secondary/50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
            Six AI agents. One revolution.
          </h2>
          <p className="text-lg text-muted-foreground">
            Each agent solves a specific business problem. Together, they transform your operations.
          </p>
        </div>
        
        {/* Tools grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => {
            const IconComponent = tool.icon;
            return (
              <div 
                key={i} 
                className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center mb-5`}>
                  <IconComponent className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
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
            );
          })}
        </div>
      </div>
    </section>
  );
}