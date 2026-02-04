/**
 * SENIOR DOCUMENT INTELLIGENCE ENGINE v2.0
 * ==========================================
 * 
 * Système d'intelligence documentaire de niveau Partner/C-Suite
 * pour la génération de documents professionnels "board-ready"
 * 
 * Architecture:
 * 1. ContextAnalyzer - Analyse contextuelle multi-dimensionnelle
 * 2. DocumentClassifier - Classification ML-like avec scoring avancé
 * 3. SeniorPromptEngine - Prompts ultra-spécialisés par industrie
 * 4. ContentEnricher - Enrichissement automatique professionnel
 * 5. QualityValidator - Validation multiniveau et scoring
 * 6. StyleEngine - Application du style C-Level adaptatif
 */

// ============================================================================
// TYPES & INTERFACES AVANCÉES
// ============================================================================

export type DocumentCategory = 
  | 'purchase_order'      // Bon de commande
  | 'invoice'             // Facture
  | 'quote'               // Devis
  | 'contract'            // Contrat
  | 'memo'                // Note de service
  | 'meeting_notes'       // Compte-rendu de réunion
  | 'letter'              // Lettre formelle
  | 'report'              // Rapport d'analyse
  | 'proposal'            // Proposition commerciale
  | 'email'               // Email professionnel
  | 'procedure'           // Procédure interne
  | 'specification'       // Cahier des charges
  | 'audit_report'        // Rapport d'audit
  | 'policy'              // Politique d'entreprise
  | 'executive_brief'     // Brief exécutif
  | 'board_memo'          // Mémo conseil d'administration
  | 'investment_memo'     // Mémo d'investissement
  | 'due_diligence'       // Rapport Due Diligence
  | 'strategic_plan'      // Plan stratégique
  | 'generic';            // Document générique

export type IndustryContext = 
  | 'finance' | 'consulting' | 'technology' | 'healthcare' 
  | 'manufacturing' | 'retail' | 'legal' | 'energy' 
  | 'real_estate' | 'public_sector' | 'generic';

export type DocumentTone = 
  | 'executive' | 'formal' | 'professional' | 'technical' | 'persuasive';

export type AudienceLevel = 
  | 'board' | 'c_suite' | 'director' | 'manager' | 'operational';

export interface DocumentContext {
  title: string;
  userPrompt?: string;
  variables?: Record<string, string>;
  companyName?: string;
  authorName?: string;
  department?: string;
  industry?: IndustryContext;
  audience?: AudienceLevel;
}

export interface ClassificationResult {
  category: DocumentCategory;
  confidence: number;
  secondaryCategory?: DocumentCategory;
  detectedKeywords: string[];
  suggestedSections: string[];
  industry: IndustryContext;
  tone: DocumentTone;
  audience: AudienceLevel;
  complexity: 'simple' | 'standard' | 'complex' | 'executive';
}

export interface SeniorPromptConfig {
  systemPrompt: string;
  structureGuide: string[];
  vocabularyBank: string[];
  forbiddenPatterns: string[];
  qualityChecklist: string[];
  styleDirectives: string[];
  dataRequirements: string[];
}

export interface EnrichedData {
  reference: string;
  dateFormatted: string;
  fiscalInfo: {
    siret: string;
    tvaIntra: string;
    rcs: string;
    capital: string;
    naf: string;
  };
  amounts?: {
    subtotalHT: string;
    tva: string;
    totalTTC: string;
    currency: string;
  };
  addresses?: {
    sender: string;
    recipient: string;
  };
  banking?: {
    iban: string;
    bic: string;
    bank: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  issues: ValidationIssue[];
  suggestions: string[];
  cleanedContent: string;
  qualityMetrics: QualityMetrics;
}

export interface ValidationIssue {
  type: 'critical' | 'major' | 'minor' | 'info';
  code: string;
  message: string;
  location?: string;
  autoFixed: boolean;
}

export interface QualityMetrics {
  professionalismScore: number;
  structureScore: number;
  clarityScore: number;
  completenessScore: number;
  formattingScore: number;
  dataAccuracyScore: number;
  overallScore: number;
}

// ============================================================================
// CLASSIFICATION ENGINE AVANCÉ
// ============================================================================

const CLASSIFICATION_PATTERNS: Record<DocumentCategory, {
  keywords: string[];
  phrases: string[];
  weight: number;
  regex?: RegExp[];
  industryHints?: IndustryContext[];
  audienceDefault?: AudienceLevel;
  toneDefault?: DocumentTone;
}> = {
  purchase_order: {
    keywords: ['bon de commande', 'purchase order', 'commande fournisseur', 'ordre d\'achat', 'bc', 'po'],
    phrases: ['demande de commande', 'passation de commande', 'articles commandés', 'conditions de livraison'],
    weight: 10,
    regex: [/bc[-\s]?\d+/i, /po[-\s]?\d+/i, /commande\s+n[°o]?\s*\d+/i, /order\s+#?\d+/i],
    industryHints: ['manufacturing', 'retail'],
    audienceDefault: 'operational',
    toneDefault: 'professional'
  },
  invoice: {
    keywords: ['facture', 'invoice', 'facturation', 'règlement', 'échéance', 'avoir'],
    phrases: ['montant à régler', 'date d\'échéance', 'conditions de paiement', 'pénalités de retard'],
    weight: 10,
    regex: [/fa[-\s]?\d+/i, /inv[-\s]?\d+/i, /facture\s+n[°o]?\s*\d+/i, /av[-\s]?\d+/i],
    audienceDefault: 'operational',
    toneDefault: 'formal'
  },
  quote: {
    keywords: ['devis', 'quotation', 'offre commerciale', 'proposition tarifaire', 'estimation', 'chiffrage', 'offre de prix'],
    phrases: ['validité de l\'offre', 'proposition commerciale', 'engagement de prix', 'budget estimatif'],
    weight: 9,
    regex: [/dev[-\s]?\d+/i, /qt[-\s]?\d+/i, /devis\s+n[°o]?\s*\d+/i, /offre[-\s]?\d+/i],
    audienceDefault: 'manager',
    toneDefault: 'persuasive'
  },
  contract: {
    keywords: ['contrat', 'accord', 'convention', 'contract', 'agreement', 'engagement', 'avenant', 'protocole'],
    phrases: ['entre les parties', 'parties contractantes', 'durée du contrat', 'obligations réciproques', 'clauses particulières'],
    weight: 9,
    regex: [/contrat\s+n[°o]?\s*\d+/i, /avenant\s+n[°o]?\s*\d+/i, /convention\s+n[°o]?\s*\d+/i],
    industryHints: ['legal'],
    audienceDefault: 'director',
    toneDefault: 'formal'
  },
  memo: {
    keywords: ['note de service', 'mémo', 'memo', 'circulaire', 'communication interne', 'note interne'],
    phrases: ['information du personnel', 'application immédiate', 'diffusion interne'],
    weight: 8,
    regex: [/ns[-\s]?\d+/i, /note\s+n[°o]?\s*\d+/i],
    audienceDefault: 'manager',
    toneDefault: 'professional'
  },
  meeting_notes: {
    keywords: ['compte-rendu', 'compte rendu', 'procès-verbal', 'pv', 'réunion', 'meeting notes', 'minutes', 'cr'],
    phrases: ['participants à la réunion', 'ordre du jour', 'décisions prises', 'actions à mener'],
    weight: 8,
    regex: [/pv[-\s]?\d+/i, /cr[-\s]?\d+/i, /réunion\s+du/i],
    audienceDefault: 'manager',
    toneDefault: 'professional'
  },
  report: {
    keywords: ['rapport', 'report', 'analyse', 'étude', 'bilan', 'synthèse', 'état des lieux', 'diagnostic'],
    phrases: ['rapport d\'activité', 'analyse approfondie', 'conclusions et recommandations', 'faits saillants'],
    weight: 7,
    regex: [/rapport\s+(d[''])?/i, /étude\s+(d[''])?/i],
    audienceDefault: 'director',
    toneDefault: 'professional'
  },
  proposal: {
    keywords: ['proposition', 'proposal', 'offre de service', 'offre technique', 'réponse appel', 'candidature'],
    phrases: ['méthodologie proposée', 'approche recommandée', 'valeur ajoutée', 'retour sur investissement'],
    weight: 8,
    regex: [/prop[-\s]?\d+/i, /ao[-\s]?\d+/i],
    industryHints: ['consulting'],
    audienceDefault: 'director',
    toneDefault: 'persuasive'
  },
  letter: {
    keywords: ['lettre', 'courrier', 'letter', 'correspondance', 'missive', 'recommandé'],
    phrases: ['suite à notre entretien', 'je me permets de', 'veuillez agréer', 'dans l\'attente de'],
    weight: 6,
    regex: [/lettre\s+(de|à)/i],
    audienceDefault: 'manager',
    toneDefault: 'formal'
  },
  email: {
    keywords: ['email', 'mail', 'courriel', 'message électronique', 'e-mail'],
    phrases: ['pour information', 'action requise', 'pour suite à donner'],
    weight: 5,
    audienceDefault: 'operational',
    toneDefault: 'professional'
  },
  procedure: {
    keywords: ['procédure', 'processus', 'mode opératoire', 'instruction', 'protocole', 'workflow'],
    phrases: ['étapes à suivre', 'point de contrôle', 'validation requise', 'responsabilités'],
    weight: 7,
    regex: [/proc[-\s]?\d+/i, /mo[-\s]?\d+/i],
    audienceDefault: 'operational',
    toneDefault: 'technical'
  },
  specification: {
    keywords: ['cahier des charges', 'spécification', 'cdc', 'spec', 'requirements', 'exigences', 'spécifications techniques'],
    phrases: ['exigences fonctionnelles', 'contraintes techniques', 'critères d\'acceptation', 'périmètre du projet'],
    weight: 8,
    regex: [/cdc[-\s]?\d+/i, /spec[-\s]?\d+/i],
    industryHints: ['technology'],
    audienceDefault: 'manager',
    toneDefault: 'technical'
  },
  audit_report: {
    keywords: ['audit', 'contrôle', 'inspection', 'vérification', 'conformité', 'revue'],
    phrases: ['non-conformité', 'point d\'audit', 'observation', 'action corrective', 'recommandations d\'audit'],
    weight: 8,
    regex: [/audit[-\s]?\d+/i, /rap[-\s]?audit/i],
    industryHints: ['finance', 'consulting'],
    audienceDefault: 'director',
    toneDefault: 'formal'
  },
  policy: {
    keywords: ['politique', 'charte', 'règlement', 'directive', 'policy', 'règles'],
    phrases: ['champ d\'application', 'dispositions applicables', 'entrée en vigueur', 'sanctions prévues'],
    weight: 7,
    audienceDefault: 'director',
    toneDefault: 'formal'
  },
  executive_brief: {
    keywords: ['brief exécutif', 'executive brief', 'synthèse exécutive', 'note de synthèse', 'executive summary'],
    phrases: ['points clés', 'décision requise', 'implications stratégiques', 'analyse risques/opportunités'],
    weight: 9,
    audienceDefault: 'c_suite',
    toneDefault: 'executive'
  },
  board_memo: {
    keywords: ['mémo ca', 'mémo conseil', 'board memo', 'note au conseil', 'comex'],
    phrases: ['pour décision du conseil', 'recommandation de la direction', 'impact financier estimé'],
    weight: 10,
    industryHints: ['finance'],
    audienceDefault: 'board',
    toneDefault: 'executive'
  },
  investment_memo: {
    keywords: ['investment memo', 'mémo investissement', 'note d\'investissement', 'deal memo', 'dossier investissement'],
    phrases: ['thèse d\'investissement', 'multiple de sortie', 'IRR attendu', 'risques identifiés', 'valorisation'],
    weight: 10,
    industryHints: ['finance'],
    audienceDefault: 'c_suite',
    toneDefault: 'executive'
  },
  due_diligence: {
    keywords: ['due diligence', 'dd', 'audit d\'acquisition', 'vendor dd', 'buy-side dd'],
    phrases: ['points d\'attention', 'red flags', 'ajustements de prix', 'garanties demandées'],
    weight: 10,
    industryHints: ['finance', 'legal'],
    audienceDefault: 'c_suite',
    toneDefault: 'executive'
  },
  strategic_plan: {
    keywords: ['plan stratégique', 'strategic plan', 'vision', 'roadmap', 'feuille de route'],
    phrases: ['axes stratégiques', 'ambitions à 5 ans', 'piliers de croissance', 'quick wins'],
    weight: 9,
    industryHints: ['consulting'],
    audienceDefault: 'board',
    toneDefault: 'executive'
  },
  generic: {
    keywords: [],
    phrases: [],
    weight: 0,
    audienceDefault: 'manager',
    toneDefault: 'professional'
  }
};

const INDUSTRY_KEYWORDS: Record<IndustryContext, string[]> = {
  finance: ['banque', 'investissement', 'fonds', 'portefeuille', 'crédit', 'assurance', 'fintech', 'asset', 'private equity', 'venture', 'trading', 'compliance', 'régulation', 'bâle', 'solvabilité', 'risque crédit'],
  consulting: ['cabinet', 'conseil', 'stratégie', 'transformation', 'due diligence', 'mckinsey', 'bcg', 'bain', 'mission', 'deliverable', 'workstream', 'client', 'partner'],
  technology: ['software', 'saas', 'cloud', 'développement', 'agile', 'sprint', 'api', 'data', 'ia', 'machine learning', 'devops', 'startup', 'tech', 'platform'],
  healthcare: ['santé', 'médical', 'hôpital', 'clinique', 'pharma', 'patient', 'soins', 'thérapie', 'essai clinique', 'amm', 'remboursement'],
  manufacturing: ['industrie', 'production', 'usine', 'supply chain', 'lean', 'qualité', 'iso', 'maintenance', 'équipement', 'fabrication'],
  retail: ['distribution', 'magasin', 'e-commerce', 'omnicanal', 'merchandising', 'stock', 'logistique', 'client', 'enseigne'],
  legal: ['juridique', 'avocat', 'contentieux', 'droit', 'tribunal', 'litige', 'contrat', 'clause', 'responsabilité'],
  energy: ['énergie', 'électricité', 'pétrole', 'gaz', 'renouvelable', 'transition', 'carbone', 'esg', 'utilities'],
  real_estate: ['immobilier', 'promoteur', 'foncier', 'loyer', 'bail', 'actif immobilier', 'rendement locatif', 'scpi'],
  public_sector: ['administration', 'ministère', 'collectivité', 'marché public', 'appel d\'offre', 'subvention', 'service public'],
  generic: []
};

function detectIndustry(text: string): IndustryContext {
  const lowered = text.toLowerCase();
  const scores: Record<IndustryContext, number> = {} as Record<IndustryContext, number>;
  
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowered.includes(keyword.toLowerCase())) {
        score += 2;
      }
    }
    scores[industry as IndustryContext] = score;
  }
  
  const entries = Object.entries(scores);
  entries.sort((a, b) => b[1] - a[1]);
  
  return entries[0][1] > 0 ? entries[0][0] as IndustryContext : 'generic';
}

