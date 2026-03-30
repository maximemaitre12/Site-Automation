

# Refonte "AI Premium" — Landing page qui fait rêver

## Le vrai problème
Les SVG actuels (cercles concentriques, barres horizontales, radar chart) ressemblent à des exercices PowerPoint. Le user veut quelque chose qui montre la **puissance de l'IA** de manière viscérale — style Palantir, Anthropic, ou les démos d'OpenAI. Il faut des animations qui racontent une histoire d'intelligence artificielle en action, pas des graphiques statiques.

## Direction visuelle : "AI Command Center"
- Sections sombres alternées (`bg-slate-950`) avec accents lumineux
- Glass-morphism (`backdrop-blur`, bordures lumineuses semi-transparentes)
- Animations CSS sophistiquées (pas de `<animateMotion>` SVG amateur)
- Grilles de données qui s'actualisent, dashboards qui se construisent
- Particules et gradients mesh en fond

---

## Fichiers à réécrire (8 fichiers)

### 1. `HeroDiagram.tsx` → "Neural Processing Engine"
Supprimer le diagramme cercles/scan actuel. Nouveau concept :
- Grille de **12-16 nœuds hexagonaux** disposés en réseau neuronal (CSS Grid, pas SVG artisanal)
- Chaque nœud = carte glass-morphism avec icône + label ("Données", "Analyse", "Prédiction", "Décision")
- Des **lignes de connexion CSS** (pseudo-elements `::after`) avec un gradient animé qui pulse le long de la ligne (CSS `background-position` animation)
- Les nœuds apparaissent en cascade (stagger 80ms) puis les connexions s'illuminent séquentiellement
- Un nœud central "IA" plus grand avec un halo radial animé (une seule rotation lente de 20s)
- Données qui "transitent" : petits labels (`+12%`, `−3j`, `×2`) qui apparaissent sur les connexions puis fade out

### 2. `HeroSection.tsx`
- Fond sombre `bg-slate-950` avec mesh gradient CSS (`radial-gradient` superposés, bleu/violet très subtils)
- Texte blanc, CTA avec bordure lumineuse
- Layout split conservé mais le diagramme prend plus de place
- Supprimer `animate-pulse` sur le dot

### 3. `ProblemsSection.tsx` → "AI Diagnostic Scanner"
Supprimer les barres rouges. Nouveau concept :
- Fond sombre
- **Dashboard simulé** : une carte glass-morphism qui ressemble à un vrai écran d'analyse IA
- À l'intérieur : 5-6 lignes de "process scan" qui s'analysent séquentiellement au scroll
- Chaque ligne : nom du processus → barre de progression qui se remplit → score qui apparaît → badge rouge "Friction détectée" ou vert "Optimal"
- En bas du dashboard : un résumé animé "4 points de friction identifiés — Potentiel d'optimisation : 340K€/an"
- Le tout dans un cadre avec une barre de titre "AETHER DIAGNOSTIC ENGINE v2.4" style terminal

### 4. `ImpactSection.tsx` → "Performance Intelligence"
Supprimer les barres de progression basiques. Nouveau concept :
- Fond sombre avec grille de points subtile
- **4 grandes "metric cards"** glass-morphism en grille 2×2
- Chaque carte : grand chiffre animé (`useCountUp`, `text-5xl`), label, et un **mini line-chart CSS** (5-6 points reliés par des segments, dessinés avec `clip-path` ou `border` trick) montrant la tendance
- Les charts se dessinent au scroll (animation `stroke-dashoffset` sur un `<path>` SVG minimal et propre)
- Badge "+↑" vert à côté de chaque métrique

### 5. `PositioningSection.tsx` → "Intelligence Architecture"
Supprimer les cercles concentriques. Nouveau concept :
- Fond clair
- Schéma **isométrique CSS** (grille en perspective avec `transform: rotateX(55deg) rotateZ(-45deg)`) montrant 3 couches empilées :
  - Couche 1 (base) : "Données brutes" — rectangles gris
  - Couche 2 (milieu) : "Moteur IA" — rectangles primary avec glow
  - Couche 3 (top) : "Décisions optimisées" — rectangles lumineux
- Les couches apparaissent de bas en haut au scroll avec un léger rebond
- Des flèches verticales CSS entre les couches
- Labels à côté de chaque couche

### 6. `MethodSection.tsx` → "Deployment Pipeline"
Supprimer le pipeline SVG avec particules. Nouveau concept :
- **Timeline horizontale** style CI/CD pipeline (desktop) / verticale (mobile)
- 3 étapes, chacune = carte glass-morphism avec :
  - Numéro lumineux (`text-4xl text-primary`)
  - Titre + description
  - **Mini dashboard preview** à l'intérieur de chaque carte : une grille 2×2 de mini-stats simulées (petits rectangles colorés qui représentent des graphiques)
  - Durée en badge : "2-3 semaines"
- Connecteurs entre les cartes : ligne CSS avec un gradient qui pulse (une seule fois au scroll, `animation-fill-mode: forwards`)
- Les cartes apparaissent en cascade

### 7. `UseCasesSection.tsx` → "Transformation Engine"
Supprimer les mini-SVG avant/après. Nouveau concept :
- **3 cas d'usage** (ajouter Supply Chain Planning)
- Chaque cas = grande carte qui montre un **split-screen animé** :
  - Côté gauche "AVANT" : interface fictive grisée, floue, avec des metrics rouges
  - Côté droit "APRÈS" : interface fictive nette, colorée, avec des metrics vertes
  - Une **ligne de séparation verticale** qui glisse de gauche à droite au scroll (comme un slider avant/après photo)
  - En dessous : métrique clé en gros (`−40% délais`, `÷3 temps d'analyse`, `+85% précision`)

### 8. `DifferentiationSection.tsx` → "AI Capabilities Matrix"
Supprimer le radar chart. Nouveau concept :
- **Grille 2×3** de "capability cards" glass-morphism sur fond sombre
- Chaque carte : icône Lucide lumineuse (avec `drop-shadow` coloré), titre, description 2 lignes, et un **pourcentage circulaire** (cercle SVG avec `stroke-dashoffset` animé au scroll)
- 6 capabilities : "Analyse prédictive", "Automatisation", "NLP", "Vision", "Optimisation", "Reporting"
- Les cercles de pourcentage se remplissent en cascade

### 9. `FinalCTASection.tsx`
- Fond `bg-slate-950` avec gradient mesh
- Supprimer `animate-pulse-glow`
- Bouton avec bordure gradient animé (rotation lente du gradient, 8s)
- Texte blanc

## Animations — Règles strictes
- **CSS transitions** (`transition-all`, `transitionDelay`) pour les reveals au scroll
- **`useCountUp`** pour les chiffres
- **`stroke-dashoffset`** pour les line-charts et cercles de pourcentage (une seule fois)
- **`@keyframes`** CSS pour les gradients de connexion (pulse subtil, pas de boucle visible — durée longue 6-8s)
- **Zéro** : `<animateMotion>`, `repeatCount="indefinite"` sur des cercles/dots, SVG artisanaux complexes
- Maximum 1 animation en boucle par section (le gradient de fond), tout le reste = one-shot

## Résultat attendu
Un site qui ressemble aux démos de **Palantir AIP**, **Anthropic**, ou **Scale AI** : sombre, lumineux, data-driven, avec des interfaces simulées qui donnent l'impression qu'un moteur IA tourne en arrière-plan. Pas des schémas scolaires mais des dashboards qui font rêver les décideurs.

