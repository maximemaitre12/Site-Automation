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
  Plus, Loader2, Trash2, Send, RefreshCw, X
} from "lucide-react";
import { MessageSquare as SupportIcon } from "lucide-react";
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
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-3 md:px-8 py-3 md:py-6 border-b border-border shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="w-9 h-9 md:w-11 md:h-11 rounded-2xl bg-agent-support/10 border border-agent-support/20 flex items-center justify-center shrink-0">
                <SupportIcon className="w-5 h-5 md:w-6 md:h-6 text-agent-support" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold text-foreground leading-tight">Support Copilot</h1>
                <p className="text-muted-foreground text-xs md:text-sm hidden md:block">
                  Classification et réponses automatiques IA
                </p>
              </div>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-agent-support hover:bg-agent-support/90 gap-2 h-9">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nouveau ticket</span>
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email client</Label>
                    <Input
                      type="email"
                      placeholder="client@example.com"
                      value={newTicket.customerEmail}
                      onChange={(e) => setNewTicket(t => ({ ...t, customerEmail: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea
                      placeholder="Décrivez le problème en détail..."
                      className="min-h-[120px]"
                      value={newTicket.content}
                      onChange={(e) => setNewTicket(t => ({ ...t, content: e.target.value }))}
                    />
                  </div>
                  <Button 
                    onClick={handleCreateTicket} 
                    disabled={creating || !newTicket.subject.trim() || !newTicket.content.trim()}
                    className="w-full bg-agent-support hover:bg-agent-support/90"
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

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 mt-3 md:mt-6">
            <div className="p-3 md:p-4 rounded-2xl bg-card border border-border flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-warning" />
              </div>
              <div className="min-w-0">
                <p className="text-base md:text-2xl font-bold text-foreground tabular-nums">{stats.open}</p>
                <p className="text-[11px] md:text-sm text-muted-foreground">Ouverts</p>
              </div>
            </div>
            <div className="p-3 md:p-4 rounded-2xl bg-card border border-border flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-success" />
              </div>
              <div className="min-w-0">
                <p className="text-base md:text-2xl font-bold text-foreground tabular-nums">{stats.resolved}</p>
                <p className="text-[11px] md:text-sm text-muted-foreground">Résolus</p>
              </div>
            </div>
            <div className="p-3 md:p-4 rounded-2xl bg-card border border-border flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-agent-support" />
              </div>
              <div className="min-w-0">
                <p className="text-base md:text-2xl font-bold text-foreground tabular-nums">{stats.resolutionRate}%</p>
                <p className="text-[11px] md:text-sm text-muted-foreground">Taux résolu</p>
              </div>
            </div>
            <div className="p-3 md:p-4 rounded-2xl bg-card border border-border flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-destructive" />
              </div>
              <div className="min-w-0">
                <p className="text-base md:text-2xl font-bold text-foreground tabular-nums">{stats.critical}</p>
                <p className="text-[11px] md:text-sm text-muted-foreground">Critiques</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Tickets List */}
          <div className={cn(
            "flex-1 p-3 md:p-6 overflow-y-auto",
            selectedTicket && "hidden md:block md:w-1/2"
          )}>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-base md:text-lg font-semibold text-foreground">
                Tickets ({tickets.length})
              </h2>
            </div>

            {tickets.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Aucun ticket</h3>
                <p className="text-muted-foreground mb-4">Créez votre premier ticket support</p>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-agent-support hover:bg-agent-support/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau ticket
                </Button>
              </div>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {tickets.map((ticket) => (
                  <Card 
                    key={ticket.id} 
                    className={cn(
                      "cursor-pointer transition-all hover:border-agent-support/30",
                      selectedTicket?.id === ticket.id && "border-agent-support ring-1 ring-agent-support/20"
                    )}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setEditedResponse(ticket.ai_suggested_response || '');
                    }}
                  >
                    <CardContent className="p-3 md:p-4">
                      <div className="flex items-start gap-2 md:gap-4">
                        <div className={cn(
                          "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0",
                          getPriorityColor(ticket.priority)
                        )}>
                          {ticket.status === "resolved" 
                            ? <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                            : ticket.ai_suggested_response
                            ? <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                            : <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 md:mb-1 flex-wrap">
                            <span className="text-xs md:text-sm font-mono text-muted-foreground">
                              {ticket.ticket_number}
                            </span>
                            {ticket.category && (
                              <Badge variant="secondary" className="text-[10px] md:text-xs">
                                {ticket.category}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-medium text-foreground text-sm md:text-base leading-snug line-clamp-2">
                            {ticket.subject}
                          </h3>
                          {ticket.content && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {ticket.content}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <Badge className={cn("text-[10px] md:text-xs", getStatusColor(ticket.status))}>
                            {ticket.status === 'open' ? 'Ouvert' : 
                             ticket.status === 'resolved' ? 'Résolu' : 
                             ticket.status === 'in_progress' ? 'En cours' : ticket.status}
                          </Badge>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">
                            {formatTime(ticket.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      {ticket.ai_suggested_response && ticket.status !== 'resolved' && (
                        <div className="mt-2 md:mt-3 p-2 md:p-3 rounded-xl bg-agent-support/5 border border-agent-support/20">
                          <p className="text-xs md:text-sm text-foreground line-clamp-2">
                            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 inline mr-1.5 md:mr-2 text-agent-support" />
                            Réponse IA générée - Cliquez pour voir et envoyer
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
            <div className="w-full md:w-1/2 border-l border-border flex flex-col bg-card/50">
              <div className="p-3 md:p-4 border-b border-border flex items-center justify-between shrink-0">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-mono">{selectedTicket.ticket_number}</p>
                  <h3 className="font-semibold text-foreground truncate">{selectedTicket.subject}</h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTicket(selectedTicket.id)}
                    className="h-8 w-8 p-0 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTicket(null)}
                    className="h-8 w-8 p-0 md:hidden"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-3 md:p-4">
                {/* Ticket Info */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Classification IA</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedTicket.category && (
                        <Badge variant="outline">{selectedTicket.category}</Badge>
                      )}
                      {selectedTicket.priority && (
                        <Badge className={getPriorityColor(selectedTicket.priority)}>
                          {selectedTicket.priority}
                        </Badge>
                      )}
                      {selectedTicket.ai_classification?.sentiment && (
                        <Badge variant="secondary">{selectedTicket.ai_classification.sentiment}</Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Message du client</Label>
                    <div className="mt-1 p-3 rounded-lg bg-muted/50 text-sm">
                      {selectedTicket.content}
                    </div>
                  </div>

                  {selectedTicket.customer_email && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Email client</Label>
                      <p className="text-sm mt-1">{selectedTicket.customer_email}</p>
                    </div>
                  )}

                  {/* AI Response Section */}
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-muted-foreground flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-agent-support" />
                        Réponse IA
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateResponse(selectedTicket)}
                        disabled={generatingResponse === selectedTicket.id}
                        className="h-7 text-xs"
                      >
                        {generatingResponse === selectedTicket.id ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Génération...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1" />
                            {editedResponse ? 'Régénérer' : 'Générer'}
                          </>
                        )}
                      </Button>
                    </div>

                    <Textarea
                      value={editedResponse}
                      onChange={(e) => setEditedResponse(e.target.value)}
                      placeholder="Cliquez sur 'Générer' pour créer une réponse IA..."
                      className="min-h-[200px] text-sm"
                    />

                    {selectedTicket.status !== 'resolved' && (
                      <Button
                        onClick={handleSendResponse}
                        disabled={sendingResponse || !editedResponse.trim()}
                        className="w-full mt-3 bg-agent-support hover:bg-agent-support/90"
                      >
                        {sendingResponse ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Envoi...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Envoyer et résoudre
                          </>
                        )}
                      </Button>
                    )}

                    {selectedTicket.status === 'resolved' && selectedTicket.actual_response && (
                      <div className="mt-3 p-3 rounded-lg bg-success/10 border border-success/20">
                        <p className="text-xs text-success font-medium mb-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Réponse envoyée
                        </p>
                        <p className="text-sm text-foreground">{selectedTicket.actual_response}</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
