

## Aether Intelligence -- Refonte Ultra-Pro + Mode Plein Ecran

### Direction
Passer d'un chatbot "dark startup" a un assistant enterprise minimaliste et propre, avec un bouton pour basculer en plein ecran.

### Changements (fichier unique : `FloatingChatbot.tsx`)

**1. Design general : clean & corporate**
- Fond : blanc pur (`#ffffff`) au lieu du dark mode `#0a0f1a`
- Supprimer tous les effets superflus : orbe anime, grid pattern, gradient mesh, shimmer, glow pulse
- Typographie noire/gris sobre, pas de tracking exagere
- Garder uniquement 2 animations : fade-in du panel + fade-in des messages

**2. Trigger button**
- Cercle blanc propre avec ombre, icone `MessageSquare` bleue (#0369A1)
- Pas de label "Ask Aether", pas de glow -- juste un bouton clean avec hover scale subtil

**3. Header**
- Fond blanc, bordure bottom grise fine
- Logo : petit cercle bleu avec icone, titre "Aether" en noir, sous-titre "AI Assistant" en gris
- Pastille verte online simple (pas de ping animation)
- Ajout d'un bouton expand (icone `Maximize2` / `Minimize2`) a cote du bouton close

**4. Mode plein ecran**
- Nouvel etat `isFullscreen` toggle via le bouton expand
- Widget : `sm:w-[400px] sm:h-[560px] sm:bottom-5 sm:right-5 sm:rounded-2xl`
- Plein ecran : `inset-0 w-full h-full rounded-none` avec contenu centre en `max-w-3xl`
- Transition fluide entre les deux modes

**5. Empty state**
- Supprimer l'orbe -- remplacer par un simple cercle bleu avec icone
- Titre : "How can we help?" en noir
- Sous-titre : "Ask about our AI agents, services, or methodology" (pas de "proprietary knowledge engine")
- Quick prompts : boutons plats, fond `gray-50`, bordure grise, hover `gray-100`, sans icone decorative

**6. Messages**
- User : fond bleu solide `#0369A1`, texte blanc, coins arrondis
- Assistant : fond `#f7f8fa`, bordure grise fine, texte noir
- Avatar assistant : petit cercle bleu avec "A" ou Sparkles, sans ring/pulse
- Markdown styling adapte au theme clair

**7. Input area**
- Fond blanc, input avec bordure grise standard `border-gray-200`
- Bouton send : cercle bleu solide, sans gradient multi-stop
- Footer : "Powered by Aether" en gris tres discret

### Details techniques
- Fichier unique : `src/components/landing/FloatingChatbot.tsx`
- Ajouter `isFullscreen` state + bouton toggle dans le header
- Supprimer ~80% des keyframes (garder `chatPanelIn` simplifie + `msgFadeIn`)
- Adapter les classes prose pour le theme clair (`prose-slate` au lieu de `prose-invert`)

