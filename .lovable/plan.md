

## Plan: Refonte totale TrainingsSection — AETHER LEARNING STUDIO v3.0

Remplacement complet du "App Store" actuel par un **IDE/Learning Management System** dark premium, style VS Code / Notion croise avec un player video educatif.

### Concept creatif

Simuler **"AETHER LEARNING STUDIO v3.0"** — un IDE de formation IA :

**Desktop** : MacWindow dark avec 2 panneaux
- **Sidebar gauche** (bg-slate-900) : les 3 formations comme des "projets" avec icone gradient, barre de progression circulaire SVG (competence level), tag de difficulte colore, et mini indicateur de duree
- **Zone principale** :
  1. **Header cours** : grande icone gradient (64px) + titre + badges (duree, niveau, format) en pills glass-morphism + CTA "Demander un devis" lumineux avec glow
  2. **Timeline des modules** : ligne verticale avec 3 nodes connectees — chaque module est une "etape" avec dot anime, titre, description courte, et icone. Style commit-graph / git timeline
  3. **Competences acquises** : barres horizontales animees au scroll avec labels et pourcentages (ex: "LLM Architecture 90%", "Prompt Design 85%")
  4. **Footer module** : mini cards horizontales "Key Takeaways" avec icones et texte court

**Mobile (390px — viewport actuel de l'utilisateur)** :
- **Pas de sidebar** — les 3 formations deviennent des **tabs horizontaux** en haut avec icone + nom court, tab active avec underline gradient animee
- Le header cours se reorganise en colonne (icone centree + infos en dessous)
- La timeline des modules reste verticale mais plus compacte
- Les barres de competences s'empilent pleine largeur
- CTA sticky en bas pour une meilleure conversion mobile

### Details visuels premium

- MacWindow variant="dark" (bg-slate-900, bordures slate-700)
- Icones de formation : carres 56px rounded-2xl avec gradient unique + ring glow subtle
- Timeline : ligne verticale gradient (primary→purple) avec dots pulses et connecting lines
- Barres de competence : gradient from-primary to-purple avec animation width 1.2s ease-out au scroll
- Badges : glass-morphism (bg-white/5 backdrop-blur border-white/10)
- CTA : bouton avec shadow-glow pulsant + hover scale
- Transitions entre formations : fade + slide vertical smooth
- Toolbar : "Curriculum · Competences · Certification" tabs

### Fichier modifie

| Fichier | Action |
|---------|--------|
| `src/components/landing/TrainingsSection.tsx` | Rewrite complet |

Memes donnees (3 formations IA), presentation radicalement plus immersive et adaptee mobile-first.

