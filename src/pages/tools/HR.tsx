import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Users, Upload, FileText, Star, Sparkles, Mail, UserCheck } from "lucide-react";

const candidates = [
  { id: 1, name: "Sarah Chen", role: "Senior Developer", score: 92, status: "interview", skills: ["React", "Node.js", "AWS"] },
  { id: 2, name: "Marcus Johnson", role: "Product Manager", score: 85, status: "screening", skills: ["Agile", "Strategy", "UX"] },
  { id: 3, name: "Emily Rodriguez", role: "Designer", score: 78, status: "new", skills: ["Figma", "UI/UX", "Branding"] },
];

export default function HR() {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                HR Copilot
              </h1>
              <p className="text-muted-foreground mt-1">Resume analysis, candidate matching and HR automation</p>
            </div>
            <Button variant="hero">
              <Upload className="w-4 h-4 mr-2" />
              Upload CV
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Candidates List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Candidates</h2>
              
              {candidates.map((candidate) => (
                <div key={candidate.id} className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center text-white font-semibold">
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground">{candidate.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10">
                            <Star className="w-4 h-4 text-primary fill-primary" />
                            <span className="text-sm font-semibold text-primary">{candidate.score}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            candidate.status === "interview" ? "bg-success/20 text-success" :
                            candidate.status === "screening" ? "bg-warning/20 text-warning" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {candidate.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {candidate.skills.map((skill) => (
                          <span key={skill} className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="subtle" size="sm">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Analysis
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="w-3 h-3 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all text-left">
                  <FileText className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-medium text-foreground">Generate Job Post</h3>
                  <p className="text-sm text-muted-foreground">AI-powered job descriptions</p>
                </button>
                
                <button className="w-full p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all text-left">
                  <UserCheck className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-medium text-foreground">Match Candidates</h3>
                  <p className="text-sm text-muted-foreground">Find best fits for open roles</p>
                </button>
                
                <button className="w-full p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all text-left">
                  <Sparkles className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-medium text-foreground">Interview Analysis</h3>
                  <p className="text-sm text-muted-foreground">Analyze interview transcripts</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}