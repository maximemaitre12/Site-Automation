

## Plan: Refonte totale UseCasesSection — AETHER ANALYTICS LAB v3.0

Réécriture complète en **dashboard d'analyse de données** style Bloomberg Terminal / Tableau, bien plus immersif et responsive que le Finder actuel.

### Concept créatif

Simuler **"AETHER ANALYTICS LAB v3.0"** — un outil d'intelligence data premium :

**Desktop (lg+)** : Layout 2 colonnes dans MacWindow dark
- **Sidebar gauche** (w-52, bg-slate-900) : les 3 secteurs comme des "datasets" avec mini sparkline SVG inline (5 points animés), badge pulsant "LIVE" vert, variation delta colorée, et hover glow
- **Zone principale** divisée verticalement :
  1. **Header dataset** : nom du secteur + icône gradient + gros chiffre delta animé avec glow pulsant (ex: "−40%" en 3xl avec text-shadow emerald)
  2. **Tableau spreadsheet** : 3 lignes (une par KPI), colonnes "KPI | Avant | Après | Δ" — les cellules "Avant" en rouge barré, "Après" en vert bold, et la colonne Delta contient une **barre de progression horizontale animée** (0→100% au scroll) avec pourcentage
  3. **Mini bar chart SVG** en bas : barres groupées (before=rouge semi-transparent 40%, after=vert gradient) avec gridlines pointillées horizontales et labels d'axe Y — les barres "after" grandissent avec animation spring
- **Status bar** : "Last analysis: 2 min ago" + dot vert pulsant "Live" + "3 datasets loaded"

**Tablet (md)** : Même layout mais sidebar plus étroite (w-40), textes légèrement réduits

**Mobile (<md)** : 
- Pas de sidebar — les 3 secteurs deviennent des **pills horizontaux scrollables** en haut
- Le tableau devient des **cards empilées** (une par KPI) avec barre de progression
- Le chart SVG s'adapte en largeur 100%
- Le gros chiffre delta reste centré et proéminent

### Détails visuels premium

- **MacWindow variant="dark"** : fond slate-900, bordures slate-700
- Sparklines sidebar : polyline SVG avec stroke-dasharray animé
- Barres de progression : dégradé from-red-500 to-emerald-500 avec transition width 1.5s ease-out déclenchée au scroll
- Chart barres : coins arrondis (rx=3), hover scale(1.05), gradient vertical sur les barres "after"
- Chiffre hero : font-mono text-3xl avec text-shadow: 0 0 20px emerald-500/40 et animation pulse subtile
- Toolbar : onglets "Overview · Compare · Trends" avec le actif souligné en primary

### Fichier modifié

| Fichier | Action |
|---------|--------|
| `src/components/landing/consulting/UseCasesSection.tsx` | Rewrite complet |

