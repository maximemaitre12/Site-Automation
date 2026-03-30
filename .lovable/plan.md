

# Passage au fond blanc — Adaptation complète de la palette

## Constat
Actuellement, toutes les sections de la landing page utilisent `bg-[#060918]` ou `bg-[#0a0e1f]` (fond quasi-noir) avec du texte blanc et des effets glass-morphism conçus pour le sombre. Le header utilise déjà `bg-background` (blanc). Il faut inverser la palette tout en conservant le niveau de qualité et l'esthétique premium.

## Principe
- Fond blanc (`bg-white` ou `bg-background`) pour toutes les sections
- Texte sombre (`text-foreground`, `text-slate-900`, `text-slate-600`)
- Les cartes glass-morphism deviennent des cartes à bordures fines sur fond `bg-slate-50` ou `bg-white` avec `shadow-sm`
- Accents lumineux (primary/indigo) restent pour les highlights, badges et icônes
- Alternance de sections `bg-white` / `bg-slate-50` pour créer du rythme visuel (au lieu de sombre/sombre)
- Les mesh gradients deviennent des gradients très subtils clairs (bleu/violet à 3-5% d'opacité)
- La grille de points de fond passe de `white/0.02` à `slate-900/0.03`

## Changements par fichier

### 1. `HeroSection.tsx`
- `bg-[#060918]` → `bg-white`
- Mesh gradients : inverser en `hsl(239 84% 67% / 0.04)` sur fond clair
- Dot grid : `hsl(0 0% 0% / 0.03)` au lieu de `white/0.03`
- Texte : `text-white` → `text-slate-900`, `text-white/50` → `text-slate-500`
- Badge top : `border-white/10 bg-white/5` → `border-slate-200 bg-slate-50`
- Stats : `text-white` → `text-slate-900`, `text-white/50` → `text-slate-500`
- CTA shadow : garder le glow primary mais plus subtil
- Gradient text "Intelligence Artificielle" : conserver tel quel (fonctionne sur clair)

### 2. `HeroDiagram.tsx`
- Nœuds : `bg-white/[0.04] border-white/[0.08]` → `bg-white border-slate-200 shadow-sm`
- Nœud central "IA" : garder `bg-primary/10 border-primary/30`
- Labels : `text-white/70` → `text-slate-700`
- Connexions : `from-primary/0 via-primary/30` → `from-primary/0 via-primary/20`
- Data flow labels : `bg-primary/20 text-primary` → garder, ça marche sur clair

### 3. `ProblemsSection.tsx`
- `bg-[#060918]` → `bg-slate-50`
- Dashboard frame : `bg-white/[0.03] border-white/[0.08]` → `bg-white border-slate-200 shadow-lg`
- Barre titre terminal : `bg-white/[0.05]` → `bg-slate-100`
- Titre "AETHER" : `text-white/50` → `text-slate-500`
- Texte : `text-white` → `text-slate-900`, `text-white/40` → `text-slate-500`
- Barres de progression : adapter les backgrounds
- Badges status : garder les couleurs (rouge/vert/jaune fonctionnent sur clair)

### 4. `ImpactSection.tsx`
- `bg-[#060918]` → `bg-white`
- Metric cards : `bg-white/[0.04] border-white/[0.06]` → `bg-slate-50 border-slate-200 shadow-sm`
- Texte : `text-white` → `text-slate-900`
- Mini charts SVG : `stroke="hsl(0 0% 100% / 0.06)"` → `stroke="hsl(0 0% 0% / 0.08)"`
- Gradient fill : garder le primary gradient, fonctionne sur clair

### 5. `PositioningSection.tsx`
- `bg-[#060918]` → `bg-slate-50`
- Layer cards : adapter les couleurs de fond/border pour fond clair
- `text-white` → `text-slate-900`
- Texte descriptif à droite : `text-white/50` → `text-slate-500`

### 6. `MethodSection.tsx`
- `bg-[#0a0e1f]` → `bg-white`
- Step cards : `bg-white/[0.03] border-white/[0.08]` → `bg-white border-slate-200 shadow-sm`
- Mini stats internes : `bg-white/[0.06]` → `bg-slate-100`
- Texte : inverser toutes les refs `text-white`
- Ligne connecteur : `via-primary/30` reste OK

### 7. `UseCasesSection.tsx`
- `bg-[#060918]` → `bg-slate-50`
- Split cards : adapter les fonds "AVANT" (gris clair) / "APRÈS" (blanc)
- `bg-white/[0.03]` → `bg-white border-slate-200 shadow-sm`
- Texte : `text-white` → `text-slate-900`

### 8. `DifferentiationSection.tsx`
- `bg-[#0a0e1f]` → `bg-white`
- Capability cards : `bg-white/[0.04] border-white/[0.06]` → `bg-slate-50 border-slate-200 shadow-sm`
- Cercles SVG : `stroke="hsl(0 0% 100% / 0.06)"` → `stroke="hsl(0 0% 0% / 0.08)"`
- Icônes : `drop-shadow` coloré reste OK sur fond clair
- Texte : inverser

### 9. `FinalCTASection.tsx`
- `bg-[#060918]` → `bg-slate-900` (garder cette section sombre pour le contraste final, c'est un pattern classique consulting)
- Ou si tout doit être blanc : `bg-slate-50` avec texte sombre

### 10. `LandingHeader.tsx`
- Déjà en `bg-background` (blanc) — rien à changer
- Le bouton "Log in" bleu fonctionne toujours

## Résultat
Landing page sur fond blanc avec sections alternées `bg-white` / `bg-slate-50`, cartes avec bordures fines et ombres légères, texte sombre, accents indigo conservés. Style Apple/Stripe plutôt que Palantir, mais avec la même densité de contenu et animations.

