import { useState } from 'react';
import { WorkflowRun, WorkflowBlock, BlockConnection } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { History, CheckCircle, XCircle, Clock, Loader2, ChevronRight, Eye, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WorkflowVersion {
  id: string;
  blocks: WorkflowBlock[];
  connections: BlockConnection[];
  timestamp: string;
  label?: string;
}

interface WorkflowHistoryProps {
  runs: WorkflowRun[];
  loading: boolean;
  workflowName?: string;
  versions?: WorkflowVersion[];
  onRestoreVersion?: (blocks: WorkflowBlock[], connections: BlockConnection[]) => void;
}

export function WorkflowHistory({ runs, loading, workflowName, versions = [], onRestoreVersion }: WorkflowHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null);
  const [activeTab, setActiveTab] = useState<'runs' | 'versions'>('versions');
  const [versionToRestore, setVersionToRestore] = useState<WorkflowVersion | null>(null);

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

  const handleRestoreVersion = () => {
    if (versionToRestore && onRestoreVersion) {
      onRestoreVersion(versionToRestore.blocks, versionToRestore.connections);
      toast.success('Version restaurée');
      setVersionToRestore(null);
      setIsOpen(false);
    }
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
              Historique {workflowName && `- ${workflowName}`}
            </DialogTitle>
            <DialogDescription>
              Consultez les versions et exécutions précédentes
            </DialogDescription>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg mb-4">
            <button
              onClick={() => setActiveTab('versions')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'versions' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <RotateCcw className="w-4 h-4 inline mr-2" />
              Versions ({versions.length})
            </button>
            <button
              onClick={() => setActiveTab('runs')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'runs' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <History className="w-4 h-4 inline mr-2" />
              Exécutions ({runs.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'versions' ? (
              versions.length === 0 ? (
                <div className="text-center py-12">
                  <RotateCcw className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune version enregistrée</p>
                  <p className="text-xs text-muted-foreground mt-2">Les versions sont créées automatiquement lors des modifications</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {versions.map((version, index) => (
                    <div
                      key={version.id}
                      className="p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                          {versions.length - index}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {version.label || `Version ${versions.length - index}`}
                            </span>
                            {index === 0 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                                Actuelle
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(version.timestamp), { addSuffix: true })}
                            <span className="ml-2">• {version.blocks.length} blocs</span>
                          </div>
                        </div>

                        {index > 0 && onRestoreVersion && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setVersionToRestore(version)}
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Restaurer
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : runs.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune exécution</p>
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
                              • Durée: {Math.round((new Date(run.completed_at).getTime() - new Date(run.started_at).getTime()) / 1000)}s
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
              Détails de l'exécution
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
                  <div className="text-xs text-muted-foreground mb-1">Démarré</div>
                  <div className="text-sm font-medium">
                    {selectedRun.started_at 
                      ? new Date(selectedRun.started_at).toLocaleString('fr-FR')
                      : '-'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">Terminé</div>
                  <div className="text-sm font-medium">
                    {selectedRun.completed_at 
                      ? new Date(selectedRun.completed_at).toLocaleString('fr-FR')
                      : '-'}
                  </div>
                </div>
              </div>

              {/* Input */}
              {selectedRun.input_data && (
                <div>
                  <div className="text-sm font-medium mb-2">Données d'entrée</div>
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
                  <div className="text-sm font-medium mb-2">Données de sortie</div>
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
                  <div className="text-sm font-medium text-destructive mb-2">Erreur</div>
                  <div className="text-sm text-destructive/80">{selectedRun.error_message}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation */}
      <AlertDialog open={!!versionToRestore} onOpenChange={() => setVersionToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurer cette version ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le workflow actuel sera remplacé par cette version. Vous pouvez toujours annuler cette action avec Ctrl+Z.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreVersion}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
