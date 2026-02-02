import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  messages: Array<{ role: string; content: string | any[] }>;
  systemPrompt?: string;
  userId?: string;
  companyId?: string;
  attachments?: Array<{
    type: 'image' | 'document';
    content: string;
    name: string;
    mimeType?: string;
  }>;
}

// Keywords that indicate a need for real-time web search
const REALTIME_KEYWORDS = [
  'météo', 'meteo', 'weather', 'température', 'temperature',
  'actualité', 'actualite', 'news', 'aujourd\'hui', "aujourd'hui",
  'cours', 'bourse', 'action', 'stock', 'bitcoin', 'crypto', 'prix',
  'score', 'match', 'résultat', 'resultat',
  'heure', 'date', 'maintenant', 'en ce moment',
  'dernier', 'dernière', 'récent', 'recent', 'nouveau', 'nouvelle',
  'tendance', 'trending', 'viral',
  'qui a gagné', 'qui a gagne', 'vainqueur',
  'combien coûte', 'combien coute', 'quel prix',
  'où est', 'ou est', 'adresse', 'horaire', 'ouvert',
  'événement', 'evenement', 'concert', 'festival',
  'élection', 'election', 'vote', 'politique',
  'covid', 'pandémie', 'pandemie', 'virus',
  'tremblement', 'séisme', 'ouragan', 'tempête',
  'accident', 'catastrophe', 'breaking',
  'trafic', 'embouteillage', 'grève', 'greve',
  'direct', 'live', 'streaming'
];

// Keywords that indicate a need for platform data (accent-insensitive patterns)
const PLATFORM_DATA_KEYWORDS = [
  // Sales
  'deal', 'deals', 'vente', 'ventes', 'pipeline', 'opportunit', 'prospect',
  'client', 'chiffre', 'affaires', 'ca ', 'c.a.', 'revenu',
  // HR / Team - with accent variations
  'employ', 'collaborat', 'equipe', 'équipe', 'membre', 'personnel',
  'candidat', 'recrutement', 'embauche', 'rh', 'ressources humaines',
  'performance', 'salaire', 'departement', 'département', 'manager', 'effectif',
  // Support
  'ticket', 'support', 'incident', 'probleme', 'problème', 'reclamation', 'réclamation', 'sav',
  // Documents
  'document', 'fichier', 'dossier', 'doc ', 'docs',
  // Workflows
  'workflow', 'automatisation', 'automation', 'processus',
  // Compliance
  'compliance', 'conformit', 'audit', 'alerte', 'risque',
  // CRM
  'crm', 'contact', 'entreprise', 'societe', 'société',
  // ESG
  'esg', 'environnement', 'social', 'gouvernance', 'kpi', 'indicateur',
  // Data
  'donnee', 'données', 'data', 'enrichissement', 'siren', 'siret',
  // General questions about internal data
  'combien', 'quels sont', 'quelles sont', 'liste', 'recapitulatif', 'récapitulatif', 
  'resume', 'résumé', 'en cours', 'actif', 'ouvert', 'rentable', 'rentabilit',
  // Possessive questions about the company
  'mon ', 'ma ', 'mes ', 'notre', 'nos ', 'mon équipe', 'mon equipe',
  'dans aether', 'sur aether', 'chez nous', 'dans l\'entreprise',
  // Common questions about company info
  'qui fait partie', 'qui travaille', 'qui est dans', 'nombre de', 'statistique',
  'tableau de bord', 'dashboard', 'stat', 'info', 'situation'
];

function needsRealtimeSearch(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return REALTIME_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

function needsPlatformData(message: string): boolean {
  // Normalize message: remove accents for better matching
  const lowerMessage = message.toLowerCase();
  const normalizedMessage = lowerMessage
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove accents
  
  return PLATFORM_DATA_KEYWORDS.some(keyword => {
    const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return lowerMessage.includes(keyword) || normalizedMessage.includes(normalizedKeyword);
  });
}

async function searchPerplexity(query: string): Promise<{ content: string; citations: string[] } | null> {
  const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
  if (!apiKey) {
    console.log('Perplexity API key not configured, skipping real-time search');
    return null;
  }

  try {
    console.log('Performing Perplexity real-time search for:', query);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          { 
            role: 'system', 
            content: `Tu es un assistant de recherche factuel. 
RÈGLES STRICTES:
- Fournis UNIQUEMENT des informations VÉRIFIÉES et FACTUELLES
- Cite TOUJOURS tes sources avec précision
- Si une information n'est pas certaine, indique-le clairement
- Pour les données chiffrées (météo, cours, scores), donne les valeurs exactes
- Ne fais JAMAIS de suppositions ou d'approximations
- Réponds en français de manière précise et concise` 
          },
          { role: 'user', content: query }
        ],
        max_tokens: 2048,
        temperature: 0.1,
        search_recency_filter: 'day',
        return_citations: true,
        return_related_questions: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Perplexity API error:', response.status, errorData);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const citations = data.citations || [];
    
    console.log(`Perplexity returned ${citations.length} citations`);
    
    return { content, citations };
  } catch (error) {
    console.error('Error calling Perplexity:', error);
    return null;
  }
}

