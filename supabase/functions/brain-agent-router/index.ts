import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RouterRequest {
  query: string;
}

interface DataRequirement {
  needs_data: boolean;
  tables: string[];
  filters: Record<string, any>;
  limit: number;
  fields: string[];
  reason: string;
}

// Keyword-based routing (fast, no external API calls)
const TABLE_KEYWORDS: Record<string, string[]> = {
  workflows: ['workflow', 'automatisation', 'automation', 'flux', 'flow', 'processus'],
  sales_deals: ['deal', 'opportunité', 'vente', 'sales', 'pipeline', 'prospect', 'client potentiel'],
  candidates: ['candidat', 'recrutement', 'cv', 'profil', 'talent', 'embauche'],
  employees: ['employé', 'salarié', 'collaborateur', 'équipe', 'team', 'staff', 'rh', 'ressources humaines'],
  support_tickets: ['ticket', 'support', 'problème', 'incident', 'demande', 'réclamation'],
  aether_documents: ['document', 'fichier', 'doc', 'pdf', 'rapport', 'contrat'],
  compliance_alerts: ['conformité', 'compliance', 'alerte', 'risque', 'audit', 'rgpd', 'gdpr'],
  esg_kpis: ['esg', 'kpi', 'environnement', 'social', 'gouvernance', 'durabilité', 'carbone'],
  enriched_companies: ['entreprise enrichie', 'société enrichie', 'fiche entreprise'],
  crm_contacts: ['contact', 'crm', 'relation client'],
  crm_companies: ['société crm', 'entreprise crm', 'compte crm'],
  conversations: ['conversation', 'historique', 'discussion', 'échange'],
  sales_proposals: ['proposition', 'devis', 'offre commerciale', 'proposal'],
  call_analyses: ['appel', 'call', 'analyse appel', 'transcription'],
  user_api_keys: ['clé api', 'api key', 'clés api', 'api keys', 'token', 'secret', 'intégration'],
  subscriptions: ['abonnement', 'subscription', 'plan', 'forfait', 'facturation'],
  job_descriptions: ['offre emploi', 'poste', 'job', 'annonce', 'recrutement']
};

const GENERAL_KEYWORDS = [
  'combien', 'statistique', 'résumé', 'overview', 'dashboard', 'tableau de bord',
  'tout', 'global', 'plateforme', 'activité', 'vue', 'état', 'bilan'
];

function detectTables(query: string): string[] {
  const queryLower = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const detectedTables: string[] = [];

  for (const [table, keywords] of Object.entries(TABLE_KEYWORDS)) {
    for (const keyword of keywords) {
      const keywordNorm = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (queryLower.includes(keywordNorm)) {
        if (!detectedTables.includes(table)) {
          detectedTables.push(table);
        }
        break;
      }
    }
  }

  return detectedTables;
}

function isGeneralQuestion(query: string): boolean {
  const queryLower = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return GENERAL_KEYWORDS.some(kw => {
    const kwNorm = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return queryLower.includes(kwNorm);
  });
}

function needsData(query: string): boolean {
  const queryLower = query.toLowerCase();
  const dataKeywords = [
    'combien', 'liste', 'montre', 'affiche', 'quels', 'quelles',
    'mes', 'mon', 'ma', 'j\'ai', 'ai-je', 'nombre', 'total',
    'dernier', 'récent', 'actif', 'status', 'état'
  ];
  return dataKeywords.some(kw => queryLower.includes(kw));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json() as RouterRequest;

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Agent Router analyzing: "${query.slice(0, 80)}..."`);

    // Fast local detection - no external API calls
    const detectedTables = detectTables(query);
    const isGeneral = isGeneralQuestion(query);
    const requiresData = needsData(query) || detectedTables.length > 0 || isGeneral;

    let tables: string[] = [];
    
    if (detectedTables.length > 0) {
      tables = detectedTables;
    } else if (isGeneral || requiresData) {
      tables = ['general'];
    }

    const result: DataRequirement = {
      needs_data: requiresData,
      tables,
      filters: {},
      limit: 5,
      fields: [],
      reason: detectedTables.length > 0 
        ? `Tables détectées: ${detectedTables.join(', ')}`
        : isGeneral 
          ? 'Question générale - vue globale'
          : requiresData
            ? 'Question sur les données utilisateur'
            : 'Pas de données nécessaires'
    };

    console.log(`Router result: ${result.tables.join(', ') || 'no data'} - ${result.reason}`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in brain-agent-router:', error);
    return new Response(
      JSON.stringify({ 
        needs_data: false,
        tables: [],
        filters: {},
        limit: 5,
        fields: [],
        reason: 'Error - skipping data fetch'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
