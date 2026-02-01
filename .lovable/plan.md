
# Plan de Correction - Assistant IA Flow

## Problemes identifies

1. **Collisions d'ID de messages** : Plusieurs endroits dans le code utilisent encore `Date.now().toString()` pour generer les IDs des messages, ce qui cause des collisions quand plusieurs messages sont crees dans la meme milliseconde. React ignore alors certains messages (d'ou les messages utilisateur qui n'apparaissent pas).

2. **Mise a jour du canvas qui echoue** : La fonction `handleAIModify` est appelee (le log console le confirme), mais le canvas ne se met pas a jour visuellement. Cela peut etre du a:
   - Un probleme de reference de closure stale dans le callback
   - Le composant `ProCanvasV2` qui ne detecte pas le changement d'etat

3. **Sauvegarde automatique qui interfere** : Le debounce de 500ms de la sauvegarde automatique pourrait creer des conflits avec la mise a jour immediate.

## Corrections a apporter

### Fichier 1: `src/components/flow/FlowAIAssistant.tsx`

Remplacer TOUS les `Date.now().toString()` restants par `crypto.randomUUID()`:

```text
Lignes a corriger:
- Ligne 529: (Date.now() + 1).toString() -> crypto.randomUUID()
- Ligne 624: (Date.now() + 1).toString() -> crypto.randomUUID()
- Ligne 667: (Date.now() + 2).toString() -> crypto.randomUUID()
- Ligne 734: (Date.now() + 1).toString() -> crypto.randomUUID()
- Ligne 745: (Date.now() + 1).toString() -> crypto.randomUUID()
- Ligne 750: (Date.now() + 1).toString() -> crypto.randomUUID()
```

### Fichier 2: `src/pages/tools/Flow.tsx`

Ameliorer `handleAIModify` pour forcer la mise a jour du state:

```typescript
const handleAIModify = useCallback((blocks: WorkflowBlock[], connections: BlockConnection[]) => {
  if (!selectedWorkflowId) {
    toast.error('Aucun workflow selectionne');
    return;
  }
  
  // Apply auto-layout
  const layoutedBlocks = blocks.length > 0 
    ? applyLayoutToBlocks(blocks, autoLayoutBlocks(blocks, connections))
    : blocks;
  
  console.log('AI Modify: applying', layoutedBlocks.length, 'blocks to canvas');
  
  // Force new array references to trigger re-render
  setLocalBlocks([...layoutedBlocks]);
  setLocalConnections([...connections]);
  
  // Trigger fit view after a microtask to ensure state is updated
  requestAnimationFrame(() => {
    setFitViewNonce(n => n + 1);
  });
  
  toast.success('Workflow modifie');
}, [selectedWorkflowId]);
```

### Verification du passage de donnees

Dans `handleApplyAction` (ligne 774-776), verifier que les donnees sont bien structurees:

```typescript
} else if (action.type === 'modify' && data) {
  console.log('Applying modify action with blocks:', data.blocks?.length, 'connections:', data.connections?.length);
  if (data.blocks && Array.isArray(data.blocks)) {
    onModifyWorkflow(data.blocks, data.connections || []);
    toast.success('Workflow modifie !');
  } else {
    console.error('Invalid data structure for modify action:', data);
    toast.error('Erreur: donnees invalides');
  }
}
```

## Resume des modifications

| Fichier | Modification | Raison |
|---------|--------------|--------|
| FlowAIAssistant.tsx | Remplacer 6 occurrences de Date.now() par crypto.randomUUID() | Eviter les collisions d'ID de messages |
| FlowAIAssistant.tsx | Ajouter validation des donnees dans handleApplyAction | Debug et robustesse |
| Flow.tsx | Forcer nouvelles references avec spread operator | Garantir la detection de changement par React |
| Flow.tsx | Utiliser requestAnimationFrame pour fitView | Synchroniser avec le cycle de rendu |

## Impact attendu

1. Les messages utilisateur s'afficheront correctement dans la conversation
2. Le canvas se mettra a jour immediatement apres avoir clique sur "Appliquer les modifications"
3. Plus d'erreurs "duplicate key" dans la console
