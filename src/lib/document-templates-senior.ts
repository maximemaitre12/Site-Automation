/**
 * Templates UX Senior pour documents professionnels
 * Logique intelligente de détection et d'enrichissement automatique
 */

export type DocumentCategory = 
  | 'purchase_order'      // Bon de commande
  | 'invoice'             // Facture
  | 'quote'               // Devis
  | 'contract'            // Contrat
  | 'memo'                // Note de service
  | 'meeting_notes'       // Compte-rendu
  | 'letter'              // Lettre formelle
  | 'report'              // Rapport
  | 'proposal'            // Proposition commerciale
  | 'email'               // Email professionnel
  | 'generic';            // Document générique

export interface DocumentTemplate {
  category: DocumentCategory;
  displayName: string;
  requiredFields: string[];
  optionalFields: string[];
  structure: string[];
  systemPrompt: string;
  exampleOutput?: string;
}

// Détection automatique du type de document basée sur le titre/contenu
export function detectDocumentCategory(title: string, content?: string): DocumentCategory {
  const titleLower = title.toLowerCase();
  const contentLower = (content || '').toLowerCase();
  const combined = `${titleLower} ${contentLower}`;

  // Bon de commande
  if (
    combined.includes('bon de commande') ||
    combined.includes('order') ||
    combined.includes('commande fournisseur') ||
    /bc[-\s]?\d+/i.test(combined) ||
    combined.includes('purchase order')
  ) {
    return 'purchase_order';
  }

  // Facture
  if (
    combined.includes('facture') ||
    combined.includes('invoice') ||
    /fact[-\s]?\d+/i.test(combined)
  ) {
    return 'invoice';
  }

  // Devis
  if (
    combined.includes('devis') ||
    combined.includes('quotation') ||
    combined.includes('offre commerciale') ||
    combined.includes('proposition tarifaire')
  ) {
    return 'quote';
  }

  // Contrat
  if (
    combined.includes('contrat') ||
    combined.includes('accord') ||
    combined.includes('convention') ||
    combined.includes('contract') ||
    combined.includes('agreement')
  ) {
    return 'contract';
  }

  // Note de service / Mémo
  if (
    combined.includes('note de service') ||
    combined.includes('mémo') ||
    combined.includes('memo') ||
    combined.includes('circulaire')
  ) {
    return 'memo';
  }

  // Compte-rendu
  if (
    combined.includes('compte-rendu') ||
    combined.includes('compte rendu') ||
    combined.includes('procès-verbal') ||
    combined.includes('pv de réunion') ||
    combined.includes('meeting notes')
  ) {
    return 'meeting_notes';
  }

  // Rapport
  if (
    combined.includes('rapport') ||
    combined.includes('report') ||
    combined.includes('analyse') ||
    combined.includes('étude')
  ) {
    return 'report';
  }

  // Proposition commerciale
  if (
    combined.includes('proposition') ||
    combined.includes('proposal') ||
    combined.includes('offre de service')
  ) {
    return 'proposal';
  }

  // Lettre formelle
  if (
    combined.includes('lettre') ||
    combined.includes('courrier') ||
    combined.includes('letter')
  ) {
    return 'letter';
  }

  // Email
  if (
    combined.includes('email') ||
    combined.includes('mail') ||
    combined.includes('courriel') ||
    combined.includes('message')
  ) {
    return 'email';
  }

  return 'generic';
}

