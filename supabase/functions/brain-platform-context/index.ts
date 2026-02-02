import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlatformContextRequest {
  userId: string;
  companyId: string;
  query?: string; // Optional query to prioritize relevant data
}

/**
 * This edge function retrieves comprehensive platform data for AETHER Brain
 * with strict company-level data isolation (multi-tenant)
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, companyId, query } = await req.json() as PlatformContextRequest;

    if (!userId || !companyId) {
      return new Response(
        JSON.stringify({ error: 'userId and companyId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Fetching platform context for user=${userId}, company=${companyId}`);

    // Parallel fetch all relevant data with company isolation
    const [
      { data: salesDeals },
      { data: candidates },
      { data: employees },
      { data: supportTickets },
      { data: documents },
      { data: workflows },
      { data: complianceAlerts },
      { data: crmOpportunities },
      { data: crmContacts },
      { data: crmCompanies },
      { data: enrichedCompanies },
      { data: esgKpis },
      { data: companyInfo }
    ] = await Promise.all([
      // Sales deals - company-wide
      supabase
        .from('sales_deals')
        .select('id, company_name, contact_name, value, status, priority, win_probability, next_step, next_step_date, created_at, updated_at')
        .eq('company_id', companyId)
        .order('updated_at', { ascending: false })
        .limit(50),

      // HR Candidates - company-wide
      supabase
        .from('candidates')
        .select('id, name, email, status, match_score, experience_years, skills, job_id, created_at')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(50),

      // HR Employees - company-wide
      supabase
        .from('employees')
        .select('id, first_name, last_name, email, department, position, hire_date, status, salary, performance_score, manager_id')
        .eq('company_id', companyId)
        .order('hire_date', { ascending: false })
        .limit(100),

      // Support tickets - company-wide
      supabase
        .from('support_tickets')
        .select('id, title, description, status, priority, category, assignee_name, customer_name, created_at, updated_at, resolved_at')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(50),

      // Documents - company-wide
      supabase
        .from('aether_documents')
        .select('id, title, description, ai_summary, file_type, status, tags, access_level, created_at')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(50),

      // Workflows - user-specific (personal workflows)
      supabase
        .from('workflows')
        .select('id, name, description, is_active, created_at, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(30),

      // Compliance alerts - company-wide
      supabase
        .from('compliance_alerts')
        .select('id, title, description, severity, alert_type, is_resolved, created_at')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(30),

      // CRM Opportunities - user's opportunities
      supabase
        .from('crm_opportunities')
        .select('id, name, value, currency, stage_id, status, probability, expected_close_date, ai_risk_score, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50),

      // CRM Contacts - user's contacts
      supabase
        .from('crm_contacts')
        .select('id, first_name, last_name, email, job_title, department, engagement_score, last_contacted_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(50),

      // CRM Companies - user's companies
      supabase
        .from('crm_companies')
        .select('id, name, industry, employees_count, annual_revenue, city, country, website')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(50),

      // Enriched companies (AETHER Data) - user's data
      supabase
        .from('enriched_companies')
        .select('id, siren, name, legal_form, headquarters_city, employee_count, revenue, sector, is_active, financial_health_score')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(50),

      // ESG KPIs - company-wide
      supabase
        .from('esg_kpis')
        .select('id, name, category, value, unit, target_value, status, period')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(30),

      // Company info
      supabase
        .from('companies')
        .select('id, name, slug')
        .eq('id', companyId)
        .single()
    ]);

    // Build context summary
    const context: Record<string, any> = {
      company: companyInfo || { id: companyId },
      timestamp: new Date().toISOString()
    };

    // === SALES SUMMARY ===
    if (salesDeals && salesDeals.length > 0) {
      const activeDeals = salesDeals.filter(d => !['won', 'lost', 'closed'].includes(d.status?.toLowerCase() || ''));
      const totalPipeline = activeDeals.reduce((sum, d) => sum + (d.value || 0), 0);
      const avgWinProb = activeDeals.length > 0 
        ? activeDeals.reduce((sum, d) => sum + (d.win_probability || 0), 0) / activeDeals.length 
        : 0;
      
      context.sales = {
        summary: {
          total_deals: salesDeals.length,
          active_deals: activeDeals.length,
          total_pipeline_value: totalPipeline,
          average_win_probability: Math.round(avgWinProb),
          by_status: groupBy(salesDeals, 'status'),
          by_priority: groupBy(salesDeals, 'priority')
        },
        deals: salesDeals.map(d => ({
          id: d.id,
          company: d.company_name,
          contact: d.contact_name,
          value: d.value,
          status: d.status,
          priority: d.priority,
          win_probability: d.win_probability,
          next_step: d.next_step,
          next_step_date: d.next_step_date
        }))
      };
    }

    // === HR SUMMARY ===
    if ((candidates && candidates.length > 0) || (employees && employees.length > 0)) {
      context.hr = {};
      
      if (candidates && candidates.length > 0) {
        context.hr.candidates = {
          total: candidates.length,
          by_status: groupBy(candidates, 'status'),
          avg_match_score: Math.round(candidates.reduce((s, c) => s + (c.match_score || 0), 0) / candidates.length),
          list: candidates.map(c => ({
            id: c.id,
            name: c.name,
            status: c.status,
            match_score: c.match_score,
            experience: c.experience_years,
            skills: c.skills
          }))
        };
      }
      
      if (employees && employees.length > 0) {
        const activeEmployees = employees.filter(e => e.status === 'active');
        const avgPerformance = activeEmployees.length > 0
          ? activeEmployees.reduce((s, e) => s + (e.performance_score || 0), 0) / activeEmployees.length
          : 0;
        
        context.hr.employees = {
          total: employees.length,
          active: activeEmployees.length,
          by_department: groupBy(employees, 'department'),
          avg_performance_score: Math.round(avgPerformance * 10) / 10,
          list: employees.map(e => ({
            id: e.id,
            name: `${e.first_name} ${e.last_name}`,
            department: e.department,
            position: e.position,
            status: e.status,
            performance_score: e.performance_score,
            hire_date: e.hire_date
          }))
        };
      }
    }

    // === SUPPORT SUMMARY ===
    if (supportTickets && supportTickets.length > 0) {
      const openTickets = supportTickets.filter(t => t.status !== 'resolved' && t.status !== 'closed');
      
      context.support = {
        summary: {
          total_tickets: supportTickets.length,
          open_tickets: openTickets.length,
          by_status: groupBy(supportTickets, 'status'),
          by_priority: groupBy(supportTickets, 'priority'),
          by_category: groupBy(supportTickets, 'category')
        },
        tickets: supportTickets.map(t => ({
          id: t.id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          category: t.category,
          assignee: t.assignee_name,
          customer: t.customer_name,
          created: t.created_at
        }))
      };
    }

    // === DOCUMENTS SUMMARY ===
    if (documents && documents.length > 0) {
      context.documents = {
        summary: {
          total: documents.length,
          by_type: groupBy(documents, 'file_type'),
          by_access: groupBy(documents, 'access_level')
        },
        list: documents.map(d => ({
          id: d.id,
          title: d.title,
          summary: d.ai_summary?.slice(0, 200),
          type: d.file_type,
          access: d.access_level,
          tags: d.tags
        }))
      };
    }

    // === WORKFLOWS SUMMARY ===
    if (workflows && workflows.length > 0) {
      const activeWorkflows = workflows.filter(w => w.is_active);
      context.workflows = {
        total: workflows.length,
        active: activeWorkflows.length,
        list: workflows.map(w => ({
          id: w.id,
          name: w.name,
          description: w.description?.slice(0, 100),
          active: w.is_active
        }))
      };
    }

    // === COMPLIANCE SUMMARY ===
    if (complianceAlerts && complianceAlerts.length > 0) {
      const unresolvedAlerts = complianceAlerts.filter(a => !a.is_resolved);
      context.compliance = {
        summary: {
          total_alerts: complianceAlerts.length,
          unresolved: unresolvedAlerts.length,
          by_severity: groupBy(complianceAlerts, 'severity'),
          by_type: groupBy(complianceAlerts, 'alert_type')
        },
        alerts: complianceAlerts.map(a => ({
          id: a.id,
          title: a.title,
          severity: a.severity,
          type: a.alert_type,
          resolved: a.is_resolved
        }))
      };
    }

    // === CRM SUMMARY ===
    if ((crmOpportunities && crmOpportunities.length > 0) || (crmContacts && crmContacts.length > 0)) {
      context.crm = {};
      
      if (crmOpportunities && crmOpportunities.length > 0) {
        const totalValue = crmOpportunities.reduce((s, o) => s + (o.value || 0), 0);
        context.crm.opportunities = {
          total: crmOpportunities.length,
          total_value: totalValue,
          by_status: groupBy(crmOpportunities, 'status'),
          list: crmOpportunities.map(o => ({
            id: o.id,
            name: o.name,
            value: o.value,
            currency: o.currency,
            status: o.status,
            probability: o.probability,
            risk_score: o.ai_risk_score,
            close_date: o.expected_close_date
          }))
        };
      }
      
      if (crmContacts && crmContacts.length > 0) {
        context.crm.contacts = {
          total: crmContacts.length,
          list: crmContacts.map(c => ({
            id: c.id,
            name: `${c.first_name} ${c.last_name}`,
            email: c.email,
            title: c.job_title,
            department: c.department,
            engagement: c.engagement_score,
            last_contact: c.last_contacted_at
          }))
        };
      }
      
      if (crmCompanies && crmCompanies.length > 0) {
        context.crm.companies = {
          total: crmCompanies.length,
          list: crmCompanies.map(c => ({
            id: c.id,
            name: c.name,
            industry: c.industry,
            employees: c.employees_count,
            revenue: c.annual_revenue,
            location: c.city && c.country ? `${c.city}, ${c.country}` : null
          }))
        };
      }
    }

    // === DATA ENRICHMENT SUMMARY ===
    if (enrichedCompanies && enrichedCompanies.length > 0) {
      context.data = {
        enriched_companies: {
          total: enrichedCompanies.length,
          by_sector: groupBy(enrichedCompanies, 'sector'),
          list: enrichedCompanies.map(c => ({
            id: c.id,
            siren: c.siren,
            name: c.name,
            legal_form: c.legal_form,
            city: c.headquarters_city,
            employees: c.employee_count,
            revenue: c.revenue,
            sector: c.sector,
            health_score: c.financial_health_score,
            active: c.is_active
          }))
        }
      };
    }

    // === ESG SUMMARY ===
    if (esgKpis && esgKpis.length > 0) {
      context.esg = {
        total_kpis: esgKpis.length,
        by_category: groupBy(esgKpis, 'category'),
        kpis: esgKpis.map(k => ({
          id: k.id,
          name: k.name,
          category: k.category,
          value: k.value,
          unit: k.unit,
          target: k.target_value,
          status: k.status
        }))
      };
    }

    console.log(`Platform context built: ${Object.keys(context).length} sections`);

    return new Response(
      JSON.stringify({ context, success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in brain-platform-context:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to group items by a key
function groupBy(items: any[], key: string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of items) {
    const value = item[key] || 'non défini';
    result[value] = (result[value] || 0) + 1;
  }
  return result;
}
