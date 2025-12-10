import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, FileText, Search, Sparkles, Trash2, Loader2, MessageSquarePlus, ChevronRight, Wand2, Database, Image, Paperclip, X, FileImage, File, ImagePlus, BarChart3, StopCircle, Globe } from "lucide-react";
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
  const [filteredDocs, setFilteredDocs] = useState<AetherDocument[]>([]);
  const [showTools, setShowTools] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generationMode, setGenerationMode] = useState<'chat' | 'image' | 'chart'>('chat');
  const [showUniversalSearch, setShowUniversalSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilteredDocs(documents);
  }, [documents]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, streamingContent]);

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

            <ScrollArea className="h-32">
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
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
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

        {/* Main Chat Area */}
        <div 
          className={cn(
            "flex-1 flex flex-col transition-colors",
            isDragging && "bg-primary/5 ring-2 ring-primary ring-inset"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Header */}
          <header className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-foreground flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                AETHER Brain
              </h1>
              
              <TooltipProvider>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary">
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
            
            <Sheet open={showUniversalSearch} onOpenChange={setShowUniversalSearch}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="mr-2">
                  <Globe className="w-4 h-4 mr-2" />
                  Recherche IA
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[600px] sm:w-[800px]">
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

          {/* Drop Zone Overlay */}
          {isDragging && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
              <div className="flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed border-primary bg-card">
                <Paperclip className="w-12 h-12 text-primary" />
                <p className="text-lg font-medium">Déposez vos fichiers ici</p>
                <p className="text-sm text-muted-foreground">Images, documents texte, PDF...</p>
              </div>
            </div>
          )}

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
                    <p className="text-foreground font-medium">
                      Bonjour ! Je suis AETHER Brain, votre assistant IA polyvalent.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Image className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm">Analyse d'images</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Photos, captures, graphiques, schémas...</p>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm">Analyse de documents</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Texte, markdown, CSV, JSON...</p>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Database className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm">Base de connaissances</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{documents.length} documents internes</p>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm">Génération & amélioration</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Procédures, textes, synthèses...</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Glissez-déposez des fichiers ou utilisez le bouton 📎 pour ajouter des pièces jointes.
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
                    attachments={msg.attachments}
                  />
                ))
              )}
              
              {/* Streaming response */}
              {sendingMessage && streamingContent && (
                <ChatMessage 
                  role="assistant" 
                  content={streamingContent}
                  isStreaming={true}
                />
              )}
              
              {/* Loading indicator when no content yet */}
              {sendingMessage && !streamingContent && (
                <ChatMessage 
                  role="assistant" 
                  content=""
                  isStreaming={true}
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="max-w-3xl mx-auto space-y-3">
              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 rounded-lg bg-muted/50">
                  {attachments.map((att, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-card border border-border"
                    >
                      {att.type === 'image' ? (
                        <>
                          <img 
                            src={att.content} 
                            alt={att.name} 
                            className="w-8 h-8 rounded object-cover"
                          />
                          <span className="text-sm truncate max-w-[120px]">{att.name}</span>
                        </>
                      ) : (
                        <>
                          <File className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm truncate max-w-[120px]">{att.name}</span>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={() => removeAttachment(idx)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <form onSubmit={handleSendMessage}>
                {/* Generation Mode Buttons */}
                <div className="flex items-center gap-2 mb-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant={generationMode === 'image' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setGenerationMode(generationMode === 'image' ? 'chat' : 'image')}
                          disabled={sendingMessage || generatingImage}
                        >
                          <ImagePlus className="w-4 h-4 mr-1" />
                          Image
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Générer une image avec l'IA</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant={generationMode === 'chart' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setGenerationMode(generationMode === 'chart' ? 'chat' : 'chart')}
                          disabled={sendingMessage || generatingImage}
                        >
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Graphique
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Générer un graphique avec l'IA</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {generationMode !== 'chat' && (
                    <Badge variant="secondary" className="ml-auto">
                      Mode: {generationMode === 'image' ? '🎨 Image' : '📊 Graphique'}
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.txt,.md,.json,.csv"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 flex-shrink-0"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={generationMode !== 'chat'}
                        >
                          <Paperclip className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ajouter des fichiers</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      generationMode === 'image' 
                        ? "Décrivez l'image à générer..." 
                        : generationMode === 'chart'
                          ? "Décrivez le graphique à créer..."
                          : sendingMessage 
                            ? "Tapez votre prochain message..."
                            : "Posez une question, glissez une image..."
                    }
                    className="flex-1 h-12 bg-card"
                    disabled={generatingImage}
                  />
                  {/* Stop button when generating */}
                  {sendingMessage && (
                    <Button 
                      type="button"
                      size="lg"
                      variant="destructive"
                      onClick={cancelGeneration}
                      className="flex-shrink-0"
                    >
                      <StopCircle className="w-5 h-5" />
                    </Button>
                  )}
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={generatingImage || (!message.trim() && attachments.length === 0)}
                    className="flex-shrink-0"
                  >
                    {generatingImage ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : generationMode !== 'chat' ? (
                      <Sparkles className="w-5 h-5" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
