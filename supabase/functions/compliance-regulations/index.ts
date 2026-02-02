import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sources réglementaires officielles
const regulatorySources = [
  {
    id: 'gdpr_cnil',
    name: 'CNIL - RGPD',
    url: 'https://www.cnil.fr/fr/reglement-europeen-protection-donnees',
    type: 'gdpr'
  },
  {
    id: 'gdpr_eurlex',
    name: 'EUR-Lex - RGPD Officiel',
    url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32016R0679',
    type: 'gdpr'
  },
  {
    id: 'cnil_guide',
    name: 'CNIL - Guide pratique',
    url: 'https://www.cnil.fr/fr/guide-pratique-rgpd',
    type: 'cnil_guide'
  }
];

// Articles RGPD essentiels avec leur contenu officiel
const gdprArticles = [
  {
    article_code: 'art_5',
    title: 'Principes relatifs au traitement des données à caractère personnel',
    summary: 'Les données doivent être traitées de manière licite, loyale et transparente. Elles doivent être collectées pour des finalités déterminées, explicites et légitimes. La minimisation des données, l\'exactitude, la limitation de conservation et l\'intégrité/confidentialité sont obligatoires.',
    requirements: [
      'Licéité, loyauté, transparence du traitement',
      'Limitation des finalités',
      'Minimisation des données',
      'Exactitude des données',
      'Limitation de la conservation',
      'Intégrité et confidentialité'
    ]
  },
  {
    article_code: 'art_6',
    title: 'Licéité du traitement',
    summary: 'Le traitement n\'est licite que si au moins une des conditions suivantes est remplie : consentement, exécution d\'un contrat, obligation légale, sauvegarde des intérêts vitaux, mission d\'intérêt public, ou intérêts légitimes.',
    requirements: [
      'Consentement de la personne concernée',
      'Exécution d\'un contrat',
      'Respect d\'une obligation légale',
      'Sauvegarde des intérêts vitaux',
      'Exécution d\'une mission d\'intérêt public',
      'Intérêts légitimes du responsable'
    ]
  },
  {
    article_code: 'art_7',
    title: 'Conditions applicables au consentement',
    summary: 'Le responsable du traitement doit être en mesure de démontrer que la personne concernée a donné son consentement. Le consentement doit être présenté de manière claire et distincte, et peut être retiré à tout moment.',
    requirements: [
      'Preuve du consentement documentée',
      'Consentement libre, spécifique, éclairé et univoque',
      'Présentation claire et distincte',
      'Droit de retrait à tout moment'
    ]
  },
  {
    article_code: 'art_9',
    title: 'Traitement de catégories particulières de données',
    summary: 'Le traitement des données sensibles (origine raciale, opinions politiques, convictions religieuses, données génétiques, données de santé, vie sexuelle) est interdit sauf exceptions spécifiques.',
    requirements: [
      'Interdiction par défaut des données sensibles',
      'Exceptions limitées et documentées',
      'Consentement explicite requis',
      'Mesures de sécurité renforcées'
    ]
  },
  {
    article_code: 'art_12',
    title: 'Transparence des informations et communications',
    summary: 'Le responsable du traitement prend des mesures appropriées pour fournir à la personne concernée les informations visées aux articles 13 et 14, sous une forme concise, transparente, compréhensible et aisément accessible.',
    requirements: [
      'Information concise et transparente',
      'Langage clair et simple',
      'Réponse dans un délai d\'un mois',
      'Gratuité des informations'
    ]
  },
  {
    article_code: 'art_13',
    title: 'Informations à fournir lors de la collecte',
    summary: 'Lorsque des données sont collectées auprès de la personne concernée, le responsable du traitement fournit les informations suivantes : identité du responsable, finalités, destinataires, durée de conservation, droits.',
    requirements: [
      'Identité du responsable du traitement',
      'Coordonnées du DPO si applicable',
      'Finalités et base juridique',
      'Destinataires des données',
      'Durée de conservation',
      'Droits de la personne concernée'
    ]
  },
  {
    article_code: 'art_15',
    title: 'Droit d\'accès de la personne concernée',
    summary: 'La personne concernée a le droit d\'obtenir du responsable du traitement la confirmation que des données la concernant sont ou ne sont pas traitées et, lorsqu\'elles le sont, l\'accès auxdites données.',
    requirements: [
      'Confirmation du traitement',
      'Accès aux données',
      'Information sur les finalités',
      'Copie des données sur demande'
    ]
  },
  {
    article_code: 'art_17',
    title: 'Droit à l\'effacement (« droit à l\'oubli »)',
    summary: 'La personne concernée a le droit d\'obtenir du responsable du traitement l\'effacement de données à caractère personnel la concernant et le responsable du traitement a l\'obligation d\'effacer ces données dans les meilleurs délais.',
    requirements: [
      'Effacement sans délai excessif',
      'Notification aux tiers',
      'Exceptions documentées',
      'Procédure de demande claire'
    ]
  },
  {
    article_code: 'art_25',
    title: 'Protection des données dès la conception et par défaut',
    summary: 'Le responsable du traitement met en œuvre des mesures techniques et organisationnelles appropriées pour garantir que, par défaut, seules les données nécessaires sont traitées.',
    requirements: [
      'Privacy by design',
      'Privacy by default',
      'Pseudonymisation si possible',
      'Minimisation des données'
    ]
  },
  {
    article_code: 'art_32',
    title: 'Sécurité du traitement',
    summary: 'Le responsable du traitement et le sous-traitant mettent en œuvre les mesures techniques et organisationnelles appropriées afin de garantir un niveau de sécurité adapté au risque.',
    requirements: [
      'Pseudonymisation et chiffrement',
      'Confidentialité, intégrité, disponibilité',
      'Résilience des systèmes',
      'Tests et évaluations réguliers'
    ]
  },
  {
    article_code: 'art_33',
    title: 'Notification des violations de données',
    summary: 'En cas de violation de données à caractère personnel, le responsable du traitement notifie la violation à l\'autorité de contrôle compétente dans les 72 heures au plus tard.',
    requirements: [
      'Notification sous 72 heures',
      'Documentation de toute violation',
      'Description de la nature de la violation',
      'Mesures prises ou proposées'
    ]
  }
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');

    const { action = 'get', regulationType = 'gdpr' } = await req.json().catch(() => ({}));

    if (action === 'refresh' && firecrawlApiKey) {
      // Scraper les sources officielles pour mise à jour
      console.log('Refreshing regulatory content from official sources...');
      
      for (const source of regulatorySources) {
        try {
          const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${firecrawlApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: source.url,
              formats: ['markdown'],
              onlyMainContent: true,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`Scraped ${source.name}: ${data.data?.markdown?.length || 0} chars`);
            
            // Stocker le contenu scrapé comme métadonnées
            // (Le contenu principal reste les articles structurés ci-dessus)
          }
        } catch (e) {
          console.error(`Failed to scrape ${source.name}:`, e);
        }
      }
    }

    // Vérifier si les articles sont déjà en base
    const { data: existingRefs, error: checkError } = await supabase
      .from('regulatory_references')
      .select('article_code')
      .eq('regulation_type', 'gdpr');

    if (!existingRefs || existingRefs.length === 0) {
      // Insérer les articles RGPD
      console.log('Populating GDPR articles...');
      
      for (const article of gdprArticles) {
        const { error: insertError } = await supabase
          .from('regulatory_references')
          .upsert({
            regulation_type: 'gdpr',
            article_code: article.article_code,
            title: article.title,
            content: article.summary,
            source_url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32016R0679',
            source_name: 'EUR-Lex',
            metadata: { requirements: article.requirements },
            effective_date: '2018-05-25',
            is_current: true
          }, { onConflict: 'regulation_type,article_code' });

        if (insertError) {
          console.error(`Error inserting ${article.article_code}:`, insertError);
        }
      }
    }

    // Récupérer les références
    const { data: references, error: fetchError } = await supabase
      .from('regulatory_references')
      .select('*')
      .eq('regulation_type', regulationType)
      .eq('is_current', true)
      .order('article_code');

    if (fetchError) {
      throw new Error(`Failed to fetch regulations: ${fetchError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        regulationType,
        references: references || [],
        sources: regulatorySources.filter(s => s.type === regulationType || s.type === `${regulationType}_guide`),
        lastUpdated: references?.[0]?.last_scraped_at || new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Regulations fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