export function classifyDocument(context: DocumentContext): ClassificationResult {
  const combined = `${context.title} ${context.userPrompt || ''}`.toLowerCase();
  const scores: Record<DocumentCategory, number> = {} as Record<DocumentCategory, number>;
  const detectedKeywords: string[] = [];
  
  for (const [category, config] of Object.entries(CLASSIFICATION_PATTERNS)) {
    let score = 0;
    
    // Keyword matching
    for (const keyword of config.keywords) {
      if (combined.includes(keyword.toLowerCase())) {
        score += config.weight;
        detectedKeywords.push(keyword);
      }
    }
    
    // Phrase matching (stronger signal)
    for (const phrase of config.phrases) {
      if (combined.includes(phrase.toLowerCase())) {
        score += config.weight * 1.3;
        detectedKeywords.push(phrase);
      }
    }
    
    // Regex matching (strongest signal)
    if (config.regex) {
      for (const regex of config.regex) {
        if (regex.test(combined)) {
          score += config.weight * 1.8;
        }
      }
    }
    
    scores[category as DocumentCategory] = score;
  }
  
  // Find best match
  const entries = Object.entries(scores) as [DocumentCategory, number][];
  entries.sort((a, b) => b[1] - a[1]);
  
  const [bestCategory, bestScore] = entries[0];
  const [secondCategory] = entries[1] || [undefined];
  
  const config = CLASSIFICATION_PATTERNS[bestScore > 0 ? bestCategory : 'generic'];
  const industry = context.industry || detectIndustry(combined);
  
  // Determine complexity based on audience and category
  let complexity: 'simple' | 'standard' | 'complex' | 'executive' = 'standard';
  if (['board_memo', 'investment_memo', 'due_diligence', 'strategic_plan', 'executive_brief'].includes(bestCategory)) {
    complexity = 'executive';
  } else if (['contract', 'audit_report', 'specification', 'proposal'].includes(bestCategory)) {
    complexity = 'complex';
  } else if (['email', 'memo'].includes(bestCategory)) {
    complexity = 'simple';
  }
  
  const totalPossible = Math.max(...Object.values(CLASSIFICATION_PATTERNS).map(c => c.weight * (c.keywords.length + c.phrases.length) * 2));
  const confidence = Math.min(bestScore / totalPossible, 1);
  
  return {
    category: bestScore > 0 ? bestCategory : 'generic',
    confidence: bestScore > 0 ? confidence : 0,
    secondaryCategory: secondCategory,
    detectedKeywords: [...new Set(detectedKeywords)],
    suggestedSections: SECTION_TEMPLATES[bestScore > 0 ? bestCategory : 'generic'],
    industry,
    tone: config.toneDefault || 'professional',
    audience: context.audience || config.audienceDefault || 'manager',
    complexity
  };
}

// ============================================================================
// SECTION TEMPLATES ULTRA-DÉTAILLÉS
// ============================================================================

