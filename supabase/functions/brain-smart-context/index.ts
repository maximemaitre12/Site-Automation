import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type BrainDomain = 'flow' | 'sales' | 'hr' | 'support' | 'doc' | 'compliance' | 'data' | 'general';

interface SmartContextRequest {
  userId: string;
  companyId: string;
  domains: BrainDomain[];
  query: string;
}

interface CompactContext {
  domain: string;
  summary: string;
  items?: string[];
  metrics?: Record<string, number | string>;
}

/**
 * Smart Context Edge Function
 * Only fetches data for requested domains and returns compressed summaries
 * Target: ~200-500 tokens max per request
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, companyId, domains, query } = await req.json() as SmartContextRequest;

    if (!userId || !companyId || !domains || domains.length === 0) {
      return new Response(
        JSON.stringify({ error: 'userId, companyId and domains are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Smart context for domains: ${domains.join(', ')}, query: "${query.slice(0, 50)}..."`);

    const contexts: CompactContext[] = [];

    // Fetch only requested domains in parallel
    const fetchPromises = domains.map(domain => fetchDomainData(supabase, domain, userId, companyId));
    const results = await Promise.all(fetchPromises);
    
    for (let i = 0; i < domains.length; i++) {
      const context = results[i];
      if (context) {
        contexts.push(context);
      }
    }

    // Build compact text summary for AI
    const contextText = buildCompactContextText(contexts);
    
    console.log(`Smart context built: ${contexts.length} domains, ~${contextText.length} chars`);

    return new Response(
      JSON.stringify({ 
        contexts, 
        contextText,
        domainsProcessed: domains,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in brain-smart-context:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function fetchDomainData(
  supabase: any, 
  domain: BrainDomain, 
  userId: string, 
  companyId: string
): Promise<CompactContext | null> {
  
  switch (domain) {
    case 'flow':
      return fetchFlowContext(supabase, userId);
    case 'sales':
      return fetchSalesContext(supabase, companyId);
    case 'hr':
      return fetchHRContext(supabase, companyId);
    case 'support':
      return fetchSupportContext(supabase, companyId);
    case 'doc':
      return fetchDocContext(supabase, companyId);
    case 'compliance':
      return fetchComplianceContext(supabase, companyId);
    case 'data':
      return fetchDataContext(supabase, userId);
    case 'general':
      return fetchGeneralContext(supabase, userId, companyId);
    default:
      return null;
  }
}

async function fetchFlowContext(supabase: any, userId: string): Promise<CompactContext> {
  const { data: workflows } = await supabase
    .from('workflows')
    .select('id, name, is_active, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(20);

  const items = workflows || [];
  const active = items.filter((w: any) => w.is_active).length;
  const inactive = items.length - active;
  
  // Top 5 most recent with compact format
  const topItems = items.slice(0, 5).map((w: any) => 
    `"${w.name}" (${w.is_active ? 'actif' : 'inactif'})`
  );

  return {
    domain: 'WORKFLOWS',
    summary: `${items.length} workflows: ${active} actifs, ${inactive} inactifs`,
    items: topItems,
    metrics: { total: items.length, actifs: active, inactifs: inactive }
  };
}

async function fetchSalesContext(supabase: any, companyId: string): Promise<CompactContext> {
  const { data: deals } = await supabase
    .from('sales_deals')
    .select('id, company_name, value, status, win_probability, priority')
    .eq('company_id', companyId)
    .order('updated_at', { ascending: false })
    .limit(30);

  const items = deals || [];
  const activeStatuses = ['nouveau', 'qualification', 'proposition', 'négociation', 'new', 'qualified', 'proposal', 'negotiation'];
  const active = items.filter((d: any) => activeStatuses.includes(d.status?.toLowerCase() || ''));
  const totalValue = active.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
  const avgProb = active.length > 0 
    ? Math.round(active.reduce((s: number, d: any) => s + (d.win_probability || 0), 0) / active.length)
    : 0;

  const byStatus: Record<string, number> = {};
  items.forEach((d: any) => {
    const s = d.status || 'inconnu';
    byStatus[s] = (byStatus[s] || 0) + 1;
  });

  const topItems = items.slice(0, 5).map((d: any) => 
    `"${d.company_name}" (${formatCurrency(d.value)}, ${d.status}, ${d.win_probability || 0}%)`
  );

  return {
    domain: 'VENTES',
    summary: `${items.length} deals, ${active.length} actifs. Pipeline: ${formatCurrency(totalValue)}. Probabilité moyenne: ${avgProb}%`,
    items: topItems,
    metrics: { total: items.length, actifs: active.length, pipeline: totalValue, probMoyenne: avgProb }
  };
}

async function fetchHRContext(supabase: any, companyId: string): Promise<CompactContext> {
  const [candidatesRes, employeesRes] = await Promise.all([
    supabase
      .from('candidates')
      .select('id, name, status, match_score, skills')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('employees')
      .select('id, first_name, last_name, department, status, performance_score')
      .eq('company_id', companyId)
      .limit(50)
  ]);

  const candidates = candidatesRes.data || [];
  const employees = employeesRes.data || [];
  const activeEmps = employees.filter((e: any) => e.status === 'active');
  
  const byStatus: Record<string, number> = {};
  candidates.forEach((c: any) => {
    const s = c.status || 'nouveau';
    byStatus[s] = (byStatus[s] || 0) + 1;
  });

  const byDept: Record<string, number> = {};
  employees.forEach((e: any) => {
    const d = e.department || 'non défini';
    byDept[d] = (byDept[d] || 0) + 1;
  });

  const avgMatch = candidates.length > 0
    ? Math.round(candidates.reduce((s: number, c: any) => s + (c.match_score || 0), 0) / candidates.length)
    : 0;

  const topCandidates = candidates.slice(0, 3).map((c: any) => 
    `${c.name} (${c.status}, score ${c.match_score || 0}%)`
  );

  return {
    domain: 'RH',
    summary: `${candidates.length} candidats (score moyen ${avgMatch}%), ${employees.length} employés (${activeEmps.length} actifs). Statuts candidats: ${Object.entries(byStatus).map(([k,v]) => `${k}:${v}`).join(', ')}`,
    items: topCandidates,
    metrics: { 
      candidats: candidates.length, 
      employes: employees.length, 
      actifs: activeEmps.length,
      scoreMoyen: avgMatch
    }
  };
}

async function fetchSupportContext(supabase: any, companyId: string): Promise<CompactContext> {
  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('id, title, status, priority, category')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(30);

  const items = tickets || [];
  const open = items.filter((t: any) => !['resolved', 'closed', 'résolu', 'fermé'].includes(t.status?.toLowerCase() || ''));
  
  const byPriority: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  items.forEach((t: any) => {
    const p = t.priority || 'normal';
    const s = t.status || 'nouveau';
    byPriority[p] = (byPriority[p] || 0) + 1;
    byStatus[s] = (byStatus[s] || 0) + 1;
  });

  const topItems = items.slice(0, 5).map((t: any) => 
    `"${truncate(t.title, 30)}" (${t.priority}, ${t.status})`
  );

  return {
    domain: 'SUPPORT',
    summary: `${items.length} tickets, ${open.length} ouverts. Par priorité: ${Object.entries(byPriority).map(([k,v]) => `${k}:${v}`).join(', ')}`,
    items: topItems,
    metrics: { total: items.length, ouverts: open.length }
  };
}

async function fetchDocContext(supabase: any, companyId: string): Promise<CompactContext> {
  const { data: docs } = await supabase
    .from('aether_documents')
    .select('id, title, file_type, ai_summary')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(20);

  const items = docs || [];
  
  const byType: Record<string, number> = {};
  items.forEach((d: any) => {
    const t = d.file_type || 'autre';
    byType[t] = (byType[t] || 0) + 1;
  });

  const topItems = items.slice(0, 5).map((d: any) => 
    `"${truncate(d.title, 25)}" (${d.file_type || 'doc'})`
  );

  return {
    domain: 'DOCUMENTS',
    summary: `${items.length} documents. Types: ${Object.entries(byType).map(([k,v]) => `${k}:${v}`).join(', ')}`,
    items: topItems,
    metrics: { total: items.length }
  };
}

async function fetchComplianceContext(supabase: any, companyId: string): Promise<CompactContext> {
  const [alertsRes, esgRes] = await Promise.all([
    supabase
      .from('compliance_alerts')
      .select('id, title, severity, is_resolved')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(15),
    supabase
      .from('esg_kpis')
      .select('id, name, category, value, status')
      .eq('company_id', companyId)
      .limit(15)
  ]);

  const alerts = alertsRes.data || [];
  const esg = esgRes.data || [];
  const unresolved = alerts.filter((a: any) => !a.is_resolved);

  const bySeverity: Record<string, number> = {};
  alerts.forEach((a: any) => {
    const s = a.severity || 'medium';
    bySeverity[s] = (bySeverity[s] || 0) + 1;
  });

  const topAlerts = unresolved.slice(0, 3).map((a: any) => 
    `"${truncate(a.title, 30)}" (${a.severity})`
  );

  return {
    domain: 'CONFORMITÉ',
    summary: `${alerts.length} alertes (${unresolved.length} non résolues). ${esg.length} KPIs ESG. Sévérité: ${Object.entries(bySeverity).map(([k,v]) => `${k}:${v}`).join(', ')}`,
    items: topAlerts,
    metrics: { alertes: alerts.length, nonResolues: unresolved.length, kpisESG: esg.length }
  };
}

async function fetchDataContext(supabase: any, userId: string): Promise<CompactContext> {
  const [companiesRes, contactsRes] = await Promise.all([
    supabase
      .from('enriched_companies')
      .select('id, name, sector, revenue, financial_health_score')
      .eq('user_id', userId)
      .limit(20),
    supabase
      .from('crm_contacts')
      .select('id, first_name, last_name, company_id, engagement_score')
      .eq('user_id', userId)
      .limit(20)
  ]);

  const companies = companiesRes.data || [];
  const contacts = contactsRes.data || [];

  const bySector: Record<string, number> = {};
  companies.forEach((c: any) => {
    const s = c.sector || 'autre';
    bySector[s] = (bySector[s] || 0) + 1;
  });

  const topCompanies = companies.slice(0, 3).map((c: any) => 
    `"${c.name}" (${c.sector || 'n/a'}, score santé ${c.financial_health_score || 'n/a'})`
  );

  return {
    domain: 'DATA/CRM',
    summary: `${companies.length} entreprises enrichies, ${contacts.length} contacts CRM. Secteurs: ${Object.entries(bySector).map(([k,v]) => `${k}:${v}`).join(', ')}`,
    items: topCompanies,
    metrics: { entreprises: companies.length, contacts: contacts.length }
  };
}

async function fetchGeneralContext(supabase: any, userId: string, companyId: string): Promise<CompactContext> {
  // Fetch light counts from all domains
  const [workflows, deals, candidates, employees, tickets, docs, alerts] = await Promise.all([
    supabase.from('workflows').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('sales_deals').select('id', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('candidates').select('id', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('employees').select('id', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('support_tickets').select('id', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('aether_documents').select('id', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('compliance_alerts').select('id', { count: 'exact', head: true }).eq('company_id', companyId),
  ]);

  return {
    domain: 'VUE D\'ENSEMBLE',
    summary: `Workflows: ${workflows.count || 0}, Deals: ${deals.count || 0}, Candidats: ${candidates.count || 0}, Employés: ${employees.count || 0}, Tickets: ${tickets.count || 0}, Documents: ${docs.count || 0}, Alertes conformité: ${alerts.count || 0}`,
    metrics: {
      workflows: workflows.count || 0,
      deals: deals.count || 0,
      candidats: candidates.count || 0,
      employes: employees.count || 0,
      tickets: tickets.count || 0,
      documents: docs.count || 0,
      alertes: alerts.count || 0
    }
  };
}

function buildCompactContextText(contexts: CompactContext[]): string {
  if (contexts.length === 0) return '';
  
  const lines = contexts.map(ctx => {
    let text = `[${ctx.domain}] ${ctx.summary}`;
    if (ctx.items && ctx.items.length > 0) {
      text += `\nTop éléments: ${ctx.items.join(', ')}`;
    }
    return text;
  });
  
  return lines.join('\n\n');
}

function formatCurrency(value: number | null | undefined): string {
  if (!value) return '0€';
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M€`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}k€`;
  return `${value}€`;
}

function truncate(str: string, maxLen: number): string {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen - 3) + '...' : str;
}
