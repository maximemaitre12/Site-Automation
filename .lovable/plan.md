
# Plan: Refonte Complète du Dashboard - KPIs Temps Economisé

## Objectif
Reconstruire entièrement le Dashboard pour fournir une mesure précise et pertinente du temps économisé grâce à AETHER, avec des calculs basés uniquement sur les données réelles de la base de données.

## Principe Fondamental: ZERO Fausses Données
- Tous les chiffres proviennent exclusivement des tables Supabase
- Aucune donnée mockée ou simulée
- Si pas de données = affichage "0" avec message explicatif

## Sources de Données Réelles

| Hook | Table | Comptage |
|------|-------|----------|
| `useWorkflowRuns` | `workflow_runs` | Nombre d'exécutions |
| `useAetherDocs` | `aether_documents` | Docs avec `ai_summary` (générés) + docs avec `ai_keywords` (analysés) |
| `useSalesProposals` | `proposals`, `call_analyses` | Propositions + appels analysés |
| `useNegotiationSheets` | `negotiation_sheets` | Fiches créées |
| `useSupport` | `support_tickets` | Tickets avec status "resolved" |
| `useCompliance` | `audits` | Audits complétés |
| `useHR` | `candidates` | Candidats avec CV analysé |
| `useInterviews` | `candidate_interviews` | Entretiens avec `ai_report` |
| `useBrain` | `conversations` | Conversations IA |

## Estimations de Temps (Benchmark Sectoriels)

| Action | Temps Manuel | Justification |
|--------|--------------|---------------|
| Workflow exécuté | 15 min | Automatisation de tâches répétitives |
| Document généré IA | 45 min | Rédaction structurée complète |
| Document analysé | 20 min | Extraction mots-clés + résumé |
| Proposition commerciale | 60 min | Recherche + personnalisation |
| Appel analysé | 30 min | Réécoute + synthèse |
| Fiche négociation | 50 min | Préparation argumentaire |
| Ticket résolu IA | 25 min | Classification + réponse |
| Audit compliance | 120 min | Analyse réglementaire |
| CV analysé | 35 min | Lecture + scoring |
| Entretien analysé | 40 min | Rapport + recommandations |
| Conversation Brain | 10 min | Recherche info + formulation |

## Structure du Dashboard

```text
┌─────────────────────────────────────────────────────────┐
│  Header: Bonjour, [Nom]    [Semaine] [Mois] [Total]     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────┐  ┌─────────────────┐   │
│  │  TEMPS ECONOMISE            │  │ Actions: X      │   │
│  │  XX heures                  │  ├─────────────────┤   │
│  │  = X.X jours de travail     │  │ Valeur: X€      │   │
│  │  +XX min/jour en moyenne    │  └─────────────────┘   │
│  └─────────────────────────────┘                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  EVOLUTION SUR 7 JOURS                                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  [AreaChart avec gradient - données réelles]      │  │
│  └───────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  PAR OUTIL                                              │
│  ┌─────────────────────────────────────────────────┐    │
│  │ AETHER Flow      ██████████████░░ 2h30  (10)    │    │
│  │ AETHER Doc       █████████░░░░░░░ 1h45  (7)     │    │
│  │ Sales Copilot    ███████░░░░░░░░░ 1h20  (5)     │    │
│  │ ...                                              │    │
│  └─────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│  ACCES RAPIDE AUX OUTILS                                │
│  [Flow] [Doc] [Sales] [HR] [Support] [Brain] [Compliance]│
├─────────────────────────────────────────────────────────┤
│  ℹ️ Méthodologie: Explication des calculs               │
└─────────────────────────────────────────────────────────┘
```

## Logique de Calcul

```typescript
// Filtrage par période (données réelles uniquement)
const filterByPeriod = (data, period) => {
  if (!data?.length) return [];
  if (period === 'all') return data;
  
  const startDate = period === 'week' 
    ? startOfWeek(now) 
    : startOfMonth(now);
  
  return data.filter(item => 
    new Date(item.created_at) >= startDate
  );
};

// Calcul temps par outil (basé sur comptage réel)
const timeSavedByTool = useMemo(() => {
  const filtered = {
    workflows: filterByPeriod(workflowRuns),
    docs: filterByPeriod(aetherDocs),
    // ... autres sources
  };
  
  return [
    {
      name: "AETHER Flow",
      minutes: filtered.workflows.length * 15,
      actions: filtered.workflows.length,
    },
    // ... autres outils
  ].sort((a, b) => b.minutes - a.minutes);
}, [workflowRuns, aetherDocs, /* dépendances */]);
```

## Valeur Economisée

```text
Valeur = Heures × 85€/h (taux consultant moyen)
```

## Fichier Modifié

| Fichier | Action |
|---------|--------|
| `src/pages/Dashboard.tsx` | Réécriture complète avec données réelles |

## Garanties

- Aucun `Math.random()` ou donnée simulée
- Affichage "0" si pas de données (pas de placeholder)
- Message explicatif si base vide
- Tous les chiffres traçables vers les tables Supabase
