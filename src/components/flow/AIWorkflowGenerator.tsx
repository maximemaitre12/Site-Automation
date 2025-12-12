import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { WorkflowBlock, BlockType, BlockConnection, BLOCK_DEFINITIONS } from '@/types/workflow';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sparkles, Wand2, Loader2, CheckCircle, AlertCircle, 
  Lightbulb, Zap, FileText, Users, ShoppingCart, Headphones,
  Mail, Database, Brain, TrendingUp, Shield, Edit3, Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface AIWorkflowGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (blocks: WorkflowBlock[], name: string, description: string, connections?: BlockConnection[]) => void;
  // Mode modification
  existingWorkflow?: {
    id: string;
    name: string;
    blocks: WorkflowBlock[];
    connections: BlockConnection[];
  };
  onModify?: (blocks: WorkflowBlock[], connections: BlockConnection[]) => void;
}

const EXAMPLE_PROMPTS = [
  {
    icon: FileText,
    title: 'Document Processing',
    prompt: 'Process uploaded PDF invoices: extract key data (vendor, amount, date), classify by expense category, check for approval rules, and save to database',
    category: 'Finance'
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    prompt: 'Handle incoming support tickets: analyze sentiment, classify issue type and priority, generate a helpful response draft, and notify the right team',
    category: 'Support'
  },
  {
    icon: Users,
    title: 'Lead Processing',
    prompt: 'When a new lead comes in via webhook, enrich with company data, generate a personalized outreach message, score the lead, and route hot leads to sales',
    category: 'Sales'
  },
  {
    icon: Mail,
    title: 'Email Automation',
    prompt: 'Monitor incoming emails, extract action items and deadlines, summarize the content, and send a structured summary to Slack',
    category: 'Productivity'
  },
  {
    icon: Database,
    title: 'Data Pipeline',
    prompt: 'Fetch data from an API daily, transform and clean the records, filter for active items, and store in database with logging',
    category: 'Data'
  },
  {
    icon: Brain,
    title: 'Content Analysis',
    prompt: 'Analyze submitted content for topic classification, sentiment, key themes extraction, and generate an executive summary in multiple languages',
    category: 'Content'
  }
];

const MODIFICATION_EXAMPLES = [
  'Ajouter une branche parallèle qui envoie un email de notification',
  'Insérer une étape de validation humaine avant la sauvegarde',
  'Remplacer le bloc de classification par un bloc de sentiment analysis',
  'Ajouter un délai de 5 minutes entre les étapes',
  'Créer une condition qui route vers différentes actions selon le score',
  'Dupliquer la branche principale pour traiter les cas urgents différemment'
];

