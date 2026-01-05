import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  ArrowDown, Check, Zap, Brain, Mail, GitBranch, 
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
  LucideIcon, ChevronRight, GripVertical
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
      { id: "api_call", label: "REST API Call", icon: Globe },
      { id: "mqtt", label: "MQTT Event", icon: Radio },
      { id: "iot_sensor", label: "IoT Sensor", icon: Wifi },
      { id: "barcode_scan", label: "Barcode Scan", icon: Barcode },
      { id: "qr_scan", label: "QR Code Scan", icon: QrCode },
      { id: "gps_geofence", label: "Geofence Entry", icon: MapPin },
      { id: "threshold", label: "Threshold Alert", icon: AlertTriangle },
      { id: "temperature", label: "Temp. Alert", icon: ThermometerSun },
      { id: "graphql", label: "GraphQL Sub", icon: Code },
      { id: "kafka", label: "Kafka Consumer", icon: Server },
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
      { id: "loop", label: "For Each Loop", icon: Repeat },
      { id: "delay", label: "Delay Timer", icon: Timer },
      { id: "switch", label: "Switch Case", icon: Split },
      { id: "merge", label: "Merge Paths", icon: Merge },
      { id: "parallel", label: "Parallel Exec", icon: GitMerge },
      { id: "retry", label: "Retry Logic", icon: RotateCw },
      { id: "error_handler", label: "Try/Catch", icon: Shield },
      { id: "transform", label: "Map Transform", icon: Shuffle },
      { id: "aggregate", label: "Reduce/Agg", icon: Layers },
      { id: "regex", label: "Regex Match", icon: Code },
      { id: "script", label: "JS Script", icon: Terminal },
      { id: "python", label: "Python Script", icon: Code },
    ]
  },
  {
    name: "AI",
    icon: Brain,
    color: "bg-purple-500",
    tools: [
      { id: "ai_analyze", label: "AI Analyze", icon: Brain },
      { id: "ai_generate", label: "AI Generate", icon: Sparkles },
      { id: "ai_classify", label: "AI Classify", icon: Tags },
      { id: "ai_extract", label: "Entity Extract", icon: Search },
      { id: "ai_summarize", label: "Summarize", icon: FileText },
      { id: "ai_translate", label: "Translate", icon: Globe },
      { id: "ai_sentiment", label: "Sentiment", icon: Heart },
      { id: "ai_ocr", label: "OCR Extract", icon: Scan },
      { id: "ai_vision", label: "Vision AI", icon: Eye },
      { id: "ai_predict", label: "Predictive", icon: TrendingUp },
      { id: "ai_anomaly", label: "Anomaly Detect", icon: Activity },
      { id: "ai_embedding", label: "Embeddings", icon: Cpu },
      { id: "ai_rag", label: "RAG Query", icon: Database },
      { id: "llm_prompt", label: "LLM Prompt", icon: MessageSquare },
    ]
  },
  {
    name: "Operations",
    icon: Truck,
    color: "bg-teal-500",
    tools: [
      { id: "create_shipment", label: "Create Shipment", icon: Truck },
      { id: "update_inventory", label: "Update Stock", icon: Package },
      { id: "warehouse_assign", label: "WMS Assign", icon: Warehouse },
      { id: "route_optimize", label: "Route Optimize", icon: Route },
      { id: "order_process", label: "Process Order", icon: ClipboardList },
      { id: "track_update", label: "Track Update", icon: MapPin },
      { id: "container_assign", label: "Container", icon: Container },
      { id: "weight_check", label: "Weight Check", icon: Scale },
      { id: "label_print", label: "Print Label", icon: Printer },
      { id: "batch_process", label: "Batch Process", icon: Boxes },
      { id: "eta_calculate", label: "ETA Calc", icon: Clock },
      { id: "customs", label: "Customs Doc", icon: FileText },
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
      { id: "csv_export", label: "CSV Export", icon: FileSpreadsheet },
      { id: "json_parse", label: "JSON Parse", icon: FileJson },
      { id: "api_get", label: "HTTP GET", icon: Download },
      { id: "api_post", label: "HTTP POST", icon: Upload },
      { id: "graphql_query", label: "GraphQL Query", icon: Code },
      { id: "cache_redis", label: "Redis Cache", icon: HardDrive },
      { id: "queue_add", label: "Queue Push", icon: ListOrdered },
      { id: "s3_upload", label: "S3 Upload", icon: Cloud },
      { id: "elasticsearch", label: "ES Index", icon: Search },
    ]
  },
  {
    name: "DevOps",
    icon: Terminal,
    color: "bg-slate-500",
    tools: [
      { id: "docker_run", label: "Docker Run", icon: Container },
      { id: "k8s_deploy", label: "K8s Deploy", icon: Server },
      { id: "ssh_exec", label: "SSH Exec", icon: Terminal },
      { id: "git_commit", label: "Git Commit", icon: GitBranch },
      { id: "ci_trigger", label: "CI Trigger", icon: Play },
      { id: "aws_lambda", label: "AWS Lambda", icon: Cloud },
      { id: "azure_func", label: "Azure Func", icon: Cloud },
      { id: "gcp_run", label: "GCP Run", icon: Cloud },
      { id: "terraform", label: "Terraform", icon: Layers },
      { id: "ansible", label: "Ansible", icon: Settings },
      { id: "vault_secret", label: "Vault Secret", icon: Key },
      { id: "prometheus", label: "Prometheus", icon: Activity },
    ]
  },
  {
    name: "Notify",
    icon: Bell,
    color: "bg-orange-500",
    tools: [
      { id: "send_email", label: "SMTP Email", icon: Mail },
      { id: "notify", label: "Push Notify", icon: Bell },
      { id: "sms", label: "SMS Twilio", icon: Phone },
      { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
      { id: "slack", label: "Slack Msg", icon: MessageSquare },
      { id: "teams", label: "MS Teams", icon: Users },
      { id: "webhook_out", label: "Webhook Out", icon: Send },
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
      { id: "sap", label: "SAP ERP", icon: Server },
      { id: "oracle", label: "Oracle DB", icon: Database },
      { id: "stripe", label: "Stripe", icon: CreditCard },
      { id: "shopify", label: "Shopify", icon: ShoppingCart },
      { id: "magento", label: "Magento", icon: Store },
      { id: "quickbooks", label: "QuickBooks", icon: Receipt },
      { id: "google_sheets", label: "G Sheets", icon: Table2 },
      { id: "airtable", label: "Airtable", icon: LayoutGrid },
      { id: "notion", label: "Notion", icon: BookOpen },
      { id: "jira", label: "Jira", icon: CheckSquare },
      { id: "zendesk", label: "Zendesk", icon: Headphones },
      { id: "mongodb", label: "MongoDB", icon: Database },
      { id: "postgres", label: "PostgreSQL", icon: Database },
      { id: "snowflake", label: "Snowflake", icon: Cloud },
    ]
  },
  {
    name: "Security",
    icon: Lock,
    color: "bg-red-500",
    tools: [
      { id: "oauth", label: "OAuth 2.0", icon: Lock },
      { id: "jwt_verify", label: "JWT Verify", icon: Key },
      { id: "encrypt", label: "AES Encrypt", icon: Shield },
      { id: "hash", label: "Hash SHA256", icon: Cpu },
      { id: "sign", label: "Digital Sign", icon: Edit },
      { id: "audit_log", label: "Audit Log", icon: FileText },
    ]
  },
  {
    name: "Docs",
    icon: FileText,
    color: "bg-rose-500",
    tools: [
      { id: "pdf_generate", label: "Generate PDF", icon: FileText },
      { id: "merge_docs", label: "Merge Docs", icon: Merge },
      { id: "template_fill", label: "Template Fill", icon: FilePlus },
      { id: "docx_create", label: "DOCX Create", icon: FileText },
      { id: "excel_create", label: "Excel Create", icon: FileSpreadsheet },
      { id: "archive_zip", label: "ZIP Archive", icon: Archive },
      { id: "convert", label: "Format Convert", icon: RefreshCw },
    ]
  },
];

