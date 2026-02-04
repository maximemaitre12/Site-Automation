import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, convertInchesToTwip, Table, TableRow, TableCell, WidthType, HeightRule, VerticalAlign, Header, Footer, PageNumber, Tab, TabStopType, TabStopPosition, ShadingType } from "https://esm.sh/docx@8.5.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateRequest {
  templateId: string;
  variables: Record<string, string>;
  title: string;
}

// ============================================================================
// SENIOR DOCUMENT INTELLIGENCE v2.0 - EMBEDDED
// Types, Classification, Prompts, Validation, Enrichment
// ============================================================================

type DocumentCategory = 
  | 'purchase_order' | 'invoice' | 'quote' | 'contract' 
  | 'memo' | 'meeting_notes' | 'letter' | 'report' 
  | 'proposal' | 'email' | 'procedure' | 'specification'
  | 'audit_report' | 'policy' | 'executive_brief' | 'board_memo'
  | 'investment_memo' | 'due_diligence' | 'strategic_plan' | 'generic';

type IndustryContext = 
  | 'finance' | 'consulting' | 'technology' | 'healthcare' 
  | 'manufacturing' | 'retail' | 'legal' | 'energy' 
  | 'real_estate' | 'public_sector' | 'generic';

type AudienceLevel = 
  | 'board' | 'c_suite' | 'director' | 'manager' | 'operational';

type DocumentTone = 
  | 'executive' | 'formal' | 'professional' | 'technical' | 'persuasive';

interface ClassificationResult {
  category: DocumentCategory;
  confidence: number;
  detectedKeywords: string[];
  industry: IndustryContext;
  tone: DocumentTone;
  audience: AudienceLevel;
  complexity: 'simple' | 'standard' | 'complex' | 'executive';
}

// ============================================================================
// CLASSIFICATION PATTERNS - EXTENDED v2.0
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
    keywords: ['mémo ca', 'mémo conseil', 'board memo', 'note au conseil', 'comex', 'conseil d\'administration'],
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

// ============================================================================
// INDUSTRY DETECTION
// ============================================================================

const INDUSTRY_KEYWORDS: Record<IndustryContext, string[]> = {
  finance: ['banque', 'investissement', 'fonds', 'portefeuille', 'crédit', 'assurance', 'fintech', 'asset', 'private equity', 'venture', 'trading', 'compliance', 'régulation', 'bâle', 'solvabilité'],
  consulting: ['cabinet', 'conseil', 'stratégie', 'transformation', 'due diligence', 'mckinsey', 'bcg', 'bain', 'mission', 'deliverable', 'workstream', 'partner'],
  technology: ['software', 'saas', 'cloud', 'développement', 'agile', 'sprint', 'api', 'data', 'ia', 'machine learning', 'devops', 'startup', 'tech', 'platform'],
  healthcare: ['santé', 'médical', 'hôpital', 'clinique', 'pharma', 'patient', 'soins', 'thérapie', 'essai clinique', 'amm', 'remboursement'],
  manufacturing: ['industrie', 'production', 'usine', 'supply chain', 'lean', 'qualité', 'iso', 'maintenance', 'équipement', 'fabrication'],
  retail: ['distribution', 'magasin', 'e-commerce', 'omnicanal', 'merchandising', 'stock', 'logistique', 'enseigne'],
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

// ============================================================================
// DOCUMENT CLASSIFIER v2.0
// ============================================================================

function classifyDocument(title: string, content?: string): ClassificationResult {
  const combined = `${title} ${content || ''}`.toLowerCase();
  const scores: Record<string, number> = {};
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
    
    scores[category] = score;
  }
  
  const entries = Object.entries(scores);
  entries.sort((a, b) => b[1] - a[1]);
  
  const [bestCategory, bestScore] = entries[0];
  const config = CLASSIFICATION_PATTERNS[bestScore > 0 ? bestCategory as DocumentCategory : 'generic'];
  const industry = detectIndustry(combined);
  
  // Determine complexity
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
    category: bestScore > 0 ? bestCategory as DocumentCategory : 'generic',
    confidence: bestScore > 0 ? confidence : 0,
    detectedKeywords: [...new Set(detectedKeywords)],
    industry,
    tone: config.toneDefault || 'professional',
    audience: config.audienceDefault || 'manager',
    complexity
  };
}

// ============================================================================
// AUDIENCE STYLE DIRECTIVES
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

// ============================================================================
// INDUSTRY VOCABULARY
// ============================================================================

