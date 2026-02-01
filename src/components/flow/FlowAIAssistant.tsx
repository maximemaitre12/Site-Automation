import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Loader2,
  Bot,
  Lightbulb,
  AlertTriangle,
  Wand2,
  RefreshCw,
  Wrench,
  CheckCircle,
  Shield,
  Blocks,
  Plus,
  Settings2,
  ShieldCheck,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { WorkflowBlock, BlockConnection, WorkflowRunLog } from '@/types/workflow';
import { getBlockByType, BlockParam } from '@/types/block-library';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { autoLayoutBlocks, applyLayoutToBlocks } from '@/lib/workflow-layout';
import { 
  analyzeFailure, 
  generateRepairMessage, 
  applyRepairSuggestion,
  RepairSuggestion,
  validateInputSecurity,
} from '@/lib/workflow-self-healing';
import { 
  analyzeWorkflowStructure, 
  analyzeExecution, 
  generateAIContext 
} from '@/lib/workflow-ai-context';
import { useBlockLibrary } from '@/contexts/BlockLibraryContext';
import {
  AIBlockOperation,
  validateAIOperation,
  parseAIBlockOperations,
  summarizeOperations,
  getBlockLibraryContext,
} from '@/lib/ai-block-operations';
import {
  sanitizeConfigForAI,
  executeSecureBlockOperation,
  generateN8NComparison,
  checkRateLimit,
} from '@/lib/workflow-security';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  action?: {
    type: 'generate' | 'modify' | 'recommendation' | 'diagnostic' | 'repair' | 'block_operation' | 'comparison';
    data?: any;
  };
  securityInfo?: {
    approved: boolean;
    score: number;
    risks: string[];
  };
}

interface FlowAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: WorkflowBlock[];
  connections: BlockConnection[];
  workflowId?: string;
  workflowName?: string;
  lastExecutionResult?: { success: boolean; error?: string; failedBlockId?: string; logs?: WorkflowRunLog[] };
  onGenerateWorkflow: (blocks: WorkflowBlock[], name: string, description: string, connections: BlockConnection[]) => void;
  onModifyWorkflow: (blocks: WorkflowBlock[], connections: BlockConnection[]) => void;
  onApplyRepair?: (blocks: WorkflowBlock[]) => void;
}

const SUGGESTION_CHIPS = [
  { label: 'Générer un workflow', icon: Wand2, prompt: 'Génère-moi un nouveau workflow pour' },
  { label: 'Optimiser', icon: RefreshCw, prompt: 'Analyse et optimise mon workflow actuel' },
  { label: 'Diagnostiquer', icon: AlertTriangle, prompt: 'Quels blocs dois-je configurer pour que ce workflow fonctionne ?' },
  { label: 'Auto-réparer', icon: Wrench, prompt: 'Analyse les erreurs et propose des corrections' },
  { label: 'Améliorer les blocs', icon: Blocks, prompt: 'Propose des améliorations pour les définitions de blocs' },
  { label: 'Comparer avec N8N', icon: TrendingUp, prompt: 'Compare AETHER Flow avec N8N et montre les forces/faiblesses' },
];

// Cache key for localStorage
const CACHE_KEY = 'flow-ai-assistant-messages';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Helper to get cached messages
function getCachedMessages(): Message[] {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return [];
    
    const { messages, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid (within 1 hour)
    if (now - timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return [];
    }
    
    return messages || [];
  } catch {
    return [];
  }
}

// Helper to save messages to cache
function setCachedMessages(messages: Message[]) {
  try {
    if (messages.length === 0) {
      localStorage.removeItem(CACHE_KEY);
      return;
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      messages,
      timestamp: Date.now(),
    }));
  } catch {
    // Ignore storage errors
  }
}

function findLatestWorkflowActionMessage(messages: Message[]): Message | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== 'assistant') continue;
    if (!m.action?.data) continue;
    if (m.action.type === 'generate' || m.action.type === 'modify') return m;
  }
  return undefined;
}