// Templates spécialisés pour chaque type de document
export const DOCUMENT_TEMPLATES: Record<DocumentCategory, DocumentTemplate> = {
  purchase_order: {
    category: 'purchase_order',
    displayName: 'Bon de commande',
    requiredFields: ['supplier', 'items', 'delivery_date'],
    optionalFields: ['payment_terms', 'shipping_address', 'special_instructions'],
    structure: [
      'EN-TÊTE (Logo, Référence BC, Date)',
      'INFORMATIONS FOURNISSEUR',
      'INFORMATIONS DE LIVRAISON',
      'TABLEAU DES ARTICLES (Réf, Désignation, Qté, PU HT, Total HT)',
      'RÉCAPITULATIF (Sous-total, TVA, Total TTC)',
      'CONDITIONS (Paiement, Livraison)',
      'SIGNATURE ET CACHET'
    ],
    systemPrompt: `Tu es un Directeur Achats avec 25 ans d'expérience dans des groupes du CAC40. Tu rédiges des bons de commande impeccables.

STRUCTURE OBLIGATOIRE:
1. EN-TÊTE avec référence BC (format: BC-AAAA-XXXX), date, et coordonnées
2. Section FOURNISSEUR avec raison sociale, adresse, SIRET si disponible
3. Section LIVRAISON avec adresse précise et date attendue
4. TABLEAU DES ARTICLES structuré:
   - Numéro de ligne
   - Référence article
   - Désignation complète
   - Quantité et unité
   - Prix unitaire HT
   - Montant ligne HT
5. RÉCAPITULATIF avec sous-total HT, TVA (20%), et Total TTC
6. CONDITIONS: délai de paiement, incoterm si applicable
7. Zone SIGNATURE avec nom du signataire et fonction

STYLE:
- Numérotation BC cohérente (BC-2024-0XXX)
- Montants alignés à droite avec séparateurs de milliers
- Vocabulaire précis: "Désignation", "Quantité commandée", "Prix unitaire HT"
- Formule de fin: "Bon pour accord" avec espace signature`
  },

  invoice: {
    category: 'invoice',
    displayName: 'Facture',
    requiredFields: ['client', 'items', 'invoice_number'],
    optionalFields: ['due_date', 'payment_method', 'bank_details'],
    structure: [
      'EN-TÊTE (Logo, FACTURE, Numéro, Date)',
      'ÉMETTEUR (Société, SIRET, TVA intra)',
      'DESTINATAIRE (Client, Adresse)',
      'DÉTAIL DES PRESTATIONS/PRODUITS',
      'TOTAUX (HT, TVA, TTC)',
      'MENTIONS LÉGALES',
      'CONDITIONS DE RÈGLEMENT'
    ],
    systemPrompt: `Tu es un DAF (Directeur Administratif et Financier) expérimenté. Tu produis des factures conformes aux obligations légales françaises.

MENTIONS OBLIGATOIRES:
- Numéro de facture unique et séquentiel (FA-AAAA-XXXXX)
- Date d'émission et date d'échéance
- Identité complète de l'émetteur (SIRET, n° TVA intracommunautaire)
- Identité du client
- Détail ligne par ligne: désignation, quantité, prix unitaire HT, taux TVA, montant HT
- Total HT, montant TVA par taux, Total TTC
- Conditions de règlement et pénalités de retard
- Indemnité forfaitaire de recouvrement (40€)

FORMAT PROFESSIONNEL:
- Tableau structuré pour les lignes
- Montants avec 2 décimales
- Références claires
- Espace pour mentions manuscrites si nécessaire`
  },

  quote: {
    category: 'quote',
    displayName: 'Devis',
    requiredFields: ['client', 'description', 'amount'],
    optionalFields: ['validity_period', 'terms', 'options'],
    structure: [
      'EN-TÊTE avec numéro de devis',
      'PRÉSENTATION DU CLIENT',
      'CONTEXTE ET BESOINS',
      'NOTRE PROPOSITION',
      'DÉTAIL CHIFFRÉ',
      'CONDITIONS ET VALIDITÉ',
      'SIGNATURE CLIENT'
    ],
    systemPrompt: `Tu es un Directeur Commercial senior. Tu rédiges des devis percutants qui convertissent.

APPROCHE:
- Reformuler le besoin client pour montrer la compréhension
- Présenter la solution, pas juste des prix
- Structurer en options si pertinent
- Inclure les conditions commerciales

STRUCTURE:
1. Référence devis (DEV-AAAA-XXXX), date, validité (généralement 30 jours)
2. Coordonnées émetteur et destinataire
3. Objet clair et synthétique
4. Détail de l'offre avec justification de la valeur
5. Tableau chiffré: prestations, quantités, tarifs
6. Total HT, TVA, TTC
7. Conditions: paiement, délais, exclusions
8. Zone "Bon pour accord" avec date et signature`
  },

  contract: {
    category: 'contract',
    displayName: 'Contrat',
    requiredFields: ['parties', 'object', 'duration'],
    optionalFields: ['confidentiality', 'termination', 'jurisdiction'],
    structure: [
      'PRÉAMBULE',
      'ARTICLE 1 - OBJET',
      'ARTICLE 2 - DURÉE',
      'ARTICLE 3 - OBLIGATIONS DES PARTIES',
      'ARTICLE 4 - CONDITIONS FINANCIÈRES',
      'ARTICLE 5 - CONFIDENTIALITÉ',
      'ARTICLE 6 - RÉSILIATION',
      'ARTICLE 7 - DROIT APPLICABLE',
      'SIGNATURES'
    ],
    systemPrompt: `Tu es un juriste d'affaires senior avec 20 ans de pratique en droit des contrats. Tu rédiges des contrats équilibrés et sécurisés.

FORMAT JURIDIQUE:
- Identification précise des parties (dénomination, forme juridique, siège, RCS, représentant)
- Articles numérotés avec titres clairs
- Définitions des termes clés si nécessaire
- Clauses équilibrées protégeant les deux parties
- Clause attributive de juridiction (Tribunaux de Paris par défaut)
- Loi applicable: droit français

STYLE:
- Vocabulaire juridique précis mais accessible
- Phrases conditionnelles claires ("En cas de..., alors...")
- Éviter les ambiguïtés
- Prévoir les cas de force majeure`
  },

  memo: {
    category: 'memo',
    displayName: 'Note de service',
    requiredFields: ['subject', 'recipients', 'content'],
    optionalFields: ['deadline', 'action_required'],
    structure: [
      'EN-TÊTE (NOTE DE SERVICE)',
      'DE / À / DATE / OBJET',
      'CORPS DU MESSAGE',
      'ACTIONS ATTENDUES',
      'SIGNATURE'
    ],
    systemPrompt: `Tu es un cadre dirigeant qui communique efficacement avec ses équipes.

FORMAT STANDARD:
NOTE DE SERVICE n° XX/2024

De: [Émetteur, Fonction]
À: [Destinataires]
Date: [Date]
Objet: [Sujet concis]

[Corps du message - direct et actionnable]

[Signature]

STYLE:
- Concis et direct
- Actions clairement identifiées
- Délais explicites si applicable
- Ton professionnel mais accessible`
  },

  meeting_notes: {
    category: 'meeting_notes',
    displayName: 'Compte-rendu de réunion',
    requiredFields: ['date', 'participants', 'agenda'],
    optionalFields: ['decisions', 'actions', 'next_meeting'],
    structure: [
      'EN-TÊTE (Date, Lieu, Durée)',
      'PARTICIPANTS (Présents, Excusés)',
      'ORDRE DU JOUR',
      'POINTS ABORDÉS',
      'DÉCISIONS PRISES',
      'ACTIONS À MENER',
      'PROCHAINE RÉUNION'
    ],
    systemPrompt: `Tu es un cadre expérimenté qui rédige des comptes-rendus exploitables.

STRUCTURE:
1. Métadonnées: date, heure, lieu, durée effective
2. Participants: liste des présents avec fonction, excusés
3. Ordre du jour rappelé
4. Pour chaque point:
   - Synthèse des échanges (pas de verbatim)
   - Décisions prises
   - Actions: QUI fait QUOI pour QUAND
5. Date de prochaine réunion si fixée

STYLE:
- Bullet points pour les actions
- Responsables nommés explicitement
- Délais en dates, pas en "dans 2 semaines"
- Ton neutre et factuel`
  },

  report: {
    category: 'report',
    displayName: 'Rapport',
    requiredFields: ['title', 'executive_summary', 'content'],
    optionalFields: ['recommendations', 'appendices', 'methodology'],
    structure: [
      'PAGE DE TITRE',
      'SOMMAIRE',
      'RÉSUMÉ EXÉCUTIF',
      'INTRODUCTION',
      'MÉTHODOLOGIE',
      'ANALYSE',
      'RECOMMANDATIONS',
      'CONCLUSION',
      'ANNEXES'
    ],
    systemPrompt: `Tu es un consultant senior dans un cabinet de conseil de premier plan (McKinsey, BCG, Bain). Tu produis des rapports de qualité "board-ready".

STRUCTURE CONSULTING:
1. Résumé exécutif (1 page max - les décideurs lisent ça en premier)
2. Contexte et enjeux
3. Méthodologie employée
4. Constats clés (facts-based)
5. Analyses et insights
6. Recommandations hiérarchisées (quick wins vs transformations)
7. Prochaines étapes et planning indicatif

STYLE:
- "So what?" pour chaque point
- Données chiffrées pour étayer
- Visuels conceptuels décrits si pertinent
- Langage assertif mais nuancé`
  },

  proposal: {
    category: 'proposal',
    displayName: 'Proposition commerciale',
    requiredFields: ['client', 'offer', 'pricing'],
    optionalFields: ['timeline', 'team', 'references'],
    structure: [
      'PAGE DE GARDE',
      'SYNTHÈSE DE NOTRE COMPRÉHENSION',
      'NOTRE APPROCHE',
      'LIVRABLES ET PLANNING',
      'ÉQUIPE PROPOSÉE',
      'INVESTISSEMENT',
      'RÉFÉRENCES',
      'PROCHAINES ÉTAPES'
    ],
    systemPrompt: `Tu es un Partner dans un cabinet de conseil ou une ESN de premier rang. Tu rédiges des propositions qui gagnent.

APPROCHE "CHALLENGER SALE":
1. Reformuler les enjeux client mieux qu'il ne les a exprimés
2. Apporter un insight ou une perspective nouvelle
3. Proposer une solution adaptée, pas générique
4. Quantifier la valeur créée (ROI, gains, risques évités)

STRUCTURE:
1. Executive summary percutant (pourquoi nous, pourquoi maintenant)
2. Compréhension du contexte et des enjeux
3. Notre conviction et approche différenciante
4. Détail de l'intervention: phases, livrables, planning
5. L'équipe: profils seniors, expertise pertinente
6. Investissement: transparent, options si pertinent
7. Références clients similaires
8. Call to action clair`
  },

  letter: {
    category: 'letter',
    displayName: 'Lettre formelle',
    requiredFields: ['recipient', 'subject', 'content'],
    optionalFields: ['references', 'attachments'],
    structure: [
      'EXPÉDITEUR',
      'LIEU ET DATE',
      'DESTINATAIRE',
      'OBJET / RÉFÉRENCES',
      'FORMULE D\'APPEL',
      'CORPS DE LA LETTRE',
      'FORMULE DE POLITESSE',
      'SIGNATURE'
    ],
    systemPrompt: `Tu es un cadre supérieur maîtrisant parfaitement les codes de la correspondance professionnelle française.

FORMAT:
[Coordonnées émetteur]

[Lieu], le [date en toutes lettres]

[Destinataire]
[Adresse]

Objet: [Concis et précis]
Réf: [Si applicable]

[Appel: "Madame la Directrice," / "Monsieur le Président," etc.]

[Corps - 2 à 4 paragraphes max]

[Formule de politesse adaptée au contexte]

[Signature]

FORMULES:
- Supérieur: "Je vous prie d'agréer, [Titre], l'expression de ma haute considération."
- Égal: "Je vous prie de croire, [Titre], à l'assurance de mes salutations distinguées."
- Client: "Dans l'attente de votre retour, je vous prie d'agréer..."`
  },

  email: {
    category: 'email',
    displayName: 'Email professionnel',
    requiredFields: ['recipient', 'subject', 'content'],
    optionalFields: ['cc', 'attachments'],
    structure: [
      'OBJET (clair et actionnable)',
      'SALUTATION',
      'CONTEXTE (1 phrase)',
      'MESSAGE PRINCIPAL',
      'CALL TO ACTION',
      'SIGNATURE'
    ],
    systemPrompt: `Tu es un professionnel qui communique efficacement par email.

RÈGLES D'OR:
- Objet explicite avec action attendue si applicable
- Un email = un sujet
- Structure pyramidale: conclusion/demande d'abord
- Corps: maximum 5-7 lignes idéalement
- Action claire: que doit faire le destinataire?

FORMAT:
[Bonjour/Cher(e) Prénom,]

[1 phrase de contexte si nécessaire]

[Le cœur du message - direct]

[Action attendue + délai si applicable]

[Cordialement/Bien à vous,]
[Signature]`
  },

  generic: {
    category: 'generic',
    displayName: 'Document',
    requiredFields: ['title', 'content'],
    optionalFields: [],
    structure: ['TITRE', 'CONTENU'],
    systemPrompt: `Tu es un cadre dirigeant avec 30 ans d'expérience. Tu rédiges des documents professionnels impeccables.

RÈGLES ABSOLUES:
- Aucun artefact markdown
- Aucun placeholder ou crochet
- Style naturel et fluide
- Vocabulaire riche et précis
- Structure claire et logique`
  }
};

