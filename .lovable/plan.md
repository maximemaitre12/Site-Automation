
# Plan de Refonte AETHER Flow — Niveau N8N et au-delà

## Vue d'ensemble

Ce plan transforme AETHER Flow en un éditeur de workflows horizontal professionnel, avec exécution parallèle, sous-workflows, webhooks temps réel, et une UX moderne rivalisant avec N8N.

---

## 1. Refonte UX/UI : Canvas Horizontal Style N8N

### 1.1 Nouveau Canvas Horizontal

**Objectif** : Remplacer le canvas vertical actuel par un layout horizontal fluide avec auto-layout intelligent.

**Composant** : `src/components/flow/HorizontalWorkflowCanvas.tsx`

| Élément | Implémentation |
|---------|----------------|
| Layout horizontal | Origin X=50, flow de gauche à droite |
| Blocs compacts | 200x80px avec icône, titre, status badge |
| Connexions | Bézier horizontales (droite→gauche) avec animations |
| Groupes fonctionnels | Colonnes automatiques par étape logique |

**Fonctionnalités clés** :
- Zoom 25%-200% avec molette et pinch
- Pan infini avec contraintes élastiques
- Snap-to-grid 20px
- Mini-map en bas à droite
- Sélection multiple (Shift+click, lasso)

### 1.2 Blocs Visuels Améliorés

**Nouveau composant** : `WorkflowNode.tsx`

```text
┌─────────────────────────────┐
│ [Icon] Titre du bloc        │
│ ────────────────────────── │
│ Status: ● Running           │
│ Output: 3 items             │
└─────────────────────────────┘
    ○ ────────────────→ ○
```

**États visuels** :
- `idle` : Bordure grise
- `running` : Bordure bleue pulsante + animation
- `success` : Bordure verte + check animé
- `error` : Bordure rouge + icône erreur
- `skipped` : Bordure grise pointillée

### 1.3 Palette de Blocs Repensée

**Nouveau composant** : `DraggablePalette.tsx`

- Panneau latéral collapsible (gauche)
- Catégories avec accordéon
- Recherche instantanée avec fuzzy matching
- Drag-and-drop direct sur le canvas
- Badges "Real Action", "AI", "Beta"

### 1.4 Panneau de Propriétés Dynamique

**Nouveau composant** : `NodePropertiesPanel.tsx`

- Slide-in depuis la droite
- Sections collapsibles :
  - Configuration
  - Connexions (inputs/outputs)
  - Retry & Timeout
  - Données (preview input/output)
  - Historique d'exécution du bloc

---

## 2. Architecture Technique Améliorée

### 2.1 Nouveau Système de Types

**Fichier** : `src/types/workflow-v2.ts`

```typescript
interface WorkflowBlockV2 {
  id: string;
  type: BlockType;
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  
  // Nouveaux champs
  inputs: HandleDefinition[];
  outputs: HandleDefinition[];
  
  retryConfig?: {
    enabled: boolean;
    maxRetries: number;
    backoffStrategy: 'linear' | 'exponential';
    initialDelayMs: number;
  };
  
  timeout?: number;
  parallel?: boolean;
  subWorkflowId?: string;
  
  // Metadata
  executionStatus?: ExecutionStatus;
  lastOutput?: any;
  executionDuration?: number;
}

interface HandleDefinition {
  id: string;
  label: string;
  type: 'default' | 'true' | 'false' | 'error' | 'loop';
}

interface BlockConnectionV2 {
  id: string;
  sourceBlockId: string;
  sourceHandle: string;
  targetBlockId: string;
  targetHandle: string;
  condition?: string; // Expression conditionnelle
  animated?: boolean;
}
```

### 2.2 Exécution Parallèle et Queue

**Edge Function** : `workflow-execute-v2`

