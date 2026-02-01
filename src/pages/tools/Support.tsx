import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  MessageSquare, Sparkles, AlertCircle, CheckCircle, Clock, 
  Plus, Loader2, Trash2, Send, RefreshCw, X, Headphones, TrendingUp
} from "lucide-react";
import { useSupport, SupportTicket } from "@/hooks/useSupport";
import { cn } from "@/lib/utils";

export default function Support() {
  const { 
    tickets, 
    loading, 
    createTicket, 
    generateResponse, 
    resolveTicket, 
    deleteTicket,
    getStats 
  } = useSupport();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', content: '', customerEmail: '' });
  const [creating, setCreating] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [generatingResponse, setGeneratingResponse] = useState<string | null>(null);
  const [sendingResponse, setSendingResponse] = useState(false);
  const [editedResponse, setEditedResponse] = useState('');

  const stats = getStats();

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.content.trim()) return;
    setCreating(true);
    const ticket = await createTicket(newTicket);
    if (ticket) {
      setNewTicket({ subject: '', content: '', customerEmail: '' });
      setIsCreateOpen(false);
    }
    setCreating(false);
  };

  const handleGenerateResponse = async (ticket: SupportTicket) => {
    setGeneratingResponse(ticket.id);
    const response = await generateResponse(ticket.id);
    if (response) {
      setEditedResponse(response);
      setSelectedTicket({ ...ticket, ai_suggested_response: response });
    }
    setGeneratingResponse(null);
  };

  const handleSendResponse = async () => {
    if (!selectedTicket || !editedResponse.trim()) return;
    setSendingResponse(true);
    await resolveTicket(selectedTicket.id, editedResponse);
    setSelectedTicket(null);
    setEditedResponse('');
    setSendingResponse(false);
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'critical': return 'bg-destructive/20 text-destructive';
      case 'high': return 'bg-orange-500/20 text-orange-600';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'open': return 'bg-warning/20 text-warning';
      case 'in_progress': return 'bg-agent-support/15 text-agent-support';
      case 'resolved': return 'bg-success/20 text-success';
      case 'closed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return "Hier";
    return `Il y a ${days} jours`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-agent-support" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Spacing below header */}
      <div className="h-3 shrink-0" />
      
      <div className={cn(
        "h-full flex flex-col bg-gradient-to-b from-background to-background/95",
        tickets.length === 0 ? "overflow-hidden" : "overflow-hidden"
      )}>

        {/* Stats Cards */}
        <div className="px-4 md:px-8 pb-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="group p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 hover:border-warning/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.open}</p>
                    <p className="text-xs text-muted-foreground">Ouverts</p>
                  </div>
                </div>
              </div>
              <div className="group p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 hover:border-success/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.resolved}</p>
                    <p className="text-xs text-muted-foreground">Résolus</p>
                  </div>
                </div>
              </div>
              <div className="group p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 hover:border-agent-support/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-agent-support/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-agent-support" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.resolutionRate}%</p>
                    <p className="text-xs text-muted-foreground">Taux résolu</p>
                  </div>
                </div>
              </div>
              <div className="group p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/50 hover:border-destructive/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.critical}</p>
                    <p className="text-xs text-muted-foreground">Critiques</p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex px-4 md:px-8",
          tickets.length > 0 ? "overflow-hidden" : "overflow-visible"
        )}>
          <div className="max-w-6xl mx-auto w-full flex gap-6">
            {/* Tickets List */}
            <div 
              className={cn(
                "flex-1 pb-6",
                tickets.length > 0 ? "overflow-y-auto" : "overflow-visible",
                selectedTicket && "hidden md:block md:w-1/2"
              )}
              onClick={(e) => {
                if (e.target === e.currentTarget && selectedTicket) {
                  setSelectedTicket(null);
                  setEditedResponse('');
                }
              }}
            >
              {tickets.length > 0 && (
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Tickets ({tickets.length})
                  </h2>
                  <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gradient-to-r from-agent-support to-agent-support/80 hover:from-agent-support/90 hover:to-agent-support/70 rounded-xl shadow-lg shadow-agent-support/20">
                        <Plus className="w-4 h-4 mr-1" />
                        Nouveau ticket
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Créer un ticket</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Sujet *</Label>
                          <Input
                            placeholder="Ex: Problème de connexion"
                            value={newTicket.subject}
                            onChange={(e) => setNewTicket(t => ({ ...t, subject: e.target.value }))}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email client</Label>
                          <Input
                            type="email"
                            placeholder="client@example.com"
                            value={newTicket.customerEmail}
                            onChange={(e) => setNewTicket(t => ({ ...t, customerEmail: e.target.value }))}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description *</Label>
                          <Textarea
                            placeholder="Décrivez le problème en détail..."
                            className="min-h-[120px] rounded-xl"
                            value={newTicket.content}
                            onChange={(e) => setNewTicket(t => ({ ...t, content: e.target.value }))}
                          />
                        </div>
                        <Button 
                          onClick={handleCreateTicket} 
                          disabled={creating || !newTicket.subject.trim() || !newTicket.content.trim()}
                          className="w-full bg-agent-support hover:bg-agent-support/90 rounded-xl"
                        >
                          {creating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Création & classification IA...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Créer et classifier
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {tickets.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Aucun ticket</h3>
                  <p className="text-muted-foreground mb-4">Créez votre premier ticket support</p>
                  <Button onClick={() => setIsCreateOpen(true)} className="bg-agent-support hover:bg-agent-support/90 rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau ticket
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <Card 
                      key={ticket.id} 
                      className={cn(
                        "cursor-pointer transition-all rounded-2xl border-border/50 hover:border-agent-support/30 hover:shadow-lg group",
                        selectedTicket?.id === ticket.id && "border-agent-support ring-2 ring-agent-support/20"
                      )}
                      onClick={() => {
                        if (selectedTicket?.id === ticket.id) {
                          setSelectedTicket(null);
                          setEditedResponse('');
                        } else {
                          setSelectedTicket(ticket);
                          setEditedResponse(ticket.ai_suggested_response || '');
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            getPriorityColor(ticket.priority)
                          )}>
                            {ticket.status === "resolved" 
                              ? <CheckCircle className="w-5 h-5" />
                              : ticket.ai_suggested_response
                              ? <Sparkles className="w-5 h-5" />
                              : <AlertCircle className="w-5 h-5" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-xs font-mono text-muted-foreground">
                                {ticket.ticket_number}
                              </span>
                              {ticket.category && (
                                <Badge variant="secondary" className="text-xs rounded-full">
                                  {ticket.category}
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-medium text-foreground leading-snug line-clamp-2">
                              {ticket.subject}
                            </h3>
                            {ticket.content && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {ticket.content}
                              </p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <Badge className={cn("text-xs rounded-full", getStatusColor(ticket.status))}>
                              {ticket.status === 'open' ? 'Ouvert' : 
                               ticket.status === 'resolved' ? 'Résolu' : 
                               ticket.status === 'in_progress' ? 'En cours' : ticket.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatTime(ticket.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        {ticket.ai_suggested_response && ticket.status !== 'resolved' && (
                          <div className="mt-3 p-3 rounded-xl bg-agent-support/5 border border-agent-support/20">
                            <p className="text-sm text-foreground flex items-center">
                              <Sparkles className="w-4 h-4 mr-2 text-agent-support" />
                              Réponse IA générée - Cliquez pour voir
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Ticket Detail Panel */}
            {selectedTicket && (
              <div className="w-full md:w-1/2 border-l border-border/50 flex flex-col bg-card/30 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border/50 flex items-center justify-between shrink-0">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-mono">{selectedTicket.ticket_number}</p>
                    <h3 className="font-semibold text-foreground truncate">{selectedTicket.subject}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        await deleteTicket(selectedTicket.id);
                        setSelectedTicket(null);
                        setEditedResponse('');
                      }}
                      className="h-8 w-8 p-0 text-destructive rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTicket(null)}
                      className="h-8 w-8 p-0 md:hidden rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Classification IA</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedTicket.category && (
                          <Badge variant="outline" className="rounded-full">{selectedTicket.category}</Badge>
                        )}
                        {selectedTicket.priority && (
                          <Badge className={cn("rounded-full", getPriorityColor(selectedTicket.priority))}>
                            {selectedTicket.priority}
                          </Badge>
                        )}
                        {selectedTicket.ai_classification?.sentiment && (
                          <Badge variant="secondary" className="rounded-full">{selectedTicket.ai_classification.sentiment}</Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Message du client</Label>
                      <div className="mt-1 p-4 rounded-xl bg-muted/50 text-sm">
                        {selectedTicket.content}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs text-muted-foreground">Réponse IA</Label>
                        {selectedTicket.status !== 'resolved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateResponse(selectedTicket)}
                            disabled={generatingResponse === selectedTicket.id}
                            className="h-7 text-xs rounded-lg"
                          >
                            {generatingResponse === selectedTicket.id ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3 h-3 mr-1" />
                            )}
                            Régénérer
                          </Button>
                        )}
                      </div>
                      
                      {selectedTicket.status === 'resolved' ? (
                        <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                          <div className="flex items-center gap-2 text-success mb-2">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Ticket résolu</span>
                          </div>
                          <p className="text-sm text-foreground">
                            {selectedTicket.ai_suggested_response}
                          </p>
                        </div>
                      ) : editedResponse ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editedResponse}
                            onChange={(e) => setEditedResponse(e.target.value)}
                            className="min-h-[150px] rounded-xl"
                            placeholder="Modifiez la réponse si nécessaire..."
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={handleSendResponse}
                              disabled={sendingResponse || !editedResponse.trim()}
                              className="flex-1 bg-agent-support hover:bg-agent-support/90 rounded-xl"
                            >
                              {sendingResponse ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4 mr-2" />
                              )}
                              Envoyer et résoudre
                            </Button>
                            <Button
                              variant="outline"
                              onClick={async () => {
                                await resolveTicket(selectedTicket.id, "Problème résolu par le client");
                                setSelectedTicket(null);
                                setEditedResponse('');
                              }}
                              className="rounded-xl border-success/30 text-success hover:bg-success/10"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Résolu
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full rounded-xl"
                            onClick={() => handleGenerateResponse(selectedTicket)}
                            disabled={generatingResponse === selectedTicket.id}
                          >
                            {generatingResponse === selectedTicket.id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Génération en cours...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Générer une réponse IA
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={async () => {
                              await resolveTicket(selectedTicket.id, "Problème résolu par le client");
                              setSelectedTicket(null);
                              setEditedResponse('');
                            }}
                            className="w-full rounded-xl border-success/30 text-success hover:bg-success/10"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mon problème est résolu
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
