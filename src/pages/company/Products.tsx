import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { 
  Workflow, FileText, TrendingUp, Users, MessageSquare, Brain, Shield, Database,
  ArrowRight, CheckCircle, Zap, Sparkles, Globe, Lock
} from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    id: "flow",
    name: "AETHER Flow",
    tagline: "Visual Workflow Automation",
    description: "Build powerful automations without code. Drag, drop, and connect AI-powered blocks to create workflows that run 24/7.",
    icon: Workflow,
    color: "from-blue-500 to-cyan-400",
    features: [
      "Visual drag-and-drop builder",
      "100+ pre-built integrations",
      "AI-powered decision making",
      "Real-time execution monitoring"
    ],
    stats: { metric: "10x", label: "faster automation" }
  },
  {
    id: "doc",
    name: "AETHER Doc",
    tagline: "Intelligent Document Processing",
    description: "Transform unstructured documents into actionable data. AI extracts, classifies, and processes documents automatically.",
    icon: FileText,
    color: "from-violet-500 to-purple-400",
    features: [
      "OCR & text extraction",
      "AI document classification",
      "Automatic data extraction",
      "Version control & collaboration"
    ],
    stats: { metric: "95%", label: "accuracy rate" }
  },
  {
    id: "sales",
    name: "AETHER Sales",
    tagline: "AI-Powered Sales Intelligence",
    description: "Qualify leads, analyze calls, and close deals faster with AI that understands your sales process.",
    icon: TrendingUp,
    color: "from-emerald-500 to-green-400",
    features: [
      "Lead scoring & qualification",
      "Call transcription & analysis",
      "Pipeline intelligence",
      "Negotiation assistance"
    ],
    stats: { metric: "40%", label: "more conversions" }
  },
  {
    id: "hr",
    name: "AETHER HR",
    tagline: "Smart Recruitment & HR",
    description: "Screen candidates, schedule interviews, and manage employees with AI-assisted HR workflows.",
    icon: Users,
    color: "from-orange-500 to-amber-400",
    features: [
      "CV parsing & matching",
      "Interview scheduling",
      "Employee management",
      "Performance analytics"
    ],
    stats: { metric: "60%", label: "time saved" }
  },
  {
    id: "support",
    name: "AETHER Support",
    tagline: "Intelligent Customer Support",
    description: "Resolve tickets faster with AI that classifies, routes, and suggests responses automatically.",
    icon: MessageSquare,
    color: "from-pink-500 to-rose-400",
    features: [
      "Ticket classification",
      "Smart routing",
      "Response suggestions",
      "Sentiment analysis"
    ],
    stats: { metric: "3x", label: "faster resolution" }
  },
  {
    id: "brain",
    name: "AETHER Brain",
    tagline: "Enterprise AI Assistant",
    description: "A conversational AI that knows your business. Ask questions, generate content, and get insights instantly.",
    icon: Brain,
    color: "from-indigo-500 to-blue-400",
    features: [
      "Natural language queries",
      "Document Q&A",
      "Content generation",
      "Knowledge base search"
    ],
    stats: { metric: "24/7", label: "availability" }
  },
  {
    id: "compliance",
    name: "AETHER Compliance",
    tagline: "Automated Compliance Auditing",
    description: "Stay compliant with AI that monitors policies, detects risks, and generates audit reports automatically.",
    icon: Shield,
    color: "from-red-500 to-orange-400",
    features: [
      "GDPR compliance checks",
      "Policy monitoring",
      "Risk detection",
      "Automated reports"
    ],
    stats: { metric: "99%", label: "compliance rate" }
  },
  {
    id: "data",
    name: "AETHER Data",
    tagline: "AI-Powered Data Platform",
    description: "Connect, clean, and analyze your data with AI. Detect anomalies, forecast trends, and get actionable insights.",
    icon: Database,
    color: "from-teal-500 to-cyan-400",
    features: [
      "Data integration",
      "Quality monitoring",
      "Anomaly detection",
      "Predictive analytics"
    ],
    stats: { metric: "5x", label: "faster insights" }
  }
];

const globalFeatures = [
  { icon: Zap, title: "Real-time Processing", description: "All modules process data in real-time for instant results" },
  { icon: Lock, title: "Enterprise Security", description: "SOC 2, GDPR, and ISO 27001 compliant infrastructure" },
  { icon: Globe, title: "Global Scale", description: "Distributed infrastructure for worldwide performance" },
  { icon: Sparkles, title: "AI-Native", description: "Built from the ground up with AI at its core" }
];

export default function Products() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">8 Powerful AI Modules</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              One Platform.{" "}
              <span className="bg-gradient-to-r from-primary via-violet-500 to-accent bg-clip-text text-transparent">
                Infinite Possibilities.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              AETHER combines 8 AI-powered modules to automate every aspect of your enterprise. 
              From workflows to compliance, we've got you covered.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/demo" className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
                Request Demo
              </Link>
              <Link to="/resources/documentation" className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors">
                View Documentation
              </Link>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {products.map((product, index) => (
                <div 
                  key={product.id}
                  className="group relative p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-2xl overflow-hidden"
                >
                  {/* Background gradient */}
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${product.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <product.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-foreground mb-2">{product.name}</h3>
                  <p className="text-primary font-medium text-sm mb-4">{product.tagline}</p>
                  <p className="text-muted-foreground mb-6">{product.description}</p>
                  
                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div>
                      <span className={`text-2xl font-bold bg-gradient-to-r ${product.color} bg-clip-text text-transparent`}>
                        {product.stats.metric}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">{product.stats.label}</span>
                    </div>
                    <Link 
                      to={`/tools/${product.id}`}
                      className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                    >
                      Learn more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Features */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
              Built for Enterprise
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Every AETHER module is designed with enterprise needs in mind.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {globalFeatures.map((feature) => (
                <div key={feature.title} className="p-6 rounded-xl border border-border bg-card text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Works With Your Stack
            </h2>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
              AETHER integrates with 100+ enterprise tools and platforms. Connect your existing stack in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {["Salesforce", "HubSpot", "Slack", "Microsoft 365", "Google Workspace", "SAP", "Oracle", "Zendesk"].map((tool) => (
                <span key={tool} className="px-4 py-2 rounded-full bg-muted border border-border text-sm text-foreground">
                  {tool}
                </span>
              ))}
            </div>
            <Link to="/resources/api" className="text-primary font-medium hover:underline">
              View all integrations →
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-violet-500/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join hundreds of enterprises already using AETHER to automate their operations.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/demo" className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
                Get Started Free
              </Link>
              <Link to="/contact" className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-colors">
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}