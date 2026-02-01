import { useState, useEffect } from 'react';
import { WorkflowBlock, WorkflowRunLog, BlockConnection, BLOCK_DEFINITIONS } from '@/types/workflow';
import { executeWorkflowViaServer } from '@/lib/workflow-executor';
import { runPreflightValidation, PreflightResult, PreflightIssue } from '@/lib/workflow-preflight';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Play, Loader2, CheckCircle, XCircle, Clock, ChevronDown, ChevronRight, GitBranch, AlertTriangle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WorkflowExecutorProps {
  blocks: WorkflowBlock[];
  connections?: BlockConnection[];
  workflowId: string;
  workflowName: string;
  onRunCreated?: (runId: string, logs: WorkflowRunLog[], output: any) => void;
  onFocusBlock?: (blockId: string) => void;
}

export function WorkflowExecutor({
  blocks,
  connections = [],
  workflowId,
  workflowName,
  onRunCreated,
  onFocusBlock,
}: WorkflowExecutorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [preflightResult, setPreflightResult] = useState<PreflightResult | null>(null);
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<WorkflowRunLog[]>([]);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<any>(null);

  // Run preflight validation when dialog opens
  useEffect(() => {
    if (isOpen && blocks.length > 0) {
      setIsValidating(true);
      setPreflightResult(null);
      runPreflightValidation(blocks)
        .then(result => {
          setPreflightResult(result);
        })
        .catch(err => {
          console.error('Preflight validation error:', err);
          // Don't block on validation errors, just log them
          setPreflightResult({ valid: true, issues: [], canProceed: true });
        })
        .finally(() => {
          setIsValidating(false);
        });
    }
  }, [isOpen, blocks]);

  // Helper to get a human-readable preview of output
  const getOutputPreview = (output: any): string => {
    if (!output) return 'Aucune sortie';
    if (typeof output === 'string') return output.slice(0, 80) + (output.length > 80 ? '...' : '');
    
    // Handle common output types
    if (output.type === 'email' && output.subject) return `📧 ${output.subject}`;
    if (output.type === 'document' && output.title) return `📄 ${output.title}`;
    if (output.type === 'download' && output.filename) return `💾 ${output.filename}`;
    if (output.type === 'webhook') return `🔗 Webhook reçu`;
    if (output.type === 'generated') return `✨ ${output.title || 'Document généré'}`;
    
    // Check for AI/text outputs
    if (output.result && typeof output.result === 'string') {
      return output.result.slice(0, 80) + (output.result.length > 80 ? '...' : '');
    }
    if (output.text && typeof output.text === 'string') {
      return output.text.slice(0, 80) + (output.text.length > 80 ? '...' : '');
    }
    if (output.content && typeof output.content === 'string') {
      return output.content.slice(0, 80) + (output.content.length > 80 ? '...' : '');
    }
    if (output.response && typeof output.response === 'string') {
      return output.response.slice(0, 80) + (output.response.length > 80 ? '...' : '');
    }
    if (output.message && typeof output.message === 'string') {
      return output.message.slice(0, 80) + (output.message.length > 80 ? '...' : '');
    }
    
    // For arrays, show count
    if (Array.isArray(output)) return `📋 ${output.length} élément(s)`;
    
    // For objects, show key count or first meaningful value
    if (typeof output === 'object') {
      const keys = Object.keys(output).filter(k => !k.startsWith('_'));
      if (keys.length === 0) return 'Objet vide';
      
      // Try to find a meaningful string value
      for (const key of keys) {
        const val = output[key];
        if (typeof val === 'string' && val.length > 0 && val.length < 100) {
          return val.slice(0, 80) + (val.length > 80 ? '...' : '');
        }
      }
      
      return `{${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''}}`;
    }
    
    return String(output).slice(0, 80);
  };

  const triggerBlock = blocks.find(b => b.type.startsWith('trigger_') || b.type.startsWith('manual_') || b.type.startsWith('webhook_') || b.type.startsWith('schedule_') || b.type.startsWith('email_') || b.type.startsWith('form_'));
  const hasBlocks = blocks.length > 0;

  // Only MANUAL triggers require user input; all others fetch data automatically
  const manualTriggerTypes = [
    'trigger_manual',
    'manual_trigger', // block-library.ts naming
    'trigger_text',
    'trigger_file',
    'trigger_form',
    'form_trigger',
  ];
  
  const requiresManualInput = triggerBlock ? manualTriggerTypes.includes(triggerBlock.type) : false;

  const downloadFile = async (filename: string, content: unknown, mimeType?: string, format?: string, title?: string) => {
    if (!filename) return;

      try {
      const safeContent = typeof content === 'string' ? content : JSON.stringify(content ?? '', null, 2);

      let blob: Blob;
      const resolvedFormat = (format || '').toLowerCase();
      const resolvedMime = mimeType || (resolvedFormat === 'docx'
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : resolvedFormat === 'pdf'
        ? 'application/pdf'
        : 'application/octet-stream');

      // Generate real DOCX on the client
      if (resolvedFormat === 'docx' || resolvedMime.includes('officedocument.wordprocessingml.document')) {
        const { Document, Packer, Paragraph, TextRun } = await import('docx');
        const paragraphs = safeContent
          .split(/\r?\n/)
          .map((line) => new Paragraph({ 
            children: [new TextRun({ text: line || ' ', font: 'Calibri', size: 22 })] 
          }));

        const doc = new Document({
          title: title || 'Document',
          sections: [{ children: paragraphs }],
        });

        blob = await Packer.toBlob(doc);
      } 
      // Generate professional PDF using the document-export library
      else if (resolvedFormat === 'pdf' || resolvedMime === 'application/pdf') {
        const { generatePDF } = await import('@/lib/document-export');
        
        // Default professional branding
        const branding = {
          primaryColor: '#0A1A3C',
          secondaryColor: '#3C4DFE',
          accentColor: '#6366F1',
          fontFamily: 'Calibri',
          companyName: 'AETHER',
          logoUrl: '',
          tagline: 'AI Suite'
        };
        
        const docData = {
          title: title || 'Document',
          content: safeContent,
          createdAt: new Date().toISOString(),
          version: 1
        };
        
        blob = await generatePDF(docData, branding);
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
    const downloadableTypes = ['download', 'pdf_document', 'word_document'];
    
    // First, check the final output
    const out = execution?.output;
    if (out && downloadableTypes.includes(out.type)) {
      const payload = out._downloadData || out;
      await downloadFile(payload.filename, payload.content, payload.mimeType, payload.format, payload.title);
      return;
    }
    
    // If final output is not a document, search through execution logs for document blocks
    const executionLogs = execution?.logs || [];
    for (const log of executionLogs) {
      const logOutput = log?.output;
      if (logOutput && downloadableTypes.includes(logOutput.type)) {
        const payload = logOutput._downloadData || logOutput;
        if (payload.content && payload.content.length > 0) {
          console.log('Found downloadable document in logs:', payload.filename);
          await downloadFile(payload.filename, payload.content, payload.mimeType, payload.format, payload.title);
          return; // Download only the first document found
        }
      }
    }
  };

  const handleRun = async (autoInput?: string) => {
    const inputData = autoInput ?? input;
    
    // Block execution if preflight failed with errors
    if (preflightResult && !preflightResult.canProceed) {
      toast.error('Corrigez les problèmes avant d\'exécuter le workflow');
      return;
    }
    
    // Only require input for manual trigger types
    if (requiresManualInput && !inputData.trim()) {
      toast.error('Please provide input data');
      return;
    }

    setIsRunning(true);
    setLogs([]);
    setResult(null);

    try {
      // For auto-triggers (Gmail, Webhook, Schedule, etc.), do not require any user-provided input.
      const executionInput = requiresManualInput ? inputData : '';
      
        // Execute via server-side backend function (for AI access) using the real graph connections
        const execution = await executeWorkflowViaServer(blocks, executionInput, workflowId, undefined, connections);
      
      // Update logs progressively from server response
      if (execution.logs) {
        setLogs(execution.logs);
      }

      setResult(execution);
      
      if (execution.success) {
        toast.success('Workflow completed successfully');
        await maybeAutoDownload(execution);
      } else {
        const failedBlockName = (execution as any).failedBlockName;
        const err = (execution as any).error || 'Workflow failed';
        toast.error(failedBlockName ? `Blocage dans “${failedBlockName}” : ${err}` : err);
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
            {/* Preflight Validation Status */}
            {isValidating && (
              <div className="flex items-center gap-2 text-muted-foreground p-3 rounded-lg bg-muted/50">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Vérification des prérequis...</span>
              </div>
            )}

            {/* Preflight Errors - Block execution */}
            {preflightResult && !preflightResult.canProceed && (
              <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription className="ml-2">
                  <div className="font-medium mb-2">
                    Prérequis manquants ({preflightResult.issues.filter(i => i.severity === 'error').length})
                  </div>
                  <div className="space-y-2 text-sm">
                    {preflightResult.issues
                      .filter(i => i.severity === 'error')
                      .map((issue, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-medium">{issue.blockName}:</span>{' '}
                            <span>{issue.message}</span>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              → {issue.fix}
                            </div>
                            {issue.requiresBlockConfig && onFocusBlock && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-1 h-6 text-xs"
                                onClick={() => {
                                  setIsOpen(false);
                                  setTimeout(() => onFocusBlock(issue.blockId), 100);
                                }}
                              >
                                Ouvrir le bloc
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Preflight Warnings */}
            {preflightResult && preflightResult.canProceed && preflightResult.issues.length > 0 && (
              <Alert className="border-amber-500/50 bg-amber-500/10">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="ml-2 text-amber-700 dark:text-amber-400">
                  <div className="font-medium mb-1">Avertissements</div>
                  <div className="space-y-1 text-sm">
                    {preflightResult.issues.map((issue, idx) => (
                      <div key={idx}>• {issue.blockName}: {issue.message}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Auto-trigger info */}
            {!requiresManualInput && triggerBlock && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 text-primary">
                  <Play className="w-4 h-4" />
                  <span className="font-medium">Trigger automatique</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Ce workflow récupère automatiquement les données depuis {
                    ['email_trigger', 'email_oauth', 'trigger_gmail'].includes(triggerBlock.type)
                      ? 'votre boîte mail'
                      : triggerBlock.type.includes('webhook')
                        ? 'le webhook externe'
                        : triggerBlock.type.includes('schedule')
                          ? 'le déclencheur planifié'
                          : 'la source configurée'
                  }.
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
                    triggerBlock?.type === 'trigger_manual' 
                      ? 'Enter text to process...'
                      : triggerBlock?.type === 'trigger_webhook'
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
                    const errorMessage = log.error || (log.output && typeof log.output === 'object' ? (log.output as any).error : undefined);
                    return (
                      <div
                        key={`${log.blockId}-${index}`}
                        className="border border-border rounded-lg overflow-hidden"
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleLog(log.blockId)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleLog(log.blockId);
                            }
                          }}
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

                          {log.status === 'error' && errorMessage && (
                            <span className="hidden md:inline text-xs text-destructive truncate max-w-[220px]">
                              {errorMessage}
                            </span>
                          )}

                          {log.status === 'error' && onFocusBlock && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onFocusBlock(log.blockId);
                              }}
                            >
                              Corriger
                            </Button>
                          )}
                          
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
                        </div>
                        
                        {isExpanded && (
                          <div className="p-3 border-t border-border bg-muted/30 space-y-3">
                            {log.status === 'error' && errorMessage && (
                              <div className="space-y-2">
                                <div className="text-xs font-medium text-destructive">Erreur</div>
                                <div className="text-xs text-destructive bg-background p-2 rounded">
                                  {errorMessage}
                                </div>
                                {(log as any).errorDetails?.hint && (
                                  <div className="text-xs text-muted-foreground">
                                    <span className="font-medium">Conseil :</span> {(log as any).errorDetails.hint}
                                  </div>
                                )}
                                {Array.isArray((log as any).errorDetails?.fields) && (
                                  <div className="text-xs text-muted-foreground space-y-1">
                                    <div className="font-medium">Champs à vérifier :</div>
                                    <ul className="list-disc pl-4">
                                      {(log as any).errorDetails.fields.map((f: any, i: number) => (
                                        <li key={i}>
                                          <span className="font-medium">{f.field}</span> — {f.message}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
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

            {/* Final result - Enhanced summary */}
            {result && (
              <div className={`p-4 rounded-lg ${result.success ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'}`}>
                <div className="flex items-center gap-2 mb-3">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span className="font-semibold">
                    {result.success ? 'Workflow terminé' : 'Workflow échoué'}
                  </span>
                </div>

                {/* Execution Summary - Show what actually happened */}
                {logs.length > 0 && (
                  <div className="mb-3 space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Résumé d'exécution :</div>
                    <div className="grid gap-1.5">
                      {logs.map((log, idx) => {
                        const hasRealOutput = log.output && 
                          typeof log.output === 'object' && 
                          !log.output.error &&
                          Object.keys(log.output).length > 0;
                        const outputPreview = hasRealOutput 
                          ? getOutputPreview(log.output)
                          : log.status === 'error' 
                            ? `❌ ${log.error || 'Erreur'}` 
                            : '⚠️ Aucune donnée produite';
                        
                        return (
                          <div 
                            key={`summary-${log.blockId}-${idx}`}
                            className={`text-xs p-2 rounded ${
                              log.status === 'success' && hasRealOutput
                                ? 'bg-success/5'
                                : log.status === 'error'
                                  ? 'bg-destructive/10'
                                  : 'bg-amber-500/10'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {log.status === 'success' && hasRealOutput ? (
                                <CheckCircle className="w-3 h-3 text-success shrink-0" />
                              ) : log.status === 'error' ? (
                                <XCircle className="w-3 h-3 text-destructive shrink-0" />
                              ) : (
                                <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                              )}
                              <span className="font-medium truncate max-w-[100px]">{log.blockName}</span>
                            </div>
                            <div className="mt-1 text-muted-foreground break-words pl-5">
                              {outputPreview}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {!result.success && (result as any).error && (
                  <div className="text-sm text-destructive mb-2 break-words">
                    <span className="font-medium">Erreur:</span>{' '}
                    <span className="break-all">{(result as any).error}</span>
                  </div>
                )}

                {!result.success && onFocusBlock && (result as any).failedBlockId && (
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Close dialog and focus on the failed block
                        setIsOpen(false);
                        onFocusBlock((result as any).failedBlockId);
                      }}
                    >
                      Ouvrir le bloc en erreur
                    </Button>
                    {(result as any).failedBlockName && (
                      <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {(result as any).failedBlockName}
                      </span>
                    )}
                  </div>
                )}

                {!result.success && (result as any).errorDetails?.hint && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium">Conseil :</span> {(result as any).errorDetails.hint}
                  </div>
                )}
                
                {result.output && (
                  <details className="mt-3">
                    <summary className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground">
                      Voir la sortie brute
                    </summary>
                    <pre className="text-xs bg-background/50 p-3 rounded mt-2 overflow-x-auto max-h-48">
                      {typeof result.output === 'string' ? result.output : JSON.stringify(result.output, null, 2)}
                    </pre>
                  </details>
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
              disabled={
                isRunning || 
                isValidating ||
                (requiresManualInput && !input.trim()) ||
                (preflightResult && !preflightResult.canProceed)
              }
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Vérification...
                </>
              ) : preflightResult && !preflightResult.canProceed ? (
                <>
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  Prérequis manquants
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {!requiresManualInput ? 'Lancer' : 'Execute'}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
