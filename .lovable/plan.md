

## Plan : Corriger le Flux de Génération d'Images

### Diagnostic

Le problème est dans le flux de `handleGenerateImage` (ligne 173-217 de Brain.tsx) :

```tsx
// Ligne 184 - PROBLÈME ICI
await sendMessage(userMsg, undefined);  // ← Ceci envoie au chat IA qui RÉPOND
```

Quand on demande une image, le code :
1. Appelle `sendMessage()` pour ajouter le message utilisateur → **MAIS cela déclenche une réponse IA du chat normal**
2. Puis appelle `brain-generate-image` en parallèle

L'IA de chat répond "je ne peux pas générer d'images" car elle reçoit le message.

---

### Solution

Modifier la fonction `handleGenerateImage` pour :
1. **Ajouter le message utilisateur SANS déclencher de réponse IA** (créer une fonction `addUserMessage` dans useBrain)
2. Attendre la génération d'image
3. Ajouter l'image comme message assistant SANS passer par le chat IA

---

### Fichier 1 : `src/hooks/useBrain.ts`

Ajouter une nouvelle fonction `addMessageWithoutAI` qui ajoute un message à la conversation sans appeler l'IA :

```typescript
// Nouvelle fonction à ajouter après sendMessage (~ligne 277)
const addMessageWithoutAI = useCallback(async (
  content: string,
  role: 'user' | 'assistant' = 'user',
  conversationId?: string
): Promise<Conversation | null> => {
  if (!user || !content.trim()) return null;

  try {
    let conv = currentConversation;
    
    if (!conv || (conversationId && conv.id !== conversationId)) {
      if (conversationId) {
        conv = conversations.find(c => c.id === conversationId) || null;
      }
      if (!conv) {
        conv = await createConversation(content);
      }
    }
    
    if (!conv) return null;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...conv.messages, newMessage];
    
    // Mettre à jour en local immédiatement
    const updatedConv = { ...conv, messages: updatedMessages };
    setCurrentConversation(updatedConv);
    
    // Sauvegarder en base
    const messagesForDb = updatedMessages.map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp
    }));

    await supabase
      .from('conversations')
      .update({ 
        messages: messagesForDb,
        updated_at: new Date().toISOString()
      })
      .eq('id', conv.id);

    invalidateBrain();
    return updatedConv;
  } catch (err) {
    console.error('Error adding message:', err);
    return null;
  }
}, [user, currentConversation, conversations, invalidateBrain]);
```

Et l'exporter dans le return.

---

### Fichier 2 : `src/pages/tools/Brain.tsx`

Modifier `handleGenerateImage` pour utiliser la nouvelle fonction :

**Ligne 173-217** - Remplacer par :

```tsx
const handleGenerateImage = async (prompt: string, type: 'image' | 'chart') => {
  if (!prompt.trim()) return;
  
  setGeneratingImage(true);
  setMessage("");
  
  // Ajouter le message utilisateur SANS déclencher de réponse IA
  const userMsg = type === 'image' 
    ? `🎨 Génère une image: ${prompt}` 
    : `📊 Génère un graphique: ${prompt}`;
  
  const conv = await addMessageWithoutAI(userMsg, 'user');  // ← Nouvelle fonction
  if (!conv) {
    setGeneratingImage(false);
    return;
  }
  
  try {
    const { data, error } = await supabase.functions.invoke('brain-generate-image', {
      body: { prompt, type }
    });

    if (error) throw error;

    if (data?.imageUrl) {
      // Ajouter l'image comme réponse assistant (sans IA)
      const imageResponse = `[IMAGE_GENERATED]${data.imageUrl}[/IMAGE_GENERATED]${data.description || 'Image générée avec succès.'}`;
      await addMessageWithoutAI(imageResponse, 'assistant');  // ← Pas de chat IA
      
      toast({
        title: "Image générée",
        description: type === 'chart' ? "Graphique créé avec succès" : "Image créée avec succès"
      });
    } else if (data?.error) {
      // Ajouter l'erreur comme message
      await addMessageWithoutAI(`Erreur: ${data.error}`, 'assistant');
      toast({
        title: "Erreur",
        description: data.error,
        variant: "destructive"
      });
    }
  } catch (err) {
    console.error('Image generation error:', err);
    await addMessageWithoutAI('Désolé, une erreur est survenue lors de la génération.', 'assistant');
    toast({
      title: "Erreur",
      description: "Impossible de générer l'image",
      variant: "destructive"
    });
  } finally {
    setGeneratingImage(false);
  }
};
```

Et mettre à jour l'import de useBrain pour inclure `addMessageWithoutAI`.

---

### Résumé des Modifications

| Fichier | Modification |
|---------|--------------|
| `src/hooks/useBrain.ts` | Ajouter fonction `addMessageWithoutAI()` |
| `src/pages/tools/Brain.tsx` | Utiliser `addMessageWithoutAI` au lieu de `sendMessage` dans `handleGenerateImage` |

---

### Résultat Attendu

1. Quand l'utilisateur demande une image, seul le message utilisateur est ajouté
2. Pas de réponse du chat IA disant "je ne peux pas"
3. L'image générée par `brain-generate-image` s'affiche correctement
4. Temps de réponse : ~55 secondes (temps réel de génération d'image via Gemini)

