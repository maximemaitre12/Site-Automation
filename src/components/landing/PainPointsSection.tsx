import { useRef, useState, type CSSProperties } from "react";
import { 
  Zap, Brain, Sparkles, ScanSearch, ShieldCheck, LineChart,
  ChevronDown, Workflow, MessageSquare, FileText, Target, Users,
  BarChart3, Mail, Calendar, Shield, AlertTriangle, TrendingUp,
  Phone, FileCheck, Database, ArrowRight, CheckCircle2, Clock,
  Bot, Search, PieChart, FileSpreadsheet, Upload, GitBranch,
  Mic, Star, Building2, Scale, Handshake
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { AgentFlowDemo } from "./AgentFlowDemo";
import { AgentBrainDemo } from "./AgentBrainDemo";
import { AgentSupportDemo } from "./AgentSupportDemo";
import { AgentHRDemo } from "./AgentHRDemo";
import { AgentComplianceDemo } from "./AgentComplianceDemo";
import { AgentSalesDemo } from "./AgentSalesDemo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface WorkflowStep {
  label: string;
  icon: LucideIcon;
}

interface Tool {
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  color: string;
  colorClass: string;
  features: Feature[];
  workflow: WorkflowStep[];
  stats: { value: string; label: string }[];
  useCases: string[];
}