// Check if user is confirming to apply a workflow action
function isApplyConfirmation(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (!t) return false;
  // Short confirmations only; avoids triggering on normal messages.
  if (t.length > 30) return false;

  const confirmPatterns = [
    'fais', 'fait', 'ok', 'okay', 'go', 'oui', 'yes',
    'vas-y', 'vas y', "c'est parti", 'cest parti',
    'applique', 'appliquer', 'apply',
    'génère', 'genere', 'génère-le', 'genere-le',
    'génère le', 'genere le', 'génère la', 'genere la',
    'lance', 'lance-le', 'execute', 'exécute',
    'do it', 'let\'s go', 'allons-y', 'envoie'
  ];
  
  return confirmPatterns.some(p => t === p || t.startsWith(p + ' ') || t.endsWith(' ' + p));
}

// Check if the message is a workflow generation/modification request
function isWorkflowRequest(text: string): boolean {
  const t = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Strong generation patterns
  const generatePatterns = [
    /genere|gener|generation/i,
    /creer|cree|create|creation/i,
    /construit|construis|build/i,
    /fais(-| )?(moi|le|un|ca|ça)/i,
    /nouveau workflow|new workflow/i,
    /monte(-| )?moi/i,
    /agent.*email|email.*agent/i,
    /workflow.*pour|pour.*workflow/i,
    /automatise|automatisation|automate/i,
    /lance|execute|demarre/i,
  ];
  
  // Strong modification patterns  
  const modifyPatterns = [
    /ameliore|ameliorer|improve/i,
    /modifie|modifier|modify/i,
    /ajoute|ajouter|add/i,
    /supprime|supprimer|remove|delete/i,
    /change|changer|remplace|remplacer/i,
    /optimise|optimiser|optimize/i,
    /corrige|corriger|fix/i,
    /refactor|refactorise/i,
    /update|met(s)?( |-)?a( |-)?jour/i,
  ];
  
  // Keywords that strongly indicate workflow intent
  const workflowKeywords = /workflow|bloc|node|trigger|action|automation/i;
  
  const hasGeneratePattern = generatePatterns.some(p => p.test(t));
  const hasModifyPattern = modifyPatterns.some(p => p.test(t));
  const hasWorkflowKeyword = workflowKeywords.test(t);
  
  // If any pattern matches, it's likely a workflow request
  return hasGeneratePattern || hasModifyPattern || hasWorkflowKeyword;
}

