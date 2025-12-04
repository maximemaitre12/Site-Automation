import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Send, Upload, FileText, Search, Sparkles, User } from "lucide-react";
import { useState } from "react";

const conversations = [
  { id: 1, title: "Project Planning Discussion", time: "2 hours ago" },
  { id: 2, title: "Q4 Strategy Overview", time: "Yesterday" },
  { id: 3, title: "Technical Documentation", time: "3 days ago" },
];

const documents = [
  { name: "Company Handbook.pdf", pages: 45 },
  { name: "Product Roadmap.docx", pages: 12 },
  { name: "Meeting Notes Q4.pdf", pages: 8 },
];

export default function BrainPage() {
  const [message, setMessage] = useState("");

  return (
    <DashboardLayout>
      <div className="h-full flex">
        {/* Sidebar */}
        <aside className="w-72 border-r border-border p-4 flex flex-col">
          <Button variant="hero" className="w-full mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            New Chat
          </Button>

          <div className="flex-1 overflow-y-auto space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-2">Recent</h3>
            {conversations.map((conv) => (
              <button
                key={conv.id}
                className="w-full p-3 rounded-lg hover:bg-secondary text-left transition-colors"
              >
                <p className="text-sm font-medium text-foreground truncate">{conv.title}</p>
                <p className="text-xs text-muted-foreground">{conv.time}</p>
              </button>
            ))}
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-2">Knowledge Base</h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.name} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground truncate">{doc.name}</span>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="px-8 py-4 border-b border-border">
            <h1 className="text-lg font-semibold text-foreground flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              AETHER Brain
            </h1>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Welcome Message */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 p-4 rounded-xl bg-card border border-border">
                  <p className="text-foreground">
                    Hello! I'm AETHER Brain, your internal AI assistant. I can help you with:
                  </p>
                  <ul className="mt-3 space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-primary" />
                      Search across your documents
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Generate procedures and documentation
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Answer questions using your knowledge base
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask anything about your documents..."
                  className="flex-1 h-12 bg-card"
                />
                <Button variant="hero" size="lg">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}