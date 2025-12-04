import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Clock, FileSearch, Sparkles, Download, Trash2 } from "lucide-react";
import { useState } from "react";

const documents = [
  { id: 1, name: "Q4 Financial Report.pdf", type: "PDF", size: "2.4 MB", status: "analyzed", date: "2 hours ago" },
  { id: 2, name: "Contract_Draft_v2.docx", type: "Word", size: "156 KB", status: "processing", date: "5 min ago" },
  { id: 3, name: "Meeting Notes.pdf", type: "PDF", size: "89 KB", status: "analyzed", date: "1 day ago" },
  { id: 4, name: "Invoice_March.pdf", type: "PDF", size: "234 KB", status: "analyzed", date: "3 days ago" },
];

export default function Docs() {
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                AETHER Docs
              </h1>
              <p className="text-muted-foreground mt-1">Intelligent document processing with OCR and AI analysis</p>
            </div>
            <Button variant="hero" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Documents List */}
          <div className="flex-1 p-8">
            <div className="grid gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedDoc === doc.id
                      ? "bg-primary/5 border-primary/30"
                      : "bg-card border-border hover:border-primary/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-400/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {doc.type} · {doc.size} · {doc.date}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      doc.status === "analyzed"
                        ? "bg-success/20 text-success"
                        : "bg-warning/20 text-warning"
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Zone */}
            <div className="mt-8 p-8 rounded-2xl border-2 border-dashed border-border bg-card/30 text-center">
              <Upload className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">Drop files here</h3>
              <p className="text-sm text-muted-foreground mb-4">Support for PDF, Word, Images</p>
              <Button variant="outline">Browse Files</Button>
            </div>
          </div>

          {/* Document Preview Panel */}
          {selectedDoc && (
            <aside className="w-96 border-l border-border p-6 bg-card/30">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Document Analysis</h3>
                  <div className="p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">AI Summary</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This document contains financial data for Q4 2024, including revenue reports, 
                      expense breakdowns, and profit margin analysis across all departments.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Extracted Data</h4>
                  <div className="space-y-2">
                    {[
                      { label: "Total Revenue", value: "$2.4M" },
                      { label: "Net Profit", value: "$890K" },
                      { label: "Date Range", value: "Oct - Dec 2024" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="text-sm font-medium text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}