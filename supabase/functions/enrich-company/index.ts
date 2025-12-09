import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnrichmentRequest {
  queryType: 'siren' | 'siret' | 'name' | 'website';
  queryValue: string;
}

// API Entreprise (données officielles françaises)
async function fetchFromAPIEntreprise(siren: string): Promise<any> {
  // Simulated official data - In production, use real API
  // Sources: api.insee.fr, api.pappers.fr, data.gouv.fr
  return null;
}

// Fetch and analyze company website
async function analyzeWebsite(url: string, aiKey: string): Promise<any> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'AETHER-Data-Bot/1.0' }
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    // Extract basic info from HTML
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    
    return {
      title: titleMatch?.[1]?.trim() || null,
      description: descMatch?.[1]?.trim() || null,
      htmlLength: html.length
    };
  } catch (e) {
    console.error('Website analysis error:', e);
    return null;
  }
}

// Use AI to analyze and enrich company data
async function enrichWithAI(companyData: any, aiKey: string): Promise<any> {
  const prompt = `Analyse cette entreprise et fournis des informations structurées.

Données disponibles:
- Nom: ${companyData.name || 'Non renseigné'}
- SIREN: ${companyData.siren || 'Non renseigné'}
- Site web: ${companyData.website || 'Non renseigné'}
- Secteur NAF: ${companyData.naf_label || 'Non renseigné'}
- Effectifs: ${companyData.employees_count || 'Non renseigné'}
- CA: ${companyData.revenue || 'Non renseigné'}€

Réponds en JSON avec ces champs:
{
  "summary": "Résumé de l'entreprise en 2-3 phrases",
  "keywords": ["mot1", "mot2", "mot3"],
  "industry_analysis": "Analyse du secteur d'activité",
  "competitive_position": "Position concurrentielle estimée",
  "risk_score": 0-100 (100 = risque élevé),
  "opportunity_score": 0-100 (100 = forte opportunité)
}`;

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${aiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Tu es un analyste d'entreprise expert. Réponds uniquement en JSON valide sans markdown." },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI enrichment failed:', response.status);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) return null;
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (e) {
    console.error('AI enrichment error:', e);
    return null;
  }
}

