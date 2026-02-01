import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, FileText, Search, Sparkles, Trash2, Loader2, MessageSquarePlus, ChevronRight, Wand2, Database as DatabaseIcon, Image, Paperclip, X, FileImage, File, StopCircle, Globe, Building2, Shield } from "lucide-react";
import { detectIntent } from "@/lib/intent-detector";
import { useState, useRef, useEffect } from "react";
import { useBrain } from "@/hooks/useBrain";
import { useConfidentialMode } from "@/hooks/useConfidentialMode";
import { ChatMessage } from "@/components/brain/ChatMessage";
import { DocumentUploadDialog } from "@/components/brain/DocumentUploadDialog";
import { AIToolsPanel } from "@/components/brain/AIToolsPanel";
import { UniversalSearch } from "@/components/brain/UniversalSearch";
import { KnowledgeHubPanel } from "@/components/brain/KnowledgeHubPanel";
import { ConfidentialModeToggle } from "@/components/brain/ConfidentialModeToggle";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Attachment } from "@/lib/ai-stream";
import { useToast } from "@/hooks/use-toast";
import { AetherDocument } from "@/hooks/useBrain";
import { Database } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function BrainPage() {
  const {
    conversations,
    documents,
    currentConversation,
    streamingContent,
    loading,
    sendingMessage,
    createConversation,
    sendMessage,
    cancelGeneration,
    deleteConversation,
    selectConversation,
    uploadDocument,
    deleteDocument,
    searchDocuments,
    generateProcedure,
    improveText,
    setCurrentConversation,
    addMessageWithoutAI
  } = useBrain();
  const { toast } = useToast();
  const { confidentialMode, toggleConfidentialMode, logConversationEvent } = useConfidentialMode();

  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTools, setShowTools] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [showUniversalSearch, setShowUniversalSearch] = useState(false);
  const [showKnowledgeHub, setShowKnowledgeHub] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localFilteredDocs, setLocalFilteredDocs] = useState<AetherDocument[]>([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Use documents directly when no search, or localFilteredDocs when searching
  const filteredDocs = searchQuery.trim() ? localFilteredDocs : documents;

  useEffect(() => {
    if (currentConversation?.messages || streamingContent) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentConversation?.messages?.length, streamingContent]);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const newAttachments: Attachment[] = [];

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse 10MB`,
          variant: "destructive"
        });
        continue;
      }

      const isImage = file.type.startsWith('image/');
      const isText = file.type.startsWith('text/') || 
                     file.name.endsWith('.txt') || 
                     file.name.endsWith('.md') ||
                     file.name.endsWith('.json') ||
                     file.name.endsWith('.csv');

      if (isImage) {
        const base64 = await fileToBase64(file);
        newAttachments.push({
          type: 'image',
          content: base64,
          name: file.name,
          mimeType: file.type
        });
      } else if (isText) {
        const text = await file.text();
        newAttachments.push({
          type: 'document',
          content: text,
          name: file.name,
          mimeType: file.type
        });
      } else {
        toast({
          title: "Format non supporté",
          description: `${file.name} - Utilisez des images ou fichiers texte`,
          variant: "destructive"
        });
      }
    }

    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && attachments.length === 0) || sendingMessage || generatingImage) return;
    
    // Auto-detect intent from message
    const detectedIntent = detectIntent(message);
    
    // Handle image/chart generation
    if (detectedIntent !== 'chat' && message.trim()) {
      await handleGenerateImage(message, detectedIntent);
      setMessage("");
      setAttachments([]);
      return;
    }
    
    const msg = message || (attachments.length > 0 ? `Analyse ${attachments.length > 1 ? 'ces fichiers' : 'ce fichier'}` : '');
    const currentAttachments = [...attachments];
    
    setMessage("");
    setAttachments([]);
    
    // Log message event for audit trail
    if (currentConversation?.id) {
      logConversationEvent('MESSAGE_SENT', currentConversation.id, { has_attachments: currentAttachments.length > 0 });
    }
    
    await sendMessage(msg, undefined, { 
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
      confidentialMode 
    });
  };

  const handleGenerateImage = async (prompt: string, type: 'image' | 'chart') => {
    if (!prompt.trim()) return;
    
    setGeneratingImage(true);
    setMessage("");
    
    // Add user message WITHOUT triggering AI response
    const userMsg = type === 'image' 
      ? `🎨 Génère une image: ${prompt}` 
      : `📊 Génère un graphique: ${prompt}`;
    
    const conv = await addMessageWithoutAI(userMsg, 'user');
    if (!conv) {
      setGeneratingImage(false);
      toast({
        title: "Erreur",
        description: "Impossible de créer la conversation",
        variant: "destructive"
      });
      return;
    }
    
    const convId = conv.id; // Capture the conversation ID
    
    try {
      const { data, error } = await supabase.functions.invoke('brain-generate-image', {
        body: { prompt, type }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        // Add image response as assistant message (pass conversation ID)
        const imageResponse = `[IMAGE_GENERATED]${data.imageUrl}[/IMAGE_GENERATED]${data.description || 'Image générée avec succès.'}`;
        await addMessageWithoutAI(imageResponse, 'assistant', convId);
        
        toast({
          title: "Image générée",
          description: type === 'chart' ? "Graphique créé avec succès" : "Image créée avec succès"
        });
      } else if (data?.error) {
        await addMessageWithoutAI(`Erreur: ${data.error}`, 'assistant', convId);
        toast({
          title: "Erreur",
          description: data.error,
          variant: "destructive"
        });
      } else {
        // No imageUrl and no error - unexpected response
        await addMessageWithoutAI('La génération n\'a pas retourné d\'image. Réessayez avec un autre prompt.', 'assistant', convId);
        toast({
          title: "Attention",
          description: "Aucune image générée",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Image generation error:', err);
      await addMessageWithoutAI('Désolé, une erreur est survenue lors de la génération.', 'assistant', convId);
      toast({
        title: "Erreur",
        description: "Impossible de générer l'image",
        variant: "destructive"
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleNewChat = async () => {
    setCurrentConversation(null);
    setAttachments([]);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setLocalFilteredDocs([]);
      return;
    }
    const results = await searchDocuments(query);
    setLocalFilteredDocs(results);
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
      <div className="h-full flex flex-col md:flex-row relative overflow-hidden">
        {/* Mobile toggle button */}
        <button
          className="md:hidden fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full bg-agent-brain text-white shadow-lg flex items-center justify-center"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        >
          {showMobileSidebar ? <X className="w-5 h-5" /> : <MessageSquarePlus className="w-5 h-5" />}
        </button>

        {/* Sidebar */}
        <aside className={cn(
          "w-full md:w-64 lg:w-72 border-r border-border p-3 md:p-4 flex flex-col bg-card/50 transition-all h-full overflow-hidden",
          "fixed md:relative inset-0 z-40 md:z-auto md:h-full",
          showMobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <Button variant="default" className="w-full mb-4 bg-agent-brain hover:bg-agent-brain/90" onClick={() => { handleNewChat(); setShowMobileSidebar(false); }}>
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            Nouvelle conversation
          </Button>

          <ScrollArea className="flex-1">
            <div className="space-y-1">
              {conversations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Commencez une nouvelle conversation
                </p>
              ) : (
                <>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-2">
                    Conversations récentes
                  </h3>
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={cn(
                        "group flex items-center justify-between p-2.5 md:p-3 rounded-lg hover:bg-secondary cursor-pointer transition-colors",
                        currentConversation?.id === conv.id && "bg-secondary"
                      )}
                      onClick={() => { selectConversation(conv.id); setShowMobileSidebar(false); }}
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
                        className="opacity-0 group-hover:opacity-100 h-7 w-7 p-0 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conv.id);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </ScrollArea>

          <div className="border-t border-border pt-3 md:pt-4 mt-3 md:mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2">
                AETHER Docs
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

            <ScrollArea className="h-28 md:h-32">
              <div className="space-y-1">
                {filteredDocs.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-secondary"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {doc.file_type?.includes('image') ? (
                        <Image className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-foreground truncate block">{doc.title}</span>
                        {doc.ai_summary && (
                          <span className="text-xs text-muted-foreground truncate block">{doc.ai_summary.slice(0, 40)}...</span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 shrink-0"
                      onClick={() => deleteDocument(doc.id)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                ))}
                {filteredDocs.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    Aucun document dans AETHER Docs
                  </p>
                )}
              </div>
            </ScrollArea>
            
            <DocumentUploadDialog onUpload={uploadDocument} />
          </div>
        </aside>

        {/* Mobile overlay */}
        {showMobileSidebar && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        {/* Main Chat Area */}
        <div 
          className={cn(
            "flex-1 flex flex-col transition-colors min-w-0 overflow-hidden h-full",
            isDragging && "bg-primary/5 ring-2 ring-primary ring-inset"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >

          {/* Chat Messages */}
          {!currentConversation && conversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground text-lg md:text-xl font-medium tracking-tight">
                Comment puis-je vous aider aujourd'hui ?
              </p>
            </div>
          ) : !currentConversation ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground text-base font-medium">
                Sélectionnez une conversation ou démarrez-en une nouvelle.
              </p>
            </div>
          ) : (
            <ScrollArea className="flex-1 min-h-0 px-4 md:px-6">
              <div className="space-y-4 max-w-3xl mx-auto py-4">
                {(currentConversation.messages as Array<{ role: string; content: string }>)?.map((msg, idx) => (
                  <ChatMessage key={idx} role={msg.role as 'user' | 'assistant'} content={msg.content} />
                ))}
                {streamingContent && (
                  <ChatMessage role="assistant" content={streamingContent} isStreaming />
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}

          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center z-20 pointer-events-none">
              <div className="bg-card p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-border">
                <FileImage className="w-14 h-14 text-primary mb-4" />
                <p className="text-xl font-semibold text-foreground">Déposez vos fichiers ici</p>
                <p className="text-sm text-muted-foreground mt-1">Images, texte, documents...</p>
              </div>
            </div>
          )}

          {/* Modern Bottom Input Bar - Apple style */}
          <div className="shrink-0 p-4 md:p-6 bg-gradient-to-t from-background via-background to-background/80">
            <div className="max-w-3xl mx-auto">
              {/* Attachments preview */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {attachments.map((att, idx) => (
                    <div key={idx} className="relative group">
                      {att.type === 'image' ? (
                        <img 
                          src={att.content} 
                          alt={att.name} 
                          className="w-16 h-16 rounded-xl object-cover border border-border shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center border border-border">
                          <File className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <button
                        onClick={() => removeAttachment(idx)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-1.5 py-0.5 truncate rounded-b-xl">
                        {att.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Main input container */}
              <div className={cn(
                "bg-secondary/80 backdrop-blur-xl rounded-2xl border shadow-lg overflow-hidden transition-all",
                confidentialMode ? "border-emerald-500/30 ring-1 ring-emerald-500/20" : "border-border/50"
              )}>
                {/* Confidential mode indicator */}
                {confidentialMode && (
                  <div className="px-3 py-1.5 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-500">Mode Confidentiel activé - Aucune donnée externe</span>
                  </div>
                )}
                {/* Input row */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-3">
                  {/* Confidential mode toggle */}
                  <ConfidentialModeToggle 
                    enabled={confidentialMode} 
                    onToggle={toggleConfidentialMode}
                    compact
                  />
                  
                  {/* File attach button */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileSelect(e.target.files)}
                    multiple
                    accept="image/*,.txt,.md,.json,.csv"
                    className="hidden"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="shrink-0 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/50 transition-colors"
                        >
                          <Paperclip className="w-5 h-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Joindre un fichier</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Posez votre question, demandez une image ou un graphique..."
                    className="flex-1 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground text-base py-2"
                    disabled={sendingMessage || generatingImage}
                  />

                  {(sendingMessage || generatingImage) ? (
                    <button
                      type="button"
                      onClick={cancelGeneration}
                      className="shrink-0 w-10 h-10 rounded-xl bg-destructive text-white flex items-center justify-center hover:bg-destructive/90 transition-colors"
                    >
                      <StopCircle className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!message.trim() && attachments.length === 0}
                      className={cn(
                        "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                        (message.trim() || attachments.length > 0)
                          ? "bg-agent-brain text-white shadow-md shadow-agent-brain/20 hover:shadow-lg hover:shadow-agent-brain/30"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  )}
                </form>
              </div>
              
              {/* Helper text */}
              <p className="text-center text-xs text-muted-foreground mt-3">
                L'IA détecte automatiquement si vous voulez du texte, une image ou un graphique.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