const INDUSTRY_VOCABULARY: Record<IndustryContext, string[]> = {
  finance: ['due diligence', 'closing', 'covenant', 'leverage', 'IRR', 'EBITDA', 'LBO', 'carry', 'waterfall', 'GP/LP', 'NAV', 'deal flow', 'term sheet', 'cap table'],
  consulting: ['workstream', 'deliverable', 'steerco', 'deep dive', 'takeaway', 'bandwidth', 'leverage', 'scalable', 'value creation', 'quick wins', 'best practice', 'benchmark'],
  technology: ['scalabilité', 'architecture', 'API', 'microservices', 'cloud-native', 'SLA', 'uptime', 'latence', 'throughput', 'sprint', 'backlog', 'MVP', 'POC'],
  healthcare: ['AMM', 'essai clinique', 'phase I/II/III', 'endpoint', 'cohorte', 'randomisation', 'pharmacovigilance', 'GMP', 'GCP', 'ANSM', 'HAS'],
  manufacturing: ['OEE', 'TRS', 'lean manufacturing', 'kaizen', '5S', 'SMED', 'TPM', 'supply chain', 'JIT', 'kanban', 'MRP', 'ERP'],
  retail: ['omnicanal', 'drive-to-store', 'click & collect', 'ship-from-store', 'NPS', 'panier moyen', 'taux de transformation', 'footfall'],
  legal: ['parties contractantes', 'clause résolutoire', 'force majeure', 'dommages et intérêts', 'préjudice', 'mise en demeure', 'assignation'],
  energy: ['transition énergétique', 'mix énergétique', 'LCOE', 'PPA', 'capacité installée', 'facteur de charge', 'scope 1/2/3', 'neutralité carbone'],
  real_estate: ['rendement locatif', 'capitalisation', 'vacancy', 'absorption', 'take-up', 'prime rent', 'cap rate', 'yield', 'NOI', 'FFO', 'NAV'],
  public_sector: ['marché public', 'appel d\'offres', 'cahier des charges', 'MAPA', 'DSP', 'concession', 'PPP', 'CPER', 'fonds européens'],
  generic: []
};

// ============================================================================
// SENIOR PROMPT ENGINE v2.0
// ============================================================================