const SECTION_TEMPLATES: Record<DocumentCategory, string[]> = {
  purchase_order: [
    'EN-TÊTE PROFESSIONNEL',
    '  • Logo et identité visuelle de l\'entreprise',
    '  • Référence unique du bon de commande (BC-AAAA-NNNN)',
    '  • Date d\'émission et date de validité',
    'INFORMATIONS SOCIÉTÉ ÉMETTRICE',
    '  • Raison sociale complète et forme juridique',
    '  • Adresse du siège social',
    '  • SIRET (14 chiffres) et Code APE/NAF',
    '  • N° TVA Intracommunautaire',
    '  • Capital social',
    'INFORMATIONS FOURNISSEUR',
    '  • Raison sociale et forme juridique',
    '  • Adresse complète',
    '  • SIRET et N° TVA',
    '  • Contact commercial (nom, téléphone, email)',
    'ADRESSE DE LIVRAISON',
    '  • Adresse complète si différente du siège',
    '  • Contact réception',
    '  • Horaires de réception',
    'TABLEAU DÉTAILLÉ DES ARTICLES',
    '  • N° de ligne',
    '  • Référence article fournisseur',
    '  • Désignation précise',
    '  • Quantité commandée',
    '  • Unité de mesure',
    '  • Prix unitaire HT',
    '  • Remise éventuelle (%)',
    '  • Montant HT ligne',
    'RÉCAPITULATIF FINANCIER',
    '  • Sous-total HT (avant remise globale)',
    '  • Remise globale (montant et %)',
    '  • Total HT net',
    '  • TVA 20% (ou autres taux applicables)',
    '  • Total TTC',
    'CONDITIONS DE PAIEMENT',
    '  • Mode de règlement accepté',
    '  • Délai de paiement (30/45/60 jours)',
    '  • Escompte pour paiement anticipé si applicable',
    'CONDITIONS DE LIVRAISON',
    '  • Date de livraison souhaitée (impérative/indicative)',
    '  • Incoterm applicable',
    '  • Modalités de transport',
    '  • Conditions d\'acceptation à réception',
    'INSTRUCTIONS PARTICULIÈRES',
    '  • Mentions spécifiques à la commande',
    '  • Documents attendus à la livraison',
    '  • Numéro de projet/affaire interne',
    'ZONE DE VALIDATION',
    '  • Mention "Bon pour accord"',
    '  • Nom et fonction de l\'approbateur',
    '  • Signature',
    '  • Date de signature',
    '  • Cachet de l\'entreprise'
  ],
  invoice: [
    'EN-TÊTE FACTURE',
    '  • Mention "FACTURE" en évidence',
    '  • Numéro séquentiel unique (FA-AAAA-NNNN)',
    '  • Date d\'émission',
    '  • Date d\'échéance de paiement',
    'IDENTIFICATION ÉMETTEUR (Mentions légales obligatoires)',
    '  • Raison sociale et forme juridique',
    '  • Adresse du siège social',
    '  • SIRET (14 chiffres)',
    '  • N° TVA Intracommunautaire (obligatoire)',
    '  • RCS + ville d\'immatriculation',
    '  • Capital social',
    '  • Mention assurance professionnelle si applicable',
    'IDENTIFICATION CLIENT',
    '  • Raison sociale ou nom',
    '  • Adresse de facturation',
    '  • N° client interne',
    '  • N° TVA intracommunautaire si professionnel',
    'RÉFÉRENCES',
    '  • N° de commande client',
    '  • N° de devis',
    '  • N° de bon de livraison',
    '  • Date de la commande',
    'DÉTAIL DES PRESTATIONS / PRODUITS',
    '  • Référence article',
    '  • Désignation détaillée',
    '  • Quantité livrée',
    '  • Prix unitaire HT',
    '  • Taux de TVA applicable',
    '  • Montant HT par ligne',
    'RÉCAPITULATIF TVA',
    '  • Base HT par taux de TVA',
    '  • Montant TVA par taux',
    '  • Si exonération: mention légale obligatoire',
    'TOTAUX',
    '  • Total HT',
    '  • Total TVA',
    '  • Total TTC',
    '  • Acompte déjà versé si applicable',
    '  • Net à payer',
    'CONDITIONS DE RÈGLEMENT',
    '  • Délai de paiement',
    '  • Mode de paiement accepté',
    '  • Escompte pour paiement anticipé',
    'COORDONNÉES BANCAIRES',
    '  • Nom de la banque',
    '  • IBAN complet',
    '  • Code BIC',
    '  • Titulaire du compte',
    'MENTIONS LÉGALES OBLIGATOIRES',
    '  • Pénalités de retard: taux BCE + 10 points ou taux contractuel',
    '  • Indemnité forfaitaire de recouvrement: 40€',
    '  • Clause de réserve de propriété si applicable'
  ],
  quote: [
    'EN-TÊTE DEVIS',
    '  • Mention "DEVIS" ou "PROPOSITION COMMERCIALE"',
    '  • Référence unique (DEV-AAAA-NNNN)',
    '  • Date d\'établissement',
    '  • Date limite de validité',
    'NOTRE SOCIÉTÉ',
    '  • Présentation professionnelle',
    '  • Coordonnées complètes',
    '  • Informations légales',
    'CLIENT DESTINATAIRE',
    '  • Société et contact',
    '  • Adresse',
    '  • Interlocuteur projet',
    'OBJET DU DEVIS',
    '  • Titre clair et explicite',
    '  • Référence éventuelle à une demande client',
    'CONTEXTE ET COMPRÉHENSION DU BESOIN',
    '  • Reformulation des besoins exprimés',
    '  • Enjeux identifiés',
    '  • Contraintes prises en compte',
    'NOTRE PROPOSITION',
    '  • Description de la solution proposée',
    '  • Points différenciants',
    '  • Valeur ajoutée',
    'DÉTAIL DE L\'OFFRE',
    '  • Désignation précise de chaque poste',
    '  • Description du contenu',
    '  • Quantité ou unité',
    '  • Prix unitaire HT',
    '  • Montant HT',
    'OPTIONS COMPLÉMENTAIRES',
    '  • Services additionnels proposés',
    '  • Impact prix',
    'RÉCAPITULATIF FINANCIER',
    '  • Total HT',
    '  • TVA applicable',
    '  • Total TTC',
    '  • Modalités de facturation (acompte, échelonnement)',
    'CONDITIONS GÉNÉRALES',
    '  • Validité de l\'offre',
    '  • Délais de réalisation',
    '  • Conditions de paiement',
    '  • Exclusions',
    'ACCEPTATION',
    '  • Zone "Bon pour accord"',
    '  • Signature client',
    '  • Date',
    '  • Retour du devis signé pour validation'
  ],
  contract: [
    'INTITULÉ DU CONTRAT',
    '  • Type de contrat (prestation de services, vente, partenariat...)',
    '  • Référence du contrat',
    'ENTRE LES SOUSSIGNÉS',
    '  • Partie 1: identification complète (société, SIRET, RCS, représentant légal)',
    '  • Partie 2: identification complète',
    '  • Ci-après dénommées "les Parties"',
    'PRÉAMBULE',
    '  • Contexte de la relation',
    '  • Objectifs poursuivis',
    '  • Documents de référence (devis, CGV...)',
    'ARTICLE 1 - OBJET',
    '  • Description précise de l\'objet du contrat',
    '  • Périmètre inclus et exclus',
    'ARTICLE 2 - DURÉE ET ENTRÉE EN VIGUEUR',
    '  • Date d\'effet',
    '  • Durée initiale',
    '  • Conditions de renouvellement (tacite reconduction ou non)',
    '  • Modalités de préavis',
    'ARTICLE 3 - OBLIGATIONS DES PARTIES',
    '  • Obligations de la Partie 1',
    '  • Obligations de la Partie 2',
    '  • Obligation de moyens ou de résultat',
    'ARTICLE 4 - CONDITIONS FINANCIÈRES',
    '  • Prix et modalités de calcul',
    '  • Modalités de paiement',
    '  • Révision des prix',
    '  • Pénalités de retard',
    'ARTICLE 5 - CONFIDENTIALITÉ',
    '  • Définition des informations confidentielles',
    '  • Durée de l\'obligation',
    '  • Exceptions',
    'ARTICLE 6 - PROPRIÉTÉ INTELLECTUELLE',
    '  • Titularité des droits',
    '  • Licence d\'utilisation accordée',
    '  • Garanties',
    'ARTICLE 7 - RESPONSABILITÉ',
    '  • Limitation de responsabilité',
    '  • Plafond d\'indemnisation',
    '  • Exclusions',
    '  • Assurances',
    'ARTICLE 8 - RÉSILIATION',
    '  • Résiliation pour convenance',
    '  • Résiliation pour faute',
    '  • Effets de la résiliation',
    'ARTICLE 9 - FORCE MAJEURE',
    '  • Définition',
    '  • Effets',
    '  • Procédure de notification',
    'ARTICLE 10 - DISPOSITIONS GÉNÉRALES',
    '  • Intégralité de l\'accord',
    '  • Modification du contrat',
    '  • Cession',
    '  • Indépendance des clauses',
    'ARTICLE 11 - LOI APPLICABLE ET JURIDICTION',
    '  • Droit applicable',
    '  • Règlement amiable',
    '  • Juridiction compétente',
    'SIGNATURES',
    '  • Fait à..., le...',
    '  • En deux exemplaires originaux',
    '  • Partie 1: Nom, Fonction, Signature, Cachet',
    '  • Partie 2: Nom, Fonction, Signature, Cachet'
  ],
  memo: [
    'EN-TÊTE NOTE DE SERVICE',
    '  • Mention "NOTE DE SERVICE" ou "MÉMO"',
    '  • Référence (NS-AAAA-NNN)',
    '  • Classification (Confidentiel, Interne, etc.)',
    'BLOC D\'IDENTIFICATION',
    '  • DE: Émetteur (Nom, Fonction)',
    '  • À: Destinataires (Personnes ou Services)',
    '  • COPIE: Destinataires en copie',
    '  • DATE: Date d\'émission',
    '  • OBJET: Sujet en une phrase claire',
    'CONTEXTE',
    '  • Rappel du contexte ou de l\'événement déclencheur',
    '  • Référence à des décisions antérieures si pertinent',
    'CONTENU PRINCIPAL',
    '  • Information ou décision à communiquer',
    '  • Explications et justifications',
    '  • Implications concrètes',
    'ACTIONS ATTENDUES',
    '  • Mesures à prendre',
    '  • Responsables identifiés',
    '  • Échéances',
    'DATE D\'APPLICATION',
    '  • Entrée en vigueur',
    '  • Dispositions transitoires si applicable',
    'SIGNATURE',
    '  • Nom de l\'émetteur',
    '  • Fonction',
    '  • Signature'
  ],
  meeting_notes: [
    'EN-TÊTE',
    '  • Intitulé de la réunion',
    '  • Date, heure de début et de fin',
    '  • Lieu (présentiel ou visioconférence)',
    '  • Référence (CR-AAAA-NNN)',
    'PARTICIPANTS',
    '  • Présents: Nom, Fonction',
    '  • Excusés: Nom, Fonction',
    '  • Animateur de la réunion',
    '  • Rédacteur du compte-rendu',
    'ORDRE DU JOUR',
    '  • Liste numérotée des points à traiter',
    '  • Temps alloué par point si pertinent',
    'SYNTHÈSE DES ÉCHANGES',
    '  • Point 1: Discussions, positions exprimées',
    '  • Point 2: etc.',
    '  • Questions soulevées',
    'DÉCISIONS PRISES',
    '  • Décision 1: Énoncé clair',
    '  • Décision 2: etc.',
    '  • Votes ou consensus',
    'PLAN D\'ACTIONS',
    '  • Tableau: Action | Responsable | Échéance | Statut',
    '  • Priorisation si nécessaire',
    'POINTS REPORTÉS',
    '  • Sujets non traités à reporter',
    '  • Raison du report',
    'PROCHAINE RÉUNION',
    '  • Date et heure proposées',
    '  • Ordre du jour préliminaire',
    '  • Participants attendus',
    'VALIDATION',
    '  • Date du compte-rendu',
    '  • Rédacteur',
    '  • Diffusion'
  ],
  report: [
    'PAGE DE TITRE',
    '  • Titre du rapport',
    '  • Sous-titre explicatif',
    '  • Date de publication',
    '  • Auteur(s) et organisation',
    '  • Classification (Confidentiel si applicable)',
    'RÉSUMÉ EXÉCUTIF (Executive Summary)',
    '  • Contexte en 2-3 phrases',
    '  • Principaux constats (3-5 points clés)',
    '  • Recommandations majeures',
    '  • Appel à l\'action',
    'SOMMAIRE',
    '  • Table des matières détaillée',
    '  • Numérotation des pages',
    'INTRODUCTION',
    '  • Contexte et enjeux',
    '  • Objectifs du rapport',
    '  • Périmètre de l\'analyse',
    '  • Méthodologie adoptée',
    'ANALYSE ET CONSTATS',
    '  • Section 1: Premier axe d\'analyse',
    '  • Section 2: Deuxième axe',
    '  • Données et chiffres clés',
    '  • Visualisations (à insérer)',
    'DIAGNOSTIC',
    '  • Forces et opportunités',
    '  • Faiblesses et menaces',
    '  • Analyse des causes racines',
    'RECOMMANDATIONS',
    '  • Recommandation 1: Description, Impact attendu, Effort',
    '  • Recommandation 2: etc.',
    '  • Priorisation (Quick wins vs. transformations)',
    'PLAN D\'ACTION',
    '  • Feuille de route',
    '  • Jalons clés',
    '  • Responsabilités',
    '  • Ressources nécessaires',
    'CONCLUSION',
    '  • Synthèse des points clés',
    '  • Prochaines étapes',
    '  • Appel à décision si nécessaire',
    'ANNEXES',
    '  • Données détaillées',
    '  • Méthodologie complète',
    '  • Sources et références'
  ],
  proposal: [
    'PAGE DE GARDE',
    '  • Logo de l\'entreprise',
    '  • Titre: "Proposition [type] - [Client]"',
    '  • Date de remise',
    '  • Contact projet',
    '  • Mention "Confidentiel"',
    'EXECUTIVE SUMMARY',
    '  • Compréhension du besoin (2-3 lignes)',
    '  • Notre proposition (2-3 lignes)',
    '  • Points clés différenciants (3-4 bullets)',
    '  • Investissement global',
    'COMPRÉHENSION DE VOS ENJEUX',
    '  • Contexte client reformulé',
    '  • Défis identifiés',
    '  • Opportunités',
    '  • Questions clés à adresser',
    'NOTRE APPROCHE',
    '  • Convictions et parti pris',
    '  • Méthodologie proposée',
    '  • Facteurs clés de succès',
    '  • Ce qui nous différencie',
    'LIVRABLES ET PLANNING',
    '  • Phase 1: [Nom] - Livrables - Durée',
    '  • Phase 2: etc.',
    '  • Jalons clés',
    '  • Représentation visuelle (timeline)',
    'ÉQUIPE PROJET',
    '  • Directeur de mission',
    '  • Consultants seniors',
    '  • Équipe projet',
    '  • Expertise mobilisée',
    'GOUVERNANCE',
    '  • Comité de pilotage',
    '  • Points d\'avancement',
    '  • Outils de suivi',
    'INVESTISSEMENT',
    '  • Budget global',
    '  • Décomposition par phase',
    '  • Options',
    '  • Conditions de paiement',
    '  • Validité de l\'offre',
    'NOS RÉFÉRENCES',
    '  • Mission 1: Client, Contexte, Résultats',
    '  • Mission 2: etc.',
    '  • Témoignages clients',
    'PROCHAINES ÉTAPES',
    '  • Processus de décision proposé',
    '  • Date de démarrage souhaitée',
    '  • Contacts pour questions'
  ],
  letter: [
    'EN-TÊTE ÉMETTEUR',
    '  • Logo et coordonnées de l\'entreprise',
    '  • Ou: Nom et adresse personnelle',
    'LIEU ET DATE',
    '  • Format: [Ville], le [date en toutes lettres]',
    'DESTINATAIRE',
    '  • Nom et/ou fonction',
    '  • Société',
    '  • Adresse complète',
    'RÉFÉRENCES',
    '  • Vos références: [si réponse à un courrier]',
    '  • Nos références: [numéro interne]',
    '  • Objet: [en gras ou souligné]',
    'FORMULE D\'APPEL',
    '  • Madame, / Monsieur, / Madame, Monsieur,',
    '  • Ou avec titre: Monsieur le Directeur,',
    'ACCROCHE',
    '  • Référence au contexte (entretien, courrier précédent)',
    '  • Ou introduction directe du sujet',
    'CORPS DE LA LETTRE',
    '  • Exposition du sujet (paragraphe 1)',
    '  • Développement et arguments (paragraphes 2-3)',
    '  • Conclusion et demande éventuelle',
    'FORMULE DE POLITESSE',
    '  • Veuillez agréer, [formule d\'appel], l\'expression de...',
    '  • Adaptée au contexte et au destinataire',
    'SIGNATURE',
    '  • Prénom et Nom',
    '  • Fonction',
    '  • Signature manuscrite',
    'PIÈCES JOINTES',
    '  • P.J.: [Liste des documents joints]'
  ],
  email: [
    'OBJET',
    '  • Clair, concis, actionnable',
    '  • Préfixe si nécessaire: [ACTION REQUISE], [INFO], [URGENT]',
    'SALUTATION',
    '  • Bonjour [Prénom], / Madame, Monsieur,',
    '  • Adaptée au niveau de formalité',
    'ACCROCHE CONTEXTUELLE',
    '  • Référence au contexte en 1-2 phrases',
    '  • "Suite à notre échange...", "Comme convenu..."',
    'CORPS DU MESSAGE',
    '  • Un sujet = un email',
    '  • Paragraphes courts',
    '  • Listes à puces pour les points multiples',
    '  • Mise en évidence des informations clés',
    'CALL TO ACTION',
    '  • Demande explicite',
    '  • Échéance si applicable',
    '  • "Merci de me confirmer...", "Pouvez-vous..."',
    'FORMULE DE CONCLUSION',
    '  • "Bien cordialement," / "Cordialement,"',
    '  • "Restant à votre disposition,"',
    'SIGNATURE',
    '  • Prénom Nom',
    '  • Fonction',
    '  • Coordonnées'
  ],
  procedure: [
    'CARTOUCHE D\'IDENTIFICATION',
    '  • Titre de la procédure',
    '  • Référence: PROC-[Domaine]-[NNN]',
    '  • Version: V[X.Y]',
    '  • Date de création / dernière mise à jour',
    '  • Statut: Brouillon / Validé / Obsolète',
    'INFORMATIONS DE GESTION',
    '  • Rédacteur',
    '  • Vérificateur',
    '  • Approbateur',
    '  • Date d\'application',
    '  • Prochaine revue prévue',
    'OBJET ET CHAMP D\'APPLICATION',
    '  • Objectif de la procédure',
    '  • Activités couvertes',
    '  • Activités exclues',
    '  • Sites/services concernés',
    'DOCUMENTS DE RÉFÉRENCE',
    '  • Normes applicables (ISO, réglementations)',
    '  • Procédures liées',
    '  • Instructions de travail associées',
    'DÉFINITIONS ET ABRÉVIATIONS',
    '  • Glossaire des termes techniques',
    '  • Liste des acronymes utilisés',
    'RESPONSABILITÉS',
    '  • Qui fait quoi (RACI si pertinent)',
    '  • Acteurs et rôles',
    'LOGIGRAMME / SYNOPTIQUE',
    '  • Représentation visuelle du processus',
    '  • Flux et décisions',
    'DESCRIPTION DES ÉTAPES',
    '  • Étape 1: Action, Acteur, Outil, Output',
    '  • Étape 2: etc.',
    '  • Points de contrôle',
    '  • Critères de passage',
    'ENREGISTREMENTS',
    '  • Documents générés',
    '  • Durée de conservation',
    '  • Lieu de stockage',
    'INDICATEURS',
    '  • KPIs de suivi',
    '  • Fréquence de mesure',
    '  • Cibles',
    'GESTION DES ANOMALIES',
    '  • Cas particuliers',
    '  • Escalade',
    '  • Actions correctives',
    'HISTORIQUE DES RÉVISIONS',
    '  • Version | Date | Auteur | Nature de la modification',
    'ANNEXES',
    '  • Formulaires',
    '  • Check-lists',
    '  • Exemples'
  ],
  specification: [
    'PAGE DE GARDE',
    '  • Titre du projet',
    '  • Type: Cahier des Charges / Spécifications',
    '  • Version et date',
    '  • Client / Commanditaire',
    '  • Auteur',
    'HISTORIQUE DES VERSIONS',
    '  • Tableau: Version | Date | Auteur | Modifications',
    '  • Statut du document',
    'SOMMAIRE',
    '  • Table des matières',
    '  • Liste des figures',
    '  • Liste des tableaux',
    'CONTEXTE ET OBJECTIFS',
    '  • Présentation du contexte',
    '  • Problématique à résoudre',
    '  • Objectifs stratégiques',
    '  • Bénéfices attendus',
    'PÉRIMÈTRE',
    '  • Périmètre inclus',
    '  • Périmètre explicitement exclu',
    '  • Hypothèses de travail',
    '  • Dépendances',
    'PARTIES PRENANTES',
    '  • Sponsor',
    '  • Utilisateurs finaux',
    '  • Équipe projet',
    '  • Fournisseurs',
    'EXIGENCES FONCTIONNELLES',
    '  • EF-001: Description, Priorité, Critère d\'acceptation',
    '  • EF-002: etc.',
    '  • Regroupement par domaine fonctionnel',
    'EXIGENCES NON FONCTIONNELLES',
    '  • Performance',
    '  • Disponibilité',
    '  • Sécurité',
    '  • Ergonomie',
    '  • Maintenabilité',
    'EXIGENCES TECHNIQUES',
    '  • Architecture cible',
    '  • Technologies imposées ou recommandées',
    '  • Interfaces avec l\'existant',
    '  • Contraintes techniques',
    'CONTRAINTES',
    '  • Budget',
    '  • Délais',
    '  • Ressources',
    '  • Réglementaires',
    'LIVRABLES ATTENDUS',
    '  • Liste des livrables',
    '  • Format attendu',
    '  • Critères de qualité',
    'PLANNING PRÉVISIONNEL',
    '  • Jalons clés',
    '  • Phases du projet',
    '  • Date de mise en production cible',
    'CRITÈRES D\'ACCEPTATION',
    '  • Conditions de recette',
    '  • Tests à réaliser',
    '  • Niveaux de conformité',
    'ANNEXES',
    '  • Maquettes / Wireframes',
    '  • Schémas techniques',
    '  • Documents de référence'
  ],
  audit_report: [
    'PAGE DE TITRE',
    '  • Type d\'audit (interne, externe, certification...)',
    '  • Référentiel d\'audit',
    '  • Entité auditée',
    '  • Période d\'audit',
    '  • Date du rapport',
    'INFORMATIONS GÉNÉRALES',
    '  • Objectif de l\'audit',
    '  • Périmètre audité',
    '  • Critères d\'audit',
    '  • Équipe d\'audit',
    '  • Personnes rencontrées',
    'RÉSUMÉ EXÉCUTIF',
    '  • Conclusion générale',
    '  • Niveau de conformité global',
    '  • Points forts principaux',
    '  • Axes d\'amélioration majeurs',
    '  • Recommandation de certification (si applicable)',
    'MÉTHODOLOGIE',
    '  • Approche d\'audit',
    '  • Techniques utilisées (entretiens, revue documentaire, observation)',
    '  • Échantillonnage',
    '  • Limites de l\'audit',
    'CONSTATS DÉTAILLÉS',
    '  • Par processus ou domaine audité',
    '  • Points de conformité',
    '  • Non-conformités majeures (NC Maj)',
    '  • Non-conformités mineures (NC Min)',
    '  • Observations / Points sensibles',
    '  • Opportunités d\'amélioration',
    'SYNTHÈSE DES NON-CONFORMITÉS',
    '  • Tableau récapitulatif',
    '  • Réf | Intitulé | Gravité | Article/Exigence | Constat',
    'ANALYSE DES CAUSES',
    '  • Causes racines identifiées',
    '  • Facteurs contributifs',
    'RECOMMANDATIONS',
    '  • Par non-conformité: Action corrective proposée',
    '  • Priorisation',
    '  • Responsable suggéré',
    '  • Délai recommandé',
    'PLAN D\'ACTION CORRECTIVE',
    '  • Tableau: NC | Action | Responsable | Échéance | Statut',
    '  • Suivi prévu',
    'CONCLUSION',
    '  • Appréciation globale',
    '  • Prochaines étapes',
    '  • Date d\'audit de suivi si applicable',
    'ANNEXES',
    '  • Plan d\'audit',
    '  • Check-list utilisée',
    '  • Preuves collectées',
    '  • Liste des documents consultés'
  ],
  policy: [
    'IDENTIFICATION',
    '  • Titre de la politique',
    '  • Référence: POL-[Domaine]-[NNN]',
    '  • Version',
    '  • Date d\'entrée en vigueur',
    '  • Date de prochaine revue',
    'APPROBATION',
    '  • Rédigé par',
    '  • Approuvé par (Direction)',
    '  • Date d\'approbation',
    'OBJET',
    '  • Finalité de la politique',
    '  • Enjeux adressés',
    'CHAMP D\'APPLICATION',
    '  • Entités concernées',
    '  • Personnes concernées',
    '  • Activités couvertes',
    '  • Exclusions',
    'DÉFINITIONS',
    '  • Termes clés utilisés',
    '  • Interprétations officielles',
    'PRINCIPES DIRECTEURS',
    '  • Valeurs fondamentales',
    '  • Engagements de la Direction',
    '  • Orientations stratégiques',
    'RÈGLES ET DISPOSITIONS',
    '  • Article 1: [Thème] - Règle(s)',
    '  • Article 2: etc.',
    '  • Obligations',
    '  • Interdictions',
    '  • Autorisations',
    'RÔLES ET RESPONSABILITÉS',
    '  • Direction',
    '  • Managers',
    '  • Collaborateurs',
    '  • Fonctions support',
    'PROCESSUS DE DÉROGATION',
    '  • Conditions de dérogation',
    '  • Circuit d\'approbation',
    '  • Documentation',
    'CONTRÔLE ET SUIVI',
    '  • Indicateurs de suivi',
    '  • Audits prévus',
    '  • Reporting',
    'SANCTIONS',
    '  • Non-respect de la politique',
    '  • Échelle de sanctions',
    '  • Procédure disciplinaire',
    'DOCUMENTS ASSOCIÉS',
    '  • Procédures liées',
    '  • Formulaires',
    '  • Guides pratiques',
    'COMMUNICATION',
    '  • Diffusion de la politique',
    '  • Formation',
    '  • Affichage',
    'HISTORIQUE DES MODIFICATIONS',
    '  • Version | Date | Nature de la modification | Auteur'
  ],
  executive_brief: [
    'EN-TÊTE',
    '  • Titre percutant',
    '  • Date',
    '  • Classification: Confidentiel Direction',
    '  • Auteur et fonction',
    'POINTS CLÉS (Key Takeaways)',
    '  • 3-5 points maximum',
    '  • Format bullet ultra-concis',
    '  • Impact business immédiatement visible',
    'CONTEXTE (2-3 phrases max)',
    '  • Pourquoi ce brief maintenant',
    '  • Événement déclencheur',
    'ANALYSE',
    '  • Faits et données clés',
    '  • Implications stratégiques',
    '  • Risques et opportunités',
    'OPTIONS ET RECOMMANDATION',
    '  • Option A: Description, Pros, Cons',
    '  • Option B: Description, Pros, Cons',
    '  • Recommandation claire et argumentée',
    'DÉCISION REQUISE',
    '  • Formulation explicite de la décision attendue',
    '  • Deadline',
    'PROCHAINES ÉTAPES',
    '  • Actions immédiates post-décision',
    '  • Responsables',
    'ANNEXES (optionnel)',
    '  • Données détaillées pour approfondissement'
  ],
  board_memo: [
    'EN-TÊTE CONFIDENTIEL',
    '  • MÉMO AU CONSEIL D\'ADMINISTRATION',
    '  • Date de la séance',
    '  • Point de l\'ordre du jour',
    '  • Classification: Strictement Confidentiel',
    'SYNTHÈSE POUR LE CONSEIL',
    '  • Objet de la délibération',
    '  • Recommandation de la Direction',
    '  • Décision sollicitée (approbation, autorisation, information)',
    'CONTEXTE STRATÉGIQUE',
    '  • Rappel des orientations du Plan Stratégique',
    '  • Positionnement de ce dossier',
    '  • Historique des décisions du Conseil sur ce sujet',
    'PRÉSENTATION DU DOSSIER',
    '  • Description factuelle',
    '  • Enjeux business',
    '  • Montants en jeu',
    'ANALYSE',
    '  • Analyse financière (ROI, payback, NPV si applicable)',
    '  • Analyse des risques',
    '  • Alternatives étudiées',
    '  • Benchmark / pratiques de marché',
    'AVIS DES COMITÉS (si applicable)',
    '  • Avis du Comité d\'Audit',
    '  • Avis du Comité Stratégique',
    '  • Avis du Comité de Rémunération',
    'IMPACTS',
    '  • Impact financier',
    '  • Impact RH',
    '  • Impact réglementaire',
    '  • Impact ESG',
    'PROPOSITION DE RÉSOLUTION',
    '  • Texte de la résolution à voter',
    '  • Format juridique approprié',
    'PIÈCES JOINTES',
    '  • Documents soumis à l\'examen du Conseil',
    '  • Rapports d\'experts si applicable',
    'CONTACT',
    '  • Dirigeant présentateur',
    '  • Contacts pour questions préalables'
  ],
  investment_memo: [
    'PAGE DE GARDE',
    '  • INVESTMENT MEMORANDUM',
    '  • Nom de la cible',
    '  • Date',
    '  • Strictement Confidentiel',
    'EXECUTIVE SUMMARY',
    '  • Thèse d\'investissement en 5 lignes',
    '  • Montant d\'investissement proposé',
    '  • Valorisation / Multiple',
    '  • Returns attendus (IRR, CoC)',
    '  • Recommandation',
    'OVERVIEW DE LA CIBLE',
    '  • Description de l\'activité',
    '  • Historique',
    '  • Positionnement marché',
    '  • Management',
    '  • Actionnariat actuel',
    'THÈSE D\'INVESTISSEMENT',
    '  • Conviction 1: Argumentaire',
    '  • Conviction 2: Argumentaire',
    '  • Conviction 3: Argumentaire',
    '  • Création de valeur identifiée',
    'ANALYSE DE MARCHÉ',
    '  • Taille de marché (TAM/SAM/SOM)',
    '  • Croissance attendue',
    '  • Tendances structurelles',
    '  • Dynamique concurrentielle',
    'ANALYSE FINANCIÈRE',
    '  • Historique P&L (3-5 ans)',
    '  • Historique Bilan',
    '  • Historique Cash-flows',
    '  • Projections (5 ans)',
    '  • KPIs sectoriels',
    'VALORISATION',
    '  • Méthodologie retenue',
    '  • Comparables boursiers',
    '  • Transactions comparables',
    '  • DCF',
    '  • Fourchette de valorisation',
    '  • Prix proposé / Prime',
    'STRUCTURE DE TRANSACTION',
    '  • Montant et instruments',
    '  • Structure de capital post-deal',
    '  • Gouvernance proposée',
    '  • Conditions suspensives',
    'DUE DILIGENCE - SYNTHÈSE',
    '  • Red Flags identifiés',
    '  • Points d\'attention',
    '  • Confirmatory DD restante',
    'RISQUES',
    '  • Risque 1: Description, Impact, Mitigation',
    '  • Risque 2: etc.',
    '  • Matrice des risques',
    'SCÉNARIOS DE SORTIE',
    '  • Scénario Base: Hypothèses, Exit, Returns',
    '  • Scénario Upside',
    '  • Scénario Downside',
    '  • Horizons de sortie envisagés',
    'RECOMMANDATION',
    '  • Recommandation formelle',
    '  • Conditions / Next steps',
    'ANNEXES',
    '  • Modèle financier détaillé',
    '  • Rapports DD',
    '  • Présentations management'
  ],
  due_diligence: [
    'PAGE DE TITRE',
    '  • RAPPORT DE DUE DILIGENCE',
    '  • Type: Financière / Opérationnelle / Juridique / ESG',
    '  • Cible',
    '  • Date',
    '  • Confidentiel - Diffusion Restreinte',
    'SYNTHÈSE EXÉCUTIVE',
    '  • Conclusion générale',
    '  • Deal-breakers identifiés (ou absence de)',
    '  • Ajustements de prix recommandés',
    '  • Points d\'attention majeurs',
    '  • Garanties à négocier',
    'PÉRIMÈTRE ET MÉTHODOLOGIE',
    '  • Scope de la DD',
    '  • Période analysée',
    '  • Documents revus',
    '  • Entretiens menés',
    '  • Limites de l\'exercice',
    'QUALITÉ DES RÉSULTATS (Quality of Earnings)',
    '  • Analyse du CA',
    '  • Récurrence et qualité des revenus',
    '  • EBITDA normatif',
    '  • Ajustements identifiés',
    '  • Éléments exceptionnels / non-récurrents',
    'ANALYSE DU BILAN',
    '  • Dette nette ajustée',
    '  • BFR normatif',
    '  • Capex de maintenance vs. croissance',
    '  • Engagements hors bilan',
    '  • Provisions à revoir',
    'ANALYSE DES FLUX',
    '  • Cash conversion',
    '  • Saisonnalité',
    '  • Besoins de financement',
    'ASPECTS OPÉRATIONNELS',
    '  • Organisation',
    '  • Personnes clés',
    '  • Systèmes d\'information',
    '  • Contrats majeurs',
    '  • Fournisseurs / Clients critiques',
    'ASPECTS JURIDIQUES (si applicable)',
    '  • Litiges en cours',
    '  • Conformité réglementaire',
    '  • Contrats sensibles',
    '  • Propriété intellectuelle',
    'ASPECTS RH',
    '  • Masse salariale',
    '  • Engagements sociaux',
    '  • Litiges prud\'homaux',
    '  • Rétention des talents',
    'ASPECTS ESG',
    '  • Conformité environnementale',
    '  • Risques climatiques',
    '  • Enjeux sociaux',
    '  • Gouvernance',
    'RED FLAGS',
    '  • Liste détaillée des alertes majeures',
    '  • Impact estimé',
    '  • Recommandation',
    'POINTS D\'ATTENTION',
    '  • Issues moins critiques mais à surveiller',
    '  • Items à confirmer',
    'AJUSTEMENTS DE PRIX PROPOSÉS',
    '  • Tableau récapitulatif',
    '  • Prix initial',
    '  • Ajustements positifs',
    '  • Ajustements négatifs',
    '  • Prix ajusté proposé',
    'RECOMMANDATIONS POUR LA NÉGOCIATION',
    '  • Garanties à demander',
    '  • Points de documentation',
    '  • Conditions suspensives',
    'CONCLUSION',
    '  • Go / No-Go',
    '  • Conditions du Go',
    'ANNEXES',
    '  • Modèle QofE détaillé',
    '  • Liste des documents analysés',
    '  • Détail des entretiens'
  ],
  strategic_plan: [
    'PAGE DE GARDE',
    '  • PLAN STRATÉGIQUE [Horizon]',
    '  • Entreprise',
    '  • Version et date',
    '  • Strictement Confidentiel',
    'MOT DU CEO / PRÉSIDENT',
    '  • Vision personnelle',
    '  • Ambition pour l\'entreprise',
    '  • Appel à la mobilisation',
    'EXECUTIVE SUMMARY',
    '  • Ambition: où voulons-nous être',
    '  • Axes stratégiques (3-5 max)',
    '  • Objectifs chiffrés clés',
    '  • Investissements prévus',
    '  • Roadmap synthétique',
    'DIAGNOSTIC STRATÉGIQUE',
    '  • Analyse externe: marché, concurrence, tendances',
    '  • Analyse interne: forces, faiblesses, ressources',
    '  • SWOT synthétique',
    '  • Enjeux clés identifiés',
    'VISION ET AMBITION',
    '  • Vision à long terme',
    '  • Mission de l\'entreprise',
    '  • Valeurs',
    '  • Objectifs stratégiques quantifiés',
    'AXES STRATÉGIQUES',
    '  • Axe 1: [Nom] - Ambition, Initiatives clés, KPIs',
    '  • Axe 2: etc.',
    '  • Pour chaque axe: Pourquoi, Quoi, Comment, Combien',
    'PLAN D\'ACTIONS PRIORITAIRES',
    '  • Quick Wins (0-12 mois)',
    '  • Transformations majeures (12-36 mois)',
    '  • Projets structurants',
    '  • Priorisation et séquencement',
    'MODÈLE ÉCONOMIQUE CIBLE',
    '  • Évolution du mix revenus',
    '  • Structure de coûts cible',
    '  • Marge opérationnelle cible',
    '  • Cash generation',
    'TRAJECTOIRE FINANCIÈRE',
    '  • Projections P&L',
    '  • Projections Cash-flow',
    '  • Plan de financement',
    '  • Enveloppe d\'investissement',
    'RESSOURCES ET ORGANISATION',
    '  • Évolution des effectifs',
    '  • Compétences clés à acquérir',
    '  • Organisation cible',
    '  • Gouvernance de la transformation',
    'GESTION DES RISQUES',
    '  • Risques stratégiques majeurs',
    '  • Plans de mitigation',
    '  • Scénarios alternatifs',
    'FEUILLE DE ROUTE',
    '  • Jalons année 1',
    '  • Jalons année 2',
    '  • Jalons année 3+',
    '  • Points de révision prévus',
    'GOUVERNANCE DU PLAN',
    '  • Pilotage',
    '  • Instances de suivi',
    '  • KPIs de monitoring',
    '  • Processus de révision',
    'ANNEXES',
    '  • Analyses détaillées',
    '  • Business cases',
    '  • Benchmarks'
  ],
  generic: [
    'TITRE DU DOCUMENT',
    'INTRODUCTION',
    '  • Contexte',
    '  • Objectif du document',
    'CONTENU PRINCIPAL',
    '  • Section 1',
    '  • Section 2',
    '  • Section 3',
    'CONCLUSION',
    '  • Synthèse',
    '  • Prochaines étapes'
  ]
};

