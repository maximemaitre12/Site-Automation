import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Loader2,
  Bot,
  Lightbulb,
  AlertTriangle,
  Wand2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { WorkflowBlock, BlockConnection } from '@/types/workflow';
import { getBlockByType } from '@/types/block-library';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { autoLayoutBlocks, applyLayoutToBlocks } from '@/lib/workflow-layout';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: {
    type: 'generate' | 'modify' | 'recommendation' | 'diagnostic';
    data?: any;
  };
}

interface FlowAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: WorkflowBlock[];
  connections: BlockConnection[];
  workflowId?: string;
  workflowName?: string;
  onGenerateWorkflow: (blocks: WorkflowBlock[], name: string, description: string, connections: BlockConnection[]) => void;
  onModifyWorkflow: (blocks: WorkflowBlock[], connections: BlockConnection[]) => void;
}

const SUGGESTION_CHIPS = [
  { label: 'Générer un workflow', icon: Wand2, prompt: 'Génère-moi un nouveau workflow pour' },
  { label: 'Optimiser', icon: RefreshCw, prompt: 'Analyse et optimise mon workflow actuel' },
  { label: 'Diagnostiquer', icon: AlertTriangle, prompt: 'Quels blocs dois-je configurer pour que ce workflow fonctionne ?' },
  { label: 'Recommandations', icon: Lightbulb, prompt: 'Donne-moi des recommandations pour améliorer ce workflow' },
];

