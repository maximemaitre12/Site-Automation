import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { WorkflowBlock, BlockType, BLOCK_DEFINITIONS } from '@/types/workflow';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sparkles, Wand2, Loader2, CheckCircle, AlertCircle, 
  Lightbulb, Zap, FileText, Users, ShoppingCart, Headphones,
  Mail, Database, Brain, TrendingUp, Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface AIWorkflowGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (blocks: WorkflowBlock[], name: string, description: string) => void;
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

export function AIWorkflowGenerator({ isOpen, onClose, onGenerate }: AIWorkflowGeneratorProps) {
  const [objective, setObjective] = useState('');
  const [context, setContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<WorkflowBlock[] | null>(null);
  const [generatedName, setGeneratedName] = useState('');
  const [step, setStep] = useState<'input' | 'preview' | 'success'>('input');

  const handleGenerate = async () => {
    if (!objective.trim()) {
      toast.error('Please describe your workflow objective');
      return;
    }

    setIsGenerating(true);
    setGeneratedPreview(null);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      console.log('Calling workflow-generate with:', { objective, context });
      
      const { data, error } = await supabase.functions.invoke('workflow-generate', {
        body: { 
          objective,
          context,
          constraints: 'Keep the workflow focused and efficient. Use appropriate AI blocks for intelligent processing.'
        }
      });

      clearTimeout(timeoutId);

      console.log('Response:', { data, error });

      if (error) {
        console.error('Generation error:', error);
        toast.error(error.message || 'Failed to generate workflow');
        setIsGenerating(false);
        return;
      }

      if (data?.workflow?.blocks && Array.isArray(data.workflow.blocks)) {
        setGeneratedPreview(data.workflow.blocks);
        const name = objective.length > 50 
          ? objective.substring(0, 50) + '...'
          : objective;
        setGeneratedName(name);
        setStep('preview');
        toast.success(`Generated workflow with ${data.workflow.blocks.length} blocks`);
      } else if (data?.error) {
        console.error('API returned error:', data.error);
        toast.error(data.error);
      } else {
        console.error('Invalid response structure:', data);
        toast.error('Invalid workflow generated - please try again');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      if (err.name === 'AbortError') {
        toast.error('Generation timeout - please try a simpler workflow');
      } else {
        toast.error(err.message || 'Failed to generate workflow');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsGenerating(false);
    }
  };

  const handleConfirm = () => {
    if (generatedPreview) {
      onGenerate(generatedPreview, generatedName, objective);
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
    setGeneratedPreview(null);
    setGeneratedName('');
    setStep('input');
  };

  const useExample = (prompt: string) => {
    setObjective(prompt);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { handleReset(); onClose(); } }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            AI Workflow Generator
          </DialogTitle>
          <DialogDescription>
            Describe what you want to automate in natural language and AI will design the perfect workflow for you
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {step === 'input' && (
            <div className="space-y-6">
              {/* Main input */}
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
            </div>
          )}

          {step === 'preview' && generatedPreview && (
            <div className="space-y-6">
              {/* Workflow name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Workflow Name</label>
                <Input
                  value={generatedName}
                  onChange={(e) => setGeneratedName(e.target.value)}
                  placeholder="Name your workflow"
                />
              </div>

              {/* Generated blocks preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Generated Workflow ({generatedPreview.length} blocks)
                  </h4>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto p-4 bg-muted/30 rounded-xl">
                  {generatedPreview.map((block, index) => {
                    const def = BLOCK_DEFINITIONS[block.type as BlockType];
                    return (
                      <div key={block.id} className="flex items-start gap-4">
                        {/* Step number and connector */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${def?.color || 'from-gray-500 to-gray-400'} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                            {index + 1}
                          </div>
                          {index < generatedPreview.length - 1 && (
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

              {/* AI tips */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h5 className="font-medium text-sm text-foreground mb-1">AI Recommendation</h5>
                    <p className="text-sm text-muted-foreground">
                      This workflow is optimized for your use case. After creation, you can customize each block's configuration, 
                      add more blocks, or adjust the flow to match your exact requirements.
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
              <h3 className="text-xl font-semibold text-foreground mb-2">Workflow Created!</h3>
              <p className="text-muted-foreground text-center">
                Your AI-generated workflow is ready. You can now customize and run it.
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
                  Start Over
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {step === 'input' && (
                <Button
                  variant="hero"
                  onClick={handleGenerate}
                  disabled={isGenerating || !objective.trim()}
                  className="min-w-32"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Workflow
                    </>
                  )}
                </Button>
              )}
              {step === 'preview' && (
                <Button variant="hero" onClick={handleConfirm}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Workflow
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
