
## Plan : Corriger le Scroll + Fixer la Génération d'Images

### Problème 1 : Page Brain scrolle encore

**Cause racine** : Dans `DashboardLayout.tsx` ligne 196, le `main` utilise :
- `pt-12 sm:pt-14` (padding-top pour compenser le header fixe)
- `h-[calc(100vh-3rem)]` (hauteur calculée)

Le padding **s'ajoute** à la hauteur du contenu, créant un débordement.

**Solution** : Ne pas utiliser de padding-top sur `main`. Puisque le header est `fixed` avec `h-12 sm:h-14`, les enfants ont déjà assez d'espace.

---

### Fichier 1 : `src/components/layout/DashboardLayout.tsx`

**Ligne 196** - Supprimer le padding-top et ajuster la hauteur :
```tsx
// Avant :
<main className="pt-12 sm:pt-14 h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col">

// Après :
<main className="mt-12 sm:mt-14 h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col">
```

Le `margin-top` pousse le `main` sous le header sans ajouter de hauteur interne.

---

### Problème 2 : Génération d'images ne fonctionne pas

**Cause** : Le modèle utilisé `google/gemini-2.5-flash-image-preview` n'existe pas.

**Solution** : Utiliser le bon modèle `google/gemini-3-pro-image-preview` qui est dans la liste des modèles supportés.

---

### Fichier 2 : `supabase/functions/brain-generate-image/index.ts`

**Ligne 43** - Corriger le nom du modèle :
```typescript
// Avant :
model: 'google/gemini-2.5-flash-image-preview',

// Après :
model: 'google/gemini-3-pro-image-preview',
```

---

### Résumé des Modifications

| Fichier | Ligne | Modification |
|---------|-------|--------------|
| `DashboardLayout.tsx` | 196 | `pt-12` → `mt-12` (padding → margin) |
| `brain-generate-image/index.ts` | 43 | Corriger le nom du modèle d'image |

---

### Résultat Attendu

1. La page Brain a une hauteur fixe exacte (100vh - header), plus de scroll global
2. Seule la zone des messages peut défiler (scroll interne)
3. La détection automatique (chat/image/chart) fonctionne
4. La génération d'images utilise le bon modèle et produit des résultats
