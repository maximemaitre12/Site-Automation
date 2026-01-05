import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  ArrowRight, Check, Zap, Brain, Mail, GitBranch, 
  Play, CheckCircle2, FileText, Database, Bell,
  Clock, Filter, Webhook, MessageSquare, Phone,
  Calendar, Upload, Download, Search, Edit,
  Trash2, Copy, Settings, Users, Building2,
  Globe, Shield, Sparkles, BarChart3, Truck,
  Package, MapPin, QrCode, Barcode, Warehouse,
  ClipboardList, Receipt, CreditCard, DollarSign,
  ShoppingCart, Store, Boxes, Container, Route,
  Timer, AlertTriangle, ThermometerSun, Scale,
  Printer, Scan, Radio, Wifi, Cloud, Server,
  HardDrive, Cpu, Monitor, Smartphone, Tablet,
  Camera, Video, Mic, Speaker, Headphones,
  Lock, Key, Fingerprint, Eye, EyeOff,
  Share2, Link, ExternalLink, Send, Forward,
  RotateCw, RefreshCw, Repeat, Shuffle, Split,
  Merge, GitMerge, GitPullRequest, Code, Terminal,
  FileJson, FileSpreadsheet, FilePlus, FolderPlus,
  Archive, FolderArchive, Save, BookOpen, Bookmark,
  Tag, Tags, Flag, Star, Heart, ThumbsUp,
  TrendingUp, TrendingDown, Activity, PieChart,
  LineChart, Gauge, Target, Crosshair, Compass,
  Navigation, Map, Layers, Grid3X3, LayoutGrid,
  Table2, List, ListOrdered, CheckSquare, Square,
  Circle, Triangle, Hexagon, Octagon, Diamond,
  LucideIcon, ChevronDown
} from "lucide-react";

