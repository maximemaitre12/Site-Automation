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

// Score a company based on size and importance
function scoreCompany(company: any): number {
  let score = 0;
  
  // Category scoring (GE > ETI > PME > TPE)
  const category = company.categorie_entreprise || '';
  if (category === 'GE') score += 1000; // Grande Entreprise
  else if (category === 'ETI') score += 500; // Entreprise de Taille Intermédiaire
  else if (category === 'PME') score += 100; // Petite/Moyenne Entreprise
  
  // Employee count scoring
  const employeeCode = company.tranche_effectif_salarie || company.siege?.tranche_effectif_salarie || '00';
  const employeeScores: Record<string, number> = {
    '53': 500, '52': 400, '51': 300, '42': 200, '41': 150,
    '32': 100, '31': 80, '22': 60, '21': 40, '12': 20,
    '11': 10, '03': 5, '02': 2, '01': 1, '00': 0
  };
  score += employeeScores[employeeCode] || 0;
  
  // Financial data scoring (companies with financial data are more established)
  if (company.finances && Object.keys(company.finances).length > 0) {
    score += 50;
    const years = Object.keys(company.finances);
    const latestYear = years.sort().reverse()[0];
    const revenue = company.finances[latestYear]?.ca || 0;
    if (revenue > 1000000000) score += 500; // > 1B€
    else if (revenue > 100000000) score += 300; // > 100M€
    else if (revenue > 10000000) score += 100; // > 10M€
    else if (revenue > 1000000) score += 50; // > 1M€
  }
  
  // Active company scoring
  if (company.etat_administratif === 'A') score += 20;
  
  // Has dirigeants
  if (company.dirigeants && company.dirigeants.length > 0) score += 10;
  
  return score;
}

// Normalize company name for better matching
function normalizeCompanyName(name: string): string[] {
  const normalized = name.trim().toLowerCase();
  const variations: string[] = [name.trim()];
  
  // Remove common words and try variations
  const withoutSpaces = normalized.replace(/\s+/g, '');
  if (withoutSpaces !== normalized) {
    // Add version without spaces (e.g., "Total Energie" -> "TotalEnergie")
    variations.push(name.trim().replace(/\s+/g, ''));
  }
  
  // Common company name patterns
  const suffixes = [' se', ' sa', ' sas', ' sarl', ' groupe', ' group', ' france', ' energy', ' energies', ' énergie', ' énergies'];
  for (const suffix of suffixes) {
    if (!normalized.includes(suffix.trim())) {
      // Try adding common suffixes
      if (normalized.includes('total') || normalized.includes('energie') || normalized.includes('energy')) {
        variations.push(name.trim() + suffix.toUpperCase());
      }
    }
  }
  
  return [...new Set(variations)]; // Remove duplicates
}

