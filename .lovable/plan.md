## Objectif

Refondre les trois pages juridiques liées au bracelet Oreon et au site AETHER pour qu'elles soient claires, complètes, rassurantes (politique de remboursement souple) et écrites sans aucun tiret (ni "-", ni "—", ni "–"), afin d'éliminer toute trace stylistique typique d'une rédaction IA.

## Pages concernées

1. **`src/pages/legal/LegalNotice.tsx`** (Mentions légales, route `/legal/mentions`)
2. **`src/pages/legal/BraceletCGV.tsx`** (CGV bracelet Oreon, route `/legal/bracelet-cgv`)
3. **Nouvelle page** `src/pages/legal/RefundPolicy.tsx` (Politique de remboursement, route `/legal/remboursement`)
4. Mise à jour du **footer** (`src/components/landing/LandingFooter.tsx`) pour ajouter le lien "Politique de remboursement" et un lien "CGV bracelet".
5. Ajout de la route dans **`src/App.tsx`**.

## Règle de style absolue

Aucun tiret dans le contenu rédigé :
- Plus de "-" (hyphen)
- Plus de "—" (em dash)
- Plus de "–" (en dash)
- Les listes utilisent des puces "•" déjà en place
- Les énumérations dans les phrases utilisent des virgules, "et", "ou", deux points, parenthèses
- Les mots composés sont reformulés (ex. "à vie" au lieu de "garanti à vie", "service après vente" sans tiret accepté en français moderne, "TVA non applicable" plutôt que "TVA non‑applicable")
- Les dates écrites en toutes lettres ("1er juin 2026") au lieu de "01-06-2026"
- Les numéros (SIREN, téléphone) gardent leurs espaces, jamais de tiret

Vérification finale : un grep sur les trois fichiers ne doit retourner aucune occurrence de `-`, `—`, `–` dans les chaînes de texte affichées (les imports JS et la syntaxe JSX sont exclus de la règle, évidemment).

## Contenu des pages

### 1. Mentions légales (`LegalNotice.tsx`)

Sections claires :
1. Éditeur du site (AETHER GROUP, SAS, SIREN 104 445 424, adresse 66 Avenue des Champs Élysées 75008 Paris, capital social, TVA non applicable art. 293 B du CGI)
2. Directeur de la publication (Youriy Strashnyi)
3. Hébergement (Lovable Cloud, infrastructure européenne)
4. Contact (email + téléphone, sans tirets)
5. Propriété intellectuelle
6. Données personnelles (renvoi vers Politique de confidentialité)
7. Cookies
8. Droit applicable et juridiction compétente

### 2. CGV Bracelet Oreon (`BraceletCGV.tsx`)

Mise à jour pour refléter la réalité actuelle (option 4,99 € retirée, prix unique 3,99 €, paiement uniquement par prélèvement SEPA signé sur le site) :

1. Objet
2. Produit (bracelet silicone NFC, non médical)
3. Prix : 3,99 € TTC, paiement unique, frais de port inclus France métropolitaine
4. Commande (étapes en ligne)
5. Paiement : exclusivement prélèvement SEPA, mandat signé électroniquement sur le site, débit sous 24 heures, certifié Stripe PCI DSS niveau 1
6. Livraison : estimée avant le 1er juin 2026, suivi par email
7. Droit de rétractation : 14 jours calendaires, procédure simple par email
8. **Politique de remboursement étendue** (renvoi vers la page dédiée) : remboursement intégral sous 14 jours, sans justification, sur simple demande à `contact@aether-connect.com`. Bracelet à retourner si déjà reçu, frais de retour pris en charge par AETHER pour toute demande de remboursement effectuée dans les 30 premiers jours.
9. Garanties (légale de conformité, vices cachés, commerciale à vie)
10. Responsabilité
11. Données personnelles
12. Propriété intellectuelle
13. Droit applicable et litiges (médiateur de la consommation, juridiction Paris)
14. Contact

Toutes les phrases relues pour supprimer chaque tiret. Les listes restent à puces "•".

### 3. Politique de remboursement (nouvelle page `RefundPolicy.tsx`)

Ton volontairement humain et rassurant. Sections :

1. **Notre engagement** : "Si le bracelet ne vous convient pas, nous vous remboursons. Sans discussion, sans justification, sans frais cachés."
2. **Délai** : 14 jours calendaires à compter de la réception (droit légal de rétractation), étendu à 30 jours commerciaux par AETHER pour le bracelet Oreon.
3. **Comment demander un remboursement** : un email à `contact@aether-connect.com` avec votre numéro de commande. Réponse sous 24 heures ouvrées.
4. **Retour du produit** : étiquette de retour prépayée fournie par AETHER. Aucun frais à votre charge. Le bracelet doit être renvoyé dans son emballage d'origine, en bon état.
5. **Délai de remboursement** : sous 14 jours après réception du bracelet retourné, par le même moyen de paiement (prélèvement SEPA inversé, virement remboursement).
6. **Cas particuliers** : bracelet personnalisé non remboursable une fois fabriqué (mais annulation possible avant lancement de la production), produit endommagé par mauvaise utilisation non couvert.
7. **Garantie à vie séparée** : rappel que la garantie commerciale couvre tout défaut de fabrication sans limite de durée.
8. **Contact** : email + téléphone.

Encadré visible en haut de page : "Remboursement simple, rapide, sans condition. Vous avez 30 jours pour changer d'avis."

### 4. Footer

Ajouter dans la colonne "Company" ou créer une nouvelle entrée dans la liste des liens légaux en bas :
- "Politique de remboursement" → `/legal/remboursement`
- "CGV Bracelet" → `/legal/bracelet-cgv`

Aucun tiret ajouté dans les libellés.

### 5. Routing

Ajouter dans `src/App.tsx` :
```tsx
import RefundPolicy from "./pages/legal/RefundPolicy";
// ...
<Route path="/legal/remboursement" element={<RefundPolicy />} />
```

## Détails techniques

- Conserver la structure visuelle existante des pages légales (header sticky padding, max width 800px, tokens couleur `#0F172A`, `#475569`, `#1E4D8C`).
- Conserver le composant `whitespace-pre-line` pour respecter les retours à la ligne dans les `content`.
- Aucune modification des composants UI partagés ni de la logique métier.
- Date "Dernière mise à jour" : Mai 2026 (cohérent avec l'existant).

## Vérification finale

Après implémentation, lancer un grep ciblé sur les trois fichiers pour s'assurer qu'aucun caractère tiret n'apparaît dans les chaînes affichées à l'utilisateur.
