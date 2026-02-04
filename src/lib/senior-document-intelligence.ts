/**
 * Senior Document Intelligence Engine
 * Logique avancée pour la génération de documents professionnels "board-ready"
 * 
 * Architecture:
 * 1. DocumentClassifier - Classification intelligente multi-critères
 * 2. SeniorPromptEngine - Génération de prompts ultra-spécialisés
 * 3. ContentEnricher - Enrichissement automatique des données
 * 4. QualityValidator - Validation et nettoyage du contenu
 * 5. StyleEngine - Application du style professionnel
 */

// ============================================================================
// TYPES & INTERFACES
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
  | 'generic';            // Document générique

export interface DocumentContext {
  title: string;
  userPrompt?: string;
  variables?: Record<string, string>;
  companyName?: string;
  authorName?: string;
  department?: string;
}

export interface ClassificationResult {
  category: DocumentCategory;
  confidence: number;
  secondaryCategory?: DocumentCategory;
  detectedKeywords: string[];
  suggestedSections: string[];
}

export interface SeniorPromptConfig {
  systemPrompt: string;
  structureGuide: string[];
  vocabularyBank: string[];
  forbiddenPatterns: string[];
  qualityChecklist: string[];
}

export interface EnrichedData {
  reference: string;
  dateFormatted: string;
  fiscalInfo?: {
    siret: string;
    tvaIntra: string;
    rcs: string;
  };
  amounts?: {
    subtotalHT: string;
    tva: string;
    totalTTC: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
  cleanedContent: string;
}

// ============================================================================
// DOCUMENT CLASSIFIER
// ============================================================================

const CLASSIFICATION_PATTERNS: Record<DocumentCategory, {
  keywords: string[];
  weight: number;
  regex?: RegExp[];
}> = {
  purchase_order: {
    keywords: ['bon de commande', 'purchase order', 'commande fournisseur', 'ordre d\'achat', 'bc'],
    weight: 10,
    regex: [/bc[-\s]?\d+/i, /po[-\s]?\d+/i, /commande\s+n[°o]?\s*\d+/i]
  },
  invoice: {
    keywords: ['facture', 'invoice', 'facturation', 'règlement', 'échéance'],
    weight: 10,
    regex: [/fa[-\s]?\d+/i, /inv[-\s]?\d+/i, /facture\s+n[°o]?\s*\d+/i]
  },
  quote: {
    keywords: ['devis', 'quotation', 'offre commerciale', 'proposition tarifaire', 'estimation', 'chiffrage'],
    weight: 9,
    regex: [/dev[-\s]?\d+/i, /qt[-\s]?\d+/i, /devis\s+n[°o]?\s*\d+/i]
  },
  contract: {
    keywords: ['contrat', 'accord', 'convention', 'contract', 'agreement', 'engagement', 'avenant'],
    weight: 9,
    regex: [/contrat\s+n[°o]?\s*\d+/i, /avenant\s+n[°o]?\s*\d+/i]
  },
  memo: {
    keywords: ['note de service', 'mémo', 'memo', 'circulaire', 'communication interne', 'note interne'],
    weight: 8,
    regex: [/ns[-\s]?\d+/i, /note\s+n[°o]?\s*\d+/i]
  },
  meeting_notes: {
    keywords: ['compte-rendu', 'compte rendu', 'procès-verbal', 'pv', 'réunion', 'meeting notes', 'minutes'],
    weight: 8,
    regex: [/pv[-\s]?\d+/i, /cr[-\s]?\d+/i]
  },
  report: {
    keywords: ['rapport', 'report', 'analyse', 'étude', 'bilan', 'synthèse', 'état des lieux'],
    weight: 7,
    regex: [/rapport\s+(d[''])?/i]
  },
  proposal: {
    keywords: ['proposition', 'proposal', 'offre de service', 'offre technique', 'réponse appel'],
    weight: 8,
    regex: [/prop[-\s]?\d+/i]
  },
  letter: {
    keywords: ['lettre', 'courrier', 'letter', 'correspondance', 'missive'],
    weight: 6,
    regex: [/lettre\s+(de|à)/i]
  },
  email: {
    keywords: ['email', 'mail', 'courriel', 'message électronique', 'e-mail'],
    weight: 5
  },
  procedure: {
    keywords: ['procédure', 'processus', 'mode opératoire', 'instruction', 'protocole'],
    weight: 7,
    regex: [/proc[-\s]?\d+/i]
  },
  specification: {
    keywords: ['cahier des charges', 'spécification', 'cdc', 'spec', 'requirements', 'exigences'],
    weight: 8,
    regex: [/cdc[-\s]?\d+/i]
  },
  audit_report: {
    keywords: ['audit', 'contrôle', 'inspection', 'vérification', 'conformité'],
    weight: 8,
    regex: [/audit[-\s]?\d+/i]
  },
  policy: {
    keywords: ['politique', 'charte', 'règlement', 'directive', 'policy'],
    weight: 7
  },
  generic: {
    keywords: [],
    weight: 0
  }
};

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
    
