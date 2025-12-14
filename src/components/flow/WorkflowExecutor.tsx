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

  const handleRun = async () => {
    if (!input.trim()) {
      toast.error('Please provide input data');
      return;
    }

    setIsRunning(true);
    setLogs([]);
    setResult(null);

    try {
      // Execute via server-side Edge Function for proper AI access
      const execution = await executeWorkflowViaServer(blocks, input, workflowId);
      
      // Update logs progressively from server response
      if (execution.logs) {
        setLogs(execution.logs);
      }

      setResult(execution);
      
      if (execution.success) {
        toast.success('Workflow completed successfully');
      } else {
        toast.error('Workflow failed');
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
        Run Workflow
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Execute: {workflowName}</DialogTitle>
            <DialogDescription>
              Provide input data to run your workflow
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 py-4">
            {/* Input section */}
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
              onClick={handleRun}
              disabled={isRunning || !input.trim()}
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Execute
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
