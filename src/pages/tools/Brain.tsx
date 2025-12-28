import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, FileText, Search, Sparkles, Trash2, Loader2, MessageSquarePlus, ChevronRight, Wand2, Database, Image, Paperclip, X, FileImage, File, ImagePlus, BarChart3, StopCircle, Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useBrain } from "@/hooks/useBrain";
import { ChatMessage } from "@/components/brain/ChatMessage";
import { DocumentUploadDialog } from "@/components/brain/DocumentUploadDialog";
import { AIToolsPanel } from "@/components/brain/AIToolsPanel";
import { UniversalSearch } from "@/components/brain/UniversalSearch";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Attachment } from "@/lib/ai-stream";
import { useToast } from "@/hooks/use-toast";
import { AetherDocument } from "@/hooks/useBrain";
import agentBrainLogo from "@/assets/agent-brain.png";

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
    setCurrentConversation
  } = useBrain();
  const { toast } = useToast();

  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTools, setShowTools] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generationMode, setGenerationMode] = useState<'chat' | 'image' | 'chart'>('chat');
  const [showUniversalSearch, setShowUniversalSearch] = useState(false);
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
    
    // Handle image/chart generation
    if (generationMode !== 'chat' && message.trim()) {
      await handleGenerateImage(message, generationMode);
      return;
    }
    
    const msg = message || (attachments.length > 0 ? `Analyse ${attachments.length > 1 ? 'ces fichiers' : 'ce fichier'}` : '');
    const currentAttachments = [...attachments];
    
    setMessage("");
    setAttachments([]);
    
    await sendMessage(msg, undefined, { attachments: currentAttachments.length > 0 ? currentAttachments : undefined });
  };

  const handleGenerateImage = async (prompt: string, type: 'image' | 'chart') => {
    if (!prompt.trim()) return;
    
    setGeneratingImage(true);
    setMessage("");
    
    // Add user message to conversation
    const userMsg = type === 'image' 
      ? `🎨 Génère une image: ${prompt}` 
      : `📊 Génère un graphique: ${prompt}`;
    
    await sendMessage(userMsg, undefined);
    
    try {
      const { data, error } = await supabase.functions.invoke('brain-generate-image', {
        body: { prompt, type }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        // Add image response as a special message
        await sendMessage(`[IMAGE_GENERATED]${data.imageUrl}[/IMAGE_GENERATED]${data.description || 'Image générée avec succès.'}`, undefined);
        toast({
          title: "Image générée",
          description: type === 'chart' ? "Graphique créé avec succès" : "Image créée avec succès"
        });
      } else if (data?.error) {
        toast({
          title: "Erreur",
          description: data.error,
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Image generation error:', err);
      toast({
        title: "Erreur",
        description: "Impossible de générer l'image",
        variant: "destructive"
      });
    } finally {
      setGeneratingImage(false);
      setGenerationMode('chat');
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
          className="md:hidden fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full bg-[hsl(var(--agent-brain))] text-white shadow-lg flex items-center justify-center"
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        >
          {showMobileSidebar ? <X className="w-5 h-5" /> : <MessageSquarePlus className="w-5 h-5" />}
        </button>

        {/* Sidebar */}
        <aside className={cn(
          "w-full md:w-64 lg:w-72 border-r border-border p-3 md:p-4 flex flex-col bg-card/50 transition-all",
          "fixed md:relative inset-0 z-40 md:z-auto",
          showMobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <Button variant="default" className="w-full mb-4 bg-[hsl(var(--agent-brain))] hover:bg-[hsl(var(--agent-brain))]/90" onClick={() => { handleNewChat(); setShowMobileSidebar(false); }}>
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
                ))
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
            "flex-1 flex flex-col transition-colors min-w-0 overflow-hidden",
            isDragging && "bg-primary/5 ring-2 ring-primary ring-inset"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Header */}
          <header className="px-3 md:px-6 py-3 md:py-4 border-b border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
              <h1 className="text-base md:text-lg font-semibold text-foreground flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={agentBrainLogo} alt="Brain" className="w-full h-full object-cover" />
                </div>
                <span className="hidden sm:inline">AETHER Brain</span>
              </h1>
              
              <TooltipProvider>
                <div className="hidden md:flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[hsl(var(--agent-brain))]/10 text-[hsl(var(--agent-brain))]">
                        <Database className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{documents.length} docs</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Documents internes disponibles</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600">
                        <Image className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Vision</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Analyse d'images activée</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center gap-1 md:gap-2 shrink-0">
              <Sheet open={showUniversalSearch} onOpenChange={setShowUniversalSearch}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2 md:px-3">
                    <Globe className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Recherche IA</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:w-[600px] md:w-[800px]">
                  <SheetHeader>
                    <SheetTitle>Recherche Universelle IA</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 h-[calc(100vh-120px)]">
                    <UniversalSearch />
                  </div>
                </SheetContent>
              </Sheet>
              
              <Sheet open={showTools} onOpenChange={setShowTools}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2 md:px-3">
                    <Wand2 className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Outils IA</span>
                    <ChevronRight className="w-4 h-4 ml-1 hidden md:inline" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:w-[400px] md:w-[540px]">
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
            </div>
          </header>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 px-3 md:px-6 py-4">
            {!currentConversation && conversations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center mb-4 overflow-hidden">
                  <img src={agentBrainLogo} alt="Brain" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">Bienvenue sur AETHER Brain</h2>
                <p className="text-muted-foreground max-w-md text-sm md:text-base">
                  Votre assistant IA intelligent. Posez des questions, analysez des documents, ou générez des images.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {['💬 Chat', '🖼️ Images', '📊 Charts', '📄 Documents'].map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-[hsl(var(--agent-brain))]/10 text-[hsl(var(--agent-brain))] text-xs md:text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : !currentConversation ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center mb-4 overflow-hidden">
                  <img src={agentBrainLogo} alt="Brain" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">Nouvelle conversation</h2>
                <p className="text-muted-foreground text-sm md:text-base">Commencez à discuter ou sélectionnez une conversation.</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {(currentConversation.messages as Array<{ role: string; content: string }>)?.map((msg, idx) => (
                  <ChatMessage key={idx} role={msg.role as 'user' | 'assistant'} content={msg.content} />
                ))}
                {streamingContent && (
                  <ChatMessage role="assistant" content={streamingContent} isStreaming />
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-20 pointer-events-none">
              <div className="bg-card p-6 md:p-8 rounded-2xl shadow-xl flex flex-col items-center">
                <FileImage className="w-10 h-10 md:w-12 md:h-12 text-primary mb-2" />
                <p className="text-base md:text-lg font-semibold text-foreground">Déposez vos fichiers ici</p>
                <p className="text-sm text-muted-foreground">Images, texte, documents...</p>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-border px-3 md:px-6 py-3 md:py-4 shrink-0">
            {/* Attachments preview */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {attachments.map((att, idx) => (
                  <div key={idx} className="relative group">
                    {att.type === 'image' ? (
                      <img 
                        src={att.content} 
                        alt={att.name} 
                        className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover border border-border"
                      />
                    ) : (
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-secondary flex items-center justify-center border border-border">
                        <File className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <button
                      onClick={() => removeAttachment(idx)}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 truncate rounded-b-lg">
                      {att.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Mode selector */}
            <div className="flex items-center gap-1 md:gap-2 mb-3">
              <TooltipProvider>
                {[
                  { mode: 'chat' as const, icon: Sparkles, label: 'Chat' },
                  { mode: 'image' as const, icon: ImagePlus, label: 'Image' },
                  { mode: 'chart' as const, icon: BarChart3, label: 'Chart' },
                ].map(({ mode, icon: Icon, label }) => (
                  <Tooltip key={mode}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={generationMode === mode ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setGenerationMode(mode)}
                        className={cn(
                          "h-8 px-2 md:px-3",
                          generationMode === mode && "bg-[hsl(var(--agent-brain))] hover:bg-[hsl(var(--agent-brain))]/90"
                        )}
                      >
                        <Icon className="w-4 h-4 md:mr-1" />
                        <span className="hidden md:inline text-xs">{label}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>

            <form onSubmit={handleSendMessage} className="flex items-end gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files)}
                multiple
                accept="image/*,.txt,.md,.json,.csv"
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 h-10 w-10"
              >
                <Paperclip className="w-5 h-5" />
              </Button>

              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    generationMode === 'image' 
                      ? "Décrivez l'image à générer..." 
                      : generationMode === 'chart'
                      ? "Décrivez le graphique à générer..."
                      : "Posez votre question..."
                  }
                  className="pr-12 h-10 md:h-11 text-sm md:text-base"
                  disabled={sendingMessage || generatingImage}
                />
              </div>

              {(sendingMessage || generatingImage) ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={cancelGeneration}
                  className="shrink-0 h-10 w-10"
                >
                  <StopCircle className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={!message.trim() && attachments.length === 0}
                  className="shrink-0 h-10 w-10 bg-[hsl(var(--agent-brain))] hover:bg-[hsl(var(--agent-brain))]/90"
                >
                  <Send className="w-5 h-5" />
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
