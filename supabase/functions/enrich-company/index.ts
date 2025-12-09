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

// API Recherche Entreprises - data.gouv.fr (FREE & OFFICIAL)
// Source: https://recherche-entreprises.api.gouv.fr/
async function fetchFromDataGouv(query: string, queryType: string): Promise<any> {
  try {
    let url = '';
    
    if (queryType === 'siren' || queryType === 'siret') {
      // Direct search by SIREN/SIRET
      url = `https://recherche-entreprises.api.gouv.fr/search?q=${query}&per_page=1`;
    } else {
      // Search by name
      url = `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(query)}&per_page=5`;
    }
    
    console.log(`Fetching from data.gouv.fr: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AETHER-Data/1.0'
      }
    });
    
    if (!response.ok) {
      console.error(`data.gouv.fr API error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.log('No results from data.gouv.fr');
      return null;
    }
    
    // Get the best match (first result)
    const company = data.results[0];
    console.log(`Found company: ${company.nom_complet}`);
    
    // Parse financial data if available
    let revenue = null;
    let revenueYear = null;
    let netIncome = null;
    
    if (company.finances && Object.keys(company.finances).length > 0) {
      // Get most recent year
      const years = Object.keys(company.finances).sort().reverse();
      if (years.length > 0) {
        revenueYear = parseInt(years[0]);
        const financeData = company.finances[years[0]];
        revenue = financeData.ca || null;
        netIncome = financeData.resultat_net || null;
      }
    }
    
    // Parse executives/dirigeants
    const executives = [];
    if (company.dirigeants && Array.isArray(company.dirigeants)) {
      for (const d of company.dirigeants) {
        executives.push({
          name: d.prenoms ? `${d.prenoms} ${d.nom}` : d.denomination,
          role: d.qualite || 'Dirigeant'
        });
      }
    }
    
    // Map employee range
    const employeeRanges: Record<string, string> = {
      '00': '0 salarié',
      '01': '1-2 salariés',
      '02': '3-5 salariés',
      '03': '6-9 salariés',
      '11': '10-19 salariés',
      '12': '20-49 salariés',
      '21': '50-99 salariés',
      '22': '100-199 salariés',
      '31': '200-249 salariés',
      '32': '250-499 salariés',
      '41': '500-999 salariés',
      '42': '1000-1999 salariés',
      '51': '2000-4999 salariés',
      '52': '5000-9999 salariés',
      '53': '10000+ salariés'
    };
    
    const employeeCode = company.tranche_effectif_salarie || company.siege?.tranche_effectif_salarie;
    const employeesRange = employeeRanges[employeeCode] || null;
    
    // Estimate employee count from range
    const employeeEstimates: Record<string, number> = {
      '00': 0, '01': 2, '02': 4, '03': 8, '11': 15, '12': 35,
      '21': 75, '22': 150, '31': 225, '32': 375, '41': 750,
      '42': 1500, '51': 3500, '52': 7500, '53': 15000
    };
    const employeesCount = employeeEstimates[employeeCode] || null;
    
    return {
      name: company.nom_complet,
      siren: company.siren,
      siret: company.siege?.siret || null,
      legal_form: company.nature_juridique || null,
      naf_code: company.activite_principale || null,
      naf_label: company.libelle_activite_principale || null,
      address: company.siege?.adresse || null,
      postal_code: company.siege?.code_postal || null,
      city: company.siege?.libelle_commune || null,
      latitude: company.siege?.latitude || null,
      longitude: company.siege?.longitude || null,
      creation_date: company.date_creation || null,
      capital: null, // Not available in this API
      revenue: revenue,
      revenue_year: revenueYear,
      net_income: netIncome,
      employees_count: employeesCount,
      employees_range: employeesRange,
      executives: executives,
      is_active: company.etat_administratif === 'A',
      category: company.categorie_entreprise || null, // PME, ETI, GE
      data_source: 'API Recherche Entreprises (data.gouv.fr)',
      confidence: 95 // Official data = high confidence
    };
  } catch (error) {
    console.error('data.gouv.fr fetch error:', error);
    return null;
  }
}

