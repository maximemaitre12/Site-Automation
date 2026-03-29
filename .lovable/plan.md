

# Refonte complète du site — Cabinet de conseil Supply Chain & IA

## Contexte
Le site actuel (`/`) affiche une page Supply Chain orientée "plateforme tech". L'objectif est de le repositionner comme un **cabinet de conseil premium** qui vend des résultats business, pas de la technologie.

## Approche
Réécrire les 6 composants `Supply*` existants + adapter le header/footer. Tout le contenu passe en français. Le design reste dans la ligne "Enterprise Minimalism" existante (fond blanc, typographie sobre, espaces généreux).

## Fichiers modifiés

### 1. `src/components/supply/SupplyHero.tsx` — Section Hero
- Titre : "Améliorez la performance de votre supply chain grâce à l'IA"
- Sous-titre : "Nous aidons les entreprises à réduire leurs coûts, fiabiliser leurs opérations et identifier des gains mesurables en quelques semaines."
- CTA : "Demander un échange" (mailto)
- Pas de badge technique, pas de statistiques agressives

### 2. `src/components/supply/SupplyPainPoints.tsx` — Section Problèmes
- 4 situations concrètes : prévisions peu fiables, surstocks/ruptures, processus manuels, données sous-exploitées
- Format épuré : icône + titre + description courte
- Pas de chiffres de coût, pas de "solution" — juste l'identification du problème

### 3. `src/components/supply/SupplyDashboard.tsx` — Section Impact / Résultats
- Remplace le dashboard technique par des KPI business simples
- 4 résultats : réduction coûts logistiques, précision prévisions, gains de temps, optimisation stocks
- Chiffres crédibles mais prudents (ex: "-15 à 25%", "+30%", etc.)

### 4. `src/components/supply/SupplyHowItWorks.tsx` — Section Approche (3 phases)
- Phase 1 : Analyse des opérations
- Phase 2 : Identification et priorisation des opportunités
- Phase 3 : Déploiement de solutions adaptées
- Pas de tags techniques (SAP, API, etc.) — descriptions high-level uniquement

### 5. `src/components/supply/SupplyCaseStudy.tsx` — Section Preuves + Expertise + Positionnement
- Refonte en 3 blocs :
  - **Expertise** : double compétence supply chain + IA, approche orientée résultats
  - **Preuves** : résultats anonymisés ("identification de plusieurs centaines de milliers d'euros d'optimisation", "amélioration significative de la performance opérationnelle")
  - **Positionnement** : "Nous intervenons en amont des projets pour identifier les leviers de performance, puis accompagnons leur mise en œuvre."

### 6. `src/components/supply/SupplyCTA.tsx` — CTA Final
- Titre : "Échangez avec un expert pour identifier vos leviers d'optimisation"
- Bouton : "Planifier un appel" (mailto)
- Sous-texte discret : "Sans engagement · Réponse sous 24h"

### 7. `src/components/landing/LandingHeader.tsx` — Header
- Simplifier la navigation : retirer Blog, Docs, Privacy du menu principal
- Garder uniquement : Accueil, Contact
- CTA header : "Nous contacter" (mailto)

### 8. `src/components/landing/LandingFooter.tsx` — Footer
- Tagline en français : "Conseil en performance supply chain"
- Garder les liens légaux
- Emails de contact

## Design
- Fond blanc, pas de `bg-secondary/40` coloré — alternance blanc / gris très léger (`bg-neutral-50`)
- Typographie : titres `font-semibold tracking-tight`, corps `text-muted-foreground`
- Icônes monochromes, strokeWidth 1.5
- Espaces généreux : `py-20 sm:py-28` entre sections
- Pas de gradients, pas de badges colorés, pas d'animations agressives
- Animations de scroll légères (fade-in) conservées

