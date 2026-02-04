import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, Send, Loader2, Sparkles, TrendingUp, Target, 
  AlertTriangle, Lightbulb, BarChart3, Users, FileText,
  Mic, MicOff, Volume2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserCompanyId } from '@/hooks/useUserCompanyId';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'analysis' | 'recommendation' | 'alert' | 'insight';
}

const strategicPrompts = [
  { icon: TrendingUp, label: "Analyse de performance", prompt: "Analyse ma performance commerciale ce mois-ci et identifie les opportunités d'amélioration." },
  { icon: Target, label: "Objectifs stratégiques", prompt: "Quels devraient être mes objectifs prioritaires pour le prochain trimestre ?" },
  { icon: AlertTriangle, label: "Risques business", prompt: "Quels sont les principaux risques business actuels et comment les mitiger ?" },
  { icon: Lightbulb, label: "Opportunités marché", prompt: "Identifie les opportunités de croissance basées sur mes données actuelles." },
  { icon: Users, label: "Performance équipe", prompt: "Comment optimiser l'allocation de mes ressources humaines ?" },
  { icon: BarChart3, label: "Prévisions", prompt: "Génère des prévisions de revenus pour les 6 prochains mois." },
];

const SENIOR_SYSTEM_PROMPT = `Tu es un conseiller stratégique de niveau senior partner chez McKinsey/BCG. Tu assistes le dirigeant d'entreprise avec une expertise de haut niveau.

STYLE ET TON:
- Adopte un ton professionnel, direct et orienté résultats
- Structure tes réponses comme un consultant senior : contexte → analyse → recommandations → actions
- Utilise des frameworks stratégiques (SWOT, Porter, BCG Matrix) quand pertinent
- Quantifie tes analyses avec des métriques et KPIs
- Propose toujours des actions concrètes et priorisées

FORMAT:
- Réponds en texte fluide sans markdown (pas de #, **, --, etc.)
- Utilise des paragraphes courts et percutants
- Mets en avant les insights clés dès le début
- Termine par 2-3 recommandations actionnables

DONNÉES DISPONIBLES:
Tu as accès aux données temps réel de l'entreprise via la plateforme AETHER:
- CRM et pipeline commercial (deals, contacts, opportunités)
- RH (employés, candidats, entretiens)
- Support (tickets, satisfaction client)
- Conformité (alertes, audits)
- Workflows et automatisations
- Documents et connaissances

Analyse ces données pour fournir des conseils personnalisés et contextualisés.`;

export function StrategicAdvisor() {
  const { user } = useAuth();
  const { companyId } = useUserCompanyId();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setStreamingContent('');

    try {
      await supabase.auth.refreshSession();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('Session expirée');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat-stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            message: messageText,
            systemPrompt: SENIOR_SYSTEM_PROMPT,
            userId: user?.id,
            companyId,
            conversationId: null,
            confidentialMode: false,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Erreur de communication');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.text) {
                  fullContent += data.text;
                  setStreamingContent(fullContent);
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fullContent || 'Je n\'ai pas pu générer de réponse. Veuillez réessayer.',
        timestamp: new Date(),
        category: detectCategory(fullContent),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent('');
    } catch (error) {
      console.error('Strategic advisor error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Une erreur est survenue lors de la génération de la réponse. Veuillez réessayer.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setStreamingContent('');
    }
  };

  const detectCategory = (content: string): Message['category'] => {
    const lower = content.toLowerCase();
    if (lower.includes('risque') || lower.includes('alerte') || lower.includes('attention')) return 'alert';
    if (lower.includes('recommand') || lower.includes('action') || lower.includes('suggère')) return 'recommendation';
    if (lower.includes('opportunité') || lower.includes('insight') || lower.includes('tendance')) return 'insight';
    return 'analysis';
  };

  const getCategoryConfig = (category?: Message['category']) => {
    switch (category) {
      case 'alert':
        return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' };
      case 'recommendation':
        return { icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      case 'insight':
        return { icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-500/10' };
      default:
        return { icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10' };
    }
  };

  return (
    <Card className="h-full flex flex-col bg-gradient-to-b from-background to-muted/20">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span>Conseiller Stratégique IA</span>
            <p className="text-xs font-normal text-muted-foreground mt-0.5">
              Niveau Senior Partner
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Conseil stratégique personnalisé</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Posez vos questions stratégiques. L'IA analyse vos données en temps réel 
                  pour vous fournir des recommandations de niveau cabinet de conseil.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {strategicPrompts.map((prompt, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="h-auto py-3 px-4 justify-start text-left gap-3 hover:bg-primary/5 hover:border-primary/30"
                    onClick={() => sendMessage(prompt.prompt)}
                    disabled={loading}
                  >
                    <prompt.icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-xs">{prompt.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => {
                const categoryConfig = msg.role === 'assistant' ? getCategoryConfig(msg.category) : null;
                
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.role === 'assistant' && categoryConfig && (
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", categoryConfig.bg)}>
                        <categoryConfig.icon className={cn("w-4 h-4", categoryConfig.color)} />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[85%] rounded-xl px-4 py-3",
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 border'
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <span className="text-[10px] opacity-60 mt-2 block">
                        {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {(loading || streamingContent) && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 flex-shrink-0">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <div className="max-w-[85%] rounded-xl px-4 py-3 bg-muted/50 border">
                    {streamingContent ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {streamingContent}
                        <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
                      </p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Analyse en cours...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-background/50">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question stratégique..."
              className="min-h-[60px] resize-none bg-background"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
            />
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              size="icon"
              className="h-auto aspect-square"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