// Génère le prompt système enrichi pour un type de document
export function getSeniorSystemPrompt(category: DocumentCategory): string {
  const template = DOCUMENT_TEMPLATES[category];
  
  const basePrompt = `Tu es un expert senior avec plus de 25 ans d'expérience dans la rédaction de documents professionnels en entreprise. Tu produis des documents de qualité "board-ready" utilisables immédiatement.

INTERDICTIONS ABSOLUES (violation = échec total):
1. JAMAIS de crochets [] ou placeholders [Insérer ici]
2. JAMAIS de markdown: #, ##, **, *, -, ---, \`\`\`
3. JAMAIS de phrases meta ("Voici le document", "Ce document présente")
4. JAMAIS de structure robotique ou template visible
5. JAMAIS de formulations typiques d'IA générative
6. JAMAIS de notes ou commentaires internes

QUALITÉ EXIGÉE:
- Le document doit être indiscernable d'un travail humain expert
- Chaque phrase apporte de la valeur
- Vocabulaire riche, précis, adapté au contexte métier français
- Si une information manque, l'inventer de façon crédible OU l'omettre
- Mise en forme propre avec sections claires

TYPE DE DOCUMENT: ${template.displayName}

STRUCTURE ATTENDUE:
${template.structure.map((s, i) => `${i + 1}. ${s}`).join('\n')}

${template.systemPrompt}`;

  return basePrompt;
}

