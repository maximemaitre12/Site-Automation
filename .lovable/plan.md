

# Refonte Homepage AETHER — Ultra-visuelle et structurée

## Concept
Chaque section possède un **schéma SVG inline animé au scroll** qui raconte visuellement le concept. Pas de texte seul — tout est accompagné d'un visuel logique. Style "Enterprise Minimalism" conservé : fond blanc, indigo comme accent, Inter, espacement généreux.

## Architecture des fichiers

**Créer (7 nouveaux composants)** :
- `src/components/landing/consulting/HeroDiagram.tsx` — SVG animé : flux d'entreprise avec nœuds "inefficacité" → "optimisé"
- `src/components/landing/consulting/ProblemsSection.tsx` — 5 pain points + diagramme de process avec goulots rouges animés
- `src/components/landing/consulting/ImpactSection.tsx` — 5 gains + barres/jauges animées qui montent au scroll
- `src/components/landing/consulting/PositioningSection.tsx` — cercles concentriques animés (Opérations critiques au centre)
- `src/components/landing/consulting/MethodSection.tsx` — pipeline 3 étapes avec particules animées gauche→droite
- `src/components/landing/consulting/UseCasesSection.tsx` — 2 cartes avec mini-diagrammes avant/après
- `src/components/landing/consulting/DifferentiationSection.tsx` — 4 points forts + radar chart SVG animé

**Modifier (3)** :
- `src/components/landing/HeroSection.tsx` — refonte totale : titre FR consulting + `HeroDiagram` animé à droite
- `src/components/landing/FinalCTASection.tsx` — contenu FR, CTA "Planifier un appel" → mailto
- `src/pages/Landing.tsx` — remplacer toutes les anciennes sections par les nouvelles

## Détail des schémas animés par section

### 1. Hero
Layout split : texte gauche, SVG droite. Le SVG montre 4 nœuds (Supply Chain, RH, Logistique, Opérations) connectés par des edges. Des particules circulent entre les nœuds. Un "scan beam" horizontal descend et les nœuds passent de gris à indigo (optimisés). Déclenché automatiquement à l'entrée.

### 2. Problèmes
Diagramme vertical de 5 nœuds de processus connectés. Chaque nœud clignote en rouge séquentiellement au scroll (goulot d'étranglement). Une ligne de scan descend et "révèle" chaque problème. Les connexions sont en pointillés (lenteur).

### 3. Impact
5 barres horizontales qui se remplissent progressivement avec des pourcentages animés (CountUp). Chaque barre a une icône et un label. Les barres apparaissent en cascade (stagger 100ms). Couleurs : indigo pour les gains positifs.

### 4. Positionnement
3 cercles concentriques SVG. Au centre : "Opérations critiques". Les cercles s'illuminent de l'intérieur vers l'extérieur (Simplifier → Structurer → Améliorer) avec un délai séquentiel. Fond neutre, traits fins.

### 5. Méthode (3 étapes)
Pipeline horizontal SVG : 3 nœuds numérotés (Analyse → Priorisation → Déploiement) connectés par des flèches. Particules animées coulent de gauche à droite. Chaque nœud pulse séquentiellement quand visible. Sur mobile : vertical.

### 6. Cas d'usage
2 cartes côte à côte. Chaque carte contient un mini SVG : 3 nœuds "avant" (gris, barrés) → flèche → 3 nœuds "après" (indigo, check). Animation : les nœuds "avant" s'estompent, les nœuds "après" s'allument au scroll.

### 7. Différenciation
Radar chart SVG à 4 axes (Résultats, Opérationnel, Impact, Accompagnement). Les axes se remplissent progressivement au scroll avec un trait indigo. Simple et élégant.

### 8. CTA Final
Sobre. Titre + sous-titre + bouton "Planifier un appel". Subtle pulse glow sur le bouton. Pas de schéma complexe.

## Animations
- Toutes déclenchées via `useScrollAnimation` existant (trigger 80px avant viewport, une seule fois)
- SVG animés avec CSS transitions + `transition-delay` pour les séquences
- `useCountUp` existant pour les métriques
- Pas de librairies externes — tout en CSS/SVG natif

## Responsive
- Hero : stack vertical sur mobile (texte au-dessus, SVG en dessous, taille réduite)
- Pipeline méthode : horizontal → vertical sur mobile
- Cartes cas d'usage : 2 colonnes → 1 colonne
- Diagrammes SVG : `viewBox` + `preserveAspectRatio` pour le scaling automatique

