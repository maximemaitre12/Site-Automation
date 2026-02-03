import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FetchRequest {
  userId: string;
  companyId: string;
  tables: string[];
  filters?: Record<string, any>;
  limit?: number;
  fields?: string[];
}

interface TableResult {
  count: number;
  items: string[];
  raw: any[];
}

/**
 * Brain Targeted Data Fetcher - Robust version with correct column names
 * Fetches real-time data from the database based on the router's instructions
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, companyId, tables, filters = {}, limit = 10 } = await req.json() as FetchRequest;

    if (!userId || !companyId || !tables || tables.length === 0) {
      return new Response(
        JSON.stringify({ error: 'userId, companyId and tables are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Brain Fetch: tables=${tables.join(',')}, userId=${userId.slice(0,8)}...`);

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
  companyId: string, 
  limit: number,
  filters: Record<string, any>
): Promise<TableResult | null> {
  
  // Define table configurations with REAL column names from the database
  const tableConfigs: Record<string, {
    ownerField: 'user_id' | 'company_id';
    selectFields: string;
    orderBy: string;
    formatFn: (item: any) => string;
  }> = {
    // FLOW - Workflows
    workflows: {
      ownerField: 'user_id',
      selectFields: 'id, name, description, is_active, created_at, updated_at',
      orderBy: 'updated_at',
      formatFn: (w) => `• "${w.name}" - ${w.is_active ? '✅ Actif' : '⏸️ Inactif'}${w.description ? ` | ${truncate(w.description, 50)}` : ''}`
    },
    
    // SALES - Deals
    sales_deals: {
      ownerField: 'company_id',
      selectFields: 'id, title, value, status, probability, contact_name, expected_close_date, created_at',
      orderBy: 'created_at',
      formatFn: (d) => `• "${d.title}" - ${formatCurrency(d.value)} (${d.status}, ${d.probability || 0}% prob.)${d.contact_name ? ` | Contact: ${d.contact_name}` : ''}`
    },
    
    // HR - Candidates
    candidates: {
      ownerField: 'company_id',
      selectFields: 'id, name, email, status, match_score, experience_years, created_at',
      orderBy: 'created_at',
      formatFn: (c) => `• ${c.name} - ${c.status} (Score: ${c.match_score || 0}%${c.experience_years ? `, ${c.experience_years} ans exp.` : ''})`
    },
    
    // HR - Employees
    employees: {
      ownerField: 'company_id',
      selectFields: 'id, name, email, job_title, department, is_active, hire_date, created_at',
      orderBy: 'created_at',
      formatFn: (e) => `• ${e.name} - ${e.job_title || 'Poste n/a'} (${e.department || 'Dept n/a'}) ${e.is_active ? '✅' : '❌'}`
    },
    
    // SUPPORT - Tickets
    support_tickets: {
      ownerField: 'user_id',
      selectFields: 'id, ticket_number, subject, status, priority, category, customer_email, created_at',
      orderBy: 'created_at',
      formatFn: (t) => `• #${t.ticket_number} "${truncate(t.subject, 40)}" - ${t.priority} / ${t.status}${t.category ? ` [${t.category}]` : ''}`
    },
    
    // DOC - Documents
    aether_documents: {
      ownerField: 'company_id',
      selectFields: 'id, title, file_type, ai_summary, created_at',
      orderBy: 'created_at',
      formatFn: (d) => `• "${truncate(d.title, 40)}" (${d.file_type || 'doc'})${d.ai_summary ? ` | Résumé: ${truncate(d.ai_summary, 60)}` : ''}`
    },
    
    // COMPLIANCE - Alerts
    compliance_alerts: {
      ownerField: 'company_id',
      selectFields: 'id, title, severity, is_resolved, alert_type, created_at',
      orderBy: 'created_at',
      formatFn: (a) => `• "${truncate(a.title, 40)}" - ${a.severity} (${a.is_resolved ? '✅ Résolu' : '⚠️ Actif'}) [${a.alert_type}]`
    },
    
    // COMPLIANCE - ESG KPIs
    esg_kpis: {
      ownerField: 'company_id',
      selectFields: 'id, name, category, value, unit, target_value, status, created_at',
      orderBy: 'created_at',
      formatFn: (k) => `• ${k.name}: ${k.value}${k.unit || ''} (Cible: ${k.target_value || 'n/a'}) - ${k.status || 'n/a'}`
    },
    
    // DATA - Enriched Companies
    enriched_companies: {
      ownerField: 'user_id',
      selectFields: 'id, name, sector, revenue, employee_count, financial_health_score, created_at',
      orderBy: 'created_at',
      formatFn: (c) => `• "${c.name}" - ${c.sector || 'Secteur n/a'} | CA: ${formatCurrency(c.revenue)} | Santé: ${c.financial_health_score || 'n/a'}`
    },
    
    // DATA - CRM Contacts
    crm_contacts: {
      ownerField: 'user_id',
      selectFields: 'id, first_name, last_name, email, job_title, engagement_score, created_at',
      orderBy: 'created_at',
      formatFn: (c) => `• ${c.first_name} ${c.last_name} - ${c.job_title || 'Poste n/a'} (Engagement: ${c.engagement_score || 0})`
    },
    
    // DATA - CRM Companies
    crm_companies: {
      ownerField: 'user_id',
      selectFields: 'id, name, industry, annual_revenue, employees_count, created_at',
      orderBy: 'created_at',
      formatFn: (c) => `• "${c.name}" - ${c.industry || 'Industrie n/a'} | CA: ${formatCurrency(c.annual_revenue)}`
    },
    
    // BRAIN - Conversations
    conversations: {
      ownerField: 'user_id',
      selectFields: 'id, title, updated_at',
      orderBy: 'updated_at',
      formatFn: (c) => `• "${truncate(c.title, 40)}" (${formatDate(c.updated_at)})`
    },
    
    // SALES - Proposals
    sales_proposals: {
      ownerField: 'company_id',
      selectFields: 'id, title, status, total_amount, created_at',
      orderBy: 'created_at',
      formatFn: (p) => `• "${truncate(p.title, 40)}" - ${formatCurrency(p.total_amount)} (${p.status})`
    },
    
    // SALES - Call Analyses
    call_analyses: {
      ownerField: 'user_id',
      selectFields: 'id, title, sentiment, summary, created_at',
      orderBy: 'created_at',
      formatFn: (c) => `• "${truncate(c.title, 40)}" - Sentiment: ${c.sentiment || 'n/a'}`
    },
    
    // HR - Job Descriptions
    job_descriptions: {
      ownerField: 'company_id',
      selectFields: 'id, title, department, status, location, created_at',
      orderBy: 'created_at',
      formatFn: (j) => `• "${j.title}" - ${j.department || 'Dept n/a'} (${j.status}) ${j.location ? `@ ${j.location}` : ''}`
    },
    
    // SYSTEM - User API Keys
    user_api_keys: {
      ownerField: 'user_id',
      selectFields: 'id, service_name, created_at, updated_at',
      orderBy: 'created_at',
      formatFn: (k) => `• ${k.service_name} (ajouté le ${formatDate(k.created_at)})`
    },
    
    // SYSTEM - Subscriptions
    subscriptions: {
      ownerField: 'user_id',
      selectFields: 'id, status, plan_name, price_monthly, created_at',
      orderBy: 'created_at',
      formatFn: (s) => `• Plan ${s.plan_name || 'n/a'} - ${s.status} (${s.price_monthly || 0}€/mois)`
    }
  };

  const config = tableConfigs[tableName];
  if (!config) {
    console.log(`Unknown table: ${tableName}, skipping`);
    return null;
  }

  const ownerValue = config.ownerField === 'user_id' ? userId : companyId;

  let query = supabase
    .from(tableName)
    .select(config.selectFields)
    .eq(config.ownerField, ownerValue)
    .order(config.orderBy, { ascending: false })
    .limit(limit);

  // Apply additional filters if provided
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      query = query.eq(key, value);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching ${tableName}:`, error.message);
    // Return empty result instead of null to show "0 items"
    return { count: 0, items: [`Erreur de récupération: ${error.message}`], raw: [] };
  }

  const items = data || [];
  const formattedItems = items.map(config.formatFn);

  return {
    count: items.length,
    items: formattedItems,
    raw: items
  };
}

/**
 * Fetch overview counts for general questions
 */