const SECTION_TEMPLATES: Record<DocumentCategory, string[]> = {
  purchase_order: ['EN-TÊTE PROFESSIONNEL', 'INFORMATIONS ÉMETTEUR', 'INFORMATIONS FOURNISSEUR', 'ADRESSE LIVRAISON', 'TABLEAU ARTICLES', 'RÉCAPITULATIF FINANCIER', 'CONDITIONS', 'VALIDATION'],
  invoice: ['EN-TÊTE FACTURE', 'ÉMETTEUR', 'FACTURER À', 'RÉFÉRENCES', 'DÉTAIL PRESTATIONS', 'RÉCAPITULATIF TVA', 'TOTAL', 'CONDITIONS RÈGLEMENT', 'COORDONNÉES BANCAIRES', 'MENTIONS LÉGALES'],
  quote: ['EN-TÊTE DEVIS', 'NOTRE SOCIÉTÉ', 'CLIENT', 'OBJET', 'CONTEXTE', 'PROPOSITION', 'DÉTAIL OFFRE', 'RÉCAPITULATIF', 'CONDITIONS', 'ACCEPTATION'],
  contract: ['INTITULÉ', 'ENTRE LES SOUSSIGNÉS', 'PRÉAMBULE', 'OBJET', 'DURÉE', 'OBLIGATIONS', 'CONDITIONS FINANCIÈRES', 'CONFIDENTIALITÉ', 'RÉSILIATION', 'LOI APPLICABLE', 'SIGNATURES'],
  memo: ['EN-TÊTE', 'DE/À/DATE/OBJET', 'CONTEXTE', 'MESSAGE', 'ACTIONS', 'SIGNATURE'],
  meeting_notes: ['EN-TÊTE', 'PARTICIPANTS', 'ORDRE DU JOUR', 'SYNTHÈSE', 'DÉCISIONS', 'PLAN D\'ACTIONS', 'PROCHAINE RÉUNION'],
  report: ['TITRE', 'RÉSUMÉ EXÉCUTIF', 'CONTEXTE', 'ANALYSE', 'RECOMMANDATIONS', 'PLAN D\'ACTION', 'CONCLUSION'],
  proposal: ['PAGE DE GARDE', 'EXECUTIVE SUMMARY', 'COMPRÉHENSION ENJEUX', 'APPROCHE', 'LIVRABLES ET PLANNING', 'ÉQUIPE', 'INVESTISSEMENT', 'RÉFÉRENCES'],
  letter: ['EN-TÊTE', 'DATE ET LIEU', 'DESTINATAIRE', 'OBJET', 'CORPS', 'FORMULE DE POLITESSE', 'SIGNATURE'],
  email: ['OBJET', 'SALUTATION', 'ACCROCHE', 'CORPS', 'CALL TO ACTION', 'SIGNATURE'],
  procedure: ['IDENTIFICATION', 'OBJET', 'PÉRIMÈTRE', 'DÉFINITIONS', 'RESPONSABILITÉS', 'DESCRIPTION ÉTAPES', 'ENREGISTREMENTS', 'HISTORIQUE'],
  specification: ['PAGE DE GARDE', 'HISTORIQUE', 'CONTEXTE', 'PÉRIMÈTRE', 'EXIGENCES FONCTIONNELLES', 'EXIGENCES TECHNIQUES', 'CONTRAINTES', 'LIVRABLES', 'PLANNING'],
  audit_report: ['TITRE', 'SYNTHÈSE', 'MÉTHODOLOGIE', 'CONSTATS', 'NON-CONFORMITÉS', 'RECOMMANDATIONS', 'PLAN D\'ACTION', 'CONCLUSION'],
  policy: ['IDENTIFICATION', 'OBJET', 'CHAMP D\'APPLICATION', 'PRINCIPES', 'RÈGLES', 'RESPONSABILITÉS', 'CONTRÔLE', 'ENTRÉE EN VIGUEUR'],
  executive_brief: ['EN-TÊTE', 'POINTS CLÉS', 'CONTEXTE', 'ANALYSE', 'OPTIONS ET RECOMMANDATION', 'DÉCISION REQUISE', 'PROCHAINES ÉTAPES'],
  board_memo: ['EN-TÊTE CONFIDENTIEL', 'SYNTHÈSE POUR LE CONSEIL', 'CONTEXTE STRATÉGIQUE', 'PRÉSENTATION', 'ANALYSE', 'IMPACTS', 'RÉSOLUTION PROPOSÉE', 'ANNEXES'],
  investment_memo: ['EXECUTIVE SUMMARY', 'OVERVIEW CIBLE', 'THÈSE D\'INVESTISSEMENT', 'ANALYSE MARCHÉ', 'ANALYSE FINANCIÈRE', 'VALORISATION', 'STRUCTURE TRANSACTION', 'RISQUES', 'SCÉNARIOS DE SORTIE', 'RECOMMANDATION'],
  due_diligence: ['SYNTHÈSE EXÉCUTIVE', 'PÉRIMÈTRE ET MÉTHODOLOGIE', 'QUALITY OF EARNINGS', 'ANALYSE BILAN', 'ASPECTS OPÉRATIONNELS', 'ASPECTS JURIDIQUES', 'RED FLAGS', 'AJUSTEMENTS DE PRIX', 'RECOMMANDATIONS'],
  strategic_plan: ['MOT DU CEO', 'EXECUTIVE SUMMARY', 'DIAGNOSTIC', 'VISION ET AMBITION', 'AXES STRATÉGIQUES', 'TRAJECTOIRE FINANCIÈRE', 'FEUILLE DE ROUTE', 'GOUVERNANCE'],
  generic: ['TITRE', 'INTRODUCTION', 'CONTENU', 'CONCLUSION']
};