    // Regex matching (stronger signal)
    if (config.regex) {
      for (const regex of config.regex) {
        if (regex.test(combined)) {
          score += config.weight * 1.5;
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
  
  const totalPossible = Math.max(...Object.values(CLASSIFICATION_PATTERNS).map(c => c.weight * c.keywords.length * 2));
  const confidence = Math.min(bestScore / totalPossible, 1);
  
  return {
    category: bestScore > 0 ? bestCategory : 'generic',
    confidence: bestScore > 0 ? confidence : 0,
    secondaryCategory: secondCategory,
    detectedKeywords: [...new Set(detectedKeywords)],
    suggestedSections: SECTION_TEMPLATES[bestScore > 0 ? bestCategory : 'generic']
  };
}

// ============================================================================
// SECTION TEMPLATES
// ============================================================================

const SECTION_TEMPLATES: Record<DocumentCategory, string[]> = {
  purchase_order: [
    'EN-TÊTE (Logo, Référence BC, Date)',
    'SOCIÉTÉ ÉMETTRICE (Raison sociale, SIRET, Adresse)',
    'FOURNISSEUR (Raison sociale, SIRET, Adresse)',
    'ADRESSE DE LIVRAISON',
    'TABLEAU DES ARTICLES (N°, Réf, Désignation, Qté, Unité, PU HT, Total HT)',
    'RÉCAPITULATIF FINANCIER (Sous-total HT, TVA 20%, Total TTC)',
    'CONDITIONS DE PAIEMENT',
    'CONDITIONS DE LIVRAISON (Date, Incoterm)',
    'INSTRUCTIONS PARTICULIÈRES',
    'ZONE DE SIGNATURE (Bon pour accord, Nom, Fonction, Date)'
  ],
  invoice: [
    'EN-TÊTE FACTURE (Logo, N° Facture séquentiel, Date émission)',
    'ÉMETTEUR (Société, SIRET, N° TVA Intracommunautaire, RCS, Capital)',
    'FACTURER À (Client, Adresse facturation, N° Client)',
    'RÉFÉRENCES (N° Commande, N° Devis, Date commande)',
    'DÉTAIL DES PRESTATIONS (Réf, Désignation, Qté, PU HT, Taux TVA, Total HT)',
    'RÉCAPITULATIF TVA (Base HT par taux, Montant TVA)',
    'TOTAL (Total HT, Total TVA, Total TTC)',
    'CONDITIONS DE RÈGLEMENT (Échéance, Mode de paiement)',
    'COORDONNÉES BANCAIRES (IBAN, BIC)',
    'MENTIONS LÉGALES (Pénalités de retard, Indemnité forfaitaire 40€)'
  ],
  quote: [
    'EN-TÊTE DEVIS (Logo, Référence, Date, Validité)',
    'NOTRE SOCIÉTÉ',
    'CLIENT DESTINATAIRE',
    'OBJET DU DEVIS',
    'CONTEXTE ET COMPRÉHENSION DU BESOIN',
    'NOTRE PROPOSITION',
    'DÉTAIL DE L\'OFFRE (Désignation, Description, Qté, Tarif, Total)',
    'OPTIONS COMPLÉMENTAIRES',
    'RÉCAPITULATIF (HT, TVA, TTC)',
    'CONDITIONS (Validité, Paiement, Délais)',
    'ACCEPTATION (Bon pour accord, Signature client)'
  ],
  contract: [
    'INTITULÉ DU CONTRAT',
    'ENTRE LES SOUSSIGNÉS (Partie 1 et Partie 2 avec identification complète)',
    'PRÉAMBULE (Contexte, Objectifs)',
    'ARTICLE 1 - OBJET',
    'ARTICLE 2 - DURÉE ET ENTRÉE EN VIGUEUR',
    'ARTICLE 3 - OBLIGATIONS DES PARTIES',
    'ARTICLE 4 - CONDITIONS FINANCIÈRES',
    'ARTICLE 5 - CONFIDENTIALITÉ',
    'ARTICLE 6 - PROPRIÉTÉ INTELLECTUELLE',
    'ARTICLE 7 - RESPONSABILITÉ',
    'ARTICLE 8 - RÉSILIATION',
    'ARTICLE 9 - FORCE MAJEURE',
    'ARTICLE 10 - DISPOSITIONS GÉNÉRALES',
    'ARTICLE 11 - LOI APPLICABLE ET JURIDICTION',
    'SIGNATURES DES PARTIES'
  ],
  memo: [
    'EN-TÊTE NOTE DE SERVICE',
    'DE / À / DATE / OBJET',
    'CONTEXTE',
    'MESSAGE PRINCIPAL',
    'ACTIONS ATTENDUES',
    'DÉLAIS',
    'SIGNATURE'
  ],
  meeting_notes: [
    'EN-TÊTE (Intitulé réunion, Date, Heure, Lieu)',
    'PARTICIPANTS (Présents avec fonction, Excusés)',
    'ORDRE DU JOUR',
    'POINTS TRAITÉS (Synthèse par point)',
    'DÉCISIONS PRISES',
    'ACTIONS À MENER (Tableau: Action, Responsable, Échéance)',
    'PROCHAINE RÉUNION',
    'RÉDACTEUR'
  ],
  report: [
    'PAGE DE TITRE',
    'RÉSUMÉ EXÉCUTIF (1 page maximum)',
    'SOMMAIRE',
    'INTRODUCTION ET CONTEXTE',
    'MÉTHODOLOGIE',
    'CONSTATS ET ANALYSES',
    'RECOMMANDATIONS HIÉRARCHISÉES',
    'PLAN D\'ACTION',
    'CONCLUSION',
    'ANNEXES'
  ],
  proposal: [
    'PAGE DE GARDE',
    'EXECUTIVE SUMMARY',
    'COMPRÉHENSION DE VOS ENJEUX',
    'NOTRE APPROCHE ET CONVICTIONS',
    'MÉTHODOLOGIE PROPOSÉE',
    'PLANNING ET LIVRABLES',
    'ÉQUIPE PROJET',
    'INVESTISSEMENT',
    'RÉFÉRENCES CLIENTS',
    'PROCHAINES ÉTAPES'
  ],
  letter: [
    'ÉMETTEUR (En-tête)',
    'LIEU ET DATE',
    'DESTINATAIRE (Adresse complète)',
    'OBJET',
    'RÉFÉRENCES',
    'FORMULE D\'APPEL',
    'CORPS DE LA LETTRE',
    'FORMULE DE POLITESSE',
    'SIGNATURE',
    'PIÈCES JOINTES (le cas échéant)'
  ],
  email: [
    'OBJET (Clair et actionnable)',
    'SALUTATION',
    'ACCROCHE (Contexte en 1 phrase)',
    'CORPS DU MESSAGE',
    'DEMANDE / CALL TO ACTION',
    'FORMULE DE CONCLUSION',
    'SIGNATURE'
  ],
  procedure: [
    'EN-TÊTE (Titre, Référence, Version, Date)',
    'OBJET ET PÉRIMÈTRE',
    'DOCUMENTS DE RÉFÉRENCE',
    'DÉFINITIONS ET ABRÉVIATIONS',
    'RESPONSABILITÉS',
    'LOGIGRAMME / SYNOPTIQUE',
    'DESCRIPTION DÉTAILLÉE DES ÉTAPES',
    'ENREGISTREMENTS',
    'HISTORIQUE DES RÉVISIONS',
    'VALIDATION'
  ],
  specification: [
    'PAGE DE GARDE',
    'HISTORIQUE DES VERSIONS',
    'SOMMAIRE',
    'CONTEXTE ET OBJECTIFS',
    'PÉRIMÈTRE',
    'EXIGENCES FONCTIONNELLES',
    'EXIGENCES TECHNIQUES',
    'EXIGENCES DE SÉCURITÉ',
    'CONTRAINTES',
    'LIVRABLES ATTENDUS',
    'PLANNING',
    'CRITÈRES D\'ACCEPTATION',
    'ANNEXES'
  ],
  audit_report: [
    'PAGE DE TITRE',
    'INFORMATIONS GÉNÉRALES (Date, Périmètre, Auditeurs)',
    'RÉSUMÉ EXÉCUTIF',
    'MÉTHODOLOGIE D\'AUDIT',
    'CONSTATS (Conformités, Non-conformités, Observations)',
    'ANALYSE DES RISQUES',
    'RECOMMANDATIONS',
    'PLAN D\'ACTION CORRECTIF',
    'CONCLUSION',
    'ANNEXES (Preuves, Documents consultés)'
  ],
  policy: [
    'TITRE DE LA POLITIQUE',
    'OBJET',
    'CHAMP D\'APPLICATION',
    'DÉFINITIONS',
    'PRINCIPES DIRECTEURS',
    'RÈGLES ET DISPOSITIONS',
    'RESPONSABILITÉS',
    'CONTRÔLE ET SUIVI',
    'SANCTIONS',
    'ENTRÉE EN VIGUEUR',
    'VALIDATION'
  ],
  generic: [
    'TITRE',
    'INTRODUCTION',
    'CONTENU PRINCIPAL',
    'CONCLUSION'
  ]
};

// ============================================================================
// SENIOR PROMPT ENGINE
// ============================================================================

const FORBIDDEN_PATTERNS = [
  'Voici le document',
  'Voici le contenu',
  'Ce document présente',
  'Ce document décrit',
  'Ci-dessous vous trouverez',
  'N\'hésitez pas à',
  'Je reste à votre disposition',
  'Cordialement,', // Only at wrong place
  '[À compléter]',
  '[Insérer ici]',
  '[PLACEHOLDER]',
  '**', // Markdown bold
  '##', // Markdown headers
  '```', // Code blocks
  '---', // Horizontal rules
];

const VOCABULARY_BANKS: Record<DocumentCategory, string[]> = {
  purchase_order: [
    'articles commandés', 'conditions de livraison', 'franco de port', 'délai ferme',
    'bon pour accord', 'réception des marchandises', 'conformité à la commande',
    'paiement à réception', 'net à 30 jours', 'date limite de livraison'
  ],
  invoice: [
    'échéance de paiement', 'taux de TVA applicable', 'base hors taxes',
    'montant TTC', 'escompte pour paiement anticipé', 'pénalités de retard',
    'indemnité forfaitaire de recouvrement', 'conditions générales de vente'
  ],
  quote: [
    'validité de l\'offre', 'engagement ferme', 'conditions tarifaires',
    'exclusions', 'options complémentaires', 'modalités d\'acceptation',
    'réserve de propriété', 'conditions suspensives'
  ],
  contract: [
    'parties contractantes', 'obligations réciproques', 'entrée en vigueur',
    'tacite reconduction', 'clause résolutoire', 'force majeure',
    'juridiction compétente', 'droit applicable', 'bonne foi'
  ],
  memo: [
    'mesure effective', 'application immédiate', 'dispositions transitoires',
    'personnel concerné', 'entrée en vigueur', 'diffusion restreinte'
  ],
  meeting_notes: [
    'décision validée', 'action à mener', 'responsable désigné',
    'échéance fixée', 'point reporté', 'consensus atteint'
  ],
  report: [
    'constat majeur', 'tendance identifiée', 'facteur de risque',
    'levier d\'amélioration', 'recommandation prioritaire', 'indicateur clé'
  ],
  proposal: [
    'valeur ajoutée', 'retour sur investissement', 'différenciation',
    'expertise reconnue', 'méthodologie éprouvée', 'accompagnement dédié'
  ],
  letter: [
    'suite à notre entretien', 'comme convenu', 'je me permets de',
    'dans l\'attente de votre réponse', 'veuillez agréer'
  ],
  email: [
    'pour information', 'action requise', 'pour suite à donner',
    'urgent', 'confidentiel', 'à diffuser'
  ],
  procedure: [
    'étape obligatoire', 'point de contrôle', 'validation requise',
    'enregistrement obligatoire', 'dérogation exceptionnelle'
  ],
  specification: [
    'exigence fonctionnelle', 'contrainte technique', 'critère d\'acceptation',
    'périmètre exclus', 'livrable attendu'
  ],
  audit_report: [
    'non-conformité majeure', 'non-conformité mineure', 'observation',
    'point fort', 'axe d\'amélioration', 'action corrective'
  ],
  policy: [
    'disposition applicable', 'mesure obligatoire', 'sanction prévue',
    'dérogation possible', 'contrôle de conformité'
  ],
  generic: []
};

export function generateSeniorPrompt(
  category: DocumentCategory,
  context: DocumentContext
): { systemPrompt: string; userPrompt: string } {
  
  const sections = SECTION_TEMPLATES[category];
  const vocabulary = VOCABULARY_BANKS[category];
  
  const systemPrompt = `Tu es un DIRECTEUR SENIOR avec plus de 30 ans d'expérience dans la rédaction de documents professionnels pour des entreprises du CAC40 et des cabinets de conseil internationaux. Tu produis des documents de qualité IRRÉPROCHABLE, immédiatement utilisables en contexte professionnel réel.

═══════════════════════════════════════════════════════════════
RÈGLES ABSOLUES - TOUTE VIOLATION EST UN ÉCHEC CRITIQUE
═══════════════════════════════════════════════════════════════

1. JAMAIS de crochets [] ni de placeholders de type [À compléter] ou [Insérer]
2. JAMAIS de syntaxe markdown: #, ##, **, *, \`\`\`, ---, ___
3. JAMAIS de phrases d'introduction IA ("Voici le document", "Ce document présente")
4. JAMAIS de formules de conclusion artificielles ("N'hésitez pas à me contacter")
5. JAMAIS de structure visible de template ou de squelette
6. JAMAIS de données manifestement fausses (ex: SIRET 123 456 789)

═══════════════════════════════════════════════════════════════
QUALITÉ "BOARD-READY" EXIGÉE
═══════════════════════════════════════════════════════════════

• Le document doit être INDISCERNABLE d'un travail humain expert
• Chaque phrase apporte une VALEUR AJOUTÉE réelle
• Vocabulaire RICHE et PRÉCIS adapté au contexte métier français
• Si une information n'est pas fournie: INVENTER une donnée crédible OU l'omettre
• Mise en forme PROPRE avec sections CLAIREMENT délimitées
• Ton PROFESSIONNEL, ni trop formel ni trop familier

═══════════════════════════════════════════════════════════════
FORMAT TABLEAUX (pour documents transactionnels)
═══════════════════════════════════════════════════════════════

Pour les bons de commande, factures, devis, utilise OBLIGATOIREMENT le format:
| Colonne 1 | Colonne 2 | Colonne 3 |
| Donnée 1  | Donnée 2  | Donnée 3  |

Avec des données RÉALISTES et COHÉRENTES entre elles.

═══════════════════════════════════════════════════════════════
STRUCTURE OBLIGATOIRE POUR CE TYPE DE DOCUMENT
═══════════════════════════════════════════════════════════════

${sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

═══════════════════════════════════════════════════════════════
VOCABULAIRE MÉTIER RECOMMANDÉ
═══════════════════════════════════════════════════════════════

${vocabulary.length > 0 ? vocabulary.join(' • ') : 'Vocabulaire professionnel standard adapté au contexte.'}

═══════════════════════════════════════════════════════════════
DONNÉES À GÉNÉRER (si non fournies)
═══════════════════════════════════════════════════════════════

• Référence document: Format professionnel avec année (ex: BC-2024-0847)
• Date: Utiliser la date du jour en format français complet
• Numéros SIRET: 14 chiffres cohérents (5 groupes: XXX XXX XXX XXXXX)
• TVA Intracommunautaire: FR + 2 chiffres + SIREN
• Montants: Réalistes avec séparateurs de milliers et 2 décimales`;

  const userPrompt = `DOCUMENT À RÉDIGER: ${category.toUpperCase().replace('_', ' ')}

TITRE: ${context.title}

${context.companyName ? `SOCIÉTÉ: ${context.companyName}` : ''}
${context.authorName ? `AUTEUR: ${context.authorName}` : ''}
${context.department ? `DÉPARTEMENT: ${context.department}` : ''}

${context.userPrompt ? `INSTRUCTIONS SPÉCIFIQUES:\n${context.userPrompt}` : 'Génère un document professionnel complet avec des données réalistes.'}

${context.variables && Object.keys(context.variables).length > 0 ? 
  `VARIABLES FOURNIES:\n${Object.entries(context.variables).map(([k, v]) => `• ${k}: ${v}`).join('\n')}` : ''}

══════════════════════════════════════
GÉNÈRE LE DOCUMENT COMPLET, QUALITÉ SENIOR IRRÉPROCHABLE.
══════════════════════════════════════`;

  return { systemPrompt, userPrompt };
}

// ============================================================================
// CONTENT ENRICHER
// ============================================================================

export function generateEnrichedData(category: DocumentCategory): EnrichedData {
  const now = new Date();
  const year = now.getFullYear();
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  
  // Generate reference based on category
  const prefixes: Record<DocumentCategory, string> = {
    purchase_order: 'BC',
    invoice: 'FA',
    quote: 'DEV',
    contract: 'CTR',
    memo: 'NS',
    meeting_notes: 'CR',
    report: 'RAP',
    proposal: 'PROP',
    letter: 'COU',
    email: 'MSG',
    procedure: 'PROC',
    specification: 'CDC',
    audit_report: 'AUD',
    policy: 'POL',
    generic: 'DOC'
  };
  
  const reference = `${prefixes[category]}-${year}-${String(randomNum).padStart(4, '0')}`;
  
  // Generate realistic SIRET
  const sirenBase = Math.floor(Math.random() * 900000000) + 100000000;
  const siretNic = Math.floor(Math.random() * 90000) + 10000;
  const siret = `${String(sirenBase).slice(0, 3)} ${String(sirenBase).slice(3, 6)} ${String(sirenBase).slice(6, 9)} ${String(siretNic)}`;
  const tvaIntra = `FR ${String(Math.floor(Math.random() * 90) + 10)} ${String(sirenBase)}`;
  const rcs = `Paris B ${String(sirenBase)}`;
  
  // Generate amounts for transactional documents
  let amounts: EnrichedData['amounts'] | undefined;
  if (['purchase_order', 'invoice', 'quote'].includes(category)) {
    const subtotal = Math.floor(Math.random() * 50000) + 1000;
    const tva = subtotal * 0.2;
    const total = subtotal + tva;
    
    amounts = {
      subtotalHT: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(subtotal),
      tva: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(tva),
      totalTTC: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(total)
    };
  }
  
  return {
    reference,
    dateFormatted: now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    fiscalInfo: {
      siret,
      tvaIntra,
      rcs
    },
    amounts
  };
}

// ============================================================================
// QUALITY VALIDATOR
// ============================================================================

export function validateContent(content: string, category: DocumentCategory): ValidationResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let cleaned = content;
  let score = 100;
  
  // Check for forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (regex.test(cleaned)) {
      issues.push(`Pattern interdit détecté: "${pattern}"`);
      score -= 10;
      cleaned = cleaned.replace(regex, '');
    }
  }
  