interface Tool {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
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
      { id: "webhook", label: "Webhook", icon: Webhook, color: "bg-amber-500" },
      { id: "schedule", label: "Schedule", icon: Clock, color: "bg-amber-500" },
      { id: "email_in", label: "Email Received", icon: Mail, color: "bg-amber-500" },
      { id: "form", label: "Form Submit", icon: FileText, color: "bg-amber-500" },
      { id: "db_change", label: "DB Change", icon: Database, color: "bg-amber-500" },
      { id: "file_upload", label: "File Upload", icon: Upload, color: "bg-amber-500" },
      { id: "api_call", label: "API Call", icon: Globe, color: "bg-amber-500" },
      { id: "mqtt", label: "MQTT Event", icon: Radio, color: "bg-amber-500" },
      { id: "iot_sensor", label: "IoT Sensor", icon: Wifi, color: "bg-amber-500" },
      { id: "barcode_scan", label: "Barcode Scan", icon: Barcode, color: "bg-amber-500" },
      { id: "qr_scan", label: "QR Code Scan", icon: QrCode, color: "bg-amber-500" },
      { id: "gps_geofence", label: "Geofence Entry", icon: MapPin, color: "bg-amber-500" },
      { id: "threshold", label: "Threshold Alert", icon: AlertTriangle, color: "bg-amber-500" },
      { id: "temperature", label: "Temp. Alert", icon: ThermometerSun, color: "bg-amber-500" },
    ]
  },
  {
    name: "Logic",
    icon: GitBranch,
    color: "bg-blue-500",
    tools: [
      { id: "condition", label: "Condition", icon: GitBranch, color: "bg-blue-500" },
      { id: "filter", label: "Filter", icon: Filter, color: "bg-blue-500" },
      { id: "loop", label: "Loop", icon: Repeat, color: "bg-blue-500" },
      { id: "delay", label: "Delay", icon: Timer, color: "bg-blue-500" },
      { id: "switch", label: "Switch", icon: Split, color: "bg-blue-500" },
      { id: "merge", label: "Merge", icon: Merge, color: "bg-blue-500" },
      { id: "parallel", label: "Parallel", icon: GitMerge, color: "bg-blue-500" },
      { id: "retry", label: "Retry", icon: RotateCw, color: "bg-blue-500" },
      { id: "error_handler", label: "Error Handler", icon: Shield, color: "bg-blue-500" },
      { id: "transform", label: "Transform", icon: Shuffle, color: "bg-blue-500" },
      { id: "aggregate", label: "Aggregate", icon: Layers, color: "bg-blue-500" },
      { id: "dedupe", label: "Deduplicate", icon: Copy, color: "bg-blue-500" },
    ]
  },
  {
    name: "AI Actions",
    icon: Brain,
    color: "bg-purple-500",
    tools: [
      { id: "ai_analyze", label: "AI Analyze", icon: Brain, color: "bg-purple-500" },
      { id: "ai_generate", label: "AI Generate", icon: Sparkles, color: "bg-purple-500" },
      { id: "ai_classify", label: "AI Classify", icon: Tags, color: "bg-purple-500" },
      { id: "ai_extract", label: "AI Extract", icon: Search, color: "bg-purple-500" },
      { id: "ai_summarize", label: "AI Summarize", icon: FileText, color: "bg-purple-500" },
      { id: "ai_translate", label: "AI Translate", icon: Globe, color: "bg-purple-500" },
      { id: "ai_sentiment", label: "Sentiment", icon: Heart, color: "bg-purple-500" },
      { id: "ai_ocr", label: "OCR Extract", icon: Scan, color: "bg-purple-500" },
      { id: "ai_vision", label: "Vision AI", icon: Eye, color: "bg-purple-500" },
      { id: "ai_predict", label: "Predictive", icon: TrendingUp, color: "bg-purple-500" },
      { id: "ai_anomaly", label: "Anomaly Detect", icon: Activity, color: "bg-purple-500" },
      { id: "ai_recommend", label: "Recommend", icon: Target, color: "bg-purple-500" },
    ]
  },
  {
    name: "Operations",
    icon: Truck,
    color: "bg-teal-500",
    tools: [
      { id: "create_shipment", label: "Create Shipment", icon: Truck, color: "bg-teal-500" },
      { id: "update_inventory", label: "Update Stock", icon: Package, color: "bg-teal-500" },
      { id: "warehouse_assign", label: "Warehouse Assign", icon: Warehouse, color: "bg-teal-500" },
      { id: "route_optimize", label: "Route Optimize", icon: Route, color: "bg-teal-500" },
      { id: "order_process", label: "Process Order", icon: ClipboardList, color: "bg-teal-500" },
      { id: "track_update", label: "Track Update", icon: MapPin, color: "bg-teal-500" },
      { id: "container_assign", label: "Container Assign", icon: Container, color: "bg-teal-500" },
      { id: "weight_check", label: "Weight Check", icon: Scale, color: "bg-teal-500" },
      { id: "label_print", label: "Print Label", icon: Printer, color: "bg-teal-500" },
      { id: "batch_process", label: "Batch Process", icon: Boxes, color: "bg-teal-500" },
      { id: "eta_calculate", label: "ETA Calculate", icon: Clock, color: "bg-teal-500" },
      { id: "carrier_select", label: "Carrier Select", icon: Navigation, color: "bg-teal-500" },
      { id: "customs_doc", label: "Customs Doc", icon: FileText, color: "bg-teal-500" },
      { id: "pallet_assign", label: "Pallet Assign", icon: Grid3X3, color: "bg-teal-500" },
    ]
  },
  {
    name: "Data",
    icon: Database,
    color: "bg-cyan-500",
    tools: [
      { id: "db_insert", label: "DB Insert", icon: Database, color: "bg-cyan-500" },
      { id: "db_update", label: "DB Update", icon: Edit, color: "bg-cyan-500" },
      { id: "db_query", label: "DB Query", icon: Search, color: "bg-cyan-500" },
      { id: "db_delete", label: "DB Delete", icon: Trash2, color: "bg-cyan-500" },
      { id: "csv_export", label: "CSV Export", icon: FileSpreadsheet, color: "bg-cyan-500" },
      { id: "json_parse", label: "JSON Parse", icon: FileJson, color: "bg-cyan-500" },
      { id: "api_get", label: "API GET", icon: Download, color: "bg-cyan-500" },
      { id: "api_post", label: "API POST", icon: Upload, color: "bg-cyan-500" },
      { id: "cache_set", label: "Cache Set", icon: HardDrive, color: "bg-cyan-500" },
      { id: "queue_add", label: "Queue Add", icon: ListOrdered, color: "bg-cyan-500" },
      { id: "file_create", label: "File Create", icon: FilePlus, color: "bg-cyan-500" },
      { id: "archive", label: "Archive", icon: Archive, color: "bg-cyan-500" },
    ]
  },
  {
    name: "Notifications",
    icon: Bell,
    color: "bg-orange-500",
    tools: [
      { id: "send_email", label: "Send Email", icon: Mail, color: "bg-orange-500" },
      { id: "notify", label: "Push Notify", icon: Bell, color: "bg-orange-500" },
      { id: "sms", label: "Send SMS", icon: Phone, color: "bg-orange-500" },
      { id: "whatsapp", label: "WhatsApp", icon: MessageSquare, color: "bg-orange-500" },
      { id: "in_app", label: "In-App Alert", icon: Smartphone, color: "bg-orange-500" },
      { id: "webhook_out", label: "Webhook Out", icon: Send, color: "bg-orange-500" },
      { id: "escalate", label: "Escalate", icon: AlertTriangle, color: "bg-orange-500" },
      { id: "digest", label: "Send Digest", icon: BookOpen, color: "bg-orange-500" },
    ]
  },
  {
    name: "Integrations",
    icon: Link,
    color: "bg-indigo-500",
    tools: [
      { id: "slack", label: "Slack", icon: MessageSquare, color: "bg-indigo-500" },
      { id: "teams", label: "MS Teams", icon: Users, color: "bg-indigo-500" },
      { id: "salesforce", label: "Salesforce", icon: Cloud, color: "bg-indigo-500" },
      { id: "hubspot", label: "HubSpot", icon: Target, color: "bg-indigo-500" },
      { id: "sap", label: "SAP", icon: Server, color: "bg-indigo-500" },
      { id: "oracle", label: "Oracle", icon: Database, color: "bg-indigo-500" },
      { id: "quickbooks", label: "QuickBooks", icon: Receipt, color: "bg-indigo-500" },
      { id: "stripe", label: "Stripe", icon: CreditCard, color: "bg-indigo-500" },
      { id: "shopify", label: "Shopify", icon: ShoppingCart, color: "bg-indigo-500" },
      { id: "magento", label: "Magento", icon: Store, color: "bg-indigo-500" },
      { id: "google_sheets", label: "Google Sheets", icon: Table2, color: "bg-indigo-500" },
      { id: "airtable", label: "Airtable", icon: LayoutGrid, color: "bg-indigo-500" },
      { id: "notion", label: "Notion", icon: BookOpen, color: "bg-indigo-500" },
      { id: "jira", label: "Jira", icon: CheckSquare, color: "bg-indigo-500" },
      { id: "zendesk", label: "Zendesk", icon: Headphones, color: "bg-indigo-500" },
      { id: "intercom", label: "Intercom", icon: MessageSquare, color: "bg-indigo-500" },
      { id: "twilio", label: "Twilio", icon: Phone, color: "bg-indigo-500" },
      { id: "sendgrid", label: "SendGrid", icon: Mail, color: "bg-indigo-500" },
      { id: "aws_s3", label: "AWS S3", icon: Cloud, color: "bg-indigo-500" },
      { id: "azure", label: "Azure", icon: Cloud, color: "bg-indigo-500" },
      { id: "gcp", label: "GCP", icon: Cloud, color: "bg-indigo-500" },
      { id: "mongodb", label: "MongoDB", icon: Database, color: "bg-indigo-500" },
      { id: "postgres", label: "PostgreSQL", icon: Database, color: "bg-indigo-500" },
      { id: "redis", label: "Redis", icon: Cpu, color: "bg-indigo-500" },
    ]
  },
  {
    name: "Documents",
    icon: FileText,
    color: "bg-rose-500",
    tools: [
      { id: "create_doc", label: "Create Doc", icon: FilePlus, color: "bg-rose-500" },
      { id: "pdf_generate", label: "Generate PDF", icon: FileText, color: "bg-rose-500" },
      { id: "merge_docs", label: "Merge Docs", icon: Merge, color: "bg-rose-500" },
      { id: "sign_request", label: "Sign Request", icon: Edit, color: "bg-rose-500" },
      { id: "template_fill", label: "Fill Template", icon: Copy, color: "bg-rose-500" },
      { id: "watermark", label: "Watermark", icon: Shield, color: "bg-rose-500" },
      { id: "compress", label: "Compress", icon: Archive, color: "bg-rose-500" },
      { id: "convert", label: "Convert", icon: RefreshCw, color: "bg-rose-500" },
    ]
  },
];

