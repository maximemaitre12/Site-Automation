import { Brain, User, Copy, Check, FileImage, File } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Attachment } from "@/lib/ai-stream";

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  attachments?: Attachment[];
}

export function ChatMessage({ role, content, timestamp, attachments }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "flex gap-4 group",
      role === 'user' ? "flex-row-reverse" : ""
    )}>
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
        role === 'assistant' 
          ? "bg-gradient-to-br from-violet-500 to-purple-400" 
          : "bg-primary"
      )}>
        {role === 'assistant' 
          ? <Brain className="w-4 h-4 text-white" />
          : <User className="w-4 h-4 text-primary-foreground" />
        }
      </div>
      
      <div className={cn(
        "flex-1 p-4 rounded-xl relative",
        role === 'assistant' 
          ? "bg-card border border-border" 
          : "bg-primary text-primary-foreground"
      )}>
        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((att, idx) => (
              <div key={idx} className={cn(
                "flex items-center gap-2 px-2 py-1 rounded-md",
                role === 'assistant' ? "bg-muted" : "bg-primary-foreground/10"
              )}>
                {att.type === 'image' ? (
                  <>
                    <img 
                      src={att.content} 
                      alt={att.name} 
                      className="w-16 h-16 rounded object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(att.content, '_blank')}
                    />
                  </>
                ) : (
                  <>
                    <File className="w-4 h-4" />
                    <span className="text-sm">{att.name}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {content.split('\n').map((line, i) => (
            <p key={i} className={cn(
              "mb-2 last:mb-0",
              role === 'user' && "text-primary-foreground"
            )}>
              {line || <br />}
            </p>
          ))}
        </div>
        
        {role === 'assistant' && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
        )}
        
        {timestamp && (
          <p className={cn(
            "text-xs mt-2",
            role === 'assistant' ? "text-muted-foreground" : "text-primary-foreground/70"
          )}>
            {new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}
