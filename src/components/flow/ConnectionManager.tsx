import { useState } from 'react';
import { WorkflowBlock, BlockConnection, BLOCK_DEFINITIONS, BlockType } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Link2, 
  Plus, 
  Trash2, 
  ArrowRight,
  GitBranch,
  Sparkles,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionManagerProps {
  block: WorkflowBlock;
  allBlocks: WorkflowBlock[];
  connections: BlockConnection[];
  onAddConnection: (connection: BlockConnection) => void;
  onRemoveConnection: (connectionId: string) => void;
}

export function ConnectionManager({
  block,
  allBlocks,
  connections,
  onAddConnection,
  onRemoveConnection
}: ConnectionManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const def = BLOCK_DEFINITIONS[block.type as BlockType];
  const hasMultipleOutputs = def?.allowMultipleOutputs || false;
  
  // Get connections from this block
  const outgoingConnections = connections.filter(c => c.sourceBlockId === block.id);
  const incomingConnections = connections.filter(c => c.targetBlockId === block.id);
  
  // Get available blocks to connect (not already connected, not self)
  const availableTargets = allBlocks.filter(b => 
    b.id !== block.id && 
    !outgoingConnections.some(c => c.targetBlockId === b.id)
  );

  const handleAddConnection = (targetBlockId: string, sourceHandle?: string) => {
    const newConnection: BlockConnection = {
      id: crypto.randomUUID(),
      sourceBlockId: block.id,
      targetBlockId,
      sourceHandle
    };
    onAddConnection(newConnection);
  };

  const getBlockIcon = (blockType: string) => {
    const blockDef = BLOCK_DEFINITIONS[blockType as BlockType];
    if (blockDef?.category === 'ai') return <Sparkles className="w-3 h-3" />;
    if (blockDef?.category === 'trigger') return <Zap className="w-3 h-3" />;
    return <GitBranch className="w-3 h-3" />;
  };

  const getBlockColor = (blockType: string) => {
    const blockDef = BLOCK_DEFINITIONS[blockType as BlockType];
    return blockDef?.color || 'from-gray-500 to-gray-400';
  };

  return (
    <div className="space-y-3">
      {/* Current connections summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Link2 className="w-4 h-4" />
          Connexions sortantes
        </div>
        <Badge variant="outline" className="text-xs">
          {outgoingConnections.length} connexion{outgoingConnections.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* List of current connections */}
      {outgoingConnections.length > 0 ? (
        <div className="space-y-2">
          {outgoingConnections.map(conn => {
            const targetBlock = allBlocks.find(b => b.id === conn.targetBlockId);
            if (!targetBlock) return null;
            
            return (
              <div 
                key={conn.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={cn(
                    "w-6 h-6 rounded-md bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                    getBlockColor(targetBlock.type)
                  )}>
                    {getBlockIcon(targetBlock.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {targetBlock.name}
                    </p>
                    {conn.sourceHandle && (
                      <Badge variant="outline" className="text-[10px] mt-0.5">
                        {conn.sourceHandle === 'true' ? 'Oui' : conn.sourceHandle === 'false' ? 'Non' : conn.sourceHandle}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemoveConnection(conn.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground py-2">
          Aucune connexion. Ajoutez des étapes suivantes.
        </p>
      )}

      {/* Add connection button */}
      {availableTargets.length > 0 && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Ajouter une connexion
        </Button>
      )}

      {/* Incoming connections info */}
      {incomingConnections.length > 0 && (
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">
            <span className="font-medium">{incomingConnections.length}</span> bloc(s) mènent à cette étape
          </p>
        </div>
      )}

      {/* Connection picker dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Ajouter une connexion
            </DialogTitle>
            <DialogDescription>
              Choisissez le bloc suivant après "{block.name}"
            </DialogDescription>
          </DialogHeader>

          {/* Handle selection for multi-output blocks */}
          {hasMultipleOutputs && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Type de sortie :</p>
              <div className="flex gap-2">
                <Badge 
                  variant="outline" 
                  className="cursor-pointer bg-emerald-500/20 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/30"
                >
                  Oui / Vrai
                </Badge>
                <Badge 
                  variant="outline" 
                  className="cursor-pointer bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30"
                >
                  Non / Faux
                </Badge>
              </div>
            </div>
          )}

          <ScrollArea className="max-h-[300px]">
            <div className="space-y-2">
              {availableTargets.map(targetBlock => {
                const targetDef = BLOCK_DEFINITIONS[targetBlock.type as BlockType];
                
                return (
                  <div key={targetBlock.id}>
                    {hasMultipleOutputs ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            handleAddConnection(targetBlock.id, 'true');
                            setIsDialogOpen(false);
                          }}
                          className="flex-1 flex items-center gap-3 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors text-left"
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                            targetDef?.color || 'from-gray-500 to-gray-400'
                          )}>
                            {getBlockIcon(targetBlock.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {targetBlock.name}
                            </p>
                            <p className="text-xs text-emerald-500">→ Si Oui</p>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            handleAddConnection(targetBlock.id, 'false');
                            setIsDialogOpen(false);
                          }}
                          className="flex-1 flex items-center gap-3 p-3 rounded-lg border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                            targetDef?.color || 'from-gray-500 to-gray-400'
                          )}>
                            {getBlockIcon(targetBlock.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {targetBlock.name}
                            </p>
                            <p className="text-xs text-red-500">→ Si Non</p>
                          </div>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          handleAddConnection(targetBlock.id);
                          setIsDialogOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left"
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                          targetDef?.color || 'from-gray-500 to-gray-400'
                        )}>
                          {getBlockIcon(targetBlock.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {targetBlock.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {targetDef?.description || targetBlock.type}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {availableTargets.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">Tous les blocs sont déjà connectés</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
