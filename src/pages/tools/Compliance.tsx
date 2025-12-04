import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Shield, AlertTriangle, CheckCircle, Download, Sparkles, FileText } from "lucide-react";
import { useState } from "react";

const audits = [
  { id: 1, name: "Privacy Policy Review", score: 85, risks: 2, date: "Dec 1, 2024" },
  { id: 2, name: "Data Processing Audit", score: 72, risks: 5, date: "Nov 28, 2024" },
  { id: 3, name: "Cookie Consent Check", score: 95, risks: 1, date: "Nov 25, 2024" },
];

export default function Compliance() {
  const [text, setText] = useState("");

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-gray-400 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                AETHER Compliance
              </h1>
              <p className="text-muted-foreground mt-1">Automated GDPR audit and compliance risk detection</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Audit Form */}
          <div className="flex-1 p-8">
            <div className="max-w-2xl">
              <h2 className="text-lg font-semibold text-foreground mb-4">New Compliance Audit</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Audit Type</Label>
                  <select className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-foreground">
                    <option>GDPR Compliance</option>
                    <option>Privacy Policy Review</option>
                    <option>Data Processing Analysis</option>
                    <option>Cookie Consent Audit</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Text or Process to Analyze</Label>
                  <Textarea
                    id="content"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste the text, policy, or describe the process you want to audit for compliance..."
                    className="min-h-[250px]"
                  />
                </div>

                <Button variant="hero" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Run Compliance Audit
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Audits */}
          <aside className="w-96 border-l border-border p-6 bg-card/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Recent Audits</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>

            <div className="space-y-3">
              {audits.map((audit) => (
                <div key={audit.id} className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{audit.name}</h4>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      audit.score >= 90 ? "bg-success/20 text-success" :
                      audit.score >= 70 ? "bg-warning/20 text-warning" :
                      "bg-destructive/20 text-destructive"
                    }`}>
                      {audit.score}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {audit.risks} risks
                    </span>
                    <span>{audit.date}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="subtle" size="sm" className="flex-1">
                      <FileText className="w-3 h-3 mr-1" />
                      View Report
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Compliance Tips */}
            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <h4 className="font-medium text-foreground">Quick Tips</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Include clear data retention policies</li>
                <li>• Document all third-party processors</li>
                <li>• Ensure consent mechanisms are explicit</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}