// Generate detailed configuration guidance for blocks
function generateConfigGuidance(blocks: WorkflowBlock[]): string {
  const guidance: string[] = [];
  
  blocks.forEach(block => {
    const blockType = block.type.toLowerCase();
    
    // Google/Gmail OAuth blocks
    if (blockType.includes('gmail') || blockType.includes('google_') || blockType.includes('trigger_gmail')) {
      guidance.push(`\n📧 ${block.name} - Connexion Google requise\n`);
      guidance.push(`Pour connecter ton compte Google :`);
      guidance.push(`1. Va sur Google Cloud Console (console.cloud.google.com)`);
      guidance.push(`2. Crée un projet ou sélectionne un projet existant`);
      guidance.push(`3. Active l'API Gmail dans "APIs & Services"`);
      guidance.push(`4. Dans "Credentials", crée un ID client OAuth 2.0`);
      guidance.push(`5. Ajoute cette URL de redirection autorisée :`);
      guidance.push(`   https://aether-connect.com/oauth/google/callback`);
      guidance.push(`6. Double-clique sur le bloc et entre ton Client ID et Secret`);
      guidance.push(`7. Clique sur "Connecter avec Google"`);
    }
    
    // OpenAI blocks
    if (blockType.includes('openai')) {
      if (!block.config?.apiKey) {
        guidance.push(`\n🤖 ${block.name} - Clé API OpenAI requise\n`);
        guidance.push(`Va sur platform.openai.com pour obtenir ta clé API`);
        guidance.push(`Double-clique sur le bloc pour la configurer`);
      }
    }
    
    // Stripe blocks
    if (blockType.includes('stripe')) {
      if (!block.config?.apiKey) {
        guidance.push(`\n💳 ${block.name} - Clé API Stripe requise\n`);
        guidance.push(`Va sur dashboard.stripe.com/apikeys pour obtenir ta clé`);
        guidance.push(`Double-clique sur le bloc pour la configurer`);
      }
    }
    
    // Slack blocks
    if (blockType.includes('slack')) {
      guidance.push(`\n💬 ${block.name} - Token Slack requis\n`);
      guidance.push(`Crée une app Slack sur api.slack.com/apps`);
      guidance.push(`Obtiens un Bot Token avec les scopes nécessaires`);
    }
    
    // GitHub blocks
    if (blockType.includes('github')) {
      if (!block.config?.token) {
        guidance.push(`\n🐙 ${block.name} - Token GitHub requis\n`);
        guidance.push(`Crée un Personal Access Token sur github.com/settings/tokens`);
      }
    }
    
    // Notion blocks
    if (blockType.includes('notion')) {
      if (!block.config?.apiKey) {
        guidance.push(`\n📝 ${block.name} - Clé API Notion requise\n`);
        guidance.push(`Crée une intégration sur notion.so/my-integrations`);
      }
    }
    
    // Webhook blocks
    if (blockType.includes('webhook') && blockType.includes('trigger')) {
      guidance.push(`\n🔗 ${block.name} - URL de Webhook\n`);
      guidance.push(`L'URL du webhook sera générée automatiquement à l'exécution`);
    }
  });
  
  return guidance.join('\n');
}