// ============================================================================
// SENIOR PROMPT ENGINE
// ============================================================================

const AUDIENCE_STYLE_DIRECTIVES: Record<AudienceLevel, string[]> = {
  board: [
    'Ton autoritaire et stratégique adapté aux administrateurs',
    'Focus sur gouvernance, risques majeurs et décisions à prendre',
    'Chiffres clés uniquement, pas de détails opérationnels',
    'Implications pour la création de valeur actionnariale',
    'Langage de haut niveau, pas de jargon technique'
  ],
  c_suite: [
    'Ton exécutif et orienté décision',
    'Focus sur impact business, ROI, risques stratégiques',
    'Synthèse en premier, détails en annexe',
    'Comparaisons marché et benchmarks',
    'Recommandations claires et actionnables'
  ],
  director: [
    'Ton professionnel et structuré',
    'Équilibre entre vision stratégique et opérationnelle',
    'Données chiffrées avec contexte',
    'Implications pour leurs équipes',
    'Prochaines étapes concrètes'
  ],
  manager: [
    'Ton opérationnel et pragmatique',
    'Focus sur mise en œuvre et planification',
    'Détails suffisants pour l\'exécution',
    'Responsabilités clairement identifiées',
    'Calendrier et ressources nécessaires'
  ],
  operational: [
    'Ton pratique et instructif',
    'Focus sur le "comment faire"',
    'Étapes détaillées et claires',
    'Exemples concrets',
    'Points de contrôle et validation'
  ]
};

