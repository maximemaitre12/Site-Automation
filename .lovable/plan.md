

## Plan: Normalisation globale des couleurs — Violet/Bleu uniquement

### Problème
La LP utilise trop de couleurs (emerald, amber, orange, red, yellow, teal, cyan) qui créent un patchwork visuel non professionnel.

### Direction
- **2 couleurs principales** : Violet (`primary` / `hsl(260 70% 60%)`) et Bleu clair (`hsl(200 80% 55%)`)
- **Fond blanc** partout — supprimer `bg-slate-50`, `bg-slate-900`, `bg-slate-950`
- **Emerald** gardé UNIQUEMENT pour les petits dots "Live" / "Actif" (1.5px pulsants)
- Tout le reste (barres, métriques, accents, badges, sparklines) → violet/bleu

### Fichiers modifiés (9 fichiers)

| Fichier | Changements clés |
|---------|-----------------|
| **ProblemsSection.tsx** | `bg-slate-50` → `bg-white`. Barres critical/warning/optimal → gradient violet (intensité selon score). Badges → violet shades. Scores texte → primary/violet |
| **ImpactSection.tsx** | `barColor` emerald/amber → primary/violet/bleu. Sparkline colors → all primary/bleu. Supprimer orange/amber |
| **PositioningSection.tsx** | `bg-slate-50` → `bg-white`. Sidebar `bg-slate-900` → `bg-slate-800` (garder dark car c'est un IDE) |
| **MethodSection.tsx** | `bg-slate-950` → `bg-white`, texte dark. Accent "emerald" step 3 → bleu clair `hsl(200 80% 55%)`. Supprimer emerald bar/glow/numBg. Duration dots → primary au lieu d'emerald |
| **UseCasesSection.tsx** | Toutes les `text-emerald-400` métriques → `text-primary`. Hero metric glow → primary shadow. Active borders → primary. "LIVE" badges → primary pulse |
| **DifferentiationSection.tsx** | Status "Opérationnel" emerald → primary. "6/6 active" → primary |
| **PartnersSection.tsx** | "Actif"/"Live"/"Connecté" emerald → garder emerald UNIQUEMENT sur les petits dots 1.5px. Texte labels → primary |
| **TrainingsSection.tsx** | Sidebar `bg-slate-900` → garder dark (IDE style). Normaliser gradients formations → violet/bleu |
| **FinalCTASection.tsx** | `bg-slate-900` → `bg-white`. Texte blanc → `text-slate-900`. `text-slate-400` → `text-slate-500`. Ligne via-slate-700 → via-slate-200. CTA glow inchangé |

### Règle uniformisée
- `emerald-400/500` pour métriques/barres/badges → `text-primary` / `bg-primary`
- `amber-400`, `orange-400`, `yellow-400/500` → `hsl(200 80% 55%)` (bleu clair)
- `red-400/500` barres → `hsl(260 70% 60%)` (violet moyen) à faible opacité
- `teal-500`, `cyan-*` → supprimés
- Seule exception : traffic lights macOS (`red-400`, `yellow-400`, `green-400`) restent intacts