export function AIWorkflowGenerator({ isOpen, onClose, onGenerate, existingWorkflow, onModify }: AIWorkflowGeneratorProps) {
  const [objective, setObjective] = useState('');
  const [context, setContext] = useState('');
  const [modificationRequest, setModificationRequest] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<{ blocks: WorkflowBlock[], connections: BlockConnection[] } | null>(null);
  const [generatedName, setGeneratedName] = useState('');
  const [step, setStep] = useState<'input' | 'preview' | 'success'>('input');
  const [mode, setMode] = useState<'create' | 'modify'>('create');
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingBlocks, setStreamingBlocks] = useState<WorkflowBlock[]>([]);

  // Set mode based on whether we have an existing workflow
  useEffect(() => {
    if (existingWorkflow) {
      setMode('modify');
    } else {
      setMode('create');
    }
  }, [existingWorkflow]);

  const handleGenerate = async () => {
    console.log('handleGenerate called, mode:', mode, 'objective:', objective, 'modificationRequest:', modificationRequest);
    
    if (mode === 'create' && !objective.trim()) {
      toast.error('Please describe your workflow objective');
      return;
    }
    if (mode === 'modify' && !modificationRequest.trim()) {
      toast.error('Please describe what you want to modify');
      return;
    }

    console.log('Validation passed, starting generation...');
    toast.info('Starting workflow generation...');
    
    setIsGenerating(true);
    setGeneratedPreview(null);
    setStreamingContent('');
    setStreamingBlocks([]);
    setStep('preview');

    try {
      const requestBody = mode === 'modify' && existingWorkflow
        ? {
            existingWorkflow: {
              blocks: existingWorkflow.blocks,
              connections: existingWorkflow.connections
            },
            modificationRequest,
            stream: false // Use non-streaming for reliability
          }
        : {
            objective,
            context,
            constraints: 'Keep the workflow focused and efficient. Use appropriate AI blocks for intelligent processing. Create connections between blocks.',
            stream: false // Use non-streaming for reliability
          };

      console.log('Calling workflow-generate:', requestBody);
      
      // Get the session token for authenticated requests
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Please log in to generate workflows');
        setStep('input');
        setIsGenerating(false);
        return;
      }
      
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/workflow-generate`;
      
      console.log('Fetching:', CHAT_URL);
      
      // Add timeout for client-side
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Client timeout after 90s');
        controller.abort();
      }, 90000); // 90s timeout
      
      let resp;
      try {
        resp = await fetch(CHAT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        if (fetchErr.name === 'AbortError') {
          throw new Error('Request timed out - please try again');
        }
        throw fetchErr;
      }
      
      console.log('Response status:', resp.status);

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.error || `HTTP ${resp.status}`);
      }

      const data = await resp.json();
      console.log('Response data:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      const workflow = data.workflow;
      
      if (workflow && workflow.blocks && workflow.blocks.length > 0) {
        setGeneratedPreview({
          blocks: workflow.blocks,
          connections: workflow.connections || []
        });
        setStreamingBlocks([]);
        
        if (mode === 'create') {
          const name = objective.length > 50 
            ? objective.substring(0, 50) + '...'
            : objective;
          setGeneratedName(name);
        } else {
          setGeneratedName(existingWorkflow?.name || 'Modified Workflow');
        }
        
        toast.success(`${mode === 'modify' ? 'Modified' : 'Generated'} workflow with ${workflow.blocks.length} blocks`);
      } else {
        console.error('Invalid workflow structure:', workflow);
        toast.error('Invalid workflow generated - please try again');
        setStep('input');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      toast.error(err.message || 'Failed to generate workflow');
      setStep('input');
    } finally {
      setIsGenerating(false);
    }
  };

  const tryParsePartialWorkflow = (content: string) => {
    try {
      // Try to find and parse the blocks array progressively
      const blocksMatch = content.match(/"blocks"\s*:\s*\[([\s\S]*)/);
      if (!blocksMatch) return;
      
      const blocksContent = blocksMatch[1];
      // Find complete block objects
      const blockMatches = blocksContent.matchAll(/\{[^{}]*"id"\s*:\s*"[^"]+"\s*,[^{}]*"type"\s*:\s*"[^"]+"\s*,[^{}]*"name"\s*:\s*"[^"]+"\s*[^{}]*\}/g);
      
      const blocks: WorkflowBlock[] = [];
      for (const match of blockMatches) {
        try {
          const block = JSON.parse(match[0]);
          if (block.id && block.type && block.name) {
            blocks.push({
              id: block.id,
              type: block.type as BlockType,
              name: block.name,
              config: block.config || {},
              position: block.position || { x: 100, y: blocks.length * 140 }
            });
          }
        } catch {
          // Skip incomplete blocks
        }
      }
      
      if (blocks.length > streamingBlocks.length) {
        setStreamingBlocks(blocks);
      }
    } catch {
      // Ignore parsing errors during streaming
    }
  };

  const parseWorkflowFromContent = (content: string) => {
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || content.match(/(\{[\s\S]*\})/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      const workflow = JSON.parse(jsonStr);
      
      if (!workflow.blocks || !Array.isArray(workflow.blocks)) {
        workflow.blocks = [];
      }
      if (!workflow.connections || !Array.isArray(workflow.connections)) {
        workflow.connections = [];
      }
      
      // Ensure positions are set
      workflow.blocks = workflow.blocks.map((block: any, index: number) => ({
        ...block,
        id: block.id || `block-${index + 1}`,
        position: block.position || { x: 100, y: 50 + index * 150 }
      }));
      
      // Create linear connections if none exist
      if (workflow.connections.length === 0 && workflow.blocks.length > 1) {
        workflow.connections = workflow.blocks.slice(0, -1).map((block: any, index: number) => ({
          id: `conn-${index + 1}`,
          sourceBlockId: block.id,
          targetBlockId: workflow.blocks[index + 1].id
        }));
      }
      
      return workflow;
    } catch (e) {
      console.error('Failed to parse workflow:', e);
      return null;
    }
  };

  const handleConfirm = () => {
    if (generatedPreview) {
      if (mode === 'modify' && onModify) {
        onModify(generatedPreview.blocks, generatedPreview.connections);
      } else {
        onGenerate(generatedPreview.blocks, generatedName, objective, generatedPreview.connections);
      }
      setStep('success');
      setTimeout(() => {
        handleReset();
        onClose();
      }, 1500);
    }
  };

  const handleReset = () => {
    setObjective('');
    setContext('');
    setModificationRequest('');
    setGeneratedPreview(null);
    setGeneratedName('');
    setStep('input');
  };

  const useExample = (prompt: string) => {
    if (mode === 'modify') {
      setModificationRequest(prompt);
    } else {
      setObjective(prompt);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { handleReset(); onClose(); } }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mode === 'modify' ? 'from-amber-500 to-orange-600' : 'from-violet-500 to-purple-600'} flex items-center justify-center`}>
              {mode === 'modify' ? <Edit3 className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
            </div>
            {mode === 'modify' ? 'Modifier le Workflow avec l\'IA' : 'AI Workflow Generator'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'modify' 
              ? `Décrivez comment vous voulez modifier "${existingWorkflow?.name}"`
              : 'Describe what you want to automate in natural language and AI will design the perfect workflow for you'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {step === 'input' && (
            <div className="space-y-6">
              {/* Mode tabs if we have an existing workflow */}
              {existingWorkflow && (
                <Tabs value={mode} onValueChange={(v) => setMode(v as 'create' | 'modify')} className="w-full">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="modify" className="gap-2">
                      <Edit3 className="w-4 h-4" />
                      Modifier ce workflow
                    </TabsTrigger>
                    <TabsTrigger value="create" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Créer un nouveau
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}

              {mode === 'modify' && existingWorkflow ? (
                <>
                  {/* Current workflow summary */}
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      Workflow actuel: {existingWorkflow.name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {existingWorkflow.blocks.slice(0, 6).map((block) => {
                        const def = BLOCK_DEFINITIONS[block.type as BlockType];
                        return (
                          <span 
                            key={block.id}
                            className={`text-xs px-2 py-1 rounded-full ${
                              def?.category === 'ai' ? 'bg-violet-500/20 text-violet-400' :
                              def?.category === 'trigger' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-muted text-muted-foreground'
                            }`}
                          >
                            {block.name}
                          </span>
                        );
                      })}
                      {existingWorkflow.blocks.length > 6 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          +{existingWorkflow.blocks.length - 6} autres
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Modification input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-500" />
                      Que voulez-vous modifier ?
                    </label>
                    <Textarea
                      value={modificationRequest}
                      onChange={(e) => setModificationRequest(e.target.value)}
                      placeholder="Ex: Ajouter une branche parallèle pour envoyer une notification, insérer une étape de validation, créer des connexions entre les blocs..."
                      rows={4}
                      className="text-base"
                    />
                  </div>

                  {/* Modification examples */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Exemples de modifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {MODIFICATION_EXAMPLES.map((example) => (
                        <button
                          key={example}
                          onClick={() => useExample(example)}
                          className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Main input for new workflow */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      What do you want to automate?
                    </label>
                    <Textarea
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      placeholder="Describe your workflow goal in detail. For example: 'Process customer support emails, classify by urgency, extract key information, generate response drafts, and escalate high-priority issues to the right team.'"
                      rows={4}
                      className="text-base"
                    />
                  </div>

                  {/* Context input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Additional context (optional)
                    </label>
                    <Input
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Any specific requirements, tools to integrate, output format preferences..."
                    />
                  </div>

                  {/* Example prompts */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Try an example
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {EXAMPLE_PROMPTS.map((example) => {
                        const Icon = example.icon;
                        return (
                          <button
                            key={example.title}
                            onClick={() => useExample(example.prompt)}
                            className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Icon className="w-4 h-4 text-primary" />
                              </div>
                              <span className="font-medium text-sm text-foreground">{example.title}</span>
                            </div>
                            <span className="text-xs text-muted-foreground line-clamp-2">{example.prompt}</span>
                            <span className="text-[10px] mt-2 px-2 py-0.5 rounded-full bg-muted text-muted-foreground inline-block">
                              {example.category}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              {/* Streaming indicator */}
              {isGenerating && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Génération en cours...</p>
                    <p className="text-xs text-muted-foreground">
                      {streamingBlocks.length > 0 
                        ? `${streamingBlocks.length} bloc${streamingBlocks.length > 1 ? 's' : ''} détecté${streamingBlocks.length > 1 ? 's' : ''}`
                        : 'Analyse de votre demande...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Workflow name */}
              {mode === 'create' && !isGenerating && generatedPreview && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Workflow Name</label>
                  <Input
                    value={generatedName}
                    onChange={(e) => setGeneratedName(e.target.value)}
                    placeholder="Name your workflow"
                  />
                </div>
              )}

              {/* Streaming blocks preview */}
              {isGenerating && streamingBlocks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    Blocs en cours de génération...
                  </h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto p-4 bg-muted/30 rounded-xl">
                    {streamingBlocks.map((block, index) => {
                      const def = BLOCK_DEFINITIONS[block.type as BlockType];
                      return (
                        <div 
                          key={block.id} 
                          className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${def?.color || 'from-gray-500 to-gray-400'} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                              {index + 1}
                            </div>
                            {index < streamingBlocks.length - 1 && (
                              <div className="w-0.5 h-6 bg-border mt-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-foreground">{block.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                def?.category === 'ai' ? 'bg-violet-500/20 text-violet-400' :
                                def?.category === 'trigger' ? 'bg-blue-500/20 text-blue-400' :
                                def?.category === 'integration' ? 'bg-emerald-500/20 text-emerald-400' :
                                'bg-muted text-muted-foreground'
                              }`}>
                                {block.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {/* Loading indicator for next block */}
                    <div className="flex items-center gap-4 opacity-50">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">Génération du bloc suivant...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Generated blocks preview (final) */}
              {!isGenerating && generatedPreview && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      {mode === 'modify' ? 'Workflow modifié' : 'Generated Workflow'} ({generatedPreview.blocks.length} blocs, {generatedPreview.connections.length} connexions)
                    </h4>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto p-4 bg-muted/30 rounded-xl">
                    {generatedPreview.blocks.map((block, index) => {
                      const def = BLOCK_DEFINITIONS[block.type as BlockType];
                      const outgoingConnections = generatedPreview.connections.filter(c => c.sourceBlockId === block.id);
                      
                      return (
                        <div key={block.id} className="flex items-start gap-4">
                          {/* Step number and connector */}
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${def?.color || 'from-gray-500 to-gray-400'} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                              {index + 1}
                            </div>
                            {outgoingConnections.length > 0 && (
                              <div className="w-0.5 h-6 bg-border mt-1" />
                            )}
                          </div>

                          {/* Block info */}
                          <div className="flex-1 pb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-foreground">{block.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                def?.category === 'trigger' ? 'bg-blue-500/20 text-blue-400' :
                                def?.category === 'ai' ? 'bg-violet-500/20 text-violet-400' :
                                def?.category === 'transform' ? 'bg-emerald-500/20 text-emerald-400' :
                                def?.category === 'control' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-slate-500/20 text-slate-400'
                              }`}>
                                {def?.category}
                              </span>
                              {outgoingConnections.length > 1 && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                                  {outgoingConnections.length} branches
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{def?.description}</p>
                            {Object.keys(block.config || {}).length > 0 && (
                              <div className="mt-2 p-2 rounded-lg bg-muted/50 text-xs font-mono max-h-20 overflow-hidden">
                                {Object.entries(block.config).slice(0, 2).map(([key, value]) => (
                                  <div key={key} className="truncate text-muted-foreground">
                                    <span className="text-foreground/70">{key}:</span> {String(value).slice(0, 60)}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI tips */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h5 className="font-medium text-sm text-foreground mb-1">
                      {mode === 'modify' ? 'Modifications appliquées' : 'AI Recommendation'}
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      {mode === 'modify' 
                        ? 'Vérifiez les changements ci-dessus. Après confirmation, vous pourrez ajuster les blocs et les connexions sur le canvas.'
                        : 'This workflow is optimized for your use case. After creation, you can customize each block\'s configuration, add more blocks, or adjust the flow to match your exact requirements.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {mode === 'modify' ? 'Workflow modifié !' : 'Workflow Created!'}
              </h3>
              <p className="text-muted-foreground text-center">
                {mode === 'modify' 
                  ? 'Les modifications ont été appliquées. Vous pouvez maintenant ajuster sur le canvas.'
                  : 'Your AI-generated workflow is ready. You can now customize and run it.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {step !== 'success' && (
          <div className="flex justify-between gap-3 pt-4 border-t border-border">
            <div>
              {step === 'preview' && (
                <Button variant="ghost" onClick={handleReset}>
                  Recommencer
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              {step === 'input' && (
                <Button
                  variant="hero"
                  onClick={handleGenerate}
                  disabled={isGenerating || (mode === 'create' ? !objective.trim() : !modificationRequest.trim())}
                  className="min-w-32"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {mode === 'modify' ? 'Modification...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      {mode === 'modify' ? 'Modifier' : 'Generate Workflow'}
                    </>
                  )}
                </Button>
              )}
              {step === 'preview' && (
                <Button variant="hero" onClick={handleConfirm}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {mode === 'modify' ? 'Appliquer' : 'Create Workflow'}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
