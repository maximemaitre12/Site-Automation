import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Mail, Phone, Sparkles, User, Building, 
  Loader2, CheckCircle, Copy, History, ChevronRight, Kanban, Target
} from "lucide-react";
import { useState } from "react";
import { useSalesProposals } from "@/hooks/useSalesProposals";
import { CallRecorder } from "@/components/sales/CallRecorder";
import { CallAnalysisResult } from "@/components/sales/CallAnalysisResult";
import { ProposalDisplay } from "@/components/sales/ProposalDisplay";
import { SalesPipeline } from "@/components/sales/SalesPipeline";
import { DealSelector } from "@/components/sales/DealSelector";
import { NegotiationSheetGenerator } from "@/components/sales/NegotiationSheetGenerator";
import { useToast } from "@/hooks/use-toast";
import { SalesDeal } from "@/hooks/useAIIntelligence";
import { BarChart3 as SalesIcon } from "lucide-react";

export default function Sales() {
  const [activeTab, setActiveTab] = useState<"pipeline" | "proposal" | "call" | "email" | "negotiation">("pipeline");
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
  const [selectedCallDeal, setSelectedCallDeal] = useState<SalesDeal | null>(null);

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
      transcript,
      selectedCallDeal?.id
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
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-3 md:px-8 py-3 md:py-6 border-b border-border shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="w-9 h-9 md:w-11 md:h-11 rounded-2xl bg-agent-sales/10 border border-agent-sales/20 flex items-center justify-center shrink-0">
                <SalesIcon className="w-5 h-5 md:w-6 md:h-6 text-agent-sales" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">Sales Copilot</h1>
                <p className="text-muted-foreground text-xs md:text-sm hidden md:block">
                  Propositions IA, analyse d'appels, et emails personnalisés
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="gap-1 md:gap-2 shrink-0 h-8 px-2 md:px-3"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Historique</span>
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 md:gap-2 mt-3 md:mt-6 overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0">
            {[
              { key: "pipeline", label: "Pipeline", icon: Kanban },
              { key: "call", label: "Appels", icon: Phone },
              { key: "negotiation", label: "Négociation", icon: Target },
              { key: "proposal", label: "Proposition", icon: FileText },
              { key: "email", label: "Email", icon: Mail },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`gap-1.5 shrink-0 h-8 px-2.5 md:px-3 text-xs md:text-sm ${activeTab === tab.key ? "bg-[hsl(var(--agent-sales))] hover:bg-[hsl(var(--agent-sales))]/90" : ""}`}
                size="sm"
              >
                <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Form Panel */}
          <div className="flex-1 p-3 md:p-8 overflow-y-auto">
            {activeTab === "pipeline" && (
              <SalesPipeline />
            )}

            {activeTab === "proposal" && (
              <div className="max-w-3xl space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Nom du client *</Label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        id="client" 
                        placeholder="Nom de l'entreprise" 
                        className="pl-10 h-10"
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
                        className="pl-10 h-10"
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
                    className="h-10"
                    value={proposalForm.product}
                    onChange={(e) => setProposalForm(p => ({ ...p, product: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="needs">Besoins & Points de douleur</Label>
                  <Textarea 
                    id="needs" 
                    placeholder="Décrivez les défis et besoins du client..." 
                    className="min-h-[100px] md:min-h-[120px]"
                    value={proposalForm.needs}
                    onChange={(e) => setProposalForm(p => ({ ...p, needs: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objections">Objections potentielles</Label>
                  <Textarea 
                    id="objections" 
                    placeholder="Quelles préoccupations pourraient-ils avoir ?" 
                    className="min-h-[60px] md:min-h-[80px]"
                    value={proposalForm.objections}
                    onChange={(e) => setProposalForm(p => ({ ...p, objections: e.target.value }))}
                  />
                </div>

                <Button 
                  className="w-full bg-[hsl(var(--agent-sales))] hover:bg-[hsl(var(--agent-sales))]/90"
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

                {/* Generated proposal - Visual Display */}
                {generatedProposal && (
                  <ProposalDisplay 
                    proposal={generatedProposal}
                    clientName={proposalForm.client}
                    productName={proposalForm.product}
                    onCopy={() => copyToClipboard(generatedProposal)}
                  />
                )}
              </div>
            )}

            {activeTab === "call" && (
              <div className="max-w-3xl space-y-4 md:space-y-6">
                {/* Deal Selector */}
                <DealSelector
                  selectedDealId={selectedCallDeal?.id || null}
                  onSelectDeal={setSelectedCallDeal}
                />
                
                {selectedCallDeal && (
                  <Card className="border-[hsl(var(--agent-sales))]/30 bg-[hsl(var(--agent-sales))]/5">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{selectedCallDeal.title}</p>
                          <p className="text-xs md:text-sm text-muted-foreground truncate">
                            {selectedCallDeal.contact_name && `${selectedCallDeal.contact_name} • `}
                            {selectedCallDeal.value && `€${selectedCallDeal.value.toLocaleString('fr-FR')}`}
                          </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">{selectedCallDeal.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
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
                    className="h-10"
                    value={callTitle}
                    onChange={(e) => setCallTitle(e.target.value)}
                  />
                </div>

                {/* Transcript textarea */}
                <div className="space-y-2">
                  <Label htmlFor="transcript">
                    Transcript de l'appel
                    {transcript && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {transcript.length} caractères
                      </Badge>
                    )}
                  </Label>
                  <Textarea 
                    id="transcript" 
                    placeholder="Le transcript apparaîtra ici après l'enregistrement, ou collez-le manuellement..." 
                    className="min-h-[150px] md:min-h-[250px] font-mono text-sm"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full bg-[hsl(var(--agent-sales))] hover:bg-[hsl(var(--agent-sales))]/90"
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

            {activeTab === "negotiation" && (
              <div className="max-w-4xl">
                <NegotiationSheetGenerator />
              </div>
            )}

            {activeTab === "email" && (
              <div className="max-w-3xl space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-2">
                    <Label>Type d'email</Label>
                    <select 
                      className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-foreground text-sm"
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
                      className="w-full h-10 rounded-lg bg-secondary border border-border px-3 text-foreground text-sm"
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
                    className="min-h-[120px] md:min-h-[150px]"
                    value={emailForm.context}
                    onChange={(e) => setEmailForm(f => ({ ...f, context: e.target.value }))}
                  />
                </div>

                <Button 
                  className="w-full bg-[hsl(var(--agent-sales))] hover:bg-[hsl(var(--agent-sales))]/90"
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
                  <Card className="mt-6 border-[hsl(var(--agent-sales))]/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base md:text-lg flex items-center gap-2">
                          <Mail className="w-5 h-5 text-[hsl(var(--agent-sales))]" />
                          Email généré
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedEmail)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copier
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 md:p-4 bg-secondary rounded-lg whitespace-pre-wrap text-sm">
                        {generatedEmail}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* History Sidebar */}
          {showHistory && (
            <aside className="w-72 md:w-80 border-l border-border bg-card/50 p-4 overflow-hidden hidden md:block">
              <h3 className="font-semibold text-foreground mb-4">Historique</h3>
              <ScrollArea className="h-[calc(100%-2rem)]">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Propositions récentes</h4>
                    {proposals.slice(0, 5).map(p => (
                      <div key={p.id} className="p-3 rounded-lg bg-secondary/50 mb-2 cursor-pointer hover:bg-secondary">
                        <p className="text-sm font-medium truncate">{p.prospect_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.product_name}</p>
                      </div>
                    ))}
                    {proposals.length === 0 && (
                      <p className="text-xs text-muted-foreground">Aucune proposition</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Analyses d'appels</h4>
                    {callAnalyses.slice(0, 5).map(c => (
                      <div 
                        key={c.id} 
                        className="p-3 rounded-lg bg-secondary/50 mb-2 cursor-pointer hover:bg-secondary"
                        onClick={() => setCurrentAnalysis(c)}
                      >
                        <p className="text-sm font-medium truncate">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.sentiment}</p>
                      </div>
                    ))}
                    {callAnalyses.length === 0 && (
                      <p className="text-xs text-muted-foreground">Aucune analyse</p>
                    )}
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
