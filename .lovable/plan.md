

## Plan: Chaque section = une app Mac unique et immersive

L'idee est de transformer chaque section du landing en une **fenetre Mac distincte** avec un style d'application different (terminal, dashboard, IDE, Finder, etc.), tout en gardant les contenus actuels.

### Composant partage

**Creer `src/components/landing/MacWindow.tsx`**
- Props: `title`, `variant` (light/dark), `statusDot` (couleur custom), `toolbar` (boutons optionnels), `children`, `className`
- Les 3 dots (rouge/jaune/vert), barre de titre mono, coins arrondis, ombre
- Support mode sombre (bg-slate-900) et clair (bg-white)

### Sections transformees

| Section | App Mac simulee | Titre fenetre | Idee creative |
|---------|----------------|---------------|---------------|
| **ProblemsSection** | Terminal/Scanner | `AETHER DIAGNOSTIC ENGINE v2.4` | Deja fait, on conserve tel quel |
| **ImpactSection** | Activity Monitor | `AETHER PERFORMANCE MONITOR` | Les 4 metriques deviennent des lignes de monitoring avec sparklines en temps reel, barre CPU/Memory style macOS Activity Monitor |
| **PositioningSection** | IDE/Code Editor | `AETHER PIPELINE EDITOR v1.8` | Le pipeline donnees→IA→decisions presente comme des blocs de code avec syntax highlighting, onglets fichiers, sidebar mini-map |
| **UseCasesSection** | Finder/Comparator | `AETHER CASE LAB v2.0` | Les avant/apres presentes comme des fichiers dans un Finder avec colonnes, icones dossier, tags couleur |
| **DifferentiationSection** | System Preferences | `AETHER CAPABILITIES` | Les 6 capacites presentees comme des panneaux System Preferences macOS avec icones rondes, toggles actifs, barres de niveau |
| **TrainingsSection** | App Store | `AETHER ACADEMY` | Les 3 formations presentees comme des apps a telecharger avec bouton "Obtenir", ratings, previews |

### Details techniques

**ImpactSection** (Activity Monitor):
- Header avec onglets "CPU / Memory / Network / Disk" (seul CPU actif)
- Les 4 metriques en lignes de tableau avec barres horizontales animees
- Un mini graphe en bas style "CPU History" avec courbe animee
- Couleurs vert/jaune/rouge selon les valeurs

**PositioningSection** (IDE):
- Barre d'onglets fichiers: `data.src`, `engine.ai`, `output.opt`
- Sidebar sombre avec arborescence de fichiers
- Contenu: blocs de pseudo-code colore qui montrent la transformation
- Numeros de lignes, cursor clignotant

**UseCasesSection** (Finder):
- Barre de navigation avec breadcrumb "Aether > Cases > [secteur]"
- Vue en colonnes style Finder macOS
- Chaque cas est un dossier avec preview avant/apres
- Tags couleur (rouge=avant, vert=apres)

**DifferentiationSection** (System Preferences):
- Grille d'icones rondes style System Preferences
- Au clic/hover, le panneau s'ouvre avec details + progress circulaire
- Search bar en haut (decoratif)

**TrainingsSection** (App Store):
- Cards avec icones arrondies style app
- Bouton bleu "Obtenir" / "GET"
- Sous-titre "In-App Purchases" remplace par duree
- Rating etoiles decoratif

### Fichiers modifies

| Fichier | Action |
|---------|--------|
| `src/components/landing/MacWindow.tsx` | Creer |
| `src/components/landing/consulting/ImpactSection.tsx` | Rewrite |
| `src/components/landing/consulting/PositioningSection.tsx` | Rewrite |
| `src/components/landing/consulting/UseCasesSection.tsx` | Rewrite |
| `src/components/landing/consulting/DifferentiationSection.tsx` | Rewrite |
| `src/components/landing/TrainingsSection.tsx` | Rewrite |

Les animations scroll-triggered existantes sont conservees. Chaque fenetre Mac a une animation d'entree unique (slide-up + scale).

