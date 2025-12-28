import { useState, useRef, type CSSProperties } from "react";
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
    icon: Workflow,
    colorClass: "text-agent-flow",
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
      { value: "90%", label: "Time Saved" },
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
    icon: Database,
    colorClass: "text-agent-brain",
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
      { value: "High", label: "Response Accuracy" },
      { value: "Fast", label: "Response Time" },
      { value: "PDF, Word, Excel...", label: "Supported Formats" },
    ],
    useCases: [
      "Instant document search",
      "Automated FAQ responses",
      "Internal knowledge base",
      "Contextual report generation",
    ],
  },
  {
    name: "Support",
    tagline: "Empathic Agent",
    description: "AI that handles tickets, detects urgency, and resolves issues before they escalate.",
    icon: MessageSquare,
    colorClass: "text-agent-support",
    features: [
      { icon: Mail, title: "Omnichannel", description: "Unified management of emails, chat, phone, social media in one interface." },
      { icon: AlertTriangle, title: "Urgency Detection", description: "AI automatically prioritizes tickets based on sentiment and business impact." },
      { icon: Bot, title: "Smart Auto-Response", description: "Contextual automatic responses based on ticket history and knowledge base." },
      { icon: TrendingUp, title: "Predictive Analytics", description: "Anticipate support peaks and recurring issues before they occur." },
    ],
    workflow: [
      { label: "Ticket Received", icon: Mail },
      { label: "AI Classification", icon: Brain },
      { label: "Auto-Response", icon: MessageSquare },
      { label: "Resolution", icon: CheckCircle2 },
    ],
    stats: [
      { value: "70%", label: "Auto-Resolved" },
      { value: "-40%", label: "Response Time" },
      { value: "4.8/5", label: "Satisfaction" },
    ],
    useCases: [
      "24/7 customer support",
      "Technical ticket triage",
      "SLA monitoring",
      "Trend analysis",
    ],
  },
  {
    name: "HR",
    tagline: "Talent Agent",
    description: "From sourcing to onboarding, AI transforms your recruitment process.",
    icon: Users,
    colorClass: "text-agent-hr",
    features: [
      { icon: FileSpreadsheet, title: "CV Parsing", description: "Automatic extraction of skills, experience, qualifications with 98% accuracy." },
      { icon: Target, title: "Intelligent Matching", description: "AI scores candidates based on culture fit, skills, and team dynamics." },
      { icon: Calendar, title: "Interview Scheduling", description: "Automatic scheduling with calendar sync and intelligent reminders." },
      { icon: Mic, title: "Interview Analysis", description: "Transcription and analysis of interviews for objective evaluation." },
    ],
    workflow: [
      { label: "CV Received", icon: FileText },
      { label: "AI Parsing", icon: Brain },
      { label: "Matching", icon: Target },
      { label: "Schedule", icon: Calendar },
    ],
    stats: [
      { value: "3x", label: "Faster Hiring" },
      { value: "85%", label: "Match Accuracy" },
      { value: "-60%", label: "Admin Time" },
    ],
    useCases: [
      "Volume recruitment",
      "Executive search",
      "Internal mobility",
      "Skill mapping",
    ],
  },
  {
    name: "Compliance",
    tagline: "Regulatory Vigilance",
    description: "Stay compliant 24/7 with AI that monitors, alerts, and documents.",
    icon: ShieldCheck,
    colorClass: "text-agent-compliance",
    features: [
      { icon: Shield, title: "Risk Monitoring", description: "Continuous scanning of internal processes for anomalies and non-compliance." },
      { icon: FileCheck, title: "Auto Documentation", description: "Automatic generation of audit and compliance reports." },
      { icon: AlertTriangle, title: "Proactive Alerts", description: "Instant notifications for detected risks with remediation recommendations." },
      { icon: Database, title: "Audit Trail", description: "Complete and immutable traceability of all compliance actions." },
    ],
    workflow: [
      { label: "Scan", icon: ScanSearch },
      { label: "Detection", icon: AlertTriangle },
      { label: "Alert", icon: Mail },
      { label: "Report", icon: FileCheck },
    ],
    stats: [
      { value: "99.9%", label: "Detection Rate" },
      { value: "24/7", label: "Monitoring" },
      { value: "100%", label: "Traceability" },
    ],
    useCases: [
      "GDPR compliance",
      "Internal audits",
      "Risk prevention",
      "Regulatory reporting",
    ],
  },
  {
    name: "Sales",
    tagline: "Revenue Intelligence",
    description: "AI that qualifies, prioritizes, and accelerates every sales opportunity.",
    icon: BarChart3,
    colorClass: "text-agent-sales",
    features: [
      { icon: Star, title: "Lead Scoring", description: "AI scoring of prospects based on behavior, profile, and conversion likelihood." },
      { icon: Phone, title: "Call Analysis", description: "Automatic transcription and analysis of calls with improvement suggestions." },
      { icon: Building2, title: "Company Enrichment", description: "Automatic enrichment with financial data, news, and key contacts." },
      { icon: Handshake, title: "Negotiation Sheets", description: "AI-generated negotiation guides with personalized strategies." },
    ],
    workflow: [
      { label: "Lead", icon: Target },
      { label: "Scoring", icon: Star },
      { label: "Enrichment", icon: Database },
      { label: "Close", icon: Handshake },
    ],
    stats: [
      { value: "+45%", label: "Conversion Rate" },
      { value: "2x", label: "Pipeline Velocity" },
      { value: "+30%", label: "Deal Size" },
    ],
    useCases: [
      "Lead qualification",
      "Sales coaching",
      "Pipeline forecasting",
      "Business development",
    ],
  },
];