// Search for company using web search
async function searchCompanyOnWeb(query: string, aiKey: string): Promise<any> {
  const prompt = `Recherche des informations sur cette entreprise française: "${query}"

Fournis les informations que tu connais de manière FACTUELLE et VÉRIFIABLE.
Si tu n'es pas certain d'une information, ne l'inclus pas.

Réponds en JSON strict:
{
  "name": "Nom officiel de l'entreprise",
  "siren": "Numéro SIREN si connu (9 chiffres)",
  "siret": "Numéro SIRET si connu (14 chiffres)",
  "legal_form": "Forme juridique (SAS, SARL, SA, etc.)",
  "naf_code": "Code NAF/APE si connu",
  "naf_label": "Libellé du secteur d'activité",
  "address": "Adresse du siège social",
  "postal_code": "Code postal",
  "city": "Ville",
  "website": "Site web officiel",
  "linkedin_url": "Page LinkedIn entreprise",
  "capital": "Capital social en euros (nombre)",
  "employees_count": "Nombre d'employés estimé (nombre)",
  "employees_range": "Tranche d'effectifs",
  "creation_date": "Date de création (YYYY-MM-DD)",
  "executives": [{"name": "Nom", "role": "Fonction"}],
  "revenue": "Chiffre d'affaires estimé en euros (nombre)",
  "revenue_year": "Année du CA",
  "confidence": 0-100 (confiance dans les données)
}

IMPORTANT: Ne fournis QUE des informations vérifiables. Mets null pour les champs inconnus.`;

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${aiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: "Tu es un assistant de recherche d'entreprises. Tu fournis uniquement des informations factuelles et vérifiables. Si tu n'es pas certain, indique null. Réponds uniquement en JSON valide." },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Web search failed:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) return null;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (e) {
    console.error('Web search error:', e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const aiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { queryType, queryValue }: EnrichmentRequest = await req.json();
    
    if (!queryType || !queryValue) {
      return new Response(
        JSON.stringify({ error: 'queryType and queryValue are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const startTime = Date.now();
    const sourcesChecked: string[] = [];
    
    // Create enrichment request record
    const { data: requestRecord, error: requestError } = await supabase
      .from('enrichment_requests')
      .insert({
        user_id: user.id,
        query_type: queryType,
        query_value: queryValue,
        status: 'processing'
      })
      .select()
      .single();

    if (requestError) {
      console.error('Failed to create request record:', requestError);
    }

    let companyData: any = null;
    
    // Step 1: Search for company data
    sourcesChecked.push('ai_knowledge_base');
    const webSearchResult = await searchCompanyOnWeb(queryValue, aiKey);
    
    if (webSearchResult) {
      companyData = {
        ...webSearchResult,
        data_sources: ['AI Knowledge Base'],
        confidence_score: webSearchResult.confidence || 50,
      };
    }

    if (!companyData) {
      // Update request as failed
      if (requestRecord) {
        await supabase
          .from('enrichment_requests')
          .update({
            status: 'failed',
            error_message: 'Aucune information trouvée pour cette recherche',
            sources_checked: sourcesChecked,
            processing_time_ms: Date.now() - startTime,
            completed_at: new Date().toISOString()
          })
          .eq('id', requestRecord.id);
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Aucune information trouvée pour cette recherche' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Analyze website if available
    if (companyData.website) {
      sourcesChecked.push('website_analysis');
      const websiteData = await analyzeWebsite(companyData.website, aiKey);
      if (websiteData) {
        companyData.website_title = websiteData.title;
        companyData.website_description = websiteData.description;
        companyData.data_sources.push('Website Analysis');
      }
    }

    // Step 3: AI enrichment for analysis
    sourcesChecked.push('ai_analysis');
    const aiEnrichment = await enrichWithAI(companyData, aiKey);
    
    if (aiEnrichment) {
      companyData.ai_summary = aiEnrichment.summary;
      companyData.ai_keywords = aiEnrichment.keywords;
      companyData.ai_industry_analysis = aiEnrichment.industry_analysis;
      companyData.ai_competitive_position = aiEnrichment.competitive_position;
      companyData.ai_risk_score = aiEnrichment.risk_score;
      companyData.ai_opportunity_score = aiEnrichment.opportunity_score;
      companyData.data_sources.push('AI Analysis');
    }

    // Step 4: Save to database
    const companyInsert = {
      user_id: user.id,
      name: companyData.name || queryValue,
      siren: companyData.siren,
      siret: companyData.siret,
      legal_form: companyData.legal_form,
      naf_code: companyData.naf_code,
      naf_label: companyData.naf_label,
      address: companyData.address,
      postal_code: companyData.postal_code,
      city: companyData.city,
      country: companyData.country || 'France',
      website: companyData.website,
      linkedin_url: companyData.linkedin_url,
      capital: companyData.capital ? parseFloat(companyData.capital) : null,
      revenue: companyData.revenue ? parseFloat(companyData.revenue) : null,
      revenue_year: companyData.revenue_year,
      employees_count: companyData.employees_count ? parseInt(companyData.employees_count) : null,
      employees_range: companyData.employees_range,
      executives: companyData.executives || [],
      creation_date: companyData.creation_date,
      ai_summary: companyData.ai_summary,
      ai_keywords: companyData.ai_keywords || [],
      ai_industry_analysis: companyData.ai_industry_analysis,
      ai_competitive_position: companyData.ai_competitive_position,
      ai_risk_score: companyData.ai_risk_score,
      ai_opportunity_score: companyData.ai_opportunity_score,
      data_sources: companyData.data_sources,
      confidence_score: companyData.confidence_score,
      verification_status: companyData.confidence_score >= 70 ? 'verified' : 'partial',
      verification_date: new Date().toISOString(),
      last_enriched_at: new Date().toISOString(),
      enrichment_status: 'completed'
    };

    const { data: savedCompany, error: saveError } = await supabase
      .from('enriched_companies')
      .insert(companyInsert)
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save company:', saveError);
      return new Response(
        JSON.stringify({ success: false, error: 'Erreur lors de la sauvegarde' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update enrichment request
    if (requestRecord) {
      await supabase
        .from('enrichment_requests')
        .update({
          status: 'completed',
          result_company_id: savedCompany.id,
          sources_checked: sourcesChecked,
          processing_time_ms: Date.now() - startTime,
          completed_at: new Date().toISOString()
        })
        .eq('id', requestRecord.id);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        company: savedCompany,
        sourcesChecked,
        processingTime: Date.now() - startTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Enrichment error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