const INDUSTRY_VOCABULARY: Record<IndustryContext, string[]> = {
  finance: [
    'due diligence', 'closing', 'covenant', 'leverage', 'IRR', 'EBITDA', 'LBO', 'MBO',
    'carry', 'waterfall', 'GP/LP', 'NAV', 'deal flow', 'term sheet', 'cap table',
    'runway', 'burn rate', 'multiple de sortie', 'bridge', 'mezzanine', 'bullet',
    'amortizing', 'covenant reset', 'debt push-down', 'cash sweep'
  ],
  consulting: [
    'workstream', 'deliverable', 'steerco', 'deep dive', 'takeaway', 'bandwidth',
    'leverage', 'scalable', 'value creation', 'quick wins', 'low-hanging fruits',
    'best practice', 'benchmark', 'synergies', 'run rate', 'one-off', 'recurring',
    'normative', 'bridge', 'waterfall', 'as-is', 'to-be', 'gap analysis'
  ],
  technology: [
    'scalabilité', 'architecture', 'API', 'microservices', 'cloud-native', 'SLA',
    'uptime', 'latence', 'throughput', 'sprint', 'backlog', 'user story',
    'MVP', 'POC', 'tech debt', 'refactoring', 'CI/CD', 'DevOps', 'SRE',
    'observability', 'monitoring', 'alerting', 'on-call', 'incident management'
  ],
  healthcare: [
    'AMM', 'essai clinique', 'phase I/II/III', 'endpoint', 'cohorte',
    'randomisation', 'double-aveugle', 'placebo', 'pharmacovigilance',
    'GMP', 'GCP', 'GDP', 'ANSM', 'HAS', 'CEPS', 'remboursement',
    'parcours patient', 'protocole de soins', 'DMP', 'télémédecine'
  ],
  manufacturing: [
    'OEE', 'TRS', 'lean manufacturing', 'kaizen', '5S', 'SMED', 'TPM',
    'supply chain', 'JIT', 'kanban', 'MRP', 'ERP', 'GPAO', 'GMAO',
    'capex', 'ROIC', 'capacity utilization', 'yield', 'scrap rate',
    'first pass yield', 'cycle time', 'takt time', 'WIP', 'bottleneck'
  ],
  retail: [
    'omnicanal', 'drive-to-store', 'click & collect', 'ship-from-store',
    'NPS', 'panier moyen', 'taux de transformation', 'footfall',
    'category management', 'merchandising', 'facing', 'PLV', 'ILV',
    'stock turn', 'sell-through', 'markdown', 'shrinkage', 'same-store sales'
  ],
  legal: [
    'parties contractantes', 'clause résolutoire', 'force majeure',
    'dommages et intérêts', 'préjudice', 'mise en demeure', 'assignation',
    'référé', 'injonction', 'astreinte', 'exequatur', 'arbitrage',
    'médiation', 'transaction', 'protocole d\'accord', 'closing'
  ],
  energy: [
    'transition énergétique', 'mix énergétique', 'LCOE', 'PPA',
    'capacité installée', 'facteur de charge', 'intermittence',
    'stockage', 'smart grid', 'certificats verts', 'taxonomie verte',
    'scope 1/2/3', 'neutralité carbone', 'compensation', 'SBTi'
  ],
  real_estate: [
    'rendement locatif', 'capitalisation', 'vacancy', 'absorption',
    'take-up', 'prime rent', 'headline rent', 'effective rent',
    'cap rate', 'yield', 'NOI', 'FFO', 'NAV', 'LTV',
    'WALB', 'WAULT', 'pipeline', 'réserve foncière'
  ],
  public_sector: [
    'marché public', 'appel d\'offres', 'cahier des charges',
    'offre économiquement la plus avantageuse', 'MAPA', 'DSP',
    'concession', 'PPP', 'CPER', 'fonds européens', 'FEDER',
    'instruction budgétaire', 'programme', 'action', 'BOP'
  ],
  generic: []
};