async function fetchPlatformContext(
  supabase: any, 
  userId: string, 
  companyId: string,
  query: string
): Promise<string> {
  try {
    console.log(`Fetching platform context for company=${companyId}, user=${userId}`);

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
      { data: enrichedCompanies },
      { data: esgKpis },
      { data: companyInfo },
      { data: teamMembers }
    ] = await Promise.all([
      // Sales deals - company-wide
      supabase
        .from('sales_deals')
        .select('id, company_name, contact_name, value, status, priority, win_probability, next_step, next_step_date')
        .eq('company_id', companyId)
        .order('updated_at', { ascending: false })
        .limit(30),

      // HR Candidates - company-wide
      supabase
        .from('candidates')
        .select('id, name, email, status, match_score, experience_years')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(30),

      // HR Employees - company-wide (using correct column names)
      supabase
        .from('employees')
        .select('id, name, email, job_title, department, is_active, salary_current')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50),

      // Support tickets - company-wide
      supabase
        .from('support_tickets')
        .select('id, title, status, priority, category, assignee_name, customer_name')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(30),

      // Documents - by company OR by user (since many docs don't have company_id)
      supabase
        .from('aether_documents')
        .select('id, title, ai_summary, file_type, access_level, tags')
        .or(`company_id.eq.${companyId},user_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(30),

      // Workflows - user-specific
      supabase
        .from('workflows')
        .select('id, name, description, is_active')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(20),

      // Compliance alerts - company-wide (unresolved only)
      supabase
        .from('compliance_alerts')
        .select('id, title, severity, alert_type, is_resolved')
        .eq('company_id', companyId)
        .eq('is_resolved', false)
        .order('created_at', { ascending: false })
        .limit(20),

      // CRM Opportunities - user's
      supabase
        .from('crm_opportunities')
        .select('id, name, value, status, probability, expected_close_date')
        .eq('user_id', userId)
        .order('value', { ascending: false })
        .limit(30),

      // CRM Contacts - user's
      supabase
        .from('crm_contacts')
        .select('id, first_name, last_name, email, job_title, engagement_score')
        .eq('user_id', userId)
        .order('engagement_score', { ascending: false })
        .limit(30),

      // Enriched companies - user's
      supabase
        .from('enriched_companies')
        .select('id, siren, name, headquarters_city, employee_count, revenue, sector, financial_health_score')
        .eq('user_id', userId)
        .order('revenue', { ascending: false })
        .limit(30),

      // ESG KPIs - company-wide
      supabase
        .from('esg_kpis')
        .select('id, name, category, value, unit, target_value, status')
        .eq('company_id', companyId)
        .limit(20),

      // Company info
      supabase
        .from('companies')
        .select('id, name')
        .eq('id', companyId)
        .single(),

      // Team members - user_roles + profiles for the company
      supabase
        .from('user_roles')
        .select('user_id, role, profiles(full_name)')
        .eq('company_id', companyId)
    ]);

    console.log(`Platform data fetched: employees=${employees?.length || 0}, team=${teamMembers?.length || 0}, docs=${documents?.length || 0}, deals=${salesDeals?.length || 0}`);

    // Build context string
    let contextParts: string[] = [];
    const companyName = companyInfo?.name || 'votre entreprise';

    // === SALES ===
    if (salesDeals && salesDeals.length > 0) {
      const activeDeals = salesDeals.filter((d: any) => !['won', 'lost', 'closed'].includes(d.status?.toLowerCase() || ''));
      const totalPipeline = activeDeals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
      
      let salesContext = `\n📊 VENTES (${companyName}):\n`;
      salesContext += `• ${salesDeals.length} deals au total, ${activeDeals.length} en cours\n`;
      salesContext += `• Valeur du pipeline: ${formatCurrency(totalPipeline)}\n`;
      salesContext += `Deals en cours:\n`;
      activeDeals.slice(0, 10).forEach((d: any) => {
        salesContext += `  - ${d.company_name}: ${formatCurrency(d.value)} (${d.status}, proba: ${d.win_probability}%)\n`;
      });
      contextParts.push(salesContext);
    }

    // === TEAM MEMBERS (from user_roles) ===
    if (teamMembers && teamMembers.length > 0) {
      let teamContext = `\n👥 ÉQUIPE AETHER (${companyName}):\n`;
      teamContext += `• ${teamMembers.length} membres dans l'équipe\n`;
      teamContext += `Membres:\n`;
      teamMembers.forEach((m: any) => {
        const name = m.profiles?.full_name || 'Utilisateur';
        teamContext += `  - ${name} (${m.role})\n`;
      });
      contextParts.push(teamContext);
    }

    // === EMPLOYEES (HR) ===
    if (employees && employees.length > 0) {
      let hrContext = `\n🏢 EMPLOYÉS RH (${companyName}):\n`;
      hrContext += `• ${employees.length} collaborateurs actifs\n`;
      
      // Group by department
      const depts: Record<string, any[]> = {};
      employees.forEach((e: any) => {
        const dept = e.department || 'Non défini';
        if (!depts[dept]) depts[dept] = [];
        depts[dept].push(e);
      });
      
      hrContext += `Répartition par département:\n`;
      Object.entries(depts).forEach(([dept, emps]) => {
        hrContext += `  - ${dept}: ${emps.length} personnes\n`;
      });
      
      // List employees
      hrContext += `Liste des employés:\n`;
      employees.slice(0, 10).forEach((e: any) => {
        hrContext += `  - ${e.name} (${e.job_title || 'N/A'}, ${e.department || 'N/A'})\n`;
      });
      contextParts.push(hrContext);
    }

    // === CANDIDATES ===
    if (candidates && candidates.length > 0) {
      let candContext = `\n🎯 RECRUTEMENT:\n`;
      candContext += `• ${candidates.length} candidats dans le pipeline\n`;
      const byStatus: Record<string, number> = {};
      candidates.forEach((c: any) => {
        const s = c.status || 'nouveau';
        byStatus[s] = (byStatus[s] || 0) + 1;
      });
      Object.entries(byStatus).forEach(([status, count]) => {
        candContext += `  - ${status}: ${count}\n`;
      });
      contextParts.push(candContext);
    }

    // === SUPPORT ===
    if (supportTickets && supportTickets.length > 0) {
      const openTickets = supportTickets.filter((t: any) => t.status !== 'resolved' && t.status !== 'closed');
      let supportContext = `\n🎫 SUPPORT:\n`;
      supportContext += `• ${supportTickets.length} tickets, ${openTickets.length} en cours\n`;
      if (openTickets.length > 0) {
        supportContext += `Tickets ouverts prioritaires:\n`;
        openTickets.filter((t: any) => t.priority === 'high' || t.priority === 'urgent').slice(0, 5).forEach((t: any) => {
          supportContext += `  - [${t.priority}] ${t.title} (${t.customer_name})\n`;
        });
      }
      contextParts.push(supportContext);
    }

    // === DOCUMENTS ===
    if (documents && documents.length > 0) {
      let docContext = `\n📁 DOCUMENTS:\n`;
      docContext += `• ${documents.length} documents disponibles\n`;
      documents.slice(0, 5).forEach((d: any) => {
        docContext += `  - ${d.title} (${d.file_type || 'doc'})\n`;
      });
      contextParts.push(docContext);
    }

    // === CRM ===
    if (crmOpportunities && crmOpportunities.length > 0) {
      const totalValue = crmOpportunities.reduce((s: number, o: any) => s + (o.value || 0), 0);
      let crmContext = `\n💼 CRM:\n`;
      crmContext += `• ${crmOpportunities.length} opportunités, valeur totale: ${formatCurrency(totalValue)}\n`;
      crmOpportunities.slice(0, 5).forEach((o: any) => {
        crmContext += `  - ${o.name}: ${formatCurrency(o.value)} (${o.status}, ${o.probability}%)\n`;
      });
      contextParts.push(crmContext);
    }

    // === COMPLIANCE ===
    if (complianceAlerts && complianceAlerts.length > 0) {
      let compContext = `\n⚠️ ALERTES COMPLIANCE:\n`;
      compContext += `• ${complianceAlerts.length} alertes non résolues\n`;
      complianceAlerts.slice(0, 5).forEach((a: any) => {
        compContext += `  - [${a.severity}] ${a.title}\n`;
      });
      contextParts.push(compContext);
    }

    // === ESG ===
    if (esgKpis && esgKpis.length > 0) {
      let esgContext = `\n🌱 ESG:\n`;
      esgContext += `• ${esgKpis.length} indicateurs suivis\n`;
      const byCategory: Record<string, any[]> = {};
      esgKpis.forEach((k: any) => {
        const cat = k.category || 'Autre';
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(k);
      });
      Object.entries(byCategory).forEach(([cat, kpis]) => {
        esgContext += `  ${cat}: ${kpis.length} KPIs\n`;
      });
      contextParts.push(esgContext);
    }

    // === ENRICHED COMPANIES ===
    if (enrichedCompanies && enrichedCompanies.length > 0) {
      let dataContext = `\n🏢 DONNÉES ENTREPRISES ENRICHIES:\n`;
      dataContext += `• ${enrichedCompanies.length} entreprises dans la base\n`;
      enrichedCompanies.slice(0, 5).forEach((c: any) => {
        dataContext += `  - ${c.name} (${c.headquarters_city}): ${c.employee_count} emp., CA ${formatCurrency(c.revenue)}\n`;
      });
      contextParts.push(dataContext);
    }

    if (contextParts.length === 0) {
      return '';
    }

    return `\n\n=== DONNÉES PLATEFORME AETHER (${companyName}) ===\nVoici les données en temps réel de votre entreprise:${contextParts.join('')}\n=== FIN DES DONNÉES PLATEFORME ===\n`;

  } catch (error) {
    console.error('Error fetching platform context:', error);
    return '';
  }
}