// Génère le prompt utilisateur enrichi
export function getSeniorUserPrompt(
  title: string,
  category: DocumentCategory,
  userInstructions?: string,
  variables?: Record<string, string>
): string {
  const template = DOCUMENT_TEMPLATES[category];
  
  let prompt = `Rédige un ${template.displayName} professionnel.

TITRE: ${title}

`;

  // Ajouter les variables si présentes
  if (variables && Object.keys(variables).length > 0) {
    prompt += `INFORMATIONS FOURNIES:\n`;
    for (const [key, value] of Object.entries(variables)) {
      if (value && value.trim()) {
        prompt += `- ${key}: ${value}\n`;
      }
    }
    prompt += '\n';
  }

  if (userInstructions) {
    prompt += `INSTRUCTIONS SPÉCIFIQUES:\n${userInstructions}\n\n`;
  }

  prompt += `Génère le document complet, prêt à être utilisé tel quel en entreprise. Qualité senior exigée.`;

  return prompt;
}

// Valide et nettoie le contenu généré
export function validateAndCleanContent(content: string, category: DocumentCategory): {
  isValid: boolean;
  cleanedContent: string;
  issues: string[];
} {
  const issues: string[] = [];
  let cleaned = content;

  // Détection des artefacts interdits
  const artifacts = [
    { pattern: /\[[^\]]+\]/g, name: 'crochets/placeholders' },
    { pattern: /```[\s\S]*?```/g, name: 'blocs de code markdown' },
    { pattern: /^#{1,6}\s+/gm, name: 'headers markdown' },
    { pattern: /\*\*[^*]+\*\*/g, name: 'gras markdown' },
    { pattern: /^---+$/gm, name: 'lignes horizontales markdown' },
    { pattern: /^Voici le document/im, name: 'phrase intro IA' },
    { pattern: /^Ce document présente/im, name: 'phrase intro IA' },
  ];

  for (const artifact of artifacts) {
    if (artifact.pattern.test(cleaned)) {
      issues.push(`Artefact détecté: ${artifact.name}`);
    }
    cleaned = cleaned.replace(artifact.pattern, '');
  }

  // Nettoyage final
  cleaned = cleaned
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Vérification de la longueur minimale
  if (cleaned.length < 100) {
    issues.push('Contenu trop court (< 100 caractères)');
  }

  return {
    isValid: issues.length === 0,
    cleanedContent: cleaned,
    issues
  };
}

// Export pour utilisation dans les edge functions
export const DocumentTemplates = {
  detect: detectDocumentCategory,
  getSystemPrompt: getSeniorSystemPrompt,
  getUserPrompt: getSeniorUserPrompt,
  validate: validateAndCleanContent,
  templates: DOCUMENT_TEMPLATES
};
