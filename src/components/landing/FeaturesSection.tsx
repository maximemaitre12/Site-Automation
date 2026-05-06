import { Workflow, FileSearch, Bot, ArrowRight, Sparkles, Layers, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    id: "flow",
    icon: Workflow,
    title: "Aether Flow",
    subtitle: "Advanced AI orchestration",
    description: "Build intelligent workflows in a few clicks with the visual drag & drop builder and AI-powered generation.",
    highlights: [
      "Intuitive visual drag & drop builder",
      "AI-powered workflow generation",
      "Connectors: Email, Slack, CRM, ERP",
      "Scalable and multi-tenant",
    ],
    path: "/tools/flow",
  },
  {
    id: "doc",
    icon: FileSearch,
    title: "Aether Doc",
    subtitle: "Document intelligence",
    description: "Transform your documents into actionable data with automatic extraction and intelligent classification.",
    highlights: [
      "Automated data extraction",
      "PDF, email, image reading",
      "AI-powered smart summaries",
      "Automatic sorting and indexing",
    ],
    path: "/tools/brain",
  },
  {
    id: "agents",
    icon: Bot,
    title: "Aether Agents",
    subtitle: "Autonomous AI agents",
    description: "Deploy AI agents that execute complex tasks 24/7 with intelligent supervision.",
    highlights: [
      "Enterprise agent creation",
      "Continuous 24/7 execution",
      "Supervised self-learning",
      "Full observability and logs",
    ],
    path: "/tools/flow",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-background" />
      
      <div className="relative z-10 container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our solutions</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            What <span className="text-gradient">AETHER</span> does
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Three pillars for complete automation of your business operations
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {/* Top accent bar */}
              <div className="h-1 bg-primary" />
              
              <div className="relative z-10 p-8">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm font-medium text-primary mb-4">
                  {feature.subtitle}
                </p>
                
                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Highlights */}
                <ul className="space-y-3 mb-8">
                  {feature.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-foreground/80">{highlight}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Link */}
                <Link 
                  to={feature.path}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link"
                >
                  Discover
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
