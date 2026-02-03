import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface FetchRequest {
  tables: string[];
  filters?: Record<string, any>;
  limit?: number;
  fields?: string[];
  query?: string;
  // Backward-compatible (ignored for security)
  userId?: string;
  companyId?: string;
}

interface TableResult {
  total: number;
  sample: string[];
  raw: any[];
  error?: string;
  meta?: Record<string, any>;
}

type OwnerScope = 'user' | 'company' | 'either';

interface TableConfig {
  label: string;
  scope: OwnerScope;
  select: string;
  orderBy?: string;
  allowedFilters?: string[];
  format: (row: any) => string;
}

const TABLE_CONFIGS: Record<string, TableConfig> = {
  workflows: {
    label: 'WORKFLOWS AETHER FLOW',
    scope: 'user',
    select: 'id, name, description, is_active, created_at, updated_at',
    orderBy: 'updated_at',
    allowedFilters: ['is_active'],
    format: (w) => {
      const status = w.is_active ? 'Actif' : 'Inactif';
      const desc = w.description ? ` | ${truncate(w.description, 60)}` : '';
      return `"${w.name || 'Sans nom'}" (${status})${desc}`;
    },
  },

  sales_deals: {
    label: 'DEALS COMMERCIAUX',
    scope: 'company',
    select: 'id, title, value, status, probability, contact_name, expected_close_date, created_at',
    orderBy: 'created_at',
    allowedFilters: ['status'],
    format: (d) => {
      const value = formatCurrency(d.value);
      const prob = typeof d.probability === 'number' ? `${d.probability}%` : 'n/a';
      return `"${d.title || 'Sans titre'}" (${d.status || 'n/a'}, valeur ${value}, prob ${prob})`;
    },
  },

  candidates: {
    label: 'CANDIDATS RH',
    scope: 'company',
    select: 'id, name, status, match_score, experience_years, created_at',
    orderBy: 'created_at',
    allowedFilters: ['status'],
    format: (c) => {
      const score = typeof c.match_score === 'number' ? `${c.match_score}%` : 'n/a';
      const exp = c.experience_years ? `${c.experience_years} ans exp.` : '';
      return `${c.name || 'Sans nom'} (${c.status || 'n/a'}, score ${score}${exp ? `, ${exp}` : ''})`;
    },
  },

  employees: {
    label: 'EMPLOYÉS',
    scope: 'company',
    select: 'id, name, job_title, department, is_active, hire_date, created_at',
    orderBy: 'created_at',
    allowedFilters: ['is_active', 'department'],
    format: (e) => {
      const active = e.is_active === false ? 'Inactif' : 'Actif';
      return `${e.name || 'Sans nom'} (${e.job_title || 'Poste n/a'}${e.department ? `, ${e.department}` : ''}, ${active})`;
    },
  },

  support_tickets: {
    label: 'TICKETS SUPPORT',
    scope: 'user',
    select: 'id, ticket_number, subject, status, priority, category, created_at',
    orderBy: 'created_at',
    allowedFilters: ['status', 'priority', 'category'],
    format: (t) => {
      const num = t.ticket_number ? `#${t.ticket_number}` : 'Ticket';
      return `${num} "${truncate(t.subject, 60)}" (${t.priority || 'n/a'}, ${t.status || 'n/a'}${t.category ? `, ${t.category}` : ''})`;
    },
  },

  aether_documents: {
    label: 'DOCUMENTS',
    scope: 'either',
    select: 'id, title, file_type, ai_summary, created_at',
    orderBy: 'created_at',
    allowedFilters: ['file_type'],
    format: (d) => {
      const type = d.file_type || 'doc';
      const summary = d.ai_summary ? ` | Résumé: ${truncate(d.ai_summary, 80)}` : '';
      return `"${truncate(d.title, 60)}" (${type})${summary}`;
    },
  },

  compliance_alerts: {
    label: 'ALERTES CONFORMITÉ',
    scope: 'company',
    select: 'id, title, severity, is_resolved, alert_type, created_at',
    orderBy: 'created_at',
    allowedFilters: ['severity', 'is_resolved', 'alert_type'],
    format: (a) => {
      const state = a.is_resolved ? 'Résolu' : 'Actif';
      return `"${truncate(a.title, 60)}" (${a.severity || 'n/a'}, ${state}${a.alert_type ? `, ${a.alert_type}` : ''})`;
    },
  },

  esg_kpis: {
    label: 'KPIS ESG',
    scope: 'company',
    select: 'id, name, category, value, unit, target_value, status, created_at',
    orderBy: 'created_at',
    allowedFilters: ['category', 'status'],
    format: (k) => {
      const val = k.value !== null && k.value !== undefined ? `${k.value}${k.unit || ''}` : 'n/a';
      const target = k.target_value !== null && k.target_value !== undefined ? `${k.target_value}${k.unit || ''}` : 'n/a';
      return `${k.name || 'Sans nom'} (${k.category || 'n/a'}): ${val} (cible ${target}, ${k.status || 'n/a'})`;
    },
  },

  enriched_companies: {
    label: 'ENTREPRISES ENRICHIES',
    scope: 'user',
    select: 'id, name, sector, revenue, employee_count, financial_health_score, created_at',
    orderBy: 'created_at',
    allowedFilters: ['sector'],
    format: (c) => {
      return `"${c.name || 'Sans nom'}" (${c.sector || 'Secteur n/a'}, CA ${formatCurrency(c.revenue)}, santé ${c.financial_health_score ?? 'n/a'})`;
    },
  },

  crm_contacts: {
    label: 'CONTACTS CRM',
    scope: 'user',
    select: 'id, first_name, last_name, email, job_title, engagement_score, created_at',
    orderBy: 'created_at',
    allowedFilters: ['job_title'],
    format: (c) => {
      const name = `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Sans nom';
      return `${name} (${c.job_title || 'Poste n/a'}, engagement ${c.engagement_score ?? 0})`;
    },
  },

  crm_companies: {
    label: 'SOCIÉTÉS CRM',
    scope: 'user',
    select: 'id, name, industry, annual_revenue, employees_count, created_at',
    orderBy: 'created_at',
    allowedFilters: ['industry'],
    format: (c) => {
      return `"${c.name || 'Sans nom'}" (${c.industry || 'Industrie n/a'}, CA ${formatCurrency(c.annual_revenue)})`;
    },
  },

  conversations: {
    label: 'CONVERSATIONS BRAIN',
    scope: 'user',
    select: 'id, title, updated_at',
    orderBy: 'updated_at',
    format: (c) => `"${truncate(c.title, 60)}" (maj ${formatDate(c.updated_at)})`,
  },

  sales_proposals: {
    label: 'PROPOSITIONS COMMERCIALES',
    scope: 'company',
    select: 'id, title, status, total_amount, created_at',
    orderBy: 'created_at',
    allowedFilters: ['status'],
    format: (p) => `"${truncate(p.title, 60)}" (${p.status || 'n/a'}, total ${formatCurrency(p.total_amount)})`,
  },

  call_analyses: {
    label: 'ANALYSES D\'APPELS',
    scope: 'user',
    select: 'id, title, sentiment, created_at',
    orderBy: 'created_at',
    allowedFilters: ['sentiment'],
    format: (c) => `"${truncate(c.title, 60)}" (sentiment ${c.sentiment || 'n/a'})`,
  },

  job_descriptions: {
    label: 'OFFRES D\'EMPLOI',
    scope: 'company',
    select: 'id, title, department, status, location, created_at',
    orderBy: 'created_at',
    allowedFilters: ['status', 'department'],
    format: (j) => `"${truncate(j.title, 60)}" (${j.status || 'n/a'}${j.department ? `, ${j.department}` : ''}${j.location ? `, ${j.location}` : ''})`,
  },

  user_api_keys: {
    label: 'CLÉS API CONFIGURÉES',
    scope: 'user',
    select: 'id, service_name, created_at, updated_at',
    orderBy: 'created_at',
    format: (k) => `${k.service_name || 'Service n/a'} (ajouté le ${formatDate(k.created_at)})`,
  },

  subscriptions: {
    label: 'ABONNEMENT',
    scope: 'user',
    select: 'id, status, plan_name, price_monthly, created_at',
    orderBy: 'created_at',
    allowedFilters: ['status', 'plan_name'],
    format: (s) => `Plan ${s.plan_name || 'n/a'} (${s.status || 'n/a'}, ${formatCurrency(s.price_monthly)} par mois)`,
  },
};

/**
 * Brain Targeted Data Fetcher - Robust version with correct column names
 * Fetches real-time data from the database based on the router's instructions
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json() as FetchRequest;
    const { tables, filters = {}, limit = 5 } = body;

    if (!tables || tables.length === 0) {
      return new Response(
        JSON.stringify({ error: 'tables are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing backend configuration');
    }

    // Use the user session (RLS enforced). Never trust userId/companyId from body.
    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Auth failed in brain-fetch-targeted:', userError?.message || 'no user');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;
    const companyId = await getCompanyId(supabase, userId);

    console.log(`Brain Fetch: tables=${tables.join(',')}, userId=${userId.slice(0, 8)}..., companyId=${companyId ? companyId.slice(0, 8) : 'null'}`);

    const results: Record<string, TableResult> = {};

    // ============================================
    // TABLE CONFIGURATIONS WITH REAL COLUMN NAMES
    // ============================================
    
    for (const tableName of tables) {
      try {
        if (tableName === 'general') {
          results['overview'] = await fetchOverview(supabase, userId, companyId);
          continue;
        }

        const result = await fetchTable(supabase, tableName, userId, companyId, limit, filters);
        if (result) {
          results[tableName] = result;
        }
      } catch (err) {
        console.error(`Error processing table ${tableName}:`, err);
      }
    }

    // Build context text for AI
    const contextText = buildContextText(results);

    console.log(`Brain Fetch complete: ${Object.keys(results).length} tables, ${contextText.length} chars`);

    return new Response(
      JSON.stringify({ 
        data: results,
        contextText,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in brain-fetch-targeted:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Fetch data from a specific table with correct column names
 */
async function fetchTable(
  supabase: any, 
  tableName: string, 
  userId: string, 
  companyId: string | null, 
  limit: number,
  filters: Record<string, any>
): Promise<TableResult | null> {

  const config = TABLE_CONFIGS[tableName];
  if (!config) {
    console.log(`Unknown table: ${tableName}, skipping`);
    return null;
  }

  const { ownerFilter, ownerFilterLabel, ownerAvailable } = buildOwnerFilter(config.scope, userId, companyId);
  if (!ownerAvailable) {
    return {
      total: 0,
      sample: [],
      raw: [],
      error: `${ownerFilterLabel} indisponible pour cette session`,
    };
  }

  const safeFilters = pickAllowedFilters(filters, config.allowedFilters);

  // 1) Exact count (essential)
  const total = await safeCount(supabase, tableName, ownerFilter, safeFilters);

  // 2) Minimal sample (essential)
  const { rows, listError } = await safeList(supabase, tableName, config, ownerFilter, safeFilters, limit);

  const sample = (rows || []).slice(0, Math.max(0, limit)).map((r) => config.format(r));

  const result: TableResult = {
    total,
    sample,
    raw: rows || [],
  };

  if (listError) {
    result.error = listError;
  }

  // Extra meta (still essential for “combien” questions)
  if (tableName === 'workflows') {
    const meta: Record<string, any> = {};
    try {
      const active = await safeCount(
        supabase,
        tableName,
        ownerFilter,
        { ...safeFilters, is_active: true }
      );
      const inactive = await safeCount(
        supabase,
        tableName,
        ownerFilter,
        { ...safeFilters, is_active: false }
      );
      meta.actifs = active;
      meta.inactifs = inactive;
    } catch {
      // ignore
    }
    result.meta = meta;
  }

  return result;
}

/**
 * Fetch overview counts for general questions
 */
async function fetchOverview(supabase: any, userId: string, companyId: string | null): Promise<TableResult> {
  const hasCompany = !!companyId;
  const cId = companyId || '';

  const counts: Record<string, number> = {
    workflows: 0,
    deals: 0,
    candidates: 0,
    employees: 0,
    tickets: 0,
    documents: 0,
    alerts: 0,
    api_keys: 0,
    conversations: 0,
  };

  // Keep this lightweight: count-only queries, parallel
  await Promise.all([
    safeCount(supabase, 'workflows', { type: 'eq', field: 'user_id', value: userId }, {}),
    hasCompany ? safeCount(supabase, 'sales_deals', { type: 'eq', field: 'company_id', value: cId }, {}) : Promise.resolve(0),
    hasCompany ? safeCount(supabase, 'candidates', { type: 'eq', field: 'company_id', value: cId }, {}) : Promise.resolve(0),
    hasCompany ? safeCount(supabase, 'employees', { type: 'eq', field: 'company_id', value: cId }, {}) : Promise.resolve(0),
    safeCount(supabase, 'support_tickets', { type: 'eq', field: 'user_id', value: userId }, {}),
    hasCompany
      ? safeCount(supabase, 'aether_documents', { type: 'or', expression: `company_id.eq.${cId},user_id.eq.${userId}` }, {})
      : safeCount(supabase, 'aether_documents', { type: 'eq', field: 'user_id', value: userId }, {}),
    hasCompany ? safeCount(supabase, 'compliance_alerts', { type: 'eq', field: 'company_id', value: cId }, {}) : Promise.resolve(0),
    safeCount(supabase, 'user_api_keys', { type: 'eq', field: 'user_id', value: userId }, {}),
    safeCount(supabase, 'conversations', { type: 'eq', field: 'user_id', value: userId }, {}),
  ]).then(([workflows, deals, candidates, employees, tickets, documents, alerts, api_keys, conversations]) => {
    counts.workflows = workflows;
    counts.deals = deals;
    counts.candidates = candidates;
    counts.employees = employees;
    counts.tickets = tickets;
    counts.documents = documents;
    counts.alerts = alerts;
    counts.api_keys = api_keys;
    counts.conversations = conversations;
  });

  const summaryLines = [
    'VUE GLOBALE DE VOS DONNÉES',
    `1) Workflows AETHER Flow: ${counts.workflows}`,
    `2) Deals commerciaux: ${counts.deals}`,
    `3) Candidats RH: ${counts.candidates}`,
    `4) Employés: ${counts.employees}`,
    `5) Tickets support: ${counts.tickets}`,
    `6) Documents: ${counts.documents}`,
    `7) Alertes conformité: ${counts.alerts}`,
    `8) Clés API configurées: ${counts.api_keys}`,
    `9) Conversations Brain: ${counts.conversations}`,
  ];

  return {
    total: summaryLines.length,
    sample: [summaryLines.join('\n')],
    raw: [counts],
  };
}

/**
 * Build human-readable context text from results
 */
function buildContextText(results: Record<string, TableResult>): string {
  const lines: string[] = [];

  for (const [tableName, data] of Object.entries(results)) {
    const label = tableName === 'overview'
      ? 'VUE GLOBALE'
      : (TABLE_CONFIGS[tableName]?.label || tableName.toUpperCase());
    
    if (tableName === 'overview') {
      lines.push(data.sample?.[0] || 'VUE GLOBALE: indisponible');
    } else {
      lines.push(`\n[${label}]`);
      lines.push(`Total: ${data.total}`);

      if (data.meta && (data.meta.actifs !== undefined || data.meta.inactifs !== undefined)) {
        const actifs = data.meta.actifs ?? 'n/a';
        const inactifs = data.meta.inactifs ?? 'n/a';
        lines.push(`Détail: actifs ${actifs}, inactifs ${inactifs}`);
      }

      if (data.error) {
        lines.push(`Erreur: ${truncate(data.error, 160)}`);
      }

      if (data.total > 0 && data.sample.length > 0) {
        lines.push('Exemples récents:');
        data.sample.slice(0, 5).forEach((s, idx) => {
          lines.push(`${idx + 1}) ${truncate(s, 180)}`);
        });
      } else {
        lines.push('Aucun élément.');
      }
    }
  }

  return lines.join('\n');
}

// ============================================
// INTERNAL HELPERS (reliability + safety)
// ============================================

type OwnerFilter =
  | { type: 'eq'; field: 'user_id' | 'company_id'; value: string }
  | { type: 'or'; expression: string };

function buildOwnerFilter(scope: OwnerScope, userId: string, companyId: string | null): {
  ownerFilter: OwnerFilter;
  ownerFilterLabel: string;
  ownerAvailable: boolean;
} {
  if (scope === 'user') {
    return {
      ownerFilter: { type: 'eq', field: 'user_id', value: userId },
      ownerFilterLabel: 'user_id',
      ownerAvailable: true,
    };
  }

  if (scope === 'company') {
    return {
      ownerFilter: { type: 'eq', field: 'company_id', value: companyId || '' },
      ownerFilterLabel: 'company_id',
      ownerAvailable: !!companyId,
    };
  }

  // either
  if (companyId) {
    return {
      ownerFilter: { type: 'or', expression: `company_id.eq.${companyId},user_id.eq.${userId}` },
      ownerFilterLabel: 'company_id ou user_id',
      ownerAvailable: true,
    };
  }
  return {
    ownerFilter: { type: 'eq', field: 'user_id', value: userId },
    ownerFilterLabel: 'user_id',
    ownerAvailable: true,
  };
}

function pickAllowedFilters(filters: Record<string, any>, allowed?: string[]): Record<string, any> {
  if (!allowed || allowed.length === 0) return {};
  const out: Record<string, any> = {};
  for (const k of allowed) {
    if (filters[k] !== undefined && filters[k] !== null) out[k] = filters[k];
  }
  return out;
}

async function safeCount(
  supabase: any,
  table: string,
  owner: OwnerFilter,
  filters: Record<string, any>
): Promise<number> {
  try {
    let q = supabase.from(table).select('id', { count: 'exact', head: true });
    q = applyOwnerFilter(q, owner);
    q = applySafeFilters(q, filters);
    const { count, error } = await q;
    if (error) {
      console.error(`Count error on ${table}:`, error.message);
      return 0;
    }
    return count || 0;
  } catch (e) {
    console.error(`Count exception on ${table}:`, e);
    return 0;
  }
}

async function safeList(
  supabase: any,
  table: string,
  config: TableConfig,
  owner: OwnerFilter,
  filters: Record<string, any>,
  limit: number
): Promise<{ rows: any[] | null; listError: string | null }> {
  const selectCandidates = [
    config.select,
    'id, created_at',
    'id',
  ];
  const orderCandidates = [
    config.orderBy,
    'updated_at',
    'created_at',
    undefined,
  ].filter((v, i, a) => a.indexOf(v) === i);

  let lastError: string | null = null;

  for (const select of selectCandidates) {
    for (const orderBy of orderCandidates) {
      try {
        let q = supabase.from(table).select(select);
        q = applyOwnerFilter(q, owner);
        q = applySafeFilters(q, filters);
        if (orderBy) q = q.order(orderBy, { ascending: false });
        q = q.limit(limit);

        const { data, error } = await q;
        if (error) {
          lastError = error.message;
          // Try next fallback. Most common case: missing column (42703)
          continue;
        }
        return { rows: data || [], listError: null };
      } catch (e) {
        lastError = e instanceof Error ? e.message : 'Unknown list error';
      }
    }
  }

  return { rows: [], listError: lastError };
}

function applyOwnerFilter(q: any, owner: OwnerFilter) {
  if (owner.type === 'eq') return q.eq(owner.field, owner.value);
  return q.or(owner.expression);
}

function applySafeFilters(q: any, filters: Record<string, any>) {
  for (const [k, v] of Object.entries(filters)) {
    q = q.eq(k, v);
  }
  return q;
}

async function getCompanyId(supabase: any, userId: string): Promise<string | null> {
  // Prefer the stable SQL function
  try {
    const { data, error } = await supabase.rpc('get_user_company_id', { _user_id: userId });
    if (!error && data) return data as string;
  } catch {
    // ignore
  }

  // Fallback direct read
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('company_id')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) return null;
    return data?.company_id || null;
  } catch {
    return null;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatCurrency(value: number | null | undefined): string {
  if (!value) return '0€';
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M€`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k€`;
  return `${value}€`;
}

function truncate(str: string | null | undefined, maxLen: number): string {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen - 3) + '...' : str;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'n/a';
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return 'n/a';
  }
}