```text
┌─────────────┐
│  Workflow   │
│   Queue     │
└─────┬───────┘
      │
      ▼
┌─────────────┐     ┌─────────────┐
│  Block A    │────▶│  Block B    │
└─────────────┘     └─────────────┘
      │                    │
      └────────┬───────────┘
               ▼
         ┌─────────────┐
         │  Parallel   │
         │  Executor   │
         └─────────────┘
              ╱ ╲
             ╱   ╲
   ┌─────────┐   ┌─────────┐
   │ Block C │   │ Block D │
   └─────────┘   └─────────┘
              ╲   ╱
               ╲ ╱
         ┌─────────────┐
         │   Merge     │
         └─────────────┘
```

**Implémentation** :
- `Promise.all()` pour branches parallèles
- Timeout par bloc configurable
- Retry avec backoff exponentiel
- Gestion des états détaillés

### 2.3 Webhooks Temps Réel via SSE

**Edge Function** : `workflow-stream-events`

- Server-Sent Events pour updates en direct
- États : block_started, block_completed, block_error
- Payload avec durée, output preview, logs

**Client** :
```typescript
const eventSource = new EventSource(`/functions/v1/workflow-stream-events?runId=${runId}`);
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateBlockStatus(data.blockId, data.status);
};
```

---

## 3. Fonctionnalités Avancées

### 3.1 Sous-Workflows Imbriqués

**Nouveau bloc** : `workflow_call` (existant, à améliorer)

**UX** :
- Double-clic sur bloc "Sub-workflow" → ouvre canvas imbriqué
- Breadcrumb navigation : `Main Workflow > Sub-Workflow A > Sub-Sub`
- Variables passées en entrée/sortie

**Composant** : `SubWorkflowNavigator.tsx`

### 3.2 Variables Globales et Secrets

**Nouveau composant** : `WorkflowVariablesPanel.tsx`

- Variables de workflow (accessibles partout)
- Secrets (masqués, stockés en DB encryptés)
- Expressions `{{variable.name}}` dans les configs

**Table Supabase** : `workflow_variables`
| Colonne | Type |
|---------|------|
| id | uuid |
| workflow_id | uuid |
| key | text |
| value | jsonb |
| is_secret | boolean |
| created_at | timestamp |

### 3.3 Historique et Debug Avancé

**Nouveau composant** : `ExecutionTimeline.tsx`

- Timeline graphique des blocs exécutés
- Durée de chaque bloc (barre de progression)
- Input/Output expandables
- Filtres par status (success/error/skipped)
- Export des logs en JSON

### 3.4 Auto-Layout Intelligent

**Algorithme** : Layout hiérarchique horizontal (style Dagre)

```text
Étape 1: Identifier les niveaux (profondeur depuis trigger)
Étape 2: Grouper par niveau en colonnes
Étape 3: Espacer verticalement au sein de chaque colonne
Étape 4: Centrer les connexions
```

**Bouton** : "Auto-arrange" dans la toolbar

---

## 4. Fichiers à Créer/Modifier

### Nouveaux Fichiers

| Fichier | Description |
|---------|-------------|
| `src/components/flow/canvas/HorizontalCanvas.tsx` | Canvas principal horizontal |
| `src/components/flow/canvas/CanvasToolbar.tsx` | Barre d'outils zoom/pan/layout |
| `src/components/flow/canvas/MiniMap.tsx` | Vue miniature |
| `src/components/flow/nodes/WorkflowNode.tsx` | Bloc visuel avec handles |
| `src/components/flow/nodes/NodeHandles.tsx` | Points de connexion |
| `src/components/flow/edges/AnimatedEdge.tsx` | Connexion SVG animée |
| `src/components/flow/panels/DraggablePalette.tsx` | Palette drag-and-drop |
| `src/components/flow/panels/NodePropertiesPanel.tsx` | Config bloc |
| `src/components/flow/panels/ExecutionTimeline.tsx` | Debug timeline |
| `src/components/flow/panels/VariablesPanel.tsx` | Variables workflow |
| `src/components/flow/SubWorkflowNavigator.tsx` | Navigation imbriquée |
| `src/lib/workflow-layout.ts` | Algorithme auto-layout |
| `src/lib/workflow-executor-v2.ts` | Client-side execution helpers |
| `src/types/workflow-v2.ts` | Nouveaux types |
| `supabase/functions/workflow-execute-v2/index.ts` | Exécution parallèle |
| `supabase/functions/workflow-stream-events/index.ts` | SSE temps réel |

