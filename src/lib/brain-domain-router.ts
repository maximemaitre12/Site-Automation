/**
 * Brain Domain Router - Intelligent context routing for AETHER Brain
 * 
 * This module identifies which domain(s) a user question relates to
 * and returns only the relevant domains to fetch, minimizing token usage.
 */

export type BrainDomain = 
  | 'flow'      // Workflows, automations
  | 'sales'     // Deals, pipeline, proposals
  | 'hr'        // Candidates, employees, interviews
  | 'support'   // Tickets, customer issues
  | 'doc'       // Documents, files
  | 'compliance'// Alerts, ESG, regulations
  | 'data'      // Enriched companies, CRM
  | 'general';  // Platform overview

interface DomainPattern {
  domain: BrainDomain;
  patterns: RegExp[];
  priority: number; // Higher = more specific
}

const DOMAIN_PATTERNS: DomainPattern[] = [
  {
    domain: 'flow',
    priority: 10,
    patterns: [
      /workflows?/i,
      /automatisations?/i,
      /flux\s*(de travail|automatis)/i,
      /automatiser/i,
      /n8n|zapier/i,
      /d[eé]clencheur|trigger/i,
      /ex[eé]cution\s*(de|du|des)?\s*(flux|workflow)/i,
      /blocs?\s*(de)?\s*(workflow|flux)/i,
      /workflow\s*(actif|inactif|erreur)/i,
    ]
  },
  {
    domain: 'sales',
    priority: 10,
    patterns: [
      /deals?/i,
      /opportunit[eé]s?/i,
      /pipeline/i,
      /ventes?/i,
      /prospects?/i,
      /n[eé]gociation/i,
      /propositions?\s*(commerciales?)?/i,
      /chiffre\s*d'affaires?/i,
      /CA\b/i,
      /clients?\s*(potentiels?)?/i,
      /closing/i,
      /pr[eé]sentation\s*(commerciale|client)/i,
    ]
  },
  {
    domain: 'hr',
    priority: 10,
    patterns: [
      /candidats?/i,
      /employ[eé]s?/i,
      /recrutements?/i,
      /entretiens?|interviews?/i,
      /CV|curriculum/i,
      /embauches?/i,
      /salari[eé]s?/i,
      /postes?\s*(ouverts?|vacants?)?/i,
      /offres?\s*d'emploi/i,
      /RH|ressources?\s*humaines?/i,
      /performance\s*(des?)?\s*(employ[eé]s?)?/i,
      /d[eé]partements?/i,
      /[eé]quipe|team/i,
      /effectif/i,
    ]
  },
  {
    domain: 'support',
    priority: 10,
    patterns: [
      /tickets?/i,
      /demandes?\s*(de)?\s*(support|aide)/i,
      /r[eé]clamations?/i,
      /incidents?/i,
      /probl[eè]mes?\s*(clients?|techniques?)/i,
      /satisfaction\s*(client)?/i,
      /SLA/i,
      /temps\s*de\s*r[eé]ponse/i,
      /r[eé]solution/i,
    ]
  },
  {
    domain: 'doc',
    priority: 10,
    patterns: [
      /documents?/i,
      /fichiers?/i,
      /contrats?/i,
      /rapports?/i,
      /g[eé]n[eé]r[eé]\s*(un|le|des?)?\s*(document|rapport|contrat)/i,
      /templates?|mod[eè]les?/i,
      /archiv/i,
      /stockage/i,
    ]
  },
  {
    domain: 'compliance',
    priority: 10,
    patterns: [
      /conformit[eé]/i,
      /compliance/i,
      /ESG/i,
      /r[eé]glementations?/i,
      /RGPD|GDPR/i,
      /alertes?\s*(de)?\s*(conformit[eé]|compliance)/i,
      /audit/i,
      /risques?\s*(de)?\s*(conformit[eé])?/i,
      /KPIs?\s*(ESG)?/i,
      /environnement(al)?/i,
      /gouvernance/i,
      /social\s*(et)?\s*(environnement)?/i,
    ]
  },
  {
    domain: 'data',
    priority: 10,
    patterns: [
      /entreprises?\s*(enrichies?)?/i,
      /soci[eé]t[eé]s?/i,
      /CRM/i,
      /contacts?\s*(CRM)?/i,
      /enrichissement/i,
      /donn[eé]es?\s*(entreprises?|soci[eé]t[eé]s?)/i,
      /SIREN|SIRET/i,
      /fiches?\s*(entreprises?|soci[eé]t[eé]s?)/i,
      /informations?\s*(financi[eè]res?|l[eé]gales?)/i,
    ]
  },
  {
    domain: 'general',
    priority: 1,
    patterns: [
      /tableau\s*de\s*bord/i,
      /dashboard/i,
      /r[eé]sum[eé]/i,
      /vue\s*d'ensemble/i,
      /overview/i,
      /statistiques?\s*(g[eé]n[eé]rales?)?/i,
      /activit[eé]\s*(r[eé]cente)?/i,
      /plateforme/i,
      /mes\s*donn[eé]es/i,
      /tout(es)?\s*(mes|les)?\s*(donn[eé]es|infos?)/i,
    ]
  }
];