function formatCurrency(value: number | null): string {
  if (!value) return '0 €';
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M €`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k €`;
  }
  return `${value.toFixed(0)} €`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, systemPrompt, userId, companyId, attachments } = await req.json() as ChatRequest;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service not configured');
    }

    let documentContext = '';
    let realtimeContext = '';
    let platformContext = '';

    // Get the last user message
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const msgContent = typeof lastUserMessage?.content === 'string' 
      ? lastUserMessage.content 
      : (lastUserMessage?.content as any[])?.find(c => c.type === 'text')?.text || '';

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if we need platform data (company context)
    if (userId && companyId && needsPlatformData(msgContent)) {
      console.log('Platform data triggered for:', msgContent.slice(0, 100));
      platformContext = await fetchPlatformContext(supabase, userId, companyId, msgContent);
    }

    // Check if we need real-time data
    if (needsRealtimeSearch(msgContent)) {
      console.log('Real-time search triggered for:', msgContent);
      const searchResult = await searchPerplexity(msgContent);
      
      if (searchResult && searchResult.content) {
        realtimeContext = `\n\n=== DONNÉES VÉRIFIÉES EN TEMPS RÉEL ===\n${searchResult.content}`;
        if (searchResult.citations.length > 0) {
          realtimeContext += `\n\n📌 SOURCES OFFICIELLES:\n`;
          searchResult.citations.forEach((citation, i) => {
            realtimeContext += `[${i + 1}] ${citation}\n`;
          });
        }
        realtimeContext += '\n=== FIN DES DONNÉES VÉRIFIÉES ===\n';
      }
    }

    // Fetch user documents
    if (userId) {
      const { data: internalDocs } = await supabase
        .from('internal_docs')
        .select('title, content, doc_type')
        .eq('user_id', userId);

      const { data: aetherDocs } = await supabase
        .from('aether_documents')
        .select('title, content, ai_summary, description')
        .eq('user_id', userId);

      const allDocs = [
        ...(internalDocs || []).map(d => ({ title: d.title, content: d.content || '' })),
        ...(aetherDocs || []).map(d => ({ title: d.title, content: d.content || d.ai_summary || d.description || '' }))
      ];

      if (allDocs.length > 0) {
        const queryWords = msgContent.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);

        const scoredDocs = allDocs.map(doc => {
          let score = 0;
          const titleLower = doc.title.toLowerCase();
          const contentLower = doc.content.toLowerCase();
          
          queryWords.forEach((word: string) => {
            if (titleLower.includes(word)) score += 5;
            if (contentLower.includes(word)) score += 1;
          });
          
          return { ...doc, score };
        }).sort((a, b) => b.score - a.score);

        const relevantDocs = scoredDocs.filter(d => d.score > 0).slice(0, 8);
        const generalDocs = scoredDocs.filter(d => d.score === 0).slice(0, 4);
        const selectedDocs = [...relevantDocs, ...generalDocs].slice(0, 10);

        if (selectedDocs.length > 0) {
          documentContext = `\n\n=== BASE DE CONNAISSANCES INTERNE ===\nVoici les documents internes de l'entreprise à utiliser pour répondre:\n`;
          selectedDocs.forEach((doc) => {
            const excerpt = doc.content.slice(0, 1200);
            documentContext += `\n[${doc.title}]\n${excerpt}${doc.content.length > 1200 ? '...' : ''}\n`;
          });
        }
      }
    }

    // Add attachment context
    let attachmentContext = '';
    if (attachments && attachments.length > 0) {
      attachmentContext = '\n\n=== FICHIERS JOINTS ===\n';
      for (const att of attachments) {
        if (att.type === 'document') {
          attachmentContext += `\n[Document: ${att.name}]\n${att.content}\n`;
        }
      }
    }

    // Build enhanced system prompt
    const baseSystemPrompt = systemPrompt || `Tu es AETHER Brain, l'assistant IA interne d'une entreprise ultra-performant et polyvalent.`;

    const enhancedSystemPrompt = `${baseSystemPrompt}${platformContext}${realtimeContext}${documentContext}${attachmentContext}

CAPACITÉS:
- Accéder aux DONNÉES EN TEMPS RÉEL de la plateforme AETHER (ventes, employés, tickets, documents, etc.)
- Accéder aux informations VÉRIFIÉES via recherche web (météo, actualités, cours de bourse, etc.)
- Analyser des images (photos, captures d'écran, graphiques, schémas)
- Analyser tous types de documents (PDF, Word, texte)
- Rechercher dans la base de connaissances interne

INSTRUCTIONS CRITIQUES:
- Si des DONNÉES PLATEFORME AETHER sont fournies, utilise-les pour répondre aux questions sur l'entreprise
- Tu as accès aux deals, employés, tickets support, documents, workflows, alertes compliance, contacts CRM, et données ESG
- Réponds avec les données RÉELLES de l'entreprise, jamais avec des suppositions
- Pour les questions sur les ventes, employés, tickets, etc., base-toi UNIQUEMENT sur les données fournies
- TOUTES les informations que tu donnes doivent être 100% EXACTES et basées sur les données
- Si des DONNÉES EN TEMPS RÉEL (web) sont fournies, utilise-les EXCLUSIVEMENT pour ces sujets
- CITE TOUJOURS les sources quand tu utilises des données externes
- Réponds en français, de manière professionnelle, claire et concise
- Ne dis JAMAIS que tu n'as pas accès aux données de l'entreprise`;

    console.log(`Processing request: ${messages.length} messages, attachments: ${attachments?.length || 0}, platform: ${platformContext.length > 0}, docs: ${documentContext.length > 0}, realtime: ${realtimeContext.length > 0}`);

    // Prepare messages with image support
    const preparedMessages = messages.map((msg, idx) => {
      if (msg.role === 'user' && idx === messages.length - 1 && attachments?.some(a => a.type === 'image')) {
        const imageAttachments = attachments.filter(a => a.type === 'image');
        const textContent = typeof msg.content === 'string' ? msg.content : 
          (msg.content as any[])?.find(c => c.type === 'text')?.text || '';
        
        const content: any[] = [
          { type: 'text', text: textContent }
        ];
        
        for (const img of imageAttachments) {
          content.push({
            type: 'image_url',
            image_url: {
              url: img.content.startsWith('data:') ? img.content : `data:${img.mimeType || 'image/jpeg'};base64,${img.content}`
            }
          });
        }
        
        return { role: msg.role, content };
      }
      return msg;
    });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: enhancedSystemPrompt },
          ...preparedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Usage limit reached. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI service error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Error in ai-chat-stream function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