async function fetchOverview(supabase: any, userId: string, companyId: string): Promise<TableResult> {
  const counts: Record<string, number> = {};
  
  const queries = [
    { name: 'workflows', table: 'workflows', field: 'user_id', value: userId },
    { name: 'deals', table: 'sales_deals', field: 'company_id', value: companyId },
    { name: 'candidates', table: 'candidates', field: 'company_id', value: companyId },
    { name: 'employees', table: 'employees', field: 'company_id', value: companyId },
    { name: 'tickets', table: 'support_tickets', field: 'user_id', value: userId },
    { name: 'documents', table: 'aether_documents', field: 'company_id', value: companyId },
    { name: 'alerts', table: 'compliance_alerts', field: 'company_id', value: companyId },
    { name: 'api_keys', table: 'user_api_keys', field: 'user_id', value: userId },
    { name: 'conversations', table: 'conversations', field: 'user_id', value: userId },
  ];

  await Promise.all(queries.map(async (q) => {
    try {
      const { count, error } = await supabase
        .from(q.table)
        .select('id', { count: 'exact', head: true })
        .eq(q.field, q.value);
      
      counts[q.name] = error ? 0 : (count || 0);
    } catch {
      counts[q.name] = 0;
    }
  }));

  const summary = `VUE GLOBALE DE VOS DONNÉES:
• Workflows AETHER Flow: ${counts.workflows}
• Deals commerciaux: ${counts.deals}
• Candidats RH: ${counts.candidates}
• Employés: ${counts.employees}
• Tickets support: ${counts.tickets}
• Documents: ${counts.documents}
• Alertes conformité: ${counts.alerts}
• Clés API configurées: ${counts.api_keys}
• Conversations Brain: ${counts.conversations}`;

  return {
    count: Object.keys(counts).length,
    items: [summary],
    raw: [counts]
  };
}