export function FlowAIAssistant({
  isOpen,
  blocks,
  connections,
  workflowName,
  onGenerateWorkflow,
  onModifyWorkflow,
}: FlowAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // NOTE: No auto-focus here.
  // Auto-focusing inputs can trigger browser auto-scroll inside the fixed app-shell,
  // making top toolbars *appear* to “disappear”. Users can click the input when needed.
  useEffect(() => {
    // intentionally blank
  }, [isOpen]);

  // Analyze workflow for missing configurations
  const analyzeWorkflowConfig = (): string[] => {
    const issues: string[] = [];
    
    blocks.forEach(block => {
      const def = getBlockByType(block.type);
      if (!def) return;

      const requiredFields = def.params?.filter(f => f.required) || [];
      const missingFields = requiredFields.filter(f => {
        const value = block.config?.[f.key];
        return value === undefined || value === '' || value === null;
      });

      if (missingFields.length > 0) {
        issues.push(`**${block.name}** : ${missingFields.map(f => f.label).join(', ')} manquant(s)`);
      }

      // Check for API keys or credentials
      if (block.type.includes('openai') && !block.config?.apiKey) {
        issues.push(`**${block.name}** : Clé API OpenAI requise`);
      }
      if (block.type.includes('gmail') || block.type.includes('google_')) {
        issues.push(`**${block.name}** : Connexion Google OAuth requise`);
      }
      if (block.type.includes('stripe') && !block.config?.apiKey) {
        issues.push(`**${block.name}** : Clé API Stripe requise`);
      }
    });

    // Check for unconnected blocks
    const connectedBlockIds = new Set([
      ...connections.map(c => c.sourceBlockId),
      ...connections.map(c => c.targetBlockId),
    ]);
    
    blocks.forEach(block => {
      if (blocks.length > 1 && !connectedBlockIds.has(block.id)) {
        issues.push(`**${block.name}** : Bloc non connecté au workflow`);
      }
    });

    return issues;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Veuillez vous connecter');
        setIsLoading(false);
        return;
      }

      // Detect intent from the message
      const lowerInput = input.toLowerCase();
      const isGenerateRequest = /génère|créer|crée|nouveau workflow|build|create/i.test(lowerInput);
      const isModifyRequest = /modifie|ajoute|supprime|change|remplace|optimise/i.test(lowerInput);
      const isDiagnosticRequest = /diagnostic|configur|manque|fonctionne|initialiser|api|clé/i.test(lowerInput);
      const isRecommendationRequest = /recommand|améliore|conseil|suggestion|idée/i.test(lowerInput);

      // Handle diagnostic locally
      if (isDiagnosticRequest && blocks.length > 0) {
        const issues = analyzeWorkflowConfig();
        let response: string;
        
        if (issues.length === 0) {
          response = `✅ **Workflow prêt !**\n\nTous les blocs sont correctement configurés et connectés. Vous pouvez lancer l'exécution.`;
        } else {
          response = `⚠️ **Configuration requise**\n\nPour que votre workflow fonctionne, vous devez :\n\n${issues.map(i => `• ${i}`).join('\n')}\n\nCliquez sur chaque bloc concerné pour le configurer.`;
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          action: { type: 'diagnostic' },
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // Handle generate or modify via API
      if (isGenerateRequest || isModifyRequest) {
        const requestBody = isModifyRequest && blocks.length > 0
          ? {
              existingWorkflow: { blocks, connections },
              modificationRequest: input,
              stream: false,
            }
          : {
              objective: input,
              context: workflowName ? `Workflow: ${workflowName}` : '',
              constraints: 'Keep the workflow focused and efficient.',
              stream: false,
            };

        const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/workflow-generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify(requestBody),
        });

        if (!resp.ok) {
          throw new Error('Échec de la génération');
        }

        const data = await resp.json();
        const workflow = data.workflow;

        if (workflow?.blocks?.length > 0) {
          const layoutedBlocks = applyLayoutToBlocks(workflow.blocks, autoLayoutBlocks(workflow.blocks, workflow.connections || []));
          
          const actionMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `✨ **${isModifyRequest ? 'Workflow modifié' : 'Workflow généré'}** avec ${workflow.blocks.length} blocs !\n\n${workflow.blocks.slice(0, 5).map((b: WorkflowBlock, i: number) => `${i + 1}. ${b.name}`).join('\n')}${workflow.blocks.length > 5 ? `\n... et ${workflow.blocks.length - 5} autres` : ''}`,
            action: {
              type: isModifyRequest ? 'modify' : 'generate',
              data: { blocks: layoutedBlocks, connections: workflow.connections || [], name: workflow.name || input.slice(0, 50) },
            },
          };
          setMessages(prev => [...prev, actionMessage]);
        } else {
          throw new Error('Aucun bloc généré');
        }
      } else {
        // General chat / recommendations
        const systemPrompt = `Tu es l'assistant IA d'AETHER Flow, un builder de workflows d'automatisation.
${blocks.length > 0 ? `Le workflow actuel "${workflowName || 'Sans nom'}" contient ${blocks.length} blocs: ${blocks.map(b => b.name).join(', ')}.` : 'Aucun workflow n\'est actuellement sélectionné.'}

Tu peux:
- Donner des conseils pour améliorer les workflows
- Expliquer comment configurer les blocs
- Suggérer des automatisations
- Répondre aux questions sur AETHER Flow

Réponds de façon concise et utile en français.`;

        const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: input },
            ],
          }),
        });

        if (!resp.ok) {
          throw new Error('Échec de la requête IA');
        }

        const data = await resp.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || data.content || 'Je n\'ai pas pu générer de réponse.',
          action: isRecommendationRequest ? { type: 'recommendation' } : undefined,
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      console.error('AI Assistant error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Erreur : ${error.message || 'Une erreur est survenue'}. Veuillez réessayer.`,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAction = (action: Message['action'], data: any) => {
    if (!action) return;

    if (action.type === 'generate' && data) {
      onGenerateWorkflow(data.blocks, data.name, '', data.connections);
      toast.success('Workflow créé !');
    } else if (action.type === 'modify' && data) {
      onModifyWorkflow(data.blocks, data.connections);
      toast.success('Workflow modifié !');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt + ' ');
  };

  return (
    <div className="w-80 h-full min-h-0 shrink-0 border-l border-border bg-card flex flex-col overflow-hidden">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Demandez-moi de générer, modifier ou diagnostiquer vos workflows !
              </p>

              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTION_CHIPS.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(chip.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-xs transition-colors"
                  >
                    <chip.icon className="w-3 h-3" />
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[90%] rounded-2xl px-4 py-2.5',
                  message.role === 'user'
                    ? 'bg-agent-flow text-white rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                {/* Action button for generated/modified workflows */}
                {message.action?.data &&
                  (message.action.type === 'generate' || message.action.type === 'modify') && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="mt-2 w-full gap-1.5"
                      onClick={() =>
                        handleApplyAction(message.action, message.action?.data)
                      }
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      {message.action.type === 'generate'
                        ? 'Créer ce workflow'
                        : 'Appliquer les modifications'}
                    </Button>
                  )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Réflexion...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-card/30">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Décrivez ce que vous voulez..."
            className="min-h-[88px] max-h-[240px] resize-none bg-background text-sm"
            disabled={isLoading}
            rows={3}
          />
          <Button 
            size="icon" 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="shrink-0 bg-agent-flow hover:bg-agent-flow/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Entrée pour envoyer • Shift+Entrée pour nouvelle ligne
        </p>
      </div>
    </div>
  );
}