  // Check for markdown artifacts
  const markdownPatterns = [
    { pattern: /```[\s\S]*?```/g, name: 'blocs de code' },
    { pattern: /^#{1,6}\s+/gm, name: 'headers markdown' },
    { pattern: /\*\*([^*]+)\*\*/g, name: 'gras markdown', replace: '$1' },
    { pattern: /\*([^*]+)\*/g, name: 'italique markdown', replace: '$1' },
    { pattern: /__([^_]+)__/g, name: 'gras underscore', replace: '$1' },
    { pattern: /_([^_]+)_/g, name: 'italique underscore', replace: '$1' },
    { pattern: /^---+$/gm, name: 'lignes horizontales' },
    { pattern: /^___+$/gm, name: 'lignes horizontales' },
    { pattern: /^\*\*\*+$/gm, name: 'lignes horizontales' },
  ];
  
  for (const { pattern, name, replace } of markdownPatterns) {
    if (pattern.test(cleaned)) {
      issues.push(`Artefact markdown: ${name}`);
      score -= 5;
      cleaned = cleaned.replace(pattern, replace || '');
    }
  }
  
  // Check for brackets/placeholders
  const bracketPatterns = [
    { pattern: /\[[^\]]*\]/g, name: 'crochets/placeholders' },
    { pattern: /\{[^}]*\}/g, name: 'accolades' },
    { pattern: /<[^>]*>/g, name: 'chevrons (hors HTML)' },
  ];
  
  for (const { pattern, name } of bracketPatterns) {
    const matches = cleaned.match(pattern);
    if (matches) {
      // Filter out valid table format
      const invalidMatches = matches.filter(m => !m.includes('|'));
      if (invalidMatches.length > 0) {
        issues.push(`${name} détectés: ${invalidMatches.slice(0, 3).join(', ')}`);
        score -= 15;
      }
    }
  }
  
  // Check content length
  if (cleaned.length < 200) {
    issues.push('Contenu trop court (< 200 caractères)');
    score -= 20;
    suggestions.push('Enrichir le contenu avec plus de détails');
  }
  
  // Check for section structure
  const sections = SECTION_TEMPLATES[category];
  if (sections.length > 2) {
    const headingPattern = /^[A-ZÉÈÀÙÂÊÎÔÛÄËÏÖÜ][A-ZÉÈÀÙÂÊÎÔÛÄËÏÖÜ\s\-\d]{3,}$/gm;
    const headings = cleaned.match(headingPattern) || [];
    if (headings.length < Math.min(sections.length / 2, 3)) {
      suggestions.push('Ajouter des titres de section plus visibles');
      score -= 5;
    }
  }
  
  // Clean up extra whitespace
  cleaned = cleaned
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/[ \t]+$/gm, '')
    .trim();
  
  return {
    isValid: score >= 60,
    score: Math.max(0, score),
    issues,
    suggestions,
    cleanedContent: cleaned
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const SeniorDocumentIntelligence = {
  classify: classifyDocument,
  generatePrompts: generateSeniorPrompt,
  enrich: generateEnrichedData,
  validate: validateContent,
  getSections: (category: DocumentCategory) => SECTION_TEMPLATES[category],
  getVocabulary: (category: DocumentCategory) => VOCABULARY_BANKS[category],
};

export default SeniorDocumentIntelligence;
