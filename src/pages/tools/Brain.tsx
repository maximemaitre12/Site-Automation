import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, FileText, Search, Sparkles, Trash2, Loader2, MessageSquarePlus, ChevronRight, Wand2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useBrain } from "@/hooks/useBrain";
import { ChatMessage } from "@/components/brain/ChatMessage";
import { DocumentUploadDialog } from "@/components/brain/DocumentUploadDialog";
import { AIToolsPanel } from "@/components/brain/AIToolsPanel";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function BrainPage() {
  const {
    conversations,
    documents,
    currentConversation,
    loading,
    sendingMessage,
    createConversation,
    sendMessage,
    deleteConversation,
    selectConversation,
    uploadDocument,
    deleteDocument,
    searchDocuments,
    generateProcedure,
    improveText,
    setCurrentConversation
  } = useBrain();

  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDocs, setFilteredDocs] = useState(documents);
  const [showTools, setShowTools] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredDocs(documents);
  }, [documents]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendingMessage) return;
    
    const msg = message;
    setMessage("");
    await sendMessage(msg);
  };

  const handleNewChat = async () => {
    setCurrentConversation(null);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredDocs(documents);
      return;
    }
    const results = await searchDocuments(query);
    setFilteredDocs(results);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "À l'instant";
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-full flex">
        {/* Sidebar */}
        <aside className="w-72 border-r border-border p-4 flex flex-col bg-card/50">
          <Button variant="default" className="w-full mb-4" onClick={handleNewChat}>
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            Nouvelle conversation
          </Button>

          <ScrollArea className="flex-1">
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-2">
                Conversations récentes
              </h3>
              {conversations.length === 0 ? (
                <p className="text-sm text-muted-foreground px-2 py-4">
                  Aucune conversation
                </p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={cn(
                      "group flex items-center justify-between p-3 rounded-lg hover:bg-secondary cursor-pointer transition-colors",
                      currentConversation?.id === conv.id && "bg-secondary"
                    )}
                    onClick={() => selectConversation(conv.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {conv.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(conv.updated_at)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border pt-4 mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2">
                Base de connaissances
              </h3>
              <Badge variant="secondary" className="text-xs">
                {documents.length}
              </Badge>
            </div>
            
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Rechercher..."
                className="pl-8 h-8 text-sm"
              />
            </div>

            <ScrollArea className="h-32">
              <div className="space-y-1">
                {filteredDocs.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-secondary"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-foreground truncate">{doc.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                      onClick={() => deleteDocument(doc.id)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <DocumentUploadDialog onUpload={uploadDocument} />
          </div>
        </aside>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h1 className="text-lg font-semibold text-foreground flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              AETHER Brain
            </h1>
            
            <Sheet open={showTools} onOpenChange={setShowTools}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Outils IA
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Outils IA avancés</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <AIToolsPanel 
                    onGenerateProcedure={generateProcedure}
                    onImproveText={improveText}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </header>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {!currentConversation || currentConversation.messages.length === 0 ? (
                /* Welcome Message */
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-card border border-border">
                    <p className="text-foreground">
                      Bonjour ! Je suis AETHER Brain, votre assistant IA interne. Je peux vous aider avec :
                    </p>
                    <ul className="mt-3 space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-primary" />
                        Rechercher dans votre base de connaissances ({documents.length} documents)
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Générer des procédures et de la documentation
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Répondre à vos questions et améliorer vos textes
                      </li>
                    </ul>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Commencez par me poser une question ou utilisez les outils IA dans le panneau de droite.
                    </p>
                  </div>
                </div>
              ) : (
                currentConversation.messages.map((msg) => (
                  <ChatMessage 
                    key={msg.id} 
                    role={msg.role} 
                    content={msg.content}
                    timestamp={msg.timestamp ? new Date(msg.timestamp) : undefined}
                  />
                ))
              )}
              
              {sendingMessage && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AETHER Brain réfléchit...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Posez une question sur vos documents..."
                  className="flex-1 h-12 bg-card"
                  disabled={sendingMessage}
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={sendingMessage || !message.trim()}
                >
                  {sendingMessage ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