const FORBIDDEN_PATTERNS = [
  // IA Meta-talk
  'Voici le document', 'Voici le contenu', 'Ce document présente', 'Ce document décrit',
  'Ci-dessous vous trouverez', 'N\'hésitez pas à', 'Je reste à votre disposition',
  'Je vous prie de trouver', 'Veuillez trouver ci-joint', 'Comme demandé,',
  'En réponse à votre demande', 'Suite à votre demande,', 'Conformément à votre demande',
  'Je me permets de vous adresser', 'J\'ai le plaisir de',
  
  // Placeholders
  '[À compléter]', '[Insérer ici]', '[PLACEHOLDER]', '[à définir]', '[TBD]',
  '[Votre nom]', '[Votre société]', '[Date]', '[Montant]', '[Adresse]',
  '...', '...compléter...', '... à renseigner',
  
  // Markdown artifacts
  '**', '##', '###', '####', '```', '---', '___', '***', '> ',
  
  // Fausses données évidentes
  'SIRET 123 456 789', 'SIRET 000 000 000', '12345678900000',
  'exemple@email.com', 'contact@societe.fr', 'XX XX XX XX XX',
  'Rue de l\'Exemple', '1 rue du Test', '00000',
  
  // Formules génériques
  'Lorem ipsum', 'Xxx', 'Yyy', 'Zzz', 'Abc', 'Test test',
  
  // Résumé du Mail (artifact fréquent)
  'Résumé du Mail'
];

