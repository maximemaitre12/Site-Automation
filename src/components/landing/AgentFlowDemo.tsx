import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  ArrowRight, Check, Zap, Brain, Mail, GitBranch, 
  Play, CheckCircle2, FileText, Database, Bell,
  Clock, Filter, Webhook, MessageSquare, Phone,
  Calendar, Upload, Download, Search, Edit,
  Trash2, Copy, Settings, Users, Building2,
  Globe, Shield, Sparkles, BarChart3
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Tool {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

interface Category {
  name: string;
  tools: Tool[];
}

const toolCategories: Category[] = [
  {
    name: "Triggers",
    tools: [
      { id: "webhook", label: "Webhook", icon: Webhook, color: "bg-amber-500" },
      { id: "schedule", label: "Schedule", icon: Clock, color: "bg-amber-500" },
      { id: "email_in", label: "Email Received", icon: Mail, color: "bg-amber-500" },
      { id: "form", label: "Form Submit", icon: FileText, color: "bg-amber-500" },
      { id: "db_change", label: "DB Change", icon: Database, color: "bg-amber-500" },
    ]
  },
  {
    name: "Logic",
    tools: [
      { id: "condition", label: "Condition", icon: GitBranch, color: "bg-blue-500" },
      { id: "filter", label: "Filter", icon: Filter, color: "bg-blue-500" },
      { id: "loop", label: "Loop", icon: ArrowRight, color: "bg-blue-500" },
      { id: "delay", label: "Delay", icon: Clock, color: "bg-blue-500" },
    ]
  },
  {
    name: "AI Actions",
    tools: [
      { id: "ai_analyze", label: "AI Analyze", icon: Brain, color: "bg-purple-500" },
      { id: "ai_generate", label: "AI Generate", icon: Sparkles, color: "bg-purple-500" },
      { id: "ai_classify", label: "AI Classify", icon: BarChart3, color: "bg-purple-500" },
      { id: "ai_extract", label: "AI Extract", icon: Search, color: "bg-purple-500" },
    ]
  },
  {
    name: "Actions",
    tools: [
      { id: "send_email", label: "Send Email", icon: Mail, color: "bg-green-500" },
      { id: "notify", label: "Notification", icon: Bell, color: "bg-green-500" },
      { id: "sms", label: "Send SMS", icon: Phone, color: "bg-green-500" },
      { id: "slack", label: "Slack", icon: MessageSquare, color: "bg-green-500" },
      { id: "update_crm", label: "Update CRM", icon: Users, color: "bg-green-500" },
      { id: "create_doc", label: "Create Doc", icon: FileText, color: "bg-green-500" },
    ]
  },
];

// Workflow sequence to animate
const workflowSequence = [
  { categoryIndex: 0, toolIndex: 0 }, // Webhook trigger
  { categoryIndex: 1, toolIndex: 0 }, // Condition
  { categoryIndex: 2, toolIndex: 0 }, // AI Analyze
  { categoryIndex: 3, toolIndex: 0 }, // Send Email
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
  const [scrollPosition, setScrollPosition] = useState(0);
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(-1);
      setSelectedTool(null);
      setIsDragging(false);
      setPlacedBlocks([]);
      setIsExecuting(false);
      setExecutionStep(-1);
      setShowComplete(false);
      setScrollPosition(0);
      return;
    }

    // Animate through the workflow building sequence
    const animateSequence = () => {
      workflowSequence.forEach((step, i) => {
        const baseDelay = i * 1800;
        
        // Step 1: Scroll to category and highlight tool
        setTimeout(() => {
          setCurrentStep(i);
          const tool = toolCategories[step.categoryIndex].tools[step.toolIndex];
          setSelectedTool(tool);
          // Scroll palette to show the category
          setScrollPosition(step.categoryIndex * 60);
        }, baseDelay);

        // Step 2: Start drag animation
        setTimeout(() => {
          setIsDragging(true);
          setDragPosition({ x: 50, y: 0 });
        }, baseDelay + 400);

        // Step 3: Move to canvas
        setTimeout(() => {
          setDragPosition({ x: 150 + i * 50, y: 80 });
        }, baseDelay + 700);

        // Step 4: Drop on canvas
        setTimeout(() => {
          setIsDragging(false);
          const tool = toolCategories[step.categoryIndex].tools[step.toolIndex];
          setPlacedBlocks(prev => [...prev, tool]);
          setSelectedTool(null);
        }, baseDelay + 1100);
      });

      // After all blocks placed, run execution
      const executionDelay = workflowSequence.length * 1800 + 500;
      setTimeout(() => {
        setIsExecuting(true);
        placedBlocks.forEach((_, i) => {
          setTimeout(() => setExecutionStep(i), i * 500);
        });
      }, executionDelay);

      // Show completion
      setTimeout(() => {
        setShowComplete(true);
        setIsExecuting(false);
      }, executionDelay + workflowSequence.length * 500 + 500);
    };

    const timeout = setTimeout(animateSequence, 300);
    return () => clearTimeout(timeout);
  }, [isVisible]);

  // Re-run execution animation when blocks change
  useEffect(() => {
    if (placedBlocks.length === workflowSequence.length && !isExecuting && !showComplete) {
      setTimeout(() => {
        setIsExecuting(true);
        placedBlocks.forEach((_, i) => {
          setTimeout(() => setExecutionStep(i), i * 500);
        });
        setTimeout(() => {
          setShowComplete(true);
          setIsExecuting(false);
        }, placedBlocks.length * 500 + 500);
      }, 400);
    }
  }, [placedBlocks.length]);

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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <GitBranch className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-foreground">Workflow Builder</p>
              <p className="text-[8px] text-muted-foreground">Drag tools to canvas</p>
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
          {/* Tool Palette - Scrollable */}
          <div className="w-24 shrink-0">
            <div className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">
              Tool Palette
            </div>
            <div 
              ref={paletteRef}
              className="h-[140px] overflow-hidden rounded-lg border border-border bg-secondary/30"
            >
              <div 
                className="transition-transform duration-500 ease-out"
                style={{ transform: `translateY(-${scrollPosition}px)` }}
              >
                {toolCategories.map((category, catIndex) => (
                  <div key={category.name} className="p-1.5">
                    <div className="text-[7px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      {category.name}
                    </div>
                    <div className="space-y-0.5">
                      {category.tools.slice(0, 3).map((tool) => {
                        const ToolIcon = tool.icon;
                        const isSelected = selectedTool?.id === tool.id;
                        
                        return (
                          <div
                            key={tool.id}
                            className={cn(
                              "flex items-center gap-1.5 px-1.5 py-1 rounded text-[8px] transition-all duration-300",
                              isSelected 
                                ? "bg-primary/20 border border-primary/40 scale-105 shadow-sm" 
                                : "bg-background/50 border border-transparent hover:bg-background"
                            )}
                          >
                            <div className={cn(
                              "w-4 h-4 rounded flex items-center justify-center shrink-0",
                              tool.color
                            )}>
                              <ToolIcon className="w-2.5 h-2.5 text-white" />
                            </div>
                            <span className="truncate text-foreground">{tool.label}</span>
                          </div>
                        );
                      })}
                      {category.tools.length > 3 && (
                        <div className="text-[7px] text-muted-foreground px-1.5">
                          +{category.tools.length - 3} more...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 min-w-0">
            <div className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">
              Workflow Canvas
            </div>
            <div className="relative h-[140px] rounded-lg border border-dashed border-border bg-secondary/20 p-2 overflow-hidden">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
                backgroundSize: '12px 12px'
              }} />

              {/* Placed blocks */}
              <div className="relative z-10 flex items-start gap-1 flex-wrap">
                {placedBlocks.map((block, i) => {
                  const BlockIcon = block.icon;
                  const isActive = executionStep >= i;
                  const isCurrent = executionStep === i;
                  
                  return (
                    <div key={`${block.id}-${i}`} className="flex items-center">
                      <div
                        className={cn(
                          "flex items-center gap-1 px-1.5 py-1 rounded-lg border-2 transition-all duration-300 animate-scale-in",
                          isActive 
                            ? `${block.color} border-transparent shadow-md` 
                            : "bg-background border-border",
                          isCurrent && "ring-2 ring-offset-1 ring-primary/50"
                        )}
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded flex items-center justify-center",
                          isActive ? "bg-white/20" : block.color
                        )}>
                          {showComplete ? (
                            <Check className="w-3 h-3 text-white" />
                          ) : (
                            <BlockIcon className={cn(
                              "w-3 h-3",
                              isActive ? "text-white" : "text-white",
                              isCurrent && "animate-pulse"
                            )} />
                          )}
                        </div>
                        <span className={cn(
                          "text-[8px] font-medium",
                          isActive ? "text-white" : "text-foreground"
                        )}>
                          {block.label}
                        </span>
                      </div>
                      
                      {i < placedBlocks.length - 1 && (
                        <ArrowRight className={cn(
                          "w-3 h-3 mx-0.5 transition-colors duration-300",
                          executionStep > i ? "text-primary" : "text-muted-foreground/40"
                        )} />
                      )}
                    </div>
                  );
                })}

                {/* Empty state */}
                {placedBlocks.length === 0 && !isDragging && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-[9px] text-muted-foreground">Drop tools here...</p>
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
                    <span className="text-[8px] font-medium text-white">{selectedTool.label}</span>
                  </div>
                  {/* Drag trail */}
                  <div className="absolute top-1/2 right-full w-8 h-0.5 bg-gradient-to-l from-primary to-transparent -translate-y-1/2" />
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-[9px] font-medium">
            <Sparkles className="w-3 h-3" />
            Workflow Built & Executed
          </div>
        </div>
      </div>
    </div>
  );
}
