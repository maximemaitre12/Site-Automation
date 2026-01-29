
## Plan : Corriger le Scroll de la Page Brain

### Diagnostic
Le problème provient d'un calcul de hauteur en double :
1. `DashboardLayout` → `main` applique déjà `h-[calc(100vh-3.5rem)]`
2. `Brain.tsx` → le container enfant applique aussi `h-[calc(100vh-3.5rem)]`

Cela crée une hauteur totale supérieure au viewport, causant le scroll.

---

### Solution

#### Fichier : `src/pages/tools/Brain.tsx`

**Modification 1 - Ligne 260** : Remplacer la hauteur fixe par `h-full`
```tsx
// Avant :
<div className="h-[calc(100vh-3.5rem)] flex flex-col md:flex-row relative overflow-hidden">

// Après :
<div className="h-full flex flex-col md:flex-row relative overflow-hidden">
```
Le parent (`main` dans DashboardLayout) gère déjà la hauteur correcte.

**Modification 2 - Sidebar (lignes 270-274)** : Ajouter `h-full` et `overflow-hidden`
```tsx
<aside className={cn(
  "w-full md:w-64 lg:w-72 border-r border-border p-3 md:p-4 flex flex-col bg-card/50 transition-all h-full overflow-hidden",
  "fixed md:relative inset-0 z-40 md:z-auto md:h-full",
  showMobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
)}>
```

**Modification 3 - Zone chat (lignes 395-403)** : S'assurer que le container chat a une hauteur limitée
```tsx
<div 
  className={cn(
    "flex-1 flex flex-col transition-colors min-w-0 overflow-hidden h-full",
    isDragging && "bg-primary/5 ring-2 ring-primary ring-inset"
  )}
>
```

**Modification 4 - ScrollArea messages (ligne 503)** : Ajouter `min-h-0` pour flexbox
```tsx
<ScrollArea className="flex-1 min-h-0 px-4 md:px-6 py-6">
```

---

### Résumé des Changements

| Ligne | Avant | Après |
|-------|-------|-------|
| 260 | `h-[calc(100vh-3.5rem)]` | `h-full` |
| 270-274 | Sidebar sans `h-full` | Ajouter `h-full overflow-hidden` |
| 395-403 | Zone chat sans `h-full` | Ajouter `h-full` |
| 503 | `flex-1` | `flex-1 min-h-0` |

---

### Pourquoi ça fonctionne

```text
DashboardLayout
└── main (h-[calc(100vh-3.5rem)] overflow-hidden)
    └── Brain container (h-full → hérite de la hauteur du parent)
        ├── Sidebar (h-full overflow-hidden)
        │   └── ScrollArea (flex-1 → scroll interne)
        └── Chat area (h-full flex-col)
            ├── Header (shrink-0)
            ├── ScrollArea messages (flex-1 min-h-0 → scroll interne)
            └── Input bar (shrink-0)
```

La chaîne de hauteurs est maintenant correcte : le parent définit la hauteur une seule fois, et tous les enfants héritent avec `h-full`.