function generateSeniorSystemPrompt(classification: ClassificationResult): string {
  const { category, industry, tone, audience, complexity } = classification;
  const sections = SECTION_TEMPLATES[category];
  const audienceDirectives = AUDIENCE_STYLE_DIRECTIVES[audience];
  const industryVocab = INDUSTRY_VOCABULARY[industry];
  
  const experienceLevel = complexity === 'executive' ? '35 ans' : 
                          complexity === 'complex' ? '25 ans' : '20 ans';
  
  const roleTitle = complexity === 'executive' ? 'SENIOR PARTNER / DIRECTEUR GÉNÉRAL' :
                    complexity === 'complex' ? 'DIRECTEUR SENIOR' : 'MANAGER SENIOR';

  return `Tu es un ${roleTitle} avec plus de ${experienceLevel} d'expérience dans la production de documents professionnels de très haute qualité pour des entreprises du CAC40, des fonds d'investissement internationaux et des cabinets de conseil de premier rang (McKinsey, BCG, Bain).

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
EXIGENCES DE QUALITÉ "BOARD-READY" - NIVEAU ${audience.toUpperCase()}
════════════════════════════════════════════════════════════════════════════════

${audienceDirectives.map(d => `• ${d}`).join('\n')}

DENSITÉ D'INFORMATION:
• Chaque phrase DOIT apporter une information nouvelle ou une valeur ajoutée
• Pas de répétition, pas de remplissage, pas de phrases creuses
• Précision et concision: exprimer le maximum en minimum de mots

VOCABULAIRE PROFESSIONNEL (${industry !== 'generic' ? industry.toUpperCase() : 'STANDARD'}):
• Utiliser le vocabulaire métier approprié au contexte
${industryVocab.length > 0 ? `• Termes sectoriels pertinents: ${industryVocab.slice(0, 12).join(', ')}...` : '• Vocabulaire professionnel standard'}
• Éviter le jargon gratuit - chaque terme technique doit servir la clarté

TON: ${tone.toUpperCase()}
• Adapter le registre au niveau de l'audience et au type de document
• Professionnel et assuré, jamais hésitant ni approximatif

════════════════════════════════════════════════════════════════════════════════
STRUCTURE OBLIGATOIRE - ${category.toUpperCase().replace(/_/g, ' ')}
════════════════════════════════════════════════════════════════════════════════

${sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

════════════════════════════════════════════════════════════════════════════════
FORMAT TABLEAUX (documents transactionnels: BC, factures, devis)
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
  - Bon de commande: BC-2025-XXXX
  - Facture: FA-2025-XXXX
  - Devis: DEV-2025-XXXX
  
• Date: Format français complet (ex: 4 février 2025)

• SIRET: 14 chiffres cohérents, format XXX XXX XXX XXXXX
  Exemple: 847 952 361 00024

• TVA Intracommunautaire: FR + 2 chiffres + SIREN
  Exemple: FR 56 847952361

• RCS: [Ville] B [SIREN]
  Exemple: RCS Paris B 847 952 361

• Capital social: Montant réaliste selon taille entreprise

• Adresse: Adresse française réaliste et plausible

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
}

// ============================================================================
// CONTENT CLEANING & VALIDATION v2.0
// ============================================================================

const FORBIDDEN_PATTERNS = [
  // IA Meta-talk
  'Voici le document', 'Voici le contenu', 'Ce document présente', 'Ce document décrit',
  'Ci-dessous vous trouverez', 'N\'hésitez pas à', 'Je reste à votre disposition',
  'Je vous prie de trouver', 'Veuillez trouver ci-joint', 'Comme demandé,',
  'En réponse à votre demande', 'Suite à votre demande,', 'Conformément à votre demande',
  'Je me permets de vous adresser', 'J\'ai le plaisir de', 'Résumé du Mail',
  
  // Placeholders
  '[À compléter]', '[Insérer ici]', '[PLACEHOLDER]', '[à définir]', '[TBD]',
  '[Votre nom]', '[Votre société]', '[Date]', '[Montant]', '[Adresse]',
  '...compléter...', '... à renseigner',
  
  // Markdown artifacts
  '**', '##', '###', '####', '```', '---', '___', '***',
  
  // Fake data patterns
  'SIRET 123 456 789', 'SIRET 000 000 000', '12345678900000',
  'exemple@email.com', 'contact@societe.fr', 'test@test.com',
  'Rue de l\'Exemple', '1 rue du Test', '00000', 'XX XX XX XX XX',
  
  // Generic fillers
  'Lorem ipsum', 'Xxx', 'Yyy', 'Zzz', 'Abc', 'Test test'
];

interface ValidationResult {
  cleaned: string;
  score: number;
  grade: string;
  issues: string[];
}