export function FlowAIAssistant({
  isOpen,
  blocks,
  connections,
  workflowName,
  lastExecutionResult,
  onGenerateWorkflow,
  onModifyWorkflow,
  onApplyRepair,
}: FlowAIAssistantProps) {
  // Block library context for custom blocks
  const blockLibrary = useBlockLibrary();
  
  // Initialize messages from cache
  const [messages, setMessages] = useState<Message[]>(() => getCachedMessages());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRepairs, setPendingRepairs] = useState<RepairSuggestion[]>([]);
  const [pendingOperations, setPendingOperations] = useState<AIBlockOperation[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-analyze failures when execution result changes
  useEffect(() => {
    if (lastExecutionResult && !lastExecutionResult.success && lastExecutionResult.failedBlockId) {
      const failedBlock = blocks.find(b => b.id === lastExecutionResult.failedBlockId);
      if (failedBlock) {
        const failedLog = lastExecutionResult.logs?.find(l => l.blockId === lastExecutionResult.failedBlockId);
        const report = analyzeFailure(
          failedBlock,
          failedLog?.error || lastExecutionResult.error || 'Erreur inconnue',
          (failedLog as any)?.errorDetails,
          lastExecutionResult.logs
        );
        
        // Store auto-fixable repairs
        const autoFixable = report.suggestions.filter(s => s.autoFixable);
        if (autoFixable.length > 0) {
          setPendingRepairs(autoFixable);
        }
        
        // Add diagnostic message
        const repairMessage = generateRepairMessage(report);
        const newMessage: Message = {
          id: `repair-${Date.now()}`,
          role: 'assistant',
          content: repairMessage,
          timestamp: Date.now(),
          action: autoFixable.length > 0 ? { type: 'repair', data: { suggestions: autoFixable, blockId: failedBlock.id } } : { type: 'diagnostic' },
        };
        
        setMessages(prev => {
          // Avoid duplicate messages
          if (prev.some(m => m.content === repairMessage)) return prev;
          return [...prev, newMessage];
        });
      }
    }
  }, [lastExecutionResult, blocks]);

  // Save messages to cache whenever they change
  useEffect(() => {
    setCachedMessages(messages);
  }, [messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Analyze workflow for missing configurations
  const analyzeWorkflowConfig = useCallback((targetBlocks: WorkflowBlock[]): string[] => {
    const issues: string[] = [];
    
    targetBlocks.forEach(block => {
      const def = getBlockByType(block.type);
      if (!def) return;

      const requiredFields = def.params?.filter(f => f.required) || [];
      const missingFields = requiredFields.filter(f => {
        const value = block.config?.[f.key];
        return value === undefined || value === '' || value === null;
      });

      if (missingFields.length > 0) {
        issues.push(`${block.name} : ${missingFields.map(f => f.label).join(', ')} manquant(s)`);
      }

      // Check for API keys or credentials
      if (block.type.includes('openai') && !block.config?.apiKey) {
        issues.push(`${block.name} : Clé API OpenAI requise`);
      }
      if (block.type.includes('gmail') || block.type.includes('google_')) {
        issues.push(`${block.name} : Connexion Google OAuth requise`);
      }
      if (block.type.includes('stripe') && !block.config?.apiKey) {
        issues.push(`${block.name} : Clé API Stripe requise`);
      }
    });

    return [...new Set(issues)]; // Remove duplicates
  }, []);

  // Post-action diagnostic after workflow creation/modification
  const generatePostActionDiagnostic = useCallback((actionBlocks: WorkflowBlock[], actionType: 'generate' | 'modify'): string => {
    const issues = analyzeWorkflowConfig(actionBlocks);
    const guidance = generateConfigGuidance(actionBlocks);
    
    if (issues.length === 0 && !guidance.trim()) {
      return actionType === 'generate' 
        ? `\n\nTon workflow est prêt à être exécuté ! Tous les blocs sont configurés.`
        : `\n\nLes modifications ont été appliquées. Tout est configuré !`;
    }
    
    let diagnostic = `\n\n---\n\n🔧 Configuration nécessaire\n\n`;
    
    if (issues.length > 0) {
      diagnostic += `Voici ce qu'il faut configurer pour que ton workflow fonctionne :\n\n`;
      diagnostic += issues.map(i => `• ${i}`).join('\n');
    }
    
    if (guidance.trim()) {
      diagnostic += `\n${guidance}`;
    }
    
    diagnostic += `\n\nDouble-clique sur chaque bloc concerné pour le paramétrer.`;
    
    return diagnostic;
  }, [analyzeWorkflowConfig]);

  const handleSend = async () => {
    const rawInput = input;
    if (!rawInput.trim() || isLoading) return;

    // If the user confirms right after a generated proposal, apply it immediately.
    const latestActionMessage = findLatestWorkflowActionMessage(messages);
    const shouldApplyLatest = !!latestActionMessage && isApplyConfirmation(rawInput);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: rawInput,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    if (shouldApplyLatest && latestActionMessage?.action?.data) {
      const ack: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'OK, j’applique ça sur le canvas maintenant.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, ack]);
      await handleApplyAction(latestActionMessage.action, latestActionMessage.action.data);
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Veuillez vous connecter');
        setIsLoading(false);
        return;
      }

      // Detect intent from the message using improved detection
      const lowerInput = rawInput.toLowerCase();
      
      // Use the improved isWorkflowRequest function for better detection
      const shouldTriggerWorkflowGeneration = isWorkflowRequest(rawInput);
      
      // More specific patterns for generate vs modify
      const hasExistingBlocks = blocks.length > 0;
      const isModifyPattern = /améliore|ameliore|modifie|ajoute|supprime|change|remplace|optimise|corrige|refactor/i.test(lowerInput);
      const isGeneratePattern = /génère|genere|créer|crée|nouveau|build|create|fais(-| )?(moi|le|un)|construit|monte|automatise/i.test(lowerInput);
      
      // Determine if it's a generate or modify request
      const isModifyRequest = shouldTriggerWorkflowGeneration && hasExistingBlocks && isModifyPattern;
      const isGenerateRequest = shouldTriggerWorkflowGeneration && (isGeneratePattern || (!hasExistingBlocks && isModifyPattern));
      
      const isDiagnosticRequest = /diagnostic|configur|manque|fonctionne|initialiser|api|clé/i.test(lowerInput);
      const isComparisonRequest = /compar|n8n|force|faiblesse|versus|vs|différence|mieux|avantage/i.test(lowerInput);

      // Security: Validate user input
      const securityCheck = validateInputSecurity(rawInput);
      if (!securityCheck.safe) {
        console.warn('Security threats detected in input:', securityCheck.threats);
        // Don't block, but sanitize and log
      }

      // Handle N8N comparison request
      if (isComparisonRequest) {
        const comparison = generateN8NComparison();
        
        let response = `📊 Comparaison AETHER Flow vs N8N\n\n`;
        
        response += `🏆 FORCES D'AETHER (supérieur à N8N)\n\n`;
        comparison.strengths.forEach(s => {
          response += `• ${s.feature}\n  ${s.description}\n\n`;
        });
        
        response += `🚀 FONCTIONNALITÉS UNIQUES\n\n`;
        comparison.unique.forEach(u => {
          response += `• ${u.feature}\n  ${u.description}\n\n`;
        });
        
        response += `📈 AXES D'AMÉLIORATION\n\n`;
        comparison.improvements.forEach(i => {
          response += `• ${i.feature}\n  ${i.description}\n`;
          if (i.improvementSuggestion) {
            response += `  💡 ${i.improvementSuggestion}\n`;
          }
          response += '\n';
        });

        const comparisonMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
          action: { type: 'comparison' },
        };
        setMessages(prev => [...prev, comparisonMessage]);
        setIsLoading(false);
        return;
      }

      // Handle diagnostic locally
      if (isDiagnosticRequest && blocks.length > 0) {
        const issues = analyzeWorkflowConfig(blocks);
        const guidance = generateConfigGuidance(blocks);
        let response: string;
        
        if (issues.length === 0 && !guidance.trim()) {
          response = `Workflow prêt !\n\nTous les blocs sont correctement configurés et connectés. Tu peux lancer l'exécution.`;
        } else {
          response = `Configuration requise\n\nPour que ton workflow fonctionne, voici ce qu'il faut configurer :\n\n${issues.map(i => `• ${i}`).join('\n')}`;
          if (guidance.trim()) {
            response += `\n${guidance}`;
          }
          response += `\n\nDouble-clique sur chaque bloc concerné pour le paramétrer.`;
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
          action: { type: 'diagnostic' },
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // Handle generate or modify via API
      if (isGenerateRequest || isModifyRequest) {
        // Show generating state with a pending message
        const pendingMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '🔄 Génération du workflow en cours...',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, pendingMessage]);
        
        const requestBody = isModifyRequest && blocks.length > 0
          ? {
              existingWorkflow: { blocks, connections },
              modificationRequest: rawInput,
              stream: false,
            }
          : {
              objective: rawInput,
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
          // Remove pending message and show error
          setMessages(prev => prev.filter(m => m.id !== pendingMessage.id));
          throw new Error('Échec de la génération');
        }

        const data = await resp.json();
        const workflow = data.workflow;

        if (workflow?.blocks?.length > 0) {
          const layoutedBlocks = applyLayoutToBlocks(workflow.blocks, autoLayoutBlocks(workflow.blocks, workflow.connections || []));
          
          // Generate diagnostic for the new workflow
          const diagnostic = generatePostActionDiagnostic(layoutedBlocks, isModifyRequest ? 'modify' : 'generate');
          
          // Build compact block summary (just names, no verbose descriptions)
          const blockSummary = layoutedBlocks.slice(0, 6).map((b: WorkflowBlock) => b.name).join(' → ');
          const extraBlocks = layoutedBlocks.length > 6 ? ` +${layoutedBlocks.length - 6}` : '';
          
          // Remove pending message and add the action message with button
          setMessages(prev => prev.filter(m => m.id !== pendingMessage.id));
          
          const actionMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: `✨ Workflow "${workflow.name || 'Nouveau workflow'}" prêt !\n\n${blockSummary}${extraBlocks}`,
            timestamp: Date.now(),
            action: {
              type: isModifyRequest ? 'modify' : 'generate',
              data: { 
                blocks: layoutedBlocks, 
                connections: workflow.connections || [], 
                name: workflow.name || rawInput.slice(0, 50),
                diagnostic,
              },
            },
          };
          setMessages(prev => [...prev, actionMessage]);
        } else {
          setMessages(prev => prev.filter(m => m.id !== pendingMessage.id));
          throw new Error('Aucun bloc généré');
        }
      } else {
        // If the message looks like a workflow request but didn't match above patterns,
        // still try to generate - this is a fallback for edge cases
        if (shouldTriggerWorkflowGeneration) {
          console.log('Fallback: triggering workflow generation for:', rawInput);
          // Redirect to generate workflow anyway
          const pendingMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '🔄 Génération du workflow en cours...',
            timestamp: Date.now(),
          };
          setMessages(prev => [...prev, pendingMessage]);
          
          const requestBody = hasExistingBlocks
            ? {
                existingWorkflow: { blocks, connections },
                modificationRequest: rawInput,
                stream: false,
              }
            : {
                objective: rawInput,
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

          if (resp.ok) {
            const data = await resp.json();
            const workflow = data.workflow;

            if (workflow?.blocks?.length > 0) {
              const layoutedBlocks = applyLayoutToBlocks(workflow.blocks, autoLayoutBlocks(workflow.blocks, workflow.connections || []));
              const diagnostic = generatePostActionDiagnostic(layoutedBlocks, hasExistingBlocks ? 'modify' : 'generate');
              const blockSummary = layoutedBlocks.slice(0, 6).map((b: WorkflowBlock) => b.name).join(' → ');
              const extraBlocks = layoutedBlocks.length > 6 ? ` +${layoutedBlocks.length - 6}` : '';
              
              setMessages(prev => prev.filter(m => m.id !== pendingMessage.id));
              
              const actionMessage: Message = {
                id: (Date.now() + 2).toString(),
                role: 'assistant',
                content: `✨ Workflow "${workflow.name || 'Nouveau workflow'}" prêt !\n\n${blockSummary}${extraBlocks}`,
                timestamp: Date.now(),
                action: {
                  type: hasExistingBlocks ? 'modify' : 'generate',
                  data: { 
                    blocks: layoutedBlocks, 
                    connections: workflow.connections || [], 
                    name: workflow.name || rawInput.slice(0, 50),
                    diagnostic,
                  },
                },
              };
              setMessages(prev => [...prev, actionMessage]);
              setIsLoading(false);
              return;
            }
          }
          // If fallback failed, continue to chat
          setMessages(prev => prev.filter(m => m.id !== pendingMessage.id));
        }
        
        // General chat for non-workflow questions
        const blocksContext = blocks.length > 0 
          ? `Le workflow "${workflowName || 'Sans nom'}" contient ${blocks.length} blocs : ${blocks.map(b => `${b.name} (type: ${b.type})`).join(', ')}.`
          : 'Aucun workflow sélectionné pour l\'instant.';
        
        const systemPrompt = `Tu es l'assistant expert d'AETHER Flow, capable de générer et modifier des workflows.

CONTEXTE: ${blocksContext}

TES CAPACITÉS:
- Tu PEUX générer des workflows - le système les créera automatiquement sur le canvas
- Tu PEUX modifier les workflows existants
- Tu aides à configurer les blocs et résoudre les problèmes

RÈGLES DE RÉPONSE:
- Sois bref et direct (2-3 phrases max)
- Ne liste JAMAIS les blocs un par un avec des descriptions
- Ne fais pas de "plan" ou "voici ce que je vais faire"
- Si l'utilisateur veut un workflow, dis simplement "Je génère ça maintenant" et le système s'en occupe

Réponds aux questions sur l'utilisation de Flow, la configuration des blocs, ou les problèmes rencontrés.`;

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
              { role: 'user', content: rawInput },
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
          timestamp: Date.now(),
          action: undefined,
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      console.error('AI Assistant error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Erreur : ${error.message || 'Une erreur est survenue'}. Veuillez réessayer.`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAction = async (action: Message['action'], data: any) => {
    if (!action) return;

    if (action.type === 'generate' && data) {
      onGenerateWorkflow(data.blocks, data.name, '', data.connections);
      toast.success('Workflow créé !');
      
      // Add post-action diagnostic message
      if (data.diagnostic) {
        const diagnosticMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.diagnostic,
          timestamp: Date.now(),
          action: { type: 'diagnostic' },
        };
        setMessages(prev => [...prev, diagnosticMessage]);
      }
    } else if (action.type === 'modify' && data) {
      onModifyWorkflow(data.blocks, data.connections);
      toast.success('Workflow modifié !');
      
      // Add post-action diagnostic message
      if (data.diagnostic) {
        const diagnosticMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.diagnostic,
          timestamp: Date.now(),
          action: { type: 'diagnostic' },
        };
        setMessages(prev => [...prev, diagnosticMessage]);
      }
    } else if (action.type === 'repair' && data?.suggestions && onApplyRepair) {
      // Apply auto-repair suggestions
      try {
        let updatedBlocks = [...blocks];
        const appliedFixes: string[] = [];
        
        for (const suggestion of data.suggestions as RepairSuggestion[]) {
          if (suggestion.autoFixable && suggestion.fix) {
            updatedBlocks = applyRepairSuggestion(updatedBlocks, suggestion);
            appliedFixes.push(suggestion.title);
          }
        }
        
        if (appliedFixes.length > 0) {
          onApplyRepair(updatedBlocks);
          toast.success(`${appliedFixes.length} correction(s) appliquée(s)`);
          
          const successMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `✅ Corrections appliquées :\n\n${appliedFixes.map(f => `• ${f}`).join('\n')}\n\nRelance le workflow pour vérifier.`,
            timestamp: Date.now(),
          };
          setMessages(prev => [...prev, successMessage]);
          setPendingRepairs([]);
        }
      } catch (error) {
        toast.error('Échec de l\'application des corrections');
      }
    } else if (action.type === 'block_operation' && data?.operations) {
      // Apply block operations (create, update, delete)
      await handleApplyBlockOperations(data.operations as AIBlockOperation[]);
    }
  };

  // Handle applying block operations with security layer
  const handleApplyBlockOperations = async (operations: AIBlockOperation[]) => {
    const results: string[] = [];
    const errors: string[] = [];
    const securityReports: string[] = [];

    // Get user ID for rate limiting
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || 'anonymous';

    for (const op of operations) {
      // Rate limit check first
      const rateCheck = checkRateLimit(userId, op.type);
      if (!rateCheck.allowed) {
        errors.push(`🚫 ${rateCheck.reason}`);
        continue;
      }

      // Validate with security evaluation
      const validation = validateAIOperation(op, blockLibrary.allBlocks);
      
      // Add security info to report
      if (validation.evaluation) {
        const evalIcon = validation.evaluation.approved ? '✅' : '❌';
        securityReports.push(`${evalIcon} ${op.type}: Score ${validation.evaluation.score}/100`);
        
        if (validation.evaluation.risks.length > 0) {
          securityReports.push(`   Risques: ${validation.evaluation.risks.join(', ')}`);
        }
        if (validation.evaluation.benefits.length > 0) {
          securityReports.push(`   Bénéfices: ${validation.evaluation.benefits.join(', ')}`);
        }
      }

      if (!validation.valid) {
        errors.push(`${op.type}: ${validation.errors.join(', ')}`);
        continue;
      }

      try {
        switch (op.type) {
          case 'create_block': {
            const newType = op.block.type || blockLibrary.generateBlockType(op.block.name || 'custom');
            await blockLibrary.createBlock({
              definition: { ...op.block, type: newType },
              reason: op.reason,
            });
            results.push(`✨ Bloc "${op.block.name}" créé`);
            break;
          }
          case 'update_block': {
            const block = blockLibrary.allBlocks.find(b => b.type === op.blockType);
            if (block?.isCustom && (block as any).customId) {
              await blockLibrary.updateBlock({
                id: (block as any).customId,
                updates: op.updates,
                reason: op.reason,
              });
              results.push(`📝 Bloc "${op.blockType}" mis à jour`);
            }
            break;
          }
          case 'delete_block': {
            const block = blockLibrary.allBlocks.find(b => b.type === op.blockType);
            if (block?.isCustom && (block as any).customId) {
              await blockLibrary.deleteBlock((block as any).customId);
              results.push(`🗑️ Bloc "${op.blockType}" supprimé`);
            }
            break;
          }
          case 'add_param': {
            await blockLibrary.addParameter(op.blockType, op.param, op.reason);
            results.push(`➕ Paramètre "${op.param.label}" ajouté`);
            break;
          }
          case 'update_param': {
            await blockLibrary.updateParameter(op.blockType, op.paramKey, op.updates, op.reason);
            results.push(`📝 Paramètre "${op.paramKey}" modifié`);
            break;
          }
          case 'remove_param': {
            await blockLibrary.removeParameter(op.blockType, op.paramKey, op.reason);
            results.push(`➖ Paramètre "${op.paramKey}" supprimé`);
            break;
          }
        }
      } catch (err: any) {
        errors.push(`${op.type}: ${err.message}`);
      }
    }

    // Build comprehensive result message
    const contentParts: string[] = [];
    
    if (results.length > 0) {
      contentParts.push(`✅ Opérations réussies :\n${results.join('\n')}`);
    }
    
    if (errors.length > 0) {
      contentParts.push(`\n❌ Erreurs/Blocages :\n${errors.join('\n')}`);
    }
    
    if (securityReports.length > 0) {
      contentParts.push(`\n🔐 Rapport de sécurité :\n${securityReports.join('\n')}`);
    }

    const resultMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: contentParts.join('\n') || 'Aucune opération effectuée',
      timestamp: Date.now(),
      securityInfo: {
        approved: errors.length === 0,
        score: results.length > 0 ? 100 : 0,
        risks: errors,
      },
    };
    setMessages(prev => [...prev, resultMessage]);
    setPendingOperations([]);
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
    <div className="w-96 h-full min-h-0 shrink-0 border-l border-border bg-card flex flex-col overflow-hidden pb-2">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain p-4">
        <div className="space-y-4 overflow-hidden">
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
                      variant="outline"
                      className="mt-3 w-full gap-2 text-sm font-medium"
                      onClick={() =>
                        handleApplyAction(message.action, message.action?.data)
                      }
                    >
                      <Wand2 className="w-4 h-4" />
                      {message.action.type === 'generate'
                        ? 'Appliquer sur le canvas'
                        : 'Appliquer les modifications'}
                    </Button>
                  )}
                
                {/* Auto-repair action button */}
                {message.action?.type === 'repair' && message.action?.data?.suggestions?.length > 0 && (
                  <Button
                    size="sm"
                    variant="default"
                    className="mt-2 w-full gap-1.5 bg-amber-500 hover:bg-amber-600"
                    onClick={() => handleApplyAction(message.action, message.action?.data)}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    Appliquer les corrections ({message.action.data.suggestions.length})
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

      {/* Input - Fixed at bottom, always visible */}
      <div className="shrink-0 p-3 border-t border-border bg-card/30">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Décris ce que tu veux automatiser..."
            className={cn(
              "min-h-[60px] max-h-[120px] resize-none",
              "rounded-xl px-4 py-2.5",
              "pr-12",
              "bg-background text-sm leading-relaxed",
              "shadow-sm",
            )}
            disabled={isLoading}
            rows={2}
          />

          {/* Send button inside the text area (bottom-right) */}
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute bottom-2 right-2",
              "h-8 w-8 rounded-lg",
              "bg-agent-flow hover:bg-agent-flow/90",
            )}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