// Inline expanded content component
function ExpandedContent({ tool }: { tool: Tool }) {
  return (
    <div className="pt-6 border-t border-border/50 animate-cloud-fade-in">
      {/* Agent-specific animated demos */}
      <div className="mb-4">
        {tool.name === "Flow" && <AgentFlowDemo />}
        {tool.name === "Brain" && <AgentBrainDemo />}
        {tool.name === "Support" && <AgentSupportDemo />}
        {tool.name === "HR" && <AgentHRDemo />}
        {tool.name === "Compliance" && <AgentComplianceDemo />}
        {tool.name === "Sales" && <AgentSalesDemo />}
      </div>

      {/* Compact use cases */}
      <div className="flex flex-wrap gap-2">
        {tool.useCases.map((useCase, j) => (
          <span 
            key={j} 
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50 border border-border/50 text-xs text-foreground"
          >
            <CheckCircle2 className={cn("w-3 h-3 shrink-0", tool.colorClass)} />
            {useCase}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PainPointsSection() {
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const shouldStagger = isVisible && expandedIndices.size === 0;
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleToggle = (index: number) => {
    setExpandedIndices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <section id="product" className="py-12 sm:py-16 lg:py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2 sm:mb-3">
            Six AI Agents. One Revolution.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            Each agent solves a specific business problem. Together, they transform your operations.
          </p>
        </div>
        
        {/* Tools grid - single column for proper accordion behavior */}
        <div 
          ref={ref}
          className={cn(
            "flex flex-col gap-3 sm:gap-4 stagger-children",
            isVisible && "visible"
          )}
        >
          {tools.map((tool, i) => {
            const IconComponent = tool.icon;
            const isExpanded = expandedIndices.has(i);

            return (
              <div
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={cn(
                  "group relative rounded-2xl border transition-all duration-500 overflow-hidden",
                  "backdrop-blur-sm",
                  isExpanded
                    ? "border-primary/30 shadow-xl"
                    : "border-border/50 hover:border-primary/20 hover:shadow-lg"
                )}
                style={
                  shouldStagger ? { transitionDelay: `${i * 100}ms` } as CSSProperties : undefined
                }
              >
                {/* Glass background with agent color tint - more intense */}
                <div
                  className={cn(
                    "absolute inset-0 -z-10",
                    tool.colorClass === "text-agent-flow" && "bg-gradient-to-br from-[hsl(220_70%_92%)] via-[hsl(220_50%_96%)] to-[hsl(220_70%_94%)]",
                    tool.colorClass === "text-agent-brain" && "bg-gradient-to-br from-[hsl(270_60%_92%)] via-[hsl(270_40%_96%)] to-[hsl(270_60%_94%)]",
                    tool.colorClass === "text-agent-support" && "bg-gradient-to-br from-[hsl(160_60%_92%)] via-[hsl(160_40%_96%)] to-[hsl(160_60%_94%)]",
                    tool.colorClass === "text-agent-hr" && "bg-gradient-to-br from-[hsl(340_60%_92%)] via-[hsl(340_40%_96%)] to-[hsl(340_60%_94%)]",
                    tool.colorClass === "text-agent-compliance" && "bg-gradient-to-br from-[hsl(25_70%_92%)] via-[hsl(25_50%_96%)] to-[hsl(25_70%_94%)]",
                    tool.colorClass === "text-agent-sales" && "bg-gradient-to-br from-[hsl(190_70%_92%)] via-[hsl(190_50%_96%)] to-[hsl(190_70%_94%)]",
                  )}
                />
                {/* Shimmer glass reflection - always visible */}
                <div
                  className="absolute inset-0 pointer-events-none bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.5)_35%,rgba(255,255,255,0.8)_50%,rgba(255,255,255,0.5)_65%,transparent_75%)] bg-[length:250%_100%] animate-[shimmer_3s_ease-in-out_infinite]"
                />

                {/* Header - clickable */}
                <div 
                  className="p-4 sm:p-5 cursor-pointer"
                  onClick={() => handleToggle(i)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 bg-secondary/80",
                        tool.colorClass
                      )}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <div className={cn("text-xs font-semibold uppercase tracking-wider mb-0.5", tool.colorClass)}>
                          {tool.tagline}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-foreground">AETHER {tool.name}</h3>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full bg-secondary flex items-center justify-center transition-all duration-300",
                        isExpanded && "rotate-180 bg-primary/10"
                      )}
                    >
                      <ChevronDown
                        className={cn(
                          "w-4 h-4",
                          isExpanded ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mt-3">{tool.description}</p>

                  {/* Quick stats preview when collapsed */}
                  {!isExpanded && (
                    <div className="flex gap-4 mt-3 pt-3 border-t border-border/50">
                      {tool.stats.slice(0, 3).map((stat, j) => (
                        <div key={j} className="text-center">
                          <div className={cn("text-base font-bold", tool.colorClass)}>{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expanded content - inline accordion style */}
                {isExpanded && (
                  <div className="px-6 pb-6">
                    <ExpandedContent tool={tool} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
