
Objectif

Stabiliser complètement le chatbot sur mobile et faire en sorte que les réponses ressemblent enfin à une pile de widgets premium, pas à un simple message markdown.

Constat actuel

- `FloatingChatbot.tsx` a encore un faux “reserve space” pendant le streaming (`h-12`) : ça recrée du jump au moment du thinking state.
- La zone messages ne bloque pas assez l’overflow horizontal : un tableau, un flow long, ou du code inline peuvent déclencher un glissement droite/gauche.
- `AetherMarkdownRenderer.tsx` rend bien du markdown, mais pas encore de vrais “widgets”. En plus, la détection block code / inline code est trop fragile, donc certains flows peuvent sortir du cadre.
- `supabase/functions/public-chat/index.ts` pousse vers des réponses structurées, mais pas encore assez “renderer-aware” pour produire des modules vraiment propres et compacts.

Plan d’implémentation

1. Stabiliser la coque mobile du chatbot
- Garder `header` et `input` fixes.
- Donner à la zone messages une hauteur interne stable avec scroll vertical uniquement.
- Supprimer l’espace ajouté dynamiquement pendant le loading.
- Faire du thinking state un vrai overlay absolu au-dessus de l’input, sans aucun impact sur le layout.
- Ajouter les garde-fous mobile : `overflow-x-hidden`, `min-w-0`, et verrouillage du pan horizontal.

2. Corriger la vraie source du “ça bouge à droite à gauche”
- Encapsuler les tableaux dans un scroll horizontal interne au widget, jamais au niveau du panneau.
- Faire wrap / clamp des flows longs et des contenus inline.
- Corriger le renderer `code` pour distinguer correctement inline vs block, afin d’éviter les blocs qui élargissent le layout.
- Vérifier aussi les largeurs max des messages et des widgets pour qu’aucun module ne puisse dépasser la largeur utile mobile.

3. Transformer les réponses en vraie stack de widgets
- Renforcer la séparation entre modules dans `ChatMessage.tsx`.
- Faire ressortir les cartes système, blocs résumé, blocs décision, recommandations, risques.
- Donner plus de rythme visuel entre sections, tableaux, flows et cards.
- Garder l’ensemble compact et scannable, sans retomber dans une grosse bulle uniforme.

4. Aligner le prompt avec le renderer
- Remplacer le prompt actuel par ta nouvelle version “premium response widgets”.
- Forcer des patterns stables que le front sait bien styliser : titres de section, blockquotes/cartes, tableaux compacts, flows courts, decision blocks, recommendation panels.
- Ajouter une contrainte de compacité pour éviter les tableaux trop larges et les longs paragraphes qui cassent le mobile.

5. Validation ciblée
- Vérifier en viewport mobile réel (440px) :
  - ouverture / fermeture
  - quick actions
  - réponse courte
  - réponse avec plusieurs cards
  - tableau
  - flow
  - streaming / thinking state
- Critères de réussite :
  - plus aucun shift horizontal
  - plus aucun jump au démarrage / arrêt du thinking
  - widgets lisibles, respirants, et bien séparés
  - rendu assistant perçu comme un outil, pas comme un chat

Détails techniques

Fichiers principaux à modifier :
- `src/components/landing/FloatingChatbot.tsx`
- `src/components/landing/chatbot/ThinkingIndicator.tsx`
- `src/components/landing/chatbot/AetherMarkdownRenderer.tsx`
- `src/components/landing/chatbot/ChatMessage.tsx`
- `supabase/functions/public-chat/index.ts`

Ajustement de secours seulement si nécessaire :
- clamp horizontal scoped au layout public / CSS global, mais seulement si le drift persiste après les fixes locaux du chatbot.
