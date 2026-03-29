

# Intégration Farmasoft sur `/farmasoft` — Plan

## Ce qui est faisable vs ce qui ne l'est pas

**Le frontend** du repo V1F26 utilise React + CSS pur (pas de Tailwind) avec un système de navigation interne via Zustand (`useAppStore` avec `currentPage`). Il fait des appels API vers `/api/*` (chemin relatif). Ce frontend peut être porté **presque tel quel** dans votre projet Lovable.

**Le backend** utilise Express + SQLite avec 9 routes API. Il faut le recréer avec les outils Lovable Cloud (tables + edge functions). Cela remplacera le serveur Express sans toucher au frontend.

**Le scraping** (work.ua, robota.ua, etc.) **ne fonctionnera PAS** — les edge functions ne peuvent pas faire de web scraping avec Cheerio/HTML parsing sur des sites tiers. La fonctionnalité de prospection/recherche sera limitée.

## Ce qui change dans le frontend

Seul **1 fichier** sera modifié : `src/api/client.ts`. Au lieu d'appeler `/api/jobs`, il appellera les edge functions Lovable Cloud. Le design, les composants, les styles CSS — tout reste identique.

## Plan d'exécution

### 1. Base de données (migration SQL)
Créer les tables Farmasoft dans Lovable Cloud :
- `farmasoft_jobs` (id, title, location, salary_min, salary_max, salary_currency, experience_years, skills, description, requirements, is_active, created_at, updated_at)
- `farmasoft_candidates` (id, job_id, initials, role, location, experience_years, experience_text, salary_expectation, source_platform, profile_url, tags, profile_data, status, source_type, stage, qualification_score, qualification_notes, cv_filename, cv_text, rejection_reason, decision, viewed_at, contacted_at, created_at)
- `farmasoft_interviews` (id, candidate_id, job_id, scheduled_at, type, interviewer, notes, decision, created_at, updated_at)
- `farmasoft_messages` (id, job_id, name, subject, body, language, ai_generated, created_at, updated_at)
- `farmasoft_settings` (key, value)
- `farmasoft_events` (id, type, job_id, candidate_id, metadata, created_at)
- `farmasoft_searches` (id, job_id, location, radius_km, salary_min, platforms, candidates_found, created_at)

### 2. Edge function : `farmasoft-api`
Une seule edge function qui dispatche selon le chemin et la méthode HTTP. Reproduit exactement la même API que le serveur Express :
- CRUD jobs, candidates, interviews, messages, settings
- Analytics (kpis, weekly, recent, log)
- AI (generate-job, generate-message, qualify-candidate) via Lovable AI
- CV parsing via Lovable AI
- **Scraper : retournera une erreur "non disponible en mode cloud"**

### 3. Frontend — Fichiers copiés tels quels depuis le repo
Tous les fichiers frontend sont copiés **sans modification de design** :
- `src/farmasoft/App.tsx`
- `src/farmasoft/pages/Dashboard.tsx`
- `src/farmasoft/pages/JobDescriptions.tsx`
- `src/farmasoft/pages/Prospecting.tsx`
- `src/farmasoft/pages/Interviews.tsx`
- `src/farmasoft/pages/Messages.tsx`
- `src/farmasoft/pages/Settings.tsx`
- `src/farmasoft/components/layout/Sidebar.tsx`
- `src/farmasoft/components/layout/TopBar.tsx`
- `src/farmasoft/components/SetupModal.tsx`
- `src/farmasoft/store/useAppStore.ts`
- `src/farmasoft/hooks/useDebounce.ts`
- `src/farmasoft/i18n.ts`
- `src/farmasoft/types/*`
- `src/farmasoft/lib/utils.ts`

### 4. Seule modification frontend : `src/farmasoft/api/client.ts`
Le `BASE` passe de `/api` à un appel vers l'edge function `farmasoft-api`. La structure des requêtes et réponses reste identique (`{ data, error }`).

### 5. CSS
Le fichier `index.css` de Farmasoft est copié en `src/farmasoft/farmasoft.css` et importé localement. Toutes les classes CSS sont scopées via le conteneur `.farmasoft-app` pour éviter les conflits avec le CSS du site principal.

### 6. Route `/farmasoft`
Ajout d'une route dans `App.tsx` qui monte le composant Farmasoft.

## Limitations honnêtes

| Fonctionnalité | Statut |
|---|---|
| Dashboard, KPIs, graphiques | Fonctionnel |
| CRUD Jobs / Candidates / Interviews / Messages | Fonctionnel |
| AI : génération fiches de poste | Fonctionnel (via Lovable AI) |
| AI : génération messages | Fonctionnel (via Lovable AI) |
| AI : qualification candidats | Fonctionnel (via Lovable AI) |
| CV parsing | Fonctionnel (via Lovable AI) |
| **Web scraping (work.ua, robota.ua, etc.)** | **NON fonctionnel** |
| Settings (clé API Gemini) | Non nécessaire (Lovable AI utilisé) |
| i18n (FR/EN/UK) | Fonctionnel |

**Le design ne sera pas impacté.** Le scraping est la seule fonctionnalité qui ne marchera pas.