// Workflow sequence to animate
const workflowSequence = [
  { categoryIndex: 0, toolIndex: 9 }, // Barcode Scan
  { categoryIndex: 3, toolIndex: 1 }, // Update Stock
  { categoryIndex: 2, toolIndex: 9 }, // AI Predictive
  { categoryIndex: 5, toolIndex: 0 }, // Send Email
];

interface AgentFlowDemoProps {
  className?: string;
}

export function AgentFlowDemo({ className }: AgentFlowDemoProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const [currentStep, setCurrentStep] = useState(-1);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [placedBlocks, setPlacedBlocks] = useState<Tool[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState(-1);
  const [showComplete, setShowComplete] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [categoryScroll, setCategoryScroll] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(-1);
      setSelectedTool(null);
      setIsDragging(false);
      setPlacedBlocks([]);
      setIsExecuting(false);
      setExecutionStep(-1);
      setShowComplete(false);
      setActiveCategory(0);
      setCategoryScroll(0);
      return;
    }

    // Animate through the workflow building sequence
    const animateSequence = () => {
      workflowSequence.forEach((step, i) => {
        const baseDelay = i * 2200;
        
        // Step 1: Switch to category and scroll to tool
        setTimeout(() => {
          setCurrentStep(i);
          setActiveCategory(step.categoryIndex);
          // Scroll to show the tool
          const scrollTo = Math.max(0, (step.toolIndex - 2) * 22);
          setCategoryScroll(scrollTo);
        }, baseDelay);

        // Step 2: Highlight tool
        setTimeout(() => {
          const tool = toolCategories[step.categoryIndex].tools[step.toolIndex];
          setSelectedTool(tool);
        }, baseDelay + 400);

        // Step 3: Start drag animation
        setTimeout(() => {
          setIsDragging(true);
          setDragPosition({ x: 40, y: 60 });
        }, baseDelay + 700);

        // Step 4: Move to canvas
        setTimeout(() => {
          setDragPosition({ x: 180, y: 50 });
        }, baseDelay + 1000);

        // Step 5: Drop on canvas
        setTimeout(() => {
          setIsDragging(false);
          const tool = toolCategories[step.categoryIndex].tools[step.toolIndex];
          setPlacedBlocks(prev => [...prev, tool]);
          setSelectedTool(null);
        }, baseDelay + 1400);
      });

      // After all blocks placed, run execution
      const executionDelay = workflowSequence.length * 2200 + 500;
      setTimeout(() => {
        setIsExecuting(true);
        workflowSequence.forEach((_, i) => {
          setTimeout(() => setExecutionStep(i), i * 400);
        });
      }, executionDelay);

      // Show completion
      setTimeout(() => {
        setShowComplete(true);
        setIsExecuting(false);
      }, executionDelay + workflowSequence.length * 400 + 500);
    };

    const timeout = setTimeout(animateSequence, 300);
    return () => clearTimeout(timeout);
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
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <GitBranch className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-foreground">Workflow Builder</p>
              <p className="text-[8px] text-muted-foreground">150+ tools & integrations</p>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-medium",
            showComplete 
              ? "bg-success/10 text-success" 
              : isExecuting 
                ? "bg-amber-500/10 text-amber-600"
                : "bg-muted text-muted-foreground"
          )}>
            {showComplete ? (
              <><CheckCircle2 className="w-2.5 h-2.5" /> Done</>
            ) : isExecuting ? (
              <><Play className="w-2.5 h-2.5 animate-pulse" /> Running</>
            ) : (
              <><Settings className="w-2.5 h-2.5" /> Building</>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {/* Categories Sidebar */}
          <div className="w-[72px] shrink-0">
            <div className="h-[155px] overflow-y-auto scrollbar-hide rounded-lg border border-border bg-secondary/30 p-1 space-y-0.5">
              {toolCategories.map((cat, idx) => {
                const CatIcon = cat.icon;
                const isActive = activeCategory === idx;
                const toolCount = cat.tools.length;
                
                return (
                  <div
                    key={cat.name}
                    className={cn(
                      "flex items-center gap-1 px-1.5 py-1 rounded-md cursor-pointer transition-all duration-200",
                      isActive 
                        ? "bg-background shadow-sm border border-border" 
                        : "hover:bg-background/50"
                    )}
                    onClick={() => {
                      setActiveCategory(idx);
                      setCategoryScroll(0);
                    }}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded flex items-center justify-center shrink-0",
                      cat.color
                    )}>
                      <CatIcon className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[7px] font-medium text-foreground truncate">{cat.name}</p>
                      <p className="text-[6px] text-muted-foreground">{toolCount} tools</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tools List - Scrollable */}
          <div className="w-[85px] shrink-0">
            <div className="flex items-center justify-between mb-1 px-0.5">
              <div className="flex items-center gap-1">
                <div className={cn("w-3 h-3 rounded flex items-center justify-center", currentCategory.color)}>
                  <currentCategory.icon className="w-2 h-2 text-white" />
                </div>
                <span className="text-[8px] font-semibold text-foreground">{currentCategory.name}</span>
              </div>
              <ChevronDown className="w-2.5 h-2.5 text-muted-foreground" />
            </div>
            <div className="h-[140px] overflow-hidden rounded-lg border border-border bg-background/50">
              <div 
                className="p-1 space-y-0.5 transition-transform duration-300"
                style={{ transform: `translateY(-${categoryScroll}px)` }}
              >
                {currentCategory.tools.map((tool, idx) => {
                  const ToolIcon = tool.icon;
                  const isSelected = selectedTool?.id === tool.id;
                  
                  return (
                    <div
                      key={tool.id}
                      className={cn(
                        "flex items-center gap-1 px-1.5 py-1 rounded text-[7px] transition-all duration-300 cursor-grab",
                        isSelected 
                          ? "bg-primary/20 border border-primary/40 scale-[1.02] shadow-sm" 
                          : "bg-secondary/50 border border-transparent hover:bg-secondary"
                      )}
                    >
                      <div className={cn(
                        "w-3.5 h-3.5 rounded flex items-center justify-center shrink-0",
                        tool.color
                      )}>
                        <ToolIcon className="w-2 h-2 text-white" />
                      </div>
                      <span className="truncate text-foreground">{tool.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-0.5 text-center">
              <span className="text-[6px] text-muted-foreground">
                ↕ scroll for {currentCategory.tools.length - 5}+ more
              </span>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 min-w-0">
            <div className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-1">
              Canvas
            </div>
            <div className="relative h-[155px] rounded-lg border border-dashed border-border bg-secondary/20 p-2 overflow-hidden">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
                backgroundSize: '10px 10px'
              }} />

              {/* Placed blocks */}
              <div className="relative z-10 flex flex-col gap-1">
                {placedBlocks.map((block, i) => {
                  const BlockIcon = block.icon;
                  const isActive = executionStep >= i;
                  const isCurrent = executionStep === i;
                  
                  return (
                    <div key={`${block.id}-${i}`} className="flex items-center">
                      <div
                        className={cn(
                          "flex items-center gap-1 px-1.5 py-0.5 rounded-md border transition-all duration-300 animate-scale-in",
                          isActive 
                            ? `${block.color} border-transparent shadow-md` 
                            : "bg-background border-border",
                          isCurrent && "ring-2 ring-offset-1 ring-primary/50"
                        )}
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded flex items-center justify-center",
                          isActive ? "bg-white/20" : block.color
                        )}>
                          {showComplete ? (
                            <Check className="w-2.5 h-2.5 text-white" />
                          ) : (
                            <BlockIcon className={cn(
                              "w-2.5 h-2.5",
                              isActive ? "text-white" : "text-white",
                              isCurrent && "animate-pulse"
                            )} />
                          )}
                        </div>
                        <span className={cn(
                          "text-[7px] font-medium",
                          isActive ? "text-white" : "text-foreground"
                        )}>
                          {block.label}
                        </span>
                      </div>
                      
                      {i < placedBlocks.length - 1 && (
                        <div className="flex flex-col items-center mx-1">
                          <div className={cn(
                            "w-0.5 h-2 transition-colors duration-300",
                            executionStep > i ? "bg-primary" : "bg-border"
                          )} />
                          <ArrowRight className={cn(
                            "w-2 h-2 rotate-90 transition-colors duration-300",
                            executionStep > i ? "text-primary" : "text-muted-foreground/40"
                          )} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Empty state */}
                {placedBlocks.length === 0 && !isDragging && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-[8px] text-muted-foreground">Drag tools here...</p>
                  </div>
                )}
              </div>

              {/* Dragging element */}
              {isDragging && selectedTool && (
                <div
                  className="absolute z-20 transition-all duration-300 ease-out pointer-events-none"
                  style={{
                    left: dragPosition.x,
                    top: dragPosition.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className={cn(
                    "flex items-center gap-1 px-1.5 py-1 rounded-lg shadow-lg border-2 border-primary",
                    selectedTool.color,
                    "animate-pulse"
                  )}>
                    <selectedTool.icon className="w-3 h-3 text-white" />
                    <span className="text-[7px] font-medium text-white">{selectedTool.label}</span>
                  </div>
                  {/* Drag trail */}
                  <div className="absolute top-1/2 right-full w-6 h-0.5 bg-gradient-to-l from-primary to-transparent -translate-y-1/2" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success indicator */}
        <div className={cn(
          "mt-2 flex items-center justify-center transition-all duration-500",
          showComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-[8px] font-medium">
            <Sparkles className="w-2.5 h-2.5" />
            Workflow Built & Executed
          </div>
        </div>
      </div>
    </div>
  );
}
