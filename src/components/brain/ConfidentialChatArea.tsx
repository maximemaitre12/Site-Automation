import { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfidentialMessage {
  role: string;
  content: string;
}

interface ConfidentialChatAreaProps {
  messages: ConfidentialMessage[];
  streamingContent?: string;
  className?: string;
}

export function ConfidentialChatArea({ 
  messages, 
  streamingContent,
  className 
}: ConfidentialChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, streamingContent]);

  const hasContent = messages.length > 0 || (streamingContent && streamingContent.length > 0);

  return (
    <div className={cn("flex-1 flex flex-col items-center justify-center", className)}>
      <div className="w-full max-w-3xl px-4 md:px-6">
        {!hasContent && (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-red-500/10 mb-4">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              Session Confidentielle
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Vos messages ne seront pas enregistrés. L'IA utilise uniquement vos documents internes.
            </p>
          </div>
        )}
        
        {hasContent && (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <ChatMessage 
                key={idx} 
                role={msg.role as 'user' | 'assistant'} 
                content={msg.content}
              />
            ))}
            
            {streamingContent && streamingContent.length > 0 && (
              <ChatMessage role="assistant" content={streamingContent} isStreaming />
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