const tools: Tool[] = [
  {
    name: "Flow",
    tagline: "Predictive Automation",
    description: "AI anticipates your needs and triggers workflows before you even think about them.",
    icon: Zap,
    color: "bg-blue-500",
    colorClass: "text-blue-500",
    features: [
      { icon: Workflow, title: "No-Code Visual Builder", description: "Create complex workflows with drag & drop. Conditions, loops, branches — no code required." },
      { icon: GitBranch, title: "Smart Triggers", description: "Auto-detect events: new lead, email received, threshold reached, schedule, external webhook." },
      { icon: Mail, title: "Multi-Channel Actions", description: "Send emails, SMS, Slack notifications, API calls, CRM updates, document generation." },
      { icon: Bot, title: "AI in the Workflow", description: "Integrate AI analysis: classification, extraction, content generation at every step." },
    ],
    workflow: [
      { label: "Trigger", icon: Zap },
      { label: "Condition", icon: GitBranch },
      { label: "AI Action", icon: Brain },
      { label: "Notification", icon: Mail },
    ],
    stats: [
      { value: "80%", label: "Time Saved" },
      { value: "0", label: "Code Required" },
      { value: "∞", label: "Possible Workflows" },
    ],
    useCases: [
      "Automated client onboarding",
      "Smart lead follow-ups",
      "Stock threshold alerts",
      "Auto-generated weekly reports",
    ],
  },
  {
    name: "Brain",
    tagline: "Contextual Intelligence",
    description: "An AI that understands your company context and responds with precision.",
    icon: Brain,
    color: "bg-violet-500",
    colorClass: "text-violet-500",
    features: [
      { icon: MessageSquare, title: "Conversational Chat", description: "Ask questions in natural language. AI understands context and provides precise answers." },
      { icon: Upload, title: "Document Import", description: "Upload PDF, Word, Excel. AI analyzes, indexes, and makes content instantly searchable." },
      { icon: Search, title: "Semantic Search", description: "Find relevant information even with different terms. Understands meaning, not just words." },
      { icon: FileText, title: "Content Generation", description: "Create emails, reports, summaries based on your data and company context." },
    ],
    workflow: [
      { label: "Upload", icon: Upload },
      { label: "AI Analysis", icon: Brain },
      { label: "Indexing", icon: Database },
      { label: "Query", icon: Search },
    ],
    stats: [
      { value: "95%", label: "Response Accuracy" },
      { value: "<2s", label: "Response Time" },
      { value: "100+", label: "Supported Formats" },
    ],
    useCases: [
      "Internal legal assistant",
      "Product knowledge base",
      "Smart employee FAQ",
      "Contract analysis",
    ],
  },
  {
    name: "Support",
    tagline: "Conversational AI",
    description: "Autonomous ticket resolution with continuous learning. Significant time reduction.",
    icon: Sparkles,
    color: "bg-emerald-500",
    colorClass: "text-emerald-500",
    features: [
      { icon: Bot, title: "24/7 Auto-Responses", description: "AI resolves 70% of requests without human intervention. Available nights and weekends." },
      { icon: Target, title: "Smart Routing", description: "Content and urgency analysis to direct to the right agent with full context." },
      { icon: Clock, title: "Predictive SLA", description: "Response time anticipation, pre-breach alerts, automatic prioritization." },
      { icon: BarChart3, title: "Real-Time Analytics", description: "Customer satisfaction, resolution time, recurring topics, agent performance." },
    ],
    workflow: [
      { label: "Ticket In", icon: Mail },
      { label: "AI Classification", icon: Brain },
      { label: "Auto Response", icon: Bot },
      { label: "Escalate if Needed", icon: Users },
    ],
    stats: [
      { value: "70%", label: "Auto Resolution" },
      { value: "-60%", label: "Response Time" },
      { value: "4.8/5", label: "Satisfaction" },
    ],
    useCases: [
      "E-commerce customer support",
      "Internal IT help desk",
      "Technical product support",
      "Complaint management",
    ],
  },
  {
    name: "HR",
    tagline: "Predictive Matching",
    description: "AI predicts candidate-position compatibility and accelerates your hiring process.",
    icon: ScanSearch,
    color: "bg-orange-500",
    colorClass: "text-orange-500",
    features: [
      { icon: FileSpreadsheet, title: "Smart CV Parsing", description: "Automatic extraction: skills, experiences, education, languages. Profile standardization." },
      { icon: Target, title: "Match Score", description: "AI algorithm comparing profile and job requirements. Explained compatibility score." },
      { icon: Mic, title: "Interview Analysis", description: "Transcription, speech analysis, soft skills detection, objective post-interview report." },
      { icon: Calendar, title: "Smart Scheduling", description: "Slot suggestions, automatic follow-ups, calendar sync, reminders." },
    ],
    workflow: [
      { label: "CV Received", icon: FileText },
      { label: "AI Parsing", icon: Brain },
      { label: "Matching", icon: Target },
      { label: "Interview", icon: Mic },
    ],
    stats: [
      { value: "-75%", label: "Screening Time" },
      { value: "92%", label: "Match Accuracy" },
      { value: "2x", label: "More Hires" },
    ],
    useCases: [
      "Volume recruiting",
      "Tech profile hunting",
      "Internal mobility",
      "Talent management",
    ],
  },
  {
    name: "Compliance",
    tagline: "Proactive Detection",
    description: "Anticipate risks before they occur. Automated GDPR compliance.",
    icon: ShieldCheck,
    color: "bg-rose-500",
    colorClass: "text-rose-500",
    features: [
      { icon: Search, title: "Automatic Scan", description: "Continuous analysis of your documents, emails, databases. Sensitive data detection." },
      { icon: AlertTriangle, title: "Real-Time Alerts", description: "Immediate notification on detected risk: exposed data, non-compliant clause, approaching deadline." },
      { icon: FileCheck, title: "Compliance Reports", description: "Automatic generation of GDPR reports, audits, processing registers, compliance evidence." },
      { icon: Scale, title: "Regulatory Watch", description: "Legal evolution tracking, process impact, compliance recommendations." },
    ],
    workflow: [
      { label: "Data Scan", icon: Search },
      { label: "Risk Detection", icon: AlertTriangle },
      { label: "Alert", icon: Mail },
      { label: "Report", icon: FileCheck },
    ],
    stats: [
      { value: "99%", label: "Risks Detected" },
      { value: "-90%", label: "Audit Time" },
      { value: "$0", label: "GDPR Fines" },
    ],
    useCases: [
      "GDPR Compliance",
      "Contract audit",
      "Health data protection",
      "M&A Due diligence",
    ],
  },
  {
    name: "Sales",
    tagline: "Intelligent Forecasting",
    description: "Forecast revenue, analyze sentiment, and generate winning proposals.",
    icon: LineChart,
    color: "bg-cyan-500",
    colorClass: "text-cyan-500",
    features: [
      { icon: TrendingUp, title: "AI Forecasting", description: "30/60/90 day revenue prediction. Deal analysis, closing probabilities, at-risk deal alerts." },
      { icon: Phone, title: "Call Analysis", description: "Transcription, sentiment analysis, objection detection, key points, personalized coaching." },
      { icon: FileText, title: "Auto-Generated Proposals", description: "Create personalized quotes and proposals based on client context." },
      { icon: Handshake, title: "Negotiation Sheets", description: "Complete brief before meetings: history, stakes, competition, key arguments, floor price." },
    ],
    workflow: [
      { label: "Client Call", icon: Phone },
      { label: "Transcription", icon: FileText },
      { label: "AI Analysis", icon: Brain },
      { label: "Actions", icon: CheckCircle2 },
    ],
    stats: [
      { value: "+35%", label: "Conversion Rate" },
      { value: "95%", label: "Forecast Accuracy" },
      { value: "-50%", label: "Proposal Time" },
    ],
    useCases: [
      "B2B sales team",
      "Inside sales",
      "Account management",
      "Business development",
    ],
  },
];

