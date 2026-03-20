

# Page `/supply` — Version Prospect-Ready

## Constat

La page doit convaincre un Directeur Supply Chain ou un COO en 30 secondes. Pas de jargon IA, pas de features techniques. Uniquement : "je comprends votre probleme, voici la preuve que je le resous."

## Architecture de la page

Un seul fichier `src/pages/SupplyChain.tsx` + composants dedies dans `src/components/supply/`. Route `/supply` ajoutee dans `App.tsx`. Aucune autre page modifiee. Aucun lien vers cette page.

### Section 1 — Hero (credibilite immediate)

Fond blanc epure, style Apple/McKinsey. Pas d'animation flashy.

- **Titre** : "Anticipate. Optimize. Deliver." (sobre, pas de "AI" dans le titre)
- **Sous-titre** : "The intelligent platform that gives supply chain leaders full visibility — from supplier risk to last-mile delivery."
- **Chiffre unique accrocheur** : "Companies using predictive supply chain AI reduce stockouts by 35% and logistics costs by 23%." (source-style, credible)
- **CTA** : "Book a Supply Chain Assessment" → lien vers `/demo`
- **Pas de logo cloud, pas de badges tech** — ca fait startup, pas enterprise

### Section 2 — Les 4 douleurs (identification immediate)

Grille 2x2, cartes sobres avec icones monochromes. Chaque carte :
- Un titre = le probleme du prospect
- Un chiffre = le cout de ne rien faire
- Une ligne = ce que la plateforme change

| Carte | Probleme | Cout | Solution |
|-------|----------|------|----------|
| Demand Blindness | "Your forecasts are wrong 40% of the time" | "$2.1M avg excess inventory per site" | Probabilistic multi-scenario forecasting |
| Supplier Risk | "You discover supplier failures after impact" | "72h average detection delay" | Real-time supplier scoring & early warnings |
| Logistics Waste | "Routes and loads are planned manually" | "15-25% transport cost overruns" | Automated consolidation & route optimization |
| Compliance Gaps | "Audits are reactive, traceability is fragmented" | "€500K+ avg regulatory penalty" | Continuous automated compliance monitoring |

### Section 3 — Dashboard simule (preuve visuelle)

Un composant statique mais visuellement riche montrant un "Control Tower" :
- Mini carte mondiale avec 5-6 points relies par des lignes (CSS pur, pas de lib)
- 4 KPIs animes (OTIF 94.2%, Lead Time 12.3j, Stock Coverage 32j, Risk Score 2/10)
- 1 alerte active : "Supplier Shenzhen Electronics — 72h delay risk — Confidence: 91%"
- 1 prediction : "Q3 demand spike +18% on SKU category A — 3 scenarios available"

Design : fond sombre (contraste), coins arrondis, style terminal/dashboard pro.

### Section 4 — Comment ca marche (3 etapes)

Horizontal, minimaliste :
1. **Connect** — "Your ERP, WMS, TMS in 48h" (logos SAP, Oracle, Microsoft Dynamics en gris)
2. **Analyze** — "AI maps your flows, detects anomalies, builds prediction models"
3. **Act** — "Alerts, forecasts, and recommendations — before problems become crises"

### Section 5 — Cas client chiffre

Card sobre style "case study brief" :
- **Titre** : "How a global manufacturer cut logistics costs by 23% in 90 days"
- **Contexte** : 12 sites, 400+ suppliers, 3 continents
- **3 resultats** : OTIF +15pts, stock -18%, supplier incidents detected 72h earlier
- **Citation** : "For the first time, we see our entire supply chain in real time." — VP Supply Chain, Industrial Group

### Section 6 — CTA final

Sobre, direct :
- "Ready to see what your supply chain is missing?"
- Bouton "Book Your Assessment" → `/demo`
- Ligne de confiance : "No commitment · 48h deployment · Dedicated support"

### Section 7 — Footer minimal

Reprise du footer existant (import `LandingFooter`).

## Fichiers

| Action | Fichier |
|--------|---------|
| Creer | `src/pages/SupplyChain.tsx` — page principale |
| Creer | `src/components/supply/SupplyHero.tsx` |
| Creer | `src/components/supply/SupplyPainPoints.tsx` |
| Creer | `src/components/supply/SupplyDashboard.tsx` |
| Creer | `src/components/supply/SupplyHowItWorks.tsx` |
| Creer | `src/components/supply/SupplyCaseStudy.tsx` |
| Creer | `src/components/supply/SupplyCTA.tsx` |
| Modifier (1 ligne) | `src/App.tsx` — ajout `<Route path="/supply" element={<SupplyChain />} />` |

Header : reutilisation de `LandingHeader` existant. Footer : reutilisation de `LandingFooter` existant. Zero modification de ces composants.

## Principes de design

- Police Inter (deja en place), pas de police supplementaire
- Palette : blanc + gris + indigo primaire existant, section dashboard en fond sombre pour contraste
- Zero animation gratuite — uniquement des fade-in au scroll (`useScrollAnimation` existant)
- Espace genereux, texte aere, hierarchie claire
- Mobile-first responsive (grille 1 col mobile, 2 col desktop)