/**
 * Build human-readable context text from results
 */
function buildContextText(results: Record<string, TableResult>): string {
  const lines: string[] = [];

  const tableLabels: Record<string, string> = {
    overview: 'VUE GLOBALE',
    workflows: 'WORKFLOWS AETHER FLOW',
    sales_deals: 'DEALS COMMERCIAUX',
    candidates: 'CANDIDATS RH',
    employees: 'EMPLOYÉS',
    support_tickets: 'TICKETS SUPPORT',
    aether_documents: 'DOCUMENTS',
    compliance_alerts: 'ALERTES CONFORMITÉ',
    esg_kpis: 'KPIs ESG',
    enriched_companies: 'ENTREPRISES ENRICHIES',
    crm_contacts: 'CONTACTS CRM',
    crm_companies: 'SOCIÉTÉS CRM',
    conversations: 'CONVERSATIONS BRAIN',
    sales_proposals: 'PROPOSITIONS COMMERCIALES',
    call_analyses: 'ANALYSES D\'APPELS',
    job_descriptions: 'OFFRES D\'EMPLOI',
    user_api_keys: 'CLÉS API CONFIGURÉES',
    subscriptions: 'ABONNEMENT'
  };

  for (const [tableName, data] of Object.entries(results)) {
    const label = tableLabels[tableName] || tableName.toUpperCase();
    
    if (tableName === 'overview') {
      lines.push(data.items[0]);
    } else {
      lines.push(`\n[${label}] (${data.count} résultat${data.count > 1 ? 's' : ''})`);
      if (data.count > 0) {
        lines.push(...data.items);
      } else {
        lines.push('Aucune donnée trouvée.');
      }
    }
  }

  return lines.join('\n');
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
