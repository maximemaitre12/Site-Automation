import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Play, History, Settings, Workflow, Mail, Globe, FileText, Sparkles, ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";

const blocks = [
  { type: "trigger", name: "Email Received", icon: Mail, color: "from-blue-500 to-cyan-400" },
  { type: "trigger", name: "Webhook", icon: Globe, color: "from-green-500 to-emerald-400" },
  { type: "trigger", name: "File Upload", icon: FileText, color: "from-purple-500 to-pink-400" },
  { type: "action", name: "AI Summary", icon: Sparkles, color: "from-indigo-500 to-blue-400" },
  { type: "action", name: "Extract Data", icon: FileText, color: "from-yellow-500 to-orange-400" },
  { type: "action", name: "Send Email", icon: Mail, color: "from-rose-500 to-red-400" },
];

const workflows = [
  { id: 1, name: "Invoice Processing", status: "active", runs: 234, lastRun: "2 min ago" },
  { id: 2, name: "Email Triage", status: "active", runs: 1289, lastRun: "5 min ago" },
  { id: 3, name: "Document Analysis", status: "paused", runs: 89, lastRun: "1 hour ago" },
];

export default function Flow() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<number | null>(null);

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Workflow className="w-5 h-5 text-white" />
                </div>
                AETHER Flow
              </h1>
              <p className="text-muted-foreground mt-1">Visual workflow automation with drag & drop</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button variant="hero" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Workflow
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Sidebar - Workflows List */}
          <aside className="w-72 border-r border-border p-4 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground px-2 mb-4">Your Workflows</h3>
            {workflows.map((workflow) => (
              <button
                key={workflow.id}
                onClick={() => setSelectedWorkflow(workflow.id)}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  selectedWorkflow === workflow.id
                    ? "bg-primary/10 border border-primary/30"
                    : "hover:bg-secondary border border-transparent"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground text-sm">{workflow.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    workflow.status === "active" 
                      ? "bg-success/20 text-success" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {workflow.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {workflow.runs} runs · Last: {workflow.lastRun}
                </div>
              </button>
            ))}
          </aside>

          {/* Canvas Area */}
          <div className="flex-1 p-8 bg-background/50">
            {selectedWorkflow ? (
              <div className="h-full flex flex-col">
                {/* Workflow Controls */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    {workflows.find(w => w.id === selectedWorkflow)?.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="hero" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Run Workflow
                    </Button>
                  </div>
                </div>

                {/* Visual Canvas */}
                <div className="flex-1 rounded-2xl border-2 border-dashed border-border bg-card/30 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      {[0, 1, 2].map((i) => {
                        const Icon = blocks[i].icon;
                        return (
                          <div key={i} className="flex items-center">
                            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${blocks[i].color} flex items-center justify-center shadow-lg`}>
                              <Icon className="w-7 h-7 text-white" />
                            </div>
                            {i < 2 && <ArrowRight className="w-5 h-5 text-muted-foreground mx-2" />}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Drag blocks from the panel to build your workflow
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <Workflow className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Select a workflow</h3>
                  <p className="text-muted-foreground text-sm mb-4">Choose a workflow from the list or create a new one</p>
                  <Button variant="hero">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Workflow
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Blocks Panel */}
          <aside className="w-64 border-l border-border p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Available Blocks</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Triggers</h4>
                <div className="space-y-2">
                  {blocks.filter(b => b.type === "trigger").map((block) => (
                    <div
                      key={block.name}
                      className="p-3 rounded-lg bg-card border border-border hover:border-primary/50 cursor-grab transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${block.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <block.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{block.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">AI Actions</h4>
                <div className="space-y-2">
                  {blocks.filter(b => b.type === "action").map((block) => (
                    <div
                      key={block.name}
                      className="p-3 rounded-lg bg-card border border-border hover:border-primary/50 cursor-grab transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${block.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <block.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{block.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}