export function generateSeniorPrompt(
  classification: ClassificationResult,
  context: DocumentContext
): { systemPrompt: string; userPrompt: string } {
  
  const { category, industry, tone, audience, complexity } = classification;
  const sections = SECTION_TEMPLATES[category];
  const industryVocab = INDUSTRY_VOCABULARY[industry];
  const audienceDirectives = AUDIENCE_STYLE_DIRECTIVES[audience];
  
  const experienceLevel = complexity === 'executive' ? '35 ans' : 
                          complexity === 'complex' ? '25 ans' : '20 ans';
  
  const roleTitle = complexity === 'executive' ? 'SENIOR PARTNER / DIRECTEUR GÉNÉRAL' :
                    complexity === 'complex' ? 'DIRECTEUR SENIOR' : 'MANAGER SENIOR';
  
  const systemPrompt = `Tu es un ${roleTitle} avec plus de ${experienceLevel} d'expérience dans la production de documents professionnels de très haute qualité pour des entreprises du CAC40, des fonds d'investissement internationaux et des cabinets de conseil de premier rang (McKinsey, BCG, Bain).

Tu incarnes l'excellence documentaire: chaque document que tu produis est IMMÉDIATEMENT UTILISABLE par un CEO, un Conseil d'Administration ou un Comité d'Investissement.

════════════════════════════════════════════════════════════════════════════════
RÈGLES ABSOLUES - TOUTE VIOLATION EST UN ÉCHEC CRITIQUE INACCEPTABLE
════════════════════════════════════════════════════════════════════════════════

1. ZÉRO PLACEHOLDER
   ✗ INTERDIT: [À compléter], [Insérer], [TBD], [Votre nom], ...
   ✓ CORRECT: Données réalistes inventées OU omission élégante de la section

2. ZÉRO SYNTAXE MARKDOWN
   ✗ INTERDIT: #, ##, **, *, \`\`\`, ---, ___
   ✓ CORRECT: Mise en forme par structure de texte uniquement

3. ZÉRO META-COMMENTAIRE IA
   ✗ INTERDIT: "Voici le document", "Ce document présente", "N'hésitez pas à"
   ✓ CORRECT: Entrer directement dans le contenu professionnel

4. ZÉRO FAUSSE DONNÉE ÉVIDENTE
   ✗ INTERDIT: SIRET 123 456 789, exemple@email.com, 1 rue du Test
   ✓ CORRECT: SIRET cohérent (14 chiffres), email professionnel crédible

5. ZÉRO FORMULE GÉNÉRIQUE
   ✗ INTERDIT: Lorem ipsum, Xxx, structures visiblement templates
   ✓ CORRECT: Contenu substantiel et contextualisé

════════════════════════════════════════════════════════════════════════════════
EXIGENCES DE QUALITÉ "BOARD-READY"
════════════════════════════════════════════════════════════════════════════════

${audienceDirectives.map(d => `• ${d}`).join('\n')}

DENSITÉ D'INFORMATION:
• Chaque phrase DOIT apporter une information nouvelle ou une valeur ajoutée
• Pas de répétition, pas de remplissage, pas de phrases creuses
• Précision et concision: exprimer le maximum en minimum de mots

VOCABULAIRE PROFESSIONNEL:
• Utiliser le vocabulaire métier approprié au contexte
${industryVocab.length > 0 ? `• Termes sectoriels pertinents: ${industryVocab.slice(0, 10).join(', ')}...` : ''}
• Éviter le jargon gratuit - chaque terme technique doit servir la clarté

STRUCTURE:
• Hiérarchie claire et logique
• Progression du général au particulier OU du constat à la recommandation
• Transitions fluides entre sections

DONNÉES ET CHIFFRES:
• Chiffres réalistes et cohérents entre eux
• Formats français: 1 234 567,89 € (espaces milliers, virgule décimale)
• Dates en format long français: 15 janvier 2024
• Pourcentages avec une décimale: 12,5%

════════════════════════════════════════════════════════════════════════════════
STRUCTURE OBLIGATOIRE POUR CE TYPE DE DOCUMENT
════════════════════════════════════════════════════════════════════════════════

${sections.map((s, i) => s.startsWith('  ') ? s : `\n${i + 1}. ${s}`).join('\n')}

════════════════════════════════════════════════════════════════════════════════
FORMAT TABLEAUX (pour documents transactionnels: BC, factures, devis)
════════════════════════════════════════════════════════════════════════════════

OBLIGATOIRE pour les listes d'articles/prestations:
| Colonne 1 | Colonne 2 | Colonne 3 | Colonne 4 |
| Données   | Données   | Données   | Données   |

Les tableaux doivent contenir des données RÉALISTES et COHÉRENTES.
Les montants doivent être calculés correctement (prix × quantité = total).

════════════════════════════════════════════════════════════════════════════════
GÉNÉRATION DE DONNÉES PROFESSIONNELLES
════════════════════════════════════════════════════════════════════════════════

Si des informations ne sont pas fournies, tu dois INVENTER des données CRÉDIBLES:

• Référence document: Format professionnel avec année
  - Bon de commande: BC-2024-${String(Math.floor(Math.random() * 9000) + 1000)}
  - Facture: FA-2024-${String(Math.floor(Math.random() * 9000) + 1000)}
  - Devis: DEV-2024-${String(Math.floor(Math.random() * 9000) + 1000)}
  
• Date: ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}

• SIRET: 14 chiffres cohérents, format XXX XXX XXX XXXXX
  Exemple: 847 952 361 00024

• TVA Intracommunautaire: FR + 2 chiffres + SIREN (9 chiffres du SIRET)
  Exemple: FR 56 847952361

• RCS: [Ville] B [SIREN]
  Exemple: RCS Paris B 847 952 361

• Capital social: Montant réaliste
  - PME: 10 000 € à 500 000 €
  - ETI: 500 000 € à 10 000 000 €
  - Grande entreprise: 10 000 000 € +

• Adresse: Adresse française réaliste
  Exemple: 47 avenue de l'Opéra, 75002 Paris

• Coordonnées bancaires (si requis):
  - IBAN: FR76 XXXX XXXX XXXX XXXX XXXX XXX
  - BIC: 8 ou 11 caractères

• Montants: Réalistes selon le type de document
  - Prix unitaires avec 2 décimales: 1 250,00 €
  - Totaux calculés correctement
  - TVA à 20% (sauf cas spécifiques)

════════════════════════════════════════════════════════════════════════════════
DERNIER CONTRÔLE AVANT LIVRAISON
════════════════════════════════════════════════════════════════════════════════

Avant de finaliser, vérifie mentalement:
✓ Aucun crochet [] ni placeholder
✓ Aucun markdown visible (#, **, etc.)
✓ Aucune phrase d'introduction IA
✓ Toutes les données sont réalistes
✓ Les calculs sont justes
✓ Le document est immédiatement utilisable tel quel`;

  // Build user prompt with context
  const userPrompt = `DOCUMENT À PRODUIRE: ${context.title}

${context.userPrompt ? `INSTRUCTIONS SPÉCIFIQUES:\n${context.userPrompt}\n` : ''}
${context.companyName ? `SOCIÉTÉ: ${context.companyName}` : ''}
${context.authorName ? `AUTEUR: ${context.authorName}` : ''}
${context.department ? `DÉPARTEMENT: ${context.department}` : ''}

Produis maintenant le document complet en respectant TOUTES les exigences de qualité Senior.`;

  return { systemPrompt, userPrompt };
}

// ============================================================================
// CONTENT VALIDATION & CLEANING
// ============================================================================