export function PainPointsSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const shouldStagger = isVisible && expandedIndex === null;
  const expandedPanelRef = useRef<HTMLDivElement | null>(null);

  const expandedTool = expandedIndex !== null ? tools[expandedIndex] : null;

  const handleToggle = (index: number) => {
    const next = expandedIndex === index ? null : index;
    setExpandedIndex(next);

    if (next !== null) {
      requestAnimationFrame(() => {
        expandedPanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  };


  return (
    <section id="product" className="py-16 sm:py-24 lg:py-32 bg-secondary/50" style={{ overflowAnchor: "none" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3 sm:mb-4">
            Six AI Agents. One Revolution.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground px-2">
            Each agent solves a specific business problem. Together, they transform your operations.
          </p>
        </div>
        
        {/* Tools grid */}
        <div 
          ref={ref}
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 stagger-children",
            isVisible && "visible"
          )}
        >
          {tools.map((tool, i) => {
            const IconComponent = tool.icon;
            const isExpanded = expandedIndex === i;

            return (
              <div
                key={i}
                className={cn(
                  "group rounded-2xl bg-background border transition-all duration-500 cursor-pointer overflow-hidden scroll-mt-24",
                  isExpanded
                    ? "border-primary shadow-xl shadow-primary/10"
                    : "border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                )}
                style={
                  ({
                    overflowAnchor: "none",
                    ...(shouldStagger ? { transitionDelay: `${i * 100}ms` } : {}),
                  } as CSSProperties)
                }
                onClick={() => handleToggle(i)}
              >
                {/* Header - always visible */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl ${tool.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="w-7 h-7 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className={cn("text-xs font-semibold uppercase tracking-wider mb-1", tool.colorClass)}>
                          {tool.tagline}
                        </div>
                        <h3 className="text-xl font-bold text-foreground">AETHER {tool.name}</h3>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-all duration-300",
                        isExpanded && "rotate-180 bg-primary/10"
                      )}
                    >
                      <ChevronDown
                        className={cn(
                          "w-5 h-5",
                          isExpanded ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mt-4">{tool.description}</p>

                  {/* Quick stats preview when collapsed */}
                  {!isExpanded && (
                    <div className="flex gap-6 mt-4 pt-4 border-t border-border/50">
                      {tool.stats.slice(0, 3).map((stat, j) => (
                        <div key={j} className="text-center">
                          <div className={cn("text-lg font-bold", tool.colorClass)}>{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {expandedTool && (
          <div
            ref={expandedPanelRef}
            className="mt-6 lg:mt-8 scroll-mt-24"
            style={{ overflowAnchor: "none" }}
          >
            <div
              className={cn(
                "rounded-2xl bg-background border border-primary/20 shadow-xl shadow-primary/10 overflow-hidden",
                "animate-enter"
              )}
            >
              <div className="p-6">
                {/* Agent-specific animated demos */}
                <div className="mb-8">
                  {expandedTool.name === "Flow" && <AgentFlowDemo />}
                  {expandedTool.name === "Brain" && <AgentBrainDemo />}
                  {expandedTool.name === "Support" && <AgentSupportDemo />}
                  {expandedTool.name === "HR" && <AgentHRDemo />}
                  {expandedTool.name === "Compliance" && <AgentComplianceDemo />}
                  {expandedTool.name === "Sales" && <AgentSalesDemo />}
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {expandedTool.features.map((feature, j) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div
                        key={j}
                        className="p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                              expandedTool.color + "/20"
                            )}
                          >
                            <FeatureIcon
                              className={cn("w-5 h-5", expandedTool.colorClass)}
                              strokeWidth={1.5}
                            />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-foreground mb-1">
                              {feature.title}
                            </div>
                            <div className="text-xs text-muted-foreground leading-relaxed">
                              {feature.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Stats and use cases */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stats */}
                  <div className="bg-gradient-to-br from-secondary/80 to-secondary/40 rounded-xl p-5">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Measured Results
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {expandedTool.stats.map((stat, j) => (
                        <div key={j} className="text-center">
                          <div className={cn("text-2xl font-bold", expandedTool.colorClass)}>
                            {stat.value}
                          </div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Use cases */}
                  <div className="bg-gradient-to-br from-secondary/80 to-secondary/40 rounded-xl p-5">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Use Cases
                    </div>
                    <ul className="space-y-2">
                      {expandedTool.useCases.map((useCase, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle2
                            className={cn("w-4 h-4 shrink-0", expandedTool.colorClass)}
                          />
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 text-center">
                  <Link to="/signup">
                    <Button className={cn("shadow-lg", expandedTool.color, "hover:opacity-90")}>
                      Create Your Agent
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </section>
  );
}