function cleanAndValidateContent(content: string): ValidationResult {
  const issues: string[] = [];
  let cleaned = content;
  let score = 100;
  
  // Remove forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (regex.test(cleaned)) {
      issues.push(`Pattern supprimé: "${pattern.slice(0, 30)}..."`);
      score -= pattern.includes('[') ? 10 : 5;
      cleaned = cleaned.replace(regex, '');
    }
  }
  
  // Clean markdown artifacts
  const markdownCleaners = [
    { pattern: /```[\s\S]*?```/g, replacement: '', name: 'code blocks' },
    { pattern: /^#{1,6}\s+(.+)$/gm, replacement: '$1', name: 'headers' },
    { pattern: /\*\*([^*]+)\*\*/g, replacement: '$1', name: 'bold' },
    { pattern: /\*([^*]+)\*/g, replacement: '$1', name: 'italic' },
    { pattern: /__([^_]+)__/g, replacement: '$1', name: 'bold underscore' },
    { pattern: /_([^_]+)_/g, replacement: '$1', name: 'italic underscore' },
    { pattern: /^---+$/gm, replacement: '', name: 'hr' },
    { pattern: /^___+$/gm, replacement: '', name: 'hr' },
    { pattern: /^\*\*\*+$/gm, replacement: '', name: 'hr' },
    { pattern: /^>\s+(.+)$/gm, replacement: '$1', name: 'blockquote' },
    { pattern: /`([^`]+)`/g, replacement: '$1', name: 'inline code' },
  ];
  
  for (const { pattern, replacement, name } of markdownCleaners) {
    if (pattern.test(cleaned)) {
      issues.push(`Markdown nettoyé: ${name}`);
      score -= 3;
      cleaned = cleaned.replace(pattern, replacement);
    }
  }
  
  // Remove invalid brackets (but preserve table format)
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
      cleaned = cleaned.replace(bracket, '');
      issues.push(`Placeholder supprimé: ${bracket.slice(0, 30)}...`);
      score -= 10;
    }
  }
  
  // Final cleanup
  cleaned = cleaned
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/^\s*\n/gm, '\n')
    .trim();
  
  // Determine grade
  const grade = 
    score >= 95 ? 'A+' :
    score >= 85 ? 'A' :
    score >= 75 ? 'B' :
    score >= 60 ? 'C' :
    score >= 40 ? 'D' : 'F';
  
  return { cleaned, score: Math.max(0, score), grade, issues };
}

// ============================================================================
// CONTENT PARSING FOR WORD STRUCTURE
// ============================================================================

interface ContentSection {
  type: 'heading' | 'paragraph' | 'list' | 'table';
  level?: number;
  text: string;
  items?: string[];
  rows?: string[][];
}

function parseContentIntoSections(content: string): ContentSection[] {
  const sections: ContentSection[] = [];
  const lines = content.split('\n');
  
  let currentParagraph = '';
  let inList = false;
  let listItems: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Table detection
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      if (inList && listItems.length > 0) {
        sections.push({ type: 'list', text: '', items: [...listItems] });
        listItems = [];
        inList = false;
      }
      
      // Skip separator rows
      if (/^\|[-:\s|]+\|$/.test(trimmedLine)) continue;
      
      inTable = true;
      const cells = trimmedLine.split('|').filter(c => c.trim()).map(c => c.trim());
      tableRows.push(cells);
      continue;
    }
    
    // End of table
    if (inTable && !trimmedLine.startsWith('|')) {
      if (tableRows.length > 0) {
        sections.push({ type: 'table', text: '', rows: [...tableRows] });
        tableRows = [];
      }
      inTable = false;
    }
    
    if (!trimmedLine) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      if (inList && listItems.length > 0) {
        sections.push({ type: 'list', text: '', items: [...listItems] });
        listItems = [];
        inList = false;
      }
      continue;
    }
    
    // Uppercase headings
    if (/^[A-ZÉÈÀÙÂÊÎÔÛÄËÏÖÜ][A-ZÉÈÀÙÂÊÎÔÛÄËÏÖÜ\s\-\d'']{2,}$/.test(trimmedLine) && trimmedLine.length <= 80) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      sections.push({ type: 'heading', level: 1, text: trimmedLine });
      continue;
    }
    
    // Numbered headings
    const numberedMatch = trimmedLine.match(/^(ARTICLE\s+)?(\d+(?:\.\d+)*)[.\-\s]+(.+)$/i);
    if (numberedMatch && trimmedLine.length <= 100) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      const depth = numberedMatch[2].split('.').length;
      sections.push({ type: 'heading', level: Math.min(depth + 1, 3), text: trimmedLine });
      continue;
    }
    
    // Section headers with colon
    if (/^[A-ZÉÈÀÙÂÊÎÔÛ][a-zéèàùâêîôûäëïöü\s]{0,20}:/.test(trimmedLine) && trimmedLine.length <= 80) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      sections.push({ type: 'heading', level: 2, text: trimmedLine });
      continue;
    }
    
    // Bullet points
    if (/^[•\-\*✓✗▸►]\s+/.test(trimmedLine)) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      inList = true;
      listItems.push(trimmedLine.replace(/^[•\-\*✓✗▸►]\s+/, ''));
      continue;
    }
    
    // Numbered list items
    if (/^\d+[.)]\s+/.test(trimmedLine) && !numberedMatch) {
      if (currentParagraph) {
        sections.push({ type: 'paragraph', text: currentParagraph.trim() });
        currentParagraph = '';
      }
      inList = true;
      listItems.push(trimmedLine);
      continue;
    }
    
    if (inList && listItems.length > 0 && !/^[•\-\*\d✓✗▸►]/.test(trimmedLine)) {
      sections.push({ type: 'list', text: '', items: [...listItems] });
      listItems = [];
      inList = false;
    }
    
    currentParagraph += (currentParagraph ? ' ' : '') + trimmedLine;
  }
  
  // Handle remaining content
  if (currentParagraph) {
    sections.push({ type: 'paragraph', text: currentParagraph.trim() });
  }
  if (listItems.length > 0) {
    sections.push({ type: 'list', text: '', items: listItems });
  }
  if (tableRows.length > 0) {
    sections.push({ type: 'table', text: '', rows: tableRows });
  }
  
  return sections;
}

// ============================================================================
// DOCUMENT COLOR SCHEMES - EXTENDED
// ============================================================================

const COLOR_SCHEMES: Record<DocumentCategory, { primary: string; accent: string; light: string }> = {
  purchase_order: { primary: '1E3A5F', accent: '2E7D32', light: 'E8F5E9' },
  invoice: { primary: '1F2937', accent: '1976D2', light: 'E3F2FD' },
  quote: { primary: '0D47A1', accent: 'FF6F00', light: 'FFF3E0' },
  contract: { primary: '263238', accent: '37474F', light: 'ECEFF1' },
  memo: { primary: '1565C0', accent: '0277BD', light: 'E1F5FE' },
  meeting_notes: { primary: '2E7D32', accent: '388E3C', light: 'E8F5E9' },
  report: { primary: '1A237E', accent: '283593', light: 'E8EAF6' },
  proposal: { primary: '4527A0', accent: '7B1FA2', light: 'F3E5F5' },
  letter: { primary: '37474F', accent: '455A64', light: 'ECEFF1' },
  email: { primary: '424242', accent: '616161', light: 'F5F5F5' },
  procedure: { primary: '00695C', accent: '00897B', light: 'E0F2F1' },
  specification: { primary: '1565C0', accent: '1976D2', light: 'E3F2FD' },
  audit_report: { primary: 'B71C1C', accent: 'C62828', light: 'FFEBEE' },
  policy: { primary: '4A148C', accent: '6A1B9A', light: 'F3E5F5' },
  executive_brief: { primary: '0D47A1', accent: '1565C0', light: 'E3F2FD' },
  board_memo: { primary: '1B5E20', accent: '2E7D32', light: 'E8F5E9' },
  investment_memo: { primary: '311B92', accent: '4527A0', light: 'EDE7F6' },
  due_diligence: { primary: 'BF360C', accent: 'D84315', light: 'FBE9E7' },
  strategic_plan: { primary: '006064', accent: '00838F', light: 'E0F7FA' },
  generic: { primary: '1F2937', accent: '3C4DFE', light: 'E8EAF6' }
};

function generateEnrichedReference(category: DocumentCategory): { reference: string; date: string } {
  const now = new Date();
  const year = now.getFullYear();
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  
  const prefixes: Record<DocumentCategory, string> = {
    purchase_order: 'BC', invoice: 'FA', quote: 'DEV', contract: 'CTR',
    memo: 'NS', meeting_notes: 'CR', report: 'RAP', proposal: 'PROP',
    letter: 'COU', email: 'MSG', procedure: 'PROC', specification: 'CDC',
    audit_report: 'AUD', policy: 'POL', executive_brief: 'BRIEF',
    board_memo: 'BOARD', investment_memo: 'INV', due_diligence: 'DD',
    strategic_plan: 'STRAT', generic: 'DOC'
  };
  
  return {
    reference: `${prefixes[category]}-${year}-${String(randomNum).padStart(4, '0')}`,
    date: now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  };
}

// ============================================================================
// SENIOR WORD DOCUMENT GENERATION v2.0
// ============================================================================

async function generateSeniorWordDocument(
  title: string, 
  content: string, 
  classification: ClassificationResult
): Promise<Uint8Array> {
  const { cleaned } = cleanAndValidateContent(content);
  const sections = parseContentIntoSections(cleaned);
  const { category, complexity, audience } = classification;
  const colors = COLOR_SCHEMES[category];
  const { reference, date } = generateEnrichedReference(category);
  
  const children: any[] = [];
  
  // === EXECUTIVE HEADER FOR HIGH-LEVEL DOCUMENTS ===
  if (complexity === 'executive' || audience === 'board' || audience === 'c_suite') {
    // Confidential badge for executive documents
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "CONFIDENTIEL",
            bold: true,
            size: 18,
            font: "Calibri",
            color: "FFFFFF",
            allCaps: true,
          }),
        ],
        alignment: AlignmentType.RIGHT,
        shading: { fill: colors.primary, type: ShadingType.SOLID },
        spacing: { after: 200 },
      })
    );
  }
  
  // === DOCUMENT TITLE ===
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: complexity === 'executive' ? 48 : 44,
          font: "Calibri Light",
          color: colors.primary,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    })
  );
  
  // === REFERENCE AND DATE LINE ===
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Réf. ${reference}`,
          size: 22,
          font: "Calibri",
          color: colors.accent,
          bold: true,
        }),
        new TextRun({
          text: `  │  ${date}`,
          size: 22,
          font: "Calibri",
          color: '6B7280',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );
  
  // === DECORATIVE SEPARATOR ===
  children.push(
    new Paragraph({
      border: {
        bottom: {
          color: colors.accent,
          space: 1,
          style: BorderStyle.SINGLE,
          size: complexity === 'executive' ? 24 : 18,
        },
      },
      spacing: { after: 400 },
    })
  );
  
  // === PROCESS CONTENT SECTIONS ===
  for (const section of sections) {
    if (section.type === 'heading') {
      const level = section.level || 1;
      const fontSize = level === 1 ? 32 : level === 2 ? 28 : 24;
      const color = level === 1 ? colors.primary : level === 2 ? colors.accent : '4B5563';
      const spaceBefore = level === 1 ? 400 : level === 2 ? 300 : 200;
      const spaceAfter = level === 1 ? 200 : 150;
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: section.text,
              bold: true,
              size: fontSize,
              font: level === 1 ? "Calibri Light" : "Calibri",
              color: color,
            }),
          ],
          spacing: { before: spaceBefore, after: spaceAfter },
          border: level === 1 ? {
            bottom: {
              color: colors.light.replace('#', ''),
              space: 4,
              style: BorderStyle.SINGLE,
              size: 8,
            },
          } : undefined,
        })
      );
    } else if (section.type === 'paragraph') {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: section.text,
              size: 24,
              font: "Calibri",
              color: "374151",
            }),
          ],
          spacing: { after: 200, line: 360 },
          alignment: AlignmentType.JUSTIFIED,
        })
      );
    } else if (section.type === 'list' && section.items) {
      for (const item of section.items) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "▸ ",
                size: 24,
                font: "Calibri",
                color: colors.accent,
                bold: true,
              }),
              new TextRun({
                text: item,
                size: 24,
                font: "Calibri",
                color: "374151",
              }),
            ],
            spacing: { after: 100, line: 340 },
            indent: { left: convertInchesToTwip(0.4) },
          })
        );
      }
      children.push(new Paragraph({ spacing: { after: 150 } }));
    } else if (section.type === 'table' && section.rows && section.rows.length > 0) {
      const tableRows = section.rows.map((row, rowIndex) => {
        return new TableRow({
          height: { value: 450, rule: HeightRule.ATLEAST },
          children: row.map((cell) => {
            return new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: cell,
                      size: 20,
                      font: "Calibri",
                      bold: rowIndex === 0,
                      color: rowIndex === 0 ? "FFFFFF" : "374151",
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 60, after: 60 },
                }),
              ],
              verticalAlign: VerticalAlign.CENTER,
              shading: rowIndex === 0 
                ? { fill: colors.primary, type: ShadingType.SOLID }
                : rowIndex % 2 === 0 
                  ? { fill: colors.light, type: ShadingType.SOLID } 
                  : { fill: "FFFFFF", type: ShadingType.SOLID },
              margins: {
                top: 60,
                bottom: 60,
                left: 120,
                right: 120,
              },
            });
          }),
        });
      });
      
      children.push(
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        })
      );
      
      children.push(new Paragraph({ spacing: { after: 300 } }));
    }
  }
  
  // === CREATE DOCUMENT WITH PROFESSIONAL HEADER/FOOTER ===
  const doc = new Document({
    creator: "AETHER AI Suite - Senior Document Intelligence v2.0",
    title: title,
    description: `Document professionnel - ${category} - Qualité ${classification.complexity}`,
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 24,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${reference}`,
                    size: 18,
                    font: "Calibri",
                    color: "9CA3AF",
                  }),
                  new TextRun({
                    text: complexity === 'executive' ? `  │  ${audience.toUpperCase()}` : '',
                    size: 18,
                    font: "Calibri",
                    color: colors.accent,
                    bold: true,
                  }),
                ],
                alignment: AlignmentType.RIGHT,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Document généré par AETHER  │  ",
                    size: 18,
                    font: "Calibri",
                    color: "9CA3AF",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    font: "Calibri",
                    color: colors.primary,
                    bold: true,
                  }),
                  new TextRun({
                    text: " / ",
                    size: 18,
                    font: "Calibri",
                    color: "9CA3AF",
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 18,
                    font: "Calibri",
                    color: colors.primary,
                    bold: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                border: {
                  top: {
                    color: "E5E7EB",
                    space: 8,
                    style: BorderStyle.SINGLE,
                    size: 6,
                  },
                },
              }),
            ],
          }),
        },
        children,
      },
    ],
  });
  
  return await Packer.toBuffer(doc);
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { templateId, variables, title } = await req.json() as GenerateRequest;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('AI service not configured');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get template info
    const { data: template } = await supabase
      .from('doc_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    const templateName = template?.name || 'Document';
    
    // === SENIOR INTELLIGENCE v2.0: CLASSIFY DOCUMENT ===
    const userPrompt = variables.prompt || '';
    const classification = classifyDocument(title, userPrompt);
    const { category, industry, tone, audience, complexity } = classification;

    console.log(`[Senior UX v2.0] Document: "${title}"`);
    console.log(`[Senior UX v2.0] Classification: ${category} | Industry: ${industry} | Tone: ${tone} | Audience: ${audience} | Complexity: ${complexity}`);
    console.log(`[Senior UX v2.0] Confidence: ${(classification.confidence * 100).toFixed(0)}% | Keywords: ${classification.detectedKeywords.join(', ') || 'none'}`);
    
    // === GENERATE SENIOR PROMPTS ===
    const systemPrompt = generateSeniorSystemPrompt(classification);
    
    const generatePrompt = `DOCUMENT À RÉDIGER: ${category.toUpperCase().replace(/_/g, ' ')}

TITRE: ${title}

${userPrompt ? `INSTRUCTIONS SPÉCIFIQUES:\n${userPrompt}` : 'Génère un document professionnel complet avec des données réalistes.'}

${Object.keys(variables).length > 0 ? 
  `VARIABLES FOURNIES:\n${Object.entries(variables).filter(([k]) => k !== 'prompt').map(([k, v]) => `• ${k}: ${v}`).join('\n')}` : ''}

═══════════════════════════════════════════════════════════════
GÉNÈRE LE DOCUMENT COMPLET - QUALITÉ ${complexity.toUpperCase()} IRRÉPROCHABLE
Niveau d'audience: ${audience.toUpperCase()}
═══════════════════════════════════════════════════════════════`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: generatePrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const aiResponse = await response.json();
    let content = aiResponse.choices?.[0]?.message?.content || '';

    if (!content) {
      throw new Error('No content generated');
    }

    // === VALIDATE AND CLEAN CONTENT ===
    const validation = cleanAndValidateContent(content);
    console.log(`[Senior UX v2.0] Quality: ${validation.grade} (${validation.score}/100)`);
    if (validation.issues.length > 0) {
      console.log(`[Senior UX v2.0] Issues fixed: ${validation.issues.length}`);
    }

    // === GENERATE WORD DOCUMENT WITH SENIOR STYLING ===
    const docBuffer = await generateSeniorWordDocument(title, content, classification);
    
    // Upload to storage
    const fileName = `docs/${user.id}/${Date.now()}-${title.replace(/[^a-zA-Z0-9àâäéèêëïîôùûüç\s-]/gi, '_')}.docx`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, docBuffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload document');
    }

    // Get download URL
    const { data: signedUrlData } = await supabase.storage
      .from('documents')
      .createSignedUrl(fileName, 60 * 60 * 24 * 7);

    // Create the document in the database
    const { data: document, error: insertError } = await supabase
      .from('aether_documents')
      .insert({
        user_id: user.id,
        title,
        content: validation.cleaned,
        template_id: templateId,
        file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        file_url: signedUrlData?.signedUrl || null,
        status: 'completed',
        embedding_status: 'pending',
        metadata: JSON.stringify({ 
          category,
          industry,
          audience,
          complexity,
          generated_with: 'senior_intelligence_v2',
          quality_score: validation.score,
          quality_grade: validation.grade,
          detected_keywords: classification.detectedKeywords
        })
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error('Failed to save document');
    }

    console.log(`[Senior UX v2.0] Document generated successfully: ${document.id}`);

    return new Response(
      JSON.stringify({ 
        document,
        downloadUrl: signedUrlData?.signedUrl,
        category,
        industry,
        audience,
        complexity,
        qualityScore: validation.score,
        qualityGrade: validation.grade
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in doc-generate-word function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
