import { useState } from 'react';
import { WorkflowRun } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { History, CheckCircle, XCircle, Clock, Loader2, ChevronRight, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface WorkflowHistoryProps {
  runs: WorkflowRun[];
  loading: boolean;
  workflowName?: string;
}

export function WorkflowHistory({ runs, loading, workflowName }: WorkflowHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      success: 'bg-success/20 text-success',
      error: 'bg-destructive/20 text-destructive',
      running: 'bg-primary/20 text-primary',
      pending: 'bg-muted text-muted-foreground'
    };
    return styles[status] || styles.pending;
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <History className="w-4 h-4 mr-2" />
        History
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Execution History {workflowName && `- ${workflowName}`}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : runs.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No execution history yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {runs.map((run) => (
                  <button
                    key={run.id}
                    onClick={() => setSelectedRun(run)}
                    className="w-full p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(run.status || 'pending')}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-muted-foreground">
                            {run.id.slice(0, 8)}...
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(run.status || 'pending')}`}>
                            {run.status}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {run.created_at && formatDistanceToNow(new Date(run.created_at), { addSuffix: true })}
                          {run.completed_at && run.started_at && (
                            <span className="ml-2">
                              • Duration: {Math.round((new Date(run.completed_at).getTime() - new Date(run.started_at).getTime()) / 1000)}s
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Run Detail Modal */}
      <Dialog open={!!selectedRun} onOpenChange={() => setSelectedRun(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Run Details
            </DialogTitle>
          </DialogHeader>

          {selectedRun && (
            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Status */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                {getStatusIcon(selectedRun.status || 'pending')}
                <div>
                  <div className="font-medium">{selectedRun.status?.toUpperCase()}</div>
                  <div className="text-xs text-muted-foreground font-mono">{selectedRun.id}</div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">Started</div>
                  <div className="text-sm font-medium">
                    {selectedRun.started_at 
                      ? new Date(selectedRun.started_at).toLocaleString()
                      : '-'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">Completed</div>
                  <div className="text-sm font-medium">
                    {selectedRun.completed_at 
                      ? new Date(selectedRun.completed_at).toLocaleString()
                      : '-'}
                  </div>
                </div>
              </div>

              {/* Input */}
              {selectedRun.input_data && (
                <div>
                  <div className="text-sm font-medium mb-2">Input Data</div>
                  <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto max-h-40">
                    {typeof selectedRun.input_data === 'string' 
                      ? selectedRun.input_data 
                      : JSON.stringify(selectedRun.input_data, null, 2)}
                  </pre>
                </div>
              )}

              {/* Output */}
              {selectedRun.output_data && (
                <div>
                  <div className="text-sm font-medium mb-2">Output Data</div>
                  <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto max-h-40">
                    {typeof selectedRun.output_data === 'string' 
                      ? selectedRun.output_data 
                      : JSON.stringify(selectedRun.output_data, null, 2)}
                  </pre>
                </div>
              )}

              {/* Error */}
              {selectedRun.error_message && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="text-sm font-medium text-destructive mb-2">Error</div>
                  <div className="text-sm text-destructive/80">{selectedRun.error_message}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
