import { Brain, User, Copy, Check, File, Download, Sparkles, Volume2, Loader2, VolumeX } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Attachment } from "@/lib/ai-stream";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useVoiceAI } from "@/hooks/useVoiceAI";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  attachments?: Attachment[];
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, timestamp, attachments, isStreaming }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const { speak, stop, isPlaying, isLoading } = useVoiceAI();

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content.replace(/\[IMAGE_GENERATED\].*?\[\/IMAGE_GENERATED\]/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Extract generated image from content
  const imageMatch = content.match(/\[IMAGE_GENERATED\](.*?)\[\/IMAGE_GENERATED\]/);
  const generatedImageUrl = imageMatch ? imageMatch[1] : null;
  const textContent = content.replace(/\[IMAGE_GENERATED\].*?\[\/IMAGE_GENERATED\]/g, '').trim();

  const handleDownloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated-image-${Date.now()}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format text naturally without markdown artifacts
  const formatContent = (text: string) => {
    // Clean any remaining markdown artifacts
    const cleanText = text
      .replace(/\*\*/g, '')  // Remove bold markers
      .replace(/\*/g, '')    // Remove italic markers
      .replace(/^#+\s/gm, '') // Remove header markers
      .replace(/^[-•]\s/gm, '') // Remove bullet markers
      .trim();

    return cleanText.split('\n').map((line, i) => (
      <p 
        key={i} 
        className={cn("mb-2 last:mb-0 leading-relaxed", !line.trim() && "h-2")}
      >
        {line || '\u00A0'}
      </p>
    ));
  };

  return (
    <div className={cn(
      "flex gap-4 group animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
      role === 'user' ? "flex-row-reverse" : ""
    )}>
      {/* Avatar */}
      <Avatar className={cn(
        "h-9 w-9 flex-shrink-0 shadow-sm",
        role === 'assistant' 
          ? "ring-1 ring-violet-500/20" 
          : "ring-1 ring-primary/20"
      )}>
        <AvatarFallback className={cn(
          "text-white",
          role === 'assistant' 
            ? "bg-gradient-to-br from-violet-500 to-purple-600" 
            : "bg-gradient-to-br from-primary to-primary/80"
        )}>
          {role === 'assistant' 
            ? <Brain className="w-4 h-4" />
            : <User className="w-4 h-4" />
          }
        </AvatarFallback>
      </Avatar>
      
      {/* Message Bubble */}
      <div className={cn(
        "flex-1 max-w-[85%] relative",
        role === 'user' && "flex flex-col items-end"
      )}>
        {/* Role Label */}
        <span className={cn(
          "text-xs font-medium mb-1.5 block",
          role === 'assistant' ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground"
        )}>
          {role === 'assistant' ? 'AETHER Brain' : 'Vous'}
        </span>

        <div className={cn(
          "p-4 rounded-2xl relative shadow-sm transition-all",
          role === 'assistant' 
            ? "bg-card border border-border/50 rounded-tl-sm" 
            : "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-sm"
        )}>
          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachments.map((att, idx) => (
                <div key={idx} className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg",
                  role === 'assistant' 
                    ? "bg-muted/50 border border-border/50" 
                    : "bg-primary-foreground/10 backdrop-blur-sm"
                )}>
                  {att.type === 'image' ? (
                    <img 
                      src={att.content} 
                      alt={att.name} 
                      className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                      onClick={() => window.open(att.content, '_blank')}
                    />
                  ) : (
                    <>
                      <File className="w-4 h-4" />
                      <span className="text-sm font-medium">{att.name}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Generated Image */}
          {generatedImageUrl && (
            <div className="mb-4">
              <div className="relative group/image inline-block">
                <img 
                  src={generatedImageUrl} 
                  alt="Image générée"
                  className="max-w-full max-h-96 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => window.open(generatedImageUrl, '_blank')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity rounded-xl" />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-3 right-3 opacity-0 group-hover/image:opacity-100 transition-opacity shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadImage(generatedImageUrl);
                  }}
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Télécharger
                </Button>
              </div>
            </div>
          )}
          
          {/* Thinking state when no content yet */}
          {isStreaming && !textContent && !generatedImageUrl && (
            <div className="flex items-center gap-3 py-2">
              <div className="relative">
                <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">Je réfléchis...</span>
                <span className="text-xs text-muted-foreground">Analyse de votre demande en cours</span>
              </div>
            </div>
          )}

          {/* Text Content */}
          {textContent && (
            <div className={cn(
              "text-[15px]",
              role === 'user' && "text-primary-foreground"
            )}>
              {role === 'assistant' ? (
                <>
                  {formatContent(textContent)}
                  {/* Blinking cursor for streaming effect */}
                  {isStreaming && (
                    <span className="inline-block w-[2px] h-[1.1em] bg-violet-500 ml-0.5 animate-pulse align-text-bottom" />
                  )}
                </>
              ) : (
                textContent.split('\n').map((line, i) => (
                  <p key={i} className="mb-1.5 last:mb-0 leading-relaxed">
                    {line || <br />}
                  </p>
                ))
              )}
            </div>
          )}

          {/* Minimal streaming indicator */}
          {isStreaming && textContent && (
            <div className="flex items-center gap-1.5 mt-2 text-violet-500/70">
              <span className="text-xs">En train d'écrire</span>
              <span className="flex gap-0.5">
                <span className="w-1 h-1 bg-violet-500/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-violet-500/70 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                <span className="w-1 h-1 bg-violet-500/70 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
              </span>
            </div>
          )}
          
          {/* Action Buttons for Assistant */}
          {role === 'assistant' && !isStreaming && textContent && (
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted"
                      onClick={() => isPlaying ? stop() : speak(textContent)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                      ) : isPlaying ? (
                        <VolumeX className="w-4 h-4 text-violet-500" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isPlaying ? 'Arrêter' : 'Écouter'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? 'Copié !' : 'Copier'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        {timestamp && !isStreaming && (
          <p className={cn(
            "text-[11px] mt-1.5 font-medium",
            role === 'assistant' ? "text-muted-foreground" : "text-muted-foreground"
          )}>
            {new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}