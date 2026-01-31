import { useState } from 'react';
import { WorkflowBlock, WorkflowRunLog, BlockConnection, BLOCK_DEFINITIONS } from '@/types/workflow';
import { executeWorkflowViaServer } from '@/lib/workflow-executor';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Play, Loader2, CheckCircle, XCircle, Clock, ChevronDown, ChevronRight, GitBranch } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface WorkflowExecutorProps {
  blocks: WorkflowBlock[];
  connections?: BlockConnection[];
  workflowId: string;
  workflowName: string;
  onRunCreated?: (runId: string, logs: WorkflowRunLog[], output: any) => void;
}

export function WorkflowExecutor({ blocks, connections = [], workflowId, workflowName, onRunCreated }: WorkflowExecutorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<WorkflowRunLog[]>([]);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<any>(null);

  const triggerBlock = blocks.find(b => b.type.startsWith('trigger_'));
  const hasBlocks = blocks.length > 0;

  // Triggers that fetch their own data automatically (real integrations)
  const autoTriggerTypes = [
    'trigger_gmail',
    'trigger_email', 
    'trigger_webhook', 
    'trigger_schedule',
    'trigger_database',
    'trigger_api'
  ];
  
  const isAutoTrigger = triggerBlock && autoTriggerTypes.includes(triggerBlock.type);
  const requiresManualInput = !isAutoTrigger;

  const downloadFile = async (filename: string, content: unknown, mimeType?: string, format?: string) => {
    if (!filename) return;

    try {
      const safeContent = typeof content === 'string' ? content : JSON.stringify(content ?? '', null, 2);

      let blob: Blob;
      const resolvedFormat = (format || '').toLowerCase();
      const resolvedMime = mimeType || (resolvedFormat === 'docx'
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'application/octet-stream');

      // If backend returns plain text for a DOCX, generate a real DOCX on the client.
      if (resolvedFormat === 'docx' || resolvedMime.includes('officedocument.wordprocessingml.document')) {
        const { Document, Packer, Paragraph } = await import('docx');
        const paragraphs = safeContent
          .split(/\r?\n/)
          .map((line) => new Paragraph({ text: line || ' ' }));

        const doc = new Document({
          sections: [{ children: paragraphs }],
        });

        blob = await Packer.toBlob(doc);
      } else {
        blob = new Blob([safeContent], { type: resolvedMime });
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Release memory
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (err) {
      console.error('Download failed:', err);
      toast.error("Le téléchargement a échoué");
    }
  };

  const maybeAutoDownload = async (execution: any) => {
    const out = execution?.output;
    if (!out || out.type !== 'download') return;

    const payload = out._downloadData || out;
    await downloadFile(payload.filename, payload.content, payload.mimeType, payload.format);
  };

  const handleRun = async (autoInput?: string) => {
    const inputData = autoInput ?? input;
    
    // Only require input for manual trigger types
    if (requiresManualInput && !inputData.trim()) {
      toast.error('Please provide input data');
      return;
    }

    setIsRunning(true);
    setLogs([]);
    setResult(null);

    try {
      // For auto-triggers (ex: Gmail), do not require any user-provided input.
      const executionInput = isAutoTrigger ? '' : inputData;
      
      // Execute via server-side Edge Function for proper AI access
      const execution = await executeWorkflowViaServer(blocks, executionInput, workflowId);
      
      // Update logs progressively from server response
      if (execution.logs) {
        setLogs(execution.logs);
      }

      setResult(execution);
      
      if (execution.success) {
        toast.success('Workflow completed successfully');
        await maybeAutoDownload(execution);
      } else {
        toast.error((execution as any).error || 'Workflow failed');
      }

      onRunCreated?.(workflowId, execution.logs, execution.output);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Execution error';
      toast.error(errorMessage);
      console.error('Workflow execution error:', error);
      setResult({ success: false, output: null, logs: [] });
    } finally {
      setIsRunning(false);
    }
  };

  const toggleLog = (blockId: string) => {
    setExpandedLogs(prev => {
      const next = new Set(prev);
      if (next.has(blockId)) next.delete(blockId);
      else next.add(blockId);
      return next;
    });
  };

  return (
    <>
      <Button
        variant="hero"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={!hasBlocks}
      >
        <Play className="w-4 h-4 mr-2" />
        Run
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Execute: {workflowName}</DialogTitle>
            <DialogDescription>
              {requiresManualInput
                ? 'Provide input data to run your workflow'
                : 'Ce workflow se lance sans saisie (il récupère ses données automatiquement).'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 py-4">
            {/* Auto-trigger info */}
            {isAutoTrigger && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 text-primary">
                  <Play className="w-4 h-4" />
                  <span className="font-medium">Trigger automatique</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Ce workflow récupère automatiquement les données depuis {triggerBlock?.type === 'trigger_email' ? 'votre boîte mail' : 'la source configurée'}.
                </p>
              </div>
            )}

            {/* Input section - only for manual triggers */}
            {requiresManualInput && (
              <div className="space-y-2">
                <Label>Input Data</Label>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    triggerBlock?.type === 'trigger_text' 
                      ? 'Enter text to process...'
                      : triggerBlock?.type === 'trigger_form'
                      ? 'Enter form data (JSON or plain text)...'
                      : 'Enter input data for the workflow...'
                  }
                  rows={5}
                  disabled={isRunning}
                />
              </div>
            )}

            {/* Execution logs */}
            {logs.length > 0 && (
              <div className="space-y-3">
                <Label>Execution Log</Label>
                <div className="space-y-2">
                  {logs.map((log, index) => {
                    const isExpanded = expandedLogs.has(log.blockId);
                    const isBranch = log.blockName.startsWith('[');
                    return (
                      <div
                        key={`${log.blockId}-${index}`}
                        className="border border-border rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleLog(log.blockId)}
                          className="w-full p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                        >
                          {log.status === 'pending' && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                          {log.status === 'running' && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                          {log.status === 'success' && <CheckCircle className="w-4 h-4 text-success" />}
                          {log.status === 'error' && <XCircle className="w-4 h-4 text-destructive" />}
                          
                          <span className="flex-1 font-medium text-sm flex items-center gap-2">
                            {isBranch && <GitBranch className="w-3 h-3 text-amber-500" />}
                            {log.blockName}
                          </span>
                          
                          {isBranch && (
                            <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/30">
                              Parallèle
                            </Badge>
                          )}
                          
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {log.duration}ms
                          </span>
                          
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                        
                        {isExpanded && (
                          <div className="p-3 border-t border-border bg-muted/30 space-y-3">
                            <div>
                              <div className="text-xs font-medium text-muted-foreground mb-1">Input</div>
                              <pre className="text-xs bg-background p-2 rounded overflow-x-auto max-h-32">
                                {typeof log.input === 'string' ? log.input : JSON.stringify(log.input, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-muted-foreground mb-1">Output</div>
                              <pre className="text-xs bg-background p-2 rounded overflow-x-auto max-h-32">
                                {typeof log.output === 'string' ? log.output : JSON.stringify(log.output, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Final result */}
            {result && (
              <div className={`p-4 rounded-lg ${result.success ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span className="font-semibold">
                    {result.success ? 'Workflow Completed' : 'Workflow Failed'}
                  </span>
                </div>
                {!result.success && (result as any).error && (
                  <div className="text-sm text-destructive">
                    {(result as any).error}
                  </div>
                )}
                {result.output && (
                  <pre className="text-xs bg-background/50 p-3 rounded mt-2 overflow-x-auto max-h-48">
                    {typeof result.output === 'string' ? result.output : JSON.stringify(result.output, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button
              variant="hero"
              onClick={() => handleRun()}
              disabled={isRunning || (requiresManualInput && !input.trim())}
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {isAutoTrigger ? 'Lancer' : 'Execute'}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