export function validateAndCleanContent(content: string): ValidationResult {
  const issues: ValidationIssue[] = [];
  let cleaned = content;
  
  // Initialize quality metrics
  const metrics: QualityMetrics = {
    professionalismScore: 100,
    structureScore: 100,
    clarityScore: 100,
    completenessScore: 100,
    formattingScore: 100,
    dataAccuracyScore: 100,
    overallScore: 100
  };
  
  // Check and remove forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (regex.test(cleaned)) {
      const severity: 'critical' | 'major' = pattern.includes('[') || pattern.includes('SIRET 123') ? 'critical' : 'major';
      issues.push({
        type: severity,
        code: 'FORBIDDEN_PATTERN',
        message: `Pattern interdit détecté: "${pattern}"`,
        autoFixed: true
      });
      metrics.professionalismScore -= severity === 'critical' ? 15 : 8;
      cleaned = cleaned.replace(regex, '');
    }
  }
  
  // Clean markdown artifacts
  const markdownCleaners = [
    { pattern: /```[\s\S]*?```/g, name: 'code blocks', penalty: 10 },
    { pattern: /^#{1,6}\s+(.+)$/gm, replacement: '$1', name: 'headers', penalty: 5 },
    { pattern: /\*\*([^*]+)\*\*/g, replacement: '$1', name: 'bold', penalty: 3 },
    { pattern: /\*([^*]+)\*/g, replacement: '$1', name: 'italic', penalty: 3 },
    { pattern: /__([^_]+)__/g, replacement: '$1', name: 'bold underscore', penalty: 3 },
    { pattern: /_([^_]+)_/g, replacement: '$1', name: 'italic underscore', penalty: 3 },
    { pattern: /^---+$/gm, replacement: '', name: 'horizontal rule', penalty: 5 },
    { pattern: /^___+$/gm, replacement: '', name: 'horizontal rule', penalty: 5 },
    { pattern: /^\*\*\*+$/gm, replacement: '', name: 'horizontal rule', penalty: 5 },
    { pattern: /^>\s+(.+)$/gm, replacement: '$1', name: 'blockquote', penalty: 3 },
    { pattern: /`([^`]+)`/g, replacement: '$1', name: 'inline code', penalty: 3 },
  ];
  
  for (const { pattern, replacement, name, penalty } of markdownCleaners) {
    if (pattern.test(cleaned)) {
      issues.push({
        type: 'minor',
        code: 'MARKDOWN_ARTIFACT',
        message: `Markdown nettoyé: ${name}`,
        autoFixed: true
      });
      metrics.formattingScore -= penalty;
      cleaned = cleaned.replace(pattern, replacement || '');
    }
  }
  
  // Check for placeholder brackets (but preserve table format)
  const bracketMatches = cleaned.match(/\[[^\]|]*\]/g);
  if (bracketMatches) {
    const invalidBrackets = bracketMatches.filter(m => 
      !m.includes('|') && 
      m.length < 100 && 
      (m.toLowerCase().includes('compléter') || 
       m.toLowerCase().includes('insérer') || 
       m.toLowerCase().includes('à définir') ||
       m.includes('...') ||
       m === '[]')
    );
    for (const bracket of invalidBrackets) {
      issues.push({
        type: 'critical',
        code: 'PLACEHOLDER_DETECTED',
        message: `Placeholder non autorisé: ${bracket.slice(0, 50)}`,
        autoFixed: true
      });
      metrics.completenessScore -= 15;
      cleaned = cleaned.replace(bracket, '');
    }
  }
  
  // Check for fake data patterns
  const fakeDataPatterns = [
    { pattern: /SIRET\s*:?\s*123\s*456\s*789/gi, name: 'SIRET factice', penalty: 20 },
    { pattern: /SIRET\s*:?\s*000\s*000\s*000/gi, name: 'SIRET factice', penalty: 20 },
    { pattern: /12345678900000/g, name: 'SIRET factice', penalty: 20 },
    { pattern: /exemple@(email|mail|test)\.(com|fr)/gi, name: 'Email factice', penalty: 10 },
    { pattern: /\b(XX|xx)\s*(XX|xx)\s*(XX|xx)\s*(XX|xx)\s*(XX|xx)\b/g, name: 'Téléphone factice', penalty: 10 },
    { pattern: /00\s*00\s*00\s*00\s*00/g, name: 'Téléphone factice', penalty: 10 },
    { pattern: /\bRue\s+de\s+l['']?Exemple\b/gi, name: 'Adresse factice', penalty: 10 },
    { pattern: /\b1\s+rue\s+du\s+Test\b/gi, name: 'Adresse factice', penalty: 10 },
    { pattern: /\bLorem\s+ipsum\b/gi, name: 'Lorem ipsum', penalty: 25 },
  ];
  
  for (const { pattern, name, penalty } of fakeDataPatterns) {
    if (pattern.test(cleaned)) {
      issues.push({
        type: 'major',
        code: 'FAKE_DATA',
        message: `Donnée factice détectée: ${name}`,
        autoFixed: false
      });
      metrics.dataAccuracyScore -= penalty;
    }
  }
  
  // Check structure (presence of sections)
  const hasMultipleParagraphs = (cleaned.match(/\n\n/g) || []).length >= 2;
  if (!hasMultipleParagraphs) {
    issues.push({
      type: 'minor',
      code: 'POOR_STRUCTURE',
      message: 'Structure potentiellement insuffisante (peu de sections)',
      autoFixed: false
    });
    metrics.structureScore -= 20;
  }
  
  // Check for proper table formatting (if tables detected)
  const tableMatches = cleaned.match(/\|[^|]+\|/g);
  if (tableMatches && tableMatches.length > 0) {
    const hasProperTableFormat = /\|[^|]+\|[^|]+\|/.test(cleaned);
    if (hasProperTableFormat) {
      metrics.formattingScore = Math.min(100, metrics.formattingScore + 5); // Bonus for good tables
    }
  }
  
  // Final cleanup
  cleaned = cleaned
    .replace(/\n{4,}/g, '\n\n\n') // Max 2 empty lines
    .replace(/[ \t]+$/gm, '') // Trailing whitespace
    .replace(/^\s*\n/gm, '\n') // Empty lines with whitespace
    .trim();
  
  // Calculate overall score
  metrics.overallScore = Math.round(
    (metrics.professionalismScore * 0.25 +
     metrics.structureScore * 0.15 +
     metrics.clarityScore * 0.15 +
     metrics.completenessScore * 0.20 +
     metrics.formattingScore * 0.10 +
     metrics.dataAccuracyScore * 0.15)
  );
  
  // Determine grade
  const grade = 
    metrics.overallScore >= 95 ? 'A+' :
    metrics.overallScore >= 85 ? 'A' :
    metrics.overallScore >= 75 ? 'B' :
    metrics.overallScore >= 60 ? 'C' :
    metrics.overallScore >= 40 ? 'D' : 'F';
  
  // Build suggestions
  const suggestions: string[] = [];
  if (metrics.professionalismScore < 80) {
    suggestions.push('Réviser le contenu pour éliminer les patterns non professionnels');
  }
  if (metrics.structureScore < 80) {
    suggestions.push('Améliorer la structure avec des sections plus distinctes');
  }
  if (metrics.dataAccuracyScore < 80) {
    suggestions.push('Remplacer les données factices par des données réalistes');
  }
  if (metrics.formattingScore < 80) {
    suggestions.push('Nettoyer les artefacts de formatage restants');
  }
  
  return {
    isValid: metrics.overallScore >= 60,
    score: metrics.overallScore,
    grade,
    issues,
    suggestions,
    cleanedContent: cleaned,
    qualityMetrics: metrics
  };
}

// ============================================================================
// DATA ENRICHMENT ENGINE
// ============================================================================

function generateRealisticSIRET(): string {
  const siren = String(Math.floor(Math.random() * 900000000) + 100000000);
  const nic = String(Math.floor(Math.random() * 90000) + 10000);
  return `${siren.slice(0, 3)} ${siren.slice(3, 6)} ${siren.slice(6, 9)} ${nic}`;
}

function generateRealisticIBAN(): string {
  const bankCode = String(Math.floor(Math.random() * 90000) + 10000);
  const branchCode = String(Math.floor(Math.random() * 90000) + 10000);
  const accountNumber = String(Math.floor(Math.random() * 9000000000) + 1000000000).slice(0, 11);
  const checkDigits = String(Math.floor(Math.random() * 90) + 10);
  return `FR76 ${bankCode} ${branchCode} ${accountNumber}${checkDigits.slice(0, 2)}`;
}

export function enrichDocumentData(
  category: DocumentCategory,
  context: DocumentContext
): EnrichedData {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  
  // Generate reference based on category
  const prefixes: Record<DocumentCategory, string> = {
    purchase_order: 'BC',
    invoice: 'FA',
    quote: 'DEV',
    contract: 'CTR',
    memo: 'NS',
    meeting_notes: 'CR',
    letter: 'LTR',
    report: 'RAP',
    proposal: 'PROP',
    email: 'MSG',
    procedure: 'PROC',
    specification: 'CDC',
    audit_report: 'AUD',
    policy: 'POL',
    executive_brief: 'BRIEF',
    board_memo: 'BOARD',
    investment_memo: 'INV',
    due_diligence: 'DD',
    strategic_plan: 'STRAT',
    generic: 'DOC'
  };
  
  const prefix = prefixes[category] || 'DOC';
  const siret = generateRealisticSIRET();
  const siren = siret.replace(/\s/g, '').slice(0, 9);
  
  return {
    reference: `${prefix}-${year}-${seq}`,
    dateFormatted: now.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    fiscalInfo: {
      siret,
      tvaIntra: `FR ${String(Math.floor(Math.random() * 90) + 10)} ${siren}`,
      rcs: `RCS Paris B ${siren.slice(0, 3)} ${siren.slice(3, 6)} ${siren.slice(6, 9)}`,
      capital: `${(Math.floor(Math.random() * 9) + 1) * 100000} €`,
      naf: `${String(Math.floor(Math.random() * 90) + 10)}.${String(Math.floor(Math.random() * 9))}${String(Math.floor(Math.random() * 9))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`
    },
    amounts: {
      subtotalHT: `${(Math.floor(Math.random() * 50000) + 5000).toLocaleString('fr-FR')} €`,
      tva: `${(Math.floor(Math.random() * 10000) + 1000).toLocaleString('fr-FR')} €`,
      totalTTC: `${(Math.floor(Math.random() * 60000) + 6000).toLocaleString('fr-FR')} €`,
      currency: 'EUR'
    },
    banking: {
      iban: generateRealisticIBAN(),
      bic: 'BNPAFRPP',
      bank: 'BNP Paribas'
    }
  };
}

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

export function processSeniorDocument(context: DocumentContext): {
  classification: ClassificationResult;
  prompts: { systemPrompt: string; userPrompt: string };
  enrichedData: EnrichedData;
} {
  const classification = classifyDocument(context);
  const prompts = generateSeniorPrompt(classification, context);
  const enrichedData = enrichDocumentData(classification.category, context);
  
  return {
    classification,
    prompts,
    enrichedData
  };
}
