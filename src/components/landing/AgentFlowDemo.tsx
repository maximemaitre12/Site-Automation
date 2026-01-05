import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  ArrowRight, Check, Zap, Brain, Mail, GitBranch, 
  Play, CheckCircle2, FileText, Database, Bell,
  Clock, Filter, Webhook, MessageSquare, Phone,
  Upload, Download, Search, Edit, Settings, Users,
  Globe, Shield, Sparkles, Truck, Package, MapPin,
  QrCode, Barcode, Warehouse, ClipboardList, Container,
  Route, Timer, AlertTriangle, ThermometerSun, Scale,
  Printer, Scan, Radio, Wifi, Cloud, Server, HardDrive,
  Cpu, Lock, Key, Send, RotateCw, Repeat, Shuffle, Split,
  Merge, GitMerge, Code, Terminal, FileJson, FileSpreadsheet,
  FilePlus, Archive, BookOpen, Tags, TrendingUp, Activity,
  Target, Layers, ListOrdered, CheckSquare, Headphones,
  LayoutGrid, Table2, CreditCard, ShoppingCart, Store,
  Receipt, Boxes, Eye, Heart, RefreshCw,
  LucideIcon, GripVertical, MousePointer2
} from "lucide-react";

interface Tool {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface Category {
  name: string;
  icon: LucideIcon;
  color: string;
  tools: Tool[];
}

const toolCategories: Category[] = [
  {
    name: "Triggers",
    icon: Zap,
    color: "bg-amber-500",
    tools: [
      { id: "webhook", label: "Webhook", icon: Webhook },
      { id: "schedule", label: "Cron Schedule", icon: Clock },
      { id: "email_in", label: "Email Received", icon: Mail },
      { id: "db_change", label: "DB Trigger", icon: Database },
      { id: "file_upload", label: "File Upload", icon: Upload },
      { id: "api_call", label: "REST API", icon: Globe },
      { id: "mqtt", label: "MQTT Event", icon: Radio },
      { id: "iot_sensor", label: "IoT Sensor", icon: Wifi },
      { id: "barcode_scan", label: "Barcode Scan", icon: Barcode },
      { id: "qr_scan", label: "QR Scan", icon: QrCode },
      { id: "gps_geofence", label: "Geofence", icon: MapPin },
      { id: "threshold", label: "Threshold", icon: AlertTriangle },
      { id: "temperature", label: "Temp Alert", icon: ThermometerSun },
      { id: "graphql", label: "GraphQL", icon: Code },
      { id: "kafka", label: "Kafka", icon: Server },
      { id: "rabbitmq", label: "RabbitMQ", icon: MessageSquare },
    ]
  },
  {
    name: "Logic",
    icon: GitBranch,
    color: "bg-blue-500",
    tools: [
      { id: "condition", label: "IF Condition", icon: GitBranch },
      { id: "filter", label: "Filter Array", icon: Filter },
      { id: "loop", label: "For Each", icon: Repeat },
      { id: "delay", label: "Delay", icon: Timer },
      { id: "switch", label: "Switch", icon: Split },
      { id: "merge", label: "Merge", icon: Merge },
      { id: "parallel", label: "Parallel", icon: GitMerge },
      { id: "retry", label: "Retry", icon: RotateCw },
      { id: "error_handler", label: "Try/Catch", icon: Shield },
      { id: "transform", label: "Transform", icon: Shuffle },
      { id: "aggregate", label: "Aggregate", icon: Layers },
      { id: "regex", label: "Regex", icon: Code },
      { id: "script", label: "JS Script", icon: Terminal },
      { id: "python", label: "Python", icon: Code },
    ]
  },
  {
    name: "AI",
    icon: Brain,
    color: "bg-purple-500",
    tools: [
      { id: "ai_analyze", label: "AI Analyze", icon: Brain },
      { id: "ai_generate", label: "AI Generate", icon: Sparkles },
      { id: "ai_classify", label: "Classify", icon: Tags },
      { id: "ai_extract", label: "Extract", icon: Search },
      { id: "ai_summarize", label: "Summarize", icon: FileText },
      { id: "ai_translate", label: "Translate", icon: Globe },
      { id: "ai_sentiment", label: "Sentiment", icon: Heart },
      { id: "ai_ocr", label: "OCR", icon: Scan },
      { id: "ai_vision", label: "Vision", icon: Eye },
      { id: "ai_predict", label: "Predict", icon: TrendingUp },
      { id: "ai_anomaly", label: "Anomaly", icon: Activity },
      { id: "ai_embedding", label: "Embed", icon: Cpu },
      { id: "ai_rag", label: "RAG", icon: Database },
      { id: "llm_prompt", label: "LLM", icon: MessageSquare },
    ]
  },
  {
    name: "Ops",
    icon: Truck,
    color: "bg-teal-500",
    tools: [
      { id: "create_shipment", label: "Shipment", icon: Truck },
      { id: "update_inventory", label: "Stock", icon: Package },
      { id: "warehouse", label: "WMS", icon: Warehouse },
      { id: "route", label: "Route", icon: Route },
      { id: "order", label: "Order", icon: ClipboardList },
      { id: "track", label: "Track", icon: MapPin },
      { id: "container", label: "Container", icon: Container },
      { id: "weight", label: "Weight", icon: Scale },
      { id: "label", label: "Label", icon: Printer },
      { id: "batch", label: "Batch", icon: Boxes },
      { id: "eta", label: "ETA", icon: Clock },
      { id: "customs", label: "Customs", icon: FileText },
    ]
  },
  {
    name: "Data",
    icon: Database,
    color: "bg-cyan-500",
    tools: [
      { id: "db_insert", label: "SQL Insert", icon: Database },
      { id: "db_update", label: "SQL Update", icon: Edit },
      { id: "db_query", label: "SQL Query", icon: Search },
      { id: "csv", label: "CSV", icon: FileSpreadsheet },
      { id: "json", label: "JSON", icon: FileJson },
      { id: "api_get", label: "HTTP GET", icon: Download },
      { id: "api_post", label: "HTTP POST", icon: Upload },
      { id: "graphql", label: "GraphQL", icon: Code },
      { id: "redis", label: "Redis", icon: HardDrive },
      { id: "queue", label: "Queue", icon: ListOrdered },
      { id: "s3", label: "S3", icon: Cloud },
      { id: "elastic", label: "Elastic", icon: Search },
    ]
  },
  {
    name: "DevOps",
    icon: Terminal,
    color: "bg-slate-500",
    tools: [
      { id: "docker", label: "Docker", icon: Container },
      { id: "k8s", label: "K8s", icon: Server },
      { id: "ssh", label: "SSH", icon: Terminal },
      { id: "git", label: "Git", icon: GitBranch },
      { id: "ci", label: "CI/CD", icon: Play },
      { id: "lambda", label: "Lambda", icon: Cloud },
      { id: "azure", label: "Azure", icon: Cloud },
      { id: "gcp", label: "GCP", icon: Cloud },
      { id: "terraform", label: "Terraform", icon: Layers },
      { id: "ansible", label: "Ansible", icon: Settings },
      { id: "vault", label: "Vault", icon: Key },
      { id: "prom", label: "Prometheus", icon: Activity },
    ]
  },
  {
    name: "Notify",
    icon: Bell,
    color: "bg-orange-500",
    tools: [
      { id: "email", label: "Email", icon: Mail },
      { id: "push", label: "Push", icon: Bell },
      { id: "sms", label: "SMS", icon: Phone },
      { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
      { id: "slack", label: "Slack", icon: MessageSquare },
      { id: "teams", label: "Teams", icon: Users },
      { id: "webhook", label: "Webhook", icon: Send },
      { id: "pagerduty", label: "PagerDuty", icon: AlertTriangle },
    ]
  },
  {
    name: "Apps",
    icon: LayoutGrid,
    color: "bg-indigo-500",
    tools: [
      { id: "salesforce", label: "Salesforce", icon: Cloud },
      { id: "hubspot", label: "HubSpot", icon: Target },
      { id: "sap", label: "SAP", icon: Server },
      { id: "oracle", label: "Oracle", icon: Database },
      { id: "stripe", label: "Stripe", icon: CreditCard },
      { id: "shopify", label: "Shopify", icon: ShoppingCart },
      { id: "magento", label: "Magento", icon: Store },
      { id: "quickbooks", label: "QuickBooks", icon: Receipt },
      { id: "sheets", label: "Sheets", icon: Table2 },
      { id: "airtable", label: "Airtable", icon: LayoutGrid },
      { id: "notion", label: "Notion", icon: BookOpen },
      { id: "jira", label: "Jira", icon: CheckSquare },
      { id: "zendesk", label: "Zendesk", icon: Headphones },
      { id: "mongo", label: "MongoDB", icon: Database },
      { id: "postgres", label: "Postgres", icon: Database },
      { id: "snowflake", label: "Snowflake", icon: Cloud },
    ]
  },
  {
    name: "Security",
    icon: Lock,
    color: "bg-red-500",
    tools: [
      { id: "oauth", label: "OAuth", icon: Lock },
      { id: "jwt", label: "JWT", icon: Key },
      { id: "encrypt", label: "Encrypt", icon: Shield },
      { id: "hash", label: "Hash", icon: Cpu },
      { id: "sign", label: "Sign", icon: Edit },
      { id: "audit", label: "Audit", icon: FileText },
    ]
  },
  {
    name: "Docs",
    icon: FileText,
    color: "bg-rose-500",
    tools: [
      { id: "pdf", label: "PDF", icon: FileText },
      { id: "merge", label: "Merge", icon: Merge },
      { id: "template", label: "Template", icon: FilePlus },
      { id: "docx", label: "DOCX", icon: FileText },
      { id: "excel", label: "Excel", icon: FileSpreadsheet },
      { id: "zip", label: "ZIP", icon: Archive },
      { id: "convert", label: "Convert", icon: RefreshCw },
    ]
  },
];

// Complex workflow: 6 steps across different categories
const workflowSequence = [
  { categoryIndex: 0, toolIndex: 8 },  // Barcode Scan
  { categoryIndex: 4, toolIndex: 2 },  // SQL Query
  { categoryIndex: 1, toolIndex: 0 },  // IF Condition
  { categoryIndex: 2, toolIndex: 9 },  // AI Predict
  { categoryIndex: 3, toolIndex: 1 },  // Update Stock
  { categoryIndex: 6, toolIndex: 0 },  // Email
];

interface AgentFlowDemoProps {
  className?: string;
}

export function AgentFlowDemo({ className }: AgentFlowDemoProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const [activeCategory, setActiveCategory] = useState(0);
  const [toolScroll, setToolScroll] = useState(0);
  const [highlightedTool, setHighlightedTool] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{
    active: boolean;
    tool: Tool | null;
    color: string;
    progress: number;
  }>({ active: false, tool: null, color: '', progress: 0 });
  const [placedBlocks, setPlacedBlocks] = useState<Array<{ tool: Tool; color: string }>>([]);
  const [executionState, setExecutionState] = useState<'building' | 'running' | 'done'>('building');
  const [executionStep, setExecutionStep] = useState(-1);

  useEffect(() => {
    if (!isVisible) {
      setActiveCategory(0);
      setToolScroll(0);
      setHighlightedTool(null);
      setDragState({ active: false, tool: null, color: '', progress: 0 });
      setPlacedBlocks([]);
      setExecutionState('building');
      setExecutionStep(-1);
      return;
    }

    let cancelled = false;
    const timers: NodeJS.Timeout[] = [];

    const runAnimation = () => {
      workflowSequence.forEach((step, i) => {
        const category = toolCategories[step.categoryIndex];
        const tool = category.tools[step.toolIndex];
        const baseDelay = i * 1800;

        // Switch category & scroll
        timers.push(setTimeout(() => {
          if (cancelled) return;
          setActiveCategory(step.categoryIndex);
          // Scroll to show the tool (each tool ~16px height)
          const scrollTo = Math.max(0, (step.toolIndex - 2) * 16);
          setToolScroll(scrollTo);
        }, baseDelay));

        // Highlight tool
        timers.push(setTimeout(() => {
          if (cancelled) return;
          setHighlightedTool(tool.id);
        }, baseDelay + 200));

        // Start drag
        timers.push(setTimeout(() => {
          if (cancelled) return;
          setDragState({ active: true, tool, color: category.color, progress: 0 });
        }, baseDelay + 400));

        // Animate drag (smooth progress)
        for (let p = 1; p <= 8; p++) {
          timers.push(setTimeout(() => {
            if (cancelled) return;
            setDragState(prev => ({ ...prev, progress: p / 8 }));
          }, baseDelay + 400 + p * 60));
        }

        // Drop
        timers.push(setTimeout(() => {
          if (cancelled) return;
          setDragState({ active: false, tool: null, color: '', progress: 0 });
          setHighlightedTool(null);
          setPlacedBlocks(prev => [...prev, { tool, color: category.color }]);
        }, baseDelay + 1100));
      });

      // Execution phase
      const execStart = workflowSequence.length * 1800 + 300;
      timers.push(setTimeout(() => {
        if (cancelled) return;
        setExecutionState('running');
      }, execStart));

      workflowSequence.forEach((_, i) => {
        timers.push(setTimeout(() => {
          if (cancelled) return;
          setExecutionStep(i);
        }, execStart + 150 + i * 280));
      });

      timers.push(setTimeout(() => {
        if (cancelled) return;
        setExecutionState('done');
      }, execStart + 150 + workflowSequence.length * 280 + 300));
    };

    timers.push(setTimeout(runAnimation, 150));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [isVisible]);

  const currentCategory = toolCategories[activeCategory];

  return (
    <div
      ref={ref}
      className={cn(
        "relative p-2 rounded-xl bg-card border border-border overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-1.5 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <GitBranch className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-[8px] font-semibold text-foreground leading-none">Workflow Builder</p>
              <p className="text-[6px] text-muted-foreground">200+ tools • 10 categories</p>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[6px] font-medium",
            executionState === 'done' 
              ? "bg-success/10 text-success" 
              : executionState === 'running'
                ? "bg-amber-500/10 text-amber-600"
                : "bg-muted text-muted-foreground"
          )}>
            {executionState === 'done' ? (
              <><CheckCircle2 className="w-2 h-2" /> Done</>
            ) : executionState === 'running' ? (
              <><Play className="w-2 h-2 animate-pulse" /> Run</>
            ) : (
              <><Settings className="w-2 h-2 animate-spin" /> Build</>
            )}
          </div>
        </div>

        {/* Main Layout - Full Width */}
        <div className="flex gap-1">
          {/* Category Tabs - Compact vertical */}
          <div className="w-[44px] shrink-0">
            <div className="h-[130px] overflow-y-auto scrollbar-hide rounded border border-border bg-muted/30 py-0.5 space-y-px">
              {toolCategories.map((cat, idx) => {
                const CatIcon = cat.icon;
                const isActive = activeCategory === idx;
                
                return (
                  <div
                    key={cat.name}
                    className={cn(
                      "flex items-center gap-0.5 px-1 py-0.5 mx-0.5 rounded cursor-pointer transition-all",
                      isActive 
                        ? "bg-background shadow-sm" 
                        : "opacity-50 hover:opacity-80"
                    )}
                  >
                    <div className={cn("w-2.5 h-2.5 rounded flex items-center justify-center", cat.color)}>
                      <CatIcon className="w-1.5 h-1.5 text-white" />
                    </div>
                    <span className="text-[5px] font-medium text-foreground truncate">{cat.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tools Panel */}
          <div className="w-[68px] shrink-0 relative">
            <div className="flex items-center gap-0.5 mb-0.5">
              <div className={cn("w-2.5 h-2.5 rounded flex items-center justify-center", currentCategory.color)}>
                <currentCategory.icon className="w-1.5 h-1.5 text-white" />
              </div>
              <span className="text-[6px] font-semibold text-foreground">{currentCategory.name}</span>
              <span className="text-[5px] text-muted-foreground ml-auto">{currentCategory.tools.length}</span>
            </div>
            <div className="h-[118px] overflow-hidden rounded border border-border bg-background/80">
              <div 
                className="py-0.5 transition-transform duration-150"
                style={{ transform: `translateY(-${toolScroll}px)` }}
              >
                {currentCategory.tools.map((tool) => {
                  const ToolIcon = tool.icon;
                  const isHighlighted = highlightedTool === tool.id;
                  
                  return (
                    <div
                      key={tool.id}
                      className={cn(
                        "flex items-center gap-0.5 px-1 py-[3px] mx-0.5 rounded text-[5px] transition-all",
                        isHighlighted 
                          ? "bg-primary/20 ring-1 ring-primary scale-[1.02] shadow-sm" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      <GripVertical className="w-1.5 h-1.5 text-muted-foreground/40" />
                      <div className={cn("w-2.5 h-2.5 rounded flex items-center justify-center", currentCategory.color)}>
                        <ToolIcon className="w-1.5 h-1.5 text-white" />
                      </div>
                      <span className="truncate text-foreground leading-none">{tool.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-[4px] text-muted-foreground text-center mt-0.5">↕ scroll to browse</p>

            {/* Mouse Cursor with Drag Ghost */}
            {dragState.active && dragState.tool && (
              <div
                className="absolute z-50 pointer-events-none transition-all duration-75 ease-out"
                style={{
                  left: 55 + dragState.progress * 100,
                  top: 35 + Math.sin(dragState.progress * Math.PI) * 8,
                }}
              >
                {/* Tool being dragged - cursor touches bottom-right */}
                <div 
                  className="absolute bottom-0 right-0 translate-x-[-100%] translate-y-[-100%]"
                  style={{
                    opacity: 0.95,
                    transform: `translate(-100%, -100%) scale(${0.9 + dragState.progress * 0.1})`
                  }}
                >
                  <div className={cn(
                    "flex items-center gap-0.5 px-1.5 py-0.5 rounded shadow-lg border-2 border-white/40",
                    dragState.color
                  )}>
                    <dragState.tool.icon className="w-2.5 h-2.5 text-white" />
                    <span className="text-[6px] font-semibold text-white whitespace-nowrap">{dragState.tool.label}</span>
                  </div>
                </div>
                {/* Mouse Cursor - touching bottom-right of element */}
                <MousePointer2 
                  className="w-4 h-4 text-foreground" 
                  style={{ 
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                  }}
                />
              </div>
            )}
          </div>

          {/* Canvas - Takes remaining space */}
          <div className="flex-1 min-w-0">
            <div className="text-[6px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5 px-0.5">
              Workflow Canvas
            </div>
            <div className="relative h-[122px] rounded-lg border border-dashed border-border bg-muted/10 p-1 overflow-hidden">
              {/* Grid */}
              <div className="absolute inset-0 opacity-15" style={{
                backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
                backgroundSize: '6px 6px'
              }} />

              {/* Workflow blocks - horizontal flow */}
              <div className="relative z-10 flex flex-wrap items-center gap-0.5 content-start">
                {placedBlocks.map((block, i) => {
                  const BlockIcon = block.tool.icon;
                  const isExecuted = executionStep >= i;
                  const isCurrent = executionStep === i;
                  
                  return (
                    <div key={`${block.tool.id}-${i}`} className="flex items-center">
                      <div
                        className={cn(
                          "flex items-center gap-0.5 px-1 py-0.5 rounded border transition-all animate-scale-in",
                          isExecuted 
                            ? `${block.color} border-transparent text-white shadow-sm` 
                            : "bg-background border-border text-foreground",
                          isCurrent && "ring-1 ring-primary ring-offset-1"
                        )}
                      >
                        <div className={cn(
                          "w-3 h-3 rounded flex items-center justify-center",
                          isExecuted ? "bg-white/20" : block.color
                        )}>
                          {executionState === 'done' ? (
                            <Check className="w-2 h-2 text-white" />
                          ) : (
                            <BlockIcon className={cn(
                              "w-2 h-2",
                              isExecuted ? "text-white" : "text-white",
                              isCurrent && "animate-pulse"
                            )} />
                          )}
                        </div>
                        <span className="text-[5px] font-medium whitespace-nowrap">{block.tool.label}</span>
                      </div>
                      
                      {i < placedBlocks.length - 1 && (
                        <ArrowRight className={cn(
                          "w-2 h-2 mx-0.5 shrink-0 transition-colors",
                          executionStep > i ? "text-primary" : "text-border"
                        )} />
                      )}
                    </div>
                  );
                })}

                {placedBlocks.length === 0 && !dragState.active && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-[6px] text-muted-foreground">Drag tools here</p>
                  </div>
                )}
              </div>

              {/* Workflow stats */}
              {placedBlocks.length > 0 && (
                <div className="absolute bottom-1 right-1 flex gap-1">
                  <span className="text-[5px] px-1 py-0.5 rounded bg-muted text-muted-foreground">
                    {placedBlocks.length} steps
                  </span>
                  {executionState === 'done' && (
                    <span className="text-[5px] px-1 py-0.5 rounded bg-success/10 text-success">
                      ✓ 0.8s
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success message */}
        {executionState === 'done' && (
          <div className="mt-1 flex justify-center animate-fade-in">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[6px] font-medium">
              <Sparkles className="w-2 h-2" />
              Workflow Executed Successfully
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