// API Recherche Entreprises - data.gouv.fr (FREE & OFFICIAL)
// Now returns the BEST match (largest/most important company)
async function fetchFromDataGouv(query: string, queryType: string, existingCompanyData?: any): Promise<any> {
  try {
    let url = '';
    let perPage = 1;
    
    if (queryType === 'siren' || queryType === 'siret') {
      // Direct search by SIREN/SIRET - only one result needed
      url = `https://recherche-entreprises.api.gouv.fr/search?q=${query}&per_page=1`;
    } else {
      // Search by name - get multiple results to find the best one
      perPage = 25;
      url = `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(query)}&per_page=${perPage}`;
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
    
    // For name searches, score all results and pick the best one
    let company = data.results[0];
    const queryLower = query.toLowerCase().replace(/\s+/g, '');
    
    if (queryType === 'name' && data.results.length > 1) {
      console.log(`Found ${data.results.length} companies, scoring to find best match...`);
      
      // Score all companies
      const scoredResults = data.results.map((c: any) => {
        const companyNameLower = (c.nom_complet || '').toLowerCase();
        const companyNameNoSpaces = companyNameLower.replace(/\s+/g, '');
        
        // Calculate name similarity score
        let nameMatchScore = 0;
        if (companyNameLower.includes(query.toLowerCase())) {
          nameMatchScore = 500; // Exact substring match
        } else if (companyNameNoSpaces.includes(queryLower)) {
          nameMatchScore = 400; // Match without spaces (e.g., TotalEnergies vs Total Energie)
        } else if (query.toLowerCase().split(/\s+/).every(word => companyNameLower.includes(word))) {
          nameMatchScore = 300; // All words match
        }
        
        return {
          company: c,
          score: scoreCompany(c) + nameMatchScore,
          nameMatch: nameMatchScore
        };
      });
      
      // If we have existing CRM data, boost companies that match
      if (existingCompanyData) {
        for (const result of scoredResults) {
          // Check if SIREN matches
          if (existingCompanyData.siren && result.company.siren === existingCompanyData.siren) {
            result.score += 2000; // Strong match
            console.log(`SIREN match found: ${result.company.siren}`);
          }
          // Check if city matches
          if (existingCompanyData.city && result.company.siege?.libelle_commune?.toLowerCase() === existingCompanyData.city.toLowerCase()) {
            result.score += 100;
          }
        }
      }
      
      // Sort by score (highest first)
      scoredResults.sort((a: any, b: any) => b.score - a.score);
      
      // Log top 3 for debugging
      console.log('Top 3 scored companies:');
      scoredResults.slice(0, 3).forEach((r: any, i: number) => {
        console.log(`  ${i + 1}. ${r.company.nom_complet} (${r.company.categorie_entreprise || 'N/A'}) - Score: ${r.score} (name match: ${r.nameMatch})`);
      });
      
      company = scoredResults[0].company;
    }
    
    console.log(`Selected company: ${company.nom_complet} (${company.categorie_entreprise || 'N/A'})`);
    
    // Parse financial data if available
    let revenue = null;
    let revenueYear = null;
    let netIncome = null;
    
    if (company.finances && Object.keys(company.finances).length > 0) {
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
      capital: null,
      revenue: revenue,
      revenue_year: revenueYear,
      net_income: netIncome,
      employees_count: employeesCount,
      employees_range: employeesRange,
      executives: executives,
      is_active: company.etat_administratif === 'A',
      category: company.categorie_entreprise || null, // PME, ETI, GE
      data_source: 'API Recherche Entreprises (data.gouv.fr)',
      confidence: 95
    };
  } catch (error) {
    console.error('data.gouv.fr fetch error:', error);
    return null;
  }
}

// Find related data in existing database
async function findExistingData(supabase: any, userId: string, searchName: string): Promise<any> {
  try {
    // Search in CRM companies
    const { data: crmCompanies } = await supabase
      .from('crm_companies')
      .select('name, industry, city, country, website, employees_count, annual_revenue')
      .eq('user_id', userId)
      .ilike('name', `%${searchName}%`)
      .limit(5);
    
    // Search in enriched companies (already enriched)
    const { data: enrichedCompanies } = await supabase
      .from('enriched_companies')
      .select('name, siren, siret, city, website, employees_count, revenue')
      .eq('user_id', userId)
      .ilike('name', `%${searchName}%`)
      .limit(5);
    
    // Search in CRM contacts (companies linked to contacts)
    const { data: contacts } = await supabase
      .from('crm_contacts')
      .select(`
        company_id,
        crm_companies!inner(name, industry, city, website)
      `)
      .eq('user_id', userId)
      .limit(10);
    
    const relatedData: any = {
      crmCompanies: crmCompanies || [],
      enrichedCompanies: enrichedCompanies || [],
      fromContacts: []
    };
    
    // Extract unique companies from contacts
    if (contacts) {
      const seen = new Set();
      for (const c of contacts) {
        const company = (c as any).crm_companies;
        if (company && !seen.has(company.name)) {
          seen.add(company.name);
          relatedData.fromContacts.push(company);
        }
      }
    }
    
    console.log(`Found existing data: ${relatedData.crmCompanies.length} CRM companies, ${relatedData.enrichedCompanies.length} enriched, ${relatedData.fromContacts.length} from contacts`);
    
    // Find best match to use for cross-referencing
    let bestMatch = null;
    
    // Check enriched companies first (they have SIREN)
    for (const ec of relatedData.enrichedCompanies) {
      if (ec.name.toLowerCase().includes(searchName.toLowerCase().split(' ')[0])) {
        bestMatch = { ...ec, source: 'enriched' };
        break;
      }
    }
    
    // Check CRM companies
    if (!bestMatch) {
      for (const crm of relatedData.crmCompanies) {
        if (crm.name.toLowerCase().includes(searchName.toLowerCase().split(' ')[0])) {
          bestMatch = { ...crm, source: 'crm' };
          break;
        }
      }
    }
    
    return { relatedData, bestMatch };
  } catch (error) {
    console.error('Error finding existing data:', error);
    return { relatedData: null, bestMatch: null };
  }
}

// Fetch and analyze company website
async function analyzeWebsite(url: string): Promise<any> {
  try {
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
- Catégorie: ${companyData.category || 'N/A'} (GE=Grande Entreprise, ETI=Entreprise Taille Intermédiaire, PME=Petite/Moyenne Entreprise)
- Secteur NAF: ${companyData.naf_label || 'N/A'} (${companyData.naf_code || 'N/A'})
- Effectifs: ${companyData.employees_range || 'N/A'}
- CA ${companyData.revenue_year || ''}: ${companyData.revenue ? companyData.revenue.toLocaleString('fr-FR') + ' €' : 'N/A'}
- Résultat net: ${companyData.net_income ? companyData.net_income.toLocaleString('fr-FR') + ' €' : 'N/A'}
- Localisation: ${companyData.city || 'N/A'}
- Dirigeants: ${companyData.executives?.map((e: any) => `${e.name} (${e.role})`).join(', ') || 'N/A'}

Réponds en JSON STRICT (pas de markdown):
{
  "summary": "Résumé factuel en 2-3 phrases basé uniquement sur les données ci-dessus",
  "keywords": ["mot-clé1", "mot-clé2", "mot-clé3"],
  "industry_analysis": "Analyse du secteur ${companyData.naf_label || 'non spécifié'}",
  "competitive_position": "Position estimée basée sur la catégorie (${companyData.category || 'N/A'}) et la taille",
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

    // ========== STEP 0: Check existing database for context ==========
    console.log(`Step 0: Checking existing database for context on "${queryValue}"`);
    sourcesChecked.push('internal_database');
    
    let existingContext = null;
    if (queryType === 'name') {
      existingContext = await findExistingData(supabase, user.id, queryValue);
      if (existingContext?.bestMatch) {
        console.log(`Found existing data match: ${existingContext.bestMatch.name} (source: ${existingContext.bestMatch.source})`);
        dataSources.push('Base de données interne');
      }
    }

    // ========== STEP 1: Fetch from official API data.gouv.fr ==========
    console.log(`Step 1: Fetching from data.gouv.fr for ${queryType}: ${queryValue}`);
    sourcesChecked.push('api_data_gouv_fr');
    
    let officialData = null;
    
    // For name searches, try multiple variations to find the best match
    if (queryType === 'name') {
      const nameVariations = normalizeCompanyName(queryValue);
      console.log(`Trying ${nameVariations.length} name variations: ${nameVariations.join(', ')}`);
      
      let bestResult = null;
      let bestScore = 0;
      
      for (const variation of nameVariations) {
        const result = await fetchFromDataGouv(variation, queryType, existingContext?.bestMatch);
        if (result) {
          console.log(`Variation "${variation}" found: ${result.name} (category: ${result.category})`);
          
          // Calculate score based on company category
          let resultScore = 0;
          if (result.category === 'GE') resultScore = 1000;
          else if (result.category === 'ETI') resultScore = 500;
          else if (result.category === 'PME') resultScore = 100;
          
          // Add score for financial data
          if (result.revenue) resultScore += 200;
          if (result.employees_count) resultScore += 100;
          
          // Check if this result's name matches better
          const resultNameLower = (result.name || '').toLowerCase().replace(/\s+/g, '');
          const queryLower = queryValue.toLowerCase().replace(/\s+/g, '');
          const isNameMatch = resultNameLower.includes(queryLower) || queryLower.includes(resultNameLower.substring(0, 10));
          
          // Prioritize larger companies (GE > ETI > PME) with name match
          const adjustedScore = resultScore + (isNameMatch ? 500 : 0);
          console.log(`  -> Score: ${adjustedScore} (name match: ${isNameMatch})`);
          
          if (adjustedScore > bestScore) {
            bestScore = adjustedScore;
            bestResult = result;
          }
        }
      }
      
      officialData = bestResult;
    } else {
      // Direct SIREN/SIRET search
      officialData = await fetchFromDataGouv(queryValue, queryType, existingContext?.bestMatch);
    }
    
    if (!officialData) {
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
    
    console.log(`Selected best company: ${officialData.name} (${officialData.category || 'N/A'})`);
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
    
    // Use website from existing context if available
    if (!officialData.website && existingContext?.bestMatch?.website) {
      officialData.website = existingContext.bestMatch.website;
      console.log(`Using website from existing data: ${officialData.website}`);
    }
    
    // Try to find website from company name
    if (!officialData.website && officialData.name) {
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
      verification_status: 'verified',
      verification_date: new Date().toISOString(),
      last_enriched_at: new Date().toISOString(),
      enrichment_status: 'completed'
    };

    let savedCompany;
    
    if (existingCompany) {
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

    // ========== STEP 7: Update enrichment request ==========
    const processingTime = Date.now() - startTime;
    
    if (requestRecord) {
      await supabase
        .from('enrichment_requests')
        .update({
          status: 'completed',
          result_company_id: savedCompany.id,
          sources_checked: sourcesChecked,
          processing_time_ms: processingTime,
          completed_at: new Date().toISOString()
        })
        .eq('id', requestRecord.id);
    }

    console.log(`Enrichment completed in ${processingTime}ms`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        company: savedCompany,
        processingTime,
        sourcesChecked,
        dataSources
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Enrichment error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