/**
 * Detects which domain(s) the user's question relates to
 * Returns an array of domains sorted by relevance
 */
export function detectDomains(message: string): BrainDomain[] {
  const normalizedMessage = message.toLowerCase().trim();
  const matchedDomains: { domain: BrainDomain; priority: number; matchCount: number }[] = [];
  
  for (const domainConfig of DOMAIN_PATTERNS) {
    let matchCount = 0;
    for (const pattern of domainConfig.patterns) {
      if (pattern.test(normalizedMessage)) {
        matchCount++;
      }
    }
    
    if (matchCount > 0) {
      matchedDomains.push({
        domain: domainConfig.domain,
        priority: domainConfig.priority,
        matchCount
      });
    }
  }
  
  // Sort by match count (more matches = more relevant) then by priority
  matchedDomains.sort((a, b) => {
    if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
    return b.priority - a.priority;
  });
  
  const domains = matchedDomains.map(m => m.domain);
  
  // If 'general' is the only match, or no matches, return general
  if (domains.length === 0) {
    // Check if it's a platform question at all
    if (isPlatformQuestion(message)) {
      return ['general'];
    }
    return [];
  }
  
  // If general is matched along with specific domains, prioritize specific
  if (domains.includes('general') && domains.length > 1) {
    return domains.filter(d => d !== 'general');
  }
  
  // Limit to max 3 domains to avoid too much context
  return domains.slice(0, 3);
}

/**
 * Checks if message is asking about platform data at all
 */
export function isPlatformQuestion(message: string): boolean {
  const generalPatterns = [
    /combien/i,
    /quels?\s*(sont)?/i,
    /liste/i,
    /montre/i,
    /affiche/i,
    /r[eé]sum[eé]/i,
    /stats?|statistiques?/i,
    /donn[eé]es?/i,
    /mes\s+\w+/i, // "mes X"
    /how\s*many/i,
    /show\s*(me)?/i,
    /list/i,
    /what\s*(are|is)/i,
  ];
  
  const normalizedMessage = message.toLowerCase().trim();
  return generalPatterns.some(p => p.test(normalizedMessage));
}

/**
 * Generates a compact context description for each domain
 * This tells the AI what data is available without sending all the data
 */
export function getDomainDescription(domain: BrainDomain): string {
  const descriptions: Record<BrainDomain, string> = {
    flow: 'Workflows et automatisations (nom, statut actif/inactif, dernière exécution)',
    sales: 'Deals commerciaux (entreprise, valeur, statut, probabilité, prochaine étape)',
    hr: 'Candidats et employés (nom, poste, statut, score matching, département)',
    support: 'Tickets support (titre, priorité, statut, catégorie, assigné)',
    doc: 'Documents (titre, type, résumé IA, tags)',
    compliance: 'Alertes conformité et KPIs ESG (titre, sévérité, statut)',
    data: 'Entreprises enrichies et contacts CRM (nom, secteur, CA, score santé)',
    general: 'Vue d\'ensemble de toutes les données de la plateforme',
  };
  return descriptions[domain];
}
