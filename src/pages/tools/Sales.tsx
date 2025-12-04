import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, FileText, Mail, Phone, Download, Sparkles, User, Building } from "lucide-react";
import { useState } from "react";

const proposals = [
  { id: 1, client: "Acme Corp", product: "Enterprise Suite", score: 85, date: "Today" },
  { id: 2, client: "TechStart Inc", product: "Pro Plan", score: 72, date: "Yesterday" },
  { id: 3, client: "Global Services", product: "Custom Solution", score: 91, date: "3 days ago" },
];

export default function Sales() {
  const [activeTab, setActiveTab] = useState<"proposal" | "call" | "email">("proposal");

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Sales Copilot
              </h1>
              <p className="text-muted-foreground mt-1">AI-powered sales proposals and prospect scoring</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { key: "proposal", label: "Generate Proposal", icon: FileText },
              { key: "call", label: "Analyze Call", icon: Phone },
              { key: "email", label: "Draft Email", icon: Mail },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className="gap-2"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Form Panel */}
          <div className="flex-1 p-8">
            {activeTab === "proposal" && (
              <div className="max-w-2xl space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client Name</Label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="client" placeholder="Company name" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Person</Label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="contact" placeholder="Decision maker" className="pl-10" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product">Product / Service</Label>
                  <Input id="product" placeholder="What are you selling?" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="needs">Client Needs & Pain Points</Label>
                  <Textarea id="needs" placeholder="Describe the client's challenges and requirements..." className="min-h-[120px]" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objections">Potential Objections</Label>
                  <Textarea id="objections" placeholder="What concerns might they have?" className="min-h-[80px]" />
                </div>

                <Button variant="hero" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Proposal
                </Button>
              </div>
            )}

            {activeTab === "call" && (
              <div className="max-w-2xl space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="transcript">Call Transcript</Label>
                  <Textarea 
                    id="transcript" 
                    placeholder="Paste the call transcript here for AI analysis..." 
                    className="min-h-[300px]"
                  />
                </div>
                <Button variant="hero" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Call
                </Button>
              </div>
            )}

            {activeTab === "email" && (
              <div className="max-w-2xl space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email Type</Label>
                    <select className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-foreground">
                      <option>Follow-up</option>
                      <option>Introduction</option>
                      <option>Proposal Summary</option>
                      <option>Closing</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <select className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-foreground">
                      <option>Professional</option>
                      <option>Friendly</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="context">Context</Label>
                  <Textarea id="context" placeholder="Brief context about the situation..." className="min-h-[150px]" />
                </div>
                <Button variant="hero" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Email
                </Button>
              </div>
            )}
          </div>

          {/* Recent Proposals */}
          <aside className="w-80 border-l border-border p-6 bg-card/30">
            <h3 className="font-semibold text-foreground mb-4">Recent Proposals</h3>
            <div className="space-y-3">
              {proposals.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{p.client}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      p.score >= 80 ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                    }`}>
                      {p.score}% match
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.product}</p>
                  <p className="text-xs text-muted-foreground mt-1">{p.date}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}