// Workflow sequence to animate - picking different categories
const workflowSequence = [
  { categoryIndex: 0, toolIndex: 8 }, // Barcode Scan (Triggers)
  { categoryIndex: 4, toolIndex: 0 }, // SQL Insert (Data)
  { categoryIndex: 2, toolIndex: 9 }, // Predictive (AI)
  { categoryIndex: 6, toolIndex: 0 }, // SMTP Email (Notify)
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
    progress: number; // 0 to 1
  }>({ active: false, tool: null, progress: 0 });
  const [placedBlocks, setPlacedBlocks] = useState<Array<{ tool: Tool; color: string }>>([]);
  const [executionState, setExecutionState] = useState<'building' | 'running' | 'done'>('building');
  const [executionStep, setExecutionStep] = useState(-1);

  useEffect(() => {
    if (!isVisible) {
      setActiveCategory(0);
      setToolScroll(0);
      setHighlightedTool(null);
      setDragState({ active: false, tool: null, progress: 0 });
      setPlacedBlocks([]);
      setExecutionState('building');
      setExecutionStep(-1);
      return;
    }

    let cancelled = false;
    const timers: NodeJS.Timeout[] = [];

    const runAnimation = async () => {
      // Build workflow step by step
      for (let i = 0; i < workflowSequence.length; i++) {
        if (cancelled) return;
        const step = workflowSequence[i];
        const category = toolCategories[step.categoryIndex];
        const tool = category.tools[step.toolIndex];

        // Switch category
        timers.push(setTimeout(() => {
          if (cancelled) return;
          setActiveCategory(step.categoryIndex);
          setToolScroll(Math.max(0, (step.toolIndex - 3) * 18));
        }, i * 2400));

        // Highlight tool
        timers.push(setTimeout(() => {
          if (cancelled) return;
          setHighlightedTool(tool.id);
        }, i * 2400 + 300));

        // Start drag
        timers.push(setTimeout(() => {
          if (cancelled) return;
          setDragState({ active: true, tool, progress: 0 });
        }, i * 2400 + 600));

        // Animate drag progress
        for (let p = 1; p <= 10; p++) {
          timers.push(setTimeout(() => {
            if (cancelled) return;
            setDragState(prev => ({ ...prev, progress: p / 10 }));
          }, i * 2400 + 600 + p * 80));
        }

        // Drop
        timers.push(setTimeout(() => {
          if (cancelled) return;
          setDragState({ active: false, tool: null, progress: 0 });
          setHighlightedTool(null);
          setPlacedBlocks(prev => [...prev, { tool, color: category.color }]);
        }, i * 2400 + 1600));
      }

      // Run execution
      const execStart = workflowSequence.length * 2400 + 400;
      timers.push(setTimeout(() => {
        if (cancelled) return;
        setExecutionState('running');
      }, execStart));

      for (let i = 0; i < workflowSequence.length; i++) {
        timers.push(setTimeout(() => {
          if (cancelled) return;
          setExecutionStep(i);
        }, execStart + 200 + i * 350));
      }

      // Done
      timers.push(setTimeout(() => {
        if (cancelled) return;
        setExecutionState('done');
      }, execStart + 200 + workflowSequence.length * 350 + 400));
    };

    timers.push(setTimeout(runAnimation, 200));

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
        "relative p-3 rounded-xl bg-card border border-border overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <GitBranch className="w-3 h-3 text-primary-foreground" />
            </div>
            <div>
              <p className="text-[9px] font-semibold text-foreground">Workflow Builder</p>
              <p className="text-[7px] text-muted-foreground">200+ tools • 10 categories</p>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7px] font-medium",
            executionState === 'done' 
              ? "bg-success/10 text-success" 
              : executionState === 'running'
                ? "bg-amber-500/10 text-amber-600"
                : "bg-muted text-muted-foreground"
          )}>
            {executionState === 'done' ? (
              <><CheckCircle2 className="w-2.5 h-2.5" /> Done</>
            ) : executionState === 'running' ? (
              <><Play className="w-2.5 h-2.5 animate-pulse" /> Running</>
            ) : (
              <><Settings className="w-2.5 h-2.5 animate-spin" /> Building</>
            )}
          </div>
        </div>

        <div className="flex gap-1.5">
          {/* Categories - Vertical Tabs */}
          <div className="w-[58px] shrink-0">
            <div className="h-[150px] overflow-y-auto scrollbar-hide rounded-lg border border-border bg-muted/30 py-0.5">
              {toolCategories.map((cat, idx) => {
                const CatIcon = cat.icon;
                const isActive = activeCategory === idx;
                
                return (
                  <div
                    key={cat.name}
                    className={cn(
                      "flex items-center gap-1 px-1 py-0.5 mx-0.5 rounded cursor-pointer transition-all duration-150",
                      isActive 
                        ? "bg-background shadow-sm" 
                        : "hover:bg-background/50 opacity-60"
                    )}
                  >
                    <div className={cn(
                      "w-3 h-3 rounded flex items-center justify-center shrink-0",
                      cat.color
                    )}>
                      <CatIcon className="w-2 h-2 text-white" />
                    </div>
                    <span className="text-[6px] font-medium text-foreground truncate">{cat.name}</span>
                    {isActive && <ChevronRight className="w-2 h-2 text-muted-foreground ml-auto" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tools List */}
          <div className="w-[75px] shrink-0 relative">
            <div className="flex items-center gap-1 mb-0.5 px-0.5">
              <div className={cn("w-2.5 h-2.5 rounded flex items-center justify-center", currentCategory.color)}>
                <currentCategory.icon className="w-1.5 h-1.5 text-white" />
              </div>
              <span className="text-[7px] font-semibold text-foreground">{currentCategory.name}</span>
              <span className="text-[6px] text-muted-foreground ml-auto">{currentCategory.tools.length}</span>
            </div>
            <div className="h-[136px] overflow-hidden rounded border border-border bg-background/80">
              <div 
                className="p-0.5 space-y-px transition-transform duration-200"
                style={{ transform: `translateY(-${toolScroll}px)` }}
              >
                {currentCategory.tools.map((tool) => {
                  const ToolIcon = tool.icon;
                  const isHighlighted = highlightedTool === tool.id;
                  
                  return (
                    <div
                      key={tool.id}
                      className={cn(
                        "flex items-center gap-1 px-1 py-0.5 rounded text-[6px] transition-all duration-200",
                        isHighlighted 
                          ? "bg-primary/20 ring-1 ring-primary/50 scale-[1.02]" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      <GripVertical className="w-2 h-2 text-muted-foreground/50" />
                      <div className={cn(
                        "w-3 h-3 rounded flex items-center justify-center shrink-0",
                        currentCategory.color
                      )}>
                        <ToolIcon className="w-2 h-2 text-white" />
                      </div>
                      <span className="truncate text-foreground">{tool.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-[5px] text-muted-foreground text-center mt-0.5">
              ↕ scroll • drag to canvas
            </div>

            {/* Drag animation overlay */}
            {dragState.active && dragState.tool && (
              <div
                className="absolute z-30 pointer-events-none transition-all duration-75"
                style={{
                  left: 30 + dragState.progress * 60,
                  top: 50 + dragState.progress * 30,
                  opacity: 0.5 + dragState.progress * 0.5,
                  transform: `scale(${0.9 + dragState.progress * 0.2})`
                }}
              >
                <div className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded shadow-lg border border-primary/50",
                  currentCategory.color
                )}>
                  <dragState.tool.icon className="w-2.5 h-2.5 text-white" />
                  <span className="text-[6px] font-medium text-white whitespace-nowrap">{dragState.tool.label}</span>
                </div>
                {/* Trail line */}
                <svg className="absolute top-1/2 right-full -translate-y-1/2" width="30" height="4">
                  <line 
                    x1="0" y1="2" x2="30" y2="2" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                    opacity={dragState.progress}
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Canvas */}
          <div className="flex-1 min-w-0">
            <div className="text-[7px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5 px-0.5">
              Canvas
            </div>
            <div className="relative h-[146px] rounded-lg border border-dashed border-border bg-muted/20 p-1.5 overflow-hidden">
              {/* Grid */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
                backgroundSize: '8px 8px'
              }} />

              {/* Placed blocks - vertical flow */}
              <div className="relative z-10 flex flex-col gap-0.5">
                {placedBlocks.map((block, i) => {
                  const BlockIcon = block.tool.icon;
                  const isExecuted = executionStep >= i;
                  const isCurrent = executionStep === i;
                  
                  return (
                    <div key={`${block.tool.id}-${i}`} className="flex flex-col items-start">
                      <div
                        className={cn(
                          "flex items-center gap-1 px-1.5 py-0.5 rounded border transition-all duration-200 animate-fade-in",
                          isExecuted 
                            ? `${block.color} border-transparent text-white shadow` 
                            : "bg-background border-border text-foreground",
                          isCurrent && "ring-1 ring-primary ring-offset-1"
                        )}
                      >
                        <div className={cn(
                          "w-3.5 h-3.5 rounded flex items-center justify-center",
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
                        <span className="text-[6px] font-medium">{block.tool.label}</span>
                      </div>
                      
                      {i < placedBlocks.length - 1 && (
                        <div className="flex items-center ml-2 h-2">
                          <div className={cn(
                            "w-0.5 h-full transition-colors",
                            executionStep > i ? "bg-primary" : "bg-border"
                          )} />
                          <ArrowDown className={cn(
                            "w-2 h-2 -ml-[3px] transition-colors",
                            executionStep > i ? "text-primary" : "text-muted-foreground/30"
                          )} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {placedBlocks.length === 0 && !dragState.active && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-[7px] text-muted-foreground">Drop tools here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success */}
        {executionState === 'done' && (
          <div className="mt-1.5 flex justify-center animate-fade-in">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[7px] font-medium">
              <Sparkles className="w-2.5 h-2.5" />
              Workflow Executed
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
