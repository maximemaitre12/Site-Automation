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

/**
 * Targeted Data Fetcher - Fetches only the specific data requested by the router
 * Returns compact, formatted data ready for AI consumption
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, companyId, tables, filters = {}, limit = 5, fields = [] } = await req.json() as FetchRequest;

    if (!userId || !companyId || !tables || tables.length === 0) {
      return new Response(
        JSON.stringify({ error: 'userId, companyId and tables are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Fetching targeted data: tables=${tables.join(',')}, limit=${limit}`);

    const results: Record<string, any> = {};

    // Table configurations with ownership and default fields
    const tableConfig: Record<string, { 
      ownerField: 'user_id' | 'company_id';
      defaultFields: string[];
      formatFn: (item: any) => string;
    }> = {
      workflows: {
        ownerField: 'user_id',
        defaultFields: ['id', 'name', 'is_active', 'status', 'updated_at'],
        formatFn: (w) => `• "${w.name}" (${w.is_active ? 'actif' : 'inactif'}${w.status ? `, ${w.status}` : ''})`
      },
      sales_deals: {
        ownerField: 'company_id',
        defaultFields: ['id', 'company_name', 'value', 'status', 'win_probability', 'priority'],
        formatFn: (d) => `• "${d.company_name}" - ${formatCurrency(d.value)} (${d.status}, ${d.win_probability || 0}% prob.)`
      },
      candidates: {
        ownerField: 'company_id',
        defaultFields: ['id', 'name', 'status', 'match_score', 'email'],
        formatFn: (c) => `• ${c.name} (${c.status}, score: ${c.match_score || 0}%)`
      },
      employees: {
        ownerField: 'company_id',
        defaultFields: ['id', 'first_name', 'last_name', 'department', 'status', 'performance_score'],
        formatFn: (e) => `• ${e.first_name} ${e.last_name} (${e.department || 'n/a'}, ${e.status})`
      },
      support_tickets: {
        ownerField: 'company_id',
        defaultFields: ['id', 'title', 'status', 'priority', 'category'],
        formatFn: (t) => `• "${truncate(t.title, 40)}" (${t.priority}, ${t.status})`
      },
      aether_documents: {
        ownerField: 'company_id',
        defaultFields: ['id', 'title', 'file_type', 'ai_summary'],
        formatFn: (d) => `• "${truncate(d.title, 35)}" (${d.file_type || 'doc'})`
      },
      compliance_alerts: {
        ownerField: 'company_id',
        defaultFields: ['id', 'title', 'severity', 'is_resolved'],
        formatFn: (a) => `• "${truncate(a.title, 35)}" (${a.severity}, ${a.is_resolved ? 'résolu' : 'actif'})`
      },
      esg_kpis: {
        ownerField: 'company_id',
        defaultFields: ['id', 'name', 'category', 'value', 'status'],
        formatFn: (k) => `• ${k.name}: ${k.value} (${k.category}, ${k.status})`
      },
      enriched_companies: {
        ownerField: 'user_id',
        defaultFields: ['id', 'name', 'sector', 'revenue', 'financial_health_score'],
        formatFn: (c) => `• "${c.name}" (${c.sector || 'n/a'}, santé: ${c.financial_health_score || 'n/a'})`
      },
      crm_contacts: {
        ownerField: 'user_id',
        defaultFields: ['id', 'first_name', 'last_name', 'email', 'engagement_score'],
        formatFn: (c) => `• ${c.first_name} ${c.last_name} (engagement: ${c.engagement_score || 0})`
      },
      crm_companies: {
        ownerField: 'user_id',
        defaultFields: ['id', 'name', 'industry', 'annual_revenue'],
        formatFn: (c) => `• "${c.name}" (${c.industry || 'n/a'}, CA: ${formatCurrency(c.annual_revenue)})`
      },
      conversations: {
        ownerField: 'user_id',
        defaultFields: ['id', 'title', 'updated_at'],
        formatFn: (c) => `• "${truncate(c.title, 40)}" (${new Date(c.updated_at).toLocaleDateString('fr-FR')})`
      },
      sales_proposals: {
        ownerField: 'company_id',
        defaultFields: ['id', 'title', 'status', 'total_amount'],
        formatFn: (p) => `• "${truncate(p.title, 35)}" - ${formatCurrency(p.total_amount)} (${p.status})`
      },
      call_analyses: {
        ownerField: 'user_id',
        defaultFields: ['id', 'title', 'sentiment', 'summary'],
        formatFn: (c) => `• "${truncate(c.title, 35)}" (sentiment: ${c.sentiment || 'n/a'})`
      },
      job_descriptions: {
        ownerField: 'company_id',
        defaultFields: ['id', 'title', 'department', 'status', 'location'],
        formatFn: (j) => `• "${j.title}" (${j.department || 'n/a'}, ${j.status})`
      },
      user_api_keys: {
        ownerField: 'user_id',
        defaultFields: ['id', 'provider', 'key_name', 'is_active', 'created_at'],
        formatFn: (k) => `• ${k.provider}: "${k.key_name || 'clé'}" (${k.is_active ? 'active' : 'inactive'})`
      },
      subscriptions: {
        ownerField: 'user_id',
        defaultFields: ['id', 'status', 'plan_name', 'price_monthly'],
        formatFn: (s) => `• Plan ${s.plan_name} (${s.status}, ${s.price_monthly}€/mois)`
      }
    };

    // Fetch data for each requested table
    for (const tableName of tables) {
      if (tableName === 'general') {
        // For general, fetch counts from main tables
        results['overview'] = await fetchOverview(supabase, userId, companyId);
        continue;
      }

      const config = tableConfig[tableName];
      if (!config) {
        console.log(`Unknown table: ${tableName}, skipping`);
        continue;
      }

      const ownerValue = config.ownerField === 'user_id' ? userId : companyId;
      const selectFields = fields.length > 0 ? fields.join(',') : config.defaultFields.join(',');

      let query = supabase
        .from(tableName)
        .select(selectFields)
        .eq(config.ownerField, ownerValue)
        .order('updated_at', { ascending: false })
        .limit(limit);

      // Apply additional filters
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        continue;
      }

      const items = data || [];
      
      // Format items using table-specific formatter
      const formattedItems = items.map(config.formatFn);
      
      results[tableName] = {
        count: items.length,
        items: formattedItems,
        raw: items // Include raw data for potential AI use
      };
    }

    // Build compact context text
    const contextText = buildContextText(results);

    console.log(`Targeted fetch complete: ${Object.keys(results).length} tables, ~${contextText.length} chars`);

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

async function fetchOverview(supabase: any, userId: string, companyId: string): Promise<any> {
  const counts = await Promise.all([
    supabase.from('workflows').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('sales_deals').select('id', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('candidates').select('id', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('employees').select('id', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('support_tickets').select('id', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('aether_documents').select('id', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('compliance_alerts').select('id', { count: 'exact', head: true }).eq('company_id', companyId),
  ]);

  return {
    workflows: counts[0].count || 0,
    deals: counts[1].count || 0,
    candidates: counts[2].count || 0,
    employees: counts[3].count || 0,
    tickets: counts[4].count || 0,
    documents: counts[5].count || 0,
    alerts: counts[6].count || 0
  };
}

function buildContextText(results: Record<string, any>): string {
  const lines: string[] = [];

  for (const [table, data] of Object.entries(results)) {
    if (table === 'overview') {
      const o = data;
      lines.push(`VUE GLOBALE: ${o.workflows} workflows, ${o.deals} deals, ${o.candidates} candidats, ${o.employees} employés, ${o.tickets} tickets, ${o.documents} docs, ${o.alerts} alertes`);
      continue;
    }

    const tableNames: Record<string, string> = {
      workflows: 'WORKFLOWS',
      sales_deals: 'DEALS',
      candidates: 'CANDIDATS',
      employees: 'EMPLOYÉS',
      support_tickets: 'TICKETS',
      aether_documents: 'DOCUMENTS',
      compliance_alerts: 'ALERTES',
      esg_kpis: 'KPIs ESG',
      enriched_companies: 'ENTREPRISES',
      crm_contacts: 'CONTACTS CRM',
      crm_companies: 'SOCIÉTÉS CRM',
      conversations: 'CONVERSATIONS',
      sales_proposals: 'PROPOSITIONS',
      call_analyses: 'ANALYSES APPELS',
      job_descriptions: 'OFFRES EMPLOI'
    };

    const label = tableNames[table] || table.toUpperCase();
    
    if (data.count > 0) {
      lines.push(`[${label}] (${data.count} résultats)`);
      lines.push(...data.items);
    } else {
      lines.push(`[${label}] Aucune donnée`);
    }
  }

  return lines.join('\n');
}

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
