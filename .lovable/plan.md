

# Redesign Complet -- Style Farmak.ch

## Analyse de Farmak.ch

Farmak.ch utilise un style tres specifique:
- **Hero immersif** avec des images de produits qui se chevauchent dans des cercles, un grand titre en deux lignes avec line-break, et des decorations circulaires
- **Stats en ligne** avec de tres grands chiffres (pas de cartes, juste une rangee horizontale)
- **Paragraphes narratifs** avec des **mots en gras** inline -- pas de bullet points
- **Listes de categories** cliquables avec titres en majuscules
- **Sections "Globale Prasenz"** avec des facts inline en gras dans des phrases
- **Section Qualite** avec de grands chiffres et descriptions courtes en tableau
- **Section Partenaire** avec des titres ALL-CAPS et descriptions courtes -- pas de numeros, pas d'icones
- **Enormes espaces** entre sections (120-160px)
- **Fond blanc partout** avec tres peu de variation de couleur de fond
- **Pas de dividers visibles** (pas de divide-x, divide-y)
- **CTA "Prasentation Anfordern"** repete plusieurs fois

## Changements Majeurs

### Philosophie
Supprimer tout ce qui fait "consulting agency template": numeros `01/02/03`, dividers `divide-x/divide-y`, grilles 3-colonnes avec separateurs, labels uppercase "Defis/Expertise/etc". Remplacer par du contenu narratif avec mots en gras, des grands chiffres nus, et beaucoup plus de blanc.

### Reduction des sections
Passer de 13 sections a 8-9 en fusionnant:
1. **Hero** -- garder le gradient, ajouter des images circulaires decoratives qui se chevauchent (comme Farmak), titre plus grand
2. **Stats** -- juste 4 grands chiffres en ligne, pas de cartes/bordures/ombres
3. **Intro narrative + Expertise** -- un grand paragraphe avec **mots en gras** + liste de domaines cliquables en majuscules (comme les therapeutische Bereiche de Farmak)
4. **Equipe/Presence** -- style "Globale Prasenz" de Farmak: facts en gras dans des phrases courtes
5. **Qualite/Methodologie** -- grands chiffres + descriptions courtes en grille, comme la section qualite de Farmak
6. **Cas d'etude** -- plus narratif, garder le testimonial
7. **Partenaire** -- 4 blocs titre ALL-CAPS + description (comme "Verlasslicher Geschaftspartner" de Farmak)
8. **CTA Final**

### Fichiers a modifier

**PharmaHero.tsx** -- Ajouter des cercles decoratifs avec images (ou motifs) qui se chevauchent comme Farmak. Titre plus grand (text-7xl+). Bouton "Mehr sehen" style vertical a droite.

**PharmaStats.tsx** -- Supprimer tout styling de carte. Juste des grands chiffres (text-7xl) en rangee sur fond blanc avec un trait fin en-dessous. Pas d'ombre, pas de fond gris.

**PharmaProblems.tsx** -- Transformer en section narrative: un grand paragraphe avec **bold keywords** suivi d'une liste de domaines en majuscules cliquables (style Farmak "therapeutische Bereiche"). Supprimer les colonnes avec separateurs.

**PharmaTeam.tsx** -- Transformer en section "presence/equipe" avec des facts en gras dans des phrases (style Farmak "Globale Prasenz"). Ex: "**15 ans** d'experience chez **Sanofi et Novartis**" etc. Pas de cartes separees.

**PharmaExpertise.tsx** -- Fusionner avec la section Problems ou supprimer. Le contenu migre dans la section narrative.

**PharmaMethodology.tsx** -- Transformer en grille de chiffres comme la section "Qualitat" de Farmak: grands chiffres + description d'une ligne. Pas de timeline.

**PharmaCaseStudy.tsx** -- Garder mais simplifier. Plus de texte narratif, moins de tableaux. Grand testimonial.

**PharmaTrust.tsx** -- Transformer en section "Partenaire" style Farmak: 4 blocs avec titre ALL-CAPS et description courte. Pas de numeros.

**Supprimer/fusionner**: PharmaPortfolio (integrer dans CaseStudy), PharmaServices (integrer dans CTA ou supprimer), PharmaResources (supprimer -- pas dans Farmak), PharmaFAQ (garder mais simplifier).

**Landing.tsx** -- Reduire a ~8 sections.

**LandingHeader.tsx** -- Supprimer rounded-full sur les boutons. Plus minimaliste.

**LandingFooter.tsx** -- Supprimer les icones rondes pour les reseaux sociaux. Plus epure.

### Details de style
- Padding sections: 140-180px vertical (au lieu de 100-120px)
- Fond: blanc partout, supprimer les alternances `#FAFCFE`
- Pas de `divide-x`, `divide-y`, pas de bordures entre elements
- Grands chiffres: `text-7xl md:text-8xl` en couleur primaire
- Paragraphes avec `<strong>` pour les mots cles
- Boutons: rectangulaires (pas rounded-full), plus de presence

