
## Plan : Page Brain Sans Scroll + Detection Automatique du Mode IA

### Objectif
1. Empecher le scroll de la page Brain (layout fixe avec scroll interne uniquement dans les messages)
2. L'IA detecte automatiquement si l'utilisateur veut un chat, une image ou un graphique - sans selection manuelle

---

### Partie 1 : Supprimer le Scroll de la Page Brain

**Fichier** : `src/pages/tools/Brain.tsx`

**Probleme actuel** : La page utilise `overflow-hidden` sur le parent mais le `DashboardLayout` permet le scroll global.

**Modifications** :

1. **Ligne 256** - Forcer une hauteur fixe sur le container principal :
```tsx
// Remplacer :
<div className="h-full flex flex-col md:flex-row relative overflow-hidden">

// Par :
<div className="h-[calc(100vh-3.5rem)] flex flex-col md:flex-row relative overflow-hidden">
```

2. **Ligne 499** - S'assurer que ScrollArea ne depasse pas :
```tsx
// Le ScrollArea pour les messages doit avoir une hauteur calculee
<ScrollArea className="flex-1 min-h-0 px-4 md:px-6 py-6">
```

3. **Ligne 555** - Input bar avec `shrink-0` (deja present, verifier)

---

### Partie 2 : Detection Automatique du Mode (Chat/Image/Chart)

**Approche** : Creer une Edge Function "intent-detector" qui analyse le message et determine automatiquement le type de reponse attendue.

#### 2.1 Nouvelle Edge Function : `brain-detect-intent`

**Fichier** : `supabase/functions/brain-detect-intent/index.ts`

```typescript
// Cette fonction ultra-rapide analyse le prompt et retourne:
// - "chat" : reponse textuelle classique
// - "image" : generation d'image (photos, illustrations, designs)
// - "chart" : visualisation de donnees (graphiques, diagrammes)

const INTENT_PATTERNS = {
  image: [
    /genere?\s*(une?|moi)?\s*(image|photo|illustration|logo|dessin|visuel|poster|affiche)/i,
    /cree?\s*(une?|moi)?\s*(image|photo|illustration|logo|dessin)/i,
    /dessine/i,
    /montre\s*moi\s*(a quoi|comment)/i,
    /imagine\s*(une?|un)/i,
    /visualise/i,
    /make\s*(an?|me)?\s*(image|picture|photo|illustration)/i,
    /generate\s*(an?|me)?\s*(image|picture|photo)/i,
  ],
  chart: [
    /genere?\s*(un|moi)?\s*(graph(ique)?|chart|diagramme|camembert|histogramme|courbe)/i,
    /cree?\s*(un|moi)?\s*(graph(ique)?|chart|diagramme)/i,
    /visualise?\s*(les)?\s*(donnees|data|chiffres|statistiques)/i,
    /represente?\s*(graphiquement|visuellement)/i,
    /trace\s*(une?)?\s*(courbe|graph)/i,
    /pie\s*chart|bar\s*chart|line\s*chart/i,
  ]
};

// L'IA classe aussi via un prompt rapide si les patterns ne matchent pas
```

#### 2.2 Modifier le Hook useBrain

**Fichier** : `src/hooks/useBrain.ts`

Ajouter une fonction `detectIntent` qui appelle l'Edge Function avant d'envoyer le message :

```typescript
const detectIntent = async (message: string): Promise<'chat' | 'image' | 'chart'> => {
  // D'abord, detection locale par patterns pour rapidite
  const imagePatterns = [/* patterns */];
  const chartPatterns = [/* patterns */];
  
  // Si match local, retourner directement
  // Sinon, appeler l'Edge Function pour analyse IA
}
```

#### 2.3 Modifier la Page Brain

**Fichier** : `src/pages/tools/Brain.tsx`

1. **Supprimer le selecteur de mode** (lignes 589-616) - L'utilisateur n'a plus besoin de choisir

2. **Modifier `handleSendMessage`** (ligne 149) :
```typescript
const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault();
  if ((!message.trim() && attachments.length === 0) || sendingMessage || generatingImage) return;
  
  // Detection automatique de l'intent
  const detectedIntent = await detectIntent(message);
  
  if (detectedIntent === 'image' || detectedIntent === 'chart') {
    await handleGenerateImage(message, detectedIntent);
  } else {
    // Chat normal
    const msg = message || (attachments.length > 0 ? `Analyse...` : '');
    await sendMessage(msg, undefined, { attachments });
  }
  
  setMessage("");
  setAttachments([]);
};
```

3. **Simplifier l'UI** - Retirer les boutons Chat/Image/Chart et garder uniquement :
   - Input texte
   - Bouton attach fichier
   - Bouton envoyer

---

### Resume des Modifications

| Fichier | Modification |
|---------|--------------|
| `src/pages/tools/Brain.tsx` | Layout fixe sans scroll, supprimer selecteur de mode, detection auto |
| `src/hooks/useBrain.ts` | Ajouter fonction `detectIntent()` |
| `supabase/functions/brain-detect-intent/index.ts` | Nouvelle Edge Function pour detection d'intent |
| `supabase/config.toml` | Ajouter config pour brain-detect-intent |

---

### Logique de Detection

```text
Utilisateur tape: "Genere une image d'un coucher de soleil"
  -> Pattern match "genere.*image" -> mode = 'image'
  -> Appel brain-generate-image

Utilisateur tape: "Cree un graphique des ventes Q1"  
  -> Pattern match "cree.*graphique" -> mode = 'chart'
  -> Appel brain-generate-image (type: chart)

Utilisateur tape: "Explique moi les KPIs de l'equipe"
  -> Aucun pattern match -> mode = 'chat'
  -> Appel ai-chat-stream normal
```

### Patterns de Detection (Francais + Anglais)

**Images** :
- "genere une image de...", "cree une illustration", "dessine moi", "montre moi a quoi ressemble"
- "generate an image of...", "create a picture of...", "draw me"

**Charts** :
- "genere un graphique", "cree un diagramme", "visualise les donnees", "trace une courbe"
- "create a chart", "make a pie chart", "visualize the data"

---

### Resultat Attendu

1. La page Brain ne scroll plus - hauteur fixe avec scroll interne uniquement
2. L'utilisateur tape son message naturellement
3. L'IA detecte automatiquement s'il veut du texte, une image ou un graphique
4. Aucune selection manuelle requise
5. Experience plus fluide et intuitive

