import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3, Upload, TrendingUp, TrendingDown, AlertTriangle, Download, Sparkles, Loader2, Trash2, MessageSquare } from "lucide-react";
import { useInsights } from "@/hooks/useInsights";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Insights() {
  const { datasets, loading, createDataset, analyzeDataset, askQuestion, deleteDataset, parseCSV } = useInsights();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  
  // Form state
  const [datasetName, setDatasetName] = useState("");
  const [csvContent, setCsvContent] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedData = datasets.find(d => d.id === selectedDataset);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      if (!datasetName) {
        setDatasetName(file.name.replace('.csv', ''));
      }
    };
    reader.readAsText(file);
  };

  const handleCreate = async () => {
    if (!datasetName || !csvContent) return;
    setIsCreating(true);
    const dataset = await createDataset(datasetName, csvContent);
    if (dataset) {
      setSelectedDataset(dataset.id);
      // Auto-analyze
      await analyzeDataset(dataset.id, csvContent);
    }
    setDatasetName("");
    setCsvContent("");
    setDialogOpen(false);
    setIsCreating(false);
  };

  const handleAnalyze = async (datasetId: string) => {
    // For re-analysis, we'd need the original CSV content
    // For now, show a message that we need to re-upload
    setIsAnalyzing(datasetId);
    // Simulate analysis with existing data
    setTimeout(() => setIsAnalyzing(null), 2000);
  };

  const handleAskQuestion = async () => {
    if (!selectedDataset || !question || !csvContent) return;
    setIsAsking(true);
    const result = await askQuestion(selectedDataset, question, csvContent);
    if (result) setAnswer(result);
    setIsAsking(false);
  };

  const exportReport = () => {
    if (!selectedData) return;
    const report = {
      name: selectedData.name,
      summary: selectedData.ai_summary,
      insights: selectedData.ai_insights,
      anomalies: selectedData.anomalies,
      recommendations: selectedData.recommendations,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedData.name}_report.json`;
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                AETHER Insights
              </h1>
              <p className="text-muted-foreground mt-1">Business intelligence et analytics prédictifs par IA</p>
            </div>
            <div className="flex gap-3">
              {selectedData && (
                <Button variant="outline" onClick={exportReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero">
                    <Upload className="w-4 h-4 mr-2" />
                    Importer CSV
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Importer un dataset</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <Input placeholder="Nom du dataset" value={datasetName} onChange={(e) => setDatasetName(e.target.value)} />
                    
                    <div 
                      className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Cliquez pour sélectionner un fichier CSV</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                    
                    {csvContent && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">
                          {parseCSV(csvContent).rowCount} lignes détectées
                        </p>
                      </div>
                    )}
                    
                    <Textarea
                      placeholder="Ou collez directement votre CSV ici..."
                      value={csvContent}
                      onChange={(e) => setCsvContent(e.target.value)}
                      className="min-h-[150px] font-mono text-sm"
                    />
                    
                    <Button onClick={handleCreate} disabled={isCreating || !datasetName || !csvContent} className="w-full">
                      {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                      {isCreating ? 'Import et analyse...' : 'Importer et analyser'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Datasets List */}
          <div className="w-80 border-r border-border p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold text-foreground mb-4">Datasets ({datasets.length})</h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : datasets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Aucun dataset</p>
              </div>
            ) : (
              <div className="space-y-2">
                {datasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedDataset === dataset.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border bg-card hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedDataset(dataset.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-foreground text-sm">{dataset.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {dataset.row_count} lignes · {dataset.column_count} colonnes
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={(e) => { e.stopPropagation(); deleteDataset(dataset.id); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Analysis Panel */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedData ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground">{selectedData.name}</h2>

                {/* Summary */}
                {selectedData.ai_summary && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Résumé exécutif
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedData.ai_summary}</p>
                  </div>
                )}

                {/* Insights */}
                {selectedData.ai_insights && Array.isArray(selectedData.ai_insights) && selectedData.ai_insights.length > 0 && (
                  <div className="p-4 rounded-xl bg-card border border-border">
                    <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      Insights clés
                    </h3>
                    <ul className="space-y-2">
                      {(selectedData.ai_insights as string[]).map((insight, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Anomalies */}
                {selectedData.anomalies && Array.isArray(selectedData.anomalies) && selectedData.anomalies.length > 0 && (
                  <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                    <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      Anomalies détectées
                    </h3>
                    <ul className="space-y-2">
                      {(selectedData.anomalies as any[]).map((anomaly, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                          {typeof anomaly === 'string' ? anomaly : anomaly.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {selectedData.recommendations && Array.isArray(selectedData.recommendations) && selectedData.recommendations.length > 0 && (
                  <div className="p-4 rounded-xl bg-card border border-border">
                    <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-primary" />
                      Recommandations
                    </h3>
                    <ul className="space-y-2">
                      {(selectedData.recommendations as string[]).map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Q&A Section */}
                <div className="p-4 rounded-xl bg-card border border-border">
                  <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Posez une question
                  </h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: Quel est le produit le plus vendu ?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAskQuestion} disabled={isAsking || !question}>
                      {isAsking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    </Button>
                  </div>
                  {answer && (
                    <div className="mt-4 p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{answer}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Sélectionnez ou importez un dataset</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
