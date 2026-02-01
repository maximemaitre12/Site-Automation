import { useRef, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ShieldAlert, Lock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfidentialMessage {
  role: 'user' | 'assistant';
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
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, streamingContent]);

  // Hide warning after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowWarning(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("flex-1 flex flex-col relative", className)}>
      {/* Security watermark overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-[0.03]">
        <div className="text-center transform -rotate-12">
          <ShieldAlert className="w-32 h-32 mx-auto" />
          <p className="text-2xl font-bold uppercase tracking-widest mt-2">CONFIDENTIEL</p>
        </div>
      </div>

      {/* Initial warning */}
      {showWarning && messages.length === 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 max-w-md backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-500 text-sm">Mode Ultra-Confidentiel</h4>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Aucune donnée stockée en base</li>
                  <li>• Session effacée après 15 min d'inactivité</li>
                  <li>• Changement d'onglet = effacement auto</li>
                  <li>• L'IA n'accède pas à Internet</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 px-4 md:px-6">
        <div className="space-y-4 max-w-3xl mx-auto py-4">
          {messages.length === 0 && !streamingContent && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
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
          
          {messages.map((msg, idx) => (
            <ChatMessage 
              key={idx} 
              role={msg.role} 
              content={msg.content}
            />
          ))}
          
          {streamingContent && (
            <ChatMessage role="assistant" content={streamingContent} isStreaming />
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Bottom security indicator */}
      <div className="px-4 py-2 flex items-center justify-center gap-2 text-xs text-muted-foreground border-t border-red-500/20 bg-red-500/5">
        <Lock className="w-3 h-3 text-red-500" />
        <span>Cette conversation n'est pas enregistrée</span>
      </div>
    </div>
  );
}