### Fichiers à Modifier

| Fichier | Modifications |
|---------|---------------|
| `src/pages/tools/Flow.tsx` | Intégrer nouveau canvas, panels |
| `src/hooks/useWorkflows.ts` | Support variables, nouveaux types |
| `src/types/workflow.ts` | Étendre avec nouveaux champs |
| `supabase/config.toml` | Ajouter nouvelles Edge Functions |

---

## 5. Migration de Base de Données

**Migration** : Ajouter colonnes aux tables existantes

```sql
-- Ajouter colonnes à workflows
ALTER TABLE workflows ADD COLUMN IF NOT EXISTS variables jsonb DEFAULT '{}';
ALTER TABLE workflows ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}';

-- Nouvelle table pour secrets
CREATE TABLE IF NOT EXISTS workflow_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  key text NOT NULL,
  encrypted_value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(workflow_id, key)
);

-- Ajouter colonnes détaillées aux runs
ALTER TABLE workflow_runs ADD COLUMN IF NOT EXISTS blocks_status jsonb DEFAULT '{}';
ALTER TABLE workflow_runs ADD COLUMN IF NOT EXISTS parallel_branches jsonb DEFAULT '[]';

-- RLS
ALTER TABLE workflow_secrets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their workflow secrets" ON workflow_secrets
  FOR ALL USING (auth.uid() = user_id);
```

---

## 6. Roadmap d'Implémentation

### Phase 1 : Canvas Horizontal (Semaine 1-2)
- [ ] Créer `HorizontalCanvas.tsx` avec layout horizontal
- [ ] Implémenter `WorkflowNode.tsx` avec états visuels
- [ ] Créer `AnimatedEdge.tsx` pour connexions fluides
- [ ] Ajouter `CanvasToolbar.tsx` avec zoom/pan/reset
- [ ] Intégrer `MiniMap.tsx`

### Phase 2 : Core Engine (Semaine 2-3)
- [ ] Créer `workflow-execute-v2` avec exécution parallèle
- [ ] Implémenter retry avec backoff exponentiel
- [ ] Ajouter gestion des statuts détaillés par bloc
- [ ] Créer `workflow-stream-events` pour SSE

### Phase 3 : Sous-Workflows et Variables (Semaine 3-4)
- [ ] Implémenter `SubWorkflowNavigator.tsx`
- [ ] Créer `VariablesPanel.tsx`
- [ ] Migration DB pour secrets
- [ ] Breadcrumb navigation

### Phase 4 : Debug et Polish (Semaine 4-5)
- [ ] Créer `ExecutionTimeline.tsx`
- [ ] Implémenter auto-layout horizontal
- [ ] Optimiser performance canvas (virtualization)
- [ ] Tests et corrections

---

## 7. Avantages vs N8N

| Fonctionnalité | AETHER Flow | N8N |
|----------------|-------------|-----|
| Génération IA de workflows | ✅ 20+ blocs auto | ❌ |
| Exécution parallèle native | ✅ Promise.all | ⚠️ Limité |
| Intégration CRM interne | ✅ Aether CRM | ❌ Externe |
| Génération de documents | ✅ PDF natif | ❌ |
| Auto-layout intelligent | ✅ Dagre-like | ⚠️ Manuel |
| Interface française | ✅ | ❌ |
| Sous-workflows imbriqués | ✅ | ✅ |
| Variables et secrets | ✅ | ✅ |
| Webhooks temps réel | ✅ SSE | ✅ |

---

## Résumé Technique

**Stack** :
- Canvas : React + SVG natif (pas de lib externe pour contrôle total)
- Layout : Algorithme Dagre-like custom
- Exécution : Edge Functions Supabase avec SSE
- État : React hooks + Supabase Realtime

**Principes** :
- Horizontal-first design
- Performance avec virtualization pour 100+ blocs
- Feedback visuel temps réel sur chaque action
- Compatibilité mobile (responsive)