// Fetch and analyze company website
async function analyzeWebsite(url: string): Promise<any> {
  try {
    // Ensure URL has protocol
    let fullUrl = url;
    if (!url.startsWith('http')) {
      fullUrl = `https://${url}`;
    }
    
    const response = await fetch(fullUrl, {
      headers: { 'User-Agent': 'AETHER-Data-Bot/1.0' }
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    
    // Try to find social links
    const linkedinMatch = html.match(/https?:\/\/(www\.)?linkedin\.com\/company\/[^"'\s]+/i);
    const twitterMatch = html.match(/https?:\/\/(www\.)?(twitter|x)\.com\/[^"'\s]+/i);
    
    return {
      title: titleMatch?.[1]?.trim() || null,
      description: descMatch?.[1]?.trim() || null,
      linkedin_url: linkedinMatch?.[0] || null,
      twitter_url: twitterMatch?.[0] || null
    };
  } catch (e) {
    console.error('Website analysis error:', e);
    return null;
  }
}

// Use AI for analysis only (not data generation)
async function analyzeWithAI(companyData: any, aiKey: string): Promise<any> {
  const prompt = `Analyse cette entreprise française basée sur les données OFFICIELLES suivantes.
Tu dois UNIQUEMENT analyser et interpréter ces données, PAS inventer de nouvelles informations.

Données officielles (source: API Recherche Entreprises - data.gouv.fr):
- Nom: ${companyData.name}
- SIREN: ${companyData.siren || 'N/A'}
- Secteur NAF: ${companyData.naf_label || 'N/A'} (${companyData.naf_code || 'N/A'})
- Effectifs: ${companyData.employees_range || 'N/A'}
- Catégorie: ${companyData.category || 'N/A'}
- CA ${companyData.revenue_year || ''}: ${companyData.revenue ? companyData.revenue.toLocaleString('fr-FR') + ' €' : 'N/A'}
- Résultat net: ${companyData.net_income ? companyData.net_income.toLocaleString('fr-FR') + ' €' : 'N/A'}
- Localisation: ${companyData.city || 'N/A'}
- Dirigeants: ${companyData.executives?.map((e: any) => `${e.name} (${e.role})`).join(', ') || 'N/A'}

Réponds en JSON STRICT (pas de markdown):
{
  "summary": "Résumé factuel en 2-3 phrases basé uniquement sur les données ci-dessus",
  "keywords": ["mot-clé1", "mot-clé2", "mot-clé3"],
  "industry_analysis": "Analyse du secteur ${companyData.naf_label || 'non spécifié'}",
  "competitive_position": "Position estimée basée sur la taille et le CA",
  "risk_score": 0-100 (basé sur les données financières, 0=sain, 100=risqué),
  "opportunity_score": 0-100 (basé sur le secteur et la croissance)
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
          { role: "system", content: "Tu es un analyste d'entreprise. Tu analyses UNIQUEMENT les données fournies, tu n'inventes rien. Réponds en JSON valide sans markdown." },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI analysis failed:', response.status);
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
    console.error('AI analysis error:', e);
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
    const dataSources: string[] = [];
    
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

    // ========== STEP 1: Fetch from official API data.gouv.fr ==========
    console.log(`Step 1: Fetching from data.gouv.fr for ${queryType}: ${queryValue}`);
    sourcesChecked.push('api_data_gouv_fr');
    
    const officialData = await fetchFromDataGouv(queryValue, queryType);
    
    if (!officialData) {
      // Update request as failed
      if (requestRecord) {
        await supabase
          .from('enrichment_requests')
          .update({
            status: 'failed',
            error_message: 'Aucune entreprise trouvée dans les registres officiels',
            sources_checked: sourcesChecked,
            processing_time_ms: Date.now() - startTime,
            completed_at: new Date().toISOString()
          })
          .eq('id', requestRecord.id);
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Aucune entreprise trouvée dans les registres officiels (INSEE/RCS)' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    dataSources.push('Registre officiel (data.gouv.fr)');
    
    // ========== STEP 2: Check for duplicates by SIREN ==========
    console.log(`Step 2: Checking for duplicates with SIREN: ${officialData.siren}`);
    
    let existingCompany = null;
    if (officialData.siren) {
      const { data: existing } = await supabase
        .from('enriched_companies')
        .select('id')
        .eq('user_id', user.id)
        .eq('siren', officialData.siren)
        .maybeSingle();
      
      existingCompany = existing;
    }
    
    // ========== STEP 3: Analyze website if we can find one ==========
    let websiteData = null;
    
    // Try to find website from company name
    if (!officialData.website && officialData.name) {
      // Common patterns for French company websites
      const cleanName = officialData.name.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20);
      
      const possibleUrls = [
        `https://www.${cleanName}.fr`,
        `https://www.${cleanName}.com`,
        `https://${cleanName}.fr`,
      ];
      
      for (const url of possibleUrls) {
        try {
          const testResponse = await fetch(url, { 
            method: 'HEAD',
            headers: { 'User-Agent': 'AETHER-Data-Bot/1.0' }
          });
          if (testResponse.ok) {
            officialData.website = url;
            break;
          }
        } catch {
          // Continue to next URL
        }
      }
    }
    
    if (officialData.website) {
      console.log(`Step 3: Analyzing website: ${officialData.website}`);
      sourcesChecked.push('website_analysis');
      websiteData = await analyzeWebsite(officialData.website);
      
      if (websiteData) {
        dataSources.push('Site web');
        if (websiteData.linkedin_url) {
          officialData.linkedin_url = websiteData.linkedin_url;
        }
        if (websiteData.twitter_url) {
          officialData.twitter_url = websiteData.twitter_url;
        }
      }
    }

    // ========== STEP 4: AI Analysis (interpretation only) ==========
    console.log('Step 4: AI Analysis');
    sourcesChecked.push('ai_analysis');
    
    const aiAnalysis = await analyzeWithAI(officialData, aiKey);
    
    if (aiAnalysis) {
      dataSources.push('Analyse IA');
    }

    // ========== STEP 5: Save or Update company ==========
    const companyData = {
      user_id: user.id,
      name: officialData.name,
      siren: officialData.siren,
      siret: officialData.siret,
      legal_form: officialData.legal_form,
      naf_code: officialData.naf_code,
      naf_label: officialData.naf_label,
      address: officialData.address,
      postal_code: officialData.postal_code,
      city: officialData.city,
      country: 'France',
      latitude: officialData.latitude,
      longitude: officialData.longitude,
      website: officialData.website,
      linkedin_url: officialData.linkedin_url,
      twitter_url: officialData.twitter_url,
      capital: officialData.capital,
      revenue: officialData.revenue,
      revenue_year: officialData.revenue_year,
      net_income: officialData.net_income,
      employees_count: officialData.employees_count,
      employees_range: officialData.employees_range,
      executives: officialData.executives,
      creation_date: officialData.creation_date,
      ai_summary: aiAnalysis?.summary || null,
      ai_keywords: aiAnalysis?.keywords || [],
      ai_industry_analysis: aiAnalysis?.industry_analysis || null,
      ai_competitive_position: aiAnalysis?.competitive_position || null,
      ai_risk_score: aiAnalysis?.risk_score || null,
      ai_opportunity_score: aiAnalysis?.opportunity_score || null,
      data_sources: dataSources,
      confidence_score: officialData.confidence,
      verification_status: 'verified', // Official data = verified
      verification_date: new Date().toISOString(),
      last_enriched_at: new Date().toISOString(),
      enrichment_status: 'completed'
    };

    let savedCompany;
    
    if (existingCompany) {
      // Update existing company
      console.log(`Updating existing company: ${existingCompany.id}`);
      const { data, error } = await supabase
        .from('enriched_companies')
        .update(companyData)
        .eq('id', existingCompany.id)
        .select()
        .single();
      
      if (error) {
        console.error('Failed to update company:', error);
        throw error;
      }
      savedCompany = data;
    } else {
      // Insert new company
      console.log('Inserting new company');
      const { data, error } = await supabase
        .from('enriched_companies')
        .insert(companyData)
        .select()
        .single();
      
      if (error) {
        console.error('Failed to save company:', error);
        throw error;
      }
      savedCompany = data;
    }

    // ========== STEP 6: Save financial data ==========
    if (officialData.revenue && officialData.revenue_year) {
      console.log(`Step 6: Saving financial data for year ${officialData.revenue_year}`);
      
      // Check if financial record exists
      const { data: existingFinancial } = await supabase
        .from('company_financials')
        .select('id')
        .eq('company_id', savedCompany.id)
        .eq('fiscal_year', officialData.revenue_year)
        .maybeSingle();
      
      const financialData = {
        company_id: savedCompany.id,
        user_id: user.id,
        fiscal_year: officialData.revenue_year,
        revenue: officialData.revenue,
        net_income: officialData.net_income,
        source: 'API Recherche Entreprises (data.gouv.fr)',
        source_date: new Date().toISOString().split('T')[0],
        is_verified: true
      };
      
      if (existingFinancial) {
        await supabase
          .from('company_financials')
          .update(financialData)
          .eq('id', existingFinancial.id);
      } else {
        await supabase
          .from('company_financials')
          .insert(financialData);
      }
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

    const wasUpdated = !!existingCompany;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        company: savedCompany,
        sourcesChecked,
        dataSources,
        processingTime: Date.now() - startTime,
        wasUpdated
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
