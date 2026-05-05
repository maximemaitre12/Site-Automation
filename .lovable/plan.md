
## Objectif

Importer le code Farmasoft à jour depuis `maximemaitre12/Site-Automation` (branche `main`) dans le dossier `src/farmasoft/` du projet Lovable. Le repo GitHub a une structure standalone (`src/`) qu'il faut mapper vers `src/farmasoft/`.

## Changements identifiés

Le repo GitHub contient des modifications majeures par rapport au code actuel :

### Fichiers modifiés (contenu différent)
- `api/client.ts` — 380 lignes vs 205 (ajout messaging API, robota config, etc.)
- `components/layout/Sidebar.tsx` — refonte complète avec ProfileMenu, connexions channels (Telegram, WhatsApp, Viber, Calendly, robota.ua)
- `components/layout/TopBar.tsx` — à comparer et mettre à jour
- `pages/JobDescriptions.tsx` — 263 lignes vs 1243 (réécriture, sous-composants extraits)
- `pages/Dashboard.tsx` — mis à jour
- `pages/Interviews.tsx` — mis à jour
- `pages/Messages.tsx` — mis à jour
- `pages/Settings.tsx` — mis à jour
- `i18n.ts` — mis à jour
- `store/useAppStore.ts` — Page type réduit à `'dashboard' | 'jobs'`

### Nouveaux fichiers à ajouter
- `pages/jobs/AddCandidatePanel.tsx`
- `pages/jobs/CandidateModal.tsx`
- `pages/jobs/JobForm.tsx`
- `pages/jobs/PipelineCard.tsx`
- `pages/jobs/PipelineView.tsx`
- `pages/jobs/PublishModal.tsx`
- `pages/jobs/RobotaSyncModal.tsx`
- `pages/jobs/ScheduleModal.tsx`
- `pages/jobs/constants.ts`
- `pages/jobs/helpers.ts`
- `pages/jobs/icons.tsx`
- `pages/Analytics.tsx`
- `types/analytics.types.ts`
- `types/candidate.types.ts`
- `types/job.types.ts`

### Fichiers à supprimer
- `pages/Prospecting.tsx` — supprimé sur GitHub

### Fichiers ignorés (backend, non applicable)
- `server/` — Le projet Lovable utilise Supabase Edge Functions, pas un serveur Node
- `src/main.tsx`, `src/App.tsx` — Le point d'entrée est `FarmasoftApp.tsx` dans Lovable

## Plan d'exécution

1. **Télécharger tous les fichiers source** depuis GitHub via curl
2. **Adapter les imports** : les chemins relatifs du repo standalone (`../../store`, `../../api`) doivent rester cohérents dans `src/farmasoft/`
3. **Remplacer les fichiers existants** modifiés (api/client.ts, Sidebar, TopBar, pages, i18n, store)
4. **Ajouter les nouveaux fichiers** (pages/jobs/*, types/*, Analytics)
5. **Supprimer Prospecting.tsx**
6. **Mettre à jour FarmasoftApp.tsx** pour refléter les nouvelles pages (retirer prospecting/interviews/messages/settings des routes si le nouveau App.tsx ne les a plus)
7. **Adapter le CSS** : fusionner `index.css` du repo avec `farmasoft.css` existant
8. **Corriger les imports spécifiques Lovable** (supabase client, useAuth, react-router) qui n'existent pas dans le repo standalone
9. **Vérifier la compilation** et corriger les erreurs TypeScript

## Note technique

Le Sidebar du repo GitHub importe des APIs messaging (Telegram, WhatsApp, Viber) et robota.ua qui passent par un backend Node.js (`server/`). Ces appels API devront pointer vers l'Edge Function `farmasoft-api` existante, ou être adaptés si les endpoints n'existent pas encore côté backend.
