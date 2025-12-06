import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, FileText, Mail, Phone, Sparkles, User, Building, 
  Loader2, CheckCircle, Copy, History, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { useSalesProposals } from "@/hooks/useSalesProposals";
import { CallRecorder } from "@/components/sales/CallRecorder";
import { CallAnalysisResult } from "@/components/sales/CallAnalysisResult";
import { useToast } from "@/hooks/use-toast";

export default function Sales() {
  const [activeTab, setActiveTab] = useState<"proposal" | "call" | "email">("proposal");
  const { 
    proposals, 
    callAnalyses, 
    loading, 
    generateProposal, 
    analyzeCall, 
    generateEmail 
  } = useSalesProposals();
  const { toast } = useToast();

  // Proposal form state
  const [proposalForm, setProposalForm] = useState({
    client: '',
    contact: '',
    product: '',
    needs: '',
    objections: ''
  });
  const [generatingProposal, setGeneratingProposal] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);

  // Call analysis state
  const [callTitle, setCallTitle] = useState('');
  const [transcript, setTranscript] = useState('');
  const [analyzingCall, setAnalyzingCall] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);

  // Email form state
  const [emailForm, setEmailForm] = useState({
    type: 'Follow-up',
    tone: 'Professional',
    context: ''
  });
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<string | null>(null);

  // Sidebar state
  const [showHistory, setShowHistory] = useState(false);

  const handleGenerateProposal = async () => {
    if (!proposalForm.client || !proposalForm.product) {
      toast({ 
        title: 'Champs requis', 
        description: 'Veuillez remplir le nom du client et le produit',
        variant: 'destructive'
      });
      return;
    }

    setGeneratingProposal(true);
    const result = await generateProposal({
      prospectName: proposalForm.client,
      productName: proposalForm.product,
      persona: `${proposalForm.contact}\n\nBesoins: ${proposalForm.needs}`,
      objections: proposalForm.objections
    });
    
    if (result?.generated_proposal) {
      setGeneratedProposal(result.generated_proposal);
    }
    setGeneratingProposal(false);
  };

  const handleAnalyzeCall = async () => {
    if (!transcript.trim()) {
      toast({ 
        title: 'Transcript requis', 
        description: 'Veuillez enregistrer ou coller un transcript d\'appel',
        variant: 'destructive'
      });
      return;
    }

    setAnalyzingCall(true);
    const result = await analyzeCall(
      callTitle || `Appel du ${new Date().toLocaleDateString('fr-FR')}`,
      transcript
    );
    
    if (result) {
      setCurrentAnalysis(result);
    }
    setAnalyzingCall(false);
  };

  const handleGenerateEmail = async () => {
    if (!emailForm.context.trim()) {
      toast({ 
        title: 'Contexte requis', 
        description: 'Veuillez décrire le contexte de l\'email',
        variant: 'destructive'
      });
      return;
    }

    setGeneratingEmail(true);
    const result = await generateEmail('', emailForm.type, emailForm.tone, emailForm.context);
    if (result) {
      setGeneratedEmail(result);
    }
    setGeneratingEmail(false);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: 'Copié', description: 'Contenu copié dans le presse-papiers' });
  };

  const handleTranscriptReady = (text: string) => {
    setTranscript(text);
    toast({ title: 'Transcript prêt', description: 'Vous pouvez maintenant analyser l\'appel' });
  };

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
              <p className="text-muted-foreground mt-1">
                Propositions IA, analyse d'appels, et emails personnalisés
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              Historique
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { key: "proposal", label: "Générer Proposition", icon: FileText },
              { key: "call", label: "Analyser Appel", icon: Phone },
              { key: "email", label: "Rédiger Email", icon: Mail },
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
        <div className="flex-1 flex overflow-hidden">
          {/* Form Panel */}
          <div className="flex-1 p-8 overflow-y-auto">
            {activeTab === "proposal" && (
              <div className="max-w-3xl space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Nom du client *</Label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        id="client" 
                        placeholder="Nom de l'entreprise" 
                        className="pl-10"
                        value={proposalForm.client}
                        onChange={(e) => setProposalForm(p => ({ ...p, client: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Personne de contact</Label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        id="contact" 
                        placeholder="Décideur" 
                        className="pl-10"
                        value={proposalForm.contact}
                        onChange={(e) => setProposalForm(p => ({ ...p, contact: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product">Produit / Service *</Label>
                  <Input 
                    id="product" 
                    placeholder="Que vendez-vous ?"
                    value={proposalForm.product}
                    onChange={(e) => setProposalForm(p => ({ ...p, product: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="needs">Besoins & Points de douleur</Label>
                  <Textarea 
                    id="needs" 
                    placeholder="Décrivez les défis et besoins du client..." 
                    className="min-h-[120px]"
                    value={proposalForm.needs}
                    onChange={(e) => setProposalForm(p => ({ ...p, needs: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objections">Objections potentielles</Label>
                  <Textarea 
                    id="objections" 
                    placeholder="Quelles préoccupations pourraient-ils avoir ?" 
                    className="min-h-[80px]"
                    value={proposalForm.objections}
                    onChange={(e) => setProposalForm(p => ({ ...p, objections: e.target.value }))}
                  />
                </div>

                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={handleGenerateProposal}
                  disabled={generatingProposal}
                >
                  {generatingProposal ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Générer Proposition
                    </>
                  )}
                </Button>

                {/* Generated proposal */}
                {generatedProposal && (
                  <Card className="border-primary/30 bg-primary/5">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          Proposition générée
                        </CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(generatedProposal)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                          {generatedProposal}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "call" && (
              <div className="max-w-3xl space-y-6">
                {/* Call Recorder Component */}
                <CallRecorder 
                  onTranscriptReady={handleTranscriptReady}
                />

                {/* Call title */}
                <div className="space-y-2">
                  <Label htmlFor="callTitle">Titre de l'appel</Label>
                  <Input 
                    id="callTitle" 
                    placeholder="Ex: Appel découverte - Acme Corp"
                    value={callTitle}
                    onChange={(e) => setCallTitle(e.target.value)}
                  />
                </div>

                {/* Transcript textarea */}
                <div className="space-y-2">
                  <Label htmlFor="transcript">
                    Transcript de l'appel
                    {transcript && (
                      <Badge variant="secondary" className="ml-2">
                        {transcript.length} caractères
                      </Badge>
                    )}
                  </Label>
                  <Textarea 
                    id="transcript" 
                    placeholder="Le transcript apparaîtra ici après l'enregistrement, ou collez-le manuellement..." 
                    className="min-h-[250px] font-mono text-sm"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                  />
                </div>

                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={handleAnalyzeCall}
                  disabled={analyzingCall || !transcript.trim()}
                >
                  {analyzingCall ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyser l'appel
                    </>
                  )}
                </Button>

                {/* Analysis result */}
                {currentAnalysis && (
                  <CallAnalysisResult 
                    analysis={currentAnalysis}
                    onClose={() => setCurrentAnalysis(null)}
                  />
                )}
              </div>
            )}

            {activeTab === "email" && (
              <div className="max-w-3xl space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type d'email</Label>
                    <select 
                      className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-foreground"
                      value={emailForm.type}
                      onChange={(e) => setEmailForm(f => ({ ...f, type: e.target.value }))}
                    >
                      <option>Follow-up</option>
                      <option>Introduction</option>
                      <option>Résumé proposition</option>
                      <option>Closing</option>
                      <option>Relance</option>
                      <option>Remerciement</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ton</Label>
                    <select 
                      className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-foreground"
                      value={emailForm.tone}
                      onChange={(e) => setEmailForm(f => ({ ...f, tone: e.target.value }))}
                    >
                      <option>Professionnel</option>
                      <option>Amical</option>
                      <option>Urgent</option>
                      <option>Formel</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="context">Contexte *</Label>
                  <Textarea 
                    id="context" 
                    placeholder="Décrivez brièvement la situation et ce que vous voulez communiquer..." 
                    className="min-h-[150px]"
                    value={emailForm.context}
                    onChange={(e) => setEmailForm(f => ({ ...f, context: e.target.value }))}
                  />
                </div>

                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={handleGenerateEmail}
                  disabled={generatingEmail}
                >
                  {generatingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Générer Email
                    </>
                  )}
                </Button>

                {/* Generated email */}
                {generatedEmail && (
                  <Card className="border-primary/30 bg-primary/5">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          Email généré
                        </CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(generatedEmail)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                          {generatedEmail}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* History Sidebar */}
          {showHistory && (
            <aside className="w-96 border-l border-border bg-card/30 flex flex-col">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Historique</h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                  {/* Recent Proposals */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Propositions récentes
                    </h4>
                    <div className="space-y-2">
                      {proposals.slice(0, 5).map((p) => (
                        <div 
                          key={p.id} 
                          className="p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-all cursor-pointer"
                          onClick={() => {
                            setActiveTab('proposal');
                            if (p.generated_proposal) setGeneratedProposal(p.generated_proposal);
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-foreground truncate">
                              {p.prospect_name || 'Sans nom'}
                            </span>
                            {p.prospect_score && (
                              <Badge variant="outline" className={
                                p.prospect_score >= 80 
                                  ? "bg-success/20 text-success border-success/30" 
                                  : "bg-warning/20 text-warning border-warning/30"
                              }>
                                {p.prospect_score}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{p.product_name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(p.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      ))}
                      {proposals.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          Aucune proposition
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Recent Call Analyses */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Analyses d'appels
                    </h4>
                    <div className="space-y-2">
                      {callAnalyses.slice(0, 5).map((c) => (
                        <div 
                          key={c.id} 
                          className="p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-all cursor-pointer"
                          onClick={() => {
                            setActiveTab('call');
                            setCurrentAnalysis(c);
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-foreground truncate">
                              {c.title}
                            </span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                          {c.sentiment && (
                            <Badge variant="outline" className={
                              c.sentiment === 'positif' 
                                ? "bg-success/20 text-success border-success/30"
                                : c.sentiment === 'négatif'
                                ? "bg-destructive/20 text-destructive border-destructive/30"
                                : "bg-warning/20 text-warning border-warning/30"
                            }>
                              {c.sentiment}
                            </Badge>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(c.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      ))}
                      {callAnalyses.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          Aucune analyse
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </aside